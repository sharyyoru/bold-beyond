"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Search,
  Filter,
  Calendar,
  ShoppingBag,
  Gift,
  RefreshCw,
  ChevronRight,
  TrendingUp,
  Clock,
} from "lucide-react";
import { createAppClient } from "@/lib/supabase";

interface WalletData {
  id: string;
  balance: number;
  currency: string;
}

interface Transaction {
  id: string;
  type: "credit" | "debit";
  amount: number;
  balance_after: number;
  category: string;
  description: string;
  reference_id: string | null;
  reference_type: string | null;
  created_at: string;
  metadata: any;
}

const categoryConfig: Record<string, { icon: any; label: string; color: string }> = {
  appointment_refund: { icon: Calendar, label: "Appointment Refund", color: "#10B981" },
  order_refund: { icon: ShoppingBag, label: "Order Refund", color: "#10B981" },
  appointment_payment: { icon: Calendar, label: "Appointment Payment", color: "#EF4444" },
  order_payment: { icon: ShoppingBag, label: "Order Payment", color: "#EF4444" },
  manual_credit: { icon: Wallet, label: "Manual Credit", color: "#10B981" },
  manual_debit: { icon: Wallet, label: "Manual Debit", color: "#EF4444" },
  promotional_credit: { icon: Gift, label: "Promotional Credit", color: "#8B5CF6" },
};

export default function WalletPage() {
  const router = useRouter();
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "credit" | "debit">("all");
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchWalletData();
  }, []);

  const fetchWalletData = async () => {
    try {
      const supabase = createAppClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push("/appx/login");
        return;
      }

      // Fetch or create wallet
      let { data: walletData, error: walletError } = await supabase
        .from("user_wallets")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (walletError && walletError.code === "PGRST116") {
        // Wallet doesn't exist, create one
        const { data: newWallet } = await supabase
          .from("user_wallets")
          .insert({ user_id: user.id, balance: 0 })
          .select()
          .single();
        walletData = newWallet;
      }

      if (walletData) {
        setWallet(walletData);
      }

      // Fetch transactions
      const { data: txData } = await supabase
        .from("wallet_transactions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      setTransactions(txData || []);
    } catch (error) {
      console.error("Error fetching wallet:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter transactions
  const filteredTransactions = transactions.filter((tx) => {
    if (filterType !== "all" && tx.type !== filterType) return false;
    if (filterCategory && tx.category !== filterCategory) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        tx.description?.toLowerCase().includes(query) ||
        tx.category.toLowerCase().includes(query) ||
        tx.amount.toString().includes(query)
      );
    }
    return true;
  });

  // Group transactions by date
  const groupedTransactions: Record<string, Transaction[]> = {};
  filteredTransactions.forEach((tx) => {
    const date = new Date(tx.created_at).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    if (!groupedTransactions[date]) groupedTransactions[date] = [];
    groupedTransactions[date].push(tx);
  });

  // Calculate stats
  const totalCredits = transactions
    .filter((tx) => tx.type === "credit")
    .reduce((sum, tx) => sum + tx.amount, 0);
  const totalDebits = transactions
    .filter((tx) => tx.type === "debit")
    .reduce((sum, tx) => sum + tx.amount, 0);

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
          <h1 className="font-semibold text-gray-900">My Wallet</h1>
          <button
            onClick={fetchWalletData}
            className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center"
          >
            <RefreshCw className="h-5 w-5 text-gray-700" />
          </button>
        </div>
      </div>

      {/* Wallet Card */}
      <div className="px-4 py-6">
        <div className="bg-gradient-to-br from-[#0D9488] to-[#065F5B] rounded-3xl p-6 text-white shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center">
              <Wallet className="h-6 w-6" />
            </div>
            <div>
              <p className="text-white/80 text-sm">Available Balance</p>
              <h2 className="text-3xl font-bold">
                {wallet?.balance?.toFixed(2) || "0.00"} <span className="text-lg font-normal">AED</span>
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 rounded-xl p-3">
              <div className="flex items-center gap-2 mb-1">
                <ArrowDownLeft className="h-4 w-4 text-green-300" />
                <span className="text-xs text-white/70">Total Credits</span>
              </div>
              <p className="font-semibold">{totalCredits.toFixed(2)} AED</p>
            </div>
            <div className="bg-white/10 rounded-xl p-3">
              <div className="flex items-center gap-2 mb-1">
                <ArrowUpRight className="h-4 w-4 text-red-300" />
                <span className="text-xs text-white/70">Total Spent</span>
              </div>
              <p className="font-semibold">{totalDebits.toFixed(2)} AED</p>
            </div>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="px-4 mb-4">
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <TrendingUp className="h-5 w-5 text-blue-500 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-900">Use Your Balance</p>
              <p className="text-xs text-blue-700 mt-1">
                Your wallet balance can be used for booking appointments or purchasing products during checkout.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="px-4 mb-4">
        <div className="flex gap-2 mb-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl text-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0D9488]"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`h-10 w-10 rounded-xl flex items-center justify-center ${
              showFilters ? "bg-[#0D9488] text-white" : "bg-white border border-gray-200 text-gray-700"
            }`}
          >
            <Filter className="h-5 w-5" />
          </button>
        </div>

        {showFilters && (
          <div className="bg-white rounded-xl p-4 border border-gray-200 space-y-4">
            {/* Type Filter */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Transaction Type</p>
              <div className="flex gap-2">
                {[
                  { id: "all", label: "All" },
                  { id: "credit", label: "Credits" },
                  { id: "debit", label: "Debits" },
                ].map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setFilterType(type.id as any)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filterType === type.id
                        ? "bg-[#0D9488] text-white"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Category</p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFilterCategory(null)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                    !filterCategory ? "bg-[#0D9488] text-white" : "bg-gray-100 text-gray-600"
                  }`}
                >
                  All
                </button>
                {Object.entries(categoryConfig).map(([key, config]) => (
                  <button
                    key={key}
                    onClick={() => setFilterCategory(key)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 ${
                      filterCategory === key ? "bg-[#0D9488] text-white" : "bg-gray-100 text-gray-600"
                    }`}
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

      {/* Transactions List */}
      <div className="px-4 pb-24">
        <h3 className="font-semibold text-gray-900 mb-4">Transaction History</h3>

        {Object.keys(groupedTransactions).length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl">
            <Wallet className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">No transactions yet</h3>
            <p className="text-sm text-gray-500 mb-4">
              Your wallet transactions will appear here
            </p>
            <Link
              href="/appx/services"
              className="inline-block px-4 py-2 bg-[#0D9488] text-white rounded-xl text-sm font-medium"
            >
              Book a Service
            </Link>
          </div>
        ) : (
          Object.entries(groupedTransactions).map(([date, txs]) => (
            <div key={date} className="mb-6">
              <p className="text-sm font-medium text-gray-500 mb-3">{date}</p>
              <div className="space-y-3">
                {txs.map((tx) => {
                  const config = categoryConfig[tx.category] || {
                    icon: Wallet,
                    label: tx.category,
                    color: "#6B7280",
                  };
                  const Icon = config.icon;

                  return (
                    <div
                      key={tx.id}
                      className="bg-white rounded-xl p-4 shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="h-12 w-12 rounded-xl flex items-center justify-center"
                          style={{ backgroundColor: `${config.color}15` }}
                        >
                          <Icon className="h-6 w-6" style={{ color: config.color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h4 className="font-medium text-gray-900 truncate">
                                {config.label}
                              </h4>
                              <p className="text-sm text-gray-500 truncate">
                                {tx.description || "No description"}
                              </p>
                            </div>
                            <div className="text-right">
                              <p
                                className={`font-semibold ${
                                  tx.type === "credit" ? "text-green-600" : "text-red-600"
                                }`}
                              >
                                {tx.type === "credit" ? "+" : "-"}{tx.amount.toFixed(2)} AED
                              </p>
                              <p className="text-xs text-gray-400">
                                Balance: {tx.balance_after.toFixed(2)}
                              </p>
                            </div>
                          </div>
                          <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(tx.created_at).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
