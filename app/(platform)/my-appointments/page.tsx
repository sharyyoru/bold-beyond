"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { format } from "date-fns";
import {
  Calendar,
  Clock,
  Video,
  MapPin,
  MoreVertical,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronRight,
  Plus,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

// Mock appointments data
const mockAppointments = [
  {
    id: "1",
    expertName: "Dr. Aisha Rahman",
    expertPhoto: "/experts/aisha.jpg",
    serviceName: "Psychotherapy Session",
    date: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
    duration: 60,
    type: "online" as const,
    status: "confirmed" as const,
    meetingUrl: "https://meet.boldandbeyond.ae/abc123",
    price: 400,
  },
  {
    id: "2",
    expertName: "Coach Michael Chen",
    expertPhoto: "/experts/michael.jpg",
    serviceName: "Life Coaching",
    date: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
    duration: 60,
    type: "online" as const,
    status: "confirmed" as const,
    meetingUrl: "https://meet.boldandbeyond.ae/def456",
    price: 450,
  },
  {
    id: "3",
    expertName: "Dr. Sarah Al-Maktoum",
    expertPhoto: "/experts/sarah.jpg",
    serviceName: "Initial Consultation",
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
    duration: 45,
    type: "physical" as const,
    status: "pending" as const,
    location: "Dubai Healthcare City",
    price: 600,
  },
];

const mockPastAppointments = [
  {
    id: "4",
    expertName: "Dr. Aisha Rahman",
    expertPhoto: "/experts/aisha.jpg",
    serviceName: "Psychotherapy Session",
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last week
    duration: 60,
    type: "online" as const,
    status: "completed" as const,
    price: 400,
    location: "Online",
  },
  {
    id: "5",
    expertName: "Dr. James Wilson",
    expertPhoto: "/experts/james.jpg",
    serviceName: "Couples Therapy",
    date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 2 weeks ago
    duration: 90,
    type: "physical" as const,
    status: "completed" as const,
    price: 500,
    location: "Business Bay",
  },
];

type AppointmentStatus = "pending" | "confirmed" | "completed" | "cancelled" | "no_show";

function getStatusBadge(status: AppointmentStatus) {
  switch (status) {
    case "confirmed":
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
          <CheckCircle2 className="h-3 w-3" />
          Confirmed
        </span>
      );
    case "pending":
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-700">
          <AlertCircle className="h-3 w-3" />
          Pending
        </span>
      );
    case "completed":
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
          <CheckCircle2 className="h-3 w-3" />
          Completed
        </span>
      );
    case "cancelled":
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
          <XCircle className="h-3 w-3" />
          Cancelled
        </span>
      );
    default:
      return null;
  }
}

function MyAppointmentsContent() {
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");

  // Show success toast if redirected from checkout
  useEffect(() => {
    if (searchParams.get("success") === "true") {
      toast({
        title: "Booking confirmed!",
        description: "Your appointment has been scheduled successfully.",
      });
    }
  }, [searchParams, toast]);

  const appointments =
    activeTab === "upcoming" ? mockAppointments : mockPastAppointments;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">My Appointments</h1>
            <Button variant="gold" size="sm" asChild>
              <Link href="/booking/select-service">
                <Plus className="mr-2 h-4 w-4" />
                Book New
              </Link>
            </Button>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mt-4">
            <button
              onClick={() => setActiveTab("upcoming")}
              className={cn(
                "pb-2 text-sm font-medium border-b-2 transition-colors",
                activeTab === "upcoming"
                  ? "border-brand-gold text-brand-gold"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              Upcoming ({mockAppointments.length})
            </button>
            <button
              onClick={() => setActiveTab("past")}
              className={cn(
                "pb-2 text-sm font-medium border-b-2 transition-colors",
                activeTab === "past"
                  ? "border-brand-gold text-brand-gold"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              Past ({mockPastAppointments.length})
            </button>
          </div>
        </div>
      </div>

      <div className="container py-6 space-y-4">
        {appointments.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <Calendar className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">
                {activeTab === "upcoming"
                  ? "No upcoming appointments"
                  : "No past appointments"}
              </p>
              {activeTab === "upcoming" && (
                <Button variant="gold" size="sm" className="mt-4" asChild>
                  <Link href="/booking/select-service">Book a Session</Link>
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          appointments.map((apt) => (
            <Card key={apt.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex gap-4 p-4">
                  <Avatar className="h-14 w-14">
                    <AvatarImage src={apt.expertPhoto} alt={apt.expertName} />
                    <AvatarFallback>
                      {apt.expertName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium">{apt.expertName}</p>
                        <p className="text-sm text-muted-foreground">
                          {apt.serviceName}
                        </p>
                      </div>
                      {getStatusBadge(apt.status)}
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {format(apt.date, "EEE, MMM d")}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {format(apt.date, "h:mm a")}
                      </div>
                      <div className="flex items-center gap-1">
                        {apt.type === "online" ? (
                          <Video className="h-3.5 w-3.5" />
                        ) : (
                          <MapPin className="h-3.5 w-3.5" />
                        )}
                        {apt.type === "online" ? "Online" : apt.location}
                      </div>
                    </div>
                  </div>

                  {activeTab === "upcoming" && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Reschedule</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          Cancel Appointment
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>

                {/* Action Bar */}
                {activeTab === "upcoming" && apt.status === "confirmed" && (
                  <div className="flex items-center justify-between border-t bg-muted/30 px-4 py-3">
                    {apt.type === "online" && apt.meetingUrl ? (
                      <Button variant="gold" size="sm" asChild>
                        <a href={apt.meetingUrl} target="_blank" rel="noopener">
                          <Video className="mr-2 h-4 w-4" />
                          Join Session
                        </a>
                      </Button>
                    ) : (
                      <Button variant="outline" size="sm">
                        <MapPin className="mr-2 h-4 w-4" />
                        Get Directions
                      </Button>
                    )}
                    <span className="text-sm font-medium">
                      {apt.price} AED
                    </span>
                  </div>
                )}

                {activeTab === "past" && apt.status === "completed" && (
                  <div className="flex items-center justify-between border-t bg-muted/30 px-4 py-3">
                    <Button variant="outline" size="sm">
                      Book Again
                    </Button>
                    <Button variant="ghost" size="sm">
                      Leave Review
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

export default function MyAppointmentsPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="h-6 w-6 animate-spin" /></div>}>
      <MyAppointmentsContent />
    </Suspense>
  );
}
