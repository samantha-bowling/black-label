
import { useFeatureFlags } from '@/hooks/useFeatureFlags';
import { useCaseStudies } from '@/hooks/useCaseStudies';
import { CustomBannerHeader } from './CustomBannerHeader';
import { CaseStudyCard } from './CaseStudyCard';
import { CollaborationBadges } from './CollaborationBadges';
import { AvailabilityIndicator } from './AvailabilityIndicator';
import { InviterDisplay } from './InviterDisplay';
import { AuthUser } from '@/types/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, MapPin, Calendar } from 'lucide-react';

interface InviterInfo {
  id: string;
  displayName: string;
  avatarUrl?: string;
  smartUrlSlug?: string;
  publicProfile: boolean;
}

interface EnhancedProfileViewProps {
  user: AuthUser;
  inviter?: InviterInfo | null;
  isOwner?: boolean;
}

export function EnhancedProfileView({ user, inviter, isOwner = false }: EnhancedProfileViewProps) {
  const { isEnabled } = useFeatureFlags();
  const { caseStudies, isLoading: caseStudiesLoading } = useCaseStudies(user.id);
  
  // Return basic profile if enhanced profiles are not enabled
  if (!isEnabled('enhanced_profiles')) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-gradient-to-r from-purple-900 to-blue-900 h-32 rounded-lg mb-6" />
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-2">{user.displayName}</h1>
          {user.bio && <p className="text-muted-foreground">{user.bio}</p>}
        </div>
        <Card>
          <CardContent className="p-6">
            <p className="text-muted-foreground">Enhanced profiles are not yet available.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const visibleCaseStudies = isOwner 
    ? caseStudies 
    : caseStudies.filter(cs => cs.is_visible);

  return (
    <div className="max-w-6xl mx-auto">
      {/* Custom Banner Header */}
      <CustomBannerHeader 
        user={{
          id: user.id,
          displayName: user.displayName,
          avatarUrl: user.avatarUrl,
          banner_image_url: user.banner_image_url,
          banner_background_color: user.banner_background_color,
          signature_quote: user.signature_quote,
        }}
        isOwner={isOwner}
      />

      {/* Content Below Banner */}
      <div className="mt-20 px-6 space-y-8">
        {/* Inviter Display - Show at the top for non-owners */}
        {!isOwner && inviter && (
          <div className="flex justify-center">
            <InviterDisplay inviter={inviter} className="max-w-sm" />
          </div>
        )}

        {/* Profile Info Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* About Story */}
            {user.about_story && (
              <Card>
                <CardHeader>
                  <CardTitle>About</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none">
                    {user.about_story.split('\n').map((paragraph, index) => (
                      <p key={index} className="mb-3 last:mb-0">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Skills */}
            {user.skills && user.skills.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Skills & Expertise</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {user.skills.map((skill, index) => (
                      <Badge key={index} variant="outline">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  {user.expertise_signature && (
                    <div className="mt-4 p-3 bg-muted rounded-lg">
                      <p className="text-sm font-medium text-muted-foreground">
                        "{user.expertise_signature}"
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Show Inviter Display in sidebar for owners */}
            {isOwner && inviter && (
              <InviterDisplay inviter={inviter} />
            )}

            {/* Availability */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium">Availability</h3>
                  <AvailabilityIndicator status={user.availability_status} />
                </div>
                {user.rate_range_min && user.rate_range_max && (
                  <p className="text-sm text-muted-foreground">
                    ${user.rate_range_min.toLocaleString()} - ${user.rate_range_max.toLocaleString()} per project
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Collaboration Options */}
            <CollaborationBadges userId={user.id} isOwner={isOwner} />

            {/* Social Links */}
            {user.social_links && Object.keys(user.social_links).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Connect</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {Object.entries(user.social_links).map(([platform, url]) => (
                    <a
                      key={platform}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-sm text-primary hover:text-primary/80 transition-colors"
                    >
                      <ExternalLink className="w-3 h-3 mr-2" />
                      {platform.charAt(0).toUpperCase() + platform.slice(1)}
                    </a>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Case Studies */}
        {(visibleCaseStudies.length > 0 || isOwner) && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Portfolio</h2>
              {isOwner && (
                <p className="text-sm text-muted-foreground">
                  {caseStudies.filter(cs => !cs.is_visible).length > 0 && 
                    `(${caseStudies.filter(cs => !cs.is_visible).length} hidden)`
                  }
                </p>
              )}
            </div>
            
            {caseStudiesLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-64 bg-muted animate-pulse rounded-lg" />
                ))}
              </div>
            ) : visibleCaseStudies.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {visibleCaseStudies.map((caseStudy) => (
                  <CaseStudyCard
                    key={caseStudy.id}
                    caseStudy={caseStudy}
                    isOwner={isOwner}
                  />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground">
                    {isOwner 
                      ? "Start building your portfolio by adding your first case study."
                      : "No portfolio items to display yet."
                    }
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
