
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ProfileContactForm } from '@/components/profile/ProfileContactForm';
import { AuthUser } from '@/types/auth';

interface CallToActionSectionProps {
  user: AuthUser;
}

export function CallToActionSection({ user }: CallToActionSectionProps) {
  const [showContactForm, setShowContactForm] = useState(false);

  return (
    <>
      <section className="max-w-5xl mx-auto px-4 pt-8 pb-16">
        <div className="text-center space-y-6">
          <h2 className="text-3xl font-bold text-white">
            Ready to collaborate?
          </h2>
          <p className="text-white/70 text-lg">
            Connect with {user.displayName} for your next creative project.
          </p>
          
          <div className="pt-4">
            <Button
              onClick={() => setShowContactForm(true)}
              className="bg-white text-black font-bold px-8 py-3 hover:bg-white/90 transition-all duration-150 text-base"
              data-profile-id={user.id}
            >
              Request to Collaborate
            </Button>
          </div>

          <p className="text-white/50 text-sm pt-4">
            All inquiries are reviewed personally by {user.displayName}.
          </p>
        </div>
      </section>

      {showContactForm && (
        <ProfileContactForm
          profileUserId={user.id}
          profileName={user.displayName}
          isOpen={showContactForm}
          onClose={() => setShowContactForm(false)}
        />
      )}
    </>
  );
}
