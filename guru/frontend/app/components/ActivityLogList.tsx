'use client';

import { ActivityLogListProps } from '../types';
import { UserPlus, Trophy, Trash2, ArrowUpRight, Award } from 'lucide-react';

export default function ActivityLogList({ logs }: ActivityLogListProps) {

  const getLogIcon = (action: string) => {
    const act = action.toLowerCase();
    if (act.includes('terdaftar')) {
      return <UserPlus className="w-4 h-4 text-sky-500" />;
    }
    if (act.includes('meningkat') || act.includes('level')) {
      return <Award className="w-4 h-4 text-emerald-500" />;
    }
    if (act.includes('latihan') || act.includes('menyelesaikan')) {
      return <Trophy className="w-4 h-4 text-amber-500" />;
    }
    if (act.includes('hapus') || act.includes('dihapus')) {
      return <Trash2 className="w-4 h-4 text-rose-500" />;
    }
    return <ArrowUpRight className="w-4 h-4 text-slate-400" />;
  };

  const getLogBg = (action: string) => {
    const act = action.toLowerCase();
    if (act.includes('terdaftar')) return 'bg-sky-50 border border-sky-100';
    if (act.includes('meningkat') || act.includes('level')) return 'bg-emerald-50 border border-emerald-100';
    if (act.includes('latihan') || act.includes('menyelesaikan')) return 'bg-amber-50 border border-amber-100';
    if (act.includes('hapus') || act.includes('dihapus')) return 'bg-rose-50 border border-rose-100';
    return 'bg-slate-50 border border-slate-100';
  };

  return (
    <div className="flex flex-col h-[240px] bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
      <div className="mb-4 shrink-0">
        <h3 className="text-md font-semibold text-slate-800">Aktivitas Siswa</h3>
        <p className="text-xs text-slate-500">Log aktivitas terbaru dari kelas Anda</p>
      </div>

      <div className="flex-1 overflow-y-auto pr-1">
        {logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-slate-400 text-sm">
            <p>Belum ada aktivitas terekam.</p>
          </div>
        ) : (
          <div className="relative border-l border-slate-100 ml-3.5 pl-5 space-y-5">
            {[...logs].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).map((log) => (
              <div key={log.id} className="relative group">
                {/* Timeline Dot Icon */}
                <div className={`absolute left-[-35px] top-0 p-1.5 rounded-xl ${getLogBg(log.action)} shadow-xs z-10`}>
                  {getLogIcon(log.action)}
                </div>

                {/* Log Details */}
                <div className="flex flex-col">
                  <p className="text-xs font-semibold text-slate-800">
                    {log.studentName}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {log.action}
                  </p>
                  <span className="text-[10px] text-slate-400 mt-1 font-medium">
                    {log.timestamp}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
