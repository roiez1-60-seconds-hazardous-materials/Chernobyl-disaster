'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { C } from '@/lib/data';

export default function LoadingScreen({ he, onComplete }: { he: boolean; onComplete: () => void }) {
  const [phase, setPhase] = useState<'logo' | 'countdown' | 'fade'>('logo');
  const [time, setTime] = useState('01:23:00');

  useEffect(() => {
    // Phase 1: logo emerges
    const t1 = setTimeout(() => setPhase('countdown'), 1100);

    // Phase 2: countdown ticks up
    const t2 = setTimeout(() => {
      const targets = ['01:23:10', '01:23:20', '01:23:30', '01:23:40', '01:23:43', '01:23:45', '01:23:47'];
      let i = 0;
      const interval = setInterval(() => {
        if (i < targets.length) {
          setTime(targets[i]);
          i++;
        } else {
          clearInterval(interval);
          setPhase('fade');
          setTimeout(onComplete, 700);
        }
      }, 280);
    }, 1300);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [onComplete]);

  const isExploded = time === '01:23:47';
  const isAlmost = time === '01:23:43' || time === '01:23:45';

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: '#06080d',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexDirection: 'column',
      transition: 'opacity 0.7s ease-out',
      opacity: phase === 'fade' ? 0 : 1,
      pointerEvents: phase === 'fade' ? 'none' : 'auto',
      overflow: 'hidden',
    }}>
      {/* Atomic rings background */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg viewBox="0 0 600 600" style={{ width: 'min(80vw, 600px)', height: 'min(80vw, 600px)', opacity: 0.18 }}>
          <ellipse cx="300" cy="300" rx="240" ry="80" fill="none" stroke={C.gold} strokeWidth="1.5" style={{ animation: 'spin 14s linear infinite', transformOrigin: '300px 300px' }} />
          <ellipse cx="300" cy="300" rx="240" ry="80" fill="none" stroke={C.gold} strokeWidth="1.5" transform="rotate(60 300 300)" style={{ animation: 'spin 11s linear infinite reverse', transformOrigin: '300px 300px' }} />
          <ellipse cx="300" cy="300" rx="240" ry="80" fill="none" stroke={C.gold} strokeWidth="1.5" transform="rotate(120 300 300)" style={{ animation: 'spin 17s linear infinite', transformOrigin: '300px 300px' }} />
        </svg>
      </div>

      {/* Logo */}
      <div style={{
        position: 'relative',
        width: 110, height: 110,
        marginBottom: 30,
        animation: 'logoEmerge 1s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        filter: `drop-shadow(0 0 36px ${isExploded ? C.danger : C.gold}88)`,
        transition: 'filter 0.5s',
      }}>
        <Image src="/images/logo-60sec.png" alt="60 שניות חומ״ס" fill style={{ borderRadius: '50%', objectFit: 'contain' }} priority />
      </div>

      {/* Countdown timer */}
      <div style={{
        opacity: phase === 'logo' ? 0 : 1,
        transform: phase === 'logo' ? 'translateY(20px)' : 'translateY(0)',
        transition: 'all 0.5s ease-out',
        textAlign: 'center',
      }}>
        <div style={{
          fontSize: 11,
          letterSpacing: '0.4em',
          color: isExploded ? C.danger : C.gold,
          fontFamily: "'JetBrains Mono', monospace",
          fontWeight: 700,
          marginBottom: 14,
          opacity: 0.85,
          transition: 'color 0.3s',
        }}>
          {he ? '26 · 04 · 1986' : 'APRIL 26, 1986'}
        </div>

        <div style={{
          fontSize: 'clamp(36px, 9vw, 64px)',
          fontFamily: "'Playfair Display', serif",
          fontWeight: 900,
          color: isExploded ? '#ffffff' : C.gold,
          textShadow: isExploded
            ? `0 0 60px ${C.danger}, 0 0 30px ${C.danger}`
            : `0 0 24px ${C.gold}66`,
          letterSpacing: '0.05em',
          fontVariantNumeric: 'tabular-nums',
          transition: 'color 0.2s, text-shadow 0.2s',
          animation: isExploded ? 'shake 0.3s infinite' : isAlmost ? 'pulseAlert 0.4s infinite' : 'none',
        }}>
          {time}
        </div>

        <div style={{
          marginTop: 18,
          fontSize: 11,
          letterSpacing: '0.2em',
          color: isExploded ? C.danger : 'rgba(232,213,160,0.55)',
          fontFamily: "'JetBrains Mono', monospace",
          fontWeight: isExploded ? 800 : 400,
          transition: 'all 0.3s',
        }}>
          {isExploded
            ? (he ? '⚠ הפיצוץ ⚠' : '⚠ EXPLOSION ⚠')
            : (he ? 'תיק מודיעין מקצועי טוען...' : 'INTELLIGENCE BRIEF LOADING...')}
        </div>
      </div>

      {/* Explosion flash */}
      {isExploded && (
        <div style={{
          position: 'absolute', inset: 0,
          background: `radial-gradient(circle at center, ${C.danger}40 0%, transparent 60%)`,
          animation: 'flashExplode 0.7s ease-out',
          pointerEvents: 'none',
        }} />
      )}

      <style jsx>{`
        @keyframes logoEmerge {
          0% { transform: scale(0.4); opacity: 0; }
          60% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes flashExplode {
          0% { opacity: 0; }
          30% { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
