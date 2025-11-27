# Bold & Beyond - Wellness Platform

A comprehensive wellness platform built with Next.js 14, Supabase, Sanity CMS, and Capacitor for native mobile apps.

## Tech Stack

- **Frontend**: Next.js 14 (App Router) with TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **Database & Auth**: Supabase
- **CMS**: Sanity
- **Payments**: Stripe
- **Mobile**: Capacitor (iOS/Android)

## Project Structure

```
/bold-and-beyond
├── /app
│   ├── /(explore)         # Public marketing pages (SEO)
│   ├── /(platform)        # Client app (auth required)
│   ├── /portal            # Therapist/Clinic dashboard
│   └── /admin             # Super admin dashboard
├── /components
│   ├── /ui                # Reusable UI components
│   └── /layout            # Layout components
├── /lib
│   ├── supabase.ts        # Supabase client
│   ├── sanity.ts          # Sanity client & queries
│   └── availability.ts    # Booking logic
└── /types                 # TypeScript types
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm
- Supabase account
- Sanity account
- Stripe account

### Installation

1. Clone the repository and install dependencies:

```bash
npm install
```

2. Copy the environment file and fill in your credentials:

```bash
cp .env.local.example .env.local
```

3. Set up your environment variables:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=your_sanity_project_id
NEXT_PUBLIC_SANITY_DATASET=production

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
```

4. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Supabase Setup

Run the following SQL to create the required tables:

```sql
-- Users table (extends Supabase auth.users)
create table public.users (
  id uuid references auth.users primary key,
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
create table public.therapists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users not null,
  sanity_id text,
  license_number text,
  bank_account text,
  is_approved boolean default false,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Services table
create table public.services (
  id uuid primary key default gen_random_uuid(),
  sanity_id text not null,
  therapist_id uuid references public.therapists not null,
  price decimal not null,
  duration_minutes integer not null,
  service_type text default 'both' check (service_type in ('online', 'physical', 'both')),
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Appointments table
create table public.appointments (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid references public.users not null,
  therapist_id uuid references public.therapists not null,
  service_id uuid references public.services not null,
  start_time timestamptz not null,
  end_time timestamptz not null,
  status text default 'pending' check (status in ('pending', 'confirmed', 'completed', 'cancelled', 'no_show')),
  meeting_url text,
  notes text,
  cancellation_reason text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Orders table
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  appointment_id uuid references public.appointments not null,
  patient_id uuid references public.users not null,
  therapist_id uuid references public.therapists not null,
  amount decimal not null,
  currency text default 'AED',
  stripe_payment_intent_id text,
  status text default 'pending' check (status in ('pending', 'paid', 'refunded', 'failed')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Wellness logs table
create table public.wellness_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users not null,
  score integer not null,
  answers jsonb not null,
  category text not null,
  logged_at timestamptz default now()
);
```

## Capacitor (Mobile)

To build for mobile:

```bash
# Build the Next.js app for static export
npm run build

# Add platforms
npx cap add ios
npx cap add android

# Sync web assets
npx cap sync

# Open in IDE
npx cap open ios
npx cap open android
```

## Key Features

### Public Website (/explore)
- Service catalog with rich descriptions
- Expert/Therapist profiles
- Partner directory (gyms, restaurants)
- Blog (Sanity-powered)

### Client App (/platform)
- Wellness score & daily check-in
- Smart recommendations
- Booking wizard (service → expert → calendar → checkout)
- Partner perks & QR code generation
- Appointment management

### Therapist Portal (/portal)
- Schedule & availability management
- Patient list & notes
- Service pricing control
- Financial reports

### Admin Dashboard (/admin)
- User management
- Therapist approval
- Partner management
- Content control
- System reports

## License

Private - Bold & Beyond LLC

## Where everything lives

- **App entry & global config**  
  `app/layout.tsx` – root layout, fonts, Toaster.  
  `app/globals.css` – Tailwind base styles and gradients.

- **Public marketing site (no auth)** – under `app/(explore)`  
  - `page.tsx` – homepage / hero.  
  - `services/` – list + detail pages powered by Sanity `service` docs.  
  - `experts/` – list + detail pages powered by Sanity `expert` docs.  
  - `partners/` – partner directory powered by Sanity `partner` docs.  
  - `blog/` – blog listing & post pages powered by Sanity `blogPost` docs.  
  - Static pages: `about`, `help`, `contact`, `careers`, `privacy`, `terms`, `cancellation`.

- **Client app (authenticated)** – under `app/(platform)`  
  - `dashboard/` – main client dashboard with wellness score and recommendations.  
  - `booking/` – booking flow: `select-service` → `select-expert` → `calendar` → `checkout`.  
  - `my-appointments/` – upcoming & past sessions.  
  - `perks/` – partner perks view.  
  - `profile/` – basic account details.  
  - Bottom navigation: `components/layout/bottom-nav.tsx`.

- **Therapist portal** – under `app/portal`  
  - `page.tsx` – therapist dashboard.  
  - `schedule/` – today’s sessions.  
  - `patients/` – patient list.  
  - `services/` – therapist service/pricing management.  
  - `orders/` – basic earnings view.  
  - Portal bottom navigation: `PortalBottomNav` in `components/layout/bottom-nav.tsx`.

- **Admin dashboard** – under `app/admin`  
  - `page.tsx` – high‑level metrics and actions.  
  - `users/`, `therapists/`, `partners/` – management views.  
  - `content/` – link into Sanity Studio.  
  - `reports/` – KPI cards.  
  - `settings/` – feature toggles.

- **Authentication**  
  - `app/(auth)/login/page.tsx` – email/password + Google login.  
  - `app/(auth)/signup/page.tsx` – registration.  
  - `app/auth/callback/route.ts` – Supabase OAuth callback.  
  - `middleware.ts` and `lib/supabase/middleware.ts` – session handling and route protection.

- **APIs & integrations**  
  - `app/api/checkout/route.ts` – creates Stripe Checkout sessions (test mode ready).  
  - `lib/supabase/server.ts`, `lib/supabase.ts` – Supabase clients for server and browser.  
  - `lib/sanity.ts` – Sanity client, image builder, and GROQ queries used across marketing pages.  
  - `supabase/migrations/001_initial_schema.sql` – full database schema for Supabase.

- **Sanity Studio**  
  - `sanity.config.ts` – Sanity v3 configuration.  
  - `sanity/schemas/*` – document schemas for `service`, `expert`, `partner`, `blogPost`, `wellnessQuestion`.  
  - `app/studio/[[...index]]/page.tsx` – Studio mounted at `/studio`.
