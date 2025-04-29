import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@supabase/supabase-js';
import { Career, UserProfile, UserReview, CareerResources } from '../types';
import { USER_REVIEWS } from '../data/reviews';
import { CAREER_DATA } from '../data/careers';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// Initialize Supabase client
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// Function to extract skills from resume text
export async function extractSkillsFromResume(resumeText: string): Promise<string[]> {
  const prompt = `Extract key professional skills from this resume, focusing on skills relevant to the Indian job market. Return them as a comma-separated list: ${resumeText}`;
  
  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  
  return text.split(',').map(skill => skill.trim());
}

// Function to generate career recommendations
export async function generateCareerRecommendations(profile: UserProfile): Promise<Career[]> {
  // Create a detailed prompt that includes all user profile information
  const prompt = `As a career counselor with expertise in the Indian job market, future career trends, and AI adoption in India, analyze this profile and generate detailed career recommendations:

Age: ${profile.age}
Education: ${profile.education}
Skills: ${profile.skills.map(s => `${s.name} (${s.level === 1 ? 'Basic' : s.level === 2 ? 'Intermediate' : 'Expert'})`).join(', ')}
Primary Interests: ${profile.interests.filter(i => i.type === 'primary').map(i => i.name).join(', ')}
Secondary Interests: ${profile.interests.filter(i => i.type === 'secondary').map(i => i.name).join(', ')}
Hobbies: ${profile.hobbies.map(h => `${h.name} (${h.category})`).join(', ')}

Generate 3-5 career recommendations specifically for the Indian market. For each career, provide:
1. Career title (focus on roles in high demand in India)
2. Type (use emoji: 💎 for high-potential in India, ⚠️ for at-risk, 🌱 for emerging)
3. Salary details in INR (current, entry, average) based on Indian market rates
4. Required skills and their importance in Indian companies
5. Education/certification requirements from Indian institutions
6. Market demand score (0-100) based on Indian job market
7. AI automation risk percentage in Indian context
8. Job satisfaction rating (1-5) based on Indian professionals
9. Notable Indian professionals in the field
10. Historical market demand data for the past 5 years in India

Use only Indian salary ranges, Indian companies, and Indian educational institutions. Include specific Indian certifications and exams where relevant (like GATE, CAT, etc.).

Format the response as a JSON array. Each career object should match this TypeScript type:

{
  id: number;
  type: "💎" | "⚠️" | "🌱";
  title: string;
  salary: {
    current: string;
    entry: string;
    avg: string;
  };
  cost: string;
  timeline: string;
  demand: string;
  ai_risk: number;
  satisfaction: number;
  skills: Array<{
    name: string;
    importance: "required" | "preferred";
    level: "basic" | "intermediate" | "expert";
  }>;
  notableProfessionals: Array<{
    name: string;
    bio: string;
    achievements: string[];
  }>;
  marketDemandHistory: Array<{
    year: number;
    demand: number;
    supply: number;
  }>;
}

Return ONLY the JSON array, no additional text or formatting.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    
    // Clean up the response by removing markdown formatting
    text = text.replace(/^```json\n/, '').replace(/\n```$/, '').trim();
    
    // Parse and validate the response
    const recommendations = JSON.parse(text);
    
    // Validate the structure matches our Career type
    if (!Array.isArray(recommendations) || recommendations.length === 0) {
      throw new Error('Invalid AI response format');
    }

    // Add unique IDs if not provided
    const careersWithIds = recommendations.map((career, index) => ({
      ...career,
      id: career.id || index + 1,
      reviews: [],
      resources: { books: [], courses: [], colleges: [] }
    }));

    try {
      // Enhance each career with additional data from OpenRouter
      const enhancedCareers = await Promise.all(
        careersWithIds.map(async (career) => {
          try {
            const [reviews, resources] = await Promise.all([
              generateReviewsWithGemini(career),
              generateResourcesWithGemini(career)
            ]);

            return {
              ...career,
              reviews,
              resources
            };
          } catch (error) {
            console.warn(`Failed to fetch additional data for career ${career.title}:`, error);
            // Return career with fallback data
            return {
              ...career,
              reviews: USER_REVIEWS.filter(r => r.career === career.title),
              resources: CAREER_DATA.find(c => c.title === career.title)?.resources || 
                { books: [], courses: [], colleges: [] }
            };
          }
        })
      );

      return enhancedCareers;
    } catch (error) {
      console.warn('Failed to enhance careers with additional data:', error);
      // Return careers with fallback data
      return careersWithIds.map(career => ({
        ...career,
        reviews: USER_REVIEWS.filter(r => r.career === career.title),
        resources: CAREER_DATA.find(c => c.title === career.title)?.resources || 
          { books: [], courses: [], colleges: [] }
      }));
    }
  } catch (error) {
    console.error('Error generating career recommendations:', error);
    throw error;
  }
}

// Function to get market demand data
export async function getMarketDemandData(careerTitle: string) {
  const { data, error } = await supabase
    .from('market_demand')
    .select('*')
    .eq('career_title', careerTitle)
    .order('year', { ascending: true });

  if (error) {
    console.error('Error fetching market demand:', error);
    return [];
  }
  return data;
}

// Function to get latest job news
export async function getLatestJobNews(careerTitle: string) {
  const { data, error } = await supabase
    .from('job_news')
    .select('*')
    .eq('career_title', careerTitle)
    .order('created_at', { ascending: false })
    .limit(5);

  if (error) {
    console.error('Error fetching job news:', error);
    return [];
  }
  return data;
}

// Function to analyze AI risk
export async function analyzeAIRisk(careerTitle: string): Promise<number> {
  const prompt = `As an AI impact analyst focusing on the Indian job market, analyze the automation risk for this career in India: ${careerTitle}
    Consider factors like:
    - Task complexity and creativity required
    - Human interaction and emotional intelligence needs
    - Decision-making complexity
    - Physical manipulation requirements
    - Current AI capabilities and adoption rates in India
    - Indian company automation trends
    
    Return only a number between 0-100 representing the risk percentage in the Indian context.`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const riskScore = parseInt(response.text());
  
  return Math.min(Math.max(riskScore, 0), 100); // Ensure between 0-100
}

// Function to generate reviews using Gemini AI
async function generateReviewsWithGemini(career: Career): Promise<UserReview[]> {
  const prompt = `Generate 4 detailed user reviews for the career "${career.title}" in the Indian job market. Each review should include:

1. A realistic Indian name for the author
2. Age between 25-40 years
3. Experience in years (2-10)
4. A detailed personal review about working in this field in India (2-3 sentences)
5. Rating between 1-5
6. 4-5 specific pros about working in this field in India
7. 4-5 specific cons about working in this field in India

Format the response as a JSON array matching this structure:
[
  {
    "id": 1,
    "career": "${career.title}",
    "rating": 4,
    "author": "Example Name",
    "age": 30,
    "text": "Example review text",
    "experience": "5 years",
    "pros": ["Pro 1", "Pro 2", "Pro 3"],
    "cons": ["Con 1", "Con 2", "Con 3"]
  }
]

Focus on authentic Indian experiences, current market conditions, and ensure reviews are balanced and detailed.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().replace(/^```json\n/, '').replace(/\n```$/, '').trim();
    return JSON.parse(text);
  } catch (error) {
    console.warn('Failed to generate reviews with Gemini:', error);
    return [];
  }
}

// Function to generate learning resources using Gemini AI
async function generateResourcesWithGemini(career: Career): Promise<CareerResources> {
  const prompt = `Generate comprehensive learning resources for the career "${career.title}" specific to India. Include:

1. 5-7 highly recommended books with authors (mix of Indian and international authors)
2. 6-8 relevant courses from Indian platforms/institutions
3. 5-6 top Indian colleges/institutions offering related programs

Format the response as a JSON object matching this structure:
{
  "books": ["Book Title by Author"],
  "courses": [
    {
      "name": "Course Name",
      "platform": "Platform Name",
      "duration": "X months",
      "level": "Beginner/Intermediate/Advanced",
      "certificate": boolean,
      "free": boolean
    }
  ],
  "colleges": ["College/Institution Name, Location"]
}

Focus on:
- Current and relevant resources
- Mix of free and paid options
- Indian context and accessibility
- Various skill levels
- Recognized institutions`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().replace(/^```json\n/, '').replace(/\n```$/, '').trim();
    const resources = JSON.parse(text);

    // Validate and ensure all required fields exist
    return {
      books: Array.isArray(resources.books) ? resources.books : [],
      courses: Array.isArray(resources.courses) ? resources.courses.map(course => ({
        name: course.name || '',
        platform: course.platform || '',
        duration: course.duration || '',
        level: course.level || 'Beginner',
        certificate: Boolean(course.certificate),
        free: Boolean(course.free)
      })) : [],
      colleges: Array.isArray(resources.colleges) ? resources.colleges : []
    };
  } catch (error) {
    console.warn('Failed to generate resources with Gemini:', error);
    // Return fallback data from CAREER_DATA
    const fallbackResources = CAREER_DATA.find(c => c.title === career.title)?.resources;
    return {
      books: fallbackResources?.books || [],
      courses: fallbackResources?.courses || [],
      colleges: fallbackResources?.colleges || []
    };
  }
}

// Function to get career reviews with fallback options
export async function getCareerReviews(career: Career | string): Promise<UserReview[]> {
  try {
    // Handle string input (backward compatibility with Supabase queries)
    const careerTitle = typeof career === 'string' ? career : career.title;

    // Try Supabase first
    const { data, error } = await supabase
      .from('career_reviews')
      .select('*')
      .eq('career_title', careerTitle);

    if (!error && data && data.length > 0) {
      return data;
    }

    // If career is a string, we can't proceed with AI generation
    if (typeof career === 'string') {
      return USER_REVIEWS.filter(review => review.career === careerTitle);
    }

    // Try Gemini
    try {
      const geminiReviews = await generateReviewsWithGemini(career);
      if (geminiReviews.length > 0) {
        return geminiReviews;
      }
    } catch (error) {
      console.warn('Failed to generate reviews with Gemini:', error);
    }

    // Fallback to static data
    return USER_REVIEWS.filter(review => review.career === careerTitle);
  } catch (error) {
    console.warn('Failed to get career reviews, using fallback data:', error);
    const careerTitle = typeof career === 'string' ? career : career.title;
    return USER_REVIEWS.filter(review => review.career === careerTitle);
  }
}