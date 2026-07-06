import { useState, useEffect } from 'react';
import { Student, GameSession, PsychologistRecommendation } from '../types';
import { updateStudyPlan, generateAIStudyPlan, getStudentRecommendations } from '../services/studentService';
import { getStudentGameSessions, getStudentGameStats } from '../services/gameService';

export function useStudentDetail(student: Student, onUpdateStudent: (updatedStudent: Student) => void) {
  const [activeTab, setActiveTab] = useState<'profile' | 'stats'>('profile');
  
  // Study Plan states
  const [studyPlanText, setStudyPlanText] = useState(student.studyPlan || '');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Expanded sessions list state
  const [expandedSessionId, setExpandedSessionId] = useState<string | null>(null);

  // Live game stats states
  const [sessions, setSessions] = useState<GameSession[]>([]);
  const [gameStats, setGameStats] = useState<{ accuracy: string; commonWrong: string }>({ accuracy: '0%', commonWrong: '-' });
  const [psychologists, setPsychologists] = useState<PsychologistRecommendation[]>([]);
  const [isLoadingStats, setIsLoadingStats] = useState(false);

  // Sync state with selected student
  useEffect(() => {
    setStudyPlanText(student.studyPlan || '');
    setSaveStatus('idle');
    // Clear sessions & stats when student changes to avoid showing stale data from the previous student
    setSessions([]);
    setGameStats({ accuracy: '0%', commonWrong: '-' });
    setPsychologists([]);
  }, [student]);

  // Load stats, sessions and recommendations when selected student changes
  useEffect(() => {
    const fetchAllData = async () => {
      if (!student.id) return;
      setIsLoadingStats(true);
      try {
        const [sessData, statsData, recsData] = await Promise.all([
          getStudentGameSessions(student.id),
          getStudentGameStats(student.id),
          getStudentRecommendations(student.id)
        ]);
        setSessions(sessData);
        setGameStats(statsData);
        setPsychologists(recsData);
      } catch (e) {
        console.error("Error loading student details:", e);
      } finally {
        setIsLoadingStats(false);
      }
    };

    fetchAllData();
  }, [student.id]);

  // Handle Save Study Plan
  const handleSavePlan = async () => {
    setIsSaving(true);
    setSaveStatus('idle');
    try {
      const updated = await updateStudyPlan(student.id, studyPlanText);
      if (updated) {
        setSaveStatus('success');
        onUpdateStudent(updated);
        setTimeout(() => setSaveStatus('idle'), 3000);
      } else {
        setSaveStatus('error');
      }
    } catch (error) {
      console.error(error);
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle AI Generate Study Plan
  const handleGenerateAIPlan = async () => {
    setIsGenerating(true);
    setSaveStatus('idle');
    try {
      const plan = await generateAIStudyPlan(student.id);
      if (plan) {
        setStudyPlanText(plan);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleToggleSession = (id: string | null) => {
    setExpandedSessionId(id);
  };

  return {
    activeTab,
    setActiveTab,
    studyPlanText,
    setStudyPlanText,
    isGenerating,
    isSaving,
    saveStatus,
    expandedSessionId,
    sessions,
    gameStats,
    psychologists,
    isLoadingStats,
    handleSavePlan,
    handleGenerateAIPlan,
    handleToggleSession
  };
}
