import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Eye, Coins, Crown, Medal, Trophy } from "lucide-react";

interface ProfileEntry {
  rank: number;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  is_premium: number;
  views: number;
}

interface CoinsEntry {
  rank: number;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  is_premium: number;
  balance: number;
}

export default function Leaderboard() {
  const [scrolled,     setScrolled]     = useState(false);
  const [tab,          setTab]          = useState<"views" | "coins">("views");
  const [viewsData,    setViewsData]    = useState<ProfileEntry[]>([]);
  const [coinsData,    setCoinsData]    = useState<CoinsEntry[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [viewsRes, coinsRes] = await Promise.all([
          fetch("/api/leaderboard/views"),
          fetch("/api/leaderboard/coins"),
        ]);
        if (!viewsRes.ok || !coinsRes.ok) throw new Error("Failed to fetch leaderboard data");
        const views = await viewsRes.json();
        const coins = await coinsRes.json();
        setViewsData(views);
        setCoinsData(coins);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy size={20} color="#fbbf24" />;
    if (rank === 2) return <Medal size={20} color="#9ca3af" />;
    if (rank === 3) return <Medal size={20} color="#b45309" />;
    return <span style={{ color:"var(--utility-gray-500)", fontWeight:700, fontSize:14, minWidth:20, textAlign:"center" }}>#{rank}</span>;
  };

  const getRankBg = (rank: number) => {
    if (rank === 1) return "rgba(251,191,36,0.08)";
    if (rank === 2) return "rgba(156,163,175,0.06)";
    if (rank === 3) return "rgba(180,83,9,0.06)";
    return "transparent";
  };

  const getRankBorder = (rank: number) => {
    if (rank === 1) return "rgba(251,191,36,0.3)";
    if (rank === 2) return "rgba(156,163,175,0.2)";
    if (rank === 3) return "rgba(180,83,9,0.2)";
    return "var(--border-secondary)";
  };

  const currentData = tab === "views" ? viewsData : coinsData;

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
        .p-section { max-width:56rem; margin:0 auto; padding:48px 32px; }
        .p-tag { display:inline-flex; align-items:center; padding:4px 14px; border-radius:9999px; font-size:12px; font-weight:600; margin-bottom:16px; }
        .p-tag.blue { background:var(--color-primary-opacity); border:2px solid var(--color-primary-dark); color:var(--color-primary); }

        .lb-tabs { display:flex; gap:8px; background:var(--utility-gray-100); border:2px solid var(--border-secondary); border-radius:14px; padding:6px; width:fit-content; margin:0 auto 32px; }
        .lb-tab { cursor:pointer; border:none; border-radius:10px; padding:10px 24px; font-size:14px; font-weight:600; font-family:Roboto,sans-serif; transition:all .2s; display:flex; align-items:center; gap:8px; }
        .lb-tab.active { background:var(--color-primary-opacity); border:2px solid var(--color-primary-dark); color:#fff; }
        .lb-tab.inactive { background:transparent; border:2px solid transparent; color:var(--utility-gray-500); }
        .lb-tab.inactive:hover { color:#fff; background:var(--color-opacity); }

        .lb-row { display:flex; align-items:center; gap:16px; padding:14px 20px; border-radius:16px; border:2px solid; transition:transform .15s; }
        .lb-row:hover { transform:translateX(4px); }
        .lb-avatar { width:44px; height:44px; border-radius:50%; object-fit:cover; flex-shrink:0; background:var(--utility-gray-200); }
        .lb-avatar-placeholder { width:44px; height:44px; border-radius:50%; background:var(--utility-gray-200); display:flex; align-items:center; justify-content:center; font-size:18px; font-weight:700; color:var(--utility-gray-500); flex-shrink:0; }

        .lb-skeleton { height:72px; border-radius:16px; background:linear-gradient(90deg,var(--utility-gray-100) 25%,var(--utility-gray-200) 50%,var(--utility-gray-100) 75%); background-size:200% 100%; animation:shimmer 1.5s infinite; border:2px solid var(--border-secondary); }
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

        .divider { border-top:2px solid var(--border-secondary); width:100%; }
        .section-description { color:var(--utility-gray-500); }
        .l-footer-link { color:var(--utility-gray-500); font-size:16px; text-decoration:none; transition:color .3s; }
        .l-footer-link:hover { color:var(--utility-gray-600); }
        footer { flex-direction:column; justify-content:center; align-items:center; gap:32px; max-width:72rem; margin:auto; padding:32px 32px; display:flex; }
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

      {/* PAGE */}
      <div className="p-page">
        <div className="p-section">

          {/* Header */}
          <div style={{ textAlign:"center", marginBottom:32 }}>
            <span className="p-tag blue">Leaderboard</span>
            <h1 style={{ fontSize:"clamp(1.8rem,4vw,2.8rem)", fontWeight:700, marginBottom:8 }}>Top 100 Rankings</h1>
            <p style={{ color:"var(--utility-gray-500)", fontSize:14 }}>
              See who's leading the Glowzy.lol community.
            </p>
          </div>

          {/* Tabs */}
          <div className="lb-tabs">
            <button className={`lb-tab ${tab === "views" ? "active" : "inactive"}`} onClick={() => setTab("views")}>
              <Eye size={16} /> Profile Views
            </button>
            <button className={`lb-tab ${tab === "coins" ? "active" : "inactive"}`} onClick={() => setTab("coins")}>
              <span style={{ fontSize:16 }}>🪙</span> Coins Balance
            </button>
          </div>

          {/* Top 3 podium — alleen tonen als er 3 of meer zijn */}
          {!loading && !error && currentData.length >= 3 && (
            <div style={{ display:"flex", gap:12, justifyContent:"center", alignItems:"flex-end", marginBottom:32 }}>
              {/* 2nd */}
              <div style={{ flex:1, maxWidth:180, display:"flex", flexDirection:"column", alignItems:"center", gap:8, background:"rgba(156,163,175,0.08)", border:"2px solid rgba(156,163,175,0.2)", borderRadius:20, padding:"20px 12px 16px", marginBottom:0 }}>
                <Medal size={24} color="#9ca3af" />
                {currentData[1].avatar_url
                  ? <img src={currentData[1].avatar_url} alt="" className="lb-avatar" style={{ width:52, height:52 }} />
                  : <div className="lb-avatar-placeholder" style={{ width:52, height:52 }}>{(currentData[1].display_name || currentData[1].username)[0].toUpperCase()}</div>
                }
                <p style={{ fontWeight:700, fontSize:14, textAlign:"center" }}>{currentData[1].display_name || currentData[1].username}</p>
                <p style={{ color:"#9ca3af", fontSize:13, fontWeight:600 }}>
                  {tab === "views"
                    ? `${(currentData[1] as ProfileEntry).views.toLocaleString()} views`
                    : `${parseFloat(String((currentData[1] as CoinsEntry).balance)).toLocaleString()} coins`}
                </p>
              </div>
              {/* 1st */}
              <div style={{ flex:1, maxWidth:200, display:"flex", flexDirection:"column", alignItems:"center", gap:8, background:"rgba(251,191,36,0.08)", border:"2px solid rgba(251,191,36,0.3)", borderRadius:20, padding:"24px 12px 16px" }}>
                <Trophy size={28} color="#fbbf24" />
                {currentData[0].avatar_url
                  ? <img src={currentData[0].avatar_url} alt="" className="lb-avatar" style={{ width:64, height:64 }} />
                  : <div className="lb-avatar-placeholder" style={{ width:64, height:64, fontSize:24 }}>{(currentData[0].display_name || currentData[0].username)[0].toUpperCase()}</div>
                }
                <p style={{ fontWeight:700, fontSize:16, textAlign:"center" }}>{currentData[0].display_name || currentData[0].username}</p>
                <p style={{ color:"#fbbf24", fontSize:14, fontWeight:600 }}>
                  {tab === "views"
                    ? `${(currentData[0] as ProfileEntry).views.toLocaleString()} views`
                    : `${parseFloat(String((currentData[0] as CoinsEntry).balance)).toLocaleString()} coins`}
                </p>
              </div>
              {/* 3rd */}
              <div style={{ flex:1, maxWidth:180, display:"flex", flexDirection:"column", alignItems:"center", gap:8, background:"rgba(180,83,9,0.08)", border:"2px solid rgba(180,83,9,0.2)", borderRadius:20, padding:"20px 12px 16px" }}>
                <Medal size={24} color="#b45309" />
                {currentData[2].avatar_url
                  ? <img src={currentData[2].avatar_url} alt="" className="lb-avatar" style={{ width:52, height:52 }} />
                  : <div className="lb-avatar-placeholder" style={{ width:52, height:52 }}>{(currentData[2].display_name || currentData[2].username)[0].toUpperCase()}</div>
                }
                <p style={{ fontWeight:700, fontSize:14, textAlign:"center" }}>{currentData[2].display_name || currentData[2].username}</p>
                <p style={{ color:"#b45309", fontSize:13, fontWeight:600 }}>
                  {tab === "views"
                    ? `${(currentData[2] as ProfileEntry).views.toLocaleString()} views`
                    : `${parseFloat(String((currentData[2] as CoinsEntry).balance)).toLocaleString()} coins`}
                </p>
              </div>
            </div>
          )}

          {/* List — altijd alle entries tonen (of vanaf rank 4 als podium getoond wordt) */}
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {loading && Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="lb-skeleton" />
            ))}

            {error && (
              <div style={{ textAlign:"center", padding:"40px 0", color:"var(--utility-gray-500)" }}>
                <p style={{ fontSize:16 }}>Failed to load leaderboard.</p>
                <p style={{ fontSize:13, marginTop:8 }}>{error}</p>
              </div>
            )}

            {!loading && !error && currentData.length === 0 && (
              <div style={{ textAlign:"center", padding:"40px 0", color:"var(--utility-gray-500)" }}>
                <p style={{ fontSize:16 }}>No data available yet.</p>
              </div>
            )}

            {!loading && !error && currentData.map((entry, i) => {
              const rank = i + 1;
              // Als podium getoond wordt, sla top 3 over in de lijst
              if (currentData.length >= 3 && rank <= 3) return null;

              const value = tab === "views"
                ? `${(entry as ProfileEntry).views.toLocaleString()} views`
                : `${parseFloat(String((entry as CoinsEntry).balance)).toLocaleString()} 🪙`;

              return (
                <Link
                  key={entry.username}
                  to={`/${entry.username}`}
                  className="lb-row"
                  style={{ background: getRankBg(rank), borderColor: getRankBorder(rank), textDecoration:"none", color:"inherit" }}>
                  <div style={{ width:28, display:"flex", justifyContent:"center", flexShrink:0 }}>
                    {getRankIcon(rank)}
                  </div>
                  {entry.avatar_url
                    ? <img src={entry.avatar_url} alt="" className="lb-avatar" />
                    : <div className="lb-avatar-placeholder">{(entry.display_name || entry.username)[0].toUpperCase()}</div>
                  }
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                      <span style={{ fontWeight:600, fontSize:15 }}>{entry.display_name || entry.username}</span>
                      {entry.is_premium === 1 && (
                        <Crown size={13} color="#fbbf24" />
                      )}
                    </div>
                    <span style={{ color:"var(--utility-gray-500)", fontSize:13 }}>@{entry.username}</span>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:6, flexShrink:0 }}>
                    {tab === "views"
                      ? <Eye size={14} color="var(--utility-gray-500)" />
                      : <span style={{ fontSize:14 }}>🪙</span>}
                    <span style={{ fontWeight:700, fontSize:15 }}>{value}</span>
                  </div>
                </Link>
              );
            })}
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
                <a href="#" className="btn-outline" style={{ padding:"4px 10px 4px 8px", gap:6, fontSize:14 }}>
                  <span>🟢</span><span>Service Status</span>
                </a>
              </div>
              <div className="section-description" style={{ fontSize:16 }}>
                Your essential platform for creating modern, customizable bio-pages to meet all your digital needs.
              </div>
            </div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:40 }}>
              {[
                { h:"General",        links:[{l:"Pricing & Shop", to:"/shop"},{l:"Leaderboard", to:"/leaderboard"},{l:"Partners", to:"/partners"}] },
                { h:"Authentication", links:[{l:"Login", to:"/login"},{l:"Sign Up", to:"/register"}] },
                { h:"Contact",        links:[{l:"Discord", href:"https://discord.gg/vXzX2jzbyW"}] },
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