"use client";

import { useState } from "react";
import { Plus, Upload } from "lucide-react";

import { TransactionTable } from "@/components/transactions/transaction-table";
import { TransactionForm } from "@/components/transactions/transaction-form";
import { ImportCSVModal } from "@/components/transactions/import-csv-modal";
import { Button } from "@/components/ui/button";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
} from "@/components/ui/modal";

export default function TransactionsPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  const handleClose = () => {
    setIsAddModalOpen(false);
  };

  const handleSuccess = () => {
    setIsAddModalOpen(false);
    window.location.reload();
  };

  const handleImportSuccess = () => {
    // The ImportCSVModal will stay open showing the success message until user clicks "Done",
    // at which point onOpenChange(false) will be called automatically closing it.
    // However, if we need to force a re-fetch of transactions here, we could trigger it.
    // Assuming TransactionTable fetches on mount and maybe we can use a key or context to refresh it.
    // For now, reloading the page is the simplest way to refresh everything if no context exists.
    window.location.reload();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Transactions
          </h2>

          <p className="text-muted-foreground">
            Manage and view your income and expenses.
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsImportModalOpen(true)}
          >
            <Upload className="mr-2 h-4 w-4" />
            Import CSV
          </Button>
          <Button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Transaction
          </Button>
        </div>
      </div>

      {/* Transaction Table */}
      <TransactionTable />

      {/* Add Transaction Modal */}
      <Modal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
      >
        <ModalContent>
          <ModalHeader>
            <ModalTitle>
              Add Transaction
            </ModalTitle>

            <ModalDescription>
              Add a new income or expense transaction.
            </ModalDescription>
          </ModalHeader>

          <TransactionForm
            onSuccess={handleSuccess}
            onCancel={handleClose}
          />
        </ModalContent>
      </Modal>

      {/* Import CSV Modal */}
      <ImportCSVModal 
        open={isImportModalOpen} 
        onOpenChange={setIsImportModalOpen}
        onSuccess={handleImportSuccess}
      />
    </div>
  );
}