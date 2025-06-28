
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
        return { text: 'Actively Seeking', color: 'bg-green-600' };
      case 'limited':
        return { text: 'Open to Projects', color: 'bg-yellow-600' };
      case 'unavailable':
        return { text: 'Booked', color: 'bg-red-600' };
      default:
        return { text: 'Open to Projects', color: 'bg-yellow-600' };
    }
  };

  const status = getStatusBadge();

  return (
    <section className="max-w-4xl mx-auto px-4 mb-4">
      <div className="space-y-4">
        {/* Available For */}
        {availableFor.length > 0 && (
          <div>
            <h3 className="text-white font-semibold mb-2 text-sm">Available For</h3>
            <div className="flex flex-wrap gap-2">
              {availableFor.map((type, index) => (
                <Badge 
                  key={index}
                  variant="outline" 
                  className="text-white/80 border-white/30"
                >
                  {type}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Work Style */}
        <div>
          <h3 className="text-white font-semibold mb-2 text-sm">Work Style</h3>
          <div className="flex flex-wrap gap-2">
            {workStyle.map((style, index) => (
              <Badge 
                key={index}
                variant="outline" 
                className="text-white/80 border-white/30"
              >
                {style}
              </Badge>
            ))}
          </div>
        </div>

        {/* Current Status */}
        <div>
          <h3 className="text-white font-semibold mb-2 text-sm">Current Status</h3>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${status.color}`} />
            <span className="text-white/80 text-sm">{status.text}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
