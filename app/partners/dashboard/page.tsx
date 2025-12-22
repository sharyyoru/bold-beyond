"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Calendar,
  Package,
  ShoppingBag,
  Users,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronRight,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  Home,
  BarChart3,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Phone,
  Mail,
  RefreshCw,
  Star,
  MessageSquare,
  Edit,
  Trash2,
  Image,
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { createPartnerClient } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

interface ProviderAccount {
  id: string;
  provider_name: string;
  provider_slug: string;
  email: string;
  sanity_provider_id: string;
}

interface Appointment {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  service_name: string;
  service_price: number;
  appointment_date: string;
  appointment_time: string;
  duration_minutes: number;
  status: string;
  notes: string;
}

interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  total: number;
  status: string;
  payment_status: string;
  created_at: string;
}

interface Stats {
  todayAppointments: number;
  pendingAppointments: number;
  totalOrders: number;
  pendingOrders: number;
  revenue: number;
  completedThisWeek: number;
  averageRating: number;
  totalReviews: number;
}

interface SanityService {
  _id: string;
  title: string;
  slug: { current: string };
  category: string;
  basePrice: number;
  duration: number;
  rating?: number;
  reviewCount?: number;
  image?: any;
}

interface SanityProduct {
  _id: string;
  name: string;
  slug: { current: string };
  category: string;
  price: number;
  salePrice?: number;
  stock?: number;
  rating?: number;
  reviewCount?: number;
  images?: any[];
}

interface Review {
  _id: string;
  rating: number;
  review?: string;
  customerName?: string;
  itemType: string;
  itemName: string;
  createdAt: string;
}

const navItems = [
  { id: "overview", label: "Overview", icon: Home },
  { id: "appointments", label: "Appointments", icon: Calendar },
  { id: "orders", label: "Orders", icon: ShoppingBag },
  { id: "services", label: "Services", icon: Package },
  { id: "products", label: "Products", icon: ShoppingBag },
  { id: "reviews", label: "Reviews", icon: Star },
  { id: "settings", label: "Settings", icon: Settings },
];

const statusColors: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  confirmed: "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
  rescheduled: "bg-purple-100 text-purple-700",
  processing: "bg-blue-100 text-blue-700",
  shipped: "bg-indigo-100 text-indigo-700",
  delivered: "bg-green-100 text-green-700",
};

export default function PartnerDashboard() {
  const router = useRouter();
  const { toast } = useToast();
  const [provider, setProvider] = useState<ProviderAccount | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<Stats>({
    todayAppointments: 0,
    pendingAppointments: 0,
    totalOrders: 0,
    pendingOrders: 0,
    revenue: 0,
    completedThisWeek: 0,
    averageRating: 0,
    totalReviews: 0,
  });
  const [services, setServices] = useState<SanityService[]>([]);
  const [products, setProducts] = useState<SanityProduct[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showAddModal, setShowAddModal] = useState<"service" | "product" | null>(null);
  const [newItem, setNewItem] = useState<any>({});
  const [saving, setSaving] = useState(false);
  
  // Cancellation and Rescheduling state
  const [showCancelModal, setShowCancelModal] = useState<Appointment | null>(null);
  const [showRescheduleModal, setShowRescheduleModal] = useState<Appointment | null>(null);
  const [cancelReason, setCancelReason] = useState("");
  const [rescheduleData, setRescheduleData] = useState({ date: "", time: "", reason: "" });
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  
  // Availability schedule state
  const [schedule, setSchedule] = useState<{
    [key: number]: { isOpen: boolean; openTime: string; closeTime: string };
  }>({
    0: { isOpen: false, openTime: "09:00", closeTime: "18:00" }, // Sunday
    1: { isOpen: true, openTime: "09:00", closeTime: "18:00" },  // Monday
    2: { isOpen: true, openTime: "09:00", closeTime: "18:00" },  // Tuesday
    3: { isOpen: true, openTime: "09:00", closeTime: "18:00" },  // Wednesday
    4: { isOpen: true, openTime: "09:00", closeTime: "18:00" },  // Thursday
    5: { isOpen: true, openTime: "09:00", closeTime: "18:00" },  // Friday
    6: { isOpen: false, openTime: "09:00", closeTime: "18:00" }, // Saturday
  });
  const [serviceDurations, setServiceDurations] = useState<{ [key: string]: number }>({});

  const supabase = createPartnerClient();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push("/partners/login");
        return;
      }

      const { data: providerAccount, error } = await supabase
        .from("provider_accounts")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error || !providerAccount) {
        router.push("/partners/login");
        return;
      }

      setProvider(providerAccount);
      await fetchDashboardData(providerAccount.id, providerAccount.sanity_provider_id);
      await fetchSanityData(providerAccount.sanity_provider_id);
      await fetchSchedule(providerAccount.id);
    } catch (error) {
      console.error("Auth error:", error);
      router.push("/partners/login");
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboardData = async (providerId: string, sanityProviderId?: string) => {
    try {
      console.log("Fetching dashboard data for:", { providerId, sanityProviderId });
      
      // Fetch ALL appointments first to see what's in the database (for debugging)
      const { data: allAppts, error: allError } = await supabase
        .from("appointments")
        .select("id, provider_id, sanity_provider_id, customer_name, status")
        .limit(10);
      
      console.log("All appointments in DB (first 10):", allAppts, allError);
      
      // Fetch appointments - the RLS policy should handle provider filtering
      const { data: appointmentsData, error: apptError } = await supabase
        .from("appointments")
        .select("*")
        .order("appointment_date", { ascending: true })
        .order("appointment_time", { ascending: true });
      
      console.log("Appointments for this provider:", appointmentsData, apptError);
      
      if (apptError) {
        console.error("Error fetching appointments:", apptError);
      }

      if (appointmentsData) {
        setAppointments(appointmentsData);
      }

      // Fetch orders
      const { data: ordersData } = await supabase
        .from("provider_orders")
        .select("*")
        .or(`provider_id.eq.${providerId},sanity_provider_id.eq.${sanityProviderId}`)
        .order("created_at", { ascending: false });

      console.log("Orders fetched for provider:", { providerId, sanityProviderId, count: ordersData?.length });

      if (ordersData) {
        setOrders(ordersData);
      }

      // Calculate stats
      const today = new Date().toISOString().split("T")[0];
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

      const todayAppts = appointmentsData?.filter(a => a.appointment_date === today) || [];
      const pendingAppts = appointmentsData?.filter(a => a.status === "pending") || [];
      const pendingOrds = ordersData?.filter(o => o.status === "pending") || [];
      const completedWeek = appointmentsData?.filter(a => 
        a.status === "completed" && a.appointment_date >= weekAgo
      ) || [];
      const totalRevenue = ordersData?.reduce((sum, o) => sum + (o.total || 0), 0) || 0;

      setStats({
        todayAppointments: todayAppts.length,
        pendingAppointments: pendingAppts.length,
        totalOrders: ordersData?.length || 0,
        pendingOrders: pendingOrds.length,
        revenue: totalRevenue,
        completedThisWeek: completedWeek.length,
        averageRating: 0,
        totalReviews: 0,
      });

    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchSanityData = async (sanityProviderId: string) => {
    try {
      // Fetch services for this provider
      const servicesRes = await fetch(`/api/sanity/mutate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "fetch",
          data: {
            query: `*[_type == "service" && provider._ref == $providerId] | order(title asc) {
              _id, title, "slug": slug.current, category, basePrice, duration, rating, reviewCount, image
            }`,
            params: { providerId: sanityProviderId }
          }
        })
      });
      const servicesData = await servicesRes.json();
      if (servicesData.success) {
        setServices(servicesData.result || []);
        
        // Calculate average rating from services
        const servicesWithRatings = (servicesData.result || []).filter((s: SanityService) => s.rating);
        const avgServiceRating = servicesWithRatings.length > 0 
          ? servicesWithRatings.reduce((sum: number, s: SanityService) => sum + (s.rating || 0), 0) / servicesWithRatings.length 
          : 0;
        const totalServiceReviews = (servicesData.result || []).reduce((sum: number, s: SanityService) => sum + (s.reviewCount || 0), 0);
        
        setStats(prev => ({
          ...prev,
          averageRating: avgServiceRating,
          totalReviews: totalServiceReviews,
        }));
      }

      // Fetch products for this provider
      const productsRes = await fetch(`/api/sanity/mutate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "fetch",
          data: {
            query: `*[_type == "product" && provider._ref == $providerId] | order(name asc) {
              _id, name, "slug": slug.current, category, price, salePrice, stock, rating, reviewCount, images
            }`,
            params: { providerId: sanityProviderId }
          }
        })
      });
      const productsData = await productsRes.json();
      if (productsData.success) {
        setProducts(productsData.result || []);
        
        // Add product reviews to total
        const totalProductReviews = (productsData.result || []).reduce((sum: number, p: SanityProduct) => sum + (p.reviewCount || 0), 0);
        setStats(prev => ({
          ...prev,
          totalReviews: prev.totalReviews + totalProductReviews,
        }));
      }

    } catch (error) {
      console.error("Error fetching Sanity data:", error);
    }
  };

  const createService = async () => {
    if (!provider || !newItem.title) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/sanity/mutate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create",
          data: {
            _type: "service",
            title: newItem.title,
            slug: { _type: "slug", current: newItem.title.toLowerCase().replace(/\s+/g, "-") },
            description: newItem.description || "",
            category: newItem.category || "wellness",
            basePrice: parseFloat(newItem.basePrice) || 0,
            duration: parseInt(newItem.duration) || 60,
            provider: { _type: "reference", _ref: provider.sanity_provider_id },
            rating: 0,
            reviewCount: 0,
          }
        })
      });
      const data = await res.json();
      if (data.success) {
        toast({ title: "Success", description: "Service created" });
        setShowAddModal(null);
        setNewItem({});
        fetchSanityData(provider.sanity_provider_id);
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to create service", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const createProduct = async () => {
    if (!provider || !newItem.name) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/sanity/mutate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create",
          data: {
            _type: "product",
            name: newItem.name,
            slug: { _type: "slug", current: newItem.name.toLowerCase().replace(/\s+/g, "-") },
            description: newItem.description || "",
            category: newItem.category || "wellness",
            price: parseFloat(newItem.price) || 0,
            salePrice: newItem.salePrice ? parseFloat(newItem.salePrice) : undefined,
            stock: parseInt(newItem.stock) || 0,
            provider: { _type: "reference", _ref: provider.sanity_provider_id },
            rating: 0,
            reviewCount: 0,
            isActive: true,
          }
        })
      });
      const data = await res.json();
      if (data.success) {
        toast({ title: "Success", description: "Product created" });
        setShowAddModal(null);
        setNewItem({});
        fetchSanityData(provider.sanity_provider_id);
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to create product", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const fetchSchedule = async (providerId: string) => {
    try {
      const { data } = await supabase
        .from("provider_schedules")
        .select("*")
        .eq("provider_id", providerId);

      if (data && data.length > 0) {
        const scheduleMap: { [key: number]: { isOpen: boolean; openTime: string; closeTime: string } } = {};
        data.forEach((item: any) => {
          scheduleMap[item.day_of_week] = {
            isOpen: item.is_open,
            openTime: item.open_time || "09:00",
            closeTime: item.close_time || "18:00",
          };
        });
        setSchedule(prev => ({ ...prev, ...scheduleMap }));
      }

      // Fetch service durations
      const { data: durations } = await supabase
        .from("service_durations")
        .select("*")
        .eq("provider_id", providerId);

      if (durations) {
        const durationMap: { [key: string]: number } = {};
        durations.forEach((d: any) => {
          durationMap[d.service_id] = d.duration_minutes;
        });
        setServiceDurations(durationMap);
      }
    } catch (error) {
      console.error("Error fetching schedule:", error);
    }
  };

  const saveSchedule = async () => {
    if (!provider) return;
    setSaving(true);
    try {
      // Delete existing schedule
      await supabase
        .from("provider_schedules")
        .delete()
        .eq("provider_id", provider.id);

      // Insert new schedule
      const scheduleData = Object.entries(schedule).map(([day, data]) => ({
        provider_id: provider.id,
        day_of_week: parseInt(day),
        is_open: data.isOpen,
        open_time: data.openTime,
        close_time: data.closeTime,
      }));

      const { error } = await supabase
        .from("provider_schedules")
        .insert(scheduleData);

      if (error) throw error;

      toast({ title: "Saved", description: "Schedule updated successfully" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to save schedule", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const saveServiceDuration = async (serviceId: string, serviceName: string, duration: number) => {
    if (!provider) return;
    try {
      const { error } = await supabase
        .from("service_durations")
        .upsert({
          provider_id: provider.id,
          service_id: serviceId,
          service_name: serviceName,
          duration_minutes: duration,
        }, { onConflict: "provider_id,service_id" });

      if (error) throw error;

      setServiceDurations(prev => ({ ...prev, [serviceId]: duration }));
      toast({ title: "Saved", description: "Duration updated" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to save duration", variant: "destructive" });
    }
  };

  const updateAppointmentStatus = async (appointmentId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("appointments")
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq("id", appointmentId);

      if (error) throw error;

      setAppointments(prev => 
        prev.map(a => a.id === appointmentId ? { ...a, status: newStatus } : a)
      );

      toast({
        title: "Updated",
        description: `Appointment ${newStatus}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update appointment",
        variant: "destructive",
      });
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("provider_orders")
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq("id", orderId);

      if (error) throw error;

      setOrders(prev => 
        prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o)
      );

      toast({
        title: "Updated",
        description: `Order ${newStatus}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update order",
        variant: "destructive",
      });
    }
  };

  // Cancel appointment with refund
  const handleCancelAppointment = async () => {
    if (!showCancelModal || !provider) return;
    setSaving(true);
    try {
      // Check 1-hour rule
      const appointmentDateTime = new Date(`${showCancelModal.appointment_date}T${showCancelModal.appointment_time}`);
      const now = new Date();
      const hoursBefore = (appointmentDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);

      if (hoursBefore < 1) {
        toast({ title: "Error", description: "Cannot cancel appointment less than 1 hour before scheduled time", variant: "destructive" });
        return;
      }

      const response = await fetch("/api/appointments/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appointmentId: showCancelModal.id,
          cancelledBy: "provider",
          reason: cancelReason,
        }),
      });

      const data = await response.json();
      if (data.success) {
        toast({ title: "Cancelled", description: `Appointment cancelled. ${data.refundAmount} AED refunded to customer wallet.` });
        setAppointments(prev => prev.map(a => a.id === showCancelModal.id ? { ...a, status: "cancelled" } : a));
        setShowCancelModal(null);
        setCancelReason("");
      } else {
        toast({ title: "Error", description: data.error, variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to cancel appointment", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  // Request reschedule
  const handleRescheduleRequest = async () => {
    if (!showRescheduleModal || !provider || !rescheduleData.date || !rescheduleData.time) return;
    setSaving(true);
    try {
      const response = await fetch("/api/appointments/reschedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appointmentId: showRescheduleModal.id,
          providerId: provider.id,
          proposedDate: rescheduleData.date,
          proposedTime: rescheduleData.time,
          reason: rescheduleData.reason,
        }),
      });

      const data = await response.json();
      if (data.success) {
        toast({ title: "Sent", description: "Reschedule request sent to customer. They have 24 hours to respond." });
        setShowRescheduleModal(null);
        setRescheduleData({ date: "", time: "", reason: "" });
      } else {
        toast({ title: "Error", description: data.error, variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to send reschedule request", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  // Cancel order with refund
  const handleCancelOrder = async (order: Order) => {
    if (!provider) return;
    try {
      const response = await fetch("/api/orders/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: order.id,
          cancelledBy: "provider",
          reason: "Cancelled by provider",
        }),
      });

      const data = await response.json();
      if (data.success) {
        toast({ title: "Cancelled", description: `Order cancelled. ${data.refundAmount} AED refunded to customer wallet.` });
        setOrders(prev => prev.map(o => o.id === order.id ? { ...o, status: "cancelled" } : o));
      } else {
        toast({ title: "Error", description: data.error, variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to cancel order", variant: "destructive" });
    }
  };

  // Fetch notifications
  const fetchNotifications = async () => {
    if (!provider) return;
    try {
      const { data } = await supabase
        .from("provider_notifications")
        .select("*")
        .eq("provider_id", provider.id)
        .order("created_at", { ascending: false })
        .limit(20);
      setNotifications(data || []);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  // Mark notification as read
  const markNotificationRead = async (notificationId: string) => {
    try {
      await supabase
        .from("provider_notifications")
        .update({ is_read: true })
        .eq("id", notificationId);
      setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n));
    } catch (error) {
      console.error("Error marking notification read:", error);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/partners/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <button onClick={() => setSidebarOpen(true)} className="p-2 hover:bg-slate-100 rounded-lg">
          <Menu className="h-6 w-6 text-slate-600" />
        </button>
        <h1 className="font-bold text-slate-900">{provider?.provider_name}</h1>
        <button className="p-2 hover:bg-slate-100 rounded-lg relative">
          <Bell className="h-6 w-6 text-slate-600" />
          {stats.pendingAppointments > 0 && (
            <span className="absolute top-1 right-1 h-4 w-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">
              {stats.pendingAppointments}
            </span>
          )}
        </button>
      </div>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-72 bg-slate-900 z-50 transform transition-transform duration-300 lg:translate-x-0 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        <div className="p-6">
          {/* Close button (mobile) */}
          <button 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden absolute top-4 right-4 p-2 text-slate-400 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center">
              <Package className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-white">Partner Portal</h2>
              <p className="text-xs text-slate-400">Bold & Beyond</p>
            </div>
          </div>

          {/* Provider Info */}
          <div className="bg-slate-800 rounded-xl p-4 mb-6">
            <p className="text-white font-semibold truncate">{provider?.provider_name}</p>
            <p className="text-xs text-slate-400 truncate">{provider?.email}</p>
          </div>

          {/* Navigation */}
          <nav className="space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeTab === item.id
                    ? "bg-teal-500 text-white"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Logout */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-xl transition-all"
          >
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-72 min-h-screen">
        <div className="p-4 lg:p-8">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
                  <p className="text-slate-500">Welcome back, {provider?.provider_name}</p>
                </div>
                <Button 
                  onClick={() => provider && fetchDashboardData(provider.id)}
                  variant="outline"
                  size="sm"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-xl bg-teal-100 flex items-center justify-center">
                        <Calendar className="h-6 w-6 text-teal-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-slate-900">{stats.todayAppointments}</p>
                        <p className="text-xs text-slate-500">Today's Appts</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-xl bg-amber-100 flex items-center justify-center">
                        <Clock className="h-6 w-6 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-slate-900">{stats.pendingAppointments}</p>
                        <p className="text-xs text-slate-500">Pending</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-xl bg-purple-100 flex items-center justify-center">
                        <ShoppingBag className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-slate-900">{stats.totalOrders}</p>
                        <p className="text-xs text-slate-500">Total Orders</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-xl bg-green-100 flex items-center justify-center">
                        <TrendingUp className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-slate-900">{stats.revenue.toFixed(0)} AED</p>
                        <p className="text-xs text-slate-500">Revenue</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Rating Stats */}
              <div className="grid grid-cols-2 gap-4">
                <Card className="border-0 shadow-sm bg-gradient-to-br from-amber-50 to-amber-100">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-xl bg-amber-200 flex items-center justify-center">
                        <Star className="h-6 w-6 text-amber-600 fill-amber-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-slate-900">{stats.averageRating.toFixed(1)}</p>
                        <p className="text-xs text-slate-500">Avg Rating</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-blue-100">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-xl bg-blue-200 flex items-center justify-center">
                        <MessageSquare className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-slate-900">{stats.totalReviews}</p>
                        <p className="text-xs text-slate-500">Total Reviews</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Appointments */}
              <Card className="border-0 shadow-sm">
                <CardContent className="p-0">
                  <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="font-semibold text-slate-900">Upcoming Appointments</h3>
                    <button 
                      onClick={() => setActiveTab("appointments")}
                      className="text-sm text-teal-600 hover:underline"
                    >
                      View All
                    </button>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {appointments.slice(0, 5).map((apt) => (
                      <div key={apt.id} className="p-4 flex items-center justify-between hover:bg-slate-50">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center">
                            <span className="text-sm font-semibold text-slate-600">
                              {apt.customer_name.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">{apt.customer_name}</p>
                            <p className="text-sm text-slate-500">{apt.service_name}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-slate-900">
                            {new Date(apt.appointment_date).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-slate-500">{apt.appointment_time}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[apt.status]}`}>
                          {apt.status}
                        </span>
                      </div>
                    ))}
                    {appointments.length === 0 && (
                      <div className="p-8 text-center text-slate-500">
                        No appointments yet
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Orders */}
              <Card className="border-0 shadow-sm">
                <CardContent className="p-0">
                  <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="font-semibold text-slate-900">Recent Orders</h3>
                    <button 
                      onClick={() => setActiveTab("orders")}
                      className="text-sm text-teal-600 hover:underline"
                    >
                      View All
                    </button>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {orders.slice(0, 5).map((order) => (
                      <div key={order.id} className="p-4 flex items-center justify-between hover:bg-slate-50">
                        <div>
                          <p className="font-medium text-slate-900">#{order.order_number}</p>
                          <p className="text-sm text-slate-500">{order.customer_name}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-slate-900">{order.total} AED</p>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                    ))}
                    {orders.length === 0 && (
                      <div className="p-8 text-center text-slate-500">
                        No orders yet
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Appointments Tab */}
          {activeTab === "appointments" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-slate-900">Appointments</h1>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => provider && fetchDashboardData(provider.id, provider.sanity_provider_id)}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </div>

              <Card className="border-0 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Customer</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Service</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Date & Time</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {appointments.map((apt) => (
                        <tr key={apt.id} className="hover:bg-slate-50">
                          <td className="px-4 py-4">
                            <div>
                              <p className="font-medium text-slate-900">{apt.customer_name}</p>
                              <p className="text-xs text-slate-500">{apt.customer_email}</p>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <p className="text-sm text-slate-900">{apt.service_name}</p>
                            <p className="text-xs text-slate-500">{apt.service_price} AED</p>
                          </td>
                          <td className="px-4 py-4">
                            <p className="text-sm text-slate-900">
                              {new Date(apt.appointment_date).toLocaleDateString()}
                            </p>
                            <p className="text-xs text-slate-500">{apt.appointment_time}</p>
                          </td>
                          <td className="px-4 py-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[apt.status]}`}>
                              {apt.status}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex gap-1 flex-wrap">
                              {apt.status === "pending" && (
                                <>
                                  <button
                                    onClick={() => updateAppointmentStatus(apt.id, "confirmed")}
                                    className="p-1.5 rounded-lg bg-green-100 text-green-600 hover:bg-green-200"
                                    title="Confirm"
                                  >
                                    <CheckCircle2 className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => setShowCancelModal(apt)}
                                    className="p-1.5 rounded-lg bg-red-100 text-red-600 hover:bg-red-200"
                                    title="Cancel & Refund"
                                  >
                                    <XCircle className="h-4 w-4" />
                                  </button>
                                </>
                              )}
                              {apt.status === "confirmed" && (
                                <>
                                  <button
                                    onClick={() => updateAppointmentStatus(apt.id, "completed")}
                                    className="p-1.5 rounded-lg bg-teal-100 text-teal-600 hover:bg-teal-200"
                                    title="Mark Complete"
                                  >
                                    <CheckCircle2 className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => setShowRescheduleModal(apt)}
                                    className="p-1.5 rounded-lg bg-amber-100 text-amber-600 hover:bg-amber-200"
                                    title="Reschedule"
                                  >
                                    <Clock className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => setShowCancelModal(apt)}
                                    className="p-1.5 rounded-lg bg-red-100 text-red-600 hover:bg-red-200"
                                    title="Cancel & Refund"
                                  >
                                    <XCircle className="h-4 w-4" />
                                  </button>
                                </>
                              )}
                              <a
                                href={`tel:${apt.customer_phone}`}
                                className="p-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200"
                                title="Call"
                              >
                                <Phone className="h-4 w-4" />
                              </a>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {appointments.length === 0 && (
                    <div className="p-12 text-center text-slate-500">
                      <Calendar className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                      <p>No appointments yet</p>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === "orders" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-slate-900">Orders</h1>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </div>

              <Card className="border-0 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Order</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Customer</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Total</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {orders.map((order) => (
                        <tr key={order.id} className="hover:bg-slate-50">
                          <td className="px-4 py-4">
                            <p className="font-medium text-slate-900">#{order.order_number}</p>
                            <p className="text-xs text-slate-500">
                              {new Date(order.created_at).toLocaleDateString()}
                            </p>
                          </td>
                          <td className="px-4 py-4">
                            <p className="text-sm text-slate-900">{order.customer_name}</p>
                            <p className="text-xs text-slate-500">{order.customer_email}</p>
                          </td>
                          <td className="px-4 py-4">
                            <p className="font-semibold text-slate-900">{order.total} AED</p>
                          </td>
                          <td className="px-4 py-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex gap-1">
                              {order.status === "pending" && (
                                <button
                                  onClick={() => updateOrderStatus(order.id, "processing")}
                                  className="p-1.5 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200"
                                  title="Process"
                                >
                                  <CheckCircle2 className="h-4 w-4" />
                                </button>
                              )}
                              {order.status === "processing" && (
                                <button
                                  onClick={() => updateOrderStatus(order.id, "shipped")}
                                  className="p-1.5 rounded-lg bg-indigo-100 text-indigo-600 hover:bg-indigo-200"
                                  title="Ship"
                                >
                                  <Package className="h-4 w-4" />
                                </button>
                              )}
                              {order.status === "shipped" && (
                                <button
                                  onClick={() => updateOrderStatus(order.id, "delivered")}
                                  className="p-1.5 rounded-lg bg-green-100 text-green-600 hover:bg-green-200"
                                  title="Deliver"
                                >
                                  <CheckCircle2 className="h-4 w-4" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {orders.length === 0 && (
                    <div className="p-12 text-center text-slate-500">
                      <ShoppingBag className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                      <p>No orders yet</p>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          )}

          {/* Services Tab */}
          {activeTab === "services" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-slate-900">My Services</h1>
                <Button onClick={() => { setShowAddModal("service"); setNewItem({}); }} className="bg-teal-500 hover:bg-teal-600">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Service
                </Button>
              </div>

              {services.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {services.map((service) => (
                    <Card key={service._id} className="border-0 shadow-sm overflow-hidden">
                      <div className="h-32 bg-gradient-to-br from-teal-100 to-teal-200 flex items-center justify-center">
                        <Package className="h-12 w-12 text-teal-600" />
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-slate-900 mb-1">{service.title}</h3>
                        <p className="text-sm text-slate-500 mb-2">{service.category}</p>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-teal-600">{service.basePrice} AED</span>
                          <span className="text-xs text-slate-400">{service.duration} min</span>
                        </div>
                        {service.rating && (
                          <div className="flex items-center gap-1 mt-2">
                            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                            <span className="text-sm font-medium">{service.rating.toFixed(1)}</span>
                            <span className="text-xs text-slate-400">({service.reviewCount || 0})</span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-12 text-center">
                    <Package className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                    <p className="text-slate-500">No services yet</p>
                    <p className="text-sm text-slate-400 mt-1">Add your first service to get started</p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Products Tab */}
          {activeTab === "products" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-slate-900">My Products</h1>
                <Button onClick={() => { setShowAddModal("product"); setNewItem({}); }} className="bg-purple-500 hover:bg-purple-600">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </div>

              {products.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {products.map((product) => (
                    <Card key={product._id} className="border-0 shadow-sm overflow-hidden">
                      <div className="h-32 bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
                        <ShoppingBag className="h-12 w-12 text-purple-600" />
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-slate-900 mb-1">{product.name}</h3>
                        <p className="text-sm text-slate-500 mb-2">{product.category}</p>
                        <div className="flex items-center justify-between">
                          <div>
                            {product.salePrice ? (
                              <>
                                <span className="font-bold text-purple-600">{product.salePrice} AED</span>
                                <span className="text-xs text-slate-400 line-through ml-2">{product.price}</span>
                              </>
                            ) : (
                              <span className="font-bold text-purple-600">{product.price} AED</span>
                            )}
                          </div>
                          <span className="text-xs text-slate-400">Stock: {product.stock || 0}</span>
                        </div>
                        {product.rating && (
                          <div className="flex items-center gap-1 mt-2">
                            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                            <span className="text-sm font-medium">{product.rating.toFixed(1)}</span>
                            <span className="text-xs text-slate-400">({product.reviewCount || 0})</span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-12 text-center">
                    <ShoppingBag className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                    <p className="text-slate-500">No products yet</p>
                    <p className="text-sm text-slate-400 mt-1">Add your first product to get started</p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === "reviews" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-slate-900">Reviews & Ratings</h1>
              </div>

              {/* Rating Summary */}
              <Card className="border-0 shadow-sm bg-gradient-to-br from-amber-50 to-orange-50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-5xl font-bold text-amber-600">{stats.averageRating.toFixed(1)}</p>
                      <div className="flex items-center justify-center gap-1 mt-2">
                        {[1,2,3,4,5].map((star) => (
                          <Star key={star} className={`h-5 w-5 ${star <= Math.round(stats.averageRating) ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
                        ))}
                      </div>
                      <p className="text-sm text-slate-500 mt-1">{stats.totalReviews} total reviews</p>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900 mb-3">Rating Breakdown</h3>
                      <div className="space-y-2">
                        {[5,4,3,2,1].map((rating) => (
                          <div key={rating} className="flex items-center gap-2">
                            <span className="text-sm text-slate-600 w-8">{rating}★</span>
                            <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                              <div className="h-full bg-amber-400 rounded-full" style={{ width: `${rating * 20}%` }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Services Reviews */}
              <Card className="border-0 shadow-sm">
                <CardContent className="p-0">
                  <div className="p-4 border-b border-slate-100">
                    <h3 className="font-semibold text-slate-900">Service Reviews</h3>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {services.filter(s => s.rating).map((service) => (
                      <div key={service._id} className="p-4 flex items-center justify-between">
                        <div>
                          <p className="font-medium text-slate-900">{service.title}</p>
                          <p className="text-sm text-slate-500">{service.category}</p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                            <span className="font-medium">{service.rating?.toFixed(1)}</span>
                          </div>
                          <p className="text-xs text-slate-400">{service.reviewCount || 0} reviews</p>
                        </div>
                      </div>
                    ))}
                    {services.filter(s => s.rating).length === 0 && (
                      <div className="p-8 text-center text-slate-500">No service reviews yet</div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Products Reviews */}
              <Card className="border-0 shadow-sm">
                <CardContent className="p-0">
                  <div className="p-4 border-b border-slate-100">
                    <h3 className="font-semibold text-slate-900">Product Reviews</h3>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {products.filter(p => p.rating).map((product) => (
                      <div key={product._id} className="p-4 flex items-center justify-between">
                        <div>
                          <p className="font-medium text-slate-900">{product.name}</p>
                          <p className="text-sm text-slate-500">{product.category}</p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                            <span className="font-medium">{product.rating?.toFixed(1)}</span>
                          </div>
                          <p className="text-xs text-slate-400">{product.reviewCount || 0} reviews</p>
                        </div>
                      </div>
                    ))}
                    {products.filter(p => p.rating).length === 0 && (
                      <div className="p-8 text-center text-slate-500">No product reviews yet</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <div className="space-y-6">
              <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
              
              <Card className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-slate-900 mb-4">Business Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Business Name</label>
                      <input
                        type="text"
                        value={provider?.provider_name || ""}
                        readOnly
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg bg-slate-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                      <input
                        type="email"
                        value={provider?.email || ""}
                        readOnly
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg bg-slate-50"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Availability Schedule */}
              <Card className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-slate-900">Availability Schedule</h3>
                    <Button onClick={saveSchedule} disabled={saving} size="sm" className="bg-teal-500 hover:bg-teal-600">
                      {saving ? "Saving..." : "Save Schedule"}
                    </Button>
                  </div>
                  <p className="text-sm text-slate-500 mb-4">Set your opening and closing times for each day of the week.</p>
                  <div className="space-y-3">
                    {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((day, index) => (
                      <div key={day} className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg">
                        <div className="w-24">
                          <span className="text-sm font-medium text-slate-700">{day}</span>
                        </div>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={schedule[index]?.isOpen || false}
                            onChange={(e) => setSchedule(prev => ({
                              ...prev,
                              [index]: { ...prev[index], isOpen: e.target.checked }
                            }))}
                            className="w-4 h-4 text-teal-500 rounded"
                          />
                          <span className="text-sm text-slate-600">Open</span>
                        </label>
                        {schedule[index]?.isOpen && (
                          <>
                            <input
                              type="time"
                              value={schedule[index]?.openTime || "09:00"}
                              onChange={(e) => setSchedule(prev => ({
                                ...prev,
                                [index]: { ...prev[index], openTime: e.target.value }
                              }))}
                              className="px-2 py-1 border border-slate-200 rounded text-sm"
                            />
                            <span className="text-slate-400">to</span>
                            <input
                              type="time"
                              value={schedule[index]?.closeTime || "18:00"}
                              onChange={(e) => setSchedule(prev => ({
                                ...prev,
                                [index]: { ...prev[index], closeTime: e.target.value }
                              }))}
                              className="px-2 py-1 border border-slate-200 rounded text-sm"
                            />
                          </>
                        )}
                        {!schedule[index]?.isOpen && (
                          <span className="text-sm text-slate-400">Closed</span>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Service Durations */}
              <Card className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-slate-900 mb-4">Service Durations</h3>
                  <p className="text-sm text-slate-500 mb-4">Set how long each service takes for booking calendar.</p>
                  {services.length > 0 ? (
                    <div className="space-y-3">
                      {services.map((service) => (
                        <div key={service._id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                          <span className="text-sm font-medium text-slate-700">{service.title}</span>
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              value={serviceDurations[service._id] || service.duration || 60}
                              onChange={(e) => saveServiceDuration(service._id, service.title, parseInt(e.target.value))}
                              className="w-20 px-2 py-1 border border-slate-200 rounded text-sm text-center"
                              min="15"
                              step="15"
                            />
                            <span className="text-sm text-slate-500">min</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-400 text-center py-4">Add services to set their durations</p>
                  )}
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-slate-900 mb-4">Notifications</h3>
                  <div className="space-y-3">
                    {[
                      { label: "New appointment notifications", enabled: true },
                      { label: "Order notifications", enabled: true },
                      { label: "Email reminders", enabled: false },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <span className="text-sm text-slate-700">{item.label}</span>
                        <button className={`w-12 h-6 rounded-full transition-all ${
                          item.enabled ? "bg-teal-500" : "bg-slate-300"
                        }`}>
                          <div className={`h-5 w-5 bg-white rounded-full shadow transition-transform ${
                            item.enabled ? "translate-x-6" : "translate-x-0.5"
                          }`} />
                        </button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>

      {/* Add Service/Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900">
                  Add New {showAddModal === "service" ? "Service" : "Product"}
                </h2>
                <button onClick={() => setShowAddModal(null)} className="p-2 hover:bg-slate-100 rounded-lg">
                  <X className="h-5 w-5 text-slate-500" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              {showAddModal === "service" ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Service Name *</label>
                    <input
                      type="text"
                      value={newItem.title || ""}
                      onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="e.g., Deep Tissue Massage"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                    <textarea
                      value={newItem.description || ""}
                      onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      rows={3}
                      placeholder="Describe your service..."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Price (AED) *</label>
                      <input
                        type="number"
                        value={newItem.basePrice || ""}
                        onChange={(e) => setNewItem({ ...newItem, basePrice: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        placeholder="150"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Duration (min)</label>
                      <input
                        type="number"
                        value={newItem.duration || ""}
                        onChange={(e) => setNewItem({ ...newItem, duration: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        placeholder="60"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                    <select
                      value={newItem.category || ""}
                      onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="">Select category</option>
                      <option value="massage">Massage</option>
                      <option value="facial">Facial</option>
                      <option value="yoga">Yoga</option>
                      <option value="fitness">Fitness</option>
                      <option value="therapy">Therapy</option>
                      <option value="coaching">Coaching</option>
                      <option value="wellness">Wellness</option>
                    </select>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Product Name *</label>
                    <input
                      type="text"
                      value={newItem.name || ""}
                      onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="e.g., Aromatherapy Oil Set"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                    <textarea
                      value={newItem.description || ""}
                      onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      rows={3}
                      placeholder="Describe your product..."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Price (AED) *</label>
                      <input
                        type="number"
                        value={newItem.price || ""}
                        onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="99"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Sale Price</label>
                      <input
                        type="number"
                        value={newItem.salePrice || ""}
                        onChange={(e) => setNewItem({ ...newItem, salePrice: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="79"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Stock</label>
                      <input
                        type="number"
                        value={newItem.stock || ""}
                        onChange={(e) => setNewItem({ ...newItem, stock: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                      <select
                        value={newItem.category || ""}
                        onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="">Select category</option>
                        <option value="wellness">Wellness</option>
                        <option value="self-care">Self-Care</option>
                        <option value="supplements">Supplements</option>
                        <option value="equipment">Equipment</option>
                        <option value="books">Books</option>
                      </select>
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="p-6 border-t border-slate-100 flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setShowAddModal(null)}>
                Cancel
              </Button>
              <Button
                className={`flex-1 ${showAddModal === "service" ? "bg-teal-500 hover:bg-teal-600" : "bg-purple-500 hover:bg-purple-600"}`}
                onClick={showAddModal === "service" ? createService : createProduct}
                disabled={saving}
              >
                {saving ? "Saving..." : `Create ${showAddModal === "service" ? "Service" : "Product"}`}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Appointment Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-900">Cancel Appointment</h2>
              <p className="text-sm text-slate-500 mt-1">This will refund the customer to their wallet</p>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="font-medium text-slate-900">{showCancelModal.service_name}</p>
                <p className="text-sm text-slate-500">{showCancelModal.customer_name}</p>
                <p className="text-sm text-slate-500">
                  {new Date(showCancelModal.appointment_date).toLocaleDateString()} at {showCancelModal.appointment_time}
                </p>
                <p className="text-sm font-medium text-teal-600 mt-2">Refund: {showCancelModal.service_price} AED</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Reason for cancellation</label>
                <textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  rows={3}
                  placeholder="Enter reason..."
                />
              </div>
            </div>
            <div className="p-6 border-t border-slate-100 flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => { setShowCancelModal(null); setCancelReason(""); }}>
                Keep Appointment
              </Button>
              <Button
                className="flex-1 bg-red-500 hover:bg-red-600"
                onClick={handleCancelAppointment}
                disabled={saving}
              >
                {saving ? "Cancelling..." : "Cancel & Refund"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Reschedule Appointment Modal */}
      {showRescheduleModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-900">Reschedule Appointment</h2>
              <p className="text-sm text-slate-500 mt-1">Customer will be notified and can accept or decline</p>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="font-medium text-slate-900">{showRescheduleModal.service_name}</p>
                <p className="text-sm text-slate-500">{showRescheduleModal.customer_name}</p>
                <p className="text-sm text-slate-500">
                  Current: {new Date(showRescheduleModal.appointment_date).toLocaleDateString()} at {showRescheduleModal.appointment_time}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">New Date</label>
                  <input
                    type="date"
                    value={rescheduleData.date}
                    onChange={(e) => setRescheduleData({ ...rescheduleData, date: e.target.value })}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">New Time</label>
                  <input
                    type="time"
                    value={rescheduleData.time}
                    onChange={(e) => setRescheduleData({ ...rescheduleData, time: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Reason (optional)</label>
                <textarea
                  value={rescheduleData.reason}
                  onChange={(e) => setRescheduleData({ ...rescheduleData, reason: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  rows={2}
                  placeholder="Enter reason for rescheduling..."
                />
              </div>
            </div>
            <div className="p-6 border-t border-slate-100 flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => { setShowRescheduleModal(null); setRescheduleData({ date: "", time: "", reason: "" }); }}>
                Cancel
              </Button>
              <Button
                className="flex-1 bg-teal-500 hover:bg-teal-600"
                onClick={handleRescheduleRequest}
                disabled={saving || !rescheduleData.date || !rescheduleData.time}
              >
                {saving ? "Sending..." : "Send Request"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Notifications Panel */}
      {showNotifications && (
        <div className="fixed inset-0 bg-black/50 flex items-end lg:items-center justify-center z-50" onClick={() => setShowNotifications(false)}>
          <div className="bg-white rounded-t-2xl lg:rounded-2xl max-w-md w-full max-h-[80vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-bold text-slate-900">Notifications</h2>
              <button onClick={() => setShowNotifications(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="overflow-y-auto max-h-[60vh]">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-slate-500">
                  <Bell className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                  <p>No notifications yet</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => markNotificationRead(notification.id)}
                    className={`p-4 border-b border-slate-100 cursor-pointer hover:bg-slate-50 ${!notification.is_read ? "bg-teal-50" : ""}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center ${!notification.is_read ? "bg-teal-100" : "bg-slate-100"}`}>
                        <Bell className={`h-5 w-5 ${!notification.is_read ? "text-teal-600" : "text-slate-400"}`} />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-slate-900">{notification.title}</p>
                        <p className="text-sm text-slate-500">{notification.message}</p>
                        <p className="text-xs text-slate-400 mt-1">
                          {new Date(notification.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
