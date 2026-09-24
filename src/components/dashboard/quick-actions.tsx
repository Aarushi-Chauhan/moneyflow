"use client";

import { Plus, ArrowRightLeft, Sparkles, Target } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const ACTIONS = [
  {
    label: "Add Expense",
    icon: ArrowRightLeft,
    href: "/transactions?action=new-expense",
    color: "text-foreground",
    bg: "bg-secondary",
    hoverBg: "hover:bg-secondary/80",
  },
  {
    label: "Add Income",
    icon: Plus,
    href: "/transactions?action=new-income",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    hoverBg: "hover:bg-emerald-500/20",
  },
  {
    label: "Set Budget",
    icon: Target,
    href: "/budgets",
    color: "text-primary",
    bg: "bg-primary/10",
    hoverBg: "hover:bg-primary/20",
  },
  {
    label: "Ask AI",
    icon: Sparkles,
    href: "/ai",
    color: "text-[#990463]",
    bg: "bg-[#990463]/10",
    hoverBg: "hover:bg-[#990463]/20",
  },
];

export function QuickActions() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {ACTIONS.map((action) => (
        <Link
          key={action.label}
          href={action.href}
          className={cn(
            "flex items-center justify-center sm:justify-start gap-3 p-3 sm:px-4 sm:py-3 rounded-xl border border-border/50 transition-all duration-200 group shadow-sm",
            action.bg,
            action.hoverBg
          )}
        >
          <div className={cn("flex-shrink-0 transition-transform group-hover:scale-110 duration-300", action.color)}>
            <action.icon className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <span className={cn("text-xs sm:text-sm font-semibold truncate", action.color)}>
            {action.label}
          </span>
        </Link>
      ))}
    </div>
  );
}
