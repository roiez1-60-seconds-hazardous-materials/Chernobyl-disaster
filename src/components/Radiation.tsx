'use client';
import { useState, useEffect, useRef } from 'react';
import { C, ISOTOPES, DOSE_SCALE } from '@/lib/data';

const RAD_POINTS = [
  { name: 'צ׳רנוביל', name_en: 'Chernobyl', lat: 51.389, lng: 30.099, dose: 'Ground Zero', cs: 'Extreme', c: '#dc2626' },
  { name: 'פריפיאט', name_en: 'Pripyat', lat: 51.405, lng: 30.057, dose: 'Pripyat', cs: 'Severe', c: '#dc2626' },
  { name: 'מינסק', name_en: 'Minsk, Belarus', lat: 53.9, lng: 27.567, dose: '40-185 kBq/m²', cs: 'High', c: '#f59e0b' },
  { name: 'גומל', name_en: 'Gomel, Belarus', lat: 52.43, lng: 30.99, dose: '185-1480 kBq/m²', cs: 'Very High', c: '#dc2626' },
  { name: 'קייב', name_en: 'Kyiv, Ukraine', lat: 50.45, lng: 30.523, dose: '37-185 kBq/m²', cs: 'Moderate', c: '#f59e0b' },
  { name: 'בריאנסק', name_en: 'Bryansk, Russia', lat: 53.247, lng: 34.373, dose: '185-555 kBq/m²', cs: 'High', c: '#f59e0b' },
  { name: 'ורשה', name_en: 'Warsaw, Poland', lat: 52.23, lng: 21.012, dose: '<37 kBq/m²', cs: 'Low', c: '#22c55e' },
  { name: 'ברלין', name_en: 'Berlin, Germany', lat: 52.52, lng: 13.405, dose: 'Detected', cs: 'Trace', c: '#06b6d4' },
  { name: 'מינכן', name_en: 'Munich, Germany', lat: 48.137, lng: 11.576, dose: 'Detected', cs: 'Trace', c: '#06b6d4' },
  { name: 'וינה', name_en: 'Vienna, Austria', lat: 48.21, lng: 16.37, dose: 'Detected', cs: 'Trace', c: '#06b6d4' },
  { name: 'מילאנו', name_en: 'Milan, Italy', lat: 45.46, lng: 9.19, dose: 'Detected', cs: 'Trace', c: '#06b6d4' },
  { name: 'פורסמרק', name_en: 'Forsmark, Sweden', lat: 60.4, lng: 18.18, dose: 'First detection', cs: 'Detection', c: '#a855f7' },
  { name: 'אוסלו', name_en: 'Oslo, Norway', lat: 59.91, lng: 10.75, dose: 'Detected', cs: 'Trace', c: '#06b6d4' },
  { name: 'הלסינקי', name_en: 'Helsinki, Finland', lat: 60.17, lng: 24.94, dose: 'Detected', cs: 'Trace', c: '#06b6d4' },
  { name: 'לונדון', name_en: 'London, UK', lat: 51.51, lng: -0.13, dose: 'Detected', cs: 'Trace', c: '#06b6d4' },
];

export default function Radiation({ he, t }: { he: boolean; t: (h: string, e: string) => string }) {
  const [tab, setTab] = useState<'isotopes' | 'scale' | 'map'>('isotopes');
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);

  useEffect(() => {
    if (tab !== 'map' || !mapRef.current || mapInstance.current) return;
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token) return;

    let cancelled = false;
    (async () => {
      const mapboxgl = (await import('mapbox-gl')).default;
      if (cancelled || !mapRef.current) return;
      mapboxgl.accessToken = token;
      const map = new mapboxgl.Map({
        container: mapRef.current,
        style: 'mapbox://styles/mapbox/dark-v11',
        center: [25, 53],
        zoom: 3.5,
      });
      mapInstance.current = map;

      map.on('load', () => {
        // 30km exclusion ring
        map.addSource('zone30', {
          type: 'geojson',
          data: { type: 'Feature', properties: {}, geometry: { type: 'Point', coordinates: [30.099, 51.389] } },
        });
        map.addLayer({
          id: 'zone30-fill', type: 'circle', source: 'zone30',
          paint: { 'circle-radius': { stops: [[1, 5], [5, 30], [10, 200]] }, 'circle-color': '#dc2626', 'circle-opacity': 0.15, 'circle-stroke-color': '#dc2626', 'circle-stroke-width': 2, 'circle-stroke-opacity': 0.7 },
        });

        // Markers
        RAD_POINTS.forEach((p) => {
          const el = document.createElement('div');
          el.style.cssText = `width:14px;height:14px;border-radius:50%;background:${p.c};border:2px solid #fff;box-shadow:0 0 14px ${p.c};cursor:pointer`;
          new mapboxgl.Marker(el).setLngLat([p.lng, p.lat]).setPopup(
            new mapboxgl.Popup({ offset: 14 }).setHTML(
              `<div style="font-family:Heebo,sans-serif"><strong style="color:#c8a44e;font-size:13px">${he ? p.name : p.name_en}</strong><br/><span style="color:#fff;font-size:11px">${p.dose}</span><br/><span style="color:${p.c};font-size:10px;font-family:'JetBrains Mono',monospace">${p.cs}</span></div>`
            )
          ).addTo(map);
        });
      });
    })();

    return () => { cancelled = true; if (mapInstance.current) { mapInstance.current.remove(); mapInstance.current = null; } };
  }, [tab, he]);

  const TABS = [
    { id: 'isotopes' as const, he: 'איזוטופים', en: 'Isotopes', icon: '☢' },
    { id: 'scale' as const, he: 'סקאלת קרינה', en: 'Dose Scale', icon: '📊' },
    { id: 'map' as const, he: 'מפת פיזור', en: 'Dispersion Map', icon: '🗺' },
  ];

  return (
    <section id="radiation" style={{ padding: '60px 16px 30px', position: 'relative' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 28, position: 'relative' }}>
          <div className="section-number" style={{ top: '-20px', insetInlineStart: '5%' }}>06</div>
          <div className="section-kicker">[ {t('סעיף שישי · קרינה', 'PART SIX · RADIATION')} ]</div>
          <h2 className="section-title">{t('קרינה רדיואקטיבית ומדדי סיכון', 'Radioactive Emissions & Risk Metrics')}</h2>
          <p className="section-subtitle">{t('5 איזוטופים מרכזיים · 12 רמות סיכון · פיזור באירופה', '5 key isotopes · 12 risk levels · European dispersion')}</p>
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
              {t('סקאלה לוגריתמית של מנות קרינה — מסביב צילום שיניים ועד הליבה החשופה', 'Logarithmic dose scale — from dental X-ray to exposed core')}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {DOSE_SCALE.map((d, i) => {
                const riskC = d.risk === 'safe' ? C.green : d.risk === 'low' ? C.blue : d.risk === 'medium' ? C.amber : d.risk === 'high' ? '#f97316' : C.danger;
                const widthPct = Math.min(Math.log10(d.mSv + 1) / Math.log10(300001) * 100, 100);
                return (
                  <div key={i} className="fade-in" style={{ animationDelay: `${i * 0.04}s` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                      <span style={{ fontSize: 12, color: '#fff', fontWeight: 600 }}>
                        {t(d.label_he, d.label_en)}
                      </span>
                      <span style={{ fontSize: 11, color: riskC, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>
                        {d.mSv.toLocaleString()} mSv
                      </span>
                    </div>
                    <div style={{ height: 14, borderRadius: 4, background: 'rgba(0,0,0,0.4)', overflow: 'hidden', position: 'relative' }}>
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
          <div className="fade-in card" style={{ padding: 12 }}>
            <div ref={mapRef} style={{ width: '100%', height: 480, borderRadius: 10, overflow: 'hidden', background: '#0a0e1a' }} />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center', marginTop: 12, fontSize: 10, color: 'rgba(255,255,255,0.7)', fontFamily: "'JetBrains Mono', monospace" }}>
              <span>● <span style={{ color: '#dc2626' }}>{t('קרינה גבוהה', 'High radiation')}</span></span>
              <span>● <span style={{ color: '#f59e0b' }}>{t('קרינה בינונית', 'Moderate')}</span></span>
              <span>● <span style={{ color: '#22c55e' }}>{t('נמוכה', 'Low')}</span></span>
              <span>● <span style={{ color: '#06b6d4' }}>{t('זיהוי בלבד', 'Detection only')}</span></span>
              <span>● <span style={{ color: '#a855f7' }}>{t('זיהוי ראשון', 'First detection')}</span></span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
