import React from 'react';
import { MascotMoodProps } from './SquirrelMascot';

/**
 * Komponen Maskot Burung Hantu (Owl) untuk Dark Mode.
 * Me-load file SVG asli dari direktori public berdasarkan mood.
 */
export const OwlMascot: React.FC<MascotMoodProps> = ({
  mood,
  width = 110,
  height = 110
}) => {
  const moodPaths = {
    neutral: '/mascot/owl/Buruhantu.svg',
    happy: '/mascot/owl/Buruhantu_bahagia.svg',
    sad: '/mascot/owl/Buruhantu_sedih.svg',
    cheering: '/mascot/owl/Buruhantu_menyapa.svg'
  };

  const src = moodPaths[mood] || moodPaths.neutral;

  return (
    <div className="flex flex-col items-center justify-center py-2 select-none">
      <img
        src={src}
        alt={`Mascot Owl ${mood}`}
        style={{ width: `${width}px`, height: `${height}px` }}
        className="transition-transform duration-500 hover:scale-105"
      />
      <span className="text-[10px] font-extrabold text-indigo-300 uppercase tracking-widest mt-1">
        {mood === 'happy' ? 'Hooray!' : mood === 'sad' ? 'Tetap semangat!' : mood === 'cheering' ? 'Bagus!' : 'Fokus!'}
      </span>
    </div>
  );
};

export default OwlMascot;
