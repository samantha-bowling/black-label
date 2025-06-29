
import { Pill } from '@/components/ui/pill';
import { SectionHeader } from '@/components/ui/section-header';
import { AuthUser } from '@/types/auth';

interface ProfileDNASectionProps {
  user: AuthUser;
}

export function ProfileDNASection({ user }: ProfileDNASectionProps) {
  // Map user data to DNA categories
  const disciplines = user.skills?.slice(0, 3) || [];
  const projectTypes = user.desired_gig_types?.slice(0, 5) || [];
  const specialties = user.skills?.slice(3, 10) || [];

  if (disciplines.length === 0 && projectTypes.length === 0 && specialties.length === 0) {
    return null;
  }

  return (
    <section className="max-w-4xl mx-auto px-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Disciplines */}
        {disciplines.length > 0 && (
          <div>
            <SectionHeader 
              title="DISCIPLINES" 
              level={3}
              className="mb-4"
            />
            <div className="flex flex-wrap gap-2">
              {disciplines.map((discipline, index) => (
                <Pill 
                  key={index}
                  variant="secondary"
                >
                  {discipline}
                </Pill>
              ))}
            </div>
          </div>
        )}

        {/* Project Types */}
        {projectTypes.length > 0 && (
          <div>
            <SectionHeader 
              title="PROJECT TYPES" 
              level={3}
              className="mb-4"
            />
            <div className="flex flex-wrap gap-2">
              {projectTypes.map((type, index) => (
                <Pill 
                  key={index}
                  variant="secondary"
                >
                  {type}
                </Pill>
              ))}
            </div>
          </div>
        )}

        {/* Specialties */}
        {specialties.length > 0 && (
          <div>
            <SectionHeader 
              title="SPECIALTIES" 
              level={3}
              className="mb-4"
            />
            <div className="flex flex-wrap gap-2">
              {specialties.map((specialty, index) => (
                <Pill 
                  key={index}
                  variant="secondary"
                >
                  {specialty}
                </Pill>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
