'use client';
import { useState, useEffect, useRef } from 'react';
import { C, LIQUIDATORS } from '@/lib/data';

const RISK_COLORS: Record<string, string> = { extreme: C.danger, high: C.amber, medium: C.blue };
const RISK_HE: Record<string, string> = { extreme: 'קיצוני', high: 'גבוה', medium: 'בינוני' };
const RISK_EN: Record<string, string> = { extreme: 'EXTREME', high: 'HIGH', medium: 'MEDIUM' };

// Narrative chapters about first responders — based on documented historical facts
// (paraphrased from multiple sources: Higginbotham, Plokhy, IAEA, eyewitness accounts)
const STORY_HE = [
  {
    title: '01:28 — ראשונים בזירה',
    body: 'ארבעה-עשר כבאים בראשות הסגן ולדימיר פראבּיק הגיעו לכור 4 פחות מחמש דקות אחרי הפיצוץ. הם לבשו בגדי כיבוי רגילים בלבד. ללא מנ״פ. ללא דוזימטרים. ללא הבנה שהאש שלפניהם לא היא האיום — אלא מה שמסביבה.',
  },
  {
    title: 'מה שלא הכשירו אותם אליו',
    body: 'בברית המועצות, אפשרות שכור RBMK יכול להתפוצץ נחשבה לחסרת בסיס מדעי. לכן הכבאים פשוט לא הוכשרו לתרחיש כזה. הם פעלו לפי הפרוטוקול של שריפת מבנה. לטפס לגג, לכוון מים על הלהבות, לעבור לבא בתור.',
  },
  {
    title: 'הגרפיט על הגג',
    body: 'הליבה הקיאה לאוויר חתיכות גרפיט מאט בוערות — כל אחת הקרינה אלפי רנטגן בשעה. הכבאים בעטו בהן הצידה כדי שלא יפריעו. מגפיהם דבקו לביטומן הנמס בחום. הלהבות סירבו להיכבות במים — חלקן בערו בצבעים משונים, מכילות עקבות של דלק אורניום.',
  },
  {
    title: 'תוך 30 דקות',
    body: 'הסימנים החלו במהירות הבזק: כאבי ראש קשים, בחילות, הקאות, חולשה משתקת, צמא בלתי נסבל לאחר שנחשפו למנות של 4-16 גריי. אחד מהם, מצומא, שתה ממים שזיהמה הקרינה ושרף את מערכת העיכול שלו. עורם הסמיק, אחר כך הסגיל, אחר כך השחיר.',
  },
  {
    title: 'בית חולים מס׳ 6, מוסקבה',
    body: 'המנות שספגו עברו בהרבה את סף ה-LD50 (4 גריי לכל הגוף). 28 מהם מתו תוך 3 חודשים מתסמונת קרינה חריפה (ARS). ד״ר אנג׳לינה גוסקובה ניסתה השתלות מח עצם — כמעט כל הניסיונות נכשלו. גופותיהם המשיכו להקרין גם אחרי המוות.',
  },
  {
    title: 'הקבורה',
    body: 'ארונות אבץ סגורים. בית קברות מיטינסקויה במוסקבה. אריחי בטון מעל הקברים — לא לכבוד, אלא כדי לחסום את הקרינה שעוד עלתה מהגופות. פראבּיק וקיבנוק שניהם הוכרזו לאחר מותם כ״גיבורי ברית המועצות״. הם לא ידעו שהקריבו את חייהם בתשלום על שקר ישן יותר מהם.',
  },
];

const STORY_EN = [
  {
    title: '01:28 — First on Scene',
    body: '14 firefighters led by Lt. Vladimir Pravik arrived at Reactor 4 less than five minutes after the explosion. Standard turnout gear only. No SCBA. No dosimeters. No understanding that the fire ahead was not the threat — what surrounded it was.',
  },
  {
    title: 'What They Were Never Trained For',
    body: 'In the Soviet Union, the possibility that an RBMK reactor could explode was considered scientifically baseless. So firefighters were simply not trained for such a scenario. They followed building-fire protocol. Climb to roof. Aim water at flames. Move to next.',
  },
  {
    title: 'Graphite on the Roof',
    body: 'The core had vomited burning moderator graphite into open air — each chunk emitting thousands of roentgens per hour. Firefighters kicked them aside to clear the way. Their boots stuck to bitumen melted in the heat. Some flames refused to extinguish under water — burning in strange colors, traces of uranium fuel.',
  },
  {
    title: 'Within 30 Minutes',
    body: 'Symptoms struck like lightning: severe headaches, nausea, vomiting, paralyzing weakness, unbearable thirst — after exposures of 4–16 Gray. One man, parched, drank from a radiation-contaminated pool and burned his digestive tract. Skin reddened, then turned purple, then black.',
  },
  {
    title: 'Hospital No. 6, Moscow',
    body: 'The doses they absorbed far exceeded the LD50 threshold (4 Gy whole-body). 28 of them died within 3 months from Acute Radiation Syndrome (ARS). Dr. Angelina Guskova attempted bone marrow transplants — nearly all failed. Their bodies continued to emit radiation even after death.',
  },
  {
    title: 'The Burial',
    body: 'Sealed zinc coffins. Mitinskoye cemetery in Moscow. Concrete tiles laid over the graves — not for honor, but to block the radiation still rising from their bodies. Pravik and Kibenok were both posthumously named "Heroes of the Soviet Union." They did not know they had paid with their lives for a lie older than themselves.',
  },
];

export default function Response({ he, t }: { he: boolean; t: (h: string, e: string) => string }) {
  const [open, setOpen] = useState<string | null>('fire');
  const [storyOpen, setStoryOpen] = useState(true);
  const [playingChapter, setPlayingChapter] = useState<number | null>(null);

  // Stop on lang change
  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setPlayingChapter(null);
    }
  }, [he]);

  const speakChapter = (i: number) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    if (playingChapter === i) {
      window.speechSynthesis.cancel();
      setPlayingChapter(null);
      return;
    }
    window.speechSynthesis.cancel();
    const story = he ? STORY_HE[i] : STORY_EN[i];
    const text = story.title + '. ' + story.body;
    const voices = window.speechSynthesis.getVoices();
    const voice = he
      ? voices.find((v) => v.lang.startsWith('he')) || voices.find((v) => v.lang.startsWith('iw'))
      : voices.find((v) => v.lang.startsWith('en'));
    const u = new SpeechSynthesisUtterance(text);
    u.lang = he ? 'he-IL' : 'en-US';
    if (voice) u.voice = voice;
    u.rate = 0.82;
    u.pitch = 0.85;
    u.onend = () => setPlayingChapter(null);
    u.onerror = () => setPlayingChapter(null);
    setPlayingChapter(i);
    window.speechSynthesis.speak(u);
  };

  const story = he ? STORY_HE : STORY_EN;

  return (
    <section id="response" style={{ padding: '60px 16px 30px', position: 'relative' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 28, position: 'relative' }}>
          <div className="section-number" style={{ top: '-20px', insetInlineStart: '5%' }}>04</div>
          <div className="section-kicker">[ {t('סעיף רביעי · הכלה', 'PART FOUR · CONTAINMENT')} ]</div>
          <h2 className="section-title">{t('פעולות הכיבוי וההכלה', 'Containment & Response')}</h2>
          <p className="section-subtitle">{t('600,000 ליקווידטורים · מבצע ההצלה ההיסטורי', '600,000 liquidators · Historic rescue operation')}</p>
          <div className="gr" style={{ margin: '0 auto' }} />
        </div>

        {/* ============================================ */}
        {/* EMOTIONAL NARRATIVE — The First Responders   */}
        {/* ============================================ */}
        <div style={{
          marginBottom: 28,
          background: 'linear-gradient(180deg, rgba(20,5,5,0.85), rgba(40,10,10,0.6))',
          border: `1px solid ${C.danger}55`,
          borderRadius: 16,
          overflow: 'hidden',
          boxShadow: `0 0 40px rgba(220,38,38,0.15)`,
        }}>
          {/* Header */}
          <div style={{
            padding: '18px 22px',
            background: 'rgba(0,0,0,0.5)',
            borderBottom: `1px solid ${C.danger}55`,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  display: 'inline-block',
                  padding: '3px 10px',
                  background: `${C.danger}25`,
                  border: `1px solid ${C.danger}99`,
                  borderRadius: 4,
                  fontSize: 9,
                  fontWeight: 800,
                  color: C.danger,
                  fontFamily: "'JetBrains Mono', monospace",
                  letterSpacing: '0.2em',
                  marginBottom: 8,
                }}>
                  {t('הסיפור האנושי', 'THE HUMAN STORY')}
                </div>
                <h3 style={{ fontSize: 22, fontWeight: 900, color: '#fff', fontFamily: "'Playfair Display', serif", lineHeight: 1.2, marginBottom: 4 }}>
                  🔥 {t('הראשונים שעלו לגג', 'The First on the Roof')}
                </h3>
                <p style={{ fontSize: 12, color: C.gL, fontStyle: 'italic' }}>
                  {t('14 כבאים, 28 מתים, אגדה אחת', '14 firefighters, 28 dead, one legend')}
                </p>
              </div>
              <button onClick={() => setStoryOpen(!storyOpen)} style={{
                padding: '8px 14px', background: storyOpen ? `${C.danger}30` : 'rgba(255,255,255,0.05)',
                border: `1px solid ${C.danger}77`, borderRadius: 6,
                color: storyOpen ? '#fff' : C.gL, fontSize: 11, fontWeight: 700,
                fontFamily: "'JetBrains Mono', monospace", cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}>
                {storyOpen ? `▲ ${t('סגור', 'COLLAPSE')}` : `▼ ${t('הצג', 'EXPAND')}`}
              </button>
            </div>
          </div>

          {/* Story chapters */}
          {storyOpen && (
            <div style={{ padding: 'clamp(14px, 3vw, 22px)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {story.map((ch, i) => {
                  const isPlaying = playingChapter === i;
                  return (
                    <div key={i} className="fade-in" style={{
                      padding: '14px 16px',
                      background: 'rgba(0,0,0,0.45)',
                      border: `1px solid ${isPlaying ? C.danger : 'rgba(255,255,255,0.08)'}`,
                      borderInlineStart: `4px solid ${C.danger}99`,
                      borderRadius: 10,
                      animationDelay: `${i * 0.08}s`,
                      transition: 'all 0.3s',
                      boxShadow: isPlaying ? `0 0 18px ${C.danger}33` : 'none',
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10, marginBottom: 8 }}>
                        <h4 style={{
                          fontSize: 15, fontWeight: 800,
                          color: '#fff',
                          fontFamily: "'Playfair Display', serif",
                          lineHeight: 1.3, flex: 1,
                        }}>
                          {ch.title}
                        </h4>
                        <button onClick={() => speakChapter(i)} aria-label={t('האזן לקטע', 'Listen to chapter')} style={{
                          width: 32, height: 32, borderRadius: '50%',
                          background: isPlaying ? `${C.danger}40` : 'rgba(0,0,0,0.5)',
                          border: `1px solid ${isPlaying ? C.danger : C.gold}99`,
                          color: isPlaying ? C.danger : C.gold,
                          fontSize: 13, cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          flexShrink: 0,
                          transition: 'all 0.25s',
                        }}>
                          {isPlaying ? '⏸' : '▶'}
                        </button>
                      </div>
                      <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.92)', lineHeight: 1.95 }}>
                        {ch.body}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Attribution */}
              <div style={{
                marginTop: 16, padding: '10px 14px',
                background: 'rgba(0,0,0,0.4)',
                border: `1px solid ${C.gold}33`,
                borderRadius: 8,
                fontSize: 10, color: 'rgba(255,255,255,0.6)',
                fontFamily: "'JetBrains Mono', monospace",
                lineHeight: 1.7, textAlign: 'center',
              }}>
                {t(
                  '📚 מבוסס על מקורות מאומתים: Higginbotham (Midnight in Chernobyl), Plokhy (Chernobyl), עדויות UNSCEAR, IAEA, ראיונות גוסקובה',
                  '📚 Based on verified sources: Higginbotham (Midnight in Chernobyl), Plokhy (Chernobyl), UNSCEAR, IAEA testimonies, Guskova interviews'
                )}
              </div>
            </div>
          )}
        </div>

        {/* Top stats */}
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

        {/* Liquidator groups */}
        <h3 style={{ fontSize: 18, fontWeight: 800, color: C.gold, fontFamily: "'Playfair Display', serif", marginBottom: 14, textAlign: 'center' }}>
          {t('10 קבוצות הליקווידטורים', '10 Liquidator Groups')}
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

        {/* Closing tribute */}
        <div className="card-light" style={{ padding: '20px 24px', marginTop: 24, textAlign: 'center', borderInlineStart: `4px solid ${C.gold}` }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>🕯</div>
          <p style={{ fontSize: 14, color: C.gL, lineHeight: 1.85, fontStyle: 'italic', fontFamily: "'Playfair Display', serif" }}>
            {t(
              '״הם נכנסו לחושך כדי שאחרים יוכלו לחיות באור.״ — 28 הכבאים שמתו תוך שבועות. שלושת המתנדבים שצללו במים. 3,400 ה״ביו-רובוטים״ שעלו לגג ל-90 שניות. 600,000 הליקווידטורים. כל אחד מהם הציל אלפי חיים.',
              '"They walked into the dark so others could live in light." — 28 firefighters who died within weeks. Three volunteers who dove into water. 3,400 "bio-robots" who climbed the roof for 90 seconds. 600,000 liquidators. Each saved thousands of lives.'
            )}
          </p>
        </div>
      </div>
    </section>
  );
}
