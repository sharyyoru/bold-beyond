"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  Menu,
  Bell,
  ArrowRight,
  Heart,
  Star,
  Clock,
  MapPin,
  MessageCircle,
  LayoutGrid,
  Headphones,
  Monitor,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// Mock data
const mockUser = {
  name: "Sarah",
  wellnessScore: 20,
};

const currentDate = new Date();
const month = currentDate.toLocaleString('en-US', { month: 'short' }).toUpperCase();
const day = currentDate.getDate();

const quickActions = [
  { id: "help", label: "I need help", icon: "whatsapp", color: "bg-green-500" },
  { id: "services", label: "Services", icon: "grid", color: "bg-brand-gold" },
  { id: "activities", label: "Activities", icon: "users", color: "bg-brand-gold" },
  { id: "support", label: "Support", icon: "chat", color: "bg-brand-teal" },
];

const featuredServices = [
  {
    id: "1",
    title: "Want change? Let's unlock your full potential!",
    category: "PERSONAL GROWTH",
    price: 80,
    expertName: "Dr. Aisha Al Mansoori",
    expertTitle: "Motivation Speaker",
    duration: "1h 30min",
    rating: 4.9,
    image: "/images/service-1.jpg",
  },
  {
    id: "2",
    title: "Overthinking? Let's get you back on track",
    category: "LIFE SKILLS",
    price: 50,
    expertName: "Dr. Aisha Al Marzooqi",
    expertTitle: "Certified Life Coach",
    duration: "1h",
    rating: 4.8,
    image: "/images/service-2.jpg",
  },
];

const featuredProfessionals = [
  {
    id: "1",
    name: "Mr. Omar Al-Mansoori",
    title: "Certified Life Strategist",
    category: "COACHING",
    tags: ["Career Development", "Leadership Skills", "Executive Coaching"],
    image: "/images/expert-1.jpg",
  },
  {
    id: "2",
    name: "Dr. Salma Al Hosani",
    title: "Certified Coach",
    category: "COACHING",
    tags: ["Stress Management", "Life Skills", "Personal Growth"],
    image: "/images/expert-2.jpg",
  },
];

const featuredClinics = [
  {
    id: "1",
    name: "Group Meditation",
    type: "Group Meditation",
    category: "WELLNESS",
    location: "Jumeirah Lake Towers, Cluster Q",
    distance: "10 km away",
    hours: "8 AM - 10 PM",
    rating: 4.7,
    image: "/images/clinic-1.jpg",
  },
  {
    id: "2",
    name: "Facial Treatment",
    type: "Ethereal Aesthetics",
    category: "BEAUTY",
    location: "Al Barsha - City Centre Al Barsha",
    distance: "5 km away",
    hours: "9 AM - 9 PM",
    rating: 4.8,
    image: "/images/clinic-2.jpg",
  },
];

const suggestedAppointment = {
  type: "Neuro-Transformational Coaching",
  tags: ["COACHING", "ONLINE"],
  date: "Monday • Oct 6 • 3:00 PM",
  image: "/images/coaching.jpg",
};

export default function DashboardPage() {
  const [heroIndex, setHeroIndex] = useState(0);

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white px-4 py-3 flex items-center gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search anything..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal"
          />
        </div>
        <button className="h-10 w-10 rounded-full border border-gray-200 flex items-center justify-center">
          <Menu className="h-5 w-5 text-gray-600" />
        </button>
        <button className="h-10 w-10 rounded-full border border-gray-200 flex items-center justify-center relative">
          <Bell className="h-5 w-5 text-gray-600" />
          <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">3</span>
        </button>
      </div>

      {/* Hero Banner */}
      <div className="relative h-56 bg-gradient-to-r from-brand-teal to-brand-teal-light overflow-hidden">
        <div className="absolute inset-0 p-6 flex flex-col justify-center">
          <h2 className="text-2xl font-display font-bold text-white italic mb-1">
            Move Your Body
          </h2>
          <p className="text-white/90 mb-4">Free Your Mind.</p>
          <Button variant="teal" size="sm" className="w-fit bg-gray-900 hover:bg-gray-800" asChild>
            <Link href="/booking/select-service">
              Book Now <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="absolute right-0 bottom-0 w-1/2 h-full">
          {/* Hero image placeholder */}
          <div className="w-full h-full bg-brand-teal-light/30" />
        </div>
        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
          {[0, 1, 2, 3, 4].map((i) => (
            <button
              key={i}
              onClick={() => setHeroIndex(i)}
              className={`h-2 w-2 rounded-full transition-colors ${
                i === heroIndex ? "bg-white" : "bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="px-4 -mt-8 relative z-10 space-y-4">
        {/* Check-in Card */}
        <Card className="shadow-lg">
          <CardContent className="p-4">
            <div className="flex gap-4">
              <div className="text-center">
                <p className="text-xs text-brand-teal font-medium">{month}</p>
                <p className="text-2xl font-bold text-gray-900">{day}</p>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">What's the first thing on your mind today?</h3>
                <p className="text-sm text-gray-500">We're here to check in with you.</p>
              </div>
            </div>
            <Button variant="teal" className="w-full mt-4">
              Share My Thoughts
            </Button>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-4 gap-3">
          <Link href="/help" className="flex flex-col items-center gap-2">
            <div className="h-14 w-14 rounded-full bg-green-500 flex items-center justify-center">
              <svg className="h-7 w-7 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </div>
            <span className="text-xs text-gray-600 text-center">I need help</span>
          </Link>
          <Link href="/services" className="flex flex-col items-center gap-2">
            <div className="h-14 w-14 rounded-full bg-brand-gold/10 flex items-center justify-center">
              <LayoutGrid className="h-7 w-7 text-brand-gold" />
            </div>
            <span className="text-xs text-gray-600 text-center">Services</span>
          </Link>
          <Link href="/activities" className="flex flex-col items-center gap-2">
            <div className="h-14 w-14 rounded-full bg-brand-gold/10 flex items-center justify-center">
              <svg className="h-7 w-7 text-brand-gold" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <span className="text-xs text-gray-600 text-center">Activities</span>
          </Link>
          <Link href="/support" className="flex flex-col items-center gap-2">
            <div className="h-14 w-14 rounded-full bg-brand-teal/10 flex items-center justify-center">
              <MessageCircle className="h-7 w-7 text-brand-teal" />
            </div>
            <span className="text-xs text-gray-600 text-center">Support</span>
          </Link>
        </div>

        {/* Wellness Score & Highlights */}
        <div className="grid grid-cols-2 gap-3">
          <Card>
            <CardContent className="p-4">
              <h4 className="font-semibold text-gray-900">Welness Score</h4>
              <p className="text-xs text-green-600">+20% better than yesterday</p>
              <div className="mt-2 flex items-center gap-3">
                <div className="relative h-12 w-12">
                  <svg className="h-12 w-12 -rotate-90 transform">
                    <circle cx="24" cy="24" r="20" stroke="#E5E7EB" strokeWidth="4" fill="none" />
                    <circle
                      cx="24" cy="24" r="20"
                      stroke="#8B5CF6"
                      strokeWidth="4"
                      fill="none"
                      strokeDasharray={125.6}
                      strokeDashoffset={125.6 * (1 - mockUser.wellnessScore / 100)}
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold">
                    {mockUser.wellnessScore}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <h4 className="font-semibold text-gray-900">Highlights</h4>
              <p className="text-xs text-gray-500">Curated Products & Activities for {mockUser.name}</p>
            </CardContent>
          </Card>
        </div>

        {/* Quote of the Day */}
        <div className="rounded-2xl bg-gradient-to-r from-teal-100 via-purple-100 to-yellow-100 p-6">
          <p className="text-xs font-medium text-brand-teal uppercase tracking-wide mb-2">#QUOTEOFTHEDAY</p>
          <p className="text-lg font-medium text-gray-900 mb-4">
            "Talk to someone you trust about how you're feeling."
          </p>
          <Button variant="outline" className="bg-white border-gray-300 rounded-full">
            Schedule Now
          </Button>
        </div>

        {/* Suggested Appointment */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Suggested Appointment</h3>
          <Card>
            <CardContent className="p-0">
              <div className="flex gap-4 p-4">
                <div className="w-20 h-20 rounded-xl bg-gray-200 overflow-hidden flex-shrink-0">
                  <div className="w-full h-full bg-gradient-to-br from-brand-teal/20 to-brand-teal/40" />
                </div>
                <div className="flex-1">
                  <div className="flex gap-2 mb-1">
                    <span className="text-[10px] font-medium bg-brand-teal/10 text-brand-teal px-2 py-0.5 rounded-full">COACHING</span>
                    <span className="text-[10px] font-medium bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Monitor className="h-3 w-3" /> ONLINE
                    </span>
                  </div>
                  <h4 className="font-semibold text-gray-900">{suggestedAppointment.type}</h4>
                  <p className="text-sm text-gray-500">{suggestedAppointment.date}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Picks Banner */}
        <div className="rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-6 text-white">
          <p className="text-sm opacity-90">Shop our trending products</p>
          <h3 className="text-2xl font-bold mb-2">Top Picks</h3>
          <div className="flex items-center gap-2 text-sm mb-3">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span>4.8(89)</span>
            <span className="opacity-70">3K+ ordered</span>
          </div>
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-yellow-400 text-yellow-900 text-xs font-medium px-2 py-1 rounded-full">
              20% off for first-timers
            </span>
          </div>
          <Button variant="outline" size="sm" className="bg-white text-gray-900 border-0 rounded-full">
            Go! <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>

        {/* Featured Services */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900">Featured Services</h3>
            <Link href="/services" className="text-sm text-brand-teal">See All</Link>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
            {featuredServices.map((service) => (
              <Link key={service.id} href={`/services/${service.id}`} className="flex-shrink-0 w-44">
                <Card className="overflow-hidden">
                  <div className="h-28 bg-gray-200 relative">
                    <span className="absolute top-2 left-2 text-[10px] font-medium bg-white/90 px-2 py-0.5 rounded-full">
                      {service.category}
                    </span>
                    <button className="absolute top-2 right-2 h-7 w-7 bg-white rounded-full flex items-center justify-center">
                      <Heart className="h-4 w-4 text-gray-400" />
                    </button>
                  </div>
                  <CardContent className="p-3">
                    <h4 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">{service.title}</h4>
                    <p className="text-sm font-bold text-brand-gold mb-1">{service.price} AED</p>
                    <p className="text-xs text-gray-500">{service.expertName}</p>
                    <p className="text-xs text-gray-400">{service.expertTitle}</p>
                    <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {service.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" /> {service.rating}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Featured Pro's Banner */}
        <div className="rounded-2xl bg-gradient-to-r from-brand-teal to-brand-teal-light p-6 text-white">
          <h3 className="text-xl font-display font-bold italic mb-1">Featured Pro's</h3>
          <p className="text-sm opacity-90 mb-1">Compassionate Care. Expert Guidance.</p>
          <p className="text-sm opacity-90">Find the support you deserve.</p>
        </div>

        {/* Featured Professionals */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900">Featured Professionals</h3>
            <Link href="/experts" className="text-sm text-brand-teal">See All</Link>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
            {featuredProfessionals.map((pro) => (
              <Link key={pro.id} href={`/experts/${pro.id}`} className="flex-shrink-0 w-44">
                <Card className="overflow-hidden">
                  <div className="h-32 bg-gray-200 relative">
                    <span className="absolute bottom-2 left-2 text-[10px] font-medium bg-white/90 px-2 py-0.5 rounded-full">
                      {pro.category}
                    </span>
                    <button className="absolute top-2 right-2 h-7 w-7 bg-white rounded-full flex items-center justify-center">
                      <Heart className="h-4 w-4 text-gray-400" />
                    </button>
                  </div>
                  <CardContent className="p-3">
                    <h4 className="text-sm font-semibold text-gray-900">{pro.name}</h4>
                    <p className="text-xs text-gray-500 mb-2">{pro.title}</p>
                    <div className="flex flex-wrap gap-1">
                      {pro.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Your Health Banner */}
        <div className="rounded-2xl bg-gradient-to-r from-gray-100 to-brand-teal/10 p-6 relative overflow-hidden">
          <h3 className="text-xl font-display font-bold text-gray-900 mb-1">Your Health, Our Priority</h3>
          <p className="text-sm text-gray-600">Comprehensive Clinic Services</p>
        </div>

        {/* Featured Clinics */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900">Featured Clinics</h3>
            <Link href="/clinics" className="text-sm text-brand-teal">See All</Link>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
            {featuredClinics.map((clinic) => (
              <Link key={clinic.id} href={`/clinics/${clinic.id}`} className="flex-shrink-0 w-44">
                <Card className="overflow-hidden">
                  <div className="h-28 bg-gray-200 relative">
                    <span className="absolute bottom-2 left-2 text-[10px] font-medium bg-white/90 px-2 py-0.5 rounded-full">
                      {clinic.category}
                    </span>
                    <button className="absolute top-2 right-2 h-7 w-7 bg-white rounded-full flex items-center justify-center">
                      <Heart className="h-4 w-4 text-gray-400" />
                    </button>
                  </div>
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs text-gray-500">{clinic.type}</p>
                      <span className="flex items-center gap-1 text-xs">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" /> {clinic.rating}
                      </span>
                    </div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-1">{clinic.name}</h4>
                    <p className="text-xs text-gray-500 flex items-start gap-1">
                      <MapPin className="h-3 w-3 mt-0.5 flex-shrink-0" />
                      <span className="line-clamp-2">{clinic.location} ({clinic.distance})</span>
                    </p>
                    <p className="text-xs text-gray-400 mt-1">Opens at {clinic.hours}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Top Recommendations */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Top Recommendations</h3>
          <div className="grid grid-cols-2 gap-3">
            <Card className="overflow-hidden">
              <div className="h-32 bg-gradient-to-br from-brand-teal to-brand-teal-dark relative">
                <div className="absolute inset-0 p-4 flex flex-col">
                  <p className="text-[10px] font-bold text-white uppercase tracking-wider">MINDFULNESS WORKSHOP</p>
                  <p className="text-xs text-white/90 mt-1">Explore techniques to enhance mental clarity</p>
                </div>
              </div>
              <CardContent className="p-3 bg-brand-teal-light">
                <span className="text-xs bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded-full font-medium flex items-center gap-1 w-fit">
                  <Star className="h-3 w-3" /> Early bird discount: 15% off
                </span>
              </CardContent>
            </Card>
            <Card className="overflow-hidden">
              <div className="h-32 bg-gradient-to-br from-pink-200 to-pink-300 relative">
                <div className="absolute inset-0 p-4 flex flex-col">
                  <p className="text-[10px] font-bold text-gray-800 uppercase tracking-wider">SELF-CARE TIME</p>
                  <p className="text-xs text-gray-700 mt-1">Reset & relax with expert self-care</p>
                </div>
              </div>
              <CardContent className="p-3 bg-pink-100">
                <span className="text-xs bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded-full font-medium flex items-center gap-1 w-fit">
                  <Star className="h-3 w-3" /> 30% off on Pro Members
                </span>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
