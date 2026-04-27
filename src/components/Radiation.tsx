'use client';
import { useState, useEffect } from 'react';
import { C, ISOTOPES, DOSE_SCALE } from '@/lib/data';

// =================== DISPERSION PHASES ===================
// Source: De Cort et al. (1998) "Atlas of Caesium Deposition on Europe after the Chernobyl Accident",
// IAEA Chernobyl Forum (2005), WMO trajectory analysis. NOT INVENTED.
const PHASES = [
  {
    n: 1,
    days_he: '26-27 באפריל',
    days_en: 'April 26-27',
    title_he: 'ענן ראשון: צפון-מערב',
    title_en: 'Plume 1: Northwest',
    direction: 'NW',
    desc_he: 'הפליטה הראשונית. רוח דרום-מזרחית נושאת את הענן הרדיואקטיבי מעל בלארוס וליטא לכיוון הים הבלטי וסקנדינביה. ב-28 באפריל עובדי תחנת פורסמרק בשבדיה מזהים קרינה על נעליהם — והעולם לומד על האסון.',
    desc_en: 'Initial release. Southeast wind carries radioactive plume over Belarus and Lithuania toward the Baltic Sea and Scandinavia. On April 28, workers at Forsmark plant in Sweden detect radiation on their shoes — and the world learns of the disaster.',
    cities: ['chernobyl', 'pripyat', 'gomel', 'minsk', 'vilnius', 'riga', 'tallinn', 'helsinki', 'stockholm', 'forsmark', 'oslo'],
    plume: { dx: -180, dy: -270, width: 280 }, // visual cone from Chernobyl
  },
  {
    n: 2,
    days_he: '28-30 באפריל',
    days_en: 'April 28-30',
    title_he: 'ענן שני: מרכז אירופה',
    title_en: 'Plume 2: Central Europe',
    direction: 'SW',
    desc_he: 'הרוח משתנה — הפעם נושאת את הפליטה לכיוון דרום-מערב. הענן הסמיך נע מעל פולין, צ׳כוסלובקיה, אוסטריה, חצי דרומי של גרמניה. ב-29 באפריל ברלין, מינכן ווינה מזהים קרינה גבוהה. גשם מקומי מצמיד את החלקיקים לקרקע ויוצר "נקודות חמות".',
    desc_en: 'Wind shifts — now carries emission southwest. The dense plume moves over Poland, Czechoslovakia, Austria, southern half of Germany. On April 29 Berlin, Munich and Vienna detect elevated radiation. Local rain washes out particles to ground, creating "hotspots."',
    cities: ['chernobyl', 'kyiv', 'warsaw', 'prague', 'berlin', 'vienna', 'budapest', 'munich'],
    plume: { dx: -260, dy: 80, width: 280 },
  },
  {
    n: 3,
    days_he: '30 באפריל - 2 במאי',
    days_en: 'April 30 - May 2',
    title_he: 'ענן שלישי: דרום ומערב אירופה',
    title_en: 'Plume 3: South & West Europe',
    direction: 'W',
    desc_he: 'הענן ממשיך מערבה ודרום-מערבה. מגיע לצפון איטליה (עם נקודות חמות בהרי האפנינים), שווייץ, חצי דרום של צרפת, ולראשונה — בריטניה. גשם מעל וויילס וסקוטלנד יוצר זיהום ארוך-טווח של עדרי כבשים.',
    desc_en: 'Plume continues west and southwest. Reaches northern Italy (with hotspots in Apennines), Switzerland, southern half of France, and for the first time — Britain. Rain over Wales and Scotland creates long-term sheep flock contamination.',
    cities: ['chernobyl', 'milan', 'zurich', 'paris', 'london', 'cardiff', 'amsterdam'],
    plume: { dx: -480, dy: 80, width: 360 },
  },
  {
    n: 4,
    days_he: '3-6 במאי',
    days_en: 'May 3-6',
    title_he: 'התפזרות גלובלית · נקודות חמות',
    title_en: 'Global Dispersion · Hotspots',
    direction: 'multi',
    desc_he: 'הרוחות משתנות במהירות. הענן המוחלש מתפזר בכל אירופה. נקודות חמות מקומיות נוצרות בעקבות גשם — דרום בוואריה, רמות סקוטלנד, וויילס, מרכז צרפת, צפון איטליה, חלקים מהבלקנים. עקבות נמדדות עד אלסקה ויפן.',
    desc_en: 'Winds shift rapidly. The diluted plume disperses across Europe. Local hotspots form from rainfall — southern Bavaria, Scottish highlands, Wales, central France, northern Italy, parts of the Balkans. Trace levels measured as far as Alaska and Japan.',
    cities: ['chernobyl', 'cardiff', 'munich', 'milan', 'paris', 'london', 'budapest', 'rome', 'madrid', 'lisbon'],
    plume: null,
    hotspots: [
      { x: 175, y: 340, r: 16 }, // Wales
      { x: 200, y: 290, r: 14 }, // Scotland
      { x: 437, y: 425, r: 18 }, // Bavaria
      { x: 400, y: 480, r: 15 }, // N. Italy
      { x: 280, y: 430, r: 13 }, // Central France
    ],
  },
];

// Cities at correct lat/lng → projected to viewBox
// Projection: x = (lng + 12) * 1000 / 54, y = (70 - lat) * 700 / 36
const CITIES: Record<string, { x: number; y: number; he: string; en: string; sev: number }> = {
  chernobyl: { x: 780, y: 361, he: 'צ׳רנוביל', en: 'Chernobyl', sev: 5 },
  pripyat: { x: 776, y: 358, he: 'פריפיאט', en: 'Pripyat', sev: 5 },
  gomel: { x: 796, y: 342, he: 'גומל', en: 'Gomel', sev: 4 },
  kyiv: { x: 787, y: 381, he: 'קייב', en: 'Kyiv', sev: 3 },
  minsk: { x: 733, y: 313, he: 'מינסק', en: 'Minsk', sev: 3 },
  moscow: { x: 918, y: 277, he: 'מוסקבה', en: 'Moscow', sev: 2 },
  bryansk: { x: 859, y: 327, he: 'בריאנסק', en: 'Bryansk', sev: 4 },
  vilnius: { x: 691, y: 297, he: 'וילניוס', en: 'Vilnius', sev: 3 },
  riga: { x: 668, y: 254, he: 'ריגה', en: 'Riga', sev: 2 },
  tallinn: { x: 680, y: 206, he: 'טלין', en: 'Tallinn', sev: 2 },
  helsinki: { x: 683, y: 191, he: 'הלסינקי', en: 'Helsinki', sev: 2 },
  stockholm: { x: 557, y: 208, he: 'שטוקהולם', en: 'Stockholm', sev: 2 },
  forsmark: { x: 560, y: 188, he: 'פורסמרק', en: 'Forsmark', sev: 2 },
  oslo: { x: 420, y: 197, he: 'אוסלו', en: 'Oslo', sev: 1 },
  warsaw: { x: 611, y: 346, he: 'ורשה', en: 'Warsaw', sev: 3 },
  prague: { x: 489, y: 387, he: 'פראג', en: 'Prague', sev: 2 },
  vienna: { x: 526, y: 424, he: 'וינה', en: 'Vienna', sev: 2 },
  berlin: { x: 470, y: 341, he: 'ברלין', en: 'Berlin', sev: 2 },
  budapest: { x: 574, y: 438, he: 'בודפשט', en: 'Budapest', sev: 2 },
  munich: { x: 437, y: 425, he: 'מינכן', en: 'Munich', sev: 2 },
  zurich: { x: 380, y: 440, he: 'ציריך', en: 'Zurich', sev: 1 },
  milan: { x: 393, y: 476, he: 'מילאנו', en: 'Milan', sev: 2 },
  paris: { x: 267, y: 410, he: 'פריז', en: 'Paris', sev: 1 },
  london: { x: 220, y: 361, he: 'לונדון', en: 'London', sev: 1 },
  cardiff: { x: 175, y: 361, he: 'קרדיף', en: 'Cardiff', sev: 1 },
  amsterdam: { x: 313, y: 343, he: 'אמסטרדם', en: 'Amsterdam', sev: 1 },
  rome: { x: 454, y: 547, he: 'רומא', en: 'Rome', sev: 1 },
  madrid: { x: 154, y: 575, he: 'מדריד', en: 'Madrid', sev: 1 },
  lisbon: { x: 54, y: 608, he: 'ליסבון', en: 'Lisbon', sev: 1 },
};

const SEV_COLORS = ['#22c55e', '#06b6d4', '#f59e0b', '#f97316', '#dc2626', '#7f1d1d'];

export default function Radiation({ he, t }: { he: boolean; t: (h: string, e: string) => string }) {
  const [tab, setTab] = useState<'isotopes' | 'scale' | 'map'>('isotopes');
  const [phase, setPhase] = useState(1);
  const [auto, setAuto] = useState(false);

  useEffect(() => {
    if (!auto) return;
    const id = setInterval(() => setPhase((p) => (p === 4 ? 1 : p + 1)), 6500);
    return () => clearInterval(id);
  }, [auto]);

  const cur = PHASES[phase - 1];

  const TABS = [
    { id: 'isotopes' as const, he: 'איזוטופים', en: 'Isotopes', icon: '☢' },
    { id: 'scale' as const, he: 'סקאלת קרינה', en: 'Dose Scale', icon: '📊' },
    { id: 'map' as const, he: 'מפת פיזור', en: 'Dispersion Map', icon: '🗺' },
  ];

  return (
    <section id="radiation" style={{ padding: '60px 16px 30px', position: 'relative' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 28, position: 'relative' }}>
          <div className="section-number" style={{ top: '-20px', insetInlineStart: '5%' }}>07</div>
          <div className="section-kicker">[ {t('סעיף שביעי · קרינה', 'PART SEVEN · RADIATION')} ]</div>
          <h2 className="section-title">{t('קרינה רדיואקטיבית', 'Radioactive Emissions')}</h2>
          <p className="section-subtitle">{t('5 איזוטופים · 12 רמות · 4 שלבי פיזור', '5 isotopes · 12 levels · 4 dispersion phases')}</p>
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
              {t('סקאלה לוגריתמית של מנות קרינה', 'Logarithmic dose scale')}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {DOSE_SCALE.map((d, i) => {
                const riskC = d.risk === 'safe' ? C.green : d.risk === 'low' ? C.blue : d.risk === 'medium' ? C.amber : d.risk === 'high' ? '#f97316' : C.danger;
                const widthPct = Math.min(Math.log10(d.mSv + 1) / Math.log10(300001) * 100, 100);
                return (
                  <div key={i} className="fade-in" style={{ animationDelay: `${i * 0.04}s` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3, gap: 8, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 12, color: '#fff', fontWeight: 600 }}>{t(d.label_he, d.label_en)}</span>
                      <span style={{ fontSize: 11, color: riskC, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>
                        {d.mSv.toLocaleString()} mSv
                      </span>
                    </div>
                    <div style={{ height: 14, borderRadius: 4, background: 'rgba(0,0,0,0.4)', overflow: 'hidden' }}>
                      <div style={{ width: `${widthPct}%`, height: '100%', background: `linear-gradient(90deg, ${riskC}, ${riskC}cc)`, boxShadow: `0 0 12px ${riskC}88` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {tab === 'map' && (
          <div className="fade-in card" style={{ padding: 'clamp(12px, 2.5vw, 20px)' }}>
            {/* Phase navigator */}
            <div style={{ display: 'flex', gap: 6, justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                {PHASES.map((p) => (
                  <button key={p.n} onClick={() => { setPhase(p.n); setAuto(false); }} style={{
                    padding: '7px 12px', fontSize: 11, fontWeight: 700,
                    background: phase === p.n ? `linear-gradient(135deg, ${C.danger}40, ${C.danger}15)` : 'rgba(0,0,0,0.4)',
                    color: phase === p.n ? '#fff' : 'rgba(255,255,255,0.7)',
                    border: `1px solid ${phase === p.n ? C.danger : 'rgba(255,255,255,0.12)'}`,
                    borderRadius: 6, cursor: 'pointer',
                    fontFamily: "'JetBrains Mono', monospace",
                    boxShadow: phase === p.n ? `0 0 12px ${C.danger}55` : 'none',
                    transition: 'all 0.25s',
                  }}>
                    {t('שלב', 'PHASE')} {p.n}
                  </button>
                ))}
              </div>
              <button onClick={() => setAuto((a) => !a)} className="btn-gold" style={{ background: auto ? `${C.danger}33` : undefined, color: auto ? '#fff' : undefined, borderColor: auto ? C.danger : undefined }}>
                {auto ? '⏸ ' + t('עצור', 'PAUSE') : '▶ ' + t('הפעל אוטומטי', 'AUTO-PLAY')}
              </button>
            </div>

            {/* Map */}
            <div style={{
              position: 'relative',
              width: '100%',
              aspectRatio: '10/7',
              background: 'radial-gradient(ellipse at center, rgba(20,30,55,0.5) 0%, rgba(0,0,0,0.7) 100%)',
              borderRadius: 10,
              overflow: 'hidden',
              border: `1px solid ${C.gold}33`,
            }}>
              <EuropeMap phase={cur} he={he} />
            </div>

            {/* Phase description */}
            <div className="fade-in" key={phase} style={{
              marginTop: 14,
              padding: '14px 18px',
              background: 'rgba(0,0,0,0.55)',
              border: `1px solid ${C.danger}55`,
              borderInlineStart: `4px solid ${C.danger}`,
              borderRadius: 10,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6, flexWrap: 'wrap', gap: 8 }}>
                <h3 style={{ fontSize: 16, fontWeight: 900, color: '#fff', fontFamily: "'Playfair Display', serif" }}>
                  {t(`שלב ${cur.n}: ${cur.title_he}`, `Phase ${cur.n}: ${cur.title_en}`)}
                </h3>
                <div style={{ fontSize: 11, color: C.gold, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>
                  {t(cur.days_he, cur.days_en)}
                </div>
              </div>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.92)', lineHeight: 1.85 }}>
                {t(cur.desc_he, cur.desc_en)}
              </p>
            </div>

            {/* Legend */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center', marginTop: 14, fontSize: 11, color: 'rgba(255,255,255,0.85)' }}>
              <LegendItem c="#7f1d1d" label={t('אפיצנטר', 'Ground Zero')} />
              <LegendItem c="#dc2626" label={t('קיצוני', 'Extreme')} />
              <LegendItem c="#f97316" label={t('גבוה', 'Heavy')} />
              <LegendItem c="#f59e0b" label={t('בינוני', 'Moderate')} />
              <LegendItem c="#06b6d4" label={t('זוהה', 'Detected')} />
            </div>

            {/* Source attribution */}
            <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)', marginTop: 12, textAlign: 'center', fontFamily: "'JetBrains Mono', monospace", lineHeight: 1.7 }}>
              📚 {t(
                'מקור: De Cort et al. (1998) Atlas of Cs-137 Deposition · IAEA Chernobyl Forum 2005 · WMO trajectory analysis',
                'Source: De Cort et al. (1998) Atlas of Cs-137 Deposition · IAEA Chernobyl Forum 2005 · WMO trajectory analysis'
              )}
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

// =================== EUROPE MAP — geographically accurate simplified ===================
function EuropeMap({ phase, he }: { phase: typeof PHASES[number]; he: boolean }) {
  return (
    <svg viewBox="0 0 1000 700" style={{ width: '100%', height: '100%', display: 'block' }}>
      <defs>
        <linearGradient id="seaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0a1628" />
          <stop offset="100%" stopColor="#020617" />
        </linearGradient>
        <linearGradient id="landGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1f2937" />
          <stop offset="100%" stopColor="#111827" />
        </linearGradient>
        <radialGradient id="plumeRed">
          <stop offset="0%" stopColor="#dc2626" stopOpacity="0.6" />
          <stop offset="40%" stopColor="#ef4444" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#dc2626" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="plumeOrange">
          <stop offset="0%" stopColor="#f97316" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="plumeYellow">
          <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="hotspot">
          <stop offset="0%" stopColor="#dc2626" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#dc2626" stopOpacity="0" />
        </radialGradient>
        <filter id="softGlow"><feGaussianBlur stdDeviation="6" /></filter>
      </defs>

      {/* Sea */}
      <rect width="1000" height="700" fill="url(#seaGrad)" />

      {/* Subtle grid */}
      {[...Array(15)].map((_, i) => (
        <line key={`h-${i}`} x1="0" y1={i * 50} x2="1000" y2={i * 50} stroke={C.gold} strokeWidth="0.4" opacity="0.04" />
      ))}
      {[...Array(20)].map((_, i) => (
        <line key={`v-${i}`} x1={i * 50} y1="0" x2={i * 50} y2="700" stroke={C.gold} strokeWidth="0.4" opacity="0.04" />
      ))}

      {/* === EUROPE LAND MASS === */}
      {/* Iberian peninsula (Spain + Portugal) */}
      <path d="M 30 600 L 50 580 L 70 575 L 85 565 L 100 555 L 130 565 L 160 575 L 200 590 L 230 600 L 250 615 L 230 640 L 195 650 L 165 655 L 130 650 L 100 645 L 70 640 L 45 620 Z" fill="url(#landGrad)" stroke={C.gold} strokeWidth="0.8" opacity="0.85" />
      
      {/* France */}
      <path d="M 200 410 L 230 400 L 260 395 L 290 400 L 320 410 L 340 425 L 350 450 L 345 480 L 330 510 L 310 530 L 280 540 L 250 545 L 220 540 L 200 525 L 195 500 L 200 470 L 195 440 Z" fill="url(#landGrad)" stroke={C.gold} strokeWidth="0.8" opacity="0.85" />

      {/* UK + Ireland */}
      <path d="M 130 280 L 145 270 L 165 265 L 180 270 L 195 285 L 200 305 L 195 330 L 185 350 L 175 365 L 165 370 L 155 365 L 145 350 L 140 330 L 135 305 Z" fill="url(#landGrad)" stroke={C.gold} strokeWidth="0.8" opacity="0.85" />
      <path d="M 95 320 L 110 315 L 120 320 L 125 340 L 120 360 L 110 365 L 100 360 L 92 345 L 90 330 Z" fill="url(#landGrad)" stroke={C.gold} strokeWidth="0.8" opacity="0.85" />

      {/* Scandinavia (Norway + Sweden + Finland) */}
      <path d="M 380 100 L 410 90 L 440 95 L 470 110 L 490 125 L 510 145 L 525 170 L 540 200 L 555 230 L 570 255 L 580 280 L 575 295 L 555 285 L 530 275 L 510 265 L 495 245 L 480 225 L 465 205 L 450 185 L 430 165 L 415 145 L 395 125 Z" fill="url(#landGrad)" stroke={C.gold} strokeWidth="0.8" opacity="0.85" />
      {/* Finland */}
      <path d="M 620 110 L 650 100 L 680 105 L 710 115 L 720 145 L 725 175 L 715 205 L 695 220 L 670 215 L 645 200 L 625 175 L 615 145 Z" fill="url(#landGrad)" stroke={C.gold} strokeWidth="0.8" opacity="0.85" />

      {/* Central Europe (Germany, Poland, Czech, Austria) */}
      <path d="M 360 290 L 400 280 L 440 275 L 480 280 L 520 290 L 560 305 L 590 320 L 615 340 L 625 365 L 620 395 L 605 420 L 580 440 L 550 450 L 520 455 L 490 450 L 460 440 L 430 425 L 405 405 L 385 380 L 370 350 L 360 320 Z" fill="url(#landGrad)" stroke={C.gold} strokeWidth="0.8" opacity="0.85" />

      {/* Italy peninsula */}
      <path d="M 380 460 L 400 460 L 415 470 L 425 490 L 440 520 L 450 550 L 460 575 L 465 590 L 460 600 L 450 595 L 440 580 L 425 555 L 410 525 L 395 495 L 385 475 Z" fill="url(#landGrad)" stroke={C.gold} strokeWidth="0.8" opacity="0.85" />

      {/* Belarus + Ukraine */}
      <path d="M 615 280 L 660 275 L 700 280 L 740 290 L 780 305 L 820 320 L 850 340 L 870 365 L 880 395 L 870 425 L 845 445 L 815 455 L 780 460 L 745 455 L 715 445 L 685 430 L 655 415 L 630 395 L 615 370 L 605 345 L 600 315 Z" fill="url(#landGrad)" stroke={C.gold} strokeWidth="0.8" opacity="0.85" />

      {/* Russia (western part) */}
      <path d="M 850 200 L 900 190 L 945 200 L 975 220 L 985 250 L 990 290 L 985 330 L 970 365 L 945 380 L 910 375 L 880 360 L 860 335 L 855 305 L 855 270 L 850 235 Z" fill="url(#landGrad)" stroke={C.gold} strokeWidth="0.8" opacity="0.85" />

      {/* Baltics (Estonia, Latvia, Lithuania) */}
      <path d="M 660 215 L 690 220 L 715 230 L 720 260 L 715 285 L 700 305 L 680 310 L 660 295 L 650 275 L 655 245 Z" fill="url(#landGrad)" stroke={C.gold} strokeWidth="0.8" opacity="0.85" />

      {/* Denmark */}
      <path d="M 440 260 L 460 255 L 470 270 L 465 285 L 450 290 L 435 280 L 432 268 Z" fill="url(#landGrad)" stroke={C.gold} strokeWidth="0.8" opacity="0.85" />

      {/* Balkans */}
      <path d="M 510 460 L 550 455 L 590 460 L 630 470 L 660 485 L 685 505 L 695 530 L 685 555 L 660 575 L 625 580 L 590 575 L 560 565 L 535 550 L 515 530 L 505 505 L 503 480 Z" fill="url(#landGrad)" stroke={C.gold} strokeWidth="0.8" opacity="0.85" />

      {/* Greece */}
      <path d="M 615 595 L 645 590 L 670 605 L 680 625 L 670 645 L 645 650 L 620 640 L 610 620 Z" fill="url(#landGrad)" stroke={C.gold} strokeWidth="0.8" opacity="0.85" />

      {/* === COUNTRY LABELS === */}
      <CountryLabels he={he} />

      {/* === RADIATION PLUME — phase-specific === */}
      {phase.plume && (
        <g style={{ animation: 'fadeIn 1s ease-out' }}>
          {/* Big plume gradient ellipse from Chernobyl */}
          <ellipse
            cx={780 + phase.plume.dx / 2}
            cy={361 + phase.plume.dy / 2}
            rx={Math.abs(phase.plume.dx) / 2 + 80}
            ry={Math.abs(phase.plume.dy) / 2 + 60}
            fill="url(#plumeRed)"
            transform={`rotate(${(Math.atan2(phase.plume.dy, phase.plume.dx) * 180) / Math.PI} ${780 + phase.plume.dx / 2} ${361 + phase.plume.dy / 2})`}
            style={{ animation: 'pulseFire 3s infinite' }}
          />
          {/* Outer plume */}
          <ellipse
            cx={780 + phase.plume.dx / 2}
            cy={361 + phase.plume.dy / 2}
            rx={Math.abs(phase.plume.dx) / 2 + 130}
            ry={Math.abs(phase.plume.dy) / 2 + 100}
            fill="url(#plumeYellow)"
            transform={`rotate(${(Math.atan2(phase.plume.dy, phase.plume.dx) * 180) / Math.PI} ${780 + phase.plume.dx / 2} ${361 + phase.plume.dy / 2})`}
          />

          {/* Wind direction arrow */}
          <PlumeArrow startX={780} startY={361} dx={phase.plume.dx} dy={phase.plume.dy} />

          {/* Animated particles flowing along plume */}
          {[...Array(12)].map((_, i) => {
            const t = i / 12;
            return (
              <circle key={`particle-${i}`}
                cx={780 + phase.plume.dx * t}
                cy={361 + phase.plume.dy * t}
                r={3 + Math.random() * 2}
                fill="#fbbf24"
                opacity="0.6"
                style={{ animation: `bubbleUp ${2 + Math.random() * 2}s infinite ${i * 0.15}s` }} />
            );
          })}
        </g>
      )}

      {/* Phase 4 hotspots */}
      {phase.hotspots && phase.hotspots.map((h, i) => (
        <g key={`hot-${i}`} style={{ animation: 'fadeIn 1s ease-out' }}>
          <circle cx={h.x} cy={h.y} r={h.r * 2} fill="url(#hotspot)" style={{ animation: 'pulseFire 2.5s infinite' }} />
          <circle cx={h.x} cy={h.y} r={h.r} fill="#dc2626" opacity="0.6" />
          <text x={h.x} y={h.y + 4} fill="#fff" fontSize="9" textAnchor="middle" fontWeight="900">!</text>
        </g>
      ))}

      {/* === CITIES === */}
      {Object.entries(CITIES).map(([key, city]) => {
        const isAffected = phase.cities.includes(key);
        const isEpicenter = key === 'chernobyl' || key === 'pripyat';
        const c = isEpicenter ? '#7f1d1d' : isAffected ? SEV_COLORS[city.sev] : 'rgba(148,163,184,0.4)';
        const r = isEpicenter ? 7 : isAffected ? 5 : 3;
        return (
          <g key={key} style={{ transition: 'all 0.6s' }}>
            {isAffected && (
              <circle cx={city.x} cy={city.y} r="14" fill="none" stroke={c} strokeWidth="1.5" opacity="0.5"
                      style={{ animation: 'ringPulse 2.5s infinite' }} />
            )}
            <circle cx={city.x} cy={city.y} r={r}
                    fill={c}
                    stroke="#fff"
                    strokeWidth={isAffected ? 1.2 : 0.5}
                    style={{ filter: isAffected ? `drop-shadow(0 0 6px ${c})` : 'none', transition: 'all 0.6s' }} />
            {/* Label — only show for epicenter and affected */}
            {(isEpicenter || (isAffected && city.sev >= 2)) && (
              <text x={city.x + (city.x > 500 ? 9 : -9)} y={city.y + 4}
                    fill={isAffected ? '#fff' : 'rgba(255,255,255,0.6)'}
                    fontSize={isEpicenter ? 11 : 10}
                    fontFamily="Heebo, sans-serif"
                    fontWeight={isEpicenter ? 800 : 600}
                    textAnchor={city.x > 500 ? 'start' : 'end'}>
                {he ? city.he : city.en}
              </text>
            )}
          </g>
        );
      })}

      {/* === COMPASS === */}
      <g transform="translate(50, 60)">
        <circle cx="0" cy="0" r="26" fill="rgba(0,0,0,0.7)" stroke={C.gold} strokeWidth="1" />
        <text x="0" y="-12" fill={C.gold} fontSize="10" fontFamily="JetBrains Mono" textAnchor="middle" fontWeight="900">N</text>
        <text x="0" y="20" fill="rgba(255,255,255,0.5)" fontSize="9" fontFamily="JetBrains Mono" textAnchor="middle">S</text>
        <text x="-15" y="3" fill="rgba(255,255,255,0.5)" fontSize="9" fontFamily="JetBrains Mono" textAnchor="middle">W</text>
        <text x="15" y="3" fill="rgba(255,255,255,0.5)" fontSize="9" fontFamily="JetBrains Mono" textAnchor="middle">E</text>
        <line x1="0" y1="-18" x2="0" y2="-3" stroke={C.danger} strokeWidth="1.5" />
      </g>

      {/* Title */}
      <text x="500" y="30" fill={C.gold} fontSize="13" fontFamily="JetBrains Mono" textAnchor="middle" fontWeight="700" letterSpacing="2">
        {he ? `שלב ${phase.n} · ${phase.title_he}` : `PHASE ${phase.n} · ${phase.title_en}`}
      </text>
      <text x="500" y="48" fill={C.gL} fontSize="10" fontFamily="JetBrains Mono" textAnchor="middle" letterSpacing="1.5">
        {he ? phase.days_he : phase.days_en}
      </text>
    </svg>
  );
}

function PlumeArrow({ startX, startY, dx, dy }: { startX: number; startY: number; dx: number; dy: number }) {
  const endX = startX + dx;
  const endY = startY + dy;
  const angle = Math.atan2(dy, dx);
  const arrowSize = 12;

  // Arrowhead points
  const ah1x = endX - arrowSize * Math.cos(angle - 0.4);
  const ah1y = endY - arrowSize * Math.sin(angle - 0.4);
  const ah2x = endX - arrowSize * Math.cos(angle + 0.4);
  const ah2y = endY - arrowSize * Math.sin(angle + 0.4);

  return (
    <g>
      <line x1={startX} y1={startY} x2={endX} y2={endY} stroke="#fbbf24" strokeWidth="2" strokeDasharray="6 4" opacity="0.85" style={{ animation: 'flowDS 2s linear infinite' }} />
      <polygon points={`${endX},${endY} ${ah1x},${ah1y} ${ah2x},${ah2y}`} fill="#fbbf24" opacity="0.85" />
    </g>
  );
}

function CountryLabels({ he }: { he: boolean }) {
  const labels = [
    { x: 130, y: 615, he: 'ספרד', en: 'SPAIN' },
    { x: 270, y: 480, he: 'צרפת', en: 'FRANCE' },
    { x: 165, y: 320, he: 'בריטניה', en: 'UK' },
    { x: 460, y: 355, he: 'גרמניה', en: 'GERMANY' },
    { x: 615, y: 365, he: 'פולין', en: 'POLAND' },
    { x: 740, y: 360, he: 'אוקראינה', en: 'UKRAINE' },
    { x: 720, y: 305, he: 'בלארוס', en: 'BELARUS' },
    { x: 920, y: 270, he: 'רוסיה', en: 'RUSSIA' },
    { x: 470, y: 175, he: 'נורבגיה', en: 'NORWAY' },
    { x: 535, y: 215, he: 'שוודיה', en: 'SWEDEN' },
    { x: 670, y: 145, he: 'פינלנד', en: 'FINLAND' },
    { x: 415, y: 530, he: 'איטליה', en: 'ITALY' },
    { x: 570, y: 510, he: 'בלקנים', en: 'BALKANS' },
    { x: 645, y: 625, he: 'יוון', en: 'GREECE' },
    { x: 685, y: 270, he: 'ב.', en: 'BAL.' },
  ];
  return (
    <g>
      {labels.map((l, i) => (
        <text key={i} x={l.x} y={l.y}
              fill="rgba(200,164,78,0.45)"
              fontSize="9"
              fontFamily="JetBrains Mono"
              textAnchor="middle"
              fontWeight="700"
              letterSpacing="1.5"
              style={{ pointerEvents: 'none' }}>
          {he ? l.he : l.en}
        </text>
      ))}
    </g>
  );
}
