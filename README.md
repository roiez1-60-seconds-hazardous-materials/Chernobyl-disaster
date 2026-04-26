# 60 Seconds HazMat — Chernobyl Disaster Dossier

תיק מודיעין מקיף על אסון צ׳רנוביל (26 באפריל 1986) — רועי צוקרמן

## מודולים

- `/` — דף הבית (hub launcher)
- `/reactor` — סימולטור RBMK-1000 (10 שלבי אסון, 12 רכיבים אינטראקטיביים, מצב פשוט/מקצועי)
- `/timeline` — ציר זמן 1971-2026 (18 אירועים)
- `/radiation-map` — מפת Mapbox עם פיזור הקרינה (10 ימים, 8 נקודות מפתח)
- `/liquidators` — סיפור 600,000 הליקווידטורים (9 חלקים)
- `/glossary` — מילון 47 מונחים מקצועיים
- `/sources` — 25+ מקורות + מצגת + אינפוגרפיקה משובצים

## הקמה ב-Vercel

### 1. ייבוא הריפו

```bash
gh repo create roiez1-60-seconds-hazardous-materials/chernobyl-disaster --public
git init
git add .
git commit -m "Initial commit: Chernobyl disaster dossier"
git remote add origin https://github.com/roiez1-60-seconds-hazardous-materials/chernobyl-disaster.git
git branch -M main
git push -u origin main
```

### 2. הגדרת Vercel

חבר את הריפו ל-Vercel כפרויקט חדש. Vercel יזהה אוטומטית Next.js.

### 3. ⚠️ הגדרת Mapbox Token

לפני deploy, הוסף ב-Vercel → Project → Settings → Environment Variables:

```
NEXT_PUBLIC_MAPBOX_TOKEN = pk.eyJ1...
```

(צור token חדש ב-https://mapbox.com/account/access-tokens — אל תשתמש בטוקן ישן)

### 4. Deploy

לחץ **Deploy**. הראשון יקח ~3 דקות.

URL המוצע: `chernobyl-disaster.vercel.app`

## מבנה הקוד

```
chernobyl-disaster/
├── public/
│   ├── chernobyl-presentation.pdf       # מצגת 8 שקפים
│   └── images/infographic-anatomy.png   # אינפוגרפיקה (NotebookLM)
├── src/app/
│   ├── layout.tsx          # Root layout + fonts + Mapbox CSS
│   ├── globals.css         # Design system (gold #c8a44e, animations)
│   ├── page.tsx            # Hub launcher
│   ├── reactor/page.tsx    # RBMK simulator (~1200 lines)
│   ├── timeline/page.tsx   # 18-event timeline
│   ├── radiation-map/      # Mapbox interactive map
│   ├── liquidators/        # 9 sections
│   ├── glossary/           # 47 terms with search
│   └── sources/            # References + embedded PDF/PNG
├── package.json
├── next.config.js
└── tsconfig.json
```

## עיצוב

זהה לאפליקציית הטילים (`iran-missile-propellants.vercel.app`):
- צבעים: `#0a0e1a → #162040 → #1a365d` (רקע), `#c8a44e` (זהב), `#e8d5a0` (זהב בהיר)
- פונטים: Playfair Display (כותרות), Heebo (טקסט), JetBrains Mono (מונוספייס)
- אנימציות: gradient backgrounds, particle drift, glow pulse, fuel pulse, steam rise
- RTL מלא + EN/HE toggle בכל עמוד
- אסטטיקה: military-magazine cinematic dark theme

## מקורות

- IAEA INSAG-7 (1992)
- UNSCEAR 2008 Report
- WHO 2006 Health Report
- NRC NUREG-1250
- Higginbotham — "Midnight in Chernobyl" (2019)
- Plokhy — "Chernobyl: History" (2018)

## רישיון

© 2026 רועי צוקרמן — 60 שניות חומ״ס

כל הזכויות שמורות. מבוסס על מקורות פתוחים בלבד. למטרות מקצועיות והדרכתיות. אין להשתמש ללא אישור בכתב.
