import { Database } from '@/integrations/supabase/types';

export type UserRole = Database['public']['Enums']['user_role'];
export type GigStatus = Database['public']['Enums']['gig_status'];
export type ApplicationStatus = Database['public']['Enums']['application_status'];
export type PosterType = Database['public']['Enums']['poster_type'];
export type BudgetRange = Database['public']['Enums']['budget_range'];
export type ContractType = Database['public']['Enums']['contract_type'];
export type ReportCategory = Database['public']['Enums']['report_category'];
export type ReportSeverity = Database['public']['Enums']['report_severity'];
export type ReportStatus = Database['public']['Enums']['report_status'];
export type ModerationActionType = Database['public']['Enums']['moderation_action_type'];

export type User = Database['public']['Tables']['users']['Row'];
export type Gig = Database['public']['Tables']['gigs']['Row'];
export type Application = Database['public']['Tables']['applications']['Row'];
export type FeatureFlag = Database['public']['Tables']['feature_flags']['Row'];
export type Invite = Database['public']['Tables']['invites']['Row'];
export type CollaborationRequest = Database['public']['Tables']['collaboration_requests']['Row'];
export type Report = Database['public']['Tables']['reports']['Row'];
export type ModerationAction = Database['public']['Tables']['moderation_actions']['Row'];
export type UserQualityScore = Database['public']['Tables']['user_quality_scores']['Row'];

// Branded types for safer domain modeling
export type UserId = string & { readonly __brand: unique symbol };
export type GigId = string & { readonly __brand: unique symbol };
export type ApplicationId = string & { readonly __brand: unique symbol };
export type InviteId = string & { readonly __brand: unique symbol };
export type CollaborationRequestId = string & { readonly __brand: unique symbol };
export type ReportId = string & { readonly __brand: unique symbol };
export type ModerationActionId = string & { readonly __brand: unique symbol };

// Project showcase interface
export interface ProjectShowcase {
  name: string;
  link?: string;
  role: string;
  dates: string;
  description: string;
  studio?: string;
  platforms?: string;
}

export interface AuthUser {
  id: UserId;
  email: string;
  role: UserRole;
  displayName: string;
  bio?: string;
  avatarUrl?: string;
  onboarding_completed: boolean;
  public_profile: boolean;
  skills?: string[];
  desired_gig_types?: string[];
  availability_status?: string;
  past_credits?: string;
  rate_range_min?: number;
  rate_range_max?: number;
  company_name?: string;
  typical_budget_min?: number;
  typical_budget_max?: number;
  timeline_expectations?: string;
  social_links?: Record<string, string>;
  nda_required?: boolean;
  invites_remaining: number;
  invited_by_user_id?: string;
  invite_token_used?: string;
  // Enhanced profile fields
  banner_image_url?: string;
  banner_background_color?: string;
  signature_quote?: string;
  expertise_signature?: string;
  about_story?: string;
  smart_url_slug?: string;
  accepts_intros?: boolean;
  requires_nda?: boolean;
  // New poster fields
  poster_type?: PosterType;
  location?: string;
  website_url?: string;
  linkedin_url?: string;
  // Moderation fields
  is_suspended?: boolean;
  suspension_expires_at?: string;
  search_visibility_reduced?: boolean;
  messaging_restricted?: boolean;
  gig_posting_restricted?: boolean;
  moderation_notes?: string;
  // Profile DNA tags (populated via separate query)
  profile_tags?: {
    core_disciplines: string[];
    specialty_skills: string[];
    project_types: string[];
  };
  // New Phase 1 fields
  years_experience?: number;
  project_showcase?: ProjectShowcase[];
  // New profile form fields
  core_disciplines?: string[];
  project_types?: string[];
  awards?: string[];
  available_for?: string[];
  work_style?: string[];
  rate_type?: 'hourly' | 'project' | 'salary' | null;
  // Enhanced professional fields
  professional_headline?: string;
  current_position?: string;
  current_company?: string;
  industry_focus?: string[];
  career_level?: string;
  portfolio_website?: string;
  demo_reel_url?: string;
  artstation_url?: string;
  steam_profile_url?: string;
  education?: any[];
  certifications?: any[];
  languages_spoken?: string[];
  time_zone?: string;
  preferred_project_size?: string[];
  collaboration_style?: string[];
  notable_game_credits?: any[];
  technical_proficiencies?: any;
  profile_completion_score?: number;
}

export interface SessionStatus {
  isLoading: boolean;
  isAuthenticated: boolean;
  isExpired: boolean;
  user: AuthUser | null;
  session: any | null;
}
