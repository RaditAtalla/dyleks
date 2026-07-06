'use client';

import { PsychologistCardProps } from '../../types';
import { Calendar } from 'lucide-react';

export default function PsychologistCard({ recommendation }: PsychologistCardProps) {
  return (
    <div className="p-3.5 bg-slate-550/5 bg-slate-550/5 bg-slate-50/50 border border-slate-100 rounded-xl space-y-2.5">
      <div className="flex items-start justify-between">
        <h4 className="text-[11px] font-bold text-slate-800 leading-snug">{recommendation.name}</h4>
        <span className="text-[9px] text-slate-400 font-semibold flex items-center gap-1 shrink-0 ml-2">
          <Calendar className="w-2.5 h-2.5 text-slate-400" />
          {recommendation.dateCreated}
        </span>
      </div>
      <div className="space-y-1.5">
        <div>
          <span className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400">Observasi Klinis:</span>
          <p className="text-[10px] text-slate-600 leading-relaxed font-medium mt-0.5">{recommendation.clinicalObservation}</p>
        </div>
        <div>
          <span className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400">Rencana Terapi/Rujukan:</span>
          <p className="text-[10px] text-slate-600 leading-relaxed font-medium mt-0.5">{recommendation.therapyPlan}</p>
        </div>
      </div>
    </div>
  );
}
