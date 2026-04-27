'use client';
import { useState } from 'react';
import { C, CASUALTIES } from '@/lib/data';

export default function Casualties({ he, t }: { he: boolean; t: (h: string, e: string) => string }) {
  const [tab, setTab] = useState<'immediate' | 'longterm' | 'evac'>('immediate');

  const TABS = [
    { id: 'immediate' as const, he: 'נפגעים מיידיים', en: 'Immediate Casualties', icon: '🩺', c: C.danger },
    { id: 'longterm' as const, he: 'השפעות ארוכות-טווח', en: 'Long-term Effects', icon: '⚕️', c: C.amber },
    { id: 'evac' as const, he: 'פינוי ועקירה', en: 'Evacuation & Displacement', icon: '🚌', c: C.purple },
  ];

  const items = CASUALTIES[tab];
  const cur = TABS.find((x) => x.id === tab)!;

  return (
    <section id="casualties" style={{ padding: '60px 16px 30px', position: 'relative' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 28, position: 'relative' }}>
          <div className="section-number" style={{ top: '-20px', insetInlineEnd: '5%' }}>06</div>
          <div className="section-kicker">[ {t('סעיף חמישי · נפגעים', 'PART FIVE · CASUALTIES')} ]</div>
          <h2 className="section-title">{t('מספר הנפגעים', 'The Toll')}</h2>
          <p className="section-subtitle">{t('היקף האסון — בנתונים מאומתים מ-IAEA, UNSCEAR, WHO', 'Scale of disaster — verified data from IAEA, UNSCEAR, WHO')}</p>
          <div className="gr" style={{ margin: '0 auto' }} />
        </div>

        {/* Tab switcher */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 20 }}>
          {TABS.map((tb) => (
            <button key={tb.id} onClick={() => setTab(tb.id)} style={{
              padding: '10px 18px', fontSize: 12, fontWeight: 700,
              background: tab === tb.id ? `${tb.c}33` : 'rgba(0,0,0,0.4)',
              color: tab === tb.id ? '#fff' : 'rgba(255,255,255,0.7)',
              border: `1px solid ${tab === tb.id ? tb.c : 'rgba(255,255,255,0.12)'}`,
              borderRadius: 10, cursor: 'pointer',
              fontFamily: "'JetBrains Mono', monospace",
              letterSpacing: '0.05em', transition: 'all 0.25s',
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <span style={{ fontSize: 16 }}>{tb.icon}</span>
              {t(tb.he, tb.en)}
            </button>
          ))}
        </div>

        {/* Stats grid */}
        <div className="fade-in" key={tab} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
          {items.map((s, i) => (
            <div key={i} className="hover-lift" style={{
              padding: '20px 18px',
              background: `linear-gradient(135deg, ${cur.c}10, rgba(0,0,0,0.5))`,
              border: `1px solid ${cur.c}40`,
              borderRadius: 14,
              animationDelay: `${i * 0.08}s`,
              animation: 'scaleIn 0.5s ease-out backwards',
            }}>
              <div style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 36, fontWeight: 900,
                color: cur.c,
                lineHeight: 1, marginBottom: 8,
                textShadow: `0 0 24px ${cur.c}66`,
              }}>
                {s.n}
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 6 }}>
                {t(s.he, s.en)}
              </div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)', lineHeight: 1.6 }}>
                {t(s.detail_he, s.detail_en)}
              </div>
            </div>
          ))}
        </div>

        {/* Important notes */}
        <div className="card-light" style={{ padding: '16px 20px', marginTop: 22 }}>
          <h4 style={{ fontSize: 13, fontWeight: 700, color: C.gold, marginBottom: 8, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em' }}>
            ⓘ {t('הערות חשובות', 'IMPORTANT NOTES')}
          </h4>
          <ul style={{ paddingInlineStart: 18, fontSize: 12, color: 'rgba(255,255,255,0.85)', lineHeight: 1.85 }}>
            <li>{t('המספרים הסופיים של נפגעי סרטן עתידיים שנויים במחלוקת בקהילה המדעית — הערכות נעות בין 4,000 (WHO) ל-93,000 (גרינפיס).', 'Final cancer fatality numbers are scientifically disputed — estimates range from 4,000 (WHO) to 93,000 (Greenpeace).')}</li>
            <li>{t('סרטן בלוטת התריס בילדים הוא ההשפעה היחידה שבוודאות ניתן לייחס ישירות לחשיפת קרינה ואיכות מזון מזוהם בעת האסון.', 'Childhood thyroid cancer is the only effect definitively attributable to radiation exposure and contaminated food during the disaster.')}</li>
            <li>{t('כ-20% מהליקווידטורים מתו ב-30 השנים שאחרי — חלק גדול מהתמותה הזו לא ניתן לייחס ישירות לקרינה.', '~20% of liquidators died in following 30 years — much of this mortality cannot be directly attributed to radiation.')}</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
