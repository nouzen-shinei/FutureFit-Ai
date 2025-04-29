import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Briefcase, GraduationCap, LineChart, X, Plus, AlertCircle, Sparkles, Heart, Menu, Upload } from 'lucide-react';
import { Logo } from './components/Logo';
import { AutoComplete } from './components/AutoComplete';
import { generateCareerRecommendations, extractSkillsFromResume } from './lib/ai';
import { CareersPage } from './components/CareersPage';
import { AnalysisPage } from './components/AnalysisPage';
import { ComparePage } from './components/ComparePage';
import { Career } from './types';
import { GenerateButton } from './components/GenerateButton';

// Predefined Tags
const PREDEFINED_SKILLS = {
  'Technical': [
    'Python', 'JavaScript', 'React', 'Node.js', 'TypeScript',
    'Java', 'C++', 'SQL', 'AWS', 'Docker', 'Git',
    'Machine Learning', 'Data Analysis', 'Cloud Computing'
  ],
  'Design': [
    'UI/UX Design', 'Figma', 'Adobe XD', 'Photoshop',
    'Graphic Design', 'Web Design', 'Motion Design'
  ],
  'Business': [
    'Project Management', 'Agile', 'Scrum', 'Marketing',
    'Sales', 'Business Analysis', 'Product Management'
  ],
  'Soft Skills': [
    'Leadership', 'Communication', 'Problem Solving',
    'Team Management', 'Public Speaking', 'Critical Thinking'
  ]
};

const PREDEFINED_INTERESTS = [
  'Artificial Intelligence', 'Machine Learning', 'Data Science',
  'Web Development', 'Mobile Apps', 'Cloud Computing',
  'Cybersecurity', 'Blockchain', 'IoT',
  'Green Energy', 'Sustainability', 'Healthcare',
  'Finance', 'Digital Marketing', 'UX Design'
];

const PREDEFINED_HOBBIES = [
  { name: 'Painting', emoji: '🎨', category: 'creative' },
  { name: 'Writing', emoji: '✍️', category: 'creative' },
  { name: 'Photography', emoji: '📸', category: 'creative' },
  { name: 'Running', emoji: '🏃', category: 'physical' },
  { name: 'Yoga', emoji: '🧘', category: 'physical' },
  { name: 'Swimming', emoji: '🏊', category: 'physical' },
  { name: 'Reading', emoji: '📚', category: 'intellectual' },
  { name: 'Chess', emoji: '♟️', category: 'intellectual' },
  { name: 'Programming', emoji: '💻', category: 'intellectual' }
];

// Types and Interfaces
interface Skill {
  name: string;
  level: 1 | 2 | 3;
}

interface Interest {
  name: string;
  type: 'primary' | 'secondary';
}

interface Hobby {
  name: string;
  emoji: string;
  category: 'creative' | 'physical' | 'intellectual';
}

// Constants
const EXAMPLE_DATA = {
  age: 24,
  education: {
    level: "Bachelor's Degree",
    stream: "Computer Science",
    status: "Completed"
  },
  skills: [
    { name: 'Python', level: 3 },
    { name: 'Data Analysis', level: 2 },
    { name: 'Team Leadership', level: 2 }
  ],
  interests: [
    { name: 'AI Ethics', type: 'primary' },
    { name: 'Renewable Energy', type: 'secondary' }
  ],
  hobbies: [
    { name: 'Gaming', emoji: '🎮', category: 'creative' },
    { name: 'Reading', emoji: '📚', category: 'intellectual' }
  ]
};

const EDUCATION_LEVELS = {
  'School': [
    '9th',
    '10th',
    '11th - Science',
    '11th - Commerce',
    '11th - Arts',
    '12th - Science',
    '12th - Commerce',
    '12th - Arts'
  ],
  'Diploma': [
    'Diploma in Graphic Design',
    'Diploma in Animation',
    'Diploma in Visual Arts',
    'Diploma in Digital Media',
    'Diploma in Web Design',
    'Diploma in UI/UX Design',
    'Diploma in Motion Graphics',
    'Diploma in Interior Design',
    'Diploma in Fashion Design',
    'Diploma in Industrial Design'
  ],
  'Associate': [
    'Associate Degree',
    'Associate in Business',
    'Associate in Hospitality',
    'Associate in Healthcare'
  ],
  'Undergraduate': [
    'B.Tech/B.E.',
    'BCA',
    'BSc',
    'B.Com',
    'BBA',
    'BA',
    'B.Arch',
    'MBBS',
    'BDS',
    'B.Pharm',
    'LLB'
  ],
  'Postgraduate': [
    'M.Tech/M.E.',
    'MCA',
    'MSc',
    'M.Com',
    'MBA',
    'MA',
    'M.Arch',
    'MD',
    'MS',
    'M.Pharm',
    'LLM'
  ],
  'Doctorate': [
    'Ph.D',
    'D.Litt',
    'DM',
    'D.Sc'
  ]
};

const STREAMS = {
  'Science': [
    'Computer Science',
    'Environmental Science',
    'AI & Data Science',
    'AI & ML',
    'Robotics & Automation',
    'Information Technology',
    'Electronics',
    'Mechanical',
    'Civil',
    'Chemical',
    'Biotechnology',
    'Physics',
    'Chemistry',
    'Mathematics'
  ],
  'Commerce': [
    'Accounting',
    'Finance',
    'Business Administration',
    'Economics',
    'Banking',
    'Marketing',
    'Business Management',
    'Hotel Management',
    'Hospitality Management',
    'Tourism Management',
    'Retail Management',
    'Supply Chain Management',
    'Operations Management',
    'Project Management'
  ],
  'Arts': [
    'Psychology',
    'Sociology',
    'Literature',
    'History',
    'Political Science',
    'Philosophy',
    'Fine Arts',
    'Visual Arts',
    'Graphic Design',
    'Digital Arts',
    'Animation',
    'Multimedia Design',
    'Communication Design',
    'Industrial Design'
  ],
  'Medical': [
    'General Medicine',
    'Surgery',
    'Dentistry',
    'Pharmacy',
    'Nursing',
    'Physiotherapy'
  ],
  'Others': [
    'General Studies'
  ]
};

const EDUCATION_STATUS = [
  'Currently Studying',
  'Completed',
  'Discontinued'
];

function App() {
  const [activeSection, setActiveSection] = useState('input');
  const [age, setAge] = useState(25);
  const [education, setEducation] = useState({
    level: '',
    stream: '',
    status: ''
  });
  const [skills, setSkills] = useState<Skill[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [interests, setInterests] = useState<Interest[]>([]);
  const [newInterest, setNewInterest] = useState('');
  const [hobbies, setHobbies] = useState<Hobby[]>([]);
  const [showHobbies, setShowHobbies] = useState(false);
  const [newHobby, setNewHobby] = useState({ name: '', emoji: '', category: 'creative' as const });
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [selectedCareers, setSelectedCareers] = useState<Career[]>([]);
  const [extractedSkills, setExtractedSkills] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [careers, setCareers] = useState<Career[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load example data
  const loadExampleData = () => {
    setAge(EXAMPLE_DATA.age);
    setEducation(EXAMPLE_DATA.education);
    setSkills(EXAMPLE_DATA.skills);
    setInterests(EXAMPLE_DATA.interests);
    setHobbies(EXAMPLE_DATA.hobbies);
  };

  // Auto-save to localStorage
  useEffect(() => {
    const saveInterval = setInterval(() => {
      localStorage.setItem('userProfile', JSON.stringify({
        age,
        education,
        skills,
        interests,
        hobbies
      }));
    }, 15000);

    return () => clearInterval(saveInterval);
  }, [age, education, skills, interests, hobbies]);

  // Restore from localStorage on mount
  useEffect(() => {
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      const { age: savedAge, education: savedEducation, skills: savedSkills, interests: savedInterests, hobbies: savedHobbies } = 
        JSON.parse(savedProfile);
      setAge(savedAge);
      setEducation(savedEducation);
      setSkills(savedSkills);
      setInterests(savedInterests);
      setHobbies(savedHobbies);
    }
  }, []);

  const getAgePhase = (age: number): string => {
    if (age <= 19) return 'Early Learning Phase';
    if (age <= 29) return 'Early Career Phase';
    if (age <= 50) return 'Career Growth Phase';
    return 'Career Mastery Phase';
  };

  const getAgeEmoji = (age: number): string => {
    if (age <= 19) return '👶';
    if (age <= 29) return '👨‍🎓';
    if (age <= 50) return '👨‍💼';
    return '🧓';
  };

  const addSkill = () => {
    if (!newSkill.trim()) return;
    if (skills.length >= 15) {
      setFormErrors(['Maximum 15 skills allowed']);
      return;
    }
    if (skills.some(skill => skill.name.toLowerCase() === newSkill.toLowerCase())) {
      setFormErrors(['Skill already exists']);
      return;
    }

    setSkills([...skills, { name: newSkill, level: 1 }]);
    setNewSkill('');
    setFormErrors([]);
  };

  const removeSkill = (skillName: string) => {
    setSkills(skills.filter(skill => skill.name !== skillName));
  };

  const updateSkillLevel = (skillName: string, level: 1 | 2 | 3) => {
    setSkills(skills.map(skill => 
      skill.name === skillName ? { ...skill, level } : skill
    ));
  };

  const addInterest = (interestName: string) => {
    if (!interestName.trim()) return;
    if (interests.some(interest => interest.name === interestName)) {
      return;
    }
    setInterests([...interests, { name: interestName, type: 'primary' }]);
    setNewInterest('');
  };

  const removeInterest = (interestName: string) => {
    setInterests(interests.filter(interest => interest.name !== interestName));
  };

  const toggleInterestType = (interestName: string) => {
    setInterests(interests.map(interest =>
      interest.name === interestName
        ? { ...interest, type: interest.type === 'primary' ? 'secondary' : 'primary' }
        : interest
    ));
  };

  const addHobby = (hobby: Hobby) => {
    if (hobbies.some(h => h.name === hobby.name)) {
      return;
    }
    setHobbies([...hobbies, hobby]);
  };

  const addCustomHobby = () => {
    if (!newHobby.name.trim() || !newHobby.emoji.trim()) return;
    if (hobbies.some(h => h.name === newHobby.name)) {
      setFormErrors(['Hobby already exists']);
      return;
    }
    setHobbies([...hobbies, newHobby]);
    setNewHobby({ name: '', emoji: '', category: 'creative' });
    setFormErrors([]);
  };

  const removeHobby = (hobbyName: string) => {
    setHobbies(hobbies.filter(hobby => hobby.name !== hobbyName));
  };

  const validateForm = () => {
    const errors = [];
    if (!education.level) errors.push('Select your education level');
    if (!education.status) errors.push('Select your education status');
    if (skills.length < 3) errors.push('Add at least 3 skills');
    if (interests.length < 1) errors.push('Add at least 1 interest');
    setFormErrors(errors);
    return errors.length === 0;
  };

  const handleGenerate = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const userProfile = {
        age,
        education,
        skills,
        interests,
        hobbies
      };

      const recommendations = await generateCareerRecommendations(userProfile);
      setCareers(recommendations);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      setActiveSection('careers');
    } catch (error) {
      console.error('Error generating recommendations:', error);
      setError('Failed to generate recommendations. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      try {
        const text = await file.text();
        const extractedSkills = await extractSkillsFromResume(text);
        setExtractedSkills(extractedSkills);
        
        const newSkills = extractedSkills.map(skill => ({
          name: skill,
          level: 1
        }));
        setSkills(prev => [...prev, ...newSkills]);
      } catch (error) {
        console.error('Error processing resume:', error);
        setFormErrors(['Failed to process resume. Please try again.']);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleCareerSelect = (career: Career) => {
    if (selectedCareers.find(c => c.id === career.id)) {
      setSelectedCareers(selectedCareers.filter(c => c.id !== career.id));
    } else if (selectedCareers.length < 2 && !selectedCareers.includes(career)) {
      setSelectedCareers([...selectedCareers, career]);
    }
  };

  const handleAnalyze = (career: Career) => {
    setSelectedCareers([career]);
    setActiveSection('analysis');
  };

  const handleCompare = () => {
    setActiveSection('analysis');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-black/20 backdrop-blur-lg border-b border-white/10 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Logo />
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              FutureFit AI
            </span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-6">
            {[
              { icon: GraduationCap, label: 'Input' },
              { icon: Briefcase, label: 'Careers' },
              { icon: LineChart, label: 'Analysis' }
            ].map(({ icon: Icon, label }) => (
              <button
                key={label}
                onClick={() => setActiveSection(label.toLowerCase())}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                  activeSection === label.toLowerCase()
                    ? 'bg-white/10 text-blue-400'
                    : 'hover:bg-white/5'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{label}</span>
              </button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {showMobileMenu && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-white/10"
            >
              {[
                { icon: GraduationCap, label: 'Input' },
                { icon: Briefcase, label: 'Careers' },
                { icon: LineChart, label: 'Analysis' }
              ].map(({ icon: Icon, label }) => (
                <button
                  key={label}
                  onClick={() => {
                    setActiveSection(label.toLowerCase());
                    setShowMobileMenu(false);
                  }}
                  className={`flex items-center space-x-2 px-4 py-3 w-full transition-all ${
                    activeSection === label.toLowerCase()
                      ? 'bg-white/10 text-blue-400'
                      : 'hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{label}</span>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 pt-24 pb-12">
        <AnimatePresence mode="wait">
          {activeSection === 'input' && (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto"
            >
              <div className="glass-card p-8 rounded-2xl">
                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Design Your Future Career Path
                  </h1>
                  <button
                    onClick={loadExampleData}
                    className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                  >
                    Load Example Data
                  </button>
                </div>

                {/* Form Content */}
                <div className="space-y-8">
                  {/* Age Selector */}
                  <div className="relative">
                    <label className="block text-gray-300 mb-2">Age</label>
                    <div className="relative">
                      <input
                        type="range"
                        min="13"
                        max="65"
                        value={age}
                        onChange={(e) => setAge(parseInt(e.target.value))}
                        className="w-full h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg appearance-none cursor-pointer"
                      />
                      <motion.div 
                        className="absolute -top-8 left-0 bg-white/10 rounded-full px-3 py-1 text-sm"
                        style={{ left: `${((age - 13) / (65 - 13)) * 100}%` }}
                        animate={{ x: '-50%' }}
                      >
                        {getAgeEmoji(age)} {age}
                      </motion.div>
                    </div>
                    <div className="text-center mt-2 text-sm text-gray-400">
                      {getAgePhase(age)}
                    </div>
                  </div>

                  {/* Education Section */}
                  <div className="space-y-4">
                    <label className="block text-gray-300">Education Details</label>
                    
                    {/* Education Level */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">Level</label>
                        <select
                          value={education.level}
                          onChange={(e) => setEducation({ ...education, level: e.target.value })}
                          className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-400"
                        >
                          <option value="">Select Level</option>
                          {Object.entries(EDUCATION_LEVELS).map(([category, levels]) => (
                            <optgroup key={category} label={category}>
                              {levels.map(level => (
                                <option key={level} value={level}>{level}</option>
                              ))}
                            </optgroup>
                          ))}
                        </select>
                      </div>

                      {/* Stream Selection */}
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">Stream/Branch (Optional)</label>
                        <select
                          value={education.stream}
                          onChange={(e) => setEducation({ ...education, stream: e.target.value })}
                          className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-400"
                        >
                          <option value="">Select Stream</option>
                          {Object.entries(STREAMS).map(([category, streams]) => (
                            <optgroup key={category} label={category}>
                              {streams.map(stream => (
                                <option key={stream} value={stream}>{stream}</option>
                              ))}
                            </optgroup>
                          ))}
                        </select>
                      </div>

                      {/* Status */}
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">Status</label>
                        <select
                          value={education.status}
                          onChange={(e) => setEducation({ ...education, status: e.target.value })}
                          className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-400"
                        >
                          <option value="">Select Status</option>
                          {EDUCATION_STATUS.map(status => (
                            <option key={status} value={status}>{status}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Skills Section */}
                  <div className="space-y-4">
                    <label className="block">
                      <span className="text-gray-300 mb-1 block">Skills ({skills.length}/15)</span>
                      <div className="relative">
                        <AutoComplete
                          value={newSkill}
                          onChange={setNewSkill}
                          onSelect={(skill) => {
                            setNewSkill(skill);
                            addSkill();
                          }}
                          suggestions={Object.values(PREDEFINED_SKILLS).flat()}
                          placeholder="Add Your Core Skills (Start typing...)"
                          onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                        />
                        <button
                          onClick={addSkill}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-400 hover:text-blue-300"
                        >
                          <Plus className="w-5 h-5" />
                        </button>
                      </div>
                    </label>

                    {/* Predefined Skills */}
                    <div className="space-y-2">
                      {Object.entries(PREDEFINED_SKILLS).map(([category, skillList]) => (
                        <div key={category} className="space-y-2">
                          <h4 className="text-sm font-medium text-gray-400">{category}</h4>
                          <div className="flex flex-wrap gap-2">
                            {skillList.map((skill) => (
                              <button
                                key={skill}
                                onClick={() => {
                                  if (!skills.some(s => s.name === skill)) {
                                    addSkill();
                                    setNewSkill(skill);
                                  }
                                }}
                                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                                  skills.some(s => s.name === skill)
                                    ? 'bg-blue-500/30 cursor-not-allowed'
                                    : 'bg-white/5 hover:bg-white/10'
                                }`}
                                disabled={skills.some(s => s.name === skill)}
                              >
                                {skill}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <AnimatePresence>
                        {skills.map((skill) => (
                          <motion.div
                            key={skill.name}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className={`group flex items-center gap-2 px-3 py-1 rounded-full transition-colors ${
                              skill.level === 3
                                ? 'bg-gradient-to-r from-blue-500/40 to-blue-600/40 hover:from-blue-500/50 hover:to-blue-600/50 border border-blue-500/50'
                               : skill.level === 4
                               ? 'bg-gradient-to-r from-green-500/40 to-green-600/40 hover:from-green-500/50 hover:to-green-600/50 border border-green-500/50'
                                : skill.level === 2
                                ? 'bg-gradient-to-r from-purple-500/40 to-purple-600/40 hover:from-purple-500/50 hover:to-purple-600/50 border border-purple-500/50'
                                : 'bg-white/10 hover:bg-white/20 border border-white/10'
                            }`}
                          >
                            <span>{skill.name}</span>
                            <div className="flex items-center gap-1">
                              {[1, 2, 3].map((level) => (
                                <div
                                  key={level}
                                  className={`w-1.5 h-1.5 rounded-full ${
                                    level <= skill.level
                                      ? skill.level === 3
                                        ? 'bg-blue-400'
                                       : skill.level === 4
                                       ? 'bg-green-400'
                                        : skill.level === 2
                                        ? 'bg-purple-400'
                                        : 'bg-gray-400'
                                      : 'bg-white/20'
                                  }`}
                                />
                              ))}
                            </div>
                            <select
                              value={skill.level}
                              onChange={(e) => updateSkillLevel(skill.name, parseInt(e.target.value) as 1 | 2 | 3)}
                              className={`bg-transparent border-none focus:outline-none text-sm cursor-pointer ${
                                skill.level === 3
                                  ? 'text-blue-300'
                                 : skill.level === 4
                                 ? 'text-green-300'
                                 : skill.level === 2
                                  ? 'text-purple-300'
                                  : 'text-gray-300'
                              }`}
                            >
                              <option value={1}>Basic</option>
                              <option value={2}>Intermediate</option>
                             <option value={3}>Expert</option>
                             <option value={4}>Advanced</option>
                            </select>
                            <button
                              onClick={() => removeSkill(skill.name)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-4 h-4 text-gray-400 hover:text-white" />
                            </button>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Interests Section */}
                  <div className="space-y-4">
                    <label className="block">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-gray-300">Interests</span>
                        <span className="text-sm text-gray-400">Click to toggle primary/secondary</span>
                      </div>
                      <div className="relative">
                        <AutoComplete
                          value={newInterest}
                          onChange={setNewInterest}
                          onSelect={(interest) => {
                            setNewInterest(interest);
                            addInterest(interest);
                          }}
                          suggestions={PREDEFINED_INTERESTS}
                          placeholder="Add custom interest or select from below"
                          onKeyPress={(e) => e.key === 'Enter' && addInterest(newInterest)}
                        />
                        <button
                          onClick={() => addInterest(newInterest)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-400 hover:text-blue-300"
                        >
                          <Plus className="w-5 h-5" />
                        </button>
                      </div>
                    </label>
                    
                    {/* Predefined Interests */}
                    <div className="flex flex-wrap gap-2">
                      {PREDEFINED_INTERESTS.map((interest) => (
                        <button
                          key={interest}
                          onClick={() => addInterest(interest)}
                          className={`px-3 py-1 rounded-full text-sm transition-colors ${
                            interests.some(i => i.name === interest)
                              ? 'bg-blue-500/30 cursor-not-allowed'
                              : 'bg-white/5 hover:bg-white/10'
                          }`}
                          disabled={interests.some(i => i.name === interest)}
                        >
                          {interest}
                        </button>
                      ))}
                    </div>

                    {/* Selected Interests */}
                    <div className="flex flex-wrap gap-2">
                      <AnimatePresence>
                        {interests.map((interest) => (
                          <motion.div
                            key={interest.name}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            onClick={() => toggleInterestType(interest.name)}
                            className={`group flex items-center space-x-2 px-3 py-1 rounded-full transition-colors cursor-pointer ${
                              interest.type === 'primary'
                                ? 'bg-blue-500/30 hover:bg-blue-500/40'
                                : 'bg-purple-500/30 hover:bg-purple-500/40'
                            }`}
                          >
                            {interest.type === 'primary' ? <Sparkles className="w-4 h-4" /> : <Heart className="w-4 h-4" />}
                            <span>{interest.name}</span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeInterest(interest.name);
                              }}
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-4 h-4 text-gray-400 hover:text-white" />
                            </button>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Hobbies Section */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="block text-gray-300">Hobbies</label>
                      <button
                        onClick={() => setShowHobbies(!showHobbies)}
                        className="text-sm text-blue-400 hover:text-blue-300"
                      >
                        {showHobbies ? 'Hide Hobbies' : 'Show Hobbies'}
                      </button>
                    </div>

                    <AnimatePresence>
                      {showHobbies && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-4"
                        >
                          {/* Custom Hobby Input */}
                          <div className="space-y-4 p-4 bg-white/5 rounded-lg">
                            <h3 className="text-lg font-semibold">Add Custom Hobby</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <AutoComplete
                                value={newHobby.name}
                                onChange={(value) => setNewHobby({ ...newHobby, name: value })}
                                onSelect={(hobby) => {
                                  const predefinedHobby = PREDEFINED_HOBBIES.find(h => h.name === hobby);
                                  if (predefinedHobby) {
                                    setNewHobby({
                                      ...newHobby,
                                      name: predefinedHobby.name,
                                      emoji: predefinedHobby.emoji
                                    });
                                  }
                                }}
                                suggestions={PREDEFINED_HOBBIES.map(h => h.name)}
                                placeholder="Hobby name"
                              />
                              <input
                                type="text"
                                value={newHobby.emoji}
                                onChange={(e) => setNewHobby({ ...newHobby, emoji: e.target.value })}
                                placeholder="Emoji (e.g., 🎨)"
                                className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-400"
                              />
                              <select
                                value={newHobby.category}
                                onChange={(e) =>
                                  setNewHobby({
                                    ...newHobby,
                                    category: e.target.value as 'creative' | 'physical' | 'intellectual',
                                  })
                                }
                                className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-400"
                              >
                                <option value="creative">Creative</option>
                                <option value="physical">Physical</option>
                                <option value="intellectual">Intellectual</option>
                              </select>
                            </div>
                            <button
                              onClick={addCustomHobby}
                              className="w-full bg-blue-500/30 hover:bg-blue-500/40 rounded-lg px-4 py-2 transition-colors"
                            >
                              Add Custom Hobby
                            </button>
                          </div>

                          {/* Predefined Hobbies */}
                          <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Popular Hobbies</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                              {PREDEFINED_HOBBIES.map((hobby) => (
                                <button
                                  key={hobby.name}
                                  onClick={() => addHobby(hobby)}
                                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                                    hobbies.some((h) => h.name === hobby.name)
                                      ? 'bg-blue-500/30 cursor-not-allowed'
                                      : 'bg-white/10 hover:bg-white/20'
                                  }`}
                                  disabled={hobbies.some((h) => h.name === hobby.name)}
                                >
                                  <span>{hobby.emoji}</span>
                                  <span>{hobby.name}</span>
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Selected Hobbies */}
                          <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Your Hobbies</h3>
                            <div className="flex flex-wrap gap-2">
                              <AnimatePresence>
                                {hobbies.map((hobby) => (
                                  <motion.div
                                    key={hobby.name}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    className="group flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                                  >
                                    <span>{hobby.emoji}</span>
                                    <span>{hobby.name}</span>
                                    <button
                                      onClick={() => removeHobby(hobby.name)}
                                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                      <X className="w-4 h-4 text-gray-400 hover:text-white" />
                                    </button>
                                  </motion.div>
                                ))}
                              </AnimatePresence>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Resume Upload */}
                  <div className="space-y-4">
                    <label className="block text-gray-300">Upload Resume (Optional)</label>
                    <div className="relative">
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,.txt"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="resume-upload"
                      />
                      <label
                        htmlFor="resume-upload"
                        className="flex items-center justify-center space-x-2 w-full bg-white/10 border-2 border-dashed border-white/20 rounded-lg px-4 py-8 cursor-pointer hover:bg-white/20 transition-colors"
                      >
                        <Upload className="w-6 h-6" />
                        <span>Drop your resume here or click to browse</span>
                      </label>
                    </div>
                    {isUploading && (
                      <div className="text-sm text-gray-400">
                        Processing resume...
                      </div>
                    )}
                    {extractedSkills.length > 0 && (
                      <div className="text-sm text-gray-400">
                        Added {extractedSkills.length} skills from your resume
                      </div>
                    )}
                  </div>

                  {/* Form Errors */}
                  {formErrors.length > 0 && (
                    <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4">
                      <div className="flex items-center space-x-2 text-red-400 mb-2">
                        <AlertCircle className="w-5 h-5" />
                        <span className="font-semibold">Please fix the following errors:</span>
                      </div>
                      <ul className="list-disc list-inside space-y-1 text-sm text-red-300">
                        {formErrors.map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Generate Button */}
                  <GenerateButton
                    onClick={handleGenerate}
                    isValid={formErrors.length === 0}
                    isLoading={isLoading}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {activeSection === 'careers' && (
            <motion.div
              key="careers"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <CareersPage
                careers={careers}
                selectedCareers={selectedCareers}
                onCareerSelect={handleCareerSelect}
                onAnalyze={handleAnalyze}
                onCompare={handleCompare}
                isLoading={isLoading}
                error={error || undefined}
                onRetry={handleGenerate}
              />
            </motion.div>
          )}

          {activeSection === 'analysis' && (
            <motion.div
              key="analysis"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <AnalysisPage
                careers={selectedCareers}
                isLoading={isLoading}
                error={error || undefined}
                onRetry={handleGenerate}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;