
import { ExternalLink, Globe, Linkedin, Github } from 'lucide-react';
import { AuthUser } from '@/types/auth';

interface AboutSectionProps {
  user: AuthUser;
}

export function AboutSection({ user }: AboutSectionProps) {
  const socialLinks = [
    { key: 'website', url: user.website_url, icon: Globe, label: 'Website' },
    { key: 'linkedin', url: user.linkedin_url, icon: Linkedin, label: 'LinkedIn' },
    ...(user.social_links ? Object.entries(user.social_links).map(([platform, url]) => ({
      key: platform,
      url,
      icon: platform === 'github' ? Github : ExternalLink,
      label: platform.charAt(0).toUpperCase() + platform.slice(1)
    })) : [])
  ].filter(link => link.url);

  if (!user.bio && !user.about_story && socialLinks.length === 0) {
    return null;
  }

  return (
    <section className="max-w-4xl mx-auto px-4 mt-4 mb-6">
      {/* Bio */}
      {(user.bio || user.about_story) && (
        <div className="mb-4">
          <p className="text-white/80 text-lg leading-relaxed">
            {user.about_story || user.bio}
          </p>
        </div>
      )}

      {/* Social Links */}
      {socialLinks.length > 0 && (
        <div className="flex gap-3 flex-wrap">
          {socialLinks.map((link) => {
            const IconComponent = link.icon;
            return (
              <a
                key={link.key}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
              >
                <IconComponent className="w-4 h-4" />
                <span className="text-sm">{link.label}</span>
              </a>
            );
          })}
        </div>
      )}
    </section>
  );
}
