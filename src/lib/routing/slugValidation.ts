
import { isReservedSlug } from './reservedSlugs';

export interface SlugValidationResult {
  isValid: boolean;
  error?: string;
}

export function validateSlug(slug: string): SlugValidationResult {
  // Check if empty
  if (!slug || slug.trim() === '') {
    return { isValid: false, error: 'Slug cannot be empty' };
  }

  // Check if reserved
  if (isReservedSlug(slug)) {
    return { isValid: false, error: 'This URL is reserved and cannot be used' };
  }

  // Check format (alphanumeric and hyphens only)
  const slugRegex = /^[a-z0-9-]+$/;
  if (!slugRegex.test(slug)) {
    return { isValid: false, error: 'URL can only contain lowercase letters, numbers, and hyphens' };
  }

  // Check for consecutive hyphens
  if (slug.includes('--')) {
    return { isValid: false, error: 'URL cannot contain consecutive hyphens' };
  }

  // Check if starts or ends with hyphen
  if (slug.startsWith('-') || slug.endsWith('-')) {
    return { isValid: false, error: 'URL cannot start or end with a hyphen' };
  }

  return { isValid: true };
}

export function sanitizeSlug(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+|-+$/g, '');
}
