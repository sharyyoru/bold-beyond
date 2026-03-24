"use client";

import { MegaHeader } from "@/components/layout/mega-header";
import { Footer } from "@/components/layout/footer";
import { Chatbot } from "@/components/chatbot/chatbot";
import { LoadingProvider } from "@/components/providers/LoadingProvider";

export default function ExploreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LoadingProvider>
      <div className="flex min-h-screen flex-col">
        <MegaHeader />
        <main className="flex-1">{children}</main>
        <Footer />
        <Chatbot />
      </div>
    </LoadingProvider>
  );
}
