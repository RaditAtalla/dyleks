'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useStudentAuth } from '../../hooks/useStudentAuth';
import { MazeLayout, MazePosition } from '../../types';
import PlayStage from './_components/PlayStage';


// Predefined Maze Layouts
const MAZE_LAYOUTS: MazeLayout[] = [
  // Maze 1: Cross / Junction
  {
    grid: [
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 1, 0, 0, 0],
      [0, 1, 1, 1, 1, 1, 0],
      [0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 1, 0, 0, 0],
    ],
    playerStart: { x: 3, y: 6 },
    letterPositions: [
      { x: 1, y: 3 }, // Left
      { x: 3, y: 1 }, // Center-top
      { x: 5, y: 3 }, // Right
    ]
  },
  // Maze 2: Trident / E-shape
  {
    grid: [
      [0, 0, 0, 0, 0, 0, 0],
      [0, 1, 0, 1, 0, 1, 0],
      [0, 1, 0, 1, 0, 1, 0],
      [0, 1, 1, 1, 1, 1, 0],
      [0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 1, 0, 0, 0],
    ],
    playerStart: { x: 3, y: 6 },
    letterPositions: [
      { x: 1, y: 1 }, // Top-Left
      { x: 3, y: 1 }, // Top-Center
      { x: 5, y: 1 }, // Top-Right
    ]
  },
  // Maze 3: Loop with center corridor dead end
  {
    grid: [
      [0, 0, 0, 0, 0, 0, 0],
      [0, 1, 1, 1, 1, 1, 0],
      [0, 1, 0, 0, 0, 1, 0],
      [0, 1, 0, 1, 0, 1, 0],
      [0, 1, 0, 1, 0, 1, 0],
      [0, 1, 1, 1, 1, 1, 0],
      [0, 0, 0, 1, 0, 0, 0],
    ],
    playerStart: { x: 3, y: 6 },
    letterPositions: [
      { x: 1, y: 1 }, // Top-Left
      { x: 3, y: 3 }, // Center
      { x: 5, y: 1 }, // Top-Right
    ]
  }
];

const LETTER_POOL = ['b', 'd', 'p', 'q'];

export default function LabirinSpasial() {
  const { student, loading, requireAuth } = useStudentAuth();
  const router = useRouter();

  // Enforce authentication check
  useEffect(() => {
    requireAuth();
  }, [student, loading, requireAuth]);



  // Counters
  const [rightCount, setRightCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);

  // Round State
  const [currentMazeIndex, setCurrentMazeIndex] = useState(0);
  const [playerPosition, setPlayerPosition] = useState<MazePosition>({ x: 3, y: 6 });
  const [lettersOnMap, setLettersOnMap] = useState<string[]>(['b', 'd', 'p']);
  const [targetLetter, setTargetLetter] = useState<string>('d');

  // Active Maze Layout
  const activeMaze = useMemo(() => {
    return MAZE_LAYOUTS[currentMazeIndex];
  }, [currentMazeIndex]);

  // Generate / start a new round
  const startNewRound = (resetScores = false) => {
    if (resetScores) {
      setRightCount(0);
      setWrongCount(0);
    }

    // 1. Pick a random maze layout index
    const nextMazeIdx = Math.floor(Math.random() * MAZE_LAYOUTS.length);
    setCurrentMazeIndex(nextMazeIdx);

    // 2. Select 3 unique random letters from LETTER_POOL
    const shuffledPool = [...LETTER_POOL].sort(() => Math.random() - 0.5);
    const chosenLetters = shuffledPool.slice(0, 3);
    setLettersOnMap(chosenLetters);

    // 3. Pick one of the three chosen letters as target
    const targetIdx = Math.floor(Math.random() * chosenLetters.length);
    setTargetLetter(chosenLetters[targetIdx]);

    // 4. Set player start position
    const layout = MAZE_LAYOUTS[nextMazeIdx];
    setPlayerPosition({ ...layout.playerStart });
  };

  // Initialize round on mount
  useEffect(() => {
    startNewRound(true);
  }, []);

  // Handle movement inputs
  const handleMove = (direction: 'up' | 'down' | 'left' | 'right') => {
    let nextX = playerPosition.x;
    let nextY = playerPosition.y;

    switch (direction) {
      case 'up':
        nextY -= 1;
        break;
      case 'down':
        nextY += 1;
        break;
      case 'left':
        nextX -= 1;
        break;
      case 'right':
        nextX += 1;
        break;
      default:
        return;
    }

    // Boundaries check
    if (nextX < 0 || nextX >= 7 || nextY < 0 || nextY >= 7) {
      return;
    }

    // Wall collision check
    if (activeMaze.grid[nextY][nextX] === 0) {
      return; // Wall blocks move
    }

    // Update player position state
    setPlayerPosition({ x: nextX, y: nextY });

    // Check letter hit collision
    const hitIdx = activeMaze.letterPositions.findIndex(
      (pos) => pos.x === nextX && pos.y === nextY
    );

    if (hitIdx !== -1) {
      const hitLetter = lettersOnMap[hitIdx];
      
      // Let's pause a micro-second before resetting so player sees collision
      setTimeout(() => {
        if (hitLetter.toLowerCase() === targetLetter.toLowerCase()) {
          // Success! Correct Letter
          setRightCount((prev) => prev + 1);
          startNewRound(false);
        } else {
          // Fail! Wrong letter gate
          setWrongCount((prev) => prev + 1);
          // Reset player back to start of the SAME round to try again
          setPlayerPosition({ ...activeMaze.playerStart });
        }
      }, 150);
    }
  };

  // Safe reset action
  const handleRestart = () => {
    const confirmReset = window.confirm("Ulangi permainan dari awal? Skor saat ini akan diatur kembali ke 0.");
    if (confirmReset) {
      startNewRound(true);
    }
  };

  // Safe quit action
  const handleQuit = () => {
    const confirmQuit = window.confirm("Apakah kamu yakin ingin keluar dari permainan?");
    if (confirmQuit) {
      router.push('/');
    }
  };



  // Loading indicator for authentication check
  if (loading || !student) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
        <title>Memuat - Labirin Spasial</title>
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-slate-900 border-t-transparent" />
          <p className="text-xs text-slate-400 font-medium">Memuat petualangan...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-start">
      <title>Labirin Spasial - DyLeks Siswa</title>

      {/* Main Container */}
      <main className="max-w-md w-full mx-auto px-4 py-6 flex flex-col justify-between min-h-screen space-y-5">
        
        <PlayStage
          targetLetter={targetLetter}
          rightCount={rightCount}
          wrongCount={wrongCount}
          mazeGrid={activeMaze.grid}
          playerPosition={playerPosition}
          letterPositions={activeMaze.letterPositions}
          lettersOnMap={lettersOnMap}
          onMove={handleMove}
          onRestart={handleRestart}
          onQuit={handleQuit}
        />

      </main>
    </div>
  );
}
