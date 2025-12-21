"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Star,
  Clock,
  MapPin,
  Heart,
  Share2,
  Calendar,
  ChevronRight,
  Phone,
  MessageCircle,
  Check,
} from "lucide-react";
import { sanityClient, urlFor, queries } from "@/lib/sanity";
import { Button } from "@/components/ui/button";

interface Service {
  _id: string;
  title: string;
  slug: { current: string };
  description: string;
  richDescription?: any[];
  category: string;
  basePrice: number;
  duration: number;
  image?: any;
  rating?: number;
  reviewCount?: number;
  serviceType?: string;
  benefits?: string[];
  provider?: {
    _id: string;
    name: string;
    nameAr?: string;
    slug: { current: string };
    logo?: any;
    location?: {
      address?: string;
      area?: string;
    };
    contact?: {
      phone?: string;
      whatsapp?: string;
    };
    rating?: number;
    reviewCount?: number;
  };
  experts?: Array<{
    _id: string;
    name: string;
    slug: { current: string };
    photo?: any;
    specializations?: string[];
  }>;
}

export default function ServiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    async function fetchService() {
      if (!params.slug) return;
      try {
        const data = await sanityClient.fetch(queries.serviceBySlug, {
          slug: params.slug,
        });
        setService(data);
      } catch (error) {
        console.error("Error fetching service:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchService();
  }, [params.slug]);

  const generateDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push({
        full: date.toISOString().split("T")[0],
        day: date.toLocaleDateString("en-US", { weekday: "short" }),
        date: date.getDate(),
        month: date.toLocaleDateString("en-US", { month: "short" }),
      });
    }
    return dates;
  };

  const timeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "12:00", "14:00", "14:30", "15:00", "15:30", "16:00",
    "16:30", "17:00", "17:30", "18:00",
  ];

  const handleBooking = () => {
    if (selectedDate && selectedTime) {
      setShowBookingModal(true);
    }
  };

  const confirmBooking = () => {
    alert(`Booking confirmed for ${selectedDate} at ${selectedTime}!`);
    setShowBookingModal(false);
    router.push("/appx");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7]">
        <div className="animate-pulse">
          <div className="h-72 bg-gray-200" />
          <div className="p-4 space-y-4">
            <div className="h-6 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
            <div className="h-20 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Service not found</p>
          <Link href="/appx/services" className="text-[#0D9488] font-medium">
            Back to Services
          </Link>
        </div>
      </div>
    );
  }

  const dates = generateDates();

  return (
    <div className="min-h-screen bg-[#FDFBF7] pb-24">
      {/* Hero Image */}
      <div className="relative h-72">
        {service.image ? (
          <Image
            src={urlFor(service.image).width(800).height(600).url()}
            alt={service.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-[#0D9488] to-[#7DD3D3]" />
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        {/* Header Buttons */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="h-10 w-10 rounded-full bg-white/90 backdrop-blur flex items-center justify-center"
          >
            <ArrowLeft className="h-5 w-5 text-gray-700" />
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className="h-10 w-10 rounded-full bg-white/90 backdrop-blur flex items-center justify-center"
            >
              <Heart
                className={`h-5 w-5 ${
                  isFavorite ? "fill-red-500 text-red-500" : "text-gray-700"
                }`}
              />
            </button>
            <button className="h-10 w-10 rounded-full bg-white/90 backdrop-blur flex items-center justify-center">
              <Share2 className="h-5 w-5 text-gray-700" />
            </button>
          </div>
        </div>

        {/* Category Badge */}
        <div className="absolute bottom-4 left-4">
          <span className="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full uppercase">
            {service.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-5">
        {/* Title & Rating */}
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {service.title}
          </h1>
          <div className="flex items-center gap-4">
            {service.rating && (
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold text-gray-900">
                  {service.rating}
                </span>
                {service.reviewCount && (
                  <span className="text-gray-500 text-sm">
                    ({service.reviewCount} reviews)
                  </span>
                )}
              </div>
            )}
            {service.duration && (
              <div className="flex items-center gap-1 text-gray-500">
                <Clock className="h-4 w-4" />
                <span className="text-sm">{service.duration} min</span>
              </div>
            )}
          </div>
        </div>

        {/* Price */}
        <div className="bg-white rounded-2xl p-4 shadow-sm mb-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Starting from</p>
              <p className="text-2xl font-bold text-[#0D9488]">
                {service.basePrice} AED
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400">per session</p>
              <p className="text-xs text-[#0D9488]">
                {service.serviceType || "Wellness Session"}
              </p>
            </div>
          </div>
        </div>

        {/* Provider Card */}
        {service.provider && (
          <Link
            href={`/appx/providers/${service.provider.slug.current}`}
            className="block bg-white rounded-2xl p-4 shadow-sm mb-4"
          >
            <div className="flex items-center gap-3">
              <div className="h-14 w-14 rounded-full bg-gray-100 overflow-hidden">
                {service.provider.logo ? (
                  <Image
                    src={urlFor(service.provider.logo).width(100).height(100).url()}
                    alt={service.provider.name}
                    width={56}
                    height={56}
                    className="object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-gradient-to-br from-[#0D9488] to-[#7DD3D3]" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">
                  {service.provider.name}
                </h3>
                {service.provider.location?.area && (
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {service.provider.location.area}
                  </p>
                )}
                {service.provider.rating && (
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs text-gray-600">
                      {service.provider.rating}
                    </span>
                  </div>
                )}
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>
          </Link>
        )}

        {/* Description */}
        <div className="bg-white rounded-2xl p-4 shadow-sm mb-4">
          <h2 className="font-semibold text-gray-900 mb-2">About this service</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            {service.description}
          </p>
        </div>

        {/* Benefits */}
        {service.benefits && service.benefits.length > 0 && (
          <div className="bg-white rounded-2xl p-4 shadow-sm mb-4">
            <h2 className="font-semibold text-gray-900 mb-3">Key Benefits</h2>
            <div className="space-y-2">
              {service.benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="h-5 w-5 rounded-full bg-[#0D9488]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="h-3 w-3 text-[#0D9488]" />
                  </div>
                  <span className="text-sm text-gray-600">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Book Appointment Section */}
        <div className="bg-white rounded-2xl p-4 shadow-sm mb-4">
          <h2 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-[#0D9488]" />
            Select Date & Time
          </h2>

          {/* Date Selection */}
          <div className="mb-4">
            <p className="text-sm text-gray-500 mb-2">Choose a date</p>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {dates.map((d) => (
                <button
                  key={d.full}
                  onClick={() => setSelectedDate(d.full)}
                  className={`flex flex-col items-center min-w-[60px] py-3 px-2 rounded-xl transition-all ${
                    selectedDate === d.full
                      ? "bg-[#0D9488] text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <span className="text-xs font-medium">{d.day}</span>
                  <span className="text-lg font-bold">{d.date}</span>
                  <span className="text-xs">{d.month}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Time Selection */}
          {selectedDate && (
            <div>
              <p className="text-sm text-gray-500 mb-2">Choose a time</p>
              <div className="grid grid-cols-4 gap-2">
                {timeSlots.map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                      selectedTime === time
                        ? "bg-[#0D9488] text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Contact Provider */}
        {service.provider?.contact && (
          <div className="flex gap-3 mb-4">
            {service.provider.contact.phone && (
              <a
                href={`tel:${service.provider.contact.phone}`}
                className="flex-1 flex items-center justify-center gap-2 bg-white rounded-xl py-3 shadow-sm text-gray-700 font-medium"
              >
                <Phone className="h-4 w-4" />
                Call
              </a>
            )}
            {service.provider.contact.whatsapp && (
              <a
                href={`https://wa.me/${service.provider.contact.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] rounded-xl py-3 text-white font-medium"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </a>
            )}
          </div>
        )}
      </div>

      {/* Fixed Bottom Booking Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-gray-500">Total</p>
            <p className="text-xl font-bold text-gray-900">
              {service.basePrice} AED
            </p>
          </div>
          <Button
            onClick={handleBooking}
            disabled={!selectedDate || !selectedTime}
            className="flex-1 bg-[#0D9488] hover:bg-[#0B7B71] text-white py-6 rounded-xl text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Book Now
          </Button>
        </div>
      </div>

      {/* Booking Confirmation Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Confirm Booking
            </h3>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-500">Service</span>
                <span className="font-medium">{service.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Date</span>
                <span className="font-medium">{selectedDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Time</span>
                <span className="font-medium">{selectedTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Duration</span>
                <span className="font-medium">{service.duration} min</span>
              </div>
              <div className="border-t pt-3 flex justify-between">
                <span className="font-semibold">Total</span>
                <span className="font-bold text-[#0D9488]">
                  {service.basePrice} AED
                </span>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowBookingModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={confirmBooking}
                className="flex-1 bg-[#0D9488] hover:bg-[#0B7B71]"
              >
                Confirm
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
