import { Metadata } from "next";
import { 
  BrandedHero,
  StateOfHuman,
  DecisionEngine,
  NetworkEffects,
  PersonalDataMoat,
  DubaiVision2030,
  OrganizationalHealthMap
} from "@/components/human-os";

export const metadata: Metadata = {
  title: "Human OS | Bold & Beyond",
  description: "The intelligent routing layer for wellness. AI-powered, vendor-neutral, and designed to get smarter with every user.",
};

export default function HumanOSPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <BrandedHero variant="platform" showVideo />

      {/* State of the Human - The Problem */}
      <StateOfHuman variant="hero" />

      {/* Decision Engine - The Solution */}
      <DecisionEngine variant="hero" />

      {/* Network Effects - The Advantage */}
      <NetworkEffects variant="full" showPrivacy />

      {/* Personal Data Moat - The Lock-in */}
      <PersonalDataMoat variant="dashboard" />

      {/* Dubai Vision 2030 - Regional Alignment */}
      <DubaiVision2030 variant="full" showPartnership />

      {/* Corporate Health Maps - Enterprise Value */}
      <OrganizationalHealthMap variant="feature" />
    </div>
  );
}
