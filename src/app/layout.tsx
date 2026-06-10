import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import AmbientBackground from "@/components/layout/AmbientBackground";
import ScrollIndicator from "@/components/layout/ScrollIndicator";
import TopNavBar from "@/components/layout/TopNavBar";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk" });

export const metadata: Metadata = {
  title: "Sakshi Srivastava | AI/ML Engineer",
  description: "Portfolio of Sakshi Srivastava - Building intelligent systems that transform data into meaningful solutions.",
  keywords: ["Sakshi Srivastava", "AI Engineer", "Machine Learning", "Portfolio", "Software Engineer", "Next.js"],
  openGraph: {
    title: "Sakshi Srivastava | AI/ML Engineer",
    description: "Building intelligent systems that transform data into meaningful solutions. Explore my engineering impact log.",
    url: "https://sakshisrivastava.dev",
    siteName: "Sakshi Srivastava Portfolio",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sakshi Srivastava | AI/ML Engineer",
    description: "Building intelligent systems that transform data into meaningful solutions.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${spaceGrotesk.variable} bg-luxury-black text-foreground antialiased selection:bg-accent-glow selection:text-accent-pink overflow-x-hidden w-full max-w-[100vw]`}>
        <AmbientBackground />
        <ScrollIndicator />
        <TopNavBar />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
