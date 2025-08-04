import React from 'react';
import { FileText } from 'lucide-react';

interface VideoTranscriptProps {
  transcript: string;
  className?: string;
}

const VideoTranscript: React.FC<VideoTranscriptProps> = ({ 
  transcript, 
  className = '' 
}) => {
  return (
    <div className={`bg-white rounded-lg border-2 border-gray-200 p-6 ${className}`}>
      <h3 
        className="text-xl font-bold mb-4 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1"
        tabIndex={0}
        role="heading"
        aria-level={3}
      >
        <FileText size={24} className="text-blue-600" />
        Video Transcript
      </h3>
      <div 
        className="text-gray-700 leading-relaxed whitespace-pre-line focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2"
        tabIndex={0}
        role="text"
        aria-label="Video transcript content"
      >
        {transcript}
      </div>
    </div>
  );
};

export default VideoTranscript;
