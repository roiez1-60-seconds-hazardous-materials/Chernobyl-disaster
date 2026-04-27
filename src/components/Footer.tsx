'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { C } from '@/lib/data';

export default function Footer({ he, t }: { he: boolean; t: (h: string, e: string) => string }) {
  const [visits, setVisits] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    // Increment-once-per-session pattern
    const sessionKey = 'chernobyl-visit-counted';
    const alreadyCounted = typeof window !== 'undefined' && window.sessionStorage.getItem(sessionKey);
    const url = alreadyCounted ? '/api/visits' : '/api/visits?inc=1';

    fetch(url, { cache: 'no-store' })
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        if (typeof data.count === 'number') {
          setVisits(data.count);
          if (!alreadyCounted && typeof window !== 'undefined') {
            window.sessionStorage.setItem(sessionKey, '1');
          }
        }
        setLoading(false);
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  return (
    <footer style={{ padding: '40px 16px 30px', borderTop: `1px solid ${C.gold}33`, marginTop: 30, background: 'linear-gradient(180deg, transparent, rgba(0,0,0,0.6))' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto', textAlign: 'center' }}>
        <div className="logo-orb" style={{ width: 70, height: 70, margin: '0 auto 14px', position: 'relative' }}>
          <Image src="/images/logo-60sec.png" alt="60 שניות חומ״ס" width={70} height={70} style={{ borderRadius: '50%' }} />
        </div>

        <div style={{ fontSize: 15, fontWeight: 800, color: C.gold, fontFamily: "'Playfair Display', serif", marginBottom: 6 }}>
          {t('רועי צוקרמן', 'Roie Zukerman')}
        </div>
        <div style={{ fontSize: 11, color: C.gL, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em', marginBottom: 18 }}>
          {t('מומחה לחומ״ס וטב״ק', 'HazMat & CBRN Expert')}
        </div>

        {/* Visit counter */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 10,
          padding: '10px 18px',
          background: 'rgba(0,0,0,0.55)',
          border: `1px solid ${C.gold}55`,
          borderRadius: 24,
          marginBottom: 18,
          fontFamily: "'JetBrains Mono', monospace",
          boxShadow: `0 0 14px ${C.gold}22`,
        }}>
          <span style={{ fontSize: 16 }}>👁</span>
          <span style={{ fontSize: 10, color: C.gL, letterSpacing: '0.15em' }}>
            {t('צפיות באפליקציה', 'APP VIEWS')}
          </span>
          <span style={{
            fontSize: 14, fontWeight: 800,
            color: C.gold,
            fontFamily: "'Playfair Display', serif",
            minWidth: 24,
            textAlign: 'center',
          }}>
            {loading ? '···' : visits !== null ? visits.toLocaleString() : '—'}
          </span>
        </div>

        <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${C.gold}55, transparent)`, margin: '6px auto 14px', maxWidth: 280 }} />

        <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.65)', lineHeight: 1.85, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.05em', maxWidth: 600, margin: '0 auto' }}>
          כל הזכויות שמורות. מבוסס על מקורות פתוחים בלבד. למטרות מקצועיות והדרכתיות. אין להשתמש ללא אישור בכתב.
        </p>

        <div style={{ marginTop: 16, fontSize: 10, color: 'rgba(255,255,255,0.5)', fontFamily: "'JetBrains Mono', monospace" }}>
          © {new Date().getFullYear()} · {t('60 שניות חומ״ס', '60 Seconds HazMat')} · v2.2
        </div>
      </div>
    </footer>
  );
}
