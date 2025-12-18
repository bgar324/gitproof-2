"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { ARCHETYPES } from "@/lib/data";

export function ArchetypeWheel() {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative h-[400px] w-full group/wheel">
      {/* Gradient Masks for "Wheel" fade effect */}
      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-card to-transparent z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-card to-transparent z-10 pointer-events-none" />

      {/* Scrollable Container with CSS Snapping */}
      <div
        ref={scrollRef}
        className="h-full overflow-y-auto snap-y snap-mandatory scrollbar-hide pb-24 pt-24 px-4 space-y-4"
      >
        {ARCHETYPES.map((type, i) => (
          <div key={i} className="snap-center shrink-0">
            <motion.div
              whileHover={{ scale: 1.02, x: 4 }}
              className={`
                flex items-center gap-4 p-4 rounded-2xl bg-secondary/30 border border-white/5 backdrop-blur-sm transition-all group
                hover:bg-secondary/80 ${type.border}
              `}
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors ${type.bg} group-hover:bg-opacity-100`}
              >
                <type.icon
                  size={24}
                  className={`${type.color} transition-colors`}
                />
              </div>
              <div>
                <h4 className="text-lg font-bold text-foreground">
                  {type.label}
                </h4>
              </div>
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
}
