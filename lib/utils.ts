import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number, currency: string = "AED"): string {
  return new Intl.NumberFormat("en-AE", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-AE", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export function formatTime(date: Date | string): string {
  return new Intl.DateTimeFormat("en-AE", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(date));
}

export function formatDateTime(date: Date | string): string {
  return `${formatDate(date)} at ${formatTime(date)}`;
}

export function getWellnessCategory(score: number): {
  label: string;
  color: string;
  advice: string;
} {
  if (score >= 80)
    return {
      label: "Excellent",
      color: "wellness-excellent",
      advice: "Keep up the great work! Your wellness habits are on point.",
    };
  if (score >= 60)
    return {
      label: "Good",
      color: "wellness-good",
      advice: "You're doing well! A few tweaks could boost your wellbeing.",
    };
  if (score >= 40)
    return {
      label: "Moderate",
      color: "wellness-moderate",
      advice: "Consider scheduling a consultation for personalized guidance.",
    };
  if (score >= 20)
    return {
      label: "Low",
      color: "wellness-low",
      advice: "Let's work on improving your wellness together.",
    };
  return {
    label: "Critical",
    color: "wellness-critical",
    advice: "We recommend speaking with a professional soon.",
  };
}

export function generateBookingCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, "")
    .replace(/ +/g, "-");
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}
