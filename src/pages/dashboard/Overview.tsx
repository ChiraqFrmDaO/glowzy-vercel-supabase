import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { CheckCircle2, MessageSquare, Pencil, User, Hash, Eye, Upload, X, Link2, FileText, Shield } from 'lucide-react';
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

const completionSteps = [
  { label: "Upload An Avatar", icon: Upload, key: "avatar" },
  { label: "Add A Description", icon: FileText, key: "description" },
  { label: "Link Discord Account", icon: MessageSquare, key: "discord" },
  { label: "Add Socials", icon: Link2, key: "socials" },
  { label: "Enable 2FA", icon: Shield, key: "2fa" },
];

interface ViewRecord {
  id: number;
  created_at: string;
  device_type: "desktop" | "mobile" | "tablet";
}

// --- Line Chart Component ---
function ProfileViewsChart({ data }: { data: ViewRecord[] }) {
  const days = 7;
  const today = new Date();
  today.setHours(23, 59, 59, 999);

  const buckets: { label: string; date: string; count: number }[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    buckets.push({
      label: d.toLocaleDateString("en-NL", { weekday: "short" }),
      date: d.toISOString().slice(0, 10),
      count: 0,
    });
  }

  data.forEach((v) => {
    const day = v.created_at.slice(0, 10);
    const bucket = buckets.find((b) => b.date === day);
    if (bucket) bucket.count++;
  });

  const maxCount = Math.max(...buckets.map((b) => b.count), 1);
  const W = 320, H = 100, padX = 24, padY = 10;
  const innerW = W - padX * 2;
  const innerH = H - padY * 2;

  const points = buckets.map((b, i) => ({
    x: padX + (i / (days - 1)) * innerW,
    y: padY + innerH - (b.count / maxCount) * innerH,
    count: b.count,
    label: b.label,
  }));

  const polyline = points.map((p) => `${p.x},${p.y}`).join(" ");
  const areaPath = `M ${points[0].x},${points[0].y} ` +
    points.slice(1).map((p) => `L ${p.x},${p.y}`).join(" ") +
    ` L ${points[points.length - 1].x},${padY + innerH} L ${points[0].x},${padY + innerH} Z`;

  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  if (data.length === 0) {
    return (
      <div className="h-32 flex items-center justify-center text-sm text-muted-foreground">
        No view data yet
      </div>
    );
  }

  return (
    <div className="relative select-none">
      <svg viewBox={`0 0 ${W} ${H + 20}`} className="w-full overflow-visible">
        {/* Grid lines */}
        {[0, 0.5, 1].map((t) => {
          const y = padY + innerH * (1 - t);
          return (
            <line key={t} x1={padX} x2={W - padX} y1={y} y2={y}
              stroke="currentColor" strokeOpacity="0.07" strokeWidth="1" />
          );
        })}

        {/* Area fill */}
        <defs>
          <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.25" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill="url(#viewsGradient)" />

        {/* Line */}
        <polyline points={polyline} fill="none"
          stroke="hsl(var(--primary))" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />

        {/* Day labels */}
        {points.map((p, i) => (
          <text key={i} x={p.x} y={H + 16} textAnchor="middle"
            fontSize="9" fill="currentColor" opacity="0.45" className="font-mono">
            {p.label}
          </text>
        ))}

        {/* Hover targets & dots */}
        {points.map((p, i) => (
          <g key={i}>
            <rect x={p.x - 16} y={padY} width={32} height={innerH + 10}
              fill="transparent"
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
              style={{ cursor: "default" }} />
            <circle cx={p.x} cy={p.y} r={hoveredIdx === i ? 4 : 2.5}
              fill={hoveredIdx === i ? "hsl(var(--primary))" : "hsl(var(--background))"}
              stroke="hsl(var(--primary))" strokeWidth="2"
              style={{ transition: "r 0.15s" }} />
            {hoveredIdx === i && (
              <g>
                <rect x={p.x - 18} y={p.y - 26} width={36} height={18} rx={4}
                  fill="hsl(var(--primary))" opacity="0.95" />
                <text x={p.x} y={p.y - 13} textAnchor="middle"
                  fontSize="10" fill="hsl(var(--primary-foreground))" fontWeight="600">
                  {p.count}
                </text>
              </g>
            )}
          </g>
        ))}
      </svg>

      {/* Total badge */}
      <div className="absolute top-0 right-0 text-xs text-muted-foreground">
        <span className="font-semibold text-foreground">{buckets.reduce((s, b) => s + b.count, 0)}</span> views
      </div>
    </div>
  );
}

// --- Donut Chart Component ---
function DeviceChart({ data }: { data: ViewRecord[] }) {
  const desktop = data.filter((v) => v.device_type === "desktop").length;
  const mobile = data.filter((v) => v.device_type === "mobile").length;
  const tablet = data.filter((v) => v.device_type === "tablet").length;
  const total = data.length;

  if (total === 0) {
    return (
      <div className="h-32 flex items-center justify-center text-sm text-muted-foreground">
        No device data yet
      </div>
    );
  }

  const segments = [
    { label: "Desktop", count: desktop, color: "hsl(var(--primary))" },
    { label: "Mobile", count: mobile, color: "hsl(var(--success, 142 76% 36%))" },
    { label: "Tablet", count: tablet, color: "hsl(var(--warning, 38 92% 50%))" },
  ].filter((s) => s.count > 0);

  const r = 50; // bigger radius
  const cx = 60; 
  const cy = 60;
  const strokeW = 18; // thicker stroke
  const circ = 2 * Math.PI * r;

  let offset = 0;
  const arcs = segments.map((s) => {
    const pct = s.count / total;
    const dash = pct * circ;
    const arc = { ...s, dash, offset, pct };
    offset += dash;
    return arc;
  });

  return (
    <div className="flex items-center gap-4">
      <svg viewBox="0 0 120 120" className="w-32 h-32 shrink-0 -rotate-90">
        {/* Track */}
        <circle cx={cx} cy={cy} r={r} fill="none"
          stroke="currentColor" strokeOpacity="0.05" strokeWidth={strokeW} />
        {arcs.map((arc, i) => (
          <circle key={i} cx={cx} cy={cy} r={r} fill="none"
            stroke={arc.color} strokeWidth={strokeW}
            strokeDasharray={`${arc.dash} ${circ - arc.dash}`}
            strokeDashoffset={-arc.offset}
            strokeLinecap="round"
          />
        ))}
      </svg>

      <div className="space-y-1.5 text-xs">
        {arcs.map((arc) => (
          <div key={arc.label} className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: arc.color }} />
            <span className="text-muted-foreground">{arc.label}</span>
            <span className="font-semibold text-foreground ml-auto pl-3">
              {arc.count} <span className="text-muted-foreground font-normal">({Math.round(arc.pct * 100)}%)</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- Main Component ---
export default function Overview() {
  const { profile, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const [showDisplayNameModal, setShowDisplayNameModal] = useState(false);
  const [usernameInput, setUsernameInput] = useState('');
  const [displayNameInput, setDisplayNameInput] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [upgradingToPremium, setUpgradingToPremium] = useState(false);
  const [viewsData, setViewsData] = useState<ViewRecord[]>([]);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);

  // Fetch analytics
  useEffect(() => {
    if (!profile?.id) return;
    const fetchAnalytics = async () => {
      setAnalyticsLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`/api/analytics/views?userId=${profile.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setViewsData(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error("Failed to fetch analytics:", err);
      } finally {
        setAnalyticsLoading(false);
      }
    };
    fetchAnalytics();
  }, [profile?.id]);

  // Handle Discord OAuth callback
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const discordConnected = urlParams.get('discord_connected');
    const discordUsername = urlParams.get('discord_username');
    const discordId = urlParams.get('discord_id');
    const discordAvatar = urlParams.get('discord_avatar');

    if (discordConnected === 'true' && discordUsername && discordId) {
      const updateDiscordConnection = async () => {
        setLoading(true);
        try {
          const token = localStorage.getItem("token");
          const resp = await fetch('/api/profiles/me/discord', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ discord_username: discordUsername, discord_id: discordId, discord_avatar: discordAvatar })
          });
          if (resp.ok) {
            await refreshProfile();
            alert('Discord connected successfully!');
            window.history.replaceState({}, document.title, window.location.pathname);
          } else {
            alert('Failed to connect Discord');
          }
        } catch (error) {
          console.error('Error connecting Discord:', error);
          alert('Error connecting Discord');
        } finally {
          setLoading(false);
        }
      };
      updateDiscordConnection();
    }
  }, [refreshProfile]);

  const isDone = (key: string) => {
    if (!profile) return false;
    switch (key) {
      case "avatar": return !!profile.avatar_url;
      case "description": return !!profile.description;
      case "discord": return profile.discord_connected;
      default: return false;
    }
  };

  const handleDiscordConnect = () => {
    window.open('https://glowzy.lol/api/auth/discord?t=' + Date.now(), '_self');
  };

  const handleDiscordDisconnect = async () => {
    try {
      const token = localStorage.getItem("token");
      const resp = await fetch('/api/auth/discord/disconnect', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      if (resp.ok) { await refreshProfile(); alert('Discord disconnected successfully!'); }
      else alert('Failed to disconnect Discord');
    } catch (error) {
      console.error('Error disconnecting Discord:', error);
      alert('Error disconnecting Discord');
    }
  };

  const handleChangeUsername = () => { setUsernameInput(profile?.username || ''); setShowUsernameModal(true); };
  const handleChangeDisplayName = () => { setDisplayNameInput(profile?.display_name || ''); setShowDisplayNameModal(true); };

  const handleUsernameSubmit = async () => {
    if (!usernameInput.trim() || usernameInput.trim().length < 3) { alert('Username must be at least 3 characters'); return; }
    setIsUpdating(true);
    try {
      const token = localStorage.getItem("token");
      const resp = await fetch('/api/profiles/me/username', {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: usernameInput.trim() })
      });
      const data = await resp.json();
      if (data.success) { await refreshProfile(); setShowUsernameModal(false); setUsernameInput(''); alert('Username updated successfully!'); }
      else alert(data.error || 'Failed to update username');
    } catch (error) { alert('Error updating username'); }
    finally { setIsUpdating(false); }
  };

  const handleDisplayNameSubmit = async () => {
    if (!displayNameInput.trim() || displayNameInput.trim().length > 50) { alert('Display name must be 1–50 characters'); return; }
    setIsUpdating(true);
    try {
      const token = localStorage.getItem("token");
      const resp = await fetch('/api/profiles/me/display-name', {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ display_name: displayNameInput.trim() })
      });
      const data = await resp.json();
      if (data.success) { await refreshProfile(); setShowDisplayNameModal(false); setDisplayNameInput(''); alert('Display name updated successfully!'); }
      else alert(data.error || 'Failed to update display name');
    } catch (error) { alert('Error updating display name'); }
    finally { setIsUpdating(false); }
  };

  const handleAccountSettings = () => navigate('/dashboard/settings');

  const handleUpgradeToPremium = async () => {
    if (profile?.is_premium) { navigate('/dashboard/premium'); return; }
    setUpgradingToPremium(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId: 'price_1Oabc123Xyz789', successUrl: `${window.location.origin}/dashboard?premium=success`, cancelUrl: `${window.location.origin}/dashboard?premium=cancelled` })
      });
      if (!response.ok) throw new Error('Failed to create checkout session');
      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      alert('Failed to start premium upgrade. Please try again.');
    } finally {
      setUpgradingToPremium(false);
    }
  };

  const completionPct = Math.round((completionSteps.filter(s => isDone(s.key)).length / completionSteps.length) * 100);

  // Last 7 days views
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);
  const recentViews = viewsData.filter(v => new Date(v.created_at) >= sevenDaysAgo);

  return (
    <div className="space-y-6 max-w-7xl">
      <h1 className="text-xl font-bold text-foreground">Account Overview</h1>

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Username", value: profile?.username || "—", sub: "Change available now", icon: Pencil },
          { label: "Alias", value: "Unavailable", sub: "Premium Only", icon: User },
          { label: "Email", value: profile?.email || "—", sub: `Joined ${profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : "—"}`, icon: Hash },
          { label: "Profile Views", value: analyticsLoading ? "..." : viewsData.length.toString(), sub: "Total all time", icon: Eye },
        ].map((card, i) => (
          <motion.div key={card.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="glass rounded-xl p-4 border border-border/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-primary">{card.label}</span>
              <card.icon className="w-4 h-4 text-muted-foreground" />
            </div>
            <p className="text-lg font-bold text-foreground truncate">{card.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{card.sub}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Account Statistics</h2>
          <div className="glass rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">Profile Completion</span>
              <span className="text-xs text-muted-foreground">{completionPct}% completed</span>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-success to-primary rounded-full transition-all" style={{ width: `${completionPct}%` }} />
            </div>
          </div>

          {completionPct < 100 && (
            <div className="glass rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-warning">⚠️</span>
                <div>
                  <p className="text-sm font-medium text-foreground">Your profile isn't complete yet!</p>
                  <p className="text-xs text-muted-foreground">Complete your profile to make it more discoverable.</p>
                </div>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {completionSteps.map((step) => (
                  <div key={step.label} className="flex items-center gap-1.5 text-xs">
                    <CheckCircle2 className={`w-4 h-4 ${isDone(step.key) ? "text-success" : "text-muted-foreground"}`} />
                    <span className={isDone(step.key) ? "text-foreground" : "text-muted-foreground"}>{step.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <h2 className="text-lg font-semibold text-foreground">
            Account Analytics
            <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">View More</span>
          </h2>

          <div className="grid grid-cols-2 gap-4">
            {/* Profile Views Line Chart */}
            <div className="glass rounded-xl p-4">
              <p className="text-sm font-medium text-foreground mb-3">
                Profile Views <span className="text-muted-foreground text-xs">last 7 days </span>
              </p>
              {analyticsLoading ? (
                <div className="h-32 flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                </div>
              ) : (
                <ProfileViewsChart data={recentViews} />
              )}
            </div>

            {/* Device Donut Chart */}
            <div className="glass rounded-xl p-4">
              <p className="text-sm font-medium text-foreground mb-3">
                Visitor Devices <span className="text-muted-foreground text-xs">all time</span>
              </p>
              {analyticsLoading ? (
                <div className="h-32 flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                </div>
              ) : (
                <DeviceChart data={viewsData} />
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="glass rounded-xl p-4">
            <h3 className="text-sm font-semibold text-foreground mb-1">Manage your account</h3>
            <p className="text-xs text-muted-foreground mb-3">Change your email, username and more.</p>
            <div className="space-y-1">
              {[
                { icon: Pencil, label: "Change Username", onClick: handleChangeUsername },
                { icon: User, label: "Change Display Name", onClick: handleChangeDisplayName },
                { icon: "💎", label: profile?.is_premium ? "Premium Active" : "Want more? Unlock with Premium", onClick: handleUpgradeToPremium, disabled: upgradingToPremium },
                { icon: "⚙️", label: "Account Settings", onClick: handleAccountSettings },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={item.onClick}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-colors ${
                    item.label === "Account Settings" || item.label.includes("Premium")
                      ? "text-white hover:bg-white/10"
                      : "text-foreground hover:bg-muted"
                  }`}
                >
                  {typeof item.icon === "string" ? <span>{item.icon}</span> : <item.icon className="w-3.5 h-3.5" />}
                  {item.label}
                  {upgradingToPremium && item.label.includes("Premium") && (
                    <div className="w-3 h-3 border-2 border-primary/30 border-t-transparent rounded-full animate-spin ml-2" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="glass rounded-xl p-4">
            <h3 className="text-sm font-semibold text-foreground mb-1">Connections</h3>
            <p className="text-xs text-muted-foreground mb-3">Link your Discord account to Glowzy.lol</p>
            <div className="flex items-center gap-2">
              {profile?.discord_connected ? (
                <>
                  <button className="flex-1 flex items-center gap-2 px-3 py-2 rounded-lg bg-success/10 text-success text-xs border border-success/20">
                    <MessageSquare className="w-3.5 h-3.5" /> {profile.discord_username || 'Discord'} Connected
                  </button>
                  <button onClick={handleDiscordDisconnect} className="p-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors">✕</button>
                </>
              ) : (
                <a
                  href={`https://glowzy.lol/api/auth/discord?t=${Date.now()}`}
                  className="flex-1 flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 text-primary text-xs border border-primary/20 hover:bg-primary/20 transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" /> Connect Discord
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Username Modal */}
      {showUsernameModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="glass rounded-2xl p-6 w-full max-w-md mx-4 relative">
            <button onClick={() => setShowUsernameModal(false)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-semibold text-foreground mb-4 pr-8">Change Username</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">New Username</label>
                <input type="text" value={usernameInput} onChange={(e) => setUsernameInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleUsernameSubmit()}
                  className="w-full px-3 py-2 rounded-lg bg-muted border border-border focus:border-primary focus:outline-none transition-colors"
                  placeholder="Enter new username" minLength={3} maxLength={30} />
                <p className="text-xs text-muted-foreground mt-1">Minimum 3 characters, maximum 30 characters</p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowUsernameModal(false)} className="flex-1 px-4 py-2 rounded-lg bg-muted text-foreground hover:bg-muted/80 transition-colors">Cancel</button>
                <button onClick={handleUsernameSubmit} disabled={isUpdating || !usernameInput.trim() || usernameInput.trim().length < 3}
                  className="flex-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  {isUpdating ? 'Updating...' : 'Update Username'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Display Name Modal */}
      {showDisplayNameModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="glass rounded-2xl p-6 w-full max-w-md mx-4 relative">
            <button onClick={() => setShowDisplayNameModal(false)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-semibold text-foreground mb-4 pr-8">Change Display Name</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">New Display Name</label>
                <input type="text" value={displayNameInput} onChange={(e) => setDisplayNameInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleDisplayNameSubmit()}
                  className="w-full px-3 py-2 rounded-lg bg-muted border border-border focus:border-primary focus:outline-none transition-colors"
                  placeholder="Enter new display name" maxLength={50} />
                <p className="text-xs text-muted-foreground mt-1">Maximum 50 characters</p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowDisplayNameModal(false)} className="flex-1 px-4 py-2 rounded-lg bg-muted text-foreground hover:bg-muted/80 transition-colors">Cancel</button>
                <button onClick={handleDisplayNameSubmit} disabled={isUpdating || !displayNameInput.trim()}
                  className="flex-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  {isUpdating ? 'Updating...' : 'Update Display Name'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
