"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  ShoppingBag,
  MessageCircle,
  Heart,
  Filter,
  Search,
  ChevronRight,
  Clock,
  MapPin,
  Star,
  TrendingUp,
  TrendingDown,
  Activity,
  Brain,
  Moon,
  Zap,
  Smile,
  CheckCircle,
  XCircle,
  Package,
  Truck,
  BarChart3,
} from "lucide-react";
import { createSupabaseClient } from "@/lib/supabase";

interface Booking {
  id: string;
  service_title: string;
  provider_name: string;
  booking_date: string;
  booking_time: string;
  duration: number;
  price: number;
  status: string;
  wellness_dimensions: string[];
  wellness_contribution: number;
  created_at: string;
}

interface Purchase {
  id: string;
  product_name: string;
  provider_name: string;
  quantity: number;
  total_price: number;
  status: string;
  wellness_dimensions: string[];
  wellness_contribution: number;
  created_at: string;
}

interface WellnessCheckin {
  id: string;
  scores: Record<string, number>;
  created_at: string;
}

interface ChatLog {
  id: string;
  message: string;
  emotion_score: number;
  emotion: string;
  created_at: string;
}

type ActivityItem = {
  id: string;
  type: "booking" | "purchase" | "checkin" | "chat";
  title: string;
  subtitle: string;
  date: string;
  status?: string;
  wellness_contribution: number;
  wellness_dimensions: string[];
  icon: React.ElementType;
  color: string;
  data: any;
};

const dimensionConfig: Record<string, { icon: React.ElementType; color: string; label: string }> = {
  mind: { icon: Brain, color: "#0D9488", label: "Mind" },
  body: { icon: Activity, color: "#D4AF37", label: "Body" },
  sleep: { icon: Moon, color: "#6B9BC3", label: "Sleep" },
  energy: { icon: Zap, color: "#F4A261", label: "Energy" },
  mood: { icon: Smile, color: "#E9967A", label: "Mood" },
  stress: { icon: TrendingUp, color: "#B8A4C9", label: "Stress" },
};

const statusConfig: Record<string, { color: string; icon: React.ElementType }> = {
  confirmed: { color: "text-green-600 bg-green-50", icon: CheckCircle },
  completed: { color: "text-blue-600 bg-blue-50", icon: CheckCircle },
  cancelled: { color: "text-red-600 bg-red-50", icon: XCircle },
  pending: { color: "text-amber-600 bg-amber-50", icon: Clock },
  processing: { color: "text-amber-600 bg-amber-50", icon: Package },
  shipped: { color: "text-blue-600 bg-blue-50", icon: Truck },
  delivered: { color: "text-green-600 bg-green-50", icon: CheckCircle },
};

export default function ActivitiesPage() {
  const router = useRouter();
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"all" | "bookings" | "purchases" | "checkins" | "chats">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<"date" | "wellness">("date");
  const [filterDimension, setFilterDimension] = useState<string | null>(null);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const supabase = createSupabaseClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push("/appx/login");
        return;
      }

      // Fetch from user_activities table (paid appointments and orders)
      const { data: userActivities } = await supabase
        .from("user_activities")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      // Also fetch from legacy tables for backwards compatibility
      const [bookingsRes, purchasesRes, checkinsRes, chatsRes, appointmentsRes, ordersRes] = await Promise.all([
        supabase.from("bookings").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
        supabase.from("purchases").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
        supabase.from("wellness_checkins").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
        supabase.from("wellness_chat_logs").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
        supabase.from("appointments").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
        supabase.from("provider_orders").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
      ]);

      const allActivities: ActivityItem[] = [];

      // Process user_activities (from payment webhook)
      (userActivities || []).forEach((activity: any) => {
        const isBooking = activity.activity_type.includes("appointment") || activity.activity_type.includes("booking");
        allActivities.push({
          id: activity.id,
          type: isBooking ? "booking" : "purchase",
          title: activity.title,
          subtitle: activity.description || "",
          date: activity.created_at,
          status: activity.metadata?.status,
          wellness_contribution: 15,
          wellness_dimensions: isBooking ? ["body", "mind"] : ["body"],
          icon: isBooking ? Calendar : ShoppingBag,
          color: isBooking ? "#0D9488" : "#D4AF37",
          data: { ...activity, invoice_url: activity.metadata?.invoice_url, receipt_url: activity.metadata?.receipt_url },
        });
      });

      // Process all appointments (paid or confirmed)
      (appointmentsRes.data || []).forEach((apt: any) => {
        // Skip if already in userActivities
        if (userActivities?.some((ua: any) => ua.reference_id === apt.id)) return;
        // Include paid, confirmed, or pending appointments
        if (!["paid", "confirmed", "pending", "completed"].includes(apt.payment_status || apt.status)) return;
        allActivities.push({
          id: `apt-${apt.id}`,
          type: "booking",
          title: apt.service_name || "Service Appointment",
          subtitle: `${apt.appointment_date} at ${apt.appointment_time}`,
          date: apt.created_at,
          status: apt.status,
          wellness_contribution: 15,
          wellness_dimensions: ["body", "mind"],
          icon: Calendar,
          color: "#0D9488",
          data: apt,
        });
      });

      // Process all orders (paid or processing)
      (ordersRes.data || []).forEach((order: any) => {
        // Skip if already in userActivities
        if (userActivities?.some((ua: any) => ua.reference_id === order.id)) return;
        allActivities.push({
          id: `order-${order.id}`,
          type: "purchase",
          title: `Order #${order.order_number || order.id}`,
          subtitle: `${order.total_amount || order.total || 0} AED`,
          date: order.created_at,
          status: order.status,
          wellness_contribution: 10,
          wellness_dimensions: ["body"],
          icon: ShoppingBag,
          color: "#D4AF37",
          data: order,
        });
      });

      // Process legacy bookings
      (bookingsRes.data || []).forEach((booking: Booking) => {
        allActivities.push({
          id: booking.id,
          type: "booking",
          title: booking.service_title,
          subtitle: booking.provider_name || "Provider",
          date: booking.created_at,
          status: booking.status,
          wellness_contribution: booking.wellness_contribution || 15,
          wellness_dimensions: booking.wellness_dimensions || ["body", "mind"],
          icon: Calendar,
          color: "#0D9488",
          data: booking,
        });
      });

      // Process legacy purchases
      (purchasesRes.data || []).forEach((purchase: Purchase) => {
        allActivities.push({
          id: purchase.id,
          type: "purchase",
          title: purchase.product_name,
          subtitle: `Qty: ${purchase.quantity} • AED ${purchase.total_price}`,
          date: purchase.created_at,
          status: purchase.status,
          wellness_contribution: purchase.wellness_contribution || 10,
          wellness_dimensions: purchase.wellness_dimensions || ["body"],
          icon: ShoppingBag,
          color: "#D4AF37",
          data: purchase,
        });
      });

      // Process check-ins
      (checkinsRes.data || []).forEach((checkin: WellnessCheckin) => {
        const overallScore = checkin.scores?.overall || 60;
        allActivities.push({
          id: checkin.id,
          type: "checkin",
          title: "Wellness Check-in",
          subtitle: `Overall score: ${overallScore}%`,
          date: checkin.created_at,
          wellness_contribution: Math.round(overallScore / 5),
          wellness_dimensions: Object.keys(checkin.scores || {}),
          icon: Heart,
          color: "#E9967A",
          data: checkin,
        });
      });

      // Process chat logs (group by session/day)
      const chatsByDay: Record<string, ChatLog[]> = {};
      (chatsRes.data || []).forEach((chat: ChatLog) => {
        const day = new Date(chat.created_at).toDateString();
        if (!chatsByDay[day]) chatsByDay[day] = [];
        chatsByDay[day].push(chat);
      });

      Object.entries(chatsByDay).forEach(([day, chats]) => {
        const avgScore = Math.round(chats.reduce((sum, c) => sum + (c.emotion_score || 50), 0) / chats.length);
        allActivities.push({
          id: `chat-${day}`,
          type: "chat",
          title: "AI Wellness Chat",
          subtitle: `${chats.length} messages • Mood: ${avgScore}%`,
          date: chats[0].created_at,
          wellness_contribution: Math.round(avgScore / 10),
          wellness_dimensions: ["mood", "mind"],
          icon: MessageCircle,
          color: "#6B9BC3",
          data: { chats, avgScore },
        });
      });

      // Sort by date and remove duplicates
      allActivities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      setActivities(allActivities);
    } catch (error) {
      console.error("Error fetching activities:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort activities
  const filteredActivities = activities
    .filter((activity) => {
      if (activeTab !== "all" && activity.type !== activeTab.slice(0, -1)) return false;
      if (searchQuery && !activity.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (filterDimension && !activity.wellness_dimensions.includes(filterDimension)) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "wellness") {
        return b.wellness_contribution - a.wellness_contribution;
      }
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

  // Calculate stats
  const totalWellnessPoints = activities.reduce((sum, a) => sum + a.wellness_contribution, 0);
  const activityCounts = {
    bookings: activities.filter(a => a.type === "booking").length,
    purchases: activities.filter(a => a.type === "purchase").length,
    checkins: activities.filter(a => a.type === "checkin").length,
    chats: activities.filter(a => a.type === "chat").length,
  };

  // Group by date
  const groupedActivities: Record<string, ActivityItem[]> = {};
  filteredActivities.forEach((activity) => {
    const dateKey = new Date(activity.date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    if (!groupedActivities[dateKey]) groupedActivities[dateKey] = [];
    groupedActivities[dateKey].push(activity);
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        <div className="h-12 w-12 rounded-full border-4 border-[#0D9488] border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-100">
        <div className="px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center"
          >
            <ArrowLeft className="h-5 w-5 text-gray-700" />
          </button>
          <h1 className="font-semibold text-gray-900">My Activities</h1>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`h-10 w-10 rounded-full flex items-center justify-center ${
              showFilters ? "bg-[#0D9488] text-white" : "bg-gray-100 text-gray-700"
            }`}
          >
            <Filter className="h-5 w-5" />
          </button>
        </div>

        {/* Search */}
        <div className="px-4 pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search activities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0D9488]"
            />
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="px-4 pb-4 border-t border-gray-100 pt-3">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-gray-700">Sort by</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setSortBy("date")}
                  className={`px-3 py-1 rounded-full text-xs ${
                    sortBy === "date" ? "bg-[#0D9488] text-white" : "bg-gray-100 text-gray-600"
                  }`}
                >
                  Date
                </button>
                <button
                  onClick={() => setSortBy("wellness")}
                  className={`px-3 py-1 rounded-full text-xs ${
                    sortBy === "wellness" ? "bg-[#0D9488] text-white" : "bg-gray-100 text-gray-600"
                  }`}
                >
                  Wellness Impact
                </button>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Filter by dimension</p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFilterDimension(null)}
                  className={`px-3 py-1 rounded-full text-xs ${
                    !filterDimension ? "bg-[#0D9488] text-white" : "bg-gray-100 text-gray-600"
                  }`}
                >
                  All
                </button>
                {Object.entries(dimensionConfig).map(([key, config]) => (
                  <button
                    key={key}
                    onClick={() => setFilterDimension(key)}
                    className={`px-3 py-1 rounded-full text-xs flex items-center gap-1 ${
                      filterDimension === key ? "text-white" : "bg-gray-100 text-gray-600"
                    }`}
                    style={{ backgroundColor: filterDimension === key ? config.color : undefined }}
                  >
                    <config.icon className="h-3 w-3" />
                    {config.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Stats Summary */}
      <div className="px-4 py-4">
        <div className="bg-gradient-to-br from-[#0D9488] to-[#7DD3D3] rounded-2xl p-4 text-white">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Activity Summary</h3>
            <div className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full">
              <BarChart3 className="h-4 w-4" />
              <span className="text-sm font-medium">+{totalWellnessPoints} pts</span>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-2">
            <div className="bg-white/10 rounded-xl p-2 text-center">
              <Calendar className="h-5 w-5 mx-auto mb-1 opacity-80" />
              <p className="text-lg font-bold">{activityCounts.bookings}</p>
              <p className="text-xs opacity-80">Bookings</p>
            </div>
            <div className="bg-white/10 rounded-xl p-2 text-center">
              <ShoppingBag className="h-5 w-5 mx-auto mb-1 opacity-80" />
              <p className="text-lg font-bold">{activityCounts.purchases}</p>
              <p className="text-xs opacity-80">Purchases</p>
            </div>
            <div className="bg-white/10 rounded-xl p-2 text-center">
              <Heart className="h-5 w-5 mx-auto mb-1 opacity-80" />
              <p className="text-lg font-bold">{activityCounts.checkins}</p>
              <p className="text-xs opacity-80">Check-ins</p>
            </div>
            <div className="bg-white/10 rounded-xl p-2 text-center">
              <MessageCircle className="h-5 w-5 mx-auto mb-1 opacity-80" />
              <p className="text-lg font-bold">{activityCounts.chats}</p>
              <p className="text-xs opacity-80">Chats</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 mb-4">
        <div className="flex gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
          {[
            { id: "all", label: "All", count: activities.length },
            { id: "bookings", label: "Bookings", count: activityCounts.bookings },
            { id: "purchases", label: "Purchases", count: activityCounts.purchases },
            { id: "checkins", label: "Check-ins", count: activityCounts.checkins },
            { id: "chats", label: "Chats", count: activityCounts.chats },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? "bg-[#0D9488] text-white"
                  : "bg-white text-gray-600 border border-gray-200"
              }`}
            >
              <span className="text-sm font-medium">{tab.label}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                activeTab === tab.id ? "bg-white/20" : "bg-gray-100"
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Activities List */}
      <div className="px-4 pb-24">
        {Object.keys(groupedActivities).length === 0 ? (
          <div className="text-center py-12">
            <Activity className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">No activities yet</h3>
            <p className="text-sm text-gray-500 mb-4">Start your wellness journey by booking a service or doing a check-in</p>
            <div className="flex gap-3 justify-center">
              <Link
                href="/appx/services"
                className="px-4 py-2 bg-[#0D9488] text-white rounded-xl text-sm font-medium"
              >
                Explore Services
              </Link>
              <Link
                href="/appx/wellness-checkin"
                className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-medium"
              >
                Daily Check-in
              </Link>
            </div>
          </div>
        ) : (
          Object.entries(groupedActivities).map(([date, items]) => (
            <div key={date} className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 mb-3">{date}</h3>
              <div className="space-y-3">
                {items.map((activity) => (
                  <div
                    key={activity.id}
                    className="bg-white rounded-2xl p-4 shadow-sm"
                  >
                    <div className="flex items-start gap-3">
                      {/* Icon */}
                      <div
                        className="h-12 w-12 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${activity.color}15` }}
                      >
                        <activity.icon className="h-6 w-6" style={{ color: activity.color }} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className="font-medium text-gray-900 truncate">{activity.title}</h4>
                            <p className="text-sm text-gray-500">{activity.subtitle}</p>
                          </div>
                          {activity.status && statusConfig[activity.status] && (
                            <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${statusConfig[activity.status].color}`}>
                              {(() => {
                                const StatusIcon = statusConfig[activity.status].icon;
                                return <StatusIcon className="h-3 w-3" />;
                              })()}
                              {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                            </span>
                          )}
                        </div>

                        {/* Wellness Contribution */}
                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {activity.wellness_dimensions.slice(0, 3).map((dim) => {
                              const config = dimensionConfig[dim];
                              if (!config) return null;
                              return (
                                <div
                                  key={dim}
                                  className="flex items-center gap-1 px-2 py-1 rounded-full text-xs"
                                  style={{ backgroundColor: `${config.color}15`, color: config.color }}
                                >
                                  <config.icon className="h-3 w-3" />
                                  {config.label}
                                </div>
                              );
                            })}
                          </div>
                          <div className="flex items-center gap-1 text-sm font-medium text-green-600">
                            <TrendingUp className="h-4 w-4" />
                            +{activity.wellness_contribution} pts
                          </div>
                        </div>

                        {/* Time */}
                        <p className="text-xs text-gray-400 mt-2">
                          {new Date(activity.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
