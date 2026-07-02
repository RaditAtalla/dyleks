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
  type: 'choice' | 'handwriting';
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
  onHandwritingResult: (detected: string, accuracy: number, isCorrect: boolean) => void;
  ocrResult: { detected: string; accuracy: number } | null;
}

export interface ChoiceQuizProps {
  question: QuizQuestion;
  selectedOption: string | null;
  onSelectOption: (option: string) => void;
  isSubmitted: boolean;
}

export interface HandwritingQuizProps {
  question: QuizQuestion;
  onHandwritingResult: (detected: string, accuracy: number, isCorrect: boolean) => void;
  isSubmitted: boolean;
  ocrResult: { detected: string; accuracy: number } | null;
}

export interface FinishStageProps {
  correctCount: number;
  incorrectCount: number;
  onRestart: () => void;
  onFinish: () => void;
}

