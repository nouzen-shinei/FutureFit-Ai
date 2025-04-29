import OpenAI from 'openai';
import { Career, UserReview, NewsItem, CareerResources } from '../types';
import { USER_REVIEWS } from '../data/reviews';
import { CAREER_NEWS } from '../data/news';
import { CAREER_DATA } from '../data/careers';

// Helper function to extract JSON from text
function extractJsonFromText(text: string): any {
  try {
    // First try direct parsing
    return JSON.parse(text);
  } catch (e) {
    try {
      // Look for JSON array
      const match = text.match(/\[[\s\S]*\]/);
      if (match) {
        return JSON.parse(match[0]);
      }
      
      // Look for JSON object
      const objMatch = text.match(/\{[\s\S]*\}/);
      if (objMatch) {
        return JSON.parse(objMatch[0]);
      }
    } catch (e) {
      console.warn('Failed to extract JSON from text:', e);
    }
    return null;
  }
}

const client = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: import.meta.env.VITE_OPENROUTER_API_KEY,
  dangerouslyAllowBrowser: true,
  defaultHeaders: {
    'HTTP-Referer': window.location.origin,
    'X-Title': 'FutureFit AI'
  }
});

// Using GPT-3.5-turbo for more reliable JSON responses
const MODEL = 'openai/gpt-3.5-turbo';

async function generateReviewsWithAI(career: Career): Promise<UserReview[]> {
  const prompt = `Generate 3 detailed user reviews for the career "${career.title}" in the Indian job market. Each review should include:

1. A realistic Indian name for the author
2. Age between 25-40 years
3. Experience in years (2-10)
4. A detailed personal review about working in this field in India (2-3 sentences)
5. Rating between 1-5
6. 4-5 specific pros about working in this field in India
7. 3-4 specific cons about working in this field in India

Return the response in this exact JSON format:
{
  "reviews": [
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
}

Focus on authentic Indian experiences and current market conditions.`;

  const response = await client.chat.completions.create({
    model: MODEL,
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: "json_object" },
    temperature: 0.8
  });

  const content = response.choices[0].message.content || '[]';
  const data = extractJsonFromText(content);
  return data?.reviews || [];
}

export async function generateCareerReviews(career: Career): Promise<UserReview[]> {
  try {
    if (!import.meta.env.VITE_OPENROUTER_API_KEY) {
      return USER_REVIEWS.filter(review => review.career === career.title);
    }
    const aiReviews = await generateReviewsWithAI(career);
    return aiReviews.length > 0 ? aiReviews : USER_REVIEWS.filter(review => review.career === career.title);
  } catch (error) {
    console.warn('Failed to generate reviews, using fallback data:', error);
    return USER_REVIEWS.filter(review => review.career === career.title);
  }
}

async function generateNewsWithAI(career: Career): Promise<NewsItem[]> {
  const prompt = `Generate 5 recent job postings and news items for the career "${career.title}" in India. Include:

1. 2-3 job postings from major Indian companies with salary ranges in INR
2. 1-2 industry news items relevant to Indian market
3. 1 upcoming event or conference in India
4. Use major Indian tech hubs for locations
5. Use recent dates in 2024

Return the response in this exact JSON format:
{
  "news": [
    {
      "id": 1,
      "title": "Example Job Title",
      "company": "Example Company",
      "location": "City, India",
      "date": "2024-03-25",
      "url": "#",
      "description": "Example description",
      "salary": "₹XX-YY LPA",
      "type": "job"
    }
  ]
}

Ensure all dates are in YYYY-MM-DD format and all salaries use ₹ symbol with LPA units.`;

  const response = await client.chat.completions.create({
    model: MODEL,
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: "json_object" },
    temperature: 0.8
  });

  const content = response.choices[0].message.content || '[]';
  const data = extractJsonFromText(content);
  return data?.news || [];
}

export async function generateJobNews(career: Career): Promise<NewsItem[]> {
  try {
    if (!import.meta.env.VITE_OPENROUTER_API_KEY) {
      return CAREER_NEWS.filter(news => news.company.toLowerCase().includes(career.title.toLowerCase()));
    }
    const aiNews = await generateNewsWithAI(career);
    return aiNews.length > 0 ? aiNews : CAREER_NEWS.filter(news => news.company.toLowerCase().includes(career.title.toLowerCase()));
  } catch (error) {
    console.warn('Failed to generate news, using fallback data:', error);
    return CAREER_NEWS.filter(news => news.company.toLowerCase().includes(career.title.toLowerCase()));
  }
}

async function generateResourcesWithAI(career: Career): Promise<CareerResources> {
  const prompt = `Generate comprehensive learning resources for the career "${career.title}" specific to India. Include:

Return the response in this exact JSON format:
{
  "resources": {
    "books": ["Book 1", "Book 2"],
    "courses": [
      {
        "name": "Course Name",
        "platform": "Platform Name",
        "duration": "X months",
        "level": "Beginner",
        "certificate": true,
        "free": false
      }
    ],
    "colleges": ["College 1", "College 2"]
  }
}

Include only resources available and recognized in India.`;

  const response = await client.chat.completions.create({
    model: MODEL,
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: "json_object" },
    temperature: 0.8
  });

  const content = response.choices[0].message.content || '[]';
  const data = extractJsonFromText(content);
  return data?.resources || { books: [], courses: [], colleges: [] };
}

export async function generateLearningResources(career: Career): Promise<CareerResources> {
  try {
    if (!import.meta.env.VITE_OPENROUTER_API_KEY) {
      return CAREER_DATA.find(c => c.title === career.title)?.resources || { books: [], courses: [], colleges: [] };
    }
    const aiResources = await generateResourcesWithAI(career);
    return aiResources || CAREER_DATA.find(c => c.title === career.title)?.resources || { books: [], courses: [], colleges: [] };
  } catch (error) {
    return CAREER_DATA.find(c => c.title === career.title)?.resources || { books: [], courses: [], colleges: [] };
  }
}