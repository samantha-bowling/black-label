
import { useState, useEffect } from 'react';
import { useInvites } from '@/hooks/useInvites';
import { useAuth } from '@/hooks/useAuth';
import { 
  ButtonPrimary, 
  ButtonSecondary,
  CardLuxe, 
  HeadingLG,
  InputLuxe
} from '@/components/ui/primitives';
import { Copy, Check, Users, Clock } from 'lucide-react';

export function InviteManager() {
  const { user } = useAuth();
  const { createInvite, getUserInvites, isLoading } = useInvites();
  const [email, setEmail] = useState('');
  const [invites, setInvites] = useState<any[]>([]);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  useEffect(() => {
    loadInvites();
  }, []);

  const loadInvites = async () => {
    const userInvites = await getUserInvites();
    setInvites(userInvites);
  };

  const handleCreateInvite = async () => {
    const result = await createInvite(email || undefined);
    if (result.token) {
      setEmail('');
      loadInvites();
      copyToClipboard(result.token);
    }
  };

  const copyToClipboard = async (token: string) => {
    const inviteUrl = `${window.location.origin}/auth?invite=${token}`;
    await navigator.clipboard.writeText(inviteUrl);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const canCreateInvites = user?.role === 'admin' || (user?.invites_remaining || 0) > 0;

  return (
    <div className="space-y-6">
      <div>
        <HeadingLG className="mb-2">Invite Management</HeadingLG>
        <p className="text-muted-foreground">
          {user?.role === 'admin' 
            ? 'As an admin, you have unlimited invites.'
            : `You have ${user?.invites_remaining || 0} invite tokens remaining.`
          }
        </p>
      </div>

      {canCreateInvites && (
        <CardLuxe className="p-6">
          <h3 className="font-semibold text-lg mb-4">Create New Invite</h3>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email (Optional)
              </label>
              <InputLuxe
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Assign to specific email (optional)"
              />
            </div>
            <ButtonPrimary
              onClick={handleCreateInvite}
              isLoading={isLoading}
              disabled={!canCreateInvites}
            >
              Generate Invite
            </ButtonPrimary>
          </div>
        </CardLuxe>
      )}

      <CardLuxe className="p-6">
        <h3 className="font-semibold text-lg mb-4">Your Invites</h3>
        {invites.length === 0 ? (
          <p className="text-muted-foreground">No invites created yet.</p>
        ) : (
          <div className="space-y-3">
            {invites.map((invite) => (
              <div key={invite.id} className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  {invite.used_by_user_id ? (
                    <Users className="w-4 h-4 text-green-500" />
                  ) : (
                    <Clock className="w-4 h-4 text-yellow-500" />
                  )}
                  <div>
                    <p className="text-sm font-medium">
                      {invite.email || 'General invite'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {invite.used_by_user_id 
                        ? `Used by ${invite.used_by?.display_name || 'Unknown user'}`
                        : `Expires ${new Date(invite.expires_at).toLocaleDateString()}`
                      }
                    </p>
                  </div>
                </div>
                {!invite.used_by_user_id && (
                  <ButtonSecondary
                    size="sm"
                    onClick={() => copyToClipboard(invite.token)}
                  >
                    {copiedToken === invite.token ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </ButtonSecondary>
                )}
              </div>
            ))}
          </div>
        )}
      </CardLuxe>
    </div>
  );
}
