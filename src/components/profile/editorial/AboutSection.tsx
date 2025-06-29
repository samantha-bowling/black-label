
import { ExternalLink, Globe, Linkedin, Github } from 'lucide-react';
import { AuthUser } from '@/types/auth';

interface AboutSectionProps {
  user: AuthUser;
}

export function AboutSection({ user }: AboutSectionProps) {
  // Clean up and deduplicate social links
  const socialLinksMap = new Map();
  
  // Add social_links first (preferred source)
  if (user.social_links) {
    Object.entries(user.social_links).forEach(([platform, url]) => {
      if (url && url.trim()) {
        socialLinksMap.set(platform, {
          url: url.trim(),
          icon: platform === 'github' ? Github : platform === 'linkedin' ? Linkedin : Globe,
          label: platform.charAt(0).toUpperCase() + platform.slice(1)
        });
      }
    });
  }

  // Add legacy fields if not already present
  if (user.website_url && !socialLinksMap.has('website')) {
    socialLinksMap.set('website', {
      url: user.website_url,
      icon: Globe,
      label: 'Website'
    });
  }

  if (user.linkedin_url && !socialLinksMap.has('linkedin')) {
    socialLinksMap.set('linkedin', {
      url: user.linkedin_url,
      icon: Linkedin,
      label: 'LinkedIn'
    });
  }

  const socialLinks = Array.from(socialLinksMap.values());

  // Truncate bio/about_story to 750 characters
  const bioText = user.about_story || user.bio;
  const truncatedBio = bioText && bioText.length > 750 
    ? bioText.substring(0, 750).trim() + '...'
    : bioText;

  if (!truncatedBio && socialLinks.length === 0) {
    return null;
  }

  return (
    <section className="max-w-4xl mx-auto px-4 mt-4 mb-6">
      {/* Bio */}
      {truncatedBio && (
        <div className="mb-4">
          <p className="text-white/80 text-lg leading-relaxed">
            {truncatedBio}
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
                key={link.label}
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
