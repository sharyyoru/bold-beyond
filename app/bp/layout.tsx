import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Business Plan | Smart Wellness Wearables",
  description:
    "Bold & Beyond Business Plan 2025-2029: Smart bands and wearables for the UAE market. Comprehensive development timeline, competitor analysis, and government initiative alignment.",
  keywords: [
    "smart band",
    "wearables",
    "UAE healthtech",
    "wellness technology",
    "business plan",
    "Bold and Beyond",
  ],
};

export default function BusinessPlanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
