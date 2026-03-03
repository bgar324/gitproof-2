"use client";

import { useSession } from "next-auth/react";
import { Hero } from "@/components/marketing/hero";
import { FeaturesBento } from "@/components/marketing/features-bento";
import { ArchetypeCarousel } from "@/components/marketing/archetype-carousel";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function LandingPage() {
  const { data: session } = useSession();

  return (
    <main className="min-h-screen bg-background">
      <Navbar session={session} variant="marketing" />
      <Hero session={session} />
      <FeaturesBento />
      <ArchetypeCarousel session={session} />
      <Footer />
    </main>
  );
}
