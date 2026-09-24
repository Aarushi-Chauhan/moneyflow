import { Transaction } from "@/types";
const MOCK_CATEGORIES: any[] = [];
const MOCK_TRANSACTIONS: any[] = [];

export interface ParsedIntent {
  categoryName?: string;
  categoryId?: string;
  minAmount?: number;
  maxAmount?: number;
  type?: "income" | "expense";
  timeframe?: string;
}

export function parseTransactionQuery(query: string): ParsedIntent {
  const intent: ParsedIntent = {};
  const lowerQuery = query.toLowerCase();

  // 1. Detect Category
  const categoryMatch = MOCK_CATEGORIES.find(c => lowerQuery.includes(c.name.toLowerCase()) || lowerQuery.includes(c.name.toLowerCase().split(' ')[0]));
  if (categoryMatch) {
    intent.categoryId = categoryMatch.id;
    intent.categoryName = categoryMatch.name;
  }

  // 2. Detect Amounts (e.g., "above 5000", "over 1000", "under 500")
  const aboveMatch = lowerQuery.match(/(?:above|over|>)\s*(?:₹|rs\.?)?\s*(\d+)/);
  if (aboveMatch) intent.minAmount = parseInt(aboveMatch[1], 10);

  const underMatch = lowerQuery.match(/(?:under|below|<)\s*(?:₹|rs\.?)?\s*(\d+)/);
  if (underMatch) intent.maxAmount = parseInt(underMatch[1], 10);

  // 3. Detect Type
  if (lowerQuery.includes("spent") || lowerQuery.includes("expense") || lowerQuery.includes("spending")) {
    intent.type = "expense";
  } else if (lowerQuery.includes("earned") || lowerQuery.includes("income") || lowerQuery.includes("salary")) {
    intent.type = "income";
  }

  return intent;
}

export function filterTransactionsByIntent(intent: ParsedIntent): Transaction[] {
  return MOCK_TRANSACTIONS.filter(txn => {
    let match = true;
    if (intent.categoryId && txn.categoryId !== intent.categoryId) match = false;
    if (intent.type && txn.type !== intent.type) match = false;
    if (intent.minAmount && txn.amount < intent.minAmount) match = false;
    if (intent.maxAmount && txn.amount > intent.maxAmount) match = false;
    return match;
  });
}
