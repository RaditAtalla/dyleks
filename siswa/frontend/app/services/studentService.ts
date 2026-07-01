import { Student, ActivityLog } from '../types';
import { isClient, STUDENTS_KEY, LOGS_KEY } from './storage';

export const getStudentById = (id: string): Student | null => {
  if (!isClient()) return null;
  const data = localStorage.getItem(STUDENTS_KEY);
  if (!data) return null;
  const allStudents: Student[] = JSON.parse(data);
  return allStudents.find(s => s.id === id) || null;
};

export const updateStudentProfile = (
  id: string,
  name: string,
  age: number,
  gender: 'boy' | 'girl',
  grade: string
): Student | null => {
  if (!isClient()) return null;
  const data = localStorage.getItem(STUDENTS_KEY);
  if (!data) return null;
  const allStudents: Student[] = JSON.parse(data);
  
  const index = allStudents.findIndex(s => s.id === id);
  if (index === -1) return null;
  
  const updatedStudent: Student = {
    ...allStudents[index],
    name,
    age,
    gender,
    class: grade,
  };
  
  allStudents[index] = updatedStudent;
  localStorage.setItem(STUDENTS_KEY, JSON.stringify(allStudents));
  
  // Log the profile completion event to the teacher activity log
  addStudentLog(updatedStudent.teacherId, name, 'telah melengkapi pendaftaran akun siswa');
  
  return updatedStudent;
};

const addStudentLog = (teacherId: string, studentName: string, action: string) => {
  if (!isClient()) return;
  const data = localStorage.getItem(LOGS_KEY);
  const allLogs: ActivityLog[] = data ? JSON.parse(data) : [];
  
  const newLog: ActivityLog = {
    id: Math.random().toString(36).substr(2, 9),
    teacherId,
    studentName,
    action,
    timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' - Hari ini'
  };
  
  allLogs.unshift(newLog);
  localStorage.setItem(LOGS_KEY, JSON.stringify(allLogs));
};
