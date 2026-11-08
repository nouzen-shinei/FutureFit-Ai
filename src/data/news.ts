import { NewsItem } from '../types';

// Example listings from 2024, kept for illustration. They are shown only for the matching career and
// are labelled as examples in the interface; live searches are linked for every career.
export const CAREER_NEWS: NewsItem[] = [
  // AI/ML Engineer Opportunities
  {
    id: 1,
    career: "AI/ML Engineer",
    title: "Senior AI/ML Engineer - Large Language Models",
    company: "Microsoft",
    location: "Bangalore/Hyderabad",
    date: "2024-03-15",
    url: "#",
    description: "Join Microsoft's AI research team to work on cutting-edge large language models and generative AI applications. Focus on model architecture, training, and deployment at scale.",
    salary: "₹25L - ₹45L/year",
    type: "job"
  },
  {
    id: 2,
    career: "AI/ML Engineer",
    title: "AI Research Scientist",
    company: "Google India",
    location: "Bangalore",
    date: "2024-03-20",
    url: "#",
    description: "Research position focusing on developing novel AI algorithms and applications. Work on computer vision, NLP, and multimodal AI systems.",
    salary: "₹30L - ₹50L/year",
    type: "job"
  },
  // Data Science Manager Opportunities
  {
    id: 3,
    career: "Data Science Manager",
    title: "Lead Data Science Manager",
    company: "Flipkart",
    location: "Bangalore",
    date: "2024-03-25",
    url: "#",
    description: "Lead a team of data scientists working on recommendation systems, customer analytics, and supply chain optimization.",
    salary: "₹40L - ₹70L/year",
    type: "job"
  },
  {
    id: 4,
    career: "AI/ML Engineer",
    title: "AI/ML Summit 2024",
    company: "Indian Institute of Technology",
    location: "Virtual & Delhi",
    date: "2024-04-15",
    url: "#",
    description: "Annual conference featuring top AI researchers and industry leaders. Workshops on latest AI trends and networking opportunities.",
    type: "event"
  },
  // Cloud Architecture Opportunities
  {
    id: 5,
    career: "Cloud Solutions Architect",
    title: "Principal Cloud Architect",
    company: "Amazon Web Services",
    location: "Hybrid - Mumbai",
    date: "2024-03-30",
    url: "#",
    description: "Lead cloud architecture for enterprise clients. Design and implement scalable, secure cloud solutions across multiple industries.",
    salary: "₹45L - ₹80L/year",
    type: "job"
  },
  {
    id: 6,
    career: "Cloud Solutions Architect",
    title: "Cloud Security Workshop Series",
    company: "Microsoft Azure",
    location: "Online",
    date: "2024-04-10",
    url: "#",
    description: "Four-week intensive workshop series on cloud security best practices, compliance, and threat detection.",
    type: "event"
  }
];