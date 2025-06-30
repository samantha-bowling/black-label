
import { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AwardsSelector } from '@/components/forms/AwardsSelector';
import { MultiSelectPills } from '@/components/forms/MultiSelectPills';
import { ProjectShowcaseSection } from './ProjectShowcaseSection';
import { ProjectShowcase } from '@/types/auth';

const SPECIALTY_SKILLS_OPTIONS = [
  'Unity', 'Unreal Engine', 'C#', 'C++', 'JavaScript', 'Python',
  'Maya', 'Blender', '3ds Max', 'Photoshop', 'Illustrator', 'Figma',
  'Wwise', 'FMOD', 'Pro Tools', 'Ableton', 'Logic Pro',
  'Scrum', 'Agile', 'Jira', 'Confluence', 'Perforce', 'Git'
];

const AVAILABLE_FOR_OPTIONS = [
  'Full-time Contract', 'Part-time Contract', 'Freelance Projects',
  'Consulting', 'Remote Work', 'On-site Work', 'Hybrid Work',
  'Short-term Projects', 'Long-term Projects'
];

const WORK_STYLE_OPTIONS = [
  'Independent Worker', 'Team Collaborator', 'Leadership Role',
  'Mentoring Others', 'Learning New Skills', 'Cross-functional',
  'Detail-oriented', 'Big Picture Thinker', 'Problem Solver',
  'Creative Thinker', 'Technical Expert', 'Communication Focused'
];

interface GigSeekerSectionProps {
  form: UseFormReturn<any>;
}

export function GigSeekerSection({ form }: GigSeekerSectionProps) {
  const [projectShowcase, setProjectShowcase] = useState<ProjectShowcase[]>([]);

  return (
    <div className="space-y-6">
      {/* Skills & Expertise */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Skills & Expertise</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <MultiSelectPills
            label="Specialty Skills"
            options={SPECIALTY_SKILLS_OPTIONS}
            selectedOptions={form.watch('skills') || []}
            onChange={(selected) => form.setValue('skills', selected)}
            description="Technical skills, tools, and technologies you're proficient in"
          />

          <AwardsSelector
            selectedAwards={form.watch('awards') || []}
            onChange={(selected) => form.setValue('awards', selected)}
          />
        </CardContent>
      </Card>

      {/* Work Preferences */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Work Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <MultiSelectPills
            label="Available For"
            options={AVAILABLE_FOR_OPTIONS}
            selectedOptions={form.watch('available_for') || []}
            onChange={(selected) => form.setValue('available_for', selected)}
            description="Types of work arrangements you're open to"
          />

          <MultiSelectPills
            label="Work Style"
            options={WORK_STYLE_OPTIONS}
            selectedOptions={form.watch('work_style') || []}
            onChange={(selected) => form.setValue('work_style', selected)}
            description="How you prefer to work and contribute to teams"
          />

          <div>
            <Label className="text-white text-sm">Availability Status</Label>
            <Select 
              value={form.watch('availability_status') || ''} 
              onValueChange={(value) => form.setValue('availability_status', value)}
            >
              <SelectTrigger className="bg-white/5 border-white/20 text-white">
                <SelectValue placeholder="Select availability status" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="available">Available Now</SelectItem>
                <SelectItem value="limited">Limited Availability</SelectItem>
                <SelectItem value="unavailable">Currently Unavailable</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Rate Information */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Rate Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-white text-sm">Rate Type</Label>
            <Select 
              value={form.watch('rate_type') || ''} 
              onValueChange={(value) => form.setValue('rate_type', value === '' ? null : value)}
            >
              <SelectTrigger className="bg-white/5 border-white/20 text-white">
                <SelectValue placeholder="Select rate type" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="hourly">Hourly Rate</SelectItem>
                <SelectItem value="project">Project Rate</SelectItem>
                <SelectItem value="salary">Annual Salary</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-white text-sm">Minimum Rate</Label>
              <Input
                type="number"
                min="0"
                {...form.register('rate_min', { valueAsNumber: true })}
                className="bg-white/5 border-white/20 text-white"
                placeholder="0"
              />
            </div>
            <div>
              <Label className="text-white text-sm">Maximum Rate</Label>
              <Input
                type="number"
                min="0"
                {...form.register('rate_max', { valueAsNumber: true })}
                className="bg-white/5 border-white/20 text-white"
                placeholder="0"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Project Showcase */}
      <ProjectShowcaseSection
        form={form}
        projectShowcase={projectShowcase}
        setProjectShowcase={setProjectShowcase}
      />
    </div>
  );
}
