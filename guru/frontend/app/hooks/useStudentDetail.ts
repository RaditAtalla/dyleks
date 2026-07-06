import { useState, useEffect } from 'react';
import { Student } from '../types';
import { updateStudyPlan, generateAIStudyPlan } from '../services/studentService';

export function useStudentDetail(student: Student, onUpdateStudent: (updatedStudent: Student) => void) {
  const [activeTab, setActiveTab] = useState<'profile' | 'stats'>('profile');
  
  // Study Plan states
  const [studyPlanText, setStudyPlanText] = useState(student.studyPlan || '');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Expanded sessions list state
  const [expandedSessionId, setExpandedSessionId] = useState<string | null>(null);

  // Sync state with selected student
  useEffect(() => {
    setStudyPlanText(student.studyPlan || '');
    setSaveStatus('idle');
  }, [student]);

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
    handleSavePlan,
    handleGenerateAIPlan,
    handleToggleSession
  };
}
