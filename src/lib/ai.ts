// Client side of the AI features. The browser never talks to Gemini directly: it calls the app's own
// endpoint /api/career-ai (served by vite.config.ts locally and by a Netlify Function in production),
// which holds the API key and validates everything (see server/careerAi.ts).
import { Career, CareerResources, UserProfile, UserReview } from '../types';
import { USER_REVIEWS } from '../data/reviews';
import { CAREER_DATA } from '../data/careers';

const ENDPOINT = '/api/career-ai';
const TIMEOUT_MS = 70_000;
export const MAX_RESUME_BYTES = 2 * 1024 * 1024;

async function callCareerAi<T>(payload: unknown): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    const data = await response.json().catch(() => null);
    if (!response.ok) {
      throw new Error(data?.error ?? `The AI service answered with status ${response.status}. Please try again.`);
    }
    return data as T;
  } catch (error) {
    if ((error as Error).name === 'AbortError') throw new Error('The AI service took too long to answer. Please try again.');
    if (error instanceof TypeError) throw new Error('Could not reach the FutureFit server. Check your internet connection.');
    throw error;
  } finally {
    clearTimeout(timer);
  }
}

// Built-in examples are used when the AI did not supply reviews or resources for a career.
function withFallbacks(career: Career): Career {
  const known = CAREER_DATA.find((c) => c.title.toLowerCase() === career.title.toLowerCase());
  const resources =
    career.resources.books.length || career.resources.courses.length || career.resources.colleges.length
      ? career.resources
      : known?.resources ?? career.resources;
  const reviews = career.reviews?.length ? career.reviews : USER_REVIEWS.filter((r) => r.career.toLowerCase() === career.title.toLowerCase());
  return { ...career, resources, reviews };
}

type Details = { title: string; reviews: UserReview[]; resources: CareerResources };

// Two requests: the recommendations, then reviews and learning resources for all of them.
// If the second request fails, the careers are still shown, with the built-in examples where available.
export async function generateCareerRecommendations(profile: UserProfile): Promise<Career[]> {
  const { careers } = await callCareerAi<{ careers: Career[] }>({ task: 'recommendations', profile });
  if (!Array.isArray(careers) || careers.length === 0) {
    throw new Error('The AI did not return any career recommendations. Please try again.');
  }
  let details: Details[] = [];
  try {
    ({ details } = await callCareerAi<{ details: Details[] }>({ task: 'details', titles: careers.map((c) => c.title) }));
  } catch (error) {
    console.warn('Reviews and resources could not be generated:', error);
  }
  return careers.map((career) => {
    const extra = details.find((d) => d.title === career.title);
    return withFallbacks(extra ? { ...career, reviews: extra.reviews, resources: extra.resources } : career);
  });
}

function readAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(',')[1] ?? '');
    reader.onerror = () => reject(new Error('The file could not be read.'));
    reader.readAsDataURL(file);
  });
}

export function resumeKind(file: File): 'pdf' | 'text' | null {
  const name = file.name.toLowerCase();
  if (file.type === 'application/pdf' || name.endsWith('.pdf')) return 'pdf';
  if (file.type.startsWith('text/') || name.endsWith('.txt') || name.endsWith('.md')) return 'text';
  return null;
}

// PDFs are sent as documents (Gemini reads them natively); text files are sent as text.
export async function extractSkillsFromResume(file: File): Promise<string[]> {
  const kind = resumeKind(file);
  if (!kind) throw new Error('Please upload a PDF or a plain-text (.txt) resume.');
  if (file.size > MAX_RESUME_BYTES) throw new Error('The resume is larger than 2 MB.');
  const resume =
    kind === 'pdf'
      ? { mimeType: 'application/pdf', data: await readAsBase64(file) }
      : { mimeType: 'text/plain', text: await file.text() };
  const { skills } = await callCareerAi<{ skills: string[] }>({ task: 'resume-skills', resume });
  return Array.isArray(skills) ? skills : [];
}
