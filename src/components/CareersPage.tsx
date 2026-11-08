import { motion, AnimatePresence } from 'framer-motion';
import { Career } from '../types';
import { CareerNode } from './CareerNode';
import { LoadingState } from './LoadingState';
import { ErrorState } from './ErrorState';
import { ArrowRight, LineChart, Info, Sparkles } from 'lucide-react';

interface CareersPageProps {
  careers: Career[];
  selectedCareers: Career[];
  onCareerSelect: (career: Career) => void;
  onAnalyze: (career: Career) => void;
  onCompare: () => void;
  isLoading?: boolean;
  error?: string;
  onRetry?: () => void;
  onStart?: () => void;
}

export function CareersPage({
  careers,
  selectedCareers,
  onCareerSelect,
  onAnalyze,
  onCompare,
  isLoading,
  error,
  onRetry,
  onStart
}: CareersPageProps) {
  if (isLoading) {
    return <LoadingState type="career" />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={onRetry} />;
  }

  if (careers.length === 0) {
    return (
      <div className="text-center py-12 glass-card rounded-2xl">
        <Sparkles className="w-12 h-12 text-blue-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-300 mb-2">No recommendations yet</h3>
        <p className="text-gray-400 mb-6">Complete your profile on the Input page and press “Generate Career Recommendations”.</p>
        {onStart && (
          <button type="button" onClick={onStart} className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors">
            Go to your profile
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header with selection info */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold">Recommended Careers</h2>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-400">
            {selectedCareers.length === 0
              ? "Select up to 2 careers to compare"
              : selectedCareers.length === 1
              ? "Select 1 more career to compare"
              : "Ready to compare!"}
          </div>
          {selectedCareers.length > 0 && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={() => selectedCareers.length === 1 ? onAnalyze(selectedCareers[0]) : onCompare()}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
            >
              <LineChart className="w-4 h-4" />
              <span>{selectedCareers.length === 1 ? 'Analyze Career' : 'Compare Careers'}</span>
            </motion.button>
          )}
        </div>
      </div>

      <p className="flex items-start gap-2 text-sm text-gray-400">
        <Info className="w-4 h-4 mt-0.5 shrink-0" />
        <span>All salaries, scores and trends are AI-generated estimates for the Indian market. Check them with official sources before making decisions.</span>
      </p>

      {/* Selected Careers Preview */}
      {selectedCareers.length > 0 && (
        <div className="glass-card p-4 rounded-xl">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            {selectedCareers.map((career, index) => (
              <div key={career.id} className="flex items-center gap-4">
                <div className="flex-1 p-4 bg-white/5 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{career.type}</span>
                    <h3 className="font-semibold">{career.title}</h3>
                  </div>
                  <div className="text-sm text-gray-400 mt-1">
                    {career.salary.current} • {career.demand} Demand
                  </div>
                </div>
                {index === 0 && selectedCareers.length === 2 && (
                  <ArrowRight className="w-6 h-6 text-gray-400" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Career Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {careers.map((career) => (
            <motion.div
              key={career.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <CareerNode
                career={career}
                isSelected={selectedCareers.some(c => c.id === career.id)}
                onClick={() => onCareerSelect(career)}
                onAnalyze={() => onAnalyze(career)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}