
import { Database } from '@/integrations/supabase/types';

export type UserRole = Database['public']['Enums']['user_role'];
export type GigStatus = Database['public']['Enums']['gig_status'];
export type ApplicationStatus = Database['public']['Enums']['application_status'];

export type User = Database['public']['Tables']['users']['Row'];
export type Gig = Database['public']['Tables']['gigs']['Row'];
export type Application = Database['public']['Tables']['applications']['Row'];
export type FeatureFlag = Database['public']['Tables']['feature_flags']['Row'];
export type Invite = Database['public']['Tables']['invites']['Row'];

// Branded types for safer domain modeling
export type UserId = string & { readonly __brand: unique symbol };
export type GigId = string & { readonly __brand: unique symbol };
export type ApplicationId = string & { readonly __brand: unique symbol };
export type InviteId = string & { readonly __brand: unique symbol };

export interface AuthUser {
  id: UserId;
  email: string;
  role: UserRole;
  displayName: string;
  bio?: string;
  avatarUrl?: string;
  onboarding_completed: boolean;
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
}

export interface SessionStatus {
  isLoading: boolean;
  isAuthenticated: boolean;
  isExpired: boolean;
  user: AuthUser | null;
  session: any | null;
}
