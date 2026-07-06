'use client';

import { StudentDetailPanelProps } from '../types';
import { useStudentDetail } from '../hooks/useStudentDetail';
import { getMockRecommendations } from '../services/mockDataService';
import ProfileTab from './detail/ProfileTab';
import StatsTab from './detail/StatsTab';
import { X, FileText, BarChart2, Brain } from 'lucide-react';

export default function StudentDetailPanel({ student, onClose, onUpdateStudent }: StudentDetailPanelProps) {
  const {
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
    handleSavePlan,
    handleGenerateAIPlan,
    handleToggleSession
  } = useStudentDetail(student, onUpdateStudent);

  // Determine Risk styling
  const getRiskColor = (riskClass: string) => {
    switch (riskClass) {
      case 'high': return { bg: 'bg-rose-50', border: 'border-rose-100', text: 'text-rose-700', progress: 'bg-rose-500' };
      case 'medium': return { bg: 'bg-amber-50', border: 'border-amber-100', text: 'text-amber-700', progress: 'bg-amber-500' };
      default: return { bg: 'bg-emerald-50', border: 'border-emerald-100', text: 'text-emerald-700', progress: 'bg-emerald-500' };
    }
  };
  const riskStyle = getRiskColor(student.riskClass);

  const psychologists = getMockRecommendations(student.id, student.name, student.riskClass, student.currentLevel);

  return (
    <div className="flex flex-col h-full bg-white text-slate-800 animate-fadeIn">
      {/* Panel Header */}
      <div className="flex items-start justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          {/* Avatar circle */}
          <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm ${riskStyle.bg} ${riskStyle.text} border ${riskStyle.border}`}>
            {student.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()}
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-sm leading-tight">{student.name}</h3>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded-md font-semibold text-slate-500">ID: {student.id}</span>
              <span className="text-[10px] text-slate-400 font-medium">Kelas {student.class}</span>
              {student.age && <span className="text-[10px] text-slate-400 font-medium">• {student.age} Tahun</span>}
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
          title="Tutup detail"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Risk Indicator Card */}
      <div className={`mt-4 p-4.5 rounded-xl border ${riskStyle.border} ${riskStyle.bg} flex flex-col gap-2.5`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Brain className={`w-4 h-4 ${riskStyle.text}`} />
            <span className="text-xs font-bold text-slate-700">Skor Risiko Disleksia</span>
          </div>
          <span className={`text-xs font-extrabold ${riskStyle.text}`}>{student.riskScore}%</span>
        </div>
        <div className="w-full bg-white/60 rounded-full h-2 overflow-hidden border border-slate-200/50">
          <div className={`h-full rounded-full ${riskStyle.progress}`} style={{ width: `${student.riskScore}%` }} />
        </div>
        <p className="text-[10px] text-slate-500 font-medium leading-relaxed mt-0.5">
          {student.riskClass === 'high' 
            ? 'Siswa tergolong Risiko Tinggi. Memerlukan atensi akademis khusus dan pendekatan multisensori yang intens.'
            : student.riskClass === 'medium'
            ? 'Siswa tergolong Risiko Sedang. Disarankan memberikan latihan adaptif dan pemantauan berkala.'
            : 'Siswa tergolong Risiko Rendah. Perkembangan normal, pertahankan latihan ejaan dasar.'}
        </p>
      </div>

      {/* Tabs Menu */}
      <div className="flex border-b border-slate-100 mt-4.5 font-medium">
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === 'profile' 
              ? 'border-slate-800 text-slate-850' 
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Profil & Catatan</span>
        </button>
        <button
          onClick={() => setActiveTab('stats')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === 'stats' 
              ? 'border-slate-800 text-slate-850' 
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          <BarChart2 className="w-3.5 h-3.5" />
          <span>Statistik & Latihan</span>
        </button>
      </div>

      {/* Tab Contents Area */}
      <div className="flex-1 py-4 overflow-y-auto min-h-0 space-y-5">
        {activeTab === 'profile' ? (
          <ProfileTab
            student={student}
            studyPlanText={studyPlanText}
            setStudyPlanText={setStudyPlanText}
            isGenerating={isGenerating}
            isSaving={isSaving}
            saveStatus={saveStatus}
            onSavePlan={handleSavePlan}
            onGenerateAIPlan={handleGenerateAIPlan}
            psychologists={psychologists}
          />
        ) : (
          <StatsTab
            student={student}
            gameStats={gameStats}
            sessions={sessions}
            expandedSessionId={expandedSessionId}
            onToggleSession={handleToggleSession}
          />
        )}
      </div>
    </div>
  );
}
