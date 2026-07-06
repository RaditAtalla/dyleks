'use client';

import { ProfileTabProps } from '../../types';
import { Brain, Sparkles, Save, CheckCircle2, XCircle, FileText } from 'lucide-react';
import PsychologistCard from './PsychologistCard';

export default function ProfileTab({
  studyPlanText,
  setStudyPlanText,
  isGenerating,
  isSaving,
  saveStatus,
  onSavePlan,
  onGenerateAIPlan,
  psychologists
}: ProfileTabProps) {
  return (
    <>
      {/* Study Plan Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Brain className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-bold text-slate-800">Rencana Pembelajaran Orton-Gillingham</span>
          </div>
          <button
            id="generate-ai-plan-btn"
            onClick={onGenerateAIPlan}
            disabled={isGenerating}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-900 text-white rounded-lg text-[10px] font-semibold hover:bg-slate-800 active:bg-slate-950 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isGenerating ? (
              <>
                <div className="w-3 h-3 border border-white border-t-transparent animate-spin rounded-full" />
                <span>Membuat...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3 h-3" />
                <span>Rancang dengan AI</span>
              </>
            )}
          </button>
        </div>

        <textarea
          value={studyPlanText}
          onChange={(e) => setStudyPlanText(e.target.value)}
          placeholder="Rencana pembelajaran siswa belum dibuat. Gunakan tombol 'Rancang dengan AI' atau ketik rencana belajar kustom secara mandiri di sini..."
          rows={7}
          className="w-full p-3 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:border-slate-450 focus:ring-1 focus:ring-slate-300 transition-colors font-mono resize-none leading-relaxed bg-slate-50/20"
        />

        <div className="flex items-center justify-end gap-3">
          {saveStatus === 'success' && (
            <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Rencana berhasil disimpan
            </span>
          )}
          {saveStatus === 'error' && (
            <span className="text-[10px] text-rose-600 font-semibold flex items-center gap-1">
              <XCircle className="w-3.5 h-3.5" />
              Gagal menyimpan rencana
            </span>
          )}
          <button
            onClick={onSavePlan}
            disabled={isSaving}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-900 rounded-lg text-[10px] font-bold text-slate-900 hover:bg-slate-50 active:bg-slate-100 transition-colors disabled:opacity-50 cursor-pointer"
          >
            <Save className="w-3 h-3" />
            <span>{isSaving ? 'Menyimpan...' : 'Simpan Rencana'}</span>
          </button>
        </div>
      </div>

      <hr className="border-slate-100" />

      {/* Psychologist Recommendations Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-1.5">
          <FileText className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-bold text-slate-800">Rekomendasi Psikolog ({psychologists.length})</span>
        </div>
        
        {/* Variable height list styled as a fixed-height scroll container */}
        <div className="max-h-[280px] overflow-y-auto space-y-3 pr-1">
          {psychologists.length === 0 ? (
            <p className="text-xs text-slate-400 font-medium italic py-2">Belum ada rekomendasi dari psikolog untuk siswa ini.</p>
          ) : (
            psychologists.map((rec) => (
              <PsychologistCard key={rec.id} recommendation={rec} />
            ))
          )}
        </div>
      </div>
    </>
  );
}
