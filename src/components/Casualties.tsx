'use client';
import { useState } from 'react';
import { C, CASUALTIES } from '@/lib/data';
import { useCountUpString, useReveal } from '@/lib/useScroll';

function CasualtyCard({ s, color, i }: { s: any; color: string; i: number }) {
  const { ref, display } = useCountUpString(s.n);
  const { ref: cardRef, visible } = useReveal<HTMLDivElement>();
  return (
    <div
      ref={cardRef}
      className="hover-lift"
      style={{
        padding: '20px 18px',
        background: `linear-gradient(135deg, ${color}10, rgba(0,0,0,0.5))`,
        border: `1px solid ${color}40`,
        borderRadius: 14,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.95)',
        transition: `opacity 0.6s ease-out ${i * 0.1}s, transform 0.6s ease-out ${i * 0.1}s`,
      }}
    >
      <div style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: 36, fontWeight: 900,
        color: color,
        lineHeight: 1, marginBottom: 8,
        textShadow: `0 0 24px ${color}66`,
      }}>
        <span ref={ref}>{display}</span>
      </div>
      <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 6 }}>
        {s.label}
      </div>
      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)', lineHeight: 1.6 }}>
        {s.detail}
      </div>
    </div>
  );
}

// Visual representation of the 28 firefighters
function FirefightersVisual({ he, t }: { he: boolean; t: (h: string, e: string) => string }) {
  const { ref, visible } = useReveal<HTMLDivElement>(0.2);
  return (
    <div ref={ref} style={{
      marginTop: 24,
      padding: '24px 18px',
      background: 'linear-gradient(180deg, rgba(220,38,38,0.1), rgba(0,0,0,0.5))',
      border: `1px solid ${C.danger}55`,
      borderRadius: 14,
      opacity: visible ? 1 : 0,
      transition: 'opacity 1s ease-out',
    }}>
      <div style={{ textAlign: 'center', marginBottom: 16 }}>
        <h3 style={{ fontSize: 17, fontWeight: 800, color: '#fff', fontFamily: "'Playfair Display', serif", marginBottom: 4 }}>
          {t('28 הכבאים שמתו', '28 Firefighters Who Died')}
        </h3>
        <p style={{ fontSize: 11, color: C.gL, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em' }}>
          {t('כל פרצוף — חבר, אבא, בן', 'Each face — friend, father, son')}
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(34px, 1fr))',
        gap: 6,
        maxWidth: 480,
        margin: '0 auto',
      }}>
        {[...Array(28)].map((_, i) => (
          <div
            key={i}
            style={{
              aspectRatio: '1',
              borderRadius: '50%',
              background: visible ? `linear-gradient(135deg, ${C.danger}55, ${C.danger}22)` : 'transparent',
              border: `1.5px solid ${C.danger}${visible ? '99' : '00'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 14,
              transition: `all 0.4s ease-out ${i * 0.04}s`,
              boxShadow: visible ? `0 0 8px ${C.danger}33, inset 0 0 6px ${C.danger}22` : 'none',
              opacity: visible ? 1 : 0,
              transform: visible ? 'scale(1)' : 'scale(0)',
            }}
            title={t(`כבאי ${i + 1}`, `Firefighter ${i + 1}`)}
          >
            🕯
          </div>
        ))}
      </div>

      <p style={{
        textAlign: 'center',
        marginTop: 16,
        fontSize: 11,
        color: 'rgba(255,255,255,0.6)',
        fontFamily: "'Playfair Display', serif",
        fontStyle: 'italic',
        lineHeight: 1.7,
      }}>
        {t(
          'בית קברות מיטינסקויה, מוסקבה — ארונות אבץ סגורים. אריחי בטון מעל הקברים — לחסום את הקרינה שעוד עלתה מהגופות.',
          'Mitinskoye cemetery, Moscow — sealed zinc coffins. Concrete tiles over graves — to block radiation still rising from the bodies.'
        )}
      </p>
    </div>
  );
}

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
          <div className="section-kicker">[ {t('סעיף שישי · נפגעים', 'PART SIX · CASUALTIES')} ]</div>
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
              boxShadow: tab === tb.id ? `0 0 16px ${tb.c}55` : 'none',
            }}>
              <span style={{ fontSize: 16 }}>{tb.icon}</span>
              {t(tb.he, tb.en)}
            </button>
          ))}
        </div>

        {/* Stats grid */}
        <div key={tab} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
          {items.map((s, i) => (
            <CasualtyCard
              key={`${tab}-${i}`}
              s={{ n: s.n, label: t(s.he, s.en), detail: t(s.detail_he, s.detail_en) }}
              color={cur.c}
              i={i}
            />
          ))}
        </div>

        {/* Visual: 28 firefighters — only on immediate tab */}
        {tab === 'immediate' && <FirefightersVisual he={he} t={t} />}

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
