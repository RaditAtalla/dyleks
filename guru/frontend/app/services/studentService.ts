import { Student, ActivityLog } from '../types';
import { isClient, STUDENTS_KEY } from './storage';
import { addActivityLog, saveLogs } from './logService';

export const getStudents = (teacherId: string): Student[] => {
  if (!isClient()) return [];
  const data = localStorage.getItem(STUDENTS_KEY);
  const allStudents: Student[] = data ? JSON.parse(data) : [];
  const filtered = allStudents.filter(s => s.teacherId === teacherId);

  // If this teacher has no students yet and we haven't initialized, let's pre-populate mock data
  const initializedKey = `dyleks_initialized_${teacherId}`;
  if (filtered.length === 0 && !localStorage.getItem(initializedKey)) {
    const mockStudents = initializeMockData(teacherId);
    localStorage.setItem(initializedKey, 'true');
    return mockStudents;
  }

  return filtered;
};

export const saveStudents = (students: Student[]) => {
  if (!isClient()) return;
  localStorage.setItem(STUDENTS_KEY, JSON.stringify(students));
};

export const createTemporaryStudent = (teacherId: string): Student => {
  const studentId = Math.floor(100 + Math.random() * 900).toString(); // 3-digit random number
  
  // URL target: student.dyleks?student_id=XXX
  const qrUrl = `student.dyleks?student_id=${studentId}`;
  
  return {
    id: studentId,
    teacherId,
    name: "Siswa Baru",
    class: "-",
    currentLevel: 1,
    riskScore: 0,
    riskClass: 'low',
    qrUrl
  };
};

export const commitStudent = (student: Student) => {
  const data = localStorage.getItem(STUDENTS_KEY);
  const allStudents: Student[] = data ? JSON.parse(data) : [];
  allStudents.push(student);
  saveStudents(allStudents);
};

export const deleteStudent = (teacherId: string, studentId: string) => {
  const data = localStorage.getItem(STUDENTS_KEY);
  const allStudents: Student[] = data ? JSON.parse(data) : [];
  
  const student = allStudents.find(s => s.id === studentId && s.teacherId === teacherId);
  const name = student ? student.name : 'Siswa';
  
  const filtered = allStudents.filter(s => !(s.id === studentId && s.teacherId === teacherId));
  saveStudents(filtered);
  
  addActivityLog(teacherId, name, 'telah dihapus dari daftar siswa');
};

const initializeMockData = (teacherId: string): Student[] => {
  const initialStudents: Student[] = [
    {
      id: "412",
      teacherId,
      name: "Budi Santoso",
      class: "3-A",
      currentLevel: 3,
      riskScore: 84,
      riskClass: 'high',
      qrUrl: "student.dyleks?student_id=412"
    },
    {
      id: "283",
      teacherId,
      name: "Ani Wijaya",
      class: "3-A",
      currentLevel: 4,
      riskScore: 48,
      riskClass: 'medium',
      qrUrl: "student.dyleks?student_id=283"
    },
    {
      id: "719",
      teacherId,
      name: "Siti Aminah",
      class: "3-B",
      currentLevel: 2,
      riskScore: 12,
      riskClass: 'low',
      qrUrl: "student.dyleks?student_id=719"
    },
    {
      id: "542",
      teacherId,
      name: "Rian Hidayat",
      class: "3-B",
      currentLevel: 5,
      riskScore: 68,
      riskClass: 'high',
      qrUrl: "student.dyleks?student_id=542"
    }
  ];

  const data = localStorage.getItem(STUDENTS_KEY);
  const allStudents: Student[] = data ? JSON.parse(data) : [];
  const merged = [...allStudents, ...initialStudents];
  saveStudents(merged);

  // Generate initial logs
  const initialLogs: ActivityLog[] = [
    {
      id: "log-1",
      teacherId,
      studentName: "Budi Santoso",
      action: "menyelesaikan latihan level 2",
      timestamp: "10:15 - Hari ini"
    },
    {
      id: "log-2",
      teacherId,
      studentName: "Ani Wijaya",
      action: "meningkat ke level 4",
      timestamp: "09:42 - Hari ini"
    },
    {
      id: "log-3",
      teacherId,
      studentName: "Siti Aminah",
      action: "terdaftar sebagai siswa baru",
      timestamp: "08:30 - Kemarin"
    },
    {
      id: "log-4",
      teacherId,
      studentName: "Rian Hidayat",
      action: "menyelesaikan latihan level 4",
      timestamp: "15:20 - Kemarin"
    }
  ];

  const logsData = localStorage.getItem('dyleks_logs');
  const allLogs: ActivityLog[] = logsData ? JSON.parse(logsData) : [];
  const mergedLogs = [...initialLogs, ...allLogs];
  saveLogs(mergedLogs);

  return initialStudents;
};
