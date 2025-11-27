"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  format,
  addDays,
  startOfWeek,
  isSameDay,
  isToday,
  isBefore,
  startOfDay,
} from "date-fns";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Video,
  MapPin,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

// Mock time slots - replace with real availability from Supabase
const generateMockSlots = (date: Date) => {
  const slots = [];
  const baseHour = 9;
  const endHour = 18;

  for (let hour = baseHour; hour < endHour; hour++) {
    // Randomly mark some slots as unavailable for demo
    const isAvailable = Math.random() > 0.3;
    slots.push({
      time: `${hour.toString().padStart(2, "0")}:00`,
      available: isAvailable && !isBefore(date, startOfDay(new Date())),
    });
    if (hour < endHour - 1) {
      const isHalfAvailable = Math.random() > 0.3;
      slots.push({
        time: `${hour.toString().padStart(2, "0")}:30`,
        available: isHalfAvailable && !isBefore(date, startOfDay(new Date())),
      });
    }
  }
  return slots;
};

// Mock expert data
const mockExpert = {
  id: "1",
  name: "Dr. Aisha Rahman",
  title: "Clinical Psychologist",
  photo: "/experts/aisha.jpg",
  sessionTypes: ["online", "physical"],
};

// Mock service data
const mockService = {
  id: "1",
  name: "Psychotherapy Session",
  duration: 60,
  price: 400,
};

export default function CalendarPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const serviceId = searchParams.get("service");
  const expertId = searchParams.get("expert");

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [sessionType, setSessionType] = useState<"online" | "physical">("online");
  const [weekOffset, setWeekOffset] = useState(0);

  // Generate week days
  const weekDays = useMemo(() => {
    const start = addDays(startOfWeek(new Date(), { weekStartsOn: 0 }), weekOffset * 7);
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  }, [weekOffset]);

  // Generate time slots for selected date
  const timeSlots = useMemo(() => {
    return generateMockSlots(selectedDate);
  }, [selectedDate]);

  const handleContinue = () => {
    if (!selectedTime) return;

    const dateTime = `${format(selectedDate, "yyyy-MM-dd")}T${selectedTime}`;
    router.push(
      `/booking/checkout?service=${serviceId}&expert=${expertId}&datetime=${dateTime}&type=${sessionType}`
    );
  };

  const isPastDate = (date: Date) => {
    return isBefore(startOfDay(date), startOfDay(new Date()));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b">
        <div className="container py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href={`/booking/select-expert?service=${serviceId}`}>
                <ChevronLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-lg font-semibold">Select Date & Time</h1>
              <p className="text-sm text-muted-foreground">Step 3 of 4</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-6 space-y-6">
        {/* Expert & Service Summary */}
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={mockExpert.photo} alt={mockExpert.name} />
              <AvatarFallback>
                {mockExpert.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-medium">{mockExpert.name}</p>
              <p className="text-sm text-muted-foreground">
                {mockService.name} • {mockService.duration} min
              </p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-brand-gold">
                {mockService.price} AED
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Session Type */}
        <div className="space-y-2">
          <p className="text-sm font-medium">Session Type</p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setSessionType("online")}
              className={cn(
                "flex items-center justify-center gap-2 rounded-lg border p-3 transition-all",
                sessionType === "online"
                  ? "border-brand-gold bg-brand-gold/10 text-brand-gold"
                  : "border-border hover:border-brand-gold/50"
              )}
            >
              <Video className="h-4 w-4" />
              <span className="font-medium">Online</span>
            </button>
            <button
              onClick={() => setSessionType("physical")}
              className={cn(
                "flex items-center justify-center gap-2 rounded-lg border p-3 transition-all",
                sessionType === "physical"
                  ? "border-brand-gold bg-brand-gold/10 text-brand-gold"
                  : "border-border hover:border-brand-gold/50"
              )}
            >
              <MapPin className="h-4 w-4" />
              <span className="font-medium">In-Person</span>
            </button>
          </div>
        </div>

        {/* Calendar */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">
                {format(weekDays[0], "MMMM yyyy")}
              </CardTitle>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setWeekOffset((prev) => Math.max(0, prev - 1))}
                  disabled={weekOffset === 0}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setWeekOffset((prev) => prev + 1)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1">
              {weekDays.map((day) => {
                const isSelected = isSameDay(day, selectedDate);
                const isPast = isPastDate(day);
                const dayIsToday = isToday(day);

                return (
                  <button
                    key={day.toISOString()}
                    onClick={() => !isPast && setSelectedDate(day)}
                    disabled={isPast}
                    className={cn(
                      "flex flex-col items-center rounded-lg p-2 transition-all",
                      isSelected
                        ? "bg-brand-gold text-white"
                        : isPast
                        ? "opacity-40 cursor-not-allowed"
                        : "hover:bg-muted"
                    )}
                  >
                    <span className="text-xs text-muted-foreground">
                      {format(day, "EEE")}
                    </span>
                    <span
                      className={cn(
                        "mt-1 text-lg font-medium",
                        isSelected && "text-white",
                        dayIsToday && !isSelected && "text-brand-gold"
                      )}
                    >
                      {format(day, "d")}
                    </span>
                    {dayIsToday && (
                      <span
                        className={cn(
                          "mt-0.5 h-1 w-1 rounded-full",
                          isSelected ? "bg-white" : "bg-brand-gold"
                        )}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Time Slots */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <p className="text-sm font-medium">
              Available times for {format(selectedDate, "EEEE, MMM d")}
            </p>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {timeSlots.map((slot) => (
              <button
                key={slot.time}
                onClick={() => slot.available && setSelectedTime(slot.time)}
                disabled={!slot.available}
                className={cn(
                  "rounded-lg border py-2.5 text-sm font-medium transition-all",
                  selectedTime === slot.time
                    ? "border-brand-gold bg-brand-gold text-white"
                    : slot.available
                    ? "border-border hover:border-brand-gold"
                    : "border-border bg-muted/50 text-muted-foreground cursor-not-allowed line-through"
                )}
              >
                {slot.time}
              </button>
            ))}
          </div>
          {timeSlots.filter((s) => s.available).length === 0 && (
            <p className="text-center text-sm text-muted-foreground py-4">
              No available slots for this date. Try another day.
            </p>
          )}
        </div>
      </div>

      {/* Fixed Bottom CTA */}
      <div className="fixed bottom-20 left-0 right-0 border-t bg-background p-4">
        <div className="container">
          <Button
            variant="gold"
            size="lg"
            className="w-full"
            disabled={!selectedTime}
            onClick={handleContinue}
          >
            {selectedTime ? (
              <>
                Continue to Checkout
                <ChevronRight className="ml-2 h-4 w-4" />
              </>
            ) : (
              "Select a time slot"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
