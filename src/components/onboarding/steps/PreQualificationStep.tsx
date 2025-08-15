import React, { useState } from 'react';
import { UserRole } from '@/types/auth';
import { Button, Card, Heading, Text, Input, Label, Badge } from '@/components/ui/system';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle, Shield, Users, Briefcase } from 'lucide-react';

interface PreQualificationStepProps {
  userRole: UserRole;
  inviteToken?: string;
  onQualified: (qualified: boolean, data?: any) => void;
}

export function PreQualificationStep({ 
  userRole, 
  inviteToken, 
  onQualified 
}: PreQualificationStepProps) {
  const [formData, setFormData] = useState({
    industry_experience: '',
    role_level: '',
    current_status: '',
    referral_source: ''
  });

  const handleSubmit = () => {
    // Qualification logic
    const isQualified = 
      formData.industry_experience !== '' && 
      formData.role_level !== '' &&
      formData.current_status !== '';

    // In production, this would be more sophisticated
    const qualificationScore = Object.values(formData).filter(Boolean).length;
    
    if (qualificationScore >= 3) {
      onQualified(true, {
        years_experience: getExperienceYears(formData.industry_experience),
        career_level: formData.role_level,
        ...formData
      });
    } else {
      onQualified(false);
    }
  };

  const getExperienceYears = (level: string): number => {
    const mapping: Record<string, number> = {
      'entry': 1,
      'junior': 3,
      'mid': 6,
      'senior': 10,
      'lead': 15,
      'director': 20
    };
    return mapping[level] || 0;
  };

  const experienceOptions = userRole === 'gig_seeker' ? [
    { value: 'entry', label: 'Entry Level (0-2 years)' },
    { value: 'junior', label: 'Junior (2-4 years)' },
    { value: 'mid', label: 'Mid-Level (4-8 years)' },
    { value: 'senior', label: 'Senior (8+ years)' },
    { value: 'lead', label: 'Lead/Principal (10+ years)' },
    { value: 'director', label: 'Director/VP (15+ years)' }
  ] : [
    { value: 'startup', label: 'Startup/Indie (0-2 years)' },
    { value: 'small', label: 'Small Studio (2-5 years)' },
    { value: 'established', label: 'Established Company (5+ years)' },
    { value: 'enterprise', label: 'Enterprise/AAA (10+ years)' }
  ];

  const statusOptions = userRole === 'gig_seeker' ? [
    { value: 'employed', label: 'Currently Employed' },
    { value: 'freelancing', label: 'Freelancing' },
    { value: 'between_roles', label: 'Between Roles' },
    { value: 'student', label: 'Student' }
  ] : [
    { value: 'actively_hiring', label: 'Actively Hiring' },
    { value: 'planning_projects', label: 'Planning Future Projects' },
    { value: 'exploring_talent', label: 'Exploring Talent Options' }
  ];

  return (
    <div className="space-y-8">
      {/* Invite Validation */}
      {inviteToken && (
        <Card variant="highlight" padding="md" className="mb-6">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-5 h-5 text-success" />
            <div>
              <Text weight="semibold">Invitation Verified</Text>
              <Text size="sm" variant="secondary">
                You've been invited to join our exclusive gaming talent network
              </Text>
            </div>
          </div>
        </Card>
      )}

      {/* Platform Value Props */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <Card variant="gaming" padding="md" className="text-center">
          <Shield className="w-8 h-8 mx-auto mb-3 text-white/80" />
          <Text weight="semibold" size="sm">Curated Network</Text>
          <Text size="xs" variant="secondary">Quality-verified professionals only</Text>
        </Card>
        
        <Card variant="gaming" padding="md" className="text-center">
          <Users className="w-8 h-8 mx-auto mb-3 text-white/80" />
          <Text weight="semibold" size="sm">Industry Focus</Text>
          <Text size="xs" variant="secondary">Gaming & interactive media experts</Text>
        </Card>
        
        <Card variant="gaming" padding="md" className="text-center">
          <Briefcase className="w-8 h-8 mx-auto mb-3 text-white/80" />
          <Text weight="semibold" size="sm">Premium Opportunities</Text>
          <Text size="xs" variant="secondary">High-quality projects and roles</Text>
        </Card>
      </div>

      {/* Qualification Form */}
      <div className="space-y-6">
        <div>
          <Label required>
            {userRole === 'gig_seeker' ? 'Industry Experience Level' : 'Company Maturity'}
          </Label>
          <Select 
            value={formData.industry_experience}
            onValueChange={(value) => setFormData(prev => ({ ...prev, industry_experience: value }))}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={`Select your ${userRole === 'gig_seeker' ? 'experience level' : 'company stage'}`} />
            </SelectTrigger>
            <SelectContent>
              {experienceOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label required>
            {userRole === 'gig_seeker' ? 'Current Role Level' : 'Hiring Status'}
          </Label>
          <Select 
            value={formData.current_status}
            onValueChange={(value) => setFormData(prev => ({ ...prev, current_status: value }))}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={`Select your ${userRole === 'gig_seeker' ? 'current status' : 'hiring status'}`} />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>How did you hear about BlackLabel.gg?</Label>
          <Input
            placeholder="Referral, LinkedIn, conference, etc."
            value={formData.referral_source}
            onChange={(e) => setFormData(prev => ({ ...prev, referral_source: e.target.value }))}
            variant="gaming"
          />
        </div>

        {/* Qualification Status */}
        <Card variant="default" padding="sm" className="bg-surface/30">
          <div className="flex items-center justify-between">
            <Text size="sm" variant="secondary">
              Profile Qualification Status
            </Text>
            <Badge 
              variant={Object.values(formData).filter(Boolean).length >= 3 ? "success" : "outline"}
              size="sm"
            >
              {Object.values(formData).filter(Boolean).length >= 3 ? "Qualified" : "In Progress"}
            </Badge>
          </div>
        </Card>

        <Button 
          variant="gaming" 
          size="lg" 
          onClick={handleSubmit}
          disabled={Object.values(formData).filter(Boolean).length < 3}
          className="w-full"
        >
          Continue to Profile Setup
        </Button>
      </div>

      {/* Legal Notice */}
      <div className="text-center pt-6 border-t border-white/10">
        <Text size="xs" variant="tertiary">
          By continuing, you agree to our platform's quality standards and community guidelines.
          We maintain a curated network to ensure the best experience for all members.
        </Text>
      </div>
    </div>
  );
}