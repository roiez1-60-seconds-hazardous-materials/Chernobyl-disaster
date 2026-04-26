'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const C = {
  ink: '#0a0e1a', navy: '#162040', gold: '#c8a44e', gL: '#e8d5a0',
  red: '#dc2626', danger: '#ef4444', amber: '#f59e0b',
  blue: '#06b6d4', green: '#22c55e', muted: '#94a3b8',
};

const T = [
  { time: '25/4 01:06', he: 'הכור פעיל ב-3,200 MWt — מגדיל חשמל לחורף האחרון', en: 'Reactor at 3,200 MWt — winter peak ending',
    simple_he: 'הכור פועל בכל הכוח. צוות מתחיל הכנות לניסוי בטיחות שתוכנן לפני 4 שנים.',
    simple_en: 'Reactor at full power. Crew begins preparing for a safety test planned 4 years ago.',
    pro_he: 'תחילת הורדת הספק לקראת ניסוי "Run-down" של טורבוגנרטור 8. ECCS עדיין מחובר.',
    pro_en: 'Power reduction begins for TG-8 run-down test. ECCS still connected.',
    P: 3200, R: 170, V: 0, mood: 'normal' },
  { time: '25/4 14:00', he: '⚠ ECCS נותקה ידנית — דרישת הניסוי', en: '⚠ ECCS manually disabled — test requirement',
    simple_he: 'הכבו את "מערכת הקירור החירומית" — הגיבוי שאמור להציל כל אסון. זה היה נורא, אבל זו הייתה הוראת הניסוי.',
    simple_en: 'Disabled the emergency cooling backup that should save the day if anything goes wrong. Bad, but the test required it.',
    pro_he: 'Emergency Core Cooling System נותק — חוסר תאימות עם פרוטוקול הניסוי. הפרת רישיון.',
    pro_en: 'ECCS isolation valves closed — incompatible with test protocol. License violation.',
    P: 1600, R: 170, V: 0, mood: 'normal' },
  { time: '25/4 23:10', he: 'הספק יורד ל-720 MWt — מתחת לאזור הבטוח', en: 'Power down to 720 MWt — below safe zone',
    simple_he: 'הספק נמוך מהמינימום הבטוח (700 MWt). ב-RBMK, הספק נמוך = לא יציב.',
    simple_en: 'Power below the safe minimum (700 MWt). For RBMK reactors, low power = unstable.',
    pro_he: 'מתקרב לאזור אי-יציבות. מקדם החללות החיובי הולך וגדל. הרעלת Xe-135 מתחילה.',
    pro_en: 'Approaching instability zone. Positive void coefficient growing. Xe-135 poisoning begins.',
    P: 720, R: 140, V: 1, mood: 'caution' },
  { time: '26/4 00:28', he: '🚨 ההספק קורס ל-30 MWt — הרעלת קסנון מסיבית', en: '🚨 Power crashes to 30 MWt — massive xenon poisoning',
    simple_he: 'הכור כמעט כבה. מולקולה רעילה (Xe-135) מצטברת ובולעת ניוטרונים. הצוות צריך להחליט: לעצור הכל, או לנסות להחיות?',
    simple_en: 'Reactor nearly died. Toxic Xe-135 atoms eat neutrons. Crew must decide: shut down, or try to revive?',
    pro_he: '1% מההספק התכנוני. מצב "iodine pit". הרגולציה מחייבת השבתה של 24h. הצוות בחר להמשיך.',
    pro_en: '1% of design power. "Iodine pit" condition. Regulation requires 24h shutdown. Crew chose to continue.',
    P: 30, R: 80, V: 2, mood: 'caution' },
  { time: '26/4 01:00', he: '⚠ שליפת מוטות בכוח. 8/211 בלבד נשארו בליבה', en: '⚠ Forced rod withdrawal. Only 8/211 left in core',
    simple_he: 'כדי "להחיות" את הכור, שלפו כמעט את כל מוטות הבקרה. המינימום הבטוח: 30. הם השאירו: 8.',
    simple_en: 'To "revive" the reactor, they pulled almost all control rods out. Safe minimum: 30. They left: 8.',
    pro_he: 'ORM (Operational Reactivity Margin) ירד ל-~8 ERR — תחת מינימום של 30. ניתן להפעיל קריטיות פרומפטית בכל רגע.',
    pro_en: 'ORM dropped to ~8 ERR — below 30 minimum. Prompt criticality possible at any moment.',
    P: 200, R: 8, V: 3, mood: 'danger' },
  { time: '26/4 01:23:04', he: 'הניסוי מתחיל — סוגרים שסתום קיטור', en: 'Test begins — steam isolation valves close',
    simple_he: 'מנתקים את הטורבינה מהקיטור. עכשיו הזרימה מואטת — מים מתחממים יותר ויוצרים יותר קיטור (חללות).',
    simple_en: 'Disconnecting turbine from steam. Flow slows — water heats up and creates more steam (voids).',
    pro_he: 'TG-8 stop valves closed. Coastdown מתחיל. Void fraction עולה במהירות בתעלות הדלק.',
    pro_en: 'TG-8 stop valves closed. Coastdown begins. Void fraction rising rapidly in fuel channels.',
    P: 200, R: 8, V: 4, mood: 'danger' },
  { time: '26/4 01:23:40', he: '🔴 הופעל AZ-5 — לחיצת חירום!', en: '🔴 AZ-5 PRESSED — Emergency scram!',
    simple_he: 'המהנדס Akimov לוחץ על כפתור עצירת החירום. כולם מצפים שהכור יכבה תוך 20 שניות. אבל...',
    simple_en: 'Engineer Akimov hits the emergency scram button. Everyone expects shutdown in 20 seconds. But...',
    pro_he: 'AZ-5 activated. 211 מוטות מתחילים לרדת ב-0.4 m/s. הקצוות (גרפיט) ייכנסו לליבה הפעילה ב-3 שניות.',
    pro_en: 'AZ-5 activated. 211 rods descending at 0.4 m/s. Graphite tips will enter active core in 3 seconds.',
    P: 530, R: 8, V: 5, mood: 'critical' },
  { time: '26/4 01:23:43', he: '⚡ פגם הגרפיט מתגלה — תגובתיות מזנקת', en: '⚡ Graphite flaw triggers — reactivity surge',
    simple_he: 'במקום שהמוטות יעצרו את הכור, קצוות הגרפיט שלהם דווקא **מאיצים** אותו! פגם תכנון נסתר. הצוות מבין שמשהו נורא קורה.',
    simple_en: 'Instead of stopping the reactor, the rods\' graphite tips actually **accelerate** it! Hidden design flaw. The crew realizes something terrible is happening.',
    pro_he: 'Positive scram effect — דחיקת מים ב-1.3 m³ של גרפיט במהלך 3 שניות הראשונות. δk/k > +β. קריטיות פרומפטית.',
    pro_en: 'Positive scram effect — 1.3 m³ water displacement by graphite in first 3 seconds. δk/k > +β. Prompt criticality.',
    P: 3000, R: 30, V: 7, mood: 'critical' },
  { time: '26/4 01:23:45', he: '💥 פיצוץ ראשון — קיטור', en: '💥 First explosion — steam',
    simple_he: 'תוך 4 שניות ההספק מזנק פי 100. המים הרותחים הופכים לקיטור בלחץ עצום. הליבה מתפוצצת.',
    simple_en: 'In 4 seconds, power surges 100×. Boiling water flashes to steam at huge pressure. Core explodes.',
    pro_he: 'הספק מזנק ל-30,000+ MWt. פיצוץ קיטור-תרמי. צינורות לחץ קורסים. מים פוגעים בגרפיט הלוהט.',
    pro_en: 'Power surges to 30,000+ MWt. Thermal-steam explosion. Pressure tubes rupture. Water hits hot graphite.',
    P: 30000, R: 50, V: 9, mood: 'explosion' },
  { time: '26/4 01:23:47', he: '💥💥 פיצוץ שני — מימן+חמצון. גג 2,000 טון מועף', en: '💥💥 Second explosion — H₂+oxidation. 2,000-ton roof ejected',
    simple_he: '2 שניות אחרי הראשון: פיצוץ שני, חזק יותר. גג ענק שמשקלו כמו 1,000 רכבים — נזרק לאוויר. הליבה חשופה לשמיים. שריפת גרפיט מתחילה — תימשך 9 ימים.',
    simple_en: '2 seconds after the first: second explosion, even stronger. A roof weighing as much as 1,000 cars — flung into the air. Core exposed to the sky. Graphite fire starts — will burn for 9 days.',
    pro_he: 'פיצוץ מימן (Zr+H₂O→ZrO₂+H₂) או רהקריטיות. גג "סכמה E" 2,000 t נזרק. שחרור 5,300 PBq Cs-137.',
    pro_en: 'Hydrogen explosion (Zr+H₂O→ZrO₂+H₂) or recriticality. "Schema E" 2,000 t roof ejected. 5,300 PBq Cs-137 released.',
    P: 0, R: 0, V: 10, mood: 'apocalypse' },
];

const COMP: Record<string, any> = {
  vessel: { he: 'כלי לחץ של הכור', en: 'Reactor Pressure Vessel', icon: '🏛️', color: C.gold,
    simple_he: 'הקופסה הענקית מצופה פלדה ובטון בגובה 26 מטר שעוטפת את כל הפנים של הכור. מכילה 1,700 טון גרפיט, אלפי צינורות, ומיליוני ליטר מים — אבל שלא כמו כורים מערביים, אין לה מבנה הכלה חיצוני שיספוג פיצוץ.',
    simple_en: 'The huge 26-meter steel-and-concrete box wrapping the entire reactor interior. Contains 1,700 tons of graphite, thousands of pipes, and millions of liters of water — but unlike Western reactors, no outer containment to absorb an explosion.',
    pro_he: 'מכל לחץ מצופה פלדה-בטון, גובה 26 מ׳, קוטר 21.6 מ׳. אין containment בסגנון מערבי — זה הפגם המבני המכריע שאיפשר לפיצוץ לשחרר חומר רדיואקטיבי לאטמוספירה.',
    pro_en: 'Steel-concrete pressure vessel, 26m height, 21.6m diameter. No Western-style containment — this is the critical structural flaw that allowed atmospheric release.',
    p: '26m × 21.6m | NO containment' },
  graphite: { he: 'גוש הגרפיט (המאט)', en: 'Graphite Moderator Stack', icon: '⬛', color: '#374151',
    simple_he: '1,700 טון אבני גרפיט (כמו עיפרון, אבל בדרגה גרעינית) שמסודרות בערימה מלבנית. תפקידן: להאט את הניוטרונים כדי שיוכלו להתחיל ביקוע. הבעיה: גרפיט בוער באוויר ב-2,500°C — וזה בדיוק מה שקרה.',
    simple_en: '1,700 tons of graphite blocks (like pencil lead, but nuclear-grade) stacked rectangularly. Their job: slow neutrons so they can start fission. Problem: graphite burns in air at 2,500°C — exactly what happened.',
    pro_he: 'אבני גרפיט בדרגה גרעינית, 1,700 t. מאט ניוטרונים מהירים → טרמיים. אטמוספירת He+N₂ למניעת חמצון. בחשיפה לאוויר ב-2,500°C: בעירה. שרפה 9 ימים.',
    pro_en: 'Nuclear-grade graphite blocks, 1,700 t. Moderates fast→thermal neutrons. He+N₂ atmosphere prevents oxidation. Exposed to air at 2,500°C: combustion. Burned 9 days.',
    p: '1,700 t | He/N₂ atm' },
  fuel: { he: 'תעלות דלק', en: 'Fuel Channels', icon: '🔥', color: C.amber,
    simple_he: '1,661 צינורות אנכיים בגובה 7 מטרים, כל אחד מכיל 18 גלולי דלק אורניום מועשר. כשהאורניום מתבקע, הוא משחרר חום עצום שגורם למים שזורמים סביבו לרתוח. סך הכל: 190 טון דלק גרעיני.',
    simple_en: '1,661 vertical 7-meter tubes, each with 18 enriched uranium pellets. Fissioning uranium releases enormous heat that boils flowing water. Total: 190 tons nuclear fuel.',
    pro_he: '1,661 צינורות זירקאלוי. 18 גלולי UO₂ מועשרים ב-2.0% U-235. מים ב-7 MPa זורמים בגרעון מטה ורותחים תוך עליה לאזור הקיטור-מים בחלק העליון.',
    pro_en: '1,661 zircaloy tubes. 18 UO₂ pellets enriched 2.0% U-235. Water at 7 MPa flows down annulus, boils ascending to upper steam-water region.',
    p: '1,661 × 7m | 190 t UO₂ | 2.0% U-235' },
  rods: { he: 'מוטות בקרה — הפגם הקטלני', en: 'Control Rods — The Fatal Flaw', icon: '🎯', color: C.red,
    simple_he: '211 מוטות העשויים מבורון (חומר שבולע ניוטרונים ועוצר את התגובה). אבל המתכננים הסובייטים הוסיפו לקצה התחתון של כל מוט מתאם גרפיט באורך 4.5 מטר. כשלוחצים על AZ-5, הגרפיט נכנס ראשון לליבה — ובמקום לעצור, הוא **מאיץ** את הביקוע. זה הפגם שהרג את הכור.',
    simple_en: '211 boron rods (absorbs neutrons, stops reaction). But Soviet designers added a 4.5-meter graphite displacer to each rod\'s bottom tip. Pressing AZ-5, graphite enters core first — instead of stopping, **accelerates** fission. The flaw that killed the reactor.',
    pro_he: '211 מוטות B₄C. הפגם: 4.5 מ׳ מתאם גרפיט על קצה תחתון, מופרד ב-1.25 m water gap. בלחיצת AZ-5 הגרפיט נכנס ראשית לאזור הפעיל ביותר ודוחק מים → +δk גדול ב-3 שניות הראשונות. דווח לראשונה ב-Ignalina-1 (1983), לא הועבר למפעילים.',
    pro_en: '211 B₄C rods. The flaw: 4.5m graphite displacer at bottom, separated by 1.25m water gap. On AZ-5 press, graphite enters most reactive zone first, displacing water → large +δk in first 3 seconds. First reported at Ignalina-1 (1983), not communicated to operators.',
    p: '211 × B₄C | 4.5m graphite tip' },
  drum: { he: 'תופי הפרדת קיטור', en: 'Steam Separator Drums', icon: '🛢️', color: '#94a3b8',
    simple_he: '4 גלילים אופקיים ענקיים (אורך 30 מטר!) מעל הכור. תפקידם: לקבל את תערובת המים-קיטור שיוצאת מהליבה ולהפריד אותה — קיטור יבש הולך לטורבינה, מים חוזרים לכור.',
    simple_en: '4 huge horizontal cylinders (30m long!) above the reactor. Receive water-steam mixture from core and separate — dry steam to turbine, water back to reactor.',
    pro_he: '4 תופים אופקיים, 30 m אורך. הפרדת steam quality 99.75%. ב-RBMK אין steam generator — direct cycle. תכן ייחודי שדורש מעבר 4 לולאות זרימה.',
    pro_en: '4 horizontal drums, 30m length. Steam quality 99.75% separation. RBMK has NO steam generator — direct cycle. Unique design requires 4 flow loops.',
    p: '4 × 30m | 6.9 MPa | 284°C' },
  mcp: { he: 'משאבות זרימה ראשיות', en: 'Main Circulation Pumps', icon: '⚙️', color: C.blue,
    simple_he: '8 משאבות ענק שדוחפות 37,000 מטר מעוקב מים בשעה דרך הכור — מספיק כדי למלא בריכה אולימפית כל 65 דקות. ב-26/4/86, כל ה-8 הופעלו במקביל, יותר מהמותר, וגרמו לזרימה לא יציבה.',
    simple_en: '8 giant pumps push 37,000 m³/h water through reactor — enough to fill an Olympic pool every 65 min. On 26/4/86, all 8 ran simultaneously beyond design, causing flow instability.',
    pro_he: '8 משאבות צנטריפוגליות (6 פעילות + 2 רזרבה). כל ה-8 הופעלו ב-26.4 — חרגו מ-flow rating המותר → cavitation במשאבות → ירידת ראש לחץ → אי יציבות זרימה בליבה.',
    pro_en: '8 centrifugal pumps (6 active + 2 reserve). All 8 ran on 26.4 — exceeded flow rating → pump cavitation → head loss → core flow instability.',
    p: '8 MCP | 37,000 m³/h' },
  turbine: { he: 'טורבינות וגנרטורים', en: 'Turbines & Generators', icon: '🌀', color: C.gold,
    simple_he: '2 טורבינות ענק שמסתובבות ב-3,000 סיבובים בדקה. הקיטור מהכור פוגע בלהבים, מסובב אותן, וכך נוצר חשמל. סך הכל יחידה 4 ייצרה 1,000 מגה-וואט — מספיק לעיר של 600 אלף תושבים.',
    simple_en: '2 huge turbines spinning at 3,000 RPM. Steam hits blades, spins them, generates electricity. Unit 4 produced 1,000 MW total — enough for a city of 600,000.',
    pro_he: '2 TG-7/TG-8, 500 MWe כל אחד. הניסוי: בדיקת coastdown — האם טורבינה מנותקת מקיטור יכולה לספק 40-50 שניות חשמל ל-MCPs בזכות התמד סיבוב.',
    pro_en: '2 TG-7/TG-8, 500 MWe each. The test: verify coastdown — can a steam-isolated turbine power MCPs for 40-50 seconds via rotational inertia.',
    p: '2 × 500 MWe | 3,000 RPM' },
  cond: { he: 'מעבים ובריכת קירור', en: 'Condensers & Cooling Pond', icon: '💧', color: C.blue,
    simple_he: 'אחרי שהקיטור סיים לסובב את הטורבינה, הוא צריך לחזור להיות מים. המעבים מקררים אותו עם מי קירור מבריכת ענק (22 קמ״ר!) שנחפרה במיוחד ליד נהר הפריפיאט. אותם מים חוזרים לכור.',
    simple_en: 'After steam spins the turbine, it needs to become water again. Condensers cool it using water from a giant pond (22 km²!) dug specifically next to Pripyat River. Same water returns to reactor.',
    pro_he: 'מעבי טורבינה מקבלים מי קירור מ-cooling pond 22 km². טמפ׳ עליה 8-12°C. האגם נמצא ליד נהר הפריפיאט. עד היום מכיל זיהום רדיואקטיבי.',
    pro_en: 'Turbine condensers receive cooling water from 22 km² pond. ΔT 8-12°C. Pond adjacent to Pripyat River. Still contains radioactive contamination today.',
    p: '22 km² pond | Pripyat River' },
  shield: { he: 'מגן ביולוגי "סכמה E"', en: 'Schema E Biological Shield', icon: '🛡️', color: '#525252',
    simple_he: 'לוח פלדה-בטון בעובי 3 מטרים שמשקלו 2,000 טון (פי 1,000 ממכונית!) שמכסה את הכור מלמעלה. תפקידו: לחסום קרינה. בפיצוץ השני הוא הועף לאוויר, נפל בחזרה בזווית — ונשאר ככה עד היום.',
    simple_en: 'A 3m-thick steel-concrete plate weighing 2,000 tons (1,000× a car!) covering the reactor from above. Job: block radiation. Second explosion hurled it skyward, fell back at an angle — stayed that way until today.',
    pro_he: 'לוח 2,000 t, עובי ~3 m, נקרא "Pyatachok" או "Schema E". בפיצוץ השני נזרק ונחת בזווית של ~15° על שפת המכל. בליעת קרינה גמא ~10⁶.',
    pro_en: '2,000 t plate, ~3m thick, called "Pyatachok" or "Schema E". Second explosion ejected it; landed at ~15° angle on vessel rim. Gamma absorption ~10⁶.',
    p: '2,000 t | 3m | Schema E' },
  az5: { he: 'כפתור AZ-5', en: 'AZ-5 Button', icon: '🔴', color: C.danger,
    simple_he: 'כפתור החירום האחרון. אמור להחדיר את כל 211 המוטות לליבה תוך 20 שניות ולעצור את הכור. הצוות לחץ עליו ב-01:23:40. מה שקרה אחר כך — הוא הפך מ"כפתור הצלה" ל"כפתור פיצוץ".',
    simple_en: 'The final emergency button. Supposed to insert all 211 rods in 20 seconds and stop the reactor. Crew pressed it at 01:23:40. What happened next — it transformed from "save button" to "explosion button".',
    pro_he: 'AZ-5 (Аварийная Защита-5) — emergency scram. כניסה מלאה ב-18-21 שניות @ 0.4 m/s. ב-01:23:40 הופעל. הפעלתו עצמה גרמה ל-prompt criticality בגלל positive scram effect.',
    pro_en: 'AZ-5 (Аварийная Защита-5) — emergency scram. Full insertion 18-21s @ 0.4 m/s. Activated at 01:23:40. Activation itself caused prompt criticality due to positive scram effect.',
    p: 'Activated 01:23:40 | 18-21s' },
  refuel: { he: 'מכונת תדלוק', en: 'Refueling Machine', icon: '🏗️', color: C.muted,
    simple_he: 'מכונה ענקית על מסילה מעל הכור שמאפשרת להחליף דלק תוך כדי פעולה (יתרון של RBMK). חיסכון בעלויות, אבל זה גם הסיבה שלא בנו "הכלה" מסביב — מה שהיה הורג את הסבירות לפיצוץ פתוח.',
    simple_en: 'Massive rail-mounted machine above the reactor, allowing fuel replacement during operation (RBMK advantage). Cost-saving, but also why no "containment" was built around it — which would have prevented the open explosion.',
    pro_he: 'On-load refueling machine, 350 t. נשלפה אוטומטית להחלפת FA. הצורך בה הגביל את גובה הכור ומנע containment dome מערבי.',
    pro_en: 'On-load refueling machine, 350 t. Automatic FA replacement. Its requirement limited reactor height and prevented Western-style containment dome.',
    p: '350 t | On-load' },
  feed: { he: 'מסיר אוויר ומשאבות הזנה', en: 'Deaerator & Feedwater', icon: '🚰', color: C.gold,
    simple_he: 'תחנה ביניים בין המעבים לתופים. כאן מסירים גזים מומסים מהמים (חמצן, חנקן) שעלולים לחולל קורוזיה, ומחממים את המים ל-165°C לפני שהם חוזרים לכור.',
    simple_en: 'Intermediate station between condensers and drums. Removes dissolved gases (oxygen, nitrogen) that cause corrosion, and preheats water to 165°C before returning to reactor.',
    pro_he: 'Deaerator + feedwater pumps. הסרת O₂ מומס < 10 μg/kg. חימום ל-165°C ב-0.7 MPa. חיוני להגנה על מתכות במעגל ראשי.',
    pro_en: 'Deaerator + feedwater pumps. Dissolved O₂ removal < 10 μg/kg. Preheating to 165°C at 0.7 MPa. Critical for primary loop metal protection.',
    p: '165°C | 0.7 MPa' },
};

export default function ReactorPage() {
  const [lang, setLang] = useState<'he' | 'en'>('he');
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [sel, setSel] = useState<string | null>(null);
  const [explainMode, setExplainMode] = useState<'simple' | 'pro'>('simple');
  const [showCutaway, setShowCutaway] = useState(true);
  const [stats, setStats] = useState({ P: 3200, R: 170, V: 0 });
  const he = lang === 'he';
  const t = (h: string, e: string) => (he ? h : e);

  useEffect(() => {
    const target = T[step];
    const id = setInterval(() => {
      setStats((s) => {
        const dP = target.P - s.P;
        const dR = target.R - s.R;
        const dV = target.V - s.V;
        if (Math.abs(dP) < 1 && Math.abs(dR) < 1 && Math.abs(dV) < 0.05) {
          clearInterval(id);
          return { P: target.P, R: target.R, V: target.V };
        }
        return {
          P: Math.round(s.P + dP * 0.15),
          R: Math.round(s.R + dR * 0.15),
          V: Math.round((s.V + dV * 0.15) * 10) / 10,
        };
      });
    }, 30);
    return () => clearInterval(id);
  }, [step]);

  useEffect(() => {
    if (!playing) return;
    if (step >= T.length - 1) { setPlaying(false); return; }
    const dur = step >= 6 ? 2500 : step >= 3 ? 3200 : 2800;
    const id = setTimeout(() => setStep((s) => s + 1), dur);
    return () => clearTimeout(id);
  }, [playing, step]);

  const ev = T[step];
  const isDisaster = step >= 6;
  const exploded = step >= 8;
  const collapsed = step >= 9;
  const fuelGlow = Math.min(1, 0.3 + (Math.log(Math.max(1, stats.P)) / Math.log(30000)) * 0.7);
  const fuelColor = step >= 7 ? '#fde047' : step >= 5 ? '#fb923c' : '#f59e0b';

  const moodBG: Record<string, string> = {
    normal: 'linear-gradient(180deg,#0a0e1a 0%,#162040 60%,#1a365d 100%)',
    caution: 'linear-gradient(180deg,#0a0e1a 0%,#1a2542 60%,#2d3a5f 100%)',
    danger: 'linear-gradient(180deg,#0a0e1a 0%,#2a1a1a 50%,#3d2222 100%)',
    critical: 'linear-gradient(180deg,#1a0a0a 0%,#3d1515 50%,#5a1f1f 100%)',
    explosion: 'linear-gradient(180deg,#3d0a0a 0%,#7a1e1e 50%,#9a3030 100%)',
    apocalypse: 'linear-gradient(180deg,#1a0a0a 0%,#2a1410 50%,#3a2020 100%)',
  };
  const cur = sel ? COMP[sel] : null;
  const desc = cur
    ? explainMode === 'simple'
      ? he ? cur.simple_he : cur.simple_en
      : he ? cur.pro_he : cur.pro_en
    : null;
  const evDesc = explainMode === 'simple'
    ? he ? ev.simple_he : ev.simple_en
    : he ? ev.pro_he : ev.pro_en;

  const ctrlBtn = (col: string, big: boolean): React.CSSProperties => ({
    padding: big ? '9px 18px' : '7px 12px',
    fontSize: big ? 13 : 11,
    fontWeight: 800,
    background: big ? col : `${col}25`,
    color: big ? '#fff' : col,
    border: `1px solid ${big ? col : col + '55'}`,
    borderRadius: 8, cursor: 'pointer', fontFamily: 'monospace',
    boxShadow: big ? `0 4px 16px ${col}55` : 'none',
  });

  return (
    <div dir={he ? 'rtl' : 'ltr'} style={{ minHeight: '100vh', background: moodBG[ev.mood], transition: 'background 1.5s', color: '#fff', paddingBottom: 40, position: 'relative' }}>
      {/* Ambient effects */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.4, backgroundImage: 'linear-gradient(rgba(200,164,78,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(200,164,78,0.04) 1px,transparent 1px)', backgroundSize: '50px 50px' }} />
        <div style={{ position: 'absolute', top: '10%', left: '15%', width: 300, height: 300, borderRadius: '50%', background: isDisaster ? 'radial-gradient(circle,rgba(239,68,68,0.15) 0%,transparent 70%)' : 'radial-gradient(circle,rgba(200,164,78,0.08) 0%,transparent 70%)', filter: 'blur(60px)', animation: 'float 12s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', bottom: '20%', right: '10%', width: 280, height: 280, borderRadius: '50%', background: isDisaster ? 'radial-gradient(circle,rgba(251,191,36,0.12) 0%,transparent 70%)' : 'radial-gradient(circle,rgba(6,182,212,0.06) 0%,transparent 70%)', filter: 'blur(60px)', animation: 'float 14s ease-in-out infinite reverse' }} />
        {collapsed && Array.from({ length: 15 }).map((_, i) => (
          <div key={i} style={{ position: 'absolute', top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`, width: 6, height: 6, borderRadius: '50%', background: 'radial-gradient(circle,#86efac,transparent)', animation: `radFloat ${3 + Math.random() * 4}s ease-out infinite`, animationDelay: `${i * 0.2}s` }} />
        ))}
      </div>

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 1200, margin: '0 auto', padding: '18px 12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, flexWrap: 'wrap', gap: 8 }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 14px', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(200,164,78,0.25)', borderRadius: 8, textDecoration: 'none' }}>
            <span style={{ color: C.gold, fontSize: 16 }}>{he ? '→' : '←'}</span>
            <div>
              <div style={{ fontSize: 11, fontWeight: 800, color: C.gold, letterSpacing: '0.15em' }}>60 {he ? 'שניות חומ״ס' : 'SEC HAZMAT'}</div>
              <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.5)', fontFamily: 'monospace' }}>← {t('חזרה', 'BACK')}</div>
            </div>
          </Link>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', background: 'rgba(0,0,0,0.4)', borderRadius: 6, padding: 2, border: '1px solid rgba(200,164,78,0.2)' }}>
              {(['simple', 'pro'] as const).map((k) => (
                <button key={k} onClick={() => setExplainMode(k)} style={{ padding: '5px 10px', fontSize: 11, fontWeight: 700, background: explainMode === k ? `${C.gold}25` : 'transparent', color: explainMode === k ? C.gold : 'rgba(255,255,255,0.5)', border: 'none', borderRadius: 4, cursor: 'pointer', fontFamily: 'monospace' }}>
                  {k === 'simple' ? `👤 ${t('פשוט', 'Simple')}` : `🎓 ${t('מקצועי', 'Pro')}`}
                </button>
              ))}
            </div>
            <button onClick={() => setLang((l) => (l === 'he' ? 'en' : 'he'))} style={{ padding: '6px 12px', fontSize: 11, fontWeight: 800, background: 'rgba(200,164,78,0.15)', color: C.gold, border: '1px solid rgba(200,164,78,0.3)', borderRadius: 6, cursor: 'pointer', fontFamily: 'monospace' }}>
              {he ? 'EN' : 'עב'}
            </button>
          </div>
        </div>

        <div style={{ textAlign: 'center', padding: '4px 0 20px' }}>
          <div style={{ display: 'inline-block', border: '1px solid rgba(200,164,78,0.4)', padding: '3px 16px', color: C.gold, fontSize: 10, fontWeight: 700, letterSpacing: '0.3em', marginBottom: 12, fontFamily: 'monospace', background: 'rgba(200,164,78,0.05)' }}>
            [ {he ? 'סימולטור אינטראקטיבי' : 'INTERACTIVE SIMULATOR'} ]
          </div>
          <h1 style={{ fontSize: 'clamp(28px,5.5vw,46px)', fontWeight: 900, lineHeight: 1.1, fontFamily: "'Playfair Display',serif", marginBottom: 6, background: `linear-gradient(135deg,${C.gold},${C.gL},${C.gold})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {t('כור RBMK-1000', 'RBMK-1000 Reactor')}
          </h1>
          <h2 style={{ fontSize: 'clamp(13px,2.5vw,17px)', fontWeight: 400, color: 'rgba(232,213,160,0.85)', fontFamily: "'Playfair Display',serif", marginBottom: 8 }}>
            {t('האסון של 26 באפריל 1986 — שלב אחר שלב', 'The Disaster of 26 April 1986 — Step by Step')}
          </h2>
          <div style={{ width: 80, height: 2, background: `linear-gradient(90deg,transparent,${C.gold},${C.gL},${C.gold},transparent)`, margin: '0 auto', boxShadow: '0 0 12px rgba(200,164,78,0.5)' }} />
        </div>

        {/* Story narrator */}
        <div style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)', border: `1px solid ${isDisaster ? 'rgba(239,68,68,0.4)' : 'rgba(200,164,78,0.25)'}`, borderRadius: 16, padding: '18px 20px', marginBottom: 14, boxShadow: isDisaster ? `0 0 40px rgba(239,68,68,0.25)` : '0 4px 20px rgba(0,0,0,0.2)', transition: 'all 0.6s' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14, flexWrap: 'wrap', gap: 10 }}>
            <div>
              <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.5)', fontFamily: 'monospace', letterSpacing: '0.18em', marginBottom: 3 }}>
                {t('שלב', 'STEP')} {step + 1}/{T.length} · UTC+3
              </div>
              <div style={{ fontSize: 24, fontWeight: 900, color: isDisaster ? C.danger : C.gold, fontFamily: 'monospace', letterSpacing: '-0.02em', textShadow: isDisaster ? '0 0 20px rgba(239,68,68,0.5)' : '0 0 15px rgba(200,164,78,0.3)' }}>
                {ev.time}
              </div>
            </div>
            <div style={{ flex: 1, minWidth: 200, textAlign: he ? 'right' : 'left' }}>
              <div style={{ fontSize: 'clamp(14px,2.5vw,18px)', fontWeight: 800, color: '#fff', lineHeight: 1.3, fontFamily: "'Playfair Display',serif" }}>
                {t(ev.he, ev.en)}
              </div>
            </div>
          </div>

          <div style={{ padding: '12px 16px', borderRadius: 8, background: isDisaster ? 'rgba(239,68,68,0.08)' : 'rgba(200,164,78,0.06)', borderLeft: `4px solid ${isDisaster ? C.danger : C.gold}`, fontSize: 13, lineHeight: 1.85, color: 'rgba(255,255,255,0.95)' }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: isDisaster ? '#fca5a5' : C.gold, fontFamily: 'monospace', letterSpacing: '0.15em', marginBottom: 6, opacity: 0.8 }}>
              {explainMode === 'simple' ? `📖 ${t('בגובה העיניים', 'In simple terms')}` : `🎓 ${t('מבט מקצועי', 'Professional view')}`}
            </div>
            {evDesc}
          </div>

          <div style={{ display: 'flex', gap: 6, marginTop: 14, flexWrap: 'wrap', justifyContent: 'center' }}>
            <button onClick={() => { setStep(0); setPlaying(false); }} style={ctrlBtn(C.muted, false)}>⏮ {t('התחלה', 'Start')}</button>
            <button onClick={() => setStep((s) => Math.max(0, s - 1))} style={ctrlBtn(C.muted, false)}>◀ {t('אחורה', 'Prev')}</button>
            <button onClick={() => setPlaying((p) => !p)} style={ctrlBtn(playing ? C.danger : C.green, true)}>
              {playing ? `⏸ ${t('עצור', 'Pause')}` : `▶ ${t('הפעל', 'Play')}`}
            </button>
            <button onClick={() => setStep((s) => Math.min(T.length - 1, s + 1))} style={ctrlBtn(C.muted, false)}>▶ {t('קדימה', 'Next')}</button>
          </div>

          <div style={{ marginTop: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace' }}>25/4 01:06</span>
              <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace' }}>26/4 01:23:47</span>
            </div>
            <div style={{ position: 'relative', height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 3, overflow: 'visible' }}>
              <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(90deg,${C.gold} 0%,${C.amber} 50%,${C.danger} 100%)`, opacity: 0.2, borderRadius: 3 }} />
              <div style={{ height: '100%', width: `${((step + 1) / T.length) * 100}%`, background: isDisaster ? `linear-gradient(90deg,${C.gold},${C.amber},${C.danger})` : `linear-gradient(90deg,${C.gold},${C.gL})`, borderRadius: 3, transition: 'width 0.6s cubic-bezier(0.25,0.46,0.45,0.94)', boxShadow: `0 0 12px ${isDisaster ? C.danger : C.gold}` }} />
              {T.map((_, i) => (
                <div key={i} onClick={() => setStep(i)} style={{ position: 'absolute', top: '50%', [he ? 'right' : 'left']: `${(i / (T.length - 1)) * 100}%`, transform: 'translate(50%,-50%)', width: 12, height: 12, borderRadius: '50%', cursor: 'pointer', background: i <= step ? (i >= 6 ? C.danger : C.gold) : 'rgba(255,255,255,0.2)', border: `2px solid ${i === step ? '#fff' : 'rgba(255,255,255,0.3)'}`, boxShadow: i === step ? `0 0 12px ${i >= 6 ? C.danger : C.gold}` : 'none', transition: 'all 0.3s' }} />
              ))}
            </div>
          </div>
        </div>

        {/* Live stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 14 }}>
          <Stat ic="⚡" lb={t('הספק', 'POWER')} val={stats.P >= 10000 ? `${(stats.P / 1000).toFixed(0)}k` : `${stats.P}`} unit="MWt" sub={t('מתוכנן: 3,200', 'Design: 3,200')} col={stats.P > 3500 ? C.danger : stats.P > 500 ? C.gold : C.amber} warn={stats.P > 3500 || stats.P < 100} />
          <Stat ic="🎯" lb={t('מוטות', 'RODS')} val={`${stats.R}`} unit="/211" sub={t('מינימום בטוח: 30', 'Safe min: 30')} col={stats.R < 30 ? C.danger : stats.R < 100 ? C.amber : C.green} warn={stats.R < 30} />
          <Stat ic="💨" lb={t('חללות', 'VOIDS')} val={`+${stats.V}`} unit="β" sub={t('בריחה: +1', 'Runaway: +1')} col={stats.V >= 5 ? C.danger : stats.V >= 3 ? C.amber : C.gold} warn={stats.V >= 5} />
        </div>

        {/* Reactor diagram */}
        <div style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)', border: '1px solid rgba(200,164,78,0.25)', borderRadius: 14, padding: '12px 6px', marginBottom: 14, position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 10px 10px' }}>
            <div style={{ fontSize: 10, color: `${C.gold}cc`, fontFamily: 'monospace', letterSpacing: '0.15em', fontWeight: 700 }}>
              📐 FIG.01 — {t('חתך הכור (לחץ על רכיבים)', 'REACTOR CUTAWAY (click parts)')}
            </div>
            <button onClick={() => setShowCutaway((s) => !s)} style={{ padding: '5px 10px', fontSize: 10, fontWeight: 700, background: 'rgba(200,164,78,0.15)', color: C.gold, border: '1px solid rgba(200,164,78,0.25)', borderRadius: 5, cursor: 'pointer', fontFamily: 'monospace' }}>
              {showCutaway ? `👁️ ${t('הסתר פנים', 'Hide')}` : `👁️ ${t('הצג פנים', 'Show')}`}
            </button>
          </div>

          <ReactorSVG step={step} sel={sel} setSel={setSel} showCutaway={showCutaway} collapsed={collapsed} exploded={exploded} isDisaster={isDisaster} fuelGlow={fuelGlow} fuelColor={fuelColor} he={he} t={t} />
        </div>

        {/* Component details */}
        <div style={{ padding: '18px 20px', borderRadius: 14, marginBottom: 14, background: cur ? 'linear-gradient(135deg,rgba(200,164,78,0.08),rgba(200,164,78,0.02))' : 'rgba(255,255,255,0.03)', border: `1px solid ${cur ? 'rgba(200,164,78,0.35)' : 'rgba(255,255,255,0.06)'}`, minHeight: 120, transition: 'all 0.4s', boxShadow: cur ? '0 4px 24px rgba(200,164,78,0.1)' : 'none' }}>
          {cur ? (
            <div className="scale-in">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <div style={{ fontSize: 28, width: 46, height: 46, borderRadius: 10, background: `${cur.color}22`, border: `1px solid ${cur.color}55`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {cur.icon}
                </div>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: C.gL, fontFamily: "'Playfair Display',serif", lineHeight: 1.2 }}>
                    {t(cur.he, cur.en)}
                  </div>
                  <div style={{ fontSize: 10, color: cur.color, fontFamily: 'monospace', letterSpacing: '0.1em', marginTop: 2, fontWeight: 700 }}>
                    {cur.p}
                  </div>
                </div>
              </div>
              <div style={{ padding: '10px 14px', borderRadius: 8, background: 'rgba(0,0,0,0.3)', borderLeft: `3px solid ${cur.color}`, fontSize: 13, color: 'rgba(255,255,255,0.92)', lineHeight: 1.85 }}>
                <div style={{ fontSize: 9, fontWeight: 700, color: cur.color, fontFamily: 'monospace', letterSpacing: '0.15em', marginBottom: 5, opacity: 0.85 }}>
                  {explainMode === 'simple' ? `📖 ${t('הסבר פשוט', 'Simple Explanation')}` : `🎓 ${t('הסבר מקצועי', 'Technical Explanation')}`}
                </div>
                {desc}
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: 18 }}>
              <div style={{ fontSize: 28, marginBottom: 6, opacity: 0.5 }}>👆</div>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', lineHeight: 1.7 }}>
                {t('לחץ על כל רכיב בתרשים כדי לקבל הסבר מפורט', 'Click any component in the diagram for a detailed explanation')}
              </p>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 6 }}>
                {t('יש 12 רכיבים אינטראקטיביים', '12 interactive components available')}
              </p>
            </div>
          )}
        </div>

        {/* Key facts */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(130px,1fr))', gap: 8, marginBottom: 14 }}>
          {[
            { ic: '⚛', n: '1,661', l: t('תעלות דלק', 'Fuel channels'), c: C.gold },
            { ic: '🎯', n: '211', l: t('מוטות בקרה', 'Control rods'), c: C.amber },
            { ic: '🔥', n: '+4.7β', l: t('מקדם חללות', 'Void coeff'), c: C.danger },
            { ic: '☢', n: '190 t', l: t('UO₂ בליבה', 'UO₂ core'), c: C.gL },
            { ic: '💧', n: '37k', l: t('מ״ק/שעה', 'm³/h water'), c: C.blue },
            { ic: '⚡', n: '1,000', l: t('MWe חשמלי', 'MWe electric'), c: C.green },
          ].map((s, i) => (
            <div key={i} className="hover-lift" style={{ padding: '12px 8px', borderRadius: 10, background: 'linear-gradient(135deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))', border: '1px solid rgba(255,255,255,0.08)', textAlign: 'center' }}>
              <div style={{ fontSize: 14, marginBottom: 2 }}>{s.ic}</div>
              <div style={{ fontSize: 18, fontWeight: 900, color: s.c, fontFamily: "'Playfair Display',serif", lineHeight: 1 }}>{s.n}</div>
              <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.6)', fontFamily: 'monospace', marginTop: 4 }}>{s.l}</div>
            </div>
          ))}
        </div>

        <div style={{ padding: '12px 14px', borderRadius: 8, background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(200,164,78,0.12)', backdropFilter: 'blur(8px)' }}>
          <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)', lineHeight: 1.6, textAlign: 'center', fontFamily: 'monospace' }}>
            📚 {t('מקורות', 'Sources')}: IAEA INSAG-7 (1992) · UNSCEAR 2008 · NRC NUREG-1250 · Higginbotham (2019) · Plokhy (2018)
          </p>
          <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)', textAlign: 'center', marginTop: 4, fontFamily: 'monospace' }}>
            © 2026 {t('רועי צוקרמן', 'Roie Zukerman')} — {t('60 שניות חומ״ס', '60 Seconds HazMat')}
          </p>
        </div>
      </div>
    </div>
  );
}

function Stat({ ic, lb, val, unit, sub, col, warn }: { ic: string; lb: string; val: string; unit: string; sub: string; col: string; warn: boolean }) {
  return (
    <div style={{ padding: '10px 12px', borderRadius: 10, position: 'relative', overflow: 'hidden', background: `linear-gradient(135deg,${col}15,${col}05)`, border: `1px solid ${col}33`, boxShadow: warn ? `0 0 24px ${col}50` : 'none', transition: 'all 0.5s' }}>
      {warn && <div style={{ position: 'absolute', top: 0, right: 0, padding: '2px 6px', background: col, color: '#fff', fontSize: 8, fontWeight: 800, fontFamily: 'monospace', borderBottomLeftRadius: 6, letterSpacing: '0.1em' }}>⚠ ALERT</div>}
      <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.55)', fontFamily: 'monospace', letterSpacing: '0.18em', marginBottom: 4, fontWeight: 700 }}>{ic} {lb}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
        <div style={{ fontSize: 'clamp(20px,4vw,28px)', fontWeight: 900, color: col, fontFamily: "'Playfair Display',serif", lineHeight: 1, textShadow: warn ? `0 0 14px ${col}aa` : 'none', transition: 'all 0.3s' }}>{val}</div>
        <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.55)', fontFamily: 'monospace' }}>{unit}</div>
      </div>
      <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.45)', fontFamily: 'monospace', marginTop: 3 }}>{sub}</div>
    </div>
  );
}

function ReactorSVG({ step, sel, setSel, showCutaway, collapsed, exploded, isDisaster, fuelGlow, fuelColor, he, t }: any) {
  return (
    <svg viewBox="0 0 1000 760" style={{ width: '100%', display: 'block' }}>
      <defs>
        <marker id="arB" viewBox="0 0 10 7" refX="9" refY="3.5" markerWidth="6" markerHeight="5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill={C.blue} /></marker>
        <marker id="arS" viewBox="0 0 10 7" refX="9" refY="3.5" markerWidth="6" markerHeight="5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill={C.amber} /></marker>
        <radialGradient id="rGlow" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor={fuelColor} stopOpacity={fuelGlow} />
          <stop offset="60%" stopColor="#dc2626" stopOpacity={fuelGlow * 0.6} />
          <stop offset="100%" stopColor="#dc2626" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="vesG" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#475569" /><stop offset="50%" stopColor="#94a3b8" /><stop offset="100%" stopColor="#475569" /></linearGradient>
        <linearGradient id="grG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3a3a45" /><stop offset="50%" stopColor="#1f1f28" /><stop offset="100%" stopColor="#0f0f15" /></linearGradient>
        <linearGradient id="conG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#525252" /><stop offset="100%" stopColor="#262626" /></linearGradient>
      </defs>

      <g opacity="0.25"><path d="M 30 90 L 30 600 L 970 600 L 970 90 L 720 90 L 720 55 L 480 55 L 480 90 Z" fill="none" stroke={C.muted} strokeWidth="1" strokeDasharray="6,3" /></g>

      <g opacity="0.55">
        <rect x="30" y="630" width="940" height="100" fill="#06b6d420" stroke={C.blue} strokeWidth="1.5" strokeDasharray="4,2" rx="4" />
        <text x="500" y="685" fill={C.blue} fontSize="13" fontFamily="monospace" textAnchor="middle" fontWeight="700">🌊 {t('בריכת קירור פריפיאט — 22 קמ״ר', 'Pripyat Cooling Pond — 22 km²')}</text>
        {[0, 1, 2, 3, 4].map((i) => (<path key={i} d={`M 30 ${650 + i * 16} Q 250 ${645 + i * 16} 500 ${650 + i * 16} T 970 ${650 + i * 16}`} fill="none" stroke={C.blue} strokeWidth="0.5" opacity="0.4" />))}
      </g>

      <g style={{ transform: collapsed ? 'translate(120px,-220px) rotate(18deg)' : 'translate(0,0)', transformOrigin: '480px 80px', transition: 'transform 1.8s cubic-bezier(0.5,0,0.7,1)', opacity: collapsed ? 0.4 : 1 }} onClick={() => setSel('shield')} cursor="pointer">
        <rect x="370" y="68" width="280" height="16" fill="#404040" stroke="#1a1a1a" strokeWidth="1.5" rx="1" />
        <text x="510" y="79" fill="#fff" fontSize="9" fontFamily="monospace" textAnchor="middle" fontWeight="700">🛡 {t('מגן ביולוגי "סכמה E" — 2,000 ט׳', '"Schema E" Bio-Shield — 2,000 t')}</text>
      </g>

      <g onClick={() => setSel('refuel')} cursor="pointer" opacity={collapsed ? 0.3 : 0.85}>
        <rect x="395" y="42" width="230" height="22" fill="#525252" stroke="#1a1a1a" strokeWidth="1" rx="2" />
        <circle cx="510" cy="53" r="4" fill={C.amber} style={{ animation: 'fuelPulse 2s ease-in-out infinite' }} />
        <text x="510" y="38" fill={C.muted} fontSize="9" fontFamily="monospace" textAnchor="middle">🏗 {t('מכונת תדלוק', 'Refueling Machine')}</text>
      </g>

      {exploded && (
        <g>
          <circle cx="510" cy="295" r="240" fill="url(#rGlow)" opacity="0.95" style={{ animation: 'expFlash 0.8s ease-out forwards' }} />
          <circle cx="510" cy="295" r="170" fill="#fbbf24" opacity="0.75" style={{ animation: 'expFlash 0.6s ease-out forwards' }} />
          <circle cx="510" cy="295" r="100" fill="#fff" opacity="0.7" style={{ animation: 'expFlash 0.4s ease-out forwards' }} />
          <circle cx="510" cy="295" r="100" fill="none" stroke="#fbbf24" strokeWidth="3" opacity="0">
            <animate attributeName="r" from="100" to="350" dur="1.2s" repeatCount="indefinite" />
            <animate attributeName="opacity" from="0.9" to="0" dur="1.2s" repeatCount="indefinite" />
          </circle>
        </g>
      )}

      {collapsed && (
        <g>
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <circle key={i} cx={490 + i * 15} cy={25 - i * 2} r={20 + i * 5} fill="rgba(150,200,150,0.35)" stroke="rgba(74,222,128,0.5)" strokeWidth="0.5" style={{ animation: `plumeRise ${4 + i * 0.3}s ease-out infinite`, animationDelay: `${i * 0.4}s` }} />
          ))}
          <text x="610" y="22" fill="#86efac" fontSize="12" fontFamily="monospace" fontWeight="700">☢ Cs-137 · I-131 · Sr-90 · Pu-239</text>
          <text x="610" y="36" fill="#86efac" fontSize="9" fontFamily="monospace" opacity="0.85">{t('400× פצצת הירושימה', '400× Hiroshima')}</text>
        </g>
      )}

      <g onClick={() => setSel('vessel')} cursor="pointer">
        <rect x="370" y="135" width="280" height="320" fill="url(#conG)" stroke="#1a1a1a" strokeWidth="2" rx="4" />
        <text x="510" y="153" fill={C.muted} fontSize="9" fontFamily="monospace" textAnchor="middle" fontWeight="700">{t('🏛 מגן ביולוגי בטון', '🏛 Concrete Bio-Shield')}</text>
      </g>

      {showCutaway && (
        <>
          <rect x="395" y="170" width="230" height="270" fill="url(#vesG)" stroke="#cbd5e1" strokeWidth="2" rx="3" />
          <g onClick={() => setSel('graphite')} cursor="pointer">
            <rect x="410" y="185" width="200" height="240" fill="url(#grG)" stroke="#0f172a" strokeWidth="1.5" />
            <rect x="410" y="185" width="200" height="240" fill="url(#rGlow)" style={{ animation: isDisaster ? 'pulseFire 0.4s ease-in-out infinite' : 'pulseFire 4s ease-in-out infinite' }} />
          </g>
          <g onClick={() => setSel('fuel')} cursor="pointer">
            {Array.from({ length: 18 }).map((_, c) => {
              const fx = 420 + c * 10.5;
              return (
                <g key={c}>
                  <line x1={fx} y1="190" x2={fx} y2="420" stroke="#a3a3a3" strokeWidth="0.7" opacity="0.4" />
                  {Array.from({ length: 8 }).map((__, i) => (
                    <circle key={i} cx={fx} cy={200 + i * 28} r="2.4" fill={fuelColor} opacity={fuelGlow} style={{ animation: `fuelPulse ${1.5 + (c + i) * 0.04}s ease-in-out infinite`, animationDelay: `${(c + i) * 0.03}s` }} />
                  ))}
                </g>
              );
            })}
          </g>
          <g onClick={() => setSel('rods')} cursor="pointer">
            {Array.from({ length: 7 }).map((_, i) => {
              const rx = 432 + i * 28;
              let ins = 0;
              if (step <= 1) ins = 35;
              else if (step <= 2) ins = 18;
              else if (step <= 4) ins = 5;
              else if (step === 5) ins = 5;
              else if (step === 6) ins = 30;
              else if (step >= 7) ins = 70;
              return (
                <g key={i}>
                  <line x1={rx} y1="170" x2={rx} y2={170 + ins} stroke="#525252" strokeWidth="3.5" strokeLinecap="round" />
                  <circle cx={rx} cy={170 + ins} r="2.5" fill="#525252" />
                  {step >= 6 && ins > 5 && <line x1={rx} y1={170 + ins} x2={rx} y2={170 + ins + 25} stroke={C.amber} strokeWidth="3" strokeLinecap="round" opacity="0.95" style={{ animation: 'pulseFire 0.5s ease-in-out infinite' }} />}
                </g>
              );
            })}
          </g>
        </>
      )}

      <text x="510" y="463" fill={C.gold} fontSize="11" fontFamily="'Playfair Display',serif" textAnchor="middle" fontWeight="700">⚛ {t('הליבה — 1,661 תעלות + 211 מוטות', 'Core — 1,661 channels + 211 rods')}</text>
      <text x="510" y="477" fill={C.muted} fontSize="9" fontFamily="monospace" textAnchor="middle">7m × 11.8m | 1,700 t {t('גרפיט', 'graphite')} | 190 t UO₂</text>

      <g onClick={() => setSel('drum')} cursor="pointer" style={{ transition: 'transform 1s', transform: collapsed ? 'translateY(8px)' : 'translateY(0)' }}>
        {[0, 1].map((i) => {
          const dy = 115 + i * 30;
          return (
            <g key={i}>
              <ellipse cx="730" cy={dy} rx="9" ry="13" fill="#94a3b8" stroke="#475569" strokeWidth="1" />
              <rect x="730" y={dy - 13} width="160" height="26" fill="#cbd5e1" stroke="#475569" strokeWidth="1" />
              <ellipse cx="890" cy={dy} rx="9" ry="13" fill="#94a3b8" stroke="#475569" strokeWidth="1" />
              <rect x="732" y={dy} width="156" height="11" fill={C.blue} opacity="0.55" />
            </g>
          );
        })}
        <text x="810" y="185" fill={C.gold} fontSize="11" fontFamily="'Playfair Display',serif" textAnchor="middle" fontWeight="700">🛢 {t('תופי הפרדה ×4', 'Steam Drums ×4')}</text>
      </g>

      <g style={{ opacity: collapsed ? 0.2 : 1, transition: 'opacity 1s' }}>
        <path d="M 625 215 L 720 140" stroke="#fbbf24" strokeWidth="3" fill="none" markerEnd="url(#arS)" strokeDasharray="6,3" className="ff" />
      </g>
      <g style={{ opacity: collapsed ? 0.2 : 1, transition: 'opacity 1s' }}>
        <path d="M 890 140 L 920 140 L 920 290" stroke="#fbbf24" strokeWidth="3" fill="none" markerEnd="url(#arS)" strokeDasharray="6,3" className="ff" />
      </g>

      <g onClick={() => setSel('turbine')} cursor="pointer">
        {[0, 1].map((i) => {
          const ty = 300 + i * 65;
          return (
            <g key={i}>
              <rect x="850" y={ty} width="100" height="50" fill="#1e293b" stroke="#475569" strokeWidth="1.5" rx="3" />
              <g style={{ transformOrigin: `880px ${ty + 25}px`, animation: !collapsed ? 'spin 1.2s linear infinite' : 'none' }}>
                <circle cx="880" cy={ty + 25} r="18" fill="none" stroke={C.gold} strokeWidth="2" />
                {[0, 30, 60, 90, 120, 150].map((a) => (
                  <line key={a} x1="880" y1={ty + 25} x2={880 + Math.cos((a * Math.PI) / 180) * 18} y2={ty + 25 + Math.sin((a * Math.PI) / 180) * 18} stroke={C.gold} strokeWidth="2.5" />
                ))}
                <circle cx="880" cy={ty + 25} r="4" fill={C.gold} />
              </g>
              <rect x="900" y={ty + 10} width="48" height="32" fill="#475569" stroke="#1e293b" strokeWidth="1" rx="2" />
              <text x="924" y={ty + 30} fill="#fff" fontSize="8" fontFamily="monospace" textAnchor="middle" fontWeight="700">G</text>
            </g>
          );
        })}
        <text x="900" y="450" fill={C.gold} fontSize="11" fontFamily="'Playfair Display',serif" textAnchor="middle" fontWeight="700">🌀 {t('טורבינות', 'Turbines')}</text>
      </g>

      <g style={{ opacity: collapsed ? 0.2 : 1, transition: 'opacity 1s' }}>
        <path d="M 950 335 Q 990 400 950 480" stroke="#fbbf24" strokeWidth="2" fill="none" strokeDasharray="4,2" opacity="0.5" />
      </g>

      <g onClick={() => setSel('cond')} cursor="pointer">
        <rect x="800" y="480" width="170" height="65" fill="#06b6d420" stroke={C.blue} strokeWidth="1.5" rx="3" />
        {[0, 1, 2, 3, 4, 5, 6].map((i) => <line key={i} x1="810" y1={490 + i * 8} x2="960" y2={490 + i * 8} stroke={C.blue} strokeWidth="0.8" opacity="0.6" />)}
        <text x="885" y="520" fill={C.blue} fontSize="11" fontFamily="'Playfair Display',serif" textAnchor="middle" fontWeight="700">💧 {t('מעבים', 'Condensers')}</text>
      </g>

      <g style={{ opacity: collapsed ? 0.3 : 1, transition: 'opacity 1s' }}>
        <path d="M 800 510 L 200 510" stroke={C.blue} strokeWidth="2.5" fill="none" markerEnd="url(#arB)" strokeDasharray="6,3" className="fs" />
      </g>

      <g onClick={() => setSel('feed')} cursor="pointer">
        <rect x="115" y="480" width="85" height="55" fill="#0a0e1a" stroke={C.gold} strokeWidth="1.5" rx="3" />
        <text x="157" y="498" fill={C.gold} fontSize="9" fontFamily="monospace" textAnchor="middle" fontWeight="700">{t('מסיר אוויר', 'Deaerator')}</text>
        <ellipse cx="157" cy="513" rx="28" ry="6" fill={C.blue} opacity="0.5" />
        <text x="157" y="516" fill="#fff" fontSize="7" fontFamily="monospace" textAnchor="middle">165°C</text>
      </g>

      <g style={{ opacity: collapsed ? 0.3 : 1, transition: 'opacity 1s' }}>
        <path d="M 200 510 L 250 510 L 250 145 L 720 145" stroke={C.blue} strokeWidth="2" fill="none" markerEnd="url(#arB)" strokeDasharray="6,3" className="fs" opacity="0.7" />
      </g>
      <g style={{ opacity: collapsed ? 0.2 : 1, transition: 'opacity 1s' }}>
        <path d="M 730 165 L 730 320 L 100 320 L 100 380" stroke={C.blue} strokeWidth="2.5" fill="none" markerEnd="url(#arB)" strokeDasharray="6,3" className="fs" />
      </g>

      <g onClick={() => setSel('mcp')} cursor="pointer">
        {[0, 1, 2].map((i) => {
          const py = 385 + i * 32;
          return (
            <g key={i}>
              <circle cx="100" cy={py} r="17" fill="#0a0e1a" stroke={C.blue} strokeWidth="2" />
              <g style={{ transformOrigin: `100px ${py}px`, animation: 'spin 1s linear infinite' }}>
                {[0, 60, 120, 180, 240, 300].map((a) => (
                  <path key={a} d={`M 100 ${py} Q ${100 + Math.cos(((a - 30) * Math.PI) / 180) * 9} ${py + Math.sin(((a - 30) * Math.PI) / 180) * 9} ${100 + Math.cos((a * Math.PI) / 180) * 13} ${py + Math.sin((a * Math.PI) / 180) * 13}`} stroke={C.blue} strokeWidth="2.5" fill="none" strokeLinecap="round" />
                ))}
                <circle cx="100" cy={py} r="3.5" fill={C.blue} />
              </g>
            </g>
          );
        })}
        <text x="100" y="500" fill={C.blue} fontSize="11" fontFamily="'Playfair Display',serif" textAnchor="middle" fontWeight="700">⚙ MCP × 8</text>
      </g>

      <g style={{ opacity: collapsed ? 0.2 : 1, transition: 'opacity 1s' }}>
        <path d="M 120 445 L 250 445 L 250 435 L 395 435" stroke={C.blue} strokeWidth="2.5" fill="none" markerEnd="url(#arB)" strokeDasharray="6,3" className="ff" />
      </g>

      <g onClick={() => setSel('az5')} cursor="pointer">
        <rect x="40" y="195" width="65" height="60" fill="#1e293b" stroke={step >= 6 ? C.danger : '#475569'} strokeWidth="2" rx="4" style={{ animation: step >= 6 ? 'pulseAlert 1s ease-in-out infinite' : 'none' }} />
        <text x="72" y="210" fill={C.gold} fontSize="7" fontFamily="monospace" textAnchor="middle" fontWeight="700">🎛 {t('חדר בקרה', 'Control Rm')}</text>
        <circle cx="72" cy="232" r="15" fill={step >= 6 ? C.danger : '#7f1d1d'} stroke={C.amber} strokeWidth="2" style={{ animation: step >= 6 ? 'pulseAlert 0.5s ease-in-out infinite' : 'none' }} />
        <text x="72" y="236" fill="#fff" fontSize="10" fontFamily="monospace" textAnchor="middle" fontWeight="900">AZ-5</text>
        <text x="72" y="251" fill={C.gold} fontSize="6" fontFamily="monospace" textAnchor="middle">SCRAM</text>
      </g>
    </svg>
  );
}
