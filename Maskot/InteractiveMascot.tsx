import React, { useEffect, useState } from 'react';
import { SquirrelMascot, MascotMoodProps } from './SquirrelMascot';
import { OwlMascot } from './OwlMascot';

interface InteractiveMascotProps extends MascotMoodProps {
  theme?: 'light' | 'dark';
}

/**
 * Komponen utama Maskot Interaktif yang bertindak sebagai router/penyeleksi visual.
 * - Renders SquirrelMascot (Tupai) saat Light Mode.
 * - Renders OwlMascot (Burung Hantu) saat Dark Mode.
 * 
 * Melakukan deteksi otomatis pada level document.documentElement atau matchMedia jika prop theme tidak disuplai secara eksplisit.
 */
export const InteractiveMascot: React.FC<InteractiveMascotProps> = ({
  mood,
  theme,
  width,
  height
}) => {
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // 1. Jika ada prop theme yang dikirim secara eksplisit, prioritaskan itu
    if (theme) {
      setResolvedTheme(theme);
      return;
    }

    // 2. Cek class "dark" pada elemen HTML (standar Tailwind class-based dark mode)
    const checkTheme = () => {
      const isDarkClass = document.documentElement.classList.contains('dark');
      if (isDarkClass) {
        setResolvedTheme('dark');
        return;
      }

      // 3. Fallback ke media query sistem operasi
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      setResolvedTheme(mediaQuery.matches ? 'dark' : 'light');
    };

    checkTheme();

    // Daftarkan listener jika class list berubah atau preference OS berubah
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleMediaChange = (e: MediaQueryListEvent) => {
      if (!theme) {
        setResolvedTheme(e.matches ? 'dark' : 'light');
      }
    };

    // MutationObserver untuk memantau perubahan class pada elemen <html>
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class' && !theme) {
          const isDark = document.documentElement.classList.contains('dark');
          setResolvedTheme(isDark ? 'dark' : 'light');
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });
    mediaQuery.addEventListener('change', handleMediaChange);

    return () => {
      observer.disconnect();
      mediaQuery.removeEventListener('change', handleMediaChange);
    };
  }, [theme]);

  if (resolvedTheme === 'dark') {
    return <OwlMascot mood={mood} width={width} height={height} />;
  }

  return <SquirrelMascot mood={mood} width={width} height={height} />;
};
export default InteractiveMascot;
