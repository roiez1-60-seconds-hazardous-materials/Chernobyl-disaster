'use client';
import { useState, useEffect } from 'react';
import { C } from '@/lib/data';

export default function NuclearReactor({ he, t }: { he: boolean; t: (h: string, e: string) => string }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setStep((s) => (s + 1) % 5), 3500);
    return () => clearInterval(id);
  }, []);

  const STEPS = [
    { he: '1. ביקוע גרעיני', en: '1. Nuclear Fission',
      desc_he: 'ניוטרון פוגע בגרעין אורניום-235, מבקע אותו לשני גרעינים קלים יותר ומשחרר אנרגיה + 2-3 ניוטרונים נוספים.',
      desc_en: 'A neutron strikes a U-235 nucleus, splitting it into two lighter nuclei, releasing energy + 2-3 additional neutrons.',
      icon: '⚛', c: C.purple },
    { he: '2. תגובת שרשרת', en: '2. Chain Reaction',
      desc_he: 'הניוטרונים החדשים פוגעים בעוד גרעיני אורניום, וכך הלאה. בכור מבוקר נשמר ערך קבוע של ניוטרונים פעילים.',
      desc_en: 'New neutrons strike more uranium nuclei, and so on. In a controlled reactor, active neutron count remains constant.',
      icon: '🔗', c: C.amber },
    { he: '3. חימום נוזל קירור', en: '3. Coolant Heating',
      desc_he: 'האנרגיה משחררת חום עצום בליבה. נוזל קירור (מים, גז, או מתכת מותכת) זורם דרך הליבה ומחומם.',
      desc_en: 'Energy releases massive heat in core. Coolant (water, gas, or molten metal) flows through core and heats up.',
      icon: '🔥', c: C.danger },
    { he: '4. יצירת קיטור', en: '4. Steam Generation',
      desc_he: 'נוזל הקירור החם מחמם מים ויוצר קיטור בלחץ גבוה — ב-RBMK הקיטור נוצר ישירות בליבה.',
      desc_en: 'Hot coolant heats water creating high-pressure steam — in RBMK steam is created directly in core.',
      icon: '💨', c: C.blue },
    { he: '5. הפקת חשמל', en: '5. Electricity Generation',
      desc_he: 'הקיטור מניע טורבינה המחוברת לגנרטור היוצר שדה חשמלי. החשמל מועבר לרשת הציבורית.',
      desc_en: 'Steam drives turbine connected to generator creating electric field. Electricity transferred to public grid.',
      icon: '⚡', c: C.green },
  ];

  const cur = STEPS[step];

  return (
    <section id="reactor-general" style={{ padding: '60px 16px 30px', position: 'relative' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 28, position: 'relative' }}>
          <div className="section-number" style={{ top: '-20px', insetInlineStart: '5%' }}>02</div>
          <div className="section-kicker">[ {t('סעיף שני · פיזיקה', 'PART TWO · PHYSICS')} ]</div>
          <h2 className="section-title">{t('איך פועל כור גרעיני?', 'How a Nuclear Reactor Works')}</h2>
          <p className="section-subtitle">{t('מביקוע אטומי בודד עד מליוני וואט של חשמל', 'From single atomic fission to millions of watts')}</p>
          <div className="gr" style={{ margin: '0 auto' }} />
        </div>

        {/* Animation viewer */}
        <div className="card" style={{ padding: 'clamp(20px, 4vw, 36px)', marginBottom: 24 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr)', gap: 24, alignItems: 'center' }}>
            {/* Animated SVG */}
            <div style={{ position: 'relative', width: '100%', maxWidth: 900, margin: '0 auto', aspectRatio: '16/9' }}>
              <svg viewBox="0 0 600 340" style={{ width: '100%', height: '100%' }}>
                <defs>
                  <radialGradient id="coreGrad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#fbbf24" />
                    <stop offset="50%" stopColor="#dc2626" />
                    <stop offset="100%" stopColor="#7f1d1d" />
                  </radialGradient>
                  <linearGradient id="steamGrad" x1="0%" y1="100%" x2="0%" y2="0%">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#67e8f9" stopOpacity="0.4" />
                  </linearGradient>
                  <linearGradient id="waterGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#0ea5e9" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>

                {/* Reactor vessel */}
                <rect x="60" y="100" width="160" height="180" rx="14" fill="rgba(20,30,55,0.8)" stroke={C.gold} strokeWidth="2" />
                <text x="140" y="88" fill={C.gL} fontSize="22" fontFamily="JetBrains Mono" textAnchor="middle" fontWeight="800">{he ? 'ליבת הכור' : 'REACTOR CORE'}</text>

                {/* Core glow */}
                <circle cx="140" cy="190" r="50" fill="url(#coreGrad)" opacity={step >= 0 ? 1 : 0.3} style={{ animation: 'pulseFire 2s infinite' }} />

                {/* Atomic nucleus + electrons (step 0: fission) */}
                {step === 0 && (
                  <>
                    <circle cx="140" cy="190" r="8" fill="#fff" />
                    <circle cx="140" cy="190" r="14" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1" strokeDasharray="3 2" style={{ animation: 'spin 4s linear infinite', transformOrigin: '140px 190px' }} />
                    <circle cx="140" cy="190" r="20" fill="none" stroke="rgba(168,85,247,0.6)" strokeWidth="1" strokeDasharray="2 3" style={{ animation: 'spin 6s linear infinite reverse', transformOrigin: '140px 190px' }} />
                  </>
                )}

                {/* Chain reaction neutrons (step 1) */}
                {step === 1 && [...Array(8)].map((_, i) => {
                  const angle = (i / 8) * Math.PI * 2;
                  return (
                    <circle key={i} cx={140 + Math.cos(angle) * 30} cy={190 + Math.sin(angle) * 30} r="3" fill="#a855f7" style={{ animation: `bubbleUp ${1 + Math.random()}s infinite ${i * 0.1}s` }} />
                  );
                })}

                {/* Hot coolant (step 2) */}
                {step >= 2 && (
                  <>
                    {[...Array(6)].map((_, i) => (
                      <circle key={i} cx={100 + i * 13} cy={250} r="4" fill={C.danger} opacity="0.7" style={{ animation: `bubbleUp ${1.5 + i * 0.2}s infinite ${i * 0.15}s` }} />
                    ))}
                  </>
                )}

                {/* Pipe to steam generator */}
                <path d="M 220 180 L 320 180" stroke={step >= 2 ? C.danger : 'rgba(255,255,255,0.3)'} strokeWidth="6" fill="none" />
                <path d="M 320 180 L 320 220 L 380 220" stroke={step >= 2 ? C.danger : 'rgba(255,255,255,0.3)'} strokeWidth="6" fill="none" />

                {/* Steam generator */}
                <rect x="320" y="120" width="80" height="100" rx="8" fill="rgba(10,30,50,0.8)" stroke={C.blue} strokeWidth="2" />
                <text x="360" y="108" fill={C.blue} fontSize="20" fontFamily="JetBrains Mono" textAnchor="middle" fontWeight="800">{he ? 'מחולל קיטור' : 'STEAM GEN.'}</text>

                {/* Steam particles (step 3) */}
                {step >= 3 && [...Array(8)].map((_, i) => (
                  <circle key={i} cx={345 + (i % 4) * 8} cy={170 + Math.floor(i / 4) * 20} r="3" fill="url(#steamGrad)" style={{ animation: `steamRise ${1.5 + i * 0.2}s infinite ${i * 0.1}s` }} />
                ))}

                {/* Pipe to turbine */}
                <path d="M 400 145 L 470 145" stroke={step >= 3 ? C.blue : 'rgba(255,255,255,0.3)'} strokeWidth="5" fill="none" strokeDasharray="6 3" style={{ animation: step >= 3 ? 'flowDS 1.5s linear infinite' : 'none' }} />

                {/* Turbine */}
                <circle cx="500" cy="145" r="32" fill="rgba(20,30,40,0.9)" stroke={step >= 4 ? C.green : 'rgba(255,255,255,0.3)'} strokeWidth="2" />
                {[...Array(6)].map((_, i) => {
                  const angle = (i / 6) * 360;
                  return <rect key={i} x="498" y="118" width="4" height="20" fill={step >= 4 ? C.green : '#666'} transform={`rotate(${angle} 500 145)`} style={{ transformOrigin: '500px 145px' }} />;
                })}
                <circle cx="500" cy="145" r="6" fill={step >= 4 ? C.green : '#666'} />
                <g style={{ transformOrigin: '500px 145px', animation: step >= 4 ? 'spin 2s linear infinite' : 'none' }}>
                  <line x1="500" y1="145" x2="500" y2="120" stroke={step >= 4 ? C.gold : '#444'} strokeWidth="1.5" />
                </g>
                <text x="500" y="195" fill={step >= 4 ? C.green : 'rgba(255,255,255,0.4)'} fontSize="20" fontFamily="JetBrains Mono" textAnchor="middle" fontWeight="800">{he ? 'טורבינה' : 'TURBINE'}</text>

                {/* Electricity bolts (step 4) */}
                {step === 4 && (
                  <>
                    <path d="M 540 145 L 565 130 L 555 145 L 575 130" stroke={C.green} strokeWidth="2" fill="none" style={{ animation: 'blink 0.5s infinite' }} />
                    <text x="567" y="170" fill={C.green} fontSize="20" textAnchor="middle" fontWeight="900" style={{ animation: 'pulseFire 1s infinite' }}>⚡</text>
                  </>
                )}

                {/* Cold water return */}
                <path d="M 380 250 L 220 250 L 220 280 L 60 280" stroke="rgba(6,182,212,0.4)" strokeWidth="3" fill="none" strokeDasharray="4 4" style={{ animation: 'flowD 3s linear infinite' }} />
                <text x="220" y="305" fill="rgba(6,182,212,0.7)" fontSize="14" fontFamily="JetBrains Mono" textAnchor="middle">{he ? '← מים קרים חוזרים' : 'cold water return →'}</text>
              </svg>
            </div>

            {/* Step description */}
            <div style={{ textAlign: 'center', minHeight: 110 }}>
              <div className="fade-in" key={step} style={{ display: 'inline-block', padding: '14px 22px', borderRadius: 14, background: `${cur.c}15`, border: `1px solid ${cur.c}55` }}>
                <div style={{ fontSize: 36, marginBottom: 4 }}>{cur.icon}</div>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: cur.c, fontFamily: "'Playfair Display', serif", marginBottom: 6 }}>
                  {t(cur.he, cur.en)}
                </h3>
                <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.9)', lineHeight: 1.7, maxWidth: 600 }}>
                  {t(cur.desc_he, cur.desc_en)}
                </p>
              </div>
            </div>

            {/* Step dots */}
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
              {STEPS.map((_, i) => (
                <button key={i} onClick={() => setStep(i)} style={{
                  width: i === step ? 32 : 12, height: 12, borderRadius: 6,
                  background: i === step ? STEPS[i].c : 'rgba(255,255,255,0.15)',
                  border: 'none', cursor: 'pointer', transition: 'all 0.3s',
                  boxShadow: i === step ? `0 0 12px ${STEPS[i].c}aa` : 'none',
                }} />
              ))}
            </div>
          </div>
        </div>

        {/* Educational note */}
        <div className="card-light" style={{ padding: '14px 18px', textAlign: 'center' }}>
          <p style={{ fontSize: 16, color: C.gL, lineHeight: 1.8 }}>
            💡 {t(
              'בכור גרעיני, החום נוצר על ידי ביקוע גרעיני — לא על ידי שריפה. אבל ב-RBMK הסובייטי היה פגם תכן קריטי שהפך אותו לפצצת זמן. בסעיף הבא נראה איך.',
              'In a nuclear reactor, heat is produced by nuclear fission — not combustion. But the Soviet RBMK had a critical design flaw making it a ticking time bomb. The next section shows how.'
            )}
          </p>
        </div>
      </div>
    </section>
  );
}
