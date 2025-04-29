import { LineChart as LineChartIcon, TrendingUp, Users, BookOpen, BriefcaseIcon, Brain, DollarSign, Clock, Award, Star, MessageSquare, ThumbsUp, ThumbsDown, ExternalLink, GraduationCap, BookOpenCheck, MapPin, Building2, ArrowUpRight, Sparkles, Target, Trophy, Briefcase } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Career } from '../types';
import { LoadingState } from './LoadingState';
import { ErrorState } from './ErrorState';
import { USER_REVIEWS } from '../data/reviews';
import { CAREER_NEWS } from '../data/news';

interface AnalysisPageProps {
  careers: Career[];
  isLoading?: boolean;
  error?: string;
  onRetry?: () => void;
}

export function AnalysisPage({ careers, isLoading, error, onRetry }: AnalysisPageProps) {
  if (isLoading) {
    return <LoadingState type="analysis" />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={onRetry} />;
  }

  if (!careers.length) {
    return (
      <div className="text-center py-12">
        <LineChartIcon className="w-12 h-12 text-blue-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-300 mb-2">No Careers Selected</h3>
        <p className="text-gray-400">Select up to 2 careers from the recommendations to analyze or compare</p>
      </div>
    );
  }

  // Single career analysis data
  const career = careers[0];

  // Generate radar chart data from careers
  const radarData = [
    {
      subject: 'Market Demand',
      A: parseInt(careers[0].demand),
      B: careers[1]?.demand ? parseInt(careers[1].demand) : 0
    },
    {
      subject: 'Job Satisfaction',
      A: careers[0].satisfaction * 20,
      B: careers[1]?.satisfaction ? careers[1].satisfaction * 20 : 0
    },
    {
      subject: 'AI Risk',
      A: 100 - careers[0].ai_risk,
      B: careers[1]?.ai_risk ? 100 - careers[1].ai_risk : 0
    },
    {
      subject: 'Required Skills',
      A: careers[0].skills.length * 10,
      B: careers[1]?.skills ? careers[1].skills.length * 10 : 0
    }
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400'}`}
      />
    ));
  };

  return (
    <div className="space-y-8">
      {/* Career Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {careers.map((career) => (
          <div key={career.id} className="glass-card p-6 rounded-xl space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <div className="text-2xl mb-1">{career.type}</div>
                <h3 className="text-xl font-semibold">{career.title}</h3>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-green-400">{career.salary.current}</div>
                <div className="text-sm text-gray-400">{career.demand} Demand</div>
                {career.cagr && (
                  <div className="text-xs text-blue-400">CAGR: {career.cagr}</div>
                )}
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white/5 rounded-lg">
                <div className="flex items-center gap-2 text-blue-400 mb-2">
                  <Target className="w-4 h-4" />
                  <span>Market Position</span>
                </div>
                <div className="text-2xl font-bold">{career.demand}</div>
                <div className="text-sm text-gray-400">Demand Score</div>
              </div>
              <div className="p-4 bg-white/5 rounded-lg">
                <div className="flex items-center gap-2 text-purple-400 mb-2">
                  <Trophy className="w-4 h-4" />
                  <span>Job Satisfaction</span>
                </div>
                <div className="flex items-center">
                  {renderStars(career.satisfaction)}
                </div>
                <div className="text-sm text-gray-400 mt-1">{career.satisfaction} / 5</div>
              </div>
            </div>

            {/* Timeline and Investment */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>Timeline</span>
                </div>
                <div>{career.timeline}</div>
                <div className="text-sm text-gray-500">Total: {career.totalTime}</div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-400">
                  <DollarSign className="w-4 h-4" />
                  <span>Investment</span>
                </div>
                <div>{career.cost}</div>
              </div>
            </div>

            {/* Salary Range */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-400">
                <DollarSign className="w-4 h-4" />
                <span>Salary Range</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <div className="text-sm text-gray-500">Entry</div>
                  <div className="font-medium">{career.salary.entry}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Average</div>
                  <div className="font-medium">{career.salary.avg}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Senior</div>
                  <div className="font-medium">{career.salary.current}</div>
                </div>
              </div>
            </div>

            {/* Career Growth */}
            {career.cagr && (
              <div className="p-4 bg-white/5 rounded-lg">
                <div className="flex items-center gap-2 text-green-400 mb-2">
                  <TrendingUp className="w-4 h-4" />
                  <span>Growth Rate</span>
                </div>
                <div className="text-2xl font-bold">{career.cagr}</div>
                <div className="text-sm text-gray-400">Compound Annual Growth Rate</div>
              </div>
            )}

            {/* Required Exams */}
            {career.exams?.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-400">
                  <BookOpen className="w-4 h-4" />
                  <span>Required Exams</span>
                </div>
                <div className="space-y-2">
                  {career.exams.map((exam, index) => (
                    <div
                      key={index}
                      className="p-3 bg-white/5 rounded-lg"
                    >
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
              </div>
            )}

            {/* AI Risk Level */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-400">
                <Brain className="w-4 h-4" />
                <span>AI Risk Level</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
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
              <div className="text-sm text-right">{career.ai_risk}% Risk</div>
            </div>
          </div>
        ))}
      </div>

      {/* Comparison Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Market Trends */}
        <div className="glass-card p-6 rounded-xl">
          <h3 className="text-xl font-semibold mb-6 flex items-center space-x-2">
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
                    name={`${career.title} (Demand)`}
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

        {/* Career Comparison Radar */}
        <div className="glass-card p-6 rounded-xl">
          <h3 className="text-xl font-semibold mb-6 flex items-center space-x-2">
            <Award className="w-5 h-5 text-purple-400" />
            <span>Career Comparison</span>
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis dataKey="subject" stroke="rgba(255,255,255,0.5)" />
                <PolarRadiusAxis stroke="rgba(255,255,255,0.1)" />
                <Radar
                  name={careers[0].title}
                  dataKey="A"
                  stroke="#3B82F6"
                  fill="#3B82F6"
                  fillOpacity={0.3}
                />
                {careers.length > 1 && (
                  <Radar
                    name={careers[1].title}
                    dataKey="B"
                    stroke="#8B5CF6"
                    fill="#8B5CF6"
                    fillOpacity={0.3}
                  />
                )}
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Skills Requirements */}
      <div className="glass-card p-6 rounded-xl">
        <h3 className="text-xl font-semibold mb-6 flex items-center space-x-2">
          <Brain className="w-5 h-5 text-green-400" />
          <span>Skills Requirements</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {careers.map((career) => (
            <div key={career.id} className="space-y-4">
              <h4 className="font-medium text-gray-300">{career.title}</h4>
              <div className="space-y-2">
                {career.skills.map((skill, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg ${
                      skill.importance === 'required'
                        ? 'bg-blue-500/20 border border-blue-500/30'
                        : 'bg-purple-500/20 border border-purple-500/30'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span>{skill.name}</span>
                      <span className="text-sm opacity-75">{skill.level}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* User Reviews */}
      <div className="glass-card p-6 rounded-xl">
        <h3 className="text-xl font-semibold mb-6 flex items-center space-x-2">
          <MessageSquare className="w-5 h-5 text-yellow-400" />
          <span>User Reviews</span>
        </h3>
        <div className="space-y-8">
          {careers.map((career) => (
            <div key={career.id} className="space-y-4 w-full">
              <h4 className="font-medium text-gray-300">{career.title}</h4>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {career.reviews?.map((review) => (
                  <div key={review.id} className="p-4 bg-white/5 rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{review.author}</span>
                        <span className="text-sm text-gray-400">{review.age} years old</span>
                      </div>
                      <div className="flex">{renderStars(review.rating)}</div>
                    </div>
                    <p className="text-gray-300">{review.text}</p>
                    <div className="text-sm text-gray-400">Experience: {review.experience}</div>
                    {/* Pros and Cons */}
                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-green-400">
                          <ThumbsUp className="w-4 h-4" />
                          <span className="font-medium">Pros</span>
                        </div>
                        <ul className="space-y-1 text-sm">
                          {review.pros.map((pro, i) => (
                            <li key={i} className="text-gray-300">• {pro}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-red-400">
                          <ThumbsDown className="w-4 h-4" />
                          <span className="font-medium">Cons</span>
                        </div>
                        <ul className="space-y-1 text-sm">
                          {review.cons.map((con, i) => (
                            <li key={i} className="text-gray-300">• {con}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Notable Professionals */}
      <div className="glass-card p-6 rounded-xl">
        <h3 className="text-xl font-semibold mb-6 flex items-center space-x-2">
          <Users className="w-5 h-5 text-blue-400" />
          <span>Notable Professionals</span>
        </h3>
        <div className="space-y-8">
          {careers.map((career) => (
            <div key={career.id} className="space-y-4">
              <h4 className="font-medium text-gray-300">{career.title}</h4>
              {career.notableProfessionals?.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                  {career.notableProfessionals.map((person, index) => (
                    <div
                      key={index}
                      className="p-4 bg-white/5 rounded-lg space-y-2"
                    >
                      <div className="font-medium text-blue-300">{person.name}</div>
                      <p className="text-sm text-gray-400">{person.bio}</p>
                      <ul className="text-xs text-gray-500 space-y-1">
                        {person.achievements.map((achievement, i) => (
                          <li key={i}>• {achievement}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-sm">No notable professionals listed</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Latest Opportunities */}
      <div className="glass-card p-6 rounded-xl">
        <h3 className="text-xl font-semibold mb-6 flex items-center space-x-2">
          <BriefcaseIcon className="w-5 h-5 text-green-400" />
          <span>Latest Opportunities</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {careers.map((career) => (
            <div key={career.id} className="space-y-4">
              <h4 className="font-medium text-gray-300">{career.title}</h4>
              <div className="space-y-4">
                {CAREER_NEWS
                  .filter(news => news.company.toLowerCase().includes(career.title.toLowerCase()))
                  .map((news) => (
                    <div key={news.id} className="p-4 bg-white/5 rounded-lg space-y-3">
                      {/* News Type Badge */}
                      <div className="flex items-center justify-between">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          news.type === 'job'
                            ? 'bg-green-500/20 text-green-400'
                            : news.type === 'event'
                            ? 'bg-blue-500/20 text-blue-400'
                            : 'bg-purple-500/20 text-purple-400'
                        }`}>
                          {news.type.toUpperCase()}
                        </span>
                        <span className="text-sm text-gray-400">{news.date}</span>
                      </div>

                      {/* Title and Company */}
                      <div className="space-y-1">
                        <h5 className="font-medium text-lg">{news.title}</h5>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <Building2 className="w-4 h-4" />
                          <span>{news.company}</span>
                          {news.location && (
                            <>
                              <span>•</span>
                              <MapPin className="w-4 h-4" />
                              <span>{news.location}</span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-gray-300">{news.description}</p>

                      {/* Salary if available */}
                      {news.salary && (
                        <div className="flex items-center gap-2 text-green-400">
                          <DollarSign className="w-4 h-4" />
                          <span className="text-sm">{news.salary}</span>
                        </div>
                      )}

                      {/* Action Button */}
                      {news.url && (
                        <a
                          href={news.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-colors text-sm mt-2"
                        >
                          {news.type === 'job' ? (
                            <>
                              <span>Apply Now</span>
                              <ArrowUpRight className="w-4 h-4" />
                            </>
                          ) : news.type === 'event' ? (
                            <>
                              <span>Register</span>
                              <ArrowUpRight className="w-4 h-4" />
                            </>
                          ) : (
                            <>
                              <span>Read More</span>
                              <ArrowUpRight className="w-4 h-4" />
                            </>
                          )}
                        </a>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Learning Resources */}
      <div className="glass-card p-6 rounded-xl">
        <h3 className="text-xl font-semibold mb-6 flex items-center space-x-2">
          <BookOpenCheck className="w-5 h-5 text-purple-400" />
          <span>Learning Resources</span>
        </h3>
        <div className="space-y-8">
          {careers.map((career) => (
            <div key={career.id} className="space-y-6">
              <h4 className="font-medium text-gray-300">{career.title}</h4>
              
              {/* Recommended Books */}
              {career.resources?.books && career.resources.books.length > 0 && (
                <div className="space-y-3 lg:col-span-2">
                  <div className="flex items-center gap-2 text-gray-400">
                    <BookOpen className="w-4 h-4" />
                    <span className="font-medium">Recommended Books</span>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-2">
                    {career.resources.books.map((book, index) => (
                      <div key={index} className="p-3 bg-white/5 rounded-lg">
                        <span>{book}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Online Courses */}
              {career.resources?.courses && career.resources.courses.length > 0 && (
                <div className="space-y-3 lg:col-span-2">
                  <div className="flex items-center gap-2 text-gray-400">
                    <GraduationCap className="w-4 h-4" />
                    <span className="font-medium">Online Courses</span>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-2">
                    {career.resources.courses.map((course: { name: string; platform: string; duration: string; level: string; certificate: boolean; free: boolean }, index) => (
                      <div
                        key={index}
                        href={`https://${course.platform.toLowerCase().replace(/\s+/g, '')}.com/search?q=${encodeURIComponent(course.name)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 bg-white/5 rounded-lg flex items-center justify-between hover:bg-white/10 transition-colors group"
                      >
                        <div className="space-y-1">
                          <div className="font-medium">{course.name}</div>
                          <div className="text-sm text-gray-400">
                            {course.platform} • {course.duration} • {course.level}
                          </div>
                          <div className="flex gap-2 text-xs">
                            {course.certificate && (
                              <span className="text-green-400">Certificate Available</span>
                            )}
                            <span className={course.free ? "text-green-400" : "text-blue-400"}>
                              {course.free ? "Free" : "Paid"}
                            </span>
                          </div>
                        </div>
                        <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-400 transition-colors" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Learning Path */}
              {career.preRequisites && career.preRequisites.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-gray-400">
                    <MapPin className="w-4 h-4" />
                    <span className="font-medium">Learning Path</span>
                  </div>
                  <div className="relative pl-4 border-l-2 border-gray-700 space-y-4">
                    {career.preRequisites.map((step, index) => (
                      <div
                        key={index}
                        className="relative"
                      >
                        {/* Timeline dot */}
                        <div className="absolute -left-[21px] w-4 h-4 rounded-full bg-gray-800 border-2 border-gray-700" />
                        <div className="p-3 bg-white/5 rounded-lg ml-4">
                          <span>{step}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommended Institutions */}
              {career.resources?.colleges && career.resources.colleges.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Building2 className="w-4 h-4" />
                    <span className="font-medium">Top Institutions</span>
                  </div>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                    {career.resources.colleges.slice(0, 4).map((college, index) => (
                      <div key={index} className="p-3 bg-white/5 rounded-lg text-center">
                        <span>{college}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}