export const isClient = () => typeof window !== 'undefined';

export const TEACHERS_KEY = 'dyleks_teachers';
export const STUDENTS_KEY = 'dyleks_students';
export const LOGS_KEY = 'dyleks_logs';

export const GURU_API_URL = process.env.NEXT_PUBLIC_GURU_API_URL || 'http://127.0.0.1:3006';
