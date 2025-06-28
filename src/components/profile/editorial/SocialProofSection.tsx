
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface InviterInfo {
  id: string;
  displayName: string;
  avatarUrl?: string;
  smartUrlSlug?: string;
  publicProfile: boolean;
}

interface SocialProofSectionProps {
  inviter?: InviterInfo | null;
}

export function SocialProofSection({ inviter }: SocialProofSectionProps) {
  if (!inviter) {
    return null;
  }

  return (
    <section className="py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-white mb-4 font-display">
            ENDORSED BY BLACKLABEL CREATIVES
          </h2>
        </div>

        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-8 text-center">
            <div className="flex items-center justify-center gap-4 mb-4">
              <Avatar className="w-16 h-16 border-2 border-white/20">
                <AvatarImage src={inviter.avatarUrl} />
                <AvatarFallback className="bg-white/10 text-white">
                  {inviter.displayName.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="text-left">
                <p className="text-white font-medium text-lg">
                  {inviter.displayName}
                </p>
                <Badge className="bg-purple-900/50 text-purple-100 hover:bg-purple-800/50">
                  BLACKLABEL Member
                </Badge>
              </div>
            </div>
            <p className="text-white/60 italic">
              "Invited this talent to join our exclusive creative network"
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
