
import { ExternalLink } from 'lucide-react';
import { SectionHeader } from '@/components/ui/section-header';
import { Pill } from '@/components/ui/pill';
import { AuthUser, ProjectShowcase } from '@/types/auth';

interface ProjectShowcaseSectionProps {
  user: AuthUser;
}

export function ProjectShowcaseSection({ user }: ProjectShowcaseSectionProps) {
  const projects = user.project_showcase || [];

  if (projects.length === 0) {
    return null;
  }

  // Show max 3 projects
  const displayProjects = projects.slice(0, 3);

  return (
    <section className="max-w-5xl mx-auto px-4 mb-8">
      <SectionHeader 
        title="PROJECT SHOWCASE" 
        level={2}
        className="mb-6"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {displayProjects.map((project, index) => (
          <div key={index} className="space-y-3">
            {/* Project Header */}
            <div>
              <div className="flex items-start justify-between gap-2 mb-1">
                <h3 className="text-white font-bold text-lg leading-tight">
                  {project.name}
                </h3>
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/60 hover:text-white transition-colors flex-shrink-0"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
              
              {/* Studio Name (if available) */}
              {project.studio && (
                <p className="text-white/60 text-sm font-medium mb-1">
                  {project.studio}
                </p>
              )}
              
              {/* Role + Year */}
              <div className="text-white/50 text-sm mb-2">
                {project.role && project.dates ? (
                  <span>{project.role} • {project.dates}</span>
                ) : project.role ? (
                  <span>{project.role}</span>
                ) : project.dates ? (
                  <span>{project.dates}</span>
                ) : null}
              </div>
            </div>

            {/* Platforms (if available) */}
            {project.platforms && (
              <div className="mb-2">
                <Pill variant="neutral" size="sm">
                  {project.platforms}
                </Pill>
              </div>
            )}

            {/* Description */}
            {project.description && (
              <p className="text-white/80 text-sm leading-relaxed">
                {project.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
