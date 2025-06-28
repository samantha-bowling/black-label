
import { Card, CardContent } from '@/components/ui/card';
import { AuthUser } from '@/types/auth';

interface ProfessionalNarrativeSectionProps {
  user: AuthUser;
}

export function ProfessionalNarrativeSection({ user }: ProfessionalNarrativeSectionProps) {
  if (!user.about_story) {
    return (
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-12">
              <p className="text-white/50 italic">
                "Professional narrative coming soon..."
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4 font-display">
            ABOUT
          </h2>
        </div>

        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-8 md:p-12">
            <div className="prose prose-lg prose-invert max-w-none text-center">
              {user.about_story.split('\n').map((paragraph, index) => (
                <p key={index} className="text-white/80 leading-relaxed mb-6 last:mb-0">
                  {paragraph}
                </p>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
