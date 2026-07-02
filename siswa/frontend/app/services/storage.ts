export const isClient = () => typeof window !== 'undefined';

export const TEACHERS_KEY = 'dyleks_teachers';
export const STUDENTS_KEY = 'dyleks_students';
export const LOGS_KEY = 'dyleks_logs';
export const CURRENT_STUDENT_KEY = 'dyleks_current_student';

export const SISWA_API_URL = process.env.NEXT_PUBLIC_SISWA_API_URL || 'http://127.0.0.1:8002';
