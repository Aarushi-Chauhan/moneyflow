"use client";

import { useState, useEffect } from "react";
import { StatCard } from "@/components/dashboard/stat-card";
import { FinancialOverview } from "@/components/dashboard/financial-overview";
import { ExpenseBreakdown } from "@/components/dashboard/expense-breakdown";
import { BudgetHealth } from "@/components/dashboard/budget-health";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { AICopilotCard } from "@/components/dashboard/ai-copilot-card";
import { ThingsToWatch } from "@/components/dashboard/things-to-watch";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { FinancialGoals } from "@/components/dashboard/financial-goals";
import { Wallet, TrendingUp, TrendingDown, PiggyBank, Calendar, Download, Bell, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";

import { api } from "@/lib/api";

export default function DashboardPage() {
  const { user } = useAuth();
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSummary() {
      try {
        const data = await api.get("/dashboard/summary");
        if (data) {
          setSummary(data);
        }
      } catch (err) {
        console.error("Failed to load dashboard summary:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchSummary();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Calculate savings rate for the KPI card from the backend data
  const savingsRate = summary?.savingsRate || 0;

  return (
    <div className="space-y-6 lg:space-y-8 animate-in fade-in-0 duration-500 pb-8">
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground">
            Good morning, {(user?.name || "User").split(' ')[0]} 👋
          </h2>
          <p className="text-muted-foreground mt-1">
            Here's what's happening with your money this month.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="hidden sm:flex hover:bg-primary/10 hover:text-primary transition-colors">
            <Calendar className="mr-2 h-4 w-4" />
            This Month
          </Button>
          <Button variant="outline" size="sm" className="hover:bg-primary/10 hover:text-primary transition-colors">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="secondary" size="icon" className="h-9 w-9 relative sm:hidden">
            <Bell className="h-4 w-4 text-foreground" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full border-2 border-background" />
          </Button>
        </div>
      </div>

      {/* Compact AI Banner */}
      <AICopilotCard />

      {/* KPI Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Balance"
          value={summary?.totalBalance || 0}
          change={summary?.comparison?.balance || 0}
          icon={Wallet}
        />
        <StatCard
          title="Total Income"
          value={summary?.income || 0}
          change={summary?.comparison?.income || 0}
          icon={TrendingUp}
        />
        <StatCard
          title="Total Expenses"
          value={summary?.expenses || 0}
          change={summary?.comparison?.expenses || 0}
          icon={TrendingDown}
        />
        <StatCard
          title="Savings"
          value={summary?.savings || 0}
          change={summary?.comparison?.savings || 0}
          icon={PiggyBank}
          subValue={`${savingsRate}%`}
          subValueLabel="Rate"
        />
      </div>

      {/* Quick Actions */}
      <QuickActions />

      {/* Cash Flow & Spending */}
      <div className="grid gap-4 md:gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <FinancialOverview />
        </div>
        <div className="lg:col-span-1">
          <ExpenseBreakdown />
        </div>
      </div>

      {/* Insights & Budget Health */}
      <div className="grid gap-4 md:gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <ThingsToWatch />
        </div>
        <div className="lg:col-span-2">
          <BudgetHealth />
        </div>
      </div>

      {/* Financial Goals & Recent Transactions */}
      <div className="grid gap-4 md:gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <FinancialGoals />
        </div>
        <div className="lg:col-span-2">
          <RecentTransactions />
        </div>
      </div>
    </div>
  );
}
