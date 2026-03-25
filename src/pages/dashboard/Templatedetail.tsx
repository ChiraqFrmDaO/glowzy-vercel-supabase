import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Star, Eye, TrendingUp, Download, Share2, User, Palette, Type, Layout, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface TemplateConfig {
  background_color?: string;
  text_color?: string;
  accent_color?: string;
  primary_color?: string;
  secondary_color?: string;
  button_style?: string;
  theme?: string;
  font_family?: string;
  border_radius?: string;
  layout?: string;
  background_effect?: string;
  username_effect?: string;
  glow_username?: boolean;
  glow_socials?: boolean;
  avatar_url?: string;
}

interface Template {
  id: number;
  name: string;
  description?: string;
  author_username: string;
  uses: number;
  download_count: number;
  trending: number;
  tags: string | string[];
  preview_image?: string;
  is_premium: boolean;
  created_at: string;
  config?: string | TemplateConfig;
}

export default function TemplateDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [template, setTemplate] = useState<Template | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [config, setConfig] = useState<TemplateConfig | null>(null);

  useEffect(() => {
    if (id) fetchTemplate();
  }, [id]);

  const fetchTemplate = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/templates/${id}`);
      if (!response.ok) throw new Error("Template not found");
      const data = await response.json();
      setTemplate(data);

      // Parse config
      if (data.config) {
        try {
          const parsed =
            typeof data.config === "string" ? JSON.parse(data.config) : data.config;
          setConfig(parsed);
        } catch {}
      }

      // Check if favorited
      const token = localStorage.getItem("token");
      if (token) {
        const favRes = await fetch("/api/templates/favorites", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (favRes.ok) {
          const favData = await favRes.json();
          setIsFavorite((favData || []).some((t: any) => t.id === data.id));
        }
      }
    } catch (err) {
      toast.error("Template not found");
      navigate("/dashboard/templates");
    } finally {
      setLoading(false);
    }
  };

  const handleUseTemplate = async () => {
    const token = localStorage.getItem("token");
    if (!token) { toast.error("Please login to use templates"); return; }

    try {
      setApplying(true);
      const loadingToast = toast.loading("Applying template...");
      const response = await fetch(`/api/templates/${id}/use`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      const data = await response.json();
      toast.dismiss(loadingToast);
      if (!response.ok) throw new Error(data.error || "Failed to apply template");

      const recent: number[] = JSON.parse(localStorage.getItem("template_recent") || "[]");
      const updated = [Number(id), ...recent.filter((i) => i !== Number(id))].slice(0, 20);
      localStorage.setItem("template_recent", JSON.stringify(updated));

      toast.success("Template applied!");
      setTimeout(() => navigate("/dashboard/customize"), 1500);
    } catch (error: any) {
      toast.error(error.message || "Failed to apply template");
    } finally {
      setApplying(false);
    }
  };

  const handleToggleFavorite = async () => {
    const token = localStorage.getItem("token");
    if (!token) { toast.error("Please login"); return; }
    const prev = isFavorite;
    setIsFavorite(!prev);
    try {
      const res = await fetch(`/api/templates/${id}/favorite`, {
        method: prev ? "DELETE" : "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
    } catch {
      setIsFavorite(prev);
      toast.error("Failed to update favorite");
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
  };

  const parseTags = (tags: string | string[]): string[] => {
    if (!tags) return [];
    if (Array.isArray(tags)) return tags;
    try { return JSON.parse(tags); } catch { return tags.split(",").map((t) => t.trim()).filter(Boolean); }
  };

  // Build preview CSS from config
  const getPreviewStyles = (): React.CSSProperties => {
    if (!config) return {};
    return {
      backgroundColor: config.background_color || "#0f0f0f",
      color: config.text_color || "#ffffff",
      fontFamily: config.font_family || "inherit",
    };
  };

  const getAccentColor = () => config?.accent_color || config?.primary_color || "#8b5cf6";
  const getBorderRadius = () => {
    const r = config?.border_radius;
    if (r === "none") return "0px";
    if (r === "sm") return "4px";
    if (r === "lg") return "16px";
    if (r === "full") return "9999px";
    return "8px";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-muted-foreground text-sm animate-pulse">Loading template...</div>
      </div>
    );
  }

  if (!template) return null;

  const tags = parseTags(template.tags);
  const accent = getAccentColor();
  const radius = getBorderRadius();

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Back button */}
      <button
        onClick={() => navigate("/dashboard/templates")}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Templates
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT: Live Preview */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-3"
        >
          <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Eye className="w-4 h-4 text-primary" />
            Live Preview
          </h2>

          <div className="rounded-xl overflow-hidden border border-border shadow-lg" style={{ minHeight: 480 }}>
            {/* If there's a preview image, show it. Otherwise render live CSS preview */}
            {template.preview_image ? (
              <div className="relative">
                <img
                  src={template.preview_image}
                  alt={template.name}
                  className="w-full object-cover"
                  style={{ maxHeight: 480 }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
                {/* Overlay badge */}
                <div className="absolute top-3 left-3 px-2 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-[10px] flex items-center gap-1">
                  <Eye className="w-3 h-3" /> Preview
                </div>
              </div>
            ) : (
              /* CSS Live Preview — rendered from config */
              <div
                className="relative w-full flex flex-col items-center pt-10 pb-8 px-6"
                style={{ ...getPreviewStyles(), minHeight: 480 }}
              >
                {/* Background effect hint */}
                {config?.background_effect && config.background_effect !== "none" && (
                  <div
                    className="absolute inset-0 opacity-20"
                    style={{
                      background:
                        config.background_effect === "gradient"
                          ? `linear-gradient(135deg, ${accent}44, transparent 60%)`
                          : config.background_effect === "particles"
                          ? `radial-gradient(circle at 20% 50%, ${accent}22 0%, transparent 50%)`
                          : "none",
                    }}
                  />
                )}

                {/* Avatar */}
                <div
                  className="relative z-10 w-20 h-20 rounded-full overflow-hidden mb-4 border-2"
                  style={{ borderColor: accent }}
                >
                  {config?.avatar_url ? (
                    <img src={config.avatar_url} alt="avatar" className="w-full h-full object-cover" />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center"
                      style={{ backgroundColor: `${accent}22` }}
                    >
                      <User className="w-8 h-8" style={{ color: accent }} />
                    </div>
                  )}
                </div>

                {/* Username */}
                <div className="relative z-10 mb-1">
                  <p
                    className="text-lg font-bold"
                    style={{
                      color: config?.text_color || "#fff",
                      fontFamily: config?.font_family || "inherit",
                      textShadow: config?.glow_username ? `0 0 12px ${accent}` : "none",
                    }}
                  >
                    @{template.author_username}
                  </p>
                </div>

                {/* Bio placeholder */}
                <p className="relative z-10 text-xs text-center mb-6 opacity-60" style={{ color: config?.text_color || "#fff" }}>
                  This is a preview of your profile bio
                </p>

                {/* Mock social links */}
                <div className="relative z-10 w-full space-y-2 max-w-xs">
                  {["🔗 My Website", "🐦 Twitter", "📸 Instagram"].map((label, i) => (
                    <div
                      key={i}
                      className="w-full py-2.5 px-4 text-xs font-medium text-center border transition-all"
                      style={{
                        borderRadius: radius,
                        backgroundColor:
                          config?.button_style === "filled"
                            ? accent
                            : config?.button_style === "outline"
                            ? "transparent"
                            : `${accent}22`,
                        borderColor: accent,
                        color: config?.button_style === "filled" ? "#fff" : config?.text_color || "#fff",
                        boxShadow: config?.glow_socials ? `0 0 8px ${accent}66` : "none",
                      }}
                    >
                      {label}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Config breakdown */}
          {config && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-xl border border-border bg-muted/20 p-4 space-y-3"
            >
              <p className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-primary" /> Template Styles
              </p>
              <div className="grid grid-cols-2 gap-2">
                {config.theme && (
                  <div className="flex items-center gap-2">
                    <Layout className="w-3 h-3 text-muted-foreground" />
                    <span className="text-[11px] text-muted-foreground">Theme: <span className="text-foreground capitalize">{config.theme}</span></span>
                  </div>
                )}
                {config.font_family && (
                  <div className="flex items-center gap-2">
                    <Type className="w-3 h-3 text-muted-foreground" />
                    <span className="text-[11px] text-muted-foreground">Font: <span className="text-foreground">{config.font_family}</span></span>
                  </div>
                )}
                {config.button_style && (
                  <div className="flex items-center gap-2">
                    <Layout className="w-3 h-3 text-muted-foreground" />
                    <span className="text-[11px] text-muted-foreground">Buttons: <span className="text-foreground capitalize">{config.button_style}</span></span>
                  </div>
                )}
                {(config.accent_color || config.primary_color) && (
                  <div className="flex items-center gap-2">
                    <Palette className="w-3 h-3 text-muted-foreground" />
                    <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                      Accent:
                      <span
                        className="inline-block w-3 h-3 rounded-full border border-border"
                        style={{ backgroundColor: accent }}
                      />
                    </span>
                  </div>
                )}
                {config.background_color && (
                  <div className="flex items-center gap-2">
                    <Palette className="w-3 h-3 text-muted-foreground" />
                    <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                      Background:
                      <span
                        className="inline-block w-3 h-3 rounded-full border border-border"
                        style={{ backgroundColor: config.background_color }}
                      />
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* RIGHT: Template Info */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-5"
        >
          {/* Header */}
          <div>
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0">
                <h1 className="text-xl font-bold text-foreground truncate">{template.name}</h1>
                <p className="text-sm text-muted-foreground">by @{template.author_username}</p>
              </div>
              <div className="flex items-center gap-2 ml-3">
                <button
                  onClick={handleToggleFavorite}
                  className={`p-2 rounded-lg hover:bg-muted transition-colors ${isFavorite ? "text-warning" : "text-muted-foreground"}`}
                >
                  <Star className={`w-4 h-4 ${isFavorite ? "fill-warning" : ""}`} />
                </button>
                <button
                  onClick={handleShare}
                  className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {template.is_premium && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-premium/20 text-premium text-[10px] font-medium border border-premium/30">
                ✦ Premium
              </span>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: Download, label: "Uses", value: template.download_count || template.uses || 0 },
              { icon: TrendingUp, label: "Trending", value: `⚡ ${template.trending || 0}` },
              { icon: Eye, label: "Views", value: template.uses || 0 },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="rounded-xl border border-border bg-muted/20 p-3 text-center">
                <Icon className="w-4 h-4 text-muted-foreground mx-auto mb-1" />
                <p className="text-sm font-semibold text-foreground">{value}</p>
                <p className="text-[10px] text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>

          {/* Description */}
          {template.description && (
            <div className="rounded-xl border border-border bg-muted/10 p-4">
              <p className="text-xs font-medium text-foreground mb-1">Description</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{template.description}</p>
            </div>
          )}

          {/* Tags */}
          {tags.length > 0 && (
            <div>
              <p className="text-xs font-medium text-foreground mb-2">Tags</p>
              <div className="flex flex-wrap gap-1.5">
                {tags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 text-[11px] rounded-full bg-muted text-muted-foreground border border-border"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Created at */}
          <p className="text-[11px] text-muted-foreground">
            Created {new Date(template.created_at).toLocaleDateString("nl-NL", { year: "numeric", month: "long", day: "numeric" })}
          </p>

          {/* CTA Buttons */}
          <div className="space-y-2 pt-2">
            <button
              onClick={handleUseTemplate}
              disabled={applying}
              className="w-full py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              {applying ? "Applying..." : "Use This Template"}
            </button>
            <button
              onClick={() => navigate("/dashboard/templates")}
              className="w-full py-2.5 rounded-xl bg-muted text-foreground text-sm hover:bg-muted/80 transition-colors"
            >
              Browse More Templates
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
