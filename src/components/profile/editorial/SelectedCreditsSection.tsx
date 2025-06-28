
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink } from 'lucide-react';
import { CaseStudy } from '@/hooks/useCaseStudies';

interface SelectedCreditsSectionProps {
  caseStudies: CaseStudy[];
  pastCredits?: string;
}

export function SelectedCreditsSection({ caseStudies, pastCredits }: SelectedCreditsSectionProps) {
  const visibleCaseStudies = caseStudies.filter(cs => cs.is_visible).slice(0, 3);

  if (visibleCaseStudies.length === 0 && !pastCredits) {
    return (
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4 font-display">
              SELECTED CREDITS
            </h2>
          </div>
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-12 text-center">
              <p className="text-white/50 italic">
                Portfolio highlights coming soon...
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4 font-display">
            SELECTED CREDITS
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            Notable projects and contributions
          </p>
        </div>

        {/* Case Studies Grid */}
        {visibleCaseStudies.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {visibleCaseStudies.map((caseStudy) => (
              <Card key={caseStudy.id} className="bg-white/5 border-white/10 group hover:bg-white/10 transition-all duration-300">
                {/* Project Image */}
                {caseStudy.media_url && (
                  <div className="aspect-video overflow-hidden rounded-t-lg">
                    <img
                      src={caseStudy.media_url}
                      alt={caseStudy.project_name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                
                <CardContent className="p-6">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-white mb-2">
                      {caseStudy.project_name}
                    </h3>
                    {caseStudy.studio_name && (
                      <p className="text-white/60 mb-1">{caseStudy.studio_name}</p>
                    )}
                    {caseStudy.role_played && (
                      <Badge variant="outline" className="text-white/70 border-white/20 mb-3">
                        {caseStudy.role_played}
                      </Badge>
                    )}
                    {caseStudy.timeline && (
                      <p className="text-white/50 text-sm mb-3">{caseStudy.timeline}</p>
                    )}
                  </div>

                  {/* Key Contributions */}
                  {caseStudy.contributions && caseStudy.contributions.length > 0 && (
                    <div className="mb-4">
                      <p className="text-white/60 text-sm mb-2">Key Contributions:</p>
                      <ul className="space-y-1">
                        {caseStudy.contributions.slice(0, 2).map((contribution, index) => (
                          <li key={index} className="text-white/70 text-sm flex items-start">
                            <span className="mr-2 mt-1.5 w-1 h-1 bg-white/40 rounded-full flex-shrink-0" />
                            {contribution}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* External Link */}
                  {caseStudy.external_link && (
                    <a
                      href={caseStudy.external_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      View Project <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Past Credits Text */}
        {pastCredits && (
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-8">
              <h3 className="text-xl font-bold text-white mb-4">Additional Credits</h3>
              <div className="prose prose-invert max-w-none">
                {pastCredits.split('\n').map((line, index) => (
                  <p key={index} className="text-white/70 mb-2 last:mb-0">
                    {line}
                  </p>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
}
