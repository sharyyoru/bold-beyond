"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Star, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createAppClient } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

interface Appointment {
  id: string;
  service_name: string;
  sanity_service_id: string;
  provider_id: string;
  appointment_date: string;
  review_submitted: boolean;
}

export default function ReviewPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const appointmentId = params.appointmentId as string;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [serviceRating, setServiceRating] = useState(0);
  const [professionalRating, setProfessionalRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [hoverService, setHoverService] = useState(0);
  const [hoverProfessional, setHoverProfessional] = useState(0);

  const supabase = createAppClient();

  useEffect(() => {
    fetchAppointment();
  }, [appointmentId]);

  const fetchAppointment = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push("/appx/login");
        return;
      }

      const { data, error } = await supabase
        .from("appointments")
        .select("id, service_name, sanity_service_id, provider_id, appointment_date, review_submitted")
        .eq("id", appointmentId)
        .eq("user_id", user.id)
        .single();

      if (error || !data) {
        toast({
          title: "Not found",
          description: "Appointment not found or already reviewed.",
          variant: "destructive",
        });
        router.push("/appx/activities");
        return;
      }

      if (data.review_submitted) {
        toast({
          title: "Already reviewed",
          description: "You have already submitted a review for this service.",
        });
        router.push("/appx/activities");
        return;
      }

      setAppointment(data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (serviceRating === 0) {
      toast({
        title: "Rating required",
        description: "Please rate your service experience.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !appointment) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .single();

      const { error: reviewError } = await supabase
        .from("service_reviews")
        .insert({
          user_id: user.id,
          appointment_id: appointment.id,
          provider_id: appointment.provider_id,
          sanity_service_id: appointment.sanity_service_id,
          service_name: appointment.service_name,
          service_rating: serviceRating,
          professional_rating: professionalRating || null,
          review_text: reviewText || null,
          reviewer_name: profile?.full_name || "Anonymous",
          is_verified: true,
        });

      if (reviewError) throw reviewError;

      await supabase
        .from("appointments")
        .update({ review_submitted: true })
        .eq("id", appointment.id);

      toast({
        title: "Thank you!",
        description: "Your review has been submitted successfully.",
      });

      router.push("/appx/activities");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit review.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (
    rating: number,
    setRating: (r: number) => void,
    hover: number,
    setHover: (h: number) => void
  ) => {
    return (
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            className="p-1 transition-transform hover:scale-110"
          >
            <Star
              className={`h-10 w-10 transition-colors ${
                star <= (hover || rating)
                  ? "fill-amber-400 text-amber-400"
                  : "fill-gray-200 text-gray-200"
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-teal-400 to-teal-300 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-400 to-teal-300">
      <div className="px-4 py-4 flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center"
        >
          <ArrowLeft className="h-5 w-5 text-white" />
        </button>
        <h1 className="text-xl font-bold text-white">Write a review</h1>
      </div>

      <div className="flex justify-center py-6">
        <div className="h-48 w-48 rounded-full bg-white overflow-hidden shadow-xl flex items-center justify-center">
          <span className="text-6xl">🌟</span>
        </div>
      </div>

      <div className="bg-[#F5E6D3] rounded-t-[40px] min-h-[60vh] px-6 py-8">
        <div className="max-w-md mx-auto space-y-8">
          <div className="text-center">
            <p className="text-sm text-gray-500">Reviewing</p>
            <h2 className="text-xl font-bold text-gray-900">{appointment?.service_name}</h2>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Rate service</h3>
            <p className="text-sm text-gray-500 mb-4">
              How would you rate your experience with your service?
            </p>
            <div className="bg-white rounded-2xl p-4 flex justify-center">
              {renderStars(serviceRating, setServiceRating, hoverService, setHoverService)}
            </div>
            <div className="flex justify-between px-4 mt-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <span key={n} className="text-xs text-gray-400 w-10 text-center">{n}</span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Rate Professional</h3>
            <p className="text-sm text-gray-500 mb-4">
              How would you rate your experience with the professional?
            </p>
            <div className="bg-white rounded-2xl p-4 flex justify-center">
              {renderStars(professionalRating, setProfessionalRating, hoverProfessional, setHoverProfessional)}
            </div>
            <div className="flex justify-between px-4 mt-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <span key={n} className="text-xs text-gray-400 w-10 text-center">{n}</span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Share Your Experience</h3>
            <p className="text-sm text-gray-500 mb-4">
              Tell us what you think about your session from every review helps us improve.
            </p>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Excellent service & Very professional"
              className="w-full h-32 p-4 bg-white rounded-2xl border-0 resize-none focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-700 placeholder-gray-400"
            />
          </div>

          <Button
            onClick={handleSubmit}
            disabled={submitting || serviceRating === 0}
            className="w-full py-6 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-2xl"
          >
            {submitting ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              "Submit Rating"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
