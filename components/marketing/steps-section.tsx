import { STEPS } from "@/lib/data";

export function StepsSection() {
  return (
    <section className="px-6 py-16 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl space-y-4">
          <h2 className="font-serif text-3xl tracking-tight text-foreground sm:text-4xl">
            How it works
          </h2>
          <p className="text-base leading-8 text-muted-foreground sm:text-lg">
            The product flow is intentionally short. Connect GitHub, let the app
            build the profile, then decide what you want to show.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {STEPS.map((step, index) => (
            <div
              key={step.title}
              className="rounded-3xl border border-border/70 bg-background px-6 py-6"
            >
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl border border-border bg-secondary/60">
                <step.icon size={18} className="text-foreground" />
              </div>
              <div className="mb-2 text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
                Step 0{index + 1}
              </div>
              <h3 className="text-lg font-semibold text-foreground">{step.title}</h3>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 text-sm leading-7 text-muted-foreground">
          Methodology and privacy details are both documented in the app, so the
          product can be evaluated on what it actually does.
        </div>
      </div>
    </section>
  );
}
