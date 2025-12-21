"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Book,
  Brain,
  Heart,
  Zap,
  MessageCircle,
  Users,
  ShoppingBag,
  Calendar,
  BarChart3,
  Settings,
  Code,
  Database,
  Shield,
  Sparkles,
  ChevronRight,
  ChevronDown,
  Search,
  Menu,
  X,
  ExternalLink,
  Copy,
  Check,
  Play,
  ArrowLeft,
  Layers,
  GitBranch,
  Box,
  Cpu,
  Activity,
} from "lucide-react";

// Documentation sections
const docSections = [
  {
    id: "overview",
    title: "Platform Overview",
    icon: Book,
    color: "#0D9488",
    description: "Introduction to Bold & Beyond wellness platform",
  },
  {
    id: "architecture",
    title: "System Architecture",
    icon: Layers,
    color: "#6B9BC3",
    description: "Technical architecture and system design",
  },
  {
    id: "ai-system",
    title: "AI & Recommendation Engine",
    icon: Brain,
    color: "#D4AF37",
    description: "How our AI analyzes emotions and recommends services",
  },
  {
    id: "wellness-scoring",
    title: "Wellness Scoring System",
    icon: Activity,
    color: "#E9967A",
    description: "How we calculate and track wellness metrics",
  },
  {
    id: "services",
    title: "Services Module",
    icon: Heart,
    color: "#F4A261",
    description: "Service listings, booking, and management",
  },
  {
    id: "products",
    title: "Products Module",
    icon: ShoppingBag,
    color: "#B8A4C9",
    description: "E-commerce, checkout, and order management",
  },
  {
    id: "providers",
    title: "Providers Module",
    icon: Users,
    color: "#7DD3D3",
    description: "Provider profiles and service offerings",
  },
  {
    id: "authentication",
    title: "Authentication & Security",
    icon: Shield,
    color: "#EF4444",
    description: "User authentication and data security",
  },
  {
    id: "database",
    title: "Database Schema",
    icon: Database,
    color: "#8B5CF6",
    description: "Supabase tables and relationships",
  },
  {
    id: "api",
    title: "API Reference",
    icon: Code,
    color: "#EC4899",
    description: "Sanity CMS queries and API endpoints",
  },
];

// Code examples
const codeExamples = {
  emotionAnalysis: `// Local Emotion Analysis Algorithm
function analyzeEmotion(text: string): { score: number; emotion: string } {
  const positiveWords = [
    "happy", "great", "good", "amazing", "wonderful", "excited", "love",
    "grateful", "peaceful", "calm", "relaxed", "energized", "motivated",
    "confident", "hopeful", "better", "improved", "fantastic", "excellent"
  ];
  const negativeWords = [
    "sad", "stressed", "anxious", "worried", "tired", "exhausted", "angry",
    "frustrated", "depressed", "overwhelmed", "scared", "nervous", "bad",
    "terrible", "awful", "hate", "struggling", "difficult", "hard", "pain"
  ];

  const words = text.toLowerCase().split(/\\s+/);
  let positiveCount = 0;
  let negativeCount = 0;

  words.forEach(word => {
    if (positiveWords.some(pw => word.includes(pw))) positiveCount++;
    if (negativeWords.some(nw => word.includes(nw))) negativeCount++;
  });

  const total = positiveCount + negativeCount || 1;
  const score = Math.round(50 + ((positiveCount - negativeCount) / total) * 50);
  
  let emotion = "neutral";
  if (score >= 70) emotion = "positive";
  else if (score <= 30) emotion = "negative";

  return { score: Math.max(0, Math.min(100, score)), emotion };
}`,
  wellnessScoring: `// Wellness Score Calculation
const calculateScores = async (answers) => {
  // Calculate wellness scores from user check-in answers
  const scores = {
    mood: answers.overall_mood?.score || 60,
    sleep: answers.sleep_quality?.score || 60,
    energy: answers.energy_level?.score || 60,
    stress: answers.stress_level?.score || 60,
    mind: answers.mind_clarity?.score || 60,
    body: answers.physical_feeling?.score || 60,
  };

  // Calculate overall wellness score (average of all dimensions)
  const overallScore = Math.round(
    Object.values(scores).reduce((a, b) => a + b, 0) / Object.keys(scores).length
  );
  scores.overall = overallScore;

  return scores;
};`,
  recommendationEngine: `// Recommendation Engine
const getRecommendations = (wellnessScores) => {
  const recommendations = [];
  
  // Analyze each wellness dimension and suggest relevant services
  if (wellnessScores.stress < 60) {
    recommendations.push({
      title: "Stress Management",
      description: "Try a meditation or breathing session",
      category: "therapy",
      priority: 60 - wellnessScores.stress, // Higher priority for lower scores
    });
  }
  
  if (wellnessScores.sleep < 60) {
    recommendations.push({
      title: "Sleep Improvement",
      description: "Consider a sleep consultation",
      category: "wellness",
      priority: 60 - wellnessScores.sleep,
    });
  }
  
  if (wellnessScores.energy < 60) {
    recommendations.push({
      title: "Energy Boost",
      description: "Try yoga or fitness coaching",
      category: "coaching",
      priority: 60 - wellnessScores.energy,
    });
  }

  // Sort by priority (highest first)
  return recommendations.sort((a, b) => b.priority - a.priority);
};`,
  sanityQuery: `// Sanity GROQ Queries
export const queries = {
  // Fetch all active services with provider info
  allServices: \`*[_type == "service" && isActive == true] | order(order asc) {
    _id,
    title,
    slug,
    description,
    category,
    basePrice,
    duration,
    image,
    rating,
    reviewCount,
    serviceType,
    "provider": provider-> {
      _id,
      name,
      slug,
      logo,
      rating
    }
  }\`,
  
  // Fetch all active providers with their services and products
  allProviders: \`*[_type == "provider" && isActive == true] | order(featured desc, name asc) {
    _id,
    name,
    slug,
    logo,
    coverImage,
    category,
    shortDescription,
    location,
    rating,
    reviewCount,
    priceRange,
    discountText
  }\`,
};`,
};

// Detailed content for each section
const sectionContent: Record<string, React.ReactNode> = {
  overview: (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-[#0D9488] to-[#7DD3D3] rounded-2xl p-6 text-white">
        <h3 className="text-2xl font-bold mb-2">Bold & Beyond</h3>
        <p className="opacity-90">A comprehensive wellness platform connecting users with wellness services, products, and providers.</p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-5 border border-gray-100">
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Zap className="h-5 w-5 text-amber-500" />
            Key Features
          </h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• AI-powered wellness recommendations</li>
            <li>• Daily mood and wellness check-ins</li>
            <li>• Service booking with real-time availability</li>
            <li>• Product marketplace with checkout</li>
            <li>• Provider profiles and ratings</li>
            <li>• Personalized wellness scoring</li>
          </ul>
        </div>
        
        <div className="bg-white rounded-xl p-5 border border-gray-100">
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Box className="h-5 w-5 text-purple-500" />
            Tech Stack
          </h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• <strong>Frontend:</strong> Next.js 14, React, TailwindCSS</li>
            <li>• <strong>Backend:</strong> Supabase (PostgreSQL)</li>
            <li>• <strong>CMS:</strong> Sanity.io</li>
            <li>• <strong>Auth:</strong> Supabase Auth</li>
            <li>• <strong>Payments:</strong> Stripe</li>
            <li>• <strong>Deployment:</strong> Vercel</li>
          </ul>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
        <h4 className="font-semibold text-amber-800 mb-2">📱 Mobile-First Design</h4>
        <p className="text-sm text-amber-700">
          The platform is designed with a mobile-first approach, featuring a native app-like experience with smooth animations, gesture support, and optimized touch interactions.
        </p>
      </div>
    </div>
  ),
  
  architecture: (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-5 border border-gray-100">
        <h4 className="font-semibold text-gray-900 mb-4">System Architecture Diagram</h4>
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex flex-col items-center space-y-4">
            {/* Client Layer */}
            <div className="w-full max-w-md bg-blue-100 rounded-xl p-4 text-center">
              <p className="font-semibold text-blue-800">Client Layer</p>
              <p className="text-sm text-blue-600">Next.js App (React)</p>
            </div>
            
            <div className="h-8 w-px bg-gray-300" />
            
            {/* API Layer */}
            <div className="w-full max-w-lg grid grid-cols-3 gap-3">
              <div className="bg-green-100 rounded-lg p-3 text-center">
                <p className="font-medium text-green-800 text-sm">Supabase</p>
                <p className="text-xs text-green-600">Auth & DB</p>
              </div>
              <div className="bg-purple-100 rounded-lg p-3 text-center">
                <p className="font-medium text-purple-800 text-sm">Sanity</p>
                <p className="text-xs text-purple-600">CMS</p>
              </div>
              <div className="bg-pink-100 rounded-lg p-3 text-center">
                <p className="font-medium text-pink-800 text-sm">Stripe</p>
                <p className="text-xs text-pink-600">Payments</p>
              </div>
            </div>
            
            <div className="h-8 w-px bg-gray-300" />
            
            {/* Data Layer */}
            <div className="w-full max-w-md bg-amber-100 rounded-xl p-4 text-center">
              <p className="font-semibold text-amber-800">Data Layer</p>
              <p className="text-sm text-amber-600">PostgreSQL + Sanity Content Lake</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-5 border border-gray-100">
          <h4 className="font-semibold text-gray-900 mb-3">📁 Directory Structure</h4>
          <pre className="text-xs bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
{`boldandbeyond/
├── app/
│   ├── appx/           # Mobile app pages
│   │   ├── (auth)/     # Auth pages
│   │   ├── services/   # Services module
│   │   ├── products/   # Products module
│   │   ├── providers/  # Providers module
│   │   ├── wellness-checkin/
│   │   └── wellness-chat/
│   ├── documentation/  # This page
│   └── studio/         # Sanity Studio
├── components/         # Reusable components
├── lib/               # Utilities & clients
├── sanity/            # Sanity schemas
└── supabase/          # DB migrations`}
          </pre>
        </div>
        
        <div className="bg-white rounded-xl p-5 border border-gray-100">
          <h4 className="font-semibold text-gray-900 mb-3">🔄 Data Flow</h4>
          <ol className="space-y-3 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">1</span>
              <span>User interacts with Next.js frontend</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">2</span>
              <span>Content fetched from Sanity CMS via GROQ</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">3</span>
              <span>User data stored in Supabase PostgreSQL</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">4</span>
              <span>AI processes user inputs locally</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">5</span>
              <span>Recommendations generated in real-time</span>
            </li>
          </ol>
        </div>
      </div>
    </div>
  ),
  
  "ai-system": (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-[#D4AF37] to-[#F4A261] rounded-2xl p-6 text-white">
        <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
          <Brain className="h-6 w-6" />
          AI & Recommendation Engine
        </h3>
        <p className="opacity-90">Our AI system uses local sentiment analysis to understand user emotions and provide personalized wellness recommendations.</p>
      </div>

      <div className="bg-white rounded-xl p-5 border border-gray-100">
        <h4 className="font-semibold text-gray-900 mb-4">🧠 How Emotion Analysis Works</h4>
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            The emotion analysis system uses a keyword-based sentiment detection algorithm that runs entirely on the client side - no external API required. This ensures:
          </p>
          <div className="grid md:grid-cols-3 gap-3">
            <div className="bg-green-50 rounded-lg p-3 text-center">
              <p className="font-medium text-green-700">🔒 Privacy</p>
              <p className="text-xs text-green-600">Data never leaves device</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-3 text-center">
              <p className="font-medium text-blue-700">⚡ Speed</p>
              <p className="text-xs text-blue-600">Instant analysis</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-3 text-center">
              <p className="font-medium text-purple-700">💰 Free</p>
              <p className="text-xs text-purple-600">No API costs</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-5 border border-gray-100">
        <h4 className="font-semibold text-gray-900 mb-4">📊 Algorithm Breakdown</h4>
        <ol className="space-y-4 text-sm">
          <li className="flex gap-4">
            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center font-bold">1</div>
            <div>
              <p className="font-medium text-gray-900">Text Tokenization</p>
              <p className="text-gray-600">User message is split into individual words and converted to lowercase</p>
            </div>
          </li>
          <li className="flex gap-4">
            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center font-bold">2</div>
            <div>
              <p className="font-medium text-gray-900">Sentiment Matching</p>
              <p className="text-gray-600">Each word is checked against positive and negative word dictionaries</p>
            </div>
          </li>
          <li className="flex gap-4">
            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center font-bold">3</div>
            <div>
              <p className="font-medium text-gray-900">Score Calculation</p>
              <p className="text-gray-600">Score = 50 + ((positive - negative) / total) × 50</p>
            </div>
          </li>
          <li className="flex gap-4">
            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center font-bold">4</div>
            <div>
              <p className="font-medium text-gray-900">Emotion Classification</p>
              <p className="text-gray-600">Score ≥70: Positive | Score ≤30: Negative | Otherwise: Neutral</p>
            </div>
          </li>
        </ol>
      </div>

      <CodeBlock code={codeExamples.emotionAnalysis} language="typescript" title="Emotion Analysis Algorithm" />

      <div className="bg-white rounded-xl p-5 border border-gray-100">
        <h4 className="font-semibold text-gray-900 mb-4">🎯 Recommendation Logic</h4>
        <p className="text-sm text-gray-600 mb-4">
          The recommendation engine analyzes wellness scores across 6 dimensions and suggests services that address areas needing improvement:
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { dim: "Low Stress Score", rec: "Meditation, Therapy", color: "red" },
            { dim: "Low Sleep Score", rec: "Sleep Consultation", color: "blue" },
            { dim: "Low Energy Score", rec: "Yoga, Fitness", color: "amber" },
            { dim: "Low Mind Score", rec: "Mindfulness", color: "purple" },
            { dim: "Low Body Score", rec: "Massage, Wellness", color: "green" },
            { dim: "Low Mood Score", rec: "Counseling", color: "pink" },
          ].map((item, i) => (
            <div key={i} className={`bg-${item.color}-50 rounded-lg p-3`}>
              <p className={`font-medium text-${item.color}-700 text-sm`}>{item.dim}</p>
              <p className={`text-xs text-${item.color}-600`}>→ {item.rec}</p>
            </div>
          ))}
        </div>
      </div>

      <CodeBlock code={codeExamples.recommendationEngine} language="typescript" title="Recommendation Engine" />
    </div>
  ),
  
  "wellness-scoring": (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-[#E9967A] to-[#F4A261] rounded-2xl p-6 text-white">
        <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
          <Activity className="h-6 w-6" />
          Wellness Scoring System
        </h3>
        <p className="opacity-90">Track and visualize wellness across multiple dimensions with our comprehensive scoring system.</p>
      </div>

      <div className="bg-white rounded-xl p-5 border border-gray-100">
        <h4 className="font-semibold text-gray-900 mb-4">📈 6 Wellness Dimensions</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { id: "mind", label: "Mind", desc: "Mental clarity & focus", color: "#0D9488", icon: "🧠" },
            { id: "body", label: "Body", desc: "Physical wellbeing", color: "#D4AF37", icon: "💪" },
            { id: "sleep", label: "Sleep", desc: "Sleep quality", color: "#6B9BC3", icon: "😴" },
            { id: "energy", label: "Energy", desc: "Daily energy levels", color: "#F4A261", icon: "⚡" },
            { id: "mood", label: "Mood", desc: "Emotional state", color: "#E9967A", icon: "😊" },
            { id: "stress", label: "Stress", desc: "Stress management", color: "#B8A4C9", icon: "🧘" },
          ].map((dim) => (
            <div key={dim.id} className="bg-gray-50 rounded-xl p-4 text-center">
              <span className="text-3xl">{dim.icon}</span>
              <p className="font-semibold text-gray-900 mt-2">{dim.label}</p>
              <p className="text-xs text-gray-500">{dim.desc}</p>
              <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: '75%', backgroundColor: dim.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl p-5 border border-gray-100">
        <h4 className="font-semibold text-gray-900 mb-4">📝 Daily Check-in Flow</h4>
        <div className="space-y-3">
          {[
            { q: "How are you feeling today?", type: "Mood Selection (5 options)" },
            { q: "How well did you sleep?", type: "Scale 1-5" },
            { q: "What's your energy level?", type: "Scale 1-5" },
            { q: "How stressed do you feel?", type: "Scale 1-5" },
            { q: "How clear is your mind?", type: "Scale 1-5" },
            { q: "How does your body feel?", type: "Scale 1-5" },
            { q: "What's on your mind?", type: "Multi-select tags" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <span className="flex-shrink-0 h-8 w-8 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center font-bold text-sm">{i + 1}</span>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{item.q}</p>
                <p className="text-xs text-gray-500">{item.type}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <CodeBlock code={codeExamples.wellnessScoring} language="typescript" title="Score Calculation" />

      <div className="bg-teal-50 border border-teal-200 rounded-xl p-5">
        <h4 className="font-semibold text-teal-800 mb-2">💾 Data Storage</h4>
        <p className="text-sm text-teal-700">
          Wellness scores are stored in the <code className="bg-teal-100 px-1 rounded">wellness_checkins</code> table and synced to the user's <code className="bg-teal-100 px-1 rounded">profiles.wellness_scores</code> column for quick access on the homepage charts.
        </p>
      </div>
    </div>
  ),
  
  services: (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-[#F4A261] to-[#E9967A] rounded-2xl p-6 text-white">
        <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
          <Heart className="h-6 w-6" />
          Services Module
        </h3>
        <p className="opacity-90">Wellness services with booking, provider info, and category filtering.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-5 border border-gray-100">
          <h4 className="font-semibold text-gray-900 mb-3">📄 Pages</h4>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2 text-gray-600">
              <code className="bg-gray-100 px-2 py-0.5 rounded text-xs">/appx/services</code>
              <span>Service listing</span>
            </li>
            <li className="flex items-center gap-2 text-gray-600">
              <code className="bg-gray-100 px-2 py-0.5 rounded text-xs">/appx/services/[slug]</code>
              <span>Service detail</span>
            </li>
          </ul>
        </div>
        
        <div className="bg-white rounded-xl p-5 border border-gray-100">
          <h4 className="font-semibold text-gray-900 mb-3">✨ Features</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• Search and category filtering</li>
            <li>• Provider info and ratings</li>
            <li>• Date/time booking selection</li>
            <li>• Booking confirmation modal</li>
            <li>• Related services suggestions</li>
          </ul>
        </div>
      </div>

      <div className="bg-white rounded-xl p-5 border border-gray-100">
        <h4 className="font-semibold text-gray-900 mb-3">🗂️ Sanity Schema: Service</h4>
        <pre className="text-xs bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
{`{
  name: "service",
  fields: [
    { name: "title", type: "string" },
    { name: "slug", type: "slug" },
    { name: "description", type: "text" },
    { name: "image", type: "image" },
    { name: "category", type: "string" },
    { name: "basePrice", type: "number" },
    { name: "duration", type: "number" },
    { name: "provider", type: "reference", to: "provider" },
    { name: "rating", type: "number" },
    { name: "reviewCount", type: "number" },
    { name: "isActive", type: "boolean" }
  ]
}`}
        </pre>
      </div>
    </div>
  ),
  
  products: (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-[#B8A4C9] to-[#8B5CF6] rounded-2xl p-6 text-white">
        <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
          <ShoppingBag className="h-6 w-6" />
          Products Module
        </h3>
        <p className="opacity-90">E-commerce functionality with product listings, cart, and checkout.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-5 border border-gray-100">
          <h4 className="font-semibold text-gray-900 mb-3">📄 Pages</h4>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2 text-gray-600">
              <code className="bg-gray-100 px-2 py-0.5 rounded text-xs">/appx/products</code>
              <span>Product listing</span>
            </li>
            <li className="flex items-center gap-2 text-gray-600">
              <code className="bg-gray-100 px-2 py-0.5 rounded text-xs">/appx/products/[slug]</code>
              <span>Product detail</span>
            </li>
          </ul>
        </div>
        
        <div className="bg-white rounded-xl p-5 border border-gray-100">
          <h4 className="font-semibold text-gray-900 mb-3">✨ Features</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• Image gallery with thumbnails</li>
            <li>• Discount badges and sale prices</li>
            <li>• Quantity selector</li>
            <li>• Multi-step checkout modal</li>
            <li>• Delivery address form</li>
            <li>• Payment method selection</li>
          </ul>
        </div>
      </div>

      <div className="bg-white rounded-xl p-5 border border-gray-100">
        <h4 className="font-semibold text-gray-900 mb-3">🛒 Checkout Flow</h4>
        <div className="flex items-center justify-between">
          {["Cart Review", "Delivery Info", "Payment", "Confirmation"].map((step, i) => (
            <div key={i} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className="h-10 w-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold">{i + 1}</div>
                <p className="text-xs text-gray-600 mt-1 text-center">{step}</p>
              </div>
              {i < 3 && <div className="h-px w-8 bg-gray-200 mx-2" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
  
  providers: (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-[#7DD3D3] to-[#0D9488] rounded-2xl p-6 text-white">
        <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
          <Users className="h-6 w-6" />
          Providers Module
        </h3>
        <p className="opacity-90">Wellness provider profiles with their services and products.</p>
      </div>

      <div className="bg-white rounded-xl p-5 border border-gray-100">
        <h4 className="font-semibold text-gray-900 mb-3">🏢 Provider Profile Features</h4>
        <div className="grid md:grid-cols-2 gap-4">
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• Logo and cover image</li>
            <li>• Rating and review count</li>
            <li>• Location and contact info</li>
            <li>• Opening hours</li>
          </ul>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• Services tab with booking</li>
            <li>• Products tab with shopping</li>
            <li>• Discount/promo badges</li>
            <li>• Social links (WhatsApp, etc.)</li>
          </ul>
        </div>
      </div>
    </div>
  ),
  
  authentication: (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-[#EF4444] to-[#F97316] rounded-2xl p-6 text-white">
        <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
          <Shield className="h-6 w-6" />
          Authentication & Security
        </h3>
        <p className="opacity-90">Secure user authentication powered by Supabase Auth.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-5 border border-gray-100">
          <h4 className="font-semibold text-gray-900 mb-3">🔐 Auth Methods</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• Email/Password signup</li>
            <li>• Google OAuth</li>
            <li>• Facebook OAuth</li>
            <li>• Apple Sign-In</li>
          </ul>
        </div>
        
        <div className="bg-white rounded-xl p-5 border border-gray-100">
          <h4 className="font-semibold text-gray-900 mb-3">🛡️ Security Features</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• Row Level Security (RLS)</li>
            <li>• JWT token authentication</li>
            <li>• Secure session management</li>
            <li>• Password hashing (bcrypt)</li>
          </ul>
        </div>
      </div>

      <div className="bg-white rounded-xl p-5 border border-gray-100">
        <h4 className="font-semibold text-gray-900 mb-3">🚀 Auth Flow</h4>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <span className="h-8 w-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-sm">1</span>
            <span className="text-sm text-gray-700">User signs up → Supabase creates auth.users record</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <span className="h-8 w-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-sm">2</span>
            <span className="text-sm text-gray-700">Trigger creates matching profiles record</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <span className="h-8 w-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-sm">3</span>
            <span className="text-sm text-gray-700">User redirected to onboarding flow</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <span className="h-8 w-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-sm">4</span>
            <span className="text-sm text-gray-700">JWT token stored, used for API requests</span>
          </div>
        </div>
      </div>
    </div>
  ),
  
  database: (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-[#8B5CF6] to-[#A855F7] rounded-2xl p-6 text-white">
        <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
          <Database className="h-6 w-6" />
          Database Schema
        </h3>
        <p className="opacity-90">Supabase PostgreSQL tables and their relationships.</p>
      </div>

      <div className="bg-white rounded-xl p-5 border border-gray-100">
        <h4 className="font-semibold text-gray-900 mb-4">📊 Core Tables</h4>
        <div className="space-y-4">
          {[
            { name: "profiles", desc: "User profile data, wellness scores", cols: "id, email, full_name, avatar_url, role, wellness_scores, current_mood_score" },
            { name: "wellness_checkins", desc: "Daily check-in responses", cols: "id, user_id, answers, scores, concerns, created_at" },
            { name: "wellness_chat_logs", desc: "AI chat conversation logs", cols: "id, user_id, message, emotion_score, emotion, created_at" },
          ].map((table, i) => (
            <div key={i} className="p-4 bg-gray-50 rounded-lg">
              <p className="font-mono font-semibold text-purple-600">{table.name}</p>
              <p className="text-sm text-gray-600 mb-2">{table.desc}</p>
              <p className="text-xs text-gray-400 font-mono">{table.cols}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-purple-50 border border-purple-200 rounded-xl p-5">
        <h4 className="font-semibold text-purple-800 mb-2">🔒 Row Level Security</h4>
        <p className="text-sm text-purple-700">
          All tables use RLS policies ensuring users can only access their own data. Example policy:
        </p>
        <pre className="text-xs bg-gray-900 text-green-400 p-3 rounded-lg mt-3 overflow-x-auto">
{`CREATE POLICY "Users can view own data" ON profiles
  FOR SELECT USING (auth.uid() = id);`}
        </pre>
      </div>
    </div>
  ),
  
  api: (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-[#EC4899] to-[#F472B6] rounded-2xl p-6 text-white">
        <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
          <Code className="h-6 w-6" />
          API Reference
        </h3>
        <p className="opacity-90">Sanity CMS queries and data fetching patterns.</p>
      </div>

      <div className="bg-white rounded-xl p-5 border border-gray-100">
        <h4 className="font-semibold text-gray-900 mb-4">🔍 GROQ Query Language</h4>
        <p className="text-sm text-gray-600 mb-4">
          Sanity uses GROQ (Graph-Relational Object Queries) for fetching content. It's similar to GraphQL but simpler for content-focused queries.
        </p>
        <CodeBlock code={codeExamples.sanityQuery} language="typescript" title="Sanity Queries (lib/sanity.ts)" />
      </div>

      <div className="bg-white rounded-xl p-5 border border-gray-100">
        <h4 className="font-semibold text-gray-900 mb-4">📡 Data Fetching Pattern</h4>
        <pre className="text-xs bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
{`// In page components
import { sanityClient, queries } from "@/lib/sanity";

// Fetch data
const services = await sanityClient.fetch(queries.allServices);
const provider = await sanityClient.fetch(queries.providerBySlug, { slug });

// Use with Image
import { urlFor } from "@/lib/sanity";
<Image src={urlFor(service.image).width(400).url()} />`}
        </pre>
      </div>
    </div>
  ),
};

// Code block component
function CodeBlock({ code, language, title }: { code: string; language: string; title: string }) {
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-gray-900 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800">
        <span className="text-sm text-gray-400">{title}</span>
        <button
          onClick={copyCode}
          className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors"
        >
          {copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-xs text-green-400">
        <code>{code}</code>
      </pre>
    </div>
  );
}

export default function DocumentationPage() {
  const [activeSection, setActiveSection] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const filteredSections = docSections.filter(
    (section) =>
      section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      section.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center"
            >
              {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <Link href="/" className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#0D9488] to-[#7DD3D3] flex items-center justify-center">
                <Book className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-gray-900">Bold & Beyond</h1>
                <p className="text-xs text-gray-500">Documentation</p>
              </div>
            </Link>
          </div>
          
          <div className="flex items-center gap-3">
            <Link
              href="/appx"
              className="hidden sm:flex items-center gap-2 px-4 py-2 bg-[#0D9488] text-white rounded-lg text-sm font-medium hover:bg-[#0B7B71] transition-colors"
            >
              <Play className="h-4 w-4" />
              Launch App
            </Link>
            <Link
              href="https://github.com/sharyyoru/bold-beyond"
              target="_blank"
              className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              <GitBranch className="h-5 w-5 text-gray-600" />
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto flex">
        {/* Sidebar */}
        <aside className={`
          fixed lg:sticky top-[73px] left-0 z-40 h-[calc(100vh-73px)] w-72 bg-white border-r border-gray-200 
          transform transition-transform lg:transform-none overflow-y-auto
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="p-4">
            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search docs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0D9488]"
              />
            </div>

            {/* Navigation */}
            <nav className="space-y-1">
              {filteredSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => {
                    setActiveSection(section.id);
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all ${
                    activeSection === section.id
                      ? "bg-[#0D9488] text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <section.icon className={`h-5 w-5 ${activeSection === section.id ? 'text-white' : ''}`} style={{ color: activeSection === section.id ? undefined : section.color }} />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{section.title}</p>
                  </div>
                  <ChevronRight className={`h-4 w-4 ${activeSection === section.id ? 'text-white' : 'text-gray-400'}`} />
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0 p-6 lg:p-8">
          <div className="max-w-3xl">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
              <Link href="/" className="hover:text-gray-700">Home</Link>
              <ChevronRight className="h-4 w-4" />
              <span>Documentation</span>
              <ChevronRight className="h-4 w-4" />
              <span className="text-gray-900 font-medium">
                {docSections.find(s => s.id === activeSection)?.title}
              </span>
            </div>

            {/* Section Title */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {docSections.find(s => s.id === activeSection)?.title}
              </h2>
              <p className="text-gray-600">
                {docSections.find(s => s.id === activeSection)?.description}
              </p>
            </div>

            {/* Section Content */}
            {sectionContent[activeSection]}

            {/* Navigation Footer */}
            <div className="mt-12 pt-8 border-t border-gray-200 flex items-center justify-between">
              {docSections.findIndex(s => s.id === activeSection) > 0 && (
                <button
                  onClick={() => setActiveSection(docSections[docSections.findIndex(s => s.id === activeSection) - 1].id)}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span className="text-sm">Previous</span>
                </button>
              )}
              {docSections.findIndex(s => s.id === activeSection) < docSections.length - 1 && (
                <button
                  onClick={() => setActiveSection(docSections[docSections.findIndex(s => s.id === activeSection) + 1].id)}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900 ml-auto"
                >
                  <span className="text-sm">Next</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}
