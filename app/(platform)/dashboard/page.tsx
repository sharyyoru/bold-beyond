"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Activity,
  Brain,
  Moon,
  Utensils,
  Users,
  ArrowRight,
  Calendar,
  Sparkles,
  TrendingUp,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

// Mock data - replace with real data from Supabase
const mockUser = {
  name: "Sarah",
  wellnessScore: 72,
  streak: 7,
};

const mockAppointments = [
  {
    id: "1",
    therapistName: "Dr. Aisha Rahman",
    serviceName: "Psychotherapy Session",
    date: "Today",
    time: "3:00 PM",
    type: "online",
  },
  {
    id: "2",
    therapistName: "Coach Michael Chen",
    serviceName: "Life Coaching",
    date: "Tomorrow",
    time: "10:00 AM",
    type: "physical",
  },
];

const mockRecommendations = [
  {
    type: "service",
    title: "Consider a Therapy Session",
    description: "Based on your stress levels, talking to a professional might help.",
    href: "/booking/select-service",
    icon: Brain,
  },
  {
    type: "partner",
    title: "Visit Fitness First",
    description: "20% off for Beyond+ members. Exercise boosts mental health!",
    href: "/perks",
    icon: Activity,
  },
];

const wellnessQuestions = [
  { id: "physical", label: "Physical", icon: Activity, color: "text-green-500" },
  { id: "mental", label: "Mental", icon: Brain, color: "text-blue-500" },
  { id: "sleep", label: "Sleep", icon: Moon, color: "text-purple-500" },
  { id: "diet", label: "Diet", icon: Utensils, color: "text-orange-500" },
  { id: "social", label: "Social", icon: Users, color: "text-pink-500" },
];

function getWellnessColor(score: number): string {
  if (score >= 80) return "bg-wellness-excellent";
  if (score >= 60) return "bg-wellness-good";
  if (score >= 40) return "bg-wellness-moderate";
  if (score >= 20) return "bg-wellness-low";
  return "bg-wellness-critical";
}

function getWellnessLabel(score: number): string {
  if (score >= 80) return "Excellent";
  if (score >= 60) return "Good";
  if (score >= 40) return "Moderate";
  if (score >= 20) return "Low";
  return "Needs Attention";
}

export default function DashboardPage() {
  const [showCheckIn, setShowCheckIn] = useState(false);

  return (
    <div className="container py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            Good morning, {mockUser.name}! ✨
          </h1>
          <p className="text-muted-foreground">
            {mockUser.streak} day streak! Keep it up.
          </p>
        </div>
        <Button variant="gold" size="sm" asChild>
          <Link href="/booking/select-service">
            Book Session
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      {/* Wellness Score Card */}
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-r from-brand-navy to-brand-navy-light p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-300">
                Your Wellness Score
              </p>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-5xl font-bold">{mockUser.wellnessScore}</span>
                <span className="text-lg text-gray-300">/100</span>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <span
                  className={cn(
                    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                    getWellnessColor(mockUser.wellnessScore),
                    "text-white"
                  )}
                >
                  {getWellnessLabel(mockUser.wellnessScore)}
                </span>
                <span className="flex items-center text-xs text-green-400">
                  <TrendingUp className="mr-1 h-3 w-3" />
                  +5 from last week
                </span>
              </div>
            </div>
            <div className="relative h-24 w-24">
              <svg className="h-24 w-24 -rotate-90 transform">
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-white/20"
                />
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={251.2}
                  strokeDashoffset={251.2 * (1 - mockUser.wellnessScore / 100)}
                  className="text-brand-gold"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="h-8 w-8 text-brand-gold" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Daily Check-in */}
        <CardContent className="p-4">
          {!showCheckIn ? (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setShowCheckIn(true)}
            >
              Complete Today's Check-in
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <div className="space-y-4">
              <p className="text-sm font-medium">How are you feeling today?</p>
              <div className="grid grid-cols-5 gap-2">
                {wellnessQuestions.map((q) => (
                  <button
                    key={q.id}
                    className="flex flex-col items-center gap-1 rounded-lg border p-3 hover:bg-accent transition-colors"
                  >
                    <q.icon className={cn("h-5 w-5", q.color)} />
                    <span className="text-xs">{q.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upcoming Appointments */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Upcoming Sessions</h2>
          <Link
            href="/my-appointments"
            className="text-sm text-brand-gold hover:underline"
          >
            View all
          </Link>
        </div>
        <div className="space-y-3">
          {mockAppointments.map((apt) => (
            <Card key={apt.id}>
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-gold/10">
                  <Calendar className="h-6 w-6 text-brand-gold" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{apt.therapistName}</p>
                  <p className="text-sm text-muted-foreground truncate">
                    {apt.serviceName}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{apt.date}</p>
                  <p className="text-sm text-muted-foreground">{apt.time}</p>
                </div>
              </CardContent>
            </Card>
          ))}
          {mockAppointments.length === 0 && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8 text-center">
                <Calendar className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground">No upcoming sessions</p>
                <Button variant="gold" size="sm" className="mt-4" asChild>
                  <Link href="/booking/select-service">Book a Session</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Smart Recommendations */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Recommended for You</h2>
        <div className="space-y-3">
          {mockRecommendations.map((rec, i) => (
            <Link key={i} href={rec.href}>
              <Card className="transition-all hover:shadow-md hover:-translate-y-0.5">
                <CardContent className="flex items-center gap-4 p-4">
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-lg",
                      rec.type === "service"
                        ? "bg-blue-100 text-blue-600"
                        : "bg-green-100 text-green-600"
                    )}
                  >
                    <rec.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium">{rec.title}</p>
                    <p className="text-sm text-muted-foreground truncate">
                      {rec.description}
                    </p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
