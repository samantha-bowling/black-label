
import { Pill } from '@/components/ui/pill';
import { SectionHeader } from '@/components/ui/section-header';
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
        return { text: 'Actively Seeking', variant: 'success' as const };
      case 'limited':
        return { text: 'Open to Projects', variant: 'warning' as const };
      case 'unavailable':
        return { text: 'Booked', variant: 'status' as const };
      default:
        return { text: 'Open to Projects', variant: 'info' as const };
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
            <SectionHeader 
              title="PROJECT TYPES" 
              level={3}
              className="mb-4"
            />
            <div className="flex flex-wrap gap-2">
              {projectTypes.slice(0, 6).map((type, index) => (
                <Pill 
                  key={index}
                  variant="default"
                >
                  {type}
                </Pill>
              ))}
            </div>
          </div>
        )}

        {/* Available For */}
        {availableFor.length > 0 && (
          <div>
            <SectionHeader 
              title="AVAILABLE FOR" 
              level={3}
              className="mb-4"
            />
            <div className="flex flex-wrap gap-2">
              {availableFor.map((type, index) => (
                <Pill 
                  key={index}
                  variant="success"
                >
                  {type}
                </Pill>
              ))}
            </div>
          </div>
        )}

        {/* Work Style */}
        <div>
          <SectionHeader 
            title="WORK STYLE" 
            level={3}
            className="mb-4"
          />
          <div className="flex flex-wrap gap-2">
            {workStyle.map((style, index) => (
              <Pill 
                key={index}
                variant="info"
              >
                {style}
              </Pill>
            ))}
          </div>
        </div>

        {/* Current Status */}
        <div>
          <SectionHeader 
            title="CURRENT STATUS" 
            level={3}
            className="mb-4"
          />
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${
              status.variant === 'success' ? 'bg-green-500' : 
              status.variant === 'warning' ? 'bg-yellow-500' : 
              status.variant === 'status' ? 'bg-red-500' : 'bg-blue-500'
            }`} />
            <Pill variant={status.variant}>
              {status.text}
            </Pill>
          </div>
        </div>
      </div>
    </section>
  );
}
