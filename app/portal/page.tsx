"use client";

import Link from "next/link";
import {
  Calendar,
  Clock,
  DollarSign,
  Users,
  TrendingUp,
  ChevronRight,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// Mock data
const mockTherapist = {
  name: "Dr. Aisha Rahman",
  todayAppointments: 5,
  weeklyRevenue: 8500,
  totalPatients: 48,
  rating: 4.9,
};

const mockTodaySchedule = [
  {
    id: "1",
    patientName: "Sarah M.",
    serviceName: "Psychotherapy Session",
    time: "9:00 AM",
    status: "completed",
    type: "online",
  },
  {
    id: "2",
    patientName: "Ahmed K.",
    serviceName: "Initial Consultation",
    time: "11:00 AM",
    status: "completed",
    type: "physical",
  },
  {
    id: "3",
    patientName: "Maria L.",
    serviceName: "CBT Session",
    time: "2:00 PM",
    status: "upcoming",
    type: "online",
  },
  {
    id: "4",
    patientName: "James W.",
    serviceName: "Follow-up Session",
    time: "4:00 PM",
    status: "upcoming",
    type: "physical",
  },
];

const stats = [
  {
    label: "Today's Sessions",
    value: mockTherapist.todayAppointments,
    icon: Calendar,
    color: "text-blue-500",
    bgColor: "bg-blue-50",
  },
  {
    label: "Week Revenue",
    value: `${mockTherapist.weeklyRevenue} AED`,
    icon: DollarSign,
    color: "text-green-500",
    bgColor: "bg-green-50",
  },
  {
    label: "Total Patients",
    value: mockTherapist.totalPatients,
    icon: Users,
    color: "text-purple-500",
    bgColor: "bg-purple-50",
  },
  {
    label: "Rating",
    value: mockTherapist.rating,
    icon: TrendingUp,
    color: "text-orange-500",
    bgColor: "bg-orange-50",
  },
];

function getStatusIcon(status: string) {
  switch (status) {
    case "completed":
      return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    case "cancelled":
      return <XCircle className="h-4 w-4 text-red-500" />;
    case "no_show":
      return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    default:
      return <Clock className="h-4 w-4 text-blue-500" />;
  }
}

export default function PortalDashboardPage() {
  return (
    <div className="container py-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Welcome, {mockTherapist.name}</h1>
        <p className="text-muted-foreground">
          Here's your practice overview for today
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-lg",
                    stat.bgColor
                  )}
                >
                  <stat.icon className={cn("h-5 w-5", stat.color)} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Today's Schedule */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Today's Schedule</h2>
          <Link
            href="/portal/schedule"
            className="text-sm text-brand-gold hover:underline"
          >
            View full calendar
          </Link>
        </div>
        <div className="space-y-3">
          {mockTodaySchedule.map((apt) => (
            <Card key={apt.id}>
              <CardContent className="flex items-center gap-4 p-4">
                {getStatusIcon(apt.status)}
                <div className="flex-1 min-w-0">
                  <p className="font-medium">{apt.patientName}</p>
                  <p className="text-sm text-muted-foreground truncate">
                    {apt.serviceName}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{apt.time}</p>
                  <span
                    className={cn(
                      "text-xs",
                      apt.type === "online"
                        ? "text-blue-500"
                        : "text-green-500"
                    )}
                  >
                    {apt.type === "online" ? "Online" : "In-Person"}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
            <Link href="/portal/schedule">
              <Calendar className="h-5 w-5" />
              <span>Manage Schedule</span>
            </Link>
          </Button>
          <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
            <Link href="/portal/patients">
              <Users className="h-5 w-5" />
              <span>View Patients</span>
            </Link>
          </Button>
          <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
            <Link href="/portal/services">
              <DollarSign className="h-5 w-5" />
              <span>Edit Services</span>
            </Link>
          </Button>
          <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
            <Link href="/portal/orders">
              <TrendingUp className="h-5 w-5" />
              <span>View Reports</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
