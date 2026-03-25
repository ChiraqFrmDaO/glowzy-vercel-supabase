import React, { useState, useEffect, CSSProperties } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { X, ChevronLeft } from 'lucide-react';

/* ─── Custom SVG Icons ─── */
const IconCoin = ({ size = 16, color = 'currentColor' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v2m0 8v2M9 9.5c0-1 1-1.5 3-1.5s3 .5 3 1.5-1 1.5-3 1.5-3 .5-3 1.5 1 1.5 3 1.5 3-.5 3-1.5" />
  </svg>
);
const IconGift = ({ size = 16, color = 'currentColor' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 12 20 22 4 22 4 12" />
    <rect x="2" y="7" width="20" height="5" />
    <line x1="12" y1="22" x2="12" y2="7" />
    <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
    <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
  </svg>
);
const IconClock = ({ size = 16, color = 'currentColor' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);
const IconDice = ({ size = 32, color = 'currentColor' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="4" />
    <circle cx="8" cy="8" r="1.2" fill={color} stroke="none" />
    <circle cx="16" cy="8" r="1.2" fill={color} stroke="none" />
    <circle cx="8" cy="16" r="1.2" fill={color} stroke="none" />
    <circle cx="16" cy="16" r="1.2" fill={color} stroke="none" />
    <circle cx="12" cy="12" r="1.2" fill={color} stroke="none" />
  </svg>
);
const IconWheel = ({ size = 32, color = 'currentColor' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="3" />
    <line x1="12" y1="2" x2="12" y2="9" />
    <line x1="12" y1="15" x2="12" y2="22" />
    <line x1="2" y1="12" x2="9" y2="12" />
    <line x1="15" y1="12" x2="22" y2="12" />
    <line x1="4.93" y1="4.93" x2="9.17" y2="9.17" />
    <line x1="14.83" y1="14.83" x2="19.07" y2="19.07" />
    <line x1="19.07" y1="4.93" x2="14.83" y2="9.17" />
    <line x1="9.17" y1="14.83" x2="4.93" y2="19.07" />
  </svg>
);
const IconSlots = ({ size = 32, color = 'currentColor' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="3" />
    <rect x="5" y="7" width="4" height="10" rx="1" />
    <rect x="10" y="7" width="4" height="10" rx="1" />
    <rect x="15" y="7" width="4" height="10" rx="1" />
    <line x1="2" y1="11" x2="22" y2="11" />
    <circle cx="19" cy="3" r="1.5" fill={color} stroke="none" />
    <line x1="19" y1="4.5" x2="19" y2="7" />
  </svg>
);
const IconScissors = ({ size = 32, color = 'currentColor' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="6" cy="6" r="3" />
    <circle cx="6" cy="18" r="3" />
    <line x1="20" y1="4" x2="8.12" y2="15.88" />
    <line x1="14.47" y1="14.48" x2="20" y2="20" />
    <line x1="8.12" y1="8.12" x2="12" y2="12" />
  </svg>
);
const IconTarget = ({ size = 32, color = 'currentColor' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);
const IconTrophy = ({ size = 32, color = 'currentColor' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="8 21 12 21 16 21" />
    <line x1="12" y1="17" x2="12" y2="21" />
    <path d="M7 4H17L15 12C15 14.2 13.7 16 12 16C10.3 16 9 14.2 9 12L7 4Z" />
    <path d="M7 4C7 4 4 4 4 7C4 10 7 11 7 11" />
    <path d="M17 4C17 4 20 4 20 7C20 10 17 11 17 11" />
  </svg>
);
const IconStar = ({ size = 16, color = 'currentColor' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke="none">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

interface WheelResult { label: string; multiplier: number; }
interface HallOfFameUser { username?: string; email?: string; total_games?: number; balance?: number; }
interface StyleTokens {
  card: CSSProperties; inputBase: CSSProperties; btnPrimary: CSSProperties;
  btnSecondary: CSSProperties; btnActive: CSSProperties; label: CSSProperties; tag: CSSProperties;
}

const injectStyles = () => {
  if (document.getElementById('casino-styles')) return;
  const style = document.createElement('style');
  style.id = 'casino-styles';
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;600;700&family=Orbitron:wght@700;900&display=swap');
    @keyframes neonPulse {
      0%,100% { box-shadow: 0 0 8px rgba(59,130,246,0.4), 0 0 24px rgba(59,130,246,0.2), inset 0 0 8px rgba(59,130,246,0.1); }
      50%      { box-shadow: 0 0 16px rgba(37,99,235,0.6), 0 0 40px rgba(37,99,235,0.3), inset 0 0 12px rgba(37,99,235,0.2); }
    }
    @keyframes winFlash { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
    .casino-font { font-family: 'Rajdhani', sans-serif; }
    .casino-display { font-family: 'Orbitron', monospace; }
    .neon-border { animation: neonPulse 2.5s ease-in-out infinite; }
    .win-flash { animation: winFlash 0.4s ease-in-out 4; }

    /* ── Scale fix: make 100% zoom look like 125% ── */
    .casino-root {
      font-size: 125%;
    }
  `;
  document.head.appendChild(style);
};

// Scale factor applied inline where em/rem won't reach (px values in JS objects).
// We multiply every hardcoded px value by 1.25.
const PX = (n: number) => `${Math.round(n * 1.25)}px`;

const s: StyleTokens = {
  card: { background: 'linear-gradient(160deg, #1e2530 0%, #272c34 100%)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: PX(16), padding: PX(28) },
  inputBase: { background: '#1a1f27', border: '1px solid rgba(59,130,246,0.25)', borderRadius: PX(8), color: '#e2e2f0', padding: `${PX(10)} ${PX(14)}`, fontSize: PX(14), width: '100%', outline: 'none', fontFamily: 'Rajdhani, sans-serif' },
  btnPrimary: { background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', border: 'none', borderRadius: PX(8), color: '#fff', fontWeight: '700', fontSize: PX(14), padding: `${PX(12)} ${PX(20)}`, cursor: 'pointer', width: '100%', transition: 'opacity .15s', fontFamily: 'Rajdhani, sans-serif', letterSpacing: '0.05em' },
  btnSecondary: { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: PX(8), color: '#888899', fontWeight: '500', fontSize: PX(13), padding: `${PX(9)} ${PX(14)}`, cursor: 'pointer', transition: 'all .15s', fontFamily: 'Rajdhani, sans-serif' },
  btnActive: { background: 'rgba(59,130,246,0.18)', border: '1px solid rgba(59,130,246,0.6)', borderRadius: PX(8), color: '#93c5fd', fontWeight: '700', fontSize: PX(13), padding: `${PX(9)} ${PX(14)}`, cursor: 'pointer', fontFamily: 'Rajdhani, sans-serif' },
  label: { fontSize: PX(11), color: '#4a5568', fontWeight: '600', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: PX(10), display: 'block', fontFamily: 'Rajdhani, sans-serif' },
  tag: { display: 'inline-flex', alignItems: 'center', gap: PX(6), background: 'rgba(59,130,246,0.12)', color: '#93c5fd', borderRadius: PX(6), padding: `${PX(5)} ${PX(12)}`, fontSize: PX(13), fontWeight: '600', fontFamily: 'Rajdhani, sans-serif' },
};

const BetButtons = ({ value, onChange }: { value: number; onChange: (v: number) => void }) => (
  <div style={{ display: 'flex', gap: PX(8) }}>
    {[10, 25, 50, 100].map(a => (
      <button key={a} onClick={() => onChange(a)} style={value === a ? s.btnActive : s.btnSecondary}>{a}</button>
    ))}
  </div>
);

const CasinoCard = ({ children, glow = false }: { children: React.ReactNode; glow?: boolean }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
    style={{ ...s.card, position: 'relative', overflow: 'hidden', boxShadow: '0 8px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)' }}>
    {glow && <div className="neon-border" style={{ position: 'absolute', inset: 0, borderRadius: PX(16), pointerEvents: 'none', zIndex: 0 }} />}
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(37,99,235,0.6), transparent)', zIndex: 1 }} />
    <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>
  </motion.div>
);

const GameTitle = ({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: PX(10), marginBottom: PX(28) }}>
    <span style={{ display: 'flex', alignItems: 'center' }}>{icon}</span>
    <p className="casino-display" style={{ fontSize: PX(14), fontWeight: '700', color: '#c4c4e8', letterSpacing: '0.08em', margin: 0 }}>{children}</p>
  </div>
);

const WinBanner = ({ type }: { type: 'jackpot' | 'win' | 'lose' | null }) => {
  if (!type) return null;
  const cfg = {
    jackpot: { bg: 'rgba(250,204,21,0.12)', border: 'rgba(250,204,21,0.4)', color: '#facc15', label: '🎉 JACKPOT!' },
    win:     { bg: 'rgba(59,130,246,0.1)',   border: 'rgba(59,130,246,0.4)',  color: '#93c5fd', label: '✨ WIN!'    },
    lose:    { bg: 'rgba(239,68,68,0.08)',   border: 'rgba(239,68,68,0.3)',  color: '#f87171', label: '✗ NO WIN'  },
  }[type];
  return (
    <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 300 }}
      className={type === 'jackpot' || type === 'win' ? 'win-flash' : ''}
      style={{ textAlign: 'center', marginBottom: PX(16), padding: PX(10), background: cfg.bg, border: `1px solid ${cfg.border}`, borderRadius: PX(8) }}>
      <span className="casino-display" style={{ color: cfg.color, fontSize: PX(16), fontWeight: '900', letterSpacing: '0.1em' }}>{cfg.label}</span>
    </motion.div>
  );
};

const ClaimTimer = () => {
  const [time, setTime] = useState('');
  useEffect(() => {
    const tick = () => {
      const now = new Date(), tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1); tomorrow.setHours(0, 0, 0, 0);
      const diff = tomorrow.getTime() - now.getTime();
      const h = Math.floor(diff / 3600000), m = Math.floor((diff % 3600000) / 60000), sec = Math.floor((diff % 60000) / 1000);
      setTime(`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`);
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: PX(6), padding: `${PX(8)} ${PX(14)}`, border: '1px solid rgba(255,255,255,0.07)', borderRadius: PX(8), fontSize: PX(12), color: '#4a4a60', fontFamily: 'Orbitron, monospace' }}>
      <IconClock size={13} color="#4a4a60" /> {time}
    </div>
  );
};

/* ─── Game components (defined outside Casino to prevent re-renders) ─── */
const diceFaces = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];

const DiceGame = ({ diceResult, dicePrediction, setDicePrediction, diceBet, setDiceBet, isRolling, balance, onRoll }: { diceResult: number|null; dicePrediction: string; setDicePrediction: (v:string)=>void; diceBet: number; setDiceBet: (v:number)=>void; isRolling: boolean; balance: number; onRoll: ()=>void }) => (
  <CasinoCard glow={isRolling}>
    <GameTitle icon={<IconDice size={20} color="#3b82f6" />}>DICE ROLL</GameTitle>
    <div style={{ background: 'linear-gradient(135deg, #1e2530, #272c34)', border: '2px solid rgba(59,130,246,0.15)', borderRadius: PX(12), padding: PX(28), marginBottom: PX(24), display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: PX(140), position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(59,130,246,0.04) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
      <motion.div animate={isRolling ? { rotate: [0, 90, 180, 270, 360], scale: [1, 1.2, 0.9, 1.15, 1], x: [0, 10, -10, 8, 0] } : {}} transition={{ duration: 0.9, ease: 'easeInOut' }}
        style={{ width: PX(88), height: PX(88), background: 'linear-gradient(145deg, #1e2530, #191e26)', border: '2px solid rgba(59,130,246,0.5)', borderRadius: PX(18), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: PX(46), boxShadow: '0 6px 20px rgba(0,0,0,0.6)', position: 'relative', zIndex: 1 }}>
        {diceResult ? diceFaces[diceResult - 1] : '🎲'}
      </motion.div>
    </div>
    <div style={{ marginBottom: PX(20) }}>
      <span style={s.label}>Prediction</span>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: PX(8), marginBottom: PX(8) }}>
        {[{ val: 'low', label: 'LOW  1–3' }, { val: 'high', label: 'HIGH  4–6' }].map(p => (
          <button key={p.val} onClick={() => setDicePrediction(p.val)} style={{ ...(dicePrediction === p.val ? s.btnActive : s.btnSecondary), padding: PX(12), textAlign: 'center' }}>
            <div style={{ fontWeight: '700', fontSize: PX(13) }}>{p.label}</div>
          </button>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: PX(6) }}>
        {['1','2','3','4','5','6'].map(p => (
          <button key={p} onClick={() => setDicePrediction(p)} style={{ ...(dicePrediction === p ? s.btnActive : s.btnSecondary), padding: PX(8), textAlign: 'center', fontSize: PX(18) }}>
            {diceFaces[parseInt(p) - 1]}
          </button>
        ))}
      </div>
    </div>
    <div style={{ marginBottom: PX(20) }}>
      <span style={s.label}>Bet amount</span>
      <BetButtons value={diceBet} onChange={setDiceBet} />
    </div>
    <button onClick={onRoll} disabled={isRolling || diceBet > balance} style={{ ...s.btnPrimary, opacity: isRolling || diceBet > balance ? 0.4 : 1, fontSize: PX(15), letterSpacing: '0.1em' }}>
      {isRolling ? '⟳  ROLLING…' : `ROLL THE DICE  —  ${diceBet} COINS`}
    </button>
  </CasinoCard>
);

const rpsEmoji: Record<string, string> = { rock: '🪨', paper: '📄', scissors: '✂️' };
const RpsGame = ({ rpsChoice, rpsComputerChoice, rpsResult, rpsBet, setRpsBet, isPlayingRps, balance, onPlay }: { rpsChoice: string|null; rpsComputerChoice: string|null; rpsResult: string|null; rpsBet: number; setRpsBet: (v:number)=>void; isPlayingRps: boolean; balance: number; onPlay: (c:string)=>void }) => (
  <CasinoCard>
    <GameTitle icon={<IconScissors size={20} color="#3b82f6" />}>ROCK · PAPER · SCISSORS</GameTitle>
    <div style={{ background: '#1a1f27', border: '1px solid rgba(255,255,255,0.06)', borderRadius: PX(12), padding: PX(20), marginBottom: PX(20) }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: PX(12), alignItems: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="casino-display" style={{ fontSize: PX(10), color: '#5a5a80', marginBottom: PX(8), letterSpacing: '0.1em' }}>YOU</div>
          <motion.div animate={isPlayingRps && !rpsChoice ? { rotate: [0, 20, -20, 0] } : {}} transition={{ repeat: Infinity, duration: 0.4 }}
            style={{ height: PX(72), background: 'linear-gradient(145deg, #1e2530, #191e26)', border: `1px solid ${rpsChoice ? 'rgba(59,130,246,0.4)' : 'rgba(255,255,255,0.06)'}`, borderRadius: PX(12), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: PX(32) }}>
            {rpsChoice ? rpsEmoji[rpsChoice] : <span style={{ color: '#2a2a40', fontSize: PX(24) }}>?</span>}
          </motion.div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <span className="casino-display" style={{ fontSize: PX(11), color: '#4a4a60', fontWeight: '700', letterSpacing: '0.1em' }}>VS</span>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div className="casino-display" style={{ fontSize: PX(10), color: '#5a5a80', marginBottom: PX(8), letterSpacing: '0.1em' }}>CPU</div>
          <motion.div animate={isPlayingRps && !rpsComputerChoice ? { rotate: [0, -20, 20, 0] } : {}} transition={{ repeat: Infinity, duration: 0.4 }}
            style={{ height: PX(72), background: 'linear-gradient(145deg, #1e2530, #191e26)', border: `1px solid ${rpsComputerChoice ? 'rgba(239,68,68,0.4)' : 'rgba(255,255,255,0.06)'}`, borderRadius: PX(12), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: PX(32) }}>
            {rpsComputerChoice ? rpsEmoji[rpsComputerChoice] : <span style={{ color: '#2a2a40', fontSize: PX(24) }}>?</span>}
          </motion.div>
        </div>
      </div>
      {rpsResult && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', marginTop: PX(14) }}>
          <span style={{ ...(rpsResult === 'win' ? { background: 'rgba(59,130,246,0.12)', color: '#93c5fd' } : rpsResult === 'draw' ? { background: 'rgba(234,179,8,0.12)', color: '#facc15' } : { background: 'rgba(239,68,68,0.1)', color: '#f87171' }), borderRadius: PX(6), padding: `${PX(6)} ${PX(20)}`, fontWeight: '700', fontSize: PX(13), letterSpacing: '0.1em', fontFamily: 'Orbitron, monospace' }}>
            {rpsResult === 'win' ? '✓ WIN' : rpsResult === 'draw' ? '~ DRAW' : '✗ LOSE'}
          </span>
        </motion.div>
      )}
    </div>
    <div style={{ marginBottom: PX(16) }}>
      <span style={s.label}>Bet amount</span>
      <input type="number" value={rpsBet} min="1" max={balance} onChange={e => setRpsBet(Math.max(1, parseInt(e.target.value) || 1))} style={s.inputBase} />
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: PX(10) }}>
      {['rock', 'paper', 'scissors'].map(opt => (
        <motion.button key={opt} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
          onClick={() => onPlay(opt)} disabled={isPlayingRps || rpsBet > balance}
          style={{ ...s.btnSecondary, padding: `${PX(16)} ${PX(8)}`, textAlign: 'center', opacity: isPlayingRps || rpsBet > balance ? 0.4 : 1, border: rpsChoice === opt ? '1px solid rgba(59,130,246,0.6)' : '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ fontSize: PX(26), marginBottom: PX(6) }}>{rpsEmoji[opt]}</div>
          <div className="casino-display" style={{ fontSize: PX(10), letterSpacing: '0.1em', color: '#888' }}>{opt.toUpperCase()}</div>
        </motion.button>
      ))}
    </div>
  </CasinoCard>
);

const wheelSegments = [
  { label: 'LOSE', color: '#ef4444', pct: 40 }, { label: '1.5×', color: '#3b82f6', pct: 20 },
  { label: '2×', color: '#2563eb', pct: 20 },   { label: 'LOSE', color: '#dc2626', pct: 10 },
  { label: '5×', color: '#f59e0b', pct: 5 },     { label: '10×', color: '#facc15', pct: 5 },
];
const totalPct = wheelSegments.reduce((a, b) => a + b.pct, 0);
let cumAngle = 0;
const wheelPaths = wheelSegments.map(seg => {
  const startAngle = (cumAngle / totalPct) * 360, sweepAngle = (seg.pct / totalPct) * 360;
  cumAngle += seg.pct;
  const r = 90, cx = 100, cy = 100;
  const start = ((startAngle - 90) * Math.PI) / 180, end = ((startAngle + sweepAngle - 90) * Math.PI) / 180;
  const x1 = cx + r * Math.cos(start), y1 = cy + r * Math.sin(start);
  const x2 = cx + r * Math.cos(end), y2 = cy + r * Math.sin(end);
  const large = sweepAngle > 180 ? 1 : 0;
  const midAngle = ((startAngle + sweepAngle / 2 - 90) * Math.PI) / 180;
  const labelR = r * 0.62;
  return { d: `M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${large},1 ${x2},${y2} Z`, color: seg.color, label: seg.label, lx: cx + labelR * Math.cos(midAngle), ly: cy + labelR * Math.sin(midAngle) };
});

const SpinWheelGame = ({ wheelResult, wheelBet, setWheelBet, isSpinning, wheelAngle, balance, onSpin }: { wheelResult: WheelResult|null; wheelBet: number; setWheelBet: (v:number)=>void; isSpinning: boolean; wheelAngle: number; balance: number; onSpin: ()=>void }) => (
  <CasinoCard glow={isSpinning}>
    <GameTitle icon={<IconWheel size={20} color="#2563eb" />}>SPIN THE WHEEL</GameTitle>
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: PX(24) }}>
      <div style={{ width: 0, height: 0, borderLeft: `${PX(10)} solid transparent`, borderRight: `${PX(10)} solid transparent`, borderTop: `${PX(22)} solid #facc15`, marginBottom: '-2px', zIndex: 10, filter: 'drop-shadow(0 0 6px rgba(250,204,21,0.8))' }} />
      <motion.svg width="250" height="250" viewBox="0 0 200 200" animate={{ rotate: wheelAngle }} transition={{ duration: 2.5, ease: [0.1, 0.9, 0.3, 1.0] }} style={{ display: 'block', filter: 'drop-shadow(0 0 20px rgba(59,130,246,0.3))' }}>
        {wheelPaths.map((seg, i) => (
          <g key={i}>
            <path d={seg.d} fill={seg.color} stroke="#1a1f27" strokeWidth="1.5" />
            <text x={seg.lx} y={seg.ly} textAnchor="middle" dominantBaseline="middle" fill="#fff" fontSize="8" fontWeight="bold" fontFamily="Orbitron, monospace">{seg.label}</text>
          </g>
        ))}
        <circle cx="100" cy="100" r="14" fill="#1a1f27" stroke="rgba(59,130,246,0.6)" strokeWidth="2" />
        <circle cx="100" cy="100" r="6" fill="rgba(59,130,246,0.8)" />
      </motion.svg>
      {wheelResult && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: PX(14), padding: `${PX(8)} ${PX(24)}`, background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: PX(8) }}>
          <span className="casino-display" style={{ color: '#93c5fd', fontSize: PX(14), fontWeight: '700' }}>{wheelResult.label}  —  {wheelResult.multiplier}×</span>
        </motion.div>
      )}
    </div>
    <div style={{ marginBottom: PX(16) }}>
      <span style={s.label}>Bet amount</span>
      <input type="number" value={wheelBet} min="1" max={balance} onChange={e => setWheelBet(Math.max(1, parseInt(e.target.value) || 1))} style={s.inputBase} />
    </div>
    <button onClick={onSpin} disabled={isSpinning || wheelBet > balance} style={{ ...s.btnPrimary, opacity: isSpinning || wheelBet > balance ? 0.4 : 1, fontSize: PX(15), letterSpacing: '0.1em' }}>
      {isSpinning ? '⟳  SPINNING…' : `SPIN  —  ${wheelBet} COINS`}
    </button>
  </CasinoCard>
);

const slotSymbols = ['🍒', '🍋', '🍊', '🍇', '⭐', '💎', '7️⃣', '🎰'];
const SlotMachineGame = ({ slotReels, slotBet, setSlotBet, isSpinningSlots, slotWin, balance, onSpin }: { slotReels: string[]; slotBet: number; setSlotBet: (v:number)=>void; isSpinningSlots: boolean; slotWin: 'jackpot'|'win'|'lose'|null; balance: number; onSpin: ()=>void }) => (
  <CasinoCard glow={slotWin === 'jackpot'}>
    <GameTitle icon={<IconSlots size={20} color="#60a5fa" />}>SLOT MACHINE</GameTitle>
    <div style={{ background: 'linear-gradient(180deg, #1e2530 0%, #272c34 100%)', border: '2px solid rgba(250,204,21,0.2)', borderRadius: PX(16), padding: PX(20), marginBottom: PX(20), boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.5)' }}>
      <div style={{ display: 'flex', justifyContent: 'center', gap: PX(6), marginBottom: PX(16) }}>
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div key={i} animate={isSpinningSlots || slotWin === 'jackpot' ? { opacity: [1, 0.2, 1] } : { opacity: 0.3 }} transition={{ delay: i * 0.08, duration: 0.5, repeat: Infinity }}
            style={{ width: PX(8), height: PX(8), borderRadius: '50%', background: i % 3 === 0 ? '#facc15' : i % 3 === 1 ? '#ef4444' : '#3b82f6' }} />
        ))}
      </div>
      <div style={{ background: '#1a1f27', border: '3px solid rgba(59,130,246,0.3)', borderRadius: PX(10), padding: `${PX(16)} ${PX(12)}`, marginBottom: PX(12), display: 'flex', gap: PX(8), justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)', pointerEvents: 'none', zIndex: 2 }} />
        <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '2px', background: 'rgba(250,204,21,0.4)', transform: 'translateY(-50%)', zIndex: 3 }} />
        {(slotReels.length > 0 ? slotReels : ['7️⃣','7️⃣','7️⃣']).map((reel, idx) => (
          <div key={idx} style={{ position: 'relative', width: PX(72), overflow: 'hidden', height: PX(80) }}>
            {isSpinningSlots ? (
              <motion.div animate={{ y: [0, -240, 0] }} transition={{ duration: 0.3, repeat: Infinity, ease: 'linear' }} style={{ display: 'flex', flexDirection: 'column', gap: PX(4) }}>
                {[...slotSymbols, ...slotSymbols].map((sym, si) => (
                  <div key={si} style={{ width: PX(72), height: PX(72), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: PX(32), background: 'rgba(255,255,255,0.03)', borderRadius: PX(6) }}>{sym}</div>
                ))}
              </motion.div>
            ) : (
              <motion.div initial={{ y: -40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: idx * 0.15, type: 'spring', stiffness: 200 }}
                style={{ width: PX(72), height: PX(80), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: PX(36), background: slotWin === 'jackpot' ? 'rgba(250,204,21,0.12)' : slotWin === 'win' ? 'rgba(59,130,246,0.08)' : 'transparent', borderRadius: PX(8), border: slotWin === 'jackpot' ? '1px solid rgba(250,204,21,0.4)' : 'none' }}>
                {reel}
              </motion.div>
            )}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: PX(6) }}>
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div key={i} animate={isSpinningSlots || slotWin === 'jackpot' ? { opacity: [1, 0.2, 1] } : { opacity: 0.3 }} transition={{ delay: (11 - i) * 0.08, duration: 0.5, repeat: Infinity }}
            style={{ width: PX(8), height: PX(8), borderRadius: '50%', background: i % 3 === 0 ? '#3b82f6' : i % 3 === 1 ? '#facc15' : '#ef4444' }} />
        ))}
      </div>
    </div>
    <WinBanner type={isSpinningSlots ? null : slotWin} />
    <div style={{ marginBottom: PX(16) }}>
      <span style={s.label}>Bet amount</span>
      <BetButtons value={slotBet} onChange={setSlotBet} />
    </div>
    <motion.button whileTap={{ scale: 0.96 }} onClick={onSpin} disabled={isSpinningSlots || slotBet > balance}
      style={{ ...s.btnPrimary, opacity: isSpinningSlots || slotBet > balance ? 0.4 : 1, fontSize: PX(15), letterSpacing: '0.12em', background: isSpinningSlots ? 'linear-gradient(135deg,#374151,#1f2937)' : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', boxShadow: isSpinningSlots ? 'none' : '0 4px 20px rgba(245,158,11,0.3)', color: '#000', fontWeight: '900' }}>
      {isSpinningSlots ? '⟳  SPINNING…' : `▶  SPIN  —  ${slotBet} COINS`}
    </motion.button>
  </CasinoCard>
);

/* ─── Roulette ─── */
const RED_NUMBERS = new Set([1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36]);
const getNumColor = (n: number) => n === 0 ? '#1e2d45' : RED_NUMBERS.has(n) ? '#dc2626' : '#1a1f27';
const WHEEL_ORDER = [0,32,15,19,4,21,2,25,17,34,6,27,13,36,11,30,8,23,10,5,24,16,33,1,20,14,31,9,22,18,29,7,28,12,35,3,26];
const COLS = 12;
const tableNums: number[][] = Array.from({ length: COLS }, (_, col) => [col * 3 + 3, col * 3 + 2, col * 3 + 1]);
type BetMap = Record<string, number>;

const RouletteWheel = ({ spinning, result }: { spinning: boolean; result: number | null }) => {
  const size = 220, cx = size / 2, cy = size / 2, outerR = 100, innerR = 72, pocketR = 58, ballTrackR = 86;
  const total = WHEEL_ORDER.length, sliceAngle = (2 * Math.PI) / total;
  const resultIdx = result !== null ? WHEEL_ORDER.indexOf(result) : 0;
  const targetAngle = -(resultIdx / total) * 360 - 90;
  const [wheelRot, setWheelRot] = useState(0);
  const [ballAngle, setBallAngle] = useState(0);
  const [ballR, setBallR] = useState(ballTrackR);
  const [ballVisible, setBallVisible] = useState(false);
  const [phase, setPhase] = useState<'idle'|'spinning'|'settling'|'done'>('idle');

  useEffect(() => {
    if (spinning) {
      setBallVisible(true); setBallR(ballTrackR); setPhase('spinning');
      setWheelRot(prev => prev + 5 * 360 + ((targetAngle - prev) % 360 + 360) % 360);
      setBallAngle(prev => prev - 8 * 360);
      setTimeout(() => { setPhase('settling'); setBallR(pocketR + 4); setBallAngle((resultIdx / total) * 360 - 90); }, 2800);
      setTimeout(() => setPhase('done'), 3600);
    } else {
      if (result === null) { setPhase('idle'); setBallVisible(false); setBallR(ballTrackR); }
    }
  }, [spinning, result]);

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ filter: 'drop-shadow(0 8px 32px rgba(0,0,0,0.8))' }}>
      <circle cx={cx} cy={cy} r={outerR + 8} fill="#2c1a0a" stroke="#8B6914" strokeWidth="3" />
      <circle cx={cx} cy={cy} r={outerR + 2} fill="#1a0f05" stroke="#c9a227" strokeWidth="1.5" />
      <g style={{ transformOrigin: `${cx}px ${cy}px`, transform: `rotate(${wheelRot}deg)`, transition: spinning ? 'transform 3.2s cubic-bezier(0.1,0.8,0.3,1)' : 'none' }}>
        {WHEEL_ORDER.map((num, i) => {
          const startA = i * sliceAngle - Math.PI / 2, endA = (i + 1) * sliceAngle - Math.PI / 2;
          const x1o = cx + outerR * Math.cos(startA), y1o = cy + outerR * Math.sin(startA);
          const x2o = cx + outerR * Math.cos(endA), y2o = cy + outerR * Math.sin(endA);
          const x1i = cx + innerR * Math.cos(startA), y1i = cy + innerR * Math.sin(startA);
          const x2i = cx + innerR * Math.cos(endA), y2i = cy + innerR * Math.sin(endA);
          const midA = (i + 0.5) * sliceAngle - Math.PI / 2;
          const labelR = (outerR + innerR) / 2;
          const fill = num === 0 ? '#1e2d45' : RED_NUMBERS.has(num) ? '#b91c1c' : '#1a1f27';
          const isResult = result === num && phase === 'done';
          return (
            <g key={num}>
              <path d={`M${cx},${cy} L${x1o},${y1o} A${outerR},${outerR} 0 0,1 ${x2o},${y2o} Z`} fill={fill} stroke={isResult ? '#facc15' : '#333'} strokeWidth={isResult ? 2 : 0.5} />
              <path d={`M${cx},${cy} L${x1i},${y1i} A${innerR},${innerR} 0 0,1 ${x2i},${y2i} Z`} fill={fill} stroke="#222" strokeWidth="0.3" />
              <text x={cx + labelR * Math.cos(midA)} y={cy + labelR * Math.sin(midA)} textAnchor="middle" dominantBaseline="middle"
                fill={isResult ? '#facc15' : '#fff'} fontSize="7" fontWeight="bold" fontFamily="Orbitron,monospace"
                transform={`rotate(${(i + 0.5) * (360 / total) + 90}, ${cx + labelR * Math.cos(midA)}, ${cy + labelR * Math.sin(midA)})`}>{num}</text>
            </g>
          );
        })}
        {WHEEL_ORDER.map((_, i) => { const a = i * sliceAngle - Math.PI / 2; return <line key={i} x1={cx + innerR * Math.cos(a)} y1={cy + innerR * Math.sin(a)} x2={cx + outerR * Math.cos(a)} y2={cy + outerR * Math.sin(a)} stroke="#555" strokeWidth="0.8" />; })}
        <circle cx={cx} cy={cy} r={innerR - 1} fill="url(#coneGrad)" />
        {[0,60,120,180,240,300].map(deg => { const r = (deg * Math.PI) / 180; return <line key={deg} x1={cx} y1={cy} x2={cx + (innerR-2) * Math.cos(r)} y2={cy + (innerR-2) * Math.sin(r)} stroke="#c9a227" strokeWidth="1.5" opacity="0.6" />; })}
        <circle cx={cx} cy={cy} r={10} fill="#c9a227" stroke="#8B6914" strokeWidth="2" />
        <circle cx={cx} cy={cy} r={5} fill="#facc15" />
      </g>
      {ballVisible && (
        <circle cx={cx + ballR * Math.cos((ballAngle * Math.PI) / 180)} cy={cy + ballR * Math.sin((ballAngle * Math.PI) / 180)}
          r={phase === 'settling' || phase === 'done' ? 5 : 4} fill="white" stroke="#ddd" strokeWidth="1"
          style={{ filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.9))', transition: phase === 'spinning' ? 'cx 3s cubic-bezier(0.1,0.8,0.3,1), cy 3s cubic-bezier(0.1,0.8,0.3,1)' : phase === 'settling' ? 'cx 0.8s ease-out, cy 0.8s ease-out' : 'none' }} />
      )}
      <polygon points={`${cx},${cy - outerR - 6} ${cx - 5},${cy - outerR + 2} ${cx + 5},${cy - outerR + 2}`} fill="#facc15" />
      <defs>
        <radialGradient id="coneGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#5c3d1a" /><stop offset="100%" stopColor="#2c1a0a" />
        </radialGradient>
      </defs>
    </svg>
  );
};

const RangeRouletteGame = ({ rouletteResult, isSpinningRoulette, balance, onSpin }: { rouletteResult: number | null; isSpinningRoulette: boolean; balance: number; onSpin: (bets: BetMap, totalBet: number) => void; }) => {
  const [bets, setBets] = useState<BetMap>({});
  const [chipSize, setChipSize] = useState(10);
  const totalBet = Object.values(bets).reduce((a, b) => a + b, 0);
  const placeBet = (key: string) => { if (isSpinningRoulette) return; if (totalBet + chipSize > balance) { toast.error('Insufficient balance'); return; } setBets(prev => ({ ...prev, [key]: (prev[key] || 0) + chipSize })); };
  const clearBets = () => { if (!isSpinningRoulette) setBets({}); };
  const isWinningBet = (key: string, result: number | null): boolean => {
    if (result === null) return false;
    if (key === String(result)) return true;
    if (key === 'even' && result !== 0 && result % 2 === 0) return true;
    if (key === 'odd' && result % 2 === 1) return true;
    if (key === '1-18' && result >= 1 && result <= 18) return true;
    if (key === '19-36' && result >= 19 && result <= 36) return true;
    if (key === '1st12' && result >= 1 && result <= 12) return true;
    if (key === '2nd12' && result >= 13 && result <= 24) return true;
    if (key === '3rd12' && result >= 25 && result <= 36) return true;
    if (key === 'col1' && result % 3 === 1) return true;
    if (key === 'col2' && result % 3 === 2) return true;
    if (key === 'col3' && result % 3 === 0 && result !== 0) return true;
    if (key === 'red' && RED_NUMBERS.has(result)) return true;
    if (key === 'black' && result !== 0 && !RED_NUMBERS.has(result)) return true;
    return false;
  };
  const cellSt = (key: string, bg: string): CSSProperties => ({
    background: rouletteResult !== null && isWinningBet(key, rouletteResult) ? 'rgba(250,204,21,0.4)' : bets[key] ? 'rgba(37,99,235,0.5)' : bg,
    border: rouletteResult !== null && isWinningBet(key, rouletteResult) ? '2px solid #facc15' : bets[key] ? '1px solid #2563eb' : '1px solid rgba(255,255,255,0.12)',
    cursor: isSpinningRoulette ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
    position: 'relative', transition: 'all 0.15s', fontFamily: 'Orbitron,monospace', fontWeight: '700', color: '#fff', userSelect: 'none' as const, borderRadius: '2px',
  });
  const chip = (key: string) => bets[key] ? (
    <div style={{ position: 'absolute', top: '1px', right: '1px', background: '#2563eb', borderRadius: '50%', width: PX(13), height: PX(13), fontSize: PX(7), display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '900' }}>{bets[key]}</div>
  ) : null;

  return (
    <div style={{ ...s.card, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(37,99,235,0.6), transparent)' }} />
      <GameTitle icon={<IconTarget size={20} color="#2563eb" />}>ROULETTE</GameTitle>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: PX(16) }}>
        <RouletteWheel spinning={isSpinningRoulette} result={rouletteResult} />
      </div>
      {rouletteResult !== null && !isSpinningRoulette && (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300 }}
          style={{ display: 'flex', justifyContent: 'center', gap: PX(12), alignItems: 'center', marginBottom: PX(14) }}>
          <div style={{ width: PX(44), height: PX(44), borderRadius: '50%', background: getNumColor(rouletteResult), border: '3px solid #facc15', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 16px rgba(250,204,21,0.5)' }}>
            <span className="casino-display" style={{ fontSize: PX(16), fontWeight: '900', color: '#fff' }}>{rouletteResult}</span>
          </div>
          <div style={{ fontFamily: 'Rajdhani', fontSize: PX(13) }}>
            <div style={{ color: rouletteResult === 0 ? '#93c5fd' : RED_NUMBERS.has(rouletteResult) ? '#ef4444' : '#bbb', fontWeight: '700' }}>
              {rouletteResult === 0 ? 'ZERO' : RED_NUMBERS.has(rouletteResult) ? 'RED' : 'BLACK'}
            </div>
            {rouletteResult !== 0 && <div style={{ color: '#888' }}>{rouletteResult % 2 === 0 ? 'EVEN' : 'ODD'}</div>}
          </div>
        </motion.div>
      )}
      <div style={{ background: '#1a2535', border: '3px solid #3b82f6', borderRadius: PX(8), padding: PX(6), marginBottom: PX(12), overflowX: 'auto' }}>
        <div style={{ minWidth: '400px' }}>
          <div style={{ display: 'flex', gap: '2px', marginBottom: '2px' }}>
            <div onClick={() => placeBet('0')} style={{ ...cellSt('0','#1e2d45'), width: PX(28), minHeight: PX(72), borderRadius: PX(4), fontSize: PX(11), flexShrink: 0 }}>0{chip('0')}</div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {[0,1,2].map(row => (
                <div key={row} style={{ display: 'grid', gridTemplateColumns: 'repeat(12,1fr)', gap: '2px' }}>
                  {tableNums.map(col => { const n = col[row]; return <div key={n} onClick={() => placeBet(String(n))} style={{ ...cellSt(String(n), getNumColor(n)), height: PX(22), fontSize: PX(9) }}>{n}{chip(String(n))}</div>; })}
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', width: PX(28) }}>
              {['col3','col2','col1'].map(key => <div key={key} onClick={() => placeBet(key)} style={{ ...cellSt(key,'#1e2d45'), flex: 1, fontSize: PX(6), textAlign: 'center', borderRadius: PX(4) }}>2to1{chip(key)}</div>)}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '2px', marginBottom: '2px', paddingLeft: PX(30), paddingRight: PX(30) }}>
            {[['1st12','1st 12'],['2nd12','2nd 12'],['3rd12','3rd 12']].map(([k,l]) => <div key={k} onClick={() => placeBet(k)} style={{ ...cellSt(k,'#1e2d45'), flex: 1, height: PX(22), fontSize: PX(10), borderRadius: '3px' }}>{l}{chip(k)}</div>)}
          </div>
          <div style={{ display: 'flex', gap: '2px', paddingLeft: PX(30), paddingRight: PX(30) }}>
            {([['1-18','1 to 18','#1e2d45'],['even','EVEN','#1e2d45'],['red','♦','#7f1d1d'],['black','♦','#1a1f27'],['odd','ODD','#1e2d45'],['19-36','19 to 36','#1e2d45']] as [string,string,string][]).map(([k,l,bg]) => <div key={k} onClick={() => placeBet(k)} style={{ ...cellSt(k, bg), flex: 1, height: PX(22), fontSize: PX(9), borderRadius: '3px' }}>{l}{chip(k)}</div>)}
          </div>
        </div>
      </div>
      <div style={{ marginBottom: PX(10) }}>
        <span style={s.label}>Chip size</span>
        <div style={{ display: 'flex', gap: PX(6) }}>
          {[5,10,25,50,100].map(v => <button key={v} onClick={() => setChipSize(v)} style={{ ...(chipSize === v ? s.btnActive : s.btnSecondary), padding: `${PX(5)} ${PX(10)}`, fontSize: PX(12) }}>{v}</button>)}
        </div>
      </div>
      <div style={{ display: 'flex', gap: PX(8), marginBottom: PX(10) }}>
        <div style={{ flex: 1, background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: PX(8), padding: `${PX(8)} ${PX(12)}` }}>
          <span style={{ fontSize: PX(11), color: '#4a5568', fontFamily: 'Rajdhani' }}>TOTAL BET: </span>
          <span className="casino-display" style={{ color: '#93c5fd', fontSize: PX(13), fontWeight: '700' }}>{totalBet}</span>
        </div>
        <button onClick={clearBets} disabled={isSpinningRoulette || totalBet === 0} style={{ ...s.btnSecondary, padding: `${PX(8)} ${PX(14)}`, opacity: totalBet === 0 ? 0.3 : 1 }}>Clear</button>
      </div>
      <button onClick={() => onSpin(bets, totalBet)} disabled={isSpinningRoulette || totalBet === 0 || totalBet > balance}
        style={{ ...s.btnPrimary, opacity: isSpinningRoulette || totalBet === 0 ? 0.4 : 1, background: 'linear-gradient(135deg, #3b82f6, #2563eb)', fontSize: PX(15) }}>
        {isSpinningRoulette ? '⟳  SPINNING…' : `SPIN  —  ${totalBet} COINS`}
      </button>
    </div>
  );
};

const HallOfFameList = ({ hallOfFame }: { hallOfFame: HallOfFameUser[] }) => (
  <div>
    {hallOfFame.length === 0 ? (
      <p style={{ color: '#4a5568', textAlign: 'center', padding: `${PX(32)} 0`, fontFamily: 'Rajdhani', letterSpacing: '0.1em' }}>NO PLAYERS YET</p>
    ) : hallOfFame.map((user, i) => (
      <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: `${PX(12)} 0`, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: PX(14) }}>
          <span className="casino-display" style={{ width: PX(28), fontSize: PX(12), fontWeight: '700', color: i === 0 ? '#3b82f6' : i === 1 ? '#94a3b8' : i === 2 ? '#cd7c2f' : '#4a5568' }}>#{i+1}</span>
          <div>
            <p style={{ color: '#d0d0e8', fontWeight: '600', fontSize: PX(14), margin: 0, fontFamily: 'Rajdhani' }}>{user.username || user.email}</p>
            <p style={{ color: '#4a5568', fontSize: PX(11), margin: 0, fontFamily: 'Rajdhani', letterSpacing: '0.05em' }}>{user.total_games || 0} GAMES</p>
          </div>
        </div>
        <span style={s.tag}>{(user.balance || 0).toLocaleString()} coins</span>
      </div>
    ))}
  </div>
);

/* ─── Main Casino Component ─── */
const Casino = () => {
  useEffect(() => { injectStyles(); }, []);

  const [balance, setBalance] = useState(0);
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [selectedPrice, setSelectedPrice] = useState<number | null>(null);
  const [dailyClaimAvailable, setDailyClaimAvailable] = useState(true);
  const [showHallOfFame, setShowHallOfFame] = useState(false);
  const [hallOfFame, setHallOfFame] = useState<HallOfFameUser[]>([]);

  const [showGiftModal, setShowGiftModal] = useState(false);
  const [giftSearch, setGiftSearch] = useState('');
  const [giftUser, setGiftUser] = useState<{ user_id: number; username: string; display_name: string; avatar_url: string | null } | null>(null);
  const [giftSearchLoading, setGiftSearchLoading] = useState(false);
  const [giftSearchError, setGiftSearchError] = useState('');
  const [giftCoinsAmount, setGiftCoinsAmount] = useState(100);
  const [giftLoading, setGiftLoading] = useState(false);

  const [diceResult, setDiceResult] = useState<number | null>(null);
  const [dicePrediction, setDicePrediction] = useState<string>('high');
  const [diceBet, setDiceBet] = useState(10);
  const [isRolling, setIsRolling] = useState(false);

  const [rpsChoice, setRpsChoice] = useState<string | null>(null);
  const [rpsComputerChoice, setRpsComputerChoice] = useState<string | null>(null);
  const [rpsResult, setRpsResult] = useState<string | null>(null);
  const [rpsBet, setRpsBet] = useState(10);
  const [isPlayingRps, setIsPlayingRps] = useState(false);

  const [wheelResult, setWheelResult] = useState<WheelResult | null>(null);
  const [wheelBet, setWheelBet] = useState(10);
  const [isSpinning, setIsSpinning] = useState(false);
  const [wheelAngle, setWheelAngle] = useState(0);

  const [slotReels, setSlotReels] = useState<string[]>(['7️⃣', '7️⃣', '7️⃣']);
  const [slotBet, setSlotBet] = useState(10);
  const [isSpinningSlots, setIsSpinningSlots] = useState(false);
  const [slotWin, setSlotWin] = useState<'jackpot' | 'win' | 'lose' | null>(null);

  const [rouletteResult, setRouletteResult] = useState<number | null>(null);
  const [isSpinningRoulette, setIsSpinningRoulette] = useState(false);

  useEffect(() => { fetchBalance(); checkDailyClaim(); }, []);

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    if (p.get('success') === 'true' && p.get('session_id')) { toast.success('Payment successful! Glowzycoins added.'); fetchBalance(); window.history.replaceState({}, '', '/casino'); }
    if (p.get('success') === 'false' || p.get('canceled')) { toast.info('Payment cancelled.'); window.history.replaceState({}, '', '/casino'); }
  }, []);

  const fetchBalance = async () => { try { const r = await fetch('/api/glowzycoin/balance', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }); const d = await r.json(); setBalance(parseFloat(d.balance) || 0); } catch (e) { console.error(e); } };
  const fetchHallOfFame = async () => { try { const r = await fetch('/api/casino/hall-of-fame'); const d = await r.json(); setHallOfFame(d.topUsers || []); } catch (e) { console.error(e); } };
  const checkDailyClaim = async () => { try { const r = await fetch('/api/glowzycoin/daily-claim-status', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }); if (r.ok) { const d = await r.json(); setDailyClaimAvailable(d.canClaim); } } catch (e) { console.error(e); } };

  const handleDailyClaim = async () => {
    try {
      const r = await fetch('/api/glowzycoin/daily-claim', { method: 'POST', headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      if (r.ok) { const d = await r.json(); toast.success(`Claimed ${d.amount} Glowzycoins!`); setBalance(prev => prev + d.amount); setDailyClaimAvailable(false); }
      else { const e = await r.json(); toast.error(e.error); }
    } catch { toast.error('Error claiming daily reward'); }
  };

  const handlePurchase = async (amount: number) => {
    try {
      toast.loading('Redirecting to Stripe...');
      const r = await fetch('/api/glowzycoin/purchase', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` }, body: JSON.stringify({ amount }) });
      if (!r.ok) { const e = await r.json(); throw new Error(e.error || 'Purchase failed'); }
      const d = await r.json();
      if (d.url) window.location.href = d.url; else throw new Error('No checkout URL');
    } catch (e: unknown) { toast.error(e instanceof Error ? e.message : 'Error'); }
  };

  const handlePurchasePremium = async () => {
    try {
      toast.loading('Processing premium purchase...');
      const r = await fetch('/api/premium/purchase-with-coins', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` } });
      if (!r.ok) { const e = await r.json(); throw new Error(e.error || 'Failed'); }
      const d = await r.json(); toast.success(`Premium purchased! -${d.cost} coins`); setBalance(d.newBalance); setShowPurchaseModal(false);
    } catch (e: unknown) { toast.error(e instanceof Error ? e.message : 'Error'); }
  };

  const handleDiceRoll = async () => {
    if (diceBet > balance) { toast.error('Insufficient balance'); return; }
    setIsRolling(true); setDiceResult(null);
    try {
      const r = await fetch('/api/casino/dice-roll', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` }, body: JSON.stringify({ betAmount: diceBet, prediction: dicePrediction }) });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const d = await r.json();
      for (let i = 0; i < 10; i++) setTimeout(() => setDiceResult(Math.floor(Math.random() * 6) + 1), i * 100);
      setTimeout(() => { setDiceResult(d.diceResult ?? null); if (typeof d.newBalance === 'number') setBalance(d.newBalance); if (d.won) toast.success(`+${d.winAmount} coins!`); else toast.error(`-${diceBet} coins`); setIsRolling(false); }, 1000);
    } catch { toast.error('Error rolling dice'); setIsRolling(false); }
  };

  const handleRockPaperScissors = async (choice: string) => {
    if (rpsBet > balance) { toast.error('Insufficient balance'); return; }
    setIsPlayingRps(true); setRpsChoice(choice); setRpsComputerChoice(null); setRpsResult(null);
    try {
      const r = await fetch('/api/casino/rock-paper-scissors', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` }, body: JSON.stringify({ betAmount: rpsBet, playerChoice: choice }) });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const d = await r.json();
      setTimeout(() => { setRpsComputerChoice(d.computerChoice ?? null); setRpsResult(d.result ?? null); if (typeof d.newBalance === 'number') setBalance(d.newBalance); if (d.result === 'win') toast.success(`+${d.winAmount} coins!`); else if (d.result === 'draw') toast.info('Draw! Bet returned.'); else toast.error(`-${rpsBet} coins`); setIsPlayingRps(false); }, 1500);
    } catch { toast.error('Error playing RPS'); setIsPlayingRps(false); }
  };

  const handleSpinWheel = async () => {
    if (wheelBet > balance) { toast.error('Insufficient balance'); return; }
    setIsSpinning(true); setWheelResult(null); setWheelAngle(prev => prev + 1080 + Math.random() * 720);
    try {
      const r = await fetch('/api/casino/spin-wheel', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` }, body: JSON.stringify({ betAmount: wheelBet }) });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const d = await r.json();
      setTimeout(() => { setWheelResult(d.result ?? null); if (typeof d.newBalance === 'number') setBalance(d.newBalance); if (d.profitLoss > 0) toast.success(`+${d.winAmount} coins!`); else if (d.profitLoss < 0) toast.error(`-${wheelBet} coins`); else toast.info('Break even!'); setIsSpinning(false); }, 2500);
    } catch { toast.error('Error spinning wheel'); setIsSpinning(false); }
  };

  const handleSlotMachine = async () => {
    if (slotBet > balance) { toast.error('Insufficient balance'); return; }
    setIsSpinningSlots(true); setSlotWin(null);
    try {
      const r = await fetch('/api/casino/slot-machine', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` }, body: JSON.stringify({ betAmount: slotBet }) });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const d = await r.json();
      setTimeout(() => {
        const reels = Array.isArray(d.reels) ? d.reels : ['❓', '❓', '❓'];
        setSlotReels(reels); if (typeof d.newBalance === 'number') setBalance(d.newBalance);
        if (d.profitLoss > 0) { setSlotWin(reels[0] === reels[1] && reels[1] === reels[2] ? 'jackpot' : 'win'); toast.success(`+${d.winAmount} coins!`); }
        else { setSlotWin('lose'); toast.error(`-${slotBet} coins`); }
        setIsSpinningSlots(false);
      }, 1800);
    } catch { toast.error('Error spinning slots'); setIsSpinningSlots(false); }
  };

  const handleRangeRoulette = async (bets: Record<string, number>, totalBet: number) => {
    if (totalBet > balance) { toast.error('Insufficient balance'); return; }
    setIsSpinningRoulette(true); setRouletteResult(null);
    try {
      const r = await fetch('/api/casino/roulette', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` }, body: JSON.stringify({ bets, totalBet }) });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const d = await r.json();
      setTimeout(() => { setRouletteResult(d.result ?? null); if (typeof d.newBalance === 'number') setBalance(d.newBalance); if (d.winAmount > 0) toast.success(`+${d.winAmount} coins!`); else toast.error(`-${totalBet} coins`); setIsSpinningRoulette(false); }, 2000);
    } catch { toast.error('Error spinning roulette'); setIsSpinningRoulette(false); }
  };

  const handleSearchGiftUser = async () => {
    if (!giftSearch.trim()) return;
    setGiftSearchLoading(true); setGiftSearchError(''); setGiftUser(null);
    try {
      const r = await fetch(`/api/profiles/${giftSearch.trim()}`);
      if (!r.ok) { setGiftSearchError('User not found'); return; }
      const d = await r.json();
      setGiftUser({ user_id: d.user_id, username: d.username, display_name: d.display_name, avatar_url: d.avatar_url });
    } catch { setGiftSearchError('Error searching for user'); }
    finally { setGiftSearchLoading(false); }
  };

  const handleGiftPremium = async () => {
    if (!giftUser || balance < 5000) { toast.error('Insufficient balance'); return; }
    setGiftLoading(true);
    try {
      const r = await fetch('/api/casino/gift-premium', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` }, body: JSON.stringify({ targetUserId: giftUser.user_id }) });
      if (!r.ok) { const e = await r.json(); throw new Error(e.error); }
      const d = await r.json();
      toast.success(`Premium gifted to ${giftUser.username}! -5000 coins`);
      setBalance(d.newBalance); setShowGiftModal(false); setGiftUser(null); setGiftSearch('');
    } catch (e: unknown) { toast.error(e instanceof Error ? e.message : 'Error'); }
    finally { setGiftLoading(false); }
  };

  const handleGiftCoins = async () => {
    if (!giftUser || balance < giftCoinsAmount || giftCoinsAmount < 1) { toast.error('Invalid amount'); return; }
    setGiftLoading(true);
    try {
      const r = await fetch('/api/casino/gift-coins', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` }, body: JSON.stringify({ targetUserId: giftUser.user_id, amount: giftCoinsAmount }) });
      if (!r.ok) { const e = await r.json(); throw new Error(e.error); }
      const d = await r.json();
      toast.success(`${giftCoinsAmount} coins sent to ${giftUser.username}!`);
      setBalance(d.newBalance); setShowGiftModal(false); setGiftUser(null); setGiftSearch('');
    } catch (e: unknown) { toast.error(e instanceof Error ? e.message : 'Error'); }
    finally { setGiftLoading(false); }
  };

  const games = [
    { id: 'dice',     name: 'Dice Roll',   Icon: IconDice,     desc: '2× — 6×',    color: '#3b82f6' },
    { id: 'wheel',    name: 'Spin Wheel',  Icon: IconWheel,    desc: '1.5× — 10×', color: '#60a5fa' },
    { id: 'slots',    name: 'Slots',       Icon: IconSlots,    desc: 'Jackpot',     color: '#93c5fd' },
    { id: 'rps',      name: 'RPS',         Icon: IconScissors, desc: '2× payout',  color: '#3b82f6' },
    { id: 'roulette', name: 'Roulette',    Icon: IconTarget,   desc: '35× max',    color: '#2563eb' },
  ];

  return (
    // casino-root applies font-size: 125% so everything scales up uniformly
    <div className="casino-font casino-root" style={{ minHeight: '100vh', background: '#1e2530', color: '#e2e2e8' }}>
      <div style={{ position: 'fixed', inset: 0, backgroundImage: 'linear-gradient(rgba(59,130,246,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.03) 1px, transparent 1px)', backgroundSize: '40px 40px', pointerEvents: 'none', zIndex: 0 }} />

      {/* Top bar */}
      <div style={{ position: 'relative', zIndex: 1, borderBottom: '1px solid rgba(59,130,246,0.2)', padding: `${PX(12)} ${PX(24)}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#141820', backdropFilter: 'blur(12px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: PX(16) }}>
          <button onClick={() => window.history.back()} style={{ ...s.btnSecondary, display: 'flex', alignItems: 'center', gap: PX(6), padding: `${PX(8)} ${PX(14)}`, width: 'auto' }}>
            <ChevronLeft size={14} /> Exit
          </button>
          <span className="casino-display" style={{ fontSize: PX(13), fontWeight: '700', color: '#93c5fd', letterSpacing: '0.12em' }}>GLOWZY CASINO</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: PX(10) }}>
          <div style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: PX(8), padding: `${PX(7)} ${PX(14)}`, display: 'flex', alignItems: 'center', gap: PX(8) }}>
            <IconCoin size={14} color="rgba(59,130,246,1)" />
            <span className="casino-display" style={{ fontWeight: '700', fontSize: PX(14), color: '#3b82f6' }}>{(balance ?? 0).toLocaleString()}</span>
            <span style={{ fontSize: PX(11), color: '#6b6b80', letterSpacing: '0.05em' }}>COINS</span>
          </div>
          {dailyClaimAvailable ? (
            <button onClick={handleDailyClaim} style={{ ...s.btnSecondary, display: 'flex', alignItems: 'center', gap: PX(6), padding: `${PX(8)} ${PX(14)}`, width: 'auto', color: '#93c5fd', border: '1px solid rgba(59,130,246,0.25)' }}>
              <IconGift size={14} color="#93c5fd" /> Daily
            </button>
          ) : <ClaimTimer />}
          <button onClick={() => setShowPurchaseModal(true)} style={{ ...s.btnPrimary, width: 'auto', padding: `${PX(8)} ${PX(18)}`, fontSize: PX(13) }}>Buy Coins</button>
          <button onClick={handlePurchasePremium} disabled={balance < 5000}
            style={{ ...s.btnPrimary, width: 'auto', padding: `${PX(8)} ${PX(18)}`, fontSize: PX(13), background: 'linear-gradient(135deg, #2563eb, #2563eb)', opacity: balance < 5000 ? 0.4 : 1, cursor: balance < 5000 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: PX(6) }}>
            <IconStar size={14} color="#facc15" /> Premium (5000)
          </button>
          <button onClick={() => { setShowGiftModal(true); setGiftUser(null); setGiftSearch(''); setGiftSearchError(''); }}
            style={{ ...s.btnSecondary, width: 'auto', padding: `${PX(8)} ${PX(12)}`, display: 'flex', alignItems: 'center', border: '1px solid rgba(59,130,246,0.3)' }} title="Gift to a friend">
            <IconGift size={15} color="#93c5fd" />
          </button>
        </div>
      </div>

      {/* Main */}
      <div style={{ position: 'relative', zIndex: 1, maxWidth: PX(900), margin: '0 auto', padding: `${PX(32)} ${PX(24)}` }}>
        {!selectedGame ? (
          <>
            <div style={{ marginBottom: PX(28) }}>
              <p className="casino-display" style={{ fontSize: PX(11), color: '#4a5568', marginBottom: PX(4), letterSpacing: '0.15em' }}>SELECT YOUR GAME</p>
              <div style={{ height: '2px', width: PX(40), background: 'linear-gradient(90deg, #3b82f6, transparent)' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(auto-fill, minmax(${PX(150)}, 1fr))`, gap: PX(12) }}>
              {games.map((game, i) => (
                <motion.button key={game.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} whileHover={{ scale: 1.04, y: -2 }}
                  onClick={() => { setSelectedGame(game.id); if (game.id === 'rps') { setRpsChoice(null); setRpsComputerChoice(null); setRpsResult(null); } }}
                  style={{ background: 'linear-gradient(160deg, #1e2530 0%, #191e26 100%)', border: '1px solid rgba(59,130,246,0.18)', borderRadius: PX(14), padding: `${PX(24)} ${PX(16)}`, cursor: 'pointer', textAlign: 'center', transition: 'border-color .2s, box-shadow .2s', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = `${game.color}80`; e.currentTarget.style.boxShadow = `0 4px 30px ${game.color}26`; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(59,130,246,0.18)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)'; }}>
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: PX(12) }}><game.Icon size={36} color={game.color} /></div>
                  <div className="casino-display" style={{ fontSize: PX(11), fontWeight: '700', color: '#b0b0d0', letterSpacing: '0.08em', marginBottom: PX(4) }}>{game.name.toUpperCase()}</div>
                  <div style={{ fontSize: PX(11), color: '#4a5568', fontFamily: 'Rajdhani' }}>{game.desc}</div>
                </motion.button>
              ))}
              <motion.button initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: games.length * 0.07 }} whileHover={{ scale: 1.04, y: -2 }}
                onClick={() => { setShowHallOfFame(true); fetchHallOfFame(); }}
                style={{ background: 'linear-gradient(160deg, #1e2530 0%, #191e26 100%)', border: '1px solid rgba(59,130,246,0.18)', borderRadius: PX(14), padding: `${PX(24)} ${PX(16)}`, cursor: 'pointer', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(59,130,246,0.5)'; e.currentTarget.style.boxShadow = '0 4px 30px rgba(59,130,246,0.15)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(59,130,246,0.18)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)'; }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: PX(12) }}><IconTrophy size={36} color="#2563eb" /></div>
                <div className="casino-display" style={{ fontSize: PX(11), fontWeight: '700', color: '#2563eb', letterSpacing: '0.08em', marginBottom: PX(4) }}>HALL OF FAME</div>
                <div style={{ fontSize: PX(11), color: '#2563eb', fontFamily: 'Rajdhani' }}>Top players</div>
              </motion.button>
            </div>
          </>
        ) : (
          <>
            <button onClick={() => setSelectedGame(null)} style={{ ...s.btnSecondary, display: 'inline-flex', alignItems: 'center', gap: PX(6), width: 'auto', padding: `${PX(8)} ${PX(14)}`, marginBottom: PX(24) }}>
              <ChevronLeft size={14} /> Back to games
            </button>
            <div style={{ maxWidth: PX(460) }}>
              {selectedGame === 'dice'     && <DiceGame diceResult={diceResult} dicePrediction={dicePrediction} setDicePrediction={setDicePrediction} diceBet={diceBet} setDiceBet={setDiceBet} isRolling={isRolling} balance={balance} onRoll={handleDiceRoll} />}
              {selectedGame === 'rps'      && <RpsGame rpsChoice={rpsChoice} rpsComputerChoice={rpsComputerChoice} rpsResult={rpsResult} rpsBet={rpsBet} setRpsBet={setRpsBet} isPlayingRps={isPlayingRps} balance={balance} onPlay={handleRockPaperScissors} />}
              {selectedGame === 'wheel'    && <SpinWheelGame wheelResult={wheelResult} wheelBet={wheelBet} setWheelBet={setWheelBet} isSpinning={isSpinning} wheelAngle={wheelAngle} balance={balance} onSpin={handleSpinWheel} />}
              {selectedGame === 'slots'    && <SlotMachineGame slotReels={slotReels} slotBet={slotBet} setSlotBet={setSlotBet} isSpinningSlots={isSpinningSlots} slotWin={slotWin} balance={balance} onSpin={handleSlotMachine} />}
              {selectedGame === 'roulette' && <RangeRouletteGame rouletteResult={rouletteResult} isSpinningRoulette={isSpinningRoulette} balance={balance} onSpin={handleRangeRoulette} />}
            </div>
          </>
        )}
      </div>

      {/* Hall of Fame Modal */}
      <AnimatePresence>
        {showHallOfFame && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: PX(16) }}
            onClick={() => setShowHallOfFame(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              style={{ ...s.card, width: '100%', maxWidth: PX(480), maxHeight: '80vh', overflowY: 'auto' }}
              onClick={e => e.stopPropagation()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: PX(20) }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: PX(10) }}>
                  <IconTrophy size={18} color="#2563eb" />
                  <span className="casino-display" style={{ fontWeight: '700', fontSize: PX(13), color: '#2563eb', letterSpacing: '0.12em' }}>HALL OF FAME</span>
                </div>
                <button onClick={() => setShowHallOfFame(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#4a5568' }}><X size={16} /></button>
              </div>
              <HallOfFameList hallOfFame={hallOfFame} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Buy Coins Modal */}
      <AnimatePresence>
        {showPurchaseModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: PX(16) }}
            onClick={() => setShowPurchaseModal(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              style={{ ...s.card, width: '100%', maxWidth: PX(360) }}
              onClick={e => e.stopPropagation()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: PX(20) }}>
                <span className="casino-display" style={{ fontWeight: '700', fontSize: PX(13), color: '#93c5fd', letterSpacing: '0.12em' }}>BUY GLOWZYCOINS</span>
                <button onClick={() => { setShowPurchaseModal(false); setSelectedPrice(null); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#4a5568' }}><X size={16} /></button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: PX(8) }}>
                <div style={{ padding: PX(12), background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: PX(8), marginBottom: PX(8) }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: PX(8) }}>
                    <span style={{ fontWeight: '700', color: '#3b82f6', fontFamily: 'Orbitron', fontSize: PX(13), display: 'flex', alignItems: 'center', gap: PX(6) }}><IconStar size={14} color="#facc15" /> PREMIUM</span>
                    <span style={{ fontSize: PX(13), color: '#4a5568', fontFamily: 'Rajdhani', letterSpacing: '0.05em' }}>5000 coins</span>
                  </div>
                  <p style={{ fontSize: PX(11), color: '#4a5568', margin: 0, fontFamily: 'Rajdhani' }}>1 year premium access</p>
                  <button onClick={handlePurchasePremium} disabled={balance < 5000}
                    style={{ ...s.btnPrimary, marginTop: PX(8), opacity: balance < 5000 ? 0.4 : 1, cursor: balance < 5000 ? 'not-allowed' : 'pointer' }}>
                    {balance < 5000 ? 'Not enough coins' : 'Get Premium'}
                  </button>
                </div>
                {[{ price: 1, coins: 1000 }, { price: 5, coins: 5000 }, { price: 10, coins: 10000 }, { price: 25, coins: 25000 }].map(({ price, coins }) => {
                  const isSelected = selectedPrice === price;
                  return (
                    <button key={price} onClick={() => { setSelectedPrice(price); handlePurchase(price); }}
                      style={{ ...s.btnSecondary, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: `${PX(13)} ${PX(16)}`, background: isSelected ? 'rgba(59,130,246,0.18)' : 'rgba(255,255,255,0.04)', border: isSelected ? '1px solid rgba(59,130,246,0.7)' : '1px solid rgba(255,255,255,0.1)', transform: isSelected ? 'scale(1.01)' : 'scale(1)', transition: 'all .15s' }}
                      onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; }}
                      onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}>
                      <span style={{ fontWeight: '700', color: isSelected ? '#93c5fd' : '#d0d0e8', fontFamily: 'Orbitron', fontSize: PX(13) }}>${price}</span>
                      <span style={{ fontSize: PX(13), color: isSelected ? '#93c5fd' : '#4a5568', fontFamily: 'Rajdhani', letterSpacing: '0.05em' }}>{coins.toLocaleString()} coins</span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gift Modal */}
      <AnimatePresence>
        {showGiftModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: PX(16) }}
            onClick={() => setShowGiftModal(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              style={{ ...s.card, width: '100%', maxWidth: PX(400) }}
              onClick={e => e.stopPropagation()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: PX(20) }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: PX(10) }}>
                  <IconGift size={18} color="#93c5fd" />
                  <span className="casino-display" style={{ fontWeight: '700', fontSize: PX(13), color: '#93c5fd', letterSpacing: '0.12em' }}>GIFT TO A FRIEND</span>
                </div>
                <button onClick={() => setShowGiftModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#4a5568' }}><X size={16} /></button>
              </div>

              <div style={{ marginBottom: PX(16) }}>
                <span style={s.label}>Username</span>
                <div style={{ display: 'flex', gap: PX(8) }}>
                  <input type="text" placeholder="Search username..." value={giftSearch}
                    onChange={e => setGiftSearch(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSearchGiftUser()}
                    style={{ ...s.inputBase, flex: 1 }} />
                  <button onClick={handleSearchGiftUser} disabled={giftSearchLoading}
                    style={{ ...s.btnPrimary, width: 'auto', padding: `${PX(10)} ${PX(16)}`, opacity: giftSearchLoading ? 0.6 : 1 }}>
                    {giftSearchLoading ? '...' : 'Search'}
                  </button>
                </div>
                {giftSearchError && <p style={{ color: '#f87171', fontSize: PX(12), marginTop: PX(6), fontFamily: 'Rajdhani' }}>{giftSearchError}</p>}
              </div>

              {giftUser && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: PX(12), padding: PX(12), background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: PX(10), marginBottom: PX(16) }}>
                    <div style={{ width: PX(44), height: PX(44), borderRadius: '50%', overflow: 'hidden', border: '2px solid rgba(59,130,246,0.4)', flexShrink: 0, background: '#1e2530', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {giftUser.avatar_url
                        ? <img src={giftUser.avatar_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : <span style={{ fontSize: PX(18), color: '#93c5fd', fontFamily: 'Orbitron', fontWeight: '700' }}>{giftUser.username[0].toUpperCase()}</span>}
                    </div>
                    <div>
                      <p style={{ margin: 0, color: '#e2e2f0', fontWeight: '700', fontSize: PX(14), fontFamily: 'Rajdhani' }}>{giftUser.display_name || giftUser.username}</p>
                      <p style={{ margin: 0, color: '#93c5fd', fontSize: PX(12), fontFamily: 'Orbitron' }}>@{giftUser.username}</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: PX(10) }}>
                    <div style={{ padding: PX(14), background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: PX(10) }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: PX(8) }}>
                        <span style={{ fontFamily: 'Rajdhani', fontWeight: '700', color: '#93c5fd', fontSize: PX(13), display: 'flex', alignItems: 'center', gap: PX(6) }}><IconStar size={13} color="#facc15" /> Gift Premium</span>
                        <span style={{ fontFamily: 'Orbitron', fontSize: PX(11), color: '#4a5568' }}>5000 coins</span>
                      </div>
                      <button onClick={handleGiftPremium} disabled={giftLoading || balance < 5000}
                        style={{ ...s.btnPrimary, opacity: balance < 5000 || giftLoading ? 0.4 : 1, cursor: balance < 5000 ? 'not-allowed' : 'pointer', fontSize: PX(13), padding: PX(10), display: 'flex', alignItems: 'center', justifyContent: 'center', gap: PX(6) }}>
                        {balance < 5000 ? 'Not enough coins' : `Gift Premium to ${giftUser.username}`}
                      </button>
                    </div>

                    <div style={{ padding: PX(14), background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: PX(10) }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: PX(10) }}>
                        <span style={{ fontFamily: 'Rajdhani', fontWeight: '700', color: '#93c5fd', fontSize: PX(13), display: 'flex', alignItems: 'center', gap: PX(6) }}><IconCoin size={13} color="#93c5fd" /> Send Coins</span>
                        <span style={{ fontFamily: 'Orbitron', fontSize: PX(11), color: '#4a5568' }}>Balance: {balance.toLocaleString()}</span>
                      </div>
                      <div style={{ display: 'flex', gap: PX(6), marginBottom: PX(8) }}>
                        {[50, 100, 500, 1000].map(a => (
                          <button key={a} onClick={() => setGiftCoinsAmount(a)}
                            style={{ ...(giftCoinsAmount === a ? s.btnActive : s.btnSecondary), flex: 1, padding: `${PX(7)} ${PX(4)}`, fontSize: PX(12), textAlign: 'center' }}>{a}</button>
                        ))}
                      </div>
                      <input type="number" value={giftCoinsAmount} min="1" max={balance}
                        onChange={e => setGiftCoinsAmount(Math.max(1, parseInt(e.target.value) || 1))}
                        style={{ ...s.inputBase, marginBottom: PX(8) }} />
                      <button onClick={handleGiftCoins} disabled={giftLoading || giftCoinsAmount > balance}
                        style={{ ...s.btnPrimary, opacity: giftCoinsAmount > balance || giftLoading ? 0.4 : 1, cursor: giftCoinsAmount > balance ? 'not-allowed' : 'pointer', fontSize: PX(13), padding: PX(10), display: 'flex', alignItems: 'center', justifyContent: 'center', gap: PX(6) }}>
                        <IconCoin size={13} color="#fff" /> {giftLoading ? 'Sending...' : `Send ${giftCoinsAmount} coins`}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Casino;