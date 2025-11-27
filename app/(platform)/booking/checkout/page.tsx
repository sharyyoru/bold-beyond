"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { format, parseISO } from "date-fns";
import {
  ChevronLeft,
  Calendar,
  Clock,
  Video,
  MapPin,
  Shield,
  CreditCard,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

// Mock data
const mockExpert = {
  id: "1",
  name: "Dr. Aisha Rahman",
  title: "Clinical Psychologist",
  photo: "/experts/aisha.jpg",
  location: "Dubai Healthcare City",
};

const mockService = {
  id: "1",
  name: "Psychotherapy Session",
  duration: 60,
  price: 400,
};

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const serviceId = searchParams.get("service");
  const expertId = searchParams.get("expert");
  const dateTime = searchParams.get("datetime");
  const sessionType = searchParams.get("type") as "online" | "physical";

  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);

  const parsedDate = dateTime ? parseISO(dateTime) : new Date();
  const subtotal = mockService.price;
  const total = subtotal - discount;

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return;

    setIsApplyingPromo(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (promoCode.toUpperCase() === "WELLNESS20") {
      setDiscount(subtotal * 0.2);
      setPromoApplied(true);
      toast({
        title: "Promo code applied!",
        description: "20% discount has been applied to your order.",
      });
    } else {
      toast({
        title: "Invalid promo code",
        description: "The promo code you entered is not valid.",
        variant: "destructive",
      });
    }

    setIsApplyingPromo(false);
  };

  const handlePayment = async () => {
    setIsLoading(true);

    try {
      // Create checkout session via API
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          serviceId,
          expertId,
          dateTime,
          sessionType,
          promoCode: promoApplied ? promoCode : null,
        }),
      });

      const data = await response.json();

      if (data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        throw new Error(data.error || "Failed to create checkout session");
      }
    } catch (error) {
      toast({
        title: "Payment failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  // For demo purposes, simulate successful booking
  const handleDemoBooking = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    toast({
      title: "Booking confirmed!",
      description: "Your session has been scheduled successfully.",
    });
    
    router.push("/my-appointments?success=true");
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b">
        <div className="container py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link
                href={`/booking/calendar?service=${serviceId}&expert=${expertId}`}
              >
                <ChevronLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-lg font-semibold">Checkout</h1>
              <p className="text-sm text-muted-foreground">Step 4 of 4</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-6 space-y-6">
        {/* Booking Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Booking Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Expert */}
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={mockExpert.photo} alt={mockExpert.name} />
                <AvatarFallback>
                  {mockExpert.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{mockExpert.name}</p>
                <p className="text-sm text-muted-foreground">
                  {mockExpert.title}
                </p>
              </div>
            </div>

            <Separator />

            {/* Service */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Service</span>
                <span className="font-medium">{mockService.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Duration</span>
                <span>{mockService.duration} minutes</span>
              </div>
            </div>

            <Separator />

            {/* Date & Time */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{format(parsedDate, "EEEE, MMMM d, yyyy")}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{format(parsedDate, "h:mm a")}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                {sessionType === "online" ? (
                  <>
                    <Video className="h-4 w-4 text-muted-foreground" />
                    <span>Online Session</span>
                  </>
                ) : (
                  <>
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{mockExpert.location}</span>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Promo Code */}
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm font-medium mb-3">Promo Code</p>
            <div className="flex gap-2">
              <Input
                placeholder="Enter promo code"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                disabled={promoApplied}
                className={promoApplied ? "bg-green-50 border-green-300" : ""}
              />
              <Button
                variant="outline"
                onClick={handleApplyPromo}
                disabled={isApplyingPromo || promoApplied || !promoCode.trim()}
              >
                {isApplyingPromo ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : promoApplied ? (
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                ) : (
                  "Apply"
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Try "WELLNESS20" for 20% off (demo)
            </p>
          </CardContent>
        </Card>

        {/* Price Breakdown */}
        <Card>
          <CardContent className="pt-6 space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{subtotal} AED</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>-{discount} AED</span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span className="text-brand-gold">{total} AED</span>
            </div>
          </CardContent>
        </Card>

        {/* Security Note */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Shield className="h-4 w-4" />
          <span>Your payment is secured with 256-bit SSL encryption</span>
        </div>
      </div>

      {/* Fixed Bottom CTA */}
      <div className="fixed bottom-20 left-0 right-0 border-t bg-background p-4">
        <div className="container space-y-3">
          <Button
            variant="gold"
            size="lg"
            className="w-full"
            onClick={handleDemoBooking}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="mr-2 h-4 w-4" />
                Pay {total} AED
              </>
            )}
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            By completing this booking, you agree to our{" "}
            <Link href="/terms" className="underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/cancellation" className="underline">
              Cancellation Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
