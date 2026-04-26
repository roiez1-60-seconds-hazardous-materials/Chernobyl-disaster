'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import mapboxgl from 'mapbox-gl';

const C = { gold: '#c8a44e', gL: '#e8d5a0', danger: '#ef4444', blue: '#06b6d4', green: '#22c55e', amber: '#f59e0b' };

const CHERNOBYL: [number, number] = [30.0987, 51.3890];

const POINTS = [
  { name_he: 'צ׳רנוביל (אפיצנטר)', name_en: 'Chernobyl (epicenter)', coord: [30.0987, 51.3890], dose: 'extreme', value: '300+ Sv/h', date: '26/4 01:30' },
  { name_he: 'פריפיאט', name_en: 'Pripyat', coord: [30.0489, 51.4053], dose: 'extreme', value: '600 mSv/h', date: '26/4 06:00' },
  { name_he: 'קייב', name_en: 'Kyiv', coord: [30.5234, 50.4501], dose: 'high', value: '~20 μSv/h', date: '27/4' },
  { name_he: 'מינסק (בלארוס)', name_en: 'Minsk, Belarus', coord: [27.5615, 53.9006], dose: 'high', value: 'fallout zone', date: '27-28/4' },
  { name_he: 'גומל (בלארוס)', name_en: 'Gomel, Belarus', coord: [30.9754, 52.4345], dose: 'extreme', value: 'major fallout', date: '27/4' },
  { name_he: 'פורסמרק (שבדיה)', name_en: 'Forsmark, Sweden', coord: [18.1667, 60.4061], dose: 'medium', value: 'first detected', date: '28/4 09:00' },
  { name_he: 'הלסינקי', name_en: 'Helsinki', coord: [24.9384, 60.1699], dose: 'medium', value: 'detected', date: '28/4' },
  { name_he: 'ורשה', name_en: 'Warsaw', coord: [21.0122, 52.2297], dose: 'medium', value: 'I-131 detected', date: '28-29/4' },
  { name_he: 'ברלין מערב', name_en: 'West Berlin', coord: [13.4050, 52.5200], dose: 'low', value: 'detected', date: '30/4' },
  { name_he: 'מינכן', name_en: 'Munich', coord: [11.5820, 48.1351], dose: 'medium', value: 'rain hotspot', date: '1/5' },
  { name_he: 'ברן (שווייץ)', name_en: 'Bern, Switzerland', coord: [7.4474, 46.9480], dose: 'low', value: 'detected', date: '1-2/5' },
  { name_he: 'פריז', name_en: 'Paris', coord: [2.3522, 48.8566], dose: 'low', value: 'detected', date: '1/5' },
  { name_he: 'רומא', name_en: 'Rome', coord: [12.4964, 41.9028], dose: 'low', value: 'detected', date: '2/5' },
  { name_he: 'לונדון', name_en: 'London', coord: [-0.1276, 51.5072], dose: 'low', value: 'detected', date: '2/5' },
  { name_he: 'אדינבורו (סקוטלנד)', name_en: 'Edinburgh', coord: [-3.1883, 55.9533], dose: 'medium', value: 'sheep contamination', date: '3/5' },
];

const DOSE_COLORS: Record<string, string> = {
  extreme: '#dc2626',
  high: '#f59e0b',
  medium: '#fbbf24',
  low: '#22c55e',
};

export default function RadiationMapPage() {
  const [lang, setLang] = useState<'he' | 'en'>('he');
  const [showZones, setShowZones] = useState(true);
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [tokenMissing, setTokenMissing] = useState(false);
  const he = lang === 'he';
  const t = (h: string, e: string) => (he ? h : e);

  useEffect(() => {
    if (map.current || !mapContainer.current) return;
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token) {
      setTokenMissing(true);
      return;
    }
    mapboxgl.accessToken = token;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [20, 52],
      zoom: 3.5,
      attributionControl: false,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    map.current.addControl(new mapboxgl.AttributionControl({ compact: true }));

    map.current.on('load', () => {
      if (!map.current) return;

      POINTS.forEach((p) => {
        const el = document.createElement('div');
        el.style.width = '14px';
        el.style.height = '14px';
        el.style.borderRadius = '50%';
        el.style.background = DOSE_COLORS[p.dose];
        el.style.border = '2px solid #fff';
        el.style.boxShadow = `0 0 16px ${DOSE_COLORS[p.dose]}`;
        el.style.cursor = 'pointer';
        if (p.dose === 'extreme') el.style.animation = 'pulseAlert 1.5s infinite';

        const popup = new mapboxgl.Popup({ offset: 18, closeButton: false }).setHTML(`
          <div style="font-family:'Heebo',sans-serif;padding:4px;min-width:180px;">
            <div style="font-size:13px;font-weight:800;color:#c8a44e;margin-bottom:4px;">${he ? p.name_he : p.name_en}</div>
            <div style="font-size:11px;color:${DOSE_COLORS[p.dose]};font-family:monospace;margin-bottom:2px;">${p.value}</div>
            <div style="font-size:10px;color:#94a3b8;font-family:monospace;">${p.date}</div>
          </div>
        `);

        new mapboxgl.Marker(el).setLngLat(p.coord as [number, number]).setPopup(popup).addTo(map.current!);
      });

      // Exclusion zone circles
      map.current.addSource('zone', {
        type: 'geojson',
        data: { type: 'Feature', geometry: { type: 'Point', coordinates: CHERNOBYL }, properties: {} },
      });

      map.current.addLayer({
        id: 'zone30-circle',
        type: 'circle',
        source: 'zone',
        paint: {
          'circle-radius': { stops: [[0, 0], [10, 200]], base: 2 },
          'circle-color': '#dc2626',
          'circle-opacity': 0.15,
          'circle-stroke-color': '#dc2626',
          'circle-stroke-width': 2,
          'circle-stroke-opacity': 0.7,
        },
      });

      map.current.addLayer({
        id: 'zone10-circle',
        type: 'circle',
        source: 'zone',
        paint: {
          'circle-radius': { stops: [[0, 0], [10, 67]], base: 2 },
          'circle-color': '#7f1d1d',
          'circle-opacity': 0.3,
          'circle-stroke-color': '#fbbf24',
          'circle-stroke-width': 2,
          'circle-stroke-opacity': 0.8,
        },
      });

      setMapReady(true);
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, [he]);

  useEffect(() => {
    if (!map.current || !mapReady) return;
    ['zone30-circle', 'zone10-circle'].forEach((id) => {
      if (map.current!.getLayer(id)) {
        map.current!.setLayoutProperty(id, 'visibility', showZones ? 'visible' : 'none');
      }
    });
  }, [showZones, mapReady]);

  return (
    <div dir={he ? 'rtl' : 'ltr'} className="mh" style={{ minHeight: '100vh' }}>
      <div style={{ position: 'relative', zIndex: 1, maxWidth: 1200, margin: '0 auto', padding: '20px 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 14px', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(200,164,78,0.25)', borderRadius: 8, textDecoration: 'none' }}>
            <span style={{ color: C.gold, fontSize: 16 }}>{he ? '→' : '←'}</span>
            <div>
              <div style={{ fontSize: 11, fontWeight: 800, color: C.gold, letterSpacing: '0.15em' }}>60 {he ? 'שניות חומ״ס' : 'SEC HAZMAT'}</div>
              <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.5)', fontFamily: 'monospace' }}>← {t('חזרה', 'BACK')}</div>
            </div>
          </Link>
          <button onClick={() => setLang((l) => (l === 'he' ? 'en' : 'he'))} style={{ padding: '6px 12px', fontSize: 11, fontWeight: 800, background: 'rgba(200,164,78,0.15)', color: C.gold, border: '1px solid rgba(200,164,78,0.3)', borderRadius: 6, cursor: 'pointer', fontFamily: 'monospace' }}>{he ? 'EN' : 'עב'}</button>
        </div>

        <div style={{ textAlign: 'center', padding: '8px 0 22px' }} className="fade-in">
          <div style={{ display: 'inline-block', border: '1px solid rgba(200,164,78,0.4)', padding: '3px 16px', color: C.gold, fontSize: 10, fontWeight: 700, letterSpacing: '0.3em', marginBottom: 12, fontFamily: 'monospace', background: 'rgba(200,164,78,0.05)' }}>
            [ {he ? 'מפה אינטראקטיבית' : 'INTERACTIVE MAP'} ]
          </div>
          <h1 style={{ fontSize: 'clamp(28px,5.5vw,46px)', fontWeight: 900, lineHeight: 1.1, fontFamily: "'Playfair Display',serif", marginBottom: 6, background: `linear-gradient(135deg,${C.gold},${C.gL})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {t('פיזור הקרינה', 'Radiation Spread')}
          </h1>
          <h2 style={{ fontSize: 'clamp(13px,2.5vw,17px)', fontWeight: 400, color: 'rgba(232,213,160,0.85)', fontFamily: "'Playfair Display',serif", marginBottom: 8 }}>
            {t('אזור ההדרה ופיזור הענן באירופה', 'Exclusion zone and cloud spread across Europe')}
          </h2>
          <div className="gr" style={{ margin: '0 auto' }} />
        </div>

        <div className="card" style={{ padding: 14, marginBottom: 14 }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontSize: 12, color: C.gold, fontFamily: 'monospace', fontWeight: 700, letterSpacing: '0.1em' }}>
              📍 {POINTS.length} {t('נקודות מדידה', 'measurement points')}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => setShowZones(s => !s)} style={{ padding: '6px 12px', fontSize: 11, fontWeight: 700, background: showZones ? `${C.danger}33` : 'rgba(0,0,0,0.3)', color: showZones ? C.danger : 'rgba(255,255,255,0.6)', border: `1px solid ${showZones ? C.danger : 'rgba(255,255,255,0.1)'}`, borderRadius: 6, cursor: 'pointer', fontFamily: 'monospace' }}>
                {showZones ? '🔴' : '⭕'} {t('אזור ההדרה', 'Exclusion zone')}
              </button>
            </div>
          </div>

          <div style={{ marginTop: 10, display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
            {(['extreme', 'high', 'medium', 'low'] as const).map((k) => (
              <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, color: 'rgba(255,255,255,0.7)', fontFamily: 'monospace' }}>
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: DOSE_COLORS[k], border: '1px solid #fff' }} />
                <span>{t({ extreme: 'קיצוני', high: 'גבוה', medium: 'בינוני', low: 'נמוך' }[k], k.toUpperCase())}</span>
              </div>
            ))}
          </div>
        </div>

        <div ref={mapContainer} style={{ width: '100%', height: '60vh', minHeight: 480, borderRadius: 14, border: '1px solid rgba(200,164,78,0.3)', overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.4)', marginBottom: 14 }} />

        {tokenMissing && (
          <div style={{ padding: 14, marginBottom: 14, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, textAlign: 'center', color: '#fca5a5', fontSize: 13 }}>
            ⚠ {t('Mapbox token לא הוגדר. הוסף NEXT_PUBLIC_MAPBOX_TOKEN ב-Vercel env vars.', 'Mapbox token not set. Add NEXT_PUBLIC_MAPBOX_TOKEN to Vercel env vars.')}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 8, marginBottom: 14 }}>
          {[
            { n: '2,600 km²', l: t('אזור ההדרה', 'Exclusion zone'), c: C.danger },
            { n: '350,000', l: t('פונו מבתיהם', 'Evacuated'), c: C.amber },
            { n: '5,300 PBq', l: t('Cs-137 שוחרר', 'Cs-137 released'), c: C.green },
            { n: '40%', l: t('מאירופה זוהמה', 'of Europe affected'), c: C.blue },
          ].map((s, i) => (
            <div key={i} className="hover-lift" style={{ padding: '12px 8px', borderRadius: 10, background: 'linear-gradient(135deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))', border: '1px solid rgba(255,255,255,0.08)', textAlign: 'center' }}>
              <div style={{ fontSize: 18, fontWeight: 900, color: s.c, fontFamily: "'Playfair Display',serif", lineHeight: 1 }}>{s.n}</div>
              <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.6)', fontFamily: 'monospace', marginTop: 4 }}>{s.l}</div>
            </div>
          ))}
        </div>

        <div style={{ padding: '12px 14px', borderRadius: 8, background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(200,164,78,0.12)', textAlign: 'center' }}>
          <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)', fontFamily: 'monospace' }}>
            📚 {t('מקורות', 'Sources')}: UNSCEAR 2008 · IAEA · Forsmark NPP records
          </p>
        </div>
      </div>
    </div>
  );
}
