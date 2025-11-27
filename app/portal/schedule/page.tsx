import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Video, MapPin, ArrowRight } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

const todaysAppointments = [
  {
    id: "1",
    patient: "Sarah M.",
    service: "Psychotherapy Session",
    time: new Date(Date.now() + 2 * 60 * 60 * 1000),
    type: "online" as const,
  },
  {
    id: "2",
    patient: "Ahmed K.",
    service: "Initial Consultation",
    time: new Date(Date.now() + 4 * 60 * 60 * 1000),
    type: "physical" as const,
  },
];

export default function PortalSchedulePage() {
  return (
    <div className="container py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Schedule</h1>
          <p className="text-sm text-muted-foreground">
            View and manage upcoming sessions.
          </p>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href="/portal/services">
            Manage availability
            <ArrowRight className="ml-1.5 h-4 w-4" />
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Today</CardTitle>
          <CardDescription>
            {format(new Date(), "EEEE, MMMM d")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {todaysAppointments.map((apt) => (
            <div
              key={apt.id}
              className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm"
            >
              <div className="space-y-0.5">
                <p className="font-medium">{apt.patient}</p>
                <p className="text-muted-foreground">{apt.service}</p>
              </div>
              <div className="text-right text-xs text-muted-foreground space-y-1">
                <div className="flex items-center justify-end gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{format(apt.time, "h:mm a")}</span>
                </div>
                <div className="flex items-center justify-end gap-1">
                  {apt.type === "online" ? (
                    <Video className="h-3.5 w-3.5" />
                  ) : (
                    <MapPin className="h-3.5 w-3.5" />
                  )}
                  <span>{apt.type === "online" ? "Online" : "In-person"}</span>
                </div>
              </div>
            </div>
          ))}
          {todaysAppointments.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No sessions scheduled for today.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
