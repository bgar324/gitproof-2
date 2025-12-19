import { FEATURES } from "@/lib/data";
import { cn } from "@/lib/utils";
import { ArchetypeWheel } from "./archetype-wheel";

export function FeaturesBento() {
  return (
    <section className="py-24 px-6 bg-secondary/20 border-y border-border">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground">
            A Structured View of Real Work
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            GitProof analyzes repository data to surface meaningful signals
            about impact, maintenance, and engineering depth.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(250px,auto)]">
          {FEATURES.map((feature, index) => {
            const isArchetypes = feature.id === "archetypes";

            return (
              <div
                key={feature.id}
                className={cn(
                  "bg-card border border-border rounded-3xl relative overflow-hidden group transition-colors",
                  feature.borderHover,
                  feature.span,
                  feature.rowSpan,
                  isArchetypes ? "flex flex-col" : "p-8"
                )}
              >
                {/* Subtle Glow */}
                <div
                  className={cn(
                    "absolute w-64 h-64 rounded-full blur-3xl opacity-70",
                    feature.glowColor,
                    index === 0
                      ? "top-0 right-0 -translate-y-1/2 translate-x-1/2"
                      : "bottom-0 right-0 translate-y-1/2 translate-x-1/2"
                  )}
                />

                {isArchetypes ? (
                  <>
                    <div className="relative z-10 p-8 pb-0">
                      <div
                        className={cn(
                          "w-12 h-12 rounded-xl flex items-center justify-center mb-6",
                          feature.iconBg,
                          feature.iconColor
                        )}
                      >
                        <feature.icon size={24} />
                      </div>

                      <h3 className="text-2xl font-bold mb-4">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground max-w-md">
                        {feature.description}
                      </p>
                    </div>

                    <div className="flex-1 min-h-[400px] mt-6 relative">
                      <ArchetypeWheel />
                    </div>
                  </>
                ) : (
                  <div className="relative z-10 space-y-4">
                    <div
                      className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center",
                        feature.iconBg,
                        feature.iconColor
                      )}
                    >
                      <feature.icon size={24} />
                    </div>

                    <h3 className="text-xl font-bold text-foreground">
                      {feature.title}
                    </h3>

                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
