import React, { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { useNavigate, useLocation } from "react-router";
import toast from "react-hot-toast";
import { BACKENDAPI } from "~/utils";

// Define types
interface User {
  id: number;
  email: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (token: string) => void;
  logout: () => void;
}

// Create context
const AuthContext = createContext<AuthContextType | null>(null);

// Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch current user if token exists
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setLoading(false);
      return;
    }
    const fetchMe = async () => {
      try {
        const res = await fetch(`${BACKENDAPI}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Unauthorized");
        const data = await res.json();
        setUser(data);
      } catch (err) {
        localStorage.removeItem("access_token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    void fetchMe();
  }, []);

  // Protect routes
  useEffect(() => {
    const publicPaths = ["/login", "/register", "/"];
    if (!loading && !user && !publicPaths.includes(location.pathname)) {
      toast.error("Please login first");
      navigate("/login", { replace: true });
    }
  }, [loading, user, location.pathname, navigate]);

  const login = (token: string) => {
    localStorage.setItem("access_token", token);
    // fetch current user after login
    const fetchMeAfterLogin = async () => {
      try {
        const res = await fetch(`${BACKENDAPI}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Unauthorized");
        const data = await res.json();
        console.log("Fetched user after login:", data);
        setUser(data);
      } catch (err) {
        console.log("Error fetching user after login:", err);
        localStorage.removeItem("access_token");
        setUser(null);
      }
    };

    void fetchMeAfterLogin();
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    setUser(null);
    navigate("/login", { replace: true });
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use the context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
