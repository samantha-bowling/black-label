
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
    <section className="max-w-4xl mx-auto px-4 mb-8">
      <SectionHeader 
        title="AWARDS & ACCOLADES" 
        level={2}
        className="mb-6 flex items-center gap-2"
        icon={<Award className="w-5 h-5" />}
      />
      
      <div className="flex flex-wrap gap-3">
        {awards.map((award, index) => (
          <Pill 
            key={index}
            variant="success"
            size="lg"
          >
            {award}
          </Pill>
        ))}
      </div>
    </section>
  );
}
