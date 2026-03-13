"use client";

import { useState, useEffect } from "react";
import { 
  Search, 
  Filter, 
  Building2, 
  Mail, 
  Phone, 
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  MessageCircle,
  Sparkles,
  ChevronDown,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface PartnerApplication {
  id: string;
  business_name: string;
  contact_name: string;
  email: string;
  phone: string;
  website: string | null;
  service_category: string;
  description: string;
  experience: string;
  location: string;
  status: "new" | "contacted" | "approved" | "rejected";
  created_at: string;
  updated_at?: string;
}

const statusConfig = {
  new: { 
    label: "New", 
    color: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    icon: Sparkles
  },
  contacted: { 
    label: "Contacted", 
    color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    icon: MessageCircle
  },
  approved: { 
    label: "Approved", 
    color: "bg-green-500/20 text-green-400 border-green-500/30",
    icon: CheckCircle2
  },
  rejected: { 
    label: "Rejected", 
    color: "bg-red-500/20 text-red-400 border-red-500/30",
    icon: XCircle
  },
};

const serviceCategories = [
  "All Categories",
  "Psychotherapy",
  "Life Coaching",
  "Couples Therapy",
  "Group Sessions",
  "Wellness Retreats",
  "Corporate Wellness",
  "Yoga & Meditation",
  "Nutrition Coaching",
  "Other",
];

export default function PartnerApplicationsPage() {
  const { toast } = useToast();
  const [applications, setApplications] = useState<PartnerApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedApp, setSelectedApp] = useState<PartnerApplication | null>(null);

  const fetchApplications = async () => {
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.set("status", statusFilter);
      if (categoryFilter !== "all") params.set("category", categoryFilter);
      if (search) params.set("search", search);

      const response = await fetch(`/api/partner-applications?${params}`);
      const data = await response.json();
      
      if (data.applications) {
        setApplications(data.applications);
      }
    } catch (error) {
      console.error("Failed to fetch applications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [statusFilter, categoryFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchApplications();
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const response = await fetch("/api/partner-applications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });

      if (response.ok) {
        toast({
          title: "Status Updated",
          description: `Application status changed to ${newStatus}`,
        });
        fetchApplications();
        if (selectedApp?.id === id) {
          setSelectedApp({ ...selectedApp, status: newStatus as any });
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const stats = {
    total: applications.length,
    new: applications.filter(a => a.status === "new").length,
    contacted: applications.filter(a => a.status === "contacted").length,
    approved: applications.filter(a => a.status === "approved").length,
    rejected: applications.filter(a => a.status === "rejected").length,
  };

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Partner Applications</h1>
          <p className="text-slate-400">Review and manage partner applications</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
            <p className="text-2xl font-bold text-white">{stats.total}</p>
            <p className="text-sm text-slate-400">Total</p>
          </div>
          <div className="bg-blue-500/10 rounded-xl p-4 border border-blue-500/30">
            <p className="text-2xl font-bold text-blue-400">{stats.new}</p>
            <p className="text-sm text-blue-400/70">New</p>
          </div>
          <div className="bg-yellow-500/10 rounded-xl p-4 border border-yellow-500/30">
            <p className="text-2xl font-bold text-yellow-400">{stats.contacted}</p>
            <p className="text-sm text-yellow-400/70">Contacted</p>
          </div>
          <div className="bg-green-500/10 rounded-xl p-4 border border-green-500/30">
            <p className="text-2xl font-bold text-green-400">{stats.approved}</p>
            <p className="text-sm text-green-400/70">Approved</p>
          </div>
          <div className="bg-red-500/10 rounded-xl p-4 border border-red-500/30">
            <p className="text-2xl font-bold text-red-400">{stats.rejected}</p>
            <p className="text-sm text-red-400/70">Rejected</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name, email, or business..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </form>

            {/* Status Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-8 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500 appearance-none cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="pl-4 pr-8 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500 appearance-none cursor-pointer"
              >
                {serviceCategories.map(cat => (
                  <option key={cat} value={cat === "All Categories" ? "all" : cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Applications List */}
        <div className="grid gap-4">
          {loading ? (
            <div className="text-center py-12 text-slate-400">Loading applications...</div>
          ) : applications.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              No applications found
            </div>
          ) : (
            applications.map((app) => {
              const StatusIcon = statusConfig[app.status].icon;
              return (
                <div
                  key={app.id}
                  className="bg-slate-800/50 rounded-xl p-5 border border-slate-700 hover:border-slate-600 transition-colors cursor-pointer"
                  onClick={() => setSelectedApp(app)}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="h-10 w-10 rounded-lg bg-teal-500/20 flex items-center justify-center">
                          <Building2 className="h-5 w-5 text-teal-400" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-white">{app.business_name}</h3>
                          <p className="text-sm text-slate-400">{app.contact_name}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-slate-400 mt-3">
                        <span className="flex items-center gap-1">
                          <Mail className="h-4 w-4" />
                          {app.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="h-4 w-4" />
                          {app.phone}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {app.location}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-slate-500 bg-slate-700/50 px-3 py-1 rounded-full">
                        {app.service_category}
                      </span>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm border ${statusConfig[app.status].color}`}>
                        <StatusIcon className="h-3.5 w-3.5" />
                        {statusConfig[app.status].label}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Detail Modal */}
        {selectedApp && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-700">
              <div className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white">{selectedApp.business_name}</h2>
                    <p className="text-slate-400">{selectedApp.contact_name}</p>
                  </div>
                  <button
                    onClick={() => setSelectedApp(null)}
                    className="text-slate-400 hover:text-white"
                  >
                    <XCircle className="h-6 w-6" />
                  </button>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-700/30 rounded-lg p-3">
                      <p className="text-xs text-slate-400 mb-1">Email</p>
                      <p className="text-white flex items-center gap-2">
                        <Mail className="h-4 w-4 text-teal-400" />
                        {selectedApp.email}
                      </p>
                    </div>
                    <div className="bg-slate-700/30 rounded-lg p-3">
                      <p className="text-xs text-slate-400 mb-1">Phone</p>
                      <p className="text-white flex items-center gap-2">
                        <Phone className="h-4 w-4 text-teal-400" />
                        {selectedApp.phone}
                      </p>
                    </div>
                    <div className="bg-slate-700/30 rounded-lg p-3">
                      <p className="text-xs text-slate-400 mb-1">Location</p>
                      <p className="text-white flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-teal-400" />
                        {selectedApp.location}
                      </p>
                    </div>
                    <div className="bg-slate-700/30 rounded-lg p-3">
                      <p className="text-xs text-slate-400 mb-1">Experience</p>
                      <p className="text-white">{selectedApp.experience}</p>
                    </div>
                  </div>

                  {selectedApp.website && (
                    <div className="bg-slate-700/30 rounded-lg p-3">
                      <p className="text-xs text-slate-400 mb-1">Website</p>
                      <a 
                        href={selectedApp.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-teal-400 hover:underline flex items-center gap-2"
                      >
                        {selectedApp.website}
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                  )}

                  <div className="bg-slate-700/30 rounded-lg p-3">
                    <p className="text-xs text-slate-400 mb-1">Service Category</p>
                    <p className="text-white">{selectedApp.service_category}</p>
                  </div>

                  <div className="bg-slate-700/30 rounded-lg p-3">
                    <p className="text-xs text-slate-400 mb-1">Description</p>
                    <p className="text-white whitespace-pre-wrap">{selectedApp.description}</p>
                  </div>

                  <div className="bg-slate-700/30 rounded-lg p-3">
                    <p className="text-xs text-slate-400 mb-1">Applied On</p>
                    <p className="text-white flex items-center gap-2">
                      <Clock className="h-4 w-4 text-teal-400" />
                      {formatDate(selectedApp.created_at)}
                    </p>
                  </div>
                </div>

                {/* Status Actions */}
                <div className="border-t border-slate-700 pt-6">
                  <p className="text-sm text-slate-400 mb-3">Update Status:</p>
                  <div className="flex flex-wrap gap-2">
                    {(["new", "contacted", "approved", "rejected"] as const).map((status) => {
                      const config = statusConfig[status];
                      const StatusIcon = config.icon;
                      return (
                        <button
                          key={status}
                          onClick={() => updateStatus(selectedApp.id, status)}
                          className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm border transition-colors ${
                            selectedApp.status === status
                              ? config.color
                              : "bg-slate-700/50 text-slate-300 border-slate-600 hover:border-slate-500"
                          }`}
                        >
                          <StatusIcon className="h-4 w-4" />
                          {config.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
