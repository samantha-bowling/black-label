
import { ExternalLink } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
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
      <h2 className="text-2xl font-bold text-white mb-6">Featured Projects</h2>
      
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
                  <span className="text-white/70 text-sm font-medium bg-white/10 px-2 py-1 rounded">
                    {project.role}
                  </span>
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
