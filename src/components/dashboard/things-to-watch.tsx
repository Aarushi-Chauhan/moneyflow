"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, AlertCircle, TrendingUp, TrendingDown, Info, ChevronRight } from "lucide-react";
import { generateThingsToWatch, AIInsight } from "@/lib/ai/insight-generator";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function ThingsToWatch() {
  const insights = generateThingsToWatch();

  const getSeverityIcon = (severity: AIInsight['severity']) => {
    switch (severity) {
      case "destructive": return <AlertCircle className="w-5 h-5 text-destructive" />;
      case "warning": return <AlertCircle className="w-5 h-5 text-amber-500" />;
      case "success": return <TrendingUp className="w-5 h-5 text-emerald-500" />;
      case "info": return <Info className="w-5 h-5 text-sky-500" />;
    }
  };

  const getSeverityBg = (severity: AIInsight['severity']) => {
    switch (severity) {
      case "destructive": return "bg-destructive/10 border-destructive/20";
      case "warning": return "bg-amber-500/10 border-amber-500/20";
      case "success": return "bg-emerald-500/10 border-emerald-500/20";
      case "info": return "bg-sky-500/10 border-sky-500/20";
    }
  };

  return (
    <Card className="h-full flex flex-col hover:border-primary/20 transition-colors duration-300">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div>
          <CardTitle className="flex items-center">
            <Sparkles className="w-4 h-4 mr-2 text-primary" />
            MoneyFlow Insights
          </CardTitle>
          <CardDescription>AI-driven observations and alerts</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="space-y-4">
          {insights.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-center space-y-3 bg-secondary/20 rounded-lg border border-dashed border-border/50">
              <Sparkles className="w-6 h-6 text-muted-foreground" />
              <div>
                <p className="font-medium text-foreground">All good!</p>
                <p className="text-sm text-muted-foreground">MoneyFlow AI didn't find any urgent issues to watch.</p>
              </div>
            </div>
          ) : (
            insights.map((insight) => (
              <div
                key={insight.id}
                className={cn(
                  "p-4 rounded-xl border transition-colors cursor-pointer group",
                  getSeverityBg(insight.severity)
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="mt-0.5">{getSeverityIcon(insight.severity)}</div>
                    <div>
                      <p className="text-sm font-semibold text-foreground mb-1">
                        {insight.title}
                      </p>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {insight.description}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-border/10 flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground px-2 py-0.5 bg-background/50 rounded-md">
                    {insight.category}
                  </span>
                  <Link href={insight.actionLink}>
                    <Button variant="ghost" size="sm" className="h-6 text-xs px-2 hover:bg-background/80">
                      {insight.actionText} <ChevronRight className="w-3 h-3 ml-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
