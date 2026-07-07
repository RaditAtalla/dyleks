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
  xp?: number;
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

export interface TracerPoint {
  x: number;
  y: number;
  hint: string;
}

export interface CanvasProps {
  selectedLetter: 'b' | 'd' | 'p' | 'q';
  points: TracerPoint[];
  currentPointIndex: number;
  setCurrentPointIndex: React.Dispatch<React.SetStateAction<number>>;
  completedSegments: Array<{ x1: number; y1: number; x2: number; y2: number }>;
  setCompletedSegments: React.Dispatch<
    React.SetStateAction<Array<{ x1: number; y1: number; x2: number; y2: number }>>
  >;
  onComplete: () => void;
}

export interface CongratsModalProps {
  isOpen: boolean;
  letter: 'b' | 'd' | 'p' | 'q';
  onRestart: () => void;
  onClose: () => void;
  onHome: () => void;
}

export interface MemoryCard {
  id: string;
  value: string;
  isRevealed: boolean;
  isMatched: boolean;
}

export interface LevelSelectStageProps {
  onSelectLevel: (level: number) => void;
  onBackToHome: () => void;
}

export interface GamePlayStageProps {
  level: number;
  levelName: string;
  cards: MemoryCard[];
  onCardClick: (cardId: string) => void;
  onResetLevel: () => void;
  onQuit: () => void;
}

export interface GameFinishStageProps {
  level: number;
  hasNextLevel: boolean;
  onNextLevel: () => void;
  onRestart: () => void;
  onHome: () => void;
}

export interface LatihanBicaraLandingProps {
  studentName: string;
  onStartGame: () => void;
  onBackToHome: () => void;
}

export interface LatihanBicaraPlayProps {
  targetWord: string;
  isSpeaking: boolean;
  onPlaySound: () => void;
  isRecording: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
  spokenText: string;
  isSubmitted: boolean;
  isCorrect: boolean | null;
  onNextWord: () => void;
  onQuit: () => void;
}

export interface ChallengePool {
  name: string;
  items: string[];
}

export type ChallengePools = Record<number, ChallengePool>;

export interface MazePosition {
  x: number;
  y: number;
}

export interface MazeLayout {
  grid: number[][];
  playerStart: MazePosition;
  letterPositions: MazePosition[];
}

export interface LabirinPlayStageProps {
  targetLetter: string;
  rightCount: number;
  wrongCount: number;
  mazeGrid: number[][];
  playerPosition: MazePosition;
  letterPositions: MazePosition[];
  lettersOnMap: string[];
  onMove: (direction: 'up' | 'down' | 'left' | 'right') => void;
  onRestart: () => void;
  onQuit: () => void;
}
