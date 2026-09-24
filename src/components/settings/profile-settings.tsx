"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Camera, Mail, Info, IndianRupee, Wallet } from "lucide-react";
import { api } from "@/lib/api";

export function ProfileSettings() {
  const { user, refreshUser } = useAuth();
  
  // Profile State
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [name, setName] = useState(user?.name || "");

  // Financial State
  const [isLoadingFinancials, setIsLoadingFinancials] = useState(true);
  const [isSavingFinancials, setIsSavingFinancials] = useState(false);
  const [balance, setBalance] = useState("");
  const [income, setIncome] = useState("");

  useEffect(() => {
    const fetchFinancials = async () => {
      try {
        const res = await api.get('/account/financial-profile');
        if (res.data) {
          setBalance(res.data.balance?.toString() || "0");
          setIncome(res.data.income?.toString() || "0");
        }
      } catch (err) {
        console.error("Failed to load financial profile", err);
      } finally {
        setIsLoadingFinancials(false);
      }
    };
    fetchFinancials();
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Name is required.");
      return;
    }
    
    setIsSavingProfile(true);
    try {
      await api.put('/account/profile', { name, avatarUrl: user?.avatar_url });
      await refreshUser();
      toast.success("Profile updated successfully.");
    } catch (err: any) {
      toast.error("Failed to update profile", { description: err.message });
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleSaveFinancials = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingFinancials(true);
    
    try {
      await api.put('/account/financial-profile', {
        balance: parseFloat(balance) || 0,
        income: parseFloat(income) || 0
      });
      toast.success("Financial profile updated successfully.");
    } catch (err: any) {
      toast.error("Failed to update financial profile", { description: err.message });
    } finally {
      setIsSavingFinancials(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Basic Profile */}
      <Card className="shadow-sm border-primary/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Profile</CardTitle>
              <CardDescription>Update your personal account information.</CardDescription>
            </div>
            
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-xs text-muted-foreground mb-1 font-medium">Profile setup (100%)</span>
              <div className="w-24 h-1.5 rounded-full bg-secondary overflow-hidden">
                <div className="h-full bg-primary/70 w-full rounded-full" />
              </div>
            </div>
          </div>
        </CardHeader>
        
        <form onSubmit={handleSaveProfile}>
          <CardContent className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 mb-2">
              <div className="relative group cursor-pointer">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center text-3xl text-primary font-bold overflow-hidden transition-all duration-300 group-hover:shadow-md">
                  {name.charAt(0) || "U"}
                  <div className="absolute inset-0 bg-background/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center">
                    <Camera className="w-5 h-5 text-foreground mb-1" />
                  </div>
                </div>
              </div>
              <div className="text-center sm:text-left pt-2">
                <h3 className="font-semibold text-foreground text-lg">{name || "User"}</h3>
                <p className="text-sm text-muted-foreground">Admin Member</p>
                <Button type="button" variant="outline" size="sm" className="mt-2 h-8 text-xs">
                  Upload new picture
                </Button>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                  Full Name
                </label>
                <Input 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name" 
                  className="bg-secondary/30 transition-all focus:bg-background max-w-md" 
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                  Email Address
                </label>
                <div className="relative max-w-md">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    defaultValue={user?.email || ""} 
                    type="email" 
                    className="bg-secondary/30 pl-9 opacity-70 cursor-not-allowed pointer-events-none" 
                    readOnly
                  />
                </div>
                <p className="text-xs text-muted-foreground flex items-center mt-1">
                  <Info className="w-3 h-3 mr-1" />
                  Please contact support to change your email address.
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-secondary/10 px-6 py-4 border-t flex justify-end">
            <Button type="submit" disabled={isSavingProfile} className="min-w-[120px]">
              {isSavingProfile ? "Saving..." : "Save Changes"}
            </Button>
          </CardFooter>
        </form>
      </Card>

      {/* Financial Profile */}
      <Card className="shadow-sm border-primary/10">
        <CardHeader>
          <CardTitle className="text-xl flex items-center">
            <Wallet className="w-5 h-5 mr-2 text-primary" />
            Financial Profile
          </CardTitle>
          <CardDescription>
            Update the initial starting balances and income you provided during setup.
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSaveFinancials}>
          <CardContent className="space-y-6">
            {isLoadingFinancials ? (
              <div className="flex justify-center py-6">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2 max-w-md">
                  <label className="text-sm font-semibold text-foreground">
                    Starting Balance
                  </label>
                  <div className="relative group">
                    <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10 group-focus-within:text-primary" />
                    <Input 
                      type="number"
                      value={balance}
                      onChange={(e) => setBalance(e.target.value)}
                      placeholder="e.g. 120000" 
                      className="pl-9 bg-secondary/30 transition-all focus:bg-background" 
                      required
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">The initial money you started with.</p>
                </div>
                
                <div className="space-y-2 max-w-md">
                  <label className="text-sm font-semibold text-foreground">
                    Recurring Monthly Salary
                  </label>
                  <div className="relative group">
                    <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10 group-focus-within:text-primary" />
                    <Input 
                      type="number"
                      value={income}
                      onChange={(e) => setIncome(e.target.value)}
                      placeholder="e.g. 85000" 
                      className="pl-9 bg-secondary/30 transition-all focus:bg-background" 
                      required
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">Your configured expected recurring salary amount.</p>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="bg-secondary/10 px-6 py-4 border-t flex justify-between items-center">
            <p className="text-xs text-muted-foreground max-w-[60%]">
              Note: Updating these will modify your Starting Balance transaction and your Recurring Salary configuration.
            </p>
            <Button type="submit" disabled={isSavingFinancials || isLoadingFinancials} className="min-w-[120px]">
              {isSavingFinancials ? "Saving..." : "Save Financials"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
