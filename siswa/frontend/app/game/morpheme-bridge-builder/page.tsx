'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useStudentAuth } from '../../hooks/useStudentAuth';
import { MorphemeBridgeTile } from '../../types';
import { MORPHEME_BRIDGE_POOL } from '../challenge-pools';
import PlayStage from './_components/PlayStage';

// Shuffle helper (Fisher-Yates)
function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Build a tile pool from an entry (correct pieces + distractors, shuffled)
function buildTilePool(pieces: string[], distractors: string[]): MorphemeBridgeTile[] {
  const correct: MorphemeBridgeTile[] = pieces.map((label, i) => ({
    id: `tile-correct-${i}-${Date.now()}`,
    label,
    isDistractor: false,
  }));
  const wrong: MorphemeBridgeTile[] = distractors.map((label, i) => ({
    id: `tile-distractor-${i}-${Date.now()}`,
    label,
    isDistractor: true,
  }));
  return shuffleArray([...correct, ...wrong]);
}

export default function MorphemeBridgeBuilder() {
  const { student, loading, requireAuth } = useStudentAuth();
  const router = useRouter();

  useEffect(() => {
    requireAuth();
  }, [student, loading, requireAuth]);

  // ── Game state ──
  const [currentEntryIndex, setCurrentEntryIndex] = useState(0);
  const [tilePool, setTilePool] = useState<MorphemeBridgeTile[]>([]);
  const [selectedTiles, setSelectedTiles] = useState<MorphemeBridgeTile[]>([]);
  const [rightCount, setRightCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [isWrongFlash, setIsWrongFlash] = useState(false);
  const [isCorrectFlash, setIsCorrectFlash] = useState(false);

  // Shuffled pool order so each play-through is different
  const [entryOrder, setEntryOrder] = useState<number[]>([]);
  const isProcessingRef = useRef(false);

  // ── Bootstrap ──
  const initGame = useCallback(() => {
    const indices = MORPHEME_BRIDGE_POOL.map((_, i) => i);
    const shuffled = shuffleArray(indices);
    setEntryOrder(shuffled);
    setCurrentEntryIndex(0);
    setRightCount(0);
    setWrongCount(0);
    setSelectedTiles([]);
    isProcessingRef.current = false;

    const firstEntry = MORPHEME_BRIDGE_POOL[shuffled[0]];
    setTilePool(buildTilePool(firstEntry.pieces, firstEntry.distractors));
  }, []);

  useEffect(() => {
    if (student) {
      initGame();
    }
  }, [student, initGame]);

  // ── Advance to next word ──
  const nextWord = useCallback(() => {
    setCurrentEntryIndex((prev) => {
      const nextIdx = (prev + 1) % entryOrder.length;
      // If we've gone through all entries, reshuffle
      if (nextIdx === 0) {
        const reshuffled = shuffleArray(entryOrder);
        const entry = MORPHEME_BRIDGE_POOL[reshuffled[0]];
        setEntryOrder(reshuffled);
        setTilePool(buildTilePool(entry.pieces, entry.distractors));
      } else {
        const entry = MORPHEME_BRIDGE_POOL[entryOrder[nextIdx]];
        setTilePool(buildTilePool(entry.pieces, entry.distractors));
      }
      return nextIdx;
    });
    setSelectedTiles([]);
    isProcessingRef.current = false;
  }, [entryOrder]);

  // ── Tile click handler ──
  const handleTileClick = useCallback(
    (tile: MorphemeBridgeTile) => {
      if (isProcessingRef.current) return;

      setSelectedTiles((prev) => {
        const next = [...prev, tile];

        // Get current entry
        const entry = MORPHEME_BRIDGE_POOL[entryOrder[currentEntryIndex] ?? 0];
        if (!entry) return prev;

        const { pieces } = entry;
        const slotIndex = prev.length; // zero-based index of the new tile

        // Remove tile from pool
        setTilePool((pool) => pool.filter((t) => t.id !== tile.id));

        // ── Prefix check: does this tile match the expected piece at this position? ──
        const expected = pieces[slotIndex];
        const isMatch = tile.label.toLowerCase() === expected?.toLowerCase();

        if (!isMatch) {
          // Wrong tile — flash and clear
          isProcessingRef.current = true;
          setIsWrongFlash(true);
          setWrongCount((w) => w + 1);

          setTimeout(() => {
            setIsWrongFlash(false);
            // Return all selected tiles back to the pool, reshuffled
            setSelectedTiles([]);
            const rebuilt = buildTilePool(pieces, entry.distractors);
            setTilePool(rebuilt);
            isProcessingRef.current = false;
          }, 500);

          return next; // briefly show the wrong tile before clearing
        }

        // ── Correct tile so far ──
        if (next.length === pieces.length) {
          // All pieces filled — victory!
          isProcessingRef.current = true;
          setIsCorrectFlash(true);
          setRightCount((r) => r + 1);

          setTimeout(() => {
            setIsCorrectFlash(false);
            nextWord();
          }, 700);
        }

        return next;
      });
    },
    [entryOrder, currentEntryIndex, nextWord]
  );

  const handleRestart = useCallback(() => {
    initGame();
  }, [initGame]);

  const handleQuit = useCallback(() => {
    router.push('/');
  }, [router]);

  // Loading state
  if (loading || !student || entryOrder.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
        <title>Memuat - Morpheme Bridge Builder</title>
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-slate-900 border-t-transparent" />
          <p className="text-xs text-slate-400 font-medium">Memuat jembatan kata...</p>
        </div>
      </div>
    );
  }

  const currentEntry = MORPHEME_BRIDGE_POOL[entryOrder[currentEntryIndex]];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-start">
      <title>Morpheme Bridge Builder - DyLeks Siswa</title>

      <main className="max-w-md w-full mx-auto px-4 py-6 flex flex-col justify-between min-h-screen space-y-5">
        <PlayStage
          target={currentEntry.target}
          correctPieces={currentEntry.pieces}
          tilePool={tilePool}
          selectedTiles={selectedTiles}
          rightCount={rightCount}
          wrongCount={wrongCount}
          isWrongFlash={isWrongFlash}
          isCorrectFlash={isCorrectFlash}
          onTileClick={handleTileClick}
          onRestart={handleRestart}
          onQuit={handleQuit}
        />
      </main>
    </div>
  );
}
