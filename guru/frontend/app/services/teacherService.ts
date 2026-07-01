import { Teacher } from '../types';
import { isClient, TEACHERS_KEY } from './storage';

export const getTeachers = (): Teacher[] => {
  if (!isClient()) return [];
  const data = localStorage.getItem(TEACHERS_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveTeacher = (teacher: Teacher) => {
  if (!isClient()) return;
  const teachers = getTeachers();
  teachers.push(teacher);
  localStorage.setItem(TEACHERS_KEY, JSON.stringify(teachers));
};
