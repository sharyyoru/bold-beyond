"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import {
  Star,
  MapPin,
  Video,
  Globe,
  ChevronLeft,
  ChevronRight,
  Filter,
  Search,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

// Mock experts - replace with Sanity data
const mockExperts = [
  {
    id: "1",
    name: "Dr. Aisha Rahman",
    title: "Clinical Psychologist",
    photo: "/experts/aisha.jpg",
    rating: 4.9,
    reviewCount: 127,
    specializations: ["Anxiety", "Depression", "CBT"],
    languages: ["English", "Arabic"],
    sessionTypes: ["online", "physical"],
    nextAvailable: "Today, 3:00 PM",
    priceFrom: 400,
    location: "Dubai Healthcare City",
  },
  {
    id: "2",
    name: "Coach Michael Chen",
    title: "Executive Life Coach",
    photo: "/experts/michael.jpg",
    rating: 4.8,
    reviewCount: 89,
    specializations: ["Career", "Leadership", "Mindfulness"],
    languages: ["English", "Mandarin"],
    sessionTypes: ["online"],
    nextAvailable: "Tomorrow, 10:00 AM",
    priceFrom: 450,
    location: "Online Only",
  },
  {
    id: "3",
    name: "Dr. Sarah Al-Maktoum",
    title: "Psychiatrist",
    photo: "/experts/sarah.jpg",
    rating: 5.0,
    reviewCount: 203,
    specializations: ["PTSD", "Bipolar", "Medication Management"],
    languages: ["English", "Arabic", "French"],
    sessionTypes: ["online", "physical"],
    nextAvailable: "Wed, 2:00 PM",
    priceFrom: 600,
    location: "Jumeirah",
  },
  {
    id: "4",
    name: "Dr. James Wilson",
    title: "Couples Therapist",
    photo: "/experts/james.jpg",
    rating: 4.7,
    reviewCount: 156,
    specializations: ["Marriage", "Relationships", "Communication"],
    languages: ["English"],
    sessionTypes: ["online", "physical"],
    nextAvailable: "Today, 5:00 PM",
    priceFrom: 500,
    location: "Business Bay",
  },
];

const sessionTypeFilters = [
  { id: "all", label: "All", icon: null },
  { id: "online", label: "Online", icon: Video },
  { id: "physical", label: "In-Person", icon: MapPin },
];

function SelectExpertContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const serviceId = searchParams.get("service");

  const [searchQuery, setSearchQuery] = useState("");
  const [sessionType, setSessionType] = useState("all");

  const filteredExperts = mockExperts.filter((expert) => {
    const matchesSearch =
      expert.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expert.specializations.some((s) =>
        s.toLowerCase().includes(searchQuery.toLowerCase())
      );
    const matchesType =
      sessionType === "all" || expert.sessionTypes.includes(sessionType);
    return matchesSearch && matchesType;
  });

  const handleSelectExpert = (expertId: string) => {
    router.push(
      `/booking/calendar?service=${serviceId}&expert=${expertId}`
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b">
        <div className="container py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/booking/select-service">
                <ChevronLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-lg font-semibold">Choose Your Expert</h1>
              <p className="text-sm text-muted-foreground">Step 2 of 4</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-6 space-y-6">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name or specialization..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Session Type Filter */}
        <div className="flex gap-2">
          {sessionTypeFilters.map((type) => (
            <Button
              key={type.id}
              variant={sessionType === type.id ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setSessionType(type.id)}
              className="flex-1"
            >
              {type.icon && <type.icon className="mr-2 h-4 w-4" />}
              {type.label}
            </Button>
          ))}
        </div>

        {/* Experts List */}
        <div className="space-y-4">
          {filteredExperts.map((expert) => (
            <Card
              key={expert.id}
              className="cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5 overflow-hidden"
              onClick={() => handleSelectExpert(expert.id)}
            >
              <CardContent className="p-0">
                <div className="flex gap-4 p-4">
                  {/* Avatar */}
                  <Avatar className="h-20 w-20 rounded-xl">
                    <AvatarImage src={expert.photo} alt={expert.name} />
                    <AvatarFallback className="rounded-xl text-lg">
                      {expert.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold">{expert.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {expert.title}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <Star className="h-4 w-4 fill-brand-gold text-brand-gold" />
                        <span className="font-medium">{expert.rating}</span>
                        <span className="text-muted-foreground">
                          ({expert.reviewCount})
                        </span>
                      </div>
                    </div>

                    {/* Specializations */}
                    <div className="mt-2 flex flex-wrap gap-1">
                      {expert.specializations.slice(0, 3).map((spec) => (
                        <span
                          key={spec}
                          className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>

                    {/* Meta info */}
                    <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Globe className="h-3.5 w-3.5" />
                        {expert.languages.join(", ")}
                      </div>
                      <div className="flex items-center gap-1">
                        {expert.sessionTypes.includes("online") && (
                          <Video className="h-3.5 w-3.5" />
                        )}
                        {expert.sessionTypes.includes("physical") && (
                          <MapPin className="h-3.5 w-3.5" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between border-t bg-muted/30 px-4 py-3">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Next available
                    </p>
                    <p className="text-sm font-medium text-green-600">
                      {expert.nextAvailable}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">From</p>
                    <p className="text-sm font-semibold text-brand-gold">
                      {expert.priceFrom} AED
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredExperts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No experts found</p>
              <Button
                variant="link"
                onClick={() => {
                  setSearchQuery("");
                  setSessionType("all");
                }}
              >
                Clear filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SelectExpertPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="h-6 w-6 animate-spin" /></div>}>
      <SelectExpertContent />
    </Suspense>
  );
}
