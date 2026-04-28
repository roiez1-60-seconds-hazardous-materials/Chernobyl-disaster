'use client';
import { C } from '@/lib/data';
import { useReveal } from '@/lib/useScroll';

interface DividerProps {
  number?: string;
  quote_he?: string;
  quote_en?: string;
  by_he?: string;
  by_en?: string;
  he: boolean;
  t: (h: string, e: string) => string;
  variant?: 'quote' | 'number' | 'symbol';
  symbol?: string;
  symbolLabel_he?: string;
  symbolLabel_en?: string;
}

export default function SectionDivider({
  number,
  quote_he,
  quote_en,
  by_he,
  by_en,
  he,
  t,
  variant = 'quote',
  symbol,
  symbolLabel_he,
  symbolLabel_en,
}: DividerProps) {
  const { ref, visible } = useReveal<HTMLDivElement>();

  return (
    <div ref={ref} style={{
      padding: '40px 16px',
      textAlign: 'center',
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(40px)',
      transition: 'opacity 1s ease-out, transform 1s ease-out',
      position: 'relative',
    }}>
      {/* Top decorator line */}
      <div style={{
        height: 1,
        background: `linear-gradient(90deg, transparent, ${C.gold}66, transparent)`,
        maxWidth: 200, margin: '0 auto 24px',
      }} />

      {variant === 'number' && number && (
        <div style={{
          fontSize: 'clamp(56px, 14vw, 110px)',
          fontFamily: "'Playfair Display', serif",
          fontWeight: 900,
          background: `linear-gradient(135deg, ${C.gold}, ${C.gL}, ${C.gold})`,
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          lineHeight: 1,
          marginBottom: 12,
          letterSpacing: '-0.04em',
          filter: 'drop-shadow(0 0 30px rgba(200,164,78,0.25))',
        }}>
          {number}
        </div>
      )}

      {variant === 'symbol' && (
        <>
          <div style={{
            fontSize: 56,
            marginBottom: 12,
            animation: 'float 3s ease-in-out infinite',
            display: 'inline-block',
          }}>
            {symbol}
          </div>
          {symbolLabel_he && (
            <div style={{
              fontSize: 14,
              letterSpacing: '0.3em',
              color: C.gold,
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 700,
              marginBottom: 8,
            }}>
              {t(symbolLabel_he, symbolLabel_en || symbolLabel_he)}
            </div>
          )}
        </>
      )}

      {variant === 'quote' && quote_he && (
        <>
          <div style={{
            fontSize: 32,
            color: `${C.gold}55`,
            fontFamily: "'Playfair Display', serif",
            fontWeight: 900,
            lineHeight: 1,
            marginBottom: 8,
          }}>״</div>
          <p style={{
            fontSize: 'clamp(15px, 3vw, 20px)',
            color: C.gL,
            fontFamily: "'Playfair Display', serif",
            fontStyle: 'italic',
            lineHeight: 1.55,
            maxWidth: 560,
            margin: '0 auto 12px',
            fontWeight: 400,
          }}>
            {t(quote_he, quote_en || '')}
          </p>
          {by_he && (
            <div style={{
              fontSize: 14,
              color: 'rgba(200,164,78,0.7)',
              fontFamily: "'JetBrains Mono', monospace",
              letterSpacing: '0.15em',
              fontWeight: 600,
            }}>
              — {t(by_he, by_en || by_he)}
            </div>
          )}
        </>
      )}

      {/* Bottom decorator line */}
      <div style={{
        height: 1,
        background: `linear-gradient(90deg, transparent, ${C.gold}66, transparent)`,
        maxWidth: 200, margin: '24px auto 0',
      }} />
    </div>
  );
}
