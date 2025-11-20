
import React from 'react';

interface DrowsinessAlertProps {
  isOpen: boolean;
  onReset: () => void;
}

const DrowsinessAlert: React.FC<DrowsinessAlertProps> = ({ isOpen, onReset }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-red-600 text-white p-8 sm:p-12 rounded-2xl shadow-2xl text-center animate-pulse border-4 border-red-400">
        <div className="text-6xl sm:text-8xl mb-4 font-bold">🚨</div>
        <h2 className="text-3xl sm:text-5xl font-extrabold mb-4 tracking-wider">WAKE UP!</h2>
        <p className="text-lg sm:text-xl mb-8">Drowsiness has been detected.</p>
        <button
          onClick={onReset}
          className="bg-white text-red-600 font-bold py-3 px-8 rounded-lg text-xl hover:bg-red-100 transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-red-300"
        >
          I'm Awake
        </button>
      </div>
    </div>
  );
};

export default DrowsinessAlert;
