import { motion } from 'framer-motion';
import { Brain } from 'lucide-react';
import { useState, useEffect } from 'react';

interface GenerateButtonProps {
  onClick: () => void;
  isLoading: boolean;
}

const STAGES = [
  'Analyzing your profile...',
  'Scanning market trends...',
  'Calculating AI risk factors...',
  'Matching career paths...',
  'Generating recommendations...',
];

// The button stays clickable whenever no request is running; the form is validated on click.
export function GenerateButton({ onClick, isLoading }: GenerateButtonProps) {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState(0);

  useEffect(() => {
    if (!isLoading) {
      setProgress(0);
      setStage(0);
      return;
    }
    // The progress bar is only an indication: it slows down and never reaches 100% on its own.
    const progressInterval = setInterval(() => setProgress((p) => p + (95 - p) * 0.03), 100);
    const stageInterval = setInterval(() => setStage((s) => Math.min(s + 1, STAGES.length - 1)), 3000);
    return () => {
      clearInterval(progressInterval);
      clearInterval(stageInterval);
    };
  }, [isLoading]);

  return (
    <motion.button
      type="button"
      onClick={() => !isLoading && onClick()}
      aria-busy={isLoading}
      className={`w-full bg-gradient-to-r relative overflow-hidden group ${
        isLoading ? 'from-gray-600 to-gray-700 cursor-wait' : 'from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600'
      } rounded-lg px-6 py-3 text-lg font-semibold transition-all duration-300`}
      disabled={isLoading}
      whileHover={!isLoading ? { scale: 1.02 } : {}}
      whileTap={!isLoading ? { scale: 0.98 } : {}}
    >
      <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {isLoading ? (
        <div className="space-y-2">
          <div className="flex items-center justify-center space-x-2">
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}>
              <Brain className="w-5 h-5" />
            </motion.div>
            <span className="animate-pulse">{STAGES[stage]}</span>
          </div>
          <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-400 to-purple-400"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
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
