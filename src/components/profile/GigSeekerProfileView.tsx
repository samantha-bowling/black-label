import { AuthUser } from '@/types/auth';
import { CaseStudy } from '@/hooks/useCaseStudies';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MapPin, Clock, Star, ExternalLink, Mail, Briefcase, Code, Gamepad2, Trophy, MessageSquare, Calendar } from 'lucide-react';
import { AvailabilityIndicator } from './AvailabilityIndicator';
import { ProfileContactForm } from './ProfileContactForm';
import { ProfileSection } from './professional/ProfileSection';
import { ExperienceTimeline } from './professional/ExperienceTimeline';
import { SkillsMatrix } from './professional/SkillsMatrix';
import { GameCreditsShowcase } from './professional/GameCreditsShowcase';
import { ProfileCompletionIndicator } from './professional/ProfileCompletionIndicator';
import { useWorkExperience } from '@/hooks/useWorkExperience';
import { useTechnicalSkills } from '@/hooks/useTechnicalSkills';
import { useGameCredits } from '@/hooks/useGameCredits';
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
  
  // Fetch professional data
  const { workExperience } = useWorkExperience(user.id);
  const { skills } = useTechnicalSkills(user.id);
  const { credits } = useGameCredits(user.id);
  
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
        {/* LinkedIn-Style Hero Section */}
        <div className="mb-12">
          <div className="relative">
            {/* Banner Background */}
            <div 
              className="h-48 rounded-t-lg"
              style={{ 
                background: user.banner_background_color || 'linear-gradient(135deg, #1e293b, #334155)' 
              }}
            ></div>
            
            {/* Profile Header Overlay */}
            <div className="relative -mt-16 px-8">
              <div className="flex flex-col md:flex-row items-start gap-8">
                <Avatar className="w-32 h-32 border-4 border-background shadow-xl">
                  <AvatarImage src={user.avatarUrl} />
                  <AvatarFallback className="text-3xl bg-surface">
                    {user.displayName.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 mt-4">
                  <h1 className="text-4xl font-bold text-white mb-2">{user.displayName}</h1>
                  
                  {user.professional_headline && (
                    <p className="text-xl text-primary mb-3">{user.professional_headline}</p>
                  )}
                  
                  <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-4">
                    {user.current_position && user.current_company && (
                      <div className="flex items-center gap-1">
                        <Briefcase className="w-4 h-4" />
                        <span>{user.current_position} at {user.current_company}</span>
                      </div>
                    )}
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
                  
                  {/* Core Disciplines */}
                  {user.core_disciplines && user.core_disciplines.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {user.core_disciplines.slice(0, 3).map((discipline, index) => (
                        <Badge key={index} variant="secondary" className="bg-primary/20 text-primary">
                          {discipline}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col gap-4 mt-4">
                  <Button 
                    onClick={() => setShowContactForm(true)}
                    className="bg-white text-black hover:bg-white/90"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Message
                  </Button>
                  
                  {user.rate_range_min && user.rate_range_max && (
                    <Card className="bg-surface/50 border-border">
                      <CardContent className="p-4 text-center">
                        <div className="text-sm text-muted-foreground">Project Rate</div>
                        <div className="text-white font-semibold">
                          ${user.rate_range_min.toLocaleString()} - ${user.rate_range_max.toLocaleString()}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">{/* About Section */}
            {user.about_story && (
              <ProfileSection
                title="About"
                icon={<MessageSquare className="w-5 h-5" />}
              >
                <div className="prose prose-lg max-w-none text-white/80">
                  {user.about_story.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-4 last:mb-0 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </ProfileSection>
            )}

            {/* Work Experience */}
            <ProfileSection
              title="Experience"
              icon={<Briefcase className="w-5 h-5" />}
              isEmpty={workExperience.length === 0}
            >
              <ExperienceTimeline experiences={workExperience} />
            </ProfileSection>

            {/* Game Credits */}
            <ProfileSection
              title="Game Credits"
              icon={<Gamepad2 className="w-5 h-5" />}
              isEmpty={credits.length === 0}
            >
              <GameCreditsShowcase credits={credits} />
            </ProfileSection>

            {/* Project Showcase (Case Studies) */}
            {visibleCaseStudies.length > 0 && (
              <ProfileSection
                title="Featured Work"
                icon={<Trophy className="w-5 h-5" />}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {visibleCaseStudies.map((caseStudy) => (
                    <Card key={caseStudy.id} className="bg-surface/30 border-border overflow-hidden hover:bg-surface/50 transition-colors">
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
              </ProfileSection>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Profile Completion */}
            <ProfileCompletionIndicator user={user} />

            {/* Skills & Technologies */}
            <ProfileSection
              title="Skills & Technologies"
              icon={<Code className="w-5 h-5" />}
              isEmpty={skills.length === 0}
            >
              <SkillsMatrix skills={skills} />
            </ProfileSection>

            {/* Awards & Recognition */}
            {user.awards && user.awards.length > 0 && (
              <ProfileSection
                title="Awards & Recognition"
                icon={<Trophy className="w-5 h-5" />}
              >
                <div className="space-y-2">
                  {user.awards.map((award, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                      <Star className="w-4 h-4 text-yellow-400" />
                      <span className="text-white">{award}</span>
                    </div>
                  ))}
                </div>
              </ProfileSection>
            )}

            {/* Contact Information */}
            <ProfileSection
              title="Contact & Links"
              icon={<ExternalLink className="w-5 h-5" />}
            >
              <div className="space-y-3">
                {user.portfolio_website && (
                  <a
                    href={user.portfolio_website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span className="text-white">Portfolio Website</span>
                  </a>
                )}
                
                {user.social_links && Object.entries(user.social_links).map(([platform, url]) => (
                  <a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span className="text-white capitalize">{platform}</span>
                  </a>
                ))}
              </div>
            </ProfileSection>
          </div>
        </div>

        {/* Inviter Credit */}
        {inviter && (
          <Card className="bg-surface/30 border-border/50 mt-8">
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">
                Invited to join by{' '}
                <span className="text-white font-medium">{inviter.displayName}</span>
              </p>
            </CardContent>
          </Card>
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