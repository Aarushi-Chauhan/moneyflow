"use client";

import { Menu, LogOut, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/contexts/auth-context";
import { usePathname } from "next/navigation";
import { Fragment } from "react";

interface HeaderProps {
  onMenuClick?: () => void;
}

const getBreadcrumbs = (pathname: string) => {
  if (pathname === "/") return ["Overview", "Dashboard"];
  if (pathname === "/ai") return ["Overview", "MoneyFlow AI"];
  
  if (pathname === "/transactions") return ["Manage", "Transactions"];
  if (pathname === "/budgets") return ["Manage", "Budgets"];
  if (pathname === "/categories") return ["Manage", "Categories"];
  
  if (pathname === "/analytics") return ["Insights", "Analytics"];
  if (pathname === "/settings") return ["System", "Settings"];
  
  const path = pathname.split('/')[1];
  const formattedPath = path ? path.charAt(0).toUpperCase() + path.slice(1) : "";
  return ["Overview", formattedPath];
};

export function Header({ onMenuClick }: HeaderProps) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const breadcrumbs = getBreadcrumbs(pathname);

  return (
    <header className="h-16 border-b border-border/50 bg-background/70 backdrop-blur-xl flex items-center justify-between px-4 md:px-8 sticky top-0 z-10 transition-colors duration-300 relative">
      {/* Animated subtle gradient background overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#990463]/10 via-[#B12B30]/5 to-[#F0C49D]/10 animate-gradient-x bg-[length:200%_200%] pointer-events-none -z-10" />
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden mr-2 hover:bg-primary/10 hover:text-primary transition-colors"
          onClick={onMenuClick}
        >
          <Menu className="w-5 h-5" />
        </Button>
        <div className="flex items-center text-sm md:text-lg font-semibold tracking-tight">
          {breadcrumbs.map((crumb, index) => (
            <Fragment key={crumb}>
              {index > 0 && <ChevronRight className="w-4 h-4 mx-1 md:mx-2 text-muted-foreground flex-shrink-0" />}
              <span className={index === breadcrumbs.length - 1 
                ? "bg-gradient-to-r from-[#990463] via-[#B12B30] to-[#F0C49D] text-transparent bg-clip-text animate-gradient-x bg-[length:200%_200%] drop-shadow-sm font-extrabold text-base md:text-xl" 
                : "text-muted-foreground"
              }>
                {crumb}
              </span>
            </Fragment>
          ))}
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <ThemeToggle />
        
        {/* User Profile Hover Dropdown */}
        <div className="relative group/profile pt-2 pb-2">
          <div className="w-9 h-9 rounded-full cursor-pointer bg-gradient-to-br from-[#990463] to-[#B12B30] shadow-lg shadow-primary/30 flex items-center justify-center text-white font-bold flex-shrink-0 relative overflow-hidden group">
            <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
            {user?.name?.charAt(0) || "U"}
          </div>
          
          <div className="absolute right-0 top-full w-56 rounded-xl border border-border/50 bg-card p-2 shadow-2xl opacity-0 invisible translate-y-2 group-hover/profile:opacity-100 group-hover/profile:visible group-hover/profile:translate-y-0 transition-all duration-200 z-50 flex flex-col">
            <div className="px-3 py-2 border-b border-border/50 mb-1">
              <p className="text-sm font-semibold truncate">{user?.name || "User"}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email || "user@example.com"}</p>
            </div>
            <button
              onClick={logout}
              className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors w-full text-left"
            >
              <LogOut className="w-4 h-4 flex-shrink-0" />
              <span>Log out</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
