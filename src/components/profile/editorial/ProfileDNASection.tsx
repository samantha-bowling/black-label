
import { Badge } from '@/components/ui/badge';
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
    <section className="max-w-4xl mx-auto px-4 gap-y-3 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Disciplines */}
        {disciplines.length > 0 && (
          <div>
            <h3 className="text-white font-semibold mb-3 text-sm uppercase tracking-wide">
              DISCIPLINES
            </h3>
            <div className="flex flex-wrap gap-2">
              {disciplines.map((discipline, index) => (
                <Badge 
                  key={index}
                  className="bg-neutral-800 text-white text-sm font-medium px-3 py-1 rounded-full hover:bg-neutral-700"
                >
                  {discipline}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Project Types */}
        {projectTypes.length > 0 && (
          <div>
            <h3 className="text-white font-semibold mb-3 text-sm uppercase tracking-wide">
              PROJECT TYPES
            </h3>
            <div className="flex flex-wrap gap-2">
              {projectTypes.map((type, index) => (
                <Badge 
                  key={index}
                  className="bg-neutral-800 text-white text-sm font-medium px-3 py-1 rounded-full hover:bg-neutral-700"
                >
                  {type}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Specialties */}
        {specialties.length > 0 && (
          <div>
            <h3 className="text-white font-semibold mb-3 text-sm uppercase tracking-wide">
              SPECIALTIES
            </h3>
            <div className="flex flex-wrap gap-2">
              {specialties.map((specialty, index) => (
                <Badge 
                  key={index}
                  className="bg-neutral-800 text-white text-sm font-medium px-3 py-1 rounded-full hover:bg-neutral-700"
                >
                  {specialty}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
