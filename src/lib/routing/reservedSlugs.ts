
// Reserved slugs that cannot be used as profile URLs
export const RESERVED_SLUGS = [
  'auth',
  'dashboard', 
  'onboarding',
  'post-a-gig',
  'admin',
  'api',
  'profile',
  'profiles',
  'user',
  'users',
  'login',
  'signup',
  'register',
  'settings',
  'help',
  'support',
  'contact',
  'about',
  'terms',
  'privacy',
  'www',
  'mail',
  'ftp',
  'blog',
  'docs',
  'documentation',
  'app',
  'apps',
  'static',
  'assets',
  'public',
  'private',
] as const;

export type ReservedSlug = typeof RESERVED_SLUGS[number];

export function isReservedSlug(slug: string): boolean {
  return RESERVED_SLUGS.includes(slug.toLowerCase() as ReservedSlug);
}
