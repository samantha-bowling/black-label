
import { Database } from '@/integrations/supabase/types';

export type UserRole = Database['public']['Enums']['user_role'];
export type GigStatus = Database['public']['Enums']['gig_status'];
export type ApplicationStatus = Database['public']['Enums']['application_status'];
export type PosterType = Database['public']['Enums']['poster_type'];
export type BudgetRange = Database['public']['Enums']['budget_range'];
export type ContractType = Database['public']['Enums']['contract_type'];
export type BriefStatus = Database['public']['Enums']['brief_status'];
export type PaymentStatus = Database['public']['Enums']['payment_status'];
export type CollaborationStatus = Database['public']['Enums']['collaboration_status'];

export type User = Database['public']['Tables']['users']['Row'];
export type Gig = Database['public']['Tables']['gigs']['Row'];
export type Application = Database['public']['Tables']['applications']['Row'];
export type FeatureFlag = Database['public']['Tables']['feature_flags']['Row'];
export type Invite = Database['public']['Tables']['invites']['Row'];
export type Payment = Database['public']['Tables']['payments']['Row'];
export type CollaborationRequest = Database['public']['Tables']['collaboration_requests']['Row'];

// Branded types for safer domain modeling
export type UserId = string & { readonly __brand: unique symbol };
export type GigId = string & { readonly __brand: unique symbol };
export type ApplicationId = string & { readonly __brand: unique symbol };
export type InviteId = string & { readonly __brand: unique symbol };
export type PaymentId = string & { readonly __brand: unique symbol };
export type CollaborationRequestId = string & { readonly __brand: unique symbol };

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
  // Profile DNA tags (populated via separate query)
  profile_tags?: {
    core_disciplines: string[];
    specialty_skills: string[];
    project_types: string[];
  };
}

export interface SessionStatus {
  isLoading: boolean;
  isAuthenticated: boolean;
  isExpired: boolean;
  user: AuthUser | null;
  session: any | null;
}
