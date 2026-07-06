'use client';

import { StatsTabProps } from '../../types';
import { Activity } from 'lucide-react';
import SessionCard from './SessionCard';

export default function StatsTab({
  student,
  gameStats,
  sessions,
  expandedSessionId,
  onToggleSession
}: StatsTabProps) {
  return (
    <>
      {/* Game Stats Overview Card */}
      <div className="p-4 bg-slate-50/50 border border-slate-100 rounded-xl space-y-3">
        <h4 className="text-xs font-bold text-slate-800">Analisis Hasil Game (Latihan Bertahap)</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-3 rounded-lg border border-slate-100">
            <span className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400">Akurasi Rata-rata</span>
            <div className="text-lg font-extrabold text-slate-850 text-slate-800 mt-0.5">{gameStats.accuracy}</div>
          </div>
          <div className="bg-white p-3 rounded-lg border border-slate-100">
            <span className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400">Kesalahan Terbanyak</span>
            <div className="text-[11px] font-bold text-slate-800 mt-1.5 truncate" title={gameStats.commonWrong}>
              {gameStats.commonWrong}
            </div>
          </div>
        </div>
      </div>

      {/* Game Sessions List */}
      <div className="space-y-3">
        <div className="flex items-center gap-1.5">
          <Activity className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-bold text-slate-800">Riwayat Sesi Latihan</span>
        </div>
        
        {/* Fixed height container with internal scrollbars */}
        <div className="max-h-[300px] overflow-y-auto space-y-2.5 pr-1">
          {sessions.map((sess) => (
            <SessionCard
              key={sess.id}
              session={sess}
              isExpanded={expandedSessionId === sess.id}
              onToggle={() => onToggleSession(expandedSessionId === sess.id ? null : sess.id)}
            />
          ))}
        </div>
      </div>
    </>
  );
}
