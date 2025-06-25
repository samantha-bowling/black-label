
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { BudgetRange, ContractType } from '@/types/auth';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ButtonPrimary, ButtonSecondary, CardLuxe } from '@/components/ui/primitives';
import { useProfileTags } from '@/hooks/useProfileTags';

interface GigFormData {
  title: string;
  description: string;
  timeline: string;
  budget_range: BudgetRange;
  contract_type: ContractType;
  project_type_tags: string[];
  skills_needed: string[];
}

export function GigPostingForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { profileTags } = useProfileTags();

  const form = useForm<GigFormData>({
    defaultValues: {
      title: '',
      description: '',
      timeline: '',
      project_type_tags: [],
      skills_needed: [],
    }
  });

  const { register, handleSubmit, setValue, watch, formState: { errors } } = form;
  const selectedProjectTags = watch('project_type_tags') || [];
  const selectedSkills = watch('skills_needed') || [];

  const projectTypeTags = profileTags.filter(tag => tag.category === 'project_type');
  const skillTags = profileTags.filter(tag => tag.category === 'specialty_skill');

  const handleTagToggle = (tagName: string, field: 'project_type_tags' | 'skills_needed') => {
    const currentTags = watch(field) || [];
    const newTags = currentTags.includes(tagName)
      ? currentTags.filter(tag => tag !== tagName)
      : [...currentTags, tagName];
    setValue(field, newTags);
  };

  const onSubmit = async (data: GigFormData) => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('gigs')
        .insert({
          poster_id: user.id,
          title: data.title,
          description: data.description,
          timeline: data.timeline,
          budget_range: data.budget_range,
          contract_type: data.contract_type,
          project_type_tags: data.project_type_tags,
          skills_needed: data.skills_needed,
          brief_status: 'pending_review',
        });

      if (error) throw error;

      toast({
        title: "Gig Brief Submitted!",
        description: "Your gig has been submitted for admin review. You'll be notified once it's approved.",
      });

      navigate('/dashboard');
    } catch (error) {
      console.error('Error creating gig:', error);
      toast({
        title: "Error",
        description: "Failed to submit your gig. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Post a Gig</h1>
          <p className="text-muted-foreground">
            Submit your project brief for review. Once approved, you'll be able to pay the $499 posting fee to make it live.
          </p>
        </div>

        <CardLuxe className="p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-2">
              <Label htmlFor="title">Project Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Senior Unity Developer for Mobile RPG"
                {...register('title', { required: 'Project title is required' })}
              />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Project Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe your project, requirements, expectations, and what makes this opportunity unique..."
                rows={8}
                {...register('description', { required: 'Project description is required' })}
              />
              {errors.description && (
                <p className="text-sm text-red-500">{errors.description.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="budget_range">Budget Range *</Label>
                <Select onValueChange={(value) => setValue('budget_range', value as BudgetRange)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select budget range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="under_5k">Under $5K</SelectItem>
                    <SelectItem value="5k_15k">$5K - $15K</SelectItem>
                    <SelectItem value="15k_50k">$15K - $50K</SelectItem>
                    <SelectItem value="50k_100k">$50K - $100K</SelectItem>
                    <SelectItem value="100k_plus">$100K+</SelectItem>
                    <SelectItem value="equity_only">Equity Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contract_type">Contract Type *</Label>
                <Select onValueChange={(value) => setValue('contract_type', value as ContractType)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select contract type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="freelance">Freelance</SelectItem>
                    <SelectItem value="consulting">Consulting</SelectItem>
                    <SelectItem value="part_time">Part-time</SelectItem>
                    <SelectItem value="full_time">Full-time</SelectItem>
                    <SelectItem value="equity">Equity Partnership</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timeline">Timeline *</Label>
              <Input
                id="timeline"
                placeholder="e.g., 3 months, ongoing, ASAP"
                {...register('timeline', { required: 'Timeline is required' })}
              />
              {errors.timeline && (
                <p className="text-sm text-red-500">{errors.timeline.message}</p>
              )}
            </div>

            <div className="space-y-4">
              <Label>Project Type *</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {projectTypeTags.map((tag) => (
                  <div key={tag.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`project-${tag.id}`}
                      checked={selectedProjectTags.includes(tag.name)}
                      onCheckedChange={() => handleTagToggle(tag.name, 'project_type_tags')}
                    />
                    <Label htmlFor={`project-${tag.id}`} className="text-sm">
                      {tag.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <Label>Skills Needed *</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {skillTags.map((tag) => (
                  <div key={tag.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`skill-${tag.id}`}
                      checked={selectedSkills.includes(tag.name)}
                      onCheckedChange={() => handleTagToggle(tag.name, 'skills_needed')}
                    />
                    <Label htmlFor={`skill-${tag.id}`} className="text-sm">
                      {tag.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-muted/50 p-6 rounded-lg">
              <h3 className="font-semibold mb-2">What happens next?</h3>
              <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                <li>Your gig brief will be reviewed by our team</li>
                <li>Once approved, you'll receive a payment link ($499 posting fee)</li>
                <li>After payment, your gig goes live to our curated talent network</li>
                <li>We'll manually match qualified candidates to your project</li>
              </ol>
            </div>

            <div className="flex justify-between">
              <ButtonSecondary
                type="button"
                onClick={() => navigate('/dashboard')}
              >
                Save as Draft
              </ButtonSecondary>
              
              <ButtonPrimary
                type="submit"
                isLoading={isLoading}
              >
                Submit for Review
              </ButtonPrimary>
            </div>
          </form>
        </CardLuxe>
      </div>
    </div>
  );
}
