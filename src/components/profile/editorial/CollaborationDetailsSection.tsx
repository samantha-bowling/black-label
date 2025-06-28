
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AvailabilityIndicator } from '@/components/profile/AvailabilityIndicator';
import { AuthUser } from '@/types/auth';

interface CollaborationDetailsSectionProps {
  user: AuthUser;
}

export function CollaborationDetailsSection({ user }: CollaborationDetailsSectionProps) {
  const hasCollaborationInfo = 
    user.availability_status || 
    user.rate_range_min || 
    user.desired_gig_types?.length || 
    user.accepts_intros || 
    user.requires_nda;

  if (!hasCollaborationInfo) {
    return null;
  }

  return (
    <section className="py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-white mb-4 font-display">
            COLLABORATION DETAILS
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Availability & Rates */}
          {(user.availability_status || user.rate_range_min) && (
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white text-lg">Availability & Rates</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {user.availability_status && (
                  <div className="flex items-center justify-between">
                    <span className="text-white/70">Status</span>
                    <AvailabilityIndicator status={user.availability_status} />
                  </div>
                )}
                
                {user.rate_range_min && user.rate_range_max && (
                  <div className="flex items-center justify-between">
                    <span className="text-white/70">Rate Range</span>
                    <span className="text-white font-medium">
                      ${user.rate_range_min.toLocaleString()} - ${user.rate_range_max.toLocaleString()}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Work Style */}
          {(user.accepts_intros || user.requires_nda) && (
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white text-lg">Work Style</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="text-white/70 border-white/20">
                    Remote OK
                  </Badge>
                  <Badge variant="outline" className="text-white/70 border-white/20">
                    Async Friendly
                  </Badge>
                  {user.requires_nda && (
                    <Badge variant="outline" className="text-white/70 border-white/20">
                      NDA Required
                    </Badge>
                  )}
                  {user.accepts_intros && (
                    <Badge variant="outline" className="text-white/70 border-white/20">
                      Open to Intros
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Engagement Types */}
          {user.desired_gig_types && user.desired_gig_types.length > 0 && (
            <Card className="bg-white/5 border-white/10 md:col-span-2">
              <CardHeader>
                <CardTitle className="text-white text-lg">Engagement Types</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {user.desired_gig_types.map((type, index) => (
                    <Badge 
                      key={index} 
                      className="bg-emerald-900/50 text-emerald-100 hover:bg-emerald-800/50"
                    >
                      {type}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </section>
  );
}
