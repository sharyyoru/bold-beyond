import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: {
    default: "Bold & Beyond | Wellness Platform",
    template: "%s | Bold & Beyond",
  },
  description:
    "Your comprehensive wellness journey starts here. Connect with expert therapists, book sessions, and unlock exclusive partner perks.",
  keywords: [
    "wellness",
    "therapy",
    "mental health",
    "coaching",
    "psychotherapy",
    "wellness app",
    "Dubai wellness",
  ],
  authors: [{ name: "Bold & Beyond" }],
  icons: {
    icon: [
      { url: "/images/favicon.ico" },
      { url: "/images/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/images/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/images/apple-touch-icon.png" },
    ],
    other: [
      { rel: "android-chrome-192x192", url: "/images/android-chrome-192x192.png" },
      { rel: "android-chrome-512x512", url: "/images/android-chrome-512x512.png" },
    ],
  },
  openGraph: {
    type: "website",
    locale: "en_AE",
    siteName: "Bold & Beyond",
  },
};

export const viewport: Viewport = {
  themeColor: "#1B365D",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${playfair.variable} font-sans antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
