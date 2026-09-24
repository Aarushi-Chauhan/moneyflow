"use client";

import { useState, useEffect } from "react";
import { useForm as useHookForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { IndianRupee } from "lucide-react";
import { api } from "@/lib/api";

const transactionSchema = z.object({
  type: z.enum(["income", "expense"]),
  amount: z.number().positive(),
  merchant: z.string().min(2, "Merchant is required"),
  categoryId: z.string().min(1, "Category is required"),
  date: z.string(),
  paymentMethod: z.string().min(1, "Payment method is required"),
  notes: z.string().optional(),
});

type TransactionFormValues = z.infer<typeof transactionSchema>;

interface TransactionFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function TransactionForm({ onSuccess, onCancel }: TransactionFormProps) {
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [categorySearch, setCategorySearch] = useState("");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  const [displayAmount, setDisplayAmount] = useState("");

  const { register, handleSubmit, formState: { errors, isSubmitting }, watch, setValue } = useHookForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: "expense",
      amount: undefined,
      merchant: "",
      categoryId: "",
      date: new Date().toISOString().split('T')[0],
      paymentMethod: "" as any,
      notes: "",
    }
  });

  const type = watch("type");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories');
        if (Array.isArray(res)) {
          setCategories(res);
        } else if (res && res.data) {
          setCategories(res.data);
        }
      } catch (error) {
        console.error("Failed to fetch categories", error);
      } finally {
        setIsLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    register("amount");
  }, [register]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let rawValue = e.target.value.replace(/[^0-9.]/g, "");

    const parts = rawValue.split('.');
    let cleanValue = parts[0];
    if (parts.length > 1) {
      cleanValue += '.' + parts[1]; // Keep only first decimal part
    }

    if (!cleanValue) {
      setDisplayAmount("");
      setValue("amount", undefined as any, { shouldValidate: true });
      return;
    }

    const [integerPart, decimalPart] = cleanValue.split('.');
    let formatted = Number(integerPart).toLocaleString('en-IN');
    if (decimalPart !== undefined) {
      formatted += '.' + decimalPart;
    }

    setDisplayAmount(formatted);
    setValue("amount", parseFloat(cleanValue), { shouldValidate: true });
  };

  const filteredCategories = categories.filter(cat =>
    cat.type === type &&
    cat.name.toLowerCase().includes(categorySearch.toLowerCase())
  );

  const onSubmit = async (data: TransactionFormValues) => {
    try {
      await api.post('/transactions', {
        merchant: data.merchant,
        amount: data.amount,
        type: data.type,
        category_id: data.categoryId,
        payment_method: data.paymentMethod,
        transaction_date: data.date,
        notes: data.notes
      });
      
      toast.success("Transaction added successfully", {
        description: `Added ${data.type === 'income' ? '+' : '-'}₹${data.amount} for ${data.merchant}`
      });
      onSuccess?.();
    } catch (error) {
      toast.error("Failed to add transaction");
      console.error(error);
    }
  };


  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-4">
      {/* Type Selector */}
      <div className="flex p-1 bg-secondary rounded-lg">
        <button
          type="button"
          className={cn(
            "flex-1 py-2 text-sm font-medium rounded-md transition-all",
            type === "expense" ? "bg-red-500/10 text-red-600 dark:text-red-400 shadow-sm" : "text-muted-foreground hover:text-foreground"
          )}
          onClick={() => setValue("type", "expense")}
        >
          Expense
        </button>
        <button
          type="button"
          className={cn(
            "flex-1 py-2 text-sm font-medium rounded-md transition-all",
            type === "income" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shadow-sm" : "text-muted-foreground hover:text-foreground"
          )}
          onClick={() => setValue("type", "income")}
        >
          Income
        </button>
      </div>

      {/* Amount (Hero Input) */}
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Amount</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
            <IndianRupee className={cn(
              "w-6 h-6 transition-colors", 
              type === 'income' ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
            )} />
          </div>
          <Input
            type="text"
            inputMode="decimal"
            placeholder="0.00"
            className={cn(
              "pl-12 h-16 text-3xl font-bold bg-secondary/50 border-0 focus-visible:ring-2 focus-visible:bg-background transition-colors",
              type === 'income' ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
            )}
            value={displayAmount}
            onChange={handleAmountChange}
          />
        </div>
        {errors.amount && <p className="text-xs text-destructive mt-1">{errors.amount.message}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-2">
          <label className="text-sm font-medium">Merchant / Title</label>
          <Input placeholder="e.g. Amazon, Salary" className="h-11 bg-secondary/30" {...register("merchant")} />
          {errors.merchant && <p className="text-xs text-destructive">{errors.merchant.message}</p>}
        </div>
        <div className="space-y-2 relative">
          <label className="text-sm font-medium">Category</label>
          <div className="relative">
            <Input
              placeholder="Search or select category..."
              className="h-11 bg-secondary/30 pr-8"
              value={categorySearch}
              onChange={(e) => {
                setCategorySearch(e.target.value);
                setShowCategoryDropdown(true);
              }}
              onFocus={() => setShowCategoryDropdown(true)}
              onBlur={() => setTimeout(() => setShowCategoryDropdown(false), 200)}
            />
            {showCategoryDropdown && (
              <div className="absolute top-full left-0 right-0 mt-1 max-h-60 overflow-y-auto rounded-md border bg-popover shadow-lg z-50">
                {isLoadingCategories ? (
                  <div className="p-2 text-sm text-muted-foreground text-center">Loading...</div>
                ) : filteredCategories.length === 0 ? (
                  <div className="p-2 text-sm text-muted-foreground text-center">No categories found</div>
                ) : (
                  <ul className="py-1">
                    {filteredCategories.map(cat => (
                      <li
                        key={cat.id}
                        className="px-3 py-2 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground"
                        onMouseDown={(e) => {
                          e.preventDefault(); // Prevent blur
                          setValue("categoryId", cat.id.toString());
                          setCategorySearch(cat.name);
                          setShowCategoryDropdown(false);
                        }}
                      >
                        {cat.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
          {errors.categoryId && <p className="text-xs text-destructive">{errors.categoryId.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-2">
          <label className="text-sm font-medium">Date</label>
          <Input type="date" className="h-11 bg-secondary/30" {...register("date")} />
          {errors.date && <p className="text-xs text-destructive">{errors.date.message}</p>}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Payment Method</label>
          <select
            className="flex h-11 w-full rounded-md border border-input bg-secondary/30 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            {...register("paymentMethod")}
          >
            <option value="" disabled>Select payment method...</option>
            <option value="UPI">UPI</option>
            <option value="Cash">Cash</option>
            <option value="Debit Card">Debit Card</option>
            <option value="Credit Card">Credit Card</option>
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="Net Banking">Net Banking</option>
            <option value="Other">Other</option>
          </select>
          {errors.paymentMethod && <p className="text-xs text-destructive">{errors.paymentMethod.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Notes (Optional)</label>
        <Input placeholder="Add any extra details..." className="h-11 bg-secondary/30" {...register("notes")} />
      </div>

      <div className="flex justify-center pt-6 border-t mt-6">
        <Button
          type="submit"
          disabled={isSubmitting}
          className={cn(
            "h-12 px-12 text-base font-bold cursor-pointer text-white border-none shadow-lg transition-all",
            type === 'income' 
              ? "bg-gradient-to-r from-emerald-500 to-teal-600 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]" 
              : "bg-gradient-to-r from-red-500 to-rose-600 hover:shadow-[0_0_20px_rgba(239,68,68,0.3)]"
          )}
        >
          {isSubmitting ? "Saving..." : "Save Transaction"}
        </Button>
      </div>
    </form>
  );
}
