

# BLACKLABEL.gg Sunset Plan

## Overview

Transform the live platform into a static portfolio/case study site. The active platform features (auth, onboarding, gigs, dashboard) get disabled, and the landing page becomes a retrospective showcase of the project.

## What Changes

### 1. Replace Index page with Sunset Landing Page
- Hero section with BLACKLABEL.gg branding (keep existing logo assets)
- "This project has been sunset" messaging with dates active
- Brief tagline recap: what it was, who it was for
- Link to the new Technical Case Study page
- Keep the existing About, Privacy, Terms, and Contact modals in the footer

### 2. Create `/case-study` Technical Implementation Page
A comprehensive, publicly accessible page covering:

- **Project Vision**: Invite-only, curated talent platform for the games industry
- **Architecture Overview**: React 18 + Vite + TypeScript + Tailwind + Lovable Cloud (Supabase)
- **Design System**: The unified atomic component system (`system.tsx`), design tokens, gaming-industry aesthetic choices (Orbitron typography, elevation system, GPU-friendly animations)
- **Onboarding Engine**: Role-branching 3-step flow, auto-save, pre-qualification, LinkedIn enrichment concept
- **Auth & Access Control**: Invite-only gating, role-based guards (seeker/poster/admin), RLS policies
- **Key Features**: Editorial profile system, gig posting/browsing, moderation dashboard, collaboration requests, profile DNA tags
- **Database Design**: Table structure, RLS strategy, edge functions
- **Lessons Learned / Retrospective**: What worked, what you'd do differently

Style: Dark, editorial layout matching the existing brand. Sections with clear headings, code snippets where relevant, and architecture diagrams via ASCII or simple visuals.

### 3. Disable Active Features
- Remove auth routes or redirect `/auth`, `/dashboard`, `/onboarding`, `/post-a-gig`, `/browse-opportunities`, `/admin` to `/` or a "Project Sunset" notice
- Keep `/:slug` profile routes working (read-only) if desired, or redirect those too
- Remove sign-in/sign-up buttons from nav

### 4. Update Routing in `App.tsx`
- Add `/case-study` route
- Redirect all protected routes to `/`
- Remove `AuthGuard` wrappers from disabled routes

## Files to Create/Modify

| File | Action |
|------|--------|
| `src/pages/Index.tsx` | Rewrite as sunset landing page |
| `src/pages/CaseStudy.tsx` | New — technical implementation writeup |
| `src/App.tsx` | Add case study route, redirect old routes |
| `src/pages/Auth.tsx` | Optional: replace with redirect |

## Technical Notes

- No database changes needed — existing data stays intact
- No new dependencies required
- The case study page is purely static content with the existing design system components
- Build errors in admin components become irrelevant since those routes are removed

