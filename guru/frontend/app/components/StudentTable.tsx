'use client';

import { useState } from 'react';
import { Student, StudentTableProps } from '../types';
import { QrCode, Trash2, Search, UserPlus } from 'lucide-react';



export default function StudentTable({ students, onShowQR, onDelete, onAddStudent, onSelectStudent, selectedStudentId }: StudentTableProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.class.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRiskBadge = (riskClass: 'high' | 'medium' | 'low') => {
    switch (riskClass) {
      case 'high':
        return (
          <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-md bg-rose-50 text-rose-750 border border-rose-100">
            Tinggi
          </span>
        );
      case 'medium':
        return (
          <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-md bg-amber-50 text-amber-750 border border-amber-105 border-amber-100">
            Sedang
          </span>
        );
      case 'low':
        return (
          <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-md bg-emerald-50 text-emerald-750 border border-emerald-100">
            Rendah
          </span>
        );
    }
  };

  return (
    <div className="flex flex-col bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">

      {/* Table Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-6 gap-4 border-b border-slate-100">
        <div>
          <h3 className="text-md font-semibold text-slate-800">Daftar Siswa</h3>
          <p className="text-xs text-slate-500">Kumpulan data hasil skrining siswa</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-60">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-4 h-4 text-slate-400" />
            </span>
            <input
              id="student-search-input"
              type="text"
              placeholder="Cari siswa atau kelas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:border-slate-450 focus:ring-1 focus:ring-slate-300 transition-colors"
            />
          </div>
          <button
            id="add-student-btn-table"
            onClick={onAddStudent}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-xl hover:bg-slate-850 active:bg-slate-950 transition-colors cursor-pointer whitespace-nowrap"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Tambah Siswa Baru</span>
          </button>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        {filteredStudents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-400 text-sm bg-white">
            <p>Tidak ada siswa ditemukan.</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs font-semibold border-b border-slate-100">
                <th className="px-6 py-4">Nama Siswa</th>
                <th className="px-6 py-4">Kelas</th>
                <th className="px-6 py-4 text-center">Level Game</th>
                <th className="px-6 py-4 text-center">Skor Risiko</th>
                <th className="px-6 py-4 text-center">Status Risiko</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm text-slate-650">
              {filteredStudents.map((student) => (
                <tr 
                  key={student.id} 
                  onClick={(e) => {
                    console.log("Row clicked for student:", student.name);
                    const target = e.target as HTMLElement;
                    if (target.closest('button')) {
                      console.log("Click ignored because it was on a button");
                      return;
                    }
                    console.log("Firing onSelectStudent with:", student);
                    onSelectStudent?.(student);
                  }}
                  className={`transition-colors cursor-pointer border-l-2 ${
                    selectedStudentId === student.id 
                      ? 'bg-slate-50/90 border-slate-900' 
                      : 'hover:bg-slate-50/50 border-transparent'
                  }`}
                >
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-800">{student.name}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">ID: {student.id}</div>
                  </td>
                  <td className="px-6 py-4 font-medium">{student.class}</td>
                  <td className="px-6 py-4 text-center font-medium">
                    <span className="inline-block bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-xs font-semibold">
                      Lvl {student.currentLevel}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <span className="font-semibold text-slate-800">{student.riskScore}%</span>
                      <div className="w-12 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${student.riskClass === 'high' ? 'bg-rose-550 bg-rose-500' :
                              student.riskClass === 'medium' ? 'bg-amber-450 bg-amber-500' : 'bg-emerald-450 bg-emerald-500'
                            }`}
                          style={{ width: `${student.riskScore}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {getRiskBadge(student.riskClass)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        id={`show-qr-btn-${student.id}`}
                        onClick={() => onShowQR(student)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                        title="Tampilkan QR Code Login"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                        <span>QR Code</span>
                      </button>
                      <button
                        id={`delete-student-btn-${student.id}`}
                        onClick={() => {
                          if (confirm(`Hapus siswa ${student.name}?`)) {
                            onDelete(student.id);
                          }
                        }}
                        className="p-1.5 border border-transparent rounded-lg text-rose-500 hover:bg-rose-50 hover:border-rose-100 transition-colors cursor-pointer"
                        title="Hapus Siswa"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

    </div>
  );
}
