'use client';
import { useState, useEffect, useRef } from 'react';
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
  const [openComp, setOpenComp] = useState<string | null>(null);

  useEffect(() => {
    if (!auto) return;
    const id = setInterval(() => setStep((s) => (s + 1) % INSAG.length), 5500);
    return () => clearInterval(id);
  }, [auto]);

  const cur = INSAG[step];
  const power = step <= 2 ? 1600 : step === 3 ? 30 : step === 4 ? 200 : step === 5 ? 200 : step === 6 ? 530 : step === 7 ? 30000 : 30000;
  const rods = step <= 1 ? 211 : step === 2 ? 100 : step === 3 ? 60 : step === 4 ? 8 : step === 5 ? 8 : step === 6 ? 211 : 0;
  const voids = step <= 1 ? 14 : step === 2 ? 18 : step === 3 ? 5 : step === 4 ? 25 : step === 5 ? 60 : step === 6 ? 90 : 100;

  const isExplosion = cur.mood === 'explosion' || cur.mood === 'apocalypse';
  const accentColor = cur.mood === 'apocalypse' ? C.danger : cur.mood === 'critical' ? C.amber : cur.mood === 'danger' ? '#f97316' : cur.mood === 'caution' ? C.amber : C.gold;

  return (
    <section id="rbmk" style={{ padding: '60px 16px 30px', position: 'relative', background: MOOD_BG[cur.mood], transition: 'background 1.5s ease' }}>
      {/* Full-screen explosion flash for steps 8 (steam blast) and 9 (final) */}
      {cur.mood === 'apocalypse' && (
        <div
          key={`flash-${step}`}
          style={{
            position: 'fixed', inset: 0,
            pointerEvents: 'none',
            zIndex: 100,
            background: step === 8
              ? `radial-gradient(circle at center, ${C.amber}aa 0%, ${C.danger}55 30%, transparent 70%)`
              : `radial-gradient(circle at center, #ffffff 0%, ${C.danger}88 25%, transparent 70%)`,
            animation: 'explosionFlash 1.4s ease-out forwards',
          }}
        />
      )}
      <style jsx>{`
        @keyframes explosionFlash {
          0% { opacity: 0; }
          15% { opacity: 1; }
          40% { opacity: 0.6; }
          100% { opacity: 0; }
        }
      `}</style>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 22, position: 'relative' }}>
          <div className="section-number" style={{ top: '-20px', insetInlineEnd: '5%' }}>03</div>
          <div className="section-kicker">[ {t('סעיף שלישי · RBMK', 'PART THREE · RBMK')} ]</div>
          <h2 className="section-title">{t('RBMK והכשלים הבטיחותיים', 'RBMK & Safety Failures')}</h2>
          <p className="section-subtitle">{t('סימולציה קולנועית של 10 דקות לפני הפיצוץ', 'Cinematic simulation of 10 minutes before explosion')}</p>
          <div className="gr" style={{ margin: '0 auto' }} />
        </div>

        {/* CINEMATIC STAGE — everything in one frame */}
        <div style={{
          background: 'linear-gradient(180deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.7) 100%)',
          border: `2px solid ${accentColor}66`,
          borderRadius: 16,
          overflow: 'hidden',
          boxShadow: isExplosion ? `0 0 50px ${C.danger}66, inset 0 0 60px ${C.danger}22` : `0 0 30px ${C.gold}22`,
          transition: 'all 0.8s ease',
          marginBottom: 22,
          animation: isExplosion ? 'shake 0.4s infinite' : 'none',
        }}>
          {/* Top bar: timestamp + status */}
          <div style={{
            padding: '10px 18px',
            background: 'rgba(0,0,0,0.6)',
            borderBottom: `1px solid ${accentColor}55`,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            flexWrap: 'wrap', gap: 8,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: accentColor, animation: 'pulseAlert 1.2s infinite', boxShadow: `0 0 10px ${accentColor}` }} />
              <span style={{ fontSize: 16, fontWeight: 800, color: '#fff', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em' }}>
                {cur.time}
              </span>
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', fontFamily: "'JetBrains Mono', monospace" }}>
                26·04·1986
              </span>
            </div>
            <div style={{
              padding: '3px 10px',
              background: `${accentColor}25`,
              border: `1px solid ${accentColor}99`,
              borderRadius: 4,
              fontSize: 13,
              fontWeight: 800,
              color: accentColor,
              fontFamily: "'JetBrains Mono', monospace",
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              animation: isExplosion ? 'pulseAlert 0.8s infinite' : 'none',
            }}>
              {cur.mood}
            </div>
          </div>

          {/* Cinematic visual area */}
          <div style={{ padding: 'clamp(14px, 3vw, 24px)', position: 'relative' }}>
            <CinematicReactor step={step} he={he} t={t} />

            {/* Live stats overlay */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 14 }}>
              <MiniStat label={t('הספק', 'POWER')} value={power.toLocaleString()} unit="MWt" max={32000} cur={power} color={power > 5000 ? C.danger : power > 1500 ? C.amber : C.green} alert={power > 5000} />
              <MiniStat label={t('מוטות', 'RODS')} value={rods.toString()} unit="/211" max={211} cur={rods} color={rods < 30 ? C.danger : rods < 100 ? C.amber : C.green} alert={rods < 30} />
              <MiniStat label={t('בועות', 'VOIDS')} value={voids.toString()} unit="%" max={100} cur={voids} color={voids > 60 ? C.danger : voids > 25 ? C.amber : C.blue} alert={voids > 60} />
            </div>
          </div>

          {/* Description WITHIN the frame */}
          <div style={{
            padding: '14px 18px',
            background: `linear-gradient(180deg, rgba(0,0,0,0.4), rgba(0,0,0,0.7))`,
            borderTop: `1px solid ${accentColor}33`,
            borderInlineStart: `5px solid ${accentColor}`,
          }}>
            <div className="fade-in" key={step}>
              <h3 style={{ fontSize: 20, fontWeight: 900, color: '#fff', fontFamily: "'Playfair Display', serif", marginBottom: 6, lineHeight: 1.3 }}>
                {t(cur.he, cur.en)}
              </h3>
              <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.92)', lineHeight: 1.85 }}>
                {pro ? t(cur.pro_he, cur.pro_en) : t(cur.simple_he, cur.simple_en)}
              </p>
            </div>
          </div>

          {/* Step navigator + controls */}
          <div style={{ padding: '12px 18px', background: 'rgba(0,0,0,0.55)', borderTop: `1px solid ${C.gold}22` }}>
            {/* Step dots */}
            <div style={{ display: 'flex', gap: 4, marginBottom: 10, overflowX: 'auto', paddingBottom: 4 }}>
              {INSAG.map((s, i) => (
                <button key={i} onClick={() => { setStep(i); setAuto(false); }} style={{
                  flex: '1 1 auto', minWidth: 28,
                  padding: '6px 4px',
                  background: i === step ? `${accentColor}45` : 'rgba(255,255,255,0.04)',
                  color: i === step ? '#fff' : 'rgba(255,255,255,0.5)',
                  border: i === step ? `1px solid ${accentColor}` : '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 5,
                  cursor: 'pointer',
                  fontSize: 12, fontWeight: 700,
                  fontFamily: "'JetBrains Mono', monospace",
                  transition: 'all 0.25s',
                  boxShadow: i === step ? `0 0 10px ${accentColor}88` : 'none',
                }}>
                  {i + 1}
                </button>
              ))}
            </div>

            {/* Controls row */}
            <div style={{ display: 'flex', gap: 6, justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', gap: 6 }}>
                <button onClick={() => { setStep(Math.max(0, step - 1)); setAuto(false); }} disabled={step === 0} className="btn-gold" style={{ padding: '6px 12px', opacity: step === 0 ? 0.4 : 1 }}>
                  {he ? '→' : '←'} {t('הקודם', 'PREV')}
                </button>
                <button onClick={() => setAuto((a) => !a)} className="btn-gold" style={{ background: auto ? `${C.danger}33` : undefined, color: auto ? '#fff' : undefined, borderColor: auto ? C.danger : undefined }}>
                  {auto ? '⏸' : '▶'} {auto ? t('עצור', 'PAUSE') : t('הפעל', 'PLAY')}
                </button>
                <button onClick={() => { setStep(Math.min(INSAG.length - 1, step + 1)); setAuto(false); }} disabled={step === INSAG.length - 1} className="btn-gold" style={{ padding: '6px 12px', opacity: step === INSAG.length - 1 ? 0.4 : 1 }}>
                  {t('הבא', 'NEXT')} {he ? '←' : '→'}
                </button>
              </div>
              <button onClick={() => setPro((p) => !p)} className="btn-gold" style={{ background: pro ? `${C.gold}45` : undefined, color: pro ? '#fff' : undefined }}>
                {pro ? '🎓 ' + t('מקצועי', 'PRO') : '👨‍🏫 ' + t('פשוט', 'SIMPLE')}
              </button>
            </div>
          </div>
        </div>

        {/* Components — expand in place */}
        <div className="card" style={{ padding: 'clamp(14px, 3vw, 22px)' }}>
          <h3 style={{ fontSize: 20, fontWeight: 800, color: C.gold, fontFamily: "'Playfair Display', serif", marginBottom: 14, textAlign: 'center' }}>
            🔧 {t('12 רכיבי הכור', '12 Reactor Components')}
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {RBMK_COMP.map((comp) => {
              const isOpen = openComp === comp.id;
              return (
                <div key={comp.id} style={{
                  background: isOpen ? `${C.gold}10` : 'rgba(0,0,0,0.4)',
                  border: `1px solid ${isOpen ? C.gold : 'rgba(200,164,78,0.18)'}`,
                  borderRadius: 8,
                  overflow: 'hidden',
                  transition: 'all 0.3s',
                }}>
                  <button onClick={() => setOpenComp(isOpen ? null : comp.id)} style={{
                    width: '100%', padding: '11px 14px',
                    background: 'transparent', border: 'none', cursor: 'pointer',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    color: isOpen ? '#fff' : 'rgba(255,255,255,0.85)',
                    textAlign: he ? 'right' : 'left',
                    fontSize: 16, fontWeight: 700,
                    fontFamily: "'Heebo', sans-serif",
                  }}>
                    <span>{t(comp.he, comp.en)}</span>
                    <span style={{ color: C.gold, fontSize: 15, transition: 'transform 0.3s', transform: isOpen ? 'rotate(45deg)' : 'rotate(0)' }}>＋</span>
                  </button>
                  {isOpen && (
                    <div className="fade-in" style={{ padding: '0 14px 14px', borderTop: `1px solid ${C.gold}33` }}>
                      <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.9)', lineHeight: 1.85, paddingTop: 10 }}>
                        {pro ? t(comp.pro_he, comp.pro_en) : t(comp.simple_he, comp.simple_en)}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: 12, fontSize: 14, color: 'rgba(255,255,255,0.55)', textAlign: 'center', fontFamily: "'JetBrains Mono', monospace" }}>
            💡 {t('מצב נוכחי', 'Current mode')}: <span style={{ color: pro ? C.gold : C.green }}>{pro ? '🎓 ' + t('מקצועי', 'PRO') : '👨‍🏫 ' + t('פשוט', 'SIMPLE')}</span>
          </div>
        </div>

        {/* The 4 fatal flaws — clearer language */}
        <div className="card-light" style={{ padding: 'clamp(14px, 3vw, 22px)', marginTop: 18 }}>
          <h3 style={{ fontSize: 20, fontWeight: 800, color: C.danger, fontFamily: "'Playfair Display', serif", marginBottom: 14, textAlign: 'center' }}>
            ⚠ {t('4 הכשלים הקטלניים של RBMK', '4 Fatal RBMK Flaws')}
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 10 }}>
            {[
              {
                icon: '🔥',
                he: 'הכור מאיץ במקום להאט',
                en: 'Positive Void Coefficient',
                desc_he: 'הפגם הפיזיקלי הקטלני ביותר: כשהמים בליבה מתחממים והופכים לבועות קיטור, הכור רץ מהר יותר במקום להאט. ברוב הכורים בעולם זה הפוך — יותר בועות = הכור נחלש = בטיחות מובנית. ב-RBMK המים שימשו רק לקירור, ולכן בועות → תגובה חזקה יותר → יותר חום → יותר בועות → אסון.',
                desc_en: 'The most lethal physical flaw: when water in the core heats up and becomes steam bubbles, the reactor accelerates instead of slowing. In most reactors worldwide it\'s the opposite — more bubbles = reactor weakens = built-in safety. In RBMK water served only as coolant, so bubbles → stronger reaction → more heat → more bubbles → disaster.',
              },
              {
                icon: '🛑',
                he: 'כפתור החירום שגרם לפיצוץ',
                en: 'Emergency Button Caused Explosion',
                desc_he: 'פגם תכנון מרושע: בקצה התחתון של מוטות הבקרה יש 3 מטרים של גרפיט. כשלוחצים את כפתור עצירת החירום, הגרפיט נכנס לליבה ראשון ודוחף את המים החוצה — מה שמגביר את התגובה הגרעינית במקום לעצור אותה. הפיצוץ נגרם בדיוק מזה: הצוות לחץ עצירת חירום — והכור התפוצץ.',
                desc_en: 'Sinister design flaw: the lower tip of control rods has 3 meters of graphite. When the emergency stop button is pressed, the graphite enters the core first and displaces the water — which intensifies the nuclear reaction instead of stopping it. The explosion was caused by exactly this: the crew pressed emergency stop — and the reactor exploded.',
              },
              {
                icon: '🏗',
                he: 'ללא כיפת הגנה',
                en: 'No Containment Dome',
                desc_he: 'בכורים מערביים יש כיפת בטון עבה מסביב לכור — מסוגלת להחזיק פיצוץ פנימי ולמנוע פליטת קרינה החוצה. ב-RBMK הסובייטי לא הייתה כיפה כזו. כשהפיצוץ קרה, לא היה שום דבר בין הליבה החשופה לאוויר הפתוח. הקרינה זרמה ישירות לאטמוספירה.',
                desc_en: 'Western reactors have a thick concrete dome around the reactor — capable of containing internal explosion and preventing radiation release. The Soviet RBMK had no such dome. When the explosion occurred, nothing stood between the exposed core and open air. Radiation flowed directly into the atmosphere.',
              },
              {
                icon: '👥',
                he: 'תרבות בטיחות לקויה',
                en: 'Poor Safety Culture',
                desc_he: 'דיווחים על בעיות (כמו פגם דומה שהתגלה בכור באיגנלינה ב-1983) הוסתרו ולא הועברו למפעילים. הניסוי בוצע על ידי משמרת לא מודרכת תחת לחץ פוליטי. מערכת קירור החירום נותקה ידנית בניגוד לרישיון. רזרבת מוטות הבקרה ירדה ל-8 בלבד (המינימום המותר: 30) — והצוות המשיך כי "הניסוי חייב להסתיים".',
                desc_en: 'Reports of problems (like a similar flaw discovered at Ignalina in 1983) were hidden and not distributed to operators. The test was performed by an unbriefed shift under political pressure. The emergency cooling system was manually disabled against the license. The control rod reserve dropped to just 8 (allowed minimum: 30) — and the crew continued because "the test must be completed."',
              },
            ].map((f, i) => (
              <div key={i} className="hover-lift" style={{
                padding: '14px 16px',
                background: 'rgba(239,68,68,0.07)',
                border: '1px solid rgba(239,68,68,0.3)',
                borderRadius: 10,
              }}>
                <div style={{ fontSize: 22, marginBottom: 6 }}>{f.icon}</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: C.danger, marginBottom: 6, fontFamily: "'Playfair Display', serif" }}>
                  {i + 1}. {t(f.he, f.en)}
                </div>
                <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.88)', lineHeight: 1.75 }}>
                  {t(f.desc_he, f.desc_en)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// CINEMATIC REACTOR — shows actual operator actions per step
// ============================================================
function CinematicReactor({ step, he, t }: { step: number; he: boolean; t: (h: string, e: string) => string }) {
  const isExplosion = step >= 8;
  const isPostScram = step >= 7;
  const azActive = step === 6 || step === 7;

  // Rod positions — fraction inserted into core (1 = full, 0 = withdrawn)
  const rodInsertion = step <= 1 ? 1.0 : step === 2 ? 0.5 : step === 3 ? 0.3 : step === 4 ? 0.04 : step === 5 ? 0.04 : step === 6 ? 0.5 : isPostScram ? 0 : 0;

  // Core glow intensity
  const coreGlow = step <= 2 ? 0.7 : step === 3 ? 0.2 : step === 4 ? 0.4 : step === 5 ? 0.5 : step === 6 ? 0.8 : step === 7 ? 1.0 : isExplosion ? 1.2 : 1;

  // Heat color
  const heatColor = step <= 2 ? '#fbbf24' : step <= 5 ? '#f97316' : step === 6 ? '#ef4444' : '#dc2626';

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      aspectRatio: '4/3',
      maxWidth: 720,
      margin: '0 auto',
      background: 'radial-gradient(ellipse at center, rgba(20,30,55,0.4) 0%, rgba(0,0,0,0.6) 100%)',
      borderRadius: 12,
      overflow: 'hidden',
      border: `1px solid ${C.gold}33`,
    }}>
      <svg viewBox="0 0 600 450" style={{ width: '100%', height: '100%', display: 'block' }}>
        <defs>
          <radialGradient id="rbmkCore" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#fde047" stopOpacity={coreGlow} />
            <stop offset="40%" stopColor={heatColor} stopOpacity={coreGlow * 0.9} />
            <stop offset="100%" stopColor="#7f1d1d" stopOpacity={coreGlow * 0.4} />
          </radialGradient>
          <linearGradient id="rod" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#cbd5e1" />
            <stop offset="100%" stopColor="#64748b" />
          </linearGradient>
          <linearGradient id="graphiteTip" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1f2937" />
            <stop offset="100%" stopColor="#374151" />
          </linearGradient>
          <linearGradient id="vesselGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
          <filter id="glow"><feGaussianBlur stdDeviation="3" /></filter>
          <filter id="bigGlow"><feGaussianBlur stdDeviation="8" /></filter>
        </defs>

        {/* Background environment */}
        <rect width="600" height="450" fill="rgba(10,14,26,0.3)" />

        {/* Reactor vessel */}
        <rect x="100" y="80" width="350" height="290" rx="12" fill="url(#vesselGrad)" stroke={isExplosion ? C.danger : C.gold} strokeWidth="2.5" />
        <text x="275" y="68" fill={C.gL} fontSize="11" fontFamily="JetBrains Mono" textAnchor="middle" fontWeight="700" letterSpacing="2">RBMK-1000</text>

        {/* Core glow */}
        <circle cx="275" cy="225" r={90 + coreGlow * 14} fill="url(#rbmkCore)"
                style={{ animation: step >= 7 ? 'pulseFire 0.6s infinite' : 'pulseFire 2.5s infinite' }} />

        {/* Fuel pellets — bright dots representing fuel channels */}
        {[...Array(12)].map((_, i) => {
          const angle = (i / 12) * Math.PI * 2;
          const r = 50;
          return (
            <circle key={`fuel-${i}`}
              cx={275 + Math.cos(angle) * r}
              cy={225 + Math.sin(angle) * r}
              r="3.5" fill="#fde047" opacity={coreGlow}
              style={{ animation: 'fuelPulse 1.5s infinite', animationDelay: `${i * 0.08}s` }} />
          );
        })}

        {/* Control rods — animated up/down */}
        {[...Array(11)].map((_, i) => {
          const x = 130 + i * 30;
          const rodTopY = 90;
          const fullRodLength = 200;
          const insertedLength = fullRodLength * rodInsertion;
          const rodBottomY = rodTopY + insertedLength;
          return (
            <g key={`rod-${i}`}>
              {/* Rod body */}
              <rect x={x - 3} y={rodTopY} width="6" height={Math.max(insertedLength - 14, 0)}
                    fill="url(#rod)"
                    opacity={isExplosion ? 0.3 : 1}
                    style={{ transition: 'height 1s ease' }} />
              {/* Graphite tip — visible at bottom of rod when inserted */}
              {rodInsertion > 0 && rodInsertion < 1 && (
                <rect x={x - 3} y={Math.max(rodBottomY - 14, rodTopY)} width="6" height="14"
                      fill="url(#graphiteTip)"
                      opacity={isExplosion ? 0.3 : 0.9}
                      style={{ transition: 'y 1s ease' }} />
              )}
              {/* Rod cap */}
              <circle cx={x} cy={rodTopY - 3} r="4" fill="#94a3b8" opacity={isExplosion ? 0.3 : 1} />
            </g>
          );
        })}

        {/* Step-specific overlays */}
        {/* Step 1: Power reduction arrows */}
        {step === 0 && (
          <g style={{ animation: 'fadeIn 0.6s' }}>
            <text x="500" y="220" fill={C.amber} fontSize="22" fontFamily="JetBrains Mono" fontWeight="700">↓</text>
            <text x="500" y="245" fill={C.gL} fontSize="9" fontFamily="JetBrains Mono">REDUCE</text>
          </g>
        )}

        {/* Step 2: ECCS DISABLED */}
        {step === 1 && (
          <g style={{ animation: 'pulseAlert 1.5s infinite', color: C.danger }}>
            <rect x="465" y="110" width="120" height="60" rx="6" fill="rgba(0,0,0,0.85)" stroke={C.danger} strokeWidth="2" />
            <text x="525" y="130" fill={C.danger} fontSize="11" fontFamily="JetBrains Mono" textAnchor="middle" fontWeight="900">ECCS</text>
            <text x="525" y="148" fill="#fff" fontSize="9" fontFamily="JetBrains Mono" textAnchor="middle">DISABLED</text>
            {/* Big X */}
            <line x1="475" y1="120" x2="575" y2="160" stroke={C.danger} strokeWidth="4" />
            <line x1="575" y1="120" x2="475" y2="160" stroke={C.danger} strokeWidth="4" />
          </g>
        )}

        {/* Step 3: Shift change */}
        {step === 2 && (
          <g style={{ animation: 'fadeIn 0.8s' }}>
            <rect x="465" y="110" width="120" height="60" rx="6" fill="rgba(0,0,0,0.85)" stroke={C.amber} strokeWidth="1.5" />
            <text x="525" y="132" fill={C.amber} fontSize="11" fontFamily="JetBrains Mono" textAnchor="middle" fontWeight="800">23:10</text>
            <text x="525" y="150" fill="#fff" fontSize="8" fontFamily="JetBrains Mono" textAnchor="middle" letterSpacing="1.5">SHIFT CHG</text>
          </g>
        )}

        {/* Step 4: Xenon poison cloud */}
        {step === 3 && (
          <g style={{ animation: 'fadeIn 0.6s' }}>
            {[...Array(15)].map((_, i) => (
              <circle key={`xe-${i}`}
                cx={200 + Math.random() * 150}
                cy={180 + Math.random() * 90}
                r={3 + Math.random() * 4}
                fill="#a855f7" opacity="0.6"
                style={{ animation: `bubbleUp ${2 + Math.random() * 2}s infinite ${i * 0.1}s` }} />
            ))}
            <text x="500" y="220" fill="#a855f7" fontSize="11" fontFamily="JetBrains Mono" fontWeight="700">Xe-135</text>
            <text x="500" y="238" fill="#a855f7" fontSize="9" fontFamily="JetBrains Mono">POISON</text>
          </g>
        )}

        {/* Step 5: Rods being PULLED OUT — animated arrows up */}
        {step === 4 && (
          <g style={{ animation: 'fadeIn 0.6s' }}>
            {[...Array(11)].map((_, i) => (
              <text key={`up-${i}`} x={130 + i * 30} y="60" fill={C.danger} fontSize="14" textAnchor="middle" fontWeight="900"
                    style={{ animation: `float 1.4s infinite ${i * 0.05}s` }}>↑</text>
            ))}
            <text x="500" y="220" fill={C.danger} fontSize="11" fontFamily="JetBrains Mono" fontWeight="700">ORM=8</text>
            <text x="500" y="238" fill={C.danger} fontSize="9" fontFamily="JetBrains Mono">CRITICAL</text>
          </g>
        )}

        {/* Step 6: Test starts — turbine valve closing */}
        {step === 5 && (
          <g style={{ animation: 'fadeIn 0.6s' }}>
            {/* Steam bubbles forming */}
            {[...Array(8)].map((_, i) => (
              <circle key={`steam-${i}`}
                cx={210 + i * 16}
                cy={310}
                r={3 + Math.random() * 3}
                fill="rgba(255,255,255,0.7)"
                style={{ animation: `bubbleUp ${1.6 + i * 0.2}s infinite ${i * 0.12}s` }} />
            ))}
            <text x="500" y="220" fill={C.amber} fontSize="11" fontFamily="JetBrains Mono" fontWeight="700">TEST</text>
            <text x="500" y="238" fill={C.amber} fontSize="9" fontFamily="JetBrains Mono">RUNNING</text>
          </g>
        )}

        {/* AZ-5 button — dramatic close-up at step 6 */}
        <g transform={azActive ? "translate(525, 100) scale(1.6)" : "translate(525, 110) scale(1)"} style={{ transition: 'transform 0.5s', transformOrigin: '525px 110px' }}>
          {azActive && (
            <>
              <circle cx="0" cy="0" r="40" fill="none" stroke={C.danger} strokeWidth="2" opacity="0.8" style={{ animation: 'ringPulse 1s infinite' }} />
              <circle cx="0" cy="0" r="30" fill="none" stroke={C.danger} strokeWidth="2" opacity="0.6" style={{ animation: 'ringPulse 1.2s infinite 0.3s' }} />
            </>
          )}
          <circle cx="0" cy="0" r="20" fill={azActive ? C.danger : 'rgba(60,60,60,0.7)'} stroke="#000" strokeWidth="3"
                  style={{ animation: azActive ? 'pulseAlert 0.5s infinite' : 'none' }} />
          <text x="0" y="4" fill="#fff" fontSize="11" fontFamily="JetBrains Mono" textAnchor="middle" fontWeight="900">AZ-5</text>
          {/* Hand pressing AZ-5 at step 6 */}
          {step === 6 && (
            <text x="0" y="-30" fontSize="22" textAnchor="middle" style={{ animation: 'shake 0.4s infinite' }}>👇</text>
          )}
        </g>

        {/* Power gauge — visible all steps */}
        <g transform="translate(60, 250)">
          <rect x="-20" y="-90" width="40" height="180" rx="6" fill="rgba(0,0,0,0.7)" stroke={C.gold} strokeWidth="1" />
          <text x="0" y="-100" fill={C.gL} fontSize="8" fontFamily="JetBrains Mono" textAnchor="middle">POWER</text>
          {/* Bar */}
          {(() => {
            const power = step <= 2 ? 1600 : step === 3 ? 30 : step === 4 ? 200 : step === 5 ? 200 : step === 6 ? 530 : step === 7 ? 30000 : 30000;
            const norm = Math.min(power / 32000, 1);
            const h = norm * 170;
            const c = power > 5000 ? C.danger : power > 1500 ? C.amber : C.green;
            return (
              <>
                <rect x="-15" y={85 - h} width="30" height={h} fill={c} style={{ transition: 'all 1s', filter: `drop-shadow(0 0 6px ${c})` }} />
                <text x="0" y={Math.max(85 - h - 4, -85)} fill={c} fontSize="9" fontFamily="JetBrains Mono" textAnchor="middle" fontWeight="700">{power > 1000 ? `${(power/1000).toFixed(power > 5000 ? 0 : 1)}k` : power}</text>
              </>
            );
          })()}
        </g>

        {/* Explosion effects */}
        {isExplosion && (
          <g>
            {/* Bright flash */}
            <circle cx="275" cy="225" r="120" fill="#fff" opacity={step === 8 ? 0.6 : 0.3} style={{ animation: 'pulseFire 0.4s infinite' }} />
            {/* Shockwave rings */}
            <circle cx="275" cy="225" r="80" fill="none" stroke={C.amber} strokeWidth="3" opacity="0.7" style={{ animation: 'ringPulse 1.2s infinite' }} />
            <circle cx="275" cy="225" r="80" fill="none" stroke={C.danger} strokeWidth="3" opacity="0.7" style={{ animation: 'ringPulse 1.5s infinite 0.4s' }} />
            {/* Schema E plate ejecting at step 8 */}
            {step === 8 && (
              <rect x="180" y={225 - (step === 8 ? 200 : 0)} width="190" height="20" rx="4" fill="#475569" stroke={C.gold} strokeWidth="2" style={{ animation: 'plumeRise 1.5s ease-out' }} />
            )}
            {/* Plume of debris */}
            {[...Array(20)].map((_, i) => {
              const angle = (i / 20) * Math.PI * 2;
              return (
                <circle key={`debris-${i}`}
                  cx={275 + Math.cos(angle) * 30}
                  cy={225 + Math.sin(angle) * 30}
                  r={3 + Math.random() * 6}
                  fill={i % 2 === 0 ? C.danger : C.amber}
                  opacity="0.8"
                  style={{ animation: `plumeRise ${1.5 + Math.random()}s infinite ${i * 0.1}s` }} />
              );
            })}
            {/* Fire wisps at top of vessel */}
            {step === 9 && [...Array(8)].map((_, i) => (
              <text key={`fire-${i}`} x={150 + i * 35} y="100" fontSize="20" style={{ animation: `flameWave ${0.8 + Math.random()}s infinite alternate ${i * 0.1}s` }}>🔥</text>
            ))}
          </g>
        )}

        {/* Bottom labels */}
        <text x="275" y="395" fill="rgba(255,255,255,0.5)" fontSize="9" fontFamily="JetBrains Mono" textAnchor="middle" letterSpacing="2">
          {he ? '← ליבת הכור · 1,661 ערוצי דלק · 211 מוטות בקרה' : 'Reactor Core · 1,661 Fuel Channels · 211 Control Rods'}
        </text>
      </svg>
    </div>
  );
}

// Mini stat tile
function MiniStat({ label, value, unit, max, cur, color, alert }: { label: string; value: string; unit: string; max: number; cur: number; color: string; alert?: boolean }) {
  return (
    <div style={{
      padding: '8px 10px',
      borderRadius: 8,
      background: 'rgba(0,0,0,0.55)',
      border: `1px solid ${alert ? color : 'rgba(255,255,255,0.1)'}`,
      animation: alert ? 'pulseAlert 1.6s infinite' : 'none',
      transition: 'all 0.4s',
      color,
    }}>
      <div style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.15em', color: 'rgba(255,255,255,0.6)', marginBottom: 2 }}>
        {label}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
        <span style={{ fontSize: 21, fontWeight: 900, color, fontFamily: "'Playfair Display', serif", lineHeight: 1 }}>{value}</span>
        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', fontFamily: "'JetBrains Mono', monospace" }}>{unit}</span>
      </div>
      <div style={{ marginTop: 4, height: 3, borderRadius: 1, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
        <div style={{
          width: `${Math.min((cur / max) * 100, 100)}%`, height: '100%',
          background: color,
          transition: 'width 0.6s ease',
          boxShadow: alert ? `0 0 8px ${color}` : 'none',
        }} />
      </div>
    </div>
  );
}
