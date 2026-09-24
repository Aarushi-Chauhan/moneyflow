"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { User, Settings, Palette, Bell, Shield, Sparkles, Database, AlertTriangle, Menu } from "lucide-react";
import { cn } from "@/lib/utils";

// Settings Components
import { ProfileSettings } from "@/components/settings/profile-settings";
import { PreferencesSettings } from "@/components/settings/preferences-settings";
import { AppearanceSettings } from "@/components/settings/appearance-settings";
import { NotificationSettings } from "@/components/settings/notification-settings";
import { SecuritySettings } from "@/components/settings/security-settings";
import { AISettings } from "@/components/settings/ai-settings";
import { DataPrivacySettings } from "@/components/settings/data-privacy-settings";
import { DangerZone } from "@/components/settings/danger-zone";

type SettingSection = 
  | "profile" 
  | "preferences" 
  | "appearance" 
  | "notifications" 
  | "security" 
  | "ai" 
  | "data" 
  | "danger";

const SETTINGS_NAV = [
  { id: "profile", label: "Profile", icon: User, group: "Account", destructive: false },
  { id: "preferences", label: "Preferences", icon: Settings, group: "General", destructive: false },
  { id: "appearance", label: "Appearance", icon: Palette, group: "General", destructive: false },
  { id: "notifications", label: "Notifications", icon: Bell, group: "General", destructive: false },
  { id: "security", label: "Security", icon: Shield, group: "Security", destructive: false },
  { id: "ai", label: "MoneyFlow AI", icon: Sparkles, group: "MoneyFlow", destructive: false },
  { id: "data", label: "Data & Privacy", icon: Database, group: "Account", destructive: false },
  { id: "danger", label: "Danger Zone", icon: AlertTriangle, group: "Account", destructive: true },
] as const;

export default function SettingsPage() {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState<SettingSection>("profile");

  const renderActiveSection = () => {
    switch (activeSection) {
      case "profile": return <ProfileSettings />;
      case "preferences": return <PreferencesSettings />;
      case "appearance": return <AppearanceSettings />;
      case "notifications": return <NotificationSettings />;
      case "security": return <SecuritySettings />;
      case "ai": return <AISettings />;
      case "data": return <DataPrivacySettings />;
      case "danger": return <DangerZone />;
      default: return <ProfileSettings />;
    }
  };

  return (
    <div className="space-y-6 lg:space-y-8 animate-in fade-in-0 duration-500 pb-12 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-border/50">
        <div>
          <h2 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground">
            My Account
          </h2>
          <p className="text-muted-foreground mt-1">
            Manage your profile, preferences, security and MoneyFlow experience.
          </p>
        </div>
        <div className="hidden md:flex items-center gap-3 bg-secondary/30 px-4 py-2 rounded-lg border border-border/50">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs text-primary font-bold">
            {user?.name?.charAt(0) || "U"}
          </div>
          <div>
            <p className="text-sm font-medium leading-none">{user?.name || "Admin"}</p>
            <p className="text-xs text-muted-foreground mt-1">{user?.email || "admin@frenzofinserv.com"}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Mobile Navigation Dropdown (Visible only on small screens) */}
        <div className="w-full md:hidden">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
            Settings Menu
          </label>
          <div className="relative">
            <select
              value={activeSection}
              onChange={(e) => setActiveSection(e.target.value as SettingSection)}
              className="w-full h-12 bg-secondary/30 border border-input rounded-xl px-4 appearance-none focus:outline-none focus:ring-2 focus:ring-primary text-sm font-medium"
            >
              {SETTINGS_NAV.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
            <Menu className="absolute right-4 top-3.5 w-5 h-5 text-muted-foreground pointer-events-none" />
          </div>
        </div>

        {/* Desktop Navigation Sidebar (Visible only on md+ screens) */}
        <div className="hidden md:flex flex-col w-64 shrink-0 space-y-6 sticky top-24">
          <div className="space-y-1">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2">Account</h4>
            {SETTINGS_NAV.filter(item => item.group === "Account" && !item.destructive).map(item => (
              <NavButton 
                key={item.id} 
                item={item} 
                isActive={activeSection === item.id} 
                onClick={() => setActiveSection(item.id as SettingSection)} 
              />
            ))}
          </div>
          
          <div className="space-y-1">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2">General</h4>
            {SETTINGS_NAV.filter(item => item.group === "General").map(item => (
              <NavButton 
                key={item.id} 
                item={item} 
                isActive={activeSection === item.id} 
                onClick={() => setActiveSection(item.id as SettingSection)} 
              />
            ))}
          </div>

          <div className="space-y-1">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2">Security</h4>
            {SETTINGS_NAV.filter(item => item.group === "Security").map(item => (
              <NavButton 
                key={item.id} 
                item={item} 
                isActive={activeSection === item.id} 
                onClick={() => setActiveSection(item.id as SettingSection)} 
              />
            ))}
          </div>

          <div className="space-y-1">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2">MoneyFlow</h4>
            {SETTINGS_NAV.filter(item => item.group === "MoneyFlow").map(item => (
              <NavButton 
                key={item.id} 
                item={item} 
                isActive={activeSection === item.id} 
                onClick={() => setActiveSection(item.id as SettingSection)} 
              />
            ))}
          </div>

          <div className="pt-4 border-t border-border/50">
            {SETTINGS_NAV.filter(item => item.destructive).map(item => (
              <NavButton 
                key={item.id} 
                item={item} 
                isActive={activeSection === item.id} 
                onClick={() => setActiveSection(item.id as SettingSection)} 
              />
            ))}
          </div>
        </div>

        {/* Active Content Area */}
        <div className="flex-1 w-full min-w-0">
          <div className="max-w-3xl">
            {renderActiveSection()}
          </div>
        </div>
      </div>
    </div>
  );
}

function NavButton({ item, isActive, onClick }: { item: any, isActive: boolean, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
        isActive
          ? item.destructive 
            ? "bg-destructive/10 text-destructive font-semibold"
            : "bg-primary/10 text-primary font-semibold"
          : item.destructive
            ? "text-muted-foreground hover:bg-destructive/5 hover:text-destructive"
            : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
      )}
    >
      <item.icon className={cn("w-4 h-4", isActive && !item.destructive ? "text-primary" : "")} />
      <span>{item.label}</span>
    </button>
  );
}
