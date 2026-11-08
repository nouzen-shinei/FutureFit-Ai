import React, { useState, useEffect, useMemo, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, GraduationCap, LineChart, X, Plus, AlertCircle, Sparkles, Heart, Menu, Upload } from 'lucide-react';
import { Logo } from './components/Logo';
import { AutoComplete } from './components/AutoComplete';
import { generateCareerRecommendations, extractSkillsFromResume, resumeKind, MAX_RESUME_BYTES } from './lib/ai';
import { CareersPage } from './components/CareersPage';
import { LoadingState } from './components/LoadingState';
import { ErrorState } from './components/ErrorState';
import { Career, Education, Hobby, Interest, Skill, SkillLevel } from './types';
import { GenerateButton } from './components/GenerateButton';

// The analysis page (with the chart library) is loaded only when it is first opened.
const AnalysisPage = lazy(() => import('./components/AnalysisPage').then((m) => ({ default: m.AnalysisPage })));

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

const PREDEFINED_HOBBIES: Hobby[] = [
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

// Proficiency levels, from lowest to highest
const SKILL_LEVELS: { value: SkillLevel; label: string; chip: string; dot: string; text: string }[] = [
  { value: 1, label: 'Basic', chip: 'bg-white/10 hover:bg-white/20 border border-white/10', dot: 'bg-gray-400', text: 'text-gray-300' },
  { value: 2, label: 'Intermediate', chip: 'bg-gradient-to-r from-purple-500/40 to-purple-600/40 hover:from-purple-500/50 hover:to-purple-600/50 border border-purple-500/50', dot: 'bg-purple-400', text: 'text-purple-300' },
  { value: 3, label: 'Advanced', chip: 'bg-gradient-to-r from-blue-500/40 to-blue-600/40 hover:from-blue-500/50 hover:to-blue-600/50 border border-blue-500/50', dot: 'bg-blue-400', text: 'text-blue-300' },
  { value: 4, label: 'Expert', chip: 'bg-gradient-to-r from-green-500/40 to-green-600/40 hover:from-green-500/50 hover:to-green-600/50 border border-green-500/50', dot: 'bg-green-400', text: 'text-green-300' },
];
const levelInfo = (level: SkillLevel) => SKILL_LEVELS[level - 1] ?? SKILL_LEVELS[0];

// Remove buttons: always visible on touch screens, shown on hover or keyboard focus on larger screens.
const REMOVE_BUTTON = 'opacity-70 md:opacity-0 md:group-hover:opacity-100 focus:opacity-100 transition-opacity';

const MAX_SKILLS = 15;
const PROFILE_KEY = 'userProfile';

interface StoredProfile {
  age: number;
  education: Education;
  skills: Skill[];
  interests: Interest[];
  hobbies: Hobby[];
}

const EMPTY_PROFILE: StoredProfile = {
  age: 25,
  education: { level: '', stream: '', status: '' },
  skills: [],
  interests: [],
  hobbies: [],
};

const EXAMPLE_DATA: StoredProfile = {
  age: 24,
  education: { level: 'BCA', stream: 'Computer Science', status: 'Completed' },
  skills: [
    { name: 'Python', level: 3 },
    { name: 'Data Analysis', level: 2 },
    { name: 'Team Leadership', level: 2 },
  ],
  interests: [
    { name: 'AI Ethics', type: 'primary' },
    { name: 'Renewable Energy', type: 'secondary' },
  ],
  hobbies: [
    { name: 'Gaming', emoji: '🎮', category: 'intellectual' },
    { name: 'Reading', emoji: '📚', category: 'intellectual' },
  ],
};

// Reads the saved profile and keeps only valid values, so damaged or old data cannot break the page.
function loadProfile(): StoredProfile {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return EMPTY_PROFILE;
    const data = JSON.parse(raw);
    const str = (v: unknown) => (typeof v === 'string' ? v : '');
    const arr = (v: unknown) => (Array.isArray(v) ? v : []);
    const age = Number(data?.age);
    return {
      age: Number.isInteger(age) && age >= 13 && age <= 65 ? age : EMPTY_PROFILE.age,
      education: { level: str(data?.education?.level), stream: str(data?.education?.stream), status: str(data?.education?.status) },
      skills: arr(data?.skills)
        .filter((s) => typeof s?.name === 'string' && s.name.trim())
        .slice(0, MAX_SKILLS)
        .map((s) => ({ name: s.name, level: ([1, 2, 3, 4].includes(s.level) ? s.level : 1) as SkillLevel })),
      interests: arr(data?.interests)
        .filter((i) => typeof i?.name === 'string' && i.name.trim())
        .map((i) => ({ name: i.name, type: i.type === 'secondary' ? 'secondary' : 'primary' })),
      hobbies: arr(data?.hobbies)
        .filter((h) => typeof h?.name === 'string' && h.name.trim())
        .map((h) => ({
          name: h.name,
          emoji: str(h.emoji),
          category: ['creative', 'physical', 'intellectual'].includes(h.category) ? h.category : 'creative',
        })),
    };
  } catch {
    return EMPTY_PROFILE;
  }
}

function validateProfile(p: StoredProfile): string[] {
  const errors: string[] = [];
  if (!p.education.level) errors.push('Select your education level');
  if (!p.education.status) errors.push('Select your education status');
  if (p.skills.length < 3) errors.push('Add at least 3 skills');
  if (p.interests.length < 1) errors.push('Add at least 1 interest');
  return errors;
}
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
  const [initial] = useState(loadProfile);
  const [activeSection, setActiveSection] = useState('input');
  const [age, setAge] = useState(initial.age);
  const [education, setEducation] = useState<Education>(initial.education);
  const [skills, setSkills] = useState<Skill[]>(initial.skills);
  const [newSkill, setNewSkill] = useState('');
  const [interests, setInterests] = useState<Interest[]>(initial.interests);
  const [newInterest, setNewInterest] = useState('');
  const [hobbies, setHobbies] = useState<Hobby[]>(initial.hobbies);
  const [showHobbies, setShowHobbies] = useState(false);
  const [newHobby, setNewHobby] = useState<Hobby>({ name: '', emoji: '', category: 'creative' });
  const [messages, setMessages] = useState<string[]>([]);
  const [showValidation, setShowValidation] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [selectedCareers, setSelectedCareers] = useState<Career[]>([]);
  const [resumeNote, setResumeNote] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [careers, setCareers] = useState<Career[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const profile = useMemo(() => ({ age, education, skills, interests, hobbies }), [age, education, skills, interests, hobbies]);
  // Validation errors are recalculated on every change once the user has tried to generate.
  const validationErrors = useMemo(() => validateProfile(profile), [profile]);
  const visibleErrors = [...(showValidation ? validationErrors : []), ...messages];

  // Save the profile after every change.
  useEffect(() => {
    try {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    } catch {
      // storage full or disabled: the app keeps working without saving
    }
  }, [profile]);

  const loadExampleData = () => {
    setAge(EXAMPLE_DATA.age);
    setEducation(EXAMPLE_DATA.education);
    setSkills(EXAMPLE_DATA.skills);
    setInterests(EXAMPLE_DATA.interests);
    setHobbies(EXAMPLE_DATA.hobbies);
    setMessages([]);
  };

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

  // The skill name is passed in explicitly, so chips and suggestions add exactly the chosen skill.
  const addSkill = (raw: string = newSkill) => {
    const name = raw.trim();
    if (!name) return;
    if (skills.some((skill) => skill.name.toLowerCase() === name.toLowerCase())) {
      setMessages(['Skill already exists']);
      return;
    }
    if (skills.length >= MAX_SKILLS) {
      setMessages([`Maximum ${MAX_SKILLS} skills allowed`]);
      return;
    }
    setSkills([...skills, { name, level: 1 }]);
    setNewSkill('');
    setMessages([]);
  };

  const removeSkill = (skillName: string) => {
    setSkills(skills.filter((skill) => skill.name !== skillName));
  };

  const updateSkillLevel = (skillName: string, level: SkillLevel) => {
    setSkills(skills.map((skill) => (skill.name === skillName ? { ...skill, level } : skill)));
  };

  const addInterest = (raw: string) => {
    const name = raw.trim();
    if (!name) return;
    if (interests.some((interest) => interest.name.toLowerCase() === name.toLowerCase())) {
      setNewInterest('');
      return;
    }
    setInterests([...interests, { name, type: 'primary' }]);
    setNewInterest('');
  };

  const removeInterest = (interestName: string) => {
    setInterests(interests.filter((interest) => interest.name !== interestName));
  };

  const toggleInterestType = (interestName: string) => {
    setInterests(
      interests.map((interest) =>
        interest.name === interestName ? { ...interest, type: interest.type === 'primary' ? 'secondary' : 'primary' } : interest,
      ),
    );
  };

  const addHobby = (hobby: Hobby) => {
    if (hobbies.some((h) => h.name.toLowerCase() === hobby.name.toLowerCase())) return;
    setHobbies([...hobbies, hobby]);
  };

  const addCustomHobby = () => {
    const name = newHobby.name.trim();
    const emoji = newHobby.emoji.trim();
    if (!name || !emoji) {
      setMessages(['Enter a hobby name and an emoji']);
      return;
    }
    if (hobbies.some((h) => h.name.toLowerCase() === name.toLowerCase())) {
      setMessages(['Hobby already exists']);
      return;
    }
    setHobbies([...hobbies, { ...newHobby, name, emoji }]);
    setNewHobby({ name: '', emoji: '', category: 'creative' });
    setMessages([]);
  };

  const removeHobby = (hobbyName: string) => {
    setHobbies(hobbies.filter((hobby) => hobby.name !== hobbyName));
  };

  const handleGenerate = async () => {
    setShowValidation(true);
    setMessages([]);
    if (validationErrors.length > 0) return;

    setIsLoading(true);
    setError(null);
    try {
      const recommendations = await generateCareerRecommendations(profile);
      setCareers(recommendations);
      setSelectedCareers([]); // the old selection belongs to the previous results
      setActiveSection('careers');
    } catch (err) {
      console.warn('Error generating recommendations:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate recommendations. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const processResume = async (file: File) => {
    if (!resumeKind(file)) {
      setMessages(['Please upload a PDF or a plain-text (.txt) resume']);
      return;
    }
    if (file.size > MAX_RESUME_BYTES) {
      setMessages(['The resume is larger than 2 MB']);
      return;
    }
    setIsUploading(true);
    setResumeNote('');
    setMessages([]);
    try {
      const extracted = await extractSkillsFromResume(file);
      const known = new Set(skills.map((s) => s.name.toLowerCase()));
      const fresh = extracted.filter((name) => !known.has(name.toLowerCase()));
      const room = Math.max(0, MAX_SKILLS - skills.length);
      const added = fresh.slice(0, room);
      setSkills([...skills, ...added.map((name) => ({ name, level: 1 as SkillLevel }))]);
      const notes = [`Added ${added.length} new skill${added.length === 1 ? '' : 's'} from your resume`];
      if (extracted.length > fresh.length) notes.push(`${extracted.length - fresh.length} already listed`);
      if (fresh.length > added.length) notes.push(`${fresh.length - added.length} skipped (limit of ${MAX_SKILLS})`);
      setResumeNote(notes.join('; '));
    } catch (err) {
      setMessages([err instanceof Error ? err.message : 'Failed to process resume. Please try again.']);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = ''; // allows the same file to be chosen again
    if (file) await processResume(file);
  };

  const handleDrop = async (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file) await processResume(file);
  };

  const handleCareerSelect = (career: Career) => {
    if (selectedCareers.some((c) => c.id === career.id)) {
      setSelectedCareers(selectedCareers.filter((c) => c.id !== career.id));
    } else if (selectedCareers.length < 2) {
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
            type="button"
            className="md:hidden"
            aria-label={showMobileMenu ? 'Close menu' : 'Open menu'}
            aria-expanded={showMobileMenu}
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
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                  <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Design Your Future Career Path
                  </h1>
                  <button
                    type="button"
                    onClick={loadExampleData}
                    className="shrink-0 px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
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
                        onChange={(e) => setAge(parseInt(e.target.value, 10))}
                        aria-label="Age"
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
                    <div className="block">
                      <span className="text-gray-300 mb-1 block">Skills ({skills.length}/{MAX_SKILLS})</span>
                      <div className="relative">
                        <AutoComplete
                          value={newSkill}
                          onChange={setNewSkill}
                          onSelect={(skill) => addSkill(skill)}
                          onEnter={(value) => addSkill(value)}
                          suggestions={Object.values(PREDEFINED_SKILLS).flat()}
                          placeholder="Add Your Core Skills (Start typing...)"
                          ariaLabel="Add a skill"
                        />
                        <button
                          type="button"
                          onClick={() => addSkill()}
                          aria-label="Add skill"
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-400 hover:text-blue-300"
                        >
                          <Plus className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Predefined Skills */}
                    <div className="space-y-2">
                      {Object.entries(PREDEFINED_SKILLS).map(([category, skillList]) => (
                        <div key={category} className="space-y-2">
                          <h4 className="text-sm font-medium text-gray-400">{category}</h4>
                          <div className="flex flex-wrap gap-2">
                            {skillList.map((skill) => (
                              <button
                                key={skill}
                                type="button"
                                onClick={() => addSkill(skill)}
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
                            className={`group flex items-center gap-2 px-3 py-1 rounded-full transition-colors ${levelInfo(skill.level).chip}`}
                          >
                            <span>{skill.name}</span>
                            <div className="flex items-center gap-1" aria-hidden="true">
                              {SKILL_LEVELS.map(({ value }) => (
                                <div
                                  key={value}
                                  className={`w-1.5 h-1.5 rounded-full ${value <= skill.level ? levelInfo(skill.level).dot : 'bg-white/20'}`}
                                />
                              ))}
                            </div>
                            <select
                              value={skill.level}
                              onChange={(e) => updateSkillLevel(skill.name, Number(e.target.value) as SkillLevel)}
                              aria-label={`Level of ${skill.name}`}
                              className={`bg-transparent border-none focus:outline-none text-sm cursor-pointer ${levelInfo(skill.level).text}`}
                            >
                              {SKILL_LEVELS.map(({ value, label }) => (
                                <option key={value} value={value} className="bg-gray-800">
                                  {label}
                                </option>
                              ))}
                            </select>
                            <button
                              type="button"
                              onClick={() => removeSkill(skill.name)}
                              aria-label={`Remove ${skill.name}`}
                              className={REMOVE_BUTTON}
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
                    <div className="block">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-gray-300">Interests</span>
                        <span className="text-sm text-gray-400">Click to toggle primary/secondary</span>
                      </div>
                      <div className="relative">
                        <AutoComplete
                          value={newInterest}
                          onChange={setNewInterest}
                          onSelect={(interest) => addInterest(interest)}
                          onEnter={(value) => addInterest(value)}
                          suggestions={PREDEFINED_INTERESTS}
                          placeholder="Add custom interest or select from below"
                          ariaLabel="Add an interest"
                        />
                        <button
                          type="button"
                          aria-label="Add interest"
                          onClick={() => addInterest(newInterest)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-400 hover:text-blue-300"
                        >
                          <Plus className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    
                    {/* Predefined Interests */}
                    <div className="flex flex-wrap gap-2">
                      {PREDEFINED_INTERESTS.map((interest) => (
                        <button
                          key={interest}
                          type="button"
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
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeInterest(interest.name);
                              }}
                              aria-label={`Remove ${interest.name}`}
                              className={REMOVE_BUTTON}
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
                        type="button"
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
                                  const predefinedHobby = PREDEFINED_HOBBIES.find((h) => h.name === hobby);
                                  setNewHobby(
                                    predefinedHobby
                                      ? { name: predefinedHobby.name, emoji: predefinedHobby.emoji, category: predefinedHobby.category }
                                      : { ...newHobby, name: hobby },
                                  );
                                }}
                                onEnter={() => addCustomHobby()}
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
                              type="button"
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
                                  type="button"
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
                                      type="button"
                                      onClick={() => removeHobby(hobby.name)}
                                      aria-label={`Remove ${hobby.name}`}
                                      className={REMOVE_BUTTON}
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
                    <p className="text-xs text-gray-400 -mt-2">
                      The file is sent to Google's Gemini AI service to find your skills; FutureFit does not store it.
                      Remove personal details such as your phone number and address first if you prefer.
                    </p>
                    <div className="relative">
                      <input
                        type="file"
                        accept=".pdf,.txt,.md,application/pdf,text/plain"
                        onChange={handleFileUpload}
                        className="sr-only"
                        id="resume-upload"
                        disabled={isUploading}
                      />
                      <label
                        htmlFor="resume-upload"
                        onDragOver={(e) => {
                          e.preventDefault();
                          setIsDragging(true);
                        }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={handleDrop}
                        className={`flex flex-col sm:flex-row items-center justify-center gap-2 w-full border-2 border-dashed rounded-lg px-4 py-8 cursor-pointer transition-colors text-center ${
                          isDragging ? 'bg-blue-500/20 border-blue-400' : 'bg-white/10 border-white/20 hover:bg-white/20'
                        }`}
                      >
                        <Upload className="w-6 h-6" />
                        <span>Drop your resume here or click to browse (PDF or .txt, up to 2 MB)</span>
                      </label>
                    </div>
                    {isUploading && <div className="text-sm text-gray-400">Processing resume...</div>}
                    {resumeNote && <div className="text-sm text-gray-400">{resumeNote}</div>}
                  </div>

                  {/* Form Errors */}
                  {visibleErrors.length > 0 && (
                    <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4">
                      <div className="flex items-center space-x-2 text-red-400 mb-2">
                        <AlertCircle className="w-5 h-5" />
                        <span className="font-semibold">Please fix the following errors:</span>
                      </div>
                      <ul className="list-disc list-inside space-y-1 text-sm text-red-300">
                        {visibleErrors.map((message, index) => (
                          <li key={index}>{message}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* AI errors are shown here, next to the button that caused them */}
                  {error && !isLoading && <ErrorState message={error} onRetry={handleGenerate} />}

                  {/* Generate Button */}
                  <GenerateButton onClick={handleGenerate} isLoading={isLoading} />
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
                onStart={() => setActiveSection('input')}
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
              <Suspense fallback={<LoadingState type="analysis" />}>
                <AnalysisPage careers={selectedCareers} isLoading={isLoading} />
              </Suspense>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;