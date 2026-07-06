export interface Psychologist {
  id: string;
  fullName: string;
  username: string;
  strNumber: string;
  clinic: string;
}

export interface Student {
  id: string;
  teacherId: string;
  name: string;
  class: string; // Grade / Class
  currentLevel: number;
  riskScore: number; // 0-100%
  riskClass: 'high' | 'medium' | 'low';
  teacherName: string;
  schoolName: string;
  age?: number;
  gender?: 'boy' | 'girl' | string;
  studyPlan?: string;
  xp?: number;
}

export interface QuestionResult {
  questionNo: number;
  type: 'choice' | 'handwriting';
  target: string;
  answer: string;
  isCorrect: boolean;
  ocrAccuracy?: number;
}

export interface GameSession {
  id: string;
  date: string;
  level: number;
  accuracy: number;
  correctCount: number;
  totalCount: number;
  questions: QuestionResult[];
}

export interface PsychologistRecommendation {
  id: string;
  name: string; // Psychologist name
  dateCreated: string;
  clinicalObservation: string;
  therapyPlan: string;
  psychologistId?: string;
}
