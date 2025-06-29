
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { AuthUser } from '@/types/auth';

interface EditorialHeroSectionProps {
  user: AuthUser;
}

export function EditorialHeroSection({ user }: EditorialHeroSectionProps) {
  const getStatusBadge = () => {
    switch (user.availability_status) {
      case 'available':
        return { text: 'Available', color: 'bg-green-600 text-white' };
      case 'limited':
        return { text: 'Limited Availability', color: 'bg-yellow-600 text-white' };
      case 'unavailable':
        return { text: 'Unavailable', color: 'bg-red-600 text-white' };
      default:
        return { text: 'Open to Projects', color: 'bg-blue-600 text-white' };
    }
  };

  const status = getStatusBadge();

  return (
    <div className="relative bg-background py-12">
      {/* BLACKLABEL Logo */}
      <div className="absolute top-8 left-8">
        <img 
          src="/lovable-uploads/44d33ed2-1a46-498d-9cf3-cde6180ba786.png" 
          alt="BLACKLABEL" 
          className="h-8 md:h-10 w-auto"
        />
      </div>

      {/* Content Container */}
      <div className="max-w-4xl mx-auto px-4 pt-8">
        <div className="flex flex-col md:flex-row md:items-start gap-6">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <Avatar className="w-24 h-24 border-2 border-white/20">
              <AvatarImage src={user.avatarUrl} />
              <AvatarFallback className="text-xl bg-white/10 text-white">
                {user.displayName?.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Name and Details */}
          <div className="flex-1 space-y-3">
            {/* Name and Status */}
            <div className="flex flex-col md:flex-row md:items-center gap-3">
              <h1 className="text-4xl font-bold text-white font-display">
                {user.displayName}
              </h1>
              <Badge className={`${status.color} px-3 py-1`}>
                {status.text}
              </Badge>
            </div>

            {/* Role, Skills, and Experience Info Bar */}
            <div className="text-white/80 text-lg space-y-2">
              {user.skills && user.skills.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {user.skills.slice(0, 3).map((skill, index) => (
                    <span key={index} className="text-white/90">
                      {skill}
                      {index < Math.min(user.skills!.length, 3) - 1 && ' •'}
                    </span>
                  ))}
                </div>
              )}
              
              {user.years_experience && (
                <div className="text-white/70 text-base">
                  {user.years_experience} {user.years_experience === 1 ? 'year' : 'years'} of professional experience
                </div>
              )}
            </div>

            {/* One-liner subtitle */}
            {user.expertise_signature && (
              <p className="text-xl text-white/70 italic font-light">
                "{user.expertise_signature}"
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
