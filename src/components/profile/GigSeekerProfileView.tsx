import { AuthUser } from '@/types/auth';
import { CaseStudy } from '@/hooks/useCaseStudies';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MapPin, Clock, Star, ExternalLink, Mail } from 'lucide-react';
import { AvailabilityIndicator } from './AvailabilityIndicator';
import { ProfileContactForm } from './ProfileContactForm';
import { useState } from 'react';

interface InviterInfo {
  id: string;
  displayName: string;
  avatarUrl?: string;
  smartUrlSlug?: string;
  publicProfile: boolean;
}

interface GigSeekerProfileViewProps {
  user: AuthUser;
  caseStudies: CaseStudy[];
  inviter?: InviterInfo | null;
}

export function GigSeekerProfileView({ user, caseStudies, inviter }: GigSeekerProfileViewProps) {
  const [showContactForm, setShowContactForm] = useState(false);
  
  // Get years of experience or calculate from data
  const yearsExperience = user.years_experience || (user.past_credits ? '5+' : '3+');
  
  // Filter visible case studies
  const visibleCaseStudies = caseStudies.filter(cs => cs.is_visible);

  return (
    <div className="min-h-screen bg-background">
      {/* Clean Header */}
      <header className="border-b border-border bg-surface/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-xl font-bold text-white">BLACKLABEL</div>
          </div>
        </div>
      </header>

      {/* Profile Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Profile Header Section */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row items-start gap-8">
            <Avatar className="w-24 h-24 border-2 border-border">
              <AvatarImage src={user.avatarUrl} />
              <AvatarFallback className="text-2xl bg-surface">
                {user.displayName.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-white mb-2">{user.displayName}</h1>
              <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-4">
                {user.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{user.location}</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{yearsExperience} years experience</span>
                </div>
                <AvailabilityIndicator status={user.availability_status} />
              </div>
              
              {user.signature_quote && (
                <p className="text-lg text-white/80 italic mb-6 max-w-2xl">
                  "{user.signature_quote}"
                </p>
              )}
            </div>
            
            <div className="flex flex-col gap-4">
              <Button 
                onClick={() => setShowContactForm(true)}
                className="bg-white text-black hover:bg-white/90"
              >
                <Mail className="w-4 h-4 mr-2" />
                Ready to collaborate?
              </Button>
              
              {user.rate_range_min && user.rate_range_max && (
                <div className="text-center">
                  <div className="text-sm text-muted-foreground">Project Rate</div>
                  <div className="text-white font-semibold">
                    ${user.rate_range_min.toLocaleString()} - ${user.rate_range_max.toLocaleString()}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* About Section */}
        {user.about_story && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">About</h2>
            <Card className="bg-surface/50 border-border">
              <CardContent className="p-8">
                <div className="prose prose-lg max-w-none text-white/80">
                  {user.about_story.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-4 last:mb-0 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>
        )}

        {/* Awards & Accolades Section */}
        {user.awards && user.awards.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">Awards & Accolades</h2>
            <div className="flex flex-wrap gap-3">
              {user.awards.map((award, index) => (
                <Badge key={index} variant="secondary" className="bg-white/10 text-white border-white/20 px-4 py-2">
                  <Star className="w-4 h-4 mr-2" />
                  {award}
                </Badge>
              ))}
            </div>
          </section>
        )}

        {/* Core Disciplines Section */}
        {user.core_disciplines && user.core_disciplines.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">Core Disciplines</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {user.core_disciplines.slice(0, 3).map((discipline, index) => (
                <Card key={index} className="bg-surface/50 border-border">
                  <CardContent className="p-6 text-center">
                    <div className="text-lg font-semibold text-white mb-2">{discipline}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Background & Specialty Skills */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Skills Section */}
          {user.skills && user.skills.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-white mb-6">Specialty Skills</h2>
              <Card className="bg-surface/50 border-border">
                <CardContent className="p-6">
                  <div className="flex flex-wrap gap-2">
                    {user.skills.map((skill, index) => (
                      <Badge key={index} variant="outline" className="border-white/20 text-white">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </section>
          )}

          {/* Experience Section */}
          {user.past_credits && (
            <section>
              <h2 className="text-2xl font-bold text-white mb-6">Experience</h2>
              <Card className="bg-surface/50 border-border">
                <CardContent className="p-6">
                  <div className="text-white/80 whitespace-pre-line">
                    {user.past_credits}
                  </div>
                </CardContent>
              </Card>
            </section>
          )}
        </div>

        {/* Project Showcase Section */}
        {visibleCaseStudies.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">Project Showcase</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {visibleCaseStudies.map((caseStudy) => (
                <Card key={caseStudy.id} className="bg-surface/50 border-border overflow-hidden hover:bg-surface/70 transition-colors">
                  {caseStudy.media_url && (
                    <div className="aspect-video bg-muted">
                      <img 
                        src={caseStudy.media_url} 
                        alt={caseStudy.project_name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-white mb-2">{caseStudy.project_name}</h3>
                    {caseStudy.studio_name && (
                      <p className="text-sm text-muted-foreground mb-2">{caseStudy.studio_name}</p>
                    )}
                    {caseStudy.role_played && (
                      <p className="text-sm text-white/70 mb-3">{caseStudy.role_played}</p>
                    )}
                    {caseStudy.external_link && (
                      <a 
                        href={caseStudy.external_link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-sm text-white hover:text-white/80 transition-colors"
                      >
                        <ExternalLink className="w-3 h-3 mr-1" />
                        View Project
                      </a>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Work Preferences Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Available For */}
          {user.available_for && user.available_for.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-white mb-6">Available For</h2>
              <Card className="bg-surface/50 border-border">
                <CardContent className="p-6">
                  <div className="space-y-3">
                    {user.available_for.map((item, index) => (
                      <div key={index} className="flex items-center text-white/80">
                        <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                        {item}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </section>
          )}

          {/* Work Style */}
          {user.work_style && user.work_style.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-white mb-6">Work Style</h2>
              <Card className="bg-surface/50 border-border">
                <CardContent className="p-6">
                  <div className="space-y-3">
                    {user.work_style.map((style, index) => (
                      <div key={index} className="flex items-center text-white/80">
                        <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                        {style}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </section>
          )}
        </div>

        {/* Social Links */}
        {user.social_links && Object.keys(user.social_links).length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">Connect</h2>
            <div className="flex flex-wrap gap-4">
              {Object.entries(user.social_links).map(([platform, url]) => (
                <a
                  key={platform}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-surface/50 border border-border rounded-lg text-white hover:bg-surface transition-colors"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  {platform.charAt(0).toUpperCase() + platform.slice(1)}
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Inviter Credit */}
        {inviter && (
          <section className="mb-12">
            <Card className="bg-surface/30 border-border/50">
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">
                  Invited to join by{' '}
                  <span className="text-white font-medium">{inviter.displayName}</span>
                </p>
              </CardContent>
            </Card>
          </section>
        )}
      </div>

      {/* Contact Form Modal */}
      <ProfileContactForm
        profileUserId={user.id}
        profileName={user.displayName}
        isOpen={showContactForm}
        onClose={() => setShowContactForm(false)}
      />
    </div>
  );
}