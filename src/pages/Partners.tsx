import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const PARTNERS = [
  {
    name: "soon.",
    code: "soon",
    color: "#4caf50",
    logo: "https://placehold.co/80x80/1a3a1a/4caf50?text=W",
    desc: "soon",
    discord: "https://discord.gg/example",
    website: "soon",
  },
  {
    name: "soon",
    code: "soon",
    color: "#ef4444",
    logo: "https://placehold.co/80x80/3a1a1a/ef4444?text=L",
    desc: "soon",
    discord: "https://discord.gg/example",
    website: "soon",
  },
  {
    name: "soon",
    code: "soon",
    color: "#4caf50",
    logo: "https://placehold.co/80x80/0a2a0a/4caf50?text=CL",
    desc: "soon",
    discord: "https://discord.gg/example",
    website: null,
  },
  {
    name: "soon",
    code: "soon",
    color: "#f59e0b",
    logo: "https://placehold.co/80x80/2a1a0a/f59e0b?text=FA",
    desc: "soon",
    discord: "https://discord.gg/example",
    website: null,
  },
];

export default function Partners() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
        .p-tag.blue { background:var(--color-primary-opacity); border:2px solid var(--color-primary-dark); color:var(--color-primary); }

        .partner-card { background:var(--utility-gray-100); border:2px solid var(--border-secondary); border-radius:20px; padding:28px; display:flex; flex-direction:column; gap:16px; transition:border-color .2s,transform .2s; }
        .partner-card:hover { transform:translateY(-2px); }
        .partner-logo { width:80px; height:80px; border-radius:16px; object-fit:cover; }
        .partner-btn { cursor:pointer; border-radius:10px; font-size:14px; font-weight:600; padding:11px 20px; font-family:Roboto,sans-serif; transition:all .2s; border:2px solid; flex:1; text-align:center; }
        .partner-btn.discord { background:var(--color-primary-opacity); border-color:var(--color-primary-dark); color:#fff; }
        .partner-btn.discord:hover { background:var(--color-primary-opacity-dark); }
        .partner-btn.website { background:var(--color-green-opacity); border-color:var(--color-green); color:#fff; }
        .partner-btn.website:hover { background:var(--color-green-opacity-dark); }

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
          <div style={{ textAlign:"center", marginBottom:48 }}>
            <span className="p-tag blue">Partners</span>
            <h1 style={{ fontSize:"clamp(1.8rem,4vw,2.8rem)", fontWeight:700 }}>Explore our amazing partners</h1>
          </div>

          {/* Grid */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:20 }}>
            {PARTNERS.map(p => (
              <div key={p.name} className="partner-card" style={{ borderColor: `${p.color}33` }}>
                <img src={p.logo} alt={p.name} className="partner-logo" />
                <div>
                  <h2 style={{ fontSize:"1.3rem", fontWeight:700, color:p.color, marginBottom:4 }}>{p.name}</h2>
                  <p style={{ color:"var(--utility-gray-500)", fontSize:13 }}>
                    Partner Code: <strong style={{ color:"#fff" }}>{p.code}</strong>
                  </p>
                </div>
                <p style={{ color:"var(--utility-gray-500)", fontSize:13, lineHeight:1.6, flex:1 }}>{p.desc}</p>
                <div style={{ display:"flex", gap:10 }}>
                  <a href={p.discord} target="_blank" rel="noreferrer" className="partner-btn discord">
                    Join Discord
                  </a>
                  {p.website && (
                    <a href={p.website} target="_blank" rel="noreferrer" className="partner-btn website">
                      Visit Website
                    </a>
                  )}
                </div>
              </div>
            ))}
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