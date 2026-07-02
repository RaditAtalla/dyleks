'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Teacher } from '../types';
import { loginTeacher, registerTeacher } from '../services/teacherService';

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
    if (!username || !password) {
      return { success: false, error: 'Username dan Password harus diisi.' };
    }

    const res = await loginTeacher(username, password);
    if (!res.success || !res.data) {
      return { success: false, error: res.error || 'Username atau password salah.' };
    }

    const found = res.data;
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

    const res = await registerTeacher(fullName, schoolName, city, username, password);
    if (!res.success || !res.data) {
      return { success: false, error: res.error || 'Registrasi gagal.' };
    }

    const newTeacher = res.data;
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
