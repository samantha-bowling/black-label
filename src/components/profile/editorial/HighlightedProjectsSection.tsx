
import { CaseStudy } from '@/hooks/useCaseStudies';

interface HighlightedProjectsSectionProps {
  caseStudies: CaseStudy[];
}

export function HighlightedProjectsSection({ caseStudies }: HighlightedProjectsSectionProps) {
  const visibleProjects = caseStudies.filter(cs => cs.is_visible).slice(0, 3);

  if (visibleProjects.length === 0) {
    return null;
  }

  return (
    <section className="max-w-4xl mx-auto px-4 mb-6">
      <h2 className="text-white font-semibold mb-4 text-lg">Highlighted Projects</h2>
      
      <div className="space-y-6">
        {visibleProjects.map((project) => (
          <div key={project.id} className="border-l-2 border-white/20 pl-4">
            <div className="space-y-2">
              <div>
                <h3 className="text-white font-bold text-lg">{project.project_name}</h3>
                {project.studio_name && (
                  <p className="text-white/60">{project.studio_name}</p>
                )}
                <div className="flex items-center gap-2 text-white/50 text-sm">
                  {project.role_played && <span>{project.role_played}</span>}
                  {project.timeline && <span>• {project.timeline}</span>}
                </div>
              </div>
              
              {project.contributions && project.contributions.length > 0 && (
                <p className="text-white/70 text-sm leading-relaxed">
                  {project.contributions.slice(0, 2).join('. ')}.
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
