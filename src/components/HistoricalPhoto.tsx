'use client';
import { useState } from 'react';
import { C } from '@/lib/data';
import { useReveal } from '@/lib/useScroll';

interface HistoricalPhotoProps {
  src: string;
  caption_he: string;
  caption_en: string;
  attribution: string;
  he: boolean;
  t: (h: string, e: string) => string;
  alt?: string;
  height?: number;
}

export default function HistoricalPhoto({
  src, caption_he, caption_en, attribution, he, t, alt, height = 280,
}: HistoricalPhotoProps) {
  const { ref, visible } = useReveal<HTMLDivElement>();
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <figure ref={ref} style={{
      margin: '20px 0',
      opacity: visible ? 1 : 0,
      transform: visible ? 'scale(1)' : 'scale(0.96)',
      transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
    }}>
      <div style={{
        position: 'relative',
        width: '100%',
        height: `${height}px`,
        borderRadius: 10,
        overflow: 'hidden',
        background: 'linear-gradient(135deg, rgba(0,0,0,0.7), rgba(20,30,55,0.4))',
        border: `1px solid ${C.gold}33`,
        boxShadow: `0 8px 28px rgba(0,0,0,0.5)`,
      }}>
        {!error && (
          <img
            src={src}
            alt={alt || t(caption_he, caption_en)}
            onLoad={() => setLoaded(true)}
            onError={() => setError(true)}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: loaded ? 1 : 0,
              transition: 'opacity 0.6s ease',
              filter: 'sepia(0.15) contrast(1.05)',
            }}
            loading="lazy"
          />
        )}

        {/* Loading state */}
        {!loaded && !error && (
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'rgba(200,164,78,0.5)',
            fontSize: 11,
            fontFamily: "'JetBrains Mono', monospace",
            letterSpacing: '0.2em',
          }}>
            ⌛ {t('טוען תמונה היסטורית', 'LOADING HISTORICAL PHOTO')}
          </div>
        )}

        {/* Error fallback */}
        {error && (
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexDirection: 'column', gap: 8,
            color: 'rgba(255,255,255,0.5)',
            fontSize: 12,
            padding: 20,
            textAlign: 'center',
          }}>
            <span style={{ fontSize: 32 }}>📷</span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10 }}>
              {t('תמונה לא זמינה', 'IMAGE UNAVAILABLE')}
            </span>
          </div>
        )}

        {/* Tape decoration corners */}
        <div style={{
          position: 'absolute', top: -3, left: 14,
          width: 50, height: 14,
          background: 'rgba(232,213,160,0.25)',
          borderRadius: 2,
          transform: 'rotate(-3deg)',
          backdropFilter: 'blur(2px)',
        }} />
        <div style={{
          position: 'absolute', top: -3, right: 14,
          width: 50, height: 14,
          background: 'rgba(232,213,160,0.25)',
          borderRadius: 2,
          transform: 'rotate(3deg)',
          backdropFilter: 'blur(2px)',
        }} />

        {/* "Archival" stamp */}
        <div style={{
          position: 'absolute',
          bottom: 10,
          [he ? 'left' : 'right']: 10,
          padding: '3px 8px',
          background: 'rgba(0,0,0,0.7)',
          border: `1px solid ${C.gold}66`,
          borderRadius: 3,
          fontSize: 8,
          color: C.gL,
          fontFamily: "'JetBrains Mono', monospace",
          letterSpacing: '0.2em',
          fontWeight: 700,
          backdropFilter: 'blur(4px)',
        }}>
          {t('ארכיון · 1986', 'ARCHIVE · 1986')}
        </div>
      </div>

      {/* Caption */}
      <figcaption style={{
        marginTop: 10,
        padding: '8px 14px',
        background: 'rgba(0,0,0,0.4)',
        border: `1px solid ${C.gold}22`,
        borderInlineStart: `3px solid ${C.gold}66`,
        borderRadius: 6,
      }}>
        <p style={{
          fontSize: 12,
          color: 'rgba(255,255,255,0.85)',
          lineHeight: 1.6,
          fontStyle: 'italic',
          fontFamily: "'Playfair Display', serif",
          marginBottom: 4,
        }}>
          {t(caption_he, caption_en)}
        </p>
        <p style={{
          fontSize: 9,
          color: 'rgba(255,255,255,0.45)',
          fontFamily: "'JetBrains Mono', monospace",
          letterSpacing: '0.05em',
        }}>
          {attribution}
        </p>
      </figcaption>
    </figure>
  );
}
