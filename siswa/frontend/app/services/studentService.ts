import { Student } from '../types';
import { SISWA_API_URL } from './storage';

export const getStudentById = async (id: string): Promise<Student | null> => {
  try {
    const response = await fetch(`${SISWA_API_URL}/api/students/${id}`);
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error("Error fetching student:", error);
    return null;
  }
};

export const updateStudentProfile = async (
  id: string,
  name: string,
  age: number,
  gender: 'boy' | 'girl',
  grade: string,
  teacherId?: string
): Promise<Student | null> => {
  try {
    const response = await fetch(`${SISWA_API_URL}/api/students/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, age, gender, class: grade, teacherId }),
    });
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error("Error updating student profile:", error);
    return null;
  }
};

export const updateStudentPlacement = async (
  id: string,
  currentLevel: number,
  riskScore: number,
  riskClass: 'low' | 'medium' | 'high',
  xp?: number
): Promise<Student | null> => {
  try {
    const response = await fetch(`${SISWA_API_URL}/api/students/${id}/placement`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ currentLevel, riskScore, riskClass, xp }),
    });
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error("Error updating student placement:", error);
    return null;
  }
};

