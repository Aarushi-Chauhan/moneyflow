import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { CountUp } from "@/components/ui/count-up";

interface StatCardProps {
  title: string;
  value: number;
  change: number;
  icon: LucideIcon;
  subValue?: string;
  subValueLabel?: string;
}

export function StatCard({ title, value, change, icon: Icon, subValue, subValueLabel }: StatCardProps) {
  const isPositive = change > 0;
  const isNeutral = change === 0;

  return (
    <Card className="group hover:border-primary/30 hover:shadow-lg transition-all duration-300 relative overflow-hidden bg-card/80 backdrop-blur-sm">
      {/* Subtle background glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
        <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
          {title}
        </CardTitle>
        <div className="w-8 h-8 rounded-full bg-secondary/80 flex items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground shadow-sm transition-all duration-300">
          <Icon className="w-4 h-4" />
        </div>
      </CardHeader>
      <CardContent className="relative z-10">
        <div className="text-2xl lg:text-3xl font-bold tracking-tight tabular-nums text-foreground">
          <CountUp value={value} formatter={(v) => formatCurrency(v)} />
        </div>
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center">
            <div
              className={cn(
                "flex items-center text-xs font-semibold px-2 py-0.5 rounded-full",
                isPositive && "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
                !isPositive && !isNeutral && "bg-destructive/10 text-destructive",
                isNeutral && "bg-secondary text-muted-foreground"
              )}
            >
              {isPositive ? (
                <TrendingUp className="w-3 h-3 mr-1" />
              ) : isNeutral ? (
                <Minus className="w-3 h-3 mr-1" />
              ) : (
                <TrendingDown className="w-3 h-3 mr-1" />
              )}
              {Math.abs(change)}%
            </div>
            <span className="text-xs text-muted-foreground ml-2 font-medium hidden sm:inline-block">
              vs last month
            </span>
          </div>
          
          {subValue && (
            <div className="text-xs font-semibold px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20">
              {subValueLabel && <span className="text-muted-foreground font-normal mr-1">{subValueLabel}</span>}
              {subValue}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
