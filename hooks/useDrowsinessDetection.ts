// FIX: Import React to provide the React namespace for types like React.RefObject.
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { DetectionState } from '../types';
import { analyzeFrame } from '../services/geminiService';

const DROWSINESS_THRESHOLD = 3; 
const ANALYSIS_INTERVAL = 2000; 

export const useDrowsinessDetection = (canvasRef: React.RefObject<HTMLCanvasElement>) => {
  const [isDetecting, setIsDetecting] = useState<boolean>(false);
  const [detectionState, setDetectionState] = useState<DetectionState>(DetectionState.UNKNOWN);
  const [isDrowsy, setIsDrowsy] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const drowsyCounterRef = useRef<number>(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const analysisTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    audioRef.current = new Audio('https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg');
    audioRef.current.loop = true;
  }, []);

  const runAnalysis = useCallback(async () => {
      if (!isDetecting || !canvasRef.current) {
        return;
      }
      
      setDetectionState(DetectionState.ANALYZING);

      try {
        const imageBase64 = canvasRef.current.toDataURL('image/jpeg', 0.5);
        const result = await analyzeFrame(imageBase64);
        
        if (!isDetecting) return; // Check again in case detection was stopped during async call

        setDetectionState(result);

        if (result === DetectionState.CLOSED || result === DetectionState.YAWN) {
          drowsyCounterRef.current += 1;
        } else {
          drowsyCounterRef.current = 0;
        }

        if (drowsyCounterRef.current >= DROWSINESS_THRESHOLD) {
           if (!isDrowsy) {
                setIsDrowsy(true);
                audioRef.current?.play().catch(e => console.error("Audio playback failed:", e));
           }
        }
      } catch (e) {
        console.error(e);
        setError("Failed to analyze the frame. Please check your connection or API key.");
        setIsDetecting(false); 
      } finally {
        if (isDetecting) {
            analysisTimeoutRef.current = window.setTimeout(runAnalysis, ANALYSIS_INTERVAL);
        }
      }
    }, [isDetecting, canvasRef, isDrowsy]);

  useEffect(() => {
    if (isDetecting) {
        runAnalysis();
    } else {
        if (analysisTimeoutRef.current) {
            clearTimeout(analysisTimeoutRef.current);
        }
    }
    
    return () => {
        if(analysisTimeoutRef.current) {
            clearTimeout(analysisTimeoutRef.current);
        }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDetecting]);

  const startDetection = useCallback(() => {
    if (!canvasRef.current) {
        setError("Webcam not ready.");
        return;
    }
    setError(null);
    setIsDrowsy(false);
    drowsyCounterRef.current = 0;
    setDetectionState(DetectionState.UNKNOWN);
    setIsDetecting(true);
  }, [canvasRef]);

  const stopDetection = useCallback(() => {
    setIsDetecting(false);
    setDetectionState(DetectionState.UNKNOWN);
    drowsyCounterRef.current = 0;
    if (analysisTimeoutRef.current) {
      clearTimeout(analysisTimeoutRef.current);
    }
  }, []);

  const resetAlert = useCallback(() => {
    setIsDrowsy(false);
    drowsyCounterRef.current = 0;
    audioRef.current?.pause();
    if (audioRef.current) {
        audioRef.current.currentTime = 0;
    }
  }, []);

  return {
    isDetecting,
    detectionState,
    isDrowsy,
    error,
    startDetection,
    stopDetection,
    resetAlert,
  };
};