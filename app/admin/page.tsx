import Link from "next/link";
import {
  Users,
  UserCheck,
  Building2,
  DollarSign,
  TrendingUp,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Mock admin stats
const stats = [
  {
    title: "Total Users",
    value: "2,847",
    change: "+12.5%",
    trend: "up",
    icon: Users,
  },
  {
    title: "Active Therapists",
    value: "54",
    change: "+3",
    trend: "up",
    icon: UserCheck,
  },
  {
    title: "Partner Venues",
    value: "32",
    change: "+2",
    trend: "up",
    icon: Building2,
  },
  {
    title: "Monthly Revenue",
    value: "287,450 AED",
    change: "+18.2%",
    trend: "up",
    icon: DollarSign,
  },
];

const pendingApprovals = [
  { id: "1", name: "Dr. Sarah Johnson", type: "Therapist", date: "2 hours ago" },
  { id: "2", name: "Wellness Hub Dubai", type: "Partner", date: "5 hours ago" },
  { id: "3", name: "Coach Mike Chen", type: "Therapist", date: "1 day ago" },
];

const recentActivity = [
  { action: "New booking", user: "Sarah M.", service: "Psychotherapy", time: "5 min ago" },
  { action: "Payment received", user: "Ahmed K.", amount: "500 AED", time: "15 min ago" },
  { action: "Review posted", user: "Maria L.", rating: "5 stars", time: "1 hour ago" },
  { action: "Cancellation", user: "James W.", service: "Life Coaching", time: "2 hours ago" },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your platform metrics
          </p>
        </div>
        <Button variant="gold" asChild>
          <Link href="/admin/reports">View Reports</Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                {stat.trend === "up" ? (
                  <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
                ) : (
                  <ArrowDownRight className="mr-1 h-4 w-4 text-red-500" />
                )}
                <span className={stat.trend === "up" ? "text-green-500" : "text-red-500"}>
                  {stat.change}
                </span>
                <span className="ml-1">from last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Pending Approvals */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Pending Approvals</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {pendingApprovals.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
              >
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.type} • {item.date}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    Review
                  </Button>
                  <Button size="sm" variant="gold">
                    Approve
                  </Button>
                </div>
              </div>
            ))}
            {pendingApprovals.length === 0 && (
              <p className="text-center text-muted-foreground py-4">
                No pending approvals
              </p>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.map((activity, i) => (
              <div
                key={i}
                className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
              >
                <div>
                  <p className="font-medium">{activity.action}</p>
                  <p className="text-sm text-muted-foreground">
                    {activity.user} •{" "}
                    {activity.service || activity.amount || activity.rating}
                  </p>
                </div>
                <span className="text-sm text-muted-foreground">
                  {activity.time}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-4">
            <Button variant="outline" className="justify-start" asChild>
              <Link href="/admin/therapists">
                <UserCheck className="mr-2 h-4 w-4" />
                Manage Therapists
              </Link>
            </Button>
            <Button variant="outline" className="justify-start" asChild>
              <Link href="/admin/partners">
                <Building2 className="mr-2 h-4 w-4" />
                Manage Partners
              </Link>
            </Button>
            <Button variant="outline" className="justify-start" asChild>
              <Link href="/admin/content">
                <Calendar className="mr-2 h-4 w-4" />
                Update Content
              </Link>
            </Button>
            <Button variant="outline" className="justify-start" asChild>
              <Link href="/admin/users">
                <Users className="mr-2 h-4 w-4" />
                View All Users
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
