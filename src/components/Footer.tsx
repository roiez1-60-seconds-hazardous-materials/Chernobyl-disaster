'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { C } from '@/lib/data';

export default function Footer({ he, t }: { he: boolean; t: (h: string, e: string) => string }) {
  const [visits, setVisits] = useState<number | null>(null);
  const [status, setStatus] = useState<'loading' | 'ok' | 'err'>('loading');
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState('https://chernobyl-disaster.vercel.app');

  // Capture actual URL
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setShareUrl(window.location.origin + window.location.pathname);
    }
  }, []);

  // Visits counter
  useEffect(() => {
    let cancelled = false;
    let attempts = 0;

    const sessionKey = 'chernobyl-visit-counted';
    const alreadyCounted = typeof window !== 'undefined' && window.sessionStorage.getItem(sessionKey);

    const fetchVisits = async () => {
      attempts++;
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
        } else {
          if (attempts < 3) {
            setTimeout(fetchVisits, 1500);
          } else {
            setStatus('err');
          }
        }
      } catch {
        if (cancelled) return;
        if (attempts < 3) {
          setTimeout(fetchVisits, 1500);
        } else {
          setStatus('err');
        }
      }
    };

    fetchVisits();
    return () => { cancelled = true; };
  }, []);

  const shareText_he = `אסון צ׳רנוביל — תיק מודיעין מקצועי מאת רועי צוקרמן · 60 שניות חומ״ס`;
  const shareText_en = `Chernobyl Disaster — Professional Intelligence Brief by Roie Zukerman · 60 Seconds HazMat`;
  const shareText = he ? shareText_he : shareText_en;
  const fullShare = `${shareText}\n${shareUrl}`;

  // Pre-built share URLs
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(fullShare)}`;
  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullShare);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // fallback
      const ta = document.createElement('textarea');
      ta.value = fullShare;
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); } catch {}
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  };

  // Native share API (mobile)
  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && (navigator as any).share) {
      try {
        await (navigator as any).share({
          title: he ? 'אסון צ׳רנוביל' : 'Chernobyl Disaster',
          text: shareText,
          url: shareUrl,
        });
      } catch {}
    } else {
      handleCopy();
    }
  };

  return (
    <footer style={{ padding: '50px 16px 36px', borderTop: `1px solid ${C.gold}33`, marginTop: 40, background: 'linear-gradient(180deg, transparent, rgba(0,0,0,0.6))' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', textAlign: 'center' }}>
        <a
          href="https://chat.whatsapp.com/K4NzcZucmimKYFOXE3VVtD?mode=gi_t"
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t('הצטרף לקבוצת 60 שניות חומ״ס בוואטסאפ', 'Join 60 Seconds HazMat WhatsApp group')}
          title={t('לחץ להצטרפות לקבוצת 60 שניות חומ״ס בוואטסאפ', 'Click to join 60 Seconds HazMat WhatsApp group')}
          style={{ display: 'inline-block', textDecoration: 'none' }}
        >
          <div className="logo-orb" style={{
            width: 90, height: 90,
            margin: '0 auto 16px',
            position: 'relative',
            transition: 'transform 0.3s, box-shadow 0.3s',
            cursor: 'pointer',
            borderRadius: '50%',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.06)'; e.currentTarget.style.boxShadow = `0 0 32px ${C.gold}99`; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none'; }}>
            <Image src="/images/logo-60sec.png" alt="60 שניות חומ״ס" width={90} height={90} style={{ borderRadius: '50%' }} />
          </div>
        </a>

        {/* WhatsApp join hint */}
        <a
          href="https://chat.whatsapp.com/K4NzcZucmimKYFOXE3VVtD?mode=gi_t"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            fontSize: 14, color: '#25d366', fontFamily: "'JetBrains Mono', monospace",
            textDecoration: 'none',
            marginBottom: 12,
            padding: '4px 12px',
            background: 'rgba(37,211,102,0.08)',
            border: '1px solid rgba(37,211,102,0.3)',
            borderRadius: 20,
            letterSpacing: '0.08em',
            transition: 'all 0.25s',
          }}
        >
          💬 {t('הצטרף לקבוצת 60 שניות חומ״ס', 'Join 60 Sec HazMat group')}
        </a>

        <div style={{ fontSize: 21, fontWeight: 800, color: C.gold, fontFamily: "'Playfair Display', serif", marginBottom: 6, marginTop: 8 }}>
          {t('רועי צוקרמן', 'Roie Zukerman')}
        </div>
        <div style={{ fontSize: 16, color: C.gL, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em', marginBottom: 14 }}>
          {t('מומחה לחומ״ס וטב״ק', 'HazMat & CBRN Expert')}
        </div>

        {/* Email */}
        <div style={{ marginBottom: 22 }}>
          <a href="mailto:roiez1@gmail.com" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '8px 16px',
            color: C.gL,
            fontSize: 16,
            fontFamily: "'JetBrains Mono', monospace",
            textDecoration: 'none',
            border: `1px solid ${C.gold}33`,
            borderRadius: 20,
            background: 'rgba(0,0,0,0.4)',
            transition: 'all 0.25s',
            letterSpacing: '0.05em',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = `${C.gold}99`;
            (e.currentTarget as HTMLElement).style.color = C.gold;
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = `${C.gold}33`;
            (e.currentTarget as HTMLElement).style.color = C.gL;
          }}
          >
            <span style={{ fontSize: 19 }}>✉</span>
            roiez1@gmail.com
          </a>
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
          marginBottom: 22,
          fontFamily: "'JetBrains Mono', monospace",
          boxShadow: `0 0 14px ${C.gold}22`,
        }}>
          <span style={{ fontSize: 19 }}>👁</span>
          <span style={{ fontSize: 14, color: C.gL, letterSpacing: '0.15em' }}>
            {t('צפיות באפליקציה', 'APP VIEWS')}
          </span>
          <span style={{
            fontSize: 19, fontWeight: 800,
            color: status === 'err' ? 'rgba(255,255,255,0.4)' : C.gold,
            fontFamily: "'Playfair Display', serif",
            minWidth: 28,
            textAlign: 'center',
          }}>
            {status === 'loading' ? '···' : status === 'ok' && visits !== null ? visits.toLocaleString() : '—'}
          </span>
        </div>

        {/* Share section */}
        <div style={{
          padding: '18px 20px',
          background: 'rgba(0,0,0,0.4)',
          border: `1px solid ${C.gold}33`,
          borderRadius: 14,
          maxWidth: 480,
          margin: '0 auto 22px',
        }}>
          <div style={{
            fontSize: 14,
            letterSpacing: '0.25em',
            color: C.gold,
            fontFamily: "'JetBrains Mono', monospace",
            fontWeight: 700,
            marginBottom: 12,
          }}>
            {t('שתף את האפליקציה', 'SHARE THIS APP')}
          </div>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
            {/* WhatsApp */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t('שתף בוואטסאפ', 'Share on WhatsApp')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 16px',
                background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
                color: '#fff',
                fontSize: 16,
                fontWeight: 700,
                fontFamily: 'Heebo, sans-serif',
                textDecoration: 'none',
                borderRadius: 22,
                transition: 'all 0.25s',
                boxShadow: '0 2px 8px rgba(37,211,102,0.35)',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              {t('וואטסאפ', 'WhatsApp')}
            </a>

            {/* Telegram */}
            <a
              href={telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t('שתף בטלגרם', 'Share on Telegram')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 16px',
                background: 'linear-gradient(135deg, #229ED9 0%, #1B7AB8 100%)',
                color: '#fff',
                fontSize: 16,
                fontWeight: 700,
                fontFamily: 'Heebo, sans-serif',
                textDecoration: 'none',
                borderRadius: 22,
                transition: 'all 0.25s',
                boxShadow: '0 2px 8px rgba(34,158,217,0.35)',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
              </svg>
              {t('טלגרם', 'Telegram')}
            </a>

            {/* Copy link */}
            <button
              onClick={handleCopy}
              aria-label={t('העתק קישור', 'Copy link')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 16px',
                background: copied ? `linear-gradient(135deg, ${C.green}, ${C.green}cc)` : 'rgba(255,255,255,0.06)',
                color: copied ? '#fff' : C.gL,
                fontSize: 16,
                fontWeight: 700,
                fontFamily: 'Heebo, sans-serif',
                border: `1px solid ${copied ? C.green : C.gold + '55'}`,
                borderRadius: 22,
                cursor: 'pointer',
                transition: 'all 0.25s',
                boxShadow: copied ? `0 2px 8px ${C.green}66` : 'none',
              }}
              onMouseEnter={(e) => {
                if (!copied) {
                  (e.currentTarget as HTMLElement).style.borderColor = C.gold;
                  (e.currentTarget as HTMLElement).style.color = C.gold;
                }
              }}
              onMouseLeave={(e) => {
                if (!copied) {
                  (e.currentTarget as HTMLElement).style.borderColor = `${C.gold}55`;
                  (e.currentTarget as HTMLElement).style.color = C.gL;
                }
              }}
            >
              <span style={{ fontSize: 17 }}>{copied ? '✓' : '🔗'}</span>
              {copied ? t('הועתק!', 'COPIED!') : t('העתק קישור', 'Copy link')}
            </button>

            {/* Native share (mobile) */}
            {typeof navigator !== 'undefined' && (navigator as any).share && (
              <button
                onClick={handleNativeShare}
                aria-label={t('שתף', 'Share')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '10px 16px',
                  background: 'rgba(255,255,255,0.06)',
                  color: C.gL,
                  fontSize: 16,
                  fontWeight: 700,
                  fontFamily: 'Heebo, sans-serif',
                  border: `1px solid ${C.gold}55`,
                  borderRadius: 22,
                  cursor: 'pointer',
                  transition: 'all 0.25s',
                }}
              >
                <span style={{ fontSize: 17 }}>📤</span>
                {t('שתף...', 'Share...')}
              </button>
            )}
          </div>
        </div>

        <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${C.gold}55, transparent)`, margin: '8px auto 16px', maxWidth: 320 }} />

        <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.7)', lineHeight: 1.85, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.05em', maxWidth: 640, margin: '0 auto' }}>
          כל הזכויות שמורות. מבוסס על מקורות פתוחים בלבד. למטרות מקצועיות והדרכתיות. אין להשתמש ללא אישור בכתב.
        </p>

        <div style={{ marginTop: 18, fontSize: 14, color: 'rgba(255,255,255,0.5)', fontFamily: "'JetBrains Mono', monospace" }}>
          © {new Date().getFullYear()} · {t('60 שניות חומ״ס', '60 Seconds HazMat')}
        </div>
      </div>
    </footer>
  );
}
