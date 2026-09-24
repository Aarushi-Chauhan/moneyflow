"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// Custom Tailwind switch since @radix-ui/react-switch might not be installed
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

export function NotificationSettings() {
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState({
    budgetApproaching: true,
    budgetExceeded: true,
    spendingInsights: true,
    savingsUpdates: false,
    aiInsights: true,
    productUpdates: false,
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
      toast.success("Notification preferences updated", {
        description: "Your notification settings have been saved.",
      });
    }, 600);
  };

  return (
    <Card className="shadow-sm border-primary/10">
      <CardHeader>
        <CardTitle className="text-xl">Notifications</CardTitle>
        <CardDescription>Control which MoneyFlow notifications you receive.</CardDescription>
      </CardHeader>
      
      <form onSubmit={handleSave}>
        <CardContent className="space-y-6">
          
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Budgets</h3>
            <div className="flex items-center justify-between py-2 border-b border-border/50">
              <div className="space-y-0.5 mr-4">
                <label className="text-sm font-medium text-foreground">Budget Alerts</label>
                <p className="text-xs text-muted-foreground">Notify me when a budget is approaching its limit.</p>
              </div>
              <Switch checked={settings.budgetApproaching} onCheckedChange={() => handleToggle('budgetApproaching')} />
            </div>
            
            <div className="flex items-center justify-between py-2 border-b border-border/50">
              <div className="space-y-0.5 mr-4">
                <label className="text-sm font-medium text-foreground">Budget Exceeded</label>
                <p className="text-xs text-muted-foreground">Notify me when a budget is exceeded.</p>
              </div>
              <Switch checked={settings.budgetExceeded} onCheckedChange={() => handleToggle('budgetExceeded')} />
            </div>
          </div>
          
          <div className="space-y-4 pt-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Insights & Updates</h3>
            <div className="flex items-center justify-between py-2 border-b border-border/50">
              <div className="space-y-0.5 mr-4">
                <label className="text-sm font-medium text-foreground">Spending Insights</label>
                <p className="text-xs text-muted-foreground">Receive periodic spending insights.</p>
              </div>
              <Switch checked={settings.spendingInsights} onCheckedChange={() => handleToggle('spendingInsights')} />
            </div>
            
            <div className="flex items-center justify-between py-2 border-b border-border/50">
              <div className="space-y-0.5 mr-4">
                <label className="text-sm font-medium text-foreground">Savings Updates</label>
                <p className="text-xs text-muted-foreground">Show updates about savings progress.</p>
              </div>
              <Switch checked={settings.savingsUpdates} onCheckedChange={() => handleToggle('savingsUpdates')} />
            </div>
            
            <div className="flex items-center justify-between py-2 border-b border-border/50">
              <div className="space-y-0.5 mr-4">
                <label className="text-sm font-medium text-foreground">AI Insights</label>
                <p className="text-xs text-muted-foreground">Receive useful MoneyFlow AI insights.</p>
              </div>
              <Switch checked={settings.aiInsights} onCheckedChange={() => handleToggle('aiInsights')} />
            </div>
            
            <div className="flex items-center justify-between py-2">
              <div className="space-y-0.5 mr-4">
                <label className="text-sm font-medium text-foreground">Product Updates</label>
                <p className="text-xs text-muted-foreground">Receive important MoneyFlow updates.</p>
              </div>
              <Switch checked={settings.productUpdates} onCheckedChange={() => handleToggle('productUpdates')} />
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
  );
}
