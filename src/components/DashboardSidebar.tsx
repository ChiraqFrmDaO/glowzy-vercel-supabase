import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  User, BarChart3, Shield, Settings, Palette, Link2, Crown, Image, LayoutGrid,
  HelpCircle, ExternalLink, Share2, MoreHorizontal, LogOut, Home, MessageSquare,
  Dice1, Copy, Check, X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function DashboardSidebar() {
  try {
    const { user, profile, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const navItems = [
      { label: "Account", icon: User, path: "/dashboard", hasSubmenu: true, submenu: [
        { label: "Overview", path: "/dashboard" },
        { label: "Analytics", path: "/dashboard/analytics" },
        { label: "Badges", path: "/dashboard/badges" },
        { label: "Settings", path: "/dashboard/settings" },
      ]},
      { label: "Customize", icon: Palette, path: "/dashboard/customize" },
      { label: "Links", icon: Link2, path: "/dashboard/links" },
      { label: "Premium", icon: Crown, path: "/dashboard/premium" },
      { label: "Image Host", icon: Image, path: "/dashboard/image-host" },
      { label: "Templates", icon: LayoutGrid, path: "/dashboard/templates" },
      { label: "Games", icon: Dice1, path: "/casino", hasSubmenu: true, submenu: [
        { label: "Enter Casino", path: "/casino" },
      ]},
    ];

    const [accountOpen, setAccountOpen] = useState(
      location.pathname === "/dashboard" ||
      location.pathname.startsWith("/dashboard/analytics") ||
      location.pathname.startsWith("/dashboard/badges") ||
      location.pathname.startsWith("/dashboard/settings")
    );

    const [gamesOpen, setGamesOpen] = useState(
      location.pathname === "/casino" || location.pathname.startsWith("/casino")
    );

    const [quickMenu, setQuickMenu] = useState(false);
    const [shareModal, setShareModal] = useState(false);
    const [copied, setCopied] = useState(false);

    const isActive = (path: string) => location.pathname === path;
    const isAccountActive = location.pathname === "/dashboard" ||
      location.pathname.startsWith("/dashboard/analytics") ||
      location.pathname.startsWith("/dashboard/badges") ||
      location.pathname.startsWith("/dashboard/settings");

    const isGamesActive = location.pathname === "/casino" || location.pathname.startsWith("/casino");

    const handleLogout = async () => {
      await logout();
      navigate("/");
    };

    const profileUrl = `https://glowzy.lol/${profile?.username || user?.email?.split('@')[0]}`;

    const handleCopy = async () => {
      await navigator.clipboard.writeText(profileUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };

    return (
      <aside className="w-52 min-h-screen bg-sidebar border-r border-sidebar-border flex flex-col fixed left-0 top-0 z-30">
        <div className="p-4 flex items-center gap-2">
          <img src="/logo.svg" alt="Logo" className="w-7 h-7 rounded-lg object-contain" />
          <span className="font-bold text-foreground text-lg">Glowzy.lol</span>
        </div>

        <nav className="flex-1 px-2 py-2 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            if (item.hasSubmenu) {
              const open = item.label === "Games" ? gamesOpen : accountOpen;
              const active = item.label === "Games" ? isGamesActive : isAccountActive;
              const toggle = item.label === "Games"
                ? () => setGamesOpen(!gamesOpen)
                : () => setAccountOpen(!accountOpen);

              return (
                <div key={item.label}>
                  <button
                    onClick={toggle}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                      active ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                    <motion.span animate={{ rotate: open ? 180 : 0 }} className="ml-auto text-xs">▾</motion.span>
                  </button>
                  {open && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} className="ml-7 mt-1 space-y-0.5">
                      {item.submenu!.map((sub) => (
                        <NavLink key={`${sub.label}-${sub.path}`} to={sub.path} end={sub.path === "/dashboard"}
                          className={({ isActive: active }) => `block px-3 py-1.5 rounded-md text-xs transition-all ${active ? "text-foreground font-medium" : "text-sidebar-foreground hover:text-foreground"}`}
                        >
                          {sub.label}
                        </NavLink>
                      ))}
                    </motion.div>
                  )}
                </div>
              );
            }
            return (
              <NavLink key={`${item.label}-${item.path}`} to={item.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                  isActive(item.path) ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="p-3 space-y-2 border-t border-sidebar-border">
          <div className="text-xs text-muted-foreground px-2">Have a question or need support?</div>
          {/* FIX: Help Center → Discord */}
          <button
            onClick={() => window.open("https://discord.gg/sW6dkCGD48", "_blank")}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 text-primary text-xs hover:bg-primary/20 transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5" /> Help Center
          </button>
          <div className="text-xs text-muted-foreground px-2">Check out your page</div>
          <NavLink to={`/${profile?.username || user?.email?.split('@')[0]}`}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-sidebar-accent text-xs text-sidebar-foreground hover:bg-sidebar-accent/80 transition-colors">
            <ExternalLink className="w-3.5 h-3.5" /> My Page
          </NavLink>
          {/* FIX: Share Your Profile → copy modal */}
          <button
            onClick={() => setShareModal(true)}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-500/10 text-blue-400 text-xs hover:bg-blue-500/20 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" /> Share Your Profile
          </button>

          <div className="flex items-center gap-2 px-2 py-2 relative">
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground overflow-hidden">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
              ) : (
                profile?.username?.charAt(0).toUpperCase() || "?"
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-foreground truncate">{profile?.username || user?.email?.split('@')[0] || "Loading..."}</p>
              <p className="text-[10px] text-muted-foreground">{user?.id || "Loading..."}</p>
            </div>
            <button onClick={() => setQuickMenu(!quickMenu)} className="text-muted-foreground hover:text-foreground transition-colors">
              <MoreHorizontal className="w-4 h-4" />
            </button>

            {quickMenu && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="absolute bottom-full left-0 mb-2 w-52 glass rounded-xl p-3 space-y-1 shadow-xl z-50">
                <div className="text-sm font-semibold text-foreground mb-1">Quick Menu</div>
                <NavLink to="/" className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-foreground hover:bg-muted transition-colors">
                  <Home className="w-3.5 h-3.5" /> Home
                </NavLink>
                <button onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" /> Logout
                </button>
              </motion.div>
            )}
          </div>
        </div>

        {/* Share Modal */}
        <AnimatePresence>
          {shareModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
              onClick={() => setShareModal(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 w-full max-w-sm mx-4 relative"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setShareModal(false)}
                  className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-2 mb-1">
                  <Share2 className="w-4 h-4 text-blue-400" />
                  <h3 className="text-sm font-semibold text-foreground">Share Your Profile</h3>
                </div>
                <p className="text-xs text-muted-foreground mb-4">Copy your profile link and share it anywhere.</p>
                <div className="flex items-center gap-2 bg-muted rounded-lg px-3 py-2">
                  <span className="flex-1 text-xs text-foreground truncate">{profileUrl}</span>
                  <button
                    onClick={handleCopy}
                    className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
                  >
                    {copied
                      ? <Check className="w-4 h-4 text-green-400" />
                      : <Copy className="w-4 h-4" />
                    }
                  </button>
                </div>
                {copied && (
                  <p className="text-xs text-green-400 mt-2 text-center">Copied to clipboard!</p>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </aside>
    );
  } catch (error) {
    console.error('DashboardSidebar error:', error);
    return <div className="text-red-500 p-4">Error loading navigation</div>;
  }
}
