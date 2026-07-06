import { useState, useEffect } from 'react';
import { Student, GameSession } from '../types';
import { updateStudyPlan, generateAIStudyPlan } from '../services/studentService';
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
  const [isLoadingStats, setIsLoadingStats] = useState(false);

  // Sync state with selected student
  useEffect(() => {
    setStudyPlanText(student.studyPlan || '');
    setSaveStatus('idle');
    // Clear sessions & stats when student changes to avoid showing stale data from the previous student
    setSessions([]);
    setGameStats({ accuracy: '0%', commonWrong: '-' });
  }, [student]);

  // Load stats and sessions when selected student or tab changes
  useEffect(() => {
    const fetchStats = async () => {
      if (!student.id) return;
      setIsLoadingStats(true);
      try {
        const [sessData, statsData] = await Promise.all([
          getStudentGameSessions(student.id),
          getStudentGameStats(student.id)
        ]);
        setSessions(sessData);
        setGameStats(statsData);
      } catch (e) {
        console.error("Error loading student stats:", e);
      } finally {
        setIsLoadingStats(false);
      }
    };

    if (activeTab === 'stats') {
      fetchStats();
    }
  }, [student.id, activeTab]);

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
    isLoadingStats,
    handleSavePlan,
    handleGenerateAIPlan,
    handleToggleSession
  };
}
