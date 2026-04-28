'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { C, SECTIONS } from '@/lib/data';
import { getSoundscape } from '@/lib/soundscape';

export default function Nav({ he, setHe, t }: { he: boolean; setHe: (v: boolean) => void; t: (h: string, e: string) => string }) {
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState('hero');
  const [soundOn, setSoundOn] = useState(false);

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
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
          <a
            href="https://chat.whatsapp.com/K4NzcZucmimKYFOXE3VVtD?mode=gi_t"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t('הצטרף לקבוצת 60 שניות חומ״ס בוואטסאפ', 'Join 60 Seconds HazMat WhatsApp group')}
            title={t('לחץ להצטרפות לקבוצת 60 שניות חומ״ס', 'Click to join 60 Seconds HazMat group')}
            style={{ display: 'inline-flex', textDecoration: 'none', flexShrink: 0 }}
          >
            <div className="logo-orb" style={{
              width: 38, height: 38, position: 'relative',
              transition: 'transform 0.3s, box-shadow 0.3s',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.08)'; e.currentTarget.style.boxShadow = `0 0 16px ${C.gold}88`; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none'; }}>
              <Image src="/images/logo-60sec.png" alt="60 שניות" width={38} height={38} style={{ borderRadius: '50%' }} />
            </div>
          </a>
          <a href="#hero" style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15, minWidth: 0, textDecoration: 'none' }}>
            <span style={{ fontSize: 16, fontWeight: 800, color: C.gold, fontFamily: "'Playfair Display', serif", whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {t('60 שניות חומ״ס', '60 Sec HazMat')}
            </span>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', fontFamily: "'JetBrains Mono', monospace", whiteSpace: 'nowrap', letterSpacing: '0.1em' }}>
              CHERNOBYL · 1986
            </span>
          </a>
        </div>

        <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexShrink: 0 }}>
          {/* Sound toggle */}
          <button onClick={toggleSound} aria-label={t('הפעל סאונד', 'Toggle sound')} title={t('סאונד אסון', 'Disaster soundscape')} style={{
            width: 32, height: 32, borderRadius: 6,
            background: soundOn ? `${C.danger}33` : `${C.gold}15`,
            border: `1px solid ${soundOn ? C.danger : `${C.gold}55`}`,
            color: soundOn ? C.danger : C.gold,
            fontSize: 17, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.25s',
            animation: soundOn ? 'pulseAlert 2s infinite' : 'none',
          }}>
            {soundOn ? '🔊' : '🔈'}
          </button>

          {/* Lang toggle */}
          <button onClick={() => setHe(!he)} style={{
            padding: '5px 10px', fontSize: 13, fontWeight: 700,
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
