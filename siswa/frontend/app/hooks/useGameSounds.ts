'use client';

/**
 * Hook untuk memainkan efek suara gamifikasi menggunakan Web Audio API.
 * Tidak memerlukan file audio eksternal — semua nada di-generate secara programatik.
 *
 * WHY Web Audio API:
 * Pendekatan ini dipilih karena bekerja offline, tidak butuh aset,
 * dan nadanya bisa dikontrol presisi untuk pengalaman anak-anak yang menyenangkan.
 */
export function useGameSounds() {

  /**
   * Memainkan nada ceria ascending (do-mi-sol) untuk jawaban BENAR.
   * Terinspirasi dari suara "correct" Duolingo yang memuaskan.
   */
  const playCorrect = () => {
    if (typeof window === 'undefined') return;
    try {
      const ctx = new AudioContext();

      // 3 nada ascending: C5 (523 Hz) -> E5 (659 Hz) -> G5 (784 Hz)
      const notes = [523.25, 659.25, 783.99];
      const duration = 0.12; // durasi tiap nada dalam detik
      const gap = 0.08;      // jeda antar nada

      notes.forEach((freq, i) => {
        const startTime = ctx.currentTime + i * (duration + gap);

        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(freq, startTime);

        // Envelope: fade in cepat, fade out halus
        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(0.35, startTime + 0.02);
        gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

        oscillator.start(startTime);
        oscillator.stop(startTime + duration);
      });

      // Tutup context setelah semua nada selesai
      setTimeout(() => ctx.close(), (notes.length * (duration + gap) + 0.5) * 1000);
    } catch (e) {
      // Ignore jika browser tidak support AudioContext
    }
  };

  /**
   * Memainkan nada pendek menurun untuk jawaban SALAH.
   * Terasa informatif tapi tidak menakutkan — cocok untuk anak-anak.
   */
  const playWrong = () => {
    if (typeof window === 'undefined') return;
    try {
      const ctx = new AudioContext();
      const startTime = ctx.currentTime;

      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.type = 'sine';

      // Sweep menurun dari 350 Hz ke 200 Hz — terasa "boop" yang lembut
      oscillator.frequency.setValueAtTime(350, startTime);
      oscillator.frequency.exponentialRampToValueAtTime(200, startTime + 0.3);

      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(0.3, startTime + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);

      oscillator.start(startTime);
      oscillator.stop(startTime + 0.35);

      setTimeout(() => ctx.close(), 800);
    } catch (e) {
      // Ignore jika browser tidak support AudioContext
    }
  };

  return { playCorrect, playWrong };
}

export default useGameSounds;
