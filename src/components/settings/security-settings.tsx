"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Eye, EyeOff, ShieldCheck, Laptop, Smartphone } from "lucide-react";

export function SecuritySettings() {
  const [isSaving, setIsSaving] = useState(false);
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const handleToggleVisibility = (field: keyof typeof showPassword) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwords.new !== passwords.confirm) {
      toast.error("Passwords do not match", {
        description: "Your new password and confirmation must match.",
      });
      return;
    }
    
    if (passwords.new.length < 8) {
      toast.error("Password too weak", {
        description: "Your new password must be at least 8 characters long.",
      });
      return;
    }

    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setPasswords({ current: "", new: "", confirm: "" });
      toast.success("Password changed successfully", {
        description: "Your account security has been updated.",
      });
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Change Password Card */}
      <Card className="shadow-sm border-primary/10">
        <CardHeader>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            <CardTitle className="text-xl">Change Password</CardTitle>
          </div>
          <CardDescription>Protect your MoneyFlow account by using a strong password.</CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSave}>
          <CardContent className="space-y-4">
            
            <div className="space-y-2 max-w-md">
              <label className="text-sm font-semibold text-foreground">Current Password</label>
              <div className="relative">
                <Input 
                  type={showPassword.current ? "text" : "password"} 
                  value={passwords.current}
                  onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                  className="bg-secondary/30 pr-10" 
                  required
                />
                <button 
                  type="button" 
                  onClick={() => handleToggleVisibility("current")}
                  className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                >
                  {showPassword.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            
            <div className="space-y-2 max-w-md pt-2">
              <label className="text-sm font-semibold text-foreground">New Password</label>
              <div className="relative">
                <Input 
                  type={showPassword.new ? "text" : "password"} 
                  value={passwords.new}
                  onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                  className="bg-secondary/30 pr-10" 
                  required
                />
                <button 
                  type="button" 
                  onClick={() => handleToggleVisibility("new")}
                  className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                >
                  {showPassword.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            
            <div className="space-y-2 max-w-md">
              <label className="text-sm font-semibold text-foreground">Confirm New Password</label>
              <div className="relative">
                <Input 
                  type={showPassword.confirm ? "text" : "password"} 
                  value={passwords.confirm}
                  onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                  className="bg-secondary/30 pr-10" 
                  required
                />
                <button 
                  type="button" 
                  onClick={() => handleToggleVisibility("confirm")}
                  className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                >
                  {showPassword.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

          </CardContent>
          <CardFooter className="bg-secondary/10 px-6 py-4 border-t flex justify-end">
            <Button type="submit" disabled={isSaving} className="min-w-[120px]">
              {isSaving ? "Updating..." : "Update Password"}
            </Button>
          </CardFooter>
        </form>
      </Card>
      
      {/* Active Sessions Card (Frontend UI Simulation) */}
      <Card className="shadow-sm border-primary/10">
        <CardHeader>
          <CardTitle className="text-lg">Active Sessions</CardTitle>
          <CardDescription>Devices that are currently logged into your account.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start justify-between py-3 border-b border-border/50">
            <div className="flex gap-3">
              <div className="mt-1 bg-emerald-500/10 p-2 rounded-full">
                <Laptop className="w-4 h-4 text-emerald-500" />
              </div>
              <div>
                <p className="font-semibold text-sm">Mac OS · Chrome</p>
                <p className="text-xs text-muted-foreground">Delhi, India (IP: 192.168.1.1)</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-medium text-emerald-500">Active now</span>
                  <span className="text-[10px] bg-secondary px-1.5 py-0.5 rounded text-muted-foreground font-semibold">Current</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-start justify-between py-3">
            <div className="flex gap-3">
              <div className="mt-1 bg-secondary p-2 rounded-full">
                <Smartphone className="w-4 h-4 text-muted-foreground" />
              </div>
              <div>
                <p className="font-semibold text-sm">iOS · Safari</p>
                <p className="text-xs text-muted-foreground">Delhi, India (IP: 10.0.0.5)</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-muted-foreground">Last active 2 days ago</span>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-destructive">
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
