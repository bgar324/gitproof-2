# GitProof 2

> **A sophisticated developer portfolio platform that transforms your GitHub activity into a shareable, AI-enhanced professional profile.**

[![Next.js](https://img.shields.io/badge/Next.js-16.0-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.22-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

GitProof 2 analyzes your public GitHub repositories, calculates impact metrics, generates AI-powered insights, and creates a beautiful public profile page to showcase your best work to recruiters and collaborators.

---

## 📖 Table of Contents

- [Overview](#overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Architecture](#-architecture)
- [Database Schema](#-database-schema)
- [API & Server Actions](#-api--server-actions)
- [Component System](#-component-system)
- [Impact Score Algorithm](#-impact-score-algorithm)
- [AI Integration](#-ai-integration)
- [Authentication](#-authentication-flow)
- [Security](#-security-features)
- [Configuration](#%EF%B8%8F-configuration)
- [Development](#-development)
- [Deployment](#-deployment)
- [Contributing](#-contributing)

---

## 🎯 Overview

GitProof 2 is a full-stack Next.js application that helps developers:

1. **Authenticate with GitHub** - Secure OAuth integration
2. **Sync repository data** - Fetch public repos, commits, stars, forks
3. **Calculate impact scores** - Smart algorithm (0-50 scale) based on popularity, recency, and maturity
4. **Generate AI insights** - Use Google Gemini to analyze strengths and growth areas
5. **Customize portfolio** - Select featured projects, rewrite descriptions with AI
6. **Share public profiles** - Beautiful, shareable profile pages at `/u/[username]`

**Live Example**: `/u/yourname` shows your curated portfolio to the world.

---

## ✨ Features

### 🔐 GitHub Authentication
- **OAuth 2.0 integration** with GitHub
- **Read-only access** to public repositories (`public_repo` scope)
- **Secure token storage** via Prisma and NextAuth
- **Session persistence** with JWT strategy

### 📊 Repository Analysis Dashboard
- **Contribution heatmap** - GitHub-style activity visualization
- **Hourly activity chart** - Discover your most productive hours
- **Impact scores** - Algorithmic ranking (0-50) for each repository
- **Tech stack breakdown** - Visual percentage bars for languages
- **Top 6 repositories** - Auto-selected by impact score
- **Real-time sync** - Manual refresh button with rate limit handling

### ✏️ Portfolio Editor
- **Featured project selection** - Choose up to 6 projects to showcase
- **AI description rewriting** - Use Gemini to make descriptions recruiter-friendly
- **Bio editor** - Manual or AI-generated professional summary
- **Visibility controls** - Hide/show projects from public profile
- **Live preview** - See changes before publishing
- **Bulk actions** - Save all changes at once

### 🤖 AI-Powered Features
- **Project description rewriting** - Context-aware using README, topics, and stats
- **Bio generation** - Summarizes your top projects into a professional bio
- **Insight analysis** - Detects strengths (consistency, expertise) and growth areas
- **Powered by Gemini 2.5 Flash Lite** - Fast, cost-effective LLM

### 🌐 Public Developer Profiles
- **Shareable URLs** - `/u/[username]` for public access
- **Privacy controls** - Toggle profile visibility on/off
- **Featured projects showcase** - Masonry grid layout
- **Impact metrics display** - Report card with scores
- **Professional presentation** - Clean, modern design with light/dark themes

### 📈 Analytics & Insights
- **Impact Score** - Weighted algorithm combining popularity, recency, maturity
- **Consistency Metric** - Percentage of active days in last year
- **Developer Archetype** - Classification (e.g., "The Architect", "10x Engineer")
- **Growth Recommendations** - AI-generated areas for improvement
- **Top Technologies** - Language and topic analysis

### ⚙️ Settings & Account Management
- **Profile visibility** - Public/private toggle
- **Theme switching** - Light, dark, or system preference
- **Email notifications** - Opt-in for product updates
- **Account deletion** - Complete data removal + GitHub OAuth revocation
- **Session management** - Sign out all devices

---

## 🛠 Tech Stack

### Frontend
- **Next.js 16.0.10** - React framework with App Router
- **React 19.2.1** - UI library with Server Components
- **TypeScript 5** - Type-safe JavaScript
- **Tailwind CSS 4** - Utility-first styling
- **shadcn/ui** - Accessible component library (Radix UI)
- **Framer Motion 12.23.26** - Animation library
- **Lucide React 0.561.0** - Icon system (561+ icons)

### Backend
- **Next.js API Routes** - RESTful endpoints
- **Server Actions** - Type-safe mutations with `"use server"`
- **Prisma 5.22.0** - ORM for PostgreSQL
- **PostgreSQL** - Primary database
- **NextAuth 5.0.0-beta.30** - Authentication

### External APIs
- **GitHub GraphQL API** - Repository and user data
- **GitHub OAuth** - Authentication provider
- **Google Gemini 2.5 Flash Lite** - AI text generation

### Data Visualization
- **Recharts 3.5.1** - React charting library
- **Victory Vendor** - D3 components

### Developer Experience
- **ESLint 9** - Code linting
- **PostCSS** - CSS transformation
- **class-variance-authority** - Component API builder

---

## 🚀 Getting Started

### Prerequisites

- **Node.js 18+** - JavaScript runtime
- **npm/yarn/pnpm** - Package manager
- **PostgreSQL** - Database (local or hosted)
- **GitHub OAuth App** - [Create one here](https://github.com/settings/developers)
- **Google AI API Key** - [Get one here](https://aistudio.google.com/app/apikey)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/bgar324/gitproof-2
   cd gitproof-2
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory:

   ```env
   # Database
   DATABASE_URL="postgresql://user:password@localhost:5432/gitproof"

   # NextAuth
   AUTH_SECRET="generate-with-openssl-rand-base64-32"
   NEXTAUTH_URL="http://localhost:3000"

   # GitHub OAuth
   AUTH_GITHUB_ID="your_github_client_id"
   AUTH_GITHUB_SECRET="your_github_client_secret"

   # Google AI
   GOOGLE_GENERATIVE_AI_API_KEY="your_gemini_api_key"
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open the app**

   Navigate to [http://localhost:3000](http://localhost:3000)

### GitHub OAuth Setup

1. Go to [GitHub Settings > Developer Settings > OAuth Apps](https://github.com/settings/developers)
2. Click **New OAuth App**
3. Fill in:
   - **Application name**: GitProof 2
   - **Homepage URL**: `http://localhost:3000`
   - **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`
4. Click **Register application**
5. Copy **Client ID** and **Client Secret** to `.env.local`

---

## 📁 Project Structure

```
gitproof-2/
├── app/                          # Next.js App Router
│   ├── (app)/                   # Protected routes (auth required)
│   │   ├── dashboard/           # Analytics & overview
│   │   ├── editor/              # Portfolio editor
│   │   ├── settings/            # Account settings
│   │   └── layout.tsx           # App-wide navbar
│   ├── (marketing)/             # Public marketing pages
│   ├── api/                     # API routes
│   │   ├── auth/                # NextAuth handlers
│   │   └── sync/                # Data sync endpoint
│   ├── u/[username]/            # Public profile pages
│   ├── manifesto/               # Info pages
│   ├── methodology/
│   ├── privacy/
│   ├── actions.ts               # Server actions
│   ├── layout.tsx               # Root layout
│   └── globals.css              # Global styles
├── components/                  # React components
│   ├── ui/                      # shadcn/ui primitives
│   ├── dashboard/               # Dashboard components
│   ├── editor/                  # Editor components
│   ├── profile/                 # Profile components
│   ├── marketing/               # Landing page sections
│   ├── layout/                  # Navbar, footer, wrappers
│   ├── settings/                # Settings sections
│   ├── shared/                  # Reusable utilities
│   ├── report-card.tsx          # Main report card
│   └── repo-modal.tsx           # Repository modal
├── lib/                         # Utilities & business logic
│   ├── github.ts               # GitHub GraphQL client
│   ├── sync.ts                 # Repository sync logic
│   ├── stats.ts                # Analytics calculations
│   ├── rate-limit.ts           # GitHub API rate limiting
│   ├── sanitize.ts             # Data sanitization
│   ├── utils.ts                # Helper functions
│   ├── language-colors.ts      # Language colors
│   ├── db.ts                   # Prisma client
│   └── data/                   # Static data
├── prisma/
│   └── schema.prisma           # Database schema
├── types/
│   └── next-auth.d.ts          # NextAuth types
├── auth.ts                      # NextAuth config
├── middleware.ts                # Route protection
├── next.config.ts              # Next.js config
├── tailwind.config.ts          # Tailwind config
└── package.json                # Dependencies
```

---

## 🏗 Architecture

### App Router Flow

```
Public Routes (no authentication)
├── /                          → Landing page
├── /methodology               → How it works
├── /privacy                   → Privacy policy
├── /manifesto                 → Mission statement
├── /u/[username]              → Public profile (if isPublic = true)
└── /api/auth/*                → NextAuth OAuth callbacks

Protected Routes (requires authentication)
├── /dashboard                 → Analytics overview
├── /dashboard/repos           → All repositories
├── /editor                    → Portfolio editor
├── /settings                  → Account settings
└── /api/sync                  → Data sync endpoint
```

### Data Flow

```
GitHub OAuth → NextAuth → Prisma → PostgreSQL
                   ↓
              User Session
                   ↓
         Authenticated Routes
                   ↓
    Server Components (DB queries)
                   ↓
    Client Components (interactivity)
                   ↓
         Server Actions (mutations)
                   ↓
              Database Updates
```

### Server vs Client Components

- **Server Components** (default): Fetch data, render on server
  - `app/(app)/dashboard/page.tsx`
  - `app/u/[username]/page.tsx`

- **Client Components** (`"use client"`): Interactive UI
  - `app/(app)/dashboard/view.tsx`
  - `components/dashboard/*`
  - `components/editor/*`

---

## 💾 Database Schema

### User Model
```prisma
model User {
  id                  String    @id @default(cuid())
  email               String    @unique
  username            String    @unique
  name                String?
  image               String?
  bio                 String?
  isPublic            Boolean   @default(false)
  emailNotifications  Boolean   @default(false)
  lastSyncedAt        DateTime?
  profileData         Json?     // Cached GitHub data
  createdAt           DateTime  @default(now())
  updatedAt           DateTime  @updatedAt

  accounts            Account[]
  sessions            Session[]
  projects            Project[]
}
```

### Project Model
```prisma
model Project {
  id              String   @id @default(cuid())
  userId          String
  githubId        Int
  name            String
  desc            String?
  url             String
  homepage        String?
  language        String?
  topics          String[]
  stars           Int      @default(0)
  forks           Int      @default(0)
  lastPush        DateTime
  impactScore     Int      @default(0)  // 0-50
  readme          String?
  aiDescription   String?
  isHidden        Boolean  @default(false)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([impactScore])
  @@index([lastPush])
}
```

### Account & Session Models (NextAuth)
```prisma
model Account {
  id                  String  @id @default(cuid())
  userId              String
  provider            String  // "github"
  providerAccountId   String
  access_token        String? // GitHub OAuth token
  // ... other OAuth fields
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
}
```

---

## 🔌 API & Server Actions

### REST Endpoints

#### `POST /api/sync`
Sync GitHub data to database

**Auth**: Required

**Request**:
```json
{
  "heatmap": [{ "date": "2025-01-01", "count": 5 }],
  "totalContributions": 1042,
  "pullRequests": 156,
  "repoCount": 42,
  "streak": 12,
  "topRepos": [...],
  "topLanguages": [...],
  "hourlyActivity": [...]
}
```

**Response**:
```json
{
  "success": true,
  "user": { "id": "...", "username": "...", ... }
}
```

### Server Actions

Located in `app/actions.ts`:

| Action | Description |
|--------|-------------|
| `triggerSync()` | Force sync GitHub repos |
| `generateAIDescription(projectId)` | Generate AI description |
| `toggleProfilePublic(isPublic)` | Toggle profile visibility |
| `updateUserBio(bio)` | Save user bio |
| `generateUserBio()` | AI generate bio |
| `batchUpdateProjectVisibility()` | Bulk update visibility |
| `updateProjectDescription()` | Edit project desc |
| `deleteUserAccount()` | Delete account + revoke OAuth |

---

## 🧩 Component System

### Component Categories

#### Dashboard Components (`components/dashboard/`)
- `activity-heatmap` - Contribution calendar
- `dashboard-header` - Top stats header
- `dashboard-repo-card` - Repository card
- `focus-hours-card` - Hourly activity chart
- `impact-tooltip` - Score explanation
- `score-modal` - Algorithm breakdown
- `stat-card` - Metric display
- `tech-stack-card` - Language bars
- `time-range-selector` - Filter controls
- `top-repos-header` - Section header

#### Editor Components (`components/editor/`)
- `editor-repo-card` - Editable repo card
- `featured-section` - Featured projects manager
- `identity-section` - Bio editor
- `library-section` - All projects grid
- `save-button` - Save changes button

#### Profile Components (`components/profile/`)
- `hero-section` - Profile header
- `portfolio-section` - Projects display
- `public-repo-card` - Public repo card

#### UI Primitives (`components/ui/`)
shadcn/ui components: badge, button, card, dialog, dropdown-menu, input, label, separator, skeleton, switch, tabs, textarea, tooltip

---

## 📊 Impact Score Algorithm

The **Impact Score** (0-50) combines three weighted components:

### Formula
```
Score = min(round(Popularity + Recency + Maturity), 50)
```

### 1. Popularity (0-40 points, ~40-45%)
Logarithmic scale with increased multiplier to better reward popular projects:

```javascript
Popularity = log₂(stars + forks × 2 + 1) × 4.5
Popularity = min(Popularity, 40)
```

**Examples**:
- 100 stars, 10 forks → ~30 points
- 1,000 stars, 100 forks → ~45 points (capped at 40)
- 10,000 stars, 1,000 forks → ~60 points (capped at 40)

### 2. Recency (0-15 points, ~25-30%)
Graceful decay that rewards maintained projects, not just recently pushed:

```
< 7 days ago:    +15 points (S-tier: Last week)
< 30 days ago:   +12 points (A-tier: Last month)
< 90 days ago:   +8 points  (B-tier: Last quarter)
< 180 days ago:  +5 points  (C-tier: Last 6 months)
< 365 days ago:  +2 points  (D-tier: Last year)
else:            +0 points  (Abandoned)
```

### 3. Maturity (0-15 points, ~25-30%)
Multi-factor assessment of project quality:

```
Description:
  > 100 chars:  +5 points (Detailed)
  > 20 chars:   +3 points (Basic)

README:
  > 2000 chars: +5 points (Comprehensive)
  > 500 chars:  +3 points (Good)
  > 100 chars:  +1 point  (Minimal)

Homepage:       +3 points

Topics:
  ≥ 3 tags:     +3 points (Well-tagged)
  ≥ 1 tag:      +1 point  (Basic)
```

**Max**: 15 points from maturity (capped)

### User Score Aggregation
Instead of a simple average, we use a **weighted average of top 6 projects**:
```
UserScore = top1×50% + top2×12.5% + top3×12.5% + top4×8.33% + top5×8.33% + top6×8.33%
```
This emphasizes quality over quantity - your best project carries 50% of the weight.

### Example

**Repository**: "awesome-react-hooks"
- Stars: 250, Forks: 30
- Last Push: 10 days ago
- Description: "Production-ready React hooks library"
- Homepage: https://awesome-hooks.dev
- Topics: `['react', 'hooks', 'typescript']`
- README: 1,500 chars

**Calculation**:
```
Popularity = log₂(250 + 30×2 + 1) × 4.5 = 37 points (was ~25 with old formula)
Recency = 12 points (< 30 days, A-tier)
Maturity:
  - Description (42 chars): +3
  - README (1500 chars): +3
  - Homepage: +3
  - Topics (3 tags): +3
  = 12 points
Total = 37 + 12 + 12 = 50 points (capped) ✨
```

---

## 🤖 AI Integration

### Google Gemini 2.5 Flash Lite

Used for:
1. Project description rewriting
2. User bio generation
3. Insight analysis

### Configuration

```env
GOOGLE_GENERATIVE_AI_API_KEY="your_api_key"
```

### Prompt Examples

#### Project Description
```
You are a professional technical recruiter. Rewrite this GitHub
project description to be compelling for recruiters.

Project: awesome-api
Description: REST API with Node.js
Topics: nodejs, express, postgresql
README: Built a scalable REST API...

Make it:
- 1-2 sentences max
- Highlight technical skills
- Emphasize impact/value
- Professional tone
- No emojis
```

**Output**:
```
Built a high-performance REST API using Node.js and PostgreSQL,
serving 10K+ daily requests with 99.9% uptime. Implemented JWT
authentication, caching strategies, and comprehensive API docs.
```

### AI Safety

All AI content is sanitized:

```typescript
// lib/sanitize.ts
export function sanitizeForPostgres(input: string | null): string {
  return input
    ?.replace(/\0/g, '') // Remove null bytes
    .replace(/[\x00-\x1F\x7F-\x9F]/g, (char) =>
      ['\n', '\t', '\r'].includes(char) ? char : ''
    ) || '';
}
```

---

## 🔐 Authentication Flow

### Step-by-Step

1. **User clicks "Sign in with GitHub"**
   ```typescript
   <button onClick={() => signIn("github")}>
     Sign in with GitHub
   </button>
   ```

2. **GitHub OAuth prompts authorization**
   - Scopes: `read:user`, `user:email`, `public_repo`

3. **GitHub redirects with code**
   ```
   /api/auth/callback/github?code=ABC123
   ```

4. **NextAuth exchanges code for token**
   - Stores access token in `Account` table
   - Creates/updates `User` record
   - Issues JWT session

5. **Middleware protects routes**
   ```typescript
   // middleware.ts
   if (protectedPath && !session) {
     redirect('/');
   }
   ```

6. **Session available in components**
   ```typescript
   const session = await auth();
   console.log(session.user.username);
   ```

### Session Structure

```typescript
{
  user: {
    email: "user@example.com",
    name: "John Doe",
    image: "https://avatars.githubusercontent.com/...",
    username: "johndoe"
  },
  expires: "2025-01-18T12:00:00.000Z"
}
```

---

## 🔒 Security Features

### 1. Data Sanitization
All inputs sanitized before storage:
- Remove null bytes (PostgreSQL errors)
- Strip control characters
- Keep safe whitespace (`\n`, `\t`, `\r`)

### 2. Access Control
- Server-side session checks
- Database queries filtered by `userId`
- No cross-user data access

### 3. OAuth Token Security
- Tokens stored server-side only (Prisma)
- Never exposed to client
- Read-only scope (`public_repo`)
- Revoked on account deletion

### 4. Route Protection
Middleware enforces auth:
```typescript
const protectedRoutes = ['/dashboard', '/editor', '/settings'];
if (protectedPath && !session) redirect('/');
```

### 5. Rate Limiting
GitHub API rate limit handling:
- In-memory cache per user
- Exponential backoff
- Custom error handling

### 6. SQL Injection Prevention
Prisma ORM provides parameterized queries:
```typescript
// Safe - auto-escaped
await db.user.findUnique({
  where: { email: userInput }
});
```

---

## ⚙️ Configuration

### Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/gitproof"

# NextAuth
AUTH_SECRET="openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"

# GitHub OAuth
AUTH_GITHUB_ID="github_client_id"
AUTH_GITHUB_SECRET="github_client_secret"

# Google AI
GOOGLE_GENERATIVE_AI_API_KEY="gemini_api_key"
```

### Next.js Config

```typescript
// next.config.ts
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "github.com",
      },
    ],
  },
};
```

---

## 💻 Development

### Scripts

```bash
# Development server (hot reload)
npm run dev

# Production build
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Prisma commands
npx prisma generate       # Generate client
npx prisma db push        # Push schema to DB
npx prisma studio         # Open GUI
```

### Code Style

- **ESLint**: Next.js recommended config
- **TypeScript**: Strict mode enabled
- **Naming**: kebab-case for components

### Component Patterns

**Server Component**:
```typescript
// app/dashboard/page.tsx
export default async function DashboardPage() {
  const session = await auth();
  const user = await db.user.findUnique({
    where: { email: session.user.email },
  });
  return <DashboardView data={user} />;
}
```

**Client Component**:
```typescript
// components/dashboard/view.tsx
"use client";

export function DashboardView({ data }) {
  const [filter, setFilter] = useState("all");
  return <div>{/* ... */}</div>;
}
```

**Server Action**:
```typescript
// app/actions.ts
"use server";

export async function updateBio(bio: string) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  await db.user.update({
    where: { email: session.user.email },
    data: { bio },
  });
}
```

---

## 🚀 Deployment

### Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import repository

3. **Set environment variables**
   ```
   DATABASE_URL
   AUTH_SECRET
   NEXTAUTH_URL
   AUTH_GITHUB_ID
   AUTH_GITHUB_SECRET
   GOOGLE_GENERATIVE_AI_API_KEY
   ```

4. **Deploy**
   - Auto-deploys on push to `main`

### Database Options

- **Vercel Postgres**: `vercel postgres create`
- **Supabase**: [supabase.com](https://supabase.com)
- **Railway**: [railway.app](https://railway.app)

### Post-Deployment

- [ ] Environment variables set
- [ ] Database connected
- [ ] Prisma schema pushed
- [ ] GitHub OAuth callback URL updated
- [ ] Test authentication
- [ ] Monitor logs

---

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. Commit changes
   ```bash
   git commit -m "Add amazing feature"
   ```
4. Push to branch
   ```bash
   git push origin feature/amazing-feature
   ```
5. Open a Pull Request

### Guidelines

- Follow TypeScript/ESLint rules
- Use kebab-case for files
- Add tests if applicable
- Update documentation

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file

---

## 🙏 Acknowledgments

- **Next.js** - React framework
- **Vercel** - Hosting platform
- **shadcn/ui** - Component library
- **Prisma** - Database ORM
- **GitHub** - OAuth & data source
- **Google Gemini** - AI generation

---

## 📚 Additional Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [NextAuth Docs](https://next-auth.js.org)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [shadcn/ui Docs](https://ui.shadcn.com)

---

**Built with ❤️ by the GitProof team**

*Transform your GitHub activity into a portfolio that gets you hired.*
