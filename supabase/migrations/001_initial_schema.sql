-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Users table (extends Supabase auth.users)
create table if not exists public.users (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text,
  phone text,
  avatar_url text,
  role text default 'patient' check (role in ('patient', 'therapist', 'clinic', 'admin')),
  is_subscriber boolean default false,
  subscription_tier text check (subscription_tier in ('free', 'beyond_plus')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Therapists table
create table if not exists public.therapists (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users on delete cascade not null,
  sanity_id text,
  license_number text,
  bank_account text,
  is_approved boolean default false,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Services table (therapist-specific pricing for Sanity services)
create table if not exists public.services (
  id uuid primary key default uuid_generate_v4(),
  sanity_id text not null,
  therapist_id uuid references public.therapists on delete cascade not null,
  price decimal not null,
  duration_minutes integer not null default 60,
  service_type text default 'both' check (service_type in ('online', 'physical', 'both')),
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Therapist availability (weekly schedule)
create table if not exists public.availability (
  id uuid primary key default uuid_generate_v4(),
  therapist_id uuid references public.therapists on delete cascade not null,
  day_of_week integer not null check (day_of_week >= 0 and day_of_week <= 6),
  start_time time not null,
  end_time time not null,
  is_active boolean default true,
  unique(therapist_id, day_of_week)
);

-- Blocked time slots
create table if not exists public.blocked_slots (
  id uuid primary key default uuid_generate_v4(),
  therapist_id uuid references public.therapists on delete cascade not null,
  start_time timestamptz not null,
  end_time timestamptz not null,
  reason text,
  created_at timestamptz default now()
);

-- Appointments table
create table if not exists public.appointments (
  id uuid primary key default uuid_generate_v4(),
  patient_id uuid references public.users on delete set null,
  therapist_id uuid references public.therapists on delete set null not null,
  service_id uuid references public.services on delete set null not null,
  start_time timestamptz not null,
  end_time timestamptz not null,
  status text default 'pending' check (status in ('pending', 'confirmed', 'completed', 'cancelled', 'no_show')),
  meeting_url text,
  notes text,
  cancellation_reason text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Orders/Payments table
create table if not exists public.orders (
  id uuid primary key default uuid_generate_v4(),
  appointment_id uuid references public.appointments on delete set null,
  patient_id uuid references public.users on delete set null not null,
  therapist_id uuid references public.therapists on delete set null not null,
  amount decimal not null,
  currency text default 'AED',
  stripe_payment_intent_id text,
  status text default 'pending' check (status in ('pending', 'paid', 'refunded', 'failed')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Partners table (gyms, restaurants with discounts)
create table if not exists public.partners (
  id uuid primary key default uuid_generate_v4(),
  sanity_id text not null unique,
  discount_percentage integer default 10,
  discount_code_prefix text not null,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Redemption logs (partner discount usage)
create table if not exists public.redemptions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users on delete cascade not null,
  partner_id uuid references public.partners on delete cascade not null,
  code text not null,
  redeemed_at timestamptz,
  expires_at timestamptz not null,
  created_at timestamptz default now()
);

-- Wellness logs (daily check-in scores)
create table if not exists public.wellness_logs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users on delete cascade not null,
  score integer not null check (score >= 0 and score <= 100),
  answers jsonb not null,
  category text not null,
  logged_at timestamptz default now()
);

-- Patient notes (therapist notes on patients)
create table if not exists public.patient_notes (
  id uuid primary key default uuid_generate_v4(),
  therapist_id uuid references public.therapists on delete cascade not null,
  patient_id uuid references public.users on delete cascade not null,
  appointment_id uuid references public.appointments on delete set null,
  content text not null,
  is_private boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable Row Level Security
alter table public.users enable row level security;
alter table public.therapists enable row level security;
alter table public.services enable row level security;
alter table public.availability enable row level security;
alter table public.blocked_slots enable row level security;
alter table public.appointments enable row level security;
alter table public.orders enable row level security;
alter table public.partners enable row level security;
alter table public.redemptions enable row level security;
alter table public.wellness_logs enable row level security;
alter table public.patient_notes enable row level security;

-- RLS Policies

-- Users: Users can read their own data, admins can read all
create policy "Users can view own profile" on public.users
  for select using (auth.uid() = id);

create policy "Users can update own profile" on public.users
  for update using (auth.uid() = id);

-- Therapists: Public can view approved therapists
create policy "Anyone can view approved therapists" on public.therapists
  for select using (is_approved = true and is_active = true);

create policy "Therapists can update own record" on public.therapists
  for update using (user_id = auth.uid());

-- Services: Public can view active services
create policy "Anyone can view active services" on public.services
  for select using (is_active = true);

create policy "Therapists can manage own services" on public.services
  for all using (
    therapist_id in (select id from public.therapists where user_id = auth.uid())
  );

-- Appointments: Users can view their own appointments
create policy "Patients can view own appointments" on public.appointments
  for select using (patient_id = auth.uid());

create policy "Therapists can view their appointments" on public.appointments
  for select using (
    therapist_id in (select id from public.therapists where user_id = auth.uid())
  );

-- Wellness logs: Users can manage their own logs
create policy "Users can manage own wellness logs" on public.wellness_logs
  for all using (user_id = auth.uid());

-- Partners: Anyone can view active partners
create policy "Anyone can view active partners" on public.partners
  for select using (is_active = true);

-- Redemptions: Users can view their own redemptions
create policy "Users can view own redemptions" on public.redemptions
  for select using (user_id = auth.uid());

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user signup
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Function to update updated_at timestamp
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Add updated_at triggers
create trigger update_users_updated_at before update on public.users
  for each row execute function public.update_updated_at();

create trigger update_therapists_updated_at before update on public.therapists
  for each row execute function public.update_updated_at();

create trigger update_services_updated_at before update on public.services
  for each row execute function public.update_updated_at();

create trigger update_appointments_updated_at before update on public.appointments
  for each row execute function public.update_updated_at();

create trigger update_orders_updated_at before update on public.orders
  for each row execute function public.update_updated_at();

create trigger update_partners_updated_at before update on public.partners
  for each row execute function public.update_updated_at();

create trigger update_patient_notes_updated_at before update on public.patient_notes
  for each row execute function public.update_updated_at();
