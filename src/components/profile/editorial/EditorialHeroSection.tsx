
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { AuthUser } from '@/types/auth';
import { MapPin, Calendar, UserCheck } from 'lucide-react';

interface EditorialHeroSectionProps {
  user: AuthUser;
  inviter?: {
    id: string;
    displayName: string;
    avatarUrl?: string;
    smartUrlSlug?: string;
    publicProfile: boolean;
  } | null;
}

export function EditorialHeroSection({ user, inviter }: EditorialHeroSectionProps) {
  const getStatusBadge = () => {
    switch (user.availability_status) {
      case 'available':
        return { text: 'OPEN TO OPPORTUNITIES', color: 'bg-green-600 text-white' };
      case 'limited':
        return { text: 'LIMITED AVAILABILITY', color: 'bg-yellow-600 text-white' };
      case 'unavailable':
        return { text: 'CURRENTLY UNAVAILABLE', color: 'bg-red-600 text-white' };
      default:
        return null;
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
      <div className="max-w-5xl mx-auto px-4 pt-8">
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
          <div className="flex-1 space-y-4">
            {/* Name */}
            <h1 className="text-4xl font-bold text-white font-display">
              {user.displayName}
            </h1>

            {/* Location and Experience Meta Line */}
            <div className="text-white/70 text-lg">
              {user.location && user.years_experience ? (
                <span>
                  {user.location} | {user.years_experience} {user.years_experience === 1 ? 'Year' : 'Years'} of Professional Experience
                </span>
              ) : user.location ? (
                <span>{user.location}</span>
              ) : user.years_experience ? (
                <span>{user.years_experience} {user.years_experience === 1 ? 'Year' : 'Years'} of Professional Experience</span>
              ) : null}
            </div>

            {/* Status and Referral Inline Meta Line */}
            <div className="flex flex-wrap items-center gap-4 text-white/70 text-sm">
              {status && (
                <Badge className={`${status.color} px-3 py-1 text-xs font-medium uppercase tracking-wide`}>
                  {status.text}
                </Badge>
              )}
              
              {inviter && (
                <div className="flex items-center gap-1">
                  <UserCheck className="w-4 h-4" />
                  <span className="uppercase tracking-wide">Referred by: {inviter.displayName}</span>
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
