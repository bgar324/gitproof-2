import Link from "next/link";
import { GitGraph } from "lucide-react";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Minimal Public Header */}
      <header className="border-b border-border/40 bg-background/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
              <GitGraph size={18} />
            </div>
            <span className="font-serif font-bold text-lg tracking-tight">GitProof</span>
          </Link>
          
          <Link 
            href="/"
            className="text-xs font-medium bg-foreground text-background px-4 py-2 rounded-full hover:opacity-90 transition-opacity"
          >
            Create Your Profile
          </Link>
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>

      <footer className="py-8 text-center text-xs text-muted-foreground border-t border-border/40">
        <p>© {new Date().getFullYear()} GitProof. Verified Developer Data.</p>
      </footer>
    </div>
  );
}