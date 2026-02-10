"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Settings,
  Bell,
  Search,
  Filter,
  Users,
  Calendar,
  TrendingUp,
  AlertTriangle,
  Clock,
  ChevronRight,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  CoachDiagnostic,
  generateMockClientProfile,
} from "@/components/human-os/coach-diagnostic";

// Mock client list
const mockClients = [
  {
    id: "1",
    name: "Sarah Johnson",
    alignmentScore: 64,
    status: "elevated" as const,
    burnoutRisk: "moderate" as const,
    nextSession: "Today, 3:00 PM",
    avatar: null,
  },
  {
    id: "2",
    name: "Michael Chen",
    alignmentScore: 78,
    status: "regulated" as const,
    burnoutRisk: "low" as const,
    nextSession: "Tomorrow, 10:00 AM",
    avatar: null,
  },
  {
    id: "3",
    name: "Emma Williams",
    alignmentScore: 45,
    status: "dysregulated" as const,
    burnoutRisk: "high" as const,
    nextSession: "Today, 5:00 PM",
    avatar: null,
  },
  {
    id: "4",
    name: "David Park",
    alignmentScore: 82,
    status: "regulated" as const,
    burnoutRisk: "low" as const,
    nextSession: "Feb 12, 2:00 PM",
    avatar: null,
  },
];

export default function CoachDashboardPage() {
  const router = useRouter();
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredClients = mockClients.filter((client) => {
    const matchesSearch = client.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === "all" || client.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const urgentClients = mockClients.filter(
    (c) => c.burnoutRisk === "high" || (c.status as string) === "dysregulated"
  );

  const todaySessions = mockClients.filter((c) => c.nextSession.includes("Today"));

  const getStatusColor = (status: string) => {
    switch (status) {
      case "dysregulated":
        return "bg-red-500";
      case "elevated":
        return "bg-orange-500";
      default:
        return "bg-green-500";
    }
  };

  const getBurnoutBadge = (risk: string) => {
    switch (risk) {
      case "high":
        return "bg-red-100 text-red-600";
      case "moderate":
        return "bg-orange-100 text-orange-600";
      default:
        return "bg-green-100 text-green-600";
    }
  };

  // If a client is selected, show their diagnostic view
  if (selectedClient) {
    const clientProfile = generateMockClientProfile();
    return (
      <div className="min-h-screen bg-[#FDFBF7] pb-24">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1B365D] to-[#0D9488] px-4 py-4 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSelectedClient(null)}
              className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center"
            >
              <ArrowLeft className="h-5 w-5 text-white" />
            </button>
            <div className="flex-1">
              <h1 className="text-lg font-bold text-white">Client Diagnostic</h1>
              <p className="text-white/70 text-sm">Pre-session context view</p>
            </div>
          </div>
        </div>

        {/* Client Diagnostic */}
        <div className="px-4 py-4">
          <CoachDiagnostic
            client={clientProfile}
            onStartSession={() => router.push("/appx/wellness-chat")}
            onViewFullProfile={() => console.log("View full profile")}
            onSendMessage={() => console.log("Send message")}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1B365D] to-[#0D9488] px-4 pt-4 pb-6 relative overflow-hidden">
        {/* Subtle pattern */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: "url('/assets/b&b-diamond-pattern.svg')",
            backgroundSize: "80px",
          }}
        />

        <div className="relative z-10">
          {/* Top bar */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => router.back()}
              className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center"
            >
              <ArrowLeft className="h-5 w-5 text-white" />
            </button>
            <div className="flex items-center gap-2">
              <Image
                src="/assets/mandala-orange.svg"
                alt="Human OS"
                width={28}
                height={28}
              />
              <span className="text-white font-semibold">Coach Portal</span>
            </div>
            <button className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center relative">
              <Bell className="h-5 w-5 text-white" />
              {urgentClients.length > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white">
                  {urgentClients.length}
                </span>
              )}
            </button>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white/10 backdrop-blur rounded-xl p-3 text-center">
              <Users className="h-5 w-5 text-white/70 mx-auto mb-1" />
              <p className="text-2xl font-bold text-white">{mockClients.length}</p>
              <p className="text-xs text-white/60">Active Clients</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-3 text-center">
              <Calendar className="h-5 w-5 text-white/70 mx-auto mb-1" />
              <p className="text-2xl font-bold text-white">{todaySessions.length}</p>
              <p className="text-xs text-white/60">Today's Sessions</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-3 text-center">
              <AlertTriangle className="h-5 w-5 text-orange-300 mx-auto mb-1" />
              <p className="text-2xl font-bold text-orange-300">{urgentClients.length}</p>
              <p className="text-xs text-white/60">Need Attention</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="px-4 py-4">
        <div className="flex gap-3 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search clients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border-0 shadow-sm focus:ring-2 focus:ring-[#0D9488]"
            />
          </div>
          <button className="h-12 w-12 bg-white rounded-xl shadow-sm flex items-center justify-center">
            <Filter className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Filter pills */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {["all", "regulated", "elevated", "dysregulated"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                filterStatus === status
                  ? "bg-[#0D9488] text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
            >
              {status === "all" ? "All Clients" : status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Urgent Attention Section */}
      {urgentClients.length > 0 && (
        <div className="px-4 mb-4">
          <div className="bg-red-50 border border-red-100 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <h3 className="font-semibold text-red-700">Needs Immediate Attention</h3>
            </div>
            <div className="space-y-2">
              {urgentClients.map((client) => (
                <button
                  key={client.id}
                  onClick={() => setSelectedClient(client.id)}
                  className="w-full flex items-center gap-3 p-3 bg-white rounded-xl hover:shadow-md transition-all"
                >
                  <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                    <span className="font-bold text-red-600">{client.name.charAt(0)}</span>
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-gray-900">{client.name}</p>
                    <p className="text-xs text-gray-500">{client.nextSession}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-red-600">{client.alignmentScore}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getBurnoutBadge(client.burnoutRisk)}`}>
                      {client.burnoutRisk} risk
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Client List */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900">All Clients</h3>
          <span className="text-sm text-gray-500">{filteredClients.length} clients</span>
        </div>

        <div className="space-y-3">
          {filteredClients.map((client) => (
            <motion.button
              key={client.id}
              onClick={() => setSelectedClient(client.id)}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all text-left"
            >
              <div className="flex items-center gap-3">
                {/* Avatar with status indicator */}
                <div className="relative">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#5BB5B0] to-[#6B9BC3] flex items-center justify-center">
                    <span className="text-lg font-bold text-white">{client.name.charAt(0)}</span>
                  </div>
                  <div
                    className={`absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full border-2 border-white ${getStatusColor(
                      client.status
                    )}`}
                  />
                </div>

                {/* Client info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-gray-900">{client.name}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getBurnoutBadge(client.burnoutRisk)}`}>
                      {client.burnoutRisk}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="h-3 w-3 text-gray-400" />
                    <p className="text-xs text-gray-500">{client.nextSession}</p>
                  </div>
                </div>

                {/* Score */}
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">{client.alignmentScore}</p>
                  <p className="text-xs text-gray-400">Alignment</p>
                </div>

                <ChevronRight className="h-5 w-5 text-gray-300" />
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Floating Add Button */}
      <button className="fixed bottom-24 right-4 h-14 w-14 bg-[#0D9488] rounded-full shadow-lg flex items-center justify-center hover:bg-[#0B7B71] transition-colors">
        <Plus className="h-6 w-6 text-white" />
      </button>
    </div>
  );
}
