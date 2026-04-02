
import { useNavigate } from "react-router-dom";
import { ButtonSecondary } from "@/components/ui/primitives";
import { ArrowLeft } from "lucide-react";

const CodeBlock = ({ children, title }: { children: string; title?: string }) => (
  <div className="rounded-lg overflow-hidden border border-border my-4">
    {title && (
      <div className="bg-surface px-4 py-2 text-xs text-muted-foreground font-mono border-b border-border">
        {title}
      </div>
    )}
    <pre className="bg-background p-4 overflow-x-auto text-sm text-muted-foreground font-mono leading-relaxed">
      <code>{children}</code>
    </pre>
  </div>
);

const Section = ({ id, title, children }: { id: string; title: string; children: React.ReactNode }) => (
  <section id={id} className="py-12 border-b border-border last:border-b-0">
    <h2 className="font-display font-bold text-2xl md:text-3xl text-foreground uppercase tracking-wide mb-8">
      {title}
    </h2>
    <div className="prose-invert max-w-none space-y-6 text-muted-foreground leading-relaxed">
      {children}
    </div>
  </section>
);

const CaseStudy = () => {
  const navigate = useNavigate();

  const sections = [
    { id: "vision", label: "Vision" },
    { id: "architecture", label: "Architecture" },
    { id: "design-system", label: "Design System" },
    { id: "onboarding", label: "Onboarding" },
    { id: "auth", label: "Auth & Access" },
    { id: "features", label: "Key Features" },
    { id: "database", label: "Database" },
    { id: "retrospective", label: "Retrospective" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="nav-glass fixed top-0 w-full z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img 
              src="/lovable-uploads/5c266225-a588-440b-b158-3bb0d529a94f.png" 
              alt="BLACKLABEL.gg" 
              className="h-8"
            />
            <span className="text-xs text-muted-foreground uppercase tracking-widest hidden sm:block">Case Study</span>
          </div>
          <ButtonSecondary size="sm" onClick={() => navigate("/")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </ButtonSecondary>
        </div>
      </nav>

      <div className="container mx-auto px-4 pt-28 pb-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 space-y-4">
            <h1 className="font-display font-bold text-4xl md:text-5xl text-foreground uppercase tracking-wide">
              Technical Case Study
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A deep dive into the architecture, design decisions, and engineering behind 
              BLACKLABEL.gg — an invite-only talent platform for the games industry.
            </p>
          </div>

          {/* Table of Contents */}
          <div className="rounded-xl border border-border bg-surface p-6 mb-12">
            <h3 className="font-display font-semibold text-sm uppercase tracking-widest text-muted-foreground mb-4">Contents</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {sections.map((s) => (
                <a 
                  key={s.id} 
                  href={`#${s.id}`} 
                  className="text-sm text-foreground hover:text-muted-foreground transition-colors"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          {/* Content */}
          <Section id="vision" title="Project Vision">
            <p>
              BLACKLABEL.gg set out to solve a specific problem in the games industry: the disconnect 
              between talented freelancers and the studios that need them. Unlike generic freelance 
              platforms, BLACKLABEL was designed exclusively for gaming professionals—artists, 
              designers, engineers, producers, and audio specialists who ship games.
            </p>
            <p>
              The core thesis was <strong className="text-foreground">trust through curation</strong>. 
              Every member joined by invite from an existing member, creating a network where 
              professional credibility was the price of admission. No cold signups. No recruiter spam. 
              Just verified talent and real, funded opportunities.
            </p>
            <p>
              The platform supported two primary roles: <strong className="text-foreground">Gig Seekers</strong> (talent 
              looking for contract work) and <strong className="text-foreground">Gig Posters</strong> (studios and leads 
              posting opportunities). A third <strong className="text-foreground">Admin</strong> role handled moderation, 
              approvals, and platform analytics.
            </p>
          </Section>

          <Section id="architecture" title="Architecture Overview">
            <p>
              The platform was built as a single-page application with a serverless backend, 
              optimized for rapid iteration and maintainability.
            </p>

            <div className="rounded-xl border border-border bg-surface p-6 my-6">
              <h4 className="font-display font-semibold text-foreground mb-4 text-sm uppercase tracking-widest">Tech Stack</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-foreground font-semibold">Frontend</span>
                  <p className="text-muted-foreground">React 18 + TypeScript 5</p>
                </div>
                <div>
                  <span className="text-foreground font-semibold">Build</span>
                  <p className="text-muted-foreground">Vite 5 with SWC</p>
                </div>
                <div>
                  <span className="text-foreground font-semibold">Styling</span>
                  <p className="text-muted-foreground">Tailwind CSS v3 + custom tokens</p>
                </div>
                <div>
                  <span className="text-foreground font-semibold">Components</span>
                  <p className="text-muted-foreground">shadcn/ui + custom primitives</p>
                </div>
                <div>
                  <span className="text-foreground font-semibold">Backend</span>
                  <p className="text-muted-foreground">Supabase (Auth, DB, Edge Functions, Storage)</p>
                </div>
                <div>
                  <span className="text-foreground font-semibold">Data Fetching</span>
                  <p className="text-muted-foreground">TanStack React Query v5</p>
                </div>
              </div>
            </div>

            <CodeBlock title="Project Structure (simplified)">{`src/
├── components/
│   ├── admin/          # Admin dashboard, moderation, analytics
│   ├── auth/           # AuthGuard, RoleGuard, AuthCallback
│   ├── onboarding/     # Role-branching multi-step onboarding
│   ├── profile/        # Editorial profile system + forms
│   │   └── editorial/  # Narrative-driven profile components
│   ├── gig/            # Gig posting, browsing, applications
│   ├── ui/             # Atomic design system primitives
│   └── routing/        # Dynamic slug-based profile routes
├── hooks/              # Auth, roles, profiles, feature flags
├── lib/                # Utilities, validation, design tokens
├── pages/              # Route-level page components
└── types/              # Shared TypeScript definitions`}</CodeBlock>

            <p>
              The architecture followed a <strong className="text-foreground">feature-based organization</strong> pattern, 
              grouping related components, hooks, and utilities by domain rather than technical layer. 
              This made it easy to reason about the codebase as it grew to 100+ components.
            </p>
          </Section>

          <Section id="design-system" title="Design System">
            <p>
              The visual identity was built around a <strong className="text-foreground">monochromatic luxury aesthetic</strong> — 
              black backgrounds, white typography, and subtle elevation through shadows and borders. 
              The goal was to feel like a premium editorial publication, not a typical SaaS app.
            </p>

            <div className="rounded-xl border border-border bg-surface p-6 my-6">
              <h4 className="font-display font-semibold text-foreground mb-4 text-sm uppercase tracking-widest">Typography Choices</h4>
              <div className="space-y-3">
                <div>
                  <span className="font-display text-lg text-foreground">Orbitron</span>
                  <span className="text-muted-foreground text-sm ml-3">— Display headings. Geometric, futuristic, rooted in gaming culture.</span>
                </div>
                <div>
                  <span className="text-lg text-foreground" style={{ fontFamily: 'Satoshi, Inter, sans-serif' }}>Satoshi</span>
                  <span className="text-muted-foreground text-sm ml-3">— Body text. Clean, modern, highly legible at small sizes.</span>
                </div>
              </div>
            </div>

            <p>
              The design system was implemented as a layered architecture:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong className="text-foreground">CSS Custom Properties</strong> — HSL color tokens, spacing scale, shadow definitions in <code className="text-foreground bg-surface px-1.5 py-0.5 rounded text-xs">index.css</code></li>
              <li><strong className="text-foreground">Tailwind Config</strong> — Maps CSS variables to utility classes with semantic naming</li>
              <li><strong className="text-foreground">Atomic Primitives</strong> — <code className="text-foreground bg-surface px-1.5 py-0.5 rounded text-xs">primitives.tsx</code> exports ButtonPrimary, ButtonSecondary, CardLuxe, BadgeStatus, HeadingXL, etc.</li>
              <li><strong className="text-foreground">System Components</strong> — <code className="text-foreground bg-surface px-1.5 py-0.5 rounded text-xs">system.tsx</code> provides higher-level composed components</li>
            </ul>

            <CodeBlock title="index.css — Core Design Tokens">{`:root {
  --font-display: 'Orbitron', 'Rajdhani', sans-serif;
  --font-body: 'Satoshi', 'Inter', sans-serif;
  --background: 215 25% 4%;    /* #0B0C10 - Near-black luxe */
  --surface: 220 12% 11%;      /* #1A1B1F - Dark neutral */
  --foreground: 0 0% 100%;     /* Pure white */
  --muted-foreground: 0 0% 71%; /* Secondary text */
  --border: 220 9% 20%;        /* Medium gray borders */
}`}</CodeBlock>

            <p>
              Dark mode wasn't an afterthought — it was the <em>only</em> mode. The design was built 
              dark-first with an optional light mode defined but rarely used. The monochromatic 
              palette kept the focus on content and created a sense of exclusivity.
            </p>
          </Section>

          <Section id="onboarding" title="Onboarding Engine">
            <p>
              One of the most complex subsystems was the <strong className="text-foreground">role-branching onboarding flow</strong>. 
              Users entering as Gig Seekers and Gig Posters followed fundamentally different paths, 
              but shared a common framework.
            </p>

            <div className="rounded-xl border border-border bg-surface p-6 my-6">
              <h4 className="font-display font-semibold text-foreground mb-4 text-sm uppercase tracking-widest">Onboarding Steps by Role</h4>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h5 className="text-foreground font-semibold mb-2">Gig Seeker (Talent)</h5>
                  <ol className="list-decimal list-inside space-y-1 text-sm">
                    <li>Pre-qualification (invite validation)</li>
                    <li>Professional foundation (skills, experience, rate ranges)</li>
                    <li>Professional showcase (credits, portfolio, project highlights)</li>
                    <li>Work & privacy preferences (availability, contact settings)</li>
                  </ol>
                </div>
                <div>
                  <h5 className="text-foreground font-semibold mb-2">Gig Poster (Studio/Lead)</h5>
                  <ol className="list-decimal list-inside space-y-1 text-sm">
                    <li>Company/studio information</li>
                    <li>Project scope & team needs</li>
                    <li>Posting preferences & budget ranges</li>
                  </ol>
                </div>
              </div>
            </div>

            <p>
              The engine was built with <strong className="text-foreground">auto-save persistence</strong> — progress was 
              saved to the database at each step transition, so users could close the browser and 
              resume exactly where they left off. Validation was step-scoped: each step had its own 
              validation schema, and users couldn't advance without completing required fields.
            </p>

            <CodeBlock title="Onboarding Architecture">{`// Simplified flow orchestration
const ONBOARDING_STEPS: Record<UserRole, StepConfig[]> = {
  gig_seeker: [
    { id: 'pre-qualification', component: PreQualificationStep, validate: validateStep1 },
    { id: 'professional-foundation', component: ProfessionalFoundationStep, validate: validateStep2 },
    { id: 'professional-showcase', component: ProfessionalShowcaseStep, validate: validateStep3 },
    { id: 'work-privacy', component: WorkPrivacyPreferencesStep, validate: validateStep4 },
  ],
  gig_poster: [
    { id: 'company-info', component: PosterOnboardingFields, validate: validatePosterStep1 },
    // ...
  ],
};`}</CodeBlock>

            <p>
              Key hooks powered the system: <code className="text-foreground bg-surface px-1.5 py-0.5 rounded text-xs">useOnboardingNavigation</code> managed 
              step transitions, <code className="text-foreground bg-surface px-1.5 py-0.5 rounded text-xs">useOnboardingValidation</code> enforced per-step rules, 
              and <code className="text-foreground bg-surface px-1.5 py-0.5 rounded text-xs">useOnboardingSubmission</code> handled the final write to the database.
            </p>
          </Section>

          <Section id="auth" title="Auth & Access Control">
            <p>
              Authentication was built on Supabase Auth with email/password as the primary method, 
              with OAuth (Google, Apple) planned for future phases. The invite-only model added 
              a layer on top: users needed a valid invite code before they could even register.
            </p>

            <div className="rounded-xl border border-border bg-surface p-6 my-6">
              <h4 className="font-display font-semibold text-foreground mb-4 text-sm uppercase tracking-widest">Access Control Layers</h4>
              <div className="space-y-4 text-sm">
                <div className="flex gap-4">
                  <span className="text-foreground font-mono w-24 shrink-0">Layer 1</span>
                  <div>
                    <span className="text-foreground font-semibold">Invite Validation</span>
                    <p className="text-muted-foreground">Edge function validates invite codes before signup. Codes are single-use with referral chain tracking.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <span className="text-foreground font-mono w-24 shrink-0">Layer 2</span>
                  <div>
                    <span className="text-foreground font-semibold">AuthGuard</span>
                    <p className="text-muted-foreground">Route-level component checks session status. Redirects unauthenticated users to /auth.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <span className="text-foreground font-mono w-24 shrink-0">Layer 3</span>
                  <div>
                    <span className="text-foreground font-semibold">RoleGuard</span>
                    <p className="text-muted-foreground">Capability-based checks. Admin routes require admin role. Poster-only features gated by poster role.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <span className="text-foreground font-mono w-24 shrink-0">Layer 4</span>
                  <div>
                    <span className="text-foreground font-semibold">Row-Level Security</span>
                    <p className="text-muted-foreground">Postgres RLS policies enforce data access at the database level. Users can only read/write their own data.</p>
                  </div>
                </div>
              </div>
            </div>

            <CodeBlock title="AuthGuard Component (simplified)">{`export function AuthGuard({ children, requiredRole, requireAuth = true }) {
  const { sessionStatus } = useAuth();
  const roleAccess = useRoleAccess();

  if (sessionStatus.isLoading) return <LoadingSpinner />;
  if (requireAuth && !sessionStatus.isAuthenticated) return <Navigate to="/auth" />;
  if (requiredRole && !roleAccess.hasRole(requiredRole)) return <AccessDenied />;

  return children;
}`}</CodeBlock>
          </Section>

          <Section id="features" title="Key Features">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="rounded-xl border border-border bg-surface p-6">
                <h4 className="font-display font-semibold text-foreground mb-3">Editorial Profiles</h4>
                <p className="text-sm text-muted-foreground">
                  Narrative-driven profile pages with sections for professional background, 
                  project showcases, game credits, awards, collaboration preferences, and 
                  custom "Profile DNA" tags. Profiles supported custom URL slugs and 
                  public/private visibility toggles.
                </p>
              </div>
              <div className="rounded-xl border border-border bg-surface p-6">
                <h4 className="font-display font-semibold text-foreground mb-3">Gig Marketplace</h4>
                <p className="text-sm text-muted-foreground">
                  Admin-approved gig postings with filtering by discipline, project type, 
                  budget range, and timeline. Application flow included cover messages, 
                  portfolio links, and rate negotiation.
                </p>
              </div>
              <div className="rounded-xl border border-border bg-surface p-6">
                <h4 className="font-display font-semibold text-foreground mb-3">Moderation System</h4>
                <p className="text-sm text-muted-foreground">
                  Full admin dashboard with user reporting, content moderation actions, 
                  platform analytics, and pending gig approval queues. Severity-based 
                  triage with admin notes and action history.
                </p>
              </div>
              <div className="rounded-xl border border-border bg-surface p-6">
                <h4 className="font-display font-semibold text-foreground mb-3">Invite System</h4>
                <p className="text-sm text-muted-foreground">
                  Each verified member received a limited number of invite codes. 
                  The system tracked referral chains, enforced single-use codes, 
                  and displayed "Invited by" attribution on profiles.
                </p>
              </div>
              <div className="rounded-xl border border-border bg-surface p-6">
                <h4 className="font-display font-semibold text-foreground mb-3">Profile DNA Tags</h4>
                <p className="text-sm text-muted-foreground">
                  A tagging system that let professionals describe their work identity 
                  beyond traditional skills — things like "Systems Thinker," "Crunch-Free Advocate," 
                  or "Mentor." Surfaced in search and profile views.
                </p>
              </div>
              <div className="rounded-xl border border-border bg-surface p-6">
                <h4 className="font-display font-semibold text-foreground mb-3">Collaboration Requests</h4>
                <p className="text-sm text-muted-foreground">
                  A lightweight messaging system for expressing interest in collaboration 
                  before formal engagement. Included preference matching and 
                  collaboration badges for completed partnerships.
                </p>
              </div>
            </div>
          </Section>

          <Section id="database" title="Database Design">
            <p>
              The database was designed around Supabase's Postgres with Row-Level Security (RLS) 
              as the primary access control mechanism. Key design decisions included separating 
              user roles into their own table (avoiding privilege escalation via profile edits) 
              and using validation triggers instead of CHECK constraints for time-based validations.
            </p>

            <CodeBlock title="Core Tables (conceptual)">{`-- Users/Profiles (extended from auth.users)
profiles: id, display_name, bio, role, avatar_url, skills[], 
          availability_status, rate_range, onboarding_completed,
          public_profile, url_slug, social_links, invites_remaining

-- Role-Based Access (separate from profiles for security)
user_roles: id, user_id, role (enum: admin | moderator | user)

-- Gig Marketplace
gigs: id, poster_id, title, description, discipline, project_type,
      budget_range, timeline, status (pending | approved | closed)

-- Invite System
invites: id, code, created_by, used_by, used_at, expires_at

-- Reporting & Moderation
reports: id, reporter_id, reported_user_id, category, severity,
         description, status, admin_notes, evidence_urls

-- Profile Extensions
profile_tags: id, user_id, tag_category, tag_value
game_credits: id, user_id, title, studio, role, year
case_studies: id, user_id, title, description, images[], links[]`}</CodeBlock>

            <p>
              RLS policies followed a consistent pattern: users could read/write their own data, 
              admins could read all data, and public profiles were readable by anyone. 
              A <code className="text-foreground bg-surface px-1.5 py-0.5 rounded text-xs">has_role()</code> security-definer 
              function prevented recursive RLS checks when verifying admin access.
            </p>
          </Section>

          <Section id="retrospective" title="Lessons Learned">
            <div className="space-y-8">
              <div>
                <h4 className="font-display font-semibold text-foreground mb-3 text-lg">What Worked Well</h4>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong className="text-foreground">Atomic design system</strong> — Having a single source of truth for UI primitives meant consistent styling across 100+ components with minimal drift.</li>
                  <li><strong className="text-foreground">Role-branching onboarding</strong> — Separating the seeker and poster flows kept each path focused and reduced cognitive load for users.</li>
                  <li><strong className="text-foreground">RLS-first security</strong> — Enforcing access at the database layer rather than just the API layer eliminated an entire class of bugs.</li>
                  <li><strong className="text-foreground">Feature flags</strong> — A simple feature flag hook allowed shipping incremental features without complex branching strategies.</li>
                  <li><strong className="text-foreground">Lovable + Supabase</strong> — The AI-assisted development workflow with integrated backend dramatically accelerated prototyping and iteration.</li>
                </ul>
              </div>

              <div>
                <h4 className="font-display font-semibold text-foreground mb-3 text-lg">What I'd Do Differently</h4>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong className="text-foreground">Start with fewer features</strong> — The editorial profile system, gig marketplace, moderation dashboard, and invite system were all built before validating market fit. A leaner MVP would have been more prudent.</li>
                  <li><strong className="text-foreground">Component file size discipline</strong> — Several components grew beyond 300 lines before being refactored. Enforcing a line-count ceiling earlier would have kept the codebase more maintainable.</li>
                  <li><strong className="text-foreground">Type generation workflow</strong> — The Supabase type system is powerful but requires careful orchestration when tables change. A more automated sync pipeline would have reduced friction.</li>
                  <li><strong className="text-foreground">User testing earlier</strong> — The platform was built with strong assumptions about what gaming professionals wanted. Earlier user testing might have revealed simpler solutions.</li>
                </ul>
              </div>

              <div>
                <h4 className="font-display font-semibold text-foreground mb-3 text-lg">By the Numbers</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="rounded-xl border border-border bg-surface p-4 text-center">
                    <div className="text-2xl font-display font-bold text-foreground">100+</div>
                    <div className="text-xs text-muted-foreground uppercase tracking-widest mt-1">Components</div>
                  </div>
                  <div className="rounded-xl border border-border bg-surface p-4 text-center">
                    <div className="text-2xl font-display font-bold text-foreground">25+</div>
                    <div className="text-xs text-muted-foreground uppercase tracking-widest mt-1">Custom Hooks</div>
                  </div>
                  <div className="rounded-xl border border-border bg-surface p-4 text-center">
                    <div className="text-2xl font-display font-bold text-foreground">3</div>
                    <div className="text-xs text-muted-foreground uppercase tracking-widest mt-1">User Roles</div>
                  </div>
                  <div className="rounded-xl border border-border bg-surface p-4 text-center">
                    <div className="text-2xl font-display font-bold text-foreground">4</div>
                    <div className="text-xs text-muted-foreground uppercase tracking-widest mt-1">Onboarding Steps</div>
                  </div>
                </div>
              </div>
            </div>
          </Section>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            BLACKLABEL.gg — Built with React, TypeScript, Tailwind CSS, and Supabase. 2024–2025.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default CaseStudy;
