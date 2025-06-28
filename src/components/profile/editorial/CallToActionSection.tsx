
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
      <section className="max-w-4xl mx-auto px-4 pt-8">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-white">
            Ready to collaborate?
          </h2>
          <p className="text-white/70 text-lg">
            Connect with {user.displayName} for your next creative project.
          </p>
          
          <div className="pt-4">
            <Button
              onClick={() => setShowContactForm(true)}
              className="border border-white text-white font-semibold px-6 py-2 bg-transparent hover:bg-white hover:text-black transition-all duration-150"
              data-profile-id={user.id}
            >
              Request to Collaborate
            </Button>
          </div>

          <p className="text-white/50 text-sm pt-2">
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
