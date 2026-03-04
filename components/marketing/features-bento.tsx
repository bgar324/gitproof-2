import { FEATURES } from "@/lib/data";

export function FeaturesBento() {
  return (
    <section className="px-6 py-16 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl space-y-4">
          <h2 className="font-serif text-3xl tracking-tight text-foreground sm:text-4xl">
            What GitProof actually does
          </h2>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {FEATURES.map((feature) => (
            <div
              key={feature.id}
              className="rounded-3xl border border-border/70 bg-card px-6 py-6"
            >
              <div
                className={`mb-5 flex h-11 w-11 items-center justify-center rounded-2xl ${feature.iconBg} ${feature.iconColor}`}
              >
                <feature.icon size={20} />
              </div>
              <h3 className="text-xl font-semibold text-foreground">{feature.title}</h3>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
