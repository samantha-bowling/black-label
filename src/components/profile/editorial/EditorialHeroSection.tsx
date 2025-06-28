
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AuthUser } from '@/types/auth';

interface EditorialHeroSectionProps {
  user: AuthUser;
}

export function EditorialHeroSection({ user }: EditorialHeroSectionProps) {
  return (
    <div className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-background">
      {/* BLACKLABEL Logo */}
      <div className="absolute top-8 left-8">
        <img 
          src="/lovable-uploads/44d33ed2-1a46-498d-9cf3-cde6180ba786.png" 
          alt="BLACKLABEL" 
          className="h-8 md:h-10 w-auto"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
        {/* Avatar */}
        <div className="mb-8">
          <Avatar className="w-32 h-32 mx-auto border-4 border-white/20 shadow-2xl">
            <AvatarImage src={user.avatarUrl} />
            <AvatarFallback className="text-3xl bg-white/10 text-white">
              {user.displayName?.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* Name */}
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 font-display">
          {user.displayName}
        </h1>

        {/* Tagline */}
        {user.expertise_signature && (
          <p className="text-xl md:text-2xl text-white/80 italic mb-8 font-light">
            {user.expertise_signature}
          </p>
        )}

        {/* Bio Summary */}
        {user.bio && (
          <div className="max-w-2xl mx-auto">
            <p className="text-lg text-white/70 leading-relaxed">
              {user.bio}
            </p>
          </div>
        )}
      </div>

      {/* Gradient Overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent"></div>
    </div>
  );
}
