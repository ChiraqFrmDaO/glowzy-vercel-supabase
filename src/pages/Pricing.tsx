import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Check, Gift } from "lucide-react";
import { toast } from "sonner";

const STRIPE_PRICES = {
  premium:      "price_1TD5sBEWNebAVtTMygtFgdz5",
  custom_badge: "price_1TD5u8EWNebAVtTM7DbbkHO0",
  image_host:   "price_1TD5uiEWNebAVtTMWikyDt4x",
  verified:     "price_1TD5v5EWNebAVtTMOpkU5bWQ",
};

const FREE_FEATURES  = ["Default Profile Layout","Basic Customization","Basic Effects","Add Your Socials","Upload only 1 Audio"];
const PREM_FEATURES  = ["Exclusive Badge","More Profile Layout Themes","Advanced Layout Settings","Special Profile Effects","Upload up to 4 Audios","Advanced Badges Management","Access To Advanced Analytics","Metadata Customization","Priority Support","Remove Watermark on Profile","Multi-line Description","Description Tags","Portfolio Page"];

const PRODUCTS = [
  { featured: true,  icon: "⚡", color: "#fbbf24", name: "Atlas Token",    price: "2,99",  tagline: "Pay once. Lifetime access.", desc: "Add this token to your profile.",                                                   features: ["Exclusive Token Badge on Profile"] },
  { featured: true,  icon: "🎖️", color: "#c084fc", name: "Custom Badge",   price: "6,99",  tagline: "Pay once. Lifetime access.", desc: "Create your own custom badge with a unique icon and name.",                        features: ["Custom Icon & Name","Exclusive Appearance","Editable Anytime"] },
  { featured: true,  icon: "✅", color: "#4da6ff", name: "Verified Badge",  price: "15.99", tagline: "Pay once. Lifetime access.", desc: "Enhance Your Profile with the Glowzy.lol Verified Badge",                         features: ["Exclusive Verified Badge","Special Discord Role","Trust & Credibility"] },
  { featured: false, icon: "💎", color: "#c084fc", name: "Premium",         price: "5,99",  tagline: "Pay once. Lifetime access.", desc: "Unlock all premium features and take your profile to the next level.",              features: ["All Premium Features","Exclusive Badge","Priority Support"] },
  { featured: false, icon: "🩸", color: "#f87171", name: "Donator Badge",   price: "10,99", tagline: "Pay once. Lifetime access.", desc: "Support the project and get a special badge on your profile.",                     features: ["Exclusive Donator Badge","Special Discord Tag"] },
  { featured: false, icon: "💰", color: "#fbbf24", name: "Rich Badge",      price: "50,99", tagline: "Pay once. Lifetime access.", desc: "Show off your wealth with a special badge on your profile.",                       features: ["Exclusive Rich Badge","Rare & Exclusive"] },
  { featured: false, icon: "🥇", color: "#f59e0b", name: "Gold Badge",      price: "100,99",tagline: "Pay once. Lifetime access.", desc: "Show off your status with a special gold badge on your profile.",                  features: ["Exclusive Gold Badge","Ultra Rare"] },
];

const COINS = [
  { name: "Small+ Pack", coins: 150,  price: "1,99",  best: false, color: "#fbbf24" },
  { name: "Big Pack",    coins: 600,  price: "4,99",  best: true,  color: "#fbbf24" },
  { name: "Mega+ Pack",  coins: 1500, price: "9,99",  best: false, color: "#fbbf24" },
];

export default function Pricing() {
  const [loadingKey, setLoadingKey] = useState<string | null>(null);
  const [scrolled,   setScrolled]   = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── Premium checkout (bestaand via priceId) ──────────────────────────────
  const createCheckout = async (priceKey: keyof typeof STRIPE_PRICES) => {
    const token = localStorage.getItem("token");
    if (!token) { toast.error("Please login first"); navigate("/login"); return; }
    const priceId = STRIPE_PRICES[priceKey];
    setLoadingKey(priceKey);
    try {
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          priceId,
          successUrl: `${window.location.origin}/dashboard?payment=success`,
          cancelUrl:  `${window.location.origin}/pricing?payment=cancelled`,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      if (data.url) window.location.href = data.url;
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoadingKey(null);
    }
  };

  // ── Product checkout (nieuw — badges, tokens, etc.) ──────────────────────
  const createProductCheckout = async (productName: string, price: string, description: string) => {
    const token = localStorage.getItem("token");
    if (!token) { toast.error("Please login first"); navigate("/login"); return; }
    setLoadingKey(productName);
    try {
      const res = await fetch("/api/create-product-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          productName,
          price: parseFloat(price.replace(",", ".")),
          description,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      if (data.url) window.location.href = data.url;
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoadingKey(null);
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
          --text-primary:#fafafa; --border-primary:#525252; --border-secondary:#ffffff0d;
          --utility-gray-100:#171717; --utility-gray-200:#262626; --utility-gray-500:#737373; --utility-gray-600:#a3a3a3;
        }
        *,*::before,*::after{box-sizing:border-box;}
        body{font-family:Roboto,sans-serif;background-color:var(--color-lite-black);color:#fff;width:100vw;overflow-x:hidden;}
        a{cursor:pointer!important;text-decoration:none;color:inherit;}
        img,svg{display:block;}
        button{font-family:inherit;}

        .l-grid{position:fixed;inset:0;z-index:-1;opacity:0.05;pointer-events:none;background-image:linear-gradient(to right,#d1d5db 1px,transparent 1px),linear-gradient(to bottom,#d1d5db 1px,transparent 1px);background-size:32px 32px;-webkit-mask-image:radial-gradient(ellipse 60% 60% at 50% 50%,#000 30%,transparent 70%);mask-image:radial-gradient(ellipse 60% 60% at 50% 50%,#000 30%,transparent 70%);}

        .navbar-container{z-index:100;justify-content:center;align-items:center;padding:16px;padding-bottom:0!important;transition:padding-top .2s;display:flex;position:fixed;inset:0% 0% auto;}
        .navbar-container.navbar-container--at-top{padding-top:6px!important;}
        nav{-webkit-backdrop-filter:blur(20px);backdrop-filter:blur(20px);background:#ffffff0f;border-radius:20px;align-items:center;gap:40px;padding:15px 15px 15px 25px;transition:background-color .2s,-webkit-backdrop-filter .2s,backdrop-filter .2s,box-shadow .2s;display:inline-flex;box-shadow:0 25px 50px -12px #00000040;}
        nav.nav-transparent{-webkit-backdrop-filter:none;backdrop-filter:none;box-shadow:none;background:transparent;}
        .nav-logo{display:flex;align-items:center;gap:8px;}
        .nav-logo-icon{display:flex;align-items:center;transition:transform .3s;}
        .nav-logo-icon:hover{transform:scale(1.2) rotate(12deg);}
        .nav-links{display:flex;align-items:center;gap:10px;}
        .btn-outline{cursor:pointer;transition:all .3s;border:2px solid var(--border-secondary);border-radius:12px;outline:none;justify-content:center;padding:8px 16px;font-size:16px;font-weight:500;display:inline-flex;align-items:center;color:#fff;text-decoration:none;background:transparent;font-family:Roboto,sans-serif;backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);white-space:nowrap;}
        .btn-outline:hover{border:2px solid var(--border-primary);background-color:var(--color-opacity);}
        .btn-outline.primary{background-color:var(--color-primary-opacity);border:2px solid var(--color-primary-dark);}
        .btn-outline.primary:hover{border:2px solid var(--color-primary-dark)!important;background-color:var(--color-primary-opacity-dark)!important;}
        .btn-outline.pink{background-color:var(--color-pink-opacity);border:2px solid var(--color-pink);}
        .btn-outline.pink:hover{background-color:var(--color-pink-opacity-dark);border:2px solid var(--color-pink)!important;}
        .btn-outline.green{background-color:var(--color-green-opacity);border:2px solid var(--color-green);}
        .btn-outline.green:hover{background-color:var(--color-green-opacity-dark);border:2px solid var(--color-green)!important;}

        .p-page{padding-top:90px;min-height:100vh;}
        .p-section{max-width:72rem;margin:0 auto;padding:48px 32px;}
        .p-section.center{text-align:center;}

        .p-card{background:var(--utility-gray-100);border:2px solid var(--border-secondary);border-radius:20px;padding:32px;display:flex;flex-direction:column;gap:16px;position:relative;}
        .p-card.pink-border{border-color:var(--color-pink);}
        .p-popular{position:absolute;top:-14px;right:16px;background:var(--color-pink-opacity);border:2px solid var(--color-pink);border-radius:9999px;padding:4px 12px;font-size:12px;font-weight:600;color:#fff;}
        .p-check{display:flex;align-items:center;gap:8px;font-size:14px;color:var(--utility-gray-500);}
        .p-btn{cursor:pointer;border-radius:12px;font-size:14px;font-weight:600;padding:10px 20px;font-family:Roboto,sans-serif;transition:all .2s;border:none;}
        .p-btn.primary{background:var(--color-primary-opacity);border:2px solid var(--color-primary-dark);color:#fff;}
        .p-btn.primary:hover{background:var(--color-primary-opacity-dark);}
        .p-btn.pink{background:var(--color-pink-opacity);border:2px solid var(--color-pink);color:#fff;}
        .p-btn.pink:hover{background:var(--color-pink-opacity-dark);}
        .p-btn.muted{background:var(--utility-gray-200);border:2px solid var(--border-secondary);color:#fff;}
        .p-btn.muted:hover{opacity:.8;}
        .p-btn.yellow{background:rgba(251,191,36,0.15);border:2px solid rgba(251,191,36,0.4);color:#fbbf24;}
        .p-btn.yellow:hover{background:rgba(251,191,36,0.25);}
        .p-btn:disabled{opacity:.6;cursor:not-allowed;}
        .p-icon-btn{cursor:pointer;background:var(--utility-gray-200);border:2px solid var(--border-secondary);border-radius:9999px;color:var(--utility-gray-500);width:40px;height:40px;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:color .2s;}
        .p-icon-btn:hover{color:#fff;}

        .p-tag{display:inline-flex;align-items:center;padding:4px 14px;border-radius:9999px;font-size:12px;font-weight:600;margin-bottom:16px;}
        .p-tag.blue{background:var(--color-primary-opacity);border:2px solid var(--color-primary-dark);color:var(--color-primary);}
        .p-tag.yellow{background:rgba(251,191,36,0.15);border:2px solid rgba(251,191,36,0.4);color:#fbbf24;}

        .divider{border-top:2px solid var(--border-secondary);width:100%;}
        .section-description{color:var(--utility-gray-500);}
        .l-footer-link{color:var(--utility-gray-500);font-size:16px;text-decoration:none;transition:color .3s;}
        .l-footer-link:hover{color:var(--utility-gray-600);}
        footer{flex-direction:column;justify-content:center;align-items:center;gap:32px;max-width:72rem;margin:auto;padding:32px 32px;display:flex;}

        .spin{display:inline-block;width:12px;height:12px;border:2px solid rgba(255,255,255,0.3);border-top-color:#fff;border-radius:50%;animation:spin .6s linear infinite;margin-right:6px;}
        @keyframes spin{to{transform:rotate(360deg);}}
      `}</style>

      <div className="l-grid" />

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
            <a    className="btn-outline primary" href="https://discord.gg/vXzX2jzbyW" target="_blank" rel="noreferrer">Discord</a>
            <Link className="btn-outline"         to="/leaderboard">Leaderboard</Link>
            <Link className="btn-outline pink"    to="/pricing">Pricing &amp; Shop</Link>
            <Link className="btn-outline"         to="/login">Login</Link>
            <Link className="btn-outline primary" to="/register">Get Started</Link>
          </div>
        </nav>
      </div>

      <div className="p-page">

        {/* SECTION 1 — PLANS */}
        <div className="p-section center">
          <span className="p-tag blue">Pricing</span>
          <h1 style={{ fontSize:"clamp(1.8rem,4vw,2.8rem)", fontWeight:700, marginBottom:12 }}>Explore our exclusive plans</h1>
          <p style={{ color:"var(--utility-gray-500)", fontSize:14, maxWidth:500, margin:"0 auto 48px" }}>
            Become a part of a growing community. Get access to exclusive features, priority support, and more with our premium plans. Choose the plan that suits you best and start building your unique bio-page today!
          </p>

          <div style={{ display:"flex", gap:20, justifyContent:"center", alignItems:"flex-end", maxWidth:"42rem", margin:"0 auto" }}>
            {/* Free */}
            <div className="p-card" style={{ flex:1 }}>
              <p style={{ fontWeight:600, fontSize:16 }}>Free</p>
              <div style={{ display:"flex", alignItems:"baseline", gap:6 }}>
                <span style={{ fontSize:"2rem", fontWeight:700 }}>€0.00</span>
                <span style={{ color:"var(--utility-gray-500)", fontSize:12 }}>/Lifetime</span>
              </div>
              <p style={{ color:"var(--utility-gray-500)", fontSize:13, lineHeight:1.6 }}>For beginners, link all your socials in one place.</p>
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                {FREE_FEATURES.map(f => (
                  <div key={f} className="p-check"><Check size={13} color="#4da6ff" />{f}</div>
                ))}
              </div>
              <button className="p-btn primary" style={{ width:"100%", marginTop:8 }} onClick={() => navigate("/register")}>Get Started</button>
            </div>

            {/* Premium */}
            <div className="p-card pink-border" style={{ flex:1 }}>
              <div className="p-popular">Popular 🔥</div>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <span style={{ fontSize:16 }}>💎</span>
                <p style={{ fontWeight:600, fontSize:16 }}>Premium</p>
              </div>
              <div>
                <div style={{ display:"flex", alignItems:"baseline", gap:6 }}>
                  <span style={{ fontSize:"2rem", fontWeight:700 }}>€5,99</span>
                  <span style={{ color:"var(--utility-gray-500)", fontSize:12 }}>/Lifetime</span>
                </div>
                <p style={{ color:"var(--color-pink)", fontSize:12, fontWeight:600, marginTop:4 }}>One payment. Lifetime access.</p>
              </div>
              <p style={{ color:"var(--utility-gray-500)", fontSize:13, lineHeight:1.6 }}>The perfect plan to discover your creativity &amp; unlock more features.</p>
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                {PREM_FEATURES.map(f => (
                  <div key={f} className="p-check"><Check size={13} color="var(--color-pink)" />{f}</div>
                ))}
              </div>
              <div style={{ display:"flex", gap:8, marginTop:8 }}>
                <button className="p-btn pink" style={{ flex:1 }} onClick={() => createCheckout("premium")} disabled={loadingKey === "premium"}>
                  {loadingKey === "premium" ? <><span className="spin"/>Loading...</> : "Get Started"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2 — ALL PRODUCTS */}
        <div className="p-section center">
          <span className="p-tag blue">All Products</span>
          <h2 style={{ fontSize:"clamp(1.5rem,3vw,2.2rem)", fontWeight:700, marginBottom:8 }}>Explore Our All Products</h2>
          <p style={{ color:"var(--utility-gray-500)", fontSize:14, marginBottom:40 }}>Discover exclusive badges, features, and more!</p>

          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:20, textAlign:"left" }}>
            {PRODUCTS.map(p => (
              <div key={p.name} className="p-card" style={{ borderColor: p.featured ? "rgba(77,166,255,0.3)" : "var(--border-secondary)", position:"relative" }}>
                {p.featured && (
                  <div style={{ position:"absolute", top:-12, right:12, background:"var(--color-primary-opacity)", border:"2px solid var(--color-primary-dark)", borderRadius:9999, padding:"3px 10px", fontSize:11, fontWeight:600, color:"var(--color-primary)" }}>
                    Featured ⭐
                  </div>
                )}
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <span style={{ fontSize:28 }}>{p.icon}</span>
                  <p style={{ fontWeight:600, fontSize:16 }}>{p.name}</p>
                </div>
                <div style={{ display:"flex", alignItems:"baseline", gap:4 }}>
                  <span style={{ fontSize:"1.8rem", fontWeight:700 }}>€{p.price}</span>
                  <span style={{ color:"var(--utility-gray-500)", fontSize:13 }}>/Lifetime</span>
                </div>
                <p style={{ color:p.color, fontSize:13, fontWeight:600 }}>{p.tagline}</p>
                <p style={{ color:"var(--utility-gray-500)", fontSize:14, lineHeight:1.5 }}>{p.desc}</p>
                <div style={{ display:"flex", flexDirection:"column", gap:8, flex:1 }}>
                  {p.features.map(f => (
                    <div key={f} className="p-check"><Check size={14} color={p.color} />{f}</div>
                  ))}
                </div>
                <div style={{ display:"flex", gap:8, marginTop:8 }}>
                  <button
                    className="p-btn primary"
                    style={{ flex:1 }}
                    disabled={loadingKey === p.name}
                    onClick={() => createProductCheckout(p.name, p.price, p.desc)}>
                    {loadingKey === p.name ? <><span className="spin"/>Loading...</> : "Purchase"}
                  </button>
                  <button className="p-icon-btn" title="Gift" onClick={() => toast.info("Gift option coming soon!")}>
                    <Gift size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 3 — COINS */}
        <div className="p-section center">
          <span className="p-tag yellow">Coin Packages</span>
          <h2 style={{ fontSize:"clamp(1.5rem,3vw,2.2rem)", fontWeight:700, marginBottom:8 }}>Introducing Our Coins Packages</h2>
          <p style={{ color:"var(--utility-gray-500)", fontSize:14, marginBottom:40 }}>Purchase coins to unlock premium features, customization, and more!</p>

          <div style={{ display:"flex", gap:20, justifyContent:"center", flexWrap:"wrap" }}>
            {COINS.map(c => (
              <div key={c.name} className="p-card" style={{ minWidth:240, maxWidth:280, flex:1, borderColor: c.best ? "rgba(251,191,36,0.5)" : "var(--border-secondary)", background: c.best ? "rgba(251,191,36,0.05)" : "var(--utility-gray-100)", textAlign:"left", position:"relative" }}>
                {c.best && (
                  <div style={{ position:"absolute", top:-12, left:"50%", transform:"translateX(-50%)", background:"rgba(251,191,36,0.2)", border:"2px solid rgba(251,191,36,0.5)", borderRadius:9999, padding:"4px 14px", fontSize:12, fontWeight:600, color:"#fbbf24", whiteSpace:"nowrap" }}>
                    Best Value 🔥
                  </div>
                )}
                <p style={{ fontWeight:600, fontSize:16 }}>{c.name}</p>
                <p style={{ color:"var(--utility-gray-500)", fontSize:13 }}>Stack up on</p>
                <div style={{ display:"flex", alignItems:"center", gap:10, margin:"12px 0" }}>
                  <span style={{ fontSize:"2.2rem", fontWeight:700, color:"#fbbf24" }}>{c.coins}</span>
                  <span style={{ color:"#fbbf24", fontSize:15, fontWeight:600 }}>coins</span>
                  <span style={{ color:"var(--utility-gray-500)", fontSize:14, marginLeft:"auto" }}>€{c.price}</span>
                </div>
                <button className="p-btn yellow" style={{ width:"100%", padding:"12px 20px", fontSize:14 }}
                  onClick={() => navigate("/pricing/coins")}>
                  View Details
                </button>
              </div>
            ))}
          </div>

          <button className="p-btn yellow" style={{ marginTop:32, padding:"14px 40px", fontSize:15 }}
            onClick={() => navigate("/pricing/coins")}>
            View All Coin Packages
          </button>
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
                { h:"General",        links:[{l:"Pricing & Shop",to:"/pricing"},{l:"Leaderboard",to:"/leaderboard"},{l:"Partners",to:"/partners"}] },
                { h:"Authentication", links:[{l:"Login",to:"/login"},{l:"Sign Up",to:"/register"}] },
                { h:"Contact",        links:[{l:"Discord",href:"https://discord.gg/vXzX2jzbyW"}] },
                { h:"Legal",          links:[{l:"Terms",href:"#"},{l:"Privacy",href:"#"}] },
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
          <div className="divider"/>
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
