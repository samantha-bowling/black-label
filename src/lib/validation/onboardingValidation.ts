
import { z } from 'zod';

// Shared validation schemas
export const displayNameSchema = z.string()
  .min(1, 'Display name is required')
  .max(50, 'Display name must be 50 characters or less')
  .regex(/^[a-zA-Z0-9\s\-_.]+$/, 'Display name can only contain letters, numbers, spaces, hyphens, underscores, and periods');

export const bioSchema = z.string()
  .max(750, 'Bio must be 750 characters or less')
  .optional();

export const locationSchema = z.string()
  .max(100, 'Location must be 100 characters or less')
  .optional();

export const yearsExperienceSchema = z.number()
  .min(0, 'Experience cannot be negative')
  .max(50, 'Please enter a realistic number of years')
  .optional();

export const urlSchema = z.string()
  .url('Please enter a valid URL')
  .optional()
  .or(z.literal(''));

// Project showcase validation
export const projectShowcaseSchema = z.object({
  name: z.string().min(1, 'Project name is required').max(100, 'Project name must be 100 characters or less'),
  role: z.string().min(1, 'Your role is required').max(100, 'Role must be 100 characters or less'),
  dates: z.string().max(50, 'Timeline must be 50 characters or less').optional(),
  description: z.string().max(500, 'Description must be 500 characters or less').optional(),
  link: urlSchema
});

// Shared onboarding validation
export const sharedOnboardingSchema = z.object({
  display_name: displayNameSchema,
  bio: bioSchema,
  location: locationSchema,
  years_experience: yearsExperienceSchema,
  social_links: z.object({
    linkedin: urlSchema,
    github: urlSchema,
    website: urlSchema
  }).optional()
});

// Gig seeker specific validation
export const gigSeekerSchema = sharedOnboardingSchema.extend({
  project_showcase: z.array(projectShowcaseSchema).max(3, 'Maximum 3 projects allowed'),
  desired_gig_types: z.array(z.string()).optional(),
  availability_status: z.enum(['open', 'selective', 'not-looking']).optional(),
  past_credits: z.string().max(1000, 'Past credits must be 1000 characters or less').optional(),
  rate_range_min: z.number().min(0, 'Rate cannot be negative').optional(),
  rate_range_max: z.number().min(0, 'Rate cannot be negative').optional(),
  public_profile: z.boolean().optional(),
  accepts_intros: z.boolean().optional()
});

// Gig poster specific validation
export const gigPosterSchema = sharedOnboardingSchema.extend({
  company_name: z.string().max(100, 'Company name must be 100 characters or less').optional(),
  poster_type: z.enum(['individual', 'startup', 'agency', 'enterprise']).optional(),
  typical_budget_min: z.number().min(0, 'Budget cannot be negative').optional(),
  typical_budget_max: z.number().min(0, 'Budget cannot be negative').optional(),
  timeline_expectations: z.string().max(500, 'Timeline expectations must be 500 characters or less').optional(),
  nda_required: z.boolean().optional(),
  website_url: urlSchema,
  linkedin_url: urlSchema
});

// Cross-field validation helpers
export const validateRateRange = (min?: number, max?: number): string | null => {
  if (min && max && min > max) {
    return 'Minimum rate cannot be higher than maximum rate';
  }
  return null;
};

export const validateBudgetRange = (min?: number, max?: number): string | null => {
  if (min && max && min > max) {
    return 'Minimum budget cannot be higher than maximum budget';
  }
  return null;
};

export const validateProjectShowcase = (projects: any[]): string | null => {
  if (projects.length > 3) {
    return 'Maximum 3 projects allowed';
  }
  
  const projectNames = projects.map(p => p.name?.toLowerCase()).filter(Boolean);
  const uniqueNames = new Set(projectNames);
  
  if (projectNames.length !== uniqueNames.size) {
    return 'Project names must be unique';
  }
  
  return null;
};
