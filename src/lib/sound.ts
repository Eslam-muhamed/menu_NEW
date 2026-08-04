/**
 * Generates a pleasant two-tone ascending chime using Web Audio API.
 * No external files needed — pure synthesis.
 */
export function playCartAdd() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();

    const play = (freq: number, startAt: number, duration: number, gainPeak: number) => {
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type      = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + startAt);

      // Envelope: quick attack → smooth decay
      gain.gain.setValueAtTime(0, ctx.currentTime + startAt);
      gain.gain.linearRampToValueAtTime(gainPeak, ctx.currentTime + startAt + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startAt + duration);

      osc.start(ctx.currentTime + startAt);
      osc.stop(ctx.currentTime + startAt + duration + 0.05);

      osc.onended = () => {
        osc.disconnect();
        gain.disconnect();
      };
    };

    // Note 1: soft pop  (E5 ≈ 659 Hz)
    play(659, 0.00, 0.18, 0.28);
    // Note 2: high ding (C6 ≈ 1047 Hz) — slightly delayed for ascending feel
    play(1047, 0.10, 0.25, 0.20);

    // Close context after sounds finish
    setTimeout(() => ctx.close(), 800);
  } catch {
    // Silently ignore if Audio API unavailable
  }
}