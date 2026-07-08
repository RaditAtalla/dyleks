import React from 'react';
import { MascotMoodProps } from './SquirrelMascot';

/**
 * Komponen SVG Maskot Burung Hantu (Owl) untuk Dark Mode.
 * Burung Hantu merepresentasikan kebijaksanaan dan ketenangan belajar malam hari.
 * Dirancang agar serasi secara visual di dalam tema gelap/malam.
 */
export const OwlMascot: React.FC<MascotMoodProps> = ({
  mood,
  width = 110,
  height = 110
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-2 select-none">
      <svg
        width={width}
        height={height}
        viewBox="0 0 100 100"
        className="transition-transform duration-500 hover:scale-105"
      >
        <defs>
          {/* Bayangan neon glow tipis untuk suasana malam di dark mode */}
          <radialGradient id="owlShadow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1e1b4b" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#1e1b4b" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Bayangan lantai */}
        <ellipse cx="50" cy="88" rx="26" ry="5" fill="url(#owlShadow)" />

        <g className={mood === 'cheering' ? 'animate-bounce' : ''}>
          {/* Cakar Kiri & Kanan (Kaki Burung Hantu) */}
          <ellipse cx="38" cy="83" rx="5" ry="3" fill="#f59e0b" />
          <ellipse cx="62" cy="83" rx="5" ry="3" fill="#f59e0b" />

          {/* Telinga Kiri Burung Hantu (Ear Tufts) */}
          <path
            d="M 24 25 L 14 12 C 20 10, 26 14, 32 20 Z"
            fill="#4338ca"
            stroke="#3730a3"
            strokeWidth="2"
            strokeLinejoin="round"
          />

          {/* Telinga Kanan Burung Hantu (Ear Tufts) */}
          <path
            d="M 76 25 L 86 12 C 80 10, 74 14, 68 20 Z"
            fill="#4338ca"
            stroke="#3730a3"
            strokeWidth="2"
            strokeLinejoin="round"
          />

          {/* Badan Utama Oval Burung Hantu */}
          <ellipse
            cx="50"
            cy="52"
            rx="31"
            ry="31"
            fill="#4f46e5"
            stroke="#3730a3"
            strokeWidth="2.5"
          />

          {/* Bulu Dada / Perut (Light Chest Patch) */}
          <ellipse cx="50" cy="62" rx="20" ry="18" fill="#e0e7ff" />

          {/* Detail Bulu Dada (Feather Markings - Bentuk 'v' kecil) */}
          <path d="M 46 54 L 50 58 L 54 54 M 42 62 L 46 66 L 50 62 M 50 62 L 54 66 L 58 62" fill="none" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" />

          {/* Sayap Kiri dan Kanan */}
          {mood === 'cheering' ? (
            <>
              {/* Sayap dikepakkan ke atas */}
              <path
                d="M 19 48 Q 5 28 15 28 Z"
                fill="#4338ca"
                stroke="#3730a3"
                strokeWidth="2"
                strokeLinejoin="round"
              />
              <path
                d="M 81 48 Q 95 28 85 28 Z"
                fill="#4338ca"
                stroke="#3730a3"
                strokeWidth="2"
                strokeLinejoin="round"
              />
            </>
          ) : (
            <>
              {/* Sayap melipat rapat di sisi badan */}
              <path
                d="M 19 45 C 14 55, 14 65, 22 72 C 21 62, 21 52, 19 45 Z"
                fill="#4338ca"
                stroke="#3730a3"
                strokeWidth="2"
                strokeLinejoin="round"
              />
              <path
                d="M 81 45 C 86 55, 86 65, 78 72 C 79 62, 79 52, 81 45 Z"
                fill="#4338ca"
                stroke="#3730a3"
                strokeWidth="2"
                strokeLinejoin="round"
              />
            </>
          )}

          {/* Latar Belakang Lingkaran Mata Besar Hantu (Eye Plates) */}
          <circle cx="37" cy="43" r="10" fill="#312e81" />
          <circle cx="63" cy="43" r="10" fill="#312e81" />

          {/* Mata Tergantung Mood */}
          {mood === 'happy' && (
            <>
              {/* Mata melengkung bahagia ^ ^ */}
              <path d="M 32 43 Q 37 38 42 43" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" />
              <path d="M 58 43 Q 63 38 68 43" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" />
            </>
          )}

          {mood === 'sad' && (
            <>
              {/* Mata sedih miring \ / */}
              <path d="M 32 45 L 42 41" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" />
              <path d="M 58 41 L 68 45" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" />
            </>
          )}

          {(mood === 'neutral' || mood === 'cheering') && (
            <>
              {/* Mata bulat lebar khas burung hantu */}
              <circle cx="37" cy="43" r="7.5" fill="white" />
              <circle cx="63" cy="43" r="7.5" fill="white" />
              <circle cx="37" cy="43" r="3.5" fill="#1e1b4b" />
              <circle cx="63" cy="43" r="3.5" fill="#1e1b4b" />
              {/* Refleksi cahaya di pupil mata */}
              <circle cx="36" cy="41" r="1" fill="white" />
              <circle cx="62" cy="41" r="1" fill="white" />
            </>
          )}

          {/* Paruh Orange Kuning Segitiga (Beak) */}
          <polygon points="46,47 54,47 50,55" fill="#f59e0b" stroke="#d97706" strokeWidth="1" />

          {/* Pipi Merona Pink Halus */}
          {(mood === 'happy' || mood === 'cheering') && (
            <>
              <circle cx="26" cy="51" r="3" fill="#fda4af" opacity="0.4" />
              <circle cx="74" cy="51" r="3" fill="#fda4af" opacity="0.4" />
            </>
          )}
        </g>
      </svg>
      <span className="text-[10px] font-extrabold text-indigo-300 uppercase tracking-widest mt-1">
        {mood === 'happy' ? 'Hooray!' : mood === 'sad' ? 'Tetap semangat!' : mood === 'cheering' ? 'Bagus!' : 'Fokus!'}
      </span>
    </div>
  );
};
```
