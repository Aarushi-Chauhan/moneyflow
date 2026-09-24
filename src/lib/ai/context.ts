export function getMonthlyCopilotSummary() {
  const expensesChange = 0;
  const savingsChange = 0;
  
  const isExpenseDown = expensesChange < 0;
  const isSavingsUp = savingsChange > 0;

  // Generate a realistic summary based purely on the structured data
  if (isExpenseDown && isSavingsUp) {
    return {
      title: `Your expenses decreased ${Math.abs(expensesChange)}% this month.`,
      description: "Great job! You spent less than last month, which helped boost your overall savings rate. Your shopping and entertainment categories saw the biggest drop.",
      sentiment: "positive" as const,
    };
  } else if (!isExpenseDown && isSavingsUp) {
    return {
      title: `Your savings grew by ${Math.abs(savingsChange)}% this month.`,
      description: "Even though your expenses increased slightly, your overall cash flow remains positive and your savings are growing.",
      sentiment: "positive" as const,
    };
  } else {
    return {
      title: `Your expenses increased ${Math.abs(expensesChange)}% this month.`,
      description: "You spent more than last month, primarily driven by Food & Dining and Transportation. Consider reviewing your budgets to get back on track.",
      sentiment: "warning" as const,
    };
  }
}
