'use client';

import { useState, useEffect, useCallback } from 'react';
import { Student, ActivityLog } from '../types';
import { getStudents, createTemporaryStudent, commitStudent, deleteStudent } from '../services/studentService';
import { getLogs, addActivityLog } from '../services/logService';

export function useStudents(teacherId: string | undefined) {
  const [students, setStudents] = useState<Student[]>([]);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [stats, setStats] = useState({ total: 0, high: 0, medium: 0, low: 0 });

  const refreshData = useCallback(() => {
    if (!teacherId) return;
    const studentList = getStudents(teacherId);
    const logList = getLogs(teacherId);
    
    setStudents(studentList);
    setLogs(logList);

    // Calculate risk stats
    const total = studentList.length;
    const high = studentList.filter(s => s.riskClass === 'high').length;
    const medium = studentList.filter(s => s.riskClass === 'medium').length;
    const low = studentList.filter(s => s.riskClass === 'low').length;
    
    setStats({ total, high, medium, low });
  }, [teacherId]);

  useEffect(() => {
    if (teacherId) {
      refreshData();
    }
  }, [teacherId, refreshData]);

  const generateTempStudent = () => {
    if (!teacherId) return null;
    return createTemporaryStudent(teacherId);
  };

  const removeStudent = (studentId: string) => {
    if (!teacherId) return;
    deleteStudent(teacherId, studentId);
    refreshData();
  };

  const commitNewStudent = useCallback((student: Student) => {
    if (!teacherId) return;
    commitStudent(student);
    addActivityLog(teacherId, `Siswa Baru (ID: ${student.id})`, 'terdaftar sebagai siswa baru');
    refreshData();
  }, [teacherId, refreshData]);

  return {
    students,
    logs,
    stats,
    generateTempStudent,
    commitNewStudent,
    removeStudent,
    refreshData
  };
}
