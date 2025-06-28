
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
      <section className="py-24 px-6 bg-gradient-to-t from-slate-900/50 to-transparent">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-4 font-display">
              READY TO COLLABORATE?
            </h2>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              Connect with {user.displayName} for your next creative project
            </p>
          </div>

          <Button
            size="lg"
            className="bg-black border-2 border-white text-white hover:bg-white hover:text-black transition-all duration-300 transform hover:scale-105 px-12 py-4 text-lg font-semibold"
            onClick={() => setShowContactForm(true)}
            data-profile-id={user.id}
          >
            Request to Collaborate
          </Button>

          <div className="mt-8 text-white/40 text-sm">
            All inquiries are reviewed personally by {user.displayName}
          </div>
        </div>
      </section>

      {showContactForm && (
        <ProfileContactForm
          userId={user.id}
          displayName={user.displayName}
          isOpen={showContactForm}
          onClose={() => setShowContactForm(false)}
        />
      )}
    </>
  );
}
