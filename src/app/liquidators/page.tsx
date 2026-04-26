'use client';
import { useState } from 'react';
import Link from 'next/link';

const C = { gold: '#c8a44e', gL: '#e8d5a0', danger: '#ef4444', blue: '#06b6d4', green: '#22c55e', amber: '#f59e0b' };

const GROUPS = [
  { id: 'fire', icon: '🚒', he: 'הכבאים הראשונים', en: 'First Firefighters', count: '~30',
    lead: 'Lt. Vladimir Pravik · Lt. Viktor Kibenok',
    desc_he: '14 כבאים שהגיעו ב-01:28, ועוד שתי משמרות שהצטרפו. ללא הגנת קרינה — לא הודיעו להם. רובם מתו תוך שבועות מתסמונת קרינה חריפה (ARS) במוסקבה. פראבּיק וקיבנוק שניהם זכו לאחר מותם בתואר "גיבור ברית המועצות".',
    desc_en: '14 firefighters arrived at 01:28, plus two more shifts. No radiation protection — not informed. Most died within weeks from Acute Radiation Syndrome (ARS) in Moscow. Pravik and Kibenok received "Hero of the Soviet Union" posthumously.',
    risk: 'extreme' },
  { id: 'pilot', icon: '🚁', he: 'טייסי המסוקים', en: 'Helicopter Pilots', count: '600',
    lead: 'Maj. Gen. Nikolai Antoshkin',
    desc_he: 'בוצעו 1,800 גיחות מסוק להפלת חול, חימר, עופרת ובור על הליבה הבוערת. הקרינה מעל הכור הגיעה ל-3,500 R/h. טייס אחד נהרג כש-Mi-8 התרסק על כבל בכרס בית הקרור ב-2/10/86.',
    desc_en: '1,800 helicopter sorties dropped sand, clay, lead, and boron on burning core. Radiation above reactor reached 3,500 R/h. One pilot died when Mi-8 crashed into cooling tower cable on 2 Oct 1986.',
    risk: 'extreme' },
  { id: 'tunnel', icon: '⛏', he: 'חופרי המנהרה', en: 'Tunnel Diggers', count: '400',
    lead: '',
    desc_he: 'חופרים ממוסקבה ואוקראינה חפרו מנהרה של 168 מטר מתחת לכור — דרך אדמה רוויית קרינה — כדי להתקין מערכת קירור שתמנע הריסה לתוך מי התהום. עבדו 24/7 במשמרות 3 שעות, מבלי שהיה ידוע אם המהלך אכן נדרש (התברר שלא).',
    desc_en: 'Diggers from Moscow and Ukraine dug a 168-meter tunnel beneath the reactor — through radiation-saturated earth — to install cooling system preventing meltdown into groundwater. Worked 24/7 in 3-hour shifts.',
    risk: 'high' },
  { id: 'volunt', icon: '🏊', he: 'שלושת המתנדבים — צוללי השסתום', en: 'Three Volunteers — Valve Divers', count: '3',
    lead: 'Alexei Ananenko · Valeri Bezpalov · Boris Baranov',
    desc_he: 'ב-4-6/5 שלושה מהנדסים צללו למאגר מים מתחת לכור הבוער כדי לפתוח שסתום ולמנוע פיצוץ קיטור משני שעלול היה להגדיל את האסון פי 10. בניגוד לאגדה — שלושתם שרדו. אננקו ובז׳פאלוב חיים עד היום (2026).',
    desc_en: 'On 4-6 May, three engineers dove into water reservoir below burning reactor to open valve and prevent secondary steam explosion that could have multiplied disaster 10×. All three survived. Ananenko and Bezpalov are alive today (2026).',
    risk: 'extreme' },
  { id: 'biorobot', icon: '🦾', he: '"ביו-רובוטים" — מנקי הגג', en: '"Bio-Robots" — Roof Cleaners', count: '3,400',
    lead: '',
    desc_he: 'אחרי שרובוטים גרמניים נכשלו (האלקטרוניקה נשרפה מהקרינה), 3,400 חיילים ממילואים נשלחו לגג למשך 40-90 שניות בלבד כל אחד. כל חייל זרק 1-2 גושי גרפיט בעופרים — ואז ירץ למטה. הגנה: סינר עופרת, קסדה, מנ״פ.',
    desc_en: 'After German robots failed (electronics burned by radiation), 3,400 reservists were sent to the roof for only 40-90 seconds each. Each soldier threw 1-2 graphite chunks with shovels — then ran down.',
    risk: 'extreme' },
  { id: 'sarc', icon: '🏗', he: 'בוני הסרקופג', en: 'Sarcophagus Builders', count: '~200,000',
    lead: '',
    desc_he: 'בני הסרקופג הראשון ("Object Shelter") שהוקם תוך 6 חודשים — מ-5/86 עד 11/86. השתמשו בשלט-רחוק להזרמת בטון, אבל חלק מהעבודה נדרשה ידנית. צריכת בטון: 400,000 מ"ק. צריכת פלדה: 7,300 ט׳.',
    desc_en: 'Builders of the first sarcophagus erected in 6 months — May to November 1986. Concrete consumed: 400,000 m³. Steel: 7,300 t.',
    risk: 'high' },
  { id: 'evac', icon: '🚌', he: 'נהגי האוטובוסים', en: 'Bus Drivers', count: '~5,000',
    lead: '',
    desc_he: '1,200 אוטובוסים פינו 49,000 תושבי פריפיאט תוך 3 שעות ב-27/4. נהגי האוטובוסים שעברו דרך אזור הקרינה הבליעו מנות גבוהות.',
    desc_en: '1,200 buses evacuated 49,000 Pripyat residents within 3 hours on 27/4. Bus drivers passing through the radiation zone absorbed high doses.',
    risk: 'high' },
  { id: 'decon', icon: '🧹', he: 'צוותי טיהור', en: 'Decontamination Teams', count: '~300,000',
    lead: '',
    desc_he: 'טיהור הקרקע, הבתים, הרכבים וכל פיסת אדמה באזור 30 ק״מ. שיטות: שטיפה במים מיוחדים, חיתוך וקבירה של אדמה עליונה (5 ס"מ), הריסת כפרים שלמים. 188 כפרים נקברו תחת אדמה.',
    desc_en: 'Decontamination of soil, houses, vehicles, and every patch of land in 30 km zone. 188 villages were buried under earth.',
    risk: 'high' },
  { id: 'guard', icon: '🪖', he: 'משמרות ושמירה', en: 'Guards & Security', count: '~50,000',
    lead: '',
    desc_he: 'חיילים ששמרו על אזור ההדרה, מנעו לוטים, וניהלו מחסומים. גם אחרי הסיכון המיידי הסתיים, הם המשיכו לחיות באזור הקרינה במשך חודשים.',
    desc_en: 'Soldiers guarding the exclusion zone, preventing looting, and managing checkpoints.',
    risk: 'medium' },
  { id: 'medic', icon: '⚕️', he: 'צוותים רפואיים', en: 'Medical Teams', count: '~20,000',
    lead: 'Dr. Angelina Guskova',
    desc_he: 'רופאים ואחיות שטיפלו בנפגעי ARS במוסקבה (בית חולים מס׳ 6) ובאזור עצמו. ד״ר גוסקובה הייתה הראשונה בעולם שטיפלה במספר כה גדול של נפגעי קרינה חריפה.',
    desc_en: 'Doctors and nurses treating ARS victims in Moscow (Hospital No. 6) and on-site. Dr. Guskova was the first in the world to treat such a large number of acute radiation casualties.',
    risk: 'medium' },
];

const STATS_HEALTH = [
  { n: '~600,000', he: 'סך כל הליקווידטורים', en: 'Total liquidators' },
  { n: '~30', he: 'מתו תוך 3 חודשים מ-ARS', en: 'Died within 3 months of ARS' },
  { n: '6,000+', he: 'מקרי סרטן בלוטת התריס בילדים', en: 'Childhood thyroid cancers' },
  { n: '~10%', he: 'תמותה עודפת לאחר 30 שנה', en: 'Excess mortality after 30 years' },
];

export default function LiquidatorsPage() {
  const [lang, setLang] = useState<'he' | 'en'>('he');
  const [expanded, setExpanded] = useState<string | null>(null);
  const he = lang === 'he';
  const t = (h: string, e: string) => (he ? h : e);

  return (
    <div dir={he ? 'rtl' : 'ltr'} className="mh" style={{ minHeight: '100vh' }}>
      <div style={{ position: 'relative', zIndex: 1, maxWidth: 1100, margin: '0 auto', padding: '20px 16px' }}>
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
            [ {he ? 'גיבורים אלמונים' : 'UNKNOWN HEROES'} ]
          </div>
          <h1 style={{ fontSize: 'clamp(28px,5.5vw,46px)', fontWeight: 900, lineHeight: 1.1, fontFamily: "'Playfair Display',serif", marginBottom: 6, background: `linear-gradient(135deg,${C.gold},${C.gL})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {t('הליקווידטורים', 'The Liquidators')}
          </h1>
          <h2 style={{ fontSize: 'clamp(13px,2.5vw,17px)', fontWeight: 400, color: 'rgba(232,213,160,0.85)', fontFamily: "'Playfair Display',serif", marginBottom: 8 }}>
            {t('600,000 גברים ונשים שניקו את האסון בידיהם', '600,000 men and women who cleaned up the disaster by hand')}
          </h2>
          <div className="gr" style={{ margin: '0 auto' }} />
        </div>

        <div className="card" style={{ padding: 16, marginBottom: 20 }}>
          <h3 style={{ fontSize: 16, fontWeight: 800, color: C.gold, fontFamily: "'Playfair Display',serif", marginBottom: 12, textAlign: 'center' }}>
            ⚠ {t('המחיר הבריאותי', 'Health Cost')}
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 10 }}>
            {STATS_HEALTH.map((s, i) => (
              <div key={i} style={{ padding: '14px 12px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 10, textAlign: 'center' }}>
                <div style={{ fontSize: 22, fontWeight: 900, color: C.danger, fontFamily: "'Playfair Display',serif", lineHeight: 1, marginBottom: 6 }}>
                  {s.n}
                </div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', lineHeight: 1.4 }}>
                  {t(s.he, s.en)}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
          {GROUPS.map((g) => {
            const riskColor = g.risk === 'extreme' ? C.danger : g.risk === 'high' ? C.amber : C.green;
            const isOpen = expanded === g.id;
            return (
              <div key={g.id} className="hover-lift fade-in" style={{ background: 'rgba(0,0,0,0.5)', border: `1px solid ${riskColor}55`, borderRadius: 14, padding: '16px 20px', cursor: 'pointer' }} onClick={() => setExpanded(isOpen ? null : g.id)}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ fontSize: 32 }}>{g.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 6 }}>
                      <h3 style={{ fontSize: 17, fontWeight: 800, color: '#fff', fontFamily: "'Playfair Display',serif" }}>
                        {t(g.he, g.en)}
                      </h3>
                      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                        <span style={{ fontSize: 14, fontWeight: 900, color: C.gold, fontFamily: 'monospace' }}>{g.count}</span>
                        <span style={{ fontSize: 9, color: riskColor, fontFamily: 'monospace', letterSpacing: '0.1em', background: `${riskColor}15`, padding: '2px 8px', borderRadius: 4, border: `1px solid ${riskColor}33` }}>
                          {g.risk === 'extreme' ? t('סיכון קיצוני', 'EXTREME') : g.risk === 'high' ? t('סיכון גבוה', 'HIGH') : t('סיכון בינוני', 'MEDIUM')}
                        </span>
                      </div>
                    </div>
                    {g.lead && (
                      <div style={{ fontSize: 11, color: C.gL, fontFamily: 'monospace', marginTop: 4, opacity: 0.8 }}>
                        👤 {g.lead}
                      </div>
                    )}
                  </div>
                  <div style={{ fontSize: 18, color: C.gold, transition: 'transform 0.3s', transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}>
                    {he ? '◀' : '▶'}
                  </div>
                </div>
                {isOpen && (
                  <div className="fade-in" style={{ marginTop: 14, padding: '12px 16px', background: 'rgba(0,0,0,0.4)', borderLeft: `3px solid ${riskColor}`, borderRadius: 8, fontSize: 13, lineHeight: 1.85, color: 'rgba(255,255,255,0.9)' }}>
                    {t(g.desc_he, g.desc_en)}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div style={{ padding: '12px 14px', borderRadius: 8, background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(200,164,78,0.12)', textAlign: 'center' }}>
          <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)', fontFamily: 'monospace' }}>
            📚 {t('מקורות', 'Sources')}: WHO 2006 · UNSCEAR · Higginbotham (2019) · Plokhy (2018)
          </p>
        </div>
      </div>
    </div>
  );
}
