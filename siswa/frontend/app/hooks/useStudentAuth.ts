'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Student, Teacher } from '../types';
import { getStudentById, updateStudentProfile } from '../services/studentService';
import { getTeacherById } from '../services/teacherService';
import { CURRENT_STUDENT_KEY } from '../services/storage';

export function useStudentAuth() {
  const [student, setStudent] = useState<Student | null>(null);
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const initAuth = () => {
      if (typeof window === 'undefined') return;

      // 1. Check URL parameters first (e.g., student.dyleks?student_id=412)
      const params = new URLSearchParams(window.location.search);
      const studentIdParam = params.get('student_id');
      
      if (studentIdParam) {
        const found = getStudentById(studentIdParam);
        if (found) {
          localStorage.setItem(CURRENT_STUDENT_KEY, JSON.stringify(found));
          setStudent(found);
          const t = getTeacherById(found.teacherId);
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
        }
      }

      // 2. Check local storage if no URL parameter
      const stored = localStorage.getItem(CURRENT_STUDENT_KEY);
      if (stored) {
        const parsedStudent: Student = JSON.parse(stored);
        // Sync student data with current data in localStorage
        const currentData = getStudentById(parsedStudent.id);
        if (currentData) {
          localStorage.setItem(CURRENT_STUDENT_KEY, JSON.stringify(currentData));
          setStudent(currentData);
          const t = getTeacherById(currentData.teacherId);
          setTeacher(t);
        } else {
          // Clear session if student not found (e.g., deleted by teacher)
          localStorage.removeItem(CURRENT_STUDENT_KEY);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [router]);

  const loginWithId = useCallback((id: string): { success: boolean; error?: string } => {
    const found = getStudentById(id);
    if (!found) {
      return { success: false, error: 'ID Siswa tidak ditemukan. Pastikan Anda memindai QR Code yang benar.' };
    }

    localStorage.setItem(CURRENT_STUDENT_KEY, JSON.stringify(found));
    setStudent(found);
    const t = getTeacherById(found.teacherId);
    setTeacher(t);

    if (found.name === 'Siswa Baru' || found.class === '-') {
      router.push('/register');
    } else {
      router.push('/');
    }

    return { success: true };
  }, [router]);

  const register = useCallback((
    name: string,
    age: number,
    gender: 'boy' | 'girl',
    grade: string
  ): { success: boolean; error?: string } => {
    if (!student) {
      return { success: false, error: 'Sesi siswa tidak valid.' };
    }

    if (!name || !age || !gender || !grade) {
      return { success: false, error: 'Semua data pendaftaran wajib diisi.' };
    }

    const updated = updateStudentProfile(student.id, name, age, gender, grade);
    if (updated) {
      localStorage.setItem(CURRENT_STUDENT_KEY, JSON.stringify(updated));
      setStudent(updated);
      router.push('/');
      return { success: true };
    }

    return { success: false, error: 'Gagal memperbarui profil siswa.' };
  }, [student, router]);

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
    requireAuth
  };
}
