# FutureFit AI - Your Personal AI-Powered Career Path Advisor

## Project Overview
**Tagline:** "Degrees to Destiny"

FutureFit AI is an innovative web application that helps users navigate their career paths by providing personalized career recommendations based on their skills, interests, education, and market trends. The platform leverages artificial intelligence to analyze user profiles and generate detailed career insights tailored to the Indian job market.

## Core Features

### 1. User Profile Creation
- **Age Analysis**
  - Dynamic age slider (13-65 years)
  - Life phase categorization:
    - Early Learning Phase (≤19)
    - Early Career Phase (20-29)
    - Career Growth Phase (30-50)
    - Career Mastery Phase (>50)

- **Education Details**
  - Multiple education levels:
    - School (9th-12th)
    - Diploma Programs
    - Associate Degrees
    - Undergraduate Degrees
    - Postgraduate Degrees
    - Doctorate Programs
  - Comprehensive stream/branch options
  - Education status tracking

- **Skills Management**
  - Up to 15 skills per profile
  - Skill categorization:
    - Technical Skills
    - Design Skills
    - Business Skills
    - Soft Skills
  - Proficiency levels:
    - Basic
    - Intermediate
    - Advanced
    - Expert
  - Auto-completion and suggestions
  - Resume parsing for skill extraction (PDF or plain text)

- **Interests & Hobbies**
  - Primary/secondary interest classification
  - Categorized hobbies:
    - Creative
    - Physical
    - Intellectual
  - Custom hobby addition with emoji support
  - Predefined suggestions

### 2. Career Recommendations
- **Career Types**
  - 💎 High-potential careers
  - 🌱 Emerging opportunities
  - ⚠️ At-risk professions

- **Detailed Career Information**
  - Salary ranges (Entry, Average, Senior)
  - Market demand scores
  - AI automation risk assessment
  - Job satisfaction ratings
  - Required skills and qualifications
  - Timeline and investment details
  - Growth potential (CAGR)
  - Required examinations
  - Prerequisites

### 3. Analysis & Comparison
- **Market Analysis**
  - Historical demand trends
  - Supply-demand dynamics
  - Growth projections
  - Industry insights

- **Career Comparison**
  - Side-by-side comparison
  - Radar charts for multiple metrics
  - Salary progression analysis
  - Skill requirement comparison

- **Detailed Insights**
  - User reviews and experiences
  - Notable professionals
  - Learning resources
  - Job opportunities
  - Industry news

## Technical Implementation

### Frontend Technologies
- **Core Framework:** React with TypeScript
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Charts:** Recharts
- **Loading States:** React Loading Skeleton

### Backend Services
- **AI endpoint:** `POST /api/career-ai`
  - Served by a Vite plugin during `npm run dev` / `npm run preview` (`vite.config.ts`)
  - Served by a Netlify Function in production (`netlify/functions/career-ai.mts`)
  - Shared logic in `server/careerAi.ts`: input validation, prompts, Gemini call, reply parsing
  - The Gemini key (`GEMINI_API_KEY`) stays on the server and is never sent to the browser

- **AI Integration:**
  - Google Gemini (`gemini-3.5-flash-lite`, JSON output mode) through its REST API
  - Tasks: career recommendations, reviews and learning resources, resume skill extraction (PDF or text)

- **Database:** none at present. `supabase/migrations/` contains an earlier schema for market data,
  reviews and job news; the app does not read from it, and the Supabase project it was written for no
  longer exists.

### Key Technical Features
- Responsive design
- Mobile-optimized interactions
- Profile saved in the browser after every change
- Real-time form validation
- Smooth transitions and animations
- Auto-complete with keyboard navigation
- Local storage persistence
- Error handling and recovery

## Database Schema (not in use)

`supabase/migrations/20250403193331_calm_river.sql` describes three read-only tables
(`market_demand`, `career_reviews`, `job_news`). They are kept for a possible future version; the
current app generates this data with Gemini and uses built-in examples as a fallback.

## Future Scope

### Planned Features
1. **Enhanced AI Integration**
   - Personalized learning paths
   - Skill gap analysis
   - Career transition recommendations

2. **Community Features**
   - Mentor connections
   - Peer networking
   - Success stories

3. **Learning Integration**
   - Course recommendations
   - Certification tracking
   - Learning progress monitoring

4. **Market Intelligence**
   - Salary negotiation insights
   - Company-specific trends
   - Regional market analysis

5. **Profile Enhancements**
   - Portfolio integration
   - Achievement tracking
   - Skill endorsements

6. **Mobile Application**
   - Native mobile apps
   - Offline capabilities
   - Push notifications

### Potential Updates
1. **Advanced Analytics**
   - Predictive career modeling
   - Success probability scores
   - Custom metrics tracking

2. **Interactive Features**
   - Virtual career counseling
   - Mock interviews
   - Skill assessments

3. **Integration Possibilities**
   - Job portal connections
   - LinkedIn integration
   - Educational platform partnerships

## Development Tools

### Core Technologies
- Vite 8 (build tool and local server)
- TypeScript 5.9
- React 18
- Tailwind CSS 3
- Google Gemini API (server side)

### Development Environment
- ESLint 9 with typescript-eslint and react-hooks rules
- PostCSS
- Autoprefixer

### Version Control
- Git
- GitHub

### Deployment
- Netlify

## Project Structure
```
FutureFit/
├── index.html
├── public/                  icons and web app manifest
├── server/careerAi.ts       server-side AI logic (shared)
├── netlify/functions/       production endpoint /api/career-ai
├── netlify.toml
├── vite.config.ts           dev/preview endpoint /api/career-ai
├── src/
│   ├── App1.tsx             profile form, navigation, page switching
│   ├── components/          AnalysisPage, AutoComplete, CareerNode, CareersPage,
│   │                        ErrorState, GenerateButton, LoadingState, Logo
│   ├── data/                built-in example careers, reviews and listings
│   ├── lib/ai.ts            client calls to /api/career-ai
│   └── types.ts
└── supabase/migrations/     earlier database schema (not used)
```

## Conclusion
FutureFit AI represents a comprehensive solution for career guidance, leveraging modern technologies and AI capabilities to provide personalized career recommendations. The project's modular architecture and extensive feature set provide a solid foundation for future enhancements and scaling.