
import { Pill } from '@/components/ui/pill';
import { SectionHeader } from '@/components/ui/section-header';
import { AuthUser } from '@/types/auth';
import { Briefcase } from 'lucide-react';

interface WorkPreferencesSectionProps {
  user: AuthUser;
}

export function WorkPreferencesSection({ user }: WorkPreferencesSectionProps) {
  const availableFor = user.available_for || [];
  const workStyle = user.work_style || [];

  if (availableFor.length === 0 && workStyle.length === 0) {
    return null;
  }

  return (
    <section className="max-w-4xl mx-auto px-4 mb-8">
      <SectionHeader 
        title="WORK PREFERENCES" 
        level={2}
        className="mb-6 flex items-center gap-2"
        icon={<Briefcase className="w-5 h-5" />}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Available For */}
        {availableFor.length > 0 && (
          <div>
            <h3 className="text-lg font-medium mb-3 text-white/90">Available For</h3>
            <div className="flex flex-wrap gap-2">
              {availableFor.map((type, index) => (
                <Pill 
                  key={index}
                  variant="primary"
                >
                  {type}
                </Pill>
              ))}
            </div>
          </div>
        )}

        {/* Work Style */}
        {workStyle.length > 0 && (
          <div>
            <h3 className="text-lg font-medium mb-3 text-white/90">Work Style</h3>
            <div className="flex flex-wrap gap-2">
              {workStyle.map((style, index) => (
                <Pill 
                  key={index}
                  variant="info"
                >
                  {style}
                </Pill>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
