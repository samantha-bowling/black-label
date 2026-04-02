// @ts-nocheck

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Briefcase, Clock, DollarSign, Building2, User, Mail, MessageSquare } from 'lucide-react';

interface ProfileContactFormProps {
  profileUserId: string;
  profileName: string;
  isOpen: boolean;
  onClose: () => void;
}

interface ContactFormData {
  inquirerName: string;
  inquirerEmail: string;
  inquirerCompany?: string;
  projectTitle: string;
  projectDescription: string;
  projectType: string;
  budgetRange?: string;
  timeline: string;
  additionalDetails?: string;
}

export function ProfileContactForm({ profileUserId, profileName, isOpen, onClose }: ProfileContactFormProps) {
  const [formData, setFormData] = useState<ContactFormData>({
    inquirerName: '',
    inquirerEmail: '',
    inquirerCompany: '',
    projectTitle: '',
    projectDescription: '',
    projectType: '',
    budgetRange: '',
    timeline: '',
    additionalDetails: '',
  });

  const submitInquiry = useMutation({
    mutationFn: async (data: ContactFormData) => {
      const { error } = await supabase
        .from('lead_inquiries')
        .insert({
          profile_user_id: profileUserId,
          inquirer_name: data.inquirerName,
          inquirer_email: data.inquirerEmail,
          inquirer_company: data.inquirerCompany || null,
          project_title: data.projectTitle,
          project_description: data.projectDescription,
          project_type: data.projectType,
          budget_range: data.budgetRange || null,
          timeline: data.timeline,
          additional_details: data.additionalDetails || null,
          source: 'public_profile',
          referrer_url: window.location.href,
          ip_address: null, // Could be populated via edge function
          user_agent: navigator.userAgent,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Your inquiry has been sent successfully!');
      onClose();
      setFormData({
        inquirerName: '',
        inquirerEmail: '',
        inquirerCompany: '',
        projectTitle: '',
        projectDescription: '',
        projectType: '',
        budgetRange: '',
        timeline: '',
        additionalDetails: '',
      });
    },
    onError: (error) => {
      console.error('Error submitting inquiry:', error);
      toast.error('Failed to send inquiry. Please try again.');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitInquiry.mutate(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            Start a Project with {profileName}
          </CardTitle>
          <p className="text-muted-foreground">
            Tell us about your project requirements and we'll get back to you promptly.
          </p>
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
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  Company/Organization
                </label>
                <Input
                  value={formData.inquirerCompany}
                  onChange={(e) => setFormData(prev => ({ ...prev, inquirerCompany: e.target.value }))}
                  placeholder="Your company name (optional)"
                />
              </div>
            </div>

            {/* Project Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                Project Details
              </h3>
              
              <div>
                <label className="block text-sm font-medium mb-2">Project Title *</label>
                <Input
                  required
                  value={formData.projectTitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, projectTitle: e.target.value }))}
                  placeholder="Brief title for your project"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Project Type *</label>
                  <Select
                    required
                    value={formData.projectType}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, projectType: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select project type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="contract">Contract Work</SelectItem>
                      <SelectItem value="consulting">Consulting</SelectItem>
                      <SelectItem value="full_time">Full-Time Role</SelectItem>
                      <SelectItem value="part_time">Part-Time Role</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Budget Range
                  </label>
                  <Select
                    value={formData.budgetRange}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, budgetRange: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select budget range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="under_5k">Under $5K</SelectItem>
                      <SelectItem value="5k_15k">$5K - $15K</SelectItem>
                      <SelectItem value="15k_50k">$15K - $50K</SelectItem>
                      <SelectItem value="50k_100k">$50K - $100K</SelectItem>
                      <SelectItem value="100k_plus">$100K+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Timeline *
                </label>
                <Input
                  required
                  value={formData.timeline}
                  onChange={(e) => setFormData(prev => ({ ...prev, timeline: e.target.value }))}
                  placeholder="e.g., 3 months, ASAP, Q2 2024"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Project Description *
                </label>
                <Textarea
                  required
                  rows={4}
                  value={formData.projectDescription}
                  onChange={(e) => setFormData(prev => ({ ...prev, projectDescription: e.target.value }))}
                  placeholder="Describe your project, requirements, and what you're looking for..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Additional Details</label>
                <Textarea
                  rows={3}
                  value={formData.additionalDetails}
                  onChange={(e) => setFormData(prev => ({ ...prev, additionalDetails: e.target.value }))}
                  placeholder="Any additional information, special requirements, or questions..."
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
                disabled={submitInquiry.isPending}
                className="flex-1"
              >
                {submitInquiry.isPending ? 'Sending...' : 'Send Inquiry'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
