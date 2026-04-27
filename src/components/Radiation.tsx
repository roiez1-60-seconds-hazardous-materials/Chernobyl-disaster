'use client';
import { useState, useEffect, useRef } from 'react';
import { C, ISOTOPES, DOSE_SCALE } from '@/lib/data';

// =====================================================================
// 4 DISPERSION PHASES — based on documented research:
// • De Cort et al. (1998) "Atlas of Caesium Deposition on Europe after Chernobyl"
// • IAEA Chernobyl Forum (2005)
// • WMO trajectory analysis · Pöllänen et al. (1997) Health Physics
// =====================================================================

type Phase = {
  n: number;
  days_he: string; days_en: string;
  title_he: string; title_en: string;
  desc_he: string; desc_en: string;
  // Polygon coords for contamination zone — [lng, lat] (GeoJSON order)
  zone: [number, number][];
  wind: { from: [number, number]; to: [number, number] };
  cities: string[];
  color: string;
};

const PHASES: Phase[] = [
  {
    n: 1,
    days_he: '26-27 באפריל',
    days_en: 'April 26-27',
    title_he: 'ענן ראשון: צפון-מערב לסקנדינביה',
    title_en: 'Plume 1: Northwest to Scandinavia',
    desc_he: 'הפליטה הראשונית בליל 26 באפריל. רוח דרום-מזרחית בגובה 1,500 מ׳ נושאת את הענן הרדיואקטיבי הסמיך מעל בלרוס, ליטא והים הבלטי לכיוון שבדיה. ב-28 באפריל בשעה 09:00 עובדי תחנת פורסמרק בשבדיה מזהים קרינה גבוהה על נעליהם — והעולם לומד על האסון.',
    desc_en: 'Initial release on the night of April 26. Southeast wind at 1,500m altitude carries the dense radioactive plume over Belarus, Lithuania, and the Baltic Sea toward Sweden. On April 28 at 09:00, workers at Forsmark plant in Sweden detect elevated radiation on their shoes — and the world learns of the disaster.',
    zone: [
      [30.1, 51.4], [31.0, 52.4], [32, 53.5], [29, 54.5], [27.6, 53.9], [25.3, 54.7],
      [24.1, 56.95], [24.75, 59.4], [25, 60.5], [22, 61], [18.2, 60.4], [17, 60.2],
      [18.1, 59.3], [16.5, 58.5], [19, 56.5], [22, 55], [25, 53.5], [28, 52], [30.1, 51.4],
    ],
    wind: { from: [30.1, 51.4], to: [18.2, 60.4] },
    cities: ['chernobyl', 'pripyat', 'gomel', 'minsk', 'vilnius', 'riga', 'tallinn', 'helsinki', 'stockholm', 'forsmark', 'oslo'],
    color: '#dc2626',
  },
  {
    n: 2,
    days_he: '28-30 באפריל',
    days_en: 'April 28-30',
    title_he: 'ענן שני: דרום-מערב למרכז אירופה',
    title_en: 'Plume 2: Southwest to Central Europe',
    desc_he: 'הרוח משתנה לכיוון מערב-דרום-מערב. הענן נע מעל פולין, צ׳כוסלובקיה, אוסטריה ודרום גרמניה. ב-29 באפריל ברלין, מינכן ווינה מזהים קרינה גבוהה. גשם מקומי בדרום בוואריה ואוסטריה מצמיד את החלקיקים לקרקע ויוצר "נקודות חמות" שנשארות עשרות שנים.',
    desc_en: 'Wind shifts to west-southwest. The plume moves over Poland, Czechoslovakia, Austria, and southern Germany. On April 29, Berlin, Munich, and Vienna detect elevated radiation. Local rain in southern Bavaria and Austria washes particles to the ground, creating "hotspots" persisting for decades.',
    zone: [
      [30.1, 51.4], [30.5, 50.4], [27, 49.5], [22, 49], [19, 47.5], [16.4, 48.2],
      [13, 47.5], [11.6, 48.1], [9, 49], [11, 50.5], [14.4, 50.1], [13.4, 52.5],
      [17, 53], [21, 52.5], [25, 52], [30.1, 51.4],
    ],
    wind: { from: [30.1, 51.4], to: [12, 48.5] },
    cities: ['chernobyl', 'kyiv', 'warsaw', 'prague', 'berlin', 'vienna', 'budapest', 'munich'],
    color: '#f97316',
  },
  {
    n: 3,
    days_he: '30 באפריל - 2 במאי',
    days_en: 'April 30 - May 2',
    title_he: 'ענן שלישי: מערב — איטליה, צרפת, בריטניה',
    title_en: 'Plume 3: West — Italy, France, Britain',
    desc_he: 'הענן ממשיך מערבה. מגיע לצפון איטליה (נקודות חמות בהרי האפנינים), שווייץ, חצי דרום של צרפת, ולראשונה — בריטניה. גשם מעל הרי וויילס ורמות סקוטלנד יוצר זיהום ארוך-טווח של עדרי כבשים — איסור שיווק נמשך עד 2012.',
    desc_en: 'The plume continues westward. Reaches northern Italy (Apennines hotspots), Switzerland, southern France, and for the first time — Britain. Rain over Welsh hills and Scottish highlands creates long-term sheep flock contamination — sales bans persisted until 2012.',
    zone: [
      [30.1, 51.4], [24, 50], [18, 48.5], [13, 47], [9, 46], [9.2, 45.5],
      [8.5, 47.4], [2.4, 48.9], [-0.1, 51.5], [-3.5, 53], [-2, 55], [5, 54],
      [12, 52], [20, 51], [30.1, 51.4],
    ],
    wind: { from: [30.1, 51.4], to: [5, 48] },
    cities: ['chernobyl', 'milan', 'zurich', 'paris', 'london', 'cardiff', 'amsterdam'],
    color: '#f59e0b',
  },
  {
    n: 4,
    days_he: '3-6 במאי',
    days_en: 'May 3-6',
    title_he: 'התפזרות גלובלית · נקודות חמות מגשם',
    title_en: 'Global dispersion · Rain hotspots',
    desc_he: 'הרוחות משתנות במהירות וצורות מערבולת. הענן המוחלש מתפזר בכל אירופה ומעבר לה. נקודות חמות מקומיות נוצרות בעקבות גשם — דרום בוואריה, רמות סקוטלנד, וויילס, מרכז צרפת, הרי האפנינים, נורווגיה. עקבות נמדדות עד אלסקה ויפן תוך 10 ימים.',
    desc_en: 'Winds shift rapidly forming vortices. The diluted plume disperses across all of Europe and beyond. Local hotspots form from rainfall — southern Bavaria, Scottish highlands, Wales, central France, Apennines, Norway. Trace levels measured as far as Alaska and Japan within 10 days.',
    zone: [],
    wind: { from: [30.1, 51.4], to: [0, 50] },
    cities: ['chernobyl', 'cardiff', 'munich', 'milan', 'paris', 'london', 'rome', 'madrid', 'lisbon'],
    color: '#a855f7',
  },
];

// Real geographic coordinates — [lng, lat]
const CITIES: Record<string, { lng: number; lat: number; he: string; en: string; sev: number }> = {
  chernobyl: { lng: 30.099, lat: 51.389, he: 'צ׳רנוביל', en: 'Chernobyl', sev: 5 },
  pripyat: { lng: 30.057, lat: 51.405, he: 'פריפיאט', en: 'Pripyat', sev: 5 },
  gomel: { lng: 30.99, lat: 52.43, he: 'גומל', en: 'Gomel', sev: 4 },
  kyiv: { lng: 30.523, lat: 50.45, he: 'קייב', en: 'Kyiv', sev: 3 },
  minsk: { lng: 27.567, lat: 53.9, he: 'מינסק', en: 'Minsk', sev: 3 },
  vilnius: { lng: 25.282, lat: 54.687, he: 'וילניוס', en: 'Vilnius', sev: 3 },
  riga: { lng: 24.1, lat: 56.95, he: 'ריגה', en: 'Riga', sev: 2 },
  tallinn: { lng: 24.75, lat: 59.43, he: 'טלין', en: 'Tallinn', sev: 2 },
  helsinki: { lng: 24.94, lat: 60.17, he: 'הלסינקי', en: 'Helsinki', sev: 2 },
  stockholm: { lng: 18.07, lat: 59.33, he: 'שטוקהולם', en: 'Stockholm', sev: 2 },
  forsmark: { lng: 18.18, lat: 60.4, he: 'פורסמרק', en: 'Forsmark', sev: 3 },
  oslo: { lng: 10.75, lat: 59.91, he: 'אוסלו', en: 'Oslo', sev: 1 },
  warsaw: { lng: 21.012, lat: 52.23, he: 'ורשה', en: 'Warsaw', sev: 3 },
  prague: { lng: 14.437, lat: 50.075, he: 'פראג', en: 'Prague', sev: 2 },
  vienna: { lng: 16.37, lat: 48.21, he: 'וינה', en: 'Vienna', sev: 2 },
  berlin: { lng: 13.405, lat: 52.52, he: 'ברלין', en: 'Berlin', sev: 2 },
  budapest: { lng: 19.04, lat: 47.5, he: 'בודפשט', en: 'Budapest', sev: 2 },
  munich: { lng: 11.576, lat: 48.137, he: 'מינכן', en: 'Munich', sev: 2 },
  zurich: { lng: 8.541, lat: 47.376, he: 'ציריך', en: 'Zurich', sev: 1 },
  milan: { lng: 9.19, lat: 45.46, he: 'מילאנו', en: 'Milan', sev: 2 },
  paris: { lng: 2.351, lat: 48.857, he: 'פריז', en: 'Paris', sev: 1 },
  london: { lng: -0.128, lat: 51.507, he: 'לונדון', en: 'London', sev: 1 },
  cardiff: { lng: -3.179, lat: 51.481, he: 'קרדיף', en: 'Cardiff', sev: 2 },
  amsterdam: { lng: 4.895, lat: 52.37, he: 'אמסטרדם', en: 'Amsterdam', sev: 1 },
  rome: { lng: 12.496, lat: 41.903, he: 'רומא', en: 'Rome', sev: 1 },
  madrid: { lng: -3.703, lat: 40.416, he: 'מדריד', en: 'Madrid', sev: 1 },
  lisbon: { lng: -9.139, lat: 38.722, he: 'ליסבון', en: 'Lisbon', sev: 1 },
};

// Documented Cs-137 rain hotspots (>40 kBq/m²)
const HOTSPOTS = [
  { lng: -3.78, lat: 52.5, he: 'הרי וויילס', en: 'Welsh Hills' },
  { lng: -5.0, lat: 56.8, he: 'רמות סקוטלנד', en: 'Scottish Highlands' },
  { lng: 11.2, lat: 47.5, he: 'דרום בוואריה', en: 'Southern Bavaria' },
  { lng: 11.0, lat: 44.0, he: 'הרי האפנינים', en: 'Apennines' },
  { lng: 3.0, lat: 45.0, he: 'מרכז צרפת', en: 'Central France' },
  { lng: 11.0, lat: 60.0, he: 'מרכז נורווגיה', en: 'Central Norway' },
];

const SEV_COLORS = ['#22c55e', '#06b6d4', '#f59e0b', '#f97316', '#dc2626', '#7f1d1d'];

export default function Radiation({ he, t }: { he: boolean; t: (h: string, e: string) => string }) {
  const [tab, setTab] = useState<'isotopes' | 'scale' | 'map'>('isotopes');

  const TABS = [
    { id: 'isotopes' as const, he: 'איזוטופים', en: 'Isotopes', icon: '☢' },
    { id: 'scale' as const, he: 'סקאלת קרינה', en: 'Dose Scale', icon: '📊' },
    { id: 'map' as const, he: 'מפת פיזור', en: 'Dispersion', icon: '🗺' },
  ];

  return (
    <section id="radiation" style={{ padding: '60px 16px 30px', position: 'relative' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 28, position: 'relative' }}>
          <div className="section-number" style={{ top: '-20px', insetInlineStart: '5%' }}>07</div>
          <div className="section-kicker">[ {t('סעיף שביעי · קרינה', 'PART SEVEN · RADIATION')} ]</div>
          <h2 className="section-title">{t('קרינה רדיואקטיבית', 'Radioactive Emissions')}</h2>
          <p className="section-subtitle">{t('5 איזוטופים · 12 רמות · 4 שלבי פיזור מתועדים', '5 isotopes · 12 levels · 4 documented phases')}</p>
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

        {tab === 'map' && <DispersionMap he={he} t={t} />}
      </div>
    </section>
  );
}

// =====================================================================
// MAPBOX DISPERSION MAP — light style for clarity
// =====================================================================
function DispersionMap({ he, t }: { he: boolean; t: (h: string, e: string) => string }) {
  const [phase, setPhase] = useState(1);
  const [auto, setAuto] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  const cur = PHASES[phase - 1];

  // Auto-play
  useEffect(() => {
    if (!auto) return;
    const id = setInterval(() => setPhase((p) => (p === 4 ? 1 : p + 1)), 7000);
    return () => clearInterval(id);
  }, [auto]);

  // Initialize map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token) {
      setMapError(he ? 'מפתח Mapbox חסר במשתני הסביבה' : 'Mapbox token not configured');
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const mapboxgl = (await import('mapbox-gl')).default;
        if (cancelled || !containerRef.current) return;

        mapboxgl.accessToken = token;

        const map = new mapboxgl.Map({
          container: containerRef.current,
          style: 'mapbox://styles/mapbox/light-v11', // LIGHT clear style
          center: [15, 53],
          zoom: 3.6,
          minZoom: 3,
          maxZoom: 6,
          attributionControl: true,
        });

        mapRef.current = map;

        map.on('load', () => {
          if (cancelled) return;

          // Add empty source for the dispersion polygon
          map.addSource('dispersion-zone', {
            type: 'geojson',
            data: { type: 'Feature', properties: {}, geometry: { type: 'Polygon', coordinates: [[]] } } as any,
          });

          // Filled polygon — translucent so countries beneath stay visible
          map.addLayer({
            id: 'dispersion-fill',
            type: 'fill',
            source: 'dispersion-zone',
            paint: {
              'fill-color': '#dc2626',
              'fill-opacity': 0.28,
            },
          });

          // Polygon outline
          map.addLayer({
            id: 'dispersion-outline',
            type: 'line',
            source: 'dispersion-zone',
            paint: {
              'line-color': '#dc2626',
              'line-width': 2,
              'line-opacity': 0.9,
            },
          });

          // Wind arrow source
          map.addSource('wind-arrow', {
            type: 'geojson',
            data: { type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: [] } } as any,
          });

          map.addLayer({
            id: 'wind-line',
            type: 'line',
            source: 'wind-arrow',
            paint: {
              'line-color': '#0a0e1a',
              'line-width': 3,
              'line-dasharray': [2, 2],
              'line-opacity': 0.85,
            },
          });

          // Hotspots source (only used in phase 4)
          map.addSource('hotspots', {
            type: 'geojson',
            data: { type: 'FeatureCollection', features: [] },
          });

          map.addLayer({
            id: 'hotspots-glow',
            type: 'circle',
            source: 'hotspots',
            paint: {
              'circle-radius': 22,
              'circle-color': '#dc2626',
              'circle-opacity': 0.25,
              'circle-blur': 0.6,
            },
          });

          map.addLayer({
            id: 'hotspots-core',
            type: 'circle',
            source: 'hotspots',
            paint: {
              'circle-radius': 7,
              'circle-color': '#dc2626',
              'circle-stroke-color': '#fff',
              'circle-stroke-width': 2,
            },
          });

          setMapReady(true);
        });

        map.on('error', (e: any) => {
          console.error('Mapbox error:', e);
          setMapError(he ? 'שגיאה בטעינת המפה' : 'Map loading error');
        });
      } catch (err) {
        console.error('Failed to load Mapbox:', err);
        setMapError(he ? 'נכשלה טעינת ספריית Mapbox' : 'Failed to load Mapbox library');
      }
    })();

    return () => {
      cancelled = true;
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [he]);

  // Update map content when phase changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;

    // Update polygon
    const zoneSource = map.getSource('dispersion-zone');
    if (zoneSource) {
      const polygon = cur.zone.length > 0 ? [cur.zone.concat([cur.zone[0]])] : [[]];
      zoneSource.setData({
        type: 'Feature',
        properties: {},
        geometry: { type: 'Polygon', coordinates: polygon },
      });
    }

    // Update fill color
    map.setPaintProperty('dispersion-fill', 'fill-color', cur.color);
    map.setPaintProperty('dispersion-outline', 'line-color', cur.color);

    // Update wind arrow
    const windSource = map.getSource('wind-arrow');
    if (windSource) {
      windSource.setData({
        type: 'Feature',
        properties: {},
        geometry: { type: 'LineString', coordinates: [cur.wind.from, cur.wind.to] },
      });
    }

    // Update hotspots (phase 4 only)
    const hotSource = map.getSource('hotspots');
    if (hotSource) {
      hotSource.setData({
        type: 'FeatureCollection',
        features: phase === 4 ? HOTSPOTS.map((h) => ({
          type: 'Feature',
          properties: { name: he ? h.he : h.en },
          geometry: { type: 'Point', coordinates: [h.lng, h.lat] },
        })) : [],
      });
    }

    // Clear old city markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    // Add city markers — affected ones highlighted
    (async () => {
      const mapboxgl = (await import('mapbox-gl')).default;

      Object.entries(CITIES).forEach(([key, city]) => {
        const isAffected = cur.cities.includes(key);
        const isEpicenter = key === 'chernobyl' || key === 'pripyat';
        const c = isEpicenter ? '#7f1d1d' : isAffected ? SEV_COLORS[city.sev] : '#94a3b8';
        const size = isEpicenter ? 18 : isAffected ? 14 : 8;

        const el = document.createElement('div');
        el.style.cssText = `
          width: ${size}px; height: ${size}px;
          border-radius: 50%;
          background: ${c};
          border: 2px solid #fff;
          box-shadow: 0 0 ${isAffected ? 14 : 4}px ${c}, 0 2px 4px rgba(0,0,0,0.4);
          cursor: pointer;
          ${isAffected ? 'animation: pulseAlert 2s infinite;' : ''}
        `;

        const popup = new mapboxgl.Popup({ offset: 14, closeButton: false }).setHTML(
          `<div style="font-family: Heebo, sans-serif; padding: 4px 6px;">
            <div style="font-weight: 800; color: ${c}; font-size: 13px;">${he ? city.he : city.en}</div>
            ${isAffected ? `<div style="font-size: 10px; color: #fff; margin-top: 2px;">${he ? 'מושפע בשלב זה' : 'Affected in this phase'}</div>` : ''}
          </div>`
        );

        const marker = new mapboxgl.Marker(el).setLngLat([city.lng, city.lat]).setPopup(popup).addTo(mapRef.current);
        markersRef.current.push(marker);
      });
    })();
  }, [phase, mapReady, he, cur, cur.cities, cur.color, cur.wind, cur.zone]);

  return (
    <div className="fade-in card" style={{ padding: 'clamp(12px, 2.5vw, 20px)' }}>
      {/* Phase navigator */}
      <div style={{ display: 'flex', gap: 6, justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
          {PHASES.map((p) => (
            <button key={p.n} onClick={() => { setPhase(p.n); setAuto(false); }} style={{
              padding: '8px 14px', fontSize: 12, fontWeight: 800,
              background: phase === p.n ? p.color + '33' : 'rgba(0,0,0,0.4)',
              color: phase === p.n ? '#fff' : 'rgba(255,255,255,0.7)',
              border: `1.5px solid ${phase === p.n ? p.color : 'rgba(255,255,255,0.12)'}`,
              borderRadius: 8, cursor: 'pointer',
              fontFamily: "'JetBrains Mono', monospace",
              boxShadow: phase === p.n ? `0 0 14px ${p.color}77` : 'none',
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

      {/* Map container */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: 'min(60vh, 500px)',
        minHeight: 360,
        borderRadius: 10,
        overflow: 'hidden',
        border: `1px solid ${C.gold}33`,
        background: '#e5e7eb', // light fallback while loading
      }}>
        <div ref={containerRef} style={{ position: 'absolute', inset: 0 }} />
        {mapError && (
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexDirection: 'column', gap: 8,
            background: '#1f2937', color: '#fff',
            padding: 20, textAlign: 'center',
          }}>
            <div style={{ fontSize: 28 }}>🗺</div>
            <div style={{ fontSize: 13, color: '#fbbf24' }}>{mapError}</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', maxWidth: 380, lineHeight: 1.6 }}>
              {t('יש להגדיר NEXT_PUBLIC_MAPBOX_TOKEN במשתני הסביבה של Vercel', 'NEXT_PUBLIC_MAPBOX_TOKEN must be set in Vercel environment variables')}
            </div>
          </div>
        )}
        {!mapReady && !mapError && (
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(229,231,235,0.95)', color: '#1f2937', fontSize: 13,
          }}>
            {t('טוען מפה...', 'Loading map...')}
          </div>
        )}
      </div>

      {/* Phase description */}
      <div className="fade-in" key={phase} style={{
        marginTop: 14,
        padding: '14px 18px',
        background: 'rgba(0,0,0,0.6)',
        border: `1px solid ${cur.color}77`,
        borderInlineStart: `4px solid ${cur.color}`,
        borderRadius: 10,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6, flexWrap: 'wrap', gap: 8 }}>
          <h3 style={{ fontSize: 16, fontWeight: 900, color: '#fff', fontFamily: "'Playfair Display', serif" }}>
            {t(`שלב ${cur.n}: ${cur.title_he}`, `Phase ${cur.n}: ${cur.title_en}`)}
          </h3>
          <div style={{ fontSize: 11, color: cur.color, fontFamily: "'JetBrains Mono', monospace", fontWeight: 800 }}>
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
        <LegendItem c="#dc2626" label={t('זיהום קיצוני', 'Extreme')} />
        <LegendItem c="#f97316" label={t('זיהום גבוה', 'Heavy')} />
        <LegendItem c="#f59e0b" label={t('בינוני', 'Moderate')} />
        <LegendItem c="#06b6d4" label={t('זוהה', 'Detected')} />
      </div>

      {/* Source attribution */}
      <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)', marginTop: 12, textAlign: 'center', fontFamily: "'JetBrains Mono', monospace", lineHeight: 1.7 }}>
        📚 {t(
          'מקורות: De Cort et al. (1998) Atlas of Cs-137 Deposition · IAEA Chernobyl Forum 2005 · WMO trajectory analysis · Pöllänen et al. (1997)',
          'Sources: De Cort et al. (1998) Atlas of Cs-137 Deposition · IAEA Chernobyl Forum 2005 · WMO trajectory analysis · Pöllänen et al. (1997)'
        )}
      </p>
    </div>
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
