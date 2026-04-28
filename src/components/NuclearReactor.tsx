'use client';
import { useState, useEffect } from 'react';
import { C } from '@/lib/data';

const STEPS = [
  {
    he: 'ביקוע גרעיני',
    en: 'Nuclear Fission',
    desc_he: 'ניוטרון איטי פוגע בגרעין אורניום-235 ומבקע אותו. נוצרים 2-3 ניוטרונים חדשים, אנרגיה אדירה (מומרת לחום), ו-2 גרעינים קלים יותר.',
    desc_en: 'A slow neutron strikes a U-235 nucleus, splitting it. Result: 2-3 new neutrons, massive energy (heat), and 2 lighter nuclei.',
    color: '#a855f7',
    icon: '⚛',
  },
  {
    he: 'תגובת שרשרת',
    en: 'Chain Reaction',
    desc_he: 'הניוטרונים שנוצרו פוגעים בעוד גרעיני אורניום, וכך הלאה. בכור מבוקר נשמר ערך קבוע של ניוטרונים — לא יותר מדי (פיצוץ), לא פחות מדי (כיבוי).',
    desc_en: 'New neutrons hit more uranium nuclei, and so on. In a controlled reactor, the neutron count stays constant — not too many (boom), not too few (shutdown).',
    color: '#f59e0b',
    icon: '🔗',
  },
  {
    he: 'חימום נוזל הקירור',
    en: 'Coolant Heating',
    desc_he: 'החום שמשתחרר בליבה (כ-3,200 מגה-וואט תרמיים) מועבר למים שזורמים בערוצי לחץ. המים מתחממים ל-280°C ומתחילים להתאדות חלקית לקיטור.',
    desc_en: 'Heat from the core (~3,200 MWt) transfers to water flowing through pressure channels. Water heats to 280°C and partially evaporates into steam.',
    color: '#dc2626',
    icon: '🔥',
  },
  {
    he: 'יצירת קיטור',
    en: 'Steam Generation',
    desc_he: 'תערובת המים-קיטור עוברת למפרידי קיטור (4 גלילים אופקיים). הקיטור היבש עולה למעלה לטורבינה, המים חוזרים למטה לכור דרך משאבות הקירור.',
    desc_en: 'Water-steam mix flows to steam separators (4 horizontal drums). Dry steam goes up to the turbine; water returns to the reactor through coolant pumps.',
    color: '#06b6d4',
    icon: '💨',
  },
  {
    he: 'הפקת חשמל',
    en: 'Electricity Generation',
    desc_he: 'הקיטור בלחץ גבוה מסובב טורבינה ענקית. הטורבינה מחוברת לגנרטור שיוצר שדה מגנטי ומייצר חשמל. החשמל מועבר לרשת. תפוקת RBMK-1000: 1,000 מגה-וואט חשמליים.',
    desc_en: 'High-pressure steam spins a giant turbine connected to a generator that creates a magnetic field, producing electricity. RBMK-1000 output: 1,000 MWe.',
    color: '#22c55e',
    icon: '⚡',
  },
];

export default function NuclearReactor({ he, t }: { he: boolean; t: (h: string, e: string) => string }) {
  const [step, setStep] = useState(0);
  const [auto, setAuto] = useState(true);

  useEffect(() => {
    if (!auto) return;
    const id = setInterval(() => setStep((s) => (s + 1) % STEPS.length), 5000);
    return () => clearInterval(id);
  }, [auto]);

  const cur = STEPS[step];

  return (
    <section id="reactor-general" style={{ padding: '60px 16px 30px', position: 'relative' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 28, position: 'relative' }}>
          <div className="section-number" style={{ top: '-20px', insetInlineStart: '5%' }}>02</div>
          <div className="section-kicker">[ {t('סעיף שני · פיזיקה', 'PART TWO · PHYSICS')} ]</div>
          <h2 className="section-title">{t('איך פועל כור גרעיני?', 'How a Nuclear Reactor Works')}</h2>
          <p className="section-subtitle">{t('מביקוע אטומי בודד עד מליוני וואט של חשמל', 'From single atomic fission to millions of watts')}</p>
          <div className="gr" style={{ margin: '0 auto' }} />
        </div>

        {/* Reactor diagram */}
        <div style={{
          background: 'linear-gradient(180deg, rgba(0,0,0,0.6), rgba(0,0,0,0.4))',
          border: `1px solid ${C.gold}33`,
          borderRadius: 12,
          padding: 'clamp(20px, 3vw, 32px)',
          marginBottom: 20,
        }}>
          <div style={{ position: 'relative', width: '100%', maxWidth: 1100, margin: '0 auto', aspectRatio: '16/9', maxHeight: '42vh' }}>
            <svg viewBox="0 0 1100 620" preserveAspectRatio="xMidYMid meet" style={{ width: '100%', height: '100%', display: 'block' }}>
              <defs>
                <linearGradient id="bldgGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3a3a3a" />
                  <stop offset="100%" stopColor="#1a1a1a" />
                </linearGradient>
                <linearGradient id="vesselGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2a3045" />
                  <stop offset="100%" stopColor="#15192a" />
                </linearGradient>
                <radialGradient id="coreGrad">
                  <stop offset="0%" stopColor={cur.color} stopOpacity="0.95" />
                  <stop offset="60%" stopColor={cur.color} stopOpacity="0.5" />
                  <stop offset="100%" stopColor={cur.color} stopOpacity="0" />
                </radialGradient>
                <linearGradient id="hotWater" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#dc2626" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="#f97316" stopOpacity="0.5" />
                </linearGradient>
                <linearGradient id="coldWater" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.5" />
                </linearGradient>
                <filter id="glow"><feGaussianBlur stdDeviation="4" /></filter>
              </defs>

              {/* Building */}
              <rect x="80" y="160" width="380" height="380" fill="url(#bldgGrad)" stroke="#1a1a1a" strokeWidth="2" />
              {[...Array(6)].map((_, i) => (
                <line key={`bh-${i}`} x1="80" y1={200 + i * 60} x2="460" y2={200 + i * 60} stroke="#1a1a1a" strokeWidth="0.5" opacity="0.6" />
              ))}

              {/* Reactor vessel (inside building) */}
              <rect x="160" y="220" width="220" height="280" fill="url(#vesselGrad)" stroke={C.gold} strokeWidth="2" rx="4" />

              {/* Core glow */}
              <ellipse cx="270" cy="360" rx={step === 0 || step === 1 ? 75 : 60} ry={step === 0 || step === 1 ? 90 : 80}
                       fill="url(#coreGrad)" style={{ animation: 'pulseFire 2s infinite' }} />

              {/* Step 0: Single atom + neutron + fission products */}
              {step === 0 && (
                <g style={{ animation: 'fadeIn 0.6s' }}>
                  {/* U-235 nucleus — wobble before fission */}
                  <circle cx="270" cy="360" r="16" fill="#fff" filter="url(#glow)"
                          style={{ animation: 'nucleusWobble 2s infinite' }} />
                  <circle cx="270" cy="360" r="22" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1" strokeDasharray="3 2"
                          style={{ animation: 'spin 4s linear infinite', transformOrigin: '270px 360px' }} />
                  <circle cx="270" cy="360" r="30" fill="none" stroke="rgba(168,85,247,0.4)" strokeWidth="0.5"
                          style={{ animation: 'spin 6s linear infinite reverse', transformOrigin: '270px 360px' }} />

                  {/* Incoming neutron — slow, deliberate */}
                  <circle cx="190" cy="360" r="5" fill="#a855f7" filter="url(#glow)"
                          style={{ animation: 'incomingNeutron 2s linear infinite' }} />
                  {/* Trail behind neutron */}
                  <circle cx="190" cy="360" r="2" fill="#a855f7" opacity="0.4"
                          style={{ animation: 'incomingNeutron 2s linear infinite 0.1s' }} />

                  {/* Fission products — ejected at moment of split */}
                  {[...Array(3)].map((_, i) => (
                    <circle key={`emit-${i}`}
                            cx="270" cy="360" r="3" fill="#fbbf24" filter="url(#glow)"
                            style={{ animation: `fissionEmit-${i} 2s infinite 1.5s` }} />
                  ))}

                  <text x="270" y="240" textAnchor="middle" fill="#fff" fontSize="20" fontFamily="JetBrains Mono" fontWeight="800">
                    U-235
                  </text>
                  <text x="270" y="262" textAnchor="middle" fill="#a855f7" fontSize="13" fontFamily="JetBrains Mono">
                    {he ? '+ ניוטרון' : '+ neutron'}
                  </text>
                </g>
              )}

              {/* Step 1: Chain reaction — exponential growth */}
              {step === 1 && (
                <g style={{ animation: 'fadeIn 0.6s' }}>
                  {/* First wave — close */}
                  {[...Array(6)].map((_, i) => {
                    const angle = (i / 6) * Math.PI * 2;
                    const dx = Math.cos(angle) * 50;
                    const dy = Math.sin(angle) * 50;
                    return (
                      <g key={`w1-${i}`}>
                        <line x1="270" y1="360" x2={270 + dx} y2={360 + dy} stroke="#fff" strokeWidth="1.5" opacity="0.7"
                              style={{ animation: `chainPulse 1.2s infinite ${i * 0.05}s` }} />
                        <circle cx={270 + dx} cy={360 + dy} r="4" fill="#a855f7" filter="url(#glow)"
                                style={{ animation: `chainPulse 1.2s infinite ${i * 0.05}s` }} />
                      </g>
                    );
                  })}
                  {/* Second wave — farther */}
                  {[...Array(12)].map((_, i) => {
                    const angle = (i / 12) * Math.PI * 2;
                    const dx = Math.cos(angle) * 100;
                    const dy = Math.sin(angle) * 100;
                    return (
                      <g key={`w2-${i}`}>
                        <line x1="270" y1="360" x2={270 + dx} y2={360 + dy} stroke="#a855f7" strokeWidth="1" opacity="0.4"
                              style={{ animation: `chainPulse 1.5s infinite ${0.4 + i * 0.05}s` }} />
                        <circle cx={270 + dx} cy={360 + dy} r="2.5" fill="#a855f7" filter="url(#glow)"
                                style={{ animation: `chainPulse 1.5s infinite ${0.4 + i * 0.05}s` }} />
                      </g>
                    );
                  })}
                  {/* Outer wave */}
                  {[...Array(20)].map((_, i) => {
                    const angle = (i / 20) * Math.PI * 2;
                    const dx = Math.cos(angle) * 145;
                    const dy = Math.sin(angle) * 145;
                    return (
                      <circle key={`w3-${i}`} cx={270 + dx} cy={360 + dy} r="2" fill="#fbbf24" filter="url(#glow)" opacity="0.7"
                              style={{ animation: `chainPulse 1.8s infinite ${0.8 + i * 0.04}s` }} />
                    );
                  })}
                  {/* Pulsing center */}
                  <circle cx="270" cy="360" r="12" fill="#fff" filter="url(#glow)"
                          style={{ animation: 'pulseFire 0.6s infinite' }} />
                </g>
              )}

              {/* Step 2+: Hot water rises */}
              {step >= 2 && (
                <g>
                  {/* Pressure tubes */}
                  {[...Array(8)].map((_, i) => (
                    <g key={`tube-${i}`}>
                      <line x1={210 + i * 22} y1="280" x2={210 + i * 22} y2="490"
                            stroke="#1a1a1a" strokeWidth="2" />
                      <line x1={210 + i * 22} y1="280" x2={210 + i * 22} y2="490"
                            stroke={step >= 3 ? '#f97316' : '#fbbf24'} strokeWidth="1.2"
                            strokeDasharray="4 3" opacity="0.85"
                            style={{ animation: 'flowDS 1.2s linear infinite' }} />
                    </g>
                  ))}
                </g>
              )}

              {/* Pipes from reactor to steam separator */}
              {step >= 3 && (
                <g>
                  <path d="M 380 280 L 540 280 L 540 230" stroke="url(#hotWater)" strokeWidth="6" fill="none" />
                  <path d="M 380 280 L 540 280 L 540 230" stroke="#f97316" strokeWidth="2" fill="none"
                        strokeDasharray="8 4" style={{ animation: 'flowDS 1s linear infinite' }} />
                </g>
              )}

              {/* Steam separator */}
              <g>
                <ellipse cx="600" cy="200" rx="80" ry="32" fill="#2a2a2a" stroke={step >= 3 ? C.amber : C.gold + '55'} strokeWidth="2" />
                <text x="600" y="160" textAnchor="middle" fill={step >= 3 ? C.amber : 'rgba(255,255,255,0.5)'} fontSize="16" fontFamily="JetBrains Mono" fontWeight="800">
                  {he ? 'מפריד קיטור' : 'STEAM SEPARATOR'}
                </text>
                {/* Water level inside */}
                <rect x="528" y="200" width="144" height="20" fill="url(#hotWater)" opacity={step >= 3 ? 0.8 : 0.3} />
              </g>

              {/* Steam path to turbine */}
              {step >= 3 && (
                <g>
                  <path d="M 600 168 L 600 130 L 800 130" stroke="rgba(255,255,255,0.4)" strokeWidth="6" fill="none" />
                  {/* Steam puffs */}
                  {[...Array(5)].map((_, i) => (
                    <circle key={`puff-${i}`}
                            cx={600 + (i * 40)}
                            cy={130}
                            r="6"
                            fill="rgba(255,255,255,0.5)"
                            filter="url(#glow)"
                            style={{ animation: `steamFlow 2s linear infinite ${i * 0.4}s` }} />
                  ))}
                </g>
              )}

              {/* Turbine */}
              <g>
                <circle cx="850" cy="130" r="55" fill="#1a1a1a" stroke={step >= 4 ? C.green : C.gold + '55'} strokeWidth="2" />
                {[...Array(8)].map((_, i) => {
                  const angle = (i / 8) * 360;
                  return (
                    <rect key={i} x="847" y="80" width="6" height="35"
                          fill={step >= 4 ? C.green : '#444'}
                          transform={`rotate(${angle} 850 130)`}
                          style={{ transformOrigin: '850px 130px' }} />
                  );
                })}
                <g style={{ transformOrigin: '850px 130px', animation: step >= 4 ? 'spin 0.6s linear infinite' : 'none' }}>
                  <circle cx="850" cy="130" r="10" fill={step >= 4 ? C.green : '#666'} />
                  <line x1="850" y1="130" x2="850" y2="100" stroke="#fff" strokeWidth="2" />
                </g>
                <text x="850" y="210" textAnchor="middle" fill={step >= 4 ? C.green : 'rgba(255,255,255,0.5)'} fontSize="16" fontFamily="JetBrains Mono" fontWeight="800">
                  {he ? 'טורבינה' : 'TURBINE'}
                </text>
              </g>

              {/* Generator */}
              <g>
                <rect x="950" y="100" width="100" height="60" fill="#1a1a1a" stroke={step >= 4 ? C.green : C.gold + '55'} strokeWidth="2" rx="4" />
                <text x="1000" y="135" textAnchor="middle" fill={step >= 4 ? C.green : 'rgba(255,255,255,0.6)'} fontSize="14" fontFamily="JetBrains Mono" fontWeight="700">
                  GEN
                </text>
                {step >= 4 && (
                  <>
                    <text x="1000" y="80" textAnchor="middle" fontSize="22" style={{ animation: 'pulseFire 1s infinite' }}>⚡</text>
                    <text x="1000" y="190" textAnchor="middle" fill={C.green} fontSize="14" fontFamily="JetBrains Mono" fontWeight="800">
                      1,000 MW
                    </text>
                  </>
                )}
              </g>

              {/* Cold water return loop (always visible from step 3) */}
              {step >= 3 && (
                <>
                  <path d="M 850 185 L 850 540 L 270 540 L 270 510" stroke="url(#coldWater)" strokeWidth="6" fill="none" />
                  <path d="M 850 185 L 850 540 L 270 540 L 270 510" stroke="#06b6d4" strokeWidth="2" fill="none"
                        strokeDasharray="6 4" style={{ animation: 'flowD 2.5s linear infinite' }} />
                  {/* Pump */}
                  <circle cx="500" cy="540" r="22" fill="#1a1a1a" stroke="#06b6d4" strokeWidth="2" />
                  <g style={{ transformOrigin: '500px 540px', animation: 'spin 0.5s linear infinite' }}>
                    <line x1="486" y1="540" x2="514" y2="540" stroke="#06b6d4" strokeWidth="2" />
                    <line x1="500" y1="526" x2="500" y2="554" stroke="#06b6d4" strokeWidth="2" />
                  </g>
                  <text x="500" y="582" textAnchor="middle" fill="#06b6d4" fontSize="13" fontFamily="JetBrains Mono">
                    {he ? 'משאבה' : 'PUMP'}
                  </text>
                </>
              )}

              {/* Reactor label */}
              <text x="270" y="200" textAnchor="middle" fill={C.gold} fontSize="18" fontFamily="JetBrains Mono" fontWeight="800">
                {he ? 'ליבת הכור' : 'REACTOR CORE'}
              </text>

              {/* Building label */}
              <text x="270" y="180" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="11" fontFamily="JetBrains Mono" letterSpacing="2">
                {he ? '· מבנה הכור ·' : '· REACTOR BUILDING ·'}
              </text>
            </svg>
          </div>
        </div>

        {/* Step navigator */}
        <div style={{ display: 'flex', gap: 6, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 16 }}>
          {STEPS.map((s, i) => (
            <button
              key={i}
              onClick={() => { setStep(i); setAuto(false); }}
              style={{
                padding: '10px 16px',
                background: i === step ? `${s.color}33` : 'rgba(0,0,0,0.4)',
                color: i === step ? '#fff' : 'rgba(255,255,255,0.7)',
                border: `1px solid ${i === step ? s.color : 'rgba(255,255,255,0.12)'}`,
                borderRadius: 8,
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: 700,
                fontFamily: "'JetBrains Mono', monospace",
                transition: 'all 0.25s',
                boxShadow: i === step ? `0 0 14px ${s.color}77` : 'none',
                display: 'inline-flex', alignItems: 'center', gap: 6,
              }}
            >
              <span style={{ fontSize: 16 }}>{s.icon}</span>
              {i + 1}. {t(s.he, s.en)}
            </button>
          ))}
          <button
            onClick={() => setAuto(!auto)}
            style={{
              padding: '10px 16px',
              background: auto ? `${C.gold}33` : 'rgba(0,0,0,0.4)',
              color: auto ? '#fff' : 'rgba(255,255,255,0.7)',
              border: `1px solid ${auto ? C.gold : 'rgba(255,255,255,0.12)'}`,
              borderRadius: 8,
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 700,
              fontFamily: "'JetBrains Mono', monospace",
              marginInlineStart: 8,
            }}
          >
            {auto ? '⏸' : '▶'}
          </button>
        </div>

        {/* Description */}
        <div
          key={step}
          style={{
            padding: '20px 24px',
            background: `linear-gradient(135deg, ${cur.color}15, rgba(0,0,0,0.6))`,
            border: `1.5px solid ${cur.color}77`,
            borderInlineStart: `5px solid ${cur.color}`,
            borderRadius: 12,
            animation: 'fadeIn 0.6s',
          }}
        >
          <h3 style={{
            fontSize: 22,
            fontWeight: 900,
            color: cur.color,
            fontFamily: "'Playfair Display', serif",
            marginBottom: 10,
          }}>
            <span style={{ marginInlineEnd: 8 }}>{cur.icon}</span>
            {step + 1}. {t(cur.he, cur.en)}
          </h3>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.92)', lineHeight: 1.85 }}>
            {t(cur.desc_he, cur.desc_en)}
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes incomingNeutron {
          0% { transform: translateX(-100px); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateX(0); opacity: 0; }
        }
        @keyframes chainPulse {
          0%, 100% { opacity: 0.2; transform: scale(0.4); transform-origin: 270px 360px; }
          40% { opacity: 1; transform: scale(1.2); transform-origin: 270px 360px; }
          100% { opacity: 0.2; transform: scale(0.4); transform-origin: 270px 360px; }
        }
        @keyframes nucleusWobble {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(-2px, 1px) scale(1.05); }
          50% { transform: translate(2px, -1px) scale(0.95); }
          75% { transform: translate(-1px, 2px) scale(1.05); }
        }
        @keyframes fissionEmit-0 {
          0%, 70% { transform: translate(0, 0); opacity: 0; }
          75% { opacity: 1; }
          100% { transform: translate(60px, -40px); opacity: 0; }
        }
        @keyframes fissionEmit-1 {
          0%, 70% { transform: translate(0, 0); opacity: 0; }
          75% { opacity: 1; }
          100% { transform: translate(-50px, 50px); opacity: 0; }
        }
        @keyframes fissionEmit-2 {
          0%, 70% { transform: translate(0, 0); opacity: 0; }
          75% { opacity: 1; }
          100% { transform: translate(70px, 30px); opacity: 0; }
        }
        @keyframes steamFlow {
          0% { transform: translateX(-30px); opacity: 0; }
          30% { opacity: 1; }
          100% { transform: translateX(180px); opacity: 0; }
        }
      `}</style>
    </section>
  );
}
