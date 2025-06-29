
import { Pill } from '@/components/ui/pill';
import { SectionHeader } from '@/components/ui/section-header';
import { AuthUser } from '@/types/auth';
import { Briefcase, DollarSign } from 'lucide-react';

interface WorkPreferencesSectionProps {
  user: AuthUser;
}

export function WorkPreferencesSection({ user }: WorkPreferencesSectionProps) {
  const availableFor = user.available_for || [];
  const rateType = user.rate_type;
  const rateMin = user.rate_range_min;
  const rateMax = user.rate_range_max;

  if (availableFor.length === 0 && !rateType && !rateMin && !rateMax) {
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
                  variant="info"
                >
                  {type}
                </Pill>
              ))}
            </div>
          </div>
        )}

        {/* Rate Information */}
        {(rateType || (rateMin && rateMax)) && (
          <div>
            <h3 className="text-lg font-medium mb-3 text-white/90 flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Rate Information
            </h3>
            <div className="space-y-2">
              {rateType && (
                <Pill variant="secondary">
                  {rateType === 'hourly' ? 'Hourly Rate' : 
                   rateType === 'project' ? 'Project Rate' : 'Salary'}
                </Pill>
              )}
              {rateMin && rateMax && (
                <div className="text-white/80">
                  ${rateMin.toLocaleString()} - ${rateMax.toLocaleString()}
                  {rateType === 'hourly' ? '/hour' : rateType === 'project' ? '/project' : '/year'}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
