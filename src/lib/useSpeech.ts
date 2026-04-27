'use client';
import { useState, useEffect, useRef } from 'react';

// Robust speech hook with iOS Safari workarounds
export function useSpeech(lang: 'he' | 'en') {
  // 'playing' is the ID of the currently-speaking utterance (or null)
  const [playing, setPlaying] = useState<string | null>(null);
  const [supported, setSupported] = useState(false);
  const keepAliveRef = useRef<any>(null);

  // Check support + pre-load voices on mount
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setSupported(false);
      return;
    }
    setSupported(true);

    // Trigger voice loading
    const loadVoices = () => window.speechSynthesis.getVoices();
    loadVoices();
    window.speechSynthesis.addEventListener?.('voiceschanged', loadVoices);

    // Cancel any leftover speech from previous page
    window.speechSynthesis.cancel();

    return () => {
      window.speechSynthesis.removeEventListener?.('voiceschanged', loadVoices);
      window.speechSynthesis.cancel();
    };
  }, []);

  // iOS keepalive — Safari pauses speech after ~15s, this resumes it
  useEffect(() => {
    if (!playing) {
      if (keepAliveRef.current) {
        clearInterval(keepAliveRef.current);
        keepAliveRef.current = null;
      }
      return;
    }
    keepAliveRef.current = setInterval(() => {
      if (typeof window !== 'undefined' && window.speechSynthesis?.speaking) {
        window.speechSynthesis.pause();
        window.speechSynthesis.resume();
      }
    }, 8000);
    return () => {
      if (keepAliveRef.current) clearInterval(keepAliveRef.current);
    };
  }, [playing]);

  // Cancel speech on lang change
  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    setPlaying(null);
  }, [lang]);

  const speak = (id: string, text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      alert(lang === 'he' ? 'דפדפן זה אינו תומך בקריינות קולית' : 'This browser does not support voice narration');
      return;
    }

    // Toggle off if same item is playing
    if (playing === id) {
      window.speechSynthesis.cancel();
      setPlaying(null);
      return;
    }

    // Cancel anything currently playing
    window.speechSynthesis.cancel();

    // Mark as playing immediately for UI responsiveness
    setPlaying(id);

    // Small delay to let cancel() complete, esp. on iOS
    setTimeout(() => {
      try {
        const u = new SpeechSynthesisUtterance(text);
        u.lang = lang === 'he' ? 'he-IL' : 'en-US';
        u.rate = 0.78;
        u.pitch = 0.85;
        u.volume = 1;
        u.onend = () => setPlaying(null);
        u.onerror = (e) => {
          console.warn('Speech synthesis error:', e);
          setPlaying(null);
        };
        window.speechSynthesis.speak(u);
      } catch (err) {
        console.error('Speech setup failed:', err);
        setPlaying(null);
      }
    }, 80);
  };

  const stop = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setPlaying(null);
  };

  return { playing, supported, speak, stop };
}
