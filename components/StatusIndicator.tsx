
import React from 'react';
import { DetectionState } from '../types';

interface StatusIndicatorProps {
  state: DetectionState;
}

const statusConfig = {
  [DetectionState.OPEN]: { text: 'Awake & Attentive', color: 'bg-green-500', icon: '👁️' },
  [DetectionState.CLOSED]: { text: 'Eyes Closed', color: 'bg-yellow-500', icon: '😌' },
  [DetectionState.YAWN]: { text: 'Yawning Detected', color: 'bg-orange-500', icon: '😮' },
  [DetectionState.ANALYZING]: { text: 'Analyzing...', color: 'bg-blue-500', icon: '🧠' },
  [DetectionState.UNKNOWN]: { text: 'Ready to Start', color: 'bg-gray-500', icon: '❓' },
};

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ state }) => {
  const config = statusConfig[state] || statusConfig[DetectionState.UNKNOWN];

  return (
    <div className="flex items-center gap-4 p-4 bg-gray-800 rounded-lg shadow-lg">
      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm ${config.color}`}>
        {config.icon}
      </div>
      <span className="text-lg font-medium text-gray-200">{config.text}</span>
    </div>
  );
};

export default StatusIndicator;
