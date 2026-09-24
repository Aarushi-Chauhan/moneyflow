"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Sparkles, Info } from "lucide-react";

// Custom Tailwind switch
function Switch({ checked, onCheckedChange }: { checked: boolean; onCheckedChange: () => void }) {
  return (
    <div
      onClick={onCheckedChange}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
        checked ? "bg-primary" : "bg-input"
      }`}
    >
      <span
        className={`pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </div>
  );
}

export function AISettings() {
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState({
    financialInsights: true,
    monthlySummary: true,
    proactiveInsights: true,
  });

  const handleToggle = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      toast.success("AI preferences updated", {
        description: "Your MoneyFlow AI settings have been saved.",
      });
    }, 600);
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-sm border-primary/10">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <CardTitle className="text-xl">MoneyFlow AI</CardTitle>
          </div>
          <CardDescription>Control how MoneyFlow AI interacts with your financial data.</CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSave}>
          <CardContent className="space-y-6">
            
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex gap-3">
              <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-sm text-foreground mb-1">AI Data Context</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  MoneyFlow AI uses the financial data available in your MoneyFlow account to analyze spending, budgets and trends. 
                  We do not share this data with external third parties.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b border-border/50">
                <div className="space-y-0.5 mr-4">
                  <label className="text-sm font-medium text-foreground">AI Financial Insights</label>
                  <p className="text-xs text-muted-foreground">Allow MoneyFlow AI to generate insights from my transaction data.</p>
                </div>
                <Switch checked={settings.financialInsights} onCheckedChange={() => handleToggle('financialInsights')} />
              </div>
              
              <div className="flex items-center justify-between py-2 border-b border-border/50">
                <div className="space-y-0.5 mr-4">
                  <label className="text-sm font-medium text-foreground">Monthly AI Summary</label>
                  <p className="text-xs text-muted-foreground">Generate a monthly summary of my financial activity.</p>
                </div>
                <Switch checked={settings.monthlySummary} onCheckedChange={() => handleToggle('monthlySummary')} />
              </div>
              
              <div className="flex items-center justify-between py-2">
                <div className="space-y-0.5 mr-4">
                  <label className="text-sm font-medium text-foreground">Proactive Insights</label>
                  <p className="text-xs text-muted-foreground">Show important spending and budget observations on my dashboard.</p>
                </div>
                <Switch checked={settings.proactiveInsights} onCheckedChange={() => handleToggle('proactiveInsights')} />
              </div>
            </div>

          </CardContent>
          <CardFooter className="bg-secondary/10 px-6 py-4 border-t flex justify-end">
            <Button type="submit" disabled={isSaving} className="min-w-[120px]">
              {isSaving ? "Saving..." : "Save Preferences"}
            </Button>
          </CardFooter>
        </form>
      </Card>

      <Card className="shadow-sm bg-secondary/20 border-none">
        <CardContent className="p-5 flex gap-3">
          <Info className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-sm text-foreground mb-1">Your financial data</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              AI insights are generated from the financial information available in MoneyFlow. AI responses should be treated as analysis of your data, not professional financial advice.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
