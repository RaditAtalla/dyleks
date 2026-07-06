'use client';

import { SessionCardProps } from '../../types';
import { ChevronDown, ChevronUp, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';

export default function SessionCard({ session, isExpanded, onToggle }: SessionCardProps) {
  return (
    <div className="border border-slate-100 rounded-xl overflow-hidden bg-white">
      
      {/* Session Header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-3.5 hover:bg-slate-50/30 transition-colors text-left cursor-pointer"
      >
        <div className="space-y-1">
          <div className="text-xs font-bold text-slate-800">Latihan Bertahap (Level {session.level})</div>
          <div className="text-[10px] text-slate-400 font-medium">{session.date}</div>
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
            session.accuracy >= 80 
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
              : session.accuracy >= 60 
              ? 'bg-amber-50 text-amber-700 border border-amber-100' 
              : 'bg-rose-50 text-rose-700 border border-rose-100'
          }`}>
            {session.correctCount}/{session.totalCount} Benar ({session.accuracy}%)
          </span>
          {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </div>
      </button>

      {/* Session Details (Questions 1-10) */}
      {isExpanded && (
        <div className="border-t border-slate-100 bg-slate-50/20 p-3.5 space-y-2 animate-slideDown">
          <div className="text-[10px] uppercase tracking-wider font-extrabold text-slate-405 text-slate-400 mb-2">Detail Butir Soal:</div>
          <div className="grid grid-cols-1 gap-2">
            {session.questions.map((q) => (
              <div key={q.questionNo} className="flex items-center justify-between bg-white p-2 rounded-lg border border-slate-100 text-[11px]">
                <div className="flex items-center gap-2">
                  <span className="w-4.5 font-bold text-slate-400">#{q.questionNo}</span>
                  <span className="text-slate-650 text-slate-600">
                    {q.type === 'choice' ? 'Pilihan Huruf' : 'Menulis Huruf'}
                  </span>
                  <div className="flex items-center gap-1 text-[10px]">
                    <span className="bg-slate-100 px-1.5 py-0.2 rounded-sm text-slate-500 font-semibold">Target: {q.target}</span>
                    <ArrowRight className="w-2.5 h-2.5 text-slate-400 animate-pulse" />
                    <span className={`px-1.5 py-0.2 rounded-sm font-semibold ${q.isCorrect ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                      Jawab: {q.answer}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  {q.ocrAccuracy !== undefined && (
                    <span className="text-[9px] text-slate-400 font-semibold">OCR: {q.ocrAccuracy}%</span>
                  )}
                  {q.isCorrect ? (
                    <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500 shrink-0" />
                  ) : (
                    <XCircle className="w-4.5 h-4.5 text-rose-500 shrink-0" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
