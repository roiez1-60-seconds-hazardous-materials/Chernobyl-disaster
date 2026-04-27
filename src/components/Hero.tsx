'use client';
import { C } from '@/lib/data';

export default function Hero({ he, t }: { he: boolean; t: (h: string, e: string) => string }) {
  return (
    <section id="hero" style={{ minHeight: '95vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', position: 'relative', padding: '90px 16px 40px' }}>
      {/* Floating particles bg */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        {[...Array(18)].map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            width: 3 + Math.random() * 5, height: 3 + Math.random() * 5,
            borderRadius: '50%',
            background: i % 3 === 0 ? C.gold : i % 3 === 1 ? C.danger : C.blue,
            opacity: 0.22,
            animation: `radFloat ${5 + Math.random() * 8}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 5}s`,
            filter: 'blur(1px)',
          }} />
        ))}
      </div>

      {/* Atom rings decoration */}
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, height: 400, opacity: 0.08, pointerEvents: 'none' }}>
        <svg viewBox="0 0 400 400" style={{ width: '100%', height: '100%' }}>
          <ellipse cx="200" cy="200" rx="160" ry="60" fill="none" stroke={C.gold} strokeWidth="1.5" style={{ animation: 'spin 30s linear infinite', transformOrigin: '200px 200px' }} />
          <ellipse cx="200" cy="200" rx="160" ry="60" fill="none" stroke={C.gold} strokeWidth="1.5" transform="rotate(60 200 200)" style={{ animation: 'spin 25s linear infinite reverse', transformOrigin: '200px 200px' }} />
          <ellipse cx="200" cy="200" rx="160" ry="60" fill="none" stroke={C.gold} strokeWidth="1.5" transform="rotate(120 200 200)" style={{ animation: 'spin 35s linear infinite', transformOrigin: '200px 200px' }} />
        </svg>
      </div>

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 880, width: '100%' }}>
        {/* Date stamp - smaller, fits */}
        <div className="fade-in" style={{
          display: 'inline-block',
          padding: '5px 14px',
          border: `1px solid ${C.gold}55`,
          background: `${C.gold}08`,
          borderRadius: 3,
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: '0.2em',
          color: C.gold,
          fontFamily: "'JetBrains Mono', monospace",
          marginBottom: 18,
          animationDelay: '0.1s',
        }}>
          26 · 04 · 1986
        </div>

        <h1 className="fade-in" style={{
          fontSize: 'clamp(40px, 11vw, 86px)',
          fontWeight: 900,
          fontFamily: "'Playfair Display', serif",
          lineHeight: 1.05,
          marginBottom: 14,
          background: `linear-gradient(135deg, ${C.gold} 0%, ${C.gL} 50%, ${C.gold} 100%)`,
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: '-0.02em',
          animationDelay: '0.3s',
          padding: '0 6px',
        }}>
          {t('אסון צ׳רנוביל', 'Chernobyl')}
        </h1>

        <h2 className="fade-in" style={{
          fontSize: 'clamp(13px, 2.6vw, 18px)',
          fontWeight: 400,
          color: C.gL,
          fontFamily: "'Playfair Display', serif",
          fontStyle: 'italic',
          marginBottom: 14,
          animationDelay: '0.5s',
          padding: '0 12px',
          lineHeight: 1.4,
        }}>
          {t('אנטומיה של כשל גרעיני · כור RBMK והקטסטרופה', 'Anatomy of a Nuclear Failure · The RBMK Catastrophe')}
        </h2>

        <div className="gr fade-in" style={{ margin: '18px auto', animationDelay: '0.6s' }} />

        <p className="fade-in" style={{
          fontSize: 'clamp(12px, 2.3vw, 15px)',
          color: 'rgba(255,255,255,0.85)',
          lineHeight: 1.85,
          maxWidth: 660,
          margin: '0 auto 26px',
          padding: '0 8px',
          animationDelay: '0.7s',
        }}>
          {t(
            '40 שנה לאסון הגרעיני הגדול בהיסטוריה. תיק מודיעין מקצועי המשלב הסבר ויזואלי, פיזיקה של הכור, הכשלים הקטלניים, פעולות הכיבוי והשפעות לטווח ארוך.',
            '40 years since history\'s greatest nuclear disaster. Professional dossier with visual explanation, reactor physics, fatal flaws, response operations, and long-term impacts.'
          )}
        </p>

        {/* Quick stats grid */}
        <div className="fade-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 8, maxWidth: 720, margin: '0 auto', animationDelay: '0.9s' }}>
          {[
            { n: '01:23:47', l: t('הפיצוץ', 'Explosion'), c: C.danger },
            { n: '5,300', l: 'PBq Cs-137', c: C.amber },
            { n: '~600K', l: t('ליקווידטורים', 'Liquidators'), c: C.gold },
            { n: '350K', l: t('פונו', 'Evacuated'), c: C.purple },
            { n: '2,600', l: t('קמ״ר', 'km²'), c: C.blue },
            { n: '40', l: t('שנים', 'Years'), c: C.green },
          ].map((s, i) => (
            <div key={i} className="stat-box hover-lift" style={{ '--accent': s.c } as any}>
              <div className="stat-num" style={{ color: s.c, textShadow: `0 0 18px ${s.c}55`, fontSize: 'clamp(16px, 3.2vw, 26px)' }}>{s.n}</div>
              <div className="stat-lbl">{s.l}</div>
            </div>
          ))}
        </div>

        {/* Scroll cue */}
        <div className="fade-in" style={{ marginTop: 30, animationDelay: '1.1s' }}>
          <a href="#timeline" style={{ textDecoration: 'none' }}>
            <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 4, color: C.gold, opacity: 0.7 }}>
              <div style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.2em' }}>
                {t('המשך למטה', 'SCROLL')}
              </div>
              <div style={{ fontSize: 22, animation: 'float 2s ease-in-out infinite' }}>↓</div>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}
