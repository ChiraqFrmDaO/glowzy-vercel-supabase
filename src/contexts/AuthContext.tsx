import React, { createContext, useContext, useState, useEffect } from "react";

// simple user type for our own JWT-based auth
interface User {
  id: string;
  email: string | null;
}

interface Profile {
  id: string;
  user_id: string;
  username: string;
  display_name: string | null;
  email: string | null;
  avatar_url: string | null;
  description: string | null;
  location: string | null;
  is_premium: boolean;
  discord_connected: boolean;
  discord_username: string | null;
  discord_avatar_url: string | null;
  subscription_cancelled?: boolean;
  cancel_at?: number;
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  setProfile: (profile: Profile | null) => void;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error: string | null }>;
  register: (username: string, email: string, password: string) => Promise<{ error: string | null }>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    
    const resp = await fetch(`/api/profiles/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("Profile response status:", resp.status);
    if (resp.ok) {
      const data = await resp.json();
      console.log("Profile data:", data);
      setProfile(data as Profile);
    } else {
      console.error("Profile fetch failed:", await resp.text());
    }
  };

  const ensureProfile = async (userId: string, email: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    
    try {
      const resp = await fetch('/api/ensure-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          username: email?.split('@')[0] || 'user' + userId,
          email 
        })
      });
      
      const result = await resp.json();
      console.log("Ensure profile result:", result);
    } catch (error) {
      console.error("Ensure profile error:", error);
    }
  };

  const refreshProfile = async () => {
    if (user) await fetchProfile();
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        console.log("Token payload:", payload);
        setUser({ id: payload.sub, email: payload.email || null });
        fetchProfile();
        setLoading(false);
      } catch (e) {
        console.warn("invalid token", e);
        // Clear invalid token
        localStorage.removeItem("token");
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const resp = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!resp.ok) {
      const error = await resp.text();
      return { error };
    }
    const { token } = await resp.json();
    localStorage.setItem("token", token);
    const payload = JSON.parse(atob(token.split(".")[1]));
    console.log("Login token payload:", payload);
    setUser({ id: payload.sub, email });
    await fetchProfile();
    return { error: null };
  };

  const register = async (username: string, email: string, password: string) => {
    const resp = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });
    if (!resp.ok) {
      const error = await resp.text();
      return { error };
    }
    const { token } = await resp.json();
    localStorage.setItem("token", token);
    const payload = JSON.parse(atob(token.split(".")[1]));
    console.log("Register token payload:", payload);
    setUser({ id: payload.sub, email });
    await fetchProfile();
    return { error: null };
  };

  const logout = async () => {
    localStorage.removeItem("token");
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        setProfile,
        isAuthenticated: !!user,
        loading,
        login,
        register,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
