"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Loader2, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  type: "user" | "bot";
  content: string;
  timestamp: Date;
  quickReplies?: string[];
}

const initialMessages: Message[] = [
  {
    id: "1",
    type: "bot",
    content: "Hi! 👋 I'm your Bold & Beyond assistant. How can I help you today?",
    timestamp: new Date(),
    quickReplies: [
      "Book a session",
      "Find a therapist",
      "Pricing info",
      "Talk to support",
    ],
  },
];

const botResponses: Record<string, { content: string; quickReplies?: string[] }> = {
  "book a session": {
    content: "I'd be happy to help you book a session! You can browse our services and find the perfect expert for your needs.",
    quickReplies: ["View Services", "Find an Expert", "Back to Menu"],
  },
  "find a therapist": {
    content: "We have amazing therapists specializing in various areas. What type of support are you looking for?",
    quickReplies: ["Anxiety & Stress", "Depression", "Relationships", "Life Coaching", "View All"],
  },
  "pricing info": {
    content: "Our sessions start from 400 AED. We offer various packages and payment plans. Would you like more details?",
    quickReplies: ["View Packages", "Book Consultation", "Back to Menu"],
  },
  "talk to support": {
    content: "I'll connect you with our support team. You can also reach us at support@boldandbeyond.ae or call +971 4 XXX XXXX.",
    quickReplies: ["Email Support", "Call Now", "Back to Menu"],
  },
  default: {
    content: "I'm here to help! You can ask me about booking sessions, finding therapists, pricing, or any other questions.",
    quickReplies: ["Book a session", "Find a therapist", "Pricing info", "Talk to support"],
  },
};

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: messageText,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Simulate bot typing
    setIsTyping(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Get bot response
    const lowerText = messageText.toLowerCase();
    const response = botResponses[lowerText] || botResponses.default;

    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: "bot",
      content: response.content,
      timestamp: new Date(),
      quickReplies: response.quickReplies,
    };

    setIsTyping(false);
    setMessages((prev) => [...prev, botMessage]);
  };

  const handleQuickReply = (reply: string) => {
    handleSend(reply);
  };

  return (
    <>
      {/* Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-24 right-4 z-50 h-14 w-14 rounded-full bg-brand-gold text-white shadow-lg flex items-center justify-center hover:bg-brand-gold/90 transition-colors"
          >
            <MessageCircle className="h-6 w-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-4 z-50 w-[360px] h-[500px] bg-background rounded-2xl shadow-2xl border flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-brand-navy text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-brand-gold flex items-center justify-center">
                  <Bot className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold">Bold & Beyond</p>
                  <p className="text-xs text-white/70">Always here to help</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/70 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex gap-2",
                    message.type === "user" ? "flex-row-reverse" : ""
                  )}
                >
                  <div
                    className={cn(
                      "h-8 w-8 rounded-full flex items-center justify-center shrink-0",
                      message.type === "user"
                        ? "bg-brand-gold text-white"
                        : "bg-muted"
                    )}
                  >
                    {message.type === "user" ? (
                      <User className="h-4 w-4" />
                    ) : (
                      <Bot className="h-4 w-4" />
                    )}
                  </div>
                  <div
                    className={cn(
                      "max-w-[70%] rounded-2xl px-4 py-2 text-sm",
                      message.type === "user"
                        ? "bg-brand-gold text-white rounded-tr-sm"
                        : "bg-muted rounded-tl-sm"
                    )}
                  >
                    {message.content}
                  </div>
                </div>
              ))}

              {/* Quick Replies */}
              {messages.length > 0 &&
                messages[messages.length - 1].quickReplies && (
                  <div className="flex flex-wrap gap-2 pl-10">
                    {messages[messages.length - 1].quickReplies?.map((reply) => (
                      <button
                        key={reply}
                        onClick={() => handleQuickReply(reply)}
                        className="text-xs bg-muted hover:bg-brand-gold/10 hover:text-brand-gold rounded-full px-3 py-1.5 transition-colors"
                      >
                        {reply}
                      </button>
                    ))}
                  </div>
                )}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex gap-2">
                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-2">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" />
                      <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce delay-100" />
                      <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce delay-200" />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex gap-2"
              >
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1"
                />
                <Button
                  type="submit"
                  variant="gold"
                  size="icon"
                  disabled={!input.trim() || isTyping}
                >
                  {isTyping ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
