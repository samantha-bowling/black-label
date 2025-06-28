
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AvailabilityIndicator } from '@/components/profile/AvailabilityIndicator';
import { AuthUser } from '@/types/auth';

interface GigPreferencesSectionProps {
  user: AuthUser;
}

export function GigPreferencesSection({ user }: GigPreferencesSectionProps) {
  return (
    <div className="space-y-6">
      {/* Availability Status */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white text-lg">Current Availability</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <AvailabilityIndicator status={user.availability_status} />
            {user.rate_range_min && user.rate_range_max && (
              <div className="text-right">
                <p className="text-white/60 text-sm">Rate Range</p>
                <p className="text-white font-medium">
                  ${user.rate_range_min?.toLocaleString()} - ${user.rate_range_max?.toLocaleString()}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Work Preferences */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white text-lg">Work Style</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
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

      {/* Engagement Types */}
      {user.desired_gig_types && user.desired_gig_types.length > 0 && (
        <Card className="bg-white/5 border-white/10">
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
  );
}
