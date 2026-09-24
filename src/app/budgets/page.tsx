"use client";

import { useState, useEffect } from "react";
import { Plus, Target, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { BudgetCard } from "@/components/budgets/budget-card";
import { BudgetFormModal } from "@/components/budgets/budget-form-modal";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
} from "@/components/ui/modal";

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<any>(null);
  
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [budgetToDelete, setBudgetToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchBudgets = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.get('/budgets');
      setBudgets(res || []);
    } catch (err: any) {
      console.error(err);
      setError("Unable to load your budgets.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  const handleOpenCreate = () => {
    setSelectedBudget(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (budget: any) => {
    setSelectedBudget(budget);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!budgetToDelete || isDeleting) return;
    
    setIsDeleting(true);
    try {
      await api.delete(`/budgets/${budgetToDelete}`);
      toast.success("Budget deleted successfully.");
      fetchBudgets();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete budget.");
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
      setBudgetToDelete(null);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Budgets</h2>
          <p className="text-muted-foreground">
            Set spending limits and keep track of your monthly expenses.
          </p>
        </div>

        <Button onClick={handleOpenCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Create Budget
        </Button>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-lg flex items-center justify-between border border-destructive/20">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            <p className="font-medium">{error}</p>
          </div>
          <Button variant="outline" size="sm" onClick={fetchBudgets}>
            Try Again
          </Button>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-[220px] rounded-xl bg-secondary/50 animate-pulse border border-border" />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && budgets.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center border border-dashed rounded-2xl bg-secondary/20">
          <div className="bg-primary/10 p-4 rounded-full mb-4">
            <Target className="w-12 h-12 text-primary" />
          </div>
          <h3 className="text-xl font-bold mb-2">No budgets yet</h3>
          <p className="text-muted-foreground mb-6 max-w-sm">
            Create a spending limit for a category to keep your expenses on track.
          </p>
          <Button onClick={handleOpenCreate}>
            Create Your First Budget
          </Button>
        </div>
      )}

      {/* Budgets Grid */}
      {!isLoading && !error && budgets.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {budgets.map(budget => (
            <BudgetCard 
              key={budget.id} 
              budget={budget} 
              onEdit={handleOpenEdit}
              onDelete={(id) => {
                setBudgetToDelete(id);
                setIsDeleteDialogOpen(true);
              }}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <BudgetFormModal 
        open={isModalOpen} 
        onOpenChange={setIsModalOpen} 
        onSuccess={fetchBudgets}
        initialData={selectedBudget}
      />

      {/* Delete Confirmation Modal */}
      <Modal open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <ModalContent className="max-w-md">
          <ModalHeader>
            <ModalTitle>Delete this budget?</ModalTitle>
            <ModalDescription>
              Are you sure you want to delete this budget? Your actual transactions will not be deleted.
            </ModalDescription>
          </ModalHeader>
          
          <div className="flex justify-end gap-3 pt-6">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setBudgetToDelete(null);
              }}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={isDeleting}
              onClick={async (e) => {
                e.preventDefault();
                await handleConfirmDelete();
              }}
            >
              {isDeleting ? (
                <>
                  <span className="animate-spin mr-2 border-2 border-current border-t-transparent rounded-full w-4 h-4" />
                  Deleting...
                </>
              ) : (
                "Delete Budget"
              )}
            </Button>
          </div>
        </ModalContent>
      </Modal>
    </div>
  );
}
