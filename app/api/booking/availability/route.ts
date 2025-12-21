import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface TimeSlot {
  time: string;
  available: boolean;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const providerId = searchParams.get("providerId");
    const date = searchParams.get("date"); // YYYY-MM-DD
    const serviceId = searchParams.get("serviceId");

    if (!providerId || !date) {
      return NextResponse.json({ error: "Provider ID and date required" }, { status: 400 });
    }

    // Get day of week (0-6, Sunday-Saturday)
    const dateObj = new Date(date);
    const dayOfWeek = dateObj.getDay();

    // Get provider's schedule for this day
    const { data: scheduleData } = await supabase
      .from("provider_schedules")
      .select("*")
      .eq("provider_id", providerId)
      .eq("day_of_week", dayOfWeek)
      .single();

    if (!scheduleData || !scheduleData.is_open) {
      return NextResponse.json({
        success: true,
        available: false,
        message: "Provider is closed on this day",
        slots: [],
      });
    }

    // Get service duration (default 60 minutes)
    let duration = 60;
    if (serviceId) {
      const { data: durationData } = await supabase
        .from("service_durations")
        .select("duration_minutes")
        .eq("provider_id", providerId)
        .eq("service_id", serviceId)
        .single();
      
      if (durationData) {
        duration = durationData.duration_minutes;
      }
    }

    // Get existing bookings for this date
    const { data: bookings } = await supabase
      .from("booking_slots")
      .select("start_time, end_time")
      .eq("provider_id", providerId)
      .eq("slot_date", date)
      .eq("status", "booked");

    const bookedSlots = new Set<string>();
    bookings?.forEach((booking) => {
      // Mark all times within the booking as unavailable
      const start = timeToMinutes(booking.start_time);
      const end = timeToMinutes(booking.end_time);
      for (let t = start; t < end; t += 30) {
        bookedSlots.add(minutesToTime(t));
      }
    });

    // Generate available time slots
    const openTime = timeToMinutes(scheduleData.open_time);
    const closeTime = timeToMinutes(scheduleData.close_time);
    const slots: TimeSlot[] = [];

    // Generate slots in 30-minute intervals
    for (let time = openTime; time + duration <= closeTime; time += 30) {
      const timeStr = minutesToTime(time);
      
      // Check if any part of this slot overlaps with booked slots
      let isAvailable = true;
      for (let t = time; t < time + duration; t += 30) {
        if (bookedSlots.has(minutesToTime(t))) {
          isAvailable = false;
          break;
        }
      }

      slots.push({
        time: timeStr,
        available: isAvailable,
      });
    }

    return NextResponse.json({
      success: true,
      available: true,
      date,
      dayOfWeek,
      openTime: scheduleData.open_time,
      closeTime: scheduleData.close_time,
      duration,
      slots,
    });
  } catch (error: any) {
    console.error("Availability check error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to check availability" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { providerId, serviceId, date, time, duration, appointmentId } = body;

    if (!providerId || !date || !time) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Calculate end time
    const startMinutes = timeToMinutes(time);
    const endMinutes = startMinutes + (duration || 60);
    const endTime = minutesToTime(endMinutes);

    // Check if slot is already booked
    const { data: existingBooking } = await supabase
      .from("booking_slots")
      .select("*")
      .eq("provider_id", providerId)
      .eq("slot_date", date)
      .eq("start_time", time)
      .eq("status", "booked")
      .single();

    if (existingBooking) {
      return NextResponse.json({
        success: false,
        error: "This time slot is already booked",
      }, { status: 409 });
    }

    // Create booking slot
    const { data, error } = await supabase
      .from("booking_slots")
      .insert({
        provider_id: providerId,
        appointment_id: appointmentId,
        slot_date: date,
        start_time: time,
        end_time: endTime,
        status: "booked",
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      booking: data,
    });
  } catch (error: any) {
    console.error("Booking error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create booking" },
      { status: 500 }
    );
  }
}

// Helper functions
function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function minutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`;
}
