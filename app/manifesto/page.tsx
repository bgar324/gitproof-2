"use client";

import { motion } from "framer-motion";

export default function ManifestoPage() {
  return (
    <main className="pt-32 pb-20 px-6 max-w-4xl mx-auto">
      <article className="prose prose-lg dark:prose-invert max-w-none">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.5 }}
        >
          <span className="text-xs font-mono text-muted-foreground mb-4 block uppercase tracking-widest">The Mission</span>
          <h1 className="font-serif text-6xl md:text-7xl mb-12 leading-[0.9]">
            Stop explaining<br/>your code.
          </h1>
        </motion.div>

        <div className="space-y-12 text-xl md:text-2xl font-light leading-relaxed text-muted-foreground">
          <p>
            <strong className="text-foreground font-normal">The resume is dead.</strong> At least for engineers. 
            A single sheet of paper cannot capture the elegance of your architecture, the consistency of your commits, 
            or the complexity of the problems you solve daily.
          </p>

          <p>
            We built GitProof because we were tired of being judged by keywords rather than key contributions. 
            We believe that your GitHub activity is the single most potent signal of your capability—but only if 
            it can be translated into a language that recruiters speak.
          </p>

          <div className="border-l-2 border-foreground pl-8 py-2 my-12">
            <p className="text-foreground italic font-serif text-3xl">
              "Code is the only truth. Everything else is just marketing."
            </p>
          </div>

          <p>
            This isn't about gamifying contributions. It's about revealing the work you've already done.
            It's about taking the invisible labor of software engineering and making it undeniable.
          </p>
        </div>
      </article>
    </main>
  );
}