import { STEPS } from "@/lib/data";

export function StepsSection() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl font-bold">
            From GitHub to Hired in 3 Steps
          </h2>
        </div>

        <div className="relative">
          {/* Connector Line */}
          <div className="absolute left-[27px] top-8 bottom-8 w-0.5 bg-border md:hidden" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {STEPS.map((step, i) => (
              <div
                key={i}
                className="flex md:flex-col items-center md:text-center gap-6 relative"
              >
                <div className="w-14 h-14 rounded-full bg-background border-2 border-primary flex items-center justify-center shrink-0 z-10 shadow-lg shadow-primary/10">
                  <step.icon size={24} className="text-primary" />
                </div>
                <div className="pt-2 md:pt-0">
                  <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
