'use client';
import { useEffect, useState, useMemo } from 'react';
import { C } from '@/lib/data';

export type ReactorState =
  | 'stable'      // Normal operation, ~3200 MW
  | 'low'         // Low power test, ~700 MW
  | 'xenon'       // Xenon poisoning, falling power
  | 'rod-pull'    // Operators pulling rods to compensate
  | 'test'        // Test running, dangerous configuration
  | 'spike'       // Power surge starting
  | 'az5'         // AZ-5 button pressed, rods inserting (positive scram)
  | 'explosion-1' // First steam explosion
  | 'explosion-2' // Second hydrogen explosion
  | 'destroyed';  // Core exposed, graphite fire

interface ReactorProps {
  he: boolean;
  t: (h: string, e: string) => string;
  power: number;          // 0-3500 MW
  rodPosition: number;    // 0-100 (% inserted)
  coreTemp: number;       // °C
  steamFraction: number;  // 0-1
  state: ReactorState;
  showLabels?: boolean;
  showFlow?: boolean;
  width?: number;
}

/**
 * RBMK-1000 — Cross-section, cinematic.
 *
 * Real components, accurate proportions:
 * - Concrete biological shielding (outer)
 * - Reactor vessel (11.8m × 7m)
 * - Upper "Schema E" biological shield — 2000 ton lid
 * - Lower biological shield
 * - Graphite moderator stack — 1700 tons
 * - Pressure tubes (1661 in real life, ~30 representative here)
 * - Control rods with graphite tips (the fatal flaw!)
 * - Coolant flow (down/up)
 * - 4 Steam separators (drums)
 * - 8 Main Coolant Pumps (MCPs)
 * - Refueling machine on top
 */
export default function Reactor3D({
  he, t, power, rodPosition, coreTemp, steamFraction, state,
  showLabels = true, showFlow = true, width = 1100,
}: ReactorProps) {
  const [tick, setTick] = useState(0);

  // 80ms tick = 12.5 fps for non-CSS animations
  useEffect(() => {
    const id = setInterval(() => setTick((t) => (t + 1) % 1000), 80);
    return () => clearInterval(id);
  }, []);

  const isExplosion = state === 'explosion-1' || state === 'explosion-2' || state === 'destroyed';
  const isHotState = power > 1500 || coreTemp > 800;
  const isSpike = state === 'spike' || state === 'az5';
  const isAz5 = state === 'az5';
  const isDestroyed = state === 'destroyed';

  // Power as % for visual intensity
  const powerPct = Math.min(power / 3200, 1.5); // can exceed 100%

  // Core color/glow based on state
  const coreColor = useMemo(() => {
    if (isDestroyed) return '#1a0a05';
    if (state === 'explosion-2') return '#ffffff';
    if (state === 'explosion-1') return '#fef3c7';
    if (isSpike) return `hsl(${30 - powerPct * 30}, 100%, ${50 + powerPct * 30}%)`;
    if (isHotState) return '#f97316';
    if (power < 200) return '#3b82f6';
    return '#fbbf24';
  }, [state, power, isHotState, isSpike, isDestroyed, powerPct]);

  // Smoke/steam intensity
  const steamIntensity = isDestroyed ? 1 : isExplosion ? 0.9 : Math.min(steamFraction * 1.2, 1);

  // Control rod offset (0 = fully out, full insertion = fully in)
  // rod is 7m long, fully inserted means pos=100
  const rodOffset = (100 - rodPosition) * 1.5; // visual offset in SVG units

  // 12 control rods spread across width
  const rodCount = 12;
  const rodPositions = Array.from({ length: rodCount }, (_, i) => {
    return 220 + (i * 38);
  });

  // 30 pressure tubes (representative of 1661)
  const tubeCount = 30;
  const tubePositions = Array.from({ length: tubeCount }, (_, i) => {
    return 215 + (i * 15.5);
  });

  return (
    <div className="reactor-svg-container" style={{ width: '100%', maxWidth: width, margin: '0 auto', position: 'relative' }}>
      <svg
        viewBox="0 0 1100 700"
        preserveAspectRatio="xMidYMid meet"
        className="reactor-svg"
        style={{
          width: '100%',
          height: 'auto',
          display: 'block',
          filter: isExplosion ? `drop-shadow(0 0 30px ${C.danger})` : 'none',
        }}
      >
        <defs>
          {/* Concrete shielding gradient */}
          <linearGradient id="concrete" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5a5a5a" />
            <stop offset="50%" stopColor="#3a3a3a" />
            <stop offset="100%" stopColor="#252525" />
          </linearGradient>
          {/* Graphite stack */}
          <linearGradient id="graphite" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2a2a2a" />
            <stop offset="100%" stopColor="#0a0a0a" />
          </linearGradient>
          {/* Steel */}
          <linearGradient id="steel" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#444" />
            <stop offset="50%" stopColor="#888" />
            <stop offset="100%" stopColor="#444" />
          </linearGradient>
          {/* Biological shield (lid) - massive concrete+steel */}
          <linearGradient id="lidGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6a6a6a" />
            <stop offset="50%" stopColor="#4a4a4a" />
            <stop offset="100%" stopColor="#2a2a2a" />
          </linearGradient>
          {/* Core glow */}
          <radialGradient id="coreGlow" cx="50%" cy="50%">
            <stop offset="0%" stopColor={coreColor} stopOpacity={isDestroyed ? 0.3 : 0.95} />
            <stop offset="40%" stopColor={coreColor} stopOpacity="0.6" />
            <stop offset="100%" stopColor={coreColor} stopOpacity="0" />
          </radialGradient>
          {/* Water flow */}
          <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.5" />
          </linearGradient>
          <linearGradient id="hotWaterGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f97316" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.5" />
          </linearGradient>
          {/* Steam */}
          <linearGradient id="steamGrad" x1="0" y1="100%" x2="0" y2="0%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.5" />
          </linearGradient>
          {/* Explosion */}
          <radialGradient id="explosionFlash">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="20%" stopColor="#fef08a" stopOpacity="0.95" />
            <stop offset="40%" stopColor="#fbbf24" stopOpacity="0.8" />
            <stop offset="70%" stopColor="#dc2626" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#dc2626" stopOpacity="0" />
          </radialGradient>
          {/* Filters */}
          <filter id="blur1"><feGaussianBlur stdDeviation="1.5" /></filter>
          <filter id="blur3"><feGaussianBlur stdDeviation="3" /></filter>
          <filter id="blur8"><feGaussianBlur stdDeviation="8" /></filter>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ================ BACKGROUND ================ */}
        <rect width="1100" height="700" fill={isExplosion ? '#1a0505' : '#080a14'} />

        {/* Subtle grid */}
        <g opacity="0.04">
          {Array.from({ length: 12 }).map((_, i) => (
            <line key={`gh-${i}`} x1="0" y1={i * 60} x2="1100" y2={i * 60} stroke={C.gold} strokeWidth="0.5" />
          ))}
          {Array.from({ length: 20 }).map((_, i) => (
            <line key={`gv-${i}`} x1={i * 55} y1="0" x2={i * 55} y2="700" stroke={C.gold} strokeWidth="0.5" />
          ))}
        </g>

        {/* Sky/atmosphere fading down */}
        <rect width="1100" height="700" fill="url(#bgFade)" />
        <defs>
          <linearGradient id="bgFade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={isExplosion ? '#3a0a0a' : '#1a2540'} stopOpacity="0.4" />
            <stop offset="100%" stopColor="#000" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* ================ EXPLOSION VFX ================ */}
        {/* First explosion (steam) - amber/orange, less powerful */}
        {state === 'explosion-1' && (
          <>
            {/* Initial flash */}
            <ellipse cx="550" cy="380" rx="450" ry="450" fill="url(#explosionFlash)"
                     style={{ animation: 'expanFlash 0.8s ease-out' }} />
            {/* Shockwave ring 1 */}
            <circle cx="550" cy="380" r="100" fill="none" stroke="#fbbf24" strokeWidth="3"
                    opacity="0.8" style={{ animation: 'shockwave 1.2s ease-out forwards' }} />
            {/* Shockwave ring 2 (delayed) */}
            <circle cx="550" cy="380" r="100" fill="none" stroke="#dc2626" strokeWidth="2"
                    opacity="0.6" style={{ animation: 'shockwave 1.5s ease-out 0.3s forwards' }} />
            {/* Debris flying outward */}
            {Array.from({ length: 30 }).map((_, i) => {
              const angle = (i / 30) * Math.PI * 2;
              const speed = 0.5 + Math.random() * 0.8;
              return (
                <rect
                  key={`debris1-${i}`}
                  x={550 + Math.cos(angle) * 80 * speed}
                  y={380 + Math.sin(angle) * 60 * speed}
                  width={3 + Math.random() * 5}
                  height={3 + Math.random() * 5}
                  fill={Math.random() > 0.5 ? '#3a3a3a' : '#fbbf24'}
                  opacity={0.9}
                  style={{
                    animation: `debrisFly 1.5s cubic-bezier(0.5, 0, 0.5, 1) forwards`,
                    transform: `translate(${Math.cos(angle) * 400 * speed}px, ${Math.sin(angle) * 300 * speed}px) rotate(${Math.random() * 720}deg)`,
                  }}
                />
              );
            })}
          </>
        )}

        {/* Second explosion (hydrogen) - much more powerful, white-hot */}
        {state === 'explosion-2' && (
          <>
            {/* Massive central flash */}
            <ellipse cx="550" cy="380" rx="900" ry="900" fill="url(#explosionFlash)"
                     style={{ animation: 'expanFlash 1.2s ease-out' }} />
            {/* Multiple shockwave rings */}
            <circle cx="550" cy="380" r="100" fill="none" stroke="#ffffff" strokeWidth="5"
                    opacity="1" style={{ animation: 'shockwave 1.5s ease-out forwards' }} />
            <circle cx="550" cy="380" r="100" fill="none" stroke="#fbbf24" strokeWidth="4"
                    opacity="0.85" style={{ animation: 'shockwave 1.8s ease-out 0.2s forwards' }} />
            <circle cx="550" cy="380" r="100" fill="none" stroke="#dc2626" strokeWidth="3"
                    opacity="0.7" style={{ animation: 'shockwave 2.1s ease-out 0.4s forwards' }} />
            {/* Massive debris field — building parts, fuel, graphite */}
            {Array.from({ length: 60 }).map((_, i) => {
              const angle = (i / 60) * Math.PI * 2;
              const speed = 0.7 + Math.random() * 1.3;
              const isHot = Math.random() > 0.4;
              return (
                <rect
                  key={`debris2-${i}`}
                  x={550 + Math.cos(angle) * 60}
                  y={380 + Math.sin(angle) * 40}
                  width={4 + Math.random() * 8}
                  height={4 + Math.random() * 8}
                  fill={isHot ? (Math.random() > 0.5 ? '#fbbf24' : '#dc2626') : '#1a1a1a'}
                  opacity={0.9}
                  style={{
                    animation: `debrisFly 2.5s cubic-bezier(0.5, 0, 0.5, 1) forwards`,
                    transform: `translate(${Math.cos(angle) * 600 * speed}px, ${Math.sin(angle) * 500 * speed - 100}px) rotate(${Math.random() * 1080}deg)`,
                    filter: isHot ? 'drop-shadow(0 0 4px currentColor)' : 'none',
                  }}
                />
              );
            })}
            {/* Fireball expanding upward */}
            <ellipse cx="550" cy="350" rx="200" ry="100" fill="#fef08a" opacity="0.6"
                     filter="url(#blur8)"
                     style={{ animation: 'fireballRise 2s ease-out forwards' }} />
          </>
        )}

        {/* ================ CONCRETE BIOLOGICAL SHIELDING (outer walls) ================ */}
        {/* Outer concrete vessel — the building itself */}
        <rect x="80" y="180" width="940" height="430" fill="url(#concrete)" stroke="#1a1a1a" strokeWidth="2" />
        {/* Concrete texture lines */}
        {Array.from({ length: 8 }).map((_, i) => (
          <line key={`ch-${i}`} x1="80" y1={210 + i * 50} x2="1020" y2={210 + i * 50} stroke="#1a1a1a" strokeWidth="0.5" opacity="0.5" />
        ))}
        {Array.from({ length: 16 }).map((_, i) => (
          <line key={`cv-${i}`} x1={80 + i * 60} y1="180" x2={80 + i * 60} y2="610" stroke="#1a1a1a" strokeWidth="0.5" opacity="0.4" />
        ))}

        {/* Inner reactor cavity (where the actual reactor sits) */}
        <rect x="180" y="220" width="740" height="370" fill="#0a0a0a" stroke="#3a3a3a" strokeWidth="1.5" />

        {/* ================ LOWER BIOLOGICAL SHIELD (Schema OR — 2000 tons) ================ */}
        <rect x="190" y="540" width="720" height="40" fill="url(#lidGrad)" stroke="#1a1a1a" strokeWidth="1" />
        {/* Bolts */}
        {Array.from({ length: 14 }).map((_, i) => (
          <circle key={`bolt-bot-${i}`} cx={210 + i * 50} cy="560" r="3" fill="#666" stroke="#222" strokeWidth="0.5" />
        ))}

        {/* ================ GRAPHITE STACK ================ */}
        {!isDestroyed ? (
          <g>
            {/* Graphite blocks - 13 columns × 8 rows */}
            {Array.from({ length: 13 }).map((_, col) =>
              Array.from({ length: 8 }).map((_, row) => (
                <rect
                  key={`g-${col}-${row}`}
                  x={210 + col * 38}
                  y={310 + row * 28}
                  width="36"
                  height="26"
                  fill="url(#graphite)"
                  stroke="#0a0a0a"
                  strokeWidth="0.5"
                />
              ))
            )}
          </g>
        ) : (
          // Destroyed: scattered graphite chunks
          <g>
            {Array.from({ length: 30 }).map((_, i) => {
              const x = 100 + Math.random() * 900;
              const y = 100 + Math.random() * 500;
              const r = 8 + Math.random() * 15;
              return (
                <g key={`debris-${i}`}>
                  <rect x={x} y={y} width={r} height={r} fill="url(#graphite)" transform={`rotate(${Math.random() * 90} ${x + r/2} ${y + r/2})`} />
                  {/* Glowing edges */}
                  <rect x={x} y={y} width={r} height={r} fill="none" stroke="#fbbf24" strokeWidth="0.5" opacity="0.6" transform={`rotate(${Math.random() * 90} ${x + r/2} ${y + r/2})`} />
                </g>
              );
            })}
          </g>
        )}

        {/* ================ CORE GLOW (the reaction itself) ================ */}
        {!isDestroyed && (
          <ellipse
            cx="550"
            cy="430"
            rx={Math.min(280 * (0.5 + powerPct * 0.5), 380)}
            ry={Math.min(110 * (0.5 + powerPct * 0.5), 160)}
            fill="url(#coreGlow)"
            style={{
              animation: isSpike ? 'pulseFire 0.4s infinite' : 'pulseFire 2s infinite',
              mixBlendMode: 'screen',
            }}
          />
        )}

        {/* ================ ACTIVE NEUTRONS — fission particles flying inside core ================ */}
        {!isDestroyed && power > 50 && (
          <g style={{ mixBlendMode: 'screen' }}>
            {Array.from({ length: Math.min(Math.round(8 + powerPct * 30), 50) }).map((_, i) => {
              // Pseudo-random but stable per-tick positions
              const seed = (i * 137 + tick * 3) % 1000;
              const angle = (seed / 1000) * Math.PI * 2;
              const dist = 40 + ((seed * 7) % 200);
              const x = 550 + Math.cos(angle) * Math.min(dist, 250);
              const y = 430 + Math.sin(angle) * Math.min(dist * 0.4, 90);
              const size = isSpike ? 2 + Math.random() * 2 : 1 + Math.random() * 1.5;
              // Color based on power
              let color = '#06b6d4'; // cool blue
              if (isSpike) color = '#ffffff';
              else if (power > 2000) color = '#fef08a';
              else if (power > 800) color = '#fbbf24';
              else if (power > 300) color = '#f59e0b';

              return (
                <circle
                  key={`neutron-${i}`}
                  cx={x}
                  cy={y}
                  r={size}
                  fill={color}
                  opacity={0.85}
                  filter="url(#blur1)"
                />
              );
            })}
            {/* Fission flashes — bright flashes when neutrons "hit" */}
            {isSpike && Array.from({ length: 15 }).map((_, i) => {
              if ((tick + i * 7) % 5 !== 0) return null;
              const x = 350 + ((i * 53 + tick * 11) % 400);
              const y = 380 + ((i * 31) % 100);
              return (
                <circle
                  key={`flash-${i}`}
                  cx={x} cy={y} r="6"
                  fill="#ffffff"
                  opacity={0.9}
                  filter="url(#blur3)"
                />
              );
            })}
          </g>
        )}

        {/* ================ PRESSURE TUBES (vertical lines through graphite) ================ */}
        {!isDestroyed && tubePositions.map((x, i) => (
          <g key={`tube-${i}`}>
            <line x1={x} y1="305" x2={x} y2="540" stroke="#1a1a1a" strokeWidth="2.5" />
            {showFlow && (
              <line x1={x} y1="305" x2={x} y2="540"
                    stroke={isHotState ? '#fbbf24' : '#06b6d4'}
                    strokeWidth="1"
                    strokeDasharray="3 5"
                    opacity={0.6}
                    style={{ animation: 'flowD 1.5s linear infinite' }} />
            )}
            {/* Steam bubbles — appear when steam fraction increases */}
            {showFlow && steamFraction > 0.2 && i % 2 === 0 && (
              <>
                {Array.from({ length: Math.min(Math.floor(steamFraction * 5), 4) }).map((_, j) => {
                  const bubbleY = 540 - ((tick * 4 + i * 17 + j * 60) % 230);
                  const bubbleSize = 1.5 + steamFraction * 2.5 + Math.random() * 0.5;
                  return (
                    <circle
                      key={`bubble-${i}-${j}`}
                      cx={x + (Math.sin(tick * 0.1 + i + j) * 1.5)}
                      cy={bubbleY}
                      r={bubbleSize}
                      fill={isSpike ? '#fef08a' : steamFraction > 0.6 ? '#fbbf24' : '#67e8f9'}
                      opacity={0.7}
                    />
                  );
                })}
              </>
            )}
            {/* CRACKS in tubes when extreme pressure */}
            {(state === 'spike' || state === 'explosion-1' || state === 'explosion-2') && i % 3 === 0 && (
              <line x1={x - 3} y1={350 + (i * 13) % 150} x2={x + 3} y2={355 + (i * 13) % 150}
                    stroke="#dc2626" strokeWidth="1.5" opacity="0.9"
                    style={{ animation: 'pulseAlert 0.3s infinite' }} />
            )}
          </g>
        ))}

        {/* ================ CONTROL RODS (THE FATAL ones with graphite tips!) ================ */}
        {!isDestroyed && rodPositions.map((x, i) => {
          const rodTopY = 250 - rodOffset;
          // Graphite tip is at the bottom of the rod (4.5m of graphite below boron)
          // When rod is partially inserted, the GRAPHITE TIP enters core first — displacing water
          const graphiteTipY = rodTopY + 50;
          const boronStart = graphiteTipY + 20;
          const boronEnd = boronStart + 130;
          return (
            <g key={`rod-${i}`}>
              {/* Rod casing/track */}
              <rect x={x - 3} y="200" width="6" height="60" fill="#222" stroke="#444" strokeWidth="0.5" />
              {/* Rod itself - top section (handle/connector) */}
              <rect x={x - 4} y={rodTopY} width="8" height="20" fill="#888" stroke="#333" strokeWidth="0.5" />
              {/* Rod shaft */}
              <rect x={x - 3} y={rodTopY + 20} width="6" height="30" fill="#666" />
              {/* GRAPHITE TIP (the killer) - lighter color */}
              <rect x={x - 4} y={graphiteTipY} width="8" height="20" fill="#3a3a3a" stroke={isSpike ? '#dc2626' : '#1a1a1a'} strokeWidth="1" />
              {/* Boron carbide section (the absorber) */}
              <rect x={x - 4} y={boronStart} width="8" height="130" fill="#1a3a5a" stroke="#0a2540" strokeWidth="0.5" />
              {/* Insertion direction arrow when AZ-5 pressed */}
              {isAz5 && (
                <text x={x} y={rodTopY - 5} textAnchor="middle" fontSize="14" fill={C.danger} fontWeight="900" style={{ animation: 'pulseAlert 0.5s infinite' }}>
                  ↓
                </text>
              )}
            </g>
          );
        })}

        {/* ================ UPPER BIOLOGICAL SHIELD ("Schema E" - 2000 ton lid) ================ */}
        {!isDestroyed ? (
          <>
            <rect x="190" y="240" width="720" height="50" fill="url(#lidGrad)" stroke="#1a1a1a" strokeWidth="1.5" />
            {/* Bolts on top of lid */}
            {Array.from({ length: 14 }).map((_, i) => (
              <circle key={`bolt-${i}`} cx={210 + i * 50} cy="265" r="3.5" fill="#666" stroke="#222" strokeWidth="0.5" />
            ))}
            {/* Top surface highlight */}
            <rect x="190" y="240" width="720" height="3" fill="#7a7a7a" opacity="0.6" />
          </>
        ) : (
          // Lid blown off — show edges of broken lid
          <>
            <polygon points="190,240 250,180 280,250 200,250" fill="url(#lidGrad)" stroke="#1a1a1a" strokeWidth="1" />
            <polygon points="850,250 920,170 910,240 870,260" fill="url(#lidGrad)" stroke="#1a1a1a" strokeWidth="1" />
          </>
        )}

        {/* ================ STEAM SEPARATORS (4 drums on top) ================ */}
        {[300, 500, 700, 900].map((x, i) => (
          <g key={`drum-${i}`}>
            <ellipse cx={x} cy="160" rx="60" ry="22" fill="url(#steel)" stroke="#1a1a1a" strokeWidth="1.5" />
            <ellipse cx={x} cy="160" rx="60" ry="22" fill={isHotState ? '#3a2010' : 'transparent'} opacity="0.4" />
            {/* Steam dome */}
            <path d={`M ${x - 60} 160 A 60 22 0 0 0 ${x + 60} 160`} fill="rgba(255,255,255,0.1)" />
            {/* Pipes connecting drum to reactor */}
            <line x1={x - 25} y1="180" x2={x - 25} y2="240" stroke="#666" strokeWidth="3" />
            <line x1={x + 25} y1="180" x2={x + 25} y2="240" stroke="#666" strokeWidth="3" />
            {/* Steam outlet pipe */}
            <line x1={x} y1="138" x2={x} y2="100" stroke="#888" strokeWidth="4" />
            {/* Steam */}
            {showFlow && steamFraction > 0.05 && (
              <circle cx={x} cy={130 - (tick * 2) % 30}
                      r={3 + steamFraction * 4}
                      fill="rgba(255,255,255,0.5)"
                      filter="url(#blur1)"
                      opacity={0.8 - ((tick * 2) % 30) / 35} />
            )}
          </g>
        ))}

        {/* ================ MAIN COOLANT PUMPS (8 - showing 4 visible) ================ */}
        {[100, 200, 920, 1010].map((x, i) => (
          <g key={`mcp-${i}`}>
            <rect x={x - 25} y="450" width="50" height="60" fill="url(#steel)" stroke="#1a1a1a" strokeWidth="1.5" />
            <circle cx={x} cy="480" r="18" fill="#222" stroke="#666" strokeWidth="1.5" />
            {/* Spinning impeller */}
            <g style={{ transformOrigin: `${x}px 480px`, animation: power > 100 ? 'spin 0.8s linear infinite' : 'none' }}>
              <line x1={x - 14} y1="480" x2={x + 14} y2="480" stroke="#888" strokeWidth="2" />
              <line x1={x} y1="466" x2={x} y2="494" stroke="#888" strokeWidth="2" />
            </g>
            {/* MCP label */}
            {showLabels && (
              <text x={x} y="525" textAnchor="middle" fill="#888" fontSize="10" fontFamily="JetBrains Mono">MCP</text>
            )}
          </g>
        ))}

        {/* ================ COOLANT FLOW LINES ================ */}
        {showFlow && !isDestroyed && (
          <>
            {/* Cold water in (from MCPs to reactor bottom) */}
            <path d="M 200 500 L 200 580 L 920 580 L 920 500"
                  stroke="url(#waterGrad)" strokeWidth="6" fill="none" />
            <path d="M 200 500 L 200 580 L 920 580 L 920 500"
                  stroke="#06b6d4" strokeWidth="2" fill="none"
                  strokeDasharray="8 4"
                  style={{ animation: 'flowD 1.5s linear infinite' }} />

            {/* Hot water/steam out (from reactor top to drums) */}
            {[300, 500, 700, 900].map((x) => (
              <line key={`out-${x}`} x1={x - 25} y1="240" x2={x - 25} y2="180"
                    stroke={isHotState ? '#f97316' : '#06b6d4'} strokeWidth="2.5" strokeDasharray="6 3"
                    style={{ animation: 'flowDS 1s linear infinite' }} />
            ))}
          </>
        )}

        {/* ================ DESTROYED STATE — exposed core, fire, smoke ================ */}
        {isDestroyed && (
          <>
            {/* Exposed core glow (extreme) */}
            <ellipse cx="550" cy="430" rx="350" ry="120" fill="url(#explosionFlash)" filter="url(#blur8)" opacity="0.7" />
            {/* Fire flames coming out */}
            {Array.from({ length: 20 }).map((_, i) => {
              const fx = 200 + Math.random() * 700;
              const fy = 200 + Math.random() * 100;
              return (
                <g key={`fire-${i}`}>
                  <ellipse cx={fx} cy={fy} rx="15" ry="40" fill="#dc2626" opacity={0.7} filter="url(#blur3)"
                          style={{ animation: `flameWave ${0.5 + Math.random()}s infinite alternate` }} />
                  <ellipse cx={fx} cy={fy + 10} rx="10" ry="25" fill="#fbbf24" opacity={0.8} filter="url(#blur1)"
                          style={{ animation: `flameWave ${0.4 + Math.random() * 0.5}s infinite alternate` }} />
                </g>
              );
            })}
            {/* Black smoke pillar */}
            {Array.from({ length: 15 }).map((_, i) => (
              <ellipse key={`smoke-${i}`}
                       cx={400 + Math.random() * 300}
                       cy={50 + Math.random() * 100}
                       rx={40 + Math.random() * 30}
                       ry={30 + Math.random() * 20}
                       fill="#1a1010"
                       opacity={0.6 + Math.random() * 0.3}
                       filter="url(#blur8)"
                       style={{ animation: `radFloat ${4 + Math.random() * 4}s ease-in-out infinite` }} />
            ))}
            {/* Floating radioactive particles */}
            {Array.from({ length: 25 }).map((_, i) => (
              <circle key={`rad-${i}`}
                      cx={150 + Math.random() * 800}
                      cy={50 + Math.random() * 250}
                      r={1 + Math.random() * 2}
                      fill="#fbbf24"
                      opacity={0.7}
                      style={{ animation: `radFloat ${3 + Math.random() * 3}s ease-in-out infinite ${Math.random() * 3}s` }} />
            ))}
          </>
        )}

        {/* ================ HEAT WAVES (when hot) ================ */}
        {isHotState && !isDestroyed && (
          <g opacity="0.4">
            {Array.from({ length: 8 }).map((_, i) => (
              <path key={`heat-${i}`}
                    d={`M ${250 + i * 80} 230 Q ${260 + i * 80} ${210 - (tick + i * 5) % 20} ${250 + i * 80} 200`}
                    stroke="#f97316" strokeWidth="1" fill="none" opacity="0.5" />
            ))}
          </g>
        )}

        {/* ================ LABELS — only shown if showLabels and viewport is wide enough ================ */}
        {showLabels && (
          <g style={{ pointerEvents: 'none' }} className="reactor-labels">
            {/* Numbered indicators on key components — small numbered circles */}

            {/* 1. Upper biological shield */}
            <g>
              <circle cx="540" cy="265" r="14" fill={C.gold} stroke="#000" strokeWidth="1.5" />
              <text x="540" y="270" textAnchor="middle" fill="#000" fontSize="14" fontFamily="JetBrains Mono" fontWeight="900">1</text>
            </g>

            {/* 2. Steam separator */}
            <g>
              <circle cx="500" cy="160" r="14" fill={C.gold} stroke="#000" strokeWidth="1.5" />
              <text x="500" y="165" textAnchor="middle" fill="#000" fontSize="14" fontFamily="JetBrains Mono" fontWeight="900">2</text>
            </g>

            {/* 3. Control rods */}
            <g>
              <circle cx="240" cy="220" r="14" fill={isSpike ? C.danger : C.gold} stroke="#000" strokeWidth="1.5"
                      style={{ animation: isSpike ? 'pulseAlert 0.8s infinite' : 'none' }} />
              <text x="240" y="225" textAnchor="middle" fill="#000" fontSize="14" fontFamily="JetBrains Mono" fontWeight="900">3</text>
            </g>

            {/* 4. Graphite stack */}
            <g>
              <circle cx="350" cy="430" r="14" fill={C.gold} stroke="#000" strokeWidth="1.5" />
              <text x="350" y="435" textAnchor="middle" fill="#000" fontSize="14" fontFamily="JetBrains Mono" fontWeight="900">4</text>
            </g>

            {/* 5. Pressure tubes */}
            <g>
              <circle cx="700" cy="430" r="14" fill={C.gold} stroke="#000" strokeWidth="1.5" />
              <text x="700" y="435" textAnchor="middle" fill="#000" fontSize="14" fontFamily="JetBrains Mono" fontWeight="900">5</text>
            </g>

            {/* 6. MCP */}
            <g>
              <circle cx="100" cy="480" r="14" fill={C.gold} stroke="#000" strokeWidth="1.5" />
              <text x="100" y="485" textAnchor="middle" fill="#000" fontSize="14" fontFamily="JetBrains Mono" fontWeight="900">6</text>
            </g>

            {/* 7. Concrete shielding */}
            <g>
              <circle cx="120" cy="370" r="14" fill={C.gold} stroke="#000" strokeWidth="1.5" />
              <text x="120" y="375" textAnchor="middle" fill="#000" fontSize="14" fontFamily="JetBrains Mono" fontWeight="900">7</text>
            </g>
          </g>
        )}

        {/* ================ TITLE ================ */}
        <text x="550" y="35" textAnchor="middle" fill={C.gold} fontSize="16" fontFamily="JetBrains Mono" fontWeight="900" letterSpacing="3">
          RBMK-1000
        </text>
        <text x="550" y="55" textAnchor="middle" fill={C.gL} fontSize="11" fontFamily="JetBrains Mono" letterSpacing="2">
          {he ? 'חתך אנכי · יחידה 4' : 'CROSS-SECTION · UNIT 4'}
        </text>
      </svg>

      {/* ================ LEGEND — readable at any screen size ================ */}
      {showLabels && (
        <div style={{
          marginTop: 14,
          padding: '14px 16px',
          background: 'linear-gradient(135deg, rgba(0,0,0,0.6), rgba(20,30,55,0.4))',
          border: `1px solid ${C.gold}33`,
          borderRadius: 10,
        }}>
          <div style={{
            fontSize: 12,
            color: C.gold,
            fontFamily: "'JetBrains Mono', monospace",
            fontWeight: 800,
            letterSpacing: '0.15em',
            marginBottom: 10,
          }}>
            {he ? '◆ מקרא רכיבי הכור' : '◆ REACTOR LEGEND'}
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 8,
          }}>
            {[
              { n: 1, he_l: 'מגן ביולוגי עליון', en_l: 'Upper Bio Shield', he_d: '2,000 טון · נעקר בפיצוץ', en_d: '2,000 tons · ejected in blast' },
              { n: 2, he_l: 'מפריד קיטור', en_l: 'Steam Separator', he_d: '4 יחידות · מפרידות אדים ממים', en_d: '4 units · separate steam from water' },
              { n: 3, he_l: 'מוטות בקרה', en_l: 'Control Rods',
                he_d: rodPosition > 0 ? `${rodPosition}% מוחדרים${isSpike ? ' · ⚠ קצה גרפיט קטלני' : ''}` : 'יצאו מהליבה',
                en_d: rodPosition > 0 ? `${rodPosition}% inserted${isSpike ? ' · ⚠ Graphite tip!' : ''}` : 'withdrawn',
                color: isSpike ? C.danger : undefined },
              { n: 4, he_l: 'גרפיט מאט', en_l: 'Graphite Moderator', he_d: '1,700 טון · בלוקי פחמן טהור', en_d: '1,700 tons · pure carbon blocks' },
              { n: 5, he_l: 'תעלות לחץ', en_l: 'Pressure Tubes', he_d: '1,661 תעלות · מכילות דלק וקירור', en_d: '1,661 channels · contain fuel & coolant' },
              { n: 6, he_l: 'משאבות קירור', en_l: 'Coolant Pumps', he_d: '8 משאבות · מסחררות מים בליבה', en_d: '8 pumps · circulate water through core' },
              { n: 7, he_l: 'מעטפת בטון', en_l: 'Concrete Shielding', he_d: 'מעטפת חיצונית · בלי קונטיינמנט!', en_d: 'Outer shielding · NO containment dome!' },
            ].map((item) => (
              <div key={item.n} style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 10,
                padding: '8px 10px',
                background: 'rgba(0,0,0,0.35)',
                borderRadius: 6,
                border: `1px solid ${item.color || C.gold}22`,
              }}>
                <div style={{
                  flexShrink: 0,
                  width: 26,
                  height: 26,
                  borderRadius: '50%',
                  background: item.color || C.gold,
                  color: '#000',
                  fontWeight: 900,
                  fontSize: 14,
                  fontFamily: "'JetBrains Mono', monospace",
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  animation: item.color === C.danger ? 'pulseAlert 1s infinite' : 'none',
                }}>
                  {item.n}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: 14,
                    color: '#fff',
                    fontWeight: 700,
                    lineHeight: 1.3,
                    marginBottom: 2,
                  }}>
                    {t(item.he_l, item.en_l)}
                  </div>
                  <div style={{
                    fontSize: 12,
                    color: item.color === C.danger ? C.danger : 'rgba(255,255,255,0.65)',
                    lineHeight: 1.4,
                    fontFamily: "'JetBrains Mono', monospace",
                  }}>
                    {t(item.he_d, item.en_d)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes expanFlash {
          0% { opacity: 0; transform: scale(0.3); transform-origin: 550px 350px; }
          30% { opacity: 1; transform: scale(1); }
          100% { opacity: 0; transform: scale(1.3); }
        }
      `}</style>
    </div>
  );
}
