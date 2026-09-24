"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";

import { SetupModal } from "./setup-modal";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !user && !pathname.startsWith("/login") && !pathname.startsWith("/register")) {
      router.replace("/login");
    }
  }, [user, isLoading, router, pathname]);

  if (isLoading) {
    // Return a subtle loading state while checking auth
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin opacity-50" />
      </div>
    );
  }

  // If not loading and no user (and not on an auth page), don't render children to prevent flash of content
  if (!user && !pathname.startsWith("/login") && !pathname.startsWith("/register")) {
    return null;
  }

  const needsSetup = user && user.setup_completed === false;
  if (needsSetup) {
    return <SetupModal />;
  }

  return <>{children}</>;
}
