"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Globe, Calendar } from "lucide-react";

export function PreferencesSettings() {
  const [isSaving, setIsSaving] = useState(false);

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Preferences updated successfully.", {
        description: "Your settings have been saved.",
      });
    }, 800);
  };

  return (
    <Card className="shadow-sm border-primary/10">
      <CardHeader>
        <CardTitle className="text-xl">General Preferences</CardTitle>
        <CardDescription>Customize your MoneyFlow experience.</CardDescription>
      </CardHeader>
      
      <form onSubmit={handleSavePreferences}>
        <CardContent className="space-y-6">
          <div className="space-y-2 max-w-md">
            <label className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Globe className="w-4 h-4 text-muted-foreground" />
              Default Currency
            </label>
            <p className="text-xs text-muted-foreground mb-2">
              This will update financial formatting across the entire application.
            </p>
            <select className="flex h-10 w-full rounded-md border border-input bg-secondary/30 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors hover:bg-secondary/50">
              <option value="INR">₹ INR — Indian Rupee</option>
              {/* Only keeping INR fully functional based on current frontend architecture, but providing select structure */}
            </select>
          </div>
          
          <div className="space-y-2 max-w-md">
            <label className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              Date Format
            </label>
            <select className="flex h-10 w-full rounded-md border border-input bg-secondary/30 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors hover:bg-secondary/50">
              <option value="MMM_DD_YYYY">Sep 18, 2026 (MMM DD, YYYY)</option>
              <option value="DD_MMM_YYYY">18 Sep 2026 (DD MMM YYYY)</option>
              <option value="DD_MM_YYYY">18/09/2026 (DD/MM/YYYY)</option>
            </select>
          </div>
          
          <div className="space-y-2 max-w-md">
            <label className="text-sm font-semibold text-foreground">
              First Day of Week
            </label>
            <select className="flex h-10 w-full rounded-md border border-input bg-secondary/30 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors hover:bg-secondary/50">
              <option value="monday">Monday</option>
              <option value="sunday">Sunday</option>
            </select>
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
