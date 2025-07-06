import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { X, User, FileText, Briefcase } from 'lucide-react';

interface Gig {
  id: string;
  title: string;
  description: string;
  timeline: string;
  budget_range: string;
  contract_type: string;
  poster_id: string;
  poster?: {
    display_name: string;
    company_name?: string;
  };
}

interface GigApplicationModalProps {
  gig: Gig;
  isOpen: boolean;
  onClose: () => void;
}

export function GigApplicationModal({ gig, isOpen, onClose }: GigApplicationModalProps) {
  const [pitchText, setPitchText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('applications')
        .insert({
          gig_id: gig.id,
          seeker_id: user.id,
          pitch_text: pitchText,
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: "Application Submitted!",
        description: "Your application has been sent to the gig poster for review.",
      });

      onClose();
      setPitchText('');
    } catch (error) {
      console.error('Error submitting application:', error);
      toast({
        title: "Error",
        description: "Failed to submit your application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <CardTitle className="text-xl mb-2 flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                Apply for This Opportunity
              </CardTitle>
              <div className="text-sm text-muted-foreground">
                <h3 className="font-semibold text-foreground">{gig.title}</h3>
                <p>Posted by {gig.poster?.display_name}{gig.poster?.company_name && ` at ${gig.poster.company_name}`}</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Your Application
              </h3>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  Why are you interested in this opportunity? *
                </label>
                <Textarea
                  required
                  rows={8}
                  value={pitchText}
                  onChange={(e) => setPitchText(e.target.value)}
                  placeholder="Tell the poster about your relevant experience, why you're interested in this project, and how you can help them achieve their goals..."
                  className="min-h-[200px]"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Include your relevant experience, portfolio links, and any questions you have about the project.
                </p>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !pitchText.trim()}
                className="flex-1"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}