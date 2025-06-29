
import { Badge } from '@/components/ui/badge';
import { AuthUser } from '@/types/auth';

interface CollaborationDetailsSectionProps {
  user: AuthUser;
}

export function CollaborationDetailsSection({ user }: CollaborationDetailsSectionProps) {
  const availableFor = user.desired_gig_types || [];
  const workStyle = [];
  
  if (user.accepts_intros) workStyle.push('Open to Intros');
  if (user.requires_nda) workStyle.push('NDA Required');
  workStyle.push('Remote OK', 'Async Friendly');

  const getStatusBadge = () => {
    switch (user.availability_status) {
      case 'available':
        return { text: 'Actively Seeking', color: 'bg-green-600 text-white' };
      case 'limited':
        return { text: 'Open to Projects', color: 'bg-yellow-600 text-white' };
      case 'unavailable':
        return { text: 'Booked', color: 'bg-red-600 text-white' };
      default:
        return { text: 'Open to Projects', color: 'bg-blue-600 text-white' };
    }
  };

  const status = getStatusBadge();

  // Get project types (skills can serve as project types)
  const projectTypes = user.skills || [];

  return (
    <section className="max-w-4xl mx-auto px-4 mb-6">
      <div className="space-y-6">
        {/* Project Types */}
        {projectTypes.length > 0 && (
          <div>
            <h3 className="text-white font-semibold mb-3 text-sm uppercase tracking-wide">
              Project Types
            </h3>
            <div className="flex flex-wrap gap-2">
              {projectTypes.slice(0, 6).map((type, index) => (
                <Badge 
                  key={index}
                  className="bg-white/10 text-white/90 border-white/20 hover:bg-white/20 transition-colors px-3 py-1"
                >
                  {type}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Available For */}
        {availableFor.length > 0 && (
          <div>
            <h3 className="text-white font-semibold mb-3 text-sm uppercase tracking-wide">
              Available For
            </h3>
            <div className="flex flex-wrap gap-2">
              {availableFor.map((type, index) => (
                <Badge 
                  key={index}
                  className="bg-green-600/20 text-green-200 border-green-400/30 hover:bg-green-600/30 transition-colors px-3 py-1"
                >
                  {type}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Work Style */}
        <div>
          <h3 className="text-white font-semibold mb-3 text-sm uppercase tracking-wide">
            Work Style
          </h3>
          <div className="flex flex-wrap gap-2">
            {workStyle.map((style, index) => (
              <Badge 
                key={index}
                className="bg-blue-600/20 text-blue-200 border-blue-400/30 hover:bg-blue-600/30 transition-colors px-3 py-1"
              >
                {style}
              </Badge>
            ))}
          </div>
        </div>

        {/* Current Status */}
        <div>
          <h3 className="text-white font-semibold mb-3 text-sm uppercase tracking-wide">
            Current Status
          </h3>
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${status.color.includes('green') ? 'bg-green-500' : status.color.includes('yellow') ? 'bg-yellow-500' : status.color.includes('red') ? 'bg-red-500' : 'bg-blue-500'}`} />
            <Badge className={`${status.color} px-3 py-1`}>
              {status.text}
            </Badge>
          </div>
        </div>
      </div>
    </section>
  );
}
