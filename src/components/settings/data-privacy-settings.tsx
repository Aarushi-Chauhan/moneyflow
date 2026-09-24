"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Download, RefreshCw, FileText } from "lucide-react";

export function DataPrivacySettings() {
  const [isExporting, setIsExporting] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const handleExport = () => {
    setIsExporting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsExporting(false);
      toast.success("Export started", {
        description: "Your data export will be ready shortly.",
      });
    }, 1500);
  };

  const handleReset = () => {
    setIsResetting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsResetting(false);
      toast.success("Preferences reset", {
        description: "Your local preferences have been cleared.",
      });
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-sm border-primary/10">
        <CardHeader>
          <CardTitle className="text-xl">Data & Privacy</CardTitle>
          <CardDescription>Give users control over their financial data.</CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-3 border-b border-border/50">
            <div className="space-y-1">
              <h4 className="font-semibold text-sm flex items-center gap-2">
                <Download className="w-4 h-4 text-muted-foreground" />
                Export Data
              </h4>
              <p className="text-xs text-muted-foreground max-w-md">
                Download a CSV copy of all your transactions, budgets, and categories.
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={handleExport} disabled={isExporting}>
              {isExporting ? "Exporting..." : "Export My Data"}
            </Button>
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-3 border-b border-border/50">
            <div className="space-y-1">
              <h4 className="font-semibold text-sm flex items-center gap-2">
                <FileText className="w-4 h-4 text-muted-foreground" />
                Import Data
              </h4>
              <p className="text-xs text-muted-foreground max-w-md">
                Import transactions from supported CSV or OFX files.
              </p>
            </div>
            <Button variant="outline" size="sm">
              Import Transactions
            </Button>
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-3">
            <div className="space-y-1">
              <h4 className="font-semibold text-sm flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-muted-foreground" />
                Clear Local Preferences
              </h4>
              <p className="text-xs text-muted-foreground max-w-md">
                Reset your locally stored application preferences and cached data.
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={handleReset} disabled={isResetting}>
              {isResetting ? "Clearing..." : "Reset Preferences"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
