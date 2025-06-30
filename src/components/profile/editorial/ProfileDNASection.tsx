
import { Pill } from '@/components/ui/pill';
import { SectionHeader } from '@/components/ui/section-header';
import { AuthUser } from '@/types/auth';

interface ProfileDNASectionProps {
  user: AuthUser;
}

export function ProfileDNASection({ user }: ProfileDNASectionProps) {
  // Map user data to DNA categories
  const coreDisciplines = user.core_disciplines || [];
  const specialtySkills = user.skills || [];
  const background = user.work_style || [];

  if (coreDisciplines.length === 0 && specialtySkills.length === 0 && background.length === 0) {
    return null;
  }

  return (
    <section className="max-w-4xl mx-auto px-4 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Core Disciplines */}
        {coreDisciplines.length > 0 && (
          <div>
            <SectionHeader 
              title="CORE DISCIPLINES" 
              level={3}
              className="mb-4"
            />
            <div className="flex flex-wrap gap-2">
              {coreDisciplines.map((discipline, index) => (
                <Pill 
                  key={index}
                  variant="primary"
                >
                  {discipline}
                </Pill>
              ))}
            </div>
          </div>
        )}

        {/* Specialty Skills */}
        {specialtySkills.length > 0 && (
          <div>
            <SectionHeader 
              title="SPECIALTY SKILLS" 
              level={3}
              className="mb-4"
            />
            <div className="flex flex-wrap gap-2">
              {specialtySkills.map((skill, index) => (
                <Pill 
                  key={index}
                  variant="secondary"
                >
                  {skill}
                </Pill>
              ))}
            </div>
          </div>
        )}

        {/* Background */}
        {background.length > 0 && (
          <div>
            <SectionHeader 
              title="BACKGROUND" 
              level={3}
              className="mb-4"
            />
            <div className="flex flex-wrap gap-2">
              {background.map((item, index) => (
                <Pill 
                  key={index}
                  variant="info"
                >
                  {item}
                </Pill>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
