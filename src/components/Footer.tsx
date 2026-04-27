'use client';
import Image from 'next/image';
import { C } from '@/lib/data';

export default function Footer({ he, t }: { he: boolean; t: (h: string, e: string) => string }) {
  return (
    <footer style={{ padding: '40px 16px 30px', borderTop: `1px solid ${C.gold}33`, marginTop: 30, background: 'linear-gradient(180deg, transparent, rgba(0,0,0,0.6))' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto', textAlign: 'center' }}>
        <div className="logo-orb" style={{ width: 70, height: 70, margin: '0 auto 14px', position: 'relative' }}>
          <Image src="/images/logo-60sec.png" alt="60 שניות חומ״ס" width={70} height={70} style={{ borderRadius: '50%' }} />
        </div>

        <div style={{ fontSize: 15, fontWeight: 800, color: C.gold, fontFamily: "'Playfair Display', serif", marginBottom: 6 }}>
          {t('רועי צוקרמן', 'Roie Zukerman')}
        </div>
        <div style={{ fontSize: 11, color: C.gL, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em', marginBottom: 14 }}>
          {t('מומחה לחומ״ס וטב״ק', 'HazMat & CBRN Expert')}
        </div>

        <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${C.gold}55, transparent)`, margin: '14px auto', maxWidth: 280 }} />

        <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.65)', lineHeight: 1.85, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.05em', maxWidth: 600, margin: '0 auto' }}>
          כל הזכויות שמורות. מבוסס על מקורות פתוחים בלבד. למטרות מקצועיות והדרכתיות. אין להשתמש ללא אישור בכתב.
        </p>

        <div style={{ marginTop: 16, fontSize: 10, color: 'rgba(255,255,255,0.5)', fontFamily: "'JetBrains Mono', monospace" }}>
          © {new Date().getFullYear()} · {t('60 שניות חומ״ס', '60 Seconds HazMat')} · v2.1
        </div>
      </div>
    </footer>
  );
}
