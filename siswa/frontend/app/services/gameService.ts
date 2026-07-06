import { Student } from '../types';
import { SISWA_API_URL } from './storage';

export const saveGameSession = async (
  studentId: string,
  sessionData: {
    level: number;
    accuracy: number;
    correctCount: number;
    totalCount: number;
    questions: Array<{
      questionNo: number;
      type: 'choice' | 'handwriting';
      target: string;
      answer: string;
      isCorrect: boolean;
      ocrAccuracy?: number;
    }>;
  }
): Promise<Student | null> => {
  try {
    const response = await fetch(`${SISWA_API_URL}/api/students/${studentId}/game-sessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sessionData),
    });
    if (!response.ok) {
      console.error(`saveGameSession API error: ${response.status} ${response.statusText}`);
      try {
        const text = await response.text();
        console.error("Response body:", text);
      } catch (_) {}
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error("Error saving game session:", error);
    return null;
  }
};
