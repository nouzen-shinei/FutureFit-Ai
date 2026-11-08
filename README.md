# FutureFit AI

**Degrees to Destiny.** An AI career path advisor for the Indian job market.

Enter your age, education, skills, interests and hobbies (or upload a PDF or text resume) and
FutureFit AI suggests careers, compares them side by side and lists reviews and learning resources.
Suggestions come from Google Gemini; the app falls back to built-in examples when the AI is
unavailable. See [`project-report.md`](project-report.md) for the full feature overview.

## Features

- **Profile builder:** age slider with life-phase labels, education level and stream, up to 15
  skills with proficiency levels, interests and hobbies, with auto-complete. The profile is saved
  in the browser after every change.
- **Resume import:** extracts skills from a PDF or plain-text resume.
- **Career recommendations:** high-potential, emerging and at-risk careers with salary ranges,
  market demand, automation risk, required skills, exams and timelines.
- **Analysis and comparison:** demand trends, radar and salary charts, reviews, learning
  resources and job listings.

## Tech stack

| Area | Tools |
| --- | --- |
| Frontend | React 18, TypeScript 5.9, Tailwind CSS 3, Framer Motion, Recharts, Lucide icons |
| Build | Vite 8, ESLint 9 (typescript-eslint, react-hooks), PostCSS, Autoprefixer |
| AI | Google Gemini REST API (`gemini-2.5-flash`, JSON output), called only from the server |
| Hosting | Netlify (static site + Netlify Function) |

## Getting started

Requirements: Node.js 20.19+ or 22.12+ (`.nvmrc` pins 22) and a
[Gemini API key](https://aistudio.google.com/app/apikey).

```bash
npm install
cp .env.example .env      # then put your Gemini key in GEMINI_API_KEY
npm run dev               # http://localhost:5173
```

### Environment variables

| Variable | Required | Description |
| --- | --- | --- |
| `GEMINI_API_KEY` | yes | Google Gemini API key, read on the server only |
| `GEMINI_MODEL` | no | Model name, default `gemini-2.5-flash` |
| `GEMINI_API_BASE` | no | API base URL, default `https://generativelanguage.googleapis.com` |

The browser never sees the API key. It calls the app's own endpoint `POST /api/career-ai`, which
`vite.config.ts` serves during `npm run dev` and `npm run preview`, and which uses `GEMINI_API_KEY`
on the server. Do not rename the variable to `VITE_GEMINI_API_KEY`: Vite would then copy the key into
the JavaScript that every visitor downloads.

## Scripts

```bash
npm run dev         # local dev server with the API endpoint
npm run typecheck   # tsc -b
npm run lint        # ESLint 9, no warnings allowed
npm run build       # type check + production build into dist/
npm run preview     # serve dist/ with the API endpoint
```

## API

`POST /api/career-ai` takes a JSON body with a `task` field:

| `task` | Other fields | Response |
| --- | --- | --- |
| `recommendations` | `profile` | `{ careers }` |
| `details` | `titles` (career titles) | `{ details }` (reviews and learning resources) |
| `resume-skills` | `resume` (`text/plain` text or base64 `application/pdf`) | `{ skills }` |

Errors return `{ error }` with a matching HTTP status. Request bodies are limited to 4 MB.

## Project structure

```
├── index.html
├── public/                  icons and web app manifest
├── server/careerAi.ts       server-side AI logic: validation, prompts, Gemini call, parsing
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
└── supabase/migrations/     earlier database schema (not used by the app)
```

## Deploy (Netlify)

`netlify.toml` builds the site with `npm run build`, publishes `dist/`, deploys
`netlify/functions/career-ai.mts` (which answers `/api/career-ai`) and sets cache and security
headers. Netlify picks the Node.js version from `.nvmrc`.

1. In the Netlify dashboard, choose **Add new project > Import an existing project > GitHub**.
2. Authorize Netlify and select this repository. If it is not listed, use the link to configure the
   Netlify app on GitHub and give it access to the repository.
3. Keep the build settings that Netlify reads from `netlify.toml` (branch `main`, build command
   `npm run build`, publish directory `dist`).
4. Add the environment variable `GEMINI_API_KEY` with the **Functions** scope (optionally also
   `GEMINI_MODEL`). You can do this on the import page or later under
   **Project configuration > Environment variables**.
5. Deploy. Every push to `main` then redeploys the site. After changing an environment variable,
   trigger a new deploy so the function picks it up.

If an older build of this app was ever published, its JavaScript contained the Gemini key. Create a
new key in Google AI Studio and delete the old one.

## License

[MIT](LICENSE) © 2026 Vikrant Kumar
