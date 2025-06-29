
import { ExternalLink } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
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

  return (
    <section className="max-w-4xl mx-auto px-4 mb-8">
      <SectionHeader 
        title="FEATURED PROJECTS" 
        level={2}
        className="mb-6"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, index) => (
          <Card key={index} className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
            <CardContent className="p-6">
              {/* Project Header */}
              <div className="mb-4">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-white font-semibold text-lg leading-tight">
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
                
                {project.dates && (
                  <p className="text-white/50 text-sm mt-1">
                    {project.dates}
                  </p>
                )}
              </div>

              {/* Role */}
              {project.role && (
                <div className="mb-3">
                  <Pill variant="primary" size="sm">
                    {project.role}
                  </Pill>
                </div>
              )}

              {/* Description */}
              {project.description && (
                <p className="text-white/80 text-sm leading-relaxed">
                  {project.description}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
