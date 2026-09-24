"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";
import { api } from "@/lib/api";

interface User {
  id: number;
  name: string;
  email: string;
  avatar_url?: string;
  setup_completed: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  refreshUser: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const refreshUser = async () => {
    const userData = await api.get('/auth/me');
    setUser(userData || null);
  };

  useEffect(() => {
    async function checkAuth() {
      try {
        const userData = await api.get('/auth/me');
        if (userData) {
          setUser(userData);
        }
      } catch (err) {
        // Not authenticated
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const data = await api.post('/auth/login', { email, password });
      setUser(data);
      toast.success("Welcome back!", {
        description: "You have successfully signed in.",
      });
      if (data && data.setup_completed === false) {
        router.push("/setup");
      } else {
        router.push("/");
      }
    } catch (err: any) {
      toast.error("Login Failed", {
        description: err.message || "Invalid credentials.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const data = await api.post('/auth/register', { name, email, password });
      // Registration successful, but they need to log in to get the cookie usually,
      // Or we can log them in automatically. The backend doesn't set cookie on register.
      // Wait, our backend register DOES NOT set cookie, it just creates the user.
      toast.success("Account created successfully!", {
        description: "Welcome to MoneyFlow. Please sign in.",
      });
      router.push("/login");
    } catch (err: any) {
      toast.error("Registration Failed", {
        description: err.message || "Unable to create account.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await api.post('/auth/logout', {});
      setUser(null);
      toast.info("Logged out", {
        description: "You have been signed out of your account.",
      });
      router.push("/login");
    } catch (err: any) {
      toast.error("Logout Failed", { description: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, refreshUser, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
