'use client';
import { useState } from 'react';
import { C, ISOTOPES, DOSE_SCALE } from '@/lib/data';

// Cities with positions in SVG coordinates (custom Europe map projection)
const CITIES = [
  { he: 'צ׳רנוביל', en: 'Chernobyl', x: 600, y: 320, severity: 5, label_he: 'אפיצנטר', label_en: 'Ground Zero', delay: 0 },
  { he: 'פריפיאט', en: 'Pripyat', x: 605, y: 315, severity: 5, label_he: 'פונה כליל', label_en: 'Fully evacuated', delay: 0.1 },
  { he: 'גומל', en: 'Gomel', x: 580, y: 270, severity: 4, label_he: '1,480 kBq/m²', label_en: '1,480 kBq/m²', delay: 0.4 },
  { he: 'מינסק', en: 'Minsk', x: 540, y: 240, severity: 3, label_he: '185 kBq/m²', label_en: '185 kBq/m²', delay: 0.7 },
  { he: 'בריאנסק', en: 'Bryansk', x: 660, y: 270, severity: 4, label_he: '555 kBq/m²', label_en: '555 kBq/m²', delay: 0.5 },
  { he: 'קייב', en: 'Kyiv', x: 590, y: 360, severity: 3, label_he: '185 kBq/m²', label_en: '185 kBq/m²', delay: 0.3 },
  { he: 'ורשה', en: 'Warsaw', x: 460, y: 300, severity: 2, label_he: '37 kBq/m²', label_en: '37 kBq/m²', delay: 1.0 },
  { he: 'מוסקבה', en: 'Moscow', x: 700, y: 220, severity: 3, label_he: 'דוח רשמי', label_en: 'Official', delay: 0.6 },
  { he: 'ברלין', en: 'Berlin', x: 360, y: 280, severity: 1, label_he: 'זוהה', label_en: 'Detected', delay: 1.2 },
  { he: 'מינכן', en: 'Munich', x: 350, y: 340, severity: 1, label_he: 'זוהה', label_en: 'Detected', delay: 1.3 },
  { he: 'וינה', en: 'Vienna', x: 400, y: 360, severity: 1, label_he: 'זוהה', label_en: 'Detected', delay: 1.4 },
  { he: 'מילאנו', en: 'Milan', x: 320, y: 400, severity: 1, label_he: 'זוהה', label_en: 'Detected', delay: 1.5 },
  { he: 'לונדון', en: 'London', x: 200, y: 270, severity: 1, label_he: 'זוהה', label_en: 'Detected', delay: 1.7 },
  { he: 'פריז', en: 'Paris', x: 240, y: 320, severity: 1, label_he: 'זוהה', label_en: 'Detected', delay: 1.6 },
  { he: 'פורסמרק', en: 'Forsmark', x: 420, y: 160, severity: 2, label_he: '🚨 התראה ראשונה', label_en: '🚨 First alarm', delay: 1.8 },
  { he: 'אוסלו', en: 'Oslo', x: 360, y: 170, severity: 1, label_he: 'זוהה', label_en: 'Detected', delay: 1.9 },
  { he: 'הלסינקי', en: 'Helsinki', x: 470, y: 160, severity: 1, label_he: 'זוהה', label_en: 'Detected', delay: 1.85 },
];

const SEV_COLORS = ['#22c55e', '#06b6d4', '#f59e0b', '#f97316', '#dc2626', '#7f1d1d'];

export default function Radiation({ he, t }: { he: boolean; t: (h: string, e: string) => string }) {
  const [tab, setTab] = useState<'isotopes' | 'scale' | 'map'>('isotopes');
  const [hovered, setHovered] = useState<number | null>(null);

  const TABS = [
    { id: 'isotopes' as const, he: 'איזוטופים', en: 'Isotopes', icon: '☢' },
    { id: 'scale' as const, he: 'סקאלת קרינה', en: 'Dose Scale', icon: '📊' },
    { id: 'map' as const, he: 'מפת פיזור', en: 'Dispersion', icon: '🗺' },
  ];

  return (
    <section id="radiation" style={{ padding: '60px 16px 30px', position: 'relative' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 28, position: 'relative' }}>
          <div className="section-number" style={{ top: '-20px', insetInlineStart: '5%' }}>06</div>
          <div className="section-kicker">[ {t('סעיף שישי · קרינה', 'PART SIX · RADIATION')} ]</div>
          <h2 className="section-title">{t('קרינה רדיואקטיבית', 'Radioactive Emissions')}</h2>
          <p className="section-subtitle">{t('5 איזוטופים · 12 רמות · פיזור באירופה', '5 isotopes · 12 levels · European dispersion')}</p>
          <div className="gr" style={{ margin: '0 auto' }} />
        </div>

        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 20 }}>
          {TABS.map((tb) => (
            <button key={tb.id} onClick={() => setTab(tb.id)} className={`btn-gold ${tab === tb.id ? 'active' : ''}`}>
              <span style={{ fontSize: 14, marginInlineEnd: 5 }}>{tb.icon}</span>{t(tb.he, tb.en)}
            </button>
          ))}
        </div>

        {tab === 'isotopes' && (
          <div className="fade-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 }}>
            {ISOTOPES.map((iso, i) => (
              <div key={iso.symbol} className="hover-lift" style={{
                padding: '18px 20px',
                background: `linear-gradient(135deg, ${iso.color}15, rgba(0,0,0,0.5))`,
                border: `1px solid ${iso.color}55`,
                borderRadius: 14,
                animationDelay: `${i * 0.08}s`,
                animation: 'scaleIn 0.5s ease-out backwards',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
                  <h3 style={{ fontSize: 22, fontWeight: 900, color: iso.color, fontFamily: "'Playfair Display', serif", textShadow: `0 0 20px ${iso.color}66` }}>
                    {iso.symbol}
                  </h3>
                  <span style={{ fontSize: 10, color: C.gL, fontFamily: "'JetBrains Mono', monospace" }}>
                    T½ = {iso.half}
                  </span>
                </div>
                <div style={{ fontSize: 13, color: '#fff', fontWeight: 700, marginBottom: 8 }}>
                  {t(iso.he, iso.name)}
                </div>
                <div style={{ marginBottom: 8, padding: '6px 10px', background: 'rgba(0,0,0,0.4)', borderRadius: 6, fontSize: 11 }}>
                  <span style={{ color: 'rgba(255,255,255,0.5)' }}>{t('פוגע ב', 'Targets')}: </span>
                  <span style={{ color: '#fff', fontWeight: 700 }}>{t(iso.target_he, iso.target_en)}</span>
                </div>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.85)', lineHeight: 1.7, marginBottom: 8 }}>
                  {t(iso.danger_he, iso.danger_en)}
                </p>
                <div style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: iso.color, fontWeight: 700, padding: '4px 8px', background: `${iso.color}15`, borderRadius: 4, display: 'inline-block' }}>
                  {iso.released}
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'scale' && (
          <div className="fade-in card" style={{ padding: 20 }}>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginBottom: 14, textAlign: 'center' }}>
              {t('סקאלה לוגריתמית של מנות קרינה — מצילום שיניים ועד הליבה החשופה', 'Logarithmic dose scale — from dental X-ray to exposed core')}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {DOSE_SCALE.map((d, i) => {
                const riskC = d.risk === 'safe' ? C.green : d.risk === 'low' ? C.blue : d.risk === 'medium' ? C.amber : d.risk === 'high' ? '#f97316' : C.danger;
                const widthPct = Math.min(Math.log10(d.mSv + 1) / Math.log10(300001) * 100, 100);
                return (
                  <div key={i} className="fade-in" style={{ animationDelay: `${i * 0.04}s` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3, gap: 8, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 12, color: '#fff', fontWeight: 600 }}>
                        {t(d.label_he, d.label_en)}
                      </span>
                      <span style={{ fontSize: 11, color: riskC, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>
                        {d.mSv.toLocaleString()} mSv
                      </span>
                    </div>
                    <div style={{ height: 14, borderRadius: 4, background: 'rgba(0,0,0,0.4)', overflow: 'hidden' }}>
                      <div style={{
                        width: `${widthPct}%`, height: '100%',
                        background: `linear-gradient(90deg, ${riskC}, ${riskC}cc)`,
                        boxShadow: `0 0 12px ${riskC}88`,
                      }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {tab === 'map' && (
          <div className="fade-in card" style={{ padding: 'clamp(12px, 2.5vw, 20px)' }}>
            {/* Custom SVG Europe map */}
            <div style={{
              position: 'relative',
              width: '100%',
              aspectRatio: '16/10',
              background: 'radial-gradient(ellipse at 60% 55%, rgba(220,38,38,0.06), rgba(0,0,0,0.6) 70%)',
              borderRadius: 10,
              overflow: 'hidden',
              border: `1px solid ${C.gold}33`,
            }}>
              <svg viewBox="0 0 800 500" style={{ width: '100%', height: '100%', display: 'block' }}>
                <defs>
                  <radialGradient id="radEpicenter">
                    <stop offset="0%" stopColor="#dc2626" stopOpacity="0.7" />
                    <stop offset="50%" stopColor="#ef4444" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#dc2626" stopOpacity="0" />
                  </radialGradient>
                  <radialGradient id="radMid">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
                  </radialGradient>
                  <radialGradient id="radFar">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
                  </radialGradient>
                  <linearGradient id="landGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(20,30,55,0.6)" />
                    <stop offset="100%" stopColor="rgba(15,23,42,0.4)" />
                  </linearGradient>
                </defs>

                {/* Background ocean grid */}
                {[...Array(20)].map((_, i) => (
                  <line key={`hg-${i}`} x1="0" y1={i * 25} x2="800" y2={i * 25} stroke={C.gold} strokeWidth="0.3" opacity="0.05" />
                ))}
                {[...Array(32)].map((_, i) => (
                  <line key={`vg-${i}`} x1={i * 25} y1="0" x2={i * 25} y2="500" stroke={C.gold} strokeWidth="0.3" opacity="0.05" />
                ))}

                {/* Simplified Europe landmass shape */}
                <path d="
                  M 100 200 Q 150 180 200 190 L 230 200 L 250 220 L 270 240 L 280 280 L 270 320 L 250 340 L 230 360 L 220 400 L 200 420 L 180 440 L 160 430 L 140 410 L 120 380 L 100 350 Z
                  M 230 200 L 280 210 L 320 220 L 360 230 L 380 250 L 360 280 L 340 300 L 320 320 L 290 340 L 270 360 L 250 350 L 240 330 L 250 300 L 240 280 Z
                  M 320 220 L 380 215 L 440 220 L 480 230 L 520 240 L 560 250 L 590 270 L 620 290 L 640 310 L 650 340 L 640 360 L 610 370 L 580 380 L 540 380 L 500 380 L 460 380 L 420 380 L 390 370 L 380 350 L 370 330 L 380 310 L 390 290 L 380 270 L 360 250 Z
                  M 590 270 L 650 270 L 700 280 L 750 300 L 770 320 L 760 350 L 730 360 L 690 360 L 650 350 L 620 340 Z
                  M 380 130 L 420 140 L 470 150 L 510 160 L 540 180 L 530 210 L 500 220 L 460 230 L 420 220 L 390 200 L 380 170 Z
                  M 320 100 L 380 110 L 420 130 L 410 160 L 380 170 L 340 170 L 310 160 L 290 140 L 300 120 Z
                  M 290 140 L 240 150 L 200 170 L 180 200 L 200 210 L 230 200 L 260 190 L 290 180 Z
                "
                  fill="url(#landGrad)"
                  stroke={C.gold}
                  strokeWidth="1"
                  opacity="0.7"
                />

                {/* Radiation cloud — large gradient circles emanating from Chernobyl */}
                <circle cx="600" cy="320" r="180" fill="url(#radFar)" style={{ animation: 'pulseFire 4s infinite' }} />
                <circle cx="600" cy="320" r="120" fill="url(#radMid)" style={{ animation: 'pulseFire 3s infinite' }} />
                <circle cx="600" cy="320" r="60" fill="url(#radEpicenter)" style={{ animation: 'pulseFire 2s infinite' }} />

                {/* Wind dispersion arrows toward NW (Sweden direction) */}
                {[...Array(5)].map((_, i) => {
                  const startX = 595 - i * 8;
                  const startY = 315 - i * 6;
                  const angle = -65 + i * 3;
                  return (
                    <g key={`wind-${i}`} style={{ animation: `fadeIn 1s infinite ${i * 0.3}s` }}>
                      <path d={`M ${startX} ${startY} L ${startX - 80} ${startY - 60}`}
                            stroke="#06b6d4" strokeWidth="1.5" fill="none" opacity="0.6"
                            strokeDasharray="4 3" />
                    </g>
                  );
                })}

                {/* Expanding ring waves */}
                {[1, 2, 3].map((mul) => (
                  <circle key={`ring-${mul}`} cx="600" cy="320" r={40 * mul} fill="none"
                          stroke={mul === 1 ? C.danger : mul === 2 ? C.amber : C.blue}
                          strokeWidth="1.5" opacity="0.4"
                          style={{ animation: `ringPulse 4s infinite ${mul * 0.6}s` }} />
                ))}

                {/* Cities */}
                {CITIES.map((city, i) => {
                  const isHovered = hovered === i;
                  const c = SEV_COLORS[city.severity];
                  return (
                    <g key={i} onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)} style={{ cursor: 'pointer' }}>
                      {/* Pulse ring */}
                      <circle cx={city.x} cy={city.y} r="14" fill="none" stroke={c} strokeWidth="2" opacity="0.5"
                              style={{ animation: `ringPulse 2.5s infinite ${city.delay}s` }} />
                      {/* City dot */}
                      <circle cx={city.x} cy={city.y} r={isHovered ? 7 : 5}
                              fill={c} stroke="#fff" strokeWidth="1.5"
                              style={{ filter: `drop-shadow(0 0 ${isHovered ? 12 : 6}px ${c})`, transition: 'all 0.3s' }} />
                      {/* Label */}
                      <text x={city.x + (city.x > 400 ? 12 : -12)} y={city.y + 4}
                            fill={isHovered ? '#fff' : 'rgba(255,255,255,0.85)'}
                            fontSize={isHovered ? 11 : 9}
                            fontFamily="Heebo, sans-serif"
                            fontWeight={isHovered ? 700 : 500}
                            textAnchor={city.x > 400 ? 'start' : 'end'}
                            style={{ transition: 'all 0.2s' }}>
                        {he ? city.he : city.en}
                      </text>
                      {/* Tooltip on hover */}
                      {isHovered && (
                        <g>
                          <rect x={city.x - 65} y={city.y + 12} width="130" height="22" rx="3" fill="rgba(0,0,0,0.92)" stroke={c} strokeWidth="1" />
                          <text x={city.x} y={city.y + 27} fill={c} fontSize="9" fontFamily="JetBrains Mono" textAnchor="middle" fontWeight="700">
                            {he ? city.label_he : city.label_en}
                          </text>
                        </g>
                      )}
                    </g>
                  );
                })}

                {/* Compass */}
                <g transform="translate(40, 40)">
                  <circle cx="0" cy="0" r="22" fill="rgba(0,0,0,0.7)" stroke={C.gold} strokeWidth="1" />
                  <text x="0" y="-10" fill={C.gold} fontSize="9" fontFamily="JetBrains Mono" textAnchor="middle" fontWeight="700">N</text>
                  <text x="0" y="18" fill="rgba(255,255,255,0.5)" fontSize="9" fontFamily="JetBrains Mono" textAnchor="middle">S</text>
                  <text x="-13" y="3" fill="rgba(255,255,255,0.5)" fontSize="9" fontFamily="JetBrains Mono" textAnchor="middle">W</text>
                  <text x="13" y="3" fill="rgba(255,255,255,0.5)" fontSize="9" fontFamily="JetBrains Mono" textAnchor="middle">E</text>
                  <line x1="0" y1="-15" x2="0" y2="-2" stroke={C.danger} strokeWidth="1.5" />
                </g>

                {/* Title */}
                <text x="400" y="30" fill={C.gold} fontSize="13" fontFamily="JetBrains Mono" textAnchor="middle" fontWeight="700" letterSpacing="2">
                  {he ? 'פיזור Cs-137 באירופה · אפריל-מאי 1986' : 'Cs-137 European Dispersion · April-May 1986'}
                </text>
              </svg>
            </div>

            {/* Legend */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center', marginTop: 14, fontSize: 11, color: 'rgba(255,255,255,0.85)' }}>
              <LegendItem c="#7f1d1d" label={t('אפיצנטר', 'Ground Zero')} />
              <LegendItem c="#dc2626" label={t('זיהום קיצוני', 'Extreme')} />
              <LegendItem c="#f97316" label={t('זיהום גבוה', 'Heavy')} />
              <LegendItem c="#f59e0b" label={t('זיהום בינוני', 'Moderate')} />
              <LegendItem c="#06b6d4" label={t('זוהה בלבד', 'Detection only')} />
              <LegendItem c="#22c55e" label={t('ברקע', 'Background')} />
            </div>

            <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)', marginTop: 12, textAlign: 'center', fontFamily: "'JetBrains Mono', monospace", lineHeight: 1.7 }}>
              {t('🖱 הצבע על עיר למידע מפורט · רוח מהדרום-מזרח נשאה את הענן צפונה-מערבה אל סקנדינביה תוך 36 שעות', '🖱 Hover on city for details · SE wind carried plume NW to Scandinavia within 36 hours')}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

function LegendItem({ c, label }: { c: string; label: string }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
      <span style={{ width: 10, height: 10, borderRadius: '50%', background: c, boxShadow: `0 0 6px ${c}88` }} />
      <span>{label}</span>
    </span>
  );
}
