import { Skill, Interest, Hobby } from '../types';

const TECH_SKILLS = [
  'Python', 'JavaScript', 'React', 'Node.js', 'Data Analysis',
  'Machine Learning', 'SQL', 'Cloud Computing', 'DevOps', 'UI/UX Design',
  'Java', 'C++', 'Blockchain', 'AWS', 'Docker',
  'Kubernetes', 'TypeScript', 'GraphQL', 'Vue.js', 'Angular'
];

const SOFT_SKILLS = [
  'Team Leadership', 'Communication', 'Problem Solving', 'Project Management',
  'Critical Thinking', 'Time Management', 'Adaptability', 'Creativity',
  'Emotional Intelligence', 'Negotiation', 'Public Speaking', 'Collaboration'
];

const INTERESTS = [
  'AI Ethics', 'Renewable Energy', 'Space Technology', 'Biotechnology',
  'Digital Art', 'Cybersecurity', 'Quantum Computing', 'Robotics',
  'Virtual Reality', 'Sustainable Development', 'Fintech', 'IoT',
  'Digital Health', 'Smart Cities', 'Education Technology'
];

const HOBBIES = [
  { name: 'Photography', emoji: '📸', category: 'creative' },
  { name: 'Music Production', emoji: '🎹', category: 'creative' },
  { name: 'Drawing', emoji: '✏️', category: 'creative' },
  { name: 'Rock Climbing', emoji: '🧗', category: 'physical' },
  { name: 'Yoga', emoji: '🧘', category: 'physical' },
  { name: 'Cycling', emoji: '🚴', category: 'physical' },
  { name: 'Chess', emoji: '♟️', category: 'intellectual' },
  { name: 'Reading', emoji: '📚', category: 'intellectual' },
  { name: 'Coding', emoji: '💻', category: 'intellectual' }
];

function getRandomItems<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function getRandomSkillLevel(): 1 | 2 | 3 {
  return (Math.floor(Math.random() * 3) + 1) as 1 | 2 | 3;
}

function getRandomAge(min: number = 18, max: number = 45): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomEducation(): string {
  const levels = [
    "High School",
    "Some College",
    "Associate Degree",
    "Bachelor's Degree",
    "Master's Degree",
    "PhD"
  ];
  return levels[Math.floor(Math.random() * levels.length)];
}

export function generateExampleData() {
  // Generate random skills (3-5 technical skills and 2-3 soft skills)
  const techSkills = getRandomItems(TECH_SKILLS, Math.floor(Math.random() * 3) + 3);
  const softSkills = getRandomItems(SOFT_SKILLS, Math.floor(Math.random() * 2) + 2);
  
  const skills: Skill[] = [...techSkills, ...softSkills].map(name => ({
    name,
    level: getRandomSkillLevel()
  }));

  // Generate random interests (3-5)
  const interestCount = Math.floor(Math.random() * 3) + 3;
  const interests: Interest[] = getRandomItems(INTERESTS, interestCount).map(name => ({
    name,
    type: Math.random() > 0.5 ? 'primary' : 'secondary'
  }));

  // Generate random hobbies (2-4)
  const hobbyCount = Math.floor(Math.random() * 3) + 2;
  const hobbies: Hobby[] = getRandomItems(HOBBIES, hobbyCount);

  return {
    age: getRandomAge(),
    education: getRandomEducation(),
    skills,
    interests,
    hobbies
  };
}