import { motion } from 'framer-motion';
import { Career } from '../types';
import { Star, Brain, DollarSign, Clock, GraduationCap, TrendingUp, Award, ThumbsUp, ThumbsDown } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

interface ComparePageProps {
  careers: Career[];
}

export function ComparePage({ careers }: ComparePageProps) {
  if (careers.length < 2) {
    return (
      <div className="text-center py-12">
        <Award className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-300 mb-2">Select Careers to Compare</h3>
        <p className="text-gray-400">Choose at least 2 careers from the recommendations to compare them</p>
      </div>
    );
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400'}`}
      />
    ));
  };

  // Prepare data for radar chart
  const radarData = [
    { subject: 'Market Demand', ...careers.reduce((acc, career, idx) => ({ ...acc, [`Career ${idx + 1}`]: parseInt(career.demand) }), {}) },
    { subject: 'Job Satisfaction', ...careers.reduce((acc, career, idx) => ({ ...acc, [`Career ${idx + 1}`]: career.satisfaction * 20 }), {}) },
    { subject: 'AI Risk', ...careers.reduce((acc, career, idx) => ({ ...acc, [`Career ${idx + 1}`]: 100 - career.ai_risk }), {}) },
    { subject: 'Required Skills', ...careers.reduce((acc, career, idx) => ({ ...acc, [`Career ${idx + 1}`]: career.skills.length * 10 }), {}) },
  ];

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold mb-6">Career Comparison</h2>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {careers.map((career, index) => (
          <motion.div
            key={career.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
            className="glass-card p-6 rounded-xl"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="text-2xl">{career.type}</span>
                <h3 className="text-xl font-semibold mt-2">{career.title}</h3>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-green-400">{career.salary.current}</div>
                <div className="text-sm text-gray-400">{career.demand} Demand</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Comparison Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Market Trends */}
        <div className="glass-card p-6 rounded-xl">
          <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-400" />
            <span>Market Demand Trends</span>
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="year" stroke="rgba(255,255,255,0.5)" />
                <YAxis stroke="rgba(255,255,255,0.5)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(17, 24, 39, 0.9)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                {careers.map((career, index) => (
                  <Line
                    key={career.id}
                    type="monotone"
                    data={career.marketDemandHistory}
                    name={career.title}
                    dataKey="demand"
                    stroke={index === 0 ? "#3B82F6" : "#8B5CF6"}
                    strokeWidth={2}
                    dot={false}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Radar Comparison */}
        <div className="glass-card p-6 rounded-xl">
          <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Award className="w-5 h-5 text-purple-400" />
            <span>Career Attributes</span>
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis dataKey="subject" stroke="rgba(255,255,255,0.5)" />
                <PolarRadiusAxis stroke="rgba(255,255,255,0.1)" />
                {careers.map((career, index) => (
                  <Radar
                    key={career.id}
                    name={career.title}
                    dataKey={`Career ${index + 1}`}
                    stroke={index === 0 ? "#3B82F6" : "#8B5CF6"}
                    fill={index === 0 ? "#3B82F6" : "#8B5CF6"}
                    fillOpacity={0.3}
                  />
                ))}
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Detailed Comparison Table */}
      <div className="glass-card p-6 rounded-xl overflow-x-auto">
        <h3 className="text-xl font-semibold mb-6">Detailed Comparison</h3>
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="py-3 text-left">Criteria</th>
              {careers.map(career => (
                <th key={career.id} className="py-3 text-left">{career.title}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {/* Salary Information */}
            <tr>
              <td className="py-4 font-medium">Entry Level Salary</td>
              {careers.map(career => (
                <td key={career.id} className="py-4">{career.salary.entry}</td>
              ))}
            </tr>
            <tr>
              <td className="py-4 font-medium">Average Salary</td>
              {careers.map(career => (
                <td key={career.id} className="py-4">{career.salary.avg}</td>
              ))}
            </tr>
            <tr>
              <td className="py-4 font-medium">Senior Level Salary</td>
              {careers.map(career => (
                <td key={career.id} className="py-4">{career.salary.current}</td>
              ))}
            </tr>

            {/* Timeline and Investment */}
            <tr>
              <td className="py-4 font-medium">Timeline</td>
              {careers.map(career => (
                <td key={career.id} className="py-4">{career.timeline}</td>
              ))}
            </tr>
            <tr>
              <td className="py-4 font-medium">Total Investment</td>
              {careers.map(career => (
                <td key={career.id} className="py-4">{career.cost}</td>
              ))}
            </tr>

            {/* Market Metrics */}
            <tr>
              <td className="py-4 font-medium">Market Demand</td>
              {careers.map(career => (
                <td key={career.id} className="py-4">{career.demand}</td>
              ))}
            </tr>
            <tr>
              <td className="py-4 font-medium">AI Risk</td>
              {careers.map(career => (
                <td key={career.id} className="py-4">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-24 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          career.ai_risk < 30
                            ? 'bg-green-500'
                            : career.ai_risk < 70
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                        }`}
                        style={{ width: `${career.ai_risk}%` }}
                      />
                    </div>
                    <span>{career.ai_risk}%</span>
                  </div>
                </td>
              ))}
            </tr>
            <tr>
              <td className="py-4 font-medium">Job Satisfaction</td>
              {careers.map(career => (
                <td key={career.id} className="py-4">
                  <div className="flex items-center gap-1">
                    {renderStars(career.satisfaction)}
                    <span className="ml-2">({career.satisfaction}/5)</span>
                  </div>
                </td>
              ))}
            </tr>

            {/* Required Skills */}
            <tr>
              <td className="py-4 font-medium">Required Skills</td>
              {careers.map(career => (
                <td key={career.id} className="py-4">
                  <div className="space-y-2">
                    {career.skills.map((skill, index) => (
                      <div
                        key={index}
                        className={`inline-block px-2 py-1 rounded text-sm mr-2 mb-2 ${
                          skill.importance === 'required'
                            ? 'bg-blue-500/20 text-blue-300'
                            : 'bg-purple-500/20 text-purple-300'
                        }`}
                      >
                        {skill.name} ({skill.level})
                      </div>
                    ))}
                  </div>
                </td>
              ))}
            </tr>

            {/* Pre-requisites */}
            <tr>
              <td className="py-4 font-medium">Pre-requisites</td>
              {careers.map(career => (
                <td key={career.id} className="py-4">
                  <ul className="list-disc list-inside space-y-1">
                    {career.preRequisites.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </td>
              ))}
            </tr>

            {/* Exams */}
            <tr>
              <td className="py-4 font-medium">Required Exams</td>
              {careers.map(career => (
                <td key={career.id} className="py-4">
                  <div className="space-y-2">
                    {career.exams.map((exam, index) => (
                      <div key={index} className="bg-white/5 p-2 rounded">
                        <div className="font-medium">{exam.name}</div>
                        <div className="text-sm text-gray-400">{exam.syllabus}</div>
                        {(exam.duration || exam.cost) && (
                          <div className="text-xs text-gray-500 mt-1">
                            {exam.duration && <span>{exam.duration}</span>}
                            {exam.duration && exam.cost && <span> • </span>}
                            {exam.cost && <span>{exam.cost}</span>}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Pros and Cons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {careers.map(career => (
          <div key={career.id} className="glass-card p-6 rounded-xl">
            <h3 className="text-xl font-semibold mb-4">{career.title}</h3>
            <div className="grid grid-cols-2 gap-4">
              {/* Pros */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-green-400 mb-3">
                  <ThumbsUp className="w-4 h-4" />
                  <span className="font-medium">Pros</span>
                </div>
                <ul className="space-y-2">
                  {career.reviews?.[0]?.pros.map((pro, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-green-400">•</span>
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Cons */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-red-400 mb-3">
                  <ThumbsDown className="w-4 h-4" />
                  <span className="font-medium">Cons</span>
                </div>
                <ul className="space-y-2">
                  {career.reviews?.[0]?.cons.map((con, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-red-400">•</span>
                      <span>{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}