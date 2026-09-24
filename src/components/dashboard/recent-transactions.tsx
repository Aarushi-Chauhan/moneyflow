import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import { ArrowUpRight, ArrowDownRight, ChevronRight, CreditCard, Banknote, Landmark, Loader2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";

export function RecentTransactions() {
  const [recentTxns, setRecentTxns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRecentTxns() {
      try {
        const data = await api.get("/transactions/recent?limit=5");
        if (data) {
          setRecentTxns(data);
        }
      } catch (err) {
        console.error("Failed to load recent txns:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchRecentTxns();
  }, []);

  const getPaymentIcon = (method: string) => {
    switch (method) {
      case "credit_card":
      case "debit_card":
        return <CreditCard className="w-4 h-4" />;
      case "bank_transfer":
        return <Landmark className="w-4 h-4" />;
      case "cash":
        return <Banknote className="w-4 h-4" />;
      default:
        return <CreditCard className="w-4 h-4" />;
    }
  };

  const formatPaymentMethod = (method: string) => {
    if (!method) return "";
    return method.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <Card className="h-full flex flex-col hover:border-primary/20 transition-colors duration-300">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Your latest financial activity</CardDescription>
        </div>
        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
          View All
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="space-y-4">
          {loading ? (
            <div className="flex justify-center p-8">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : recentTxns.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-center space-y-3 bg-secondary/20 rounded-lg border border-dashed border-border/50">
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                <Banknote className="w-6 h-6 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium text-foreground">No transactions yet</p>
                <p className="text-sm text-muted-foreground">Add your first transaction to start tracking.</p>
              </div>
            </div>
          ) : (
            recentTxns.map((txn) => {
              const isIncome = txn.type === "income";

              return (
                <Link
                  href={`/transactions?id=${txn.id}`}
                  key={txn.id}
                  className="flex items-center justify-between p-3 -mx-3 rounded-xl hover:bg-secondary/40 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center",
                        isIncome ? "bg-emerald-500/10 text-emerald-500" : "bg-destructive/10 text-destructive"
                      )}
                    >
                      {isIncome ? (
                        <ArrowUpRight className="w-5 h-5" />
                      ) : (
                        <ArrowDownRight className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium leading-none mb-1 text-foreground">
                        {txn.merchant}
                      </p>
                      <div className="flex items-center text-xs text-muted-foreground space-x-2">
                        <span className="truncate max-w-[100px] sm:max-w-[150px]">
                          {txn.category || "Uncategorized"}
                        </span>
                        <span>•</span>
                        <span>{format(parseISO(txn.date), "MMM d")}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end">
                    <span
                      className={cn(
                        "font-semibold text-sm",
                        isIncome ? "text-emerald-500" : "text-foreground"
                      )}
                    >
                      {isIncome ? "+" : "−"}
                      {formatCurrency(txn.amount)}
                    </span>
                    <div className="flex items-center text-xs text-muted-foreground mt-1 space-x-1">
                      {getPaymentIcon(txn.paymentMethod)}
                      <span className="hidden sm:inline-block ml-1">
                        {formatPaymentMethod(txn.paymentMethod)}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
