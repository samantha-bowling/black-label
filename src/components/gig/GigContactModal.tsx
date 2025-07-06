import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { X, User, Mail, MessageSquare, Briefcase, Clock, DollarSign } from 'lucide-react';

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

interface GigContactModalProps {
  gig: Gig;
  isOpen: boolean;
  onClose: () => void;
}

interface ContactFormData {
  inquirerName: string;
  inquirerEmail: string;
  inquirerCompany?: string;
  message: string;
  availabilityTimeline: string;
  budgetExpectation?: string;
}

export function GigContactModal({ gig, isOpen, onClose }: GigContactModalProps) {
  const [formData, setFormData] = useState<ContactFormData>({
    inquirerName: '',
    inquirerEmail: '',
    inquirerCompany: '',
    message: '',
    availabilityTimeline: '',
    budgetExpectation: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    try {
      // Store the inquiry in collaboration_requests table
      const { error } = await supabase
        .from('collaboration_requests')
        .insert({
          poster_id: gig.poster_id, // The original gig poster
          seeker_id: user.id, // The person making the inquiry
          project_title: `Interest in: ${gig.title}`,
          description: `${formData.message}\n\nContact Details:\nName: ${formData.inquirerName}\nEmail: ${formData.inquirerEmail}${formData.inquirerCompany ? `\nCompany: ${formData.inquirerCompany}` : ''}\nAvailability: ${formData.availabilityTimeline}${formData.budgetExpectation ? `\nBudget Expectation: ${formData.budgetExpectation}` : ''}`,
          timeline: formData.availabilityTimeline,
          budget_range: gig.budget_range as any,
          status: 'new'
        });

      if (error) throw error;

      toast({
        title: "Message Sent!",
        description: "Your inquiry has been sent to the project poster. They'll get back to you soon.",
      });

      onClose();
      setFormData({
        inquirerName: '',
        inquirerEmail: '',
        inquirerCompany: '',
        message: '',
        availabilityTimeline: '',
        budgetExpectation: '',
      });
    } catch (error) {
      console.error('Error sending inquiry:', error);
      toast({
        title: "Error",
        description: "Failed to send your inquiry. Please try again.",
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
              <CardTitle className="text-xl mb-2">
                Get In Touch About This Opportunity
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
            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <User className="w-5 h-5" />
                Your Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name *</label>
                  <Input
                    required
                    value={formData.inquirerName}
                    onChange={(e) => setFormData(prev => ({ ...prev, inquirerName: e.target.value }))}
                    placeholder="Your full name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Email *</label>
                  <Input
                    type="email"
                    required
                    value={formData.inquirerEmail}
                    onChange={(e) => setFormData(prev => ({ ...prev, inquirerEmail: e.target.value }))}
                    placeholder="your@email.com"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Company/Organization</label>
                <Input
                  value={formData.inquirerCompany}
                  onChange={(e) => setFormData(prev => ({ ...prev, inquirerCompany: e.target.value }))}
                  placeholder="Your company name (optional)"
                />
              </div>
            </div>

            {/* Project Interest */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                Your Interest
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Your Availability *
                  </label>
                  <Input
                    required
                    value={formData.availabilityTimeline}
                    onChange={(e) => setFormData(prev => ({ ...prev, availabilityTimeline: e.target.value }))}
                    placeholder="e.g., Available immediately, Starting Q2 2024"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Budget Expectation
                  </label>
                  <Input
                    value={formData.budgetExpectation}
                    onChange={(e) => setFormData(prev => ({ ...prev, budgetExpectation: e.target.value }))}
                    placeholder="Your rate/budget expectation (optional)"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Message *
                </label>
                <Textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Tell them why you're interested in this opportunity, your relevant experience, and any questions you have..."
                />
              </div>
            </div>

            {/* Action Buttons */}
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
                disabled={isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}