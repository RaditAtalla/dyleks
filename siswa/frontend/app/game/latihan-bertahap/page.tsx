'use client';
 
import { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useStudentAuth } from '../../hooks/useStudentAuth';
import { useGamification } from '../../hooks/useGamification';
import { QuizQuestion } from '../../types';
import { saveGameSession } from '../../services/gameService';
import LandingStage from './_components/LandingStage';
import QuizStage from './_components/QuizStage';
import FinishStage from './_components/FinishStage';
import { getChallengePool } from '../challenge-pools';
import Button3D from '../../components/Button3D';
import InteractiveMascot from '../../components/Maskot/InteractiveMascot';
 
export default function LatihanBertahap() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-[#FAF6EE] p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-500 border-t-transparent" />
          <p className="text-xs text-slate-400 font-medium">Memuat game...</p>
        </div>
      </div>
    }>
      <LatihanBertahapContent />
    </Suspense>
  );
}

function LatihanBertahapContent() {
  const { student, loading, requireAuth, refreshStudent, submitPlacement } = useStudentAuth();
  const gamification = useGamification();
  const router = useRouter();
  const searchParams = useSearchParams();
  const levelParam = searchParams.get('level');

  const studentLevel = levelParam ? parseInt(levelParam, 10) : (student?.currentLevel || 1);
  const STORAGE_STAGES_KEY = `dyleks_tahap_progress_${student?.id}_level_${studentLevel}`;
 
  // Enforce auth check
  useEffect(() => {
    requireAuth();
  }, [student, loading, requireAuth]);
 
  // Game States
  const [stage, setStage] = useState<'landing' | 'quiz' | 'finish'>('landing');
  const [activeStageNum, setActiveStageNum] = useState<number>(1);
  const [stageProgress, setStageProgress] = useState<Record<number, number>>({ 1: 0, 2: -1, 3: -1, 4: -1, 5: -1 });
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [ocrResult, setOcrResult] = useState<{ detected: string; accuracy: number } | null>(null);
  const [answers, setAnswers] = useState<Array<{
    questionNo: number;
    type: 'choice' | 'handwriting';
    target: string;
    answer: string;
    isCorrect: boolean;
    ocrAccuracy?: number;
  }>>([]);
 
  // Load stage progress on student load
  useEffect(() => {
    if (student) {
      if (studentLevel < student.currentLevel) {
        // If they are playing a past completed level, all stages are unlocked and 100% completed
        setStageProgress({ 1: 100, 2: 100, 3: 100, 4: 100, 5: 100 });
      } else {
        const saved = localStorage.getItem(STORAGE_STAGES_KEY);
        if (saved) {
          try {
            setStageProgress(JSON.parse(saved));
          } catch {
            setStageProgress({ 1: 0, 2: -1, 3: -1, 4: -1, 5: -1 });
          }
        } else {
          setStageProgress({ 1: 0, 2: -1, 3: -1, 4: -1, 5: -1 });
        }
      }
    }
  }, [student, STORAGE_STAGES_KEY, studentLevel]);

  const handleStartStage = (stageNum: number) => {
    setActiveStageNum(stageNum);
    startNewGame();
  };

  // Initialize/Reset Game
  const startNewGame = useCallback(() => {
    const pool = getChallengePool(studentLevel);
    const items = pool.items;
 
    const newQuestions: QuizQuestion[] = [];
    for (let i = 0; i < 10; i++) {
      const randomTarget = items[Math.floor(Math.random() * items.length)];
      
      // Determine options (exactly 5 choices)
      let options: string[] = [];
      if (items.length <= 5) {
        options = [...items];
      } else {
        const poolWithoutTarget = items.filter(x => x !== randomTarget);
        // Randomly sort the pool without target and pick 4 items
        const shuffledPool = [...poolWithoutTarget].sort(() => 0.5 - Math.random());
        options = [randomTarget, ...shuffledPool.slice(0, 4)];
      }
      
      // Shuffle the selected options
      options.sort(() => 0.5 - Math.random());
 
      newQuestions.push({
        target: randomTarget,
        options: options,
        type: i < 8 ? 'choice' : 'handwriting' // Questions 9 and 10 are handwriting recognition
      });
    }
    setQuestions(newQuestions);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setCorrectCount(0);
    setIncorrectCount(0);
    setOcrResult(null);
    setAnswers([]);
    setStage('quiz');
  }, [student?.currentLevel]);
 
  // Text to Speech logic
  const playLetterSound = useCallback((letter: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
 
      const utterance = new SpeechSynthesisUtterance(letter);
      utterance.lang = 'id-ID';
      utterance.rate = 0.75;
      utterance.pitch = 1.1;
 
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
 
      window.speechSynthesis.speak(utterance);
    }
  }, []);
 
  // Auto-play sound when question changes
  useEffect(() => {
    if (stage === 'quiz' && questions.length > 0) {
      const timer = setTimeout(() => {
        playLetterSound(questions[currentIndex].target);
      }, 550);
      return () => clearTimeout(timer);
    }
  }, [stage, currentIndex, questions, playLetterSound]);
 
  // Handle Quit action
  const handleQuit = () => {
    const confirmQuit = window.confirm("Apakah kamu yakin ingin keluar? Skor latihan kamu saat ini tidak akan disimpan.");
    if (confirmQuit) {
      router.push('/');
    }
  };
 
  // Submit Answer (Choice question only)
  const handleSubmitAnswer = () => {
    if (!selectedOption || isSubmitted) return;
 
    const currentQuestion = questions[currentIndex];
    const isCorrect = selectedOption === currentQuestion.target;
 
    if (isCorrect) {
      setCorrectCount(prev => prev + 1);
    } else {
      setIncorrectCount(prev => prev + 1);
      gamification.loseHeart(); // Kurangi nyawa jika salah
    }
 
    setAnswers(prev => [
      ...prev,
      {
        questionNo: currentIndex + 1,
        type: 'choice',
        target: currentQuestion.target,
        answer: selectedOption,
        isCorrect
      }
    ]);
 
    setIsSubmitted(true);
  };
 
  // Handwriting API result callback
  const handleHandwritingResult = useCallback((detected: string, accuracy: number, isCorrect: boolean) => {
    setSelectedOption(detected);
    setOcrResult({ detected, accuracy });
 
    if (isCorrect) {
      setCorrectCount(prev => prev + 1);
    } else {
      setIncorrectCount(prev => prev + 1);
      gamification.loseHeart(); // Kurangi nyawa jika salah
    }
 
    setAnswers(prev => [
      ...prev,
      {
        questionNo: currentIndex + 1,
        type: 'handwriting',
        target: questions[currentIndex].target,
        answer: detected,
        isCorrect,
        ocrAccuracy: accuracy
      }
    ]);
 
    setIsSubmitted(true);
  }, [currentIndex, questions, gamification]);
 
  // Go to next question or finish page
  const handleNext = async () => {
    if (currentIndex < 9) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setOcrResult(null);
      setIsSubmitted(false);
    } else {
      // Save game session to the database
      if (!student) {
        console.warn("Cannot save session: student is null");
        setStage('finish');
        return;
      }
 
      const accuracyPercent = Math.round((correctCount / 10) * 100);
      const payload = {
        level: levelParam ? parseInt(levelParam, 10) : (student.currentLevel || 1),
        accuracy: accuracyPercent,
        correctCount: correctCount,
        totalCount: 10,
        questions: answers
      };
 
      console.log("Saving game session for student:", student.id);
      
      // Update local storage XP & Gems reward
      gamification.addXP(correctCount * 10);

      // Save game session to the database
      await saveGameSession(student.id, payload);

      // Only modify progress and trigger levels if they are on their current active frontier level
      if (studentLevel === student.currentLevel) {
        // Update stage progress if correctCount >= 5 (passed)
        if (correctCount >= 5) {
          const nextProgress = { ...stageProgress };
          nextProgress[activeStageNum] = 100;
          
          // Unlock next stage
          if (activeStageNum < 5 && nextProgress[activeStageNum + 1] === -1) {
            nextProgress[activeStageNum + 1] = 0;
          }

          // Calculate completed stages and XP progress
          const completedCount = Object.keys(nextProgress).filter(k => nextProgress[parseInt(k)] === 100).length;
          
          if (completedCount === 5) {
            // Level up!
            const nextLvl = studentLevel < 8 ? studentLevel + 1 : studentLevel;
            await submitPlacement(nextLvl, student.riskScore, student.riskClass, 0);
            
            // Clear stage progress for next level
            const nextLevelStorageKey = `dyleks_tahap_progress_${student.id}_level_${nextLvl}`;
            localStorage.setItem(nextLevelStorageKey, JSON.stringify({ 1: 0, 2: -1, 3: -1, 4: -1, 5: -1 }));
            
            // Set selected level in local storage to next level as well
            localStorage.setItem(`dyleks_selected_level_${student.id}`, String(nextLvl));
            
            alert(`Hore! Kamu telah menyelesaikan seluruh 5 Tahap pada Tingkat ${studentLevel}. Kamu naik ke Tingkat ${nextLvl}!`);
            setStageProgress({ 1: 0, 2: -1, 3: -1, 4: -1, 5: -1 });
          } else {
            const newXP = completedCount * 20;
            await submitPlacement(studentLevel, student.riskScore, student.riskClass, newXP);
            localStorage.setItem(STORAGE_STAGES_KEY, JSON.stringify(nextProgress));
            setStageProgress(nextProgress);
          }
        } else {
          alert("Akurasi kamu di bawah 50%. Coba lagi tahap ini agar bisa membuka tahap berikutnya!");
        }
      } else {
        // If it's a past level, just inform them
        if (correctCount >= 5) {
          alert("Hebat! Kamu berhasil menyelesaikan latihan pengulangan ini!");
        } else {
          alert("Latihan selesai. Tetap semangat berlatih!");
        }
      }

      await refreshStudent();
      setStage('finish');
    }
  };

  // Refill hearts using gems (5 gems cost)
  const handleRefillHearts = () => {
    const success = gamification.refillHearts(5);
    if (!success) {
      alert("Permata kamu tidak cukup untuk mengisi nyawa!");
    }
  };
 
  // Render loading state if auth check is running
  if (loading || !student) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAF6EE] p-4">
        <title>Memuat - Latihan Bertahap</title>
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-500 border-t-transparent" />
          <p className="text-xs text-slate-400 font-medium">Memuat petualangan...</p>
        </div>
      </div>
    );
  }

  // Handle out of hearts case
  const isOutOfHearts = gamification.state.hearts <= 0;
 
  return (
    <div className="min-h-screen bg-[#FAF6EE] flex flex-col justify-start">
      <title>Latihan Bertahap - DyLeks Siswa</title>
 
      {/* Mobile container */}
      <main className="max-w-md w-full mx-auto px-4 py-6 flex flex-col justify-between min-h-screen space-y-5">
        
        {/* Game Stage: Out of Hearts (Game Over Screen) */}
        {isOutOfHearts && stage === 'quiz' ? (
          <div className="flex-1 flex flex-col justify-between py-4 min-h-[80vh] max-w-sm w-full mx-auto">
            <div className="text-center pt-2">
              <span className="text-xs font-black text-rose-500 uppercase tracking-wider">Kesempatan Habis</span>
            </div>
            
            <div className="bg-white border border-slate-200/60 rounded-3xl p-6 py-8 space-y-6 shadow-sm flex flex-col items-center text-center my-auto">
              <InteractiveMascot mood="sad" width={100} height={100} />
              
              <div className="space-y-2">
                <h2 className="text-xl font-black text-slate-800">Nyawa Kamu Habis!</h2>
                <p className="text-xs text-slate-500 font-semibold leading-relaxed max-w-xs mx-auto">
                  Jangan berkecil hati! Kamu bisa mengisi kembali nyawamu menggunakan 5 permata, atau kembali ke beranda untuk beristirahat.
                </p>
              </div>

              <div className="flex items-center gap-2 bg-[#FAF6EE] px-4 py-2 rounded-2xl border border-slate-200">
                <span className="text-sm">💎 Permata Kamu:</span>
                <span className="text-xs font-black text-cyan-600">{gamification.state.gems}</span>
              </div>
            </div>

            <div className="space-y-3 pt-4">
              <Button3D
                variant="success"
                onClick={handleRefillHearts}
                disabled={gamification.state.gems < 5}
                className="w-full py-4 text-sm flex items-center justify-center gap-2"
              >
                Isi Ulang Nyawa (5 💎)
              </Button3D>
              
              <Button3D
                variant="secondary"
                onClick={() => router.push('/')}
                className="w-full py-4 text-sm"
              >
                Kembali ke Beranda
              </Button3D>
            </div>
          </div>
        ) : (
          <>
            {/* Game Stage: Landing */}
            {stage === 'landing' && (
              <LandingStage
                studentName={student.name}
                currentLevel={studentLevel}
                stageProgress={stageProgress}
                onStartStage={handleStartStage}
                onBackToHome={() => router.push('/')}
              />
            )}
 
            {/* Game Stage: Quiz */}
            {stage === 'quiz' && questions.length > 0 && (
              <QuizStage
                currentIndex={currentIndex}
                totalQuestions={10}
                question={questions[currentIndex]}
                selectedOption={selectedOption}
                onSelectOption={setSelectedOption}
                isSubmitted={isSubmitted}
                onSubmitAnswer={handleSubmitAnswer}
                onNext={handleNext}
                onQuit={handleQuit}
                isSpeaking={isSpeaking}
                onPlaySound={() => playLetterSound(questions[currentIndex].target)}
                onHandwritingResult={handleHandwritingResult}
                ocrResult={ocrResult}
              />
            )}
 
            {/* Game Stage: Finish */}
            {stage === 'finish' && (
              <FinishStage
                correctCount={correctCount}
                incorrectCount={incorrectCount}
                onRestart={startNewGame}
                onFinish={() => setStage('landing')}
              />
            )}
          </>
        )}
 
      </main>
    </div>
  );
}
