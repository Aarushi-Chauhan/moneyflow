"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  ArrowRightLeft,
  PieChart,
  Wallet,
  Tags,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/contexts/auth-context";

const navSections = [
  {
    label: "Overview",
    items: [
      { name: "Dashboard", href: "/", icon: LayoutDashboard },
      { name: "MoneyFlow AI", href: "/ai", icon: Sparkles },
    ],
  },
  {
    label: "Manage",
    items: [
      { name: "Transactions", href: "/transactions", icon: ArrowRightLeft },
      { name: "Budgets", href: "/budgets", icon: Wallet },
      { name: "Categories", href: "/categories", icon: Tags },
    ],
  },
  {
    label: "Insights",
    items: [{ name: "Analytics", href: "/analytics", icon: PieChart }],
  },
  {
    label: "System",
    items: [{ name: "Settings", href: "/settings", icon: Settings }],
  },
];

interface SidebarProps {
  isMobile?: boolean;
  forceOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isMobile, forceOpen, onClose }: SidebarProps = {}) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [isCollapsedState, setIsCollapsed] = useState(false);

  const isCollapsed = forceOpen ? false : isCollapsedState;

  return (
    <aside
      className={cn(
        "flex flex-col border-r border-border/50 bg-gradient-to-b from-background to-primary/5 dark:to-primary/10 h-screen sticky top-0 transition-all duration-300 z-20 backdrop-blur-xl",
        isMobile ? "w-full border-none" : "hidden md:flex",
        !isMobile && (isCollapsed ? "w-20" : "w-64")
      )}
    >
      <div className={cn("h-16 flex items-center border-b border-border/50 relative", isCollapsed ? "justify-center" : "justify-between pl-2 pr-1")}>
        <div className={cn("flex items-center h-full", isCollapsed ? "justify-center w-full" : "flex-1")}>
          <Image
            src={isCollapsed ? "/sidelogo.png" : "/logo.png"}
            alt="MoneyFlow Logo"
            width={isCollapsed ? 60 : 300}
            height={isCollapsed ? 54 : 64}
            className={cn("object-contain dark:invert", isCollapsed ? "w-full h-[80%] object-center" : "w-full h-[100%] object-left")}
            priority
          />
        </div>
        {!isMobile && (
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={cn(
              "p-1.5 rounded-md text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors hidden md:flex items-center justify-center",
              isCollapsed ? "absolute -right-3 top-1/2 -translate-y-1/2 bg-background border border-border/50 shadow-sm z-50 rounded-full" : ""
            )}
          >
            {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={18} />}
          </button>
        )}
      </div>

      <nav className="flex-1 px-3 py-6 space-y-6 overflow-y-auto overflow-x-hidden">
        {navSections.map((section, idx) => (
          <div key={idx}>
            {!isCollapsed && (
              <h4 className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {section.label}
              </h4>
            )}
            <div className="space-y-1">
              {section.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={onClose}
                    title={isCollapsed ? item.name : undefined}
                    className={cn(
                      "flex items-center space-x-3 px-3 py-2.5 transition-all duration-300 text-sm font-medium group relative overflow-hidden",
                      isActive
                        ? "text-white font-semibold shadow-md shadow-primary/20 rounded-full bg-gradient-to-r from-[#990463] via-[#F0C49D] to-[#B12B30] bg-[length:200%_200%] animate-gradient-x"
                        : "text-muted-foreground hover:bg-primary/10 hover:text-primary hover:translate-x-1 rounded-full"
                    )}
                  >
                    <item.icon
                      className={cn("w-5 h-5 flex-shrink-0 transition-transform duration-300 group-hover:scale-110", isActive && "text-white")}
                    />
                    {!isCollapsed && <span className="relative z-10">{item.name}</span>}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

    </aside>
  );
}
