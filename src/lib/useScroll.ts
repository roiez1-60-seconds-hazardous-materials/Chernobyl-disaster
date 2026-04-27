'use client';
import { useState, useEffect, useRef, RefObject } from 'react';

// Reveals element when it scrolls into view (once)
export function useReveal<T extends HTMLElement>(threshold = 0.15): { ref: RefObject<T>; visible: boolean } {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold, rootMargin: '0px 0px -50px 0px' }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, visible };
}

// Animates a number from 0 to target when in view
export function useCountUp(target: number, duration = 1800, decimals = 0): { ref: RefObject<HTMLSpanElement>; value: string } {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(decimals === 0 ? '0' : '0' + (decimals > 0 ? '.' + '0'.repeat(decimals) : ''));
  const started = useRef(false);

  useEffect(() => {
    if (!ref.current) return;
    if (typeof IntersectionObserver === 'undefined') {
      setValue(formatNumber(target, decimals));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !started.current) {
            started.current = true;
            const startTime = performance.now();
            const tick = (now: number) => {
              const elapsed = now - startTime;
              const progress = Math.min(elapsed / duration, 1);
              // easeOutCubic
              const eased = 1 - Math.pow(1 - progress, 3);
              const cur = target * eased;
              setValue(formatNumber(cur, decimals));
              if (progress < 1) requestAnimationFrame(tick);
              else setValue(formatNumber(target, decimals));
            };
            requestAnimationFrame(tick);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration, decimals]);

  return { ref, value };
}

function formatNumber(n: number, decimals: number): string {
  if (decimals === 0) return Math.round(n).toLocaleString('en-US');
  return n.toFixed(decimals);
}

// Smart count component for "K", "M" etc suffixes
export function useCountUpString(target: string, duration = 1800): { ref: RefObject<HTMLSpanElement>; display: string } {
  // Parse "600K", "5,300", "~31", "1,800", "1,200", etc
  const match = target.match(/^(~?)([\d,]+)(K|M)?(.*)$/);
  if (!match) {
    return { ref: useRef<HTMLSpanElement>(null) as any, display: target };
  }
  const prefix = match[1] || '';
  const numStr = match[2].replace(/,/g, '');
  const suffix = match[3] || '';
  const tail = match[4] || '';
  const num = parseInt(numStr, 10);
  const { ref, value } = useCountUp(num, duration);
  return { ref, display: `${prefix}${value}${suffix}${tail}` };
}
