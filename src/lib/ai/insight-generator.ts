const MOCK_BUDGETS: any[] = [];
const MOCK_CATEGORIES: any[] = [];
const MOCK_TRANSACTIONS: any[] = [];
const MOCK_DASHBOARD_STATS: any = { savingsChange: 0 };
import { formatCurrency } from "@/lib/utils";

export interface AIInsight {
  id: string;
  title: string;
  description: string;
  severity: "info" | "warning" | "success" | "destructive";
  category: string;
  actionText: string;
  actionLink: string;
}

export function generateThingsToWatch(): AIInsight[] {
  const insights: AIInsight[] = [];

  // 1. Budget Alerts
  MOCK_BUDGETS.forEach(budget => {
    const category = MOCK_CATEGORIES.find(c => c.id === budget.categoryId);
    const utilization = budget.spent / budget.amount;
    
    if (utilization >= 1) {
      insights.push({
        id: `budget_over_${budget.id}`,
        title: `${category?.name || 'Category'} budget exceeded`,
        description: `You are over your ${formatCurrency(budget.amount)} limit by ${formatCurrency(budget.spent - budget.amount)}.`,
        severity: "destructive",
        category: "Budget",
        actionText: "Adjust Budget",
        actionLink: "/budgets"
      });
    } else if (utilization >= 0.8) {
      insights.push({
        id: `budget_warn_${budget.id}`,
        title: `${category?.name || 'Category'} approaching limit`,
        description: `You have used ${Math.round(utilization * 100)}% of your monthly budget. Only ${formatCurrency(budget.amount - budget.spent)} remaining.`,
        severity: "warning",
        category: "Budget",
        actionText: "View Details",
        actionLink: "/budgets"
      });
    }
  });

  // 2. High Value Transactions
  const recentHighValue = MOCK_TRANSACTIONS.filter(t => t.type === 'expense' && t.amount > 15000).slice(0, 1);
  recentHighValue.forEach(txn => {
    insights.push({
      id: `txn_high_${txn.id}`,
      title: "Unusually large transaction detected",
      description: `A transaction of ${formatCurrency(txn.amount)} at ${txn.merchant} was recorded.`,
      severity: "info",
      category: "Spending",
      actionText: "Review",
      actionLink: "/transactions"
    });
  });

  // 3. Savings trend
  if (MOCK_DASHBOARD_STATS.savingsChange > 5) {
    insights.push({
      id: "savings_up",
      title: "Great savings rate!",
      description: `Your savings have increased by ${MOCK_DASHBOARD_STATS.savingsChange}% compared to last month.`,
      severity: "success",
      category: "Savings",
      actionText: "View Analytics",
      actionLink: "/analytics"
    });
  }

  return insights.slice(0, 3); // Return top 3 most important
}
