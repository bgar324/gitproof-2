import { motion } from "framer-motion";

interface TechStackCardProps {
  languages: {
    name: string;
    percent: number;
    color: string;
  }[];
}

export function TechStackCard({ languages }: TechStackCardProps) {
  return (
    <>
      <h3 className="font-serif text-lg mb-6">Tech Stack</h3>
      <div className="space-y-5">
        {languages.map((lang) => (
          <div key={lang.name}>
            <div className="flex justify-between text-xs mb-2">
              <span className="font-medium text-foreground">{lang.name}</span>
              <span className="text-muted-foreground">{lang.percent}%</span>
            </div>
            <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${lang.percent}%` }}
                transition={{ duration: 1, delay: 0.5 }}
                className="h-full rounded-full"
                style={{ backgroundColor: lang.color }}
              />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
