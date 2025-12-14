"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  RefreshCw, Trash2, ExternalLink, Save, LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";

// --- REUSABLE COMPONENTS ---

const Section = ({ title, description, children }: any) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8 border-b border-border/50 last:border-0">
    <div className="md:col-span-1 space-y-1">
      <h3 className="font-serif text-lg font-medium text-foreground">{title}</h3>
      <p className="text-xs text-muted-foreground leading-relaxed max-w-xs">{description}</p>
    </div>
    <div className="md:col-span-2">
      <div className="bg-card border border-border rounded-xl p-6 space-y-6">
        {children}
      </div>
    </div>
  </div>
);

const Switch = ({ checked, onCheckedChange, label }: any) => (
  <div className="flex items-center justify-between">
    <span className="text-sm font-medium text-foreground">{label}</span>
    <button
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "w-12 h-6 rounded-full p-1 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary/20",
        checked ? "bg-primary" : "bg-secondary"
      )}
    >
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 700, damping: 30 }}
        className={cn(
          "w-4 h-4 rounded-full shadow-md",
          checked ? "bg-primary-foreground" : "bg-muted-foreground/50"
        )}
        style={{ x: checked ? 24 : 0 }}
      />
    </button>
  </div>
);

// --- MAIN VIEW ---

export default function SettingsView({ user, settings }: any) {
  if (!user) return null; // Safety check

  const initialPublic = settings?.isPublic ?? false;
  const initialNotifs = settings?.emailNotifications ?? false;

  const [isPublic, setIsPublic] = useState(initialPublic);
  const [emailNotifs, setEmailNotifs] = useState(initialNotifs);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1000);
  };

  return (
    <main className="pt-8 pb-20 px-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-10">
        <div>
           <h1 className="text-3xl font-serif text-foreground">Settings</h1>
           <p className="text-muted-foreground mt-1 text-sm">Manage your profile and preferences.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="h-10 px-6 rounded-lg bg-foreground text-background hover:opacity-90 transition-opacity text-sm font-medium flex items-center gap-2 shadow-lg"
        >
          {isSaving ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <div className="space-y-2">
        <Section title="Visibility" description="Control who can see your GitProof report card.">
          <div className="space-y-4">
            <Switch label="Public Profile" checked={isPublic} onCheckedChange={setIsPublic} />
            {isPublic && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="p-3 bg-secondary/30 rounded-lg border border-border flex items-center justify-between text-xs">
                <span className="text-muted-foreground truncate">gitproof.com/{user.name || "username"}</span>
                <a href="#" className="flex items-center gap-1 text-primary hover:underline">Visit <ExternalLink size={10} /></a>
              </motion.div>
            )}
          </div>
        </Section>

        <Section title="Account" description="Your personal information linked from GitHub.">
          <div className="flex items-center gap-4 pb-4 border-b border-border/40 mb-4">
             <div className="w-12 h-12 rounded-full overflow-hidden border border-border bg-secondary">
               {user.image ? (
                 <img src={user.image} alt="Avatar" className="w-full h-full object-cover" />
               ) : (
                 <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">?</div>
               )}
             </div>
             <div>
               <div className="text-sm font-medium text-foreground">{user.name}</div>
               <div className="text-xs text-muted-foreground">{user.email}</div>
             </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 h-9 rounded border border-border text-xs font-medium hover:bg-secondary transition-colors">
              <RefreshCw size={14} /> Re-sync GitHub Data
            </button>
            <button onClick={() => signOut({ callbackUrl: "/" })} className="flex items-center justify-center gap-2 h-9 rounded border border-border text-xs font-medium hover:bg-secondary transition-colors">
              <LogOut size={14} /> Sign Out All Devices
            </button>
          </div>
        </Section>

        <Section title="Notifications" description="We promise not to spam.">
          <Switch label="Product Updates" checked={emailNotifs} onCheckedChange={setEmailNotifs} />
        </Section>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8">
           <div className="md:col-span-1 space-y-1">
             <h3 className="font-serif text-lg font-medium text-red-500">Danger Zone</h3>
             <p className="text-xs text-muted-foreground leading-relaxed">Irreversible actions.</p>
           </div>
           <div className="md:col-span-2">
             <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
               <div>
                 <h4 className="text-sm font-medium text-red-500">Delete Account</h4>
                 <p className="text-xs text-red-500/60 mt-1">Permanently remove all data and revokes GitHub access.</p>
               </div>
               <button className="px-4 py-2 bg-red-500 text-white text-xs font-bold rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2">
                 <Trash2 size={14} /> Delete
               </button>
             </div>
           </div>
        </div>
      </div>
    </main>
  );
}