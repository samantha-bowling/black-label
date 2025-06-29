
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UserCheck, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

interface InviterInfo {
  id: string;
  displayName: string;
  avatarUrl?: string;
  smartUrlSlug?: string;
  publicProfile: boolean;
}

interface InviterDisplayProps {
  inviter: InviterInfo;
  className?: string;
}

export function InviterDisplay({ inviter, className = '' }: InviterDisplayProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // If inviter profile is not public or no slug, show static display
  if (!inviter.publicProfile || !inviter.smartUrlSlug) {
    return (
      <Card className={`${className} bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200/50`}>
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Avatar className="h-10 w-10 ring-2 ring-purple-200">
                <AvatarImage src={inviter.avatarUrl} alt={inviter.displayName} />
                <AvatarFallback className="bg-purple-100 text-purple-700 text-xs font-medium">
                  {getInitials(inviter.displayName)}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -top-1 -right-1 bg-purple-500 rounded-full p-1">
                <UserCheck className="h-3 w-3 text-white" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="bg-purple-100 text-purple-700 text-xs">
                  Invited by
                </Badge>
              </div>
              <p className="text-sm font-medium text-gray-900 truncate mt-1">
                {inviter.displayName}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // If inviter profile is public and has slug, make it clickable
  return (
    <Link to={`/${inviter.smartUrlSlug}`} className="block">
      <Card className={`${className} bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200/50 hover:shadow-md transition-all duration-200 hover:scale-[1.02] cursor-pointer`}>
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Avatar className="h-10 w-10 ring-2 ring-purple-200">
                <AvatarImage src={inviter.avatarUrl} alt={inviter.displayName} />
                <AvatarFallback className="bg-purple-100 text-purple-700 text-xs font-medium">
                  {getInitials(inviter.displayName)}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -top-1 -right-1 bg-purple-500 rounded-full p-1">
                <UserCheck className="h-3 w-3 text-white" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="bg-purple-100 text-purple-700 text-xs">
                  Invited by
                </Badge>
                <ExternalLink className="h-3 w-3 text-purple-600" />
              </div>
              <p className="text-sm font-medium text-gray-900 truncate mt-1 group-hover:text-purple-700 transition-colors">
                {inviter.displayName}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
