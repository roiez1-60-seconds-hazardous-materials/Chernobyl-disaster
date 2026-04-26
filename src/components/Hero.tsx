'use client';
import Image from 'next/image';
import { C } from '@/lib/data';

export default function Hero({ he, t }: { he: boolean; t: (h: string, e: string) => string }) {
  return (
    <section id="hero" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', position: 'relative', padding: '40px 20px' }}>
      {/* Floating particles bg */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        {[...Array(20)].map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            width: 4 + Math.random() * 6, height: 4 + Math.random() * 6,
            borderRadius: '50%',
            background: i % 3 === 0 ? C.gold : i % 3 === 1 ? C.danger : C.blue,
            opacity: 0.25,
            animation: `radFloat ${5 + Math.random() * 8}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 5}s`,
            filter: 'blur(1px)',
          }} />
        ))}
      </div>

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 900 }}>
        {/* Logo */}
        <div className="logo-orb fade-in" style={{ width: 130, height: 130, margin: '0 auto 24px', position: 'relative', animation: 'fadeIn 0.8s, float 4s ease-in-out infinite 0.8s' }}>
          <Image src="/images/logo-60sec.png" alt="60 שניות חומ״ס" width={130} height={130} priority style={{ borderRadius: '50%', boxShadow: '0 0 40px rgba(200,164,78,0.4)' }} />
        </div>

        <div className="section-kicker fade-in" style={{ animationDelay: '0.2s' }}>
          [ {t('תיק מודיעין מקצועי', 'PROFESSIONAL DOSSIER')} · 26.04.1986 ]
        </div>

        <h1 className="fade-in" style={{
          fontSize: 'clamp(36px, 8vw, 80px)',
          fontWeight: 900,
          fontFamily: "'Playfair Display', serif",
          lineHeight: 1.05,
          marginBottom: 18,
          background: `linear-gradient(135deg, ${C.gold} 0%, ${C.gL} 50%, ${C.gold} 100%)`,
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: '-0.02em',
          animationDelay: '0.4s',
        }}>
          {t('אסון צ׳רנוביל', 'Chernobyl Disaster')}
        </h1>

        <h2 className="fade-in" style={{
          fontSize: 'clamp(15px, 3vw, 22px)',
          fontWeight: 400,
          color: C.gL,
          fontFamily: "'Playfair Display', serif",
          fontStyle: 'italic',
          marginBottom: 12,
          animationDelay: '0.6s',
        }}>
          {t('אנטומיה של כשל גרעיני · כור RBMK והקטסטרופה הגלובלית', 'Anatomy of a Nuclear Failure · RBMK Reactor & The Global Catastrophe')}
        </h2>

        <div className="gr fade-in" style={{ margin: '20px auto', animationDelay: '0.7s' }} />

        <p className="fade-in" style={{
          fontSize: 'clamp(13px, 2.4vw, 16px)',
          color: 'rgba(255,255,255,0.85)',
          lineHeight: 1.85,
          maxWidth: 720,
          margin: '0 auto 32px',
          animationDelay: '0.8s',
        }}>
          {t(
            '40 שנה לאחר האסון הגרעיני הגדול ביותר בהיסטוריה, מאמר זה משלב הסבר מקצועי ויזואלי עם נגישות מלאה. מציר הזמן הראשוני, דרך הפיזיקה של הכור והכשלים הקטלניים שלו, אל פעולות הכיבוי הגדולות בהיסטוריה ועד ההשפעות לטווח ארוך.',
            '40 years after history\'s greatest nuclear disaster, this dossier combines professional visual explanation with full accessibility. From the initial timeline, through reactor physics and fatal flaws, to history\'s largest containment operation and long-term impacts.'
          )}
        </p>

        {/* Quick stats grid */}
        <div className="fade-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12, maxWidth: 760, margin: '0 auto', animationDelay: '1s' }}>
          {[
            { n: '01:23:47', l: t('שעת הפיצוץ', 'Time of explosion'), c: C.danger },
            { n: '5,300', l: 'PBq Cs-137', c: C.amber },
            { n: '~600K', l: t('ליקווידטורים', 'Liquidators'), c: C.gold },
            { n: '350K', l: t('פונו מבתיהם', 'Evacuated'), c: C.purple },
            { n: '2,600', l: t('קמ״ר אזור הדרה', 'km² exclusion zone'), c: C.blue },
            { n: '40', l: t('שנים מאז', 'Years since'), c: C.green },
          ].map((s, i) => (
            <div key={i} className="stat-box hover-lift" style={{ '--accent': s.c } as any}>
              <div className="stat-num" style={{ color: s.c, textShadow: `0 0 20px ${s.c}55` }}>{s.n}</div>
              <div className="stat-lbl">{s.l}</div>
            </div>
          ))}
        </div>

        <div className="fade-in" style={{ marginTop: 36, animationDelay: '1.2s' }}>
          <a href="#timeline" style={{ textDecoration: 'none' }}>
            <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 6, cursor: 'pointer', color: C.gold, opacity: 0.7, transition: 'opacity 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.opacity = '1'} onMouseLeave={(e) => e.currentTarget.style.opacity = '0.7'}>
              <div style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.2em' }}>{t('להמשיך למטה', 'SCROLL DOWN')}</div>
              <div style={{ fontSize: 24, animation: 'float 2s ease-in-out infinite' }}>↓</div>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}
