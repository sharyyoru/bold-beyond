import { createAppClient } from "@/lib/supabase";

// Types for wellness data
export interface WellnessScores {
  mind: number;
  body: number;
  sleep: number;
  energy: number;
  mood: number;
  stress: number;
  focus: number;
  hydration: number;
  overall: number;
}

export interface MoodEntry {
  date: string;
  dayName: string;
  mood: "great" | "happy" | "neutral" | "low" | "sad";
  score: number;
  notes?: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  sentiment?: "positive" | "neutral" | "negative";
  topics?: string[];
}

export interface ServiceBooking {
  id: string;
  serviceId: string;
  serviceName: string;
  category: string;
  providerId: string;
  providerName: string;
  date: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  rating?: number;
  feedback?: string;
}

export interface Purchase {
  id: string;
  productId: string;
  productName: string;
  category: string;
  amount: number;
  date: string;
}

export interface UserWellnessData {
  scores: WellnessScores;
  previousScores: WellnessScores | null;
  moodHistory: MoodEntry[];
  nervousSystemStatus: "regulated" | "elevated" | "dysregulated";
  burnoutRisk: "low" | "moderate" | "high";
  alignmentScore: number;
  previousAlignmentScore: number;
  chatHistory: ChatMessage[];
  bookings: ServiceBooking[];
  purchases: Purchase[];
  lastCheckin: string | null;
  streakDays: number;
  totalCheckins: number;
  insights: string[];
}

// Default wellness scores
const defaultScores: WellnessScores = {
  mind: 60,
  body: 60,
  sleep: 60,
  energy: 60,
  mood: 60,
  stress: 60,
  focus: 60,
  hydration: 60,
  overall: 60,
};

// Calculate nervous system status from scores
export function calculateNervousSystemStatus(scores: WellnessScores): "regulated" | "elevated" | "dysregulated" {
  const avgScore = (scores.stress + scores.mood) / 2;
  if (avgScore < 40) return "dysregulated";
  if (avgScore < 60) return "elevated";
  return "regulated";
}

// Calculate burnout risk from scores
export function calculateBurnoutRisk(scores: WellnessScores): "low" | "moderate" | "high" {
  const avgScore = (scores.energy + scores.stress + scores.sleep) / 3;
  if (avgScore < 40) return "high";
  if (avgScore < 60) return "moderate";
  return "low";
}

// Calculate overall alignment score
export function calculateAlignmentScore(scores: WellnessScores): number {
  const weights = {
    mind: 0.15,
    body: 0.1,
    sleep: 0.15,
    energy: 0.15,
    mood: 0.2,
    stress: 0.15,
    focus: 0.05,
    hydration: 0.05,
  };
  
  let total = 0;
  for (const [key, weight] of Object.entries(weights)) {
    total += (scores[key as keyof WellnessScores] || 60) * weight;
  }
  return Math.round(total);
}

// Convert score to mood type
function scoreToMoodType(score: number): "great" | "happy" | "neutral" | "low" | "sad" {
  if (score >= 80) return "great";
  if (score >= 65) return "happy";
  if (score >= 50) return "neutral";
  if (score >= 35) return "low";
  return "sad";
}

// Extract insights from user data
function generateInsights(data: Partial<UserWellnessData>): string[] {
  const insights: string[] = [];
  const scores = data.scores || defaultScores;
  
  // Analyze trends
  if (data.previousScores) {
    const scoreDiff = scores.overall - data.previousScores.overall;
    if (scoreDiff > 5) {
      insights.push("Your overall wellness improved this week!");
    } else if (scoreDiff < -5) {
      insights.push("Your wellness score dropped - let's work on recovery.");
    }
  }
  
  // Analyze weak areas
  if (scores.sleep < 50) {
    insights.push("Sleep quality is low. Consider a bedtime routine.");
  }
  if (scores.stress < 50) {
    insights.push("High stress detected. Try a regulation exercise.");
  }
  if (scores.energy < 50) {
    insights.push("Energy is depleted. Focus on rest and recovery.");
  }
  
  // Analyze patterns from bookings
  if (data.bookings && data.bookings.length > 0) {
    const completedBookings = data.bookings.filter(b => b.status === "completed");
    if (completedBookings.length > 0) {
      const avgRating = completedBookings
        .filter(b => b.rating)
        .reduce((sum, b) => sum + (b.rating || 0), 0) / completedBookings.filter(b => b.rating).length;
      if (avgRating >= 4) {
        insights.push("Your service sessions are going well!");
      }
    }
  }
  
  // Analyze chat topics
  if (data.chatHistory && data.chatHistory.length > 0) {
    const negativeMessages = data.chatHistory.filter(m => m.sentiment === "negative");
    if (negativeMessages.length > data.chatHistory.length * 0.3) {
      insights.push("Your recent conversations show some struggles. We're here to help.");
    }
  }
  
  return insights;
}

// Main function to fetch all user wellness data
export async function fetchUserWellnessData(userId?: string): Promise<UserWellnessData> {
  const supabase = createAppClient();
  
  // Get current user if no userId provided
  let currentUserId = userId;
  if (!currentUserId) {
    const { data: { user } } = await supabase.auth.getUser();
    currentUserId = user?.id;
  }
  
  if (!currentUserId) {
    // Return default data for non-authenticated users
    return {
      scores: defaultScores,
      previousScores: null,
      moodHistory: [],
      nervousSystemStatus: "regulated",
      burnoutRisk: "low",
      alignmentScore: 60,
      previousAlignmentScore: 60,
      chatHistory: [],
      bookings: [],
      purchases: [],
      lastCheckin: null,
      streakDays: 0,
      totalCheckins: 0,
      insights: [],
    };
  }
  
  try {
    // Fetch profile with wellness scores
    const { data: profile } = await supabase
      .from("profiles")
      .select("wellness_scores, alignment_score, last_checkin")
      .eq("id", currentUserId)
      .single();
    
    const scores: WellnessScores = profile?.wellness_scores || defaultScores;
    
    // Fetch recent check-ins for mood history
    const { data: checkins } = await supabase
      .from("wellness_checkins")
      .select("*")
      .eq("user_id", currentUserId)
      .order("created_at", { ascending: false })
      .limit(30);
    
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const moodHistory: MoodEntry[] = (checkins || []).slice(0, 7).map((checkin: any) => {
      const date = new Date(checkin.created_at);
      const score = checkin.scores?.mood || checkin.scores?.overall || 60;
      return {
        date: date.toISOString().split('T')[0],
        dayName: days[date.getDay()],
        mood: scoreToMoodType(score),
        score,
        notes: checkin.answers?.notes,
      };
    }).reverse();
    
    // Calculate streak
    let streakDays = 0;
    if (checkins && checkins.length > 0) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      for (const checkin of checkins) {
        const checkinDate = new Date(checkin.created_at);
        checkinDate.setHours(0, 0, 0, 0);
        
        const daysDiff = Math.floor((today.getTime() - checkinDate.getTime()) / (1000 * 60 * 60 * 24));
        if (daysDiff === streakDays) {
          streakDays++;
        } else {
          break;
        }
      }
    }
    
    // Fetch previous week's scores
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const { data: lastWeekCheckin } = await supabase
      .from("wellness_checkins")
      .select("scores")
      .eq("user_id", currentUserId)
      .lte("created_at", oneWeekAgo.toISOString())
      .order("created_at", { ascending: false })
      .limit(1)
      .single();
    
    const previousScores: WellnessScores | null = lastWeekCheckin?.scores || null;
    
    // Fetch chat history
    const { data: chatMessages } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("user_id", currentUserId)
      .order("created_at", { ascending: false })
      .limit(50);
    
    const chatHistory: ChatMessage[] = (chatMessages || []).map((msg: any) => ({
      id: msg.id,
      role: msg.role,
      content: msg.content,
      timestamp: msg.created_at,
      sentiment: msg.sentiment,
      topics: msg.topics,
    }));
    
    // Fetch service bookings
    const { data: bookingsData } = await supabase
      .from("bookings")
      .select("*, services(name, category), providers(name)")
      .eq("user_id", currentUserId)
      .order("created_at", { ascending: false })
      .limit(20);
    
    const bookings: ServiceBooking[] = (bookingsData || []).map((booking: any) => ({
      id: booking.id,
      serviceId: booking.service_id,
      serviceName: booking.services?.name || "Unknown Service",
      category: booking.services?.category || "general",
      providerId: booking.provider_id,
      providerName: booking.providers?.name || "Unknown Provider",
      date: booking.scheduled_at || booking.created_at,
      status: booking.status,
      rating: booking.rating,
      feedback: booking.feedback,
    }));
    
    // Fetch purchases
    const { data: ordersData } = await supabase
      .from("orders")
      .select("*, order_items(*, products(name, category))")
      .eq("user_id", currentUserId)
      .order("created_at", { ascending: false })
      .limit(20);
    
    const purchases: Purchase[] = [];
    (ordersData || []).forEach((order: any) => {
      (order.order_items || []).forEach((item: any) => {
        purchases.push({
          id: item.id,
          productId: item.product_id,
          productName: item.products?.name || "Unknown Product",
          category: item.products?.category || "general",
          amount: item.price * item.quantity,
          date: order.created_at,
        });
      });
    });
    
    // Build complete data object
    const data: UserWellnessData = {
      scores,
      previousScores,
      moodHistory,
      nervousSystemStatus: calculateNervousSystemStatus(scores),
      burnoutRisk: calculateBurnoutRisk(scores),
      alignmentScore: calculateAlignmentScore(scores),
      previousAlignmentScore: previousScores ? calculateAlignmentScore(previousScores) : calculateAlignmentScore(scores),
      chatHistory,
      bookings,
      purchases,
      lastCheckin: profile?.last_checkin || (checkins?.[0]?.created_at || null),
      streakDays,
      totalCheckins: checkins?.length || 0,
      insights: [],
    };
    
    // Generate insights based on all data
    data.insights = generateInsights(data);
    
    return data;
  } catch (error) {
    console.error("Error fetching wellness data:", error);
    return {
      scores: defaultScores,
      previousScores: null,
      moodHistory: [],
      nervousSystemStatus: "regulated",
      burnoutRisk: "low",
      alignmentScore: 60,
      previousAlignmentScore: 60,
      chatHistory: [],
      bookings: [],
      purchases: [],
      lastCheckin: null,
      streakDays: 0,
      totalCheckins: 0,
      insights: [],
    };
  }
}

// Save chat message with sentiment analysis
export async function saveChatMessage(
  userId: string,
  role: "user" | "assistant",
  content: string,
  sentiment?: "positive" | "neutral" | "negative",
  topics?: string[]
) {
  const supabase = createAppClient();
  
  // Simple sentiment detection if not provided
  let detectedSentiment = sentiment;
  if (!detectedSentiment && role === "user") {
    const lowerContent = content.toLowerCase();
    const positiveWords = ["happy", "great", "good", "love", "better", "amazing", "wonderful", "excited"];
    const negativeWords = ["sad", "stressed", "anxious", "tired", "angry", "frustrated", "worried", "overwhelmed"];
    
    const hasPositive = positiveWords.some(word => lowerContent.includes(word));
    const hasNegative = negativeWords.some(word => lowerContent.includes(word));
    
    if (hasPositive && !hasNegative) detectedSentiment = "positive";
    else if (hasNegative && !hasPositive) detectedSentiment = "negative";
    else detectedSentiment = "neutral";
  }
  
  // Extract topics if not provided
  let detectedTopics = topics;
  if (!detectedTopics && role === "user") {
    detectedTopics = [];
    const topicKeywords: Record<string, string[]> = {
      stress: ["stress", "stressed", "anxious", "anxiety", "overwhelmed"],
      sleep: ["sleep", "tired", "insomnia", "rest", "fatigue"],
      work: ["work", "job", "boss", "career", "office"],
      relationships: ["relationship", "family", "friend", "partner", "spouse"],
      health: ["health", "sick", "pain", "exercise", "diet"],
      mood: ["mood", "feeling", "emotion", "happy", "sad"],
    };
    
    const lowerContent = content.toLowerCase();
    for (const [topic, keywords] of Object.entries(topicKeywords)) {
      if (keywords.some(kw => lowerContent.includes(kw))) {
        detectedTopics.push(topic);
      }
    }
  }
  
  try {
    await supabase.from("chat_messages").insert({
      user_id: userId,
      role,
      content,
      sentiment: detectedSentiment,
      topics: detectedTopics,
      created_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error saving chat message:", error);
  }
}

// Update wellness scores based on various inputs
export async function updateWellnessScores(
  userId: string,
  updates: Partial<WellnessScores>
) {
  const supabase = createAppClient();
  
  try {
    // Fetch current scores
    const { data: profile } = await supabase
      .from("profiles")
      .select("wellness_scores")
      .eq("id", userId)
      .single();
    
    const currentScores: WellnessScores = profile?.wellness_scores || defaultScores;
    
    // Merge updates
    const newScores: WellnessScores = {
      ...currentScores,
      ...updates,
    };
    
    // Recalculate overall
    newScores.overall = calculateAlignmentScore(newScores);
    
    // Update profile
    await supabase.from("profiles").update({
      wellness_scores: newScores,
      last_checkin: new Date().toISOString(),
    }).eq("id", userId);
    
    return newScores;
  } catch (error) {
    console.error("Error updating wellness scores:", error);
    return null;
  }
}

// Generate AI recommendations based on comprehensive user data
export interface AIRecommendation {
  id: string;
  title: string;
  description: string;
  category: string;
  scoreImpact: number;
  duration?: string;
  icon: "brain" | "moon" | "zap" | "heart" | "dumbbell" | "coffee";
  stressReduction?: number;
  priority: "high" | "medium" | "low";
  reason: string;
}

export function generateSmartRecommendations(data: UserWellnessData): AIRecommendation[] {
  const recommendations: AIRecommendation[] = [];
  const { scores, moodHistory, chatHistory, bookings, burnoutRisk, nervousSystemStatus } = data;
  
  // High priority: Address immediate concerns
  if (nervousSystemStatus === "dysregulated") {
    recommendations.push({
      id: "urgent-regulate",
      title: "Nervous System Reset",
      description: "Your system needs immediate regulation",
      category: "wellness",
      scoreImpact: 5,
      duration: "3 min",
      icon: "brain",
      stressReduction: 4,
      priority: "high",
      reason: "Dysregulated nervous system detected",
    });
  }
  
  if (burnoutRisk === "high") {
    recommendations.push({
      id: "burnout-prevention",
      title: "Burnout Prevention Session",
      description: "Talk to a coach about sustainable practices",
      category: "coaching",
      scoreImpact: 6,
      duration: "30 min",
      icon: "heart",
      priority: "high",
      reason: "High burnout risk detected from your scores",
    });
  }
  
  // Medium priority: Address weak areas
  if (scores.sleep < 55) {
    recommendations.push({
      id: "sleep-improvement",
      title: "Sleep Optimization",
      description: "Guided sleep meditation for better rest",
      category: "wellness",
      scoreImpact: 4,
      duration: "15 min",
      icon: "moon",
      stressReduction: 2,
      priority: "medium",
      reason: `Sleep score is ${scores.sleep}% - below optimal`,
    });
  }
  
  if (scores.stress < 55) {
    recommendations.push({
      id: "stress-relief",
      title: "Stress Relief Breathing",
      description: "Box breathing for immediate calm",
      category: "wellness",
      scoreImpact: 3,
      duration: "5 min",
      icon: "brain",
      stressReduction: 3,
      priority: "medium",
      reason: `Stress level at ${scores.stress}% - needs attention`,
    });
  }
  
  if (scores.energy < 55) {
    recommendations.push({
      id: "energy-boost",
      title: "Energy Activation",
      description: "Quick movement to boost vitality",
      category: "fitness",
      scoreImpact: 4,
      duration: "10 min",
      icon: "zap",
      priority: "medium",
      reason: `Energy at ${scores.energy}% - let's boost it`,
    });
  }
  
  // Analyze mood trends
  if (moodHistory.length >= 3) {
    const recentMoods = moodHistory.slice(-3);
    const avgScore = recentMoods.reduce((sum, m) => sum + m.score, 0) / recentMoods.length;
    if (avgScore < 50) {
      recommendations.push({
        id: "mood-support",
        title: "Mood Support Session",
        description: "Connect with a wellness expert",
        category: "therapy",
        scoreImpact: 5,
        duration: "45 min",
        icon: "heart",
        priority: "medium",
        reason: "Your mood has been low recently",
      });
    }
  }
  
  // Analyze chat topics
  if (chatHistory.length > 0) {
    const stressTopics = chatHistory.filter(m => m.topics?.includes("stress")).length;
    const sleepTopics = chatHistory.filter(m => m.topics?.includes("sleep")).length;
    
    if (stressTopics > chatHistory.length * 0.3 && !recommendations.find(r => r.id === "stress-relief")) {
      recommendations.push({
        id: "stress-coaching",
        title: "Stress Management Coaching",
        description: "Learn lasting stress management techniques",
        category: "coaching",
        scoreImpact: 5,
        duration: "30 min",
        icon: "brain",
        priority: "medium",
        reason: "Stress is a recurring topic in your conversations",
      });
    }
  }
  
  // Analyze booking history for what works
  const completedBookings = bookings.filter(b => b.status === "completed" && b.rating && b.rating >= 4);
  if (completedBookings.length > 0) {
    const topCategory = completedBookings.reduce((acc, b) => {
      acc[b.category] = (acc[b.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const favoriteCategory = Object.entries(topCategory).sort((a, b) => b[1] - a[1])[0];
    if (favoriteCategory) {
      recommendations.push({
        id: "favorite-service",
        title: `More ${favoriteCategory[0].charAt(0).toUpperCase() + favoriteCategory[0].slice(1)} Sessions`,
        description: "Based on your positive experiences",
        category: favoriteCategory[0],
        scoreImpact: 3,
        icon: "heart",
        priority: "low",
        reason: `You've rated ${favoriteCategory[0]} services highly`,
      });
    }
  }
  
  // Default maintenance recommendations
  if (recommendations.length < 3) {
    if (!recommendations.find(r => r.category === "fitness")) {
      recommendations.push({
        id: "daily-movement",
        title: "Daily Movement Practice",
        description: "Stay active for sustained energy",
        category: "fitness",
        scoreImpact: 2,
        duration: "20 min",
        icon: "dumbbell",
        priority: "low",
        reason: "Regular movement maintains wellness",
      });
    }
    
    recommendations.push({
      id: "hydration",
      title: "Hydration Check",
      description: "Stay hydrated throughout the day",
      category: "wellness",
      scoreImpact: 1,
      icon: "coffee",
      priority: "low",
      reason: "Hydration impacts all wellness dimensions",
    });
  }
  
  // Sort by priority
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  return recommendations.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
}
