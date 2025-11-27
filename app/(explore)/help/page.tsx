import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function HelpPage() {
  return (
    <div className="container py-12 space-y-8">
      <div className="max-w-2xl space-y-3">
        <p className="text-sm font-semibold tracking-wider text-brand-gold uppercase">
          Help Center
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-brand-navy sm:text-4xl">
          How can we support you today?
        </h1>
        <p className="text-muted-foreground text-base">
          Find quick answers to common questions or reach out to the Bold & Beyond
          team for anything more specific.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">For clients</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <ul className="space-y-2">
              <li>How bookings, rescheduling, and cancellations work</li>
              <li>What to expect in your first session</li>
              <li>Payment, refunds, and Beyond+ membership</li>
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">For therapists</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <ul className="space-y-2">
              <li>How to join Bold & Beyond as a provider</li>
              <li>Managing availability, notes, and payouts</li>
              <li>Clinical quality and safety standards</li>
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">For partners</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <ul className="space-y-2">
              <li>Setting up partner perks and QR redemptions</li>
              <li>Corporate and bulk membership options</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="flex flex-col items-start justify-between gap-4 p-6 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-semibold text-brand-gold">Still stuck?</p>
            <p className="text-sm text-muted-foreground">
              Send us a message and someone from the team will get back within one
              business day.
            </p>
          </div>
          <Button asChild variant="gold">
            <Link href="/contact">Contact support</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
