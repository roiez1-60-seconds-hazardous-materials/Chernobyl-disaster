'use client';
// Synthesized nuclear disaster soundscape using Web Audio API.
// No external audio files. Generates: Geiger clicks, sub-bass drone,
// distant air-raid siren wails, electrical hum.

export class Soundscape {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private timers: ReturnType<typeof setTimeout>[] = [];
  private nodes: AudioNode[] = [];
  public running = false;

  async start() {
    if (this.running) return;
    try {
      // Audio context must be created/resumed on user gesture
      const Ctx: typeof AudioContext = (window as any).AudioContext || (window as any).webkitAudioContext;
      if (!Ctx) return;
      this.ctx = new Ctx();
      if (this.ctx.state === 'suspended') await this.ctx.resume();

      this.master = this.ctx.createGain();
      this.master.gain.value = 0;
      this.master.connect(this.ctx.destination);

      this.buildDrone();
      this.buildGeiger();
      this.buildSiren();
      this.buildHum();

      // Fade in
      const now = this.ctx.currentTime;
      this.master.gain.cancelScheduledValues(now);
      this.master.gain.linearRampToValueAtTime(0.45, now + 1.5);

      this.running = true;
    } catch (e) {
      console.warn('Soundscape failed to start:', e);
    }
  }

  stop() {
    if (!this.running || !this.ctx || !this.master) {
      this.running = false;
      return;
    }
    const ctx = this.ctx;
    const master = this.master;
    const now = ctx.currentTime;
    master.gain.cancelScheduledValues(now);
    master.gain.linearRampToValueAtTime(0, now + 0.8);
    setTimeout(() => {
      try {
        this.timers.forEach(clearTimeout);
        this.timers = [];
        this.nodes.forEach((n: any) => {
          try { n.stop?.(); n.disconnect?.(); } catch {}
        });
        this.nodes = [];
        ctx.close();
      } catch {}
      this.ctx = null;
      this.master = null;
    }, 900);
    this.running = false;
  }

  // ----- Sub-bass drone (tension) -----
  private buildDrone() {
    if (!this.ctx || !this.master) return;
    const ctx = this.ctx;

    const o1 = ctx.createOscillator();
    o1.type = 'sawtooth';
    o1.frequency.value = 55;
    const o2 = ctx.createOscillator();
    o2.type = 'sawtooth';
    o2.frequency.value = 55.7; // detuned for thickness
    const o3 = ctx.createOscillator();
    o3.type = 'sine';
    o3.frequency.value = 27.5; // sub-bass

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 220;
    filter.Q.value = 1;

    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.07;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 80;
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    const gain = ctx.createGain();
    gain.gain.value = 0.35;

    o1.connect(filter);
    o2.connect(filter);
    o3.connect(filter);
    filter.connect(gain);
    gain.connect(this.master);

    [o1, o2, o3, lfo].forEach((o) => o.start());
    this.nodes.push(o1, o2, o3, lfo, filter, lfoGain, gain);
  }

  // ----- Electrical hum at 50Hz -----
  private buildHum() {
    if (!this.ctx || !this.master) return;
    const ctx = this.ctx;

    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = 50; // Soviet grid frequency

    const harmonics = ctx.createOscillator();
    harmonics.type = 'sine';
    harmonics.frequency.value = 100;

    const gain = ctx.createGain();
    gain.gain.value = 0.04;

    osc.connect(gain);
    harmonics.connect(gain);
    gain.connect(this.master);

    osc.start();
    harmonics.start();
    this.nodes.push(osc, harmonics, gain);
  }

  // ----- Geiger counter clicks (random Poisson) -----
  private buildGeiger() {
    if (!this.ctx || !this.master) return;
    const ctx = this.ctx;

    const click = () => {
      if (!this.ctx || !this.master) return;
      // White noise burst → bandpass → quick decay
      const buffer = ctx.createBuffer(1, ctx.sampleRate * 0.04, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1);

      const src = ctx.createBufferSource();
      src.buffer = buffer;

      const bp = ctx.createBiquadFilter();
      bp.type = 'bandpass';
      bp.frequency.value = 2400 + Math.random() * 1200;
      bp.Q.value = 6;

      const g = ctx.createGain();
      const now = ctx.currentTime;
      g.gain.setValueAtTime(0.0001, now);
      g.gain.exponentialRampToValueAtTime(0.18, now + 0.001);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

      src.connect(bp);
      bp.connect(g);
      g.connect(this.master);
      src.start(now);
      src.stop(now + 0.05);

      // Schedule next click — random rate, occasional bursts
      const burst = Math.random() < 0.18;
      const next = burst ? 30 + Math.random() * 50 : 250 + Math.random() * 1400;
      this.timers.push(setTimeout(click, next));
    };

    click();
  }

  // ----- Distant air-raid siren wails (occasional) -----
  private buildSiren() {
    if (!this.ctx || !this.master) return;
    const ctx = this.ctx;

    const wail = () => {
      if (!this.ctx || !this.master) return;
      const o = ctx.createOscillator();
      o.type = 'sine';
      const now = ctx.currentTime;
      // Rising-falling pitch sweep typical of Soviet civil defense siren
      o.frequency.setValueAtTime(220, now);
      o.frequency.linearRampToValueAtTime(420, now + 1.2);
      o.frequency.linearRampToValueAtTime(220, now + 2.4);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 1500;

      const reverbDelay = ctx.createDelay(1);
      reverbDelay.delayTime.value = 0.18;
      const reverbFb = ctx.createGain();
      reverbFb.gain.value = 0.35;

      const g = ctx.createGain();
      g.gain.setValueAtTime(0, now);
      g.gain.linearRampToValueAtTime(0.06, now + 0.6);
      g.gain.linearRampToValueAtTime(0.04, now + 2);
      g.gain.linearRampToValueAtTime(0, now + 2.5);

      o.connect(filter);
      filter.connect(g);
      g.connect(reverbDelay);
      reverbDelay.connect(reverbFb);
      reverbFb.connect(reverbDelay);
      reverbDelay.connect(this.master);
      g.connect(this.master);

      o.start(now);
      o.stop(now + 2.6);

      // Next wail randomly between 9-22 sec
      this.timers.push(setTimeout(wail, 9000 + Math.random() * 13000));
    };

    // Initial delay
    this.timers.push(setTimeout(wail, 4000));
  }

  // ----- One-shot explosion sound (call externally) -----
  public boom() {
    if (!this.ctx || !this.master) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    // Low-freq impact
    const impact = ctx.createOscillator();
    impact.type = 'sine';
    impact.frequency.setValueAtTime(60, now);
    impact.frequency.exponentialRampToValueAtTime(20, now + 0.6);

    const noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 1.5, ctx.sampleRate);
    const data = noiseBuf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1);
    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuf;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, now);
    filter.frequency.exponentialRampToValueAtTime(50, now + 1.2);

    const g = ctx.createGain();
    g.gain.setValueAtTime(0, now);
    g.gain.linearRampToValueAtTime(0.6, now + 0.02);
    g.gain.exponentialRampToValueAtTime(0.001, now + 1.4);

    impact.connect(g);
    noise.connect(filter);
    filter.connect(g);
    g.connect(this.master);

    impact.start(now);
    impact.stop(now + 0.7);
    noise.start(now);
    noise.stop(now + 1.5);
  }
}

// Singleton instance
let instance: Soundscape | null = null;
export function getSoundscape(): Soundscape {
  if (!instance) instance = new Soundscape();
  return instance;
}
