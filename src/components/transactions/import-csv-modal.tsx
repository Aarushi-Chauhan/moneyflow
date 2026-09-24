"use client";

import { useState, useRef } from "react";
import { Download, Upload, CheckCircle2, AlertCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { toast } from "sonner";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
} from "@/components/ui/modal";

interface ImportCSVModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

type Step = 'upload' | 'preview' | 'importing' | 'success';

export function ImportCSVModal({ open, onOpenChange, onSuccess }: ImportCSVModalProps) {
  const [step, setStep] = useState<Step>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<any>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetState = () => {
    setStep('upload');
    setFile(null);
    setPreviewData(null);
    setIsUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      resetState();
    }
    onOpenChange(newOpen);
  };

  const downloadTemplate = () => {
    const templateContent = "Date,Type,Title,Category,Amount,Payment Method,Notes\n18-09-2026,Expense,Swiggy,Food & Dining,300,UPI,Dinner\n30-09-2026,Income,Salary,Salary,50000,Bank Transfer,Monthly salary\n";
    const blob = new Blob([templateContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'moneyflow_transactions_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.name.endsWith('.csv')) {
      toast.error('Please upload a CSV file.');
      return;
    }

    setFile(selectedFile);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const res = await api.upload('/transactions/import/preview', formData);
      if (res && res.previewRows) {
        setPreviewData(res);
        setStep('preview');
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to process CSV file.');
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } finally {
      setIsUploading(false);
    }
  };

  const confirmImport = async () => {
    if (!previewData || previewData.validCount === 0) return;

    setStep('importing');
    
    try {
      const validRows = previewData.previewRows
        .filter((row: any) => row.isValid)
        .map((row: any) => row.parsed);

      const res = await api.post('/transactions/import/confirm', { validRows });
      
      toast.success(`${res.insertedCount} transactions imported successfully.`);
      setStep('success');
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to import transactions.');
      setStep('preview');
    }
  };

  return (
    <Modal open={open} onOpenChange={handleOpenChange}>
      <ModalContent className="max-w-4xl">
        <ModalHeader>
          <ModalTitle>Import Transactions</ModalTitle>
          <ModalDescription>
            {step === 'upload' && "Upload a CSV file to import multiple transactions at once."}
            {step === 'preview' && "Review your transactions before importing."}
            {step === 'importing' && "Importing your transactions..."}
            {step === 'success' && "Import completed!"}
          </ModalDescription>
        </ModalHeader>

        <div className="py-4">
          {step === 'upload' && (
            <div className="flex flex-col items-center justify-center space-y-6 py-8">
              <div 
                className="border-2 border-dashed border-border rounded-xl p-12 w-full max-w-lg flex flex-col items-center justify-center text-center cursor-pointer hover:bg-accent/50 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="bg-primary/10 p-4 rounded-full mb-4">
                  <Upload className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-1">Click to upload CSV</h3>
                <p className="text-sm text-muted-foreground mb-4">or drag and drop your file here</p>
                
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept=".csv"
                  onChange={handleFileChange}
                />
                
                <Button disabled={isUploading}>
                  {isUploading ? "Processing..." : "Select File"}
                </Button>
              </div>

              <div className="text-sm text-muted-foreground flex items-center space-x-2">
                <span>Need a template?</span>
                <Button variant="link" className="p-0 h-auto font-medium" onClick={downloadTemplate}>
                  <Download className="w-4 h-4 mr-1" /> Download CSV Template
                </Button>
              </div>
            </div>
          )}

          {step === 'preview' && previewData && (
            <div className="space-y-6">
              <div className="flex gap-4 p-4 rounded-lg bg-secondary/50 border border-border">
                <div className="flex items-center gap-2 text-emerald-600 font-medium">
                  <CheckCircle2 className="w-5 h-5" />
                  {previewData.validCount} valid rows
                </div>
                <div className="flex items-center gap-2 text-destructive font-medium">
                  <AlertCircle className="w-5 h-5" />
                  {previewData.invalidCount} invalid rows
                </div>
              </div>

              <div className="border rounded-lg overflow-hidden max-h-[400px] overflow-y-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-secondary text-secondary-foreground sticky top-0 shadow-sm">
                    <tr>
                      <th className="px-4 py-3 font-medium">Row</th>
                      <th className="px-4 py-3 font-medium">Date</th>
                      <th className="px-4 py-3 font-medium">Type</th>
                      <th className="px-4 py-3 font-medium">Title</th>
                      <th className="px-4 py-3 font-medium text-right">Amount</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {previewData.previewRows.map((row: any, idx: number) => (
                      <tr key={idx} className={!row.isValid ? "bg-destructive/5" : ""}>
                        <td className="px-4 py-3 text-muted-foreground">{row.rowNumber}</td>
                        <td className="px-4 py-3">{row.original.Date}</td>
                        <td className="px-4 py-3">{row.original.Type}</td>
                        <td className="px-4 py-3">{row.original.Title}</td>
                        <td className="px-4 py-3 text-right">{row.original.Amount}</td>
                        <td className="px-4 py-3">
                          {row.isValid ? (
                            <span className="flex items-center text-emerald-600 text-xs font-medium">
                              <CheckCircle2 className="w-3 h-3 mr-1" /> Valid
                            </span>
                          ) : (
                            <div className="flex flex-col space-y-1">
                              <span className="flex items-center text-destructive text-xs font-medium">
                                <XCircle className="w-3 h-3 mr-1" /> Error
                              </span>
                              <span className="text-[10px] text-destructive leading-tight max-w-[200px]">
                                {row.errors.join(', ')}
                              </span>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button variant="outline" onClick={resetState}>
                  Cancel
                </Button>
                <Button 
                  onClick={confirmImport} 
                  disabled={previewData.validCount === 0}
                >
                  Import {previewData.validCount} Transactions
                </Button>
              </div>
            </div>
          )}

          {step === 'importing' && (
            <div className="flex flex-col items-center justify-center py-16 space-y-4">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-lg font-medium text-muted-foreground">Importing transactions...</p>
            </div>
          )}

          {step === 'success' && (
            <div className="flex flex-col items-center justify-center py-12 space-y-6 text-center">
              <div className="bg-emerald-100 p-4 rounded-full">
                <CheckCircle2 className="w-16 h-16 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">Import Successful</h3>
                <p className="text-muted-foreground">
                  Your transactions have been successfully added to your account.
                </p>
              </div>
              <Button onClick={() => handleOpenChange(false)} className="px-8 mt-4">
                Done
              </Button>
            </div>
          )}
        </div>
      </ModalContent>
    </Modal>
  );
}
