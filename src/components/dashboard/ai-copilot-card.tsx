"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, Activity, Bot, Zap, BrainCircuit } from "lucide-react";
import { getMonthlyCopilotSummary } from "@/lib/ai/context";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function AICopilotCard() {
  const summary = getMonthlyCopilotSummary();

  return (
    <Card className="group border-primary/20 bg-gradient-to-br from-card to-card/50 shadow-sm overflow-hidden relative">
      <div className="absolute top-0 right-0 p-32 bg-primary/5 rounded-full blur-3xl -z-10 group-hover:bg-primary/10 transition-colors duration-700 pointer-events-none" />

      <div className="flex flex-col md:flex-row relative z-10">
        <div className="flex-1">
          <CardHeader className="pb-3 flex flex-row items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="flex items-center text-primary font-semibold text-lg">
                <Sparkles className="w-5 h-5 mr-2 animate-pulse" />
                MoneyFlow AI
              </CardTitle>
              <CardDescription className="text-foreground text-xl font-medium tracking-tight mt-2 leading-tight">
                "{summary.title}"
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl mb-5">
              {summary.description}
            </p>

            <div className="flex flex-wrap gap-3">
              <Link href="/ai">
                <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-sm">
                  Ask MoneyFlow <Sparkles className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/analytics">
                <Button size="sm" variant="outline" className="border-border hover:bg-secondary/50">
                  View Analytics <Activity className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </div>

        {/* AI Animation Area (Hidden on small mobile, visible on md+) */}
        <div className="hidden md:flex flex-1 max-w-[250px] items-center justify-center p-6 relative">
          <div className="relative w-32 h-32 flex items-center justify-center">
            {/* Pulsing glow background */}
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />

            {/* Orbiting Elements */}
            <div className="absolute w-full h-full animate-[spin_8s_linear_infinite]">
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-6 h-6 bg-background rounded-full border border-primary/50 flex items-center justify-center text-primary shadow-sm shadow-primary/20">
                <Sparkles className="w-3 h-3 animate-pulse" />
              </div>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-6 bg-background rounded-full border border-primary/50 flex items-center justify-center text-primary shadow-sm shadow-primary/20">
                <Zap className="w-3 h-3" />
              </div>
            </div>

            {/* Center Icon */}
            <div className="relative w-16 h-16 bg-gradient-to-br from-[#990463] to-[#B12B30] rounded-2xl shadow-lg shadow-primary/30 flex items-center justify-center border border-white/10 group-hover:scale-105 transition-transform duration-500">
              <BrainCircuit className="w-8 h-8 text-white animate-[pulse_3s_ease-in-out_infinite]" />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
