import { Student, PsychologistRecommendation } from '../types';
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

  const qrUrl = `http://localhost:8001?student_id=${studentId}&teacher_id=${teacherId}`;
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

export const updateStudyPlan = async (studentId: string, studyPlan: string): Promise<Student | null> => {
  try {
    const response = await fetch(`${GURU_API_URL}/api/students/${studentId}/study-plan`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ studyPlan }),
    });
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error("Error updating study plan:", error);
    return null;
  }
};

export const generateAIStudyPlan = async (studentId: string): Promise<string> => {
  try {
    const response = await fetch(`${GURU_API_URL}/api/students/${studentId}/study-plan/generate`, {
      method: 'POST',
    });
    if (!response.ok) return "";
    const data = await response.json();
    return data.studyPlan;
  } catch (error) {
    console.error("Error generating AI study plan:", error);
    return "";
  }
};

export const getStudentRecommendations = async (studentId: string): Promise<PsychologistRecommendation[]> => {
  try {
    const response = await fetch(`${GURU_API_URL}/api/students/${studentId}/recommendations`);
    if (!response.ok) return [];
    return await response.json();
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    return [];
  }
};

