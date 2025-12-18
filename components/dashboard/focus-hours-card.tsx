import { Clock } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { HourlyChartTooltip } from "./hourly-chart-tooltip";

interface FocusHoursCardProps {
  data: { time: string; value: number }[];
}

export function FocusHoursCard({ data }: FocusHoursCardProps) {
  return (
    <>
      <div className="flex items-center gap-2 mb-2">
        <Clock size={18} className="text-muted-foreground" />
        <h3 className="font-serif text-lg">Focus Hours</h3>
      </div>
      <div className="h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <Tooltip
              cursor={{ fill: "hsl(var(--muted)/0.2)" }}
              content={<HourlyChartTooltip />}
            />
            <Bar dataKey="value" radius={[2, 2, 0, 0]}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    entry.value > 5
                      ? "hsl(var(--primary))"
                      : "hsl(var(--secondary))"
                  }
                />
              ))}
            </Bar>
            <XAxis
              dataKey="time"
              tickLine={false}
              axisLine={false}
              fontSize={10}
              stroke="hsl(var(--muted-foreground))"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}
