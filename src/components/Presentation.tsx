'use client';
import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { C } from '@/lib/data';

const SLIDES = Array.from({ length: 8 }, (_, i) => `/images/slide-${i + 1}.jpg`);

export default function Presentation({ he, t }: { he: boolean; t: (h: string, e: string) => string }) {
  const [open, setOpen] = useState<number | null>(null);

  const close = useCallback(() => setOpen(null), []);
  const next = useCallback(() => setOpen((i) => (i === null ? null : (i + 1) % SLIDES.length)), []);
  const prev = useCallback(() => setOpen((i) => (i === null ? null : (i - 1 + SLIDES.length) % SLIDES.length)), []);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowRight') (he ? prev : next)();
      else if (e.key === 'ArrowLeft') (he ? next : prev)();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [open, he, next, prev, close]);

  return (
    <section id="presentation" style={{ padding: '60px 16px 30px', position: 'relative' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 28, position: 'relative' }}>
          <div className="section-number" style={{ top: '-20px', insetInlineEnd: '5%' }}>10</div>
          <div className="section-kicker">[ {t('סעיף תשיעי · מצגת', 'PART NINE · PRESENTATION')} ]</div>
          <h2 className="section-title">{t('המצגת המקצועית', 'Professional Presentation')}</h2>
          <p className="section-subtitle">{t('8 שקפים — מצגת ההדרכה של רועי צוקרמן', '8 slides — Roie Zukerman\'s training deck')}</p>
          <div className="gr" style={{ margin: '0 auto' }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
          {SLIDES.map((src, i) => (
            <button key={i} onClick={() => setOpen(i)} className="hover-lift fade-in" style={{
              padding: 0, border: `1px solid ${C.gold}55`, borderRadius: 10, overflow: 'hidden',
              background: 'rgba(0,0,0,0.4)', cursor: 'pointer', position: 'relative',
              animationDelay: `${i * 0.06}s`, aspectRatio: '16/9',
            }}>
              <Image src={src} alt={`Slide ${i + 1}`} fill style={{ objectFit: 'cover' }} sizes="(max-width: 768px) 100vw, 33vw" />
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                padding: '20px 12px 8px',
                background: 'linear-gradient(0deg, rgba(0,0,0,0.85), transparent)',
                color: '#fff', fontSize: 11,
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 700, letterSpacing: '0.1em',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <span style={{ color: C.gold }}>SLIDE {i + 1}</span>
                <span style={{ fontSize: 14 }}>🔍</span>
              </div>
            </button>
          ))}
        </div>

        {/* Lightbox */}
        {open !== null && (
          <div onClick={close} style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.96)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 200, padding: 20, animation: 'fadeIn 0.25s',
          }}>
            <button onClick={(e) => { e.stopPropagation(); close(); }} style={{
              position: 'absolute', top: 16, [he ? 'left' : 'right']: 16,
              background: 'rgba(255,255,255,0.1)', border: `1px solid ${C.gold}`,
              color: C.gold, width: 40, height: 40, borderRadius: '50%',
              fontSize: 18, cursor: 'pointer', zIndex: 10,
            }}>✕</button>

            <button onClick={(e) => { e.stopPropagation(); prev(); }} style={{
              position: 'absolute', [he ? 'right' : 'left']: 16, top: '50%', transform: 'translateY(-50%)',
              background: 'rgba(0,0,0,0.7)', border: `1px solid ${C.gold}55`,
              color: C.gold, width: 50, height: 50, borderRadius: '50%',
              fontSize: 22, cursor: 'pointer', zIndex: 10,
            }}>{he ? '→' : '←'}</button>

            <button onClick={(e) => { e.stopPropagation(); next(); }} style={{
              position: 'absolute', [he ? 'left' : 'right']: 16, top: '50%', transform: 'translateY(-50%)',
              background: 'rgba(0,0,0,0.7)', border: `1px solid ${C.gold}55`,
              color: C.gold, width: 50, height: 50, borderRadius: '50%',
              fontSize: 22, cursor: 'pointer', zIndex: 10,
            }}>{he ? '←' : '→'}</button>

            <div onClick={(e) => e.stopPropagation()} style={{ position: 'relative', maxWidth: '92vw', maxHeight: '88vh', width: '100%', aspectRatio: '16/9' }}>
              <Image src={SLIDES[open]} alt={`Slide ${open + 1}`} fill style={{ objectFit: 'contain' }} priority />
            </div>

            <div style={{ position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)', color: C.gold, fontFamily: "'JetBrains Mono', monospace", fontSize: 12 }}>
              {open + 1} / {SLIDES.length}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
