'use client';
import { useState } from 'react';
import Link from 'next/link';

const C = { gold: '#c8a44e', gL: '#e8d5a0', danger: '#ef4444', blue: '#06b6d4', green: '#22c55e', amber: '#f59e0b', purple: '#a855f7' };

const TL = [
  { date: '1971', he: 'תחילת בניית התחנה', en: 'Construction begins', cat: 'build',
    desc_he: 'הוחלט להקים את תחנת הכוח הגרעינית "ולדימיר איליץ׳ לנין" ליד נהר פריפיאט באוקראינה הסובייטית, 130 ק״מ צפונית לקייב.',
    desc_en: 'Decision to build the "V.I. Lenin" Nuclear Power Plant near the Pripyat River in Soviet Ukraine, 130 km north of Kyiv.' },
  { date: '1977', he: 'יחידה 1 — תחילת פעולה', en: 'Unit 1 begins operation', cat: 'build',
    desc_he: 'הכור הראשון מתחיל לייצר חשמל. RBMK-1000 — הספק נומינלי 1,000 MWe. תחנה זו נחשבה לאחת המתקדמות באיחוד הסובייטי.',
    desc_en: 'First reactor begins generating electricity. RBMK-1000 — nominal output 1,000 MWe. Considered one of the most advanced plants in USSR.' },
  { date: 'דצמבר 1983', he: 'יחידה 4 — תחילת פעולה', en: 'Unit 4 begins operation', cat: 'build',
    desc_he: 'יחידה 4 (זו שתתפוצץ ב-1986) מתחילה לייצר חשמל. בנייתה הואצה כדי לעמוד ביעדי תכנית ה-5 שנים — חלק מהבדיקות נדחו.',
    desc_en: 'Unit 4 (the one that will explode in 1986) begins operation. Construction was rushed to meet 5-year plan deadlines — some tests postponed.' },
  { date: '1983', he: '⚠ פגם המוטות התגלה — באיגנלינה', en: '⚠ Rod flaw discovered — Ignalina', cat: 'warn',
    desc_he: 'בכור RBMK באיגנלינה (ליטא) דווח על "השפעה חיובית של עצירת חירום" — תוספת תגובתיות זמנית בעת לחיצת AZ-5. הדיווח לא הופץ למפעילים בצ׳רנוביל.',
    desc_en: 'At Ignalina RBMK (Lithuania) the "positive scram effect" was reported. Report was NOT distributed to Chernobyl operators.' },
  { date: '25/4/1986 01:06', he: 'הכנות לניסוי הטורבינה', en: 'Turbine test preparation', cat: 'pre',
    desc_he: 'הספק מתחיל לרדת לקראת ניסוי בטיחות שתוכנן 4 שנים מראש לבחון יכולת אספקת חשמל לציוד חירום בזמן coastdown של טורבינה.',
    desc_en: 'Power begins reduction for safety test designed 4 years in advance to verify emergency equipment power supply during turbine coastdown.' },
  { date: '25/4 14:00', he: '🚨 ECCS נותקה', en: '🚨 ECCS disabled', cat: 'warn',
    desc_he: 'מערכת קירור החירום נותקה ידנית כדי לא להפריע לניסוי. הפרת רישיון. הניסוי נדחה ב-9 שעות בגלל דרישת רשת החשמל.',
    desc_en: 'ECCS manually disabled to not interfere with test. License violation. Test delayed 9 hours due to grid demand.' },
  { date: '26/4 00:28', he: '⚠ קריסה ל-30 MWt', en: '⚠ Crash to 30 MWt', cat: 'warn',
    desc_he: 'שגיאת מפעיל גורמת לקריסת הספק. הרעלת קסנון מסיבית. הצוות שולף מוטות בכוח כדי לחזור לאחוזי הפעולה — נשארו רק 8 מתוך 211.',
    desc_en: 'Operator error causes power crash. Massive xenon poisoning. Crew forcibly withdraws rods — only 8 out of 211 remain.' },
  { date: '26/4 01:23:40', he: '🔴 הפיצוץ', en: '🔴 EXPLOSION', cat: 'disaster',
    desc_he: 'AZ-5 הופעל. תוך 7 שניות שני פיצוצים הורסים את יחידה 4. גג 2,000 ט׳ נזרק. הליבה חשופה. שריפת גרפיט מתחילה — תימשך 9 ימים.',
    desc_en: 'AZ-5 activated. Within 7 seconds two explosions destroy Unit 4. 2,000-ton roof ejected. Core exposed. Graphite fire begins.' },
  { date: '26/4 01:28', he: 'הכבאים מגיעים', en: 'Firefighters arrive', cat: 'response',
    desc_he: '14 כבאים בראשות לוטננט פראבּיק מגיעים בעקבות שריפת הגג. ללא הגנת קרינה — לא הודיעו להם על הקרינה. רובם ימותו תוך שבועות.',
    desc_en: '14 firefighters led by Lt. Pravik arrive responding to roof fire. No radiation protection. Most will die within weeks.' },
  { date: '26/4 05:00', he: 'שריפת הגג כובתה', en: 'Roof fire extinguished', cat: 'response',
    desc_he: 'שריפות הגג והבניין כובו. אבל הליבה הגרפיטית עצמה בוערת ב-2,500°C ומשחררת רדיואקטיביות לאוויר במשך תשעה ימים.',
    desc_en: 'Roof and building fires extinguished. But graphite core burns at 2,500°C, releasing radioactivity for nine days.' },
  { date: '27/4 14:00', he: 'פינוי פריפיאט', en: 'Pripyat evacuation', cat: 'evac',
    desc_he: '1,200 אוטובוסים מפנים 49,000 תושבי פריפיאט תוך 3 שעות. ההודעה: "חזרו תוך 3 ימים". איש לא חזר לעולם.',
    desc_en: '1,200 buses evacuate 49,000 Pripyat residents within 3 hours. Announcement: "Return in 3 days". No one ever returned.' },
  { date: '28/4', he: 'שבדיה מתריעה לעולם', en: 'Sweden alerts the world', cat: 'global',
    desc_he: 'תחנת הכוח פורסמרק בשבדיה מזהה קרינה גבוהה על נעלי עובדים. ההגנה הסובייטית קורסת — העולם מגלה.',
    desc_en: 'Forsmark plant in Sweden detects high radiation on workers\' shoes. Soviet cover-up collapses — world finds out.' },
  { date: '2-10/5', he: 'הפלת חול ובור על הליבה', en: 'Sand and boron drops on core', cat: 'response',
    desc_he: '5,000 טון חול, חימר, עופרת ובור הוטלו ב-1,800 גיחות מסוקים על הליבה הבוערת. טייסי המסוקים ספגו מנות קרינה גבוהות.',
    desc_en: '5,000 tons of sand, clay, lead, and boron dropped in 1,800 helicopter sorties. Pilots received high radiation doses.' },
  { date: '4-6/5', he: '"שלושת המתנדבים"', en: '"The Three Volunteers"', cat: 'response',
    desc_he: 'אננקו, בז׳פאלוב ובארנוב צוללים למאגר מים מתחת לכור כדי לפתוח שסתום ולמנוע פיצוץ קיטור משני שעלול היה להגדיל את האסון פי 10.',
    desc_en: 'Ananenko, Bezpalov, and Baranov dive into water reservoir under reactor to open valve and prevent secondary steam explosion that could have multiplied disaster 10×.' },
  { date: '6/5', he: 'שריפת הגרפיט הסתיימה', en: 'Graphite fire extinguished', cat: 'response',
    desc_he: '9 ימים אחרי הפיצוץ, השריפה כובתה. סך כל הקרינה ששוחררה: 5,300 PBq — בערך 400 פעמים פצצת הירושימה מבחינת חומר רדיואקטיבי.',
    desc_en: '9 days after explosion, fire extinguished. Total radiation released: 5,300 PBq — ~400× Hiroshima bomb in radioactive material.' },
  { date: '5-11/1986', he: 'בניית הסרקופג הראשון', en: 'First Sarcophagus built', cat: 'build',
    desc_he: '600,000 ליקווידטורים בונים את "Object Shelter" — סרקופג בטון על הריסות הכור. תכנון לעמידות 30 שנה. הסתיים בנובמבר 1986.',
    desc_en: '600,000 liquidators build "Object Shelter" — concrete sarcophagus over reactor ruins. Designed for 30-year lifespan.' },
  { date: '1986-1989', he: 'מבצע "ביו-רובוטים"', en: 'Operation "Bio-Robots"', cat: 'response',
    desc_he: 'אחרי שרובוטים גרמניים נכשלו (אלקטרוניקה נשרפה מהקרינה), 3,400 חיילים סובייטיים שוגרו בנפרד לגג למשך 40-90 שניות כל אחד לפינוי גרפיט בידיים.',
    desc_en: 'After German robots failed (electronics burned by radiation), 3,400 Soviet soldiers were dispatched individually for 40-90 seconds each to clear graphite by hand.' },
  { date: '29/11/2016', he: 'הסגירה החדשה (NSC)', en: 'New Safe Confinement', cat: 'build',
    desc_he: 'הסגירה החדשה — קונסטרוקציה מתכת הגדולה בעולם, גובה 108 מ׳, משקל 36,000 ט׳ — הוסגה על הסרקופג הישן. מתוכננת ל-100 שנה.',
    desc_en: 'New Safe Confinement — world\'s largest mobile metal structure, 108m tall, 36,000 t — slid over old sarcophagus. Designed for 100 years.' },
];

const CAT: Record<string, { c: string; he: string; en: string }> = {
  build: { c: '#94a3b8', he: 'בנייה', en: 'Construction' },
  warn: { c: '#f59e0b', he: 'אזהרה', en: 'Warning' },
  pre: { c: '#06b6d4', he: 'טרום-אסון', en: 'Pre-Disaster' },
  disaster: { c: '#dc2626', he: 'אסון', en: 'Disaster' },
  response: { c: '#22c55e', he: 'תגובה', en: 'Response' },
  evac: { c: '#a855f7', he: 'פינוי', en: 'Evacuation' },
  global: { c: '#06b6d4', he: 'גלובלי', en: 'Global' },
};

export default function TimelinePage() {
  const [lang, setLang] = useState<'he' | 'en'>('he');
  const [filter, setFilter] = useState<string | null>(null);
  const he = lang === 'he';
  const t = (h: string, e: string) => (he ? h : e);

  const filtered = filter ? TL.filter((e) => e.cat === filter) : TL;

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

        <div style={{ textAlign: 'center', padding: '8px 0 28px' }} className="fade-in">
          <div style={{ display: 'inline-block', border: '1px solid rgba(200,164,78,0.4)', padding: '3px 16px', color: C.gold, fontSize: 10, fontWeight: 700, letterSpacing: '0.3em', marginBottom: 12, fontFamily: 'monospace', background: 'rgba(200,164,78,0.05)' }}>
            [ {he ? 'ציר זמן מלא' : 'FULL TIMELINE'} ]
          </div>
          <h1 style={{ fontSize: 'clamp(28px,5.5vw,46px)', fontWeight: 900, lineHeight: 1.1, fontFamily: "'Playfair Display',serif", marginBottom: 6, background: `linear-gradient(135deg,${C.gold},${C.gL},${C.gold})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {t('ציר הזמן', 'The Timeline')}
          </h1>
          <h2 style={{ fontSize: 'clamp(13px,2.5vw,17px)', fontWeight: 400, color: 'rgba(232,213,160,0.85)', fontFamily: "'Playfair Display',serif", marginBottom: 8 }}>
            {t('מהבנייה (1971) ועד הסגירה החדשה (2016)', 'From construction (1971) to New Safe Confinement (2016)')}
          </h2>
          <div className="gr" style={{ margin: '0 auto' }} />
        </div>

        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 20 }}>
          <button onClick={() => setFilter(null)} style={{ padding: '6px 12px', fontSize: 11, fontWeight: 700, background: filter === null ? `${C.gold}33` : 'rgba(0,0,0,0.3)', color: filter === null ? C.gold : 'rgba(255,255,255,0.6)', border: `1px solid ${filter === null ? C.gold : 'rgba(255,255,255,0.1)'}`, borderRadius: 6, cursor: 'pointer', fontFamily: 'monospace' }}>
            {t('הכל', 'All')} ({TL.length})
          </button>
          {Object.entries(CAT).map(([k, v]) => {
            const count = TL.filter((e) => e.cat === k).length;
            return (
              <button key={k} onClick={() => setFilter(filter === k ? null : k)} style={{ padding: '6px 12px', fontSize: 11, fontWeight: 700, background: filter === k ? `${v.c}33` : 'rgba(0,0,0,0.3)', color: filter === k ? v.c : 'rgba(255,255,255,0.6)', border: `1px solid ${filter === k ? v.c : 'rgba(255,255,255,0.1)'}`, borderRadius: 6, cursor: 'pointer', fontFamily: 'monospace' }}>
                {t(v.he, v.en)} ({count})
              </button>
            );
          })}
        </div>

        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', top: 0, bottom: 0, [he ? 'right' : 'left']: 24, width: 2, background: `linear-gradient(180deg, transparent, ${C.gold}55, ${C.danger}88, ${C.green}55, transparent)` }} />
          {filtered.map((ev, i) => {
            const cat = CAT[ev.cat];
            return (
              <div key={i} style={{ position: 'relative', paddingInlineStart: 60, marginBottom: 16 }} className="fade-in">
                <div style={{ position: 'absolute', [he ? 'right' : 'left']: 16, top: 14, width: 18, height: 18, borderRadius: '50%', background: cat.c, border: '2px solid #fff', boxShadow: `0 0 14px ${cat.c}aa` }} />
                <div style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)', border: `1px solid ${cat.c}55`, borderRadius: 12, padding: '14px 18px' }} className="hover-lift">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6, flexWrap: 'wrap', gap: 6 }}>
                    <div style={{ fontSize: 14, fontWeight: 900, color: cat.c, fontFamily: 'monospace' }}>{ev.date}</div>
                    <div style={{ fontSize: 9, fontWeight: 700, color: cat.c, fontFamily: 'monospace', letterSpacing: '0.15em', background: `${cat.c}15`, padding: '2px 8px', borderRadius: 4, border: `1px solid ${cat.c}33` }}>
                      {t(cat.he, cat.en)}
                    </div>
                  </div>
                  <h3 style={{ fontSize: 16, fontWeight: 800, color: '#fff', fontFamily: "'Playfair Display',serif", lineHeight: 1.3, marginBottom: 8 }}>
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

        <div style={{ marginTop: 30, padding: '12px 14px', borderRadius: 8, background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(200,164,78,0.12)', textAlign: 'center' }}>
          <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)', fontFamily: 'monospace' }}>
            📚 {t('מקורות', 'Sources')}: IAEA INSAG-7 · UNSCEAR 2008 · Higginbotham (2019) · Plokhy (2018)
          </p>
        </div>
      </div>
    </div>
  );
}
