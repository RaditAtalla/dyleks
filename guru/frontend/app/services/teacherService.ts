import { Teacher } from '../types';
import { GURU_API_URL } from './storage';

export const getTeacherById = async (id: string): Promise<Teacher | null> => {
  try {
    const response = await fetch(`${GURU_API_URL}/api/teachers/${id}`);
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error("Error fetching teacher:", error);
    return null;
  }
};

export const loginTeacher = async (username: string, password: string): Promise<{ success: boolean; data?: Teacher; error?: string }> => {
  try {
    const response = await fetch(`${GURU_API_URL}/api/teachers/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    
    const resData = await response.json();
    if (!response.ok) {
      return { success: false, error: resData.detail || 'Login gagal.' };
    }
    return { success: true, data: resData };
  } catch (error) {
    console.error("Error logging in:", error);
    return { success: false, error: 'Tidak dapat terhubung ke server.' };
  }
};

export const registerTeacher = async (
  fullName: string,
  schoolName: string,
  city: string,
  username: string,
  password: string
): Promise<{ success: boolean; data?: Teacher; error?: string }> => {
  try {
    const response = await fetch(`${GURU_API_URL}/api/teachers/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fullName, schoolName, city, username, password }),
    });
    
    const resData = await response.json();
    if (!response.ok) {
      return { success: false, error: resData.detail || 'Registrasi gagal.' };
    }
    return { success: true, data: resData };
  } catch (error) {
    console.error("Error registering teacher:", error);
    return { success: false, error: 'Tidak dapat terhubung ke server.' };
  }
};
