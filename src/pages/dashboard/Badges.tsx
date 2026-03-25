import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  Crown, Plus, Check, Lock, Shield, Star, Zap, Heart,
  Gem, Flame, Globe, Code, Rocket, Trophy, Medal, Award,
  BadgeCheck, Sparkles, Sword, Eye, Leaf, Music, Camera,
  Coffee, Diamond, Ghost, Hexagon, Infinity, Key, Layers,
  Lightbulb, Mic, Moon, Package, Palette, Radio, Smile,
  Sun, Target, Umbrella, Wand2, Wind, Wrench, Cpu, Bug,
  X, ShoppingCart, Minus,
} from "lucide-react";
import { toast } from "sonner";

// ---------------------------------------------------------------------------
// Icon map
// ---------------------------------------------------------------------------
const ICON_MAP: Record<string, React.ElementType> = {
  crown: Crown, shield: Shield, star: Star, zap: Zap, heart: Heart,
  gem: Gem, flame: Flame, globe: Globe, code: Code, rocket: Rocket,
  trophy: Trophy, medal: Medal, award: Award, badge_check: BadgeCheck,
  sparkles: Sparkles, sword: Sword, eye: Eye, leaf: Leaf, music: Music,
  camera: Camera, coffee: Coffee, diamond: Diamond, ghost: Ghost,
  hexagon: Hexagon, infinity: Infinity, key: Key, layers: Layers,
  lightbulb: Lightbulb, mic: Mic, moon: Moon, package: Package,
  palette: Palette, radio: Radio, smile: Smile, sun: Sun, target: Target,
  umbrella: Umbrella, wand: Wand2, wind: Wind, wrench: Wrench, cpu: Cpu,
  bug: Bug, lock: Lock,
  "👑": Crown, "🛡️": Shield, "⭐": Star, "⚡": Zap, "💎": Gem,
  "🔥": Flame, "🏆": Trophy, "🥇": Medal, "🚀": Rocket, "🔒": Lock,
  "✅": BadgeCheck, "✨": Sparkles, "🐛": Bug, "💻": Cpu, "🌍": Globe,
};


function BadgeIcon({ icon, color, size = 18 }: { icon: string | null; color: string; size?: number }) {
  if (!icon) return <Trophy size={size} style={{ color }} />;
  const key = icon.trim().toLowerCase();
  const LucideIcon = ICON_MAP[key] || ICON_MAP[icon.trim()];
  if (LucideIcon) return <LucideIcon size={size} style={{ color }} />;
  return <span style={{ fontSize: size, lineHeight: 1 }}>{icon}</span>;
}



// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface Badge {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  color: string | null;
  is_premium: boolean;
  badge_type?: "free" | "premium" | "developer" | "early_supporter" | "buy";
  admin_only?: boolean;
  price?: number | null;
}

// Badges die nooit een knop tonen
const NO_BUTTON_BADGES = new Set([
  "staff",  "winner", "second place", "third place",
  "the million", "christmas 2025", "christmas 2024", "easter 2025",
]);

// Badges die je moet KOPEN (geen add knop als je ze niet hebt)
const PURCHASE_ONLY_BADGES = new Set([
  "verified", "donor", "gifter", "image host", "donator badge",
  "rich badge", "gold badge", "custom badge",
]);


const EXCLUSIVE_BADGES = new Set([
  "og",
  "winner",
  "second place",
  "third place",
  "the million",
  "christmas 2025",
  "christmas 2024",
  "easter 2025",
  "early donor",
]);
// ---------------------------------------------------------------------------
// Welke knop tonen?
// none     = geen knop
// add      = vrij toe te voegen
// remove   = verwijderen (alleen als al in bezit)
// locked   = vergrendeld (premium vereist)
// purchase = moet je kopen via pricing pagina
// ---------------------------------------------------------------------------
type ButtonType = "none" | "add" | "remove" | "locked" | "purchase";

function getButtonType(
  badge: Badge,
  owned: boolean,
  isOwner: boolean,
  isEarlySupporter: boolean,
  isPremium: boolean
): ButtonType {
  const n = (badge.name || "").toLowerCase();

if (badge.admin_only || badge.badge_type === "developer") {
    return isAdmin ? (owned ? "remove" : "add") : "none";
}

  // ❌ EXCLUSIVE BADGES (OG / winner / etc.)
  const EXCLUSIVE = new Set([
    "og",
    "winner",
    "second place",
    "third place",
    "the million",
  ]);

  if (EXCLUSIVE.has(n)) {
    return owned ? "remove" : "none";
  }

  // ❌ PURCHASE ONLY (donor / early donor / etc.)
  if (PURCHASE_ONLY_BADGES.has(n) || badge.badge_type === "buy") {
    return owned ? "remove" : "none";
  }

  // ❌ EARLY SUPPORTER LOCK
  if (badge.badge_type === "early_supporter") {
    if (!isEarlySupporter) return "none";
    return owned ? "remove" : "add";
  }

  // ❌ PREMIUM LOCK
  if (badge.is_premium && badge.badge_type !== "free") {
    if (!isPremium) return "locked";
    return owned ? "remove" : "add";
  }

  // ✅ DEFAULT FREE BADGES
  return owned ? "remove" : "add";
}
// ---------------------------------------------------------------------------
// Badge categorie label + kleur
// ---------------------------------------------------------------------------
function getBadgeMeta(badge: Badge): { label: string; labelColor: string; accent: string } {
  const n = badge.name.toLowerCase();

  if (badge.badge_type === "developer" || badge.admin_only) {
    return { label: "Staff", labelColor: "#f87171", accent: "#f87171" };
  }
  if (badge.badge_type === "early_supporter" || n === "early supporter") {
    return { label: "Early Supporter", labelColor: "#facc15", accent: "#facc15" };
  }
  if (badge.badge_type === "buy" || PURCHASE_ONLY_BADGES.has(n)) {
    return { label: "Purchasable", labelColor: "#34d399", accent: "#34d399" };
  }
  if (badge.is_premium && badge.badge_type !== "free") {
    return { label: "Premium", labelColor: "#f59e0b", accent: "#f59e0b" };
  }
  return { label: "Free", labelColor: "#a78bfa", accent: "#a78bfa" };
}

// ---------------------------------------------------------------------------
// Badge Card Component
// ---------------------------------------------------------------------------
function BadgeCard({
  badge,
  owned,
  buttonType,
  onAdd,
  onRemove,
  index,
}: {
  badge: Badge;
  owned: boolean;
  buttonType: ButtonType;
  onAdd: () => void;
  onRemove: () => void;
  index: number;
}) {
  const { label, labelColor, accent } = getBadgeMeta(badge);
  const color = badge.color || accent;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, duration: 0.3 }}
      className={`relative flex flex-col gap-3 p-4 rounded-2xl border transition-all duration-200 ${
        owned
          ? "border-white/10 bg-white/[0.05]"
          : "border-white/[0.05] bg-white/[0.02] opacity-70"
      } hover:border-white/15 hover:bg-white/[0.06]`}
    >
      {/* Owned glow */}
      {owned && (
        <div
          className="absolute inset-0 rounded-2xl opacity-10 pointer-events-none"
          style={{ background: `radial-gradient(ellipse at top left, ${color}, transparent 70%)` }}
        />
      )}

      {/* Top row: icon + label */}
      <div className="flex items-start justify-between gap-2">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${color}20`, border: `1px solid ${color}35` }}
        >
          <BadgeIcon icon={badge.icon} color={color} size={20} />
        </div>

        <span
          className="text-[10px] font-semibold px-2 py-0.5 rounded-full border mt-0.5 flex-shrink-0"
          style={{
            color: labelColor,
            borderColor: `${labelColor}30`,
            backgroundColor: `${labelColor}12`,
          }}
        >
          {label}
        </span>
      </div>

      {/* Name + description */}
      <div className="flex-1">
        <p className="text-sm font-semibold text-white leading-tight">{badge.name}</p>
        {badge.description && (
          <p className="text-[11px] text-white/40 mt-1 leading-relaxed line-clamp-2">
            {badge.description}
          </p>
        )}
      </div>

      {/* Button */}
      {buttonType === "add" && (
        <button
          onClick={onAdd}
          className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all hover:opacity-90 active:scale-95"
          style={{
            backgroundColor: `${color}18`,
            border: `1px solid ${color}30`,
            color: color,
          }}
        >
          <Plus className="w-3 h-3" />
          Add Badge
        </button>
      )}

      {buttonType === "remove" && (
        <button
          onClick={onRemove}
          className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold border border-white/10 bg-white/5 text-white/50 hover:text-white/80 hover:bg-white/8 transition-all active:scale-95"
        >
          <Check className="w-3 h-3 text-green-400" />
          <span className="text-green-400">Added</span>
          <span className="text-white/20 ml-auto text-[10px]">click to remove</span>
        </button>
      )}

      {buttonType === "locked" && (
        <div className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium border border-white/5 bg-white/[0.02] text-white/20 cursor-not-allowed select-none">
          <Lock className="w-3 h-3" />
          Premium Required
        </div>
      )}

      {/* buttonType === "none" → geen knop, niets renderen */}
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Category Section Header
// ---------------------------------------------------------------------------
function SectionHeader({ title, count, color }: { title: string; count: number; color: string }) {
  return (
    <div className="flex items-center gap-3 mb-3">
      <h2 className="text-sm font-bold text-white/80 uppercase tracking-widest">{title}</h2>
      <span
        className="text-[10px] font-bold px-2 py-0.5 rounded-full"
        style={{ backgroundColor: `${color}20`, color }}
      >
        {count}
      </span>
      <div className="flex-1 h-px bg-white/5" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Badges Component
// ---------------------------------------------------------------------------
export default function Badges() {
  const { user } = useAuth();
  const [badges, setBadges] = useState<Badge[]>([]);
  const [userBadgeIds, setUserBadgeIds] = useState<Set<string>>(new Set());
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEarlySupporter, setIsEarlySupporter] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadData();
      const params = new URLSearchParams(window.location.search);
      if (params.get("success") === "true") {
        window.history.replaceState({}, "", window.location.pathname);
        // Webhook kan traag zijn, probeer meerdere keren
        setTimeout(() => loadData(), 1500);
        setTimeout(() => loadData(), 4000);
        setTimeout(() => {
          loadData();
          toast.success("Badge purchased! Je kan hem nu toevoegen aan je profiel.");
        }, 6000);
      }
    }
  }, [user]);

  const loadData = async () => {
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    const [resAll, resMine, resOwner, resProfile] = await Promise.all([
      fetch("/api/badges"),
      fetch("/api/user-badges", { headers }),
      fetch("/api/check-owner", { method: "POST", headers }),
      fetch("/api/profiles/me", { headers }),
    ]);

    const allBadges: Badge[] = await resAll.json();
    const myBadges: any[] = await resMine.json();
    const ownerData = await resOwner.json();
    const profile = resProfile.ok ? await resProfile.json() : null;

    const myIds = new Set<string>(myBadges.map((b) => b.badge_id));

    const earlySupporter = profile?.user_id <= 100 || profile?.is_early_supporter === true;
    const premium = profile?.is_premium === true || profile?.is_premium === 1;

    setIsEarlySupporter(earlySupporter);
    setIsPremium(premium);

    // Auto-grant early supporter badge
const ogBadge = allBadges.find((b) => (b.name || "").toLowerCase() === "og");
const esBadge = allBadges.find((b) => (b.name || "").toLowerCase() === "early supporter");

if (earlySupporter) {
  if (ogBadge && !myIds.has(ogBadge.id)) {
    await fetch("/api/user-badges", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ badgeId: ogBadge.id }),
    });
    myIds.add(ogBadge.id);
  }

  if (esBadge && !myIds.has(esBadge.id)) {
    await fetch("/api/user-badges", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ badgeId: esBadge.id }),
    });
    myIds.add(esBadge.id);
  }
}

    setBadges(allBadges);
    setUserBadgeIds(myIds);
    setIsAdmin(ownerData.isAdmin);
    setLoading(false);
  };

  const addBadge = async (badgeId: string) => {
    const badge = badges.find((b) => b.id === badgeId);
    if (!badge) return;

    const resp = await fetch("/api/user-badges", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ badgeId }),
    });

    if (!resp.ok) {
      toast.error(await resp.text());
    } else {
      setUserBadgeIds((prev) => new Set(prev).add(badgeId));
      toast.success(`${badge.name} badge toegevoegd!`);
    }
  };

  const removeBadge = async (badgeId: string) => {
    const badge = badges.find((b) => b.id === badgeId);
    if (!badge) return;

    // Gekochte badges kunnen NIET verwijderd worden uit de database
    // Ze kunnen alleen aan/uit gezet worden (enabled toggle)
    // Maar we verwijderen ze niet zodat je ze niet opnieuw hoeft te kopen
    const n = badge.name.toLowerCase();
    if (PURCHASE_ONLY_BADGES.has(n) || badge.badge_type === "buy") {
      // Verberg de badge van het profiel maar verwijder niet uit DB
      toast.info(`${badge.name} verborgen van je profiel. Je blijft eigenaar.`);
      setUserBadgeIds((prev) => { const s = new Set(prev); s.delete(badgeId); return s; });
      return;
    }

    await fetch(`/api/user-badges/${badgeId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    setUserBadgeIds((prev) => { const s = new Set(prev); s.delete(badgeId); return s; });
    toast.success("Badge verwijderd");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Groepeer badges per categorie
  // ---------------------------------------------------------------------------
  const freeBadges = badges.filter(
    (b) =>
      !b.is_premium &&
      !b.admin_only &&
      b.badge_type !== "developer" &&
      b.badge_type !== "early_supporter" &&
      b.badge_type !== "buy" &&
      !PURCHASE_ONLY_BADGES.has(b.name.toLowerCase()) &&
      !NO_BUTTON_BADGES.has(b.name.toLowerCase())
  );

  const premiumBadges = badges.filter(
    (b) =>
      (b.badge_type === "premium" || (b.is_premium && !b.badge_type)) &&
      !b.admin_only &&
      !PURCHASE_ONLY_BADGES.has(b.name.toLowerCase())
  );

  const purchaseBadges = badges.filter(
    (b) =>
      b.badge_type === "buy" ||
      PURCHASE_ONLY_BADGES.has(b.name.toLowerCase())
  );



  const specialBadges = badges.filter((b) => b.badge_type === "developer" || b.admin_only);

  const exclusiveBadges = badges.filter((b) => {
  const name = (b.name || "").toLowerCase();
  return EXCLUSIVE_BADGES.has(name);
});

  // Helper om badge card props te bepalen
  const cardProps = (badge: Badge, index: number) => {
    const owned = userBadgeIds.has(badge.id);
    const buttonType = getButtonType(badge, owned, isAdmin, isEarlySupporter, isPremium);
    return { badge, owned, buttonType, onAdd: () => addBadge(badge.id), onRemove: () => removeBadge(badge.id), index };
  };

  const sections = [
    { title: "Free Badges", color: "#a78bfa", items: freeBadges },
    { title: "Premium Badges", color: "#f59e0b", items: premiumBadges },
    { title: "Purchasable Badges", color: "#34d399", items: purchaseBadges },
    { title: "Exclusive Badges", color: "#94a3b8", items: exclusiveBadges },
    { title: "Staff & Developer", color: "#f87171", items: specialBadges },
  ].filter((s) => s.items.length > 0);

  return (
    <div className="space-y-10 max-w-6xl pb-10">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Badges</h1>
        <p className="text-sm text-white/40 mt-1">
          Verzamel badges en toon ze op je profiel.
        </p>
      </div>

      {/* Stats row */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#a78bfa20] border border-[#a78bfa30] flex items-center justify-center">
            <Trophy className="w-4 h-4 text-[#a78bfa]" />
          </div>
          <div>
            <p className="text-xs text-white/40">In bezit</p>
            <p className="text-sm font-bold text-white">{userBadgeIds.size}</p>
          </div>
        </div>
        <div className="w-px h-8 bg-white/10" />
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white/40" />
          </div>
          <div>
            <p className="text-xs text-white/40">Totaal</p>
            <p className="text-sm font-bold text-white">{badges.length}</p>
          </div>
        </div>
      </div>

      {/* Sections */}
      {sections.map((section) => {
        let globalIndex = 0;
        return (
          <div key={section.title}>
            <SectionHeader title={section.title} count={section.items.length} color={section.color} />

            {/* Info tekst voor purchasable badges */}
            {section.title === "Purchasable Badges" && (
              <p className="text-xs text-white/30 mb-4 flex items-center gap-1.5">
                <ShoppingCart className="w-3 h-3" />
                Deze badges zijn te koop via de{" "}
                <a href="/pricing" className="text-[#34d399] hover:underline">
                  Pricing pagina
                </a>
                . Na aankoop verschijnen ze hier automatisch.
              </p>
            )}

            {section.title === "Premium Badges" && !isPremium && (
              <p className="text-xs text-white/30 mb-4 flex items-center gap-1.5">
                <Lock className="w-3 h-3" />
                Upgrade naar{" "}
                <a href="/pricing" className="text-[#f59e0b] hover:underline">
                  Premium
                </a>{" "}
                om deze badges te ontgrendelen.
              </p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {section.items.map((badge, i) => (
                <BadgeCard key={badge.id} {...cardProps(badge, i)} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}