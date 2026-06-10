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

        {/* Government Partnership CTA */}
        <GlassCard className="mt-8 p-8 text-center">
          <Landmark className="h-12 w-12 text-palette-sea mx-auto mb-4" />
          <h3 className="text-xl font-bold text-brand-navy mb-2">
            Government Partnership Opportunities
          </h3>
          <p className="text-gray-600 max-w-2xl mx-auto mb-6">
            We are actively seeking partnerships with UAE government entities for 
            employee wellness programs, public health initiatives, and smart city integrations. 
            Contact our government relations team to explore collaboration opportunities.
          </p>
          <button className="bg-brand-navy text-white px-8 py-3 rounded-full font-medium hover:bg-brand-navy/90 transition-all">
            Schedule a Meeting
          </button>
        </GlassCard>
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
