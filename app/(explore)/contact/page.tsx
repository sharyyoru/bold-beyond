import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ContactPage() {
  return (
    <div className="container py-12 space-y-8">
      <div className="max-w-2xl space-y-3">
        <p className="text-sm font-semibold tracking-wider text-brand-gold uppercase">
          Contact
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-brand-navy sm:text-4xl">
          Get in touch with Bold & Beyond
        </h1>
        <p className="text-muted-foreground text-base">
          For product questions, partnerships, or press, send us a note and well
          connect you with the right person.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Send us a message</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 text-sm">
              <label htmlFor="name" className="font-medium">
                Name
              </label>
              <Input id="name" placeholder="Your name" />
            </div>
            <div className="space-y-2 text-sm">
              <label htmlFor="email" className="font-medium">
                Email
              </label>
              <Input id="email" type="email" placeholder="you@example.com" />
            </div>
            <div className="space-y-2 text-sm">
              <label htmlFor="message" className="font-medium">
                Message
              </label>
              <textarea
                id="message"
                className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Tell us a bit about what youre looking for"
              />
            </div>
            <Button variant="gold" className="w-full">
              Send message
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              Email: <span className="font-medium">hello@boldandbeyond.ae</span>
            </p>
            <p>
              Phone: <span className="font-medium">+971 4 234 5678</span>
            </p>
            <p>
              Location: Dubai, United Arab Emirates
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
