
import React, { useRef, useState } from 'react';
import WebcamCapture from './components/WebcamCapture';
import StatusIndicator from './components/StatusIndicator';
import DrowsinessAlert from './components/DrowsinessAlert';
import { useDrowsinessDetection } from './hooks/useDrowsinessDetection';
import { DetectionState } from './types';

const App: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const {
    isDetecting,
    detectionState,
    isDrowsy,
    error: detectionError,
    startDetection,
    stopDetection,
    resetAlert,
  } = useDrowsinessDetection(canvasRef);
  
  const handleToggleDetection = () => {
    if (isDetecting) {
      stopDetection();
    } else {
      startDetection();
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center p-4 sm:p-8 font-sans">
      <DrowsinessAlert isOpen={isDrowsy} onReset={resetAlert} />
      
      <header className="text-center mb-8">
        <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300">
          AI Drowsiness Detector
        </h1>
        <p className="text-gray-400 mt-2 max-w-2xl">
          Using Gemini's vision capabilities to monitor your alertness. Stay safe on the road and at your desk.
        </p>
      </header>

      <main className="w-full max-w-4xl flex flex-col items-center gap-6">
        <WebcamCapture 
            canvasRef={canvasRef} 
            isDetecting={isDetecting}
            onCameraError={setCameraError}
        />

        {cameraError && <div className="text-red-400 bg-red-900/50 p-3 rounded-lg text-center">{cameraError}</div>}
        {detectionError && <div className="text-red-400 bg-red-900/50 p-3 rounded-lg text-center">{detectionError}</div>}
        
        <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4 p-4 bg-gray-800/50 rounded-lg">
          <StatusIndicator state={isDetecting ? detectionState : DetectionState.UNKNOWN} />
          <button
            onClick={handleToggleDetection}
            disabled={!!cameraError}
            className={`px-8 py-4 text-xl font-semibold rounded-lg transition-all duration-300 ease-in-out w-full md:w-auto
              ${isDetecting 
                ? 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/30' 
                : 'bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/30'}
              disabled:bg-gray-600 disabled:cursor-not-allowed disabled:shadow-none`}
          >
            {isDetecting ? 'Stop Detection' : 'Start Detection'}
          </button>
        </div>
      </main>

      <footer className="mt-auto pt-8 text-center text-gray-500 text-sm">
        <p>Built with React, Tailwind CSS, and the Google Gemini API.</p>
        <p>This is a demonstration and should not be used as a primary safety device.</p>
      </footer>
    </div>
  );
};

export default App;
