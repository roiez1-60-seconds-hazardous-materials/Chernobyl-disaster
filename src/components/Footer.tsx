'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { C } from '@/lib/data';

const WHATSAPP_GROUP = 'https://chat.whatsapp.com/K4NzcZucmimKYFOXE3VVtD?mode=gi_t';
const APP_URL = 'https://chernobyl-disaster.vercel.app';

export default function Footer({ he, t }: { he: boolean; t: (h: string, e: string) => string }) {
  const [visits, setVisits] = useState<number | null>(null);
  const [status, setStatus] = useState<'loading' | 'ok' | 'err'>('loading');
  const [copied, setCopied] = useState(false);

  // Single source of truth for visit counting
  useEffect(() => {
    let cancelled = false;
    const sessionKey = 'chernobyl-visit-counted';
    const alreadyCounted = typeof window !== 'undefined' && window.sessionStorage.getItem(sessionKey);

    const fetchVisits = async (attempt = 0) => {
      try {
        const url = alreadyCounted ? '/api/visits' : '/api/visits?inc=1';
        const res = await fetch(url, { cache: 'no-store' });
        const data = await res.json();
        if (cancelled) return;

        if (typeof data.count === 'number') {
          setVisits(data.count);
          setStatus('ok');
          if (!alreadyCounted && typeof window !== 'undefined') {
            window.sessionStorage.setItem(sessionKey, '1');
          }
        } else if (attempt < 2) {
          setTimeout(() => fetchVisits(attempt + 1), 1500);
        } else {
          setStatus('err');
        }
      } catch {
        if (cancelled) return;
        if (attempt < 2) setTimeout(() => fetchVisits(attempt + 1), 1500);
        else setStatus('err');
      }
    };
    fetchVisits();
    return () => { cancelled = true; };
  }, []);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(APP_URL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <footer style={{
      padding: '60px 20px 40px',
      borderTop: `1px solid ${C.gold}33`,
      marginTop: 50,
      background: 'linear-gradient(180deg, transparent, rgba(0,0,0,0.7))',
    }}>
      <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>

        {/* === BRAND BLOCK === */}
        <a
          href={WHATSAPP_GROUP}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t('הצטרף לקבוצת 60 שניות חומ״ס', 'Join 60 Seconds HazMat group')}
          title={t('לחץ להצטרפות לקבוצת 60 שניות חומ״ס', 'Click to join 60 Seconds HazMat group')}
          style={{ display: 'inline-block', textDecoration: 'none' }}
        >
          <div className="logo-orb" style={{
            width: 88, height: 88,
            margin: '0 auto 18px',
            position: 'relative',
            transition: 'transform 0.3s, filter 0.3s',
            cursor: 'pointer',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.06)'; e.currentTarget.style.filter = `drop-shadow(0 0 28px ${C.gold}aa)`; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.filter = 'none'; }}>
            <Image src="/images/logo-60sec.png" alt="60 שניות חומ״ס" width={88} height={88} style={{ borderRadius: '50%' }} />
          </div>
        </a>

        <div style={{
          fontSize: 22,
          fontWeight: 800,
          color: C.gold,
          fontFamily: "'Playfair Display', serif",
          marginBottom: 4,
          letterSpacing: '0.02em',
        }}>
          {t('רועי צוקרמן', 'Roie Zukerman')}
        </div>
        <div style={{
          fontSize: 13,
          color: C.gL,
          fontFamily: "'JetBrains Mono', monospace",
          letterSpacing: '0.15em',
          marginBottom: 28,
        }}>
          {t('מומחה לחומ״ס וטב״ק', 'HazMat & CBRN Expert')}
        </div>

        {/* === ACTIONS ROW (visit counter + WhatsApp) === */}
        <div style={{
          display: 'flex',
          gap: 12,
          justifyContent: 'center',
          alignItems: 'center',
          flexWrap: 'wrap',
          marginBottom: 28,
        }}>
          {/* Visit counter */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 16px',
            background: 'rgba(0,0,0,0.5)',
            border: `1px solid ${C.gold}55`,
            borderRadius: 24,
            fontFamily: "'JetBrains Mono', monospace",
          }}>
            <span style={{ fontSize: 16 }}>👁</span>
            <span style={{ fontSize: 12, color: C.gL, letterSpacing: '0.12em' }}>
              {t('צפיות', 'VIEWS')}
            </span>
            <span style={{
              fontSize: 16,
              fontWeight: 800,
              color: status === 'err' ? 'rgba(255,255,255,0.4)' : C.gold,
              fontFamily: "'Playfair Display', serif",
              minWidth: 28,
              textAlign: 'center',
            }}>
              {status === 'loading' ? '···' : status === 'ok' && visits !== null ? visits.toLocaleString() : '—'}
            </span>
          </div>

          {/* WhatsApp join */}
          <a
            href={WHATSAPP_GROUP}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 18px',
              background: 'linear-gradient(135deg, #25d366, #128c7e)',
              border: 'none',
              borderRadius: 24,
              color: '#fff',
              fontSize: 13,
              fontWeight: 700,
              fontFamily: "'Heebo', sans-serif",
              textDecoration: 'none',
              boxShadow: '0 4px 14px rgba(37,211,102,0.35)',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(37,211,102,0.5)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(37,211,102,0.35)'; }}
          >
            <span style={{ fontSize: 16 }}>💬</span>
            {t('הצטרף לקבוצה', 'Join WhatsApp group')}
          </a>

          {/* Email */}
          <a
            href="mailto:roiez1@gmail.com"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 16px',
              background: 'rgba(0,0,0,0.5)',
              border: `1px solid ${C.gold}55`,
              borderRadius: 24,
              color: C.gL,
              fontSize: 13,
              fontFamily: "'JetBrains Mono', monospace",
              textDecoration: 'none',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = `${C.gold}22`; e.currentTarget.style.borderColor = C.gold; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.5)'; e.currentTarget.style.borderColor = `${C.gold}55`; }}
          >
            <span style={{ fontSize: 16 }}>✉</span>
            roiez1@gmail.com
          </a>

          {/* Copy link */}
          <button
            onClick={copyLink}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 16px',
              background: copied ? `${C.green}22` : 'rgba(0,0,0,0.5)',
              border: `1px solid ${copied ? C.green : C.gold + '55'}`,
              borderRadius: 24,
              color: copied ? C.green : C.gL,
              fontSize: 13,
              fontFamily: "'JetBrains Mono', monospace",
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            <span style={{ fontSize: 16 }}>{copied ? '✓' : '🔗'}</span>
            {copied ? t('הועתק', 'COPIED') : t('העתק קישור', 'COPY LINK')}
          </button>
        </div>

        {/* === DIVIDER === */}
        <div style={{
          height: 1,
          background: `linear-gradient(90deg, transparent, ${C.gold}55, transparent)`,
          margin: '0 auto 24px',
          maxWidth: 320,
        }} />

        {/* === COPYRIGHT === */}
        <p style={{
          fontSize: 12,
          color: 'rgba(255,255,255,0.55)',
          lineHeight: 1.85,
          fontFamily: "'JetBrains Mono', monospace",
          letterSpacing: '0.05em',
          maxWidth: 600,
          margin: '0 auto 14px',
        }}>
          כל הזכויות שמורות. מבוסס על מקורות פתוחים בלבד. למטרות מקצועיות והדרכתיות. אין להשתמש ללא אישור בכתב.
        </p>

        <div style={{
          fontSize: 11,
          color: 'rgba(255,255,255,0.4)',
          fontFamily: "'JetBrains Mono', monospace",
          letterSpacing: '0.1em',
        }}>
          © {new Date().getFullYear()} · {t('60 שניות חומ״ס', '60 Seconds HazMat')}
        </div>
      </div>
    </footer>
  );
}
