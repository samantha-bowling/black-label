
import { z } from 'zod';

// Common validation schemas
export const emailSchema = z.string().email().min(1).max(255);
export const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password must be less than 128 characters')
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one lowercase letter, one uppercase letter, and one number');

export const displayNameSchema = z.string()
  .min(2, 'Display name must be at least 2 characters')
  .max(50, 'Display name must be less than 50 characters')
  .regex(/^[a-zA-Z0-9\s\-_\.]+$/, 'Display name can only contain letters, numbers, spaces, hyphens, underscores, and periods');

export const bioSchema = z.string()
  .max(500, 'Bio must be less than 500 characters')
  .optional();

export const companyNameSchema = z.string()
  .min(2, 'Company name must be at least 2 characters')
  .max(100, 'Company name must be less than 100 characters')
  .regex(/^[a-zA-Z0-9\s\-_\.&,]+$/, 'Company name contains invalid characters')
  .optional();

export const urlSchema = z.string()
  .url('Must be a valid URL')
  .max(255, 'URL must be less than 255 characters')
  .optional();

// Contact form validation
export const contactFormSchema = z.object({
  firstName: z.string()
    .min(1, 'First name is required')
    .max(50, 'First name must be less than 50 characters')
    .regex(/^[a-zA-Z\s\-']+$/, 'First name can only contain letters, spaces, hyphens, and apostrophes'),
  lastName: z.string()
    .min(1, 'Last name is required')
    .max(50, 'Last name must be less than 50 characters')
    .regex(/^[a-zA-Z\s\-']+$/, 'Last name can only contain letters, spaces, hyphens, and apostrophes'),
  email: emailSchema,
  subject: z.string()
    .min(5, 'Subject must be at least 5 characters')
    .max(100, 'Subject must be less than 100 characters'),
  message: z.string()
    .min(10, 'Message must be at least 10 characters')
    .max(2000, 'Message must be less than 2000 characters'),
  companyOrganization: z.string()
    .max(100, 'Company/Organization must be less than 100 characters')
    .optional(),
});

// Gig validation
export const gigSchema = z.object({
  title: z.string()
    .min(5, 'Title must be at least 5 characters')
    .max(100, 'Title must be less than 100 characters'),
  description: z.string()
    .min(50, 'Description must be at least 50 characters')
    .max(5000, 'Description must be less than 5000 characters'),
  budget: z.number()
    .min(0, 'Budget must be positive')
    .max(1000000, 'Budget must be reasonable')
    .optional(),
  timeline: z.string()
    .max(200, 'Timeline must be less than 200 characters')
    .optional(),
});

// Application validation
export const applicationSchema = z.object({
  pitchText: z.string()
    .min(50, 'Pitch must be at least 50 characters')
    .max(2000, 'Pitch must be less than 2000 characters'),
});

// Invite validation
export const inviteSchema = z.object({
  email: emailSchema.optional(),
});

// Sanitization utilities
export const sanitizeString = (str: string): string => {
  return str
    .trim()
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .replace(/[<>]/g, ''); // Remove potential HTML brackets
};

export const sanitizeEmail = (email: string): string => {
  return email.toLowerCase().trim();
};

// Input validation helper
export const validateAndSanitize = <T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: string[] } => {
  try {
    const result = schema.parse(data);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.errors.map(err => err.message)
      };
    }
    return {
      success: false,
      errors: ['Validation failed']
    };
  }
};
