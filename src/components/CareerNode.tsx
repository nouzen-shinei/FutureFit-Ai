import { motion } from 'framer-motion';
import { Star, LineChart, Users, Clock, GraduationCap, Brain, DollarSign } from 'lucide-react';
import { Career } from '../types';

interface CareerNodeProps {
  career: Career;
  isSelected: boolean;
  onClick: () => void;
  onAnalyze: () => void;
}

export function CareerNode({ career, isSelected, onClick, onAnalyze }: CareerNodeProps) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400'}`}
      />
    ));
  };

  return (
    <motion.div
      className={`career-node relative cursor-pointer transition-all ${
        isSelected ? 'ring-2 ring-blue-400' : 'hover:bg-white/10'
      } ${
        career.type === '💎'
          ? 'shadow-[0_0_15px_rgba(0,255,136,0.3)]'
          : career.type === '⚠️'
          ? 'animate-pulse border-red-500/50'
          : 'scale-105 rotate-2'
      }`}
      onClick={onClick}
      whileHover={{ y: -4 }}
      data-type={career.type}
    >
      <div className="flex items-start justify-between mb-4">
        <span className="text-2xl">{career.type}</span>
        <div className="text-right">
          <div className="text-xl font-bold text-green-400">{career.salary.current}</div>
          <div className="text-sm text-gray-400">{career.demand} Demand</div>
          {career.cagr && (
            <div className="text-xs text-blue-400">CAGR: {career.cagr}</div>
          )}
        </div>
      </div>

      <h3 className="text-xl font-semibold mb-4">{career.title}</h3>

      <div className="space-y-4">
        {/* Timeline and Investment */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-gray-400">
              <Clock className="w-4 h-4" />
              <span>Timeline</span>
            </div>
            <div>{career.timeline}</div>
            <div className="text-xs text-gray-500">Total: {career.totalTime}</div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-gray-400">
              <DollarSign className="w-4 h-4" />
              <span>Investment</span>
            </div>
            <div>{career.cost}</div>
          </div>
        </div>

        {/* Salary Range */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <DollarSign className="w-4 h-4" />
            <span>Salary Range</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div>
              <div className="text-gray-500">Entry</div>
              <div className="font-medium">{career.salary.entry}</div>
            </div>
            <div>
              <div className="text-gray-500">Average</div>
              <div className="font-medium">{career.salary.avg}</div>
            </div>
            <div>
              <div className="text-gray-500">Senior</div>
              <div className="font-medium">{career.salary.current}</div>
            </div>
          </div>
        </div>

        {/* Required Exams */}
        {career.exams?.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <GraduationCap className="w-4 h-4" />
              <span>Required Exams</span>
            </div>
            <div className="space-y-2">
              {career.exams.map((exam, index) => (
                <div
                  key={index}
                  className="text-sm p-2 bg-white/5 rounded-lg"
                >
                  <div className="font-medium">{exam.name}</div>
                  <div className="text-xs text-gray-500">{exam.syllabus}</div>
                  {(exam.duration || exam.cost) && (
                    <div className="text-xs text-gray-400 mt-1">
                      {exam.duration && <span>{exam.duration}</span>}
                      {exam.duration && exam.cost && <span> • </span>}
                      {exam.cost && <span>{exam.cost}</span>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AI Risk Level */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>AI Risk Level</span>
            <span>{career.ai_risk}%</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className={`h-full transition-all ${
                career.ai_risk < 30
                  ? 'bg-green-500'
                  : career.ai_risk < 70
                  ? 'bg-yellow-500'
                  : 'bg-red-500'
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${career.ai_risk}%` }}
              transition={{ duration: 1 }}
            />
          </div>
        </div>

        {/* Required Skills */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <Brain className="w-4 h-4" />
            <span>Required Skills</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {career.skills.map((skill, index) => (
              <div
                key={index}
                className={`px-2 py-1 text-sm rounded flex items-center gap-1 ${
                  skill.importance === 'required'
                    ? 'bg-blue-500/20 text-blue-300'
                    : 'bg-purple-500/20 text-purple-300'
                }`}
              >
                <span>{skill.name}</span>
                <span className="text-xs opacity-75">({skill.level})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pre-requisites */}
        {career.preRequisites?.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <GraduationCap className="w-4 h-4" />
              <span>Pre-requisites</span>
            </div>
            <ul className="text-sm space-y-1">
              {career.preRequisites.map((req, index) => (
                <li key={index} className="text-gray-300">• {req}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Notable Professionals */}
        {career.notableProfessionals?.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <Users className="w-4 h-4" />
              <span>Notable Professionals</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {career.notableProfessionals.map((person, index) => (
                <div
                  key={index}
                  className="group relative"
                >
                  <span className="px-2 py-1 text-sm bg-white/10 rounded hover:bg-white/20">
                    {person.name}
                  </span>
                  <div className="absolute bottom-full left-0 mb-2 w-48 p-2 bg-gray-800 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <p className="text-sm font-medium">{person.bio}</p>
                    <ul className="mt-1 text-xs text-gray-400">
                      {person.achievements.map((achievement, i) => (
                        <li key={i}>• {achievement}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add padding at the bottom to make space for the analyze button */}
        <div className="pb-12"></div>

        {/* Analysis Button - Now positioned with proper spacing */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAnalyze();
          }}
          className="absolute bottom-4 right-4 flex items-center space-x-2 px-3 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-colors text-sm"
        >
          <LineChart className="w-4 h-4" />
          <span>Analyze</span>
        </button>
      </div>
    </motion.div>
  );
}