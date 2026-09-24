"use client";

import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/contexts/auth-context";
import { Mail, Lock, ArrowRight, Zap, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    await login(email, password);
  };

  return (
    <div className="w-full max-w-2xl flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-500 relative mt-8">
      <div className="relative w-full flex justify-center">
        {/* Continuous rotating dotted circles for unique login page effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[750px] pointer-events-none z-0 opacity-60 dark:opacity-40">
          <div className="absolute inset-0 border-[3px] border-dashed border-[#2563EB] rounded-full animate-[spin_40s_linear_infinite]"></div>
          <div className="absolute inset-8 border-[4px] border-dotted border-[#8B5CF6] rounded-full animate-[spin_30s_linear_infinite_reverse]"></div>
          <div className="absolute inset-16 border-[2px] border-dashed border-[#06B6D4] rounded-full animate-[spin_35s_linear_infinite]"></div>
        </div>

        {/* Animated background blobs - Blue/Purple scheme */}
        <div className="absolute top-0 -left-4 w-72 h-72 bg-[#2563EB] rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob dark:opacity-20 z-0"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-[#06B6D4] rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000 dark:opacity-20 z-0"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-[#8B5CF6] rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000 dark:opacity-20 z-0"></div>

        <Card className="aspect-square rounded-full flex flex-col justify-center p-8 sm:p-16 w-[620px] max-w-[95vw] max-h-[95vw] mx-auto border-border/50 shadow-2xl hover:shadow-[0_0_50px_rgba(139,92,246,0.25)] dark:hover:shadow-[0_0_50px_rgba(139,92,246,0.4)] animate-fade-in-up delay-100 bg-background/60 backdrop-blur-3xl relative overflow-hidden z-30 transition-all duration-700">
          <div className="absolute inset-0 bg-gradient-to-br from-[#2563EB]/5 via-[#8B5CF6]/5 to-[#06B6D4]/5 animate-color-bomb pointer-events-none" />
          <CardContent className="pt-2 relative z-10 flex flex-col items-center justify-center space-y-6 w-full">
            <div className="flex flex-col items-center space-y-1 text-center animate-fade-in-up w-full mb-2">
              <Image 
                src="/sidelogo.png" 
                alt="MoneyFlow Logo" 
                width={200} 
                height={50} 
                className="object-contain dark:invert mb-2"
                priority
              />
              <p className="text-muted-foreground font-medium text-sm px-4">
                Sign in to your MoneyFlow account
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5 w-full max-w-[320px]">
              <div className="space-y-2 animate-fade-in-up delay-200 w-full">
                <label className="text-sm font-bold text-foreground">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B5CF6] z-10 group-focus-within:animate-bounce" />
                  <Input
                    type="email"
                    placeholder="name@example.com"
                    required
                    className="pl-10 h-14 bg-background/50 backdrop-blur-sm border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-[#8B5CF6] focus-visible:border-[#8B5CF6] transition-all duration-300 hover:bg-background/80"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2 animate-fade-in-up delay-300">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-foreground">Password</label>
                  <Link href="#" className="text-sm text-[#8B5CF6] hover:text-[#2563EB] hover:opacity-80 hover:underline font-bold transition-all">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B5CF6] z-10 group-focus-within:animate-bounce" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    className="pl-10 pr-10 h-14 bg-background/50 backdrop-blur-sm border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-[#8B5CF6] focus-visible:border-[#8B5CF6] transition-all duration-300 hover:bg-background/80"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors z-10"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <div className="animate-fade-in-up delay-400 pt-4 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[#B12B30] via-[#F0C49D] to-[#990463] blur-xl animate-pulse opacity-30 dark:opacity-50 -z-10" />
                <Button type="submit" className="w-full h-14 text-lg font-black cursor-pointer bg-gradient-to-r from-[#B12B30] via-[#F0C49D] to-[#990463] hover:opacity-90 text-white dark:text-zinc-950 transition-all duration-300 overflow-hidden relative group border-none shadow-[0_4px_14px_0_rgba(177,43,48,0.39)] hover:shadow-[0_6px_20px_rgba(177,43,48,0.23)]" disabled={isLoading}>
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 dark:via-white/40 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                  {isLoading ? "Signing in..." : "Sign In"}
                  {!isLoading && <Zap className="w-5 h-5 ml-2 animate-pulse" />}
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center pt-2 pb-6 animate-fade-in-up delay-500 relative z-10">
            <p className="text-sm text-muted-foreground font-medium">
              Don't have an account?{" "}
              <Link href="/register" className="text-[#8B5CF6] hover:text-[#2563EB] hover:opacity-80 hover:underline font-bold transition-colors">
                Create one
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
