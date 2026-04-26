'use client';
import { useState } from 'react';
import Link from 'next/link';

const C = { gold: '#c8a44e', gL: '#e8d5a0', danger: '#ef4444', blue: '#06b6d4', green: '#22c55e', amber: '#f59e0b', purple: '#a855f7' };

const SOURCES = [
  // Primary technical reports
  { cat: 'iaea', icon: '📋', title: 'IAEA INSAG-7 (1992)', subtitle: 'The Chernobyl Accident: Updating of INSAG-1',
    desc_he: 'הניתוח הסמכותי הרשמי של אסון צ׳רנוביל. מאשים גם פגמי תכן של RBMK וגם טעויות מפעילים. מסמך הבסיס לכל ניתוח מקצועי.',
    desc_en: 'Authoritative official analysis. Blames both RBMK design flaws and operator errors. Foundation document for all professional analysis.',
    url: 'https://www-pub.iaea.org/MTCD/publications/PDF/Pub913e_web.pdf', year: 1992 },
  { cat: 'iaea', icon: '📋', title: 'IAEA INSAG-1 (1986)', subtitle: 'Original Post-Accident Report',
    desc_he: 'הדוח הראשון אחרי האסון. הוצא ב-1986 עוד תחת ההגדרה הסובייטית — שהאשים בעיקר את המפעילים. אחר כך תוקן ב-INSAG-7.',
    desc_en: 'First post-accident report. Published 1986 under Soviet narrative — primarily blamed operators. Later corrected by INSAG-7.',
    url: 'https://www-pub.iaea.org/MTCD/publications/PDF/Pub913e_web.pdf', year: 1986 },
  { cat: 'unscear', icon: '🔬', title: 'UNSCEAR 2008 Report — Annex D',
    subtitle: 'Health effects due to radiation from the Chernobyl accident',
    desc_he: 'דוח הוועדה המדעית של האו״ם. הסיכום המקיף של ההשפעות הבריאותיות לטווח ארוך. 6,000+ מקרי סרטן בלוטת התריס בילדים.',
    desc_en: 'UN Scientific Committee report. Comprehensive summary of long-term health effects. 6,000+ childhood thyroid cancer cases.',
    url: 'https://www.unscear.org/docs/reports/2008/11-80076_Report_2008_Annex_D.pdf', year: 2008 },
  { cat: 'who', icon: '🏥', title: 'WHO 2006 Report',
    subtitle: 'Health Effects of the Chernobyl Accident and Special Health Care Programmes',
    desc_he: 'דוח ארגון הבריאות העולמי. שנה לאחר 20 לאסון. מקור עיקרי להשלכות בריאותיות לטווח ארוך.',
    desc_en: 'World Health Organization report. 20 years after disaster. Primary source for long-term health consequences.',
    url: 'https://www.who.int/publications/i/item/9241594179', year: 2006 },
  { cat: 'nrc', icon: '⚛', title: 'US NRC NUREG-1250',
    subtitle: 'Report on the Accident at the Chernobyl Nuclear Power Station',
    desc_he: 'דוח ועדת הרגולציה הגרעינית האמריקאית. ניתוח טכני מפורט מנקודת מבט מערבית.',
    desc_en: 'US Nuclear Regulatory Commission report. Detailed technical analysis from Western perspective.',
    url: 'https://www.nrc.gov/docs/ML0716/ML071690245.pdf', year: 1987 },

  // Books
  { cat: 'book', icon: '📚', title: 'Adam Higginbotham — Midnight in Chernobyl',
    subtitle: 'The Untold Story of the World\'s Greatest Nuclear Disaster',
    desc_he: 'הספר העיתונאי הטוב ביותר על האסון. מחקר של 5 שנים, ראיונות ניצולים, מסמכים סובייטיים. 2019. כיסוי דקה-אחר-דקה.',
    desc_en: 'Best journalistic book on the disaster. 5 years of research, survivor interviews, Soviet documents. 2019. Minute-by-minute coverage.',
    url: 'https://www.simonandschuster.com/books/Midnight-in-Chernobyl/Adam-Higginbotham/9781501134630', year: 2019 },
  { cat: 'book', icon: '📚', title: 'Serhii Plokhy — Chernobyl: History of a Tragedy',
    subtitle: 'Pulitzer Prize 2018',
    desc_he: 'ספר מהיסטוריון אוקראיני בהרווארד. זוכה פרס פוליצר 2018. ניתוח רחב יותר של ההקשר הסובייטי וההיסטורי.',
    desc_en: 'Book by Ukrainian historian at Harvard. Pulitzer Prize 2018. Broader analysis of Soviet and historical context.',
    url: 'https://www.basicbooks.com/titles/serhii-plokhy/chernobyl/9781541617094/', year: 2018 },
  { cat: 'book', icon: '📚', title: 'Svetlana Alexievich — Voices from Chernobyl',
    subtitle: 'Chronicle of the Future (Nobel Prize 2015)',
    desc_he: 'ספר עדויות אישיות של ניצולים, ליקווידטורים, ובני משפחותיהם. הזוכה בנובל לספרות 2015 בהשראה ממנו.',
    desc_en: 'Book of personal testimonies from survivors, liquidators, and family members. Author won Nobel Prize in Literature 2015 partly for it.',
    url: 'https://www.penguinrandomhouse.com/books/93009/voices-from-chernobyl-by-svetlana-alexievich/', year: 1997 },

  // Documentaries
  { cat: 'doc', icon: '🎬', title: 'HBO — Chernobyl (2019 miniseries)',
    subtitle: '5-episode dramatization',
    desc_he: 'סדרת המיני המוערכת מאוד. ברובה מדויקת מבחינה היסטורית, אם כי קיימים סטיות לשם הדרמה. הפיקה מודעות ציבורית עצומה.',
    desc_en: 'Highly acclaimed miniseries. Mostly historically accurate, with some dramatic license. Generated huge public awareness.',
    url: 'https://www.hbo.com/chernobyl', year: 2019 },
  { cat: 'doc', icon: '🎬', title: 'BBC — Chernobyl: The Real Story',
    subtitle: 'Documentary',
    desc_he: 'דוקומנטרי BBC עם ראיונות עד והצגת מסמכים. השלמה טובה לסדרת HBO.',
    desc_en: 'BBC documentary with eyewitness interviews and document presentation. Good complement to HBO series.',
    url: 'https://www.bbc.co.uk/programmes/p07cyh3y', year: 2019 },

  // Online resources
  { cat: 'web', icon: '🌐', title: 'Chernobyl Gallery (Photo Archive)',
    subtitle: 'Comprehensive photo archive',
    desc_he: 'ארכיון תמונות מקיף של האסון, פריפיאט, אזור ההדרה. תמונות מ-1986 ועד היום.',
    desc_en: 'Comprehensive photo archive of disaster, Pripyat, exclusion zone. Photos from 1986 to today.',
    url: 'https://chernobylgallery.com/', year: null },
  { cat: 'web', icon: '🌐', title: 'World Nuclear Association — Chernobyl Accident',
    subtitle: 'Technical summary',
    desc_he: 'סיכום טכני מקיף של האסון על ידי האגודה הגרעינית העולמית. עדכון רציף.',
    desc_en: 'Comprehensive technical summary by World Nuclear Association. Continuously updated.',
    url: 'https://world-nuclear.org/information-library/safety-and-security/safety-of-plants/chernobyl-accident.aspx', year: null },
  { cat: 'web', icon: '🌐', title: 'Chernobyl Tour — Official Exclusion Zone Site',
    subtitle: 'Government information',
    desc_he: 'אתר רשמי של אזור ההדרה האוקראיני. מידע נוכחי על מצב הסגירה החדשה (NSC), פעילות מחקר, וטיולים.',
    desc_en: 'Official Ukrainian Exclusion Zone site. Current info on New Safe Confinement, research, and tours.',
    url: 'https://www.chernobyl-tour.com/', year: null },

  // Scholarly
  { cat: 'sci', icon: '🔬', title: 'Chernobyl Forum (IAEA/WHO/UNDP) — 2005',
    subtitle: 'Chernobyl\'s Legacy: Health, Environmental and Socio-Economic Impacts',
    desc_he: 'דוח משותף של 8 סוכנויות או״ם. הסיכום הסמכותי של ההשפעות הבריאותיות והסביבתיות לאחר 20 שנה.',
    desc_en: 'Joint report by 8 UN agencies. Authoritative summary of health and environmental effects 20 years after.',
    url: 'https://www.iaea.org/sites/default/files/chernobyl.pdf', year: 2005 },
  { cat: 'sci', icon: '🔬', title: 'Cardis et al. — Cancer consequences (2006)',
    subtitle: 'International Journal of Cancer',
    desc_he: 'מאמר אקדמי המעריך 16,000 מקרי סרטן עודפים באירופה כתוצאה מצ׳רנוביל בעשורים הקרובים.',
    desc_en: 'Academic paper estimating 16,000 excess cancer cases in Europe over coming decades.',
    url: 'https://onlinelibrary.wiley.com/doi/10.1002/ijc.22037', year: 2006 },
];

const CAT: Record<string, { c: string; he: string; en: string }> = {
  iaea: { c: '#c8a44e', he: 'IAEA — דוחות', en: 'IAEA Reports' },
  unscear: { c: '#22c55e', he: 'UNSCEAR', en: 'UNSCEAR' },
  who: { c: '#06b6d4', he: 'WHO — בריאות', en: 'WHO Health' },
  nrc: { c: '#a855f7', he: 'NRC — אמריקה', en: 'NRC US' },
  book: { c: '#f59e0b', he: 'ספרים', en: 'Books' },
  doc: { c: '#ef4444', he: 'דוקומנטרי', en: 'Documentaries' },
  web: { c: '#94a3b8', he: 'אתרים', en: 'Websites' },
  sci: { c: '#06b6d4', he: 'מחקר אקדמי', en: 'Academic' },
};

export default function SourcesPage() {
  const [lang, setLang] = useState<'he' | 'en'>('he');
  const [filter, setFilter] = useState<string | null>(null);
  const [tab, setTab] = useState<'sources' | 'presentation' | 'infographic'>('sources');
  const he = lang === 'he';
  const t = (h: string, e: string) => (he ? h : e);

  const filtered = filter ? SOURCES.filter((s) => s.cat === filter) : SOURCES;

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
            [ {he ? 'מקורות וחומרים' : 'SOURCES & MATERIALS'} ]
          </div>
          <h1 style={{ fontSize: 'clamp(28px,5.5vw,46px)', fontWeight: 900, lineHeight: 1.1, fontFamily: "'Playfair Display',serif", marginBottom: 6, background: `linear-gradient(135deg,${C.gold},${C.gL})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {t('מקורות', 'Sources')}
          </h1>
          <h2 style={{ fontSize: 'clamp(13px,2.5vw,17px)', fontWeight: 400, color: 'rgba(232,213,160,0.85)', fontFamily: "'Playfair Display',serif", marginBottom: 8 }}>
            {t('מחקרים, ספרים, מצגת ואינפוגרפיקה', 'Research, books, presentation and infographic')}
          </h2>
          <div className="gr" style={{ margin: '0 auto' }} />
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 16, justifyContent: 'center', background: 'rgba(0,0,0,0.4)', padding: 4, borderRadius: 10, border: '1px solid rgba(200,164,78,0.2)' }}>
          {([
            ['sources', '📚', t('מקורות', 'Sources')],
            ['presentation', '🎯', t('מצגת', 'Presentation')],
            ['infographic', '🎨', t('אינפוגרפיקה', 'Infographic')],
          ] as const).map(([k, ic, lb]) => (
            <button key={k} onClick={() => setTab(k)} style={{
              flex: 1, padding: '8px 12px', fontSize: 12, fontWeight: 700,
              background: tab === k ? `${C.gold}33` : 'transparent',
              color: tab === k ? C.gold : 'rgba(255,255,255,0.5)',
              border: 'none', borderRadius: 6, cursor: 'pointer', fontFamily: 'monospace'
            }}>
              {ic} {lb}
            </button>
          ))}
        </div>

        {tab === 'sources' && (
          <>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 18 }}>
              <button onClick={() => setFilter(null)} style={{ padding: '6px 12px', fontSize: 11, fontWeight: 700, background: filter === null ? `${C.gold}33` : 'rgba(0,0,0,0.3)', color: filter === null ? C.gold : 'rgba(255,255,255,0.6)', border: `1px solid ${filter === null ? C.gold : 'rgba(255,255,255,0.1)'}`, borderRadius: 6, cursor: 'pointer', fontFamily: 'monospace' }}>
                {t('הכל', 'All')} ({SOURCES.length})
              </button>
              {Object.entries(CAT).map(([k, v]) => {
                const count = SOURCES.filter((s) => s.cat === k).length;
                return (
                  <button key={k} onClick={() => setFilter(filter === k ? null : k)} style={{ padding: '6px 12px', fontSize: 11, fontWeight: 700, background: filter === k ? `${v.c}33` : 'rgba(0,0,0,0.3)', color: filter === k ? v.c : 'rgba(255,255,255,0.6)', border: `1px solid ${filter === k ? v.c : 'rgba(255,255,255,0.1)'}`, borderRadius: 6, cursor: 'pointer', fontFamily: 'monospace' }}>
                    {t(v.he, v.en)} ({count})
                  </button>
                );
              })}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
              {filtered.map((s, i) => {
                const cat = CAT[s.cat];
                return (
                  <a key={i} href={s.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                    <div className="hover-lift fade-in" style={{ background: 'rgba(0,0,0,0.5)', border: `1px solid ${cat.c}44`, borderRadius: 12, padding: '14px 18px', cursor: 'pointer', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                      <div style={{ fontSize: 28, lineHeight: 1 }}>{s.icon}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                          <h3 style={{ fontSize: 15, fontWeight: 800, color: '#fff', fontFamily: "'Playfair Display',serif", lineHeight: 1.3 }}>
                            {s.title}
                          </h3>
                          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                            {s.year && <span style={{ fontSize: 11, color: cat.c, fontFamily: 'monospace', fontWeight: 700 }}>{s.year}</span>}
                            <span style={{ fontSize: 9, color: cat.c, fontFamily: 'monospace', letterSpacing: '0.1em', background: `${cat.c}15`, padding: '2px 8px', borderRadius: 4, border: `1px solid ${cat.c}33`, whiteSpace: 'nowrap' }}>
                              {t(cat.he, cat.en)}
                            </span>
                          </div>
                        </div>
                        <p style={{ fontSize: 11, color: cat.c, fontStyle: 'italic', marginBottom: 6, opacity: 0.85 }}>
                          {s.subtitle}
                        </p>
                        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.85)', lineHeight: 1.7 }}>
                          {t(s.desc_he, s.desc_en)}
                        </p>
                        <div style={{ marginTop: 6, fontSize: 10, color: cat.c, fontFamily: 'monospace' }}>
                          🔗 {s.url.length > 60 ? s.url.substring(0, 57) + '...' : s.url}
                        </div>
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>
          </>
        )}

        {tab === 'presentation' && (
          <div className="fade-in">
            <div className="card" style={{ padding: 16, marginBottom: 14 }}>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: C.gold, fontFamily: "'Playfair Display',serif", marginBottom: 6, textAlign: 'center' }}>
                🎯 {t('המצגת המקצועית', 'Professional Presentation')}
              </h3>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', textAlign: 'center', lineHeight: 1.7 }}>
                {t('8 שקפים — סקירה מקיפה של האסון', '8 slides — comprehensive overview of the disaster')}
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <div key={n} className="fade-in" style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(200,164,78,0.25)', boxShadow: '0 6px 24px rgba(0,0,0,0.4)' }}>
                  <div style={{ position: 'absolute', top: 8, [he ? 'right' : 'left']: 8, padding: '4px 10px', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', border: '1px solid rgba(200,164,78,0.4)', borderRadius: 6, fontSize: 10, color: C.gold, fontFamily: 'monospace', fontWeight: 700, zIndex: 2 }}>
                    {t('שקף', 'Slide')} {n}/8
                  </div>
                  <img src={`/images/slide-${n}.jpg`} alt={`Slide ${n}`} style={{ width: '100%', display: 'block' }} />
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'infographic' && (
          <div className="fade-in">
            <div className="card" style={{ padding: 16, marginBottom: 14 }}>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: C.gold, fontFamily: "'Playfair Display',serif", marginBottom: 6, textAlign: 'center' }}>
                🎨 {t('אינפוגרפיקה — אנטומיה של כשל גרעיני', 'Infographic — Anatomy of a Nuclear Failure')}
              </h3>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', textAlign: 'center', lineHeight: 1.7 }}>
                {t('סקירה ויזואלית של מבנה הכור, הכרונולוגיה, ההשפעות והנפגעים', 'Visual overview of reactor structure, chronology, impacts and casualties')}
              </p>
            </div>
            <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(200,164,78,0.25)', boxShadow: '0 6px 24px rgba(0,0,0,0.4)' }}>
              <img src="/images/infographic.png" alt="Chernobyl Anatomy Infographic" style={{ width: '100%', display: 'block' }} />
            </div>
          </div>
        )}

        <div style={{ marginTop: 24, padding: '12px 14px', borderRadius: 8, background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(200,164,78,0.12)', textAlign: 'center' }}>
          <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)', fontFamily: 'monospace', lineHeight: 1.6 }}>
            {t('כל המקורות הם פתוחים לציבור. למטרות מקצועיות והדרכתיות בלבד.', 'All sources are publicly available. For professional and educational purposes only.')}
          </p>
        </div>
      </div>
    </div>
  );
}
