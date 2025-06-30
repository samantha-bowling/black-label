
import { Pill } from '@/components/ui/pill';
import { SectionHeader } from '@/components/ui/section-header';
import { AuthUser } from '@/types/auth';

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
    <section className="max-w-5xl mx-auto px-4 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Available For */}
        {availableFor.length > 0 && (
          <div>
            <SectionHeader 
              title="AVAILABLE FOR" 
              level={3}
              className="mb-4"
            />
            <div className="flex flex-wrap gap-3">
              {availableFor.map((type, index) => (
                <Pill 
                  key={index}
                  variant="collaboration"
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
            <SectionHeader 
              title="WORK STYLE" 
              level={3}
              className="mb-4"
            />
            <div className="flex flex-wrap gap-3">
              {workStyle.map((style, index) => (
                <Pill 
                  key={index}
                  variant="collaboration"
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
