import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ChevronLeft, CheckCircle, XCircle } from "lucide-react";

const ALL_COINS = [
  { name: "Starter Pack",  coins: 50,    price: 0.99,  priceDisplay: "0,99",  best: false, desc: "Perfect to get started with coins." },
  { name: "Small+ Pack",   coins: 150,   price: 1.99,  priceDisplay: "1,99",  best: false, desc: "A small boost for your profile." },
  { name: "Medium Pack",   coins: 300,   price: 3.49,  priceDisplay: "3,49",  best: false, desc: "Get more done with a medium pack." },
  { name: "Big Pack",      coins: 600,   price: 4.99,  priceDisplay: "4,99",  best: true,  desc: "Our most popular pack — great value." },
  { name: "Large Pack",    coins: 1000,  price: 7.99,  priceDisplay: "7,99",  best: false, desc: "For power users who want more." },
  { name: "Mega+ Pack",    coins: 1500,  price: 9.99,  priceDisplay: "9,99",  best: false, desc: "Massive coins for maximum customization." },
  { name: "Ultra Pack",    coins: 2500,  price: 14.99, priceDisplay: "14,99", best: false, desc: "Go ultra with a huge coins bundle." },
  { name: "Supreme Pack",  coins: 5000,  price: 24.99, priceDisplay: "24,99", best: false, desc: "The supreme pack for true enthusiasts." },
  { name: "Elite Pack",    coins: 10000, price: 44.99, priceDisplay: "44,99", best: false, desc: "Elite status — the biggest pack available." },
];

const PRICE_PER_COIN = 0.054;
const MIN_COINS = 10;
const MAX_COINS = 5000000;

// ─── Pas dit aan naar jouw API URL ───────────────────────────────────────────
const API_URL = import.meta.env.VITE_API_URL || "https://glowzy.lol";
// ─────────────────────────────────────────────────────────────────────────────

export default function CoinsPage() {
  const [scrolled,      setScrolled]      = useState(false);
  const [customAmount,  setCustomAmount]  = useState("");
  const [customPrice,   setCustomPrice]   = useState<number | null>(null);
  const [loadingPack,   setLoadingPack]   = useState<string | null>(null); // welk pakket laadt
  const [loadingCustom, setLoadingCustom] = useState(false);
  const [toast,         setToast]         = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // ── Toon success/cancel melding na terugkeer van Stripe ──────────────────
  useEffect(() => {
    if (searchParams.get("success") === "true") {
      const coins = searchParams.get("coins");
      showToast("success", `Betaling geslaagd! ${coins ? `${parseInt(coins).toLocaleString()} coins` : "Coins"} zijn toegevoegd aan je account. 🎉`);
      // Verwijder query params uit URL
      navigate("/pricing/coins", { replace: true });
    }
    if (searchParams.get("cancelled") === "true") {
      showToast("error", "Betaling geannuleerd.");
      navigate("/pricing/coins", { replace: true });
    }
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const showToast = (type: "success" | "error", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 5000);
  };

  // ── Haal JWT token op uit localStorage ──────────────────────────────────
  const getToken = () => localStorage.getItem("token");

  // ── Koop een vast pakket ─────────────────────────────────────────────────
  const handlePurchasePack = async (coins: number, price: number, name: string) => {
    const token = getToken();
    if (!token) {
      showToast("error", "Je moet ingelogd zijn om coins te kopen.");
      navigate("/login");
      return;
    }

    setLoadingPack(name);
    try {
      // Gebruik het bestaande /api/glowzycoin/purchase endpoint in jouw index.js
      // Dit endpoint verwacht { amount } in USD en berekent zelf glowzycoins (1 USD = 1000 coins)
      // MAAR jij hebt vaste pakketten — daarom sturen we een custom body mee.
      // Zie de aanpassing in index.js hieronder.
      const res = await fetch(`${API_URL}/api/glowzycoin/purchase-pack`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ coins, price, name }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Onbekende fout");
      }

      const data = await res.json();

      if (data.url) {
        // Stuur gebruiker naar Stripe Checkout pagina
        window.location.href = data.url;
      } else {
        throw new Error("Geen redirect URL ontvangen van Stripe");
      }
    } catch (err: any) {
      showToast("error", `Fout: ${err.message}`);
    } finally {
      setLoadingPack(null);
    }
  };

  // ── Koop custom hoeveelheid ──────────────────────────────────────────────
  const handlePurchaseCustom = async () => {
    if (!customPrice || !customAmount) return;

    const token = getToken();
    if (!token) {
      showToast("error", "Je moet ingelogd zijn om coins te kopen.");
      navigate("/login");
      return;
    }

    setLoadingCustom(true);
    try {
      const coins = parseInt(customAmount);
      const res = await fetch(`${API_URL}/api/glowzycoin/purchase-pack`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          coins,
          price: customPrice,
          name: `${coins.toLocaleString()} Custom Coins`,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Onbekende fout");
      }

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("Geen redirect URL ontvangen van Stripe");
      }
    } catch (err: any) {
      showToast("error", `Fout: ${err.message}`);
    } finally {
      setLoadingCustom(false);
    }
  };

  const handleCustomChange = (val: string) => {
    setCustomAmount(val);
    const num = parseInt(val);
    if (!isNaN(num) && num >= MIN_COINS && num <= MAX_COINS) {
      setCustomPrice(Math.round(num * PRICE_PER_COIN * 100) / 100);
    } else {
      setCustomPrice(null);
    }
  };

  return (
    <>
      <style>{`
        :root {
          --color-primary:#4da6ff; --color-primary-dark:#4796e6; --color-primary-opacity:#4da6ff4d; --color-primary-opacity-dark:#4da6ff66;
          --color-pink:#ff66b2; --color-pink-opacity:#ff66b24d; --color-pink-opacity-dark:#ff66b266;
          --color-green:#4caf50; --color-green-opacity:#4caf504d; --color-green-opacity-dark:#4caf5066;
          --color-lite-black:#0f0f12; --color-opacity:#ffffff0d;
          --border-primary:#525252; --border-secondary:#ffffff0d;
          --utility-gray-100:#171717; --utility-gray-200:#262626; --utility-gray-500:#737373; --utility-gray-600:#a3a3a3;
        }
        *,*::before,*::after { box-sizing:border-box; }
        body { font-family:Roboto,sans-serif; background-color:var(--color-lite-black); color:#fff; width:100vw; overflow-x:hidden; }
        a { cursor:pointer!important; text-decoration:none; color:inherit; }
        img,svg { display:block; }
        button { font-family:inherit; }

        .l-grid { position:fixed; inset:0; z-index:-1; opacity:0.05; pointer-events:none; background-image:linear-gradient(to right,#d1d5db 1px,transparent 1px),linear-gradient(to bottom,#d1d5db 1px,transparent 1px); background-size:32px 32px; -webkit-mask-image:radial-gradient(ellipse 60% 60% at 50% 50%,#000 30%,transparent 70%); mask-image:radial-gradient(ellipse 60% 60% at 50% 50%,#000 30%,transparent 70%); }

        .navbar-container { z-index:100; justify-content:center; align-items:center; padding:16px; padding-bottom:0!important; transition:padding-top .2s; display:flex; position:fixed; inset:0% 0% auto; }
        .navbar-container.navbar-container--at-top { padding-top:6px!important; }
        nav { -webkit-backdrop-filter:blur(20px); backdrop-filter:blur(20px); background:#ffffff0f; border-radius:20px; align-items:center; gap:40px; padding:15px 15px 15px 25px; transition:background-color .2s,-webkit-backdrop-filter .2s,backdrop-filter .2s,box-shadow .2s; display:inline-flex; box-shadow:0 25px 50px -12px #00000040; }
        nav.nav-transparent { -webkit-backdrop-filter:none; backdrop-filter:none; box-shadow:none; background:transparent; }
        .nav-logo { display:flex; align-items:center; gap:8px; }
        .nav-logo-icon { display:flex; align-items:center; transition:transform .3s; }
        .nav-logo-icon:hover { transform:scale(1.2) rotate(12deg); }
        .nav-links { display:flex; align-items:center; gap:10px; }
        .btn-outline { cursor:pointer; transition:all .3s; border:2px solid var(--border-secondary); border-radius:12px; outline:none; justify-content:center; padding:8px 16px; font-size:16px; font-weight:500; display:inline-flex; align-items:center; color:#fff; text-decoration:none; background:transparent; font-family:Roboto,sans-serif; white-space:nowrap; }
        .btn-outline:hover { border:2px solid var(--border-primary); background-color:var(--color-opacity); }
        .btn-outline.primary { background-color:var(--color-primary-opacity); border:2px solid var(--color-primary-dark); }
        .btn-outline.primary:hover { background-color:var(--color-primary-opacity-dark)!important; }
        .btn-outline.pink { background-color:var(--color-pink-opacity); border:2px solid var(--color-pink); }
        .btn-outline.green { background-color:var(--color-green-opacity); border:2px solid var(--color-green); }

        .p-page { padding-top:90px; min-height:100vh; }
        .p-section { max-width:72rem; margin:0 auto; padding:48px 32px; }
        .p-tag { display:inline-flex; align-items:center; padding:4px 14px; border-radius:9999px; font-size:12px; font-weight:600; margin-bottom:16px; }
        .p-tag.yellow { background:rgba(251,191,36,0.15); border:2px solid rgba(251,191,36,0.4); color:#fbbf24; }

        .coin-card { background:var(--utility-gray-100); border:2px solid var(--border-secondary); border-radius:20px; padding:32px; display:flex; flex-direction:column; gap:16px; position:relative; transition:border-color .2s,transform .2s; }
        .coin-card:hover { border-color:rgba(251,191,36,0.4); transform:translateY(-2px); }
        .coin-card.best { border-color:rgba(251,191,36,0.5); background:rgba(251,191,36,0.04); }

        .p-btn-yellow { cursor:pointer; background:rgba(251,191,36,0.15); border:2px solid rgba(251,191,36,0.4); border-radius:12px; color:#fbbf24; font-size:14px; font-weight:600; padding:12px 20px; font-family:Roboto,sans-serif; transition:all .2s; width:100%; }
        .p-btn-yellow:hover { background:rgba(251,191,36,0.25); }
        .p-btn-yellow:disabled { opacity:0.5; cursor:not-allowed; }

        .divider { border-top:2px solid var(--border-secondary); width:100%; }
        .section-description { color:var(--utility-gray-500); }
        .l-footer-link { color:var(--utility-gray-500); font-size:16px; text-decoration:none; transition:color .3s; }
        .l-footer-link:hover { color:var(--utility-gray-600); }
        footer { flex-direction:column; justify-content:center; align-items:center; gap:32px; max-width:72rem; margin:auto; padding:32px 32px; display:flex; }

        /* Toast */
        .toast { position:fixed; bottom:32px; right:32px; z-index:9999; display:flex; align-items:center; gap:10px; padding:14px 20px; border-radius:14px; font-size:14px; font-weight:500; max-width:400px; box-shadow:0 8px 32px #00000060; animation:slideUp .3s ease; }
        .toast.success { background:#052e16; border:2px solid #16a34a; color:#86efac; }
        .toast.error   { background:#2d0a0a; border:2px solid #dc2626; color:#fca5a5; }
        @keyframes slideUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }

        /* Loading spinner in button */
        .spin { display:inline-block; width:14px; height:14px; border:2px solid rgba(251,191,36,0.3); border-top-color:#fbbf24; border-radius:50%; animation:spin .6s linear infinite; }
        @keyframes spin { to { transform:rotate(360deg); } }
      `}</style>

      <div className="l-grid" />

      {/* TOAST */}
      {toast && (
        <div className={`toast ${toast.type}`}>
          {toast.type === "success"
            ? <CheckCircle size={18} />
            : <XCircle size={18} />}
          {toast.msg}
        </div>
      )}

      {/* NAVBAR */}
      <div className="navbar-container navbar-container--at-top">
        <nav className={scrolled ? "" : "nav-transparent"}>
          <Link to="/" className="nav-logo">
            <div className="nav-logo-icon">
              <img src="/assets/logo.svg" alt="Glowzy.lol" width={30} height={30} />
            </div>
            <span style={{ fontSize:"1.5rem", fontWeight:600, whiteSpace:"nowrap" }}>Glowzy.lol</span>
          </Link>
          <div className="nav-links">
            <Link className="btn-outline green"   to="/partners">Partners</Link>
            <a    className="btn-outline primary" href="https://discord.gg/ttURmxuR4T" target="_blank" rel="noreferrer">Discord</a>
            <Link className="btn-outline"         to="/leaderboard">Leaderboard</Link>
            <Link className="btn-outline pink"    to="/pricing">Pricing &amp; Shop</Link>
            <Link className="btn-outline"         to="/login">Login</Link>
            <Link className="btn-outline primary" to="/register">Get Started</Link>
          </div>
        </nav>
      </div>

      {/* PAGE */}
      <div className="p-page">
        <div className="p-section">

          {/* Back */}
          <button onClick={() => navigate("/pricing")}
            style={{ display:"flex", alignItems:"center", gap:8, background:"none", border:"none", color:"var(--utility-gray-500)", cursor:"pointer", fontSize:14, fontFamily:"Roboto,sans-serif", marginBottom:32, padding:0, transition:"color .2s" }}
            onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
            onMouseLeave={e => (e.currentTarget.style.color = "var(--utility-gray-500)")}>
            <ChevronLeft size={18} /> Back to Pricing
          </button>

          {/* Header */}
          <div style={{ textAlign:"center", marginBottom:48 }}>
            <span className="p-tag yellow">Coin Packages</span>
            <h1 style={{ fontSize:"clamp(1.8rem,4vw,2.8rem)", fontWeight:700, marginBottom:12 }}>All Coin Packages</h1>
            <p style={{ color:"var(--utility-gray-500)", fontSize:14, maxWidth:480, margin:"0 auto" }}>
              Purchase coins to unlock premium features, customization, and more!
            </p>
          </div>

          {/* Grid 3 cols */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:20 }}>
            {ALL_COINS.map(c => (
              <div key={c.name} className={`coin-card${c.best ? " best" : ""}`}>
                {c.best && (
                  <div style={{ position:"absolute", top:-14, left:"50%", transform:"translateX(-50%)", background:"rgba(251,191,36,0.2)", border:"2px solid rgba(251,191,36,0.5)", borderRadius:9999, padding:"4px 16px", fontSize:12, fontWeight:600, color:"#fbbf24", whiteSpace:"nowrap" }}>
                    Best Value 🔥
                  </div>
                )}
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <span style={{ fontSize:28 }}>🪙</span>
                  <p style={{ fontWeight:600, fontSize:16 }}>{c.name}</p>
                </div>
                <p style={{ color:"var(--utility-gray-500)", fontSize:14 }}>{c.desc}</p>
                <div style={{ display:"flex", alignItems:"center", gap:10, padding:"12px 0", borderTop:"2px solid var(--border-secondary)", borderBottom:"2px solid var(--border-secondary)" }}>
                  <span style={{ fontSize:"2.2rem", fontWeight:700, color:"#fbbf24" }}>{c.coins.toLocaleString()}</span>
                  <span style={{ color:"#fbbf24", fontSize:15, fontWeight:600 }}>coins</span>
                  <span style={{ color:"#fff", fontSize:"1.2rem", fontWeight:700, marginLeft:"auto" }}>€{c.priceDisplay}</span>
                </div>
                <button
                  className="p-btn-yellow"
                  disabled={loadingPack === c.name}
                  onClick={() => handlePurchasePack(c.coins, c.price, c.name)}>
                  {loadingPack === c.name
                    ? <><span className="spin" /> Even geduld...</>
                    : "Purchase"}
                </button>
              </div>
            ))}
          </div>

          {/* Custom amount card — full width */}
          <div className="coin-card" style={{ marginTop:24, borderColor:"rgba(77,166,255,0.3)", background:"rgba(77,166,255,0.03)", flexDirection:"row", alignItems:"center", gap:60 }}>
            {/* Left */}
            <div style={{ flex:1 }}>
              <h2 style={{ fontSize:"clamp(1.6rem,3vw,2.2rem)", fontWeight:700, marginBottom:12, lineHeight:1.2 }}>
                Buy custom coins amount!
              </h2>
              <p style={{ color:"var(--utility-gray-500)", fontSize:14, lineHeight:1.6 }}>
                Choose and type custom amount of coins you want to purchase.
              </p>
            </div>

            {/* Right */}
            <div style={{ flex:1, display:"flex", flexDirection:"column", gap:16, maxWidth:360 }}>
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                <label style={{ color:"var(--utility-gray-500)", fontSize:13 }}>Type coins amount:</label>
                <input
                  type="number"
                  min={MIN_COINS}
                  max={MAX_COINS}
                  placeholder="100"
                  value={customAmount}
                  onChange={e => handleCustomChange(e.target.value)}
                  style={{ background:"var(--utility-gray-200)", border:"2px solid var(--border-secondary)", borderRadius:10, padding:"12px 16px", color:"#fff", fontSize:16, fontFamily:"Roboto,sans-serif", outline:"none", width:"100%", transition:"border-color .2s" }}
                  onFocus={e => (e.target.style.borderColor = "var(--color-primary-dark)")}
                  onBlur={e  => (e.target.style.borderColor = "var(--border-secondary)")}
                />
              </div>
              <div style={{ display:"flex", alignItems:"baseline", gap:10 }}>
                <span style={{ fontSize:"2rem", fontWeight:700 }}>
                  {customPrice ? `€${customPrice.toFixed(2)}` : "€0.00"}
                </span>
                <span style={{ color:"var(--utility-gray-500)", fontSize:13 }}>
                  €{PRICE_PER_COIN.toFixed(3)} per coin
                </span>
              </div>
              <button
                className="p-btn-yellow"
                disabled={!customPrice || loadingCustom}
                style={{ borderRadius:9999, padding:"14px 20px", fontSize:15 }}
                onClick={handlePurchaseCustom}>
                {loadingCustom
                  ? <><span className="spin" /> Even geduld...</>
                  : customPrice && customAmount
                    ? `Buy ${parseInt(customAmount).toLocaleString()} Coins`
                    : "Enter an amount"}
              </button>
            </div>
          </div>

        </div>

        {/* FOOTER */}
        <footer>
          <div style={{ display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:80, width:"100%" }}>
            <div style={{ display:"flex", flexDirection:"column", gap:16, maxWidth:"24rem" }}>
              <div style={{ display:"flex", alignItems:"center", gap:16 }}>
                <Link to="/" style={{ display:"flex", alignItems:"center", gap:12 }}>
                  <img src="/assets/logo.svg" alt="logo" width={30} height={30}
                    style={{ transition:"transform .3s" }}
                    onMouseEnter={e => ((e.target as HTMLImageElement).style.transform = "scale(1.2) rotate(12deg)")}
                    onMouseLeave={e => ((e.target as HTMLImageElement).style.transform = "")} />
                  <span style={{ fontSize:"1.5rem", fontWeight:600 }}>Glowzy.lol</span>
                </Link>
                <a href="https://status.glowzy.lol/" className="btn-outline" style={{ padding:"4px 10px 4px 8px", gap:6, fontSize:14 }}>
                  <span>🟢</span><span>Service Status</span>
                </a>
              </div>
              <div className="section-description" style={{ fontSize:16 }}>
                Your essential platform for creating modern, customizable bio-pages to meet all your digital needs.
              </div>
            </div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:40 }}>
              {[
                { h:"General",        links:[{l:"Pricing & Shop", to:"/pricing"},{l:"Leaderboard", to:"/leaderboard"},{l:"Partners", to:"/partners"}] },
                { h:"Authentication", links:[{l:"Login", to:"/login"},{l:"Sign Up", to:"/register"}] },
                { h:"Contact",        links:[{l:"Discord", href:"https://discord.gg/ttURmxuR4T"}] },
                { h:"Legal",          links:[{l:"Terms", href:"#"},{l:"Privacy", href:"#"}] },
              ].map(sec => (
                <div key={sec.h} style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  <h3 style={{ color:"#fff", fontSize:"1.5rem", fontWeight:600, marginBottom:4 }}>{sec.h}</h3>
                  {sec.links.map((lk: any) =>
                    lk.to
                      ? <Link key={lk.l} to={lk.to} className="l-footer-link">{lk.l}</Link>
                      : <a    key={lk.l} href={lk.href} className="l-footer-link">{lk.l}</a>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="divider" />
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:8, width:"100%" }}>
            <span className="section-description" style={{ fontSize:16 }}>© 2026 biolinks. All rights reserved.</span>
            <div style={{ display:"flex", gap:24 }}>
              <a href="#" className="l-footer-link">Terms</a>
              <a href="#" className="l-footer-link">Privacy</a>
            </div>
          </div>
        </footer>

      </div>
    </>
  );
}