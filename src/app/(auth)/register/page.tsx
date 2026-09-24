"use client";

import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/contexts/auth-context";
import { User, Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { register, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) return;
    await register(name, email, password);
  };

  return (
    <div className="space-y-6 w-full max-w-md animate-in fade-in zoom-in-95 duration-500 relative">
      <div className="flex flex-col items-center space-y-2 text-center animate-fade-in-up">
        <div className="relative z-30">
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground drop-shadow-[0_0_10px_rgba(16,185,129,0.2)]">Create account</h1>
          <p className="text-muted-foreground mt-2 font-medium">
            Join MoneyFlow to manage your finances
          </p>
        </div>
      </div>

      <div className="relative">
        {/* Animated background blobs */}
        <div className="absolute top-0 -left-4 w-72 h-72 bg-[#990463] rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob dark:opacity-20 z-0"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-[#F0C49D] rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000 dark:opacity-20 z-0"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-[#B12B30] rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000 dark:opacity-20 z-0"></div>

        <Card className="border-border/50 shadow-2xl hover:shadow-[0_0_50px_rgba(153,4,99,0.2)] dark:hover:shadow-[0_0_50px_rgba(153,4,99,0.4)] animate-fade-in-up delay-100 bg-background/60 backdrop-blur-3xl relative overflow-hidden z-30 transition-all duration-500 hover:scale-[1.01] hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-[#B12B30]/5 via-[#990463]/5 to-[#F0C49D]/5 animate-color-bomb pointer-events-none" />
          <CardContent className="pt-8 relative z-10">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2 animate-fade-in-up delay-200">
                <label className="text-sm font-bold text-foreground">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9D3067] z-10 group-focus-within:animate-bounce" />
                  <Input
                    type="text"
                    placeholder="John Doe"
                    required
                    className="pl-10 h-14 bg-background/50 backdrop-blur-sm border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-[#990463] focus-visible:border-[#990463] transition-all duration-300 hover:bg-background/80"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2 animate-fade-in-up delay-300">
                <label className="text-sm font-bold text-foreground">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9D3067] z-10 group-focus-within:animate-bounce" />
                  <Input
                    type="email"
                    placeholder="name@example.com"
                    required
                    className="pl-10 h-14 bg-background/50 backdrop-blur-sm border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-[#990463] focus-visible:border-[#990463] transition-all duration-300 hover:bg-background/80"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2 animate-fade-in-up delay-400">
                <label className="text-sm font-bold text-foreground">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9D3067] z-10 group-focus-within:animate-bounce" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    className="pl-10 pr-10 h-14 bg-background/50 backdrop-blur-sm border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-[#990463] focus-visible:border-[#990463] transition-all duration-300 hover:bg-background/80"
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
              <div className="animate-fade-in-up delay-500 pt-4 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[#B12B30] via-[#F0C49D] to-[#990463] blur-xl animate-pulse opacity-30 dark:opacity-50 -z-10" />
                <Button type="submit" className="w-full h-14 text-lg font-black bg-gradient-to-r from-[#B12B30] via-[#F0C49D] to-[#990463] hover:opacity-90 text-white dark:text-zinc-950 transition-all duration-300 overflow-hidden relative group border-none shadow-[0_4px_14px_0_rgba(177,43,48,0.39)] hover:shadow-[0_6px_20px_rgba(177,43,48,0.23)]" disabled={isLoading}>
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 dark:via-white/40 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                  {isLoading ? "Creating account..." : "Sign Up"}
                  {!isLoading && <ArrowRight className="w-5 h-5 ml-2 animate-pulse" />}
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center border-t border-border/50 p-6 bg-secondary/30 rounded-b-xl animate-fade-in-up delay-[600ms] relative z-10">
            <p className="text-sm text-muted-foreground font-medium">
              Already have an account?{" "}
              <Link href="/login" className="text-[#9D3067] hover:opacity-80 hover:underline font-bold transition-all">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
