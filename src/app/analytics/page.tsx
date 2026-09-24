
import { FinancialOverview } from "@/components/dashboard/financial-overview";
import { ExpenseBreakdown } from "@/components/dashboard/expense-breakdown";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { TrendingUp, TrendingDown, AlertTriangle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

const INSIGHTS = [
  {
    title: "Spending increased",
    description: "Your shopping expenses increased by 14% compared with last month.",
    type: "warning",
    icon: TrendingUp
  },
  {
    title: "Savings improved",
    description: "You saved 8.2% more than last month. Keep it up!",
    type: "positive",
    icon: TrendingUp
  },
  {
    title: "Budget warning",
    description: "You're close to exceeding your Food & Dining budget.",
    type: "negative",
    icon: AlertTriangle
  },
  {
    title: "Upcoming bills",
    description: "You have 3 recurring bills due in the next 5 days.",
    type: "info",
    icon: Info
  }
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-8 animate-in fade-in-0 duration-500">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Analytics</h2>
        <p className="text-muted-foreground mt-1">
          Detailed insights into your spending and savings patterns.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {INSIGHTS.map((insight, idx) => (
          <Card key={idx} className="bg-secondary/30 border-none shadow-sm hover:bg-secondary/50 transition-colors">
            <CardContent className="p-4 flex items-start space-x-4">
              <div className={cn(
                "p-2 rounded-full mt-0.5",
                insight.type === "positive" ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400" :
                  insight.type === "warning" ? "bg-amber-500/20 text-amber-600 dark:text-amber-400" :
                    insight.type === "negative" ? "bg-destructive/20 text-destructive" :
                      "bg-blue-500/20 text-blue-600 dark:text-blue-400"
              )}>
                <insight.icon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-sm mb-1">{insight.title}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{insight.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <FinancialOverview />
        </div>
        <div className="md:col-span-1">
          <ExpenseBreakdown />
        </div>
      </div>
    </div>
  );
}
