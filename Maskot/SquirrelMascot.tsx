import React from 'react';

export interface MascotMoodProps {
  mood: 'happy' | 'sad' | 'neutral' | 'cheering';
  width?: number;
  height?: number;
}

/**
 * Komponen SVG Maskot Tupai (Squirrel) untuk Light Mode.
 * Tupai dipilih karena merepresentasikan ketangkasan dan fokus belajar yang ramah anak.
 * Dilengkapi dengan parameter mood dinamis untuk merespons hasil pengerjaan game siswa.
 */
export const SquirrelMascot: React.FC<MascotMoodProps> = ({
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
          {/* Efek bayangan di bawah kaki maskot untuk kesan melayang (3D depth) */}
          <radialGradient id="squirrelShadow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#cbd5e1" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#cbd5e1" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Bayangan lantai */}
        <ellipse cx="50" cy="88" rx="28" ry="5" fill="url(#squirrelShadow)" />

        <g className={mood === 'cheering' ? 'animate-bounce' : ''}>
          {/* Ekor Tupai Besar & Berbulu Tebal di Belakang (Kanan) */}
          <path
            d="M 58 72 C 82 82, 92 68, 92 52 C 92 32, 75 18, 70 30 C 65 42, 78 52, 64 64 C 60 68, 58 70, 58 72 Z"
            fill="#b45309"
            stroke="#92400e"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          {/* Aksen bulu bagian dalam ekor */}
          <path
            d="M 66 66 C 78 72, 85 64, 85 52 C 85 38, 76 28, 73 35 C 70 42, 78 48, 68 58"
            fill="none"
            stroke="#ea580c"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Kaki Kiri dan Kanan */}
          <ellipse cx="38" cy="82" rx="6" ry="4" fill="#92400e" />
          <ellipse cx="62" cy="82" rx="6" ry="4" fill="#92400e" />

          {/* Telinga Kiri Tupai (Pointy Ear) */}
          <path
            d="M 28 26 L 20 8 C 24 6, 28 12, 34 22 Z"
            fill="#d97706"
            stroke="#b45309"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <path d="M 27 24 L 22 12 C 24 11, 26 14, 30 20 Z" fill="#ffedd5" />

          {/* Telinga Kanan Tupai (Pointy Ear) */}
          <path
            d="M 72 26 L 80 8 C 76 6, 72 12, 66 22 Z"
            fill="#d97706"
            stroke="#b45309"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <path d="M 73 24 L 78 12 C 76 11, 74 14, 70 20 Z" fill="#ffedd5" />

          {/* Badan Utama Bulat Tupai */}
          <ellipse
            cx="50"
            cy="52"
            rx="30"
            ry="32"
            fill="#d97706"
            stroke="#b45309"
            strokeWidth="2.5"
          />

          {/* Lingkaran Dada (Light Patch) */}
          <ellipse cx="50" cy="62" rx="20" ry="20" fill="#fef3c7" />

          {/* Tangan Kiri dan Kanan (Tupai memegang sesuatu atau bersorak) */}
          {mood === 'cheering' ? (
            <>
              {/* Tangan menunjuk ke atas */}
              <path d="M 22 45 Q 12 30 16 26" fill="none" stroke="#b45309" strokeWidth="6" strokeLinecap="round" />
              <path d="M 22 45 Q 12 30 16 26" fill="none" stroke="#d97706" strokeWidth="4" strokeLinecap="round" />
              <path d="M 78 45 Q 88 30 84 26" fill="none" stroke="#b45309" strokeWidth="6" strokeLinecap="round" />
              <path d="M 78 45 Q 88 30 84 26" fill="none" stroke="#d97706" strokeWidth="4" strokeLinecap="round" />
            </>
          ) : (
            <>
              {/* Tangan memeluk dada (imut) */}
              <ellipse cx="24" cy="54" rx="5" ry="4" fill="#b45309" />
              <ellipse cx="24" cy="54" rx="4" ry="3" fill="#d97706" />
              <ellipse cx="76" cy="54" rx="5" ry="4" fill="#b45309" />
              <ellipse cx="76" cy="54" rx="4" ry="3" fill="#d97706" />
            </>
          )}

          {/* Mata Tergantung Mood */}
          {mood === 'happy' && (
            <>
              {/* Mata tersenyum lengkung ^ ^ */}
              <path d="M 33 46 Q 38 41 43 46" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" />
              <path d="M 57 46 Q 62 41 67 46" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" />
            </>
          )}

          {mood === 'sad' && (
            <>
              {/* Mata sedih miring \ / */}
              <path d="M 33 48 L 43 44" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" />
              <path d="M 57 44 L 67 48" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" />
            </>
          )}

          {(mood === 'neutral' || mood === 'cheering') && (
            <>
              {/* Mata bulat lebar ekspresif */}
              <circle cx="38" cy="45" r="6.5" fill="white" />
              <circle cx="62" cy="45" r="6.5" fill="white" />
              <circle cx="39" cy="44" r="3" fill="#451a03" />
              <circle cx="63" cy="44" r="3" fill="#451a03" />
              {/* Kilauan mata putih kecil */}
              <circle cx="37" cy="42" r="1" fill="white" />
              <circle cx="61" cy="42" r="1" fill="white" />
            </>
          )}

          {/* Hidung Kecil Imut Segitiga Terbalik */}
          <polygon points="47,52 53,52 50,55" fill="#451a03" />

          {/* Mulut Tergantung Mood */}
          {mood === 'happy' || mood === 'cheering' ? (
            /* Senyum lebar dan gigi tupai khas */
            <>
              <path d="M 44 58 Q 50 66 56 58" fill="none" stroke="#451a03" strokeWidth="2.5" strokeLinecap="round" />
              <rect x="48" y="58" width="4" height="3" fill="white" stroke="#451a03" strokeWidth="1" />
            </>
          ) : mood === 'sad' ? (
            <path d="M 44 61 Q 50 54 56 61" fill="none" stroke="#451a03" strokeWidth="2.5" strokeLinecap="round" />
          ) : (
            /* Garis datar imut */
            <line x1="44" y1="58" x2="56" y2="58" stroke="#451a03" strokeWidth="2.5" strokeLinecap="round" />
          )}

          {/* Pipi Merona Pink */}
          {(mood === 'happy' || mood === 'cheering') && (
            <>
              <circle cx="28" cy="51" r="3" fill="#f43f5e" opacity="0.5" />
              <circle cx="72" cy="51" r="3" fill="#f43f5e" opacity="0.5" />
            </>
          )}
        </g>
      </svg>
      <span className="text-[10px] font-extrabold text-amber-600 uppercase tracking-widest mt-1">
        {mood === 'happy' ? 'Yippee!' : mood === 'sad' ? 'Yuk coba lagi!' : mood === 'cheering' ? 'Hebat!' : 'Ayo!'}
      </span>
    </div>
  );
};
```
