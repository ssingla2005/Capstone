
import React, { useRef, useEffect, useState } from 'react';

interface WebcamCaptureProps {
  isDetecting: boolean;
  onCameraError: (error: string) => void;
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

const WebcamCapture: React.FC<WebcamCaptureProps> = ({ onCameraError, canvasRef }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const animationFrameIdRef = useRef<number>();

  useEffect(() => {
    let stream: MediaStream | null = null;
    const enableCam = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { width: 640, height: 480, facingMode: 'user' } 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
              setIsCameraReady(true);
          };
        }
      } catch (err) {
        console.error("Error accessing webcam: ", err);
        onCameraError("Could not access webcam. Please grant permission and refresh the page.");
      }
    };

    enableCam();

    return () => {
      stream?.getTracks().forEach(track => track.stop());
    };
  }, [onCameraError]);

  useEffect(() => {
    const captureFrame = () => {
      if (videoRef.current && canvasRef.current && videoRef.current.readyState >= 3) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (ctx) {
          ctx.save();
          ctx.scale(-1, 1);
          ctx.translate(-canvas.width, 0);
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          ctx.restore();
        }
      }
      animationFrameIdRef.current = requestAnimationFrame(captureFrame);
    };

    if (isCameraReady) {
        captureFrame();
    }

    return () => {
      if(animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [isCameraReady, canvasRef]);

  return (
    <div className="relative w-full max-w-2xl mx-auto aspect-video rounded-lg overflow-hidden shadow-2xl bg-gray-800 border-2 border-gray-700">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover transform -scale-x-100"
      />
      <canvas ref={canvasRef} className="hidden" />
      {!isCameraReady && (
         <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="flex flex-col items-center gap-2">
                <svg className="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="text-lg">Initializing camera...</p>
            </div>
         </div>
      )}
    </div>
  );
};

export default WebcamCapture;
