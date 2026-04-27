'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { C, SECTIONS } from '@/lib/data';
import { getSoundscape } from '@/lib/soundscape';

export default function Nav({ he, setHe, t }: { he: boolean; setHe: (v: boolean) => void; t: (h: string, e: string) => string }) {
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState('hero');
  const [soundOn, setSoundOn] = useState(false);
  const [visits, setVisits] = useState<number | null>(null);

  // Scroll progress + active section
  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? window.scrollY / max : 0);

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

  // Visit counter — increment once per session
  useEffect(() => {
    const KEY = 'chernobyl_visit_counted';
    const counted = sessionStorage.getItem(KEY);
    const url = counted ? '/api/visits' : '/api/visits?inc=1';
    fetch(url)
      .then((r) => r.json())
      .then((d) => {
        if (typeof d?.count === 'number') {
          setVisits(d.count);
          if (!counted) sessionStorage.setItem(KEY, '1');
        }
      })
      .catch(() => {});
  }, []);

  // Sound toggle
  const toggleSound = async () => {
    const sc = getSoundscape();
    if (soundOn) {
      sc.stop();
      setSoundOn(false);
    } else {
      await sc.start();
      setSoundOn(true);
    }
  };

  // Stop sound on unmount
  useEffect(() => {
    return () => {
      const sc = getSoundscape();
      if (sc.running) sc.stop();
    };
  }, []);

  return (
    <>
      {/* Scroll progress bar */}
      <div className="scroll-progress" style={{ transform: `scaleX(${progress})` }} />

      {/* Top bar */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0,
        zIndex: 60, padding: '8px 12px',
        background: 'rgba(10,14,26,0.88)',
        backdropFilter: 'blur(14px)',
        borderBottom: `1px solid ${C.gold}22`,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        gap: 8,
      }}>
        <a href="#hero" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', minWidth: 0 }}>
          <div className="logo-orb" style={{ width: 32, height: 32, position: 'relative', flexShrink: 0 }}>
            <Image src="/images/logo-60sec.png" alt="60 שניות" width={32} height={32} style={{ borderRadius: '50%' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1, minWidth: 0 }}>
            <span style={{ fontSize: 10, fontWeight: 800, color: C.gold, fontFamily: "'Playfair Display', serif", whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {t('60 שניות חומ״ס', '60 Sec HazMat')}
            </span>
            <span style={{ fontSize: 8, color: 'rgba(255,255,255,0.55)', fontFamily: "'JetBrains Mono', monospace", whiteSpace: 'nowrap' }}>
              CHERNOBYL · 1986
            </span>
          </div>
        </a>

        <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexShrink: 0 }}>
          {/* Visit counter */}
          {visits !== null && (
            <div title={t('כניסות לאתר', 'Site visits')} style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              padding: '5px 8px',
              background: 'rgba(0,0,0,0.45)',
              border: `1px solid ${C.gold}33`,
              borderRadius: 6,
              fontSize: 10, color: C.gL,
              fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
            }}>
              <span style={{ fontSize: 10 }}>👁</span>
              <span style={{ color: '#fff' }}>{visits.toLocaleString()}</span>
            </div>
          )}

          {/* Sound toggle */}
          <button onClick={toggleSound} aria-label={t('הפעל סאונד', 'Toggle sound')} title={t('סאונד אסון', 'Disaster soundscape')} style={{
            width: 32, height: 32, borderRadius: 6,
            background: soundOn ? `${C.danger}33` : `${C.gold}15`,
            border: `1px solid ${soundOn ? C.danger : `${C.gold}55`}`,
            color: soundOn ? C.danger : C.gold,
            fontSize: 14, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.25s',
            animation: soundOn ? 'pulseAlert 2s infinite' : 'none',
          }}>
            {soundOn ? '🔊' : '🔈'}
          </button>

          {/* Lang toggle */}
          <button onClick={() => setHe(!he)} style={{
            padding: '5px 10px', fontSize: 10, fontWeight: 700,
            background: `${C.gold}25`, border: `1px solid ${C.gold}55`,
            color: C.gold, borderRadius: 6, cursor: 'pointer',
            fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.05em',
            height: 32,
          }}>
            {he ? 'EN' : 'עב'}
          </button>
        </div>
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
