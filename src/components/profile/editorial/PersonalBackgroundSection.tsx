
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, ExternalLink } from 'lucide-react';
import { AuthUser } from '@/types/auth';

interface PersonalBackgroundSectionProps {
  user: AuthUser;
}

export function PersonalBackgroundSection({ user }: PersonalBackgroundSectionProps) {
  const hasPersonalInfo = user.location || user.social_links || user.website_url || user.linkedin_url;

  if (!hasPersonalInfo) {
    return null;
  }

  return (
    <section className="py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-white mb-4 font-display">
            BACKGROUND
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Location */}
          {user.location && (
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white text-lg flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Location
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/80">{user.location}</p>
              </CardContent>
            </Card>
          )}

          {/* Social Links */}
          {(user.social_links || user.website_url || user.linkedin_url) && (
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white text-lg">Connect</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {user.website_url && (
                  <a
                    href={user.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-white hover:text-white/80 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4 mr-3" />
                    Website
                  </a>
                )}
                
                {user.linkedin_url && (
                  <a
                    href={user.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-white hover:text-white/80 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4 mr-3" />
                    LinkedIn
                  </a>
                )}

                {user.social_links && Object.entries(user.social_links).map(([platform, url]) => (
                  <a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-white hover:text-white/80 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4 mr-3" />
                    {platform.charAt(0).toUpperCase() + platform.slice(1)}
                  </a>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </section>
  );
}
