import { Teacher } from '../types';
import { isClient, TEACHERS_KEY } from './storage';

export const getTeacherById = (id: string): Teacher | null => {
  if (!isClient()) return null;
  const data = localStorage.getItem(TEACHERS_KEY);
  if (!data) return null;
  const allTeachers: Teacher[] = JSON.parse(data);
  return allTeachers.find(t => t.id === id) || null;
};
