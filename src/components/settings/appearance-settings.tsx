"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Moon, Sun, Monitor } from "lucide-react";
import { cn } from "@/lib/utils";

const themes = [
  { id: "light", label: "Light", icon: Sun, color: "bg-white", border: "border-slate-200" },
  { id: "dark", label: "Dark", icon: Moon, color: "bg-slate-950", border: "border-slate-800" },
  { id: "system", label: "System", icon: Monitor, color: "bg-gradient-to-br from-white to-slate-950", border: "border-slate-400" },
];

export function AppearanceSettings() {
  const [activeTheme, setActiveTheme] = useState("dark");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Appearance updated", {
        description: "Your theme preferences have been applied.",
      });
    }, 600);
  };

  return (
    <Card className="shadow-sm border-primary/10">
      <CardHeader>
        <CardTitle className="text-xl">Appearance</CardTitle>
        <CardDescription>Customize how MoneyFlow looks.</CardDescription>
      </CardHeader>
      
      <form onSubmit={handleSave}>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <label className="text-sm font-semibold text-foreground">Theme Preference</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {themes.map((theme) => {
                const isActive = activeTheme === theme.id;
                return (
                  <div
                    key={theme.id}
                    onClick={() => setActiveTheme(theme.id)}
                    className={cn(
                      "cursor-pointer rounded-xl border-2 p-4 flex flex-col items-center gap-3 transition-all duration-200",
                      isActive 
                        ? "border-primary bg-primary/5 shadow-sm" 
                        : "border-border/50 hover:border-primary/50 hover:bg-secondary/20"
                    )}
                  >
                    <div className={cn("w-12 h-12 rounded-full border shadow-sm flex items-center justify-center", theme.color, theme.border)}>
                      <theme.icon className={cn("w-5 h-5", theme.id === "light" ? "text-slate-800" : "text-white", theme.id === "system" && "mix-blend-difference text-white")} />
                    </div>
                    <span className={cn("text-sm font-medium", isActive ? "text-primary" : "text-muted-foreground")}>
                      {theme.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-secondary/10 px-6 py-4 border-t flex justify-end">
          <Button type="submit" disabled={isSaving} className="min-w-[120px]">
            {isSaving ? "Applying..." : "Save Preferences"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
