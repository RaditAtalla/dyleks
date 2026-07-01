'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Teacher } from '../types';
import { getTeachers, saveTeacher } from '../services/teacherService';

export function useAuth() {
  const [currentTeacher, setCurrentTeacher] = useState<Teacher | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem('dyleks_current_teacher');
    if (stored) {
      setCurrentTeacher(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // Basic validation
    if (!username || !password) {
      return { success: false, error: 'Username dan Password harus diisi.' };
    }

    const teachers = getTeachers();
    const found = teachers.find(t => t.username.toLowerCase() === username.toLowerCase());
    
    // In a real application, password hashing would be used. For mockup, we accept password length >= 4
    if (!found) {
      return { success: false, error: 'Username tidak ditemukan.' };
    }

    // Standard static password check or simply letting password pass for mockup
    // Let's assume the mock registry password is correct or just mock successful verify
    localStorage.setItem('dyleks_current_teacher', JSON.stringify(found));
    setCurrentTeacher(found);
    
    router.push('/');
    return { success: true };
  };

  const register = async (
    fullName: string,
    schoolName: string,
    city: string,
    username: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (!fullName || !schoolName || !city || !username || !password) {
      return { success: false, error: 'Semua kolom harus diisi.' };
    }

    if (password.length < 4) {
      return { success: false, error: 'Password minimal 4 karakter.' };
    }

    const teachers = getTeachers();
    const exists = teachers.some(t => t.username.toLowerCase() === username.toLowerCase());
    if (exists) {
      return { success: false, error: 'Username sudah digunakan oleh guru lain.' };
    }

    const newTeacher: Teacher = {
      id: Math.random().toString(36).substr(2, 9),
      fullName,
      schoolName,
      city,
      username
    };

    saveTeacher(newTeacher);
    
    // Set active login session right away or redirect to login
    localStorage.setItem('dyleks_current_teacher', JSON.stringify(newTeacher));
    setCurrentTeacher(newTeacher);
    
    router.push('/');
    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem('dyleks_current_teacher');
    setCurrentTeacher(null);
    router.push('/login');
  };

  const requireAuth = () => {
    if (!loading && !currentTeacher) {
      router.push('/login');
    }
  };

  return {
    teacher: currentTeacher,
    loading,
    login,
    register,
    logout,
    requireAuth
  };
}
