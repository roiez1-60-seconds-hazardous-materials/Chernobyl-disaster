'use client';
import { useState, useEffect } from 'react';
import { C, INSAG, RBMK_COMP } from '@/lib/data';

const MOOD_BG: Record<string, string> = {
  normal: 'linear-gradient(180deg, #0a0e1a 0%, #162040 100%)',
  caution: 'linear-gradient(180deg, #0a0e1a 0%, #2a1f10 100%)',
  danger: 'linear-gradient(180deg, #1a0a0a 0%, #3d1414 100%)',
  critical: 'linear-gradient(180deg, #2a0808 0%, #5a1010 100%)',
  explosion: 'linear-gradient(180deg, #4a0a0a 0%, #7a1414 100%)',
  apocalypse: 'linear-gradient(180deg, #2a0414 0%, #4a0a14 100%)',
};

export default function RBMK({ he, t }: { he: boolean; t: (h: string, e: string) => string }) {
  const [step, setStep] = useState(0);
  const [auto, setAuto] = useState(false);
  const [pro, setPro] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    if (!auto) return;
    const id = setInterval(() => setStep((s) => (s + 1) % INSAG.length), 4500);
    return () => clearInterval(id);
  }, [auto]);

  const cur = INSAG[step];
  const power = step <= 2 ? 1600 : step === 3 ? 30 : step === 4 ? 200 : step === 5 ? 200 : step === 6 ? 530 : step === 7 ? 30000 : 30000;
  const rods = step <= 1 ? 211 : step === 2 ? 100 : step === 3 ? 60 : step === 4 ? 8 : step === 5 ? 8 : step === 6 ? 211 : 0;
  const voids = step <= 1 ? 14 : step === 2 ? 18 : step === 3 ? 5 : step === 4 ? 25 : step === 5 ? 60 : step === 6 ? 90 : 100;

  const sel = selected ? RBMK_COMP.find((c) => c.id === selected) : null;

  return (
    <section id="rbmk" style={{ padding: '60px 16px 30px', position: 'relative', background: MOOD_BG[cur.mood], transition: 'background 1.5s ease' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 28, position: 'relative' }}>
          <div className="section-number" style={{ top: '-20px', insetInlineEnd: '5%' }}>03</div>
          <div className="section-kicker">[ {t('סעיף שלישי · RBMK', 'PART THREE · RBMK')} ]</div>
          <h2 className="section-title">{t('RBMK והכשלים הבטיחותיים', 'RBMK & Safety Failures')}</h2>
          <p className="section-subtitle">{t('סימולציה אינטראקטיבית של 10 שלבי INSAG-7', 'Interactive simulation of INSAG-7 ten steps')}</p>
          <div className="gr" style={{ margin: '0 auto' }} />
        </div>

        {/* Controls */}
        <div className="card" style={{ padding: 12, marginBottom: 16, display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button onClick={() => setAuto((a) => !a)} className="btn-gold" style={{ background: auto ? `${C.danger}33` : undefined, color: auto ? '#fff' : undefined, borderColor: auto ? C.danger : undefined }}>
              {auto ? '⏸ ' + t('עצור', 'PAUSE') : '▶ ' + t('הפעל', 'PLAY')}
            </button>
            <button onClick={() => setPro((p) => !p)} className="btn-gold" style={{ background: pro ? `${C.gold}45` : undefined, color: pro ? '#fff' : undefined }}>
              {pro ? t('🎓 מקצועי', '🎓 PRO') : t('👨‍🏫 פשוט', '👨‍🏫 SIMPLE')}
            </button>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: C.gold }}>
            <span>STEP {step + 1}/{INSAG.length}</span>
            <span style={{ color: 'rgba(255,255,255,0.4)' }}>·</span>
            <span style={{ color: '#fff' }}>{cur.time}</span>
          </div>
        </div>

        {/* Simulator */}
        <div className="card" style={{ padding: 'clamp(16px, 3vw, 28px)', marginBottom: 18 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            {/* SVG Reactor */}
            <ReactorSVG step={step} />

            {/* Stats panel */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <StatCard label={t('הספק', 'POWER')} value={power} unit="MWt" max={32000} color={power > 5000 ? C.danger : power > 1500 ? C.amber : C.green} dangerOn={power > 5000} />
              <StatCard label={t('מוטות בקרה בליבה', 'CONTROL RODS IN CORE')} value={rods} unit={`/ 211`} max={211} color={rods < 30 ? C.danger : rods < 100 ? C.amber : C.green} dangerOn={rods < 30} />
              <StatCard label={t('בועות קיטור', 'STEAM VOIDS')} value={voids} unit="%" max={100} color={voids > 60 ? C.danger : voids > 25 ? C.amber : C.blue} dangerOn={voids > 60} />

              {/* Mood indicator */}
              <div style={{
                padding: '10px 14px',
                borderRadius: 10,
                border: `1px solid ${cur.mood === 'apocalypse' ? C.danger : cur.mood === 'critical' ? C.amber : 'rgba(255,255,255,0.15)'}`,
                background: 'rgba(0,0,0,0.4)',
                textAlign: 'center',
                animation: cur.mood === 'apocalypse' || cur.mood === 'explosion' ? 'pulseAlert 1.5s infinite' : 'none',
                color: cur.mood === 'apocalypse' || cur.mood === 'explosion' ? C.danger : C.gold,
              }}>
                <div style={{ fontSize: 9, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.2em', opacity: 0.7, marginBottom: 4 }}>STATUS</div>
                <div style={{ fontSize: 13, fontWeight: 800, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  {cur.mood}
                </div>
              </div>
            </div>
          </div>

          {/* Step description */}
          <div className="fade-in" key={step} style={{
            marginTop: 18, padding: '16px 20px',
            background: 'rgba(0,0,0,0.5)',
            borderInlineStart: `4px solid ${cur.mood === 'apocalypse' ? C.danger : cur.mood === 'critical' ? C.amber : C.gold}`,
            borderRadius: 8,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, gap: 8, flexWrap: 'wrap' }}>
              <div style={{ fontSize: 18, fontWeight: 900, color: '#fff', fontFamily: "'Playfair Display', serif" }}>
                {t(cur.he, cur.en)}
              </div>
              <div style={{ fontSize: 11, color: C.gold, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>
                {cur.time} · 26.04.1986
              </div>
            </div>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.9)', lineHeight: 1.85 }}>
              {pro ? t(cur.pro_he, cur.pro_en) : t(cur.simple_he, cur.simple_en)}
            </p>
          </div>

          {/* Scrubber */}
          <div style={{ marginTop: 14 }}>
            <input
              type="range"
              min={0}
              max={INSAG.length - 1}
              value={step}
              onChange={(e) => { setStep(Number(e.target.value)); setAuto(false); }}
              style={{ width: '100%', accentColor: C.gold }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
              {INSAG.map((s, i) => (
                <button key={i} onClick={() => { setStep(i); setAuto(false); }} style={{
                  fontSize: 9, padding: '3px 6px',
                  background: i === step ? C.gold + '44' : 'transparent',
                  color: i === step ? C.gold : 'rgba(255,255,255,0.4)',
                  border: 'none', borderRadius: 3, cursor: 'pointer',
                  fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
                }}>
                  {s.time.slice(-5)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Components grid */}
        <div className="card" style={{ padding: 'clamp(16px, 3vw, 28px)' }}>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: C.gold, fontFamily: "'Playfair Display', serif", marginBottom: 14, textAlign: 'center' }}>
            🔧 {t('12 רכיבי הכור — לחץ ללימוד', '12 Reactor Components — Click to Learn')}
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 8, marginBottom: 14 }}>
            {RBMK_COMP.map((c) => (
              <button key={c.id} onClick={() => setSelected(selected === c.id ? null : c.id)} style={{
                padding: '10px 12px',
                background: selected === c.id ? `${C.gold}33` : 'rgba(0,0,0,0.4)',
                border: `1px solid ${selected === c.id ? C.gold : 'rgba(200,164,78,0.2)'}`,
                borderRadius: 8, cursor: 'pointer', textAlign: he ? 'right' : 'left',
                transition: 'all 0.25s', color: selected === c.id ? '#fff' : 'rgba(255,255,255,0.85)',
              }}>
                <div style={{ fontSize: 12, fontWeight: 700, fontFamily: "'Heebo', sans-serif" }}>
                  {t(c.he, c.en)}
                </div>
              </button>
            ))}
          </div>

          {sel && (
            <div className="fade-in" style={{ padding: '14px 18px', background: 'rgba(0,0,0,0.5)', border: `1px solid ${C.gold}55`, borderRadius: 10, borderInlineStart: `4px solid ${C.gold}` }}>
              <h4 style={{ fontSize: 16, fontWeight: 800, color: C.gold, fontFamily: "'Playfair Display', serif", marginBottom: 8 }}>
                {t(sel.he, sel.en)}
              </h4>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.9)', lineHeight: 1.85, marginBottom: 8 }}>
                {pro ? t(sel.pro_he, sel.pro_en) : t(sel.simple_he, sel.simple_en)}
              </p>
              <div style={{ display: 'flex', gap: 6, fontSize: 9, color: 'rgba(255,255,255,0.5)', fontFamily: "'JetBrains Mono', monospace" }}>
                <span>{t('מצב הצגה', 'Mode')}: {pro ? t('מקצועי 🎓', 'PRO 🎓') : t('פשוט 👨‍🏫', 'SIMPLE 👨‍🏫')}</span>
              </div>
            </div>
          )}
          {!sel && (
            <div style={{ padding: 14, textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: 12, fontFamily: "'JetBrains Mono', monospace" }}>
              ⚙ {t('בחר רכיב למידע מפורט', 'Select a component for detailed info')}
            </div>
          )}
        </div>

        {/* The 4 fatal flaws */}
        <div className="card-light" style={{ padding: 'clamp(16px, 3vw, 24px)', marginTop: 18 }}>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: C.danger, fontFamily: "'Playfair Display', serif", marginBottom: 14, textAlign: 'center' }}>
            ⚠ {t('4 הכשלים הקטלניים של RBMK', '4 Fatal RBMK Failures')}
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 10 }}>
            {[
              { he: 'מקדם החללות חיובי', en: 'Positive Void Coefficient', desc_he: '+4.7β — בועות קיטור גורמות לעלייה בהספק. בכורים מערביים (PWR/BWR) מים = מאט+קירור: כשמים מתאדים, התגובה יורדת = בטיחות מובנית. ב-RBMK: גרפיט מאט, מים רק קירור — הפוך בדיוק.', desc_en: '+4.7β — steam voids cause power rise. In Western reactors (PWR/BWR) water = moderator+coolant: vaporized water = reaction drops = built-in safety. In RBMK: graphite moderator, water only coolant — exact opposite.' },
              { he: 'קצה גרפיט במוטות AZ-5', en: 'Graphite Tips on AZ-5 Rods', desc_he: 'הקצה הגרפיטי דחף מים החוצה לפני הבורון — גרם לתוספת תגובתיות חיובית בעצירת חירום במקום לעצור.', desc_en: 'Graphite tip displaced water before boron — caused positive reactivity insertion during emergency scram instead of stopping.' },
              { he: 'אין מבנה הכלה', en: 'No Containment', desc_he: 'בניגוד לכורים מערביים, אין כיפת בטון מסביב לכור. בפיצוץ — הקרינה התפזרה ישר לאוויר ללא מסנן.', desc_en: 'Unlike Western reactors, no concrete dome around reactor. In explosion — radiation dispersed directly to air without filter.' },
              { he: 'תרבות בטיחות', en: 'Safety Culture', desc_he: 'הסתרת מידע (פגם איגנלינה לא הופץ), 3 ניסויי טורבינה קודמים שנכשלו, לחץ פוליטי על מהנדסים, הפרת רישיון תפעולי, חוסר הכשרה — כל אלה מולל הפיזיקה.', desc_en: 'Information hiding (Ignalina flaw not distributed), 3 previous failed turbine tests, political pressure on engineers, license violations, lack of training — all compounded physics failure.' },
            ].map((f, i) => (
              <div key={i} className="hover-lift" style={{ padding: '12px 14px', background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10 }}>
                <div style={{ fontSize: 18, marginBottom: 4 }}>{['🔥', '🛑', '🏗', '👥'][i]}</div>
                <div style={{ fontSize: 13, fontWeight: 800, color: C.danger, marginBottom: 4 }}>{i + 1}. {t(f.he, f.en)}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.85)', lineHeight: 1.6 }}>{t(f.desc_he, f.desc_en)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// Reactor SVG
function ReactorSVG({ step }: { step: number }) {
  const power = step <= 2 ? 0.5 : step === 3 ? 0.05 : step === 4 ? 0.15 : step === 5 ? 0.15 : step === 6 ? 0.3 : step === 7 ? 0.95 : 1;
  const exploded = step >= 8;
  const heat = step <= 2 ? '#fbbf24' : step <= 5 ? '#f97316' : step <= 6 ? '#ef4444' : '#dc2626';

  return (
    <div style={{ position: 'relative', width: '100%', aspectRatio: '1', maxWidth: 380, margin: '0 auto' }}>
      <svg viewBox="0 0 280 280" style={{ width: '100%', height: '100%' }}>
        <defs>
          <radialGradient id="rbmkCoreGrad">
            <stop offset="0%" stopColor="#fde047" />
            <stop offset="50%" stopColor={heat} />
            <stop offset="100%" stopColor="#7f1d1d" />
          </radialGradient>
          <linearGradient id="rodGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#94a3b8" />
            <stop offset="100%" stopColor="#475569" />
          </linearGradient>
        </defs>

        {/* Outer pressure vessel */}
        <rect x="40" y="40" width="200" height="200" rx="14" fill="rgba(15,23,42,0.6)" stroke={exploded ? C.danger : C.gold} strokeWidth="2" />
        <text x="140" y="32" fill={C.gL} fontSize="10" fontFamily="JetBrains Mono" textAnchor="middle" fontWeight="700">RBMK-1000</text>

        {/* Core */}
        <circle cx="140" cy="140" r={70 + power * 12} fill="url(#rbmkCoreGrad)" opacity={power}
                style={{ animation: step >= 6 ? 'pulseFire 0.5s infinite' : 'pulseFire 2s infinite' }} />

        {/* Control rods */}
        {[...Array(11)].map((_, i) => {
          const x = 60 + i * 16;
          const inserted = step <= 1 ? 1 : step === 2 ? 0.5 : step === 3 ? 0.3 : step === 4 ? 0.04 : step === 5 ? 0.04 : step === 6 ? 0.5 : 0;
          return (
            <g key={i}>
              <rect x={x - 2} y={50} width="4" height={30 + inserted * 110} fill="url(#rodGrad)" opacity={exploded ? 0.3 : 1} />
              {/* Graphite tip */}
              <rect x={x - 2} y={30 + inserted * 110 + 50} width="4" height="10" fill="#525252" opacity={exploded ? 0.3 : 1} />
            </g>
          );
        })}

        {/* Fuel pellet glow */}
        {[...Array(8)].map((_, i) => {
          const angle = (i / 8) * Math.PI * 2;
          const r = 50;
          return (
            <circle key={i}
              cx={140 + Math.cos(angle) * r}
              cy={140 + Math.sin(angle) * r}
              r="3" fill="#fde047" opacity={power} style={{ animation: 'fuelPulse 1.5s infinite', animationDelay: `${i * 0.1}s` }} />
          );
        })}

        {/* Steam bubbles */}
        {step >= 5 && [...Array(6)].map((_, i) => (
          <circle key={i} cx={120 + i * 10} cy={200} r="3" fill="rgba(255,255,255,0.7)" style={{ animation: `bubbleUp ${1.5 + i * 0.2}s infinite ${i * 0.15}s` }} />
        ))}

        {/* Explosion effect */}
        {exploded && (
          <>
            <circle cx="140" cy="140" r="100" fill="none" stroke={C.danger} strokeWidth="3" opacity="0.7" style={{ animation: 'ringPulse 1.5s infinite' }} />
            <circle cx="140" cy="140" r="60" fill={C.amber} opacity="0.4" style={{ animation: 'expFlash 1.5s infinite' }} />
            {/* Plume */}
            {[...Array(12)].map((_, i) => {
              const angle = (i / 12) * Math.PI * 2;
              return (
                <circle key={i}
                  cx={140 + Math.cos(angle) * 30}
                  cy={140 + Math.sin(angle) * 30}
                  r={4 + Math.random() * 6}
                  fill={i % 2 === 0 ? C.danger : C.amber}
                  opacity="0.7"
                  style={{ animation: `plumeRise ${2 + Math.random()}s infinite ${i * 0.1}s` }}
                />
              );
            })}
          </>
        )}

        {/* AZ-5 Button */}
        <g transform="translate(245, 50)" style={{ animation: step === 6 ? 'pulseAlert 0.8s infinite' : 'none', color: C.danger }}>
          <circle cx="0" cy="0" r="14" fill={step >= 6 ? C.danger : 'rgba(60,60,60,0.6)'} stroke="#000" strokeWidth="2" />
          <text x="0" y="3" fill="#fff" fontSize="9" fontFamily="JetBrains Mono" textAnchor="middle" fontWeight="900">AZ-5</text>
        </g>
      </svg>
    </div>
  );
}

// Stat card with bar
function StatCard({ label, value, unit, max, color, dangerOn }: { label: string; value: number; unit: string; max: number; color: string; dangerOn?: boolean }) {
  return (
    <div style={{
      padding: '10px 14px',
      borderRadius: 10,
      background: 'rgba(0,0,0,0.45)',
      border: `1px solid ${dangerOn ? color : 'rgba(255,255,255,0.1)'}`,
      animation: dangerOn ? 'pulseAlert 1.8s infinite' : 'none',
      transition: 'all 0.4s',
      color,
    }}>
      <div style={{ fontSize: 9, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.15em', color: 'rgba(255,255,255,0.6)', marginBottom: 4 }}>
        {label}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 6 }}>
        <span style={{ fontSize: 24, fontWeight: 900, color, fontFamily: "'Playfair Display', serif", lineHeight: 1 }}>
          {value.toLocaleString()}
        </span>
        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', fontFamily: "'JetBrains Mono', monospace" }}>
          {unit}
        </span>
      </div>
      <div style={{ height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
        <div style={{
          width: `${Math.min((value / max) * 100, 100)}%`, height: '100%',
          background: color,
          transition: 'width 0.6s ease, background 0.4s',
          boxShadow: dangerOn ? `0 0 12px ${color}` : 'none',
        }} />
      </div>
    </div>
  );
}
