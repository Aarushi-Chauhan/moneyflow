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

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
} from "@/components/ui/modal";

const budgetSchema = z.object({
  name: z.string().optional(),
  categoryId: z.string().min(1, "Category is required"),
  limit_amount: z.number().positive("Amount must be greater than 0"),
  start_date: z.string(),
  end_date: z.string(),
});

type BudgetFormValues = z.infer<typeof budgetSchema>;

interface BudgetFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  initialData?: any;
}

export function BudgetFormModal({ open, onOpenChange, onSuccess, initialData }: BudgetFormModalProps) {
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset, setValue } = useHookForm<BudgetFormValues>({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      name: "",
      categoryId: "",
      limit_amount: undefined,
      start_date: new Date().toISOString().split('T')[0],
      end_date: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0],
    }
  });

  useEffect(() => {
    if (open) {
      if (initialData) {
        reset({
          name: initialData.name,
          categoryId: initialData.category.id.toString(),
          limit_amount: initialData.limit,
          start_date: new Date(initialData.startDate).toISOString().split('T')[0],
          end_date: initialData.endDate ? new Date(initialData.endDate).toISOString().split('T')[0] : new Date(new Date(initialData.startDate).setDate(new Date(initialData.startDate).getDate() + 30)).toISOString().split('T')[0],
        });
      } else {
        reset({
          name: "",
          categoryId: "",
          limit_amount: undefined,
          start_date: new Date().toISOString().split('T')[0],
          end_date: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0],
        });
      }
      
      const fetchCategories = async () => {
        try {
          const res = await api.get('/categories');
          // Only show expense categories
          if (Array.isArray(res)) {
            setCategories(res.filter(c => c.type === 'expense'));
          } else if (res && res.data) {
            setCategories(res.data.filter((c: any) => c.type === 'expense'));
          }
        } catch (error) {
          console.error("Failed to fetch categories", error);
        } finally {
          setIsLoadingCategories(false);
        }
      };
      fetchCategories();
    }
  }, [open, initialData, reset]);

  const onSubmit = async (data: BudgetFormValues) => {
    try {
      if (initialData) {
        await api.put(`/budgets/${initialData.id}`, {
          name: data.name,
          limit_amount: data.limit_amount,
          start_date: data.start_date,
          end_date: data.end_date
        });
        toast.success("Budget updated successfully");
      } else {
        await api.post('/budgets', {
          name: data.name,
          category_id: data.categoryId,
          limit_amount: data.limit_amount,
          start_date: data.start_date,
          end_date: data.end_date
        });
        toast.success("Budget created successfully");
      }
      onSuccess();
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err.message || 'Failed to save budget');
    }
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent className="max-w-md" onCloseAutoFocus={(e) => e.preventDefault()}>
        <ModalHeader>
          <ModalTitle>{initialData ? "Edit Budget" : "Create Budget"}</ModalTitle>
          <ModalDescription>
            {initialData ? "Modify your spending limit and preferences." : "Set a spending limit for an expense category."}
          </ModalDescription>
        </ModalHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Budget Name (Optional)</label>
            <Input placeholder="e.g. Food Budget" className="bg-secondary/30" {...register("name")} />
            <p className="text-[11px] text-muted-foreground">Leave blank to use category name.</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Category</label>
            <select 
              className="flex h-10 w-full rounded-md border border-input bg-secondary/30 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
              {...register("categoryId")}
              disabled={!!initialData} // Don't allow changing category of existing budget
            >
              <option value="" disabled>Select expense category...</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id.toString()}>{cat.name}</option>
              ))}
            </select>
            {errors.categoryId && <p className="text-xs text-destructive">{errors.categoryId.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Monthly Limit</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <IndianRupee className="w-4 h-4 text-muted-foreground" />
              </div>
              <Input 
                type="number" 
                placeholder="5000" 
                step="0.01" 
                className="pl-9 bg-secondary/30"
                {...register("limit_amount", { valueAsNumber: true })} 
              />
            </div>
            {errors.limit_amount && <p className="text-xs text-destructive">{errors.limit_amount.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Start Date</label>
              <Input type="date" className="bg-secondary/30" {...register("start_date")} />
              {errors.start_date && <p className="text-xs text-destructive">{errors.start_date.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">End Date</label>
              <Input type="date" className="bg-secondary/30" {...register("end_date")} />
              {errors.end_date && <p className="text-xs text-destructive">{errors.end_date.message}</p>}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : initialData ? "Save Changes" : "Create Budget"}
            </Button>
          </div>
        </form>
      </ModalContent>
    </Modal>
  );
}
