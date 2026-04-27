'use client';
import { useState, useEffect } from 'react';
import Nav from '@/components/Nav';
import LoadingScreen from '@/components/LoadingScreen';
import Hero from '@/components/Hero';
import Timeline from '@/components/Timeline';
import NuclearReactor from '@/components/NuclearReactor';
import RBMK from '@/components/RBMK';
import FirstResponders from '@/components/FirstResponders';
import Response from '@/components/Response';
import Casualties from '@/components/Casualties';
import Radiation from '@/components/Radiation';
import Glossary from '@/components/Glossary';
import Sources from '@/components/Sources';
import Presentation from '@/components/Presentation';
import Infographic from '@/components/Infographic';
import Footer from '@/components/Footer';
import SectionDivider from '@/components/SectionDivider';

export default function Page() {
  const [he, setHe] = useState(true);
  const [loading, setLoading] = useState(true);
  const t = (heStr: string, enStr: string) => (he ? heStr : enStr);

  useEffect(() => {
    document.documentElement.lang = he ? 'he' : 'en';
    document.documentElement.dir = he ? 'rtl' : 'ltr';
  }, [he]);

  // Lock body scroll during loading
  useEffect(() => {
    if (loading) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [loading]);

  return (
    <>
      {loading && <LoadingScreen he={he} onComplete={() => setLoading(false)} />}
      <main className="mh">
        <Nav he={he} setHe={setHe} t={t} />
        <Hero he={he} t={t} />

        <SectionDivider
          variant="symbol"
          symbol="📅"
          symbolLabel_he="ציר הזמן"
          symbolLabel_en="THE TIMELINE"
          he={he} t={t}
        />
        <Timeline he={he} t={t} />

        <SectionDivider
          variant="quote"
          quote_he="הם בנו פצצה גרעינית. ועיצבו אותה כמתקן ייצור חשמל."
          quote_en="They built a nuclear bomb. And called it a power plant."
          by_he="ניתוח INSAG-7"
          by_en="INSAG-7 Analysis"
          he={he} t={t}
        />
        <NuclearReactor he={he} t={t} />

        <SectionDivider
          variant="number"
          number="1.5s"
          quote_he="שנייה וחצי. זה כל מה שצריך לכור עם פגם תכן להפוך את עצמו לפצצה."
          quote_en="One and a half seconds. That's all it takes for a flawed reactor to turn itself into a bomb."
          he={he} t={t}
        />
        <RBMK he={he} t={t} />

        <SectionDivider
          variant="symbol"
          symbol="🕯"
          symbolLabel_he="לזכרם"
          symbolLabel_en="IN MEMORIAM"
          quote_he="הם נכנסו אל החושך כדי שאחרים יוכלו לחיות באור."
          quote_en="They walked into the dark so others could live in light."
          he={he} t={t}
        />
        <FirstResponders he={he} t={t} />

        <SectionDivider
          variant="number"
          number="600,000"
          quote_he="שש מאות אלף בני אדם — מהנדסים, חיילים, רופאים, פועלים — נשלחו להחזיק את האסון."
          quote_en="Six hundred thousand people — engineers, soldiers, doctors, workers — sent to contain the disaster."
          he={he} t={t}
        />
        <Response he={he} t={t} />

        <SectionDivider
          variant="symbol"
          symbol="🩺"
          symbolLabel_he="המחיר האנושי"
          symbolLabel_en="THE HUMAN COST"
          he={he} t={t}
        />
        <Casualties he={he} t={t} />

        <SectionDivider
          variant="quote"
          quote_he="הענן לא הכיר בגבולות. בתוך 36 שעות הוא הגיע לשבדיה. תוך 10 ימים — לאלסקה."
          quote_en="The cloud knew no borders. In 36 hours it reached Sweden. In 10 days — Alaska."
          by_he="WMO Trajectory Analysis"
          by_en="WMO Trajectory Analysis"
          he={he} t={t}
        />
        <Radiation he={he} t={t} />

        <SectionDivider
          variant="symbol"
          symbol="📖"
          symbolLabel_he="ידע מקצועי"
          symbolLabel_en="PROFESSIONAL KNOWLEDGE"
          he={he} t={t}
        />
        <Glossary he={he} t={t} />

        <Sources he={he} t={t} />

        <SectionDivider
          variant="symbol"
          symbol="🎯"
          symbolLabel_he="חומרי הדרכה"
          symbolLabel_en="TRAINING MATERIALS"
          he={he} t={t}
        />
        <Presentation he={he} t={t} />

        <Infographic he={he} t={t} />

        <Footer he={he} t={t} />
      </main>
    </>
  );
}
