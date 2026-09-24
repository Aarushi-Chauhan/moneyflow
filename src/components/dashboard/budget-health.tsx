"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChevronRight, Target, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import Link from "next/link";

export function BudgetHealth() {
  const [budgets, setBudgets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBudgets() {
      try {
        const res = await api.get('/budgets');
        setBudgets(res || []);
      } catch (err) {
        console.error("Failed to load budgets", err);
      } finally {
        setLoading(false);
      }
    }
    fetchBudgets();
  }, []);

  return (
    <Card className="h-full flex flex-col hover:border-primary/20 transition-colors duration-300">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div>
          <CardTitle>Budget Health</CardTitle>
          <CardDescription>Monthly limits vs spending</CardDescription>
        </div>
        <Link href="/budgets">
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
            Manage
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="space-y-6">
          {loading ? (
             <div className="flex justify-center items-center h-40">
               <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
             </div>
          ) : budgets.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-center space-y-3 bg-secondary/20 rounded-lg border border-dashed border-border/50">
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                <Target className="w-6 h-6 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium text-foreground">No budgets set</p>
                <p className="text-sm text-muted-foreground">Create a budget to control spending.</p>
              </div>
            </div>
          ) : (
            <>
              {(() => {
                const totalAmount = budgets.reduce((sum, b) => sum + b.limit, 0);
                const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
                const totalPercentage = totalAmount > 0 ? Math.min((totalSpent / totalAmount) * 100, 100) : 0;
                
                let overAllState = "bg-emerald-500";
                if (totalPercentage >= 100) overAllState = "bg-destructive";
                else if (totalPercentage >= 80) overAllState = "bg-amber-500";

                return (
                  <div className="mb-6 p-4 rounded-xl border border-border/50 bg-secondary/10">
                    <div className="flex justify-between items-end mb-3">
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Overall Health</p>
                        <p className="font-bold text-foreground text-lg tabular-nums">
                          {formatCurrency(totalSpent)} <span className="text-sm text-muted-foreground font-medium">/ {formatCurrency(totalAmount)} used</span>
                        </p>
                      </div>
                      <span className="font-bold text-lg tabular-nums">{totalPercentage.toFixed(1)}%</span>
                    </div>
                    <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-secondary shadow-inner">
                      <div
                        className={`h-full flex-1 transition-all duration-500 ease-in-out ${overAllState}`}
                        style={{ width: `${totalPercentage}%` }}
                      />
                    </div>
                  </div>
                );
              })()}

              <div className="space-y-5 max-h-[300px] overflow-y-auto pr-2">
                {budgets.map((budget) => {
                  const percentageUsed = Math.min(budget.percentageUsed, 100);
                  const remaining = budget.remaining;

                  // Determine state colors based on PRD requirements
                  let stateColor = "bg-emerald-500";
                  let textColor = "text-emerald-500";
                  if (percentageUsed >= 100) {
                    stateColor = "bg-destructive";
                    textColor = "text-destructive";
                  } else if (percentageUsed >= 80) {
                    stateColor = "bg-amber-500";
                    textColor = "text-amber-500";
                  }

                  return (
                    <div key={budget.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-sm text-foreground">
                            {budget.name}
                          </span>
                        </div>
                        <span className="text-sm text-muted-foreground font-medium">
                          {formatCurrency(budget.spent)} / {formatCurrency(budget.limit)}
                        </span>
                      </div>
                      
                      {/* Progress Bar Override to use semantic colors */}
                      <div className="relative h-2 w-full overflow-hidden rounded-full bg-secondary">
                        <div
                          className={`h-full flex-1 transition-all duration-500 ease-in-out ${stateColor}`}
                          style={{ width: `${percentageUsed}%` }}
                        />
                      </div>
                      
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-muted-foreground">
                          {budget.percentageUsed.toFixed(1)}% used
                        </span>
                        <span className={`font-semibold ${textColor}`}>
                          {remaining >= 0 ? `${formatCurrency(remaining)} remaining` : `${formatCurrency(Math.abs(remaining))} over budget`}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
