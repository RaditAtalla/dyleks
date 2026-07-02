import { ActivityLog } from '../types';
import { GURU_API_URL } from './storage';

export const getLogs = async (teacherId: string): Promise<ActivityLog[]> => {
  try {
    const response = await fetch(`${GURU_API_URL}/api/logs?teacher_id=${teacherId}`);
    if (!response.ok) return [];
    return await response.json();
  } catch (error) {
    console.error("Error fetching logs:", error);
    return [];
  }
};

export const addActivityLog = async (teacherId: string, studentName: string, action: string): Promise<ActivityLog | null> => {
  try {
    const response = await fetch(`${GURU_API_URL}/api/logs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ teacherId, studentName, action }),
    });
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error("Error adding log:", error);
    return null;
  }
};
