"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Watch,
  Heart,
  Activity,
  Brain,
  Zap,
  Shield,
  Target,
  TrendingUp,
  Users,
  Globe,
  CheckCircle2,
  ChevronRight,
  ChevronDown,
  Building2,
  Landmark,
  Rocket,
  Calendar,
  DollarSign,
  Award,
  Smartphone,
  Wifi,
  Battery,
  Droplets,
  Sun,
  Moon,
  Package,
  Factory,
  Truck,
  BadgeCheck,
  Megaphone,
  UsersRound,
  Headphones,
  ShoppingCart,
  BarChart3,
  Clock,
  MessageSquare,
  Download,
} from "lucide-react";
import { GlassCard, GlassContainer } from "@/components/ui/glass-card";
import { cn } from "@/lib/utils";

// Timeline Data
const developmentTimeline = [
  {
    phase: "Phase 1: Research & Concept",
    duration: "Jun 2026 - Sep 2026",
    status: "in-progress",
    items: [
      "Market research and competitive analysis",
      "User persona development for UAE market",
      "Initial product concept and design sketches",
      "Technical feasibility study",
      "Partnership discussions with UAE government entities",
    ],
  },
  {
    phase: "Phase 2: Design & Prototyping",
    duration: "Oct 2026 - Jan 2027",
    status: "upcoming",
    items: [
      "Industrial design finalization",
      "Hardware component selection and testing",
      "Firmware architecture development",
      "Mobile app UI/UX design",
      "First prototype development",
    ],
  },
  {
    phase: "Phase 3: Development & Testing",
    duration: "Feb 2027 - Jun 2027",
    status: "upcoming",
    items: [
      "Hardware manufacturing partnerships",
      "Sensor calibration and optimization",
      "AI/ML algorithm development for health insights",
      "Beta testing with selected users",
      "Regulatory compliance (TRA, ESMA)",
    ],
  },
  {
    phase: "Phase 4: Production & Launch",
    duration: "Jul 2027 - Dec 2027",
    status: "upcoming",
    items: [
      "Mass production initiation",
      "Marketing campaign launch",
      "Distribution partnerships (retailers, telcos)",
      "Official UAE market launch",
      "Post-launch support infrastructure",
    ],
  },
  {
    phase: "Phase 5: Scale & Expand",
    duration: "2028 and Beyond",
    status: "upcoming",
    items: [
      "GCC market expansion",
      "Enterprise and corporate wellness programs",
      "Integration with UAE health platforms",
      "Next-generation product development",
      "IPO preparation",
    ],
  },
];

// Competitors Data
const competitors = [
  {
    name: "Apple Watch",
    company: "Apple",
    price: "AED 1,499 - 3,499",
    strengths: ["Ecosystem integration", "Premium brand", "Advanced sensors"],
    weaknesses: ["High price", "iOS only", "Short battery life"],
    marketShare: "35%",
  },
  {
    name: "Samsung Galaxy Watch",
    company: "Samsung",
    price: "AED 899 - 1,899",
    strengths: ["Android & iOS support", "Good build quality", "BioActive sensor"],
    weaknesses: ["Limited third-party apps", "Complex UI"],
    marketShare: "20%",
  },
  {
    name: "Fitbit Sense/Charge",
    company: "Google/Fitbit",
    price: "AED 549 - 1,199",
    strengths: ["Fitness focus", "Long battery", "Affordable"],
    weaknesses: ["Limited smart features", "Premium subscription needed"],
    marketShare: "15%",
  },
  {
    name: "Garmin Venu",
    company: "Garmin",
    price: "AED 1,299 - 1,999",
    strengths: ["Excellent GPS", "Sports features", "Battery life"],
    weaknesses: ["Not fashion-forward", "Complex interface"],
    marketShare: "10%",
  },
  {
    name: "Xiaomi Mi Band",
    company: "Xiaomi",
    price: "AED 149 - 349",
    strengths: ["Very affordable", "Long battery", "Basic features"],
    weaknesses: ["Build quality", "Limited accuracy", "Basic ecosystem"],
    marketShare: "12%",
  },
];

// Product Lineup
const products = [
  {
    name: "Bold Band Essential",
    tagline: "Your wellness journey starts here",
    price: "AED 399",
    comparePrice: "AED 499",
    features: [
      "Heart rate monitoring (24/7)",
      "Sleep tracking with insights",
      "Step & calorie tracking",
      "7-day battery life",
      "Water resistant (5ATM)",
      "Bold & Beyond app integration",
      "Stress monitoring",
      "Menstrual cycle tracking",
    ],
    color: "sea",
    popular: false,
  },
  {
    name: "Bold Band Pro",
    tagline: "Advanced health intelligence",
    price: "AED 799",
    comparePrice: "AED 999",
    features: [
      "Everything in Essential, plus:",
      "SpO2 blood oxygen monitoring",
      "ECG monitoring",
      "Skin temperature sensor",
      "Advanced sleep analysis",
      "14-day battery life",
      "GPS tracking",
      "AI-powered health insights",
      "Therapy session reminders",
      "Wellness score dashboard",
    ],
    color: "sky",
    popular: true,
  },
  {
    name: "Bold Band Ultra",
    tagline: "The complete wellness companion",
    price: "AED 1,299",
    comparePrice: "AED 1,599",
    features: [
      "Everything in Pro, plus:",
      "Continuous glucose estimation",
      "Blood pressure monitoring",
      "Body composition analysis",
      "AMOLED always-on display",
      "21-day battery life",
      "Premium metal design",
      "Sapphire crystal glass",
      "Exclusive therapist insights",
      "Priority support",
      "1-year Bold & Beyond Premium",
    ],
    color: "sand",
    popular: false,
  },
];

// Government Initiatives
const governmentInitiatives = [
  {
    name: "UAE National Wellbeing Strategy 2031",
    icon: Heart,
    alignment: "Our smart bands directly support the strategy's goal of improving quality of life through technology-enabled wellness monitoring.",
    opportunity: "Potential government procurement for public health programs",
  },
  {
    name: "Dubai Health Strategy 2021-2025",
    icon: Building2,
    alignment: "Integration with Dubai Health Authority's digital health ecosystem and preventive healthcare initiatives.",
    opportunity: "Partnership with DHA for employee wellness programs",
  },
  {
    name: "UAE Artificial Intelligence Strategy",
    icon: Brain,
    alignment: "Our AI-powered health insights align with UAE's vision to become a global AI leader by 2031.",
    opportunity: "Access to AI research grants and accelerator programs",
  },
  {
    name: "Smart Dubai 2021",
    icon: Smartphone,
    alignment: "Smart city integration potential with Dubai's connected services ecosystem.",
    opportunity: "Integration with Dubai Now and other smart city platforms",
  },
  {
    name: "National Program for Happiness & Wellbeing",
    icon: Sun,
    alignment: "Mental wellness features support the UAE's happiness agenda.",
    opportunity: "Collaboration on national wellness campaigns",
  },
  {
    name: "Emirates Healthtech Innovation Hub",
    icon: Rocket,
    alignment: "Position as a homegrown healthtech success story.",
    opportunity: "Access to funding, mentorship, and regulatory fast-tracking",
  },
];

// Code Architecture
const codeArchitecture = [
  {
    layer: "Mobile Application",
    tech: "React Native / Flutter",
    components: [
      "Health Dashboard",
      "Real-time Sync Engine",
      "AI Insights Module",
      "Therapy Integration",
      "Social Features",
    ],
  },
  {
    layer: "Backend Services",
    tech: "Node.js / Go microservices",
    components: [
      "User Management",
      "Health Data Processing",
      "ML Pipeline",
      "Notification Service",
      "Third-party Integrations",
    ],
  },
  {
    layer: "Firmware",
    tech: "C/C++ / Rust",
    components: [
      "Sensor Management",
      "BLE Communication",
      "Power Management",
      "Data Compression",
      "OTA Updates",
    ],
  },
  {
    layer: "Cloud Infrastructure",
    tech: "AWS / Azure UAE Region",
    components: [
      "Data Lake",
      "Real-time Analytics",
      "ML Training Pipeline",
      "HIPAA-compliant Storage",
      "CDN for Assets",
    ],
  },
];

// Alibaba Supplier Product Lines
const supplierProductLines = [
  {
    id: "AMOLED-SB-001",
    name: "Custom Elegant Android AMOLED Smart Band",
    supplier: "Shenzhen Ruiyi Technology Co., Ltd.",
    category: "Premium AMOLED Band",
    url: "https://www.alibaba.com/product-detail/Custom-Elegant-Android-AMOLED-Smart-Band_1601653512117.html",
    specifications: [
      "1.47\" AMOLED full-color display",
      "Heart rate monitoring (24/7)",
      "Blood oxygen (SpO2) tracking",
      "IP68 waterproof rating",
      "Sleep monitoring with REM detection",
      "7-14 day battery life",
      "Bluetooth 5.0 BLE",
      "Custom watch faces support",
    ],
    pricing: {
      moq: 500,
      price_500: "$8.50 - $12.00",
      price_1000: "$7.00 - $10.00",
      price_5000: "$5.50 - $8.00",
      price_10000: "$4.50 - $6.50",
    },
    leadTime: "25-35 days",
    customization: [
      "Logo printing",
      "Custom packaging",
      "Firmware customization",
      "App white-labeling",
      "Custom band colors/materials",
    ],
    targetProduct: "Bold Band Essential",
  },
  {
    id: "HRM-IP68-002",
    name: "Customized Android IP68 Heart Rate Monitor Smart Band",
    supplier: "Shenzhen Ruiyi Technology Co., Ltd.",
    category: "Advanced Health Band",
    url: "https://www.alibaba.com/product-detail/Customized-Android-IP68-Heart-Rate-Monitor_1601800213557.html",
    specifications: [
      "1.69\" HD IPS/AMOLED display",
      "ECG + PPG heart rate monitoring",
      "Blood pressure monitoring",
      "Blood oxygen saturation (SpO2)",
      "Body temperature sensor",
      "IP68 waterproof (swimming)",
      "GPS tracking (optional)",
      "14-21 day battery life",
      "Multi-sport modes (100+)",
    ],
    pricing: {
      moq: 300,
      price_500: "$15.00 - $22.00",
      price_1000: "$12.00 - $18.00",
      price_5000: "$9.00 - $14.00",
      price_10000: "$7.50 - $11.00",
    },
    leadTime: "30-45 days",
    customization: [
      "Logo printing & engraving",
      "Premium packaging design",
      "Full firmware customization",
      "SDK & API access",
      "Custom health algorithms",
      "Metal/ceramic band options",
    ],
    targetProduct: "Bold Band Pro / Ultra",
  },
];

// Manufacturing Cost Analysis
const manufacturingAnalysis = {
  unitCosts: [
    { product: "Bold Band Essential", manufacturing: "$6.50", packaging: "$1.50", shipping: "$0.80", total: "$8.80", retail: "AED 399", margin: "69%" },
    { product: "Bold Band Pro", manufacturing: "$14.00", packaging: "$2.50", shipping: "$1.00", total: "$17.50", retail: "AED 799", margin: "72%" },
    { product: "Bold Band Ultra", manufacturing: "$22.00", packaging: "$4.00", shipping: "$1.20", total: "$27.20", retail: "AED 1,299", margin: "76%" },
  ],
  orderPlan: [
    { phase: "Pilot Batch", quantity: 1000, timeline: "Q4 2026", investment: "AED 75,000" },
    { phase: "Initial Launch", quantity: 5000, timeline: "Q1 2027", investment: "AED 320,000" },
    { phase: "Scale Production", quantity: 25000, timeline: "Q2-Q3 2027", investment: "AED 1,400,000" },
    { phase: "Mass Production", quantity: 100000, timeline: "Q4 2027 - Q1 2028", investment: "AED 4,800,000" },
  ],
};

// Marketing Budget
const marketingBudget = {
  phases: [
    {
      phase: "Pre-Launch (Q1-Q2 2027)",
      budget: "AED 500,000",
      activities: [
        { item: "Social Media Setup & Content", cost: "AED 120,000" },
        { item: "Influencer Partnerships", cost: "AED 180,000" },
        { item: "PR & Media Relations", cost: "AED 120,000" },
        { item: "Launch Event Planning", cost: "AED 80,000" },
      ],
    },
    {
      phase: "Launch (Q3-Q4 2027)",
      budget: "AED 1,000,000",
      activities: [
        { item: "Digital Advertising (Meta, Google, TikTok)", cost: "AED 400,000" },
        { item: "Launch Event & Activations", cost: "AED 150,000" },
        { item: "Influencer Campaigns", cost: "AED 250,000" },
        { item: "Content Production (Video/Photo)", cost: "AED 120,000" },
        { item: "PR & Press Coverage", cost: "AED 80,000" },
      ],
    },
    {
      phase: "Growth (2028)",
      budget: "AED 1,500,000",
      activities: [
        { item: "Performance Marketing", cost: "AED 700,000" },
        { item: "Partnerships & Sponsorships", cost: "AED 350,000" },
        { item: "Content & Community", cost: "AED 250,000" },
        { item: "Retention Marketing", cost: "AED 200,000" },
      ],
    },
  ],
  totalBudget: "AED 3,000,000",
};

// Team & Manpower Costs (Lean Remote Model)
const teamStructure = {
  phases: [
    {
      phase: "Phase 1: Foundation (2026)",
      headcount: 4,
      monthlyBurn: "AED 27,000",
      annualCost: "AED 324,000",
      roles: [
        { role: "Founder (You)", count: 1, salary: "AED 0" },
        { role: "Technical Co-founder", count: 1, salary: "AED 0" },
        { role: "Freelance UI/UX Designer", count: 1, salary: "AED 12,000" },
        { role: "Social Media & Partnerships Manager", count: 1, salary: "AED 15,000" },
      ],
    },
    {
      phase: "Phase 2: Launch (2027)",
      headcount: 6,
      monthlyBurn: "AED 67,000",
      annualCost: "AED 804,000",
      roles: [
        { role: "Founder (You)", count: 1, salary: "AED 0" },
        { role: "Technical Co-founder", count: 1, salary: "AED 0" },
        { role: "Remote Dev (Contract)", count: 1, salary: "AED 18,000" },
        { role: "Social Media & Partnerships Manager", count: 1, salary: "AED 15,000" },
        { role: "Remote Call Center (Outsourced)", count: 1, salary: "AED 22,000" },
        { role: "Freelance Content Creator", count: 1, salary: "AED 12,000" },
      ],
    },
    {
      phase: "Phase 3: Scale (2028-2029)",
      headcount: 10,
      monthlyBurn: "AED 125,000",
      annualCost: "AED 1,500,000",
      roles: [
        { role: "Founder (You)", count: 1, salary: "AED 0" },
        { role: "Technical Co-founder", count: 1, salary: "AED 0" },
        { role: "Remote Dev Team (Contract)", count: 2, salary: "AED 20,000" },
        { role: "Social Media & Partnerships Manager", count: 1, salary: "AED 18,000" },
        { role: "Remote Call Center (Outsourced)", count: 1, salary: "AED 35,000" },
        { role: "Freelance Contractors (Design/Content)", count: 2, salary: "AED 14,000" },
        { role: "Part-time Accountant", count: 1, salary: "AED 8,000" },
        { role: "Virtual Assistant", count: 1, salary: "AED 6,000" },
      ],
    },
  ],
};

// Sales & Support Structure (Remote Call Center Model)
const salesSupport = {
  salesChannels: [
    { channel: "Direct Online (boldandbeyond.com)", commission: "0%", target: "45%" },
    { channel: "Noon / Amazon UAE", commission: "15%", target: "30%" },
    { channel: "Retail Partners (Virgin, Sharaf DG)", commission: "20%", target: "15%" },
    { channel: "Telecom Bundles (du, Etisalat)", commission: "25%", target: "10%" },
  ],
  supportStructure: [
    { tier: "Remote Call Center - Chat & Email (Philippines)", response: "< 2 hours", staff: 5, cost: "AED 15,000/mo" },
    { tier: "Remote Call Center - Phone (Philippines)", response: "< 1 hour", staff: 3, cost: "AED 12,000/mo" },
    { tier: "Technical Escalation (Contractor)", response: "< 4 hours", staff: 1, cost: "AED 8,000/mo" },
  ],
  supportTools: ["Zendesk", "Intercom Chat", "WhatsApp Business", "Aircall"],
  kpis: [
    { metric: "First Response Time", target: "< 2 hours" },
    { metric: "Resolution Time", target: "< 24 hours" },
    { metric: "Customer Satisfaction", target: "> 90%" },
    { metric: "Return Rate", target: "< 3%" },
  ],
};

// Financial Projections
const financialProjections = [
  { year: "2026", revenue: 0, users: 0, investment: 5 },
  { year: "2027", revenue: 8, users: 25000, investment: 15 },
  { year: "2028", revenue: 45, users: 150000, investment: 10 },
  { year: "2029", revenue: 120, users: 400000, investment: 5 },
  { year: "2030", revenue: 250, users: 800000, investment: 0 },
];

// Market Penetration & Sizing (grounded in 2026 market research)
const marketSizing = [
  { label: "Global Wearables (2026)", value: "USD 96.8B", note: "20.1% CAGR to 2035" },
  { label: "MENA Wearables (2026)", value: "USD 4.3B", note: "Fastest-growing region" },
  { label: "UAE Serviceable Market", value: "AED 2.5B", note: "10M+ connected residents" },
  { label: "Target Share by 2030", value: "6–8%", note: "AED 150–200M revenue" },
];

// Phased Go-To-Market / Market Penetration Strategy
const marketPenetration = [
  {
    step: "Phase 1 — Beachhead (D2C First)",
    timeline: "Jul 2027 – Sep 2027",
    objective: "Establish brand control, capture first-party data, and validate pricing through our owned store before paying marketplace fees.",
    actions: [
      "Launch boldandbeyond.com store with Bold Band Essential & Pro",
      "Seed 2,000 units to existing Bold & Beyond app users (warm base)",
      "Founder-led PR push + UAE tech media coverage",
      "Collect reviews, refine messaging, and lock unit economics",
    ],
  },
  {
    step: "Phase 2 — Marketplace Expansion",
    timeline: "Oct 2027 – Mar 2028",
    objective: "Win discovery and trust by listing where UAE shoppers already buy electronics: Noon and Amazon.ae.",
    actions: [
      "List on Noon.com & Amazon.ae with FBN/FBA fulfilment",
      "Optimise listings (A+ content, Arabic + English, sponsored ads)",
      "Match D2C pricing; use marketplaces for reach, store for margin",
      "Target top-10 ranking in 'fitness tracker' category",
    ],
  },
  {
    step: "Phase 3 — Retail & Telecom Distribution",
    timeline: "Apr 2028 – Dec 2028",
    objective: "Build physical presence and trust through trusted electronics retailers and telecom bundles.",
    actions: [
      "Secure shelf space at Sharaf DG & Virgin Megastore",
      "Carrefour & Lulu Hypermarket placement for mass reach",
      "du and e& (Etisalat) instalment & bundle deals",
      "In-store demo units and trained brand ambassadors",
    ],
  },
  {
    step: "Phase 4 — Regional & Category Scale",
    timeline: "2029 – 2030",
    objective: "Expand across the GCC and grow share through new SKUs, B2B wellness, and ecosystem lock-in.",
    actions: [
      "Enter KSA (Noon SA, Amazon.sa) and Qatar markets",
      "Launch corporate & insurer wellness programs (B2B2C)",
      "Introduce Bold Band Ultra + accessories for higher AOV",
      "Subscription wellness tier to drive recurring revenue",
    ],
  },
];

// Sales Platform Strategy
const salesPlatforms = [
  { name: "boldandbeyond.com (D2C)", type: "Owned", commission: "0%", margin: "70–76%", priority: "Primary", target: "45%", notes: "Highest margin, full data ownership, subscription upsell" },
  { name: "Noon.com", type: "Marketplace", commission: "15%", margin: "55–60%", priority: "High", target: "18%", notes: "#1 regional marketplace; Fulfilled-by-Noon logistics" },
  { name: "Amazon.ae", type: "Marketplace", commission: "15%", margin: "55–60%", priority: "High", target: "12%", notes: "Trusted reach; FBA Prime delivery + global expansion path" },
  { name: "Sharaf DG / Virgin", type: "Retail", commission: "20%", margin: "48–52%", priority: "Medium", target: "10%", notes: "Premium electronics footfall, demo experience" },
  { name: "Carrefour / Lulu", type: "Retail", commission: "22%", margin: "45–50%", priority: "Medium", target: "8%", notes: "Mass-market reach across UAE hypermarkets" },
  { name: "du / e& Bundles", type: "Telecom", commission: "25%", margin: "42–48%", priority: "Medium", target: "5%", notes: "Instalment plans lower purchase friction" },
  { name: "Instagram & TikTok Shop", type: "Social", commission: "8%", margin: "62–66%", priority: "Growth", target: "2%", notes: "Creator-driven impulse purchases, Gen-Z reach" },
];

// Marketing Strategy Pillars
const marketingStrategy = [
  {
    pillar: "Performance Marketing",
    icon: Target,
    description: "Always-on paid acquisition across Meta, Google, TikTok and Snapchat, optimised to a target blended CAC of AED 90–120 and 3.5x+ ROAS.",
    tactics: ["Meta & TikTok video ads", "Google Shopping & Search", "Retargeting & abandoned cart", "Marketplace sponsored ads"],
  },
  {
    pillar: "Influencer & Creator",
    icon: Users,
    description: "Tiered creator program with UAE fitness, wellness and lifestyle voices — from nano-creators for authenticity to macro-influencers for reach.",
    tactics: ["50+ nano/micro creators per quarter", "Flagship macro-influencer partners", "Affiliate / commission codes", "UGC content library"],
  },
  {
    pillar: "Content & Community",
    icon: MessageSquare,
    description: "Build a wellness brand, not just a device. Owned content, the Bold & Beyond app community, and CRM nurture drive retention and word-of-mouth.",
    tactics: ["Wellness blog & SEO", "Email & WhatsApp CRM flows", "In-app challenges & streaks", "Referral program"],
  },
  {
    pillar: "Retail & Experiential",
    icon: Building2,
    description: "Bring the brand to life offline through mall activations, pop-ups and in-store demos that convert high-intent shoppers and build trust.",
    tactics: ["Mall pop-ups (Dubai Mall, MoE)", "In-store demo stations", "Corporate wellness events", "PR & launch event"],
  },
];

// Marketing Funnel
const marketingFunnel = [
  { stage: "Awareness", goal: "Reach 5M+ UAE residents", channels: "Paid social, influencers, PR", metric: "Impressions / CPM" },
  { stage: "Consideration", goal: "Drive store & listing traffic", channels: "Search, retargeting, content", metric: "CTR / Sessions" },
  { stage: "Conversion", goal: "Achieve 2.5–3.5% conversion", channels: "Offers, reviews, bundles", metric: "CAC / ROAS" },
  { stage: "Retention", goal: "Build recurring engagement", channels: "App, CRM, subscription", metric: "LTV / Churn" },
];

// Inventory & Fulfilment Strategy
const inventoryStrategy = {
  overview: "We operate a lean, demand-driven inventory model — manufacturing in staged production runs and holding stock close to customers across owned, marketplace and 3PL warehouses to balance availability with cash efficiency.",
  pillars: [
    {
      title: "Staged Manufacturing",
      icon: Factory,
      points: ["Pilot 1K → scale to 100K in tranches", "Re-order based on 8–10 week lead times", "Avoid over-committing capital early"],
    },
    {
      title: "Central 3PL Hub (Dubai)",
      icon: Package,
      points: ["Bonded warehouse in JAFZA / Dubai South", "Single source of truth for stock", "Fast last-mile across UAE (24–48h)"],
    },
    {
      title: "Marketplace Fulfilment",
      icon: Truck,
      points: ["Fulfilled-by-Noon (FBN) for Noon orders", "Amazon FBA for Prime delivery", "Buffer stock per channel to prevent stockouts"],
    },
    {
      title: "Demand Planning",
      icon: BarChart3,
      points: ["Rolling 90-day demand forecast", "Safety stock = 6 weeks of sell-through", "Seasonal build-up before Ramadan & GITEX"],
    },
  ],
  metrics: [
    { metric: "Inventory Turnover", target: "6–8x / year" },
    { metric: "Stockout Rate", target: "< 2%" },
    { metric: "Days of Inventory", target: "45–60 days" },
    { metric: "Sell-Through Rate", target: "> 85% / quarter" },
  ],
};

export default function BusinessPlanPage() {
  const [activeTimeline, setActiveTimeline] = useState(1);
  const [activeCompetitor, setActiveCompetitor] = useState<number | null>(null);
  const [expandedInitiative, setExpandedInitiative] = useState<number | null>(null);
  const [showCodeDetails, setShowCodeDetails] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const exportToPDF = useCallback(async () => {
    setIsExporting(true);
    try {
      const { default: jsPDF } = await import("jspdf");
      const { default: autoTable } = await import("jspdf-autotable");
      
      const doc = new jsPDF("p", "mm", "a4");
      const pageWidth = 210;
      const pageHeight = 297;
      const margin = 20;
      const contentWidth = pageWidth - margin * 2;
      
      // Brand colors
      const brandNavy: [number, number, number] = [15, 30, 55];
      const brandSea: [number, number, number] = [91, 181, 176];
      const brandGold: [number, number, number] = [212, 175, 55];
      const white: [number, number, number] = [255, 255, 255];
      const lightGray: [number, number, number] = [245, 247, 250];
      const gray: [number, number, number] = [100, 116, 139];

      // Load logo image
      let logoDataUrl: string | null = null;
      let logoAspect = 1; // width / height
      try {
        const logoImg = new Image();
        logoImg.crossOrigin = "anonymous";
        await new Promise<void>((resolve, reject) => {
          logoImg.onload = () => resolve();
          logoImg.onerror = () => reject();
          logoImg.src = "/new-assets/bnb-white.png";
        });
        if (logoImg.naturalHeight > 0) {
          logoAspect = logoImg.naturalWidth / logoImg.naturalHeight;
        }
        const canvas = document.createElement("canvas");
        canvas.width = logoImg.naturalWidth;
        canvas.height = logoImg.naturalHeight;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(logoImg, 0, 0);
          logoDataUrl = canvas.toDataURL("image/png");
        }
      } catch (e) {
        console.warn("Could not load logo for PDF");
      }

      // Helper to draw header on each page
      const drawPageHeader = (pageNum: number) => {
        // Top brand bar
        doc.setFillColor(...brandNavy);
        doc.rect(0, 0, pageWidth, 12, "F");
        doc.setFillColor(...brandSea);
        doc.rect(0, 12, pageWidth, 2, "F");
        
        // Logo in header
        if (logoDataUrl) {
          const headerLogoHeight = 7;
          const headerLogoWidth = headerLogoHeight * logoAspect;
          doc.addImage(logoDataUrl, "PNG", margin, 2.5, headerLogoWidth, headerLogoHeight);
          doc.setFontSize(8);
          doc.setTextColor(...white);
          doc.text("BOLD & BEYOND", margin + headerLogoWidth + 3, 8);
        } else {
          doc.setFontSize(8);
          doc.setTextColor(...white);
          doc.text("BOLD & BEYOND", margin, 8);
        }
        doc.setFontSize(8);
        doc.setTextColor(...white);
        doc.text("Confidential Business Plan", pageWidth - margin, 8, { align: "right" });
        
        // Footer
        doc.setFillColor(...lightGray);
        doc.rect(0, pageHeight - 12, pageWidth, 12, "F");
        doc.setFontSize(7);
        doc.setTextColor(...gray);
        doc.text(`© 2026 Bold & Beyond. All rights reserved.`, margin, pageHeight - 5);
        doc.text(`Page ${pageNum}`, pageWidth - margin, pageHeight - 5, { align: "right" });
      };

      let currentPage = 1;
      
      // ============ COVER PAGE ============
      // Full navy background
      doc.setFillColor(...brandNavy);
      doc.rect(0, 0, pageWidth, pageHeight, "F");
      
      // Decorative sea accent
      doc.setFillColor(...brandSea);
      doc.rect(0, pageHeight * 0.65, pageWidth, 3, "F");
      
      // Gold accent line
      doc.setFillColor(...brandGold);
      doc.rect(margin, 60, 40, 1.5, "F");
      
      // Logo on cover page
      if (logoDataUrl) {
        const coverLogoHeight = 22;
        const coverLogoWidth = coverLogoHeight * logoAspect;
        doc.addImage(logoDataUrl, "PNG", margin, 30, coverLogoWidth, coverLogoHeight);
      } else {
        doc.setFontSize(10);
        doc.setTextColor(...brandSea);
        doc.text("BOLD & BEYOND", margin, 50);
      }
      
      // Title
      doc.setFontSize(42);
      doc.setTextColor(...white);
      doc.text("Business", margin, 85);
      doc.text("Plan", margin, 103);
      
      // Subtitle with sea color
      doc.setFontSize(18);
      doc.setTextColor(...brandSea);
      doc.text("Smart Wellness Wearables", margin, 120);
      
      // Year
      doc.setFontSize(14);
      doc.setTextColor(...brandGold);
      doc.text("2026 — 2030", margin, 135);
      
      // Description
      doc.setFontSize(11);
      doc.setTextColor(180, 190, 210);
      const coverDesc = doc.splitTextToSize(
        "Pioneering the future of wellness technology in the UAE. Our smart bands combine cutting-edge health monitoring with the Bold & Beyond ecosystem to create a comprehensive wellness experience.",
        contentWidth * 0.7
      );
      doc.text(coverDesc, margin, 155);
      
      // Bottom info
      doc.setFontSize(9);
      doc.setTextColor(140, 150, 170);
      doc.text("Prepared by Bold & Beyond", margin, pageHeight - 40);
      doc.text("United Arab Emirates", margin, pageHeight - 33);
      doc.text("June 2026", margin, pageHeight - 26);
      doc.text("CONFIDENTIAL", pageWidth - margin, pageHeight - 26, { align: "right" });

      // ============ TABLE OF CONTENTS ============
      doc.addPage();
      currentPage++;
      drawPageHeader(currentPage);
      
      let y = 25;
      doc.setFontSize(24);
      doc.setTextColor(...brandNavy);
      doc.text("Table of Contents", margin, y);
      y += 15;
      
      doc.setFillColor(...brandSea);
      doc.rect(margin, y - 3, 30, 1, "F");
      y += 10;
      
      const tocItems = [
        { title: "Executive Summary", page: "3" },
        { title: "Development Timeline", page: "4" },
        { title: "Product Lineup & Pricing", page: "5" },
        { title: "Competitive Landscape", page: "6" },
        { title: "UAE Government Alignment", page: "7" },
        { title: "Technical Architecture", page: "8" },
        { title: "Manufacturing & Supply Chain", page: "9" },
        { title: "Marketing Budget", page: "10" },
        { title: "Team & Manpower", page: "11" },
        { title: "Sales & Support", page: "12" },
        { title: "Market Penetration & Go-To-Market", page: "13" },
        { title: "Selling Across Platforms & Marketing", page: "14" },
        { title: "Marketing Funnel & Inventory", page: "15" },
        { title: "Financial Projections", page: "16" },
      ];
      
      tocItems.forEach((item, index) => {
        doc.setFontSize(11);
        doc.setTextColor(...brandNavy);
        doc.text(`${(index + 1).toString().padStart(2, "0")}`, margin, y);
        doc.text(item.title, margin + 12, y);
        
        // Dotted line
        doc.setDrawColor(200, 200, 200);
        doc.setLineDashPattern([1, 1], 0);
        const textWidth = doc.getTextWidth(item.title);
        doc.line(margin + 14 + textWidth, y - 1, pageWidth - margin - 10, y - 1);
        doc.setLineDashPattern([], 0);
        
        doc.setTextColor(...brandSea);
        doc.text(item.page, pageWidth - margin, y, { align: "right" });
        y += 10;
      });

      // ============ EXECUTIVE SUMMARY ============
      doc.addPage();
      currentPage++;
      drawPageHeader(currentPage);
      
      y = 25;
      doc.setFontSize(22);
      doc.setTextColor(...brandNavy);
      doc.text("Executive Summary", margin, y);
      y += 5;
      doc.setFillColor(...brandSea);
      doc.rect(margin, y, 30, 1, "F");
      y += 12;
      
      doc.setFontSize(10);
      doc.setTextColor(60, 60, 80);
      const execSummary = doc.splitTextToSize(
        "Bold & Beyond is expanding into the wearable technology market with a line of smart wellness bands designed specifically for the UAE and GCC markets. Our products integrate seamlessly with our existing wellness platform, providing users with a holistic approach to mental and physical health.",
        contentWidth
      );
      doc.text(execSummary, margin, y);
      y += execSummary.length * 5 + 5;
      
      const execSummary2 = doc.splitTextToSize(
        "With the UAE's strong government support for healthtech initiatives and a tech-savvy population of 10+ million, we are positioned to capture significant market share in the growing AED 2.5 billion wearables market.",
        contentWidth
      );
      doc.text(execSummary2, margin, y);
      y += execSummary2.length * 5 + 15;
      
      // Key metrics boxes
      const metrics = [
        { label: "Target Market", value: "10M+ UAE residents" },
        { label: "Market Growth", value: "18% CAGR" },
        { label: "Year 1 Users", value: "25,000" },
        { label: "Year 3 Revenue", value: "AED 120M" },
      ];
      
      const boxWidth = (contentWidth - 15) / 4;
      metrics.forEach((metric, i) => {
        const x = margin + i * (boxWidth + 5);
        doc.setFillColor(...lightGray);
        doc.roundedRect(x, y, boxWidth, 25, 3, 3, "F");
        doc.setFontSize(8);
        doc.setTextColor(...gray);
        doc.text(metric.label, x + boxWidth / 2, y + 9, { align: "center" });
        doc.setFontSize(11);
        doc.setTextColor(...brandNavy);
        doc.text(metric.value, x + boxWidth / 2, y + 18, { align: "center" });
      });

      // ============ DEVELOPMENT TIMELINE ============
      doc.addPage();
      currentPage++;
      drawPageHeader(currentPage);
      
      y = 25;
      doc.setFontSize(22);
      doc.setTextColor(...brandNavy);
      doc.text("Development Timeline", margin, y);
      y += 5;
      doc.setFillColor(...brandSea);
      doc.rect(margin, y, 30, 1, "F");
      y += 15;
      
      developmentTimeline.forEach((phase, index) => {
        // Phase card
        doc.setFillColor(index === 0 ? 230 : 248, index === 0 ? 245 : 250, index === 0 ? 243 : 252);
        doc.roundedRect(margin, y, contentWidth, 40, 3, 3, "F");
        
        // Status indicator
        const statusColor: [number, number, number] = phase.status === "in-progress" ? brandSea : [200, 200, 200];
        doc.setFillColor(...statusColor);
        doc.circle(margin + 6, y + 8, 3, "F");
        
        doc.setFontSize(11);
        doc.setTextColor(...brandNavy);
        doc.text(phase.phase, margin + 14, y + 10);
        
        doc.setFontSize(9);
        doc.setTextColor(...brandSea);
        doc.text(phase.duration, margin + 14, y + 18);
        
        doc.setFontSize(8);
        doc.setTextColor(...gray);
        const itemsText = phase.items.slice(0, 3).join(" • ");
        const wrappedItems = doc.splitTextToSize(itemsText, contentWidth - 20);
        doc.text(wrappedItems, margin + 14, y + 26);
        
        y += 45;
      });

      // ============ PRODUCT LINEUP ============
      doc.addPage();
      currentPage++;
      drawPageHeader(currentPage);
      
      y = 25;
      doc.setFontSize(22);
      doc.setTextColor(...brandNavy);
      doc.text("Product Lineup & Pricing", margin, y);
      y += 5;
      doc.setFillColor(...brandSea);
      doc.rect(margin, y, 30, 1, "F");
      y += 15;
      
      const productColWidth = (contentWidth - 10) / 3;
      products.forEach((product, index) => {
        const x = margin + index * (productColWidth + 5);
        
        // Card background
        doc.setFillColor(index === 1 ? 240 : 248, index === 1 ? 250 : 250, index === 1 ? 248 : 252);
        doc.roundedRect(x, y, productColWidth, 100, 3, 3, "F");
        
        if (index === 1) {
          doc.setFillColor(...brandSea);
          doc.roundedRect(x, y, productColWidth, 4, 3, 3, "F");
        }
        
        doc.setFontSize(10);
        doc.setTextColor(...brandNavy);
        doc.text(product.name, x + 5, y + 14);
        
        doc.setFontSize(8);
        doc.setTextColor(...gray);
        doc.text(product.tagline, x + 5, y + 22);
        
        doc.setFontSize(14);
        doc.setTextColor(...brandNavy);
        doc.text(product.price, x + 5, y + 35);
        
        doc.setFontSize(7);
        doc.setTextColor(...gray);
        product.features.slice(0, 6).forEach((feature, fi) => {
          doc.text(`• ${feature}`, x + 5, y + 45 + fi * 8);
        });
      });

      // ============ COMPETITIVE LANDSCAPE ============
      doc.addPage();
      currentPage++;
      drawPageHeader(currentPage);
      
      y = 25;
      doc.setFontSize(22);
      doc.setTextColor(...brandNavy);
      doc.text("Competitive Landscape", margin, y);
      y += 5;
      doc.setFillColor(...brandSea);
      doc.rect(margin, y, 30, 1, "F");
      y += 12;
      
      autoTable(doc, {
        startY: y,
        head: [["Competitor", "Company", "Price Range", "Market Share"]],
        body: competitors.map(c => [c.name, c.company, c.price, c.marketShare]),
        theme: "grid",
        headStyles: { fillColor: brandNavy, fontSize: 9, textColor: white },
        bodyStyles: { fontSize: 8, textColor: [40, 40, 60] },
        alternateRowStyles: { fillColor: lightGray },
        margin: { left: margin, right: margin },
      });

      // ============ GOVERNMENT ALIGNMENT ============
      doc.addPage();
      currentPage++;
      drawPageHeader(currentPage);
      
      y = 25;
      doc.setFontSize(22);
      doc.setTextColor(...brandNavy);
      doc.text("UAE Government Alignment", margin, y);
      y += 5;
      doc.setFillColor(...brandSea);
      doc.rect(margin, y, 30, 1, "F");
      y += 15;
      
      governmentInitiatives.forEach((initiative) => {
        doc.setFillColor(...lightGray);
        doc.roundedRect(margin, y, contentWidth, 22, 2, 2, "F");
        
        doc.setFontSize(10);
        doc.setTextColor(...brandNavy);
        doc.text(initiative.name, margin + 5, y + 8);
        
        doc.setFontSize(8);
        doc.setTextColor(...gray);
        const alignText = doc.splitTextToSize(initiative.alignment, contentWidth - 10);
        doc.text(alignText[0], margin + 5, y + 16);
        
        y += 26;
      });

      // ============ TECHNICAL ARCHITECTURE ============
      doc.addPage();
      currentPage++;
      drawPageHeader(currentPage);
      
      y = 25;
      doc.setFontSize(22);
      doc.setTextColor(...brandNavy);
      doc.text("Technical Architecture", margin, y);
      y += 5;
      doc.setFillColor(...brandSea);
      doc.rect(margin, y, 30, 1, "F");
      y += 15;
      
      const archColWidth = (contentWidth - 15) / 4;
      codeArchitecture.forEach((layer, index) => {
        const x = margin + index * (archColWidth + 5);
        doc.setFillColor(...lightGray);
        doc.roundedRect(x, y, archColWidth, 65, 3, 3, "F");
        
        doc.setFontSize(9);
        doc.setTextColor(...brandNavy);
        doc.text(layer.layer, x + 3, y + 10);
        
        doc.setFontSize(7);
        doc.setTextColor(...brandSea);
        doc.text(layer.tech, x + 3, y + 18);
        
        doc.setFontSize(7);
        doc.setTextColor(...gray);
        layer.components.forEach((comp, ci) => {
          doc.text(`• ${comp}`, x + 3, y + 28 + ci * 7);
        });
      });

      // ============ MANUFACTURING & SUPPLY CHAIN ============
      doc.addPage();
      currentPage++;
      drawPageHeader(currentPage);
      
      y = 25;
      doc.setFontSize(22);
      doc.setTextColor(...brandNavy);
      doc.text("Manufacturing & Supply Chain", margin, y);
      y += 5;
      doc.setFillColor(...brandSea);
      doc.rect(margin, y, 30, 1, "F");
      y += 12;
      
      // Unit Cost Table
      doc.setFontSize(12);
      doc.setTextColor(...brandNavy);
      doc.text("Unit Cost Analysis", margin, y);
      y += 5;
      
      autoTable(doc, {
        startY: y,
        head: [["Product", "Manufacturing", "Packaging", "Shipping", "Total Cost", "Retail", "Margin"]],
        body: manufacturingAnalysis.unitCosts.map(c => [c.product, c.manufacturing, c.packaging, c.shipping, c.total, c.retail, c.margin]),
        theme: "grid",
        headStyles: { fillColor: brandNavy, fontSize: 8, textColor: white },
        bodyStyles: { fontSize: 8, textColor: [40, 40, 60] },
        alternateRowStyles: { fillColor: lightGray },
        margin: { left: margin, right: margin },
      });
      
      y = (doc as any).lastAutoTable.finalY + 15;
      
      // Order Plan
      doc.setFontSize(12);
      doc.setTextColor(...brandNavy);
      doc.text("Production Order Plan", margin, y);
      y += 5;
      
      autoTable(doc, {
        startY: y,
        head: [["Phase", "Quantity", "Timeline", "Investment"]],
        body: manufacturingAnalysis.orderPlan.map(p => [p.phase, p.quantity.toLocaleString(), p.timeline, p.investment]),
        theme: "grid",
        headStyles: { fillColor: brandSea, fontSize: 9, textColor: white },
        bodyStyles: { fontSize: 9, textColor: [40, 40, 60] },
        alternateRowStyles: { fillColor: lightGray },
        margin: { left: margin, right: margin },
      });

      // ============ MARKETING BUDGET ============
      doc.addPage();
      currentPage++;
      drawPageHeader(currentPage);
      
      y = 25;
      doc.setFontSize(22);
      doc.setTextColor(...brandNavy);
      doc.text("Marketing Budget", margin, y);
      y += 5;
      doc.setFillColor(...brandSea);
      doc.rect(margin, y, 30, 1, "F");
      y += 15;
      
      marketingBudget.phases.forEach((phase) => {
        doc.setFontSize(11);
        doc.setTextColor(...brandNavy);
        doc.text(`${phase.phase} — ${phase.budget}`, margin, y);
        y += 7;
        
        phase.activities.forEach((activity) => {
          doc.setFontSize(9);
          doc.setTextColor(...gray);
          doc.text(`• ${activity.item}`, margin + 5, y);
          doc.text(activity.cost, pageWidth - margin, y, { align: "right" });
          y += 6;
        });
        y += 8;
      });
      
      // Total
      doc.setFillColor(...brandNavy);
      doc.roundedRect(margin, y, contentWidth, 20, 3, 3, "F");
      doc.setFontSize(12);
      doc.setTextColor(...white);
      doc.text("Total Marketing Investment", margin + 10, y + 13);
      doc.setTextColor(...brandGold);
      doc.text(marketingBudget.totalBudget, pageWidth - margin - 10, y + 13, { align: "right" });

      // ============ TEAM & MANPOWER ============
      doc.addPage();
      currentPage++;
      drawPageHeader(currentPage);
      
      y = 25;
      doc.setFontSize(22);
      doc.setTextColor(...brandNavy);
      doc.text("Team & Manpower", margin, y);
      y += 5;
      doc.setFillColor(...brandSea);
      doc.rect(margin, y, 30, 1, "F");
      y += 15;
      
      teamStructure.phases.forEach((phase) => {
        doc.setFontSize(11);
        doc.setTextColor(...brandNavy);
        doc.text(`${phase.phase} — ${phase.headcount} people`, margin, y);
        doc.setFontSize(9);
        doc.setTextColor(...brandSea);
        doc.text(`Monthly: ${phase.monthlyBurn} | Annual: ${phase.annualCost}`, margin, y + 6);
        y += 12;
        
        phase.roles.forEach((role) => {
          doc.setFontSize(8);
          doc.setTextColor(...gray);
          doc.text(`${role.count}x ${role.role}`, margin + 5, y);
          doc.text(`${role.salary}/mo`, pageWidth - margin, y, { align: "right" });
          y += 5;
        });
        y += 10;
      });

      // ============ SALES & SUPPORT ============
      doc.addPage();
      currentPage++;
      drawPageHeader(currentPage);
      
      y = 25;
      doc.setFontSize(22);
      doc.setTextColor(...brandNavy);
      doc.text("Sales & Support", margin, y);
      y += 5;
      doc.setFillColor(...brandSea);
      doc.rect(margin, y, 30, 1, "F");
      y += 12;
      
      doc.setFontSize(12);
      doc.setTextColor(...brandNavy);
      doc.text("Sales Channels", margin, y);
      y += 5;
      
      autoTable(doc, {
        startY: y,
        head: [["Channel", "Commission", "Revenue Target"]],
        body: salesSupport.salesChannels.map(c => [c.channel, c.commission, c.target]),
        theme: "grid",
        headStyles: { fillColor: brandNavy, fontSize: 9, textColor: white },
        bodyStyles: { fontSize: 9, textColor: [40, 40, 60] },
        alternateRowStyles: { fillColor: lightGray },
        margin: { left: margin, right: margin },
      });
      
      y = (doc as any).lastAutoTable.finalY + 15;
      
      doc.setFontSize(12);
      doc.setTextColor(...brandNavy);
      doc.text("Support Structure", margin, y);
      y += 5;
      
      autoTable(doc, {
        startY: y,
        head: [["Tier", "Response Time", "Staff", "Cost"]],
        body: salesSupport.supportStructure.map(t => [t.tier, t.response, t.staff.toString(), t.cost]),
        theme: "grid",
        headStyles: { fillColor: brandSea, fontSize: 9, textColor: white },
        bodyStyles: { fontSize: 9, textColor: [40, 40, 60] },
        alternateRowStyles: { fillColor: lightGray },
        margin: { left: margin, right: margin },
      });

      // ============ MARKET PENETRATION ============
      doc.addPage();
      currentPage++;
      drawPageHeader(currentPage);
      
      y = 25;
      doc.setFontSize(22);
      doc.setTextColor(...brandNavy);
      doc.text("Market Penetration & Go-To-Market", margin, y);
      y += 5;
      doc.setFillColor(...brandSea);
      doc.rect(margin, y, 30, 1, "F");
      y += 14;
      
      // Market sizing boxes
      const sizeBoxWidth = (contentWidth - 15) / 4;
      marketSizing.forEach((item, i) => {
        const x = margin + i * (sizeBoxWidth + 5);
        doc.setFillColor(...lightGray);
        doc.roundedRect(x, y, sizeBoxWidth, 26, 3, 3, "F");
        doc.setFontSize(6.5);
        doc.setTextColor(...gray);
        doc.text(doc.splitTextToSize(item.label, sizeBoxWidth - 4), x + sizeBoxWidth / 2, y + 7, { align: "center" });
        doc.setFontSize(12);
        doc.setTextColor(...brandSea);
        doc.text(item.value, x + sizeBoxWidth / 2, y + 16, { align: "center" });
        doc.setFontSize(6);
        doc.setTextColor(...gray);
        doc.text(doc.splitTextToSize(item.note, sizeBoxWidth - 4), x + sizeBoxWidth / 2, y + 22, { align: "center" });
      });
      y += 34;
      
      // Phased penetration strategy table
      doc.setFontSize(12);
      doc.setTextColor(...brandNavy);
      doc.text("Phased Penetration Strategy", margin, y);
      y += 4;
      
      autoTable(doc, {
        startY: y,
        head: [["Phase", "Timeline", "Objective & Key Actions"]],
        body: marketPenetration.map(p => [
          p.step,
          p.timeline,
          p.objective + "\n\nKey actions:\n• " + p.actions.join("\n• "),
        ]),
        theme: "grid",
        headStyles: { fillColor: brandNavy, fontSize: 9, textColor: white },
        bodyStyles: { fontSize: 7.5, textColor: [40, 40, 60], valign: "top" },
        columnStyles: { 0: { cellWidth: 38, fontStyle: "bold" }, 1: { cellWidth: 28 } },
        alternateRowStyles: { fillColor: lightGray },
        margin: { left: margin, right: margin },
      });

      // ============ SELLING ACROSS PLATFORMS ============
      doc.addPage();
      currentPage++;
      drawPageHeader(currentPage);
      
      y = 25;
      doc.setFontSize(22);
      doc.setTextColor(...brandNavy);
      doc.text("Selling Across Platforms", margin, y);
      y += 5;
      doc.setFillColor(...brandSea);
      doc.rect(margin, y, 30, 1, "F");
      y += 12;
      
      autoTable(doc, {
        startY: y,
        head: [["Platform", "Type", "Fee", "Net Margin", "Mix", "Role"]],
        body: salesPlatforms.map(p => [p.name, p.type, p.commission, p.margin, p.target, p.notes]),
        theme: "grid",
        headStyles: { fillColor: brandNavy, fontSize: 8, textColor: white },
        bodyStyles: { fontSize: 7.5, textColor: [40, 40, 60] },
        columnStyles: { 5: { cellWidth: 45 } },
        alternateRowStyles: { fillColor: lightGray },
        margin: { left: margin, right: margin },
      });
      
      y = (doc as any).lastAutoTable.finalY + 14;
      
      // Marketing Strategy
      doc.setFontSize(16);
      doc.setTextColor(...brandNavy);
      doc.text("Marketing Strategy", margin, y);
      y += 4;
      doc.setFillColor(...brandSea);
      doc.rect(margin, y, 24, 0.8, "F");
      y += 8;
      
      doc.setFontSize(9);
      doc.setTextColor(60, 60, 80);
      const mktIntro = doc.splitTextToSize(
        "A full-funnel, brand-led approach combining performance marketing for efficient acquisition with influencer, content and experiential channels that build a wellness brand customers trust and stay loyal to.",
        contentWidth
      );
      doc.text(mktIntro, margin, y);
      y += mktIntro.length * 4.5 + 4;
      
      const pillarColWidth = (contentWidth - 5) / 2;
      marketingStrategy.forEach((pillar, i) => {
        const col = i % 2;
        const row = Math.floor(i / 2);
        const x = margin + col * (pillarColWidth + 5);
        const py = y + row * 38;
        doc.setFillColor(...lightGray);
        doc.roundedRect(x, py, pillarColWidth, 34, 3, 3, "F");
        doc.setFontSize(9.5);
        doc.setTextColor(...brandNavy);
        doc.text(pillar.pillar, x + 4, py + 7);
        doc.setFontSize(7);
        doc.setTextColor(...gray);
        const desc = doc.splitTextToSize(pillar.description, pillarColWidth - 8);
        doc.text(desc.slice(0, 4), x + 4, py + 13);
        doc.setFontSize(6.5);
        doc.setTextColor(...brandSea);
        doc.text(doc.splitTextToSize(pillar.tactics.join("  •  "), pillarColWidth - 8), x + 4, py + 30);
      });

      // ============ MARKETING FUNNEL & INVENTORY ============
      doc.addPage();
      currentPage++;
      drawPageHeader(currentPage);
      
      y = 25;
      doc.setFontSize(16);
      doc.setTextColor(...brandNavy);
      doc.text("Full-Funnel Marketing Approach", margin, y);
      y += 5;
      doc.setFillColor(...brandSea);
      doc.rect(margin, y, 24, 0.8, "F");
      y += 10;
      
      autoTable(doc, {
        startY: y,
        head: [["Stage", "Goal", "Channels", "Key Metric"]],
        body: marketingFunnel.map(f => [f.stage, f.goal, f.channels, f.metric]),
        theme: "grid",
        headStyles: { fillColor: brandSea, fontSize: 9, textColor: white },
        bodyStyles: { fontSize: 8, textColor: [40, 40, 60] },
        alternateRowStyles: { fillColor: lightGray },
        margin: { left: margin, right: margin },
      });
      
      y = (doc as any).lastAutoTable.finalY + 16;
      
      // Inventory & Fulfilment
      doc.setFontSize(16);
      doc.setTextColor(...brandNavy);
      doc.text("Inventory & Fulfilment", margin, y);
      y += 4;
      doc.setFillColor(...brandSea);
      doc.rect(margin, y, 24, 0.8, "F");
      y += 8;
      
      doc.setFontSize(9);
      doc.setTextColor(60, 60, 80);
      const invIntro = doc.splitTextToSize(inventoryStrategy.overview, contentWidth);
      doc.text(invIntro, margin, y);
      y += invIntro.length * 4.5 + 4;
      
      const invColWidth = (contentWidth - 15) / 4;
      inventoryStrategy.pillars.forEach((pillar, i) => {
        const x = margin + i * (invColWidth + 5);
        doc.setFillColor(...lightGray);
        doc.roundedRect(x, y, invColWidth, 42, 3, 3, "F");
        doc.setFontSize(8);
        doc.setTextColor(...brandNavy);
        doc.text(doc.splitTextToSize(pillar.title, invColWidth - 4), x + 3, y + 7);
        doc.setFontSize(6.5);
        doc.setTextColor(...gray);
        let py = y + 16;
        pillar.points.forEach((point) => {
          const wrapped = doc.splitTextToSize(`• ${point}`, invColWidth - 6);
          doc.text(wrapped, x + 3, py);
          py += wrapped.length * 3.2 + 1.5;
        });
      });
      y += 50;
      
      // Inventory KPIs
      doc.setFillColor(...brandNavy);
      doc.roundedRect(margin, y, contentWidth, 22, 3, 3, "F");
      const invMetricWidth = contentWidth / 4;
      inventoryStrategy.metrics.forEach((metric, i) => {
        const x = margin + i * invMetricWidth;
        doc.setFontSize(7);
        doc.setTextColor(180, 190, 210);
        doc.text(metric.metric, x + invMetricWidth / 2, y + 8, { align: "center" });
        doc.setFontSize(11);
        doc.setTextColor(...brandGold);
        doc.text(metric.target, x + invMetricWidth / 2, y + 16, { align: "center" });
      });

      // ============ FINANCIAL PROJECTIONS ============
      doc.addPage();
      currentPage++;
      drawPageHeader(currentPage);
      
      y = 25;
      doc.setFontSize(22);
      doc.setTextColor(...brandNavy);
      doc.text("Financial Projections", margin, y);
      y += 5;
      doc.setFillColor(...brandSea);
      doc.rect(margin, y, 30, 1, "F");
      y += 15;
      
      // Chart - Revenue bars
      const chartX = margin + 10;
      const chartWidth = contentWidth - 20;
      const chartHeight = 80;
      const barWidth = chartWidth / financialProjections.length - 10;
      
      // Chart background
      doc.setFillColor(...lightGray);
      doc.roundedRect(margin, y - 5, contentWidth, chartHeight + 30, 3, 3, "F");
      
      // Draw bars
      financialProjections.forEach((proj, index) => {
        const barHeight = (proj.revenue / 250) * chartHeight;
        const bx = chartX + index * (barWidth + 10) + 5;
        const by = y + chartHeight - barHeight;
        
        // Bar gradient effect (solid sea color)
        doc.setFillColor(...brandSea);
        if (barHeight > 0) {
          doc.roundedRect(bx, by, barWidth, barHeight, 2, 2, "F");
        }
        
        // Value label
        doc.setFontSize(9);
        doc.setTextColor(...brandNavy);
        if (proj.revenue > 0) {
          doc.text(`${proj.revenue}M`, bx + barWidth / 2, by - 3, { align: "center" });
        }
        
        // Year label
        doc.setFontSize(9);
        doc.setTextColor(...gray);
        doc.text(proj.year, bx + barWidth / 2, y + chartHeight + 10, { align: "center" });
        doc.setFontSize(7);
        doc.text(`${proj.users.toLocaleString()} users`, bx + barWidth / 2, y + chartHeight + 17, { align: "center" });
      });
      
      y += chartHeight + 40;
      
      // Key Metrics
      const keyMetrics = [
        { label: "Total Investment", value: "AED 35M" },
        { label: "Break-even", value: "Q2 2029" },
        { label: "5-Year Revenue", value: "AED 423M" },
        { label: "Target Valuation (2030)", value: "AED 500M" },
      ];
      
      const metricBoxWidth = (contentWidth - 15) / 4;
      keyMetrics.forEach((metric, i) => {
        const x = margin + i * (metricBoxWidth + 5);
        doc.setFillColor(...brandNavy);
        doc.roundedRect(x, y, metricBoxWidth, 22, 3, 3, "F");
        doc.setFontSize(7);
        doc.setTextColor(180, 190, 210);
        doc.text(metric.label, x + metricBoxWidth / 2, y + 8, { align: "center" });
        doc.setFontSize(11);
        doc.setTextColor(...brandGold);
        doc.text(metric.value, x + metricBoxWidth / 2, y + 17, { align: "center" });
      });

      // Save
      doc.save("Bold_and_Beyond_Business_Plan_2026-2030.pdf");
    } catch (error) {
      console.error("PDF export error:", error);
    } finally {
      setIsExporting(false);
    }
  }, []);

  return (
    <GlassContainer gradient="sea" className="pb-20">
      {/* Export PDF Button - Fixed */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={exportToPDF}
          disabled={isExporting}
          className="flex items-center gap-2 bg-brand-navy text-white px-5 py-3 rounded-full font-medium shadow-lg hover:bg-brand-navy/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isExporting ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Generating...</span>
            </>
          ) : (
            <>
              <Download className="h-4 w-4" />
              <span>Export PDF</span>
            </>
          )}
        </button>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center">
        <div className="container mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <Watch className="h-5 w-5 text-brand-navy" />
              <span className="text-sm font-medium text-brand-navy">
                Business Plan 2026-2030
              </span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-display font-bold text-brand-navy mb-6">
              Bold & Beyond
              <span className="block text-palette-sea">Smart Wellness Wearables</span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
              Pioneering the future of wellness technology in the UAE. Our smart bands 
              combine cutting-edge health monitoring with the Bold & Beyond ecosystem 
              to create a comprehensive wellness experience.
            </p>

          </motion.div>
        </div>

        {/* Floating Elements */}
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-10 hidden lg:block"
        >
          <div className="bg-white/30 backdrop-blur-md rounded-2xl p-4 shadow-glass">
            <Heart className="h-8 w-8 text-red-500" />
          </div>
        </motion.div>

        <motion.div
          animate={{ y: [0, 15, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-1/3 right-10 hidden lg:block"
        >
          <div className="bg-white/30 backdrop-blur-md rounded-2xl p-4 shadow-glass">
            <Activity className="h-8 w-8 text-palette-sea" />
          </div>
        </motion.div>

        <motion.div
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-1/4 left-1/4 hidden lg:block"
        >
          <div className="bg-white/30 backdrop-blur-md rounded-2xl p-4 shadow-glass">
            <Brain className="h-8 w-8 text-purple-500" />
          </div>
        </motion.div>
      </section>

      {/* Executive Summary */}
      <section className="container mx-auto px-4 py-16">
        <GlassCard className="p-8 md:p-12">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-brand-navy mb-6">
            Executive Summary
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <p className="text-gray-700">
                Bold & Beyond is expanding into the wearable technology market with a line of 
                smart wellness bands designed specifically for the UAE and GCC markets. Our 
                products integrate seamlessly with our existing wellness platform, providing 
                users with a holistic approach to mental and physical health.
              </p>
              <p className="text-gray-700">
                With the UAE's strong government support for healthtech initiatives and a 
                tech-savvy population of 10+ million, we are positioned to capture significant 
                market share in the growing AED 2.5 billion wearables market.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Target, label: "Target Market", value: "10M+ UAE residents" },
                { icon: TrendingUp, label: "Market Growth", value: "18% CAGR" },
                { icon: Users, label: "Year 1 Users", value: "25,000" },
                { icon: DollarSign, label: "Year 3 Revenue", value: "AED 120M" },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/50 rounded-2xl p-4"
                >
                  <stat.icon className="h-6 w-6 text-palette-sea mb-2" />
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-lg font-bold text-brand-navy">{stat.value}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </GlassCard>
      </section>

      {/* Development Timeline */}
      <section id="timeline" className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-brand-navy mb-4">
            Development Timeline
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our comprehensive roadmap from concept to market leadership
          </p>
        </div>

        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-palette-sea via-palette-sky to-palette-sand" />

          {/* Timeline Items */}
          <div className="space-y-8">
            {developmentTimeline.map((phase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5 }}
                className={cn(
                  "relative flex items-start gap-4",
                  "md:items-center",
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                )}
              >
                {/* Timeline Dot */}
                <div
                  className={cn(
                    "absolute left-4 md:left-1/2 -translate-x-1/2 z-10",
                    "w-4 h-4 rounded-full border-4 border-white",
                    phase.status === "completed"
                      ? "bg-green-500"
                      : phase.status === "in-progress"
                      ? "bg-palette-sea animate-pulse"
                      : "bg-gray-300"
                  )}
                />

                {/* Content Card */}
                <div
                  className={cn(
                    "ml-10 md:ml-0 md:w-[45%]",
                    index % 2 === 0 ? "md:pr-8 md:text-right" : "md:pl-8"
                  )}
                >
                  <GlassCard
                    className={cn(
                      "p-6 cursor-pointer",
                      activeTimeline === index && "ring-2 ring-palette-sea"
                    )}
                    onClick={() => setActiveTimeline(index)}
                    hover={true}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <Calendar className="h-5 w-5 text-palette-sea" />
                      <span className="text-sm font-medium text-palette-sea">
                        {phase.duration}
                      </span>
                      {phase.status === "completed" && (
                        <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="h-3 w-3" /> Complete
                        </span>
                      )}
                      {phase.status === "in-progress" && (
                        <span className="inline-flex items-center gap-1 text-xs bg-palette-sea/20 text-palette-sea px-2 py-0.5 rounded-full">
                          <Zap className="h-3 w-3" /> In Progress
                        </span>
                      )}
                    </div>
                    
                    <h3 className="text-lg font-bold text-brand-navy mb-3">
                      {phase.phase}
                    </h3>

                    <AnimatePresence>
                      {activeTimeline === index && (
                        <motion.ul
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-2"
                        >
                          {phase.items.map((item, itemIndex) => (
                            <li
                              key={itemIndex}
                              className="flex items-start gap-2 text-sm text-gray-600"
                            >
                              <ChevronRight className="h-4 w-4 text-palette-sea flex-shrink-0 mt-0.5" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  </GlassCard>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Lineup */}
      <section id="products" className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-brand-navy mb-4">
            Product Lineup & Pricing
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Strategically priced for the UAE market, offering value at every tier
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard
                className={cn(
                  "p-6 h-full flex flex-col relative overflow-hidden",
                  product.popular && "ring-2 ring-palette-sea"
                )}
              >
                {product.popular && (
                  <div className="absolute top-4 right-4">
                    <span className="bg-palette-sea text-white text-xs font-bold px-3 py-1 rounded-full">
                      MOST POPULAR
                    </span>
                  </div>
                )}

                <div className="mb-4">
                  <Watch
                    className={cn(
                      "h-12 w-12 mb-4",
                      product.color === "sea" && "text-palette-sea",
                      product.color === "sky" && "text-palette-sky",
                      product.color === "sand" && "text-amber-600"
                    )}
                  />
                  <h3 className="text-xl font-bold text-brand-navy">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-600">{product.tagline}</p>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-brand-navy">
                      {product.price}
                    </span>
                    <span className="text-sm text-gray-400 line-through">
                      {product.comparePrice}
                    </span>
                  </div>
                  <span className="text-xs text-green-600 font-medium">
                    Launch Price
                  </span>
                </div>

                <ul className="space-y-2 flex-1">
                  {product.features.map((feature, fIndex) => (
                    <li
                      key={fIndex}
                      className="flex items-start gap-2 text-sm text-gray-700"
                    >
                      <CheckCircle2 className="h-4 w-4 text-palette-sea flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Pricing Strategy Note */}
        <GlassCard className="mt-8 p-6">
          <h3 className="text-lg font-bold text-brand-navy mb-3">
            Pricing Strategy for UAE Market
          </h3>
          <div className="grid md:grid-cols-3 gap-6 text-sm text-gray-700">
            <div>
              <strong className="text-brand-navy">Competitive Positioning:</strong>
              <p className="mt-1">
                Priced 20-30% below Apple Watch while offering comparable health features, 
                targeting the mid-premium segment.
              </p>
            </div>
            <div>
              <strong className="text-brand-navy">Bundle Strategy:</strong>
              <p className="mt-1">
                Bold Band + 1-year therapy subscription bundles create recurring revenue 
                and platform stickiness.
              </p>
            </div>
            <div>
              <strong className="text-brand-navy">Corporate Wellness:</strong>
              <p className="mt-1">
                B2B pricing at 40% discount for enterprise orders of 100+ units, 
                targeting UAE government and corporate wellness programs.
              </p>
            </div>
          </div>
        </GlassCard>
      </section>

      {/* Competitor Analysis */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-brand-navy mb-4">
            Competitive Landscape
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Understanding our position in the UAE wearables market
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Competitor Cards */}
          <div className="space-y-4">
            {competitors.map((competitor, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard
                  className={cn(
                    "p-4 cursor-pointer",
                    activeCompetitor === index && "ring-2 ring-palette-sea"
                  )}
                  onClick={() =>
                    setActiveCompetitor(activeCompetitor === index ? null : index)
                  }
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-brand-navy">{competitor.name}</h3>
                      <p className="text-sm text-gray-600">{competitor.company}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-palette-sea">{competitor.price}</p>
                      <p className="text-xs text-gray-500">
                        {competitor.marketShare} market share
                      </p>
                    </div>
                  </div>

                  <AnimatePresence>
                    {activeCompetitor === index && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 pt-4 border-t border-gray-200"
                      >
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs font-medium text-green-600 mb-2">
                              Strengths
                            </p>
                            <ul className="space-y-1">
                              {competitor.strengths.map((s, i) => (
                                <li key={i} className="text-xs text-gray-600">
                                  • {s}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-red-600 mb-2">
                              Weaknesses
                            </p>
                            <ul className="space-y-1">
                              {competitor.weaknesses.map((w, i) => (
                                <li key={i} className="text-xs text-gray-600">
                                  • {w}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </GlassCard>
              </motion.div>
            ))}
          </div>

          {/* Our Advantages */}
          <GlassCard className="p-6 h-fit">
            <h3 className="text-xl font-bold text-brand-navy mb-4">
              Bold Band Competitive Advantages
            </h3>
            <div className="space-y-4">
              {[
                {
                  icon: Globe,
                  title: "Local Market Focus",
                  desc: "Designed specifically for UAE/GCC users with Arabic language support, local health metrics, and regional customer service.",
                },
                {
                  icon: Brain,
                  title: "Mental Wellness Integration",
                  desc: "Unique integration with Bold & Beyond therapy platform for holistic mental + physical health monitoring.",
                },
                {
                  icon: Landmark,
                  title: "Government Alignment",
                  desc: "Aligned with UAE national health initiatives, enabling government partnerships and procurement opportunities.",
                },
                {
                  icon: Battery,
                  title: "Superior Battery Life",
                  desc: "Up to 21 days on a single charge, beating all major competitors in the premium segment.",
                },
                {
                  icon: Shield,
                  title: "Data Sovereignty",
                  desc: "All health data stored in UAE data centers, compliant with local regulations and HIPAA standards.",
                },
                {
                  icon: DollarSign,
                  title: "Value Pricing",
                  desc: "Premium features at mid-market prices, capturing users priced out of Apple/Samsung ecosystem.",
                },
              ].map((advantage, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-xl bg-palette-sea/20 flex items-center justify-center">
                      <advantage.icon className="h-5 w-5 text-palette-sea" />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-brand-navy">{advantage.title}</h4>
                    <p className="text-sm text-gray-600">{advantage.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </section>

      {/* Government Initiatives */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-brand-navy mb-4">
            UAE Government Initiatives Alignment
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Strategic positioning with national programs for accelerated growth
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {governmentInitiatives.map((initiative, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard
                className="p-6 h-full cursor-pointer"
                onClick={() =>
                  setExpandedInitiative(
                    expandedInitiative === index ? null : index
                  )
                }
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-green-500 flex items-center justify-center flex-shrink-0">
                    <initiative.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-brand-navy leading-tight">
                      {initiative.name}
                    </h3>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-3">{initiative.alignment}</p>

                <AnimatePresence>
                  {expandedInitiative === index && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="pt-3 border-t border-gray-200"
                    >
                      <p className="text-sm">
                        <span className="font-medium text-palette-sea">
                          Opportunity:{" "}
                        </span>
                        <span className="text-gray-700">{initiative.opportunity}</span>
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <button className="mt-3 text-xs text-palette-sea font-medium flex items-center gap-1">
                  {expandedInitiative === index ? "Show less" : "Learn more"}
                  <ChevronDown
                    className={cn(
                      "h-3 w-3 transition-transform",
                      expandedInitiative === index && "rotate-180"
                    )}
                  />
                </button>
              </GlassCard>
            </motion.div>
          ))}
        </div>

      </section>

      {/* Technical Architecture */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-brand-navy mb-4">
            Technical Architecture
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Built on modern, scalable infrastructure
          </p>
        </div>

        <GlassCard className="p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-brand-navy">Code Architecture</h3>
            <button
              onClick={() => setShowCodeDetails(!showCodeDetails)}
              className="text-sm text-palette-sea font-medium flex items-center gap-1"
            >
              {showCodeDetails ? "Hide Details" : "Show Details"}
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform",
                  showCodeDetails && "rotate-180"
                )}
              />
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {codeArchitecture.map((layer, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/50 rounded-2xl p-4"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-navy/10 flex items-center justify-center">
                    {index === 0 && <Smartphone className="h-5 w-5 text-brand-navy" />}
                    {index === 1 && <Globe className="h-5 w-5 text-brand-navy" />}
                    {index === 2 && <Zap className="h-5 w-5 text-brand-navy" />}
                    {index === 3 && <Wifi className="h-5 w-5 text-brand-navy" />}
                  </div>
                  <div>
                    <h4 className="font-bold text-brand-navy text-sm">{layer.layer}</h4>
                    <p className="text-xs text-gray-500">{layer.tech}</p>
                  </div>
                </div>

                <AnimatePresence>
                  {showCodeDetails && (
                    <motion.ul
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-1"
                    >
                      {layer.components.map((component, cIndex) => (
                        <li
                          key={cIndex}
                          className="text-xs text-gray-600 flex items-center gap-2"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-palette-sea" />
                          {component}
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          {/* Code Sample */}
          {showCodeDetails && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 bg-gray-900 rounded-2xl p-6 overflow-x-auto"
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="w-3 h-3 rounded-full bg-red-500" />
                <span className="w-3 h-3 rounded-full bg-yellow-500" />
                <span className="w-3 h-3 rounded-full bg-green-500" />
                <span className="ml-4 text-gray-400 text-sm">healthSync.ts</span>
              </div>
              <pre className="text-sm text-gray-300 font-mono">
{`// Bold Band Health Sync Service
import { BLEManager } from '@bold/ble';
import { HealthDataProcessor } from '@bold/health';
import { AIInsightEngine } from '@bold/ai';

export class HealthSyncService {
  private bleManager: BLEManager;
  private processor: HealthDataProcessor;
  private aiEngine: AIInsightEngine;

  async syncHealthData(deviceId: string) {
    // Connect to Bold Band via BLE
    const device = await this.bleManager.connect(deviceId);
    
    // Fetch raw sensor data
    const rawData = await device.fetchHealthMetrics({
      heartRate: true,
      spo2: true,
      sleep: true,
      stress: true,
      ecg: device.capabilities.ecg,
    });
    
    // Process and normalize data
    const processed = await this.processor.normalize(rawData);
    
    // Generate AI-powered insights
    const insights = await this.aiEngine.analyze(processed, {
      includeWellnessScore: true,
      detectAnomalies: true,
      personalizedTips: true,
    });
    
    // Sync with Bold & Beyond platform
    return this.uploadToCloud(processed, insights);
  }
}`}
              </pre>
            </motion.div>
          )}
        </GlassCard>
      </section>

      {/* Manufacturing & Suppliers Section */}
      <section id="manufacturing" className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-brand-navy mb-4">
            Manufacturing & Supply Chain
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Strategic partnerships with verified Alibaba OEM suppliers for cost-effective production
          </p>
        </div>

        {/* Supplier Product Lines */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {supplierProductLines.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard className="p-6 h-full">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-palette-sea to-palette-sky flex items-center justify-center">
                      <Factory className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <span className="text-xs font-medium text-palette-sea bg-palette-sea/10 px-2 py-1 rounded-full">
                        {product.category}
                      </span>
                      <h3 className="font-bold text-brand-navy mt-1 leading-tight">
                        {product.name}
                      </h3>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-1">
                    <span className="font-medium">Supplier:</span> {product.supplier}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Maps to:</span>{" "}
                    <span className="text-palette-sea font-medium">{product.targetProduct}</span>
                  </p>
                </div>

                {/* Specifications */}
                <div className="mb-4">
                  <h4 className="text-sm font-bold text-brand-navy mb-2 flex items-center gap-2">
                    <BadgeCheck className="h-4 w-4 text-palette-sea" />
                    Key Specifications
                  </h4>
                  <div className="grid grid-cols-2 gap-1">
                    {product.specifications.map((spec, i) => (
                      <p key={i} className="text-xs text-gray-600 flex items-start gap-1">
                        <span className="text-palette-sea mt-1">•</span> {spec}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Pricing Tiers */}
                <div className="mb-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4">
                  <h4 className="text-sm font-bold text-brand-navy mb-3 flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    Volume Pricing (USD per unit)
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center bg-white rounded-lg p-2">
                      <p className="text-xs text-gray-500">MOQ: {product.pricing.moq}</p>
                      <p className="text-sm font-bold text-green-600">{product.pricing.price_500}</p>
                    </div>
                    <div className="text-center bg-white rounded-lg p-2">
                      <p className="text-xs text-gray-500">1,000+ units</p>
                      <p className="text-sm font-bold text-green-600">{product.pricing.price_1000}</p>
                    </div>
                    <div className="text-center bg-white rounded-lg p-2">
                      <p className="text-xs text-gray-500">5,000+ units</p>
                      <p className="text-sm font-bold text-green-600">{product.pricing.price_5000}</p>
                    </div>
                    <div className="text-center bg-white rounded-lg p-2">
                      <p className="text-xs text-gray-500">10,000+ units</p>
                      <p className="text-sm font-bold text-green-600">{product.pricing.price_10000}</p>
                    </div>
                  </div>
                </div>

                {/* Lead Time & Customization */}
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-palette-sea" />
                    <span className="text-gray-600">Lead: <span className="font-medium">{product.leadTime}</span></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-palette-sea" />
                    <span className="text-gray-600">{product.customization.length} customization options</span>
                  </div>
                </div>

                {/* Customization Tags */}
                <div className="mt-3 flex flex-wrap gap-2">
                  {product.customization.slice(0, 3).map((opt, i) => (
                    <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                      {opt}
                    </span>
                  ))}
                  {product.customization.length > 3 && (
                    <span className="text-xs bg-palette-sea/10 text-palette-sea px-2 py-1 rounded-full">
                      +{product.customization.length - 3} more
                    </span>
                  )}
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Manufacturing Cost Analysis */}
        <GlassCard className="p-6 md:p-8 mb-8">
          <h3 className="text-xl font-bold text-brand-navy mb-6 flex items-center gap-3">
            <DollarSign className="h-6 w-6 text-palette-sea" />
            Unit Cost Analysis & Profit Margins
          </h3>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-bold text-brand-navy">Product</th>
                  <th className="text-center py-3 px-4 text-sm font-bold text-brand-navy">Manufacturing</th>
                  <th className="text-center py-3 px-4 text-sm font-bold text-brand-navy">Packaging</th>
                  <th className="text-center py-3 px-4 text-sm font-bold text-brand-navy">Shipping</th>
                  <th className="text-center py-3 px-4 text-sm font-bold text-brand-navy">Total Cost</th>
                  <th className="text-center py-3 px-4 text-sm font-bold text-brand-navy">Retail Price</th>
                  <th className="text-center py-3 px-4 text-sm font-bold text-green-600">Margin</th>
                </tr>
              </thead>
              <tbody>
                {manufacturingAnalysis.unitCosts.map((item, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-white/50 transition-colors">
                    <td className="py-3 px-4 text-sm font-medium text-brand-navy">{item.product}</td>
                    <td className="py-3 px-4 text-sm text-center text-gray-600">{item.manufacturing}</td>
                    <td className="py-3 px-4 text-sm text-center text-gray-600">{item.packaging}</td>
                    <td className="py-3 px-4 text-sm text-center text-gray-600">{item.shipping}</td>
                    <td className="py-3 px-4 text-sm text-center font-medium text-brand-navy">{item.total}</td>
                    <td className="py-3 px-4 text-sm text-center font-bold text-palette-sea">{item.retail}</td>
                    <td className="py-3 px-4 text-sm text-center font-bold text-green-600">{item.margin}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>

        {/* Order Plan Timeline */}
        <GlassCard className="p-6 md:p-8">
          <h3 className="text-xl font-bold text-brand-navy mb-6 flex items-center gap-3">
            <Truck className="h-6 w-6 text-palette-sea" />
            Production Order Plan
          </h3>
          
          <div className="grid md:grid-cols-4 gap-4">
            {manufacturingAnalysis.orderPlan.map((phase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <div className="bg-white/60 rounded-2xl p-5 text-center border-2 border-transparent hover:border-palette-sea/30 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-palette-sea/20 flex items-center justify-center mx-auto mb-3">
                    <span className="text-lg font-bold text-palette-sea">{index + 1}</span>
                  </div>
                  <h4 className="font-bold text-brand-navy mb-1">{phase.phase}</h4>
                  <p className="text-xs text-palette-sea font-medium mb-2">{phase.timeline}</p>
                  <p className="text-2xl font-bold text-brand-navy mb-1">
                    {phase.quantity.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">units</p>
                  <p className="mt-3 text-sm font-medium text-green-600">{phase.investment}</p>
                </div>
                {index < manufacturingAnalysis.orderPlan.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-2 transform -translate-y-1/2">
                    <ChevronRight className="h-4 w-4 text-gray-300" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </GlassCard>
      </section>

      {/* Marketing Budget Section */}
      <section id="marketing" className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-brand-navy mb-4">
            Marketing Budget
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Strategic marketing investment across pre-launch, launch, and growth phases
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {marketingBudget.phases.map((phase, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard className="p-6 h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <Megaphone className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-brand-navy">{phase.phase}</h3>
                    <p className="text-lg font-bold text-purple-600">{phase.budget}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  {phase.activities.map((activity, i) => (
                    <div key={i} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                      <span className="text-sm text-gray-600">{activity.item}</span>
                      <span className="text-sm font-medium text-brand-navy">{activity.cost}</span>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        <GlassCard className="p-6 text-center bg-gradient-to-r from-purple-50 to-pink-50">
          <p className="text-gray-600 mb-2">Total Marketing Investment (2027-2028)</p>
          <p className="text-3xl font-bold text-purple-600">{marketingBudget.totalBudget}</p>
        </GlassCard>
      </section>

      {/* Team & Manpower Section */}
      <section id="team" className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-brand-navy mb-4">
            Team & Manpower
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Scaling our team from foundation to growth phase
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {teamStructure.phases.map((phase, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard className="p-6 h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                    <UsersRound className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-brand-navy text-sm">{phase.phase}</h3>
                    <p className="text-2xl font-bold text-blue-600">{phase.headcount} <span className="text-sm font-normal text-gray-500">people</span></p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4 p-3 bg-blue-50 rounded-xl">
                  <div className="text-center">
                    <p className="text-xs text-gray-500">Monthly Burn</p>
                    <p className="text-sm font-bold text-brand-navy">{phase.monthlyBurn}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500">Annual Cost</p>
                    <p className="text-sm font-bold text-blue-600">{phase.annualCost}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  {phase.roles.map((role, i) => (
                    <div key={i} className="flex justify-between items-center py-1.5 border-b border-gray-100 last:border-0">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 text-xs flex items-center justify-center font-medium">
                          {role.count}
                        </span>
                        <span className="text-sm text-gray-600">{role.role}</span>
                      </div>
                      <span className="text-xs font-medium text-gray-500">{role.salary}/mo</span>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Sales & Support Section */}
      <section id="sales-support" className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-brand-navy mb-4">
            Sales & Support
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Multi-channel sales strategy and customer support infrastructure
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Sales Channels */}
          <GlassCard className="p-6">
            <h3 className="text-xl font-bold text-brand-navy mb-6 flex items-center gap-3">
              <ShoppingCart className="h-6 w-6 text-palette-sea" />
              Sales Channels
            </h3>
            
            <div className="space-y-3">
              {salesSupport.salesChannels.map((channel, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-3 bg-white/60 rounded-xl"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium text-brand-navy">{channel.channel}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Commission</p>
                      <p className="text-sm font-bold text-orange-500">{channel.commission}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Target</p>
                      <p className="text-sm font-bold text-palette-sea">{channel.target}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassCard>

          {/* Support Structure */}
          <GlassCard className="p-6">
            <h3 className="text-xl font-bold text-brand-navy mb-6 flex items-center gap-3">
              <Headphones className="h-6 w-6 text-palette-sea" />
              Support Structure
            </h3>
            
            <div className="space-y-3 mb-6">
              {salesSupport.supportStructure.map((tier, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="p-3 bg-white/60 rounded-xl"
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-brand-navy">{tier.tier}</p>
                    <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full font-medium">
                      {tier.staff} staff
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1 text-gray-500">
                      <Clock className="h-3 w-3" /> Response: {tier.response}
                    </span>
                    <span className="font-medium text-brand-navy">{tier.cost}</span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Support Tools */}
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-600 mb-2 flex items-center gap-2">
                <MessageSquare className="h-4 w-4" /> Support Channels
              </p>
              <div className="flex flex-wrap gap-2">
                {salesSupport.supportTools.map((tool, i) => (
                  <span key={i} className="text-xs bg-palette-sea/10 text-palette-sea px-3 py-1.5 rounded-full font-medium">
                    {tool}
                  </span>
                ))}
              </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-2 gap-2 pt-4 border-t border-gray-200">
              {salesSupport.kpis.map((kpi, i) => (
                <div key={i} className="text-center p-2 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">{kpi.metric}</p>
                  <p className="text-sm font-bold text-brand-navy">{kpi.target}</p>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </section>

      {/* Market Penetration & Go-To-Market Section */}
      <section id="market-penetration" className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-brand-navy mb-4">
            Market Penetration & Go-To-Market
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            How we enter the UAE wearables market, scale across platforms, and capture share
          </p>
        </div>

        {/* Market Sizing */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {marketSizing.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard className="p-5 h-full text-center">
                <p className="text-xs text-gray-500 mb-1">{item.label}</p>
                <p className="text-2xl font-bold text-palette-sea mb-1">{item.value}</p>
                <p className="text-xs text-gray-400">{item.note}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Phased Penetration Strategy */}
        <div className="mb-12">
          <h3 className="text-xl font-bold text-brand-navy mb-6 flex items-center gap-3">
            <Target className="h-6 w-6 text-palette-sea" />
            Phased Penetration Strategy
          </h3>
          <div className="space-y-4">
            {marketPenetration.map((phase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard className="p-6">
                  <div className="flex flex-col md:flex-row md:items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-palette-sea to-palette-sky flex items-center justify-center">
                        <span className="text-lg font-bold text-white">{index + 1}</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <h4 className="font-bold text-brand-navy">{phase.step}</h4>
                        <span className="text-xs font-medium text-palette-sea bg-palette-sea/10 px-3 py-1 rounded-full">
                          {phase.timeline}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-4">{phase.objective}</p>
                      <div className="grid sm:grid-cols-2 gap-2">
                        {phase.actions.map((action, i) => (
                          <div key={i} className="flex items-start gap-2 text-sm text-gray-700">
                            <CheckCircle2 className="h-4 w-4 text-palette-sea flex-shrink-0 mt-0.5" />
                            <span>{action}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Sales Platforms */}
        <div className="mb-12">
          <h3 className="text-xl font-bold text-brand-navy mb-6 flex items-center gap-3">
            <ShoppingCart className="h-6 w-6 text-palette-sea" />
            Selling Across Platforms
          </h3>
          <GlassCard className="p-6 overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-3 text-sm font-bold text-brand-navy">Platform</th>
                  <th className="text-left py-3 px-3 text-sm font-bold text-brand-navy">Type</th>
                  <th className="text-center py-3 px-3 text-sm font-bold text-brand-navy">Fee</th>
                  <th className="text-center py-3 px-3 text-sm font-bold text-brand-navy">Net Margin</th>
                  <th className="text-center py-3 px-3 text-sm font-bold text-brand-navy">Revenue Mix</th>
                  <th className="text-left py-3 px-3 text-sm font-bold text-brand-navy">Role</th>
                </tr>
              </thead>
              <tbody>
                {salesPlatforms.map((platform, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-white/50 transition-colors">
                    <td className="py-3 px-3 text-sm font-medium text-brand-navy">{platform.name}</td>
                    <td className="py-3 px-3 text-sm text-gray-600">
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{platform.type}</span>
                    </td>
                    <td className="py-3 px-3 text-sm text-center text-orange-500 font-medium">{platform.commission}</td>
                    <td className="py-3 px-3 text-sm text-center text-green-600 font-bold">{platform.margin}</td>
                    <td className="py-3 px-3 text-sm text-center font-bold text-palette-sea">{platform.target}</td>
                    <td className="py-3 px-3 text-xs text-gray-500">{platform.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </GlassCard>
        </div>

        {/* Marketing Strategy */}
        <div className="mb-12">
          <h3 className="text-xl font-bold text-brand-navy mb-2 flex items-center gap-3">
            <Megaphone className="h-6 w-6 text-palette-sea" />
            Marketing Strategy
          </h3>
          <p className="text-gray-600 mb-6 max-w-3xl">
            A full-funnel, brand-led approach combining performance marketing for efficient
            acquisition with influencer, content and experiential channels that build a
            wellness brand customers trust and stay loyal to.
          </p>
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {marketingStrategy.map((pillar, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard className="p-6 h-full">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      <pillar.icon className="h-5 w-5 text-white" />
                    </div>
                    <h4 className="font-bold text-brand-navy">{pillar.pillar}</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">{pillar.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {pillar.tactics.map((tactic, i) => (
                      <span key={i} className="text-xs bg-purple-50 text-purple-600 px-3 py-1.5 rounded-full font-medium">
                        {tactic}
                      </span>
                    ))}
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>

          {/* Marketing Funnel */}
          <GlassCard className="p-6">
            <h4 className="font-bold text-brand-navy mb-4">Full-Funnel Approach</h4>
            <div className="grid md:grid-cols-4 gap-4">
              {marketingFunnel.map((stage, index) => (
                <div key={index} className="relative">
                  <div className="bg-white/60 rounded-2xl p-5 h-full">
                    <span className="text-xs font-bold text-palette-sea uppercase tracking-wide">{stage.stage}</span>
                    <p className="text-sm font-medium text-brand-navy mt-2 mb-3">{stage.goal}</p>
                    <p className="text-xs text-gray-500 mb-1"><span className="font-medium">Channels:</span> {stage.channels}</p>
                    <p className="text-xs text-gray-500"><span className="font-medium">Metric:</span> {stage.metric}</p>
                  </div>
                  {index < marketingFunnel.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-2 transform -translate-y-1/2 z-10">
                      <ChevronRight className="h-4 w-4 text-gray-300" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Inventory Strategy */}
        <div>
          <h3 className="text-xl font-bold text-brand-navy mb-2 flex items-center gap-3">
            <Package className="h-6 w-6 text-palette-sea" />
            Inventory & Fulfilment
          </h3>
          <p className="text-gray-600 mb-6 max-w-3xl">{inventoryStrategy.overview}</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {inventoryStrategy.pillars.map((pillar, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard className="p-5 h-full">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-3">
                    <pillar.icon className="h-5 w-5 text-white" />
                  </div>
                  <h4 className="font-bold text-brand-navy text-sm mb-3">{pillar.title}</h4>
                  <ul className="space-y-2">
                    {pillar.points.map((point, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-palette-sea mt-1.5 flex-shrink-0" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </GlassCard>
              </motion.div>
            ))}
          </div>

          {/* Inventory KPIs */}
          <GlassCard className="p-6 bg-gradient-to-r from-blue-50 to-cyan-50">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {inventoryStrategy.metrics.map((metric, index) => (
                <div key={index} className="text-center">
                  <p className="text-xs text-gray-500 mb-1">{metric.metric}</p>
                  <p className="text-lg font-bold text-blue-600">{metric.target}</p>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </section>

      {/* Financial Projections */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-brand-navy mb-4">
            Financial Projections
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            5-year growth trajectory from 2026-2030 (in millions AED)
          </p>
        </div>

        <GlassCard className="p-6 md:p-8">
          {/* Interactive Chart */}
          <div className="mb-8">
            <div className="flex items-end justify-between h-64 gap-4 px-4">
              {financialProjections.map((year, index) => (
                <motion.div
                  key={index}
                  initial={{ height: 0 }}
                  whileInView={{ height: "100%" }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2, duration: 0.8 }}
                  className="flex-1 flex flex-col items-center justify-end"
                >
                  <div className="relative w-full flex flex-col items-center">
                    {/* Revenue Bar */}
                    <motion.div
                      initial={{ height: 0 }}
                      whileInView={{ 
                        height: `${(year.revenue / 250) * 200}px` 
                      }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.2 + 0.3, duration: 0.5 }}
                      className="w-full max-w-[60px] bg-gradient-to-t from-palette-sea to-palette-sky rounded-t-lg relative"
                    >
                      {year.revenue > 0 && (
                        <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-brand-navy whitespace-nowrap">
                          {year.revenue}M
                        </span>
                      )}
                    </motion.div>
                  </div>
                  <div className="mt-4 text-center">
                    <p className="text-sm font-bold text-brand-navy">{year.year}</p>
                    <p className="text-xs text-gray-500">
                      {year.users.toLocaleString()} users
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid md:grid-cols-4 gap-4 pt-6 border-t border-gray-200">
            {[
              { label: "Total Investment Needed", value: "AED 35M", icon: DollarSign },
              { label: "Break-even", value: "Q2 2029", icon: TrendingUp },
              { label: "5-Year Revenue", value: "AED 423M", icon: Award },
              { label: "Target Valuation (2030)", value: "AED 500M", icon: Rocket },
            ].map((metric, index) => (
              <div key={index} className="text-center">
                <metric.icon className="h-6 w-6 text-palette-sea mx-auto mb-2" />
                <p className="text-xs text-gray-500">{metric.label}</p>
                <p className="text-lg font-bold text-brand-navy">{metric.value}</p>
              </div>
            ))}
          </div>
        </GlassCard>
      </section>


      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center">
        <p className="text-sm text-gray-600">
          © 2026 Bold & Beyond. Confidential Business Plan.
        </p>
        <p className="text-xs text-gray-500 mt-2">
          This document contains proprietary information. Distribution is restricted.
        </p>
      </footer>
    </GlassContainer>
  );
}
