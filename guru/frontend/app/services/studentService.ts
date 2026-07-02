import { Student } from '../types';
import { GURU_API_URL } from './storage';

export const getStudents = async (teacherId: string): Promise<Student[]> => {
  try {
    const response = await fetch(`${GURU_API_URL}/api/students?teacher_id=${teacherId}`);
    if (!response.ok) return [];
    return await response.json();
  } catch (error) {
    console.error("Error fetching students:", error);
    return [];
  }
};

export const getStudentById = async (studentId: string): Promise<Student | null> => {
  try {
    const response = await fetch(`${GURU_API_URL}/api/students/${studentId}`);
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error("Error fetching student by id:", error);
    return null;
  }
};

export const generateRegistrationDetails = async (teacherId: string): Promise<{ studentId: string; qrUrl: string }> => {
  let studentId = "";
  let exists = true;
  let attempts = 0;

  while (exists && attempts < 10) {
    studentId = Math.floor(100 + Math.random() * 900).toString(); // 3-digit random number
    const student = await getStudentById(studentId);
    exists = student !== null;
    attempts++;
  }

  const qrUrl = `http://localhost:3001?student_id=${studentId}&teacher_id=${teacherId}`;
  return { studentId, qrUrl };
};

export const deleteStudent = async (teacherId: string, studentId: string): Promise<boolean> => {
  try {
    const response = await fetch(`${GURU_API_URL}/api/students/${studentId}?teacher_id=${teacherId}`, {
      method: 'DELETE',
    });
    return response.ok;
  } catch (error) {
    console.error("Error deleting student:", error);
    return false;
  }
};
