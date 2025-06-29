
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FormSection } from '@/components/forms/FormSection';
import { FormFieldGroup } from '@/components/forms/FormFieldGroup';
import { ButtonPrimary } from '@/components/ui/primitives';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Trash2, Briefcase } from 'lucide-react';
import { ProjectShowcase } from '@/types/auth';

interface ProjectShowcaseData {
  project_showcase: ProjectShowcase[];
}

interface ProjectShowcaseOnboardingStepProps {
  userId: string;
  onNext: () => void;
  onBack: () => void;
  initialData?: ProjectShowcase[];
}

const projectFields = [
  {
    id: 'name',
    label: 'Project Name',
    type: 'text' as const,
    placeholder: 'e.g., Mobile Game UI Design',
    required: true,
    validation: { required: 'Project name is required' }
  },
  {
    id: 'role',
    label: 'Your Role',
    type: 'text' as const,
    placeholder: 'e.g., Lead UI/UX Designer',
    required: true,
    validation: { required: 'Your role is required' }
  },
  {
    id: 'dates',
    label: 'Timeline',
    type: 'text' as const,
    placeholder: 'e.g., 3 months, 2023',
    description: 'When did you work on this project?'
  },
  {
    id: 'description',
    label: 'Description',
    type: 'textarea' as const,
    placeholder: 'Describe your contribution and the impact of your work...',
    description: 'What did you accomplish? What was the outcome? (500 characters max)',
    validation: { 
      maxLength: { 
        value: 500, 
        message: 'Description must be 500 characters or less' 
      } 
    }
  },
  {
    id: 'link',
    label: 'Project Link (Optional)',
    type: 'url' as const,
    placeholder: 'https://...',
    description: 'Link to portfolio, case study, or live project'
  }
];

export function ProjectShowcaseOnboardingStep({ 
  userId, 
  onNext, 
  onBack, 
  initialData = [] 
}: ProjectShowcaseOnboardingStepProps) {
  const [projects, setProjects] = useState<ProjectShowcase[]>(
    initialData.length > 0 ? initialData : []
  );
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const form = useForm<ProjectShowcase>({
    defaultValues: {
      name: '',
      role: '',
      dates: '',
      description: '',
      link: ''
    }
  });

  const handleAddProject = (data: ProjectShowcase) => {
    if (editingIndex !== null) {
      // Update existing project
      const updatedProjects = [...projects];
      updatedProjects[editingIndex] = data;
      setProjects(updatedProjects);
      setEditingIndex(null);
    } else {
      // Add new project
      if (projects.length >= 3) return;
      setProjects([...projects, data]);
    }
    
    form.reset();
  };

  const handleEditProject = (index: number) => {
    const project = projects[index];
    form.reset(project);
    setEditingIndex(index);
  };

  const handleDeleteProject = (index: number) => {
    const updatedProjects = projects.filter((_, i) => i !== index);
    setProjects(updatedProjects);
    if (editingIndex === index) {
      setEditingIndex(null);
      form.reset();
    }
  };

  const handleCancel = () => {
    setEditingIndex(null);
    form.reset();
  };

  const handleContinue = () => {
    // Store projects in form data or context for submission
    onNext();
  };

  const canAddMore = projects.length < 3;

  return (
    <div className="space-y-6">
      <FormSection
        title="Project Showcase"
        subtitle="Highlight your best work (up to 3 projects)"
        icon={<Briefcase className="w-5 h-5" />}
      >
        <div className="space-y-6">
          {/* Existing Projects */}
          {projects.map((project, index) => (
            <Card key={index} className="bg-black/10 border-white/20">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h4 className="text-white font-medium">{project.name}</h4>
                    <p className="text-white/70 text-sm">{project.role}</p>
                    {project.dates && (
                      <p className="text-white/50 text-xs">{project.dates}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleEditProject(index)}
                      className="text-white/60 hover:text-white text-sm"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteProject(index)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                {project.description && (
                  <p className="text-white/80 text-sm mb-2">{project.description}</p>
                )}
                {project.link && (
                  <a 
                    href={project.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 text-sm"
                  >
                    View Project →
                  </a>
                )}
              </CardContent>
            </Card>
          ))}

          {/* Add/Edit Project Form */}
          {(canAddMore || editingIndex !== null) && (
            <Card className="bg-black/20 border-white/20">
              <CardContent className="p-6">
                <form onSubmit={form.handleSubmit(handleAddProject)} className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-white font-medium">
                      {editingIndex !== null ? 'Edit Project' : 'Add Project'}
                    </h4>
                    {editingIndex !== null && (
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="text-white/60 hover:text-white text-sm"
                      >
                        Cancel
                      </button>
                    )}
                  </div>

                  <FormFieldGroup
                    fields={projectFields}
                    form={form}
                    columns={1}
                  />

                  <div className="flex justify-end">
                    <ButtonPrimary type="submit" size="sm">
                      {editingIndex !== null ? 'Update Project' : 'Add Project'}
                    </ButtonPrimary>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Add Project Button */}
          {canAddMore && editingIndex === null && (
            <button
              type="button"
              onClick={() => setEditingIndex(-1)}
              className="w-full border-2 border-dashed border-white/30 rounded-lg p-8 text-white/60 hover:text-white hover:border-white/50 transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Project ({projects.length}/3)
            </button>
          )}
        </div>
      </FormSection>

      {/* Navigation */}
      <div className="flex justify-between">
        <ButtonPrimary
          type="button"
          onClick={onBack}
          size="lg"
          className="bg-white/10 hover:bg-white/20"
        >
          Back
        </ButtonPrimary>
        <ButtonPrimary
          type="button"
          onClick={handleContinue}
          size="lg"
        >
          Continue
        </ButtonPrimary>
      </div>
    </div>
  );
}
