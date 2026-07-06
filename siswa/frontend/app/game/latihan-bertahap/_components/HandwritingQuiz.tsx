'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Camera, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { HandwritingQuizProps } from '../../../types';
import { SISWA_API_URL } from '../../../services/storage';

export default function HandwritingQuiz({
  question,
  onHandwritingResult,
  isSubmitted,
  ocrResult
}: HandwritingQuizProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const activeStreamRef = useRef<MediaStream | null>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  // Stop all camera tracks
  const stopCamera = useCallback(() => {
    if (activeStreamRef.current) {
      activeStreamRef.current.getTracks().forEach(track => track.stop());
      activeStreamRef.current = null;
    }
    setStream(null);
    setIsCameraActive(false);
  }, []);

  // Start camera stream
  const startCamera = useCallback(async () => {
    setCameraError(null);
    try {
      // Release any existing stream using ref to avoid stale closures
      if (activeStreamRef.current) {
        activeStreamRef.current.getTracks().forEach(track => track.stop());
        activeStreamRef.current = null;
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // prefer back camera on phones
          width: { ideal: 640 },
          height: { ideal: 480 }
        },
        audio: false
      });

      activeStreamRef.current = mediaStream;
      setStream(mediaStream);
      setIsCameraActive(true);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Camera access error:", err);
      setCameraError("Gagal mengakses kamera. Pastikan izin kamera sudah diberikan.");
    }
  }, []);

  // Automatically start camera on mount and reset state on question change
  useEffect(() => {
    // Reset state for new question
    setCapturedImage(null);
    setIsLoading(false);
    setCameraError(null);
    setIsCameraActive(false);

    if (!isSubmitted) {
      startCamera();
    }

    return () => {
      // Cleanup using ref to guarantee tracks are stopped
      if (activeStreamRef.current) {
        activeStreamRef.current.getTracks().forEach(track => track.stop());
        activeStreamRef.current = null;
      }
    };
  }, [question, isSubmitted, startCamera]);

  // Capture frame and send to TrOCR backend
  const handleCaptureAndAnalyze = async () => {
    if (!videoRef.current || !canvasRef.current || isLoading) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    // Draw video frame to hidden canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Save preview base64 to show user
    const dataUrl = canvas.toDataURL('image/jpeg');
    setCapturedImage(dataUrl);

    // Stop camera stream immediately to release hardware
    stopCamera();
    setIsLoading(true);

    // Convert canvas to blob and upload
    canvas.toBlob(async (blob) => {
      if (!blob) {
        setIsLoading(false);
        alert("Gagal memproses gambar.");
        return;
      }

      const formData = new FormData();
      formData.append('file', blob, 'capture.jpg');
      formData.append('target', question.target);

      try {
        const response = await fetch(`${SISWA_API_URL}/api/ocr/predict`, {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error("HTTP error " + response.status);
        }

        const data = await response.json();
        const detected = data.detected;
        const accuracy = data.accuracy;
        // Question is marked correct if accuracy > 50%
        const isCorrect = accuracy > 50;

        onHandwritingResult(detected, accuracy, isCorrect);
      } catch (err) {
        console.error("OCR api request error:", err);
        alert("Gagal menghubungi server analisis tulisan tangan.");
      } finally {
        setIsLoading(false);
      }
    }, 'image/jpeg', 0.85);
  };

  return (
    <div className="space-y-5 w-full flex flex-col items-center">
      <div className="w-full text-center">
        <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
          Tulis {question.target.length > 1 ? 'kata/suku kata' : 'huruf'} "{question.target}" pada kertas, lalu arahkan ke kamera!
        </p>
      </div>

      {/* Hidden Canvas for Capture */}
      <canvas ref={canvasRef} className="hidden" width="640" height="480" />

      {/* Camera Preview Area / Captured Preview Area */}
      <div className="w-full relative overflow-hidden rounded-2xl border border-slate-150 bg-slate-100 flex items-center justify-center min-h-[220px]">
        {/* Loading Spinner */}
        {isLoading && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex flex-col items-center justify-center gap-3 text-white z-10 p-4 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
            <p className="text-xs font-semibold">Menganalisis tulisan tangan kamu...</p>
            <p className="text-[10px] text-slate-350">Harap tunggu sebentar</p>
          </div>
        )}

        {/* Display Live Video when camera active & not submitted */}
        {!isSubmitted && isCameraActive && (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full max-h-[220px] object-cover"
          />
        )}

        {/* Display Captured Image Preview when submitted */}
        {(isSubmitted || !isCameraActive) && capturedImage && (
          <img
            src={capturedImage}
            alt="Handwriting capture preview"
            className="w-full max-h-[220px] object-cover"
          />
        )}

        {/* Error or Idle Camera Screen */}
        {!isSubmitted && !isCameraActive && !isLoading && (
          <div className="p-6 text-center space-y-3">
            {cameraError ? (
              <p className="text-xs text-rose-500 font-medium">{cameraError}</p>
            ) : (
              <p className="text-xs text-slate-500 font-medium">Kamera tidak aktif</p>
            )}
            <button
              onClick={startCamera}
              className="py-2 px-4 bg-indigo-50 hover:bg-indigo-100 text-indigo-650 rounded-xl text-xs font-bold transition-all cursor-pointer border border-indigo-150"
            >
              Aktifkan Kamera
            </button>
          </div>
        )}
      </div>

      {/* Action Area: Capture button when not submitted */}
      {!isSubmitted && isCameraActive && (
        <button
          onClick={handleCaptureAndAnalyze}
          disabled={isLoading}
          className="py-3 px-6 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-xs active:scale-97 disabled:opacity-50"
        >
          <Camera className="w-4 h-4" />
          Ambil & Analisis Foto
        </button>
      )}

      {/* Immediate Feedback Text when submitted */}
      {isSubmitted && ocrResult && (
        <div className="w-full space-y-4 text-center">
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-2">
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Hasil Analisis</p>
            <div className="flex justify-around items-center">
              <div>
                <p className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Huruf Terdeteksi</p>
                <p className="text-2xl font-black text-slate-800">"{ocrResult.detected}"</p>
              </div>
              <div className="w-px h-8 bg-slate-200" />
              <div>
                <p className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Kecocokan</p>
                <p className="text-2xl font-black text-slate-800">{ocrResult.accuracy}%</p>
              </div>
            </div>
          </div>

          <div className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-xs font-bold transition-all duration-200">
            {ocrResult.accuracy > 50 ? (
              <span className="text-emerald-600 flex items-center gap-1.5 leading-relaxed">
                <CheckCircle className="w-4 h-4 fill-emerald-50 text-emerald-600 shrink-0" />
                Jawaban Benar! Tulisanmu terdeteksi dengan baik.
              </span>
            ) : (
              <span className="text-rose-600 flex items-center gap-1.5 leading-relaxed">
                <XCircle className="w-4 h-4 fill-rose-50 text-rose-600 shrink-0" />
                Jawaban kurang tepat. Coba tulis lebih jelas {question.target.length > 1 ? 'kata/suku kata' : 'huruf'} "{question.target}" ya!
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
