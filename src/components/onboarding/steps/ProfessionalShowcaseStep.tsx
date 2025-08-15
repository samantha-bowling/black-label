import React, { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { UserRole } from '@/types/auth';
import { Button, Input, Label, Text, Badge, Card, Heading } from '@/components/ui/system';
import { Textarea } from '@/components/ui/textarea';
import { Gamepad2, Plus, Trash2, ExternalLink, Star, DollarSign, Clock, Briefcase } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

interface ProfessionalShowcaseStepProps {
  form: UseFormReturn<any>;
  userRole: UserRole;
}

export function ProfessionalShowcaseStep({ form, userRole }: ProfessionalShowcaseStepProps) {
  const { register, watch, setValue, formState: { errors } } = form;
  
  const projectShowcase = watch('project_showcase') || [];
  const desiredGigTypes = watch('desired_gig_types') || [];

  // Gig type options for seekers
  const gigTypeOptions = [
    'Full-time Employment',
    'Contract Work',
    'Freelance Projects',
    'Part-time Roles',
    'Consulting',
    'Remote Only',
    'On-site Preferred',
    'Hybrid Work'
  ];

  // Project showcase management
  const addProject = () => {
    if (projectShowcase.length < 3) {
      setValue('project_showcase', [
        ...projectShowcase,
        {
          title: '',
          description: '',
          role: '',
          year: new Date().getFullYear(),
          technologies: [],
          link: ''
        }
      ]);
    }
  };

  const removeProject = (index: number) => {
    const updated = projectShowcase.filter((_: any, i: number) => i !== index);
    setValue('project_showcase', updated);
  };

  const updateProject = (index: number, field: string, value: any) => {
    const updated = [...projectShowcase];
    updated[index] = { ...updated[index], [field]: value };
    setValue('project_showcase', updated);
  };

  // Gig type toggle
  const toggleGigType = (type: string) => {
    const current = desiredGigTypes || [];
    const updated = current.includes(type)
      ? current.filter((t: string) => t !== type)
      : [...current, type];
    setValue('desired_gig_types', updated);
  };

  if (userRole === 'gig_seeker') {
    return (
      <div className="space-y-8">
        {/* Project Showcase */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Gamepad2 className="w-5 h-5 text-white/80" />
              <Text weight="semibold">Featured Projects</Text>
              <Badge variant="outline" size="sm">Up to 3</Badge>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={addProject}
              disabled={projectShowcase.length >= 3}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Project
            </Button>
          </div>

          {projectShowcase.length === 0 ? (
            <Card variant="default" padding="lg" className="text-center">
              <Gamepad2 className="w-12 h-12 mx-auto mb-4 text-white/30" />
              <Text variant="secondary">
                Showcase your best gaming industry work to stand out to potential clients and employers.
              </Text>
              <Button variant="gaming" size="sm" onClick={addProject} className="mt-4">
                Add Your First Project
              </Button>
            </Card>
          ) : (
            <div className="space-y-4">
              {projectShowcase.map((project: any, index: number) => (
                <Card key={index} variant="gaming" padding="md">
                  <div className="flex justify-between items-start mb-4">
                    <Text weight="semibold" size="sm">Project {index + 1}</Text>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeProject(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label required>Project Title</Label>
                        <Input
                          value={project.title || ''}
                          onChange={(e) => updateProject(index, 'title', e.target.value)}
                          placeholder="Game/Project Name"
                          variant="gaming"
                        />
                      </div>
                      <div>
                        <Label required>Your Role</Label>
                        <Input
                          value={project.role || ''}
                          onChange={(e) => updateProject(index, 'role', e.target.value)}
                          placeholder="Lead Developer, Artist, etc."
                          variant="gaming"
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Project Description</Label>
                      <Textarea
                        value={project.description || ''}
                        onChange={(e) => updateProject(index, 'description', e.target.value)}
                        placeholder="Describe your contributions and achievements..."
                        className="min-h-[80px]"
                        maxLength={300}
                      />
                      <Text size="xs" variant="tertiary" className="mt-1">
                        {(project.description || '').length}/300 characters
                      </Text>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label>Year Completed</Label>
                        <Select
                          value={project.year?.toString() || ''}
                          onValueChange={(value) => updateProject(index, 'year', parseInt(value))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select year" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 10 }, (_, i) => {
                              const year = new Date().getFullYear() - i;
                              return (
                                <SelectItem key={year} value={year.toString()}>
                                  {year}
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Project Link</Label>
                        <div className="relative">
                          <Input
                            value={project.link || ''}
                            onChange={(e) => updateProject(index, 'link', e.target.value)}
                            placeholder="https://gamesite.com or Steam/App Store link"
                            variant="gaming"
                          />
                          {project.link && (
                            <ExternalLink className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Work Preferences */}
        <div className="space-y-6">
          <div className="flex items-center space-x-2">
            <Star className="w-5 h-5 text-white/80" />
            <Text weight="semibold">Work Preferences</Text>
          </div>

          <div>
            <Label>Desired Gig Types</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
              {gigTypeOptions.map((type) => (
                <div
                  key={type}
                  className="flex items-center space-x-2 cursor-pointer"
                  onClick={() => toggleGigType(type)}
                >
                  <Checkbox
                    id={type}
                    checked={desiredGigTypes.includes(type)}
                    onChange={() => toggleGigType(type)}
                  />
                  <Label htmlFor={type} className="text-sm cursor-pointer">
                    {type}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Rate Range */}
          <div>
            <Label>Rate Range (Optional)</Label>
            <div className="grid md:grid-cols-2 gap-4 mt-2">
              <div>
                <Input
                  {...register('rate_range_min', { valueAsNumber: true })}
                  type="number"
                  placeholder="Minimum rate"
                  variant="gaming"
                />
              </div>
              <div>
                <Input
                  {...register('rate_range_max', { valueAsNumber: true })}
                  type="number"
                  placeholder="Maximum rate"
                  variant="gaming"
                />
              </div>
            </div>
            <Text size="xs" variant="tertiary" className="mt-1">
              Daily or hourly rates in USD (helps match you with appropriate opportunities)
            </Text>
          </div>
        </div>
      </div>
    );
  }

  // Gig Poster View
  return (
    <div className="space-y-8">
      {/* Project Needs */}
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <Briefcase className="w-5 h-5 text-white/80" />
          <Text weight="semibold">Project Needs & Budget</Text>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <Label>Typical Budget Range</Label>
            <div className="space-y-3">
              <div>
                <Input
                  {...register('typical_budget_min', { valueAsNumber: true })}
                  type="number"
                  placeholder="Minimum project budget"
                  variant="gaming"
                />
              </div>
              <div>
                <Input
                  {...register('typical_budget_max', { valueAsNumber: true })}
                  type="number"
                  placeholder="Maximum project budget"
                  variant="gaming"
                />
              </div>
            </div>
            <Text size="xs" variant="tertiary" className="mt-1">
              Project budget range in USD (helps talent understand scope)
            </Text>
          </div>

          <div>
            <Label>Timeline Expectations</Label>
            <Select
              value={watch('timeline_expectations')}
              onValueChange={(value) => setValue('timeline_expectations', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Typical project duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1-2_weeks">1-2 weeks</SelectItem>
                <SelectItem value="3-4_weeks">3-4 weeks</SelectItem>
                <SelectItem value="1-3_months">1-3 months</SelectItem>
                <SelectItem value="3-6_months">3-6 months</SelectItem>
                <SelectItem value="6-12_months">6-12 months</SelectItem>
                <SelectItem value="ongoing">Ongoing/Long-term</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Project Types */}
        <div>
          <Label>Types of Projects You Work On</Label>
          <Textarea
            placeholder="Describe the types of games, applications, or interactive experiences you develop. Include genres, platforms, target audiences, etc."
            className="min-h-[100px]"
            maxLength={500}
          />
          <Text size="xs" variant="tertiary" className="mt-1">
            Help talent understand if they're a good fit for your projects
          </Text>
        </div>

        {/* NDA Requirement */}
        <div className="flex items-center space-x-3">
          <Checkbox
            id="nda_required"
            checked={watch('nda_required')}
            onCheckedChange={(checked) => setValue('nda_required', checked)}
          />
          <Label htmlFor="nda_required">
            Projects typically require NDAs
          </Label>
        </div>
      </div>

      {/* Organization Showcase */}
      <Card variant="gaming" padding="md" className="bg-surface/30">
        <Text weight="semibold" size="sm" className="mb-3">Organization Preview</Text>
        <div className="space-y-2">
          <Text size="lg" weight="semibold">
            {watch('company_name') || 'Your Company Name'}
          </Text>
          <div className="flex items-center space-x-4 text-sm text-white/60">
            {watch('typical_budget_min') && watch('typical_budget_max') && (
              <div className="flex items-center space-x-1">
                <DollarSign className="w-4 h-4" />
                <Text size="sm" variant="secondary">
                  ${watch('typical_budget_min')}k - ${watch('typical_budget_max')}k
                </Text>
              </div>
            )}
            {watch('timeline_expectations') && (
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <Text size="sm" variant="secondary">
                  {watch('timeline_expectations')?.replace('_', '-')} projects
                </Text>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}