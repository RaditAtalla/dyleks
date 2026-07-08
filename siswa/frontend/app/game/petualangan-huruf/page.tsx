'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useStudentAuth } from '../../hooks/useStudentAuth';
import { MemoryCard } from '../../types';
import GamePlayStage from './_components/GamePlayStage';
import GameFinishStage from './_components/GameFinishStage';
import { LEVEL_POOLS, getChallengePool } from '../challenge-pools';
import { useGameSounds } from '../../hooks/useGameSounds';
import SubLevelMap from '../../components/SubLevelMap';
import { useSubLevelProgress } from '../../hooks/useSubLevelProgress';


export default function PetualanganHuruf() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-[#FAF6EE] p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-500 border-t-transparent" />
          <p className="text-xs text-slate-400 font-medium">Memuat game...</p>
        </div>
      </div>
    }>
      <PetualanganHurufContent />
    </Suspense>
  );
}

function PetualanganHurufContent() {
  const { student, loading, requireAuth } = useStudentAuth();
  const router = useRouter();
  const { playCorrect, playWrong } = useGameSounds();
  const searchParams = useSearchParams();
  const levelParam = searchParams.get('level');

  const studentLevel = levelParam ? parseInt(levelParam, 10) : (student?.currentLevel || 1);

  const { stageProgress, activeStageNum, setActiveStageNum, handleStageWin } = useSubLevelProgress({
    gameKey: 'memori',
    studentLevel,
  });

  // Enforce auth check
  useEffect(() => {
    requireAuth();
  }, [student, loading, requireAuth]);

  // Stage States
  const [stage, setStage] = useState<'level-select' | 'play' | 'finish'>('level-select');
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [activeCardId, setActiveCardId] = useState<string | null>(null);
  const [isLocked, setIsLocked] = useState<boolean>(false);

  const handleStartStage = (stageNum: number) => {
    setActiveStageNum(stageNum);
    // Determine number of pairs based on stage (Stage 1 = 2 pairs, Stage 2 = 3 pairs, etc.)
    const pairsCount = stageNum + 1;
    startLevel(studentLevel, pairsCount);
  };

  // Initialize a level game board
  const startLevel = (levelId: number, pairsCount: number = 4) => {
    const pool = getChallengePool(levelId);
    if (!pool) return;

    // Pick random unique items from the pool
    const itemsList = [...pool.items];
    const pickedItems: string[] = [];
    for (let i = 0; i < pairsCount; i++) {
      if (itemsList.length === 0) break;
      const randIndex = Math.floor(Math.random() * itemsList.length);
      pickedItems.push(itemsList[randIndex]);
      itemsList.splice(randIndex, 1);
    }

    // Duplicate to form a list of 8 items (4 pairs)
    const duplicatedItems = [...pickedItems, ...pickedItems];

    // Shuffle the items randomly
    const shuffled = [...duplicatedItems];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    // Convert to MemoryCard objects
    const initCards = shuffled.map((val, index) => ({
      id: `card-${index}-${Math.random().toString(36).substr(2, 9)}`,
      value: val,
      isRevealed: false,
      isMatched: false
    }));

    setCards(initCards);
    setActiveCardId(null);
    setIsLocked(false);
    setStage('play');
  };

  // Card click matching handler
  const handleCardClick = (cardId: string) => {
    if (isLocked) return;

    const cardIndex = cards.findIndex(c => c.id === cardId);
    if (cardIndex === -1) return;

    const card = cards[cardIndex];
    if (card.isRevealed || card.isMatched) return;

    // Reveal the clicked card
    const updatedCards = [...cards];
    updatedCards[cardIndex] = { ...card, isRevealed: true };
    setCards(updatedCards);

    if (activeCardId === null) {
      // First card clicked in the pair
      setActiveCardId(cardId);
    } else {
      // Second card clicked in the pair
      const activeCardIndex = cards.findIndex(c => c.id === activeCardId);
      if (activeCardIndex === -1) return;

      const firstCard = cards[activeCardIndex];
      const secondCard = card;

      if (firstCard.value === secondCard.value) {
        // MATCH: Keep cards open, mark isMatched
        playCorrect();
        updatedCards[activeCardIndex] = { ...firstCard, isMatched: true, isRevealed: true };
        updatedCards[cardIndex] = { ...secondCard, isMatched: true, isRevealed: true };
        setCards(updatedCards);
        setActiveCardId(null);

        // Check if all pairs matched (Win condition)
        const allMatched = updatedCards.every(c => c.isMatched);
        if (allMatched) {
          setTimeout(() => {
            handleWin();
          }, 800);
        }
      } else {
        // NO MATCH: Lock board clicks, wait for a moment, then flip both down
        playWrong();
        setIsLocked(true);
        setTimeout(() => {
          setCards(prevCards => {
            return prevCards.map(c => {
              if (c.id === activeCardId || c.id === cardId) {
                return { ...c, isRevealed: false };
              }
              return c;
            });
          });
          setActiveCardId(null);
          setIsLocked(false);
        }, 500);
      }
    }
  };

  // Handle Win game progression
  const handleWin = async () => {
    await handleStageWin();
    setStage('finish');
  };

  const handleRestart = () => {
    const pairsCount = activeStageNum + 1;
    startLevel(studentLevel, pairsCount);
  };

  // Safe quit from gameplay back to stage selection
  const handleQuit = () => {
    const confirmQuit = window.confirm("Apakah kamu yakin ingin keluar dari level ini? Kemajuan permainan level ini tidak akan disimpan.");
    if (confirmQuit) {
      setStage('level-select');
    }
  };

  // Render loading state if auth check is running
  if (loading || !student) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
        <title>Memuat - Petualangan Huruf</title>
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-slate-900 border-t-transparent" />
          <p className="text-xs text-slate-400 font-medium">Memuat petualangan...</p>
        </div>
      </div>
    );
  }

  const getLevelName = (lvl: number) => {
    const names: Record<number, string> = {
      1: 'Vokal Tunggal', 2: 'Suku Kata Tunggal', 3: 'Suku Kata Kompleks',
      4: 'Digraf & Diftong', 5: 'Kata Dasar', 6: 'Suku Kata Blending',
      7: 'Diskriminasi Visual', 8: 'Morfologi Kata'
    };
    return names[lvl] || 'Kemampuan Dasar';
  };

  const poolData = LEVEL_POOLS[studentLevel];
  const activeLevelName = poolData?.name || '';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-start">
      <title>Petualangan Huruf - DyLeks Siswa</title>

      {/* Mobile container */}
      <main className="max-w-md w-full mx-auto px-4 py-6 flex flex-col justify-between min-h-screen space-y-5">

        {/* Stage Selection */}
        {stage === 'level-select' && (
          <SubLevelMap
            studentName={student.name}
            gameName="Petualangan Huruf"
            gameCategory="Permainan Memori"
            currentLevel={studentLevel}
            getLevelName={getLevelName}
            stageProgress={stageProgress}
            onStartStage={(stageNum) => {
              setActiveStageNum(stageNum);
              const pairsCount = stageNum + 1;
              startLevel(studentLevel, pairsCount);
            }}
            onBackToHome={() => router.push('/')}
          />
        )}

        {/* Play Stage */}
        {stage === 'play' && (
          <GamePlayStage
            level={studentLevel}
            levelName={activeLevelName}
            cards={cards}
            onCardClick={handleCardClick}
            onResetLevel={() => {
              const pairsCount = activeStageNum + 1;
              startLevel(studentLevel, pairsCount);
            }}
            onQuit={handleQuit}
          />
        )}

        {/* Finish Stage */}
        {stage === 'finish' && (
          <GameFinishStage
            level={studentLevel}
            hasNextLevel={false}
            onNextLevel={() => {}}
            onRestart={handleRestart}
            onHome={() => setStage('level-select')}
          />
        )}

      </main>
    </div>
  );
}
