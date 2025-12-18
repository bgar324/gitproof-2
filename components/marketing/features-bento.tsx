import { FEATURES } from "@/lib/data";
import { ArchetypeWheel } from "./archetype-wheel";

export function FeaturesBento() {
  return (
    <section className="py-24 px-6 bg-secondary/30 border-y border-border">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h2 className="font-serif text-4xl md:text-5xl font-bold">
            More Than Just a Commit Graph
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We dig deeper than green squares. Our engine analyzes quality,
            complexity, and impact.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(250px,auto)]">
          {FEATURES.map((feature, index) => {
            const isArchetypes = feature.id === "archetypes";

            return (
              <div
                key={feature.id}
                className={`bg-card border border-border rounded-3xl relative overflow-hidden group ${feature.borderHover} transition-colors ${feature.span || ""} ${feature.rowSpan || ""} ${
                  isArchetypes ? "flex flex-col" : "p-8"
                }`}
              >
                {/* Glow Effect */}
                <div
                  className={`absolute ${
                    index === 0 ? "top-0 right-0" : "bottom-0 right-0"
                  } w-64 h-64 ${feature.glowColor} rounded-full blur-3xl ${
                    index === 0
                      ? "-translate-y-1/2 translate-x-1/2"
                      : "translate-y-1/2 translate-x-1/2"
                  }`}
                />

                {isArchetypes ? (
                  <>
                    {/* Header Content for Archetypes */}
                    <div className="relative z-10 p-8 pb-0">
                      <div
                        className={`w-12 h-12 ${feature.iconBg} rounded-xl flex items-center justify-center ${feature.iconColor} mb-6`}
                      >
                        <feature.icon size={24} />
                      </div>
                      <h3 className="text-2xl font-bold mb-4">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        {feature.description}
                      </p>
                    </div>

                    {/* THE INTERACTIVE WHEEL */}
                    <div className="flex-1 min-h-[400px] mt-4 relative">
                      <ArchetypeWheel />
                    </div>
                  </>
                ) : (
                  <div className="relative z-10 space-y-4">
                    <div
                      className={`w-12 h-12 ${feature.iconBg} rounded-xl flex items-center justify-center ${feature.iconColor} ${
                        index === 0 ? "mb-6" : "mb-0"
                      }`}
                    >
                      <feature.icon size={24} />
                    </div>
                    <h3
                      className={`${
                        index === 0 ? "text-2xl" : "text-xl"
                      } font-bold ${index === 0 ? "" : "mb-2"}`}
                    >
                      {feature.title}
                    </h3>
                    <p
                      className={`text-muted-foreground ${
                        index === 0
                          ? "leading-relaxed max-w-md"
                          : "text-sm"
                      }`}
                    >
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
