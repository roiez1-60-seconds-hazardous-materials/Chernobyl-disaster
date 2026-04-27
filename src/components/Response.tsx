'use client';
import { useState } from 'react';
import { C, LIQUIDATORS } from '@/lib/data';
import HistoricalPhoto from './HistoricalPhoto';

const RISK_COLORS: Record<string, string> = { extreme: C.danger, high: C.amber, medium: C.blue };
const RISK_HE: Record<string, string> = { extreme: 'קיצוני', high: 'גבוה', medium: 'בינוני' };
const RISK_EN: Record<string, string> = { extreme: 'EXTREME', high: 'HIGH', medium: 'MEDIUM' };

export default function Response({ he, t }: { he: boolean; t: (h: string, e: string) => string }) {
  const [open, setOpen] = useState<string | null>('fire');

  return (
    <section id="response" style={{ padding: '60px 16px 30px', position: 'relative' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 28, position: 'relative' }}>
          <div className="section-number" style={{ top: '-20px', insetInlineStart: '5%' }}>05</div>
          <div className="section-kicker">[ {t('סעיף חמישי · הכלה', 'PART FIVE · CONTAINMENT')} ]</div>
          <h2 className="section-title">{t('600,000 הליקווידטורים', '600,000 Liquidators')}</h2>
          <p className="section-subtitle">{t('מבצע ההצלה ההיסטורי הגדול בעולם', 'Largest containment operation in history')}</p>
          <div className="gr" style={{ margin: '0 auto' }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10, marginBottom: 24 }}>
          {[
            { n: '~600K', l: t('סך ליקווידטורים', 'Total liquidators'), c: C.gold },
            { n: '9', l: t('ימי שריפה', 'Days of fire'), c: C.danger },
            { n: '5,000 ט׳', l: t('הוטל מהאוויר', 'Air-dropped'), c: C.amber },
            { n: '1,800', l: t('גיחות מסוק', 'Helicopter sorties'), c: C.blue },
            { n: '168 מ׳', l: t('אורך המנהרה', 'Tunnel length'), c: C.purple },
            { n: '4 שנים', l: t('הכלה ראשונית', 'Initial containment'), c: C.green },
          ].map((s, i) => (
            <div key={i} className="stat-box hover-lift" style={{ '--accent': s.c } as any}>
              <div className="stat-num" style={{ color: s.c }}>{s.n}</div>
              <div className="stat-lbl">{s.l}</div>
            </div>
          ))}
        </div>

        <div style={{ marginBottom: 22 }}>
          <HistoricalPhoto
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Chernobyl_liquidators_decontamination.jpg/640px-Chernobyl_liquidators_decontamination.jpg"
            caption_he="ליקווידטורים בעבודת טיהור באזור הסגור, 1986. רובם חיילים שגויסו במילואים ללא הכשרה ייעודית בקרינה."
            caption_en="Liquidators decontaminating the exclusion zone, 1986. Most were reservists conscripted without specialized radiation training."
            attribution="© USFCRFC · Public Domain"
            he={he} t={t}
            height={260}
          />
        </div>

        <h3 style={{ fontSize: 18, fontWeight: 800, color: C.gold, fontFamily: "'Playfair Display', serif", marginBottom: 14, textAlign: 'center' }}>
          {t('10 קבוצות עיקריות', '10 Major Groups')}
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {LIQUIDATORS.map((g) => {
            const isOpen = open === g.id;
            const riskC = RISK_COLORS[g.risk];
            return (
              <div key={g.id} className="card hover-lift" style={{ overflow: 'hidden', borderColor: isOpen ? `${riskC}77` : undefined }}>
                <button onClick={() => setOpen(isOpen ? null : g.id)} style={{
                  width: '100%', padding: '14px 18px', background: isOpen ? `${riskC}12` : 'transparent',
                  border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14,
                  textAlign: he ? 'right' : 'left', color: '#fff', transition: 'all 0.3s',
                }}>
                  <div style={{ fontSize: 32, flexShrink: 0 }}>{g.icon}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 8 }}>
                      <h3 style={{ fontSize: 16, fontWeight: 800, color: '#fff', fontFamily: "'Playfair Display', serif" }}>
                        {t(g.he, g.en)}
                      </h3>
                      <div style={{ display: 'flex', gap: 6, alignItems: 'center', fontFamily: "'JetBrains Mono', monospace" }}>
                        <span style={{ fontSize: 14, fontWeight: 800, color: C.gold }}>{g.count}</span>
                        <span style={{ fontSize: 9, padding: '2px 6px', background: `${riskC}25`, color: riskC, borderRadius: 4, border: `1px solid ${riskC}55`, letterSpacing: '0.1em' }}>
                          {t(RISK_HE[g.risk], RISK_EN[g.risk])}
                        </span>
                      </div>
                    </div>
                    {g.lead && <div style={{ fontSize: 11, color: C.gL, marginTop: 3, fontStyle: 'italic' }}>{g.lead}</div>}
                  </div>
                  <div style={{ fontSize: 14, color: C.gold, transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}>▶</div>
                </button>
                {isOpen && (
                  <div className="fade-in" style={{ padding: '0 18px 16px', borderTop: `1px solid ${riskC}33` }}>
                    <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.9)', lineHeight: 1.85, marginTop: 12, marginBottom: 10 }}>
                      {t(g.desc_he, g.desc_en)}
                    </p>
                    <div style={{ display: 'flex', gap: 14, fontSize: 11, color: 'rgba(255,255,255,0.6)', fontFamily: "'JetBrains Mono', monospace", flexWrap: 'wrap' }}>
                      <span><span style={{ color: riskC }}>●</span> {t('סיכון', 'Risk')}: {t(RISK_HE[g.risk], RISK_EN[g.risk])}</span>
                      <span><span style={{ color: C.gold }}>●</span> {t('מנת קרינה', 'Dose')}: {g.dose}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
