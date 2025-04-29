import { motion } from 'framer-motion';
import { Brain } from 'lucide-react';
import { useState, useEffect } from 'react';

interface GenerateButtonProps {
  onClick: () => Promise<void>;
  isValid: boolean;
  isLoading: boolean; // Added isLoading prop
}

export function GenerateButton({ onClick, isValid, isLoading }: GenerateButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState(0);
  const [error, setError] = useState(false);

  const stages = [
    "Analyzing your profile...",
    "Scanning market trends...",
    "Calculating AI risk factors...",
    "Matching career paths...",
    "Generating recommendations..."
  ];

  useEffect(() => {
    if (!isGenerating) {
      setProgress(0);
      setStage(0);
      setError(false);
      return;
    }

    // Progress animation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 0.5;
      });
    }, 50);

    // Stage changes
    const stageInterval = setInterval(() => {
      setStage(prev => (prev + 1) % stages.length);
    }, 2000);

    return () => {
      clearInterval(progressInterval);
      clearInterval(stageInterval);
    };
  }, [isGenerating]);

  const handleClick = async () => {
    if (!isValid || isGenerating || isLoading || error) return;
    
    try {
      setIsGenerating(true);
      setProgress(0);
      setStage(0);
      setError(false);
      await onClick();
    } catch (error) {
      console.error('Error generating recommendations:', error);
      setError(true);
      // Auto-reset after 2 seconds
      setTimeout(() => {
        setError(false);
        setIsGenerating(false);
        setProgress(0);
      }, 2000);
    } finally {
      setIsGenerating(false);
      setProgress(0);
    }
  };

  return (
    <motion.button
      onClick={handleClick}
      className={`w-full bg-gradient-to-r relative overflow-hidden group ${
        error
          ? 'bg-red-500/50 cursor-not-allowed'
          : isValid && !isGenerating && !isLoading
          ? 'from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600'
          : 'from-gray-600 to-gray-700 cursor-not-allowed'
      } rounded-lg px-6 py-3 text-lg font-semibold transition-all duration-300`}
      disabled={!isValid || isGenerating || isLoading || error}
      whileHover={isValid && !isGenerating && !isLoading ? { scale: 1.02 } : {}}
      whileTap={isValid && !isGenerating && !isLoading ? { scale: 0.98 } : {}}
    >
      {/* Hover effect overlay */}
      <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {isGenerating ? (
        <div className="space-y-2">
          <div className="flex items-center justify-center space-x-2">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            >
              <Brain className="w-5 h-5" />
            </motion.div>
            <span className="animate-pulse">{stages[stage]}</span>
          </div>
          
          {/* Progress bar */}
          <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-400 to-purple-400"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
          
          {/* Percentage */}
          <div className="text-sm text-white/70">
            {Math.round(progress)}%
          </div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center space-x-2 text-red-200">
          <AlertCircle className="w-5 h-5" />
          <span>Generation failed. Retrying...</span>
        </div>
      ) : (
        <div className="flex items-center justify-center space-x-2">
          <Brain className="w-5 h-5" />
          <span>Generate Career Recommendations</span>
        </div>
      )}
    </motion.button>
  );
}