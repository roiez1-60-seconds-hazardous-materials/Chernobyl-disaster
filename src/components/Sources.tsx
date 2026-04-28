'use client';
import { useState } from 'react';
import { C, SOURCES, SRC_CAT } from '@/lib/data';

export default function Sources({ he, t }: { he: boolean; t: (h: string, e: string) => string }) {
  const [cat, setCat] = useState<string | null>(null);
  const filtered = cat ? SOURCES.filter((s) => s.cat === cat) : SOURCES;

  return (
    <section id="sources" style={{ padding: '60px 16px 30px', position: 'relative' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 28, position: 'relative' }}>
          <div className="section-number" style={{ top: '-20px', insetInlineStart: '5%' }}>09</div>
          <div className="section-kicker">[ {t('סעיף שמיני · מקורות', 'PART EIGHT · SOURCES')} ]</div>
          <h2 className="section-title">{t('מקורות וקישורים', 'Sources & Links')}</h2>
          <p className="section-subtitle">{t(`${SOURCES.length} מקורות מאומתים — IAEA, UNSCEAR, WHO, ספרות מקצועית`, `${SOURCES.length} verified sources — IAEA, UNSCEAR, WHO, professional literature`)}</p>
          <div className="gr" style={{ margin: '0 auto' }} />
        </div>

        {/* Filter */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 20 }}>
          <button onClick={() => setCat(null)} className={`btn-gold ${cat === null ? 'active' : ''}`}>
            {t('הכל', 'All')} ({SOURCES.length})
          </button>
          {Object.entries(SRC_CAT).map(([k, v]) => {
            const count = SOURCES.filter((s) => s.cat === k).length;
            if (count === 0) return null;
            const active = cat === k;
            return (
              <button key={k} onClick={() => setCat(active ? null : k)} style={{
                padding: '7px 12px', fontSize: 13, fontWeight: 700,
                background: active ? `${v.c}33` : 'rgba(0,0,0,0.4)',
                color: active ? v.c : 'rgba(255,255,255,0.7)',
                border: `1px solid ${active ? v.c : 'rgba(255,255,255,0.12)'}`,
                borderRadius: 6, cursor: 'pointer',
                fontFamily: "'JetBrains Mono', monospace",
              }}>
                {t(v.he, v.en)} ({count})
              </button>
            );
          })}
        </div>

        {/* Sources grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 12 }}>
          {filtered.map((s, i) => {
            const cv = SRC_CAT[s.cat];
            return (
              <a key={i} href={s.url} target="_blank" rel="noopener noreferrer" className="hover-lift fade-in" style={{
                padding: '16px 18px',
                background: 'rgba(0,0,0,0.5)',
                border: `1px solid ${cv.c}33`,
                borderInlineStart: `4px solid ${cv.c}`,
                borderRadius: 10,
                textDecoration: 'none', color: 'inherit',
                display: 'block',
                animationDelay: `${i * 0.05}s`,
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 8 }}>
                  <div style={{ fontSize: 24 }}>{s.icon}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{ fontSize: 14, fontWeight: 800, color: '#fff', fontFamily: "'Playfair Display', serif", lineHeight: 1.3, marginBottom: 3 }}>
                      {s.title}
                    </h3>
                    <div style={{ fontSize: 13, color: cv.c, fontStyle: 'italic' }}>
                      {s.subtitle} {s.year && `· ${s.year}`}
                    </div>
                  </div>
                </div>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', lineHeight: 1.7, marginBottom: 8 }}>
                  {t(s.desc_he, s.desc_en)}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, fontFamily: "'JetBrains Mono', monospace" }}>
                  <span style={{ padding: '2px 8px', background: `${cv.c}25`, color: cv.c, borderRadius: 3, letterSpacing: '0.1em' }}>
                    {t(cv.he, cv.en)}
                  </span>
                  <span style={{ color: C.gold, opacity: 0.7 }}>↗ {t('פתח', 'OPEN')}</span>
                </div>
              </a>
            );
          })}
        </div>

        {/* Disclaimer */}
        <div className="card-light" style={{ padding: '14px 18px', marginTop: 22, textAlign: 'center' }}>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: 1.7 }}>
            {t(
              'כל הנתונים והנתונים בתיק מודיעין זה מבוססים על מקורות פתוחים ומאומתים בלבד. אין מידע מסווג או נתונים מומצאים.',
              'All data in this dossier is based on verified open sources only. No classified information or fabricated data.'
            )}
          </p>
        </div>
      </div>
    </section>
  );
}
