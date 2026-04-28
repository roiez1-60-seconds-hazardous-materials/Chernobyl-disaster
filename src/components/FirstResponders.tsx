'use client';
import { C } from '@/lib/data';
import { useSpeech } from '@/lib/useSpeech';
import MemorialCard from './MemorialCard';

const STORY_HE = [
  {
    time: '01:28',
    title: 'ראשונים בזירה',
    body: 'ארבעה-עשר כבאים בראשות הסגן ולדימיר פראביק הגיעו לכור 4 פחות מחמש דקות אחרי הפיצוץ. הם לבשו בגדי כיבוי רגילים בלבד. ללא מערכת נשימה עצמית (מנ״פ). ללא מדי קרינה אישיים. אף אחד לא יידע אותם שמה שמסביבם הוא קרינה רדיואקטיבית קטלנית — הם חשבו שזו שריפה רגילה של גג.',
  },
  {
    time: '01:30',
    title: 'מה שלא הכשירו אותם אליו',
    body: 'בברית המועצות, האפשרות שכור גרעיני יכול להתפוצץ נחשבה ל"חסרת בסיס מדעי" — לכן הכבאים פשוט לא הוכשרו לתרחיש כזה. הם פעלו לפי הפרוטוקול הרגיל של שריפת מבנה: לטפס לגג, לכוון מים על הלהבות, להעביר את העבודה לכבאי הבא.',
  },
  {
    time: '01:35',
    title: 'הגרפיט על הגג',
    body: 'הליבה פלטה לאוויר חתיכות גרפיט בוערות — כל חתיכה הקרינה אלפי רנטגן בשעה (מנה קטלנית בתוך דקות). הכבאים בעטו בהן הצידה כדי שלא יפריעו לעבודתם. מגפיהם דבקו לאספלט שעל הגג שנמס מהחום. הלהבות סירבו להיכבות במים — חלק מהן בערו בצבעים משונים, מכילות עקבות של דלק אורניום שעף מהליבה.',
  },
  {
    time: '01:50',
    title: 'הסימנים הראשונים מופיעים',
    body: 'תוך 20-30 דקות בלבד החלו תסמיני הקרינה: כאבי ראש מתישים, בחילות, הקאות, חולשה משתקת, צמא בלתי נסבל. אלו תסמיני תסמונת קרינה חריפה — מחלה שמתפתחת בזמן אמת בגוף שספג מנה גבוהה. אחד הכבאים, מצומא, שתה מים מבריכת קירור מזוהמת — ושרף את מערכת העיכול שלו.',
  },
  {
    time: '02:30',
    title: 'מרוב חום הם פרמו את המעילים',
    body: 'הקרינה הייתה כה אינטנסיבית שגופותיהם פלטו חום כאילו מבפנים. הם פרמו את כפתורי המעילים, הסירו את הקסדות. עורם החל להאדים. בשעות הבאות הצבע התחלף לסגול — האופייני לכוויות קרינה. בהמשך עורם השחיר ומתקלף.',
  },
  {
    time: '04:00',
    title: 'בית חולים מס׳ 6, מוסקבה',
    body: 'המנות שספגו עברו בהרבה את הסף הקטלני של 4 גריי לכל הגוף (חשיפה שגורמת מוות ב-50% מהמקרים תוך 30 ימים). 28 מהם מתו תוך 3 חודשים מתסמונת קרינה חריפה. ד״ר אנג׳לינה גוסקובה ניסתה לבצע השתלות מח עצם — כמעט כל הניסיונות נכשלו. גופותיהם המשיכו להקרין גם אחרי המוות.',
  },
  {
    time: '∞',
    title: 'הקבורה',
    body: 'ארונות אבץ סגורים. בית קברות מיטינסקויה במוסקבה. אריחי בטון מעל הקברים — לא לכבוד, אלא כדי לחסום את הקרינה שעוד עלתה מהגופות. פראביק וקיבנוק שניהם הוכרזו לאחר מותם כ״גיבורי ברית המועצות״. הם לא ידעו שהקריבו את חייהם בתשלום על שקר ישן יותר מהם — שכור גרעיני סובייטי לא יכול להתפוצץ.',
  },
];

const STORY_EN = [
  {
    time: '01:28',
    title: 'First on Scene',
    body: '14 firefighters led by Lt. Vladimir Pravik arrived at Reactor 4 less than five minutes after the explosion. Standard turnout gear only. No SCBA. No dosimeters. No understanding that the fire ahead was not the threat — what surrounded it was.',
  },
  {
    time: '01:30',
    title: 'What They Were Never Trained For',
    body: 'In the Soviet Union, the possibility that an RBMK reactor could explode was considered scientifically baseless. Firefighters were simply not trained for such a scenario. They followed building-fire protocol: climb to roof, aim water at flames, move to next.',
  },
  {
    time: '01:35',
    title: 'Graphite on the Roof',
    body: 'The core had vomited burning moderator graphite into open air — each chunk emitting thousands of roentgens per hour. Firefighters kicked them aside to clear the way. Boots stuck to bitumen melted in heat. Some flames refused to extinguish under water — burning in strange colors, traces of uranium fuel.',
  },
  {
    time: '01:50',
    title: 'First Symptoms',
    body: 'Within just 20-30 minutes the symptoms began: severe headaches, nausea, vomiting, paralyzing weakness, unbearable thirst. These were Acute Radiation Syndrome (ARS) symptoms developing in real time. One firefighter drank from a contaminated cooling pool and burned his digestive tract.',
  },
  {
    time: '02:30',
    title: 'They Tore Open Their Coats',
    body: 'Radiation was so intense their bodies emitted heat as if from within. They tore open their coats, removed helmets. Skin began to redden. In hours, the color changed to purple — characteristic of radiation burns. Then black, peeling.',
  },
  {
    time: '04:00',
    title: 'Hospital No. 6, Moscow',
    body: 'Doses far exceeded the LD50 threshold (4 Gy whole-body). 28 died within 3 months from ARS. Dr. Angelina Guskova attempted bone marrow transplants — nearly all failed. Their bodies continued emitting radiation even after death.',
  },
  {
    time: '∞',
    title: 'The Burial',
    body: 'Sealed zinc coffins. Mitinskoye cemetery in Moscow. Concrete tiles laid over the graves — not for honor, but to block radiation still rising from their bodies. Pravik and Kibenok were both posthumously named "Heroes of the Soviet Union." They did not know they had paid with their lives for a lie older than themselves.',
  },
];

export default function FirstResponders({ he, t }: { he: boolean; t: (h: string, e: string) => string }) {
  const { playing, supported, speak } = useSpeech(he ? 'he' : 'en');
  const story = he ? STORY_HE : STORY_EN;

  const playAll = () => {
    const fullText = story.map((c) => c.title + '. ' + c.body).join(' ... ');
    speak('all', fullText);
  };

  const isPlayingAll = playing === 'all';

  return (
    <section id="responders" style={{ padding: '60px 16px 30px', position: 'relative' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 28, position: 'relative' }}>
          <div className="section-number" style={{ top: '-20px', insetInlineStart: '5%', color: 'rgba(220,38,38,0.18)' }}>04</div>
          <div className="section-kicker" style={{ borderColor: `${C.danger}77`, color: C.danger, background: `${C.danger}10` }}>
            [ {t('הסיפור האנושי', 'THE HUMAN STORY')} ]
          </div>
          <h2 className="section-title" style={{ background: `linear-gradient(135deg, ${C.danger}, #fca5a5, ${C.danger})`, WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            🔥 {t('הראשונים על הגג', 'The First on the Roof')}
          </h2>
          <p className="section-subtitle" style={{ color: '#fca5a5' }}>
            {t('14 כבאים · 28 מתים · אגדה אחת', '14 firefighters · 28 dead · one legend')}
          </p>
          <div className="gr" style={{ margin: '0 auto', background: `linear-gradient(90deg, transparent, ${C.danger}, transparent)` }} />
        </div>

        {/* Master "Play All" button */}
        {supported && (
          <div style={{ textAlign: 'center', marginBottom: 18 }}>
            <button onClick={playAll} aria-label={t('הקרא הכל', 'Play all')} style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              padding: '12px 24px',
              background: isPlayingAll
                ? `linear-gradient(135deg, ${C.danger}66, ${C.danger}33)`
                : `linear-gradient(135deg, ${C.danger}40, ${C.danger}15)`,
              border: `1.5px solid ${C.danger}`,
              borderRadius: 30,
              color: '#fff',
              fontSize: 18, fontWeight: 800,
              fontFamily: "'JetBrains Mono', monospace",
              letterSpacing: '0.1em',
              cursor: 'pointer',
              transition: 'all 0.25s',
              boxShadow: isPlayingAll ? `0 0 28px ${C.danger}99` : `0 4px 16px ${C.danger}55`,
              animation: isPlayingAll ? 'pulseAlert 1.4s infinite' : 'none',
            }}>
              <span style={{ fontSize: 21 }}>{isPlayingAll ? '⏸' : '🎙'}</span>
              {isPlayingAll ? t('עצור קריינות', 'STOP NARRATION') : t('הקרא את הסיפור כולו', 'NARRATE THE FULL STORY')}
            </button>
          </div>
        )}

        {/* Story chapters as cinematic timeline */}
        <div style={{
          background: 'linear-gradient(180deg, rgba(20,5,5,0.85), rgba(40,10,10,0.6))',
          border: `1px solid ${C.danger}55`,
          borderRadius: 16,
          padding: 'clamp(14px, 3vw, 24px)',
          boxShadow: `0 0 40px rgba(220,38,38,0.15)`,
          position: 'relative',
        }}>
          {/* Vertical line */}
          <div style={{
            position: 'absolute',
            top: 30, bottom: 30,
            [he ? 'right' : 'left']: 'clamp(40px, 6vw, 60px)',
            width: 2,
            background: `linear-gradient(180deg, transparent, ${C.danger}99 15%, ${C.danger}99 85%, transparent)`,
            borderRadius: 1,
          }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {story.map((ch, i) => {
              const isPlaying = playing === `ch-${i}`;
              return (
                <div key={i} className="fade-in" style={{
                  position: 'relative',
                  paddingInlineStart: 'clamp(56px, 8vw, 80px)',
                  animationDelay: `${i * 0.08}s`,
                }}>
                  {/* Time marker dot */}
                  <div style={{
                    position: 'absolute',
                    top: 8,
                    [he ? 'right' : 'left']: 'clamp(34px, 5vw, 54px)',
                    width: 14, height: 14, borderRadius: '50%',
                    background: i === 0 || i === story.length - 1 ? C.danger : '#fca5a5',
                    border: '2px solid #fff',
                    boxShadow: `0 0 14px ${C.danger}`,
                    animation: i === 0 ? 'pulseAlert 2s infinite' : 'none',
                    zIndex: 2,
                  }} />

                  {/* Time label */}
                  <div style={{
                    position: 'absolute',
                    top: 4,
                    [he ? 'right' : 'left']: 0,
                    width: 'clamp(34px, 5vw, 50px)',
                    fontSize: 15,
                    fontFamily: "'JetBrains Mono', monospace",
                    fontWeight: 800,
                    color: C.danger,
                    textAlign: he ? 'left' : 'right',
                    paddingInlineEnd: 4,
                  }}>
                    {ch.time}
                  </div>

                  {/* Card */}
                  <div style={{
                    padding: '14px 16px',
                    background: 'rgba(0,0,0,0.55)',
                    border: `1px solid ${isPlaying ? C.danger : 'rgba(255,255,255,0.08)'}`,
                    borderInlineStart: `4px solid ${C.danger}`,
                    borderRadius: 10,
                    transition: 'all 0.3s',
                    boxShadow: isPlaying ? `0 0 22px ${C.danger}55` : 'none',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10, marginBottom: 8 }}>
                      <h3 style={{
                        fontSize: 19, fontWeight: 800,
                        color: '#fff',
                        fontFamily: "'Playfair Display', serif",
                        lineHeight: 1.3, flex: 1,
                      }}>
                        {ch.title}
                      </h3>
                      {supported && (
                        <button onClick={() => speak(`ch-${i}`, ch.title + '. ' + ch.body)}
                                aria-label={t('הקרא קטע', 'Listen')}
                                style={{
                                  width: 36, height: 36, borderRadius: '50%',
                                  background: isPlaying ? `${C.danger}55` : 'rgba(0,0,0,0.5)',
                                  border: `1.5px solid ${isPlaying ? C.danger : C.gold}`,
                                  color: isPlaying ? '#fff' : C.gold,
                                  fontSize: 17, cursor: 'pointer',
                                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  flexShrink: 0,
                                  transition: 'all 0.25s',
                                  boxShadow: isPlaying ? `0 0 14px ${C.danger}` : 'none',
                                  animation: isPlaying ? 'pulseAlert 1.4s infinite' : 'none',
                                }}>
                          {isPlaying ? '⏸' : '▶'}
                        </button>
                      )}
                    </div>
                    <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.92)', lineHeight: 1.95 }}>
                      {ch.body}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Memorial scenes */}
          <div style={{ marginTop: 22, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
            <MemorialCard
              variant="firefighter"
              caption_he="01:28 — שלוש דמויות על גג היחידה השלישית, אחרי שעלו מהיחידה הרביעית הבוערת. הקרינה ב-3,500 רנטגן/שעה. הם לא ידעו."
              caption_en="01:28 — Three figures on Unit 3 roof, after coming up from the burning Unit 4. Radiation at 3,500 R/hr. They did not know."
              date_he="01:28 · 26·04·1986"
              date_en="01:28 · APR 26, 1986"
              he={he} t={t}
            />
            <MemorialCard
              variant="reactor"
              caption_he="יחידה 4 בערב 26 באפריל. הליבה חשופה לאוויר הפתוח. שריפת גרפיט בטמפרטורה של 2,500°C. בשמיים — עמוד עשן רדיואקטיבי שיגיע לשבדיה תוך 36 שעות."
              caption_en="Unit 4 on the evening of April 26. Core exposed to open air. Graphite fire at 2,500°C. In the sky — a radioactive plume that would reach Sweden in 36 hours."
              date_he="ערב · 26·04·1986"
              date_en="EVE · APR 26, 1986"
              he={he} t={t}
            />
          </div>

          {/* Tribute */}
          <div style={{
            marginTop: 22, padding: '16px 20px',
            background: 'rgba(0,0,0,0.55)',
            border: `1px solid ${C.gold}55`,
            borderRadius: 10,
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 32, marginBottom: 6 }}>🕯</div>
            <p style={{ fontSize: 18, color: C.gL, lineHeight: 1.85, fontStyle: 'italic', fontFamily: "'Playfair Display', serif" }}>
              {t(
                'הם נכנסו אל החושך כדי שאחרים יוכלו לחיות באור.',
                'They walked into the dark so that others could live in light.'
              )}
            </p>
          </div>

          {/* Sources */}
          <div style={{
            marginTop: 14, padding: '8px 14px',
            background: 'rgba(0,0,0,0.4)',
            border: `1px solid ${C.gold}22`,
            borderRadius: 6,
            fontSize: 12, color: 'rgba(255,255,255,0.55)',
            fontFamily: "'JetBrains Mono', monospace",
            lineHeight: 1.7, textAlign: 'center',
          }}>
            {t(
              '📚 מבוסס על מקורות מאומתים: Higginbotham · Plokhy · UNSCEAR · IAEA · Guskova',
              '📚 Based on verified sources: Higginbotham · Plokhy · UNSCEAR · IAEA · Guskova'
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
