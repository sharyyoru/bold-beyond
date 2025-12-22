"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Shield,
  Users,
  Package,
  Briefcase,
  Building2,
  Star,
  TrendingUp,
  Calendar,
  ShoppingBag,
  Settings,
  LogOut,
  Menu,
  X,
  Home,
  UserPlus,
  Search,
  Filter,
  MoreVertical,
  Eye,
  EyeOff,
  Edit,
  Trash2,
  Plus,
  RefreshCw,
  ChevronRight,
  DollarSign,
  MessageSquare,
  Bell,
  CheckCircle,
  XCircle,
  Clock,
  BarChart3,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { createAdminClient } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { sanityClient } from "@/lib/sanity";

interface AdminAccount {
  id: string;
  email: string;
  full_name: string;
  role: string;
  is_active: boolean;
}

interface Stats {
  totalProducts: number;
  totalServices: number;
  totalProviders: number;
  totalReviews: number;
  totalAppointments: number;
  totalOrders: number;
  avgProductRating: number;
  avgServiceRating: number;
  avgProviderRating: number;
  pendingAppointments: number;
  pendingOrders: number;
}

interface ProviderAccountFull {
  id: string;
  provider_name: string;
  email: string;
  sanity_provider_id: string;
  created_at: string;
  user_id: string | null;
}

interface Appointment {
  id: string;
  customer_name: string;
  customer_email: string;
  service_name: string;
  service_price: number;
  appointment_date: string;
  appointment_time: string;
  status: string;
  payment_status: string;
  provider_id: string;
  sanity_provider_id: string;
  provider_name?: string;
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
  provider_id: string;
  sanity_provider_id: string;
  provider_name?: string;
}

const navItems = [
  { id: "overview", label: "Overview", icon: Home },
  { id: "appointments", label: "Appointments", icon: Calendar },
  { id: "orders", label: "Orders", icon: ShoppingBag },
  { id: "admins", label: "Admin Users", icon: Shield },
  { id: "partners", label: "Partners", icon: Building2 },
  { id: "reviews", label: "Reviews", icon: Star },
  { id: "settings", label: "Settings", icon: Settings },
];

export default function AdminDashboard() {
  const router = useRouter();
  const { toast } = useToast();
  const supabase = createAdminClient();
  
  const [admin, setAdmin] = useState<AdminAccount | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const [stats, setStats] = useState<Stats>({
    totalProducts: 0,
    totalServices: 0,
    totalProviders: 0,
    totalReviews: 0,
    totalAppointments: 0,
    totalOrders: 0,
    avgProductRating: 0,
    avgServiceRating: 0,
    avgProviderRating: 0,
    pendingAppointments: 0,
    pendingOrders: 0,
  });
  
  const [admins, setAdmins] = useState<AdminAccount[]>([]);
  const [partners, setPartners] = useState<ProviderAccountFull[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  
  // Modal states
  const [showAddAdmin, setShowAddAdmin] = useState(false);
  const [showAddPartner, setShowAddPartner] = useState(false);
  const [newAdmin, setNewAdmin] = useState({ email: "", full_name: "", role: "admin" });
  const [newPartner, setNewPartner] = useState({ email: "", provider_name: "", sanity_provider_id: "" });
  const [saving, setSaving] = useState(false);
  
  // Search/filter states
  const [reviewSearch, setReviewSearch] = useState("");
  const [reviewFilter, setReviewFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");
  
  // Appointments search/filter
  const [appointmentSearch, setAppointmentSearch] = useState("");
  const [appointmentStatusFilter, setAppointmentStatusFilter] = useState("all");
  const [appointmentProviderFilter, setAppointmentProviderFilter] = useState("all");
  
  // Orders search/filter
  const [orderSearch, setOrderSearch] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("all");
  const [orderProviderFilter, setOrderProviderFilter] = useState("all");

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push("/admin/login");
        return;
      }

      const { data: adminAccount, error } = await supabase
        .from("admin_accounts")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error || !adminAccount) {
        // Try by email as fallback
        const { data: adminByEmail } = await supabase
          .from("admin_accounts")
          .select("*")
          .eq("email", user.email)
          .single();
          
        if (!adminByEmail) {
          router.push("/admin/login");
          return;
        }
        
        // Link user_id
        await supabase
          .from("admin_accounts")
          .update({ user_id: user.id })
          .eq("id", adminByEmail.id);
          
        setAdmin(adminByEmail);
      } else {
        setAdmin(adminAccount);
      }

      await fetchAllData();
    } catch (error) {
      console.error("Auth error:", error);
      router.push("/admin/login");
    } finally {
      setLoading(false);
    }
  };

  const fetchAllData = async () => {
    await Promise.all([
      fetchStats(),
      fetchAdmins(),
      fetchPartners(),
      fetchReviews(),
      fetchAppointments(),
      fetchOrders(),
    ]);
  };

  const fetchStats = async () => {
    try {
      // Fetch from Sanity
      const [products, services, providers] = await Promise.all([
        sanityClient.fetch(`*[_type == "product"]{ rating, reviewCount }`),
        sanityClient.fetch(`*[_type == "service"]{ rating, reviewCount }`),
        sanityClient.fetch(`*[_type == "provider"]{ rating, reviewCount }`),
      ]);

      // Fetch from Supabase
      const [appointmentsRes, ordersRes, reviewsRes] = await Promise.all([
        supabase.from("appointments").select("status", { count: "exact" }),
        supabase.from("provider_orders").select("status", { count: "exact" }),
        supabase.from("reviews").select("*", { count: "exact" }),
      ]);

      const pendingAppts = appointmentsRes.data?.filter(a => a.status === "pending").length || 0;
      const pendingOrds = ordersRes.data?.filter(o => o.status === "pending").length || 0;

      // Calculate averages
      const productsWithRating = products.filter((p: any) => p.rating);
      const servicesWithRating = services.filter((s: any) => s.rating);
      const providersWithRating = providers.filter((p: any) => p.rating);

      setStats({
        totalProducts: products.length,
        totalServices: services.length,
        totalProviders: providers.length,
        totalReviews: reviewsRes.count || 0,
        totalAppointments: appointmentsRes.count || 0,
        totalOrders: ordersRes.count || 0,
        avgProductRating: productsWithRating.length > 0
          ? productsWithRating.reduce((sum: number, p: any) => sum + p.rating, 0) / productsWithRating.length
          : 0,
        avgServiceRating: servicesWithRating.length > 0
          ? servicesWithRating.reduce((sum: number, s: any) => sum + s.rating, 0) / servicesWithRating.length
          : 0,
        avgProviderRating: providersWithRating.length > 0
          ? providersWithRating.reduce((sum: number, p: any) => sum + p.rating, 0) / providersWithRating.length
          : 0,
        pendingAppointments: pendingAppts,
        pendingOrders: pendingOrds,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const fetchAdmins = async () => {
    const { data } = await supabase
      .from("admin_accounts")
      .select("*")
      .order("created_at", { ascending: false });
    setAdmins(data || []);
  };

  const fetchPartners = async () => {
    const { data } = await supabase
      .from("provider_accounts")
      .select("*")
      .order("created_at", { ascending: false });
    setPartners(data || []);
  };

  const fetchReviews = async () => {
    const { data } = await supabase
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false });
    setReviews(data || []);
  };

  const fetchAppointments = async () => {
    const { data } = await supabase
      .from("appointments")
      .select("*, provider_accounts(provider_name)")
      .order("appointment_date", { ascending: false })
      .order("appointment_time", { ascending: false });
    
    // Map provider names - prefer direct provider_name, then join, then Sanity lookup
    const appointmentsWithProviders = await Promise.all((data || []).map(async (apt: any) => {
      let providerName = apt.provider_name || apt.provider_accounts?.provider_name;
      
      // If still no provider name and we have sanity_provider_id, try to fetch from Sanity
      if (!providerName && apt.sanity_provider_id) {
        try {
          const provider = await sanityClient.fetch(
            `*[_type == "provider" && _id == $id][0]{ name }`,
            { id: apt.sanity_provider_id }
          );
          providerName = provider?.name;
        } catch (e) {
          console.log("Sanity fetch failed for provider:", apt.sanity_provider_id);
        }
      }
      
      return {
        ...apt,
        provider_name: providerName || "Unknown Provider",
      };
    }));
    setAppointments(appointmentsWithProviders);
  };

  const fetchOrders = async () => {
    const { data } = await supabase
      .from("provider_orders")
      .select("*, provider_accounts(provider_name)")
      .order("created_at", { ascending: false });
    
    // Map provider names from the join
    const ordersWithProviders = (data || []).map((order: any) => ({
      ...order,
      provider_name: order.provider_accounts?.provider_name || "Unknown Provider",
    }));
    setOrders(ordersWithProviders);
  };

  const updateAppointmentStatus = async (appointmentId: string, newStatus: string) => {
    try {
      await supabase
        .from("appointments")
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq("id", appointmentId);
      fetchAppointments();
      toast({ title: "Updated", description: `Appointment ${newStatus}` });
    } catch (error) {
      toast({ title: "Error", description: "Failed to update", variant: "destructive" });
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      await supabase
        .from("provider_orders")
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq("id", orderId);
      fetchOrders();
      toast({ title: "Updated", description: `Order ${newStatus}` });
    } catch (error) {
      toast({ title: "Error", description: "Failed to update", variant: "destructive" });
    }
  };

  const createAdmin = async () => {
    if (!newAdmin.email || !newAdmin.full_name) return;
    setSaving(true);
    
    try {
      // Generate temporary password
      const tempPassword = Math.random().toString(36).slice(-8) + "A1!";
      
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: newAdmin.email,
        password: tempPassword,
        email_confirm: true,
      });

      // If we can't use admin API, just create the account record
      const { error } = await supabase
        .from("admin_accounts")
        .insert({
          email: newAdmin.email,
          full_name: newAdmin.full_name,
          role: newAdmin.role,
          temp_password: tempPassword,
          password_changed: false,
          created_by: admin?.id,
        });

      if (error) throw error;

      toast({
        title: "Admin Created",
        description: `Temporary password: ${tempPassword}`,
      });
      
      setShowAddAdmin(false);
      setNewAdmin({ email: "", full_name: "", role: "admin" });
      fetchAdmins();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const createPartner = async () => {
    if (!newPartner.email || !newPartner.provider_name) return;
    setSaving(true);
    
    try {
      const { error } = await supabase
        .from("provider_accounts")
        .insert({
          email: newPartner.email,
          provider_name: newPartner.provider_name,
          provider_slug: newPartner.provider_name.toLowerCase().replace(/\s+/g, "-"),
          sanity_provider_id: newPartner.sanity_provider_id || null,
        });

      if (error) throw error;

      toast({
        title: "Partner Created",
        description: "Partner account created successfully",
      });
      
      setShowAddPartner(false);
      setNewPartner({ email: "", provider_name: "", sanity_provider_id: "" });
      fetchPartners();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const toggleAdminStatus = async (adminId: string, currentStatus: boolean) => {
    try {
      await supabase
        .from("admin_accounts")
        .update({ is_active: !currentStatus })
        .eq("id", adminId);
      
      fetchAdmins();
      toast({ title: "Updated", description: "Admin status changed" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to update", variant: "destructive" });
    }
  };

  const toggleReviewPublished = async (reviewId: string, currentStatus: boolean) => {
    try {
      await supabase
        .from("reviews")
        .update({ is_published: !currentStatus })
        .eq("id", reviewId);
      
      fetchReviews();
      toast({ title: "Updated", description: "Review visibility changed" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to update", variant: "destructive" });
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  // Filter reviews
  const filteredReviews = reviews.filter(review => {
    const matchesSearch = reviewSearch === "" || 
      review.item_name?.toLowerCase().includes(reviewSearch.toLowerCase()) ||
      review.user_name?.toLowerCase().includes(reviewSearch.toLowerCase()) ||
      review.review_text?.toLowerCase().includes(reviewSearch.toLowerCase());
    
    const matchesType = reviewFilter === "all" || review.item_type === reviewFilter;
    const matchesRating = ratingFilter === "all" || review.rating === parseInt(ratingFilter);
    
    return matchesSearch && matchesType && matchesRating;
  });

  // Filter appointments
  const filteredAppointments = appointments.filter(apt => {
    const matchesSearch = appointmentSearch === "" || 
      apt.customer_name?.toLowerCase().includes(appointmentSearch.toLowerCase()) ||
      apt.customer_email?.toLowerCase().includes(appointmentSearch.toLowerCase()) ||
      apt.service_name?.toLowerCase().includes(appointmentSearch.toLowerCase()) ||
      apt.provider_name?.toLowerCase().includes(appointmentSearch.toLowerCase());
    
    const matchesStatus = appointmentStatusFilter === "all" || apt.status === appointmentStatusFilter;
    const matchesProvider = appointmentProviderFilter === "all" || apt.provider_name === appointmentProviderFilter;
    
    return matchesSearch && matchesStatus && matchesProvider;
  });

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const matchesSearch = orderSearch === "" || 
      order.customer_name?.toLowerCase().includes(orderSearch.toLowerCase()) ||
      order.customer_email?.toLowerCase().includes(orderSearch.toLowerCase()) ||
      order.order_number?.toLowerCase().includes(orderSearch.toLowerCase()) ||
      order.provider_name?.toLowerCase().includes(orderSearch.toLowerCase());
    
    const matchesStatus = orderStatusFilter === "all" || order.status === orderStatusFilter;
    const matchesProvider = orderProviderFilter === "all" || order.provider_name === orderProviderFilter;
    
    return matchesSearch && matchesStatus && matchesProvider;
  });

  // Get unique provider names for filter dropdowns
  const uniqueProviders = Array.from(new Set(appointments.map(a => a.provider_name).filter(Boolean))) as string[];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-slate-900 px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <button onClick={() => setSidebarOpen(true)} className="p-2 text-white">
          <Menu className="h-6 w-6" />
        </button>
        <h1 className="font-bold text-white">Admin Portal</h1>
        <button className="p-2 text-white relative">
          <Bell className="h-6 w-6" />
          {(stats.pendingAppointments + stats.pendingOrders) > 0 && (
            <span className="absolute top-1 right-1 h-4 w-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">
              {stats.pendingAppointments + stats.pendingOrders}
            </span>
          )}
        </button>
      </div>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-72 bg-slate-900 z-50 transform transition-transform duration-300 lg:translate-x-0 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        <div className="p-6">
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden absolute top-4 right-4 p-2 text-slate-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>

          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-white">Admin Portal</h2>
              <p className="text-xs text-slate-400">Bold & Beyond</p>
            </div>
          </div>

          {/* Admin Info */}
          <div className="bg-slate-800 rounded-xl p-4 mb-6">
            <p className="text-white font-semibold truncate">{admin?.full_name}</p>
            <p className="text-xs text-slate-400 truncate">{admin?.email}</p>
            <span className={`inline-block mt-2 px-2 py-0.5 rounded text-xs font-medium ${
              admin?.role === "super_admin" ? "bg-red-500/20 text-red-400" : "bg-blue-500/20 text-blue-400"
            }`}>
              {admin?.role === "super_admin" ? "Super Admin" : "Admin"}
            </span>
          </div>

          {/* Navigation */}
          <nav className="space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeTab === item.id
                    ? "bg-red-500 text-white"
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
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-xl transition-all">
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
                  <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
                  <p className="text-slate-500">Welcome back, {admin?.full_name}</p>
                </div>
                <Button onClick={fetchAllData} variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-xl bg-purple-100 flex items-center justify-center">
                        <ShoppingBag className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-slate-900">{stats.totalProducts}</p>
                        <p className="text-xs text-slate-500">Products</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-xl bg-teal-100 flex items-center justify-center">
                        <Briefcase className="h-6 w-6 text-teal-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-slate-900">{stats.totalServices}</p>
                        <p className="text-xs text-slate-500">Services</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center">
                        <Building2 className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-slate-900">{stats.totalProviders}</p>
                        <p className="text-xs text-slate-500">Providers</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-xl bg-amber-100 flex items-center justify-center">
                        <Star className="h-6 w-6 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-slate-900">{stats.totalReviews}</p>
                        <p className="text-xs text-slate-500">Reviews</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Rating Overview */}
              <div className="grid md:grid-cols-3 gap-4">
                <Card className="border-0 shadow-sm bg-gradient-to-br from-purple-50 to-purple-100">
                  <CardContent className="p-6 text-center">
                    <ShoppingBag className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <p className="text-3xl font-bold text-purple-700">{stats.avgProductRating.toFixed(1)}</p>
                    <p className="text-sm text-purple-600">Avg Product Rating</p>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-sm bg-gradient-to-br from-teal-50 to-teal-100">
                  <CardContent className="p-6 text-center">
                    <Briefcase className="h-8 w-8 text-teal-600 mx-auto mb-2" />
                    <p className="text-3xl font-bold text-teal-700">{stats.avgServiceRating.toFixed(1)}</p>
                    <p className="text-sm text-teal-600">Avg Service Rating</p>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-blue-100">
                  <CardContent className="p-6 text-center">
                    <Building2 className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-3xl font-bold text-blue-700">{stats.avgProviderRating.toFixed(1)}</p>
                    <p className="text-sm text-blue-600">Avg Provider Rating</p>
                  </CardContent>
                </Card>
              </div>

              {/* Pending Items */}
              <div className="grid md:grid-cols-2 gap-4">
                <Card className="border-0 shadow-sm border-l-4 border-l-amber-500">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Clock className="h-6 w-6 text-amber-500" />
                      <div>
                        <p className="font-semibold text-slate-900">Pending Appointments</p>
                        <p className="text-sm text-slate-500">Awaiting confirmation</p>
                      </div>
                    </div>
                    <span className="text-2xl font-bold text-amber-600">{stats.pendingAppointments}</span>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-sm border-l-4 border-l-orange-500">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Package className="h-6 w-6 text-orange-500" />
                      <div>
                        <p className="font-semibold text-slate-900">Pending Orders</p>
                        <p className="text-sm text-slate-500">Awaiting processing</p>
                      </div>
                    </div>
                    <span className="text-2xl font-bold text-orange-600">{stats.pendingOrders}</span>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <Card className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-slate-900 mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <Button variant="outline" onClick={() => { setActiveTab("admins"); setShowAddAdmin(true); }} className="h-auto py-4 flex-col gap-2">
                      <UserPlus className="h-5 w-5" />
                      <span className="text-xs">Add Admin</span>
                    </Button>
                    <Button variant="outline" onClick={() => { setActiveTab("partners"); setShowAddPartner(true); }} className="h-auto py-4 flex-col gap-2">
                      <Building2 className="h-5 w-5" />
                      <span className="text-xs">Add Partner</span>
                    </Button>
                    <Button variant="outline" onClick={() => setActiveTab("reviews")} className="h-auto py-4 flex-col gap-2">
                      <MessageSquare className="h-5 w-5" />
                      <span className="text-xs">View Reviews</span>
                    </Button>
                    <Button variant="outline" onClick={() => setActiveTab("analytics")} className="h-auto py-4 flex-col gap-2">
                      <BarChart3 className="h-5 w-5" />
                      <span className="text-xs">Analytics</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Appointments Tab */}
          {activeTab === "appointments" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900">All Appointments</h1>
                <Button onClick={fetchAppointments} variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>

              {/* Search and Filters */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search customer, service, provider..."
                    value={appointmentSearch}
                    onChange={(e) => setAppointmentSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <select
                  value={appointmentStatusFilter}
                  onChange={(e) => setAppointmentStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="pending_payment">Pending Payment</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <select
                  value={appointmentProviderFilter}
                  onChange={(e) => setAppointmentProviderFilter(e.target.value)}
                  className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="all">All Providers</option>
                  {uniqueProviders.map(provider => (
                    <option key={provider} value={provider}>{provider}</option>
                  ))}
                </select>
              </div>

              <Card className="border-0 shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[800px]">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Customer</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Provider</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Service</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Date & Time</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Payment</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredAppointments.map((apt) => (
                        <tr key={apt.id} className="hover:bg-slate-50">
                          <td className="px-4 py-4">
                            <p className="font-medium text-slate-900">{apt.customer_name}</p>
                            <p className="text-xs text-slate-500">{apt.customer_email}</p>
                          </td>
                          <td className="px-4 py-4">
                            <span className="px-2 py-1 bg-teal-100 text-teal-700 rounded-full text-xs font-medium">
                              {apt.provider_name || "Unknown"}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <p className="text-sm text-slate-900">{apt.service_name}</p>
                            <p className="text-xs text-slate-500">{apt.service_price} AED</p>
                          </td>
                          <td className="px-4 py-4">
                            <p className="text-sm text-slate-900">{new Date(apt.appointment_date).toLocaleDateString()}</p>
                            <p className="text-xs text-slate-500">{apt.appointment_time}</p>
                          </td>
                          <td className="px-4 py-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              apt.payment_status === "paid" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                            }`}>
                              {apt.payment_status || "pending"}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              apt.status === "completed" ? "bg-green-100 text-green-700" :
                              apt.status === "confirmed" ? "bg-blue-100 text-blue-700" :
                              apt.status === "cancelled" ? "bg-red-100 text-red-700" :
                              "bg-amber-100 text-amber-700"
                            }`}>
                              {apt.status}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex gap-1">
                              {apt.status === "pending" && (
                                <>
                                  <Button size="sm" variant="ghost" onClick={() => updateAppointmentStatus(apt.id, "confirmed")}>
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                  </Button>
                                  <Button size="sm" variant="ghost" onClick={() => updateAppointmentStatus(apt.id, "cancelled")}>
                                    <XCircle className="h-4 w-4 text-red-500" />
                                  </Button>
                                </>
                              )}
                              {apt.status === "confirmed" && (
                                <Button size="sm" variant="ghost" onClick={() => updateAppointmentStatus(apt.id, "completed")}>
                                  <CheckCircle className="h-4 w-4 text-teal-500" />
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredAppointments.length === 0 && (
                    <div className="p-12 text-center text-slate-500">
                      <Calendar className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                      <p>{appointments.length === 0 ? "No appointments yet" : "No matching appointments"}</p>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === "orders" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900">All Orders</h1>
                <Button onClick={fetchOrders} variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>

              {/* Search and Filters */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search order, customer, provider..."
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <Card className="border-0 shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[800px]">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Order</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Provider</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Customer</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Total</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Payment</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-slate-50">
                          <td className="px-4 py-4">
                            <p className="font-medium text-slate-900">#{order.order_number}</p>
                            <p className="text-xs text-slate-500">{new Date(order.created_at).toLocaleDateString()}</p>
                          </td>
                          <td className="px-4 py-4">
                            <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                              {order.provider_name || "Unknown"}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <p className="text-sm text-slate-900">{order.customer_name}</p>
                            <p className="text-xs text-slate-500">{order.customer_email}</p>
                          </td>
                          <td className="px-4 py-4">
                            <p className="font-semibold text-slate-900">{order.total} AED</p>
                          </td>
                          <td className="px-4 py-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              order.payment_status === "paid" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                            }`}>
                              {order.payment_status || "pending"}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              order.status === "delivered" ? "bg-green-100 text-green-700" :
                              order.status === "shipped" ? "bg-blue-100 text-blue-700" :
                              order.status === "processing" ? "bg-indigo-100 text-indigo-700" :
                              "bg-amber-100 text-amber-700"
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex gap-1">
                              {order.status === "pending" && (
                                <Button size="sm" variant="ghost" onClick={() => updateOrderStatus(order.id, "processing")}>
                                  <CheckCircle className="h-4 w-4 text-blue-500" />
                                </Button>
                              )}
                              {order.status === "processing" && (
                                <Button size="sm" variant="ghost" onClick={() => updateOrderStatus(order.id, "shipped")}>
                                  <Package className="h-4 w-4 text-indigo-500" />
                                </Button>
                              )}
                              {order.status === "shipped" && (
                                <Button size="sm" variant="ghost" onClick={() => updateOrderStatus(order.id, "delivered")}>
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredOrders.length === 0 && (
                    <div className="p-12 text-center text-slate-500">
                      <ShoppingBag className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                      <p>No orders yet</p>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          )}

          {/* Admins Tab */}
          {activeTab === "admins" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-slate-900">Admin Users</h1>
                {admin?.role === "super_admin" && (
                  <Button onClick={() => setShowAddAdmin(true)} className="bg-red-500 hover:bg-red-600">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Admin
                  </Button>
                )}
              </div>

              <Card className="border-0 shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Name</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Email</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Role</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {admins.map((a) => (
                        <tr key={a.id} className="hover:bg-slate-50">
                          <td className="px-4 py-4 font-medium text-slate-900">{a.full_name}</td>
                          <td className="px-4 py-4 text-sm text-slate-600">{a.email}</td>
                          <td className="px-4 py-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              a.role === "super_admin" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"
                            }`}>
                              {a.role === "super_admin" ? "Super Admin" : "Admin"}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              a.is_active ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"
                            }`}>
                              {a.is_active ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            {admin?.role === "super_admin" && a.id !== admin.id && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleAdminStatus(a.id, a.is_active)}
                              >
                                {a.is_active ? <XCircle className="h-4 w-4 text-red-500" /> : <CheckCircle className="h-4 w-4 text-green-500" />}
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          )}

          {/* Partners Tab */}
          {activeTab === "partners" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-slate-900">Partner Accounts</h1>
                <Button onClick={() => setShowAddPartner(true)} className="bg-teal-500 hover:bg-teal-600">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Partner
                </Button>
              </div>

              <Card className="border-0 shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Provider Name</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Email</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Sanity ID</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Linked</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Created</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {partners.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-50">
                          <td className="px-4 py-4 font-medium text-slate-900">{p.provider_name}</td>
                          <td className="px-4 py-4 text-sm text-slate-600">{p.email}</td>
                          <td className="px-4 py-4 text-sm text-slate-500 font-mono">{p.sanity_provider_id || "-"}</td>
                          <td className="px-4 py-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              p.user_id ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                            }`}>
                              {p.user_id ? "Yes" : "Pending"}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-sm text-slate-500">
                            {new Date(p.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {partners.length === 0 && (
                    <div className="p-12 text-center text-slate-500">
                      <Building2 className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                      <p>No partners yet</p>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === "reviews" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-slate-900">Reviews Management</h1>
              </div>

              {/* Search and Filters */}
              <Card className="border-0 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <input
                        type="text"
                        value={reviewSearch}
                        onChange={(e) => setReviewSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="Search reviews..."
                      />
                    </div>
                    <select
                      value={reviewFilter}
                      onChange={(e) => setReviewFilter(e.target.value)}
                      className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <option value="all">All Types</option>
                      <option value="product">Products</option>
                      <option value="service">Services</option>
                      <option value="provider">Providers</option>
                    </select>
                    <select
                      value={ratingFilter}
                      onChange={(e) => setRatingFilter(e.target.value)}
                      className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <option value="all">All Ratings</option>
                      <option value="5">5 Stars</option>
                      <option value="4">4 Stars</option>
                      <option value="3">3 Stars</option>
                      <option value="2">2 Stars</option>
                      <option value="1">1 Star</option>
                    </select>
                  </div>
                </CardContent>
              </Card>

              {/* Reviews List */}
              <div className="space-y-4">
                {filteredReviews.length > 0 ? (
                  filteredReviews.map((review) => (
                    <Card key={review.id} className="border-0 shadow-sm">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                                review.item_type === "product" ? "bg-purple-100 text-purple-700" :
                                review.item_type === "service" ? "bg-teal-100 text-teal-700" :
                                "bg-blue-100 text-blue-700"
                              }`}>
                                {review.item_type}
                              </span>
                              <span className="text-sm font-medium text-slate-900">{review.item_name}</span>
                            </div>
                            <div className="flex items-center gap-1 mb-2">
                              {[1,2,3,4,5].map((star) => (
                                <Star key={star} className={`h-4 w-4 ${star <= review.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                              ))}
                              <span className="text-sm text-slate-500 ml-2">by {review.user_name || "Anonymous"}</span>
                            </div>
                            {review.review_text && (
                              <p className="text-sm text-slate-600">{review.review_text}</p>
                            )}
                            <p className="text-xs text-slate-400 mt-2">
                              {new Date(review.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              review.is_published ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"
                            }`}>
                              {review.is_published ? "Published" : "Hidden"}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleReviewPublished(review.id, review.is_published)}
                            >
                              {review.is_published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card className="border-0 shadow-sm">
                    <CardContent className="p-12 text-center">
                      <MessageSquare className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                      <p className="text-slate-500">No reviews found</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === "analytics" && (
            <div className="space-y-6">
              <h1 className="text-2xl font-bold text-slate-900">Analytics</h1>
              
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-slate-900 mb-4">Performance Overview</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Total Appointments</span>
                        <span className="font-semibold">{stats.totalAppointments}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Total Orders</span>
                        <span className="font-semibold">{stats.totalOrders}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Total Reviews</span>
                        <span className="font-semibold">{stats.totalReviews}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-sm">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-slate-900 mb-4">Catalog Size</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Products</span>
                        <span className="font-semibold">{stats.totalProducts}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Services</span>
                        <span className="font-semibold">{stats.totalServices}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Providers</span>
                        <span className="font-semibold">{stats.totalProviders}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <div className="space-y-6">
              <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
              
              <Card className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-slate-900 mb-4">Account Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                      <input
                        type="text"
                        value={admin?.full_name || ""}
                        readOnly
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg bg-slate-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                      <input
                        type="email"
                        value={admin?.email || ""}
                        readOnly
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg bg-slate-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                      <input
                        type="text"
                        value={admin?.role === "super_admin" ? "Super Admin" : "Admin"}
                        readOnly
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg bg-slate-50"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>

      {/* Add Admin Modal */}
      {showAddAdmin && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="p-6 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900">Add Admin User</h2>
                <button onClick={() => setShowAddAdmin(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                  <X className="h-5 w-5 text-slate-500" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  value={newAdmin.full_name}
                  onChange={(e) => setNewAdmin({ ...newAdmin, full_name: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email *</label>
                <input
                  type="email"
                  value={newAdmin.email}
                  onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="admin@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                <select
                  value={newAdmin.role}
                  onChange={(e) => setNewAdmin({ ...newAdmin, role: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="admin">Admin</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>
              <p className="text-sm text-slate-500">
                A temporary password will be generated. The user must change it on first login.
              </p>
            </div>
            <div className="p-6 border-t border-slate-100 flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setShowAddAdmin(false)}>
                Cancel
              </Button>
              <Button className="flex-1 bg-red-500 hover:bg-red-600" onClick={createAdmin} disabled={saving}>
                {saving ? "Creating..." : "Create Admin"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Add Partner Modal */}
      {showAddPartner && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="p-6 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900">Add Partner Account</h2>
                <button onClick={() => setShowAddPartner(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                  <X className="h-5 w-5 text-slate-500" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Provider Name *</label>
                <input
                  type="text"
                  value={newPartner.provider_name}
                  onChange={(e) => setNewPartner({ ...newPartner, provider_name: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Serenity Spa & Wellness"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email *</label>
                <input
                  type="email"
                  value={newPartner.email}
                  onChange={(e) => setNewPartner({ ...newPartner, email: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="partner@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Sanity Provider ID (optional)</label>
                <input
                  type="text"
                  value={newPartner.sanity_provider_id}
                  onChange={(e) => setNewPartner({ ...newPartner, sanity_provider_id: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Leave empty to create later"
                />
              </div>
              <p className="text-sm text-slate-500">
                The partner can sign up with this email to access their dashboard.
              </p>
            </div>
            <div className="p-6 border-t border-slate-100 flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setShowAddPartner(false)}>
                Cancel
              </Button>
              <Button className="flex-1 bg-teal-500 hover:bg-teal-600" onClick={createPartner} disabled={saving}>
                {saving ? "Creating..." : "Create Partner"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
