// @ts-nocheck
import { Database } from '@/integrations/supabase/types';

export type TagCategory = Database['public']['Enums']['tag_category'];

export interface ProfileTag {
  id: string;
  name: string;
  category: TagCategory;
  description?: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface UserProfileTag {
  id: string;
  user_id: string;
  tag_id: string;
  created_at: string;
  tag?: ProfileTag; // Populated when joining
}

export interface TagSelectionLimits {
  core_discipline: { min: 1; max: 3 };
  specialty_skill: { min: 0; max: 7 };
  project_type: { min: 0; max: 5 };
}

// Updated limits to match your specifications more closely
export const TAG_SELECTION_LIMITS: TagSelectionLimits = {
  core_discipline: { min: 1, max: 3 }, // 1-3 for professional clarity
  specialty_skill: { min: 0, max: 7 }, // 5-7 suggested, allowing up to 7
  project_type: { min: 0, max: 5 }, // 3-5 suggested, allowing up to 5
};

export const TAG_CATEGORY_LABELS: Record<TagCategory, string> = {
  core_discipline: 'Core Disciplines',
  specialty_skill: 'Specialty Skills',
  project_type: 'Project Types',
};

export const TAG_CATEGORY_DESCRIPTIONS: Record<TagCategory, string> = {
  core_discipline: 'Your primary professional identity - think "job lane" or role on a credits screen',
  specialty_skill: 'Unique tools, frameworks, or sub-disciplines where you have notable expertise',
  project_type: 'Project archetypes and scales that describe where you\'ve operated',
};

// Role-specific descriptions for posters
export const POSTER_TAG_CATEGORY_LABELS: Record<TagCategory, string> = {
  core_discipline: 'Core Disciplines Needed',
  specialty_skill: 'Specialty Skills Required',
  project_type: 'Project Types You Post',
};

export const POSTER_TAG_CATEGORY_DESCRIPTIONS: Record<TagCategory, string> = {
  core_discipline: 'Primary professional disciplines you typically need for your projects',
  specialty_skill: 'Specific tools, frameworks, or expertise you commonly require',
  project_type: 'Types and scales of projects you typically post',
};
