'use client';
import { useState, useEffect, useRef } from 'react';
import { C, INSAG, RBMK_COMP } from '@/lib/data';
import Reactor3D, { ReactorState } from './Reactor3D';
import ControlRoomHUD from './ControlRoomHUD';

// =====================================================================
// Per-step reactor state — what should the reactor LOOK like at each step
// =====================================================================
const STEP_STATES: Array<{
  reactorState: ReactorState;
  power: number;
  rodPosition: number;
  coreTemp: number;
  steamFraction: number;
  pressure: number;
  orm: number;
  steamPct: number;
  alert: 'none' | 'warning' | 'critical';
}> = [
  // Step 0: 01:06 — power dropping for test
  { reactorState: 'low', power: 1600, rodPosition: 50, coreTemp: 280, steamFraction: 0.14, pressure: 65, orm: 28, steamPct: 14, alert: 'none' },
  // Step 1: 14:00 — ECCS disabled
  { reactorState: 'stable', power: 1600, rodPosition: 50, coreTemp: 280, steamFraction: 0.14, pressure: 65, orm: 26, steamPct: 14, alert: 'warning' },
  // Step 2: 23:10 — Night shift takes over
  { reactorState: 'stable', power: 1500, rodPosition: 55, coreTemp: 275, steamFraction: 0.13, pressure: 65, orm: 22, steamPct: 13, alert: 'warning' },
  // Step 3: 00:28 — power crashed, xenon poisoning
  { reactorState: 'xenon', power: 30, rodPosition: 95, coreTemp: 180, steamFraction: 0.02, pressure: 55, orm: 5, steamPct: 2, alert: 'critical' },
  // Step 4: 01:00 — rods withdrawn, only 8 left
  { reactorState: 'rod-pull', power: 200, rodPosition: 12, coreTemp: 240, steamFraction: 0.08, pressure: 60, orm: 8, steamPct: 8, alert: 'critical' },
  // Step 5: 01:23:04 — test starts, voids forming
  { reactorState: 'test', power: 200, rodPosition: 12, coreTemp: 270, steamFraction: 0.20, pressure: 70, orm: 8, steamPct: 20, alert: 'critical' },
  // Step 6: 01:23:40 — AZ-5 pressed
  { reactorState: 'az5', power: 530, rodPosition: 25, coreTemp: 380, steamFraction: 0.35, pressure: 85, orm: 6, steamPct: 35, alert: 'critical' },
  // Step 7: 01:23:43 — power surge 100×
  { reactorState: 'spike', power: 30000, rodPosition: 30, coreTemp: 2500, steamFraction: 0.85, pressure: 600, orm: 4, steamPct: 85, alert: 'critical' },
  // Step 8: 01:23:45 — first explosion (steam)
  { reactorState: 'explosion-1', power: 35000, rodPosition: 35, coreTemp: 2800, steamFraction: 0.95, pressure: 800, orm: 0, steamPct: 95, alert: 'critical' },
  // Step 9: 01:23:47 — second explosion (hydrogen) → destroyed
  { reactorState: 'destroyed', power: 0, rodPosition: 0, coreTemp: 1500, steamFraction: 1, pressure: 1, orm: 0, steamPct: 100, alert: 'critical' },
];

// Mood backgrounds per step
const MOOD_BG: Record<string, string> = {
  normal: 'linear-gradient(180deg, transparent 0%, rgba(20,30,55,0.4) 50%, transparent 100%)',
  caution: 'linear-gradient(180deg, transparent 0%, rgba(245,158,11,0.07) 50%, transparent 100%)',
  danger: 'linear-gradient(180deg, transparent 0%, rgba(239,68,68,0.1) 50%, transparent 100%)',
  critical: 'linear-gradient(180deg, transparent 0%, rgba(220,38,38,0.18) 40%, rgba(220,38,38,0.05) 100%)',
  explosion: 'linear-gradient(180deg, rgba(220,38,38,0.25) 0%, rgba(245,158,11,0.15) 100%)',
  apocalypse: 'radial-gradient(ellipse at center, rgba(220,38,38,0.35) 0%, rgba(0,0,0,0.85) 70%)',
};

export default function RBMK({ he, t }: { he: boolean; t: (h: string, e: string) => string }) {
  const [step, setStep] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);
  const [showLabels, setShowLabels] = useState(true);
  const [proMode, setProMode] = useState(false);
  const [openComp, setOpenComp] = useState<string | null>(null);
  const [interpolatedState, setInterpolatedState] = useState(STEP_STATES[0]);
  const transitionRef = useRef<any>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const cur = INSAG[step];
  const targetState = STEP_STATES[step];

  // Smooth interpolation between states (so values transition smoothly)
  useEffect(() => {
    const startState = { ...interpolatedState };
    const endState = targetState;
    const startTime = performance.now();
    const duration = 1500; // 1.5s transition

    if (transitionRef.current) cancelAnimationFrame(transitionRef.current);

    const tick = (now: number) => {
      const t = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic

      setInterpolatedState({
        reactorState: t > 0.5 ? endState.reactorState : startState.reactorState,
        power: startState.power + (endState.power - startState.power) * eased,
        rodPosition: startState.rodPosition + (endState.rodPosition - startState.rodPosition) * eased,
        coreTemp: startState.coreTemp + (endState.coreTemp - startState.coreTemp) * eased,
        steamFraction: startState.steamFraction + (endState.steamFraction - startState.steamFraction) * eased,
        pressure: startState.pressure + (endState.pressure - startState.pressure) * eased,
        orm: Math.round(startState.orm + (endState.orm - startState.orm) * eased),
        steamPct: startState.steamPct + (endState.steamPct - startState.steamPct) * eased,
        alert: endState.alert,
      });

      if (t < 1) transitionRef.current = requestAnimationFrame(tick);
    };
    transitionRef.current = requestAnimationFrame(tick);
    return () => { if (transitionRef.current) cancelAnimationFrame(transitionRef.current); };
  }, [step]);

  // Auto-play
  useEffect(() => {
    if (!autoPlay) return;
    const id = setTimeout(() => {
      if (step < INSAG.length - 1) setStep(step + 1);
      else setAutoPlay(false);
    }, step >= 7 ? 4500 : 6500); // explosions linger
    return () => clearTimeout(id);
  }, [autoPlay, step]);

  // Component info panel
  const cmpEntry = openComp ? RBMK_COMP.find((c) => c.id === openComp) : null;

  return (
    <section
      id="rbmk"
      ref={sectionRef}
      style={{
        padding: '60px 16px 30px',
        position: 'relative',
        background: MOOD_BG[cur.mood] || MOOD_BG.normal,
        transition: 'background 1.5s ease',
      }}
    >
      {/* Full-screen explosion flash for steps 7-9 */}
      {(cur.mood === 'explosion' || cur.mood === 'apocalypse') && (
        <div
          key={`flash-${step}`}
          style={{
            position: 'fixed', inset: 0,
            pointerEvents: 'none',
            zIndex: 100,
            background: step === 9
              ? `radial-gradient(circle at center, #ffffff 0%, ${C.danger}88 25%, transparent 70%)`
              : `radial-gradient(circle at center, ${C.amber}aa 0%, ${C.danger}55 30%, transparent 70%)`,
            animation: 'expFlashFull 1.6s ease-out forwards',
          }}
        />
      )}

      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        {/* Section header */}
        <div style={{ textAlign: 'center', marginBottom: 28, position: 'relative' }}>
          <div className="section-number" style={{ top: '-20px', insetInlineStart: '5%' }}>03</div>
          <div className="section-kicker">[ {t('סעיף שלישי · אנטומיית הכשל', 'PART THREE · ANATOMY OF FAILURE')} ]</div>
          <h2 className="section-title">{t('כור RBMK והאסון', 'The RBMK & The Disaster')}</h2>
          <p className="section-subtitle">{t('סימולטור אינטראקטיבי · 10 שלבי INSAG-7', 'Interactive simulator · 10 INSAG-7 steps')}</p>
          <div className="gr" style={{ margin: '0 auto' }} />
        </div>

        {/* Control Room HUD */}
        <div style={{ marginBottom: 16 }}>
          <ControlRoomHUD
            he={he} t={t}
            power={interpolatedState.power}
            coreTemp={interpolatedState.coreTemp}
            pressure={interpolatedState.pressure}
            orm={interpolatedState.orm}
            steamPct={interpolatedState.steamPct}
            time={cur.time}
            alert={interpolatedState.alert}
          />
        </div>

        {/* Reactor 3D view */}
        <div
          key={`reactor-${step}`}
          style={{
            background: 'linear-gradient(180deg, rgba(0,0,0,0.5), rgba(0,0,0,0.7))',
            border: `1.5px solid ${
              cur.mood === 'apocalypse' ? C.danger
              : cur.mood === 'explosion' ? C.amber
              : cur.mood === 'critical' ? C.danger + '77'
              : C.gold + '33'
            }`,
            borderRadius: 12,
            padding: 16,
            marginBottom: 16,
            animation:
              step === 8 ? 'screenShake 0.6s ease-out 1' :
              step === 9 ? 'screenShake 1.2s ease-out 1' :
              step === 7 ? 'reactorVibrate 0.15s infinite' :
              cur.mood === 'critical' ? 'reactorVibrate 0.4s infinite' :
              'none',
            boxShadow:
              cur.mood === 'apocalypse' ? `0 0 60px ${C.danger}88, inset 0 0 30px ${C.danger}33` :
              cur.mood === 'critical' ? `0 0 30px ${C.danger}55` :
              'none',
            transition: 'box-shadow 0.5s, border-color 0.5s',
          }}
        >
          <Reactor3D
            he={he} t={t}
            power={interpolatedState.power}
            rodPosition={interpolatedState.rodPosition}
            coreTemp={interpolatedState.coreTemp}
            steamFraction={interpolatedState.steamFraction}
            state={interpolatedState.reactorState}
            showLabels={showLabels}
            showFlow={true}
          />
        </div>

        {/* Step controls */}
        <div style={{
          display: 'flex',
          gap: 8,
          justifyContent: 'center',
          alignItems: 'center',
          flexWrap: 'wrap',
          marginBottom: 16,
        }}>
          <button
            onClick={() => { setStep(Math.max(0, step - 1)); setAutoPlay(false); }}
            disabled={step === 0}
            className="btn-gold"
            style={{ opacity: step === 0 ? 0.4 : 1 }}
          >
            ← {t('קודם', 'Prev')}
          </button>

          {/* Step pills */}
          <div style={{ display: 'flex', gap: 4, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
            {INSAG.map((s, i) => (
              <button
                key={i}
                onClick={() => { setStep(i); setAutoPlay(false); }}
                title={t(s.he, s.en)}
                style={{
                  width: i === step ? 38 : 14,
                  height: 14,
                  borderRadius: 7,
                  background: i === step
                    ? (s.mood === 'apocalypse' ? C.danger : s.mood === 'explosion' ? C.amber : s.mood === 'critical' ? C.danger : s.mood === 'danger' ? C.amber : C.gold)
                    : 'rgba(255,255,255,0.18)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  boxShadow: i === step ? `0 0 10px ${C.gold}99` : 'none',
                }}
              />
            ))}
          </div>

          <button
            onClick={() => { setStep(Math.min(INSAG.length - 1, step + 1)); setAutoPlay(false); }}
            disabled={step === INSAG.length - 1}
            className="btn-gold"
            style={{ opacity: step === INSAG.length - 1 ? 0.4 : 1 }}
          >
            {t('הבא', 'Next')} →
          </button>

          <button
            onClick={() => { setAutoPlay(!autoPlay); }}
            className="btn-gold"
            style={{
              background: autoPlay ? `${C.danger}33` : undefined,
              color: autoPlay ? '#fff' : undefined,
              borderColor: autoPlay ? C.danger : undefined,
            }}
          >
            {autoPlay ? '⏸ ' + t('עצור', 'PAUSE') : '▶ ' + t('הפעל אוטומטי', 'AUTO-PLAY')}
          </button>

          <button onClick={() => setShowLabels(!showLabels)} className="btn-gold">
            {showLabels ? '◉ ' : '○ '}{t('תוויות', 'Labels')}
          </button>

          <button
            onClick={() => setProMode(!proMode)}
            className="btn-gold"
            style={{ background: proMode ? `${C.gold}33` : undefined }}
          >
            {proMode ? t('מצב פשוט', 'Simple') : t('מצב מקצועי', 'Pro mode')}
          </button>
        </div>

        {/* Step description card */}
        <div
          key={`desc-${step}`}
          style={{
            padding: '20px 24px',
            background: cur.mood === 'apocalypse'
              ? `linear-gradient(135deg, ${C.danger}25, rgba(0,0,0,0.7))`
              : cur.mood === 'explosion'
              ? `linear-gradient(135deg, ${C.amber}25, rgba(0,0,0,0.7))`
              : cur.mood === 'critical'
              ? `linear-gradient(135deg, ${C.danger}15, rgba(0,0,0,0.6))`
              : cur.mood === 'danger'
              ? `linear-gradient(135deg, ${C.amber}15, rgba(0,0,0,0.6))`
              : `linear-gradient(135deg, ${C.gold}10, rgba(0,0,0,0.5))`,
            border: `1.5px solid ${
              cur.mood === 'apocalypse' ? C.danger
              : cur.mood === 'explosion' ? C.amber
              : cur.mood === 'critical' ? C.danger
              : cur.mood === 'danger' ? C.amber
              : C.gold
            }77`,
            borderInlineStart: `5px solid ${
              cur.mood === 'apocalypse' ? C.danger
              : cur.mood === 'explosion' ? C.amber
              : cur.mood === 'critical' ? C.danger
              : cur.mood === 'danger' ? C.amber
              : C.gold
            }`,
            borderRadius: 12,
            marginBottom: 24,
            animation: 'fadeIn 0.6s ease-out',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10, flexWrap: 'wrap', gap: 10 }}>
            <h3 style={{ fontSize: 22, fontWeight: 900, color: '#fff', fontFamily: "'Playfair Display', serif", lineHeight: 1.2 }}>
              {t(cur.he, cur.en)}
            </h3>
            <div style={{
              padding: '4px 12px',
              background: 'rgba(0,0,0,0.5)',
              border: `1px solid ${C.gold}55`,
              borderRadius: 6,
              fontSize: 14,
              color: C.gold,
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 800,
              letterSpacing: '0.1em',
            }}>
              {t(`שלב ${step + 1}/${INSAG.length}`, `Step ${step + 1}/${INSAG.length}`)} · {cur.time}
            </div>
          </div>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.92)', lineHeight: 1.85 }}>
            {proMode ? t(cur.pro_he, cur.pro_en) : t(cur.simple_he, cur.simple_en)}
          </p>
        </div>

        {/* RBMK Components — bottom info section */}
        <div style={{ marginTop: 32 }}>
          <h3 style={{
            fontSize: 22,
            fontWeight: 800,
            color: C.gold,
            fontFamily: "'Playfair Display', serif",
            marginBottom: 14,
            textAlign: 'center',
          }}>
            {t('הרכיבים העיקריים של RBMK-1000', 'Main RBMK-1000 Components')}
          </h3>

          {/* Group cards in rows; expansion appears within the row of the clicked card */}
          {(() => {
            // Calculate how many cards per row based on viewport breakpoints
            // We use grid auto-fit, but for the inline expansion we render row-by-row
            // The trick: render all cards, but inject a full-width panel after the row containing the open card
            // We use CSS grid + gridColumn span trick to achieve in-row expansion

            return (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: 10,
              }}>
                {RBMK_COMP.map((c, idx) => {
                  const isOpen = openComp === c.id;
                  return (
                    <div key={c.id} style={{ display: 'contents' }}>
                      <button
                        onClick={() => setOpenComp(isOpen ? null : c.id)}
                        style={{
                          padding: '14px 16px',
                          background: isOpen ? `${C.gold}25` : 'rgba(0,0,0,0.4)',
                          border: `1.5px solid ${isOpen ? C.gold : C.gold + '33'}`,
                          borderRadius: 10,
                          color: '#fff',
                          cursor: 'pointer',
                          textAlign: he ? 'right' : 'left',
                          transition: 'all 0.25s',
                          fontSize: 15,
                          fontWeight: 700,
                          fontFamily: "'JetBrains Mono', monospace",
                          boxShadow: isOpen ? `0 0 16px ${C.gold}55` : 'none',
                          position: 'relative',
                        }}
                      >
                        <span style={{ marginInlineEnd: 6 }}>{isOpen ? '▼' : he ? '◀' : '▶'}</span>
                        {t(c.he, c.en)}
                      </button>

                      {/* Inline expansion panel — full width below this card's row */}
                      {isOpen && (
                        <div
                          style={{
                            gridColumn: '1 / -1',
                            padding: '22px 26px',
                            background: 'linear-gradient(135deg, rgba(200,164,78,0.1), rgba(0,0,0,0.7))',
                            border: `1.5px solid ${C.gold}77`,
                            borderInlineStart: `5px solid ${C.gold}`,
                            borderRadius: 12,
                            animation: 'expandPanel 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                            boxShadow: `0 8px 24px rgba(0,0,0,0.5), 0 0 32px ${C.gold}22`,
                            marginTop: 4, marginBottom: 4,
                          }}
                        >
                          <h4 style={{
                            fontSize: 22,
                            fontWeight: 900,
                            color: C.gold,
                            fontFamily: "'Playfair Display', serif",
                            marginBottom: 12,
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            gap: 12, flexWrap: 'wrap',
                          }}>
                            <span>{t(c.he, c.en)}</span>
                            <button
                              onClick={() => setOpenComp(null)}
                              aria-label={t('סגור', 'Close')}
                              style={{
                                width: 32, height: 32,
                                borderRadius: '50%',
                                background: 'rgba(0,0,0,0.5)',
                                border: `1px solid ${C.gold}55`,
                                color: C.gL,
                                cursor: 'pointer',
                                fontSize: 16,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                              }}
                            >
                              ✕
                            </button>
                          </h4>
                          <p style={{
                            fontSize: 17,
                            color: 'rgba(255,255,255,0.95)',
                            lineHeight: 1.85,
                          }}>
                            {proMode ? t((c as any).pro_he, (c as any).pro_en) : t(c.simple_he, c.simple_en)}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })()}
        </div>
      </div>

      <style jsx>{`
        @keyframes expFlashFull {
          0% { opacity: 0; }
          15% { opacity: 1; }
          50% { opacity: 0.4; }
          100% { opacity: 0; }
        }
      `}</style>
    </section>
  );
}
