import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { GripVertical, X, Link2, Type, HelpCircle, Globe, Upload } from "lucide-react";
import { toast } from "sonner";

const SOCIAL_ICONS = [
  { name: "Snapchat",      slug: "snapchat",     hex: "FFFC00", placeholder: "snapchat.com/add/..." },
  { name: "YouTube",       slug: "youtube",      hex: "FF0000", placeholder: "youtube.com/@..." },
  { name: "Discord",       slug: "discord",      hex: "5865F2", placeholder: "discord.gg/..." },
  { name: "Spotify",       slug: "spotify",      hex: "1DB954", placeholder: "open.spotify.com/user/..." },
  { name: "Instagram",     slug: "instagram",    hex: "E1306C", placeholder: "instagram.com/..." },
  { name: "X",             slug: "x",            hex: "FFFFFF", placeholder: "x.com/..." },
  { name: "TikTok",        slug: "tiktok",       hex: "FFFFFF", placeholder: "tiktok.com/@..." },
  { name: "Telegram",      slug: "telegram",     hex: "26A5E4", placeholder: "t.me/..." },
  { name: "SoundCloud",    slug: "soundcloud",   hex: "FF3300", placeholder: "soundcloud.com/..." },
  { name: "PayPal",        slug: "paypal",       hex: "003087", placeholder: "paypal.me/..." },
  { name: "GitHub",        slug: "github",       hex: "FFFFFF", placeholder: "github.com/..." },
  { name: "Roblox",        slug: "roblox",       hex: "E60012", placeholder: "roblox.com/users/..." },
  { name: "Cash App",      slug: "cashapp",      hex: "00D632", placeholder: "cash.app/$..." },
  { name: "Apple Music",   slug: "applemusic",   hex: "FC3C44", placeholder: "music.apple.com/..." },
  { name: "Gitea",         slug: "gitea",        hex: "609926", placeholder: "gitea.com/..." },
  { name: "Twitch",        slug: "twitch",       hex: "9146FF", placeholder: "twitch.tv/..." },
  { name: "Reddit",        slug: "reddit",       hex: "FF4500", placeholder: "reddit.com/u/..." },
  { name: "VK",            slug: "vk",           hex: "0077FF", placeholder: "vk.com/..." },
  { name: "Replit",        slug: "replit",       hex: "F26207", placeholder: "replit.com/@..." },
  { name: "Figma",         slug: "figma",        hex: "F24E1E", placeholder: "figma.com/@..." },
  { name: "LinkedIn",      slug: "linkedin",     hex: "0A66C2", placeholder: "linkedin.com/in/..." },
  { name: "Steam",         slug: "steam",        hex: "FFFFFF", placeholder: "steamcommunity.com/id/..." },
  { name: "Kick",          slug: "kick",         hex: "53FC18", placeholder: "kick.com/..." },
  { name: "Pinterest",     slug: "pinterest",    hex: "E60023", placeholder: "pinterest.com/..." },
  { name: "Last.fm",       slug: "lastdotfm",    hex: "D51007", placeholder: "last.fm/user/..." },
  { name: "Patreon",       slug: "patreon",      hex: "FF424D", placeholder: "patreon.com/..." },
  { name: "Ko-fi",         slug: "kofi",         hex: "FF5E5B", placeholder: "ko-fi.com/..." },
  { name: "Buy Me Coffee", slug: "buymeacoffee", hex: "FFDD00", placeholder: "buymeacoffee.com/..." },
  { name: "Facebook",      slug: "facebook",     hex: "1877F2", placeholder: "facebook.com/..." },
  { name: "Threads",       slug: "threads",      hex: "FFFFFF", placeholder: "threads.net/@..." },
  { name: "Bluesky",       slug: "bluesky",      hex: "0085FF", placeholder: "bsky.app/profile/..." },
  { name: "Bitcoin",       slug: "bitcoin",      hex: "F7931A", placeholder: "Your BTC address..." },
  { name: "Ethereum",      slug: "ethereum",     hex: "8C8C8C", placeholder: "Your ETH address..." },
  { name: "Litecoin",      slug: "litecoin",     hex: "A6A9AA", placeholder: "Your LTC address..." },
  { name: "XRP",           slug: "xrp",          hex: "0085C0", placeholder: "Your XRP address..." },
  { name: "Monero",        slug: "monero",       hex: "FF6600", placeholder: "Your XMR address..." },
  { name: "Email",         slug: "gmail",        hex: "EA4335", placeholder: "your@email.com" },
];

interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon_url?: string;
  display_order: number;
}

type SocialIcon = typeof SOCIAL_ICONS[0];
type AnyIcon = SocialIcon | { name: "Custom URL"; slug: "custom"; hex: string; placeholder: string };

const CUSTOM_ICON: AnyIcon = { name: "Custom URL", slug: "custom", hex: "1a3055", placeholder: "https://..." };

function SIIcon({ slug, hex, size = 20 }: { slug: string; hex: string; size?: number }) {
  if (slug === "custom") return <Globe size={size} color="#6b7280" />;
  return (
    <img
      src={`https://cdn.simpleicons.org/${slug}/${hex}`}
      alt={slug}
      width={size}
      height={size}
      style={{ display: "block", flexShrink: 0 }}
      onError={(e) => {
        const img = e.target as HTMLImageElement;
        img.src = `https://unpkg.com/simple-icons@latest/icons/${slug}.svg`;
        img.style.filter = "brightness(0) saturate(100%) invert(1)";
        img.onerror = () => { img.style.display = "none"; };
      }}
    />
  );
}

interface AddModalProps {
  social: AnyIcon;
  onClose: () => void;
  onConfirm: (url: string, iconUrl?: string) => void;
}

function AddModal({ social, onClose, onConfirm }: AddModalProps) {
  const [url, setUrl] = useState("");
  const [mode, setMode] = useState<"link" | "text">("link");
  const [iconPreview, setIconPreview] = useState<string | null>(null);
  const [iconUrl, setIconUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isCustom = social.name === "Custom URL";

  const handleIconUpload = async (file: File) => {
    if (!file) return;
    setUploading(true);
    // Show preview immediately
    const reader = new FileReader();
    reader.onload = (e) => setIconPreview(e.target?.result as string);
    reader.readAsDataURL(file);

    try {
      const formData = new FormData();
      formData.append("icon", file);
      const resp = await fetch("/api/link-icons/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: formData,
      });
      if (!resp.ok) throw new Error(await resp.text());
      const data = await resp.json();
      setIconUrl(data.url);
      toast.success("Icon uploaded!");
    } catch (err: any) {
      toast.error("Upload failed: " + err.message);
      setIconPreview(null);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.78)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999 }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 8 }}
        transition={{ duration: 0.16 }}
        style={{ background: "#111318", border: "1px solid #252830", borderRadius: 14, padding: "24px 24px 20px", width: 420, boxShadow: "0 24px 64px rgba(0,0,0,0.8)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <span style={{ fontWeight: 600, color: "#e8eaf0", fontSize: 15 }}>Add {social.name} Social</span>
          <button onClick={onClose} style={{ background: "transparent", border: "none", color: "#6b7280", cursor: "pointer", padding: 4, display: "flex", borderRadius: 6 }}>
            <X size={18} />
          </button>
        </div>

        {/* Icon upload — only for Custom URL */}
        {isCustom && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 13, color: "#9ca3af", marginBottom: 8, fontWeight: 500 }}>Icon</div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => { if (e.target.files?.[0]) handleIconUpload(e.target.files[0]); }}
            />
            <div
              onClick={() => fileInputRef.current?.click()}
              style={{
                background: "#1a1d24", border: "1px solid #252830",
                borderRadius: 10, padding: "20px 16px",
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                cursor: "pointer", gap: 8, transition: "border-color 0.15s",
                minHeight: 90,
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = "#3b4255")}
              onMouseLeave={e => (e.currentTarget.style.borderColor = "#252830")}
            >
              {uploading ? (
                <div style={{ width: 24, height: 24, border: "2px solid #3b82f6", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
              ) : iconPreview ? (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                  <img src={iconPreview} alt="preview" style={{ width: 48, height: 48, borderRadius: 8, objectFit: "cover" }} />
                  <span style={{ fontSize: 11, color: "#6b7280" }}>Click to change</span>
                </div>
              ) : (
                <>
                  <div style={{ width: 40, height: 40, background: "#252830", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Upload size={18} color="#6b7280" />
                  </div>
                  <span style={{ fontSize: 12, color: "#6b7280" }}>Click to upload a file</span>
                  <span style={{ fontSize: 11, color: "#3a4a5a" }}>PNG, JPG, GIF, SVG — max 2MB</span>
                </>
              )}
            </div>
          </div>
        )}

        {/* Social Mode toggle */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
            <span style={{ fontSize: 13, color: "#9ca3af", fontWeight: 500 }}>Social Mode</span>
            <HelpCircle size={13} color="#4b5563" />
          </div>
          <div style={{ display: "flex", background: "#1a1d24", border: "1px solid #252830", borderRadius: 8, padding: 3, gap: 3 }}>
            {(["link", "text"] as const).map((m) => (
              <button key={m} onClick={() => setMode(m)} style={{
                flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                padding: "8px 12px", borderRadius: 6, border: "none", cursor: "pointer",
                fontSize: 13, fontWeight: 500,
                background: mode === m ? "#252830" : "transparent",
                color: mode === m ? "#e8eaf0" : "#6b7280",
                transition: "all 0.15s",
              }}>
                {m === "link" ? <Link2 size={13} /> : <Type size={13} />}
                {m === "link" ? "Link" : "Text"}
              </button>
            ))}
          </div>
        </div>

        {/* URL input */}
        <div style={{ display: "flex", alignItems: "center", background: "#1a1d24", border: "1px solid #252830", borderRadius: 8, padding: "0 12px", marginBottom: 16 }}>
          <div style={{ marginRight: 10, flexShrink: 0, display: "flex", alignItems: "center" }}>
            {isCustom && iconPreview
              ? <img src={iconPreview} width={18} height={18} style={{ borderRadius: 4, objectFit: "cover" }} />
              : <SIIcon slug={social.slug} hex={social.hex} size={18} />
            }
          </div>
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && url.trim()) { onConfirm(url.trim(), iconUrl ?? undefined); onClose(); } }}
            placeholder={social.placeholder}
            autoFocus
            style={{ flex: 1, background: "transparent", border: "none", padding: "11px 0", color: "#c8ccd6", fontSize: 13.5, outline: "none" }}
          />
        </div>

        {/* Footer */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button
            onClick={() => { if (url.trim()) { onConfirm(url.trim(), iconUrl ?? undefined); onClose(); } }}
            style={{ background: "#e8eaf0", border: "none", borderRadius: 8, padding: "9px 22px", color: "#111318", cursor: "pointer", fontSize: 13.5, fontWeight: 600 }}
          >Add</button>
          <span style={{ fontSize: 13, color: "#4b5563", cursor: "pointer" }}>Need help?</span>
        </div>
      </motion.div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default function Links() {
  const { user } = useAuth();
  const [links, setLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editUrl, setEditUrl] = useState("");
  const [modal, setModal] = useState<AnyIcon | null>(null);

  useEffect(() => { if (user) loadLinks(); }, [user]);

  const loadLinks = async () => {
    const resp = await fetch(`/api/social-links?userId=${user!.id}`);
    if (resp.ok) setLinks(await resp.json());
    setLoading(false);
  };

  const addLink = async (platform: string, url: string, iconUrl?: string) => {
    const resp = await fetch("/api/social-links", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
      body: JSON.stringify({ user_id: user!.id, platform, url, icon_url: iconUrl, display_order: links.length }),
    });
    if (!resp.ok) { toast.error(await resp.text()); return; }
    const data = await resp.json();
    setLinks((prev) => [...prev, data]);
    toast.success(`${platform} added!`);
  };

  const saveLink = async (id: string) => {
    const resp = await fetch(`/api/social-links/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
      body: JSON.stringify({ url: editUrl }),
    });
    if (!resp.ok) toast.error(await resp.text());
    else {
      setLinks(links.map((l) => (l.id === id ? { ...l, url: editUrl } : l)));
      setEditingId(null);
      toast.success("Link saved!");
    }
  };

  const removeLink = async (id: string) => {
    const resp = await fetch(`/api/social-links/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    if (!resp.ok) toast.error(await resp.text());
    else setLinks(links.filter((l) => l.id !== id));
  };

  const getSocialMeta = (platform: string) => SOCIAL_ICONS.find((s) => s.name === platform) ?? null;

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );

  return (
    <>
      <style>{`
        .sl-icon-btn { transition: transform 0.12s, background 0.12s; }
        .sl-icon-btn:hover { transform: scale(1.1); background: #1e2436 !important; }
        .sl-link-card:hover { border-color: #2d4a7a !important; }
        .sl-action-btn:hover { color: #60a5fa !important; }
        .sl-delete-btn:hover { color: #ef4444 !important; }
        .sl-custom-btn:hover { border-color: #3b82f6 !important; }
        input::placeholder { color: #3a5272; }
      `}</style>

      <div style={{ width: "100%" }}>
        <div style={{ marginBottom: 20 }}>
          <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
            🔗 Link your social media profiles.
          </h1>
          <p className="text-sm text-muted-foreground">Pick a social media to add to your profile.</p>
        </div>

        {/* Icon grid */}
        <div style={{ background: "#0d1117", border: "1px solid #1e2433", borderRadius: 12, padding: "22px 24px", marginBottom: 24 }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {SOCIAL_ICONS.map((item) => (
              <motion.button
                key={item.name}
                className="sl-icon-btn"
                whileTap={{ scale: 0.91 }}
                onClick={() => setModal(item)}
                title={item.name}
                style={{ width: 52, height: 52, background: "#161b27", borderRadius: 11, border: "1px solid #1e2433", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}
              >
                <SIIcon slug={item.slug} hex={item.hex} size={24} />
              </motion.button>
            ))}

            {/* Custom URL button */}
            <motion.button
              whileTap={{ scale: 0.91 }}
              onClick={() => setModal(CUSTOM_ICON)}
              className="sl-custom-btn"
              style={{ display: "flex", alignItems: "center", gap: 12, background: "#161b27", border: "1px solid #1e2433", borderRadius: 11, padding: "0 18px", height: 52, cursor: "pointer", transition: "border-color 0.15s", flexShrink: 0 }}
            >
              <Globe size={20} color="#6b7280" />
              <div style={{ textAlign: "left" }}>
                <div style={{ fontWeight: 600, color: "#9ca3af", fontSize: 13 }}>Add Custom URL</div>
                <div style={{ fontSize: 11, color: "#4b5563" }}>Use your own URL and choose an icon.</div>
              </div>
            </motion.button>
          </div>
        </div>

        {/* Links list */}
        {links.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 12 }}>
            <AnimatePresence>
              {links.map((link) => {
                const meta = getSocialMeta(link.platform);
                return (
                  <motion.div key={link.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
                    <div className="sl-link-card" style={{ background: "#0d1117", border: "1px solid #1e2433", borderRadius: 10, padding: "14px 16px", display: "flex", alignItems: "flex-start", gap: 10, transition: "border-color 0.15s" }}>
                      <GripVertical style={{ color: "#2d3748", marginTop: 2, cursor: "grab", flexShrink: 0 }} size={15} />

                      {/* Icon */}
                      <div style={{ width: 38, height: 38, borderRadius: 8, background: "#161b27", border: "1px solid #1e2433", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, overflow: "hidden" }}>
                        {link.icon_url ? (
                          <img src={link.icon_url} alt="icon" width={22} height={22} style={{ objectFit: "cover", borderRadius: 4 }} />
                        ) : meta ? (
                          <SIIcon slug={meta.slug} hex={meta.hex} size={20} />
                        ) : (
                          <Globe size={18} color="#6b7280" />
                        )}
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                          <span style={{ fontSize: 13, fontWeight: 600, color: "#c8ccd6" }}>{link.platform}</span>
                          <div style={{ display: "flex", gap: 2 }}>
                            <button className="sl-action-btn"
                              onClick={() => { setEditingId(link.id); setEditUrl(link.url); }}
                              style={{ background: "transparent", border: "none", color: "#4a5568", cursor: "pointer", fontSize: 14, padding: "2px 4px", borderRadius: 4, transition: "color 0.15s" }}
                            >✏️</button>
                            <button className="sl-delete-btn"
                              onClick={() => removeLink(link.id)}
                              style={{ background: "transparent", border: "none", color: "#4a5568", cursor: "pointer", fontSize: 14, padding: "2px 4px", borderRadius: 4, transition: "color 0.15s" }}
                            >🗑️</button>
                          </div>
                        </div>
                        {editingId === link.id ? (
                          <div style={{ display: "flex", gap: 6 }}>
                            <input value={editUrl} onChange={(e) => setEditUrl(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") saveLink(link.id); }} placeholder="Enter URL..." autoFocus
                              style={{ flex: 1, background: "#0a0d14", border: "1px solid #1e2433", borderRadius: 6, padding: "6px 10px", color: "#c8ccd6", fontSize: 12, outline: "none" }} />
                            <button onClick={() => saveLink(link.id)} style={{ background: "#1d4ed8", border: "none", borderRadius: 6, padding: "6px 12px", color: "#fff", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>Save</button>
                          </div>
                        ) : (
                          <p style={{ fontSize: 12, color: "#4a5568", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", margin: 0 }}>
                            {link.url || "Click edit to add URL"}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {links.length === 0 && (
          <div style={{ textAlign: "center", padding: "48px 24px", color: "#2d3748" }}>
            <div style={{ fontSize: 36, marginBottom: 10 }}>🔗</div>
            <div style={{ fontWeight: 600, color: "#4a5568", marginBottom: 4 }}>No links yet</div>
            <div style={{ fontSize: 12 }}>Click any social icon above to add your first link</div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {modal && (
          <AddModal
            social={modal}
            onClose={() => setModal(null)}
            onConfirm={(url, iconUrl) => addLink(modal.name, url, iconUrl)}
          />
        )}
      </AnimatePresence>
    </>
  );
}