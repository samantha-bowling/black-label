
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AuthUser } from '@/types/auth';

interface EditorialHeroSectionProps {
  user: AuthUser;
}

export function EditorialHeroSection({ user }: EditorialHeroSectionProps) {
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
          <div className="flex-1 space-y-2">
            {/* Name */}
            <h1 className="text-4xl font-bold text-white font-display">
              {user.displayName}
            </h1>

            {/* Role and Experience */}
            <div className="text-white/80 text-lg">
              {user.skills && user.skills.length > 0 && (
                <span>{user.skills.slice(0, 2).join(' · ')}</span>
              )}
              {user.past_credits && (
                <span className="block text-white/60">
                  Years of Experience in Creative Industries
                </span>
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
