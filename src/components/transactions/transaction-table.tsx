"use client";

import { useEffect, useState, useCallback } from "react";
import { format } from "date-fns";
import { api } from "@/lib/api";
import { formatCurrency, cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Search, Filter, ArrowUpDown, Store, CreditCard, Banknote, Smartphone, ChevronLeft, ChevronRight } from "lucide-react";

const getPaymentIcon = (method: string) => {
  switch (method) {
    case "credit_card":
    case "debit_card":
      return <CreditCard className="w-4 h-4 mr-2 text-muted-foreground" />;
    case "cash":
      return <Banknote className="w-4 h-4 mr-2 text-muted-foreground" />;
    default:
      return <Smartphone className="w-4 h-4 mr-2 text-muted-foreground" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800";
    case "pending":
      return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800";
    default:
      return "bg-destructive/10 text-destructive border-destructive/20";
  }
};

const getCategoryColor = (categoryName: string) => {
  if (!categoryName) return "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800";
  
  const lower = categoryName.toLowerCase();
  if (lower.includes("food") || lower.includes("dining") || lower.includes("groceries") || lower.includes("restaurant")) {
    return "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-800";
  }
  if (lower.includes("transport") || lower.includes("travel") || lower.includes("fuel") || lower.includes("car") || lower.includes("flight")) {
    return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800";
  }
  if (lower.includes("utilit") || lower.includes("bill") || lower.includes("electricity") || lower.includes("water") || lower.includes("internet") || lower.includes("phone")) {
    return "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800";
  }
  if (lower.includes("salary") || lower.includes("income") || lower.includes("bonus") || lower.includes("freelance") || lower.includes("profit")) {
    return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800";
  }
  if (lower.includes("shop") || lower.includes("entertainment") || lower.includes("movie") || lower.includes("game") || lower.includes("subscript")) {
    return "bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-200 dark:border-pink-800";
  }
  if (lower.includes("health") || lower.includes("medical") || lower.includes("doctor") || lower.includes("pharmacy") || lower.includes("fitness")) {
    return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800";
  }
  if (lower.includes("rent") || lower.includes("home") || lower.includes("house") || lower.includes("mortgage")) {
    return "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-200 dark:border-cyan-800";
  }
  
  // Default color for unmapped categories
  return "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800";
};

export function TransactionTable() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 5;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1); // Reset page on new search
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.get(`/transactions?page=${page}&limit=${limit}&search=${encodeURIComponent(debouncedSearch)}`);
      if (data) {
        setTransactions(data.txns || []);
        setTotalPages(Math.ceil(data.total / limit) || 1);
      }
    } catch (err) {
      console.error("Failed to load transactions", err);
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, limit]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return (
    <div className="space-y-4">
      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center bg-card p-2 rounded-lg border shadow-sm">
        <div className="relative flex-1 max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search transactions..."
            className="pl-9 bg-background/50 border-0 focus-visible:ring-1"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
            <Filter className="w-4 h-4 mr-2" /> Category
          </Button>
          <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
            <ArrowUpDown className="w-4 h-4 mr-2" /> Sort
          </Button>
        </div>
      </div>

      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <div className="relative w-full overflow-auto max-h-[600px]">
          <table className="w-full caption-bottom text-sm relative">
            <thead className="[&_tr]:border-b sticky top-0 bg-secondary/80 backdrop-blur-md z-10">
              <tr className="border-b transition-colors hover:bg-muted/20 data-[state=selected]:bg-muted">
                <th className="h-12 px-6 text-left align-middle font-medium text-muted-foreground">Transaction</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground hidden lg:table-cell">Category</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground hidden md:table-cell">Date</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground hidden xl:table-cell">Payment</th>
                <th className="h-12 px-4 text-center align-middle font-medium text-muted-foreground">Status</th>
                <th className="h-12 px-6 text-right align-middle font-medium text-muted-foreground">Amount</th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {transactions.length === 0 && !loading && (
                <tr>
                  <td colSpan={6} className="h-[400px] text-center align-middle">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center mb-2">
                        <Store className="w-8 h-8 text-muted-foreground/50" />
                      </div>
                      {searchTerm ? (
                        <p className="text-muted-foreground font-medium">No transactions match your search.</p>
                      ) : (
                        <>
                          <h3 className="text-xl font-bold">No transactions yet</h3>
                          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                            Add your first income or expense to start tracking your money.
                          </p>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              )}

              {transactions.map((t) => (
                <tr key={t.id} className="border-b border-border/40 transition-colors hover:bg-muted/40 group">
                  <td className="p-4 px-6 align-middle">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors flex-shrink-0">
                        <Store className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-foreground truncate max-w-[200px] sm:max-w-[300px]">{t.merchant}</div>
                        {t.notes && <div className="text-xs text-muted-foreground truncate max-w-[200px] sm:max-w-[300px]">{t.notes}</div>}
                        <div className="text-xs text-muted-foreground mt-1 md:hidden">
                          {format(new Date(t.date), "MMM dd")} • {t.category || t.categoryId}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 align-middle hidden lg:table-cell">
                    <Badge variant="outline" className={cn("font-medium", getCategoryColor(t.category || t.categoryId))}>
                      {t.category || t.categoryId}
                    </Badge>
                  </td>
                  <td className="p-4 align-middle hidden md:table-cell text-muted-foreground font-medium whitespace-nowrap">
                    {format(new Date(t.date), "MMM dd, yyyy")}
                  </td>
                  <td className="p-4 align-middle hidden xl:table-cell">
                    <div className="flex items-center text-muted-foreground font-medium capitalize whitespace-nowrap">
                      {getPaymentIcon(t.paymentMethod)}
                      {t.paymentMethod.replace("_", " ")}
                    </div>
                  </td>
                  <td className="p-4 align-middle text-center hidden sm:table-cell">
                    <Badge variant="outline" className={cn("font-medium capitalize", getStatusColor(t.status))}>
                      {t.status}
                    </Badge>
                  </td>
                  <td className={cn("p-4 px-6 align-middle text-right font-bold whitespace-nowrap", t.type === "income" ? "text-emerald-500" : "text-foreground")}>
                    {t.type === "income" ? "+" : "−"}{formatCurrency(t.amount)}
                  </td>
                </tr>
              ))}

              {loading && (
                <>
                  {[1, 2, 3].map((i) => (
                    <tr key={`skel-${i}`}>
                      <td className="p-4 px-6">
                        <div className="flex items-center gap-3">
                          <Skeleton className="w-10 h-10 rounded-full" />
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-3 w-24" />
                          </div>
                        </div>
                      </td>
                      <td className="p-4 hidden lg:table-cell"><Skeleton className="h-5 w-20 rounded-full" /></td>
                      <td className="p-4 hidden md:table-cell"><Skeleton className="h-4 w-24" /></td>
                      <td className="p-4 hidden xl:table-cell"><Skeleton className="h-4 w-24" /></td>
                      <td className="p-4"><Skeleton className="h-6 w-20 mx-auto rounded-full" /></td>
                      <td className="p-4 px-6"><Skeleton className="h-5 w-20 ml-auto" /></td>
                    </tr>
                  ))}
                </>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-t bg-card/50">
          <div className="text-sm font-medium text-muted-foreground">
            Page {page} of {totalPages}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1 || loading}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages || loading}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
