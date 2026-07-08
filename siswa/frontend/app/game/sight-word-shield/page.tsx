'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useStudentAuth } from '../../hooks/useStudentAuth';
import { Meteor } from '../../types';
import { getChallengePool } from '../challenge-pools';
import PlayStage from './_components/PlayStage';
import { useGameSounds } from '../../hooks/useGameSounds';
import { Suspense } from 'react';
import SubLevelMap from '../../components/SubLevelMap';
import { useSubLevelProgress } from '../../hooks/useSubLevelProgress';

// Helper to generate jumbled spelling distractors for a word
function generateJumbledVersions(word: string, count: number): string[] {
  const wordUpper = word.toUpperCase();
  const candidates = new Set<string>();

  const addCandidate = (val: string) => {
    const v = val.trim().toUpperCase();
    if (v && v !== wordUpper) {
      candidates.add(v);
    }
  };

  // 1. Swapping adjacent letters
  for (let i = 0; i < wordUpper.length - 1; i++) {
    const chars = wordUpper.split('');
    const temp = chars[i];
    chars[i] = chars[i + 1];
    chars[i + 1] = temp;
    addCandidate(chars.join(''));
  }

  // 2. Swapping non-adjacent letters randomly
  for (let i = 0; i < 20; i++) {
    const chars = wordUpper.split('');
    const idx1 = Math.floor(Math.random() * wordUpper.length);
    const idx2 = Math.floor(Math.random() * wordUpper.length);
    if (idx1 !== idx2) {
      const temp = chars[idx1];
      chars[idx1] = chars[idx2];
      chars[idx2] = temp;
      addCandidate(chars.join(''));
    }
  }

  // 3. Deleting a single letter
  if (wordUpper.length > 2) {
    for (let i = 0; i < wordUpper.length; i++) {
      const chars = wordUpper.split('');
      chars.splice(i, 1);
      addCandidate(chars.join(''));
    }
  }

  // 4. Replacing a letter with another vowel/consonant
  const replacements = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (let i = 0; i < Math.min(5, wordUpper.length); i++) {
    const chars = wordUpper.split('');
    const idx = Math.floor(Math.random() * wordUpper.length);
    const repl = replacements[Math.floor(Math.random() * replacements.length)];
    chars[idx] = repl;
    addCandidate(chars.join(''));
  }

  // If still not enough, shuffle fully
  let attempts = 0;
  while (candidates.size < count && attempts < 50) {
    const chars = wordUpper.split('');
    for (let i = chars.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = chars[i];
      chars[i] = chars[j];
      chars[j] = temp;
    }
    addCandidate(chars.join(''));
    attempts++;
  }

  // Fallback: If we have single letter (e.g. Level 1, which shouldn't happen here since we strictly use Level 5, but let's keep it safe)
  if (wordUpper.length === 1) {
    const vowels = ['A', 'I', 'U', 'E', 'O'];
    for (const v of vowels) {
      if (v !== wordUpper) {
        candidates.add(v);
      }
    }
  }

  const list = Array.from(candidates);
  const shuffled = list.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export default function SightWordShield() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-[#FAF6EE] p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-500 border-t-transparent" />
          <p className="text-xs text-slate-400 font-medium">Memuat game...</p>
        </div>
      </div>
    }>
      <SightWordShieldContent />
    </Suspense>
  );
}

function SightWordShieldContent() {
  const { student, loading, requireAuth } = useStudentAuth();
  const router = useRouter();
  const { playCorrect, playWrong } = useGameSounds();
  const searchParams = useSearchParams();
  const levelParam = searchParams.get('level');

  const studentLevel = levelParam ? parseInt(levelParam, 10) : (student?.currentLevel || 1);

  const { stageProgress, activeStageNum, setActiveStageNum, handleStageWin } = useSubLevelProgress({
    gameKey: 'shield',
    studentLevel,
  });

  // Map vs Game stage
  const [gameStage, setGameStage] = useState<'map' | 'game'>('map');
  const [stageScore, setStageScore] = useState(0);
  const SCORE_TO_WIN = 5;

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
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  // Shield Health
  const [shieldHealth, setShieldHealth] = useState(100);

  // Round target word
  const [currentWord, setCurrentWord] = useState('');

  // Active falling meteors state
  const [meteors, setMeteors] = useState<Meteor[]>([]);

  // Flash feedbacks
  const [isWrongFlash, setIsWrongFlash] = useState(false);
  const [laserLine, setLaserLine] = useState<{ active: boolean; targetX?: number; targetY?: number } | null>(null);

  // Refs for animation thread loops to read the latest state
  const currentWordRef = useRef<string>('');
  const meteorsRef = useRef<Meteor[]>([]);
  const shieldHealthRef = useRef<number>(100);
  const isGameOverRef = useRef(false);

  useEffect(() => {
    currentWordRef.current = currentWord;
  }, [currentWord]);

  useEffect(() => {
    meteorsRef.current = meteors;
  }, [meteors]);

  useEffect(() => {
    shieldHealthRef.current = shieldHealth;
    isGameOverRef.current = shieldHealth <= 0;
  }, [shieldHealth]);

  // Retrieve high score on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('dyleks_high_score_sight_word_shield');
      if (saved) {
        setHighScore(parseInt(saved, 10) || 0);
      }
    }
  }, []);

  // Spawn a wave of 4 meteors for a target word
  const spawnMeteors = useCallback((targetWord: string) => {
    const wordUpper = targetWord.toUpperCase();
    const distractors = generateJumbledVersions(wordUpper, 3);
    
    // Combine 1 correct + 3 distractors
    const pool = [
      { word: wordUpper, isCorrect: true },
      ...distractors.map(w => ({ word: w, isCorrect: false }))
    ];

    // Shuffle pool
    const shuffledPool = pool.sort(() => Math.random() - 0.5);

    // Stagger sizes and vertical offsets
    const spawned: Meteor[] = shuffledPool.map((item, index) => {
      // Horizontal ranges to prevent overlaps:
      // index 0: 10% - 25%
      // index 1: 32% - 47%
      // index 2: 53% - 68%
      // index 3: 75% - 90%
      const baseMinX = 10 + index * 22;
      const x = baseMinX + Math.random() * 10;
      
      // Stagger vertical start position so they fall at different heights
      const y = -10 - (index * 12) - Math.random() * 10;

      // Variable speeds (scaled for Level 5 playing experience)
      const speed = 0.15 + Math.random() * 0.05;

      return {
        id: `meteor-${Date.now()}-${index}-${Math.random().toString(36).substring(2, 7)}`,
        word: item.word,
        x,
        y,
        speed,
        isCorrect: item.isCorrect,
        size: 72 + Math.random() * 8, // size in pixels
        colorIndex: index,
        isExploding: false
      };
    });

    setMeteors(spawned);
  }, []);

  // Start new round word
  const startNewRound = useCallback((resetScores = false) => {
    if (resetScores) {
      setScore(0);
      setShieldHealth(100);
      shieldHealthRef.current = 100;
      isGameOverRef.current = false;
    }

    // Retrieve dynamically powered challenge pool
    const pool = getChallengePool(studentLevel);
    const poolItems = pool?.items || ['RUMAH'];
    const nextWord = poolItems[Math.floor(Math.random() * poolItems.length)];

    setCurrentWord(nextWord);
    spawnMeteors(nextWord);
  }, [spawnMeteors, studentLevel]);

  // Setup round on mount / auth loads
  useEffect(() => {
    if (student) {
      startNewRound(true);
    }
  }, [student, startNewRound]);


  // Animation rendering frame ticks
  // Dependencies use ONLY stable values (student, startNewRound).
  // All live game state is read via refs so the loop doesn't restart on every frame update.
  useEffect(() => {
    if (!student) return;

    let animFrameId: number;
    let running = true;

    const tick = () => {
      if (!running || isGameOverRef.current) return;

      const currentMeteors = meteorsRef.current;

      if (currentMeteors.length === 0) {
        animFrameId = requestAnimationFrame(tick);
        return;
      }

      let isMissedCorrectMeteor = false;

      const updatedMeteors = currentMeteors.map((meteor) => {
        if (meteor.isExploding) return meteor;

        const nextY = meteor.y + meteor.speed;

        // If meteor reaches the bottom boundary (approx 88%)
        if (nextY >= 88) {
          if (meteor.isCorrect) {
            isMissedCorrectMeteor = true;
          }
          return {
            ...meteor,
            y: nextY,
            isExploding: true,
          };
        }

        return { ...meteor, y: nextY };
      });

      // Only the CORRECT meteor touching the shield deals damage.
      // Wrong meteors that fall through are silently removed — no penalty.
      let damage = 0;
      updatedMeteors.forEach((m, idx) => {
        const oldM = currentMeteors[idx];
        const justExploded = m.isExploding && (!oldM || !oldM.isExploding);
        if (justExploded && m.isCorrect) {
          damage += 20;
        }
      });

      if (damage > 0) {
        playWrong();
        const nextHealth = Math.max(0, shieldHealthRef.current - damage);
        shieldHealthRef.current = nextHealth;
        setShieldHealth(nextHealth);
        if (nextHealth <= 0) {
          isGameOverRef.current = true;
          running = false;
          return;
        }
      }

      // If the correct meteor hit the shield but health is still > 0, start a new round
      if (isMissedCorrectMeteor) {
        // Hapus meteors segera agar loop tick berikutnya tidak memicu startNewRound berulang kali (mencegah stack update/freeze)
        setMeteors([]);
        setTimeout(() => {
          if (!isGameOverRef.current) startNewRound(false);
        }, 300);
      } else {
        // Remove meteors that have fully hit the bottom (both correct and wrong)
        const finalMeteors = updatedMeteors.filter(m => !(m.isExploding && m.y >= 88));
        setMeteors(finalMeteors);
      }

      if (running) {
        animFrameId = requestAnimationFrame(tick);
      }
    };

    animFrameId = requestAnimationFrame(tick);
    return () => {
      running = false;
      cancelAnimationFrame(animFrameId);
    };
  }, [student, startNewRound]);

  // Handle shooting clicks
  const handleShootMeteor = useCallback((meteorId: string) => {
    if (shieldHealthRef.current <= 0) return;

    setMeteors((prevMeteors) => {
      const clickedIdx = prevMeteors.findIndex((m) => m.id === meteorId);
      if (clickedIdx === -1) return prevMeteors;

      const clicked = prevMeteors[clickedIdx];
      if (clicked.isExploding) return prevMeteors;

      // Draw laser lines
      setLaserLine({
        active: true,
        targetX: clicked.x,
        targetY: clicked.y
      });

      // Clear laser line after delay
      setTimeout(() => {
        setLaserLine(null);
      }, 180);

      const next = [...prevMeteors];
      next[clickedIdx] = { ...clicked, isExploding: true };

      if (clicked.isCorrect) {
        // SUCCESS: Correct spelled word shot down!
        playCorrect();
        setScore((prevScore) => {
          const newScore = prevScore + 1;
          setHighScore((prevHigh) => {
            if (newScore > prevHigh) {
              localStorage.setItem('dyleks_high_score_sight_word_shield', newScore.toString());
              return newScore;
            }
            return prevHigh;
          });
          return newScore;
        });

        // Short delay for laser line and explosion particles, then load next word
        setTimeout(async () => {
          const newStageScore = stageScore + 1;
          if (newStageScore >= SCORE_TO_WIN) {
            setStageScore(0);
            await handleStageWin();
            setGameStage('map');
          } else {
            setStageScore(newStageScore);
            startNewRound(false);
          }
        }, 350);
      } else {
        // FAIL: Jumbled spelling clicked — deal 10 damage to shield
        playWrong();
        const nextHealth = Math.max(0, shieldHealthRef.current - 10);
        shieldHealthRef.current = nextHealth;
        if (nextHealth <= 0) isGameOverRef.current = true;
        setIsWrongFlash(true);
        setShieldHealth(nextHealth);

        setTimeout(() => {
          setIsWrongFlash(false);
        }, 400);

        // Remove the exploded wrong meteor after the animation (350ms)
        setTimeout(() => {
          setMeteors((current) => current.filter((m) => m.id !== meteorId));
        }, 350);
      }

      return next;
    });
  }, [startNewRound]);

  const handleRestart = useCallback(() => {
    startNewRound(true);
  }, [startNewRound]);

  const handleQuit = useCallback(() => {
    setGameStage('map');
  }, []);

  // Loading indicator
  if (loading || !student) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
        <title>Memuat - Sight Word Shield</title>
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-slate-900 border-t-transparent" />
          <p className="text-xs text-slate-400 font-medium font-sans">Memuat perisai...</p>
        </div>
      </div>
    );
  }

  if (gameStage === 'map') {
    return (
      <div className="min-h-screen bg-[#FAF6EE] flex flex-col justify-start">
        <title>Sight Word Shield - DyLeks Siswa</title>
        <main className="max-w-md w-full mx-auto px-4 py-6 flex flex-col justify-between min-h-screen">
          <SubLevelMap
            studentName={student.name}
            gameName="Sight Word Shield"
            gameCategory="Pertahanan Kata"
            currentLevel={studentLevel}
            getLevelName={getLevelName}
            stageProgress={stageProgress}
            onStartStage={(stageNum) => {
              setActiveStageNum(stageNum);
              setStageScore(0);
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
      <title>Sight Word Shield - DyLeks Siswa</title>

      {/* Main Container */}
      <main className="max-w-md w-full mx-auto px-4 py-6 flex flex-col justify-between min-h-screen space-y-5">
        <PlayStage
          currentWord={currentWord}
          meteors={meteors}
          shieldHealth={shieldHealth}
          score={score}
          highScore={highScore}
          onShootMeteor={handleShootMeteor}
          onRestart={handleRestart}
          onQuit={handleQuit}
          isWrongFlash={isWrongFlash}
          laserLine={laserLine}
        />
      </main>
    </div>
  );
}
