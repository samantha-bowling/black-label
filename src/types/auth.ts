
import { Database } from '@/integrations/supabase/types';

export type UserRole = Database['public']['Enums']['user_role'];
export type GigStatus = Database['public']['Enums']['gig_status'];
export type ApplicationStatus = Database['public']['Enums']['application_status'];

export type User = Database['public']['Tables']['users']['Row'];
export type Gig = Database['public']['Tables']['gigs']['Row'];
export type Application = Database['public']['Tables']['applications']['Row'];
export type FeatureFlag = Database['public']['Tables']['feature_flags']['Row'];

// Branded types for safer domain modeling
export type UserId = string & { readonly __brand: unique symbol };
export type GigId = string & { readonly __brand: unique symbol };
export type ApplicationId = string & { readonly __brand: unique symbol };

export interface AuthUser {
  id: UserId;
  email: string;
  role: UserRole;
  displayName?: string;
  bio?: string;
  avatarUrl?: string;
}

export interface SessionStatus {
  isLoading: boolean;
  isAuthenticated: boolean;
  user: AuthUser | null;
}
