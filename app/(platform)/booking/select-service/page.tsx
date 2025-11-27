"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Brain,
  Heart,
  Sparkles,
  Users,
  Video,
  MapPin,
  ArrowRight,
  Search,
  Filter,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// Mock services - replace with Sanity data
const mockServices = [
  {
    id: "1",
    title: "Psychotherapy",
    description: "Professional mental health support with licensed therapists",
    icon: Brain,
    category: "therapy",
    priceFrom: 350,
    types: ["online", "physical"],
  },
  {
    id: "2",
    title: "Life Coaching",
    description: "Transform your goals into achievements with expert guidance",
    icon: Sparkles,
    category: "coaching",
    priceFrom: 400,
    types: ["online", "physical"],
  },
  {
    id: "3",
    title: "Couples Therapy",
    description: "Strengthen your relationships with specialized counseling",
    icon: Heart,
    category: "therapy",
    priceFrom: 500,
    types: ["online", "physical"],
  },
  {
    id: "4",
    title: "Group Sessions",
    description: "Connect and grow with supportive community workshops",
    icon: Users,
    category: "group",
    priceFrom: 150,
    types: ["physical"],
  },
  {
    id: "5",
    title: "CBT Therapy",
    description: "Cognitive behavioral therapy for anxiety and depression",
    icon: Brain,
    category: "therapy",
    priceFrom: 400,
    types: ["online", "physical"],
  },
];

const categories = [
  { id: "all", label: "All Services" },
  { id: "therapy", label: "Therapy" },
  { id: "coaching", label: "Coaching" },
  { id: "group", label: "Group" },
];

const sessionTypes = [
  { id: "all", label: "All", icon: null },
  { id: "online", label: "Online", icon: Video },
  { id: "physical", label: "In-Person", icon: MapPin },
];

export default function SelectServicePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedType, setSelectedType] = useState("all");

  const filteredServices = mockServices.filter((service) => {
    const matchesSearch = service.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || service.category === selectedCategory;
    const matchesType =
      selectedType === "all" || service.types.includes(selectedType);
    return matchesSearch && matchesCategory && matchesType;
  });

  const handleSelectService = (serviceId: string) => {
    router.push(`/booking/select-expert?service=${serviceId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b">
        <div className="container py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/dashboard">
                <ChevronLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-lg font-semibold">Select a Service</h1>
              <p className="text-sm text-muted-foreground">Step 1 of 4</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-6 space-y-6">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filters */}
        <div className="space-y-4">
          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            {categories.map((cat) => (
              <Button
                key={cat.id}
                variant={selectedCategory === cat.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(cat.id)}
                className="whitespace-nowrap"
              >
                {cat.label}
              </Button>
            ))}
          </div>

          {/* Session Type */}
          <div className="flex gap-2">
            {sessionTypes.map((type) => (
              <Button
                key={type.id}
                variant={selectedType === type.id ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setSelectedType(type.id)}
                className="flex-1"
              >
                {type.icon && <type.icon className="mr-2 h-4 w-4" />}
                {type.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Services List */}
        <div className="space-y-3">
          {filteredServices.map((service) => (
            <Card
              key={service.id}
              className="cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5"
              onClick={() => handleSelectService(service.id)}
            >
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-gold/10 text-brand-gold">
                  <service.icon className="h-6 w-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium">{service.title}</p>
                  <p className="text-sm text-muted-foreground truncate">
                    {service.description}
                  </p>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-sm font-medium text-brand-gold">
                      From {service.priceFrom} AED
                    </span>
                    <div className="flex gap-1">
                      {service.types.includes("online") && (
                        <Video className="h-3.5 w-3.5 text-muted-foreground" />
                      )}
                      {service.types.includes("physical") && (
                        <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              </CardContent>
            </Card>
          ))}

          {filteredServices.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No services found</p>
              <Button
                variant="link"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                  setSelectedType("all");
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
