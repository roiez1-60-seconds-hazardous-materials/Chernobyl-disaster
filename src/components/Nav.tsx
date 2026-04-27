'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { C, SECTIONS } from '@/lib/data';

export default function Nav({ he, setHe, t }: { he: boolean; setHe: (v: boolean) => void; t: (h: string, e: string) => string }) {
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState('hero');

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? window.scrollY / max : 0);

      // Active section detection
      let cur = 'hero';
      for (const s of SECTIONS) {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top < 200) cur = s.id;
      }
      setActive(cur);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      {/* Scroll progress bar */}
      <div className="scroll-progress" style={{ transform: `scaleX(${progress})` }} />

      {/* Top bar */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0,
        zIndex: 60, padding: '10px 16px',
        background: 'rgba(10,14,26,0.85)',
        backdropFilter: 'blur(14px)',
        borderBottom: `1px solid ${C.gold}22`,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <a href="#hero" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div className="logo-orb" style={{ width: 36, height: 36, position: 'relative' }}>
            <Image src="/images/logo-60sec.png" alt="60 שניות" width={36} height={36} style={{ borderRadius: '50%' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
            <span style={{ fontSize: 11, fontWeight: 800, color: C.gold, fontFamily: "'Playfair Display', serif" }}>
              {t('60 שניות חומ״ס', '60 Sec HazMat')}
            </span>
            <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.55)', fontFamily: "'JetBrains Mono', monospace" }}>
              CHERNOBYL · 1986
            </span>
          </div>
        </a>

        <button onClick={() => setHe(!he)} style={{
          padding: '6px 12px', fontSize: 11, fontWeight: 700,
          background: `${C.gold}25`, border: `1px solid ${C.gold}55`,
          color: C.gold, borderRadius: 6, cursor: 'pointer',
          fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.05em',
        }}>
          {he ? 'EN' : 'עב'}
        </button>
      </div>

      {/* Side TOC */}
      <nav className="toc-pill" style={{ [he ? 'right' : 'left']: 14 } as any}>
        {SECTIONS.map((s) => (
          <a key={s.id} href={`#${s.id}`} className={`toc-dot ${active === s.id ? 'active' : ''}`}
             data-label={`${s.emoji} ${t(s.he, s.en)}`}
             style={{ display: 'block' }}
             aria-label={t(s.he, s.en)} />
        ))}
      </nav>
    </>
  );
}
