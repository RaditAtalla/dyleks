'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Student, Teacher } from '../types';
import { getStudentById, updateStudentProfile, updateStudentPlacement } from '../services/studentService';
import { getTeacherById } from '../services/teacherService';
import { CURRENT_STUDENT_KEY } from '../services/storage';

export function useStudentAuth() {
  const [student, setStudent] = useState<Student | null>(null);
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const initAuth = async () => {
      if (typeof window === 'undefined') return;

      // 1. Check URL parameters first (e.g., student.dyleks?student_id=412)
      const params = new URLSearchParams(window.location.search);
      const studentIdParam = params.get('student_id');
      const teacherIdParam = params.get('teacher_id');
      
      if (studentIdParam) {
        const found = await getStudentById(studentIdParam);
        if (found) {
          localStorage.setItem(CURRENT_STUDENT_KEY, JSON.stringify(found));
          setStudent(found);
          const t = await getTeacherById(found.teacherId);
          setTeacher(t);
          setLoading(false);
          
          // Clear query params to make URL clean
          window.history.replaceState({}, document.title, window.location.pathname);

          // Redirect based on registration completeness
          if (found.name === 'Siswa Baru' || found.class === '-') {
            router.push('/register');
          } else {
            router.push('/');
          }
          return;
        } else if (teacherIdParam) {
          // Unregistered student case: mock student session using teacherIdParam
          const t = await getTeacherById(teacherIdParam);
          if (t) {
            const newDraftStudent: Student = {
              id: studentIdParam,
              teacherId: teacherIdParam,
              name: 'Siswa Baru',
              class: '-',
              currentLevel: 1,
              riskScore: 0,
              riskClass: 'low',
              qrUrl: `http://localhost:8001?student_id=${studentIdParam}&teacher_id=${teacherIdParam}`
            };
            localStorage.setItem(CURRENT_STUDENT_KEY, JSON.stringify(newDraftStudent));
            setStudent(newDraftStudent);
            setTeacher(t);
            setLoading(false);
            
            window.history.replaceState({}, document.title, window.location.pathname);
            router.push('/register');
            return;
          }
        }
      }

      // 2. Check local storage if no URL parameter
      const stored = localStorage.getItem(CURRENT_STUDENT_KEY);
      if (stored) {
        const parsedStudent: Student = JSON.parse(stored);
        // Sync student data with current data in SQLite DB
        const currentData = await getStudentById(parsedStudent.id);
        if (currentData) {
          localStorage.setItem(CURRENT_STUDENT_KEY, JSON.stringify(currentData));
          setStudent(currentData);
          const t = await getTeacherById(currentData.teacherId);
          setTeacher(t);
        } else {
          // If not found in DB, check if it was a draft student that is still registering
          const isDraft = parsedStudent.name === 'Siswa Baru' || parsedStudent.class === '-';
          if (isDraft) {
            setStudent(parsedStudent);
            const t = await getTeacherById(parsedStudent.teacherId);
            setTeacher(t);
          } else {
            // Clear session if student was fully registered but now not found (deleted)
            localStorage.removeItem(CURRENT_STUDENT_KEY);
          }
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [router]);

  const loginWithId = useCallback(async (id: string): Promise<{ success: boolean; error?: string }> => {
    const found = await getStudentById(id);
    if (!found) {
      return { success: false, error: 'ID Siswa tidak ditemukan. Pastikan Anda memindai QR Code yang benar.' };
    }

    localStorage.setItem(CURRENT_STUDENT_KEY, JSON.stringify(found));
    setStudent(found);
    const t = await getTeacherById(found.teacherId);
    setTeacher(t);

    if (found.name === 'Siswa Baru' || found.class === '-') {
      router.push('/register');
    } else {
      router.push('/');
    }

    return { success: true };
  }, [router]);

  const register = useCallback(async (
    name: string,
    age: number,
    gender: 'boy' | 'girl',
    grade: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (!student) {
      return { success: false, error: 'Sesi siswa tidak valid.' };
    }

    if (!name || !age || !gender || !grade) {
      return { success: false, error: 'Semua data pendaftaran wajib diisi.' };
    }

    const updated = await updateStudentProfile(student.id, name, age, gender, grade, student.teacherId);
    if (updated) {
      localStorage.setItem(CURRENT_STUDENT_KEY, JSON.stringify(updated));
      setStudent(updated);
      router.push('/');
      return { success: true };
    }

    return { success: false, error: 'Gagal memperbarui profil siswa.' };
  }, [student]);

  const submitPlacement = useCallback(async (
    level: number,
    score: number,
    riskClass: 'low' | 'medium' | 'high',
    xp?: number
  ): Promise<{ success: boolean; error?: string }> => {
    if (!student) {
      return { success: false, error: 'Sesi siswa tidak valid.' };
    }

    const updated = await updateStudentPlacement(student.id, level, score, riskClass, xp);
    if (updated) {
      localStorage.setItem(CURRENT_STUDENT_KEY, JSON.stringify(updated));
      setStudent(updated);
      return { success: true };
    }

    return { success: false, error: 'Gagal menyimpan hasil penempatan.' };
  }, [student]);

  const refreshStudent = useCallback(async () => {
    if (!student) return;
    const currentData = await getStudentById(student.id);
    if (currentData) {
      localStorage.setItem(CURRENT_STUDENT_KEY, JSON.stringify(currentData));
      setStudent(currentData);
      const t = await getTeacherById(currentData.teacherId);
      setTeacher(t);
    }
  }, [student]);

  const logout = useCallback(() => {
    localStorage.removeItem(CURRENT_STUDENT_KEY);
    setStudent(null);
    setTeacher(null);
    router.push('/login');
  }, [router]);

  const requireAuth = useCallback(() => {
    if (loading) return;

    if (!student) {
      if (pathname !== '/login') {
        router.push('/login');
      }
    } else {
      const isDraft = student.name === 'Siswa Baru' || student.class === '-';
      if (isDraft && pathname !== '/register') {
        router.push('/register');
      } else if (!isDraft && (pathname === '/login' || pathname === '/register')) {
        router.push('/');
      }
    }
  }, [student, loading, pathname, router]);

  return {
    student,
    teacher,
    loading,
    loginWithId,
    register,
    logout,
    requireAuth,
    refreshStudent,
    submitPlacement
  };
}
