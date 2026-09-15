/**
 * Web Audio API gentle synthesizer for preschool relaxation sounds.
 * Generates soft, calming, non-intrusive soundscapes locally without external media links.
 */

let audioCtx: AudioContext | null = null;
let currentNoiseNode: AudioNode | null = null;
let currentGainNode: GainNode | null = null;
let natureInterval: number | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export function stopAmbientSound() {
  if (natureInterval) {
    window.clearInterval(natureInterval);
    natureInterval = null;
  }
  if (currentGainNode && audioCtx) {
    try {
      const now = audioCtx.currentTime;
      currentGainNode.gain.setValueAtTime(currentGainNode.gain.value, now);
      currentGainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);
      setTimeout(() => {
        try {
          currentNoiseNode?.disconnect();
          currentGainNode?.disconnect();
        } catch {
          // ignore
        }
        currentNoiseNode = null;
        currentGainNode = null;
      }, 600);
    } catch {
      currentNoiseNode = null;
      currentGainNode = null;
    }
  } else {
    currentNoiseNode = null;
    currentGainNode = null;
  }
}

export function playAmbientSound(soundType: 'hujan' | 'ombak' | 'alam' | 'tanpa_bunyi', isMuted: boolean) {
  stopAmbientSound();
  if (isMuted || soundType === 'tanpa_bunyi') return;

  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    if (soundType === 'hujan') {
      // Soft gentle pink/brown noise with lowpass filter
      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        lastOut = (lastOut + 0.02 * white) / 1.02;
        data[i] = lastOut * 1.5;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(750, ctx.currentTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.05, ctx.currentTime + 1.2);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start();
      currentNoiseNode = noise;
      currentGainNode = gain;
    } else if (soundType === 'ombak') {
      // Periodic ocean wave swell
      const bufferSize = ctx.sampleRate * 3;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99 * b0 + white * 0.05;
        b1 = 0.95 * b1 + white * 0.05;
        b2 = 0.85 * b2 + white * 0.05;
        data[i] = (b0 + b1 + b2) * 0.4;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, ctx.currentTime);

      const swellGain = ctx.createGain();
      const lfo = ctx.createOscillator();
      lfo.frequency.setValueAtTime(0.12, ctx.currentTime); // ~8 sec ocean cycle
      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(0.035, ctx.currentTime);
      lfo.connect(lfoGain);

      swellGain.gain.setValueAtTime(0.04, ctx.currentTime);
      lfoGain.connect(swellGain.gain);

      noise.connect(filter);
      filter.connect(swellGain);
      swellGain.connect(ctx.destination);

      noise.start();
      lfo.start();
      currentNoiseNode = noise;
      currentGainNode = swellGain;
    } else if (soundType === 'alam') {
      // Soft gentle chime bells / warm ambient tones at slow random intervals
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.connect(ctx.destination);
      currentGainNode = gain;

      const pentatonic = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25]; // C D E G A C
      const playTone = () => {
        if (!ctx || ctx.state === 'closed') return;
        const osc = ctx.createOscillator();
        const noteGain = ctx.createGain();
        const freq = pentatonic[Math.floor(Math.random() * pentatonic.length)];
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        const now = ctx.currentTime;
        noteGain.gain.setValueAtTime(0, now);
        noteGain.gain.linearRampToValueAtTime(0.035, now + 0.15);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, now + 3.0);

        osc.connect(noteGain);
        noteGain.connect(gain);

        osc.start(now);
        osc.stop(now + 3.1);
      };

      playTone();
      natureInterval = window.setInterval(playTone, 3200);
    }
  } catch {
    // Graceful silent fallback if Web Audio is blocked
  }
}

export function playSoftChime(isMuted: boolean, type: 'inhale' | 'exhale' | 'click' | 'success') {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const now = ctx.currentTime;

    if (type === 'inhale') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(330, now + 3.5);
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.025, now + 1.0);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.8);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 4);
    } else if (type === 'exhale') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(330, now);
      osc.frequency.exponentialRampToValueAtTime(196, now + 3.5);
      gain.gain.setValueAtTime(0.025, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.8);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 4);
    } else if (type === 'click') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, now);
      gain.gain.setValueAtTime(0.02, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.09);
    } else if (type === 'success') {
      [523.25, 659.25, 783.99].forEach((f, idx) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = 'sine';
        o.frequency.setValueAtTime(f, now + idx * 0.12);
        g.gain.setValueAtTime(0.03, now + idx * 0.12);
        g.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.12 + 0.8);
        o.connect(g);
        g.connect(ctx.destination);
        o.start(now + idx * 0.12);
        o.stop(now + idx * 0.12 + 0.9);
      });
    }
  } catch {
    // audio failure silent bypass
  }
}
