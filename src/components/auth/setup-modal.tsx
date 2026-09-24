"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { Rocket, IndianRupee, Wallet, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";

const DEFAULT_CATEGORIES = [
  { id: "food", label: "Food & Dining", defaultChecked: true },
  { id: "shopping", label: "Shopping", defaultChecked: true },
  { id: "transportation", label: "Transportation", defaultChecked: true },
  { id: "housing", label: "Housing & Rent", defaultChecked: false },
  { id: "bills", label: "Bills & Utilities", defaultChecked: true },
  { id: "health", label: "Health & Fitness", defaultChecked: true },
  { id: "entertainment", label: "Entertainment", defaultChecked: true },
  { id: "travel", label: "Travel", defaultChecked: false },
  { id: "education", label: "Education", defaultChecked: false },
  { id: "emi", label: "EMI & Loans", defaultChecked: false },
  { id: "other", label: "Other", defaultChecked: false },
];

export function SetupModal() {
  const router = useRouter();
  const { logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState("");
  const [income, setIncome] = useState("");
  const [payDate, setPayDate] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    DEFAULT_CATEGORIES.filter((c) => c.defaultChecked).map((c) => c.label)
  );

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = "/login";
    } catch (err) {
      console.error(err);
    }
  };

  const toggleCategory = (label: string) => {
    setSelectedCategories((prev) =>
      prev.includes(label) ? prev.filter((c) => c !== label) : [...prev, label]
    );
  };

  const handleNumberChange = (value: string, setter: (val: string) => void) => {
    const rawValue = value.replace(/\D/g, "");
    if (!rawValue) {
      setter("");
      return;
    }
    setter(Number(rawValue).toLocaleString('en-IN'));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (selectedCategories.length === 0) {
      toast.error("Please select at least one expense category.");
      setLoading(false);
      return;
    }

    try {
      const payload = {
        balance: parseFloat(balance.replace(/,/g, "")) || 0,
        income: parseFloat(income.replace(/,/g, "")) || 0,
        payDate: payDate,
        categories: selectedCategories
      };

      await api.post("/account/setup", payload);

      // Force reload to get updated user context and clear cache
      window.location.href = "/";
    } catch (err: any) {
      toast.error("Setup Failed", { description: err.message });
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] w-full h-full bg-background/80 backdrop-blur-md flex flex-col items-center justify-center py-4 overflow-y-auto">
      <div className="w-full max-w-5xl mx-auto px-4 animate-in fade-in zoom-in-95 duration-500 relative py-4">
        {/* Background blobs for aesthetic */}
        <div className="absolute top-0 -left-12 w-96 h-96 bg-[#990463] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob z-0 pointer-events-none"></div>
        <div className="absolute top-20 -right-12 w-96 h-96 bg-[#F0C49D] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000 z-0 pointer-events-none"></div>

        <Card className="relative z-10 border-border/50 shadow-2xl bg-background/80 backdrop-blur-3xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#B12B30]/5 via-[#990463]/5 to-[#F0C49D]/5 pointer-events-none" />
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="absolute top-4 right-4 z-20 cursor-pointer bg-background/50 border-border/50 text-muted-foreground hover:bg-red-50 hover:text-red-600 hover:border-red-200 dark:hover:bg-red-950/40 dark:hover:text-red-400 dark:hover:border-red-900/50 shadow-sm backdrop-blur-md transition-all duration-300"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>

          <form onSubmit={handleSubmit}>
            <CardContent className="pt-8 pb-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column: Welcome + Balances */}
                <div className="space-y-8">
                  <div className="flex flex-col">
                    <div className="flex items-center space-x-4 mb-2">
                      <Image 
                        src="/sidelogo.png" 
                        alt="MoneyFlow Logo" 
                        width={56} 
                        height={56} 
                        className="object-contain dark:invert shrink-0" 
                      />
                      <h1 className="text-3xl font-extrabold tracking-tight text-foreground drop-shadow-sm whitespace-nowrap">Welcome to MoneyFlow</h1>
                    </div>
                    <p className="text-muted-foreground mt-2 text-sm max-w-sm">
                      Let's get your financial profile set up so you can start tracking your money efficiently.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-bold mb-1 flex items-center"><Wallet className="w-5 h-5 mr-2 text-[#990463]" /> Starting Balance</h3>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-foreground">Starting Balance</label>
                        <p className="text-xs text-muted-foreground">Enter the total money you currently have available.</p>
                        <div className="relative group">
                          <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10 group-focus-within:text-[#990463]" />
                          <Input
                            type="text"
                            inputMode="numeric"
                            required
                            placeholder="e.g. 12,000"
                            className="pl-9 h-12 bg-background/50 border-border focus-visible:ring-[#990463]"
                            value={balance}
                            onChange={(e) => handleNumberChange(e.target.value, setBalance)}
                          />
                        </div>
                      </div>

                      <div className="space-y-2 pt-4 border-t border-border/30">
                        <div className="grid grid-cols-[1fr_120px] gap-4 items-end">
                          <div className="space-y-2">
                            <label className="text-sm font-semibold text-foreground">Monthly Income</label>
                            <p className="text-xs text-muted-foreground">Your expected regular monthly income.</p>
                            <div className="relative group">
                              <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10 group-focus-within:text-[#990463]" />
                              <Input
                                type="text"
                                inputMode="numeric"
                                required
                                placeholder="e.g. 85,000"
                                className="pl-9 h-12 bg-background/50 border-border focus-visible:ring-[#990463]"
                                value={income}
                                onChange={(e) => handleNumberChange(e.target.value, setIncome)}
                              />
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <label className="text-sm font-semibold text-foreground whitespace-nowrap">Receive Date</label>
                            <p className="text-xs text-muted-foreground opacity-0">Hidden</p>
                            <div className="flex items-center space-x-2">
                              <Input
                                type="number"
                                placeholder="e.g. 1"
                                min="1"
                                max="31"
                                className="h-12 bg-background/50 border-border focus-visible:ring-[#990463] text-center"
                                value={payDate}
                                onChange={(e) => setPayDate(e.target.value)}
                              />
                            </div>
                          </div>
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-1">Optional — helps MoneyFlow track your recurring income (day of every month).</p>
                        
                        <div className="mt-4 p-3 bg-blue-500/5 border border-blue-500/20 rounded-md">
                          <p className="text-xs text-muted-foreground flex items-start">
                            <span className="mr-1.5 text-blue-500 font-bold">ⓘ</span>
                            Your monthly income will be added to your balance when the actual income transaction is recorded.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: Categories */}
                <div className="space-y-4 md:border-l border-border/50 md:pl-8">
                  <div>
                    <h3 className="text-lg font-bold mb-1">Expense Categories</h3>
                    <p className="text-sm text-muted-foreground mb-4">Select the categories you usually spend on.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {DEFAULT_CATEGORIES.map((cat) => (
                      <div
                        key={cat.id}
                        className={`flex items-center space-x-3 p-3 rounded-lg border transition-all cursor-pointer ${selectedCategories.includes(cat.label)
                          ? "border-[#990463] bg-[#990463]/5"
                          : "border-border/50 hover:bg-secondary/50"
                          }`}
                        onClick={() => toggleCategory(cat.label)}
                      >
                        <Checkbox
                          checked={selectedCategories.includes(cat.label)}
                          onCheckedChange={() => toggleCategory(cat.label)}
                          className="data-[state=checked]:bg-[#990463] data-[state=checked]:border-[#990463]"
                        />
                        <label className="text-xs font-medium leading-none cursor-pointer select-none">
                          {cat.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>

            <CardFooter className="pt-6 pb-6 px-6 bg-secondary/20 border-t border-border/50 flex justify-center">
              <Button
                type="submit"
                className="w-auto px-12 h-12 text-base font-bold cursor-pointer bg-gradient-to-r from-[#B12B30] via-[#F0C49D] to-[#990463] hover:opacity-90 text-white border-none shadow-lg transition-all hover:shadow-[0_0_20px_rgba(153,4,99,0.3)]"
                disabled={loading}
              >
                {loading ? "Setting up your profile..." : "Complete Setup & Go to Dashboard"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
