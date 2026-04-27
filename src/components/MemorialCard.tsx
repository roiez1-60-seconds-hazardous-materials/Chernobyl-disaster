'use client';
import { C } from '@/lib/data';
import { useReveal } from '@/lib/useScroll';

interface MemorialCardProps {
  he: boolean;
  t: (h: string, e: string) => string;
  variant: 'reactor' | 'firefighter' | 'liquidator' | 'sarcophagus';
  caption_he: string;
  caption_en: string;
  date_he?: string;
  date_en?: string;
}

export default function MemorialCard({ he, t, variant, caption_he, caption_en, date_he, date_en }: MemorialCardProps) {
  const { ref, visible } = useReveal<HTMLDivElement>();

  return (
    <figure
      ref={ref}
      style={{
        margin: '20px 0',
        opacity: visible ? 1 : 0,
        transform: visible ? 'scale(1)' : 'scale(0.96)',
        transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
      }}
    >
      <div style={{
        position: 'relative',
        width: '100%',
        height: 240,
        borderRadius: 10,
        overflow: 'hidden',
        background: '#0a0e1a',
        border: `1px solid ${C.gold}44`,
        boxShadow: `0 8px 32px rgba(0,0,0,0.6)`,
      }}>
        {variant === 'reactor' && <ReactorScene />}
        {variant === 'firefighter' && <FirefighterScene />}
        {variant === 'liquidator' && <LiquidatorScene />}
        {variant === 'sarcophagus' && <SarcophagusScene />}

        {/* Tape decoration */}
        <div style={{
          position: 'absolute', top: -3, left: 14,
          width: 50, height: 14,
          background: 'rgba(232,213,160,0.25)',
          borderRadius: 2,
          transform: 'rotate(-3deg)',
        }} />
        <div style={{
          position: 'absolute', top: -3, right: 14,
          width: 50, height: 14,
          background: 'rgba(232,213,160,0.25)',
          borderRadius: 2,
          transform: 'rotate(3deg)',
        }} />

        {/* Archive stamp */}
        <div style={{
          position: 'absolute',
          bottom: 10,
          [he ? 'left' : 'right']: 10,
          padding: '3px 8px',
          background: 'rgba(0,0,0,0.7)',
          border: `1px solid ${C.gold}66`,
          borderRadius: 3,
          fontSize: 9,
          color: C.gL,
          fontFamily: "'JetBrains Mono', monospace",
          letterSpacing: '0.2em',
          fontWeight: 700,
          backdropFilter: 'blur(4px)',
        }}>
          {t(date_he || 'ארכיון · 1986', date_en || 'ARCHIVE · 1986')}
        </div>
      </div>

      <figcaption style={{
        marginTop: 10,
        padding: '8px 14px',
        background: 'rgba(0,0,0,0.4)',
        border: `1px solid ${C.gold}22`,
        borderInlineStart: `3px solid ${C.gold}66`,
        borderRadius: 6,
      }}>
        <p style={{
          fontSize: 12,
          color: 'rgba(255,255,255,0.85)',
          lineHeight: 1.6,
          fontStyle: 'italic',
          fontFamily: "'Playfair Display', serif",
        }}>
          {t(caption_he, caption_en)}
        </p>
      </figcaption>
    </figure>
  );
}

// ============== SCENE 1: Reactor 4 ruins ==============
function ReactorScene() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      {/* Sky gradient — apocalyptic dawn */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, #1a0e1a 0%, #2d1015 40%, #4a1a1f 60%, #1a0a0a 100%)',
      }} />

      {/* Smoke clouds */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '40%',
        background: 'radial-gradient(ellipse at 50% 100%, rgba(80,40,20,0.6) 0%, transparent 70%)',
        filter: 'blur(8px)',
      }} />

      {/* Sun/glow */}
      <div style={{
        position: 'absolute', top: '20%', left: '50%',
        transform: 'translateX(-50%)',
        width: 80, height: 80,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(220,38,38,0.7) 0%, rgba(245,158,11,0.4) 40%, transparent 70%)',
        filter: 'blur(8px)',
        animation: 'pulseFire 4s ease-in-out infinite',
      }} />

      {/* Ground */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '35%',
        background: 'linear-gradient(180deg, transparent 0%, #0a0a0a 60%, #000 100%)',
      }} />

      {/* Reactor building silhouette */}
      <svg viewBox="0 0 400 240" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} preserveAspectRatio="xMidYMid slice">
        {/* Main reactor block */}
        <path d="M 80 240 L 80 130 L 110 110 L 200 100 L 280 105 L 320 130 L 320 240 Z" fill="#0a0a0a" stroke="#2a2a2a" strokeWidth="0.5" />
        {/* Damaged top - jagged edge */}
        <path d="M 110 110 L 130 90 L 150 105 L 170 80 L 190 100 L 210 75 L 230 92 L 250 85 L 280 105" fill="none" stroke="#3a2010" strokeWidth="2" />
        {/* Sarcophagus structure */}
        <rect x="140" y="120" width="120" height="80" fill="#1a1a1a" stroke="#444" strokeWidth="0.5" />
        {/* Windows */}
        <rect x="100" y="150" width="6" height="10" fill="#fbbf24" opacity="0.4" />
        <rect x="115" y="150" width="6" height="10" fill="#fbbf24" opacity="0.6" />
        <rect x="295" y="160" width="6" height="10" fill="#fbbf24" opacity="0.3" />
        {/* Chimney */}
        <rect x="190" y="60" width="8" height="50" fill="#1a1a1a" stroke="#444" strokeWidth="0.5" />
        {/* Smoke from chimney */}
        <ellipse cx="194" cy="55" rx="20" ry="15" fill="#3a2010" opacity="0.5" filter="blur(3)" />
        {/* Crane silhouette */}
        <line x1="50" y1="240" x2="50" y2="100" stroke="#2a2a2a" strokeWidth="2" />
        <line x1="50" y1="100" x2="120" y2="120" stroke="#2a2a2a" strokeWidth="1.5" />
        <line x1="120" y1="120" x2="120" y2="135" stroke="#2a2a2a" strokeWidth="1" />
      </svg>

      {/* Glow particles */}
      {[...Array(8)].map((_, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: `${20 + Math.random() * 60}%`,
          top: `${30 + Math.random() * 30}%`,
          width: 2, height: 2,
          borderRadius: '50%',
          background: '#fbbf24',
          opacity: 0.6,
          boxShadow: '0 0 6px #fbbf24',
          animation: `radFloat ${3 + Math.random() * 3}s ease-in-out infinite ${Math.random() * 2}s`,
        }} />
      ))}
    </div>
  );
}

// ============== SCENE 2: Firefighters silhouettes ==============
function FirefighterScene() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      {/* Sky - dark with red glow */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at 50% 90%, rgba(220,38,38,0.4) 0%, rgba(20,5,5,0.8) 50%, #000 100%)',
      }} />

      {/* Fire glow rising */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '60%',
        background: 'linear-gradient(180deg, transparent 0%, rgba(220,38,38,0.3) 60%, rgba(245,158,11,0.5) 100%)',
        filter: 'blur(2px)',
        animation: 'pulseFire 2.5s ease-in-out infinite',
      }} />

      <svg viewBox="0 0 400 240" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} preserveAspectRatio="xMidYMid slice">
        {/* Roof line */}
        <path d="M 0 200 L 400 200 L 400 240 L 0 240 Z" fill="#0a0a0a" />
        <line x1="0" y1="200" x2="400" y2="200" stroke="#2a1a1a" strokeWidth="1" />

        {/* Firefighter silhouettes — 3 figures */}
        {[80, 200, 310].map((x, i) => (
          <g key={i} transform={`translate(${x}, 130)`}>
            {/* Helmet */}
            <ellipse cx="0" cy="0" rx="10" ry="8" fill="#0a0a0a" />
            <rect x="-12" y="0" width="24" height="2" fill="#0a0a0a" />
            {/* Body */}
            <path d="M -10 8 L -12 30 L -8 60 L 8 60 L 12 30 L 10 8 Z" fill="#0a0a0a" />
            {/* Arms */}
            <path d="M -10 12 L -18 30 L -16 50" fill="none" stroke="#0a0a0a" strokeWidth="6" strokeLinecap="round" />
            <path d="M 10 12 L 18 30 L 16 50" fill="none" stroke="#0a0a0a" strokeWidth="6" strokeLinecap="round" />
            {/* Legs */}
            <path d="M -6 60 L -8 70" stroke="#0a0a0a" strokeWidth="6" strokeLinecap="round" />
            <path d="M 6 60 L 8 70" stroke="#0a0a0a" strokeWidth="6" strokeLinecap="round" />
            {/* Hose for first figure */}
            {i === 0 && (
              <>
                <path d="M -16 35 Q -40 50 -50 65" fill="none" stroke="#2a1a1a" strokeWidth="3" />
                <circle cx="-50" cy="65" r="2" fill="#fbbf24" opacity="0.7" />
              </>
            )}
            {/* Reflective stripe */}
            <rect x="-10" y="35" width="20" height="2" fill="#fbbf24" opacity="0.6" />
          </g>
        ))}

        {/* Fire sparks */}
        {[...Array(15)].map((_, i) => (
          <circle key={i}
            cx={Math.random() * 400}
            cy={180 + Math.random() * 50}
            r={1 + Math.random()}
            fill={Math.random() > 0.5 ? '#fbbf24' : '#dc2626'}
            opacity={0.6}
            style={{ animation: `bubbleUp ${2 + Math.random() * 2}s infinite ${Math.random() * 2}s` }}
          />
        ))}
      </svg>
    </div>
  );
}

// ============== SCENE 3: Liquidators silhouettes ==============
function LiquidatorScene() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      {/* Sky — gray-green industrial */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, #0a1015 0%, #15201a 50%, #1a1a15 100%)',
      }} />

      {/* Industrial glow */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '100%',
        background: 'radial-gradient(ellipse at 50% 30%, rgba(245,158,11,0.15) 0%, transparent 60%)',
      }} />

      <svg viewBox="0 0 400 240" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} preserveAspectRatio="xMidYMid slice">
        {/* Ground */}
        <rect x="0" y="180" width="400" height="60" fill="#080808" />
        <line x1="0" y1="180" x2="400" y2="180" stroke="#1a1a1a" strokeWidth="1" />

        {/* Background structures */}
        <rect x="0" y="100" width="100" height="80" fill="#0a0f15" />
        <rect x="320" y="90" width="80" height="90" fill="#0a0f15" />
        <rect x="180" y="80" width="60" height="100" fill="#0a0f15" />

        {/* Truck silhouette */}
        <rect x="40" y="140" width="50" height="25" fill="#0a0a0a" />
        <rect x="80" y="135" width="20" height="30" fill="#0a0a0a" />
        <circle cx="55" cy="170" r="6" fill="#000" />
        <circle cx="85" cy="170" r="6" fill="#000" />

        {/* 5 liquidator figures in line */}
        {[140, 175, 210, 245, 280].map((x, i) => (
          <g key={i} transform={`translate(${x}, 130)`}>
            {/* Hazmat hood */}
            <ellipse cx="0" cy="0" rx="7" ry="9" fill="#0a0a0a" />
            <rect x="-5" y="-3" width="10" height="3" fill="#3a3a3a" />
            {/* Body — bulky suit */}
            <path d="M -12 8 L -14 35 L -10 55 L 10 55 L 14 35 L 12 8 Z" fill="#0a0a0a" />
            {/* Arms */}
            <path d="M -12 12 L -20 35 L -22 50" fill="none" stroke="#0a0a0a" strokeWidth="7" strokeLinecap="round" />
            <path d="M 12 12 L 20 35 L 22 50" fill="none" stroke="#0a0a0a" strokeWidth="7" strokeLinecap="round" />
            {/* Legs */}
            <path d="M -6 55 L -8 65" stroke="#0a0a0a" strokeWidth="7" strokeLinecap="round" />
            <path d="M 6 55 L 8 65" stroke="#0a0a0a" strokeWidth="7" strokeLinecap="round" />
            {/* Shovel */}
            <line x1="20" y1="50" x2="32" y2="20" stroke="#3a2010" strokeWidth="1.5" />
            <path d="M 30 16 L 36 18 L 34 24 L 28 22 Z" fill="#3a3a3a" />
          </g>
        ))}

        {/* Radiation symbol on ground */}
        <g transform="translate(200, 215)">
          <circle cx="0" cy="0" r="6" fill="none" stroke="#fbbf24" strokeWidth="1" opacity="0.5" />
          <path d="M 0 -5 L 2 0 L -2 0 Z" fill="#fbbf24" opacity="0.5" />
          <path d="M 4 3 L 0 0 L 4 0 Z" fill="#fbbf24" opacity="0.5" transform="rotate(120)" />
          <path d="M -4 3 L 0 0 L -4 0 Z" fill="#fbbf24" opacity="0.5" transform="rotate(240)" />
        </g>
      </svg>

      {/* Dust particles */}
      {[...Array(10)].map((_, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: `${Math.random() * 100}%`,
          top: `${30 + Math.random() * 50}%`,
          width: 1.5, height: 1.5,
          borderRadius: '50%',
          background: 'rgba(245,158,11,0.4)',
          animation: `radFloat ${4 + Math.random() * 3}s ease-in-out infinite ${Math.random() * 3}s`,
        }} />
      ))}
    </div>
  );
}

// ============== SCENE 4: Sarcophagus ==============
function SarcophagusScene() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, #0a1525 0%, #15202d 50%, #08101a 100%)',
      }} />

      <svg viewBox="0 0 400 240" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} preserveAspectRatio="xMidYMid slice">
        {/* Ground */}
        <rect x="0" y="190" width="400" height="50" fill="#050810" />
        <line x1="0" y1="190" x2="400" y2="190" stroke="#1a2030" strokeWidth="0.5" />

        {/* Distant power plant */}
        <rect x="40" y="140" width="60" height="50" fill="#0a1018" stroke="#1a2030" strokeWidth="0.5" />
        <rect x="60" y="100" width="6" height="40" fill="#0a1018" />

        {/* New Safe Confinement arch — main feature */}
        <path d="M 130 190 Q 200 60 270 190 Z" fill="url(#archGrad)" stroke="#3a4a5a" strokeWidth="1" />
        <path d="M 140 190 Q 200 80 260 190" fill="none" stroke="#5a6a7a" strokeWidth="0.5" opacity="0.5" />
        <path d="M 150 190 Q 200 100 250 190" fill="none" stroke="#5a6a7a" strokeWidth="0.5" opacity="0.4" />
        {/* Vertical lines on arch */}
        {[160, 180, 200, 220, 240].map((x) => (
          <line key={x} x1={x} y1="190" x2={x} y2={190 - Math.sqrt(Math.max(0, 6500 - (x - 200) * (x - 200)))} stroke="#3a4a5a" strokeWidth="0.4" opacity="0.4" />
        ))}

        <defs>
          <linearGradient id="archGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1a2535" />
            <stop offset="100%" stopColor="#0a1018" />
          </linearGradient>
        </defs>

        {/* Old chimney behind */}
        <rect x="280" y="80" width="6" height="110" fill="#0a1018" stroke="#1a2030" strokeWidth="0.3" />
        <line x1="280" y1="80" x2="286" y2="80" stroke="#dc2626" strokeWidth="1" />

        {/* Distant building */}
        <rect x="320" y="150" width="60" height="40" fill="#0a1018" />

        {/* Stars */}
        {[...Array(20)].map((_, i) => (
          <circle key={i}
            cx={Math.random() * 400}
            cy={Math.random() * 130}
            r={0.5 + Math.random() * 0.8}
            fill="#fff"
            opacity={0.3 + Math.random() * 0.5}
          />
        ))}

        {/* Moon */}
        <circle cx="340" cy="50" r="14" fill="#e8d5a0" opacity="0.7" />
        <circle cx="340" cy="50" r="14" fill="none" stroke="#fbbf24" strokeWidth="0.5" opacity="0.3" />
      </svg>
    </div>
  );
}
