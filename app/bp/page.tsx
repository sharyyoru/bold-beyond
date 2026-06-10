"use client";

import { useState } from "react";
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
} from "lucide-react";
import { GlassCard, GlassContainer } from "@/components/ui/glass-card";
import { cn } from "@/lib/utils";
import Link from "next/link";

// Timeline Data
const developmentTimeline = [
  {
    phase: "Phase 1: Research & Concept",
    duration: "Q1 2025 - Q2 2025",
    status: "completed",
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
    duration: "Q3 2025 - Q4 2025",
    status: "in-progress",
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
    duration: "Q1 2026 - Q2 2026",
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
    duration: "Q3 2026 - Q4 2026",
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
    duration: "2027 and Beyond",
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
    { phase: "Pilot Batch", quantity: 1000, timeline: "Q3 2025", investment: "AED 75,000" },
    { phase: "Initial Launch", quantity: 5000, timeline: "Q4 2025", investment: "AED 320,000" },
    { phase: "Scale Production", quantity: 25000, timeline: "Q1-Q2 2026", investment: "AED 1,400,000" },
    { phase: "Mass Production", quantity: 100000, timeline: "Q3-Q4 2026", investment: "AED 4,800,000" },
  ],
};

// Marketing Budget
const marketingBudget = {
  phases: [
    {
      phase: "Pre-Launch (Q1-Q2 2026)",
      budget: "AED 500,000",
      activities: [
        { item: "Social Media Setup & Content", cost: "AED 120,000" },
        { item: "Influencer Partnerships", cost: "AED 180,000" },
        { item: "PR & Media Relations", cost: "AED 120,000" },
        { item: "Launch Event Planning", cost: "AED 80,000" },
      ],
    },
    {
      phase: "Launch (Q3-Q4 2026)",
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
      phase: "Growth (2027)",
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
      phase: "Phase 1: Foundation (2025)",
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
      phase: "Phase 2: Launch (2026)",
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
      phase: "Phase 3: Scale (2027-2028)",
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
  { year: "2025", revenue: 0, users: 0, investment: 5 },
  { year: "2026", revenue: 8, users: 25000, investment: 15 },
  { year: "2027", revenue: 45, users: 150000, investment: 10 },
  { year: "2028", revenue: 120, users: 400000, investment: 5 },
  { year: "2029", revenue: 250, users: 800000, investment: 0 },
];

export default function BusinessPlanPage() {
  const [activeTimeline, setActiveTimeline] = useState(1);
  const [activeCompetitor, setActiveCompetitor] = useState<number | null>(null);
  const [expandedInitiative, setExpandedInitiative] = useState<number | null>(null);
  const [showCodeDetails, setShowCodeDetails] = useState(false);

  return (
    <GlassContainer gradient="sea" className="pb-20">
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
                Business Plan 2025-2029
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

            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="#timeline"
                className="inline-flex items-center gap-2 bg-brand-navy text-white px-6 py-3 rounded-full font-medium hover:bg-brand-navy/90 transition-all"
              >
                View Timeline <ChevronRight className="h-4 w-4" />
              </a>
              <a
                href="#products"
                className="inline-flex items-center gap-2 bg-white/80 text-brand-navy px-6 py-3 rounded-full font-medium hover:bg-white transition-all"
              >
                Explore Products
              </a>
            </div>
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

                <button
                  className={cn(
                    "mt-6 w-full py-3 rounded-full font-medium transition-all",
                    product.popular
                      ? "bg-brand-navy text-white hover:bg-brand-navy/90"
                      : "bg-white/80 text-brand-navy hover:bg-white"
                  )}
                >
                  Pre-order Now
                </button>
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
          <p className="text-gray-600 mb-2">Total Marketing Investment (2025-2027)</p>
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

      {/* Financial Projections */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-brand-navy mb-4">
            Financial Projections
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            5-year growth trajectory (in millions AED)
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
              { label: "Break-even", value: "Q2 2028", icon: TrendingUp },
              { label: "5-Year Revenue", value: "AED 423M", icon: Award },
              { label: "Target Valuation (2029)", value: "AED 500M", icon: Rocket },
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

      {/* Call to Action */}
      <section className="container mx-auto px-4 py-16">
        <GlassCard className="p-8 md:p-12 text-center bg-gradient-to-br from-brand-navy/90 to-palette-sea/90">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-4">
            Join the Bold & Beyond Journey
          </h2>
          <p className="text-white/80 max-w-2xl mx-auto mb-8">
            We are seeking strategic investors and partners to bring Bold Band 
            to the UAE market. Be part of the wellness revolution.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-white text-brand-navy px-8 py-3 rounded-full font-medium hover:bg-white/90 transition-all"
            >
              Contact Us <ChevronRight className="h-4 w-4" />
            </Link>
            <button className="inline-flex items-center gap-2 bg-white/20 text-white border border-white/30 px-8 py-3 rounded-full font-medium hover:bg-white/30 transition-all">
              Download Full Business Plan
            </button>
          </div>
        </GlassCard>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center">
        <p className="text-sm text-gray-600">
          © 2025 Bold & Beyond. Confidential Business Plan.
        </p>
        <p className="text-xs text-gray-500 mt-2">
          This document contains proprietary information. Distribution is restricted.
        </p>
      </footer>
    </GlassContainer>
  );
}
