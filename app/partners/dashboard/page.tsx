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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { createSupabaseClient } from "@/lib/supabase";
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
}

const navItems = [
  { id: "overview", label: "Overview", icon: Home },
  { id: "appointments", label: "Appointments", icon: Calendar },
  { id: "orders", label: "Orders", icon: ShoppingBag },
  { id: "services", label: "Services", icon: Package },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
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
  });

  const supabase = createSupabaseClient();

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
      await fetchDashboardData(providerAccount.id);
    } catch (error) {
      console.error("Auth error:", error);
      router.push("/partners/login");
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboardData = async (providerId: string) => {
    try {
      // Fetch appointments
      const { data: appointmentsData } = await supabase
        .from("appointments")
        .select("*")
        .eq("provider_id", providerId)
        .order("appointment_date", { ascending: true })
        .order("appointment_time", { ascending: true });

      if (appointmentsData) {
        setAppointments(appointmentsData);
      }

      // Fetch orders
      const { data: ordersData } = await supabase
        .from("provider_orders")
        .select("*")
        .eq("provider_id", providerId)
        .order("created_at", { ascending: false });

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
      });

    } catch (error) {
      console.error("Error fetching data:", error);
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
                            <div className="flex gap-1">
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
                                    onClick={() => updateAppointmentStatus(apt.id, "cancelled")}
                                    className="p-1.5 rounded-lg bg-red-100 text-red-600 hover:bg-red-200"
                                    title="Cancel"
                                  >
                                    <XCircle className="h-4 w-4" />
                                  </button>
                                </>
                              )}
                              {apt.status === "confirmed" && (
                                <button
                                  onClick={() => updateAppointmentStatus(apt.id, "completed")}
                                  className="p-1.5 rounded-lg bg-teal-100 text-teal-600 hover:bg-teal-200"
                                  title="Mark Complete"
                                >
                                  <CheckCircle2 className="h-4 w-4" />
                                </button>
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
                <h1 className="text-2xl font-bold text-slate-900">Services & Products</h1>
                <Button className="bg-teal-500 hover:bg-teal-600">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New
                </Button>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="h-12 w-12 rounded-xl bg-teal-100 flex items-center justify-center">
                        <Package className="h-6 w-6 text-teal-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">Services</h3>
                        <p className="text-sm text-slate-500">Manage your service offerings</p>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 mb-4">
                      Add, edit, or remove services. Set pricing, duration, and availability for each service.
                    </p>
                    <Button variant="outline" className="w-full">
                      Manage Services
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="h-12 w-12 rounded-xl bg-purple-100 flex items-center justify-center">
                        <ShoppingBag className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">Products</h3>
                        <p className="text-sm text-slate-500">Manage your product catalog</p>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 mb-4">
                      Add, edit, or remove products. Set pricing, stock levels, and product details.
                    </p>
                    <Button variant="outline" className="w-full">
                      Manage Products
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <Card className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-12 w-12 rounded-xl bg-amber-100 flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">Availability Schedule</h3>
                      <p className="text-sm text-slate-500">Set your working hours and blocked dates</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 mb-4">
                    Configure your weekly schedule and block specific dates for holidays or maintenance.
                  </p>
                  <Button variant="outline">
                    Configure Schedule
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === "analytics" && (
            <div className="space-y-6">
              <h1 className="text-2xl font-bold text-slate-900">Analytics</h1>
              
              <div className="grid md:grid-cols-3 gap-4">
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-6 text-center">
                    <p className="text-4xl font-bold text-teal-600">{stats.completedThisWeek}</p>
                    <p className="text-sm text-slate-500 mt-1">Completed This Week</p>
                  </CardContent>
                </Card>
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-6 text-center">
                    <p className="text-4xl font-bold text-purple-600">{stats.totalOrders}</p>
                    <p className="text-sm text-slate-500 mt-1">Total Orders</p>
                  </CardContent>
                </Card>
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-6 text-center">
                    <p className="text-4xl font-bold text-amber-600">{stats.revenue.toFixed(0)} AED</p>
                    <p className="text-sm text-slate-500 mt-1">Total Revenue</p>
                  </CardContent>
                </Card>
              </div>

              <Card className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-slate-900 mb-4">Performance Overview</h3>
                  <div className="h-64 flex items-center justify-center text-slate-400">
                    <div className="text-center">
                      <BarChart3 className="h-12 w-12 mx-auto mb-2" />
                      <p>Analytics charts coming soon</p>
                    </div>
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
    </div>
  );
}
