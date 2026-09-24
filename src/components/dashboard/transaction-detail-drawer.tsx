"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import { Transaction } from "@/types";
import { ArrowUpRight, ArrowDownRight, Tag, Calendar, CreditCard, Banknote, Landmark, Trash2, Edit } from "lucide-react";
import { cn } from "@/lib/utils";

interface TransactionDetailDrawerProps {
  transaction: Transaction | null;
  isOpen: boolean;
  onClose: () => void;
}

export function TransactionDetailDrawer({ transaction, isOpen, onClose }: TransactionDetailDrawerProps) {
  if (!transaction) return null;

  const category = { color: "#cbd5e1", name: "Uncategorized" };
  const isIncome = transaction.type === "income";

  const getPaymentIcon = (method: string) => {
    switch (method) {
      case "credit_card":
      case "debit_card":
        return <CreditCard className="w-4 h-4 mr-2" />;
      case "bank_transfer":
        return <Landmark className="w-4 h-4 mr-2" />;
      case "cash":
        return <Banknote className="w-4 h-4 mr-2" />;
      default:
        return <CreditCard className="w-4 h-4 mr-2" />;
    }
  };

  const formatPaymentMethod = (method: string) => {
    return method.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-md w-full border-l border-border/50">
        <SheetHeader className="pb-6 border-b border-border/50">
          <div className="flex items-center justify-between">
            <div className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center",
              isIncome ? "bg-emerald-500/10 text-emerald-500" : "bg-destructive/10 text-destructive"
            )}>
              {isIncome ? <ArrowUpRight className="w-6 h-6" /> : <ArrowDownRight className="w-6 h-6" />}
            </div>
            <div className="text-right">
              <span className={cn(
                "text-3xl font-bold tracking-tight tabular-nums",
                isIncome ? "text-emerald-500" : "text-foreground"
              )}>
                {isIncome ? "+" : "−"}{formatCurrency(transaction.amount)}
              </span>
            </div>
          </div>
          <SheetTitle className="text-xl mt-4">{transaction.merchant}</SheetTitle>
          <SheetDescription className="flex items-center mt-1">
            <span className="inline-block w-2 h-2 rounded-full mr-2" style={{ backgroundColor: category?.color || "#cbd5e1" }} />
            {category?.name || "Uncategorized"}
          </SheetDescription>
        </SheetHeader>
        
        <div className="py-6 space-y-6">
          <div className="grid grid-cols-2 gap-y-6 gap-x-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground flex items-center mb-1">
                <Calendar className="w-4 h-4 mr-2" /> Date
              </p>
              <p className="font-semibold text-foreground">{format(parseISO(transaction.date), "MMMM d, yyyy")}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground flex items-center mb-1">
                <Tag className="w-4 h-4 mr-2" /> Status
              </p>
              <div className="flex items-center">
                <span className={cn(
                  "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize",
                  transaction.status === "completed" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                )}>
                  {transaction.status}
                </span>
              </div>
            </div>
            <div className="col-span-2">
              <p className="text-sm font-medium text-muted-foreground flex items-center mb-1">
                {getPaymentIcon(transaction.paymentMethod)} Payment Method
              </p>
              <p className="font-semibold text-foreground">{formatPaymentMethod(transaction.paymentMethod)}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Transaction ID
              </p>
              <p className="font-mono text-sm text-foreground bg-secondary/50 p-2 rounded-md">{transaction.id}</p>
            </div>
          </div>
        </div>

        <SheetFooter className="absolute bottom-0 left-0 right-0 p-6 border-t border-border/50 bg-background/80 backdrop-blur-sm flex sm:justify-between items-center gap-3">
          <Button variant="outline" className="w-full text-foreground" onClick={onClose}>
            <Edit className="w-4 h-4 mr-2" /> Edit
          </Button>
          <Button variant="destructive" className="w-full">
            <Trash2 className="w-4 h-4 mr-2" /> Delete
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
