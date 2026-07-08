'use client';

import { useState, useEffect } from 'react';
import { useStudentAuth } from './useStudentAuth';

interface UseSubLevelProgressOptions {
  /** Unique prefix per game e.g. 'latihan-bertahap', 'memori', 'tracer', etc. */
  gameKey: string;
  studentLevel: number;
}

interface UseSubLevelProgressReturn {
  stageProgress: Record<number, number>;
  activeStageNum: number;
  setActiveStageNum: (n: number) => void;
  handleStageWin: () => Promise<void>;
  resetProgress: () => void;
}

/**
 * Reusable hook for managing 5-stage sub-level progress across all DyLeks games.
 * 
 * Why this exists: Each game needs identical logic for loading progress from localStorage,
 * updating XP in the database, unlocking next stages, and triggering level-up.
 * Centralizing this prevents bugs from diverging implementations across 6+ game files.
 */
export function useSubLevelProgress({
  gameKey,
  studentLevel,
}: UseSubLevelProgressOptions): UseSubLevelProgressReturn {
  const { student, submitPlacement, refreshStudent } = useStudentAuth();

  const storageKey = student
    ? `dyleks_${gameKey}_tahap_${student.id}_level_${studentLevel}`
    : null;

  const [stageProgress, setStageProgress] = useState<Record<number, number>>({
    1: 0, 2: -1, 3: -1, 4: -1, 5: -1
  });
  const [activeStageNum, setActiveStageNum] = useState<number>(1);

  // Load from localStorage on student load
  useEffect(() => {
    if (!student || !storageKey) return;

    if (studentLevel < student.currentLevel) {
      // Past level: all stages are complete
      setStageProgress({ 1: 100, 2: 100, 3: 100, 4: 100, 5: 100 });
    } else {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try {
          setStageProgress(JSON.parse(saved));
        } catch {
          setStageProgress({ 1: 0, 2: -1, 3: -1, 4: -1, 5: -1 });
        }
      } else {
        setStageProgress({ 1: 0, 2: -1, 3: -1, 4: -1, 5: -1 });
      }
    }
  }, [student, storageKey, studentLevel]);

  const handleStageWin = async () => {
    if (!student || !storageKey) return;

    if (studentLevel !== student.currentLevel) {
      // Playing past level — no DB changes
      alert('Hebat! Kamu berhasil menyelesaikan latihan pengulangan ini!');
      return;
    }

    const nextProgress = { ...stageProgress };
    nextProgress[activeStageNum] = 100;

    // Unlock next stage
    if (activeStageNum < 5 && nextProgress[activeStageNum + 1] === -1) {
      nextProgress[activeStageNum + 1] = 0;
    }

    const completedCount = Object.values(nextProgress).filter(v => v === 100).length;

    if (completedCount === 5) {
      // All 5 stages done → Level Up
      const nextLvl = studentLevel < 8 ? studentLevel + 1 : studentLevel;
      await submitPlacement(nextLvl, student.riskScore, student.riskClass, 0);

      // Seed next level progress in localStorage
      const nextKey = `dyleks_${gameKey}_tahap_${student.id}_level_${nextLvl}`;
      localStorage.setItem(nextKey, JSON.stringify({ 1: 0, 2: -1, 3: -1, 4: -1, 5: -1 }));
      localStorage.setItem(`dyleks_selected_level_${student.id}`, String(nextLvl));

      alert(`Luar biasa! Semua 5 Tahap selesai! Kamu naik ke Tingkat ${nextLvl}!`);
      setStageProgress({ 1: 0, 2: -1, 3: -1, 4: -1, 5: -1 });
    } else {
      const newXP = completedCount * 20;
      await submitPlacement(studentLevel, student.riskScore, student.riskClass, newXP);
      localStorage.setItem(storageKey, JSON.stringify(nextProgress));
      setStageProgress(nextProgress);
    }

    await refreshStudent();
  };

  const resetProgress = () => {
    if (storageKey) {
      setStageProgress({ 1: 0, 2: -1, 3: -1, 4: -1, 5: -1 });
      localStorage.removeItem(storageKey);
    }
  };

  return { stageProgress, activeStageNum, setActiveStageNum, handleStageWin, resetProgress };
}
