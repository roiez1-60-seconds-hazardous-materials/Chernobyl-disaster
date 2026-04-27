'use client';
import { useState } from 'react';
import Image from 'next/image';
import { C } from '@/lib/data';

export default function Infographic({ he, t }: { he: boolean; t: (h: string, e: string) => string }) {
  const [zoom, setZoom] = useState(false);

  return (
    <section id="infographic" style={{ padding: '60px 16px 40px', position: 'relative' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 28, position: 'relative' }}>
          <div className="section-number" style={{ top: '-20px', insetInlineStart: '5%' }}>11</div>
          <div className="section-kicker">[ {t('סעיף עשירי · אינפוגרפיקה', 'PART TEN · INFOGRAPHIC')} ]</div>
          <h2 className="section-title">{t('האינפוגרפיקה', 'The Infographic')}</h2>
          <p className="section-subtitle">{t('סיכום ויזואלי של האסון בעמוד אחד', 'Visual summary of disaster in one page')}</p>
          <div className="gr" style={{ margin: '0 auto' }} />
        </div>

        <button onClick={() => setZoom(true)} className="hover-lift" style={{
          width: '100%', padding: 0, border: `1px solid ${C.gold}55`,
          borderRadius: 12, overflow: 'hidden', background: 'rgba(0,0,0,0.4)',
          cursor: 'zoom-in', position: 'relative', display: 'block',
        }}>
          <Image src="/images/infographic.png" alt={t('אינפוגרפיקה אסון צ׳רנוביל', 'Chernobyl infographic')}
                 width={1200} height={1600} style={{ width: '100%', height: 'auto', display: 'block' }} />
          <div style={{ position: 'absolute', top: 12, [he ? 'left' : 'right']: 12, padding: '6px 12px', background: 'rgba(0,0,0,0.7)', border: `1px solid ${C.gold}55`, borderRadius: 6, color: C.gold, fontSize: 11, fontFamily: "'JetBrains Mono', monospace" }}>
            🔍 {t('הגדל', 'ZOOM')}
          </div>
        </button>

        {zoom && (
          <div onClick={() => setZoom(false)} style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.96)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 200, padding: 20, animation: 'fadeIn 0.25s',
            overflow: 'auto',
          }}>
            <button onClick={(e) => { e.stopPropagation(); setZoom(false); }} style={{
              position: 'fixed', top: 16, [he ? 'left' : 'right']: 16,
              background: 'rgba(255,255,255,0.1)', border: `1px solid ${C.gold}`,
              color: C.gold, width: 40, height: 40, borderRadius: '50%',
              fontSize: 18, cursor: 'pointer', zIndex: 10,
            }}>✕</button>
            <Image src="/images/infographic.png" alt="" width={1200} height={1600} style={{ maxWidth: '95vw', height: 'auto' }} />
          </div>
        )}
      </div>
    </section>
  );
}
