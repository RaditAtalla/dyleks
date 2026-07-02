'use client';

import { useState, useEffect, useCallback } from 'react';
import { Student, ActivityLog } from '../types';
import { getStudents, deleteStudent } from '../services/studentService';
import { getLogs } from '../services/logService';

export function useStudents(teacherId: string | undefined) {
  const [students, setStudents] = useState<Student[]>([]);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [stats, setStats] = useState({ total: 0, high: 0, medium: 0, low: 0 });

  const refreshData = useCallback(async () => {
    if (!teacherId) return;
    const studentList = await getStudents(teacherId);
    const logList = await getLogs(teacherId);
    
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

  const removeStudent = async (studentId: string) => {
    if (!teacherId) return;
    await deleteStudent(teacherId, studentId);
    await refreshData();
  };

  return {
    students,
    logs,
    stats,
    removeStudent,
    refreshData
  };
}
