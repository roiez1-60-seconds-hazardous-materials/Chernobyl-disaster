'use client';
import { useState, useMemo } from 'react';
import { C, TERMS, TERM_CAT } from '@/lib/data';

export default function Glossary({ he, t }: { he: boolean; t: (h: string, e: string) => string }) {
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return TERMS.filter((tr) => {
      if (cat && tr.cat !== cat) return false;
      if (search) {
        const s = search.toLowerCase();
        return (tr.he + tr.en + tr.def_he + tr.def_en).toLowerCase().includes(s);
      }
      return true;
    });
  }, [search, cat]);

  return (
    <section id="glossary" style={{ padding: '60px 16px 30px', position: 'relative' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 28, position: 'relative' }}>
          <div className="section-number" style={{ top: '-20px', insetInlineEnd: '5%' }}>08</div>
          <div className="section-kicker">[ {t('סעיף שביעי · מונחים', 'PART SEVEN · GLOSSARY')} ]</div>
          <h2 className="section-title">{t('מונחים מקצועיים', 'Professional Glossary')}</h2>
          <p className="section-subtitle">{t(`${TERMS.length} מונחים ב-6 קטגוריות`, `${TERMS.length} terms in 6 categories`)}</p>
          <div className="gr" style={{ margin: '0 auto' }} />
        </div>

        {/* Search */}
        <div className="card" style={{ padding: 14, marginBottom: 14 }}>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('🔍 חפש מונח...', '🔍 Search...')}
            style={{
              width: '100%', padding: '10px 14px',
              background: 'rgba(0,0,0,0.5)',
              border: `1px solid ${C.gold}55`,
              borderRadius: 8,
              color: '#fff', fontSize: 14,
              fontFamily: "'Heebo', sans-serif",
              direction: he ? 'rtl' : 'ltr',
              outline: 'none',
            }}
          />
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 12 }}>
            <button onClick={() => setCat(null)} className={`btn-gold ${cat === null ? 'active' : ''}`}>
              {t('הכל', 'All')} ({TERMS.length})
            </button>
            {Object.entries(TERM_CAT).map(([k, v]) => {
              const count = TERMS.filter((tr) => tr.cat === k).length;
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
        </div>

        {/* Terms grid */}
        {filtered.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 10 }}>
            {filtered.map((tr, i) => {
              const cv = TERM_CAT[tr.cat];
              return (
                <div key={i} className="hover-lift fade-in" style={{
                  padding: '14px 16px',
                  background: 'rgba(0,0,0,0.5)',
                  border: `1px solid ${cv.c}33`,
                  borderInlineStart: `4px solid ${cv.c}`,
                  borderRadius: 10,
                  animationDelay: `${i * 0.02}s`,
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6, gap: 8 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 800, color: cv.c, fontFamily: "'Playfair Display', serif", lineHeight: 1.3 }}>
                      {t(tr.he, tr.en)}
                    </h3>
                    <span style={{ fontSize: 8, padding: '2px 6px', background: `${cv.c}25`, color: cv.c, borderRadius: 3, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em', whiteSpace: 'nowrap', flexShrink: 0 }}>
                      {t(cv.he, cv.en)}
                    </span>
                  </div>
                  <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.85)', lineHeight: 1.7 }}>
                    {t(tr.def_he, tr.def_en)}
                  </p>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="card" style={{ padding: 30, textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>
            🔍 {t('לא נמצאו מונחים תואמים', 'No matching terms found')}
          </div>
        )}
      </div>
    </section>
  );
}
