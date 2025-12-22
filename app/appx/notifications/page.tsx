"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Bell,
  Calendar,
  ShoppingBag,
  CreditCard,
  CheckCircle,
  Clock,
  Megaphone,
  Settings,
  Trash2,
  Check,
} from "lucide-react";
import { createAppClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  reference_id?: string;
  reference_type?: string;
  is_read: boolean;
  created_at: string;
}

const typeConfig: Record<string, { icon: React.ElementType; color: string; bgColor: string }> = {
  appointment_reminder: { icon: Calendar, color: "#0D9488", bgColor: "#0D948815" },
  appointment_confirmed: { icon: CheckCircle, color: "#10B981", bgColor: "#10B98115" },
  appointment_cancelled: { icon: Calendar, color: "#EF4444", bgColor: "#EF444415" },
  order_update: { icon: ShoppingBag, color: "#D4AF37", bgColor: "#D4AF3715" },
  payment: { icon: CreditCard, color: "#8B5CF6", bgColor: "#8B5CF615" },
  promotion: { icon: Megaphone, color: "#F59E0B", bgColor: "#F59E0B15" },
  system: { icon: Settings, color: "#6B7280", bgColor: "#6B728015" },
};

export default function NotificationsPage() {
  const router = useRouter();
  const supabase = createAppClient();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  useEffect(() => {
    fetchNotifications();
    
    // Set up real-time subscription
    const channel = supabase
      .channel("notifications")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "user_notifications",
        },
        (payload) => {
          setNotifications((prev) => [payload.new as Notification, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchNotifications = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push("/appx/login");
        return;
      }

      const { data, error } = await supabase
        .from("user_notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setNotifications(data || []);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await supabase
        .from("user_notifications")
        .update({ is_read: true })
        .eq("id", notificationId);

      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, is_read: true } : n))
      );
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase
        .from("user_notifications")
        .update({ is_read: true })
        .eq("user_id", user.id)
        .eq("is_read", false);

      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      await supabase
        .from("user_notifications")
        .delete()
        .eq("id", notificationId);

      setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const filteredNotifications = filter === "unread" 
    ? notifications.filter((n) => !n.is_read)
    : notifications;

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

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
          <div className="flex items-center gap-2">
            <h1 className="font-semibold text-gray-900">Notifications</h1>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-sm text-[#0D9488] font-medium"
            >
              Mark all read
            </button>
          )}
          {unreadCount === 0 && <div className="w-10" />}
        </div>

        {/* Filter Tabs */}
        <div className="px-4 pb-3 flex gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              filter === "all"
                ? "bg-[#0D9488] text-white"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            All ({notifications.length})
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              filter === "unread"
                ? "bg-[#0D9488] text-white"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            Unread ({unreadCount})
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="px-4 py-4">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">
              {filter === "unread" ? "No unread notifications" : "No notifications yet"}
            </h3>
            <p className="text-sm text-gray-500">
              {filter === "unread"
                ? "You're all caught up!"
                : "We'll notify you about appointments, orders, and more"}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((notification) => {
              const config = typeConfig[notification.type] || typeConfig.system;
              const Icon = config.icon;

              return (
                <div
                  key={notification.id}
                  className={`bg-white rounded-2xl p-4 shadow-sm transition-all ${
                    !notification.is_read ? "border-l-4 border-l-[#0D9488]" : ""
                  }`}
                  onClick={() => !notification.is_read && markAsRead(notification.id)}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="h-12 w-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: config.bgColor }}
                    >
                      <Icon className="h-6 w-6" style={{ color: config.color }} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className={`font-medium ${!notification.is_read ? "text-gray-900" : "text-gray-600"}`}>
                            {notification.title}
                          </h4>
                          <p className="text-sm text-gray-500 mt-0.5">
                            {notification.message}
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notification.id);
                          }}
                          className="p-1 hover:bg-gray-100 rounded-lg"
                        >
                          <Trash2 className="h-4 w-4 text-gray-400" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <p className="text-xs text-gray-400">
                          {formatTime(notification.created_at)}
                        </p>
                        {!notification.is_read && (
                          <span className="flex items-center gap-1 text-xs text-[#0D9488]">
                            <div className="h-2 w-2 rounded-full bg-[#0D9488]" />
                            New
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
