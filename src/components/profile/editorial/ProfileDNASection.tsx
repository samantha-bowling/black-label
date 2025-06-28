
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AuthUser } from '@/types/auth';

interface ProfileDNASectionProps {
  user: AuthUser;
}

export function ProfileDNASection({ user }: ProfileDNASectionProps) {
  // Map user skills to DNA categories
  const coreDisciplines = user.skills?.slice(0, 3) || [];
  const specialtySkills = user.skills?.slice(3, 10) || [];
  const projectTypes = user.desired_gig_types?.slice(0, 5) || [];

  if (coreDisciplines.length === 0 && specialtySkills.length === 0 && projectTypes.length === 0) {
    return null;
  }

  return (
    <section className="py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4 font-display">
            CORE PROFILE DNA
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            Professional expertise and specialization areas
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Core Disciplines */}
          {coreDisciplines.length > 0 && (
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <span className="text-xl">🔧</span>
                  Core Disciplines
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {coreDisciplines.map((skill, index) => (
                    <Badge 
                      key={index} 
                      className="bg-slate-800 text-white hover:bg-slate-700 transition-colors"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Specialty Skills */}
          {specialtySkills.length > 0 && (
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <span className="text-xl">🧠</span>
                  Specialty Skills
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {specialtySkills.map((skill, index) => (
                    <Badge 
                      key={index} 
                      className="bg-slate-800 text-white hover:bg-slate-700 transition-colors"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Project Types */}
          {projectTypes.length > 0 && (
            <Card className="bg-white/5 border-white/10 md:col-span-2 lg:col-span-1">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <span className="text-xl">🎯</span>
                  Project Types
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {projectTypes.map((type, index) => (
                    <Badge 
                      key={index} 
                      className="bg-slate-800 text-white hover:bg-slate-700 transition-colors"
                    >
                      {type}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </section>
  );
}
