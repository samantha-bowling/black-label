import { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Plus, X } from 'lucide-react';
import { ProjectShowcase } from '@/types/auth';

interface ProjectShowcaseSectionProps {
  form: UseFormReturn<any>;
  projectShowcase: ProjectShowcase[];
  setProjectShowcase: (projects: ProjectShowcase[]) => void;
}

export function ProjectShowcaseSection({ 
  form, 
  projectShowcase, 
  setProjectShowcase 
}: ProjectShowcaseSectionProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [currentProject, setCurrentProject] = useState<ProjectShowcase>({
    name: '',
    role: '',
    dates: '',
    description: '',
    link: ''
  });

  const handleAddProject = () => {
    if (currentProject.name && currentProject.role) {
      if (editingIndex !== null) {
        const updated = [...projectShowcase];
        updated[editingIndex] = currentProject;
        setProjectShowcase(updated);
        setEditingIndex(null);
      } else {
        setProjectShowcase([...projectShowcase, currentProject]);
      }
      setCurrentProject({ name: '', role: '', dates: '', description: '', link: '' });
    }
  };

  const handleEditProject = (index: number) => {
    setCurrentProject(projectShowcase[index]);
    setEditingIndex(index);
  };

  const handleDeleteProject = (index: number) => {
    const updated = projectShowcase.filter((_, i) => i !== index);
    setProjectShowcase(updated);
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setCurrentProject({ name: '', role: '', dates: '', description: '', link: '' });
  };

  return (
    <Card className="bg-white/5 border-white/10">
      <CardHeader>
        <CardTitle className="text-white">Project Showcase</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Existing Projects */}
        {projectShowcase.length > 0 && (
          <div className="space-y-3">
            {projectShowcase.map((project, index) => (
              <Card key={index} className="bg-white/5 border-white/10">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="text-white font-medium">{project.name}</h4>
                      <p className="text-white/70 text-sm">{project.role}</p>
                      <p className="text-white/50 text-xs">{project.dates}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditProject(index)}
                      >
                        Edit
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteProject(index)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Add/Edit Project Form */}
        <Card className="bg-white/10 border-white/20">
          <CardContent className="p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-white text-sm">Project Name *</Label>
                <Input
                  value={currentProject.name}
                  onChange={(e) => setCurrentProject(prev => ({ ...prev, name: e.target.value }))}
                  className="bg-white/5 border-white/20 text-white"
                  placeholder="Project title"
                />
              </div>
              <div>
                <Label className="text-white text-sm">Your Role *</Label>
                <Input
                  value={currentProject.role}
                  onChange={(e) => setCurrentProject(prev => ({ ...prev, role: e.target.value }))}
                  className="bg-white/5 border-white/20 text-white"
                  placeholder="Your role on the project"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-white text-sm">Dates</Label>
                <Input
                  value={currentProject.dates}
                  onChange={(e) => setCurrentProject(prev => ({ ...prev, dates: e.target.value }))}
                  className="bg-white/5 border-white/20 text-white"
                  placeholder="e.g., 2023-2024"
                />
              </div>
              <div>
                <Label className="text-white text-sm">Link</Label>
                <Input
                  value={currentProject.link || ''}
                  onChange={(e) => setCurrentProject(prev => ({ ...prev, link: e.target.value }))}
                  className="bg-white/5 border-white/20 text-white"
                  placeholder="https://..."
                />
              </div>
            </div>

            <div>
              <Label className="text-white text-sm">Description</Label>
              <Textarea
                value={currentProject.description}
                onChange={(e) => setCurrentProject(prev => ({ ...prev, description: e.target.value }))}
                className="bg-white/5 border-white/20 text-white"
                placeholder="Brief description of the project and your contributions"
                rows={3}
              />
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                onClick={handleAddProject}
                disabled={!currentProject.name || !currentProject.role}
                size="sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                {editingIndex !== null ? 'Update Project' : 'Add Project'}
              </Button>
              
              {editingIndex !== null && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancelEdit}
                  size="sm"
                >
                  Cancel
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}
