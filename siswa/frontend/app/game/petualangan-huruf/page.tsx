'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStudentAuth } from '../../hooks/useStudentAuth';
import { MemoryCard } from '../../types';
import LevelSelectStage from './_components/LevelSelectStage';
import GamePlayStage from './_components/GamePlayStage';
import GameFinishStage from './_components/GameFinishStage';
import { LEVEL_POOLS } from '../challenge-pools';


export default function PetualanganHuruf() {
  const { student, loading, requireAuth } = useStudentAuth();
  const router = useRouter();

  // Enforce auth check
  useEffect(() => {
    requireAuth();
  }, [student, loading, requireAuth]);

  // Stage States
  const [stage, setStage] = useState<'level-select' | 'play' | 'finish'>('level-select');
  const [currentLevel, setCurrentLevel] = useState<number>(1);
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [activeCardId, setActiveCardId] = useState<string | null>(null);
  const [isLocked, setIsLocked] = useState<boolean>(false);

  // Initialize a level game board
  const startLevel = (levelId: number) => {
    const levelData = LEVEL_POOLS[levelId];
    if (!levelData) return;

    // Pick 4 random unique items from the pool
    const pool = [...levelData.items];
    const pickedItems: string[] = [];
    for (let i = 0; i < 4; i++) {
      if (pool.length === 0) break;
      const randIndex = Math.floor(Math.random() * pool.length);
      pickedItems.push(pool[randIndex]);
      pool.splice(randIndex, 1);
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
    setCurrentLevel(levelId);
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
        updatedCards[activeCardIndex] = { ...firstCard, isMatched: true, isRevealed: true };
        updatedCards[cardIndex] = { ...secondCard, isMatched: true, isRevealed: true };
        setCards(updatedCards);
        setActiveCardId(null);

        // Check if all pairs matched (Win condition)
        const allMatched = updatedCards.every(c => c.isMatched);
        if (allMatched) {
          setTimeout(() => {
            setStage('finish');
          }, 800);
        }
      } else {
        // NO MATCH: Lock board clicks, wait for a moment, then flip both down
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

  const handleNextLevel = () => {
    if (currentLevel < 5) {
      startLevel(currentLevel + 1);
    }
  };

  // Safe quit from gameplay back to level selection
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

  const activeLevelName = LEVEL_POOLS[currentLevel]?.name || '';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-start">
      <title>Petualangan Huruf - DyLeks Siswa</title>

      {/* Mobile container */}
      <main className="max-w-md w-full mx-auto px-4 py-6 flex flex-col justify-between min-h-screen space-y-5">

        {/* Stage Selection */}
        {stage === 'level-select' && (
          <LevelSelectStage
            onSelectLevel={startLevel}
            onBackToHome={() => router.push('/')}
          />
        )}

        {/* Play Stage */}
        {stage === 'play' && (
          <GamePlayStage
            level={currentLevel}
            levelName={activeLevelName}
            cards={cards}
            onCardClick={handleCardClick}
            onResetLevel={() => startLevel(currentLevel)}
            onQuit={handleQuit}
          />
        )}

        {/* Finish Stage */}
        {stage === 'finish' && (
          <GameFinishStage
            level={currentLevel}
            hasNextLevel={currentLevel < 5}
            onNextLevel={handleNextLevel}
            onRestart={() => startLevel(currentLevel)}
            onHome={() => router.push('/')}
          />
        )}

      </main>
    </div>
  );
}
