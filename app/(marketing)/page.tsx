"use client";

import { useSession } from "next-auth/react";
import { Hero } from "@/components/marketing/hero";
import { FeaturesBento } from "@/components/marketing/features-bento";
import { StepsSection } from "@/components/marketing/steps-section";
import { FinalCTA } from "@/components/marketing/final-cta";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function LandingPage() {
  const { data: session } = useSession();

  return (
    <main className="min-h-screen bg-background">
      <Navbar session={session} variant="marketing" />
      <Hero session={session} />
      <FeaturesBento />
      <StepsSection />
      <FinalCTA session={session} />
      <Footer />
    </main>
  );
}
