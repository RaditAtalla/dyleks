'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useStudentAuth } from '../../hooks/useStudentAuth';
import { Bubble } from '../../types';
import { getChallengePool } from '../challenge-pools';
import PlayStage from './_components/PlayStage';
import { useGameSounds } from '../../hooks/useGameSounds';
import { Suspense } from 'react';
import SubLevelMap from '../../components/SubLevelMap';
import { useSubLevelProgress } from '../../hooks/useSubLevelProgress';

// Pool of filler syllables to spawn as distractors
const FILLER_SYLLABLES = [
  'BA', 'CA', 'DA', 'MA', 'SA', 'LI', 'KU', 'TO',
  'PA', 'KA', 'TA', 'SI', 'LU', 'RO', 'PI', 'NA',
  'JA', 'BO', 'NE', 'KE', 'RE', 'DE', 'PE', 'GE',
  'ME', 'TI', 'GA', 'RU', 'MIN', 'TUL', 'LIS', 'KAN',
  'RI', 'PU', 'KA', 'LI', 'BE', 'BU', 'KI', 'HA',
  'NO', 'DI', 'KO', 'NYI', 'NGU', 'MI', 'LA', 'SE'
];

// Helper to split words into syllables (for Level 5 Kata Dasar words)
function getWordSyllables(word: string): string[] {
  const w = word.toUpperCase();
  const splits: Record<string, string[]> = {
    'MAIN': ['MA', 'IN'],
    'BACA': ['BA', 'CA'],
    'TULIS': ['TU', 'LIS'],
    'MAKAN': ['MA', 'KAN'],
    'LARI': ['LA', 'RI'],
    'SAPU': ['SA', 'PU'],
    'BUKA': ['BU', 'KA'],
    'BELI': ['BE', 'LI'],
  };
  return splits[w] || [w];
}

// Nada suara dimainkan menggunakan hook useGameSounds bawaan portal siswa

export default function LetuskanBalon() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-[#FAF6EE] p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-500 border-t-transparent" />
          <p className="text-xs text-slate-400 font-medium">Memuat game...</p>
        </div>
      </div>
    }>
      <LetuskanBalonContent />
    </Suspense>
  );
}

function LetuskanBalonContent() {
  const { student, loading, requireAuth } = useStudentAuth();
  const router = useRouter();
  const { playCorrect, playWrong } = useGameSounds();
  const searchParams = useSearchParams();
  const levelParam = searchParams.get('level');

  const studentLevel = levelParam ? parseInt(levelParam, 10) : (student?.currentLevel || 1);

  const { stageProgress, activeStageNum, setActiveStageNum, handleStageWin } = useSubLevelProgress({
    gameKey: 'balon',
    studentLevel,
  });

  // Map vs Game stage
  const [gameStage, setGameStage] = useState<'map' | 'game'>('map');
  const [stageWordsRight, setStageWordsRight] = useState(0);
  const WORDS_TO_WIN = 5;

  const getLevelName = (lvl: number) => {
    const names: Record<number, string> = {
      1: 'Vokal Tunggal', 2: 'Suku Kata Tunggal', 3: 'Suku Kata Kompleks',
      4: 'Digraf & Diftong', 5: 'Kata Dasar', 6: 'Suku Kata Blending',
      7: 'Diskriminasi Visual', 8: 'Morfologi Kata'
    };
    return names[lvl] || 'Kemampuan Dasar';
  };

  // Enforce authentication check
  useEffect(() => {
    requireAuth();
  }, [student, loading, requireAuth]);

  // Scores
  const [rightCount, setRightCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);

  // Word Game Round State
  const [currentWord, setCurrentWord] = useState('');
  const [currentSyllables, setCurrentSyllables] = useState<string[]>([]);
  const [currentSyllableIndex, setCurrentSyllableIndex] = useState(0);

  // Animation visual feedback
  const [isWrongFlash, setIsWrongFlash] = useState(false);

  // Bubble Balloons State
  const [bubbles, setBubbles] = useState<Bubble[]>([]);

  // Refs for animation tick loop to read latest state without re-creating loop
  const targetSyllableRef = useRef<string>('');
  const allSyllablesRef = useRef<string[]>([]);
  const currentSyllablesOnScreenRef = useRef<string[]>([]);

  useEffect(() => {
    targetSyllableRef.current = currentSyllables[currentSyllableIndex] || '';
    allSyllablesRef.current = currentSyllables;
  }, [currentSyllables, currentSyllableIndex]);

  useEffect(() => {
    currentSyllablesOnScreenRef.current = bubbles.map((b) => b.syllable);
  }, [bubbles]);

  // Generate a brand new bubble balloon
  const createBubble = useCallback((spawnAtBottom = false): Bubble => {
    const targetSyllable = targetSyllableRef.current;
    const wordSyllables = allSyllablesRef.current;
    const screenSyllables = currentSyllablesOnScreenRef.current;

    // Syllable selection logic based on probability
    let syllable = '';
    const rand = Math.random();

    // Check if target syllable is already on screen
    const targetOnScreenCount = screenSyllables.filter(s => s === targetSyllable).length;

    if (targetSyllable && (targetOnScreenCount === 0 || rand < 0.4)) {
      // 1. Prioritize current required syllable
      syllable = targetSyllable;
    } else if (wordSyllables.length > 0 && rand < 0.55) {
      // 2. Spawn a random syllable belonging to the current target word
      const idx = Math.floor(Math.random() * wordSyllables.length);
      syllable = wordSyllables[idx];
    } else {
      // 3. Distractor filler syllable
      const idx = Math.floor(Math.random() * FILLER_SYLLABLES.length);
      syllable = FILLER_SYLLABLES[idx];
    }

    const size = Math.floor(Math.random() * 16) + 64; // 64px to 80px diameter
    const startY = spawnAtBottom ? 105 + Math.random() * 10 : Math.random() * 85 + 10;

    return {
      id: `bubble-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      syllable: syllable.toUpperCase(),
      baseX: Math.random() * 70 + 15, // keep within 15% and 85% width
      x: 50,
      y: startY,
      speed: Math.random() * 0.15 + 0.15, // float up speed (0.15% to 0.30% per frame)
      size,
      colorIndex: Math.floor(Math.random() * 6),
      waveOffset: Math.random() * 360,
      amplitude: Math.random() * 4 + 3, // sway width
      frequency: Math.random() * 8 + 12, // wave scale
    };
  }, []);

  // Initialize bubbles
  const initializeBubbles = useCallback(() => {
    const initialList: Bubble[] = [];
    for (let i = 0; i < 6; i++) {
      initialList.push(createBubble(false));
    }
    setBubbles(initialList);
  }, [createBubble]);

  // Start new round word
  const startNewRound = useCallback((resetScores = false) => {
    if (resetScores) {
      setRightCount(0);
      setWrongCount(0);
    }

    // 1. Get word pool (Level-powered challenge pool)
    const studentLevel = levelParam ? parseInt(levelParam, 10) : (student?.currentLevel || 1);
    const pool = getChallengePool(studentLevel);
    const poolItems = pool?.items || ['BOLA'];

    // 2. Choose random target word
    const nextWord = poolItems[Math.floor(Math.random() * poolItems.length)];
    const wordSyllables = getWordSyllables(nextWord);

    // 3. Reset round details
    setCurrentWord(nextWord);
    setCurrentSyllables(wordSyllables);
    setCurrentSyllableIndex(0);

    // Set refs values immediately for next thread loops
    targetSyllableRef.current = wordSyllables[0];
    allSyllablesRef.current = wordSyllables;

    // 4. Populate game area balloons
    const initialList: Bubble[] = [];
    for (let i = 0; i < 6; i++) {
      // stagger initial heights so they don't spawn in a single line
      const b = createBubble(false);
      b.y = 80 - i * 18; // distribute spacing from top to bottom
      initialList.push(b);
    }
    setBubbles(initialList);
  }, [student?.currentLevel, createBubble]);

  // Setup round on mount / auth loads
  useEffect(() => {
    if (student) {
      startNewRound(true);
    }
  }, [student]);

  // Floating animation render loop
  useEffect(() => {
    if (!student || bubbles.length === 0) return;

    let animFrameId: number;

    const tick = () => {
      setBubbles((prev) =>
        prev.map((b) => {
          const nextY = b.y - b.speed;
          // Sine wave horizontal drift simulation
          const wave = Math.sin((nextY + b.waveOffset) / b.frequency) * b.amplitude;
          const nextX = Math.max(8, Math.min(92, b.baseX + wave));

          if (nextY < -15) {
            // Re-spawn bubble at bottom
            return createBubble(true);
          }

          return {
            ...b,
            y: nextY,
            x: nextX,
          };
        })
      );

      animFrameId = requestAnimationFrame(tick);
    };

    animFrameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animFrameId);
  }, [student, bubbles.length, createBubble]);

  // Handle pop action click
  const handlePopBubble = (bubbleId: string) => {
    const bubbleIndex = bubbles.findIndex((b) => b.id === bubbleId);
    if (bubbleIndex === -1) return;

    const clickedBubble = bubbles[bubbleIndex];
    const expectedSyllable = currentSyllables[currentSyllableIndex].toUpperCase();

    if (clickedBubble.syllable === expectedSyllable) {
      // SUCCESS: Correct syllable popped!
      playCorrect();

      // Check if word completed
      const nextIndex = currentSyllableIndex + 1;
      if (nextIndex >= currentSyllables.length) {
        setRightCount((prev) => prev + 1);
        const newWordsDone = stageWordsRight + 1;
        
        // Brief pause to display all indicators active, then trigger next word
        setTimeout(async () => {
          if (newWordsDone >= WORDS_TO_WIN) {
            setStageWordsRight(0);
            await handleStageWin();
            setGameStage('map');
          } else {
            setStageWordsRight(newWordsDone);
            startNewRound(false);
          }
        }, 600);
      } else {
        setCurrentSyllableIndex(nextIndex);
      }

      // Recreate popped bubble at bottom
      setBubbles((prev) => {
        const nextList = [...prev];
        nextList[bubbleIndex] = createBubble(true);
        return nextList;
      });
    } else {
      // FAIL: Wrong syllable popped!
      playWrong();
      setWrongCount((prev) => prev + 1);

      // Reset sequence progress back to first syllable of the word
      setCurrentSyllableIndex(0);

      // Trigger visual shake and screen red flash feedback
      setIsWrongFlash(true);
      setTimeout(() => {
        setIsWrongFlash(false);
      }, 400);

      // Recreate popped bubble at bottom
      setBubbles((prev) => {
        const nextList = [...prev];
        nextList[bubbleIndex] = createBubble(true);
        return nextList;
      });
    }
  };

  // Restart perm
  const handleRestart = () => {
    const confirmReset = window.confirm(
      'Ulangi permainan dari awal? Skor saat ini akan diatur kembali ke 0.'
    );
    if (confirmReset) {
      startNewRound(true);
    }
  };

  // Quit perm
  const handleQuit = () => {
    const confirmQuit = window.confirm('Apakah kamu yakin ingin keluar dari permainan?');
    if (confirmQuit) {
      setGameStage('map');
    }
  };

  if (loading || !student) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
        <title>Memuat - Letuskan Balon</title>
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-slate-900 border-t-transparent" />
          <p className="text-xs text-slate-400 font-medium font-sans">Memuat gelembung...</p>
        </div>
      </div>
    );
  }

  if (gameStage === 'map') {
    return (
      <div className="min-h-screen bg-[#FAF6EE] flex flex-col justify-start">
        <title>Letuskan Balon - DyLeks Siswa</title>
        <main className="max-w-md w-full mx-auto px-4 py-6 flex flex-col justify-between min-h-screen">
          <SubLevelMap
            studentName={student.name}
            gameName="Letuskan Balon"
            gameCategory="Permainan Suku Kata"
            currentLevel={studentLevel}
            getLevelName={getLevelName}
            stageProgress={stageProgress}
            onStartStage={(stageNum) => {
              setActiveStageNum(stageNum);
              setStageWordsRight(0);
              startNewRound(true);
              setGameStage('game');
            }}
            onBackToHome={() => router.push('/')}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-start">
      <title>Letuskan Balon - DyLeks Siswa</title>

      {/* Mobile container wrapper */}
      <main className="max-w-md w-full mx-auto px-4 py-6 flex flex-col justify-between min-h-screen space-y-5">
        <PlayStage
          currentWord={currentWord}
          currentSyllables={currentSyllables}
          currentSyllableIndex={currentSyllableIndex}
          rightCount={rightCount}
          wrongCount={wrongCount}
          bubbles={bubbles}
          onPopBubble={handlePopBubble}
          onRestart={handleRestart}
          onQuit={handleQuit}
          isWrongFlash={isWrongFlash}
        />
      </main>
    </div>
  );
}
