'use client';
import { useState, useEffect } from 'react';
import { C } from '@/lib/data';
import { useSpeech } from '@/lib/useSpeech';
import { useCountUpString } from '@/lib/useScroll';

function StatTile({ n, l, c, delay }: { n: string; l: string; c: string; delay: number }) {
  const { ref, display } = useCountUpString(n);
  return (
    <div className="stat-box hover-lift fade-in" style={{ '--accent': c, animationDelay: `${delay}s` } as any}>
      <div className="stat-num" style={{ color: c, textShadow: `0 0 18px ${c}55`, fontSize: 'clamp(16px, 3.2vw, 26px)' }}>
        <span ref={ref}>{display}</span>
      </div>
      <div className="stat-lbl">{l}</div>
    </div>
  );
}

export default function Hero({ he, t }: { he: boolean; t: (h: string, e: string) => string }) {
  const { playing, supported, speak } = useSpeech(he ? 'he' : 'en');
  const [revealed, setRevealed] = useState(false);
  const isPlaying = playing === 'legasov';

  // Staged dramatic reveal
  useEffect(() => {
    const t1 = setTimeout(() => setRevealed(true), 200);
    return () => clearTimeout(t1);
  }, []);

  const onPlay = () => {
    const text_he = 'כל שקר שאנחנו אומרים, הוא חוב. חוב אשר, במוקדם או במאוחר, נדרש לשלם אותו.';
    const text_en = 'Every lie we tell, incurs a debt. Sooner or later, that debt is paid.';
    speak('legasov', he ? text_he : text_en);
  };

  return (
    <section id="hero" style={{
      minHeight: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      textAlign: 'center', position: 'relative',
      padding: '90px 16px 40px',
      overflow: 'hidden',
    }}>
      {/* Vignette overlay for cinematic feel */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.65) 100%)',
        pointerEvents: 'none',
        zIndex: 1,
      }} />

      {/* Floating particles */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0 }}>
        {[...Array(22)].map((_, i) => (
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

      {/* Atomic rings — orbital decoration */}
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 480, height: 480, opacity: revealed ? 0.1 : 0, pointerEvents: 'none', transition: 'opacity 2s ease-out 0.5s', zIndex: 0 }}>
        <svg viewBox="0 0 400 400" style={{ width: '100%', height: '100%' }}>
          <ellipse cx="200" cy="200" rx="170" ry="64" fill="none" stroke={C.gold} strokeWidth="1.2" style={{ animation: 'spin 30s linear infinite', transformOrigin: '200px 200px' }} />
          <ellipse cx="200" cy="200" rx="170" ry="64" fill="none" stroke={C.gold} strokeWidth="1.2" transform="rotate(60 200 200)" style={{ animation: 'spin 25s linear infinite reverse', transformOrigin: '200px 200px' }} />
          <ellipse cx="200" cy="200" rx="170" ry="64" fill="none" stroke={C.gold} strokeWidth="1.2" transform="rotate(120 200 200)" style={{ animation: 'spin 35s linear infinite', transformOrigin: '200px 200px' }} />
          {/* Central glow */}
          <circle cx="200" cy="200" r="8" fill={C.gold} opacity="0.4" style={{ animation: 'pulseFire 3s ease-in-out infinite' }} />
        </svg>
      </div>

      <div style={{ position: 'relative', zIndex: 2, maxWidth: 880, width: '100%' }}>
        {/* LEGASOV QUOTE — opening */}
        <div style={{
          margin: '0 auto 32px',
          maxWidth: 640,
          padding: '24px 22px 18px',
          background: 'linear-gradient(135deg, rgba(0,0,0,0.78), rgba(22,32,64,0.5))',
          border: `1px solid ${C.gold}66`,
          borderRadius: 14,
          position: 'relative',
          backdropFilter: 'blur(12px)',
          opacity: revealed ? 1 : 0,
          transform: revealed ? 'translateY(0)' : 'translateY(24px)',
          transition: 'opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.1s, transform 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.1s',
          boxShadow: `0 0 50px rgba(200,164,78,0.15), 0 8px 32px rgba(0,0,0,0.4)`,
        }}>
          {/* Big quote mark */}
          <div style={{
            position: 'absolute',
            top: -16, [he ? 'right' : 'left']: 18,
            fontSize: 56, color: C.gold, opacity: 0.7,
            fontFamily: "'Playfair Display', serif",
            lineHeight: 1, fontWeight: 900,
            background: '#0a0e1a',
            padding: '0 10px',
          }}>״</div>

          <p style={{
            fontSize: 'clamp(13px, 2.6vw, 17px)',
            color: '#fff',
            fontStyle: 'italic',
            fontFamily: "'Playfair Display', serif",
            lineHeight: 1.7,
            marginBottom: 16,
            fontWeight: 400,
            paddingTop: 4,
          }}>
            {t(
              'כל שקר שאנחנו אומרים הוא חוב, חוב אשר במוקדם או במאוחר, נדרש לשלם אותו.',
              'Every lie we tell incurs a debt. Sooner or later, that debt is paid.'
            )}
          </p>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <div style={{ fontSize: 11, color: C.gL, lineHeight: 1.5, textAlign: he ? 'right' : 'left', flex: 1, minWidth: 200 }}>
              <div style={{ fontWeight: 700, color: C.gold, fontFamily: "'Playfair Display', serif", fontStyle: 'normal', fontSize: 13 }}>
                {t('— ולרי לגאסוב', '— Valery Legasov')}
              </div>
              <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.55)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.08em', marginTop: 2 }}>
                {t('סגן מנהל מכון קורצ׳אטוב · אחראי חקירת האסון', 'Deputy Director, Kurchatov Institute · Lead Investigator')}
              </div>
            </div>

            {supported && (
              <button onClick={onPlay} aria-label={t('הפעל קריינות', 'Play narration')} style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '10px 18px',
                background: isPlaying
                  ? `linear-gradient(135deg, ${C.danger}55, ${C.danger}25)`
                  : `linear-gradient(135deg, ${C.gold}40, ${C.gold}15)`,
                border: `1.5px solid ${isPlaying ? C.danger : C.gold}`,
                borderRadius: 30,
                color: '#fff',
                fontSize: 12, fontWeight: 800,
                fontFamily: "'JetBrains Mono', monospace",
                letterSpacing: '0.1em',
                cursor: 'pointer',
                transition: 'all 0.25s',
                whiteSpace: 'nowrap',
                boxShadow: isPlaying ? `0 0 22px ${C.danger}77` : `0 4px 12px ${C.gold}44`,
                animation: isPlaying ? 'pulseAlert 1.4s infinite' : 'none',
              }}>
                <span style={{ fontSize: 16 }}>{isPlaying ? '⏸' : '🔊'}</span>
                {isPlaying ? t('עצור', 'STOP') : t('האזן', 'LISTEN')}
              </button>
            )}
          </div>
        </div>

        {/* Date stamp with "DECLASSIFIED" feel */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 10,
          padding: '6px 16px',
          border: `1px solid ${C.gold}55`,
          background: `${C.gold}08`,
          borderRadius: 3,
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: '0.25em',
          color: C.gold,
          fontFamily: "'JetBrains Mono', monospace",
          marginBottom: 18,
          opacity: revealed ? 1 : 0,
          transform: revealed ? 'translateY(0)' : 'translateY(12px)',
          transition: 'opacity 1s ease-out 0.4s, transform 1s ease-out 0.4s',
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: C.danger, animation: 'pulseAlert 2s infinite' }} />
          26 · 04 · 1986
          <span style={{ opacity: 0.5 }}>·</span>
          <span style={{ color: C.danger }}>01:23:47</span>
        </div>

        <h1 style={{
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
          padding: '0 6px',
          opacity: revealed ? 1 : 0,
          transform: revealed ? 'translateY(0)' : 'translateY(16px)',
          transition: 'opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.5s, transform 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.5s',
          filter: revealed ? 'drop-shadow(0 0 30px rgba(200,164,78,0.25))' : 'none',
        }}>
          {t('אסון צ׳רנוביל', 'Chernobyl')}
        </h1>

        <h2 style={{
          fontSize: 'clamp(13px, 2.6vw, 18px)',
          fontWeight: 400,
          color: C.gL,
          fontFamily: "'Playfair Display', serif",
          fontStyle: 'italic',
          marginBottom: 14,
          padding: '0 12px',
          lineHeight: 1.4,
          opacity: revealed ? 1 : 0,
          transition: 'opacity 1s ease-out 0.7s',
        }}>
          {t('אנטומיה של כשל גרעיני · כור RBMK והקטסטרופה', 'Anatomy of a Nuclear Failure · The RBMK Catastrophe')}
        </h2>

        <div style={{
          margin: '18px auto',
          width: 60, height: 2,
          background: `linear-gradient(90deg, transparent, ${C.gold}, transparent)`,
          opacity: revealed ? 1 : 0,
          transition: 'opacity 1s ease-out 0.8s',
        }} />

        <p style={{
          fontSize: 'clamp(12px, 2.3vw, 15px)',
          color: 'rgba(255,255,255,0.85)',
          lineHeight: 1.85,
          maxWidth: 660,
          margin: '0 auto 26px',
          padding: '0 8px',
          opacity: revealed ? 1 : 0,
          transform: revealed ? 'translateY(0)' : 'translateY(8px)',
          transition: 'opacity 1s ease-out 0.9s, transform 1s ease-out 0.9s',
        }}>
          {t(
            '40 שנה לאסון הגרעיני הגדול בהיסטוריה. תיק מודיעין מקצועי המשלב הסבר ויזואלי, פיזיקה של הכור, הכשלים הקטלניים, פעולות הכיבוי והשפעות לטווח ארוך.',
            '40 years since history\'s greatest nuclear disaster. Professional dossier with visual explanation, reactor physics, fatal flaws, response operations, and long-term impacts.'
          )}
        </p>

        {/* Stats with count-up */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
          gap: 8,
          maxWidth: 720,
          margin: '0 auto',
        }}>
          {[
            { n: '01:23:47', l: t('הפיצוץ', 'Explosion'), c: C.danger, isCount: false },
            { n: '5,300', l: 'PBq Cs-137', c: C.amber, isCount: true },
            { n: '~600K', l: t('ליקווידטורים', 'Liquidators'), c: C.gold, isCount: true },
            { n: '350K', l: t('פונו', 'Evacuated'), c: C.purple, isCount: true },
            { n: '2,600', l: t('קמ״ר', 'km²'), c: C.blue, isCount: true },
            { n: '40', l: t('שנים', 'Years'), c: C.green, isCount: true },
          ].map((s, i) => (
            s.isCount ? (
              <StatTile key={i} n={s.n} l={s.l} c={s.c} delay={1.1 + i * 0.08} />
            ) : (
              <div key={i} className="stat-box hover-lift" style={{ '--accent': s.c, opacity: revealed ? 1 : 0, transform: revealed ? 'translateY(0)' : 'translateY(12px)', transition: `opacity 0.6s ease-out ${1.1 + i * 0.08}s, transform 0.6s ease-out ${1.1 + i * 0.08}s` } as any}>
                <div className="stat-num" style={{ color: s.c, textShadow: `0 0 18px ${s.c}55`, fontSize: 'clamp(16px, 3.2vw, 26px)' }}>{s.n}</div>
                <div className="stat-lbl">{s.l}</div>
              </div>
            )
          ))}
        </div>

        {/* Scroll cue */}
        <div style={{
          marginTop: 30,
          opacity: revealed ? 0.7 : 0,
          transition: 'opacity 1s ease-out 2s',
        }}>
          <a href="#timeline" style={{ textDecoration: 'none' }}>
            <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 4, color: C.gold }}>
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
