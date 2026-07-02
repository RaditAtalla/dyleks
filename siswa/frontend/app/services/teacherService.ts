import { Teacher } from '../types';
import { SISWA_API_URL } from './storage';

export const getTeacherById = async (id: string): Promise<Teacher | null> => {
  try {
    const response = await fetch(`${SISWA_API_URL}/api/teachers/${id}`);
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error("Error fetching teacher:", error);
    return null;
  }
};
