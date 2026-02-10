"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Send,
  Mic,
  Sparkles,
  Bot,
  User,
  Heart,
  Brain,
  Moon,
  Zap,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { createAppClient } from "@/lib/supabase";
import { saveChatMessage, updateWellnessScores } from "@/lib/human-os/wellness-data";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  emotionScore?: number;
  suggestions?: string[];
}

// Wellness-focused conversation starters
const conversationStarters = [
  "I've been feeling stressed lately",
  "Help me improve my sleep",
  "I need motivation today",
  "I'm feeling anxious",
  "How can I be more mindful?",
];

// Simple sentiment analysis (local, no API needed)
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

  const words = text.toLowerCase().split(/\s+/);
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
}

// AI response generator (rule-based for free, can be replaced with API)
function generateWellnessResponse(userMessage: string, emotionAnalysis: { score: number; emotion: string }): {
  response: string;
  suggestions: string[];
} {
  const lowerMessage = userMessage.toLowerCase();
  
  // Stress-related
  if (lowerMessage.includes("stress") || lowerMessage.includes("overwhelm")) {
    return {
      response: "I hear you - stress can feel overwhelming. Let's take a moment together. Try this: Take 3 deep breaths, inhaling for 4 counts, holding for 4, and exhaling for 6. How does that feel?\n\nRemember, it's okay to take things one step at a time. What's the one thing causing you the most stress right now?",
      suggestions: ["Book a meditation session", "Try breathing exercises", "Talk to a therapist"],
    };
  }

  // Sleep-related
  if (lowerMessage.includes("sleep") || lowerMessage.includes("tired") || lowerMessage.includes("insomnia")) {
    return {
      response: "Sleep is so important for your wellbeing. Here are some tips that might help:\n\n• Try to keep a consistent sleep schedule\n• Avoid screens 1 hour before bed\n• Create a relaxing bedtime routine\n• Keep your room cool and dark\n\nWould you like me to recommend some sleep-focused services?",
      suggestions: ["Sleep consultation", "Evening yoga", "Relaxation therapy"],
    };
  }

  // Anxiety-related
  if (lowerMessage.includes("anxious") || lowerMessage.includes("anxiety") || lowerMessage.includes("worried") || lowerMessage.includes("nervous")) {
    return {
      response: "Anxiety can be really challenging. You're not alone in feeling this way. 💙\n\nOne technique that helps: Ground yourself by naming 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, and 1 you can taste.\n\nWould you like to explore what's triggering these feelings?",
      suggestions: ["Anxiety management session", "Mindfulness coaching", "Breathing workshop"],
    };
  }

  // Motivation-related
  if (lowerMessage.includes("motiv") || lowerMessage.includes("energy") || lowerMessage.includes("lazy")) {
    return {
      response: "It's completely normal to have days where motivation feels low. Here's a gentle approach:\n\n1. Start with just one tiny task\n2. Celebrate small wins\n3. Move your body, even just for 5 minutes\n4. Connect with someone you care about\n\nWhat's one small thing you could do right now?",
      suggestions: ["Life coaching session", "Energy healing", "Fitness consultation"],
    };
  }

  // Mindfulness-related
  if (lowerMessage.includes("mindful") || lowerMessage.includes("meditat") || lowerMessage.includes("present")) {
    return {
      response: "Mindfulness is a beautiful practice! 🧘\n\nHere's a quick exercise: Close your eyes for 30 seconds. Focus only on your breath. When thoughts come, gently acknowledge them and return to your breath.\n\nEven just a few minutes daily can make a big difference. Would you like to try a guided meditation?",
      suggestions: ["Guided meditation", "Mindfulness course", "Yoga session"],
    };
  }

  // Sad/Depression-related
  if (lowerMessage.includes("sad") || lowerMessage.includes("depress") || lowerMessage.includes("down") || lowerMessage.includes("lonely")) {
    return {
      response: "I'm sorry you're feeling this way. Your feelings are valid, and it's okay to not be okay sometimes. 💜\n\nSome things that might help:\n• Reach out to someone you trust\n• Get some sunlight if possible\n• Be gentle with yourself today\n\nWould you like to talk more about what's going on?",
      suggestions: ["Talk to a therapist", "Support group session", "Wellness consultation"],
    };
  }

  // Positive/Good feelings
  if (emotionAnalysis.emotion === "positive") {
    return {
      response: "That's wonderful to hear! 🌟 It sounds like you're in a good place. \n\nTo maintain this positive energy:\n• Take note of what's working well\n• Share your positivity with others\n• Keep up the healthy habits\n\nIs there anything specific you'd like to work on or explore?",
      suggestions: ["Explore new services", "Set wellness goals", "Try something new"],
    };
  }

  // Default response
  return {
    response: "Thank you for sharing with me. I'm here to support your wellness journey. 🌱\n\nIs there something specific you'd like to focus on today? I can help with:\n• Stress management\n• Sleep improvement\n• Mindfulness practices\n• Emotional support",
    suggestions: ["Daily check-in", "Explore services", "Set wellness goals"],
  };
}

export default function WellnessChatPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hi! I'm your wellness companion. 🌟\n\nI'm here to support your mental and emotional wellbeing. You can share how you're feeling, ask for wellness tips, or just chat.\n\nHow are you feeling today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [sessionEmotionScores, setSessionEmotionScores] = useState<number[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput("");

    // Analyze emotion
    const emotionAnalysis = analyzeEmotion(userMessage);
    setSessionEmotionScores([...sessionEmotionScores, emotionAnalysis.score]);

    // Add user message
    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: userMessage,
      timestamp: new Date(),
      emotionScore: emotionAnalysis.score,
    };
    setMessages(prev => [...prev, userMsg]);

    // Show typing indicator
    setIsTyping(true);

    // Simulate AI thinking time
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

    // Generate response
    const { response, suggestions } = generateWellnessResponse(userMessage, emotionAnalysis);

    const assistantMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: response,
      timestamp: new Date(),
      suggestions,
    };

    setMessages(prev => [...prev, assistantMsg]);
    setIsTyping(false);

    // Save to database using wellness-data utility
    try {
      const supabase = createAppClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        // Save user message with sentiment analysis
        await saveChatMessage(
          user.id,
          "user",
          userMessage,
          emotionAnalysis.emotion as "positive" | "neutral" | "negative"
        );
        
        // Save assistant response
        await saveChatMessage(user.id, "assistant", response);

        // Also save to wellness_chat_logs for backwards compatibility
        await supabase.from("wellness_chat_logs").insert({
          user_id: user.id,
          message: userMessage,
          emotion_score: emotionAnalysis.score,
          emotion: emotionAnalysis.emotion,
          created_at: new Date().toISOString(),
        });

        // Update user's mood score based on conversation
        const avgScore = Math.round(
          sessionEmotionScores.reduce((a, b) => a + b, emotionAnalysis.score) / 
          (sessionEmotionScores.length + 1)
        );

        // Update wellness scores with mood from chat
        await updateWellnessScores(user.id, { mood: avgScore });
      }
    } catch (error) {
      console.error("Error saving chat:", error);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    inputRef.current?.focus();
  };

  const averageEmotionScore = sessionEmotionScores.length > 0
    ? Math.round(sessionEmotionScores.reduce((a, b) => a + b, 0) / sessionEmotionScores.length)
    : null;

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-100 px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center"
          >
            <ArrowLeft className="h-5 w-5 text-gray-700" />
          </button>
          <div className="flex-1 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#0D9488] to-[#7DD3D3] flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="font-semibold text-gray-900">Wellness Coach</h1>
              <p className="text-xs text-green-500 flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                Online
              </p>
            </div>
          </div>
          {averageEmotionScore !== null && (
            <div className="text-right">
              <p className="text-xs text-gray-400">Mood</p>
              <p className={`font-bold ${
                averageEmotionScore >= 60 ? "text-green-500" : 
                averageEmotionScore >= 40 ? "text-yellow-500" : "text-red-500"
              }`}>
                {averageEmotionScore}%
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="max-w-2xl mx-auto space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`max-w-[85%] ${message.role === "user" ? "order-2" : ""}`}>
                {/* Avatar */}
                <div className={`flex items-end gap-2 ${message.role === "user" ? "flex-row-reverse" : ""}`}>
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.role === "user" 
                      ? "bg-[#0D9488]" 
                      : "bg-gradient-to-br from-[#0D9488] to-[#7DD3D3]"
                  }`}>
                    {message.role === "user" ? (
                      <User className="h-4 w-4 text-white" />
                    ) : (
                      <Bot className="h-4 w-4 text-white" />
                    )}
                  </div>
                  
                  {/* Message Bubble */}
                  <div className={`rounded-2xl px-4 py-3 ${
                    message.role === "user"
                      ? "bg-[#0D9488] text-white rounded-br-md"
                      : "bg-white shadow-sm border border-gray-100 rounded-bl-md"
                  }`}>
                    <p className={`text-sm whitespace-pre-line ${
                      message.role === "user" ? "text-white" : "text-gray-700"
                    }`}>
                      {message.content}
                    </p>
                    
                    {/* Emotion indicator for user messages */}
                    {message.role === "user" && message.emotionScore !== undefined && (
                      <div className="mt-2 pt-2 border-t border-white/20 flex items-center gap-2">
                        <span className="text-xs text-white/70">Mood detected:</span>
                        <span className={`text-xs font-medium ${
                          message.emotionScore >= 60 ? "text-green-200" :
                          message.emotionScore >= 40 ? "text-yellow-200" : "text-red-200"
                        }`}>
                          {message.emotionScore >= 60 ? "😊 Positive" :
                           message.emotionScore >= 40 ? "😐 Neutral" : "😔 Low"}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Suggestions */}
                {message.suggestions && message.suggestions.length > 0 && (
                  <div className="mt-2 ml-10 flex flex-wrap gap-2">
                    {message.suggestions.map((suggestion, idx) => (
                      <Link
                        key={idx}
                        href="/appx/services"
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#0D9488]/10 text-[#0D9488] text-xs font-medium rounded-full hover:bg-[#0D9488]/20 transition-colors"
                      >
                        <Heart className="h-3 w-3" />
                        {suggestion}
                      </Link>
                    ))}
                  </div>
                )}

                {/* Timestamp */}
                <p className={`text-xs text-gray-400 mt-1 ${
                  message.role === "user" ? "text-right mr-10" : "ml-10"
                }`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex items-end gap-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#0D9488] to-[#7DD3D3] flex items-center justify-center">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div className="bg-white shadow-sm border border-gray-100 rounded-2xl rounded-bl-md px-4 py-3">
                <div className="flex gap-1">
                  <span className="h-2 w-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="h-2 w-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="h-2 w-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Quick Starters (show if no user messages yet) */}
      {messages.length === 1 && (
        <div className="px-4 pb-4">
          <p className="text-xs text-gray-500 text-center mb-3">Quick starters</p>
          <div className="flex flex-wrap justify-center gap-2">
            {conversationStarters.map((starter, idx) => (
              <button
                key={idx}
                onClick={() => handleSuggestionClick(starter)}
                className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                {starter}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="sticky bottom-0 bg-white border-t border-gray-100 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
              placeholder="Share how you're feeling..."
              className="w-full px-4 py-3 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#0D9488] pr-12"
            />
          </div>
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="h-12 w-12 rounded-full bg-[#0D9488] flex items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#0B7B71] transition-colors"
          >
            {isTyping ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
