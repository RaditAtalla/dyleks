import { GameSession } from '../types';
import { GURU_API_URL } from './storage';

export const getStudentGameSessions = async (studentId: string): Promise<GameSession[]> => {
  try {
    const response = await fetch(`${GURU_API_URL}/api/students/${studentId}/game-sessions`);
    if (!response.ok) return [];
    return await response.json();
  } catch (error) {
    console.error("Error fetching student game sessions:", error);
    return [];
  }
};

export const getStudentGameStats = async (studentId: string): Promise<{ accuracy: string; commonWrong: string }> => {
  try {
    const response = await fetch(`${GURU_API_URL}/api/students/${studentId}/game-stats`);
    if (!response.ok) return { accuracy: '0%', commonWrong: 'Tidak ada data' };
    return await response.json();
  } catch (error) {
    console.error("Error fetching student game stats:", error);
    return { accuracy: '0%', commonWrong: 'Tidak ada data' };
  }
};
