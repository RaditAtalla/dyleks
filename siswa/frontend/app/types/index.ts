export interface Teacher {
  id: string;
  fullName: string;
  schoolName: string;
  city: string;
  username: string;
}

export interface Student {
  id: string;
  teacherId: string;
  name: string;
  class: string; // Grade / Class
  currentLevel: number;
  riskScore: number; // 0-100%
  riskClass: 'high' | 'medium' | 'low';
  qrUrl: string;
  age?: number;
  gender?: 'boy' | 'girl';
}

export interface ActivityLog {
  id: string;
  teacherId: string;
  studentName: string;
  action: string;
  timestamp: string;
}

export interface Game {
  id: string;
  name: string;
  description: string;
  color: string; // Tailwind color theme
  iconName: string;
}

export interface QuizQuestion {
  target: string;
  options: string[];
}

export interface LandingStageProps {
  studentName: string;
  onStartGame: () => void;
  onBackToHome: () => void;
}

export interface QuizStageProps {
  currentIndex: number;
  totalQuestions: number;
  question: QuizQuestion;
  selectedOption: string | null;
  onSelectOption: (option: string) => void;
  isSubmitted: boolean;
  onSubmitAnswer: () => void;
  onNext: () => void;
  onQuit: () => void;
  isSpeaking: boolean;
  onPlaySound: () => void;
}

export interface FinishStageProps {
  correctCount: number;
  incorrectCount: number;
  onRestart: () => void;
  onFinish: () => void;
}

