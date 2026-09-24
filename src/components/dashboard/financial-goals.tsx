"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Target, ChevronRight } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const MOCK_GOALS = [
  {
    id: "g_1",
    name: "Emergency Fund",
    target: 100000,
    current: 65000,
    color: "bg-emerald-500",
  },
  {
    id: "g_2",
    name: "Vacation Fund",
    target: 75000,
    current: 32000,
    color: "bg-sky-500",
  }
];

export function FinancialGoals() {
  return (
    <Card className="h-full flex flex-col hover:border-primary/20 transition-colors duration-300">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div>
          <CardTitle className="flex items-center">
            <Target className="w-4 h-4 mr-2 text-primary" />
            Financial Goals
          </CardTitle>
          <CardDescription>Track your savings targets</CardDescription>
        </div>
        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
          View All
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="space-y-6">
          {MOCK_GOALS.map((goal) => {
            const percentage = Math.min((goal.current / goal.target) * 100, 100);
            
            return (
              <div key={goal.id} className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm text-foreground">{goal.name}</span>
                  <span className="text-sm font-semibold tabular-nums text-foreground">
                    {percentage.toFixed(0)}%
                  </span>
                </div>
                
                <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-secondary shadow-inner">
                  <div
                    className={`h-full flex-1 transition-all duration-500 ease-in-out ${goal.color}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <span className="font-medium tabular-nums">{formatCurrency(goal.current)}</span>
                  <span>Target: {formatCurrency(goal.target)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
