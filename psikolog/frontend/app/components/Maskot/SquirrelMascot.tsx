import React from 'react';

export interface MascotMoodProps {
  mood: 'happy' | 'sad' | 'neutral' | 'cheering';
  width?: number;
  height?: number;
}

/**
 * Komponen Maskot Tupai (Squirrel) untuk Light Mode.
 * Me-load file SVG asli dari direktori public berdasarkan mood.
 */
export const SquirrelMascot: React.FC<MascotMoodProps> = ({
  mood,
  width = 110,
  height = 110
}) => {
  const moodPaths = {
    neutral: '/mascot/squirrel/Tupai.svg',
    happy: '/mascot/squirrel/Tupai_bahagia.svg',
    sad: '/mascot/squirrel/Tupai_sedih.svg',
    cheering: '/mascot/squirrel/Tupai_menyapa.svg'
  };

  const src = moodPaths[mood] || moodPaths.neutral;

  return (
    <div className="flex flex-col items-center justify-center py-2 select-none">
      <img
        src={src}
        alt={`Mascot Squirrel ${mood}`}
        style={{ width: `${width}px`, height: `${height}px` }}
        className="transition-transform duration-500 hover:scale-105"
      />
      <span className="text-[10px] font-extrabold text-amber-600 uppercase tracking-widest mt-1">
        {mood === 'happy' ? 'Yippee!' : mood === 'sad' ? 'Yuk coba lagi!' : mood === 'cheering' ? 'Hebat!' : 'Ayo!'}
      </span>
    </div>
  );
};

export default SquirrelMascot;
