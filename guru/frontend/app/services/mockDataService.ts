import { PsychologistRecommendation, GameSession, QuestionResult } from '../types';

// Generate customized mock psychologist recommendations based on student's ID/name
export const getMockRecommendations = (studentId: string, studentName: string, riskClass: 'high' | 'medium' | 'low', currentLevel: number): PsychologistRecommendation[] => {
  if (riskClass === 'high') {
    return [
      {
        id: 'rec-1',
        name: 'Dr. Diana Prasetyo, M.Psi., Psikolog',
        dateCreated: '20 Juni 2026',
        clinicalObservation: `Siswa menunjukkan hambatan besar pada diskriminasi fonem vokal '${currentLevel <= 3 ? 'E dan O' : 'U dan I'}'. Terdapat kecenderungan disorientasi arah penulisan huruf simetris (b/d). Kognisi verbal normal namun respon tertunda akibat beban kerja memori yang berat.`,
        therapyPlan: 'Lakukan sesi individual multisensori (VAKT) selama 15 menit setiap pagi sebelum kelas dimulai. Fokus pada tracing taktil huruf-huruf berpasangan. Rujuk ke terapis okupasi untuk memperkuat koordinasi visual-motorik.'
      },
      {
        id: 'rec-2',
        name: 'Bambang Irawan, S.Psi., M.Psi.',
        dateCreated: '02 Juli 2026',
        clinicalObservation: 'Kecemasan akademik sedang karena sering mengalami kegagalan membaca di depan kelas. Menolak tugas membaca bersuara berparagraf panjang.',
        therapyPlan: 'Hindari meminta siswa membaca bersuara di depan kelas tanpa persiapan. Berikan bahan bacaan terstruktur pendek dengan visualisasi yang mendukung konteks cerita.'
      }
    ];
  } else if (riskClass === 'medium') {
    return [
      {
        id: 'rec-3',
        name: 'Dr. Diana Prasetyo, M.Psi., Psikolog',
        dateCreated: '15 Juni 2026',
        clinicalObservation: `Hambatan membaca ringan. Kadang melakukan fonem pengganti (substitusi) pada kata dasar level ${currentLevel}. Membaca masih tersendat-sendat namun pemahaman bacaan cukup baik.`,
        therapyPlan: 'Berikan latihan kartu suku kata terstruktur. Mainkan game mencocokkan kartu memori huruf 3x seminggu untuk membangun kelancaran ejaan dasar.'
      }
    ];
  } else {
    return [
      {
        id: 'rec-4',
        name: 'Rian Hermawan, S.Psi., M.Psi.',
        dateCreated: '28 Juni 2026',
        clinicalObservation: 'Tidak ada hambatan klinis disleksia yang signifikan. Kesalahan minor hanya akibat konsentrasi yang beralih saat tes.',
        therapyPlan: 'Pertahankan metode pembelajaran biasa. Lakukan tinjauan berkala 3 bulan sekali melalui game bertahap untuk memastikan perkembangan konsisten.'
      }
    ];
  }
};

// Generate customized mock game stats
export const getMockGameStats = (riskClass: 'high' | 'medium' | 'low') => {
  if (riskClass === 'high') {
    return { accuracy: '64%', commonWrong: "Vokal 'E', 'O' & Huruf 'b'" };
  } else if (riskClass === 'medium') {
    return { accuracy: '78%', commonWrong: "Suku kata 'da', 'ba' & Huruf 'p'" };
  } else {
    return { accuracy: '92%', commonWrong: "Tidak ada kesalahan dominan" };
  }
};

// Generate mock game sessions for "Latihan Bertahap"
export const getMockSessions = (studentLevel: number, riskClass: 'high' | 'medium' | 'low'): GameSession[] => {
  const questionsSet1: QuestionResult[] = [
    { questionNo: 1, type: 'choice', target: 'A', answer: 'A', isCorrect: true },
    { questionNo: 2, type: 'choice', target: 'I', answer: 'I', isCorrect: true },
    { questionNo: 3, type: 'choice', target: 'U', answer: 'U', isCorrect: true },
    { questionNo: 4, type: 'choice', target: 'E', answer: riskClass === 'high' ? 'A' : 'E', isCorrect: riskClass !== 'high' },
    { questionNo: 5, type: 'choice', target: 'O', answer: 'O', isCorrect: true },
    { questionNo: 6, type: 'choice', target: 'A', answer: 'A', isCorrect: true },
    { questionNo: 7, type: 'choice', target: 'I', answer: 'I', isCorrect: true },
    { questionNo: 8, type: 'choice', target: 'U', answer: riskClass !== 'low' ? 'O' : 'U', isCorrect: riskClass === 'low' },
    { questionNo: 9, type: 'handwriting', target: 'E', answer: riskClass === 'high' ? 'I' : 'E', isCorrect: riskClass !== 'high', ocrAccuracy: riskClass === 'high' ? 44 : 89 },
    { questionNo: 10, type: 'handwriting', target: 'O', answer: 'O', isCorrect: true, ocrAccuracy: 91 }
  ];

  const questionsSet2: QuestionResult[] = [
    { questionNo: 1, type: 'choice', target: 'A', answer: 'A', isCorrect: true },
    { questionNo: 2, type: 'choice', target: 'I', answer: 'I', isCorrect: true },
    { questionNo: 3, type: 'choice', target: 'U', answer: 'U', isCorrect: true },
    { questionNo: 4, type: 'choice', target: 'E', answer: 'E', isCorrect: true },
    { questionNo: 5, type: 'choice', target: 'O', answer: 'O', isCorrect: true },
    { questionNo: 6, type: 'choice', target: 'A', answer: 'A', isCorrect: true },
    { questionNo: 7, type: 'choice', target: 'I', answer: riskClass === 'high' ? 'E' : 'I', isCorrect: riskClass !== 'high' },
    { questionNo: 8, type: 'choice', target: 'U', answer: 'U', isCorrect: true },
    { questionNo: 9, type: 'handwriting', target: 'A', answer: 'A', isCorrect: true, ocrAccuracy: 86 },
    { questionNo: 10, type: 'handwriting', target: 'U', answer: riskClass === 'high' ? 'O' : 'U', isCorrect: riskClass !== 'high', ocrAccuracy: riskClass === 'high' ? 38 : 78 }
  ];

  if (riskClass === 'high') {
    return [
      {
        id: 'sess-1',
        date: 'Hari ini, 10:15',
        level: studentLevel,
        accuracy: 70,
        correctCount: 7,
        totalCount: 10,
        questions: questionsSet1
      },
      {
        id: 'sess-2',
        date: 'Kemarin, 14:30',
        level: Math.max(1, studentLevel - 1),
        accuracy: 60,
        correctCount: 6,
        totalCount: 10,
        questions: questionsSet2
      }
    ];
  } else if (riskClass === 'medium') {
    return [
      {
        id: 'sess-1',
        date: 'Hari ini, 09:40',
        level: studentLevel,
        accuracy: 80,
        correctCount: 8,
        totalCount: 10,
        questions: questionsSet1
      },
      {
        id: 'sess-2',
        date: '3 hari yang lalu, 11:10',
        level: studentLevel,
        accuracy: 80,
        correctCount: 8,
        totalCount: 10,
        questions: questionsSet2
      }
    ];
  } else {
    return [
      {
        id: 'sess-1',
        date: 'Kemarin, 08:50',
        level: studentLevel,
        accuracy: 100,
        correctCount: 10,
        totalCount: 10,
        questions: questionsSet1.map(q => ({ ...q, isCorrect: true, answer: q.target, ocrAccuracy: q.ocrAccuracy ? 95 : undefined }))
      }
    ];
  }
};
