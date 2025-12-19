interface TooltipPayloadItem {
  value?: number | string;
}

interface HourlyTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string | number;
}

export function HourlyChartTooltip({
  active,
  payload,
  label,
}: HourlyTooltipProps) {
  const hourLabel =
    typeof label === "number"
      ? label
      : typeof label === "string"
      ? parseInt(label, 10)
      : 0;
  if (active && payload && payload.length) {
    return (
      <div className="bg-popover/95 backdrop-blur-md border border-border shadow-2xl rounded-lg p-3 text-[10px] flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-200 min-w-[100px]">
        <span className="font-serif text-lg font-medium text-foreground">
          {payload[0].value}
        </span>
        <span className="text-muted-foreground uppercase tracking-widest text-[9px] mb-1">
          Commits
        </span>
        <div className="w-full h-px bg-border/50 my-1" />
        <span className="text-foreground/80 font-medium whitespace-nowrap">
          {hourLabel > 12
            ? `${hourLabel - 12} PM`
            : hourLabel === 12
            ? "12 PM"
            : hourLabel === 0
            ? "12 AM"
            : `${hourLabel} AM`}
        </span>
      </div>
    );
  }
  return null;
}
