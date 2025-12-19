"use client";

import { useSession } from "next-auth/react";
import { Navbar } from "@/components/layout";
import { Footer } from "@/components/layout";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar session={session} variant="public" />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
