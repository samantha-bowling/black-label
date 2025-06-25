export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      applications: {
        Row: {
          attachments: string[] | null
          created_at: string | null
          gig_id: string
          id: string
          pitch_text: string
          reviewed_at: string | null
          reviewer_notes: string | null
          seeker_id: string
          status: Database["public"]["Enums"]["application_status"] | null
          updated_at: string | null
        }
        Insert: {
          attachments?: string[] | null
          created_at?: string | null
          gig_id: string
          id?: string
          pitch_text: string
          reviewed_at?: string | null
          reviewer_notes?: string | null
          seeker_id: string
          status?: Database["public"]["Enums"]["application_status"] | null
          updated_at?: string | null
        }
        Update: {
          attachments?: string[] | null
          created_at?: string | null
          gig_id?: string
          id?: string
          pitch_text?: string
          reviewed_at?: string | null
          reviewer_notes?: string | null
          seeker_id?: string
          status?: Database["public"]["Enums"]["application_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "applications_gig_id_fkey"
            columns: ["gig_id"]
            isOneToOne: false
            referencedRelation: "gigs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applications_seeker_id_fkey"
            columns: ["seeker_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      case_studies: {
        Row: {
          contributions: string[] | null
          created_at: string | null
          display_order: number | null
          external_link: string | null
          id: string
          is_visible: boolean | null
          media_url: string | null
          project_name: string
          role_played: string | null
          studio_name: string | null
          timeline: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          contributions?: string[] | null
          created_at?: string | null
          display_order?: number | null
          external_link?: string | null
          id?: string
          is_visible?: boolean | null
          media_url?: string | null
          project_name: string
          role_played?: string | null
          studio_name?: string | null
          timeline?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          contributions?: string[] | null
          created_at?: string | null
          display_order?: number | null
          external_link?: string | null
          id?: string
          is_visible?: boolean | null
          media_url?: string | null
          project_name?: string
          role_played?: string | null
          studio_name?: string | null
          timeline?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "case_studies_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      collaboration_options: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          option_type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          option_type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          option_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "collaboration_options_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      collaboration_requests: {
        Row: {
          budget_range: Database["public"]["Enums"]["budget_range"]
          created_at: string
          description: string
          expires_at: string | null
          id: string
          poster_id: string
          project_title: string
          responded_at: string | null
          seeker_id: string
          seeker_response: string | null
          status: Database["public"]["Enums"]["collaboration_status"] | null
          timeline: string
          updated_at: string
        }
        Insert: {
          budget_range: Database["public"]["Enums"]["budget_range"]
          created_at?: string
          description: string
          expires_at?: string | null
          id?: string
          poster_id: string
          project_title: string
          responded_at?: string | null
          seeker_id: string
          seeker_response?: string | null
          status?: Database["public"]["Enums"]["collaboration_status"] | null
          timeline: string
          updated_at?: string
        }
        Update: {
          budget_range?: Database["public"]["Enums"]["budget_range"]
          created_at?: string
          description?: string
          expires_at?: string | null
          id?: string
          poster_id?: string
          project_title?: string
          responded_at?: string | null
          seeker_id?: string
          seeker_response?: string | null
          status?: Database["public"]["Enums"]["collaboration_status"] | null
          timeline?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "collaboration_requests_poster_id_fkey"
            columns: ["poster_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collaboration_requests_seeker_id_fkey"
            columns: ["seeker_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_messages: {
        Row: {
          company_organization: string | null
          created_at: string
          email: string
          first_name: string
          id: string
          inquiry_category: string | null
          ip_address: unknown | null
          last_name: string
          message: string
          referrer_page: string | null
          subject: string
          updated_at: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          company_organization?: string | null
          created_at?: string
          email: string
          first_name: string
          id?: string
          inquiry_category?: string | null
          ip_address?: unknown | null
          last_name: string
          message: string
          referrer_page?: string | null
          subject: string
          updated_at?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          company_organization?: string | null
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          inquiry_category?: string | null
          ip_address?: unknown | null
          last_name?: string
          message?: string
          referrer_page?: string | null
          subject?: string
          updated_at?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      feature_flags: {
        Row: {
          created_at: string | null
          enabled: boolean | null
          flag_name: string
          id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          enabled?: boolean | null
          flag_name: string
          id?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          enabled?: boolean | null
          flag_name?: string
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      gigs: {
        Row: {
          admin_notes: string | null
          approved_at: string | null
          approved_by_user_id: string | null
          brief_status: Database["public"]["Enums"]["brief_status"] | null
          budget: number | null
          budget_range: Database["public"]["Enums"]["budget_range"] | null
          collaborator_id: string | null
          contract_type: Database["public"]["Enums"]["contract_type"] | null
          created_at: string | null
          description: string
          id: string
          poster_id: string
          project_type_tags: string[] | null
          skills_needed: string[] | null
          status: Database["public"]["Enums"]["gig_status"] | null
          timeline: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          admin_notes?: string | null
          approved_at?: string | null
          approved_by_user_id?: string | null
          brief_status?: Database["public"]["Enums"]["brief_status"] | null
          budget?: number | null
          budget_range?: Database["public"]["Enums"]["budget_range"] | null
          collaborator_id?: string | null
          contract_type?: Database["public"]["Enums"]["contract_type"] | null
          created_at?: string | null
          description: string
          id?: string
          poster_id: string
          project_type_tags?: string[] | null
          skills_needed?: string[] | null
          status?: Database["public"]["Enums"]["gig_status"] | null
          timeline?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          admin_notes?: string | null
          approved_at?: string | null
          approved_by_user_id?: string | null
          brief_status?: Database["public"]["Enums"]["brief_status"] | null
          budget?: number | null
          budget_range?: Database["public"]["Enums"]["budget_range"] | null
          collaborator_id?: string | null
          contract_type?: Database["public"]["Enums"]["contract_type"] | null
          created_at?: string | null
          description?: string
          id?: string
          poster_id?: string
          project_type_tags?: string[] | null
          skills_needed?: string[] | null
          status?: Database["public"]["Enums"]["gig_status"] | null
          timeline?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "gigs_approved_by_user_id_fkey"
            columns: ["approved_by_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gigs_collaborator_id_fkey"
            columns: ["collaborator_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gigs_poster_id_fkey"
            columns: ["poster_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      invites: {
        Row: {
          created_at: string
          created_by_user_id: string
          email: string | null
          expires_at: string
          id: string
          token: string
          updated_at: string
          used_at: string | null
          used_by_user_id: string | null
        }
        Insert: {
          created_at?: string
          created_by_user_id: string
          email?: string | null
          expires_at?: string
          id?: string
          token?: string
          updated_at?: string
          used_at?: string | null
          used_by_user_id?: string | null
        }
        Update: {
          created_at?: string
          created_by_user_id?: string
          email?: string | null
          expires_at?: string
          id?: string
          token?: string
          updated_at?: string
          used_at?: string | null
          used_by_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invites_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invites_used_by_user_id_fkey"
            columns: ["used_by_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      moderation_actions: {
        Row: {
          action_type: Database["public"]["Enums"]["moderation_action_type"]
          admin_id: string
          created_at: string
          details: string | null
          expires_at: string | null
          id: string
          is_active: boolean
          reason: string
          report_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          action_type: Database["public"]["Enums"]["moderation_action_type"]
          admin_id: string
          created_at?: string
          details?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean
          reason: string
          report_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          action_type?: Database["public"]["Enums"]["moderation_action_type"]
          admin_id?: string
          created_at?: string
          details?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean
          reason?: string
          report_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "moderation_actions_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "moderation_actions_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "reports"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "moderation_actions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          collaboration_request_id: string | null
          created_at: string
          currency: string | null
          gig_id: string | null
          id: string
          metadata: Json | null
          payment_type: string
          status: Database["public"]["Enums"]["payment_status"] | null
          stripe_payment_intent_id: string | null
          stripe_session_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          collaboration_request_id?: string | null
          created_at?: string
          currency?: string | null
          gig_id?: string | null
          id?: string
          metadata?: Json | null
          payment_type: string
          status?: Database["public"]["Enums"]["payment_status"] | null
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          collaboration_request_id?: string | null
          created_at?: string
          currency?: string | null
          gig_id?: string | null
          id?: string
          metadata?: Json | null
          payment_type?: string
          status?: Database["public"]["Enums"]["payment_status"] | null
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_payments_collaboration_requests"
            columns: ["collaboration_request_id"]
            isOneToOne: false
            referencedRelation: "collaboration_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_gig_id_fkey"
            columns: ["gig_id"]
            isOneToOne: false
            referencedRelation: "gigs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_tags: {
        Row: {
          category: Database["public"]["Enums"]["tag_category"]
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          sort_order: number | null
          updated_at: string
        }
        Insert: {
          category: Database["public"]["Enums"]["tag_category"]
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          sort_order?: number | null
          updated_at?: string
        }
        Update: {
          category?: Database["public"]["Enums"]["tag_category"]
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          sort_order?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      rate_limits: {
        Row: {
          action_type: string
          attempt_count: number
          created_at: string
          id: string
          identifier: string
          updated_at: string
          window_start: string
        }
        Insert: {
          action_type: string
          attempt_count?: number
          created_at?: string
          id?: string
          identifier: string
          updated_at?: string
          window_start?: string
        }
        Update: {
          action_type?: string
          attempt_count?: number
          created_at?: string
          id?: string
          identifier?: string
          updated_at?: string
          window_start?: string
        }
        Relationships: []
      }
      reports: {
        Row: {
          admin_notes: string | null
          category: Database["public"]["Enums"]["report_category"]
          created_at: string
          description: string
          evidence_urls: string[] | null
          id: string
          is_anonymous: boolean
          metadata: Json | null
          reported_user_id: string
          reporter_id: string | null
          resolution_summary: string | null
          reviewed_at: string | null
          reviewed_by_admin_id: string | null
          severity: Database["public"]["Enums"]["report_severity"]
          status: Database["public"]["Enums"]["report_status"]
          title: string
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          category: Database["public"]["Enums"]["report_category"]
          created_at?: string
          description: string
          evidence_urls?: string[] | null
          id?: string
          is_anonymous?: boolean
          metadata?: Json | null
          reported_user_id: string
          reporter_id?: string | null
          resolution_summary?: string | null
          reviewed_at?: string | null
          reviewed_by_admin_id?: string | null
          severity?: Database["public"]["Enums"]["report_severity"]
          status?: Database["public"]["Enums"]["report_status"]
          title: string
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          category?: Database["public"]["Enums"]["report_category"]
          created_at?: string
          description?: string
          evidence_urls?: string[] | null
          id?: string
          is_anonymous?: boolean
          metadata?: Json | null
          reported_user_id?: string
          reporter_id?: string | null
          resolution_summary?: string | null
          reviewed_at?: string | null
          reviewed_by_admin_id?: string | null
          severity?: Database["public"]["Enums"]["report_severity"]
          status?: Database["public"]["Enums"]["report_status"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reports_reported_user_id_fkey"
            columns: ["reported_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_reporter_id_fkey"
            columns: ["reporter_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_reviewed_by_admin_id_fkey"
            columns: ["reviewed_by_admin_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      security_audit_log: {
        Row: {
          action_type: string
          created_at: string
          details: Json | null
          id: string
          ip_address: unknown | null
          resource_id: string | null
          resource_type: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action_type: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          resource_id?: string | null
          resource_type: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action_type?: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          resource_id?: string | null
          resource_type?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "security_audit_log_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profile_tags: {
        Row: {
          created_at: string
          id: string
          tag_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          tag_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          tag_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_profile_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "profile_tags"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_profile_tags_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_quality_scores: {
        Row: {
          community_feedback_score: number
          compliance_score: number
          created_at: string
          id: string
          last_calculated_at: string
          overall_score: number
          profile_completeness_score: number
          resolved_reports_count: number
          total_reports_count: number
          updated_at: string
          user_id: string
        }
        Insert: {
          community_feedback_score?: number
          compliance_score?: number
          created_at?: string
          id?: string
          last_calculated_at?: string
          overall_score?: number
          profile_completeness_score?: number
          resolved_reports_count?: number
          total_reports_count?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          community_feedback_score?: number
          compliance_score?: number
          created_at?: string
          id?: string
          last_calculated_at?: string
          overall_score?: number
          profile_completeness_score?: number
          resolved_reports_count?: number
          total_reports_count?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_quality_scores_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          about_story: string | null
          accepts_intros: boolean | null
          availability_status: string | null
          avatar_url: string | null
          banner_background_color: string | null
          banner_image_url: string | null
          bio: string | null
          company_name: string | null
          created_at: string | null
          desired_gig_types: string[] | null
          display_name: string | null
          email: string | null
          expertise_signature: string | null
          gig_posting_restricted: boolean
          id: string
          invite_token_used: string | null
          invited_by_user_id: string | null
          invites_remaining: number
          is_suspended: boolean
          linkedin_url: string | null
          location: string | null
          messaging_restricted: boolean
          moderation_notes: string | null
          nda_required: boolean | null
          onboarding_completed: boolean
          past_credits: string | null
          poster_type: Database["public"]["Enums"]["poster_type"] | null
          public_profile: boolean
          rate_range_max: number | null
          rate_range_min: number | null
          requires_nda: boolean | null
          role: Database["public"]["Enums"]["user_role"] | null
          search_visibility_reduced: boolean
          signature_quote: string | null
          skills: string[] | null
          smart_url_slug: string | null
          social_links: Json | null
          suspension_expires_at: string | null
          timeline_expectations: string | null
          typical_budget_max: number | null
          typical_budget_min: number | null
          updated_at: string | null
          website_url: string | null
        }
        Insert: {
          about_story?: string | null
          accepts_intros?: boolean | null
          availability_status?: string | null
          avatar_url?: string | null
          banner_background_color?: string | null
          banner_image_url?: string | null
          bio?: string | null
          company_name?: string | null
          created_at?: string | null
          desired_gig_types?: string[] | null
          display_name?: string | null
          email?: string | null
          expertise_signature?: string | null
          gig_posting_restricted?: boolean
          id: string
          invite_token_used?: string | null
          invited_by_user_id?: string | null
          invites_remaining?: number
          is_suspended?: boolean
          linkedin_url?: string | null
          location?: string | null
          messaging_restricted?: boolean
          moderation_notes?: string | null
          nda_required?: boolean | null
          onboarding_completed?: boolean
          past_credits?: string | null
          poster_type?: Database["public"]["Enums"]["poster_type"] | null
          public_profile?: boolean
          rate_range_max?: number | null
          rate_range_min?: number | null
          requires_nda?: boolean | null
          role?: Database["public"]["Enums"]["user_role"] | null
          search_visibility_reduced?: boolean
          signature_quote?: string | null
          skills?: string[] | null
          smart_url_slug?: string | null
          social_links?: Json | null
          suspension_expires_at?: string | null
          timeline_expectations?: string | null
          typical_budget_max?: number | null
          typical_budget_min?: number | null
          updated_at?: string | null
          website_url?: string | null
        }
        Update: {
          about_story?: string | null
          accepts_intros?: boolean | null
          availability_status?: string | null
          avatar_url?: string | null
          banner_background_color?: string | null
          banner_image_url?: string | null
          bio?: string | null
          company_name?: string | null
          created_at?: string | null
          desired_gig_types?: string[] | null
          display_name?: string | null
          email?: string | null
          expertise_signature?: string | null
          gig_posting_restricted?: boolean
          id?: string
          invite_token_used?: string | null
          invited_by_user_id?: string | null
          invites_remaining?: number
          is_suspended?: boolean
          linkedin_url?: string | null
          location?: string | null
          messaging_restricted?: boolean
          moderation_notes?: string | null
          nda_required?: boolean | null
          onboarding_completed?: boolean
          past_credits?: string | null
          poster_type?: Database["public"]["Enums"]["poster_type"] | null
          public_profile?: boolean
          rate_range_max?: number | null
          rate_range_min?: number | null
          requires_nda?: boolean | null
          role?: Database["public"]["Enums"]["user_role"] | null
          search_visibility_reduced?: boolean
          signature_quote?: string | null
          skills?: string[] | null
          smart_url_slug?: string | null
          social_links?: Json | null
          suspension_expires_at?: string | null
          timeline_expectations?: string | null
          typical_budget_max?: number | null
          typical_budget_min?: number | null
          updated_at?: string | null
          website_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_invite_token_used_fkey"
            columns: ["invite_token_used"]
            isOneToOne: false
            referencedRelation: "invites"
            referencedColumns: ["token"]
          },
          {
            foreignKeyName: "users_invited_by_user_id_fkey"
            columns: ["invited_by_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_rate_limit: {
        Args: {
          p_identifier: string
          p_action_type: string
          p_max_attempts?: number
          p_window_minutes?: number
        }
        Returns: boolean
      }
      cleanup_expired_rate_limits: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      current_user_is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      ensure_user_profile: {
        Args: { user_id_param: string; email_param: string }
        Returns: boolean
      }
      generate_smart_url_slug: {
        Args: { display_name_param: string }
        Returns: string
      }
      get_user_role: {
        Args: { user_id: string }
        Returns: Database["public"]["Enums"]["user_role"]
      }
      is_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
      log_security_event: {
        Args: {
          p_user_id: string
          p_action_type: string
          p_resource_type: string
          p_resource_id?: string
          p_details?: Json
          p_ip_address?: unknown
          p_user_agent?: string
        }
        Returns: string
      }
      use_invite_token: {
        Args: { token_param: string; user_id_param: string }
        Returns: boolean
      }
    }
    Enums: {
      application_status:
        | "pending"
        | "reviewed"
        | "accepted"
        | "rejected"
        | "withdrawn"
      brief_status:
        | "draft"
        | "pending_review"
        | "active"
        | "closed"
        | "rejected"
      budget_range:
        | "under_5k"
        | "5k_15k"
        | "15k_50k"
        | "50k_100k"
        | "100k_plus"
        | "equity_only"
      collaboration_status:
        | "pending_payment"
        | "pending_approval"
        | "accepted"
        | "declined"
        | "expired"
      contract_type:
        | "freelance"
        | "consulting"
        | "part_time"
        | "full_time"
        | "equity"
      gig_status: "draft" | "open" | "in_progress" | "completed" | "cancelled"
      moderation_action_type:
        | "warning"
        | "temporary_suspension"
        | "permanent_suspension"
        | "profile_flag"
        | "search_visibility_reduction"
        | "messaging_restriction"
        | "gig_posting_restriction"
      payment_status: "pending" | "completed" | "failed" | "refunded"
      poster_type:
        | "individual"
        | "indie_dev"
        | "studio"
        | "agency"
        | "publisher"
      report_category:
        | "inappropriate_content"
        | "unprofessional_behavior"
        | "fake_credentials"
        | "spam"
        | "harassment"
        | "contract_violations"
        | "quality_concerns"
        | "other"
      report_severity: "low" | "medium" | "high" | "critical"
      report_status: "pending" | "under_review" | "resolved" | "dismissed"
      tag_category: "core_discipline" | "specialty_skill" | "project_type"
      user_role: "gig_poster" | "gig_seeker" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      application_status: [
        "pending",
        "reviewed",
        "accepted",
        "rejected",
        "withdrawn",
      ],
      brief_status: ["draft", "pending_review", "active", "closed", "rejected"],
      budget_range: [
        "under_5k",
        "5k_15k",
        "15k_50k",
        "50k_100k",
        "100k_plus",
        "equity_only",
      ],
      collaboration_status: [
        "pending_payment",
        "pending_approval",
        "accepted",
        "declined",
        "expired",
      ],
      contract_type: [
        "freelance",
        "consulting",
        "part_time",
        "full_time",
        "equity",
      ],
      gig_status: ["draft", "open", "in_progress", "completed", "cancelled"],
      moderation_action_type: [
        "warning",
        "temporary_suspension",
        "permanent_suspension",
        "profile_flag",
        "search_visibility_reduction",
        "messaging_restriction",
        "gig_posting_restriction",
      ],
      payment_status: ["pending", "completed", "failed", "refunded"],
      poster_type: ["individual", "indie_dev", "studio", "agency", "publisher"],
      report_category: [
        "inappropriate_content",
        "unprofessional_behavior",
        "fake_credentials",
        "spam",
        "harassment",
        "contract_violations",
        "quality_concerns",
        "other",
      ],
      report_severity: ["low", "medium", "high", "critical"],
      report_status: ["pending", "under_review", "resolved", "dismissed"],
      tag_category: ["core_discipline", "specialty_skill", "project_type"],
      user_role: ["gig_poster", "gig_seeker", "admin"],
    },
  },
} as const
