export interface Skill {
  name: string;
  level: 1 | 2 | 3 | 4;
}

export interface Interest {
  name: string;
  type: 'primary' | 'secondary';
}

export interface Hobby {
  name: string;
  emoji: string;
  category: 'creative' | 'physical' | 'intellectual';
}

export interface CareerExam {
  name: string;
  syllabus: string;
  duration?: string;
  cost?: string;
}

export interface CareerSkill {
  name: string;
  importance: 'required' | 'preferred';
  level: 'basic' | 'intermediate' | 'expert';
}

export interface NotablePerson {
  name: string;
  bio: string;
  achievements: string[];
  imageUrl?: string;
}

export interface CareerResources {
  books: string[];
  courses: {
    name: string;
    platform: string;
    duration: string;
    level: 'Beginner' | 'Intermediate' | 'Advanced';
    certificate: boolean;
    free: boolean;
  }[];
  colleges: string[];
}

export interface CareerSalary {
  current: string;
  entry: string;
  avg: string;
  cagr?: string;
}

export interface MarketDemand {
  year: number;
  demand: number;
  supply: number;
}

export interface Career {
  id: number;
  type: '💎' | '⚠️' | '🌱';
  title: string;
  salary: CareerSalary;
  cost: string;
  timeline: string;
  totalTime: string;
  demand: string;
  ai_risk: number;
  satisfaction: number;
  cagr?: string;
  exams: CareerExam[];
  skills: CareerSkill[];
  preRequisites: string[];
  resources: CareerResources;
  mentors: string[];
  news: string[];
  notableProfessionals: NotablePerson[];
  marketDemandHistory: MarketDemand[];
}

export interface UserReview {
  id: number;
  career: string;
  rating: number;
  author: string;
  age: number;
  text: string;
  experience: string;
  pros: string[];
  cons: string[];
}

export interface NewsItem {
  id: number;
  title: string;
  company: string;
  location: string;
  date: string;
  url: string;
  description: string;
  salary?: string;
  type: 'job' | 'news' | 'event';
}

export interface UserProfile {
  age: number;
  education: string;
  skills: Skill[];
  interests: Interest[];
  hobbies: Hobby[];
}