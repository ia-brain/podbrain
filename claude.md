# PodBrain - Podcast CMS & Live Assistant

## Project Overview
A comprehensive podcast content management system with guest CRM, subscriber management, sponsor analytics, and AI-powered content creation.

**Target User**: Podcast hosts and producers  
**Primary Goal**: Streamline podcast production and maximize sponsor ROI

---

## Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **UI Library**: React 18
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Components**: shadcn/ui (as needed)

### Backend
- **API**: Next.js API Routes (serverless)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth + Google OAuth
- **Storage**: Supabase Storage
- **AI**: OpenAI API (GPT-4)

### Integrations
- **Payments**: Stripe
- **YouTube**: YouTube Data API v3
- **Spotify**: Spotify Web API (future)

### Deployment
- **Hosting**: Vercel
- **Domain**: TBD
- **Environment**: Production + Staging

---

## Core Features (MVP)

### 1. Authentication
- Google OAuth via Supabase
- User roles: Admin, Premium Subscriber, Free User
- Protected admin routes

### 2. Episode Management
- CRUD operations for episodes
- YouTube embed integration
- Timestamps and highlights
- Premium content gating
- Episode-guest relationships

### 3. Guest CRM
- Guest profiles (basic info)
- Communication style notes
- Topics of interest
- Appearance history
- Performance tracking

### 4. Sponsor Management
- Sponsor profiles
- Ad placements (banner, video, pause screen)
- Performance analytics
- Geolocation targeting (future)
- Automated reports

### 5. User Features
- Subscription tiers (Free/Premium)
- Favorites and collections
- Personal notes on episodes
- Download premium content

### 6. Admin Dashboard
- Episode statistics
- Guest analytics
- Sponsor performance
- User metrics

---

## Database Schema (Simplified)

### Core Tables
- `users` - User accounts and subscriptions
- `episodes` - Podcast episodes
- `guests` - Guest profiles and CRM data
- `episode_guests` - Many-to-many relationship
- `sponsors` - Sponsor information
- `episode_sponsors` - Sponsor placements
- `premium_content` - Exclusive subscriber content
- `user_favorites` - User saved items
- `analytics` - Performance metrics

---

## Development Phases

### Phase 1: Foundation (Current)
- [ ] Project setup
- [ ] Database schema
- [ ] Authentication
- [ ] Basic admin dashboard

### Phase 2: Core CMS
- [ ] Episode CRUD
- [ ] Guest CRUD
- [ ] Episode-guest linking

### Phase 3: Public Site
- [ ] Episode listing page
- [ ] Episode detail pages
- [ ] Guest profiles

### Phase 4: Monetization
- [ ] Stripe integration
- [ ] Premium content gating
- [ ] Subscriber features

### Phase 5: Advanced Features
- [ ] AI content generation
- [ ] Sponsor analytics
- [ ] Geolocation targeting

---

## Project Structure

```
podbrain/
├── app/
│   ├── (auth)/
│   │   └── login/
│   ├── (public)/
│   │   ├── episodes/
│   │   └── guests/
│   ├── admin/
│   │   ├── dashboard/
│   │   ├── episodes/
│   │   ├── guests/
│   │   └── sponsors/
│   └── api/
│       ├── episodes/
│       ├── guests/
│       └── sponsors/
├── components/
│   ├── ui/
│   ├── episodes/
│   ├── guests/
│   └── sponsors/
├── lib/
│   ├── supabase.ts
│   └── utils.ts
└── utils/
    └── helpers.ts
```

---

## Environment Variables

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# OpenAI
OPENAI_API_KEY=

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# YouTube
YOUTUBE_API_KEY=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Key Design Decisions

### Why Next.js 14 App Router?
- Server components by default (better performance)
- Built-in API routes
- File-based routing
- Great for SEO
- Easy deployment

### Why Supabase?
- PostgreSQL (robust, relational)
- Built-in authentication
- Row Level Security
- Real-time capabilities
- Great free tier

### Why TypeScript?
- Catch errors early
- Better IDE support
- Self-documenting code
- Easier refactoring

---

## Code Conventions

### File Naming
- Components: PascalCase (EpisodeCard.tsx)
- Utilities: camelCase (formatDate.ts)
- Pages: lowercase (episode/page.tsx)

### Component Structure
```typescript
'use client' // Only when needed

import statements
type/interface definitions
main component
helper functions
export
```

### Database Naming
- Tables: plural snake_case (episode_guests)
- Columns: snake_case (youtube_url)
- Primary keys: id (UUID)
- Foreign keys: table_name_id

---

## Development Workflow

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/episode-management
   ```

2. **Build Feature**
   - Write code
   - Test locally
   - Fix bugs

3. **Commit & Push**
   ```bash
   git add .
   git commit -m "Add episode management"
   git push origin feature/episode-management
   ```

4. **Deploy**
   - Merge to main
   - Vercel auto-deploys

---

## Testing Strategy

### Manual Testing (Current Phase)
- Test each feature after building
- Check on mobile and desktop
- Test with different user roles
- Verify database updates

### Future: Automated Testing
- Unit tests (Jest)
- Integration tests (Playwright)
- E2E tests (Cypress)

---

## Known Limitations (MVP)

- No mobile app (web only)
- No live streaming
- No video editing
- No podcast hosting
- No comments system
- No multi-language
- Basic analytics only

---

## Future Enhancements

### Post-MVP Features
- Advanced guest CRM fields
- Double bidding sponsor system
- Spotify integration
- Auto-transcription
- Social media integration
- Advanced analytics dashboard
- Email notifications
- RSS feed

---

## AI Assistant Instructions

When helping with this project:

1. **Always use TypeScript** with proper types
2. **Follow Next.js 14 App Router** conventions
3. **Use Tailwind CSS** for styling (no custom CSS)
4. **Database queries through Supabase client** (not raw SQL)
5. **Explain code** for non-developer understanding
6. **Include error handling** in all functions
7. **Mobile-first responsive design**
8. **Security-first** (RLS policies, env vars)

### Code Style
- Use async/await (not .then())
- Destructure props
- Use optional chaining (?.)
- Prefer functional components
- Use React Server Components when possible

---

## Common Commands

```bash
# Development
npm run dev              # Start dev server
npm run build           # Build for production
npm run start           # Start production server

# Database
npx supabase gen types  # Generate TypeScript types

# Git
git status              # Check status
git add .               # Stage changes
git commit -m "msg"     # Commit changes
git push                # Push to remote
```

---

## Resources

- **Next.js Docs**: https://nextjs.org/docs
- **Supabase Docs**: https://supabase.com/docs
- **Tailwind Docs**: https://tailwindcss.com/docs
- **TypeScript Docs**: https://www.typescriptlang.org/docs

---

## Current Status

**Phase**: Foundation / Setup  
**Last Updated**: November 2025  
**Developers**: You (with AI assistance)  
**Status**: 🚀 Just starting!

---

## Notes for AI Assistants

This is a **real project** being built by a **non-developer** using AI assistance. Please:

- ✅ Provide complete, working code
- ✅ Explain what the code does
- ✅ Include step-by-step instructions
- ✅ Anticipate common errors
- ✅ Suggest best practices
- ❌ Don't assume advanced knowledge
- ❌ Don't skip error handling
- ❌ Don't use complex patterns unnecessarily

**Remember**: The goal is to build a functional MVP quickly, not to write perfect code. Prioritize working features over perfect architecture.