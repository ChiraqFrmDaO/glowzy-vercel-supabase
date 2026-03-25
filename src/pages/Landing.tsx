import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Link2, Palette, BarChart3, Shield, Zap, Crown, Eye, Users, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";

const features = [
  { icon: Link2,     title: "Custom Bio Links",   desc: "Add all your socials in one beautiful page" },
  { icon: Palette,   title: "Full Customization", desc: "Colors, effects, backgrounds, and more" },
  { icon: BarChart3, title: "Analytics",          desc: "Track views, clicks, and visitor data" },
  { icon: Shield,    title: "Secure Hosting",     desc: "Upload images and files securely" },
  { icon: Zap,       title: "Fast & Smooth",      desc: "Lightning fast with smooth animations" },
  { icon: Crown,     title: "Premium Features",   desc: "Unlock badges, effects, and more" },
];

const mockUsers = [
  { username: "fendziorr",    displayName: "FROZIAK",      pfp: "https://r2.frozi.lol/50424206-47ee-4532-bfa4-aaab5ba0749c.jpg",  verified: true  },
  { username: "og",           displayName: "r3nm4rss",     pfp: "https://r2.frozi.lol/2fb7572b-8dfb-4990-aeb2-2f405c091f90.png",  verified: false },
  { username: "dumbs1ut",     displayName: "Dumbyy Cowyy", pfp: "https://r2.frozi.lol/e0a274c6-d1d9-47ed-adf8-f98610fbe34e.png",  verified: false },
  { username: "s",            displayName: "sama",         pfp: "https://r2.frozi.lol/a4fc0448-d85a-4c94-a2bd-71f11e5ef1d6.jpeg", verified: true  },
  { username: "sorryitslena", displayName: "sorryitslena", pfp: "https://r2.frozi.lol/5bac7d00-521d-41d8-adb0-f02e1b9932df.png",  verified: false },
  { username: "babam",        displayName: "goon",         pfp: "https://r2.frozi.lol/1a01d679-7c03-4c27-9756-359ae7c3b5a9.jpg",  verified: false },
  { username: "p",            displayName: "77piotrus",    pfp: "https://r2.frozi.lol/85bd77c6-285f-4cc0-a01b-54e4027817cc.png",  verified: false },
  { username: "ifritov",      displayName: "ifritov",      pfp: "https://r2.frozi.lol/deed1a1c-7442-49c0-b255-72e7cb210041.webp", verified: false },
  { username: "jacobkrol",    displayName: "jacobkrol",    pfp: "https://r2.frozi.lol/1763025761316-019a40b5-b545-716c-aa29-94479dc657c1.jpg", verified: false },
  { username: "soh",          displayName: "soh",          pfp: "https://r2.frozi.lol/1763025783095-019a5f6e-9f6d-7303-9201-040fe0e6666f.png", verified: true  },
  { username: "kamek75",      displayName: "KAMEK75",      pfp: "https://r2.frozi.lol/5f0ccb7e-743f-4e04-a285-8076baedb517.png",  verified: false },
  { username: "dragon",       displayName: "dragon",       pfp: "https://r2.frozi.lol/5acbb4b0-9bf9-4bd5-85df-83feac9b654c.png",  verified: false },
];

const freePlan = [
  "Default Profile Layout", "Basic Customization", "Basic Effects",
  "Add Your Socials", "Upload only 1 Audio",
];

const premiumPlan = [
  "Exclusive Badge", "More Profile Layout Themes", "Advanced Layout Settings",
  "Special Profile Effects", "Upload up to 4 Audios", "Advanced Badges Management",
  "Access To Advanced Analytics", "Metadata Customization", "Priority Support",
  "Remove Watermark on Profile", "Multi-line Description", "Description Tags", "Portfolio Page",
];

const faqs = [
  { q: "What is this platform?",                     a: "A modern platform that provides feature-rich bio links for creators." },
  { q: "Is it free to use?",                         a: "Yes, completely free. We also offer a Premium package with exclusive features." },
  { q: "What can I do with it?",                     a: "Connect all your social media links in one place, making it easier to share your online presence." },
  { q: "How long does it take to set up my profile?",a: "Quick and easy — simply create an account and start customizing immediately." },
  { q: "Can I customize my profile appearance?",     a: "Yes! Extensive customization options including themes, colors, fonts, and layouts." },
  { q: "What are the benefits of Premium?",          a: "Premium unlocks advanced analytics, priority support, additional customization options, and more." },
];

const CheckIcon = () => (
  <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24"
    strokeLinecap="round" strokeLinejoin="round" height="14" width="14">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

const DiamondSvg = () => (
  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1em" width="1em">
    <path fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="32"
      d="m35.42 188.21 207.75 269.46a16.17 16.17 0 0 0 25.66 0l207.75-269.46a16.52 16.52 0 0 0 .95-18.75L407.06 55.71A16.22 16.22 0 0 0 393.27 48H118.73a16.22 16.22 0 0 0-13.79 7.71L34.47 169.46a16.52 16.52 0 0 0 .95 18.75zM48 176h416"/>
    <path fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="32"
      d="m400 64-48 112-96-128M112 64l48 112 96-128m0 400-96-272m96 272 96-272"/>
  </svg>
);

export default function Landing() {
  const [heroUsername, setHeroUsername] = useState("");
  const [ctaUsername,  setCtaUsername]  = useState("");
  const [openFaq,      setOpenFaq]      = useState<number | null>(null);
  const [scrolled,     setScrolled]     = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <style>{`
        :root {
          --transition-default: .3s;
          --color-primary: #4da6ff;
          --color-primary-dark: #4796e6;
          --color-primary-opacity: #4da6ff4d;
          --color-primary-opacity-dark: #4da6ff66;
          --color-pink: #ff66b2;
          --color-pink-opacity: #ff66b24d;
          --color-pink-opacity-dark: #ff66b266;
          --color-green: #4caf50;
          --color-green-opacity: #4caf504d;
          --color-green-opacity-dark: #4caf5066;
          --color-white: #fff;
          --color-lite-black: #0f0f12;
          --color-mid-gray: #979797;
          --color-opacity: #ffffff0d;
          --text-primary: #fafafa;
          --border-primary: #525252;
          --border-secondary: #ffffff0d;
          --utility-gray-100: #171717;
          --utility-gray-500: #737373;
          --utility-gray-600: #a3a3a3;
        }

        *, *::before, *::after { box-sizing: border-box; }
        body { font-family: Roboto, sans-serif; background-color: var(--color-lite-black); color: #fff; width: 100vw; overflow-x: hidden; }
        a { cursor: pointer !important; text-decoration: none; color: inherit; }
        ul, li { list-style: none; margin: 0; padding: 0; }
        img, svg { display: block; }
        button { font-family: inherit; }

        .l-grid {
          position: fixed; inset: 0; z-index: -1; opacity: 0.05; pointer-events: none;
          background-image: linear-gradient(to right,#d1d5db 1px,transparent 1px), linear-gradient(to bottom,#d1d5db 1px,transparent 1px);
          background-size: 32px 32px;
          -webkit-mask-image: radial-gradient(ellipse 60% 60% at 50% 50%,#000 30%,transparent 70%);
          mask-image: radial-gradient(ellipse 60% 60% at 50% 50%,#000 30%,transparent 70%);
        }

        /* ══ NAVBAR — exact frozi.lol CSS ══ */
        .navbar-container {
          z-index: 100;
          justify-content: center;
          align-items: center;
          padding: 16px;
          padding-bottom: 0 !important;
          transition: padding-top .2s;
          display: flex;
          position: fixed;
          inset: 0% 0% auto;
        }
        .navbar-container.navbar-container--at-top { padding-top: 6px !important; }
        nav {
          -webkit-backdrop-filter: blur(20px);
          backdrop-filter: blur(20px);
          background: #ffffff0f;
          border-radius: 20px;
          align-items: center;
          gap: 80px;
          padding: 15px 15px 15px 25px;
          transition: background-color .2s, -webkit-backdrop-filter .2s, backdrop-filter .2s, box-shadow .2s;
          display: inline-flex;
          box-shadow: 0 25px 50px -12px #00000040;
        }
        nav.nav-transparent {
          -webkit-backdrop-filter: none;
          backdrop-filter: none;
          box-shadow: none;
          background: transparent;
        }
        .nav-logo { display: flex; align-items: center; gap: 8px; }
        .nav-logo-icon { display: flex; align-items: center; transition: transform .3s; }
        .nav-logo-icon:hover { transform: scale(1.2) rotate(12deg); }
        .nav-links { display: flex; align-items: center; gap: 10px; }

        section, footer { flex-direction:column; justify-content:center; align-items:center; gap:32px; max-width:72rem; margin:auto; padding:32px 32px 200px; display:flex; }
        footer { padding-top:0; padding-bottom:32px; }
        .hero-section { padding-bottom:40px; }

        .btn-outline { cursor:pointer; transition:all var(--transition-default); border:2px solid var(--border-secondary); border-radius:12px; outline:none; justify-content:center; padding:8px 16px; font-size:16px; font-weight:500; display:inline-flex; align-items:center; color:#fff; text-decoration:none; background:transparent; font-family:Roboto,sans-serif; backdrop-filter:blur(12px); -webkit-backdrop-filter:blur(12px); white-space:nowrap; }
        .btn-outline:hover { border:2px solid var(--border-primary); background-color:var(--color-opacity); }
        .btn-outline.rounded { border-radius:9999px; }
        .btn-outline.primary { background-color:var(--color-primary-opacity); border:2px solid var(--color-primary-dark); }
        .btn-outline.primary:hover { border:2px solid var(--color-primary-dark)!important; background-color:var(--color-primary-opacity-dark)!important; }
        .btn-outline.pink { background-color:var(--color-pink-opacity); border:2px solid var(--color-pink); }
        .btn-outline.pink:hover { background-color:var(--color-pink-opacity-dark); border:2px solid var(--color-pink)!important; }
        .btn-outline.green { background-color:var(--color-green-opacity); border:2px solid var(--color-green); }
        .btn-outline.green:hover { background-color:var(--color-green-opacity-dark); border:2px solid var(--color-green)!important; }

        .feature { background-color:var(--color-lite-black); border:2px solid var(--border-secondary); border-radius:20px; outline:none; padding:20px; transition:transform .3s; }
        .feature:hover { transform:scale(0.95); }
        .feature-title { color:var(--text-primary); }
        .feature-icon { background-color:var(--color-primary-opacity); border:2px solid var(--color-primary-dark); border-radius:10px; width:64px; height:64px; display:flex; align-items:center; justify-content:center; font-size:1.5rem; }

        .input_body { background-color:var(--color-lite-black); color:var(--color-mid-gray); border:var(--border-secondary) 2px solid; box-sizing:border-box; border-radius:12px; outline:none; align-items:center; gap:2px; padding:8px 12px; display:flex; }
        .input_body input { color:#fff; width:100%; background:transparent; border:none; outline:none; font-family:Roboto,sans-serif; font-size:inherit; }
        .input_body input::placeholder { color:#444; }

        .divider { border-top:2px solid var(--border-secondary); width:100%; }

        .nameplate-container { position:relative; }
        .nameplate-container .nameplate-container_text { z-index:100; transform-origin:50%; text-align:center; pointer-events:none; opacity:0; background-color:var(--utility-gray-100); border:2px solid var(--border-secondary); border-radius:10px; align-items:center; gap:6px; width:max-content; padding:2px 6px; font-size:13px; transition:all .2s; display:flex; position:absolute; bottom:110%; left:50%; transform:translate(-50%) scale(.9); color:#fff; }
        .nameplate-container:hover .nameplate-container_text { opacity:1; bottom:120%; transform:translate(-50%) scale(1); }

        .l-page { position:relative; width:100%; }

        /* ══ HERO — full viewport, navbar floats over it ══ */
        .l-hero { position:relative; display:flex; flex-direction:column; justify-content:center; align-items:center; text-align:center; gap:32px; height:auto; padding:20px 32px 40px; }
        .l-hero h1 { font-size:clamp(2.2rem,6vw,4rem); font-weight:700; line-height:1.12; max-width:64rem; margin:0; }
        .l-hero p { color:var(--utility-gray-500); font-size:1.2rem; margin:0; }

        .l-scroll-btn { display:flex; flex-direction:column; align-items:center; gap:8px; color:#737373; background:none; border:none; cursor:pointer; animation:l-bounce 1s infinite; transition:color .3s; font-size:1.1rem; font-weight:600; font-family:Roboto,sans-serif; margin-top:160px; }
        .l-scroll-btn:hover { color:#fff; }
        @keyframes l-bounce { 0%,100%{transform:translateX(-50%) translateY(-25%);animation-timing-function:cubic-bezier(.8,0,1,1)} 50%{transform:translateX(-50%) translateY(0);animation-timing-function:cubic-bezier(0,0,.2,1)} }

        .l-input-pill { display:flex; align-items:stretch; }
        .l-input-pill .input_body { border-radius:16px 0 0 16px; border:2px solid var(--color-primary-dark); border-right:none; padding:12px 16px; font-size:1.1rem; }
        .l-claim-btn { background-color:var(--color-primary-opacity); border:2px solid var(--color-primary-dark); border-left:none; border-radius:0 16px 16px 0; color:#fff; font-size:1.1rem; font-weight:700; padding:12px 24px; cursor:pointer; text-decoration:none; display:inline-flex; align-items:center; transition:background .2s; font-family:Roboto,sans-serif; }
        .l-claim-btn:hover { background-color:var(--color-primary-opacity-dark); }

        .l-marquee-outer { overflow:hidden; padding:76px 0; width:100%; }
        .l-marquee-track { display:flex; gap:24px; width:max-content; animation:l-marquee 35s linear infinite; }
        @keyframes l-marquee { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        .l-user-card { display:inline-flex; align-items:center; gap:20px; padding:16px 80px 16px 16px; background-color:var(--color-lite-black); border:2px solid var(--border-secondary); border-radius:20px; flex-shrink:0; transition:border-color .3s; text-decoration:none; color:#fff; }
        .l-user-card:hover { border-color:var(--color-primary); }
        .l-user-card img { width:60px; height:60px; border-radius:50%; object-fit:cover; flex-shrink:0; }
        .l-user-name { font-size:1.2rem; font-weight:700; display:flex; align-items:center; gap:4px; }
        .l-user-handle { font-size:.85rem; color:var(--utility-gray-500); }

        .l-pricing-grid { display:flex; flex-direction:column; gap:16px; width:100%; max-width:80%; align-items:flex-end; }
        @media(min-width:768px){ .l-pricing-grid{flex-direction:row;} }
        .l-plan { position:relative; flex:1; display:flex; flex-direction:column; gap:24px; border-radius:24px; padding:20px; background-color:var(--utility-gray-100); border:2px solid var(--border-secondary); }
        .l-plan.pink { border-color:var(--color-pink); }
        .l-popular { position:absolute; top:-16px; right:-16px; background-color:var(--color-pink-opacity); border:2px solid var(--color-pink); border-radius:9999px; padding:6px 12px 6px 14px; font-size:14px; font-weight:600; color:#fff; display:flex; align-items:center; gap:6px; backdrop-filter:blur(6px); line-height:1; }
        .l-checklist { background:var(--color-opacity); border-radius:12px; padding:16px; display:flex; flex-direction:column; gap:8px; }
        .l-check-item { display:flex; align-items:center; gap:8px; font-size:1rem; }
        .l-check-icon { padding:4px; border-radius:50%; border:1px solid currentColor; display:flex; flex-shrink:0; }
        .l-check-icon.blue { color:var(--color-primary); }
        .l-check-icon.pink { color:var(--color-pink); }

        .l-faq-btn { width:100%; text-align:left; padding:16px 20px; border-radius:16px; border:2px solid var(--border-secondary); background-color:var(--color-lite-black); color:#fff; cursor:pointer; display:flex; flex-direction:column; transition:border-color .2s; font-family:Roboto,sans-serif; font-size:1.2rem; font-weight:400; }
        .l-faq-btn:hover, .l-faq-btn.open { border-color:var(--color-primary); }
        .l-faq-header { display:flex; justify-content:space-between; align-items:center; font-size:1.2rem; font-weight:600; width:100%; }
        .l-faq-arrow { transition:transform .2s; }
        .l-faq-arrow.open { transform:rotate(180deg); }
        .l-faq-body { overflow:hidden; transition:max-height .3s ease-in-out; width:100%; }
        .l-faq-body p { color:var(--utility-gray-500); font-size:1rem; font-weight:500; }

        .section-description { color:var(--utility-gray-500); }
        .l-footer-link { color:var(--utility-gray-500); font-size:16px; text-decoration:none; transition:color .3s; }
        .l-footer-link:hover { color:var(--utility-gray-600); }
      `}</style>

      <div className="l-page">
        <div className="l-grid" />

        {/* ════ NAVBAR ════ */}
        <div className="navbar-container navbar-container--at-top">
          <nav className={scrolled ? "" : "nav-transparent"}>
            {/* logo — part of the inline-flex row, no separate left/right split */}
            <Link to="/" className="nav-logo">
              <div className="nav-logo-icon">
                <img src="/assets/logo.svg" alt="Glowzy.lol" width={30} height={30} />
              </div>
              <span style={{ fontSize:"1.5rem", fontWeight:600, whiteSpace:"nowrap" }}>Glowzy.lol</span>
            </Link>

            {/* links — directly next to logo in the same flex row */}
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

        {/* ════ HERO ════ */}
        <div className="l-hero">
          <motion.a href="https://discord.gg/vXzX2jzbyW" target="_blank" rel="noreferrer"
            className="btn-outline primary rounded"
            style={{ fontSize:14, fontWeight:600, padding:"6px 16px", gap:8 }}
            initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.4 }}>
            <svg fill="currentColor" height="16" width="16" viewBox="0 0 640 512">
              <path d="M524.531,69.836a1.5,1.5,0,0,0-.764-.7A485.065,485.065,0,0,0,404.081,32.03a1.816,1.816,0,0,0-1.923.91,337.461,337.461,0,0,0-14.9,30.6,447.848,447.848,0,0,0-134.426,0,309.541,309.541,0,0,0-15.135-30.6,1.89,1.89,0,0,0-1.924-.91A483.689,483.689,0,0,0,116.085,69.137a1.712,1.712,0,0,0-.788.676C39.068,183.651,18.186,294.69,28.43,404.354a2.016,2.016,0,0,0,.765,1.375A487.666,487.666,0,0,0,176.02,479.918a1.9,1.9,0,0,0,2.063-.676A348.2,348.2,0,0,0,208.12,430.4a1.86,1.86,0,0,0-1.019-2.588,321.173,321.173,0,0,1-45.868-21.853,1.885,1.885,0,0,1-.185-3.126c3.082-2.309,6.166-4.711,9.109-7.137a1.819,1.819,0,0,1,1.9-.256c96.229,43.917,200.41,43.917,295.5,0a1.812,1.812,0,0,1,1.924.233c2.944,2.426,6.027,4.851,9.132,7.16a1.884,1.884,0,0,1-.162,3.126,301.407,301.407,0,0,1-45.89,21.83,1.875,1.875,0,0,0-1,2.611,391.055,391.055,0,0,0,30.014,48.815,1.864,1.864,0,0,0,2.063.7A486.048,486.048,0,0,0,610.7,405.729a1.882,1.882,0,0,0,.765-1.352C623.729,277.594,590.933,167.465,524.531,69.836Z"/>
            </svg>
            <span>Join the Discord!</span>
            <ArrowRight size={12} />
          </motion.a>

          <motion.h1 initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6 }}>
            Create your own modern<br />bio-page in minutes!
          </motion.h1>

          <motion.p initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6, delay:0.1 }}>
            Its your essential platform for creating modern,<br />
            customizable bio-pages to meet all your digital needs.
          </motion.p>

          <motion.div className="l-input-pill"
            initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6, delay:0.2 }}>
            <div className="input_body" style={{ borderRadius:"16px 0 0 16px", border:"2px solid var(--color-primary-dark)", borderRight:"none", padding:"12px 16px", fontSize:"1.1rem" }}>
              <span>glowzy.lol/</span>
              <input type="text" placeholder="username" maxLength={20}
                value={heroUsername} onChange={e=>setHeroUsername(e.target.value)} />
            </div>
            <Link to={`/register${heroUsername?`?username=${heroUsername}`:""}`} className="l-claim-btn">
              Claim Now
            </Link>
          </motion.div>

          <button className="l-scroll-btn" onClick={()=>window.scrollBy({top:window.innerHeight,behavior:"smooth"})}>
            <span>Scroll down</span>
            <ChevronDown size={24} />
          </button>
        </div>

        {/* ════ MARQUEE ════ */}
        <div className="l-marquee-outer">
          <div className="l-marquee-track">
            {[...mockUsers,...mockUsers].map((u,i)=>(
              <a key={i} href={`/${u.username}`} target="_blank" rel="noreferrer" className="l-user-card">
                <img src={u.pfp} alt={u.username} />
                <div>
                  <div className="l-user-name">
                    {u.displayName||u.username}
                    {u.verified&&<svg fill="#4da6ff" viewBox="0 0 24 24" height="14" width="14"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>}
                  </div>
                  <div className="l-user-handle">@{u.username}</div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* ════ STATS ════ */}
        <section style={{ alignItems:"flex-start" }}>
          <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
            style={{ fontSize:"clamp(2rem,5vw,3.75rem)", fontWeight:700, maxWidth:"64rem" }}>
            Over <span style={{ color:"var(--color-primary)" }}>2,300</span> people use Glowzy.lol
          </motion.div>
          <div style={{ color:"var(--utility-gray-500)", fontSize:"1.1rem" }}>
            Create feature-rich, customizable and modern link-in-bio pages to meet all your digital needs.
          </div>
          <div style={{ display:"flex", gap:16, width:"100%", flexWrap:"wrap" }}>
            {[
              { n:"22,438", l:"All profile views", I:Eye   },
              { n:"2,379",  l:"Users",             I:Users },
              { n:"84",     l:"Premium users",     I:Crown },
            ].map((s,i)=>(
              <motion.div key={s.l} className="feature"
                style={{ flex:1, minWidth:180, display:"flex", flexDirection:"column", gap:8 }}
                initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }}
                viewport={{ once:true }} transition={{ delay:i*0.1 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", fontSize:"1.875rem", fontWeight:600 }}>
                  {s.n}<s.I size={26} color="#4da6ff" />
                </div>
                <div style={{ color:"var(--utility-gray-500)" }}>{s.l}</div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ════ FEATURES ════ */}
        <section>
          <div className="btn-outline primary rounded" style={{ fontSize:14, fontWeight:600, padding:"6px 16px" }}>Features</div>
          <div style={{ fontSize:"clamp(1.8rem,5vw,3.75rem)", fontWeight:700, maxWidth:"64rem", textAlign:"center" }}>
            Everything you need
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))", gap:16, width:"100%" }}>
            {features.map((f,i)=>(
              <motion.div key={f.title} className="feature"
                style={{ display:"flex", flexDirection:"column", gap:16 }}
                initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }}
                viewport={{ once:true }} transition={{ delay:i*0.1 }}>
                <div className="feature-icon"><f.icon size={22} color="#4da6ff" /></div>
                <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                  <div className="feature-title" style={{ fontSize:"1.1rem", fontWeight:600 }}>{f.title}</div>
                  <div style={{ color:"var(--utility-gray-500)", fontSize:".95rem" }}>{f.desc}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ════ PRICING ════ */}
        <section>
          <div className="btn-outline primary rounded" style={{ fontSize:14, fontWeight:600, padding:"6px 16px" }}>Pricing</div>
          <div style={{ fontSize:"clamp(1.8rem,5vw,3.75rem)", fontWeight:700, maxWidth:"64rem", textAlign:"center" }}>
            Explore our exclusive plans
          </div>
          <div style={{ color:"var(--utility-gray-500)", fontSize:"1.1rem", maxWidth:"66%", textAlign:"center" }}>
            Become a part of a growing community. Get access to exclusive features, priority support, and more.
          </div>
          <div className="l-pricing-grid">
            <div className="l-plan">
              <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
                <div className="feature-title" style={{ fontSize:"1.25rem", fontWeight:600 }}>Free</div>
                <div className="divider"/>
              </div>
              <div style={{ display:"flex", alignItems:"baseline", gap:8 }}>
                <span className="feature-title" style={{ fontSize:"2.5rem", fontWeight:600 }}>$0.00</span>
                <span style={{ color:"var(--utility-gray-500)", fontSize:".875rem" }}>/Lifetime</span>
              </div>
              <div style={{ color:"var(--utility-gray-500)" }}>For beginners, link all your socials in one place.</div>
              <div className="l-checklist">
                {freePlan.map(item=>(
                  <div key={item} className="l-check-item">
                    <div className="l-check-icon blue"><CheckIcon/></div>{item}
                  </div>
                ))}
              </div>
              <Link className="btn-outline primary" to="/register" style={{ width:"100%", justifyContent:"center" }}>Get Started</Link>
            </div>
            <div className="l-plan pink">
              <div className="l-popular">Popular
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#fff" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
                </svg>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
                <div className="feature-title" style={{ fontSize:"1.25rem", fontWeight:600, display:"flex", alignItems:"center", gap:8 }}>
                  <DiamondSvg/> Premium
                </div>
                <div className="divider"/>
              </div>
              <div>
                <div style={{ display:"flex", alignItems:"baseline", gap:8 }}>
                  <span className="feature-title" style={{ fontSize:"2.5rem", fontWeight:600 }}>$5.99</span>
                  <span style={{ color:"var(--utility-gray-500)", fontSize:".875rem" }}>/Lifetime</span>
                </div>
                <div style={{ color:"var(--color-pink)", fontSize:"1rem", marginTop:4 }}>One payment. Lifetime access.</div>
              </div>
              <div style={{ color:"var(--utility-gray-500)" }}>The perfect plan to discover your creativity &amp; unlock more features.</div>
              <div className="l-checklist">
                {premiumPlan.map(item=>(
                  <div key={item} className="l-check-item">
                    <div className="l-check-icon pink"><CheckIcon/></div>{item}
                  </div>
                ))}
              </div>
              <div style={{ display:"flex", gap:16, alignItems:"center" }}>
                <Link className="btn-outline pink" to="/register?plan=premium" style={{ flex:1, justifyContent:"center" }}>Get Started</Link>
                <button style={{ background:"none", border:"none", cursor:"pointer" }}>
                  <div className="nameplate-container">
                    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" style={{ color:"var(--color-pink)" }} height="28" width="28">
                      <path d="M190.5 68.8L225.3 128l-1.3 0-72 0c-22.1 0-40-17.9-40-40s17.9-40 40-40l2.2 0c14.9 0 28.8 7.9 36.3 20.8zM64 88c0 14.4 3.5 28 9.6 40L32 128c-17.7 0-32 14.3-32 32l0 64c0 17.7 14.3 32 32 32l448 0c17.7 0 32-14.3 32-32l0-64c0-17.7-14.3-32-32-32l-41.6 0c6.1-12 9.6-25.6 9.6-40c0-48.6-39.4-88-88-88l-2.2 0c-31.9 0-61.5 16.9-77.7 44.4L256 85.5l-24.1-41C215.7 16.9 186.1 0 154.2 0L152 0C103.4 0 64 39.4 64 88zm336 0c0 22.1-17.9 40-40 40l-72 0-1.3 0 34.8-59.2C329.1 55.9 342.9 48 357.8 48l2.2 0c22.1 0 40 17.9 40 40zM32 288l0 176c0 26.5 21.5 48 48 48l144 0 0-224L32 288zM288 512l144 0c26.5 0 48-21.5 48-48l0-176-192 0 0 224z"/>
                    </svg>
                    <div className="nameplate-container_text">Buy as a Gift</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ════ FAQ ════ */}
        <section style={{ alignItems:"flex-start" }}>
          <div style={{ fontSize:"clamp(1.8rem,5vw,3.75rem)", fontWeight:700, maxWidth:"64rem" }}>Frequently Asked Questions</div>
          <div style={{ color:"var(--utility-gray-500)", fontSize:"1.1rem" }}>If you have any questions, please feel free to contact us.</div>
          <div style={{ display:"flex", flexDirection:"column", gap:16, width:"100%" }}>
            {faqs.map((faq,i)=>(
              <button key={i} className={`l-faq-btn${openFaq===i?" open":""}`} onClick={()=>setOpenFaq(openFaq===i?null:i)}>
                <div className="l-faq-header">
                  {faq.q}
                  <span className={`l-faq-arrow${openFaq===i?" open":""}`}><ChevronDown size={20}/></span>
                </div>
                <div className="l-faq-body" style={{ maxHeight:openFaq===i?"200px":"0px" }}>
                  <div className="divider" style={{ margin:"8px 0" }}/>
                  <p>{faq.a}</p>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* ════ CTA BANNER ════ */}
        <section className="hero-section">
          <div className="feature" style={{ padding:40, borderRadius:24, maxWidth:"100%", width:"100%", background:"var(--color-primary-opacity)", border:"2px solid var(--color-primary-dark)", backdropFilter:"blur(8px)", display:"flex", flexDirection:"column", gap:16 }}>
            <div style={{ fontSize:"clamp(1.8rem,4vw,3.75rem)", fontWeight:700, maxWidth:"64rem" }}>Everything you want in one place.</div>
            <div style={{ color:"#a3a3a3", fontSize:"1.1rem", maxWidth:540 }}>
              Big savings are here! For a limited time, enjoy exclusive discounts on all products. Shop now and don't miss your chance to save!
            </div>
            <div style={{ marginTop:16 }}>
              <div className="l-input-pill">
                <div className="input_body" style={{ borderRadius:"16px 0 0 16px", border:"2px solid var(--color-primary-dark)", borderRight:"none", padding:"12px 16px", fontSize:"1.1rem" }}>
                  <span>glowzy.lol/</span>
                  <input type="text" placeholder="username" maxLength={20}
                    value={ctaUsername} onChange={e=>setCtaUsername(e.target.value)} />
                </div>
                <Link to={`/register${ctaUsername?`?username=${ctaUsername}`:""}`} className="l-claim-btn">Claim Now</Link>
              </div>
            </div>
          </div>
        </section>

        {/* ════ FOOTER ════ */}
        <footer>
          <div style={{ display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:80, width:"100%" }}>
            <div style={{ display:"flex", flexDirection:"column", gap:16, maxWidth:"24rem" }}>
              <div style={{ display:"flex", alignItems:"center", gap:16 }}>
                <Link to="/" style={{ display:"flex", alignItems:"center", gap:12 }}>
                  <img src="/assets/logo.svg" alt="logo" width={30} height={30}
                    style={{ transition:"transform .3s" }}
                    onMouseEnter={e=>((e.target as HTMLImageElement).style.transform="scale(1.2) rotate(12deg)")}
                    onMouseLeave={e=>((e.target as HTMLImageElement).style.transform="")} />
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
                { h:"General",        links:[{l:"Pricing & Shop",to:"/shop"},{l:"Leaderboard",to:"/leaderboard"},{l:"Partners",to:"/partners"}] },
                { h:"Authentication", links:[{l:"Login",to:"/login"},{l:"Sign Up",to:"/register"}] },
                { h:"Contact",        links:[{l:"Discord",href:"https://discord.gg/vXzX2jzbyW"}] },
                { h:"Legal",          links:[{l:"Terms",href:"#"},{l:"Privacy",href:"#"}] },
              ].map(sec=>(
                <div key={sec.h} style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  <h3 style={{ color:"#fff", fontSize:"1.5rem", fontWeight:600, marginBottom:4 }}>{sec.h}</h3>
                  {sec.links.map((lk:any)=>
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
