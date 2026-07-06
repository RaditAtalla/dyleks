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
  studyPlan?: string;
}

export interface ActivityLog {
  id: string;
  teacherId: string;
  studentName: string;
  action: string;
  timestamp: string;
}

export interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentId: string;
  qrUrl: string;
}

export interface StudentTableProps {
  students: Student[];
  onShowQR: (student: Student) => void;
  onDelete: (studentId: string) => void;
  onAddStudent: () => void;
  onSelectStudent?: (student: Student) => void;
  selectedStudentId?: string;
}

export interface ActivityLogListProps {
  logs: ActivityLog[];
}

export interface PsychologistRecommendation {
  id: string;
  name: string;
  dateCreated: string;
  clinicalObservation: string;
  therapyPlan: string;
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

export interface StudentDetailPanelProps {
  student: Student;
  onClose: () => void;
  onUpdateStudent: (updatedStudent: Student) => void;
}

export interface ProfileTabProps {
  student: Student;
  studyPlanText: string;
  setStudyPlanText: (text: string) => void;
  isGenerating: boolean;
  isSaving: boolean;
  saveStatus: 'idle' | 'success' | 'error';
  onSavePlan: () => void;
  onGenerateAIPlan: () => void;
  psychologists: PsychologistRecommendation[];
}

export interface PsychologistCardProps {
  recommendation: PsychologistRecommendation;
}

export interface StatsTabProps {
  student: Student;
  gameStats: { accuracy: string; commonWrong: string };
  sessions: GameSession[];
  expandedSessionId: string | null;
  onToggleSession: (id: string | null) => void;
}

export interface SessionCardProps {
  session: GameSession;
  isExpanded: boolean;
  onToggle: () => void;
}

