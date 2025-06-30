
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
    <section className="max-w-5xl mx-auto px-4 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Core Disciplines */}
        {coreDisciplines.length > 0 && (
          <div>
            <SectionHeader 
              title="CORE DISCIPLINES" 
              level={3}
              className="mb-4"
            />
            <div className="flex flex-wrap gap-3">
              {coreDisciplines.map((discipline, index) => (
                <Pill 
                  key={index}
                  variant="neutral"
                >
                  {discipline}
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
            <div className="flex flex-wrap gap-3">
              {background.map((item, index) => (
                <Pill 
                  key={index}
                  variant="neutral"
                >
                  {item}
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
            <div className="flex flex-wrap gap-3">
              {specialtySkills.map((skill, index) => (
                <Pill 
                  key={index}
                  variant="neutral"
                >
                  {skill}
                </Pill>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
