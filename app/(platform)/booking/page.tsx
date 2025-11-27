import Link from "next/link";
import { Calendar, ArrowRight, Brain, Heart, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const steps = [
  {
    title: "1. Choose a service",
    description: "Therapy, coaching, couples, or group sessions.",
    icon: Brain,
  },
  {
    title: "2. Pick your expert",
    description: "Browse vetted therapists and coaches that fit your needs.",
    icon: Users,
  },
  {
    title: "3. Select a time",
    description: "See real-time availability across online and in-person slots.",
    icon: Calendar,
  },
  {
    title: "4. Confirm & pay",
    description: "Secure checkout, reminders, and calendar invites.",
    icon: Heart,
  },
];

export default function BookingLandingPage() {
  return (
    <div className="container py-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Book a session</h1>
        <p className="text-sm text-muted-foreground">
          Start a new booking in a few guided steps.
        </p>
      </div>

      <Card>
        <CardContent className="flex items-center justify-between gap-4 p-4">
          <div>
            <p className="text-sm font-medium">Ready when you are</p>
            <p className="text-sm text-muted-foreground">
              It usually takes under two minutes to confirm a session.
            </p>
          </div>
          <Button variant="gold" asChild>
            <Link href="/booking/select-service">
              Start booking
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-3 sm:grid-cols-2">
        {steps.map((step) => (
          <Card key={step.title}>
            <CardHeader className="flex flex-row items-center gap-3 pb-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-gold/10 text-brand-gold">
                <step.icon className="h-4 w-4" />
              </div>
              <div>
                <CardTitle className="text-sm font-semibold">
                  {step.title}
                </CardTitle>
                <CardDescription>{step.description}</CardDescription>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
