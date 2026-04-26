'use client';
import { useState, useEffect } from 'react';
import { C, SECTIONS } from '@/lib/data';
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
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState('hero');
  const [showTop, setShowTop] = useState(false);

  const t = (heText: string, enText: string) => he ? heText : enText;

  // Update lang attribute on html element
  useEffect(() => {
    document.documentElement.lang = he ? 'he' : 'en';
    document.documentElement.dir = he ? 'rtl' : 'ltr';
  }, [he]);

  // Scroll progress + back-to-top
  useEffect(() => {
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const cur = window.scrollY;
      setProgress(total > 0 ? cur / total : 0);
      setShowTop(cur > 600);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Active section via IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: '-40% 0px -50% 0px', threshold: 0 }
    );
    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <main className="mh" dir={he ? 'rtl' : 'ltr'}>
      {/* Scroll progress */}
      <div className="scroll-progress" style={{ transform: `scaleX(${progress})` }} />

      {/* Lang toggle (top-right fixed) */}
      <button
        onClick={() => setHe((v) => !v)}
        style={{
          position: 'fixed',
          top: 14,
          [he ? 'left' : 'right']: 14,
          zIndex: 60,
          padding: '8px 14px',
          background: 'rgba(0,0,0,0.75)',
          backdropFilter: 'blur(10px)',
          border: `1px solid ${C.gold}66`,
          borderRadius: 24,
          color: C.gold,
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: '0.15em',
          cursor: 'pointer',
          transition: 'all 0.25s',
          boxShadow: '0 4px 14px rgba(0,0,0,0.4)',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = `${C.gold}22`; e.currentTarget.style.color = '#fff'; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.75)'; e.currentTarget.style.color = C.gold; }}
      >
        {he ? 'EN ⇄' : '⇄ עב'}
      </button>

      {/* TOC pill (right side) */}
      <nav className="toc-pill" style={{ [he ? 'left' : 'right']: 14 } as any}>
        {SECTIONS.map((s) => (
          <button
            key={s.id}
            onClick={() => {
              const el = document.getElementById(s.id);
              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
            className={`toc-dot ${active === s.id ? 'active' : ''}`}
            data-label={t(s.he, s.en)}
            aria-label={t(s.he, s.en)}
          />
        ))}
      </nav>

      {/* Back to top */}
      {showTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          style={{
            position: 'fixed',
            bottom: 22,
            [he ? 'left' : 'right']: 14,
            zIndex: 60,
            width: 46, height: 46,
            background: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(8px)',
            border: `1px solid ${C.gold}66`,
            borderRadius: '50%',
            color: C.gold,
            fontSize: 18,
            cursor: 'pointer',
            transition: 'all 0.25s',
            boxShadow: '0 6px 18px rgba(0,0,0,0.4)',
            animation: 'fadeIn 0.4s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = `${C.gold}33`; e.currentTarget.style.transform = 'translateY(-2px)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.85)'; e.currentTarget.style.transform = 'translateY(0)'; }}
          aria-label={t('חזור למעלה', 'Back to top')}
        >
          ↑
        </button>
      )}

      {/* All sections */}
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
