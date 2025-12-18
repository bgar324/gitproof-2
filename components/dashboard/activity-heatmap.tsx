interface ActivityHeatmapProps {
  data: { date: string; count: number }[];
}

export function ActivityHeatmap({ data }: ActivityHeatmapProps) {
  return (
    <div className="flex flex-wrap gap-1 content-start py-2">
      {data.map((day) => {
        let colorClass = "bg-secondary/40";
        if (day.count > 0) colorClass = "bg-emerald-500/40";
        if (day.count > 4) colorClass = "bg-emerald-500/70";
        if (day.count > 10) colorClass = "bg-emerald-500";

        const dateLabel = new Date(day.date).toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        });

        return (
          <div key={day.date} className="group relative">
            <div
              className={`w-3 h-3 rounded-[2px] transition-all duration-300 hover:scale-125 hover:z-20 ${colorClass}`}
            />
            <div className="pointer-events-none absolute bottom-[140%] left-1/2 -translate-x-1/2 hidden group-hover:block z-50 min-w-[120px]">
              <div className="relative bg-popover/95 backdrop-blur-md border border-border shadow-2xl rounded-lg p-3 text-[10px] flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-200">
                <span className="font-serif text-lg font-medium text-foreground">
                  {day.count}
                </span>
                <span className="text-muted-foreground uppercase tracking-widest text-[9px] mb-1">
                  Contributions
                </span>
                <div className="w-full h-px bg-border/50 my-1" />
                <span className="text-foreground/80 font-medium whitespace-nowrap">
                  {dateLabel}
                </span>
                <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-popover border-r border-b border-border rotate-45" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
