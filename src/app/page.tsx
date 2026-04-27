'use client';
import { useState, useEffect } from 'react';
import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import Timeline from '@/components/Timeline';
import NuclearReactor from '@/components/NuclearReactor';
import RBMK from '@/components/RBMK';
import Response from '@/components/Response';
import Casualties from '@/components/Casualties';
import Radiation from '@/components/Radiation';
import Glossary from '@/components/Glossary';
import Sources from '@/components/Sources';
import Presentation from '@/components/Presentation';
import Infographic from '@/components/Infographic';
import Footer from '@/components/Footer';

export default function Page() {
  const [he, setHe] = useState(true);
  const t = (heStr: string, enStr: string) => (he ? heStr : enStr);

  useEffect(() => {
    document.documentElement.lang = he ? 'he' : 'en';
    document.documentElement.dir = he ? 'rtl' : 'ltr';
  }, [he]);

  return (
    <main className="mh">
      <Nav he={he} setHe={setHe} t={t} />
      <Hero he={he} t={t} />
      <Timeline he={he} t={t} />
      <NuclearReactor he={he} t={t} />
      <RBMK he={he} t={t} />
      <Response he={he} t={t} />
      <Casualties he={he} t={t} />
      <Radiation he={he} t={t} />
      <Glossary he={he} t={t} />
      <Sources he={he} t={t} />
      <Presentation he={he} t={t} />
      <Infographic he={he} t={t} />
      <Footer he={he} t={t} />
    </main>
  );
}
