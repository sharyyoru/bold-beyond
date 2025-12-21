"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Heart,
  Target,
  Bell,
  Shield,
  Edit3,
  Save,
  X,
  ChevronRight,
  Camera,
  Star,
  Award,
  TrendingUp,
  Activity,
  Moon,
  Zap,
  Brain,
  Smile,
  LogOut,
  Settings,
  Crown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { createSupabaseClient } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  date_of_birth: string | null;
  gender: string | null;
  height_cm: number | null;
  weight_kg: number | null;
  wellness_goals: string[];
  interests: string[];
  dietary_preferences: string[];
  health_conditions: string[];
  preferred_times: string[];
  notification_preferences: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  membership_tier: string;
  total_bookings: number;
  total_purchases: number;
  total_wellness_points: number;
  wellness_scores: {
    mind?: number;
    body?: number;
    sleep?: number;
    energy?: number;
    mood?: number;
    stress?: number;
    overall?: number;
  };
  current_mood_score: number;
  onboarding_complete: boolean;
}

const wellnessGoalOptions = [
  "Reduce Stress", "Better Sleep", "Increase Energy", "Mental Clarity",
  "Physical Fitness", "Weight Management", "Mindfulness", "Work-Life Balance",
  "Self-Care", "Emotional Wellness", "Pain Management", "Flexibility"
];

const interestOptions = [
  "Yoga", "Meditation", "Fitness", "Spa", "Massage", "Nutrition",
  "Therapy", "Coaching", "Beauty", "Aromatherapy", "Sound Healing", "Breathwork"
];

const dietaryOptions = [
  "Vegetarian", "Vegan", "Gluten-Free", "Dairy-Free", "Keto",
  "Paleo", "No Restrictions", "Halal", "Kosher"
];

const timeOptions = [
  "Early Morning (6-9am)", "Morning (9-12pm)", "Afternoon (12-5pm)",
  "Evening (5-8pm)", "Night (8-11pm)"
];

export default function ProfilePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState<"personal" | "wellness" | "preferences" | "settings">("personal");
  const [editedProfile, setEditedProfile] = useState<Partial<UserProfile>>({});

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const supabase = createSupabaseClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push("/appx/login");
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Profile fetch error:", error);
        // Create a default profile if not found
        setProfile({
          id: user.id,
          email: user.email || "",
          full_name: user.user_metadata?.full_name || null,
          avatar_url: null,
          phone: null,
          date_of_birth: null,
          gender: null,
          height_cm: null,
          weight_kg: null,
          wellness_goals: [],
          interests: [],
          dietary_preferences: [],
          health_conditions: [],
          preferred_times: [],
          notification_preferences: { email: true, push: true, sms: false },
          membership_tier: "free",
          total_bookings: 0,
          total_purchases: 0,
          total_wellness_points: 0,
          wellness_scores: {},
          current_mood_score: 60,
          onboarding_complete: false,
        });
        setEditedProfile({});
        setLoading(false);
        return;
      }

      setProfile({
        ...data,
        email: data.email || user.email || "",
        wellness_goals: data.wellness_goals || [],
        interests: data.interests || [],
        dietary_preferences: data.dietary_preferences || [],
        health_conditions: data.health_conditions || [],
        preferred_times: data.preferred_times || [],
        notification_preferences: data.notification_preferences || { email: true, push: true, sms: false },
        wellness_scores: data.wellness_scores || {},
      });
      setEditedProfile(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast({
        title: "Error",
        description: "Failed to load profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!profile) return;

    setSaving(true);
    try {
      const supabase = createSupabaseClient();
      const { error } = await supabase
        .from("profiles")
        .update(editedProfile)
        .eq("id", profile.id);

      if (error) throw error;

      setProfile({ ...profile, ...editedProfile });
      setEditMode(false);
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    const supabase = createSupabaseClient();
    await supabase.auth.signOut();
    router.push("/appx/login");
  };

  const toggleArrayItem = (field: keyof UserProfile, item: string) => {
    const current = (editedProfile[field] as string[]) || [];
    const updated = current.includes(item)
      ? current.filter(i => i !== item)
      : [...current, item];
    setEditedProfile({ ...editedProfile, [field]: updated });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        <div className="h-12 w-12 rounded-full border-4 border-[#0D9488] border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!profile) return null;

  const wellnessScore = profile.wellness_scores?.overall || profile.current_mood_score || 60;
  const membershipColors: Record<string, string> = {
    free: "bg-gray-100 text-gray-600",
    pro: "bg-amber-100 text-amber-700",
    premium: "bg-purple-100 text-purple-700",
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-100 px-4 py-3">
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center"
          >
            <ArrowLeft className="h-5 w-5 text-gray-700" />
          </button>
          <h1 className="font-semibold text-gray-900">My Profile</h1>
          {editMode ? (
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setEditMode(false);
                  setEditedProfile(profile);
                }}
                className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center"
              >
                <X className="h-5 w-5 text-gray-700" />
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="h-10 w-10 rounded-full bg-[#0D9488] flex items-center justify-center"
              >
                <Save className="h-5 w-5 text-white" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setEditMode(true)}
              className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center"
            >
              <Edit3 className="h-5 w-5 text-gray-700" />
            </button>
          )}
        </div>
      </div>

      {/* Profile Header Card */}
      <div className="px-4 py-6">
        <div className="bg-gradient-to-br from-[#0D9488] to-[#7DD3D3] rounded-3xl p-6 text-white">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative">
              <div className="h-20 w-20 rounded-full bg-white/20 flex items-center justify-center text-3xl font-bold">
                {profile.full_name?.charAt(0) || profile.email.charAt(0).toUpperCase()}
              </div>
              {editMode && (
                <button className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-white text-[#0D9488] flex items-center justify-center shadow-lg">
                  <Camera className="h-4 w-4" />
                </button>
              )}
            </div>
            <div className="flex-1">
              {editMode ? (
                <input
                  type="text"
                  value={editedProfile.full_name || ""}
                  onChange={(e) => setEditedProfile({ ...editedProfile, full_name: e.target.value })}
                  className="bg-white/20 rounded-lg px-3 py-2 text-white placeholder-white/60 w-full text-lg font-semibold"
                  placeholder="Your Name"
                />
              ) : (
                <h2 className="text-xl font-bold">{profile.full_name || "User"}</h2>
              )}
              <p className="text-white/80 text-sm">{profile.email}</p>
              <div className={`inline-flex items-center gap-1 mt-2 px-3 py-1 rounded-full text-xs font-medium ${membershipColors[profile.membership_tier] || membershipColors.free}`}>
                <Crown className="h-3 w-3" />
                {profile.membership_tier?.charAt(0).toUpperCase() + profile.membership_tier?.slice(1) || "Free"} Member
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-2 mt-4">
            <div className="bg-white/10 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold">{wellnessScore}</p>
              <p className="text-xs text-white/80">Wellness</p>
            </div>
            <div className="bg-white/10 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold">{profile.total_bookings || 0}</p>
              <p className="text-xs text-white/80">Bookings</p>
            </div>
            <div className="bg-white/10 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold">{profile.total_purchases || 0}</p>
              <p className="text-xs text-white/80">Purchases</p>
            </div>
            <div className="bg-white/10 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold">{profile.total_wellness_points || 0}</p>
              <p className="text-xs text-white/80">Points</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 mb-4">
        <div className="flex gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
          {[
            { id: "personal", label: "Personal", icon: User },
            { id: "wellness", label: "Wellness", icon: Heart },
            { id: "preferences", label: "Preferences", icon: Target },
            { id: "settings", label: "Settings", icon: Settings },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? "bg-[#0D9488] text-white"
                  : "bg-white text-gray-600 border border-gray-200"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span className="text-sm font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="px-4 pb-24">
        {activeTab === "personal" && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center">
                    <Mail className="h-5 w-5 text-blue-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm text-gray-900">{profile.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-green-50 flex items-center justify-center">
                    <Phone className="h-5 w-5 text-green-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">Phone</p>
                    {editMode ? (
                      <input
                        type="tel"
                        value={editedProfile.phone || ""}
                        onChange={(e) => setEditedProfile({ ...editedProfile, phone: e.target.value })}
                        className="text-sm text-gray-900 bg-gray-100 rounded px-2 py-1 w-full"
                        placeholder="Add phone number"
                      />
                    ) : (
                      <p className="text-sm text-gray-900">{profile.phone || "Not set"}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">Personal Details</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-purple-50 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-purple-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">Date of Birth</p>
                    {editMode ? (
                      <input
                        type="date"
                        value={editedProfile.date_of_birth || ""}
                        onChange={(e) => setEditedProfile({ ...editedProfile, date_of_birth: e.target.value })}
                        className="text-sm text-gray-900 bg-gray-100 rounded px-2 py-1 w-full"
                      />
                    ) : (
                      <p className="text-sm text-gray-900">
                        {profile.date_of_birth ? new Date(profile.date_of_birth).toLocaleDateString() : "Not set"}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-pink-50 flex items-center justify-center">
                    <User className="h-5 w-5 text-pink-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">Gender</p>
                    {editMode ? (
                      <select
                        value={editedProfile.gender || ""}
                        onChange={(e) => setEditedProfile({ ...editedProfile, gender: e.target.value })}
                        className="text-sm text-gray-900 bg-gray-100 rounded px-2 py-1 w-full"
                      >
                        <option value="">Select</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                        <option value="prefer_not_to_say">Prefer not to say</option>
                      </select>
                    ) : (
                      <p className="text-sm text-gray-900 capitalize">{profile.gender || "Not set"}</p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-amber-50 flex items-center justify-center">
                      <TrendingUp className="h-5 w-5 text-amber-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-500">Height (cm)</p>
                      {editMode ? (
                        <input
                          type="number"
                          value={editedProfile.height_cm || ""}
                          onChange={(e) => setEditedProfile({ ...editedProfile, height_cm: parseInt(e.target.value) })}
                          className="text-sm text-gray-900 bg-gray-100 rounded px-2 py-1 w-full"
                          placeholder="170"
                        />
                      ) : (
                        <p className="text-sm text-gray-900">{profile.height_cm || "Not set"}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-teal-50 flex items-center justify-center">
                      <Activity className="h-5 w-5 text-teal-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-500">Weight (kg)</p>
                      {editMode ? (
                        <input
                          type="number"
                          step="0.1"
                          value={editedProfile.weight_kg || ""}
                          onChange={(e) => setEditedProfile({ ...editedProfile, weight_kg: parseFloat(e.target.value) })}
                          className="text-sm text-gray-900 bg-gray-100 rounded px-2 py-1 w-full"
                          placeholder="70"
                        />
                      ) : (
                        <p className="text-sm text-gray-900">{profile.weight_kg || "Not set"}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "wellness" && (
          <div className="space-y-4">
            {/* Wellness Scores */}
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">Current Wellness Scores</h3>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: "mind", label: "Mind", icon: Brain, color: "#0D9488" },
                  { id: "body", label: "Body", icon: Activity, color: "#D4AF37" },
                  { id: "sleep", label: "Sleep", icon: Moon, color: "#6B9BC3" },
                  { id: "energy", label: "Energy", icon: Zap, color: "#F4A261" },
                  { id: "mood", label: "Mood", icon: Smile, color: "#E9967A" },
                  { id: "stress", label: "Stress", icon: TrendingUp, color: "#B8A4C9" },
                ].map((dim) => {
                  const score = profile.wellness_scores?.[dim.id as keyof typeof profile.wellness_scores] || 60;
                  return (
                    <div key={dim.id} className="text-center p-3 bg-gray-50 rounded-xl">
                      <div className="relative h-12 w-12 mx-auto mb-2">
                        <svg className="h-12 w-12 -rotate-90">
                          <circle cx="24" cy="24" r="20" stroke="#E5E7EB" strokeWidth="4" fill="none" />
                          <circle
                            cx="24" cy="24" r="20"
                            stroke={dim.color}
                            strokeWidth="4"
                            fill="none"
                            strokeDasharray={125.6}
                            strokeDashoffset={125.6 * (1 - score / 100)}
                            strokeLinecap="round"
                          />
                        </svg>
                        <span className="absolute inset-0 flex items-center justify-center text-xs font-bold">{score}</span>
                      </div>
                      <p className="text-xs text-gray-600">{dim.label}</p>
                    </div>
                  );
                })}
              </div>
              <Link
                href="/appx/wellness-checkin"
                className="mt-4 w-full flex items-center justify-center gap-2 py-3 bg-[#0D9488] text-white rounded-xl font-medium"
              >
                Update My Wellness
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Wellness Goals */}
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">Wellness Goals</h3>
              <div className="flex flex-wrap gap-2">
                {wellnessGoalOptions.map((goal) => {
                  const isSelected = (editMode ? editedProfile.wellness_goals : profile.wellness_goals)?.includes(goal);
                  return (
                    <button
                      key={goal}
                      onClick={() => editMode && toggleArrayItem("wellness_goals", goal)}
                      disabled={!editMode}
                      className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                        isSelected
                          ? "bg-[#0D9488] text-white"
                          : "bg-gray-100 text-gray-600"
                      } ${editMode ? "cursor-pointer" : "cursor-default"}`}
                    >
                      {goal}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Interests */}
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">Interests</h3>
              <div className="flex flex-wrap gap-2">
                {interestOptions.map((interest) => {
                  const isSelected = (editMode ? editedProfile.interests : profile.interests)?.includes(interest);
                  return (
                    <button
                      key={interest}
                      onClick={() => editMode && toggleArrayItem("interests", interest)}
                      disabled={!editMode}
                      className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                        isSelected
                          ? "bg-[#D4AF37] text-white"
                          : "bg-gray-100 text-gray-600"
                      } ${editMode ? "cursor-pointer" : "cursor-default"}`}
                    >
                      {interest}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === "preferences" && (
          <div className="space-y-4">
            {/* Dietary Preferences */}
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">Dietary Preferences</h3>
              <div className="flex flex-wrap gap-2">
                {dietaryOptions.map((diet) => {
                  const isSelected = (editMode ? editedProfile.dietary_preferences : profile.dietary_preferences)?.includes(diet);
                  return (
                    <button
                      key={diet}
                      onClick={() => editMode && toggleArrayItem("dietary_preferences", diet)}
                      disabled={!editMode}
                      className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                        isSelected
                          ? "bg-green-500 text-white"
                          : "bg-gray-100 text-gray-600"
                      } ${editMode ? "cursor-pointer" : "cursor-default"}`}
                    >
                      {diet}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Preferred Times */}
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">Preferred Appointment Times</h3>
              <div className="space-y-2">
                {timeOptions.map((time) => {
                  const isSelected = (editMode ? editedProfile.preferred_times : profile.preferred_times)?.includes(time);
                  return (
                    <button
                      key={time}
                      onClick={() => editMode && toggleArrayItem("preferred_times", time)}
                      disabled={!editMode}
                      className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                        isSelected
                          ? "bg-[#0D9488] text-white"
                          : "bg-gray-50 text-gray-700"
                      } ${editMode ? "cursor-pointer" : "cursor-default"}`}
                    >
                      <span className="text-sm">{time}</span>
                      {isSelected && <Star className="h-4 w-4" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="space-y-4">
            {/* Notifications */}
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">Notifications</h3>
              <div className="space-y-3">
                {[
                  { key: "email", label: "Email Notifications", icon: Mail },
                  { key: "push", label: "Push Notifications", icon: Bell },
                  { key: "sms", label: "SMS Notifications", icon: Phone },
                ].map((item) => {
                  const prefs = editMode ? editedProfile.notification_preferences : profile.notification_preferences;
                  const isEnabled = prefs?.[item.key as keyof typeof prefs];
                  return (
                    <div key={item.key} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <item.icon className="h-5 w-5 text-gray-500" />
                        <span className="text-sm text-gray-700">{item.label}</span>
                      </div>
                      <button
                        onClick={() => {
                          if (editMode) {
                            setEditedProfile({
                              ...editedProfile,
                              notification_preferences: {
                                email: prefs?.email ?? true,
                                push: prefs?.push ?? true,
                                sms: prefs?.sms ?? false,
                                [item.key]: !isEnabled,
                              },
                            });
                          }
                        }}
                        disabled={!editMode}
                        className={`w-12 h-6 rounded-full transition-all ${
                          isEnabled ? "bg-[#0D9488]" : "bg-gray-300"
                        }`}
                      >
                        <div className={`h-5 w-5 bg-white rounded-full shadow transition-transform ${
                          isEnabled ? "translate-x-6" : "translate-x-0.5"
                        }`} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Account Actions */}
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">Account</h3>
              <div className="space-y-2">
                <Link
                  href="/appx/onboarding"
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <Target className="h-5 w-5 text-gray-500" />
                    <span className="text-sm text-gray-700">Redo Onboarding</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </Link>
                <Link
                  href="/appx/activities"
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <Activity className="h-5 w-5 text-gray-500" />
                    <span className="text-sm text-gray-700">My Activities</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-between p-3 bg-red-50 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <LogOut className="h-5 w-5 text-red-500" />
                    <span className="text-sm text-red-600">Log Out</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
