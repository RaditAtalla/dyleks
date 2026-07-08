import React, { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';

interface HeartsDisplayProps {
  hearts: number;
  maxHearts?: number;
}

/**
 * Menampilkan sisa nyawa (hearts) dengan efek animasi detak/getar saat nilai nyawa berkurang.
 * Penting untuk menarik atensi visual anak terhadap sisa kesempatan mereka dalam game.
 */
export const HeartsDisplay: React.FC<HeartsDisplayProps> = ({ hearts, maxHearts = 5 }) => {
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    setPulse(true);
    const timer = setTimeout(() => setPulse(false), 500);
    return () => clearTimeout(timer);
  }, [hearts]);

  return (
    <div className={`flex items-center gap-1.5 transition-transform duration-300 ${pulse ? 'scale-110 text-rose-600' : 'text-slate-400'}`}>
      {Array.from({ length: maxHearts }).map((_, index) => {
        const isActive = index < hearts;
        return (
          <Heart
            key={index}
            className={`w-5 h-5 transition-all duration-300 ${
              isActive 
                ? 'fill-rose-500 text-rose-500 scale-100 drop-shadow-[0_2px_4px_rgba(244,63,94,0.25)]' 
                : 'text-slate-200 scale-90'
            }`}
          />
        );
      })}
    </div>
  );
};

export default HeartsDisplay;
