'use client';
import { useState } from 'react';
import Link from 'next/link';

const C = { gold: '#c8a44e', gL: '#e8d5a0', danger: '#ef4444', blue: '#06b6d4', green: '#22c55e', amber: '#f59e0b', purple: '#a855f7' };

const TERMS = [
  // Nuclear physics
  { cat: 'phys', he: 'ביקוע גרעיני', en: 'Nuclear Fission', def_he: 'תהליך שבו גרעין כבד (כמו אורניום-235) מתפצל לשני גרעינים קלים יותר תוך שחרור אנרגיה רבה ופליטת ניוטרונים.', def_en: 'Process in which a heavy nucleus (like U-235) splits into two lighter nuclei, releasing large amounts of energy and emitting neutrons.' },
  { cat: 'phys', he: 'תגובת שרשרת', en: 'Chain Reaction', def_he: 'תהליך שבו ניוטרונים מביקוע אחד גורמים לביקועים נוספים, וכך הלאה. בכור מבוקר, מספר הניוטרונים נשמר קבוע.', def_en: 'Process where neutrons from one fission cause additional fissions. In a controlled reactor, neutron count remains constant.' },
  { cat: 'phys', he: 'מקדם חללות (Void Coefficient)', en: 'Void Coefficient', def_he: 'מידת השינוי בתגובתיות הכור כתוצאה מיצירת בועות קיטור במים. ב-RBMK חיובי וגבוה (+4.7β) — פגם תכן קריטי שגרם לתאוצה במקום עצירה.', def_en: 'Reactor reactivity change due to steam void formation in coolant. In RBMK positive and high (+4.7β) — critical design flaw causing acceleration instead of shutdown.' },
  { cat: 'phys', he: 'קריטיות פרומפטית', en: 'Prompt Criticality', def_he: 'מצב שבו הכור הופך קריטי באמצעות ניוטרונים מהירים בלבד, ללא תרומה של ניוטרונים מאוחרים. ההספק יכול לזנק תוך מילישניות. זה מה שקרה ב-01:23:45.', def_en: 'State where reactor becomes critical via prompt neutrons alone, without contribution of delayed neutrons. Power can spike within milliseconds. This is what happened at 01:23:45.' },
  { cat: 'phys', he: 'מאט (Moderator)', en: 'Moderator', def_he: 'חומר שמאט ניוטרונים מהירים לטרמיים, כדי שיוכלו לגרום לביקוע. ב-RBMK: גרפיט. בכורים מערביים: מים תחת לחץ.', def_en: 'Material that slows fast neutrons to thermal speeds, enabling fission. In RBMK: graphite. In Western reactors: pressurized water.' },
  { cat: 'phys', he: 'אורניום מועשר', en: 'Enriched Uranium', def_he: 'אורניום שבו הוגדל ריכוז האיזוטופ U-235 (הקל לביקוע) מעל הריכוז הטבעי (0.7%). דלק RBMK: 2.0% U-235.', def_en: 'Uranium with elevated U-235 isotope concentration (easily fissionable) above natural (0.7%). RBMK fuel: 2.0% U-235.' },
  { cat: 'phys', he: 'הרעלת קסנון', en: 'Xenon Poisoning', def_he: 'הצטברות Xe-135 (תוצר ביקוע) הסופח ניוטרונים בכמות גדולה ובכך מדכא את הכור. ב-26/4/86 גרם לקריסת הספק ל-30 MWt.', def_en: 'Xe-135 buildup (fission product) absorbing massive neutron flux, suppressing reactor. On 26/4/86 caused power crash to 30 MWt.' },
  { cat: 'phys', he: 'תגובתיות (Reactivity)', en: 'Reactivity', def_he: 'מידת הסטייה של הכור ממצב קריטי. תגובתיות חיובית = ההספק עולה. נמדד ביחידות δk/k או ב-β (חלקי ניוטרון מאוחר).', def_en: 'Reactor deviation from critical state. Positive reactivity = power rising. Measured in δk/k or β (delayed neutron fractions).' },

  // Reactor systems
  { cat: 'reactor', he: 'RBMK (Reaktor Bolshoy Moshchnosti Kanalnyy)', en: 'RBMK', def_he: 'כור גרפיט-מים סובייטי במבנה תעלות. חסר מבנה הכלה מערבי. כל הכורים מסוג זה (כולל בצ׳רנוביל) שודרגו אחרי האסון.', def_en: 'Soviet graphite-moderated, water-cooled, channel-type reactor. Lacks Western containment building. All reactors of this type were upgraded post-disaster.' },
  { cat: 'reactor', he: 'מוטות בקרה', en: 'Control Rods', def_he: 'מוטות שעשויים מחומרים סופחי-ניוטרונים (בורון, קדמיום). מחדירים אותם לליבה כדי להאט/לעצור את התגובה. ב-RBMK: 211 מוטות B₄C עם פגם הקצה הגרפיטי.', def_en: 'Rods made of neutron-absorbing materials (boron, cadmium). Inserted into core to slow/stop reaction. In RBMK: 211 B₄C rods with graphite tip flaw.' },
  { cat: 'reactor', he: 'AZ-5', en: 'AZ-5 (Emergency Scram)', def_he: 'כפתור עצירת חירום. מחדיר את כל המוטות תוך 18-21 שניות. ב-26/4/86 בשעה 01:23:40 הופעל וגרם לפיצוץ במקום לעצור.', def_en: 'Emergency scram button. Inserts all rods within 18-21 seconds. On 26/4/86 at 01:23:40 it was activated and caused the explosion instead of stopping.' },
  { cat: 'reactor', he: 'ECCS — מערכת קירור חירום', en: 'ECCS — Emergency Core Cooling System', def_he: 'מערכת גיבוי שמציפה את הכור במים אם הקירור הראשי נכשל. בצ׳רנוביל נותקה ידנית ב-25/4/86 14:00 — הפרת רישיון.', def_en: 'Backup system flooding reactor with water if primary cooling fails. At Chernobyl manually disabled on 25/4/86 14:00 — license violation.' },
  { cat: 'reactor', he: 'ORM — מרווח תגובתיות מבצעי', en: 'ORM — Operational Reactivity Margin', def_he: 'מספר המוטות שיש להחדיר לליבה כדי להגיע לסף תגובתיות. מינימום מותר: 30. בעת האסון: 8.', def_en: 'Number of rods needed to reach reactivity threshold. Allowed minimum: 30. At disaster time: 8.' },
  { cat: 'reactor', he: 'תופי הפרדה', en: 'Steam Separator Drums', def_he: '4 גלילים אופקיים (30 מ׳) המפרידים את תערובת המים-קיטור היוצאת מהליבה לקיטור יבש (לטורבינה) ומים (לחזרה לכור).', def_en: '4 horizontal cylinders (30m) separating water-steam mixture from core into dry steam (to turbine) and water (back to reactor).' },
  { cat: 'reactor', he: 'מכל לחץ (Pressure Vessel)', en: 'Pressure Vessel', def_he: 'מכל פלדה-בטון העוטף את הכור. ב-RBMK: 26 מ׳ × 21.6 מ׳, ללא containment חיצוני. בכורים מערביים יש כיפה נוספת.', def_en: 'Steel-concrete vessel housing reactor. In RBMK: 26m × 21.6m, no outer containment. Western reactors have additional dome.' },
  { cat: 'reactor', he: 'תעלת לחץ (Pressure Tube)', en: 'Pressure Tube', def_he: 'צינור זירקאלוי שמכיל תעלת דלק עם מים זורמים. RBMK יש 1,661 מהם.', def_en: 'Zircaloy tube containing fuel channel with flowing water. RBMK has 1,661 of these.' },
  { cat: 'reactor', he: '"סכמה E" (מגן ביולוגי)', en: '"Schema E" Bio-Shield', def_he: 'לוח פלדה-בטון 2,000 ט׳ העוטף את החלק העליון של הכור. בפיצוץ השני נזרק לאוויר ונחת בזווית — נשאר ככה עד היום.', def_en: 'Steel-concrete plate, 2,000 t, capping reactor top. Second explosion hurled it; landed at angle — stayed that way until today.' },
  { cat: 'reactor', he: 'משאבת זרימה ראשית (MCP)', en: 'Main Circulation Pump', def_he: 'משאבה צנטריפוגלית שדוחפת מי קירור דרך הכור. RBMK יש 8 (6 פעילות + 2 רזרבה). ב-26/4 כל ה-8 הופעלו במקביל.', def_en: 'Centrifugal pump pushing coolant through reactor. RBMK has 8 (6 active + 2 reserve). On 26/4 all 8 ran simultaneously.' },

  // Radiation
  { cat: 'rad', he: 'תסמונת קרינה חריפה (ARS)', en: 'Acute Radiation Syndrome', def_he: 'מחלה הנגרמת מחשיפה למנת קרינה גבוהה (>1 Gy) בזמן קצר. תסמינים: בחילות, פגיעה במח עצם, פגיעה במערכת העיכול, מוות. 134 ליקווידטורים אובחנו, 28 מתו תוך 3 חודשים.', def_en: 'Disease caused by high radiation exposure (>1 Gy) in short time. Symptoms: nausea, bone marrow damage, GI damage, death. 134 liquidators diagnosed, 28 died within 3 months.' },
  { cat: 'rad', he: 'מנת קרינה (Dose)', en: 'Radiation Dose', def_he: 'כמות הקרינה שנספגה ברקמת הגוף. נמדדת ב-Gray (Gy) לאנרגיה נספגת או Sievert (Sv) לנזק ביולוגי משוקלל.', def_en: 'Radiation absorbed by tissue. Measured in Gray (Gy) for absorbed energy or Sievert (Sv) for biological damage-weighted.' },
  { cat: 'rad', he: 'קרן גמא', en: 'Gamma Rays', def_he: 'קרינה אלקטרומגנטית בעלת אנרגיה גבוהה ויכולת חדירה גדולה. כדי לעצור: עופרת או בטון בעובי משמעותי. הסכנה העיקרית באסון.', def_en: 'High-energy electromagnetic radiation with great penetration. To stop: thick lead or concrete. Main hazard in the disaster.' },
  { cat: 'rad', he: 'קרן ביתא', en: 'Beta Particles', def_he: 'אלקטרונים מהירים. עוצרים על ידי לוח אלומיניום או בגדים עבים. סכנה במגע עורי או בליעה.', def_en: 'Fast electrons. Stopped by aluminum sheet or thick clothing. Danger via skin contact or ingestion.' },
  { cat: 'rad', he: 'איזוטופ רדיואקטיבי', en: 'Radioisotope', def_he: 'איזוטופ של יסוד שגרעינו לא יציב ומתפרק תוך פליטת קרינה. דוגמאות: I-131, Cs-137, Sr-90, Pu-239.', def_en: 'Isotope of an element with unstable nucleus that decays emitting radiation. Examples: I-131, Cs-137, Sr-90, Pu-239.' },
  { cat: 'rad', he: 'יוד-131 (I-131)', en: 'Iodine-131', def_he: 'איזוטופ רדיואקטיבי בעל מחצית-חיים של 8 ימים. נבלע ע"י בלוטת התריס וגורם לסרטן בלוטת התריס בילדים. אחראי ל-6,000+ מקרי סרטן באזור.', def_en: 'Radioactive isotope with 8-day half-life. Absorbed by thyroid gland, causing childhood thyroid cancer. Responsible for 6,000+ cases in the area.' },
  { cat: 'rad', he: 'צסיום-137 (Cs-137)', en: 'Cesium-137', def_he: 'איזוטופ רדיואקטיבי בעל מחצית-חיים של 30 שנה. אחראי לזיהום ארוך-טווח של אדמה ומזון. עד היום מצוי באזור ההדרה.', def_en: 'Radioactive isotope with 30-year half-life. Responsible for long-term contamination of soil and food. Still present in exclusion zone today.' },
  { cat: 'rad', he: 'סטרונציום-90 (Sr-90)', en: 'Strontium-90', def_he: 'מחקה סידן ומשתלב בעצמות. מחצית-חיים: 29 שנה. גורם לסרטן עצם וללוקמיה.', def_en: 'Mimics calcium, embeds in bones. Half-life: 29 years. Causes bone cancer and leukemia.' },
  { cat: 'rad', he: 'פלוטוניום-239 (Pu-239)', en: 'Plutonium-239', def_he: 'איזוטופ של פלוטוניום. מחצית-חיים: 24,000 שנה. רעיל מאוד אם נשאף או נבלע. שוחרר באסון.', def_en: 'Plutonium isotope. Half-life: 24,000 years. Highly toxic if inhaled or ingested. Released in the disaster.' },
  { cat: 'rad', he: 'מחצית-חיים', en: 'Half-Life', def_he: 'הזמן הנדרש לחצי מאיזוטופ רדיואקטיבי להתפרק. דוגמאות: I-131 (8 ימים), Cs-137 (30 שנה), Pu-239 (24,000 שנה).', def_en: 'Time for half a radioactive isotope to decay. Examples: I-131 (8 days), Cs-137 (30 years), Pu-239 (24,000 years).' },
  { cat: 'rad', he: 'PBq (פטה-בקרל)', en: 'PBq (Petabecquerel)', def_he: 'יחידת מדידת פעילות רדיואקטיבית. 1 PBq = 10¹⁵ פירוקים בשנייה. מצ׳רנוביל שוחרר 5,300 PBq של Cs-137.', def_en: 'Unit of radioactive activity. 1 PBq = 10¹⁵ decays per second. Chernobyl released 5,300 PBq of Cs-137.' },

  // Disaster terms
  { cat: 'dis', he: 'ליקווידטורים (Likvidatory)', en: 'Liquidators', def_he: 'כינוי לכ-600,000 חיילים, פועלים, ומומחים שעבדו על ניקוי האסון בין 1986-1990. שיעור התמותה העודפת בקרבם: ~10%.', def_en: 'Term for ~600,000 soldiers, workers, and specialists who worked on disaster cleanup 1986-1990. Excess mortality rate: ~10%.' },
  { cat: 'dis', he: 'אזור ההדרה', en: 'Exclusion Zone', def_he: 'אזור 30 ק״מ מסביב לכור (מאוחר יותר 2,600 קמ״ר) שפינוי כפוי ואסור להיכנס אליו. עד היום פעיל.', def_en: '30 km zone around reactor (later 2,600 km²) with forced evacuation and entry prohibited. Still active today.' },
  { cat: 'dis', he: 'סרקופג (Object Shelter)', en: 'Sarcophagus', def_he: 'מבנה הבטון שהוקם על הריסות יחידה 4 ב-1986 כדי לעצור פליטת קרינה. תכנון לעמידות 30 שנה. הוסטה ב-2016 מתחת ל-NSC.', def_en: 'Concrete structure built over Unit 4 ruins in 1986 to stop radiation emission. Designed for 30-year lifespan. Replaced in 2016 by NSC.' },
  { cat: 'dis', he: 'סגירה חדשה (NSC)', en: 'New Safe Confinement', def_he: 'קונסטרוקציה מתכת ענקית (108 מ׳, 36,000 ט׳), הגדולה בעולם, שהוסטה ב-29/11/2016 על הסרקופג הישן. תכנון ל-100 שנה.', def_en: 'Massive metal structure (108m, 36,000 t), world\'s largest, slid over old sarcophagus on 29/11/2016. Designed for 100 years.' },
  { cat: 'dis', he: 'פינוי פריפיאט', en: 'Pripyat Evacuation', def_he: 'פינוי 49,000 תושבים תוך 3 שעות ב-27/4/1986 ב-1,200 אוטובוסים. ההודעה: "חזרו תוך 3 ימים". איש לא חזר.', def_en: 'Evacuation of 49,000 residents within 3 hours on 27/4/1986 in 1,200 buses. Announcement: "Return in 3 days". No one returned.' },
  { cat: 'dis', he: '"רגל הפיל"', en: '"Elephant\'s Foot"', def_he: 'מסת לבה רדיואקטיבית (חרבית — Corium) שזרמה ממה שנותר מהליבה למרתפים. ב-1986 קרינה של 8,000 R/h — מנה קטלנית תוך 5 דקות.', def_en: 'Mass of radioactive lava (corium) that flowed from core remnants to basements. In 1986 emitted 8,000 R/h — lethal dose within 5 minutes.' },
  { cat: 'dis', he: 'חרבית (Corium)', en: 'Corium', def_he: 'תערובת מותכת של דלק גרעיני, פלדה, גרפיט, ובטון, שנוצרה בעת הריסת הליבה. רעילה ורדיואקטיבית במשך אלפי שנים.', def_en: 'Molten mixture of nuclear fuel, steel, graphite, and concrete formed during core meltdown. Toxic and radioactive for thousands of years.' },

  // Firefighting / HazMat
  { cat: 'fire', he: 'מנ״פ (מערכת נשימה פתוחה)', en: 'SCBA (Self-Contained Breathing Apparatus)', def_he: 'מכל אוויר נישא על הגב המספק אוויר נקי לכבאי. בצ׳רנוביל ב-1986 לא היה זמין לכל הצוותים — רוב הכבאים פעלו ללא הגנה נשימתית.', def_en: 'Back-mounted air tank supplying clean air to firefighter. At Chernobyl 1986 not available to all crews — most firefighters operated without respiratory protection.' },
  { cat: 'fire', he: 'מב״ר (מרחק בידוד ראשוני)', en: 'Initial Isolation Distance', def_he: 'מרחק מינימלי שצריך לפנות סביב חומר מסוכן. בקרינה גרעינית: 100 מ׳ במבנה סגור / 200 מ׳ באוויר פתוח (ERG 2024).', def_en: 'Minimum distance to evacuate around hazmat. For nuclear radiation: 100m enclosed / 200m open air (ERG 2024).' },
  { cat: 'fire', he: 'ERG (מדריך התגובה לחירום)', en: 'ERG (Emergency Response Guide)', def_he: 'מדריך בינלאומי לטיפול בחומרים מסוכנים. מהדורת 2024 כוללת כללי טיפול לחומרים רדיואקטיביים.', def_en: 'International hazmat response guide. 2024 edition includes radioactive material handling protocols.' },
  { cat: 'fire', he: 'ספיחה (Adsorption)', en: 'Adsorption', def_he: 'הצמדה של מולקולות חומר לפני שטח של חומר אחר. לעומת בליעה (Absorption) שהיא חדירה. רלוונטי לטיהור קרינה.', def_en: 'Adhesion of substance molecules to another\'s surface. Vs. absorption which is penetration. Relevant for radiation decontamination.' },
  { cat: 'fire', he: 'טיהור (Decontamination)', en: 'Decontamination', def_he: 'הסרת חומר רדיואקטיבי מציוד, מבנים, או אנשים. שיטות: שטיפה במים מיוחדים, חיתוך וקבירת אדמה (5 ס״מ עליונים), הריסת בתים.', def_en: 'Removal of radioactive material from equipment, buildings, or people. Methods: special water washing, cutting and burying topsoil (5cm), demolishing houses.' },

  // Agencies
  { cat: 'org', he: 'IAEA — סוכנות האנרגיה האטומית', en: 'IAEA', def_he: 'סוכנות האנרגיה האטומית הבינלאומית. פרסמה את דוח INSAG-7 (1992) — הניתוח הסמכותי של אסון צ׳רנוביל.', def_en: 'International Atomic Energy Agency. Published INSAG-7 (1992) — authoritative analysis of Chernobyl disaster.' },
  { cat: 'org', he: 'INSAG-7', en: 'INSAG-7', def_he: 'דוח קבוצת הייעוץ הבינלאומית לבטיחות גרעינית, 1992. הניתוח הרשמי של אסון צ׳רנוביל. מאשים גם פגמי תכן של RBMK וגם טעויות מפעילים.', def_en: 'International Nuclear Safety Advisory Group report, 1992. Official analysis of Chernobyl disaster. Blames both RBMK design flaws and operator errors.' },
  { cat: 'org', he: 'UNSCEAR', en: 'UNSCEAR', def_he: 'הוועדה המדעית של האו״ם להשפעות הקרינה האטומית. דוח 2008 הוא הבסיס לסיכומי בריאות מאסון צ׳רנוביל.', def_en: 'UN Scientific Committee on the Effects of Atomic Radiation. 2008 report is foundation for Chernobyl health summaries.' },
  { cat: 'org', he: 'WHO — ארגון הבריאות העולמי', en: 'WHO', def_he: 'דוח 2006 של WHO ("Health Effects of the Chernobyl Accident") הוא המקור המרכזי להשלכות הבריאותיות לטווח ארוך.', def_en: 'WHO 2006 report ("Health Effects of the Chernobyl Accident") is primary source for long-term health consequences.' },
];

const CAT: Record<string, { c: string; he: string; en: string }> = {
  phys: { c: '#a855f7', he: 'פיזיקה גרעינית', en: 'Nuclear Physics' },
  reactor: { c: '#c8a44e', he: 'מערכות הכור', en: 'Reactor Systems' },
  rad: { c: '#22c55e', he: 'קרינה ובריאות', en: 'Radiation & Health' },
  dis: { c: '#dc2626', he: 'האסון', en: 'The Disaster' },
  fire: { c: '#f59e0b', he: 'כבאות וחומ״ס', en: 'Firefighting & HazMat' },
  org: { c: '#06b6d4', he: 'ארגונים', en: 'Organizations' },
};

export default function GlossaryPage() {
  const [lang, setLang] = useState<'he' | 'en'>('he');
  const [filter, setFilter] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const he = lang === 'he';
  const t = (h: string, e: string) => (he ? h : e);

  let filtered = TERMS;
  if (filter) filtered = filtered.filter((tm) => tm.cat === filter);
  if (search) {
    const s = search.toLowerCase();
    filtered = filtered.filter((tm) =>
      tm.he.toLowerCase().includes(s) ||
      tm.en.toLowerCase().includes(s) ||
      tm.def_he.toLowerCase().includes(s) ||
      tm.def_en.toLowerCase().includes(s)
    );
  }

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
            [ {he ? 'מילון מקצועי' : 'PROFESSIONAL GLOSSARY'} ]
          </div>
          <h1 style={{ fontSize: 'clamp(28px,5.5vw,46px)', fontWeight: 900, lineHeight: 1.1, fontFamily: "'Playfair Display',serif", marginBottom: 6, background: `linear-gradient(135deg,${C.gold},${C.gL})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {t('מילון מונחים', 'Glossary')}
          </h1>
          <h2 style={{ fontSize: 'clamp(13px,2.5vw,17px)', fontWeight: 400, color: 'rgba(232,213,160,0.85)', fontFamily: "'Playfair Display',serif", marginBottom: 8 }}>
            {TERMS.length} {t('מונחים מקצועיים בעברית/אנגלית', 'professional terms in Hebrew/English')}
          </h2>
          <div className="gr" style={{ margin: '0 auto' }} />
        </div>

        {/* Search */}
        <div style={{ marginBottom: 14 }}>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('🔍 חיפוש...', '🔍 Search...')}
            style={{ width: '100%', padding: '10px 14px', fontSize: 14, background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(200,164,78,0.25)', borderRadius: 8, color: '#fff', fontFamily: 'Heebo,sans-serif', outline: 'none' }}
          />
        </div>

        {/* Filter chips */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 18 }}>
          <button onClick={() => setFilter(null)} style={{ padding: '6px 12px', fontSize: 11, fontWeight: 700, background: filter === null ? `${C.gold}33` : 'rgba(0,0,0,0.3)', color: filter === null ? C.gold : 'rgba(255,255,255,0.6)', border: `1px solid ${filter === null ? C.gold : 'rgba(255,255,255,0.1)'}`, borderRadius: 6, cursor: 'pointer', fontFamily: 'monospace' }}>
            {t('הכל', 'All')} ({TERMS.length})
          </button>
          {Object.entries(CAT).map(([k, v]) => {
            const count = TERMS.filter((tm) => tm.cat === k).length;
            return (
              <button key={k} onClick={() => setFilter(filter === k ? null : k)} style={{ padding: '6px 12px', fontSize: 11, fontWeight: 700, background: filter === k ? `${v.c}33` : 'rgba(0,0,0,0.3)', color: filter === k ? v.c : 'rgba(255,255,255,0.6)', border: `1px solid ${filter === k ? v.c : 'rgba(255,255,255,0.1)'}`, borderRadius: 6, cursor: 'pointer', fontFamily: 'monospace' }}>
                {t(v.he, v.en)} ({count})
              </button>
            );
          })}
        </div>

        {/* Terms grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: 12, marginBottom: 20 }}>
          {filtered.map((tm, i) => {
            const cat = CAT[tm.cat];
            return (
              <div key={i} className="hover-lift fade-in" style={{ background: 'rgba(0,0,0,0.5)', border: `1px solid ${cat.c}44`, borderRadius: 12, padding: '14px 16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8, gap: 8 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 800, color: '#fff', fontFamily: "'Playfair Display',serif", lineHeight: 1.3, flex: 1 }}>
                    {t(tm.he, tm.en)}
                  </h3>
                  <span style={{ fontSize: 8, color: cat.c, fontFamily: 'monospace', letterSpacing: '0.1em', background: `${cat.c}15`, padding: '2px 6px', borderRadius: 4, border: `1px solid ${cat.c}33`, whiteSpace: 'nowrap' }}>
                    {t(cat.he, cat.en)}
                  </span>
                </div>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.85)', lineHeight: 1.7 }}>
                  {t(tm.def_he, tm.def_en)}
                </p>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: 30, color: 'rgba(255,255,255,0.5)' }}>
            🔍 {t('לא נמצאו תוצאות', 'No results found')}
          </div>
        )}
      </div>
    </div>
  );
}
