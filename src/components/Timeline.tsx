'use client';
import { useState } from 'react';
import { C, TIMELINE, TL_CAT } from '@/lib/data';

export default function Timeline({ he, t }: { he: boolean; t: (h: string, e: string) => string }) {
  const [filter, setFilter] = useState<string | null>(null);
  const filtered = filter ? TIMELINE.filter((e) => e.cat === filter) : TIMELINE;

  return (
    <section id="timeline" style={{ padding: '60px 16px 30px', position: 'relative' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative' }}>
        <div style={{ textAlign: 'center', marginBottom: 28, position: 'relative' }}>
          <div className="section-number" style={{ top: '-20px', insetInlineEnd: '5%' }}>01</div>
          <div className="section-kicker">[ {t('סעיף ראשון · ציר זמן', 'PART ONE · TIMELINE')} ]</div>
          <h2 className="section-title">{t('ציר הזמן לאסון', 'The Timeline')}</h2>
          <p className="section-subtitle">{t('מהבנייה (1971) ועד הסגירה החדשה (2016)', 'From construction (1971) to New Safe Confinement (2016)')}</p>
          <div className="gr" style={{ margin: '0 auto' }} />
        </div>

        {/* Filter chips */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 22 }}>
          <button onClick={() => setFilter(null)} className={`btn-gold ${filter === null ? 'active' : ''}`}>
            {t('הכל', 'All')} ({TIMELINE.length})
          </button>
          {Object.entries(TL_CAT).map(([k, v]) => {
            const count = TIMELINE.filter((e) => e.cat === k).length;
            const isActive = filter === k;
            return (
              <button key={k} onClick={() => setFilter(isActive ? null : k)} style={{
                padding: '8px 14px', fontSize: 11, fontWeight: 700,
                background: isActive ? `${v.c}33` : 'rgba(0,0,0,0.4)',
                color: isActive ? v.c : 'rgba(255,255,255,0.7)',
                border: `1px solid ${isActive ? v.c : 'rgba(255,255,255,0.12)'}`,
                borderRadius: 8, cursor: 'pointer',
                fontFamily: "'JetBrains Mono', monospace",
                letterSpacing: '0.05em', transition: 'all 0.25s',
              }}>
                {t(v.he, v.en)} ({count})
              </button>
            );
          })}
        </div>

        {/* Timeline list */}
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', top: 10, bottom: 10, [he ? 'right' : 'left']: 26, width: 2, background: `linear-gradient(180deg, transparent, ${C.gold}55 15%, ${C.danger}99 50%, ${C.green}55 85%, transparent)`, borderRadius: 1 }} />
          {filtered.map((ev, i) => {
            const cat = TL_CAT[ev.cat];
            return (
              <div key={i} className="fade-in" style={{ position: 'relative', paddingInlineStart: 64, marginBottom: 14, animationDelay: `${i * 0.04}s` }}>
                <div style={{
                  position: 'absolute',
                  [he ? 'right' : 'left']: 18,
                  top: 16,
                  width: 18, height: 18,
                  borderRadius: '50%',
                  background: cat.c,
                  border: '2px solid #fff',
                  boxShadow: `0 0 14px ${cat.c}aa, inset 0 0 4px rgba(0,0,0,0.4)`,
                  zIndex: 2,
                  animation: ev.cat === 'disaster' ? 'pulseAlert 2s infinite' : 'none',
                  color: cat.c,
                }} />
                <div className="hover-lift" style={{
                  background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)',
                  border: `1px solid ${cat.c}55`,
                  borderRadius: 12, padding: '14px 18px',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6, flexWrap: 'wrap', gap: 6 }}>
                    <div style={{ fontSize: 14, fontWeight: 900, color: cat.c, fontFamily: "'JetBrains Mono', monospace" }}>{ev.date}</div>
                    <div style={{ fontSize: 9, fontWeight: 700, color: cat.c, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.15em', background: `${cat.c}15`, padding: '2px 8px', borderRadius: 4, border: `1px solid ${cat.c}33` }}>
                      {t(cat.he, cat.en)}
                    </div>
                  </div>
                  <h3 style={{ fontSize: 16, fontWeight: 800, color: '#fff', fontFamily: "'Playfair Display', serif", lineHeight: 1.3, marginBottom: 8 }}>
                    {t(ev.he, ev.en)}
                  </h3>
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', lineHeight: 1.85 }}>
                    {t(ev.desc_he, ev.desc_en)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
