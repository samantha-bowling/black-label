
import { Pill } from '@/components/ui/pill';
import { SectionHeader } from '@/components/ui/section-header';
import { AuthUser } from '@/types/auth';
import { Award } from 'lucide-react';

interface AwardsSectionProps {
  user: AuthUser;
}

export function AwardsSection({ user }: AwardsSectionProps) {
  const awards = user.awards || [];

  if (awards.length === 0) {
    return null;
  }

  return (
    <section className="max-w-5xl mx-auto px-4 mb-8">
      <SectionHeader 
        title="AWARDS AND ACCOLADES" 
        level={2}
        className="mb-6"
      />
      
      <div className="flex flex-wrap gap-3">
        {awards.slice(0, 5).map((award, index) => (
          <Pill 
            key={index}
            variant="neutral"
            size="md"
          >
            {award}
          </Pill>
        ))}
      </div>
    </section>
  );
}
