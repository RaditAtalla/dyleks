'use client';

import { useState, useEffect } from 'react';
import { Student, GameSession, PsychologistRecommendation } from '../types';
import { apiService } from '../services/api';
import { getPsychologistUser } from '../services/storage';
import { 
  User, Calendar, Brain, Award, PenTool, Save, CheckCircle2, 
  XCircle, FileText, Heart, Activity, Clipboard, Sparkles 
} from 'lucide-react';

function getHandwritingFeedback(target: string, answer: string, isCorrect: boolean, accuracy?: number): string {
  const normTarget = target.toUpperCase();
  const normAnswer = answer.toUpperCase();

  if (isCorrect) {
    if (accuracy && accuracy >= 85) {
      return `Penulisan huruf vokal '${target}' sangat baik. Proporsi bentuk, penempatan stroke, dan ketegasan garis sudah sempurna serta terbaca jelas oleh sensor OCR.`;
    }
    return `Penulisan huruf vokal '${target}' sudah benar dan berhasil dikenali. Untuk hasil lebih maksimal, dorong anak agar menarik garis penutup dengan lebih mantap dan menjaga kestabilan goresan.`;
  }

  // Common errors / substitutions
  if (normTarget === 'E' && normAnswer === 'I') {
    return `Siswa menulis huruf 'E' tetapi terdeteksi sebagai 'I'. Hal ini biasanya terjadi karena garis mendatar di bagian tengah/atas huruf 'E' ditulis terlalu pendek, kurang tegas, atau terputus sehingga sensor hanya mendeteksi batang vertikal lurus. Latih anak memperjelas garis horizontal huruf 'E'.`;
  }
  if (normTarget === 'O' && normAnswer === 'U') {
    return `Huruf 'O' terdeteksi sebagai 'U'. Ini disebabkan lingkaran huruf 'O' tidak ditutup rapat di bagian atasnya (tersisa celah terbuka). Latih anak agar selalu menyelesaikan putaran lingkaran penuh hingga garis bertemu sempurna di titik awal.`;
  }
  if (normTarget === 'U' && normAnswer === 'O') {
    return `Huruf 'U' terdeteksi sebagai 'O'. Hal ini terjadi karena anak menutup bagian atas huruf 'U' secara tidak sengaja saat mengangkat pensil, atau membuat lengkungan atas yang terlalu melengkung masuk. Latih anak menjaga bagian atas huruf 'U' tetap terbuka lebar.`;
  }
  if (normTarget === 'A' && normAnswer === 'O') {
    return `Huruf 'A' terdeteksi sebagai 'O'. Hal ini terjadi karena bagian perut/lingkaran huruf 'A' menyatu dengan tiang kanannya tanpa ada jarak pembeda, atau tiang tegak di sebelah kanan ditulis terlalu pendek atau melengkung. Latih anak membuat garis tegak lurus di sisi kanan huruf 'A'.`;
  }
  if (normTarget === 'O' && normAnswer === 'A') {
    return `Huruf 'O' terdeteksi sebagai 'A'. Ini terjadi karena saat memutar lingkaran, anak membuat goresan ekstra atau tiang semu di sisi kanan luar yang menyerupai tiang huruf 'A'. Latih anak membuat lingkaran polos yang bulat bersih.`;
  }

  // Low accuracy
  if (accuracy && accuracy < 40) {
    return `Tingkat pengenalan sangat rendah (${accuracy}%). Goresan pensil terlihat sangat goyang (tremor motorik halus), terputus-putus, atau bertumpuk-tumpuk sehingga bentuk huruf '${target}' tidak dapat diidentifikasi. Direkomendasikan latihan tracing bertekstur (sandpaper) untuk memperkuat koordinasi sensorik-motorik halus anak.`;
  }

  // General fallback
  return `Huruf '${target}' terdeteksi sebagai '${answer}'. Hal ini menunjukkan adanya distorsi bentuk atau arah tarikan stroke (arah menulis) yang tidak standar sehingga memicu kesalahan pembacaan sensor. Berikan bimbingan tracing visual secara bertahap pada huruf '${target}'.`;
}

interface StudentDetailPanelProps {
  student: Student;
  onClose: () => void;
  onRecommendationAdded: () => void;
}

export default function StudentDetailPanel({ student, onClose, onRecommendationAdded }: StudentDetailPanelProps) {
  const [sessions, setSessions] = useState<GameSession[]>([]);
  const [recommendations, setRecommendations] = useState<PsychologistRecommendation[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  
  // Form State
  const [clinicalObservation, setClinicalObservation] = useState('');
  const [therapyPlan, setTherapyPlan] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch sessions and recommendations for the selected student
  useEffect(() => {
    async function loadStudentData() {
      setIsLoadingData(true);
      setSaveStatus('idle');
      setClinicalObservation('');
      setTherapyPlan('');
      try {
        const [sessData, recData] = await Promise.all([
          apiService.getStudentSessions(student.id),
          apiService.getRecommendations(student.id)
        ]);
        setSessions(sessData);
        setRecommendations(recData);
      } catch (err) {
        console.error('Gagal mengambil data detail siswa:', err);
      } finally {
        setIsLoadingData(false);
      }
    }

    loadStudentData();
  }, [student.id]);

  const handleSaveRecommendation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clinicalObservation.trim() || !therapyPlan.trim()) return;

    const user = getPsychologistUser();
    if (!user) {
      setSaveStatus('error');
      setErrorMessage('Sesi Anda berakhir. Silakan masuk kembali.');
      return;
    }

    setIsSaving(true);
    setSaveStatus('idle');

    try {
      const newRec = await apiService.saveRecommendation(
        student.id,
        {
          clinicalObservation: clinicalObservation.trim(),
          therapyPlan: therapyPlan.trim()
        },
        user.id
      );
      
      setSaveStatus('success');
      setClinicalObservation('');
      setTherapyPlan('');
      
      // Update recommendations list
      setRecommendations(prev => [newRec, ...prev]);
      
      // Notify parent to refresh if needed
      onRecommendationAdded();
    } catch (err: any) {
      setSaveStatus('error');
      setErrorMessage(err.message || 'Gagal menyimpan rekomendasi.');
    } finally {
      setIsSaving(false);
    }
  };

  // Get risk level color badges
  const getRiskBadge = (level: string, score: number) => {
    const base = "px-2 py-1 rounded-lg text-[10px] font-bold tracking-wide uppercase ";
    if (level === 'high') {
      return <span className={base + "bg-rose-50 border border-rose-100 text-rose-600"}>RISIKO TINGGI ({score}%)</span>;
    } else if (level === 'medium') {
      return <span className={base + "bg-amber-50 border border-amber-100 text-amber-600"}>RISIKO SEDANG ({score}%)</span>;
    } else {
      return <span className={base + "bg-emerald-50 border border-emerald-100 text-emerald-600"}>RISIKO RENDAH ({score}%)</span>;
    }
  };

  // Filter sessions that have handwriting questions
  const handwritingSessions = sessions.filter(s => 
    s.questions && s.questions.some(q => q.type === 'handwriting')
  );

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-base font-bold text-slate-800">Detail Skrining Siswa</h2>
          <p className="text-xs text-slate-400">Analisis profil belajar dan pengisian diagnosis psikologi</p>
        </div>
        <button 
          onClick={onClose}
          className="text-xs font-bold text-slate-400 hover:text-slate-600 cursor-pointer"
        >
          Tutup
        </button>
      </div>

      {isLoadingData ? (
        <div className="flex flex-col items-center justify-center py-12 space-y-3">
          <div className="w-6 h-6 border-2 border-slate-900 border-t-transparent animate-spin rounded-full" />
          <span className="text-xs text-slate-400">Memuat data skrining...</span>
        </div>
      ) : (
        <>
          {/* Identity Section */}
          <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-slate-800">{student.name}</h3>
                <p className="text-[11px] text-slate-500 font-semibold mt-0.5">
                  Kelas {student.class} | {student.gender === 'boy' ? 'Laki-laki' : student.gender === 'girl' ? 'Perempuan' : student.gender || '-'} | {student.age ? `${student.age} Tahun` : '-'}
                </p>
              </div>
              <div>
                {getRiskBadge(student.riskClass, student.riskScore)}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200/50 text-[10px]">
              <div>
                <span className="text-slate-400 font-semibold block uppercase tracking-wider">Guru Pendamping</span>
                <span className="text-slate-700 font-bold block mt-0.5">{student.teacherName}</span>
              </div>
              <div>
                <span className="text-slate-400 font-semibold block uppercase tracking-wider">Sekolah</span>
                <span className="text-slate-700 font-bold block mt-0.5">{student.schoolName}</span>
              </div>
            </div>

            <div className="pt-2.5 border-t border-slate-200/50 text-[10px]">
              <span className="text-slate-400 font-semibold block uppercase tracking-wider">hasil observasi guru</span>
              {student.studyPlan ? (
                <div className="mt-1.5 p-2.5 bg-white border border-slate-100 rounded-lg text-[10px] text-slate-750 text-slate-700 whitespace-pre-line leading-relaxed font-mono overflow-x-auto max-h-[140px] overflow-y-auto">
                  {student.studyPlan}
                </div>
              ) : (
                <span className="text-slate-400 italic block mt-1">Belum ada observasi/rencana belajar yang diisi oleh guru.</span>
              )}
            </div>
          </div>

          {/* Handwriting Questions Result Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <PenTool className="w-4 h-4 text-indigo-500" />
              <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wide">Hasil Latihan Menulis Tangan</span>
            </div>

            <div className="max-h-[260px] overflow-y-auto space-y-4 pr-1">
              {handwritingSessions.length === 0 ? (
                <p className="text-xs text-slate-400 italic py-4">Siswa belum memiliki sesi game dengan pertanyaan menulis tangan.</p>
              ) : (
                handwritingSessions.map((session) => {
                  // Get handwriting questions
                  const hwQuestions = session.questions.filter(q => q.type === 'handwriting');
                  
                  return (
                    <div key={session.id} className="p-3 border border-slate-100 rounded-xl space-y-3 bg-slate-50/30">
                      <div className="flex items-center justify-between text-[10px] font-semibold text-slate-400 border-b border-slate-100 pb-1.5">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {session.date}
                        </span>
                        <span className="px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded">
                          Level {session.level} | Akurasi {session.accuracy}%
                        </span>
                      </div>

                      <div className="space-y-2">
                        {hwQuestions.map((q, idx) => (
                          <div key={idx} className="space-y-1.5 text-xs">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-slate-700">
                                Pertanyaan #{q.questionNo}: Target '{q.target}'
                              </span>
                              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                q.isCorrect 
                                  ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                                  : 'bg-rose-50 text-rose-600 border border-rose-100'
                              }`}>
                                {q.isCorrect ? 'Benar' : 'Salah'} {q.ocrAccuracy ? `(${q.ocrAccuracy}%)` : ''}
                              </span>
                            </div>

                            <div className="text-[10px] text-slate-500 font-semibold">
                              <span>Jawaban Terdeteksi: </span>
                              <span className="text-slate-800 font-bold">'{q.answer}'</span>
                            </div>

                            <div className="p-2.5 bg-indigo-50/30 border border-indigo-50/50 rounded-lg text-[10px] text-slate-600 leading-relaxed font-medium">
                              <span className="font-bold text-indigo-600 block mb-0.5">Saran Perbaikan Analisis OCR:</span>
                              {getHandwritingFeedback(q.target, q.answer, q.isCorrect, q.ocrAccuracy)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Give Diagnosis Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <Brain className="w-4 h-4 text-emerald-500" />
              <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wide">Kanal Pengisian Diagnosis</span>
            </div>

            <form onSubmit={handleSaveRecommendation} className="space-y-3.5">
              {saveStatus === 'success' && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs font-semibold rounded-xl flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  Diagnosis berhasil disimpan ke database.
                </div>
              )}
              {saveStatus === 'error' && (
                <div className="p-2.5 bg-rose-50 border border-rose-100 text-rose-600 text-xs font-semibold rounded-xl flex items-center gap-1.5">
                  <XCircle className="w-4 h-4" />
                  {errorMessage}
                </div>
              )}

              <div>
                <label htmlFor="observation-input" className="block text-[10px] font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">
                  Diagnosis Klinis / Hasil Observasi
                </label>
                <textarea
                  id="observation-input"
                  required
                  rows={3}
                  placeholder="Deskripsikan hasil observasi klinis psikologis siswa..."
                  value={clinicalObservation}
                  onChange={(e) => setClinicalObservation(e.target.value)}
                  className="w-full p-3 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:border-slate-450 focus:ring-1 focus:ring-slate-300 transition-colors resize-none leading-relaxed"
                />
              </div>

              <div>
                <label htmlFor="plan-input" className="block text-[10px] font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">
                  Program Terapi / Rencana Rujukan
                </label>
                <textarea
                  id="plan-input"
                  required
                  rows={3}
                  placeholder="Rancang program terapi terstruktur atau rujukan intervensi lanjutan..."
                  value={therapyPlan}
                  onChange={(e) => setTherapyPlan(e.target.value)}
                  className="w-full p-3 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:border-slate-450 focus:ring-1 focus:ring-slate-300 transition-colors resize-none leading-relaxed"
                />
              </div>

              <div className="flex justify-end">
                <button
                  id="submit-recommendation-btn"
                  type="submit"
                  disabled={isSaving || !clinicalObservation.trim() || !therapyPlan.trim()}
                  className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-850 active:bg-slate-950 text-white rounded-xl text-xs font-bold transition-colors disabled:opacity-50 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSaving ? 'Menyimpan...' : 'Simpan Diagnosis'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Recommendations History Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <FileText className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wide">Riwayat Diagnosis ({recommendations.length})</span>
            </div>

            <div className="max-h-[280px] overflow-y-auto space-y-3 pr-1">
              {recommendations.length === 0 ? (
                <p className="text-xs text-slate-400 italic py-2">Belum ada diagnosis psikolog yang terekam.</p>
              ) : (
                recommendations.map((rec) => (
                  <div key={rec.id} className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl space-y-2.5">
                    <div className="flex items-start justify-between">
                      <h4 className="text-[11px] font-bold text-slate-800 leading-snug">{rec.name}</h4>
                      <span className="text-[9px] text-slate-400 font-semibold flex items-center gap-1 shrink-0 ml-2">
                        <Calendar className="w-2.5 h-2.5 text-slate-400" />
                        {rec.dateCreated}
                      </span>
                    </div>
                    <div className="space-y-2 border-t border-slate-200/40 pt-2 text-[10px]">
                      <div>
                        <span className="text-[9px] uppercase tracking-wider font-extrabold text-indigo-600 block mb-0.5">Observasi Klinis:</span>
                        <p className="text-slate-650 font-medium leading-relaxed">{rec.clinicalObservation}</p>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase tracking-wider font-extrabold text-indigo-600 block mb-0.5">Program Terapi / Rujukan:</span>
                        <p className="text-slate-650 font-medium leading-relaxed">{rec.therapyPlan}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
