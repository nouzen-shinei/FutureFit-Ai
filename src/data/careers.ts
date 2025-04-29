import { Career } from '../types';

export const CAREER_DATA: Career[] = [
  {
    id: 1,
    type: "💎",
    title: "AI/ML Engineer",
    salary: { 
      current: "₹45L/year", 
      entry: "₹8L/year", 
      avg: "₹25L/year",
      cagr: "22% YoY"
    },
    cost: "₹12L (MTech/MS)",
    timeline: "2-3 years",
    totalTime: "4-5 years",
    demand: "95/100",
    ai_risk: 12,
    satisfaction: 4.5,
    exams: [
      { name: "GATE CS/IT", syllabus: "Computer Science fundamentals, Math, ML basics", duration: "6-8 months prep", cost: "₹2,000" },
      { name: "GRE", syllabus: "Quant, Verbal, AWA (for MS abroad)", duration: "3-4 months prep", cost: "₹15,000" }
    ],
    skills: [
      { name: "Python", importance: "required", level: "expert" },
      { name: "Machine Learning", importance: "required", level: "expert" },
      { name: "Deep Learning", importance: "required", level: "intermediate" },
      { name: "MLOps", importance: "preferred", level: "intermediate" },
      { name: "Cloud (AWS/Azure)", importance: "required", level: "intermediate" }
    ],
    preRequisites: [
      "BTech/BE in CS/IT/related field",
      "Strong mathematics background",
      "Programming fundamentals",
      "Basic ML understanding",
      "Statistics and probability concepts"
    ],
    resources: {
      books: [
        "Deep Learning by Ian Goodfellow & Yoshua Bengio",
        "Hands-On Machine Learning with Scikit-Learn & TensorFlow",
        "Python Machine Learning by Sebastian Raschka",
        "Mathematics for Machine Learning"
      ],
      courses: [
        {
          name: "Machine Learning Specialization - IIT Madras",
          platform: "NPTEL",
          duration: "12 weeks",
          level: "Beginner",
          certificate: true,
          free: true
        },
        {
          name: "Deep Learning Specialization",
          platform: "Coursera",
          duration: "5 months",
          level: "Intermediate",
          certificate: true,
          free: false
        },
        {
          name: "MLOps Engineering",
          platform: "Udacity",
          duration: "4 months",
          level: "Advanced",
          certificate: true,
          free: false
        },
        {
          name: "Applied AI with Deep Learning",
          platform: "IBM",
          duration: "6 weeks",
          level: "Advanced",
          certificate: true,
          free: false
        }
      ],
      colleges: [
        "IIT Bombay",
        "IIT Delhi",
        "IISc Bangalore",
        "IIIT Hyderabad",
        "IIT Madras",
        "BITS Pilani"
      ]
    },
    mentors: ["linkedin.com/in/ai-experts-india"],
    news: ["Hiring surge in AI/ML roles across Indian startups"],
    notableProfessionals: [
      {
        name: "Dr. Manish Gupta",
        bio: "VP at Google Research India",
        achievements: [
          "Led Microsoft Research India",
          "Founded VideoKen",
          "Multiple patents in AI/ML"
        ]
      },
      {
        name: "Arnab Kumar",
        bio: "Director of AI at Flipkart",
        achievements: [
          "Built Flipkart's AI ecosystem",
          "Former NITI Aayog AI lead",
          "IIT-IIM alumnus"
        ]
      }
    ],
    marketDemandHistory: [
      { year: 2020, demand: 75, supply: 45 },
      { year: 2021, demand: 82, supply: 50 },
      { year: 2022, demand: 88, supply: 58 },
      { year: 2023, demand: 92, supply: 65 },
      { year: 2024, demand: 95, supply: 70 }
    ]
  },
  {
    id: 2,
    type: "🌱",
    title: "Data Science Manager",
    salary: { 
      current: "₹60L/year", 
      entry: "₹18L/year", 
      avg: "₹35L/year",
      cagr: "18% YoY"
    },
    cost: "₹15L (MBA/MS)",
    timeline: "3-4 years",
    totalTime: "6-7 years",
    demand: "88/100",
    ai_risk: 15,
    satisfaction: 4.2,
    exams: [
      { name: "CAT/GMAT", syllabus: "Quant, Verbal, Data Interpretation", duration: "6-8 months prep", cost: "₹2,500" },
      { name: "Data Science Certifications", syllabus: "Statistics, ML, Business Analytics", duration: "4-6 months", cost: "₹50,000" }
    ],
    skills: [
      { name: "Data Analysis", importance: "required", level: "expert" },
      { name: "Team Leadership", importance: "required", level: "expert" },
      { name: "Business Strategy", importance: "required", level: "intermediate" },
      { name: "SQL & Python", importance: "required", level: "intermediate" },
      { name: "Stakeholder Management", importance: "required", level: "expert" }
    ],
    preRequisites: [
      "BTech/BE + MBA or MS",
      "5+ years data science experience",
      "Team management experience",
      "Strong analytical skills"
    ],
    resources: {
      books: [
        "Data Science for Business by Foster Provost",
        "The Data Science Handbook by Field Cady",
        "Storytelling with Data by Cole Nussbaumer Knaflic",
        "Data Science Team Management by Kirill Dubovikov"
      ],
      courses: [
        {
          name: "Data Science Leadership Program",
          platform: "IIM Bangalore",
          duration: "6 months",
          level: "Advanced",
          certificate: true,
          free: false
        },
        {
          name: "Business Analytics and Intelligence",
          platform: "ISB",
          duration: "8 months",
          level: "Intermediate",
          certificate: true,
          free: false
        },
        {
          name: "Data Science for Managers",
          platform: "Great Learning",
          duration: "5 months",
          level: "Intermediate",
          certificate: true,
          free: false
        },
        {
          name: "Executive Program in Data Science",
          platform: "IIIT Bangalore",
          duration: "10 months",
          level: "Advanced",
          certificate: true,
          free: false
        }
      ],
      colleges: [
        "IIM Bangalore",
        "ISB Hyderabad",
        "Great Lakes Institute",
        "SPJIMR Mumbai",
        "IIM Calcutta",
        "NMIMS Mumbai"
      ]
    },
    mentors: ["linkedin.com/in/data-leaders-india"],
    news: ["Rising demand for data science leadership roles"],
    notableProfessionals: [
      {
        name: "Sayandeb Banerjee",
        bio: "CEO & Co-founder TheMathCompany",
        achievements: [
          "Built India's largest data science firm",
          "Ex-Mu Sigma leader",
          "Data science thought leader"
        ]
      }
    ],
    marketDemandHistory: [
      { year: 2020, demand: 70, supply: 40 },
      { year: 2021, demand: 75, supply: 45 },
      { year: 2022, demand: 80, supply: 52 },
      { year: 2023, demand: 85, supply: 60 },
      { year: 2024, demand: 88, supply: 65 }
    ]
  },
  {
    id: 3,
    type: "💎",
    title: "Cloud Solutions Architect",
    salary: { 
      current: "₹55L/year", 
      entry: "₹12L/year", 
      avg: "₹30L/year",
      cagr: "20% YoY"
    },
    cost: "₹8L (Certifications)",
    timeline: "2-3 years",
    totalTime: "5-6 years",
    demand: "90/100",
    ai_risk: 18,
    satisfaction: 4.3,
    exams: [
      { name: "AWS Solutions Architect", syllabus: "Cloud Architecture, Services, Best Practices", duration: "3-4 months", cost: "₹30,000" },
      { name: "Azure Solutions Expert", syllabus: "Microsoft Azure Architecture", duration: "3-4 months", cost: "₹28,000" }
    ],
    skills: [
      { name: "Cloud Platforms", importance: "required", level: "expert" },
      { name: "System Design", importance: "required", level: "expert" },
      { name: "DevOps", importance: "required", level: "intermediate" },
      { name: "Security", importance: "required", level: "intermediate" },
      { name: "Cost Optimization", importance: "required", level: "expert" }
    ],
    preRequisites: [
      "BTech/BE in CS/IT/related field",
      "Cloud certification(s)",
      "3+ years cloud experience",
      "Strong system design skills"
    ],
    resources: {
      books: [
        "AWS Certified Solutions Architect Study Guide by Ben Piper",
        "Cloud Architecture Patterns by Bill Wilder",
        "System Design Interview by Alex Xu",
        "Cloud Native Architectures by Tom Laszewski"
      ],
      courses: [
        {
          name: "AWS Solutions Architect Professional",
          platform: "AWS Training",
          duration: "6 months",
          level: "Advanced",
          certificate: true,
          free: false
        },
        {
          name: "Microsoft Azure Solutions Architect",
          platform: "Microsoft Learn",
          duration: "3 months",
          level: "Intermediate",
          certificate: true,
          free: true
        },
        {
          name: "Google Cloud Professional Architect",
          platform: "Google Cloud",
          duration: "4 months",
          level: "Advanced",
          certificate: true,
          free: false
        },
        {
          name: "Multi-Cloud Architecture",
          platform: "Coursera",
          duration: "6 weeks",
          level: "Advanced",
          certificate: true,
          free: false
        }
      ],
      colleges: [
        "IIT Kharagpur",
        "BITS Pilani",
        "IIT Bombay",
        "IIIT Bangalore",
        "ISB Hyderabad",
        "IIT Delhi"
      ]
    },
    mentors: ["linkedin.com/in/cloud-architects-india"],
    news: ["Major cloud expansion by AWS, Azure in India"],
    notableProfessionals: [
      {
        name: "Madhusudan Shekar",
        bio: "Principal Tech Evangelist, AWS India",
        achievements: [
          "Built AWS technical community in India",
          "Key cloud architecture influencer",
          "Regular conference speaker"
        ]
      }
    ],
    marketDemandHistory: [
      { year: 2020, demand: 78, supply: 50 },
      { year: 2021, demand: 82, supply: 55 },
      { year: 2022, demand: 85, supply: 60 },
      { year: 2023, demand: 88, supply: 65 },
      { year: 2024, demand: 90, supply: 70 }
    ]
  }
];