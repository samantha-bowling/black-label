
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { AuthUser, ReportCategory, ReportSeverity } from '@/types/auth';
import { AlertTriangle, Flag } from 'lucide-react';

interface ReportUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportedUser: AuthUser;
}

const REPORT_CATEGORIES: { value: ReportCategory; label: string; description: string }[] = [
  { value: 'inappropriate_content', label: 'Inappropriate Content', description: 'Offensive or inappropriate profile content' },
  { value: 'unprofessional_behavior', label: 'Unprofessional Behavior', description: 'Rude, disrespectful, or unprofessional conduct' },
  { value: 'fake_credentials', label: 'Fake Credentials', description: 'Misleading or false information about skills/experience' },
  { value: 'spam', label: 'Spam', description: 'Unwanted promotional content or repetitive messaging' },
  { value: 'harassment', label: 'Harassment', description: 'Bullying, threats, or persistent unwanted contact' },
  { value: 'contract_violations', label: 'Contract Violations', description: 'Breach of agreement or terms of service' },
  { value: 'quality_concerns', label: 'Quality Concerns', description: 'Poor work quality or missed deadlines' },
  { value: 'other', label: 'Other', description: 'Other concerns not listed above' },
];

export function ReportUserModal({ isOpen, onClose, reportedUser }: ReportUserModalProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    category: '' as ReportCategory,
    severity: 'medium' as ReportSeverity,
    title: '',
    description: '',
    evidenceUrls: [''],
    isAnonymous: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !formData.category || !formData.title || !formData.description) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('reports')
        .insert({
          reporter_id: formData.isAnonymous ? null : user.id,
          reported_user_id: reportedUser.id,
          category: formData.category,
          severity: formData.severity,
          title: formData.title,
          description: formData.description,
          evidence_urls: formData.evidenceUrls.filter(url => url.trim() !== ''),
          is_anonymous: formData.isAnonymous,
        });

      if (error) throw error;

      toast({
        title: "Report Submitted",
        description: "Thank you for your report. Our moderation team will review it shortly.",
      });

      onClose();
      setFormData({
        category: '' as ReportCategory,
        severity: 'medium',
        title: '',
        description: '',
        evidenceUrls: [''],
        isAnonymous: false,
      });
    } catch (error) {
      console.error('Error submitting report:', error);
      toast({
        title: "Error",
        description: "Failed to submit report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const addEvidenceUrl = () => {
    setFormData(prev => ({
      ...prev,
      evidenceUrls: [...prev.evidenceUrls, '']
    }));
  };

  const updateEvidenceUrl = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      evidenceUrls: prev.evidenceUrls.map((url, i) => i === index ? value : url)
    }));
  };

  const removeEvidenceUrl = (index: number) => {
    setFormData(prev => ({
      ...prev,
      evidenceUrls: prev.evidenceUrls.filter((_, i) => i !== index)
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Flag className="h-5 w-5 text-red-500" />
            Report User: {reportedUser.displayName}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="category">Report Category *</Label>
            <Select value={formData.category} onValueChange={(value: ReportCategory) => setFormData(prev => ({ ...prev, category: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {REPORT_CATEGORIES.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    <div>
                      <div className="font-medium">{category.label}</div>
                      <div className="text-sm text-muted-foreground">{category.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="severity">Severity Level</Label>
            <Select value={formData.severity} onValueChange={(value: ReportSeverity) => setFormData(prev => ({ ...prev, severity: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low - Minor issue</SelectItem>
                <SelectItem value="medium">Medium - Moderate concern</SelectItem>
                <SelectItem value="high">High - Serious violation</SelectItem>
                <SelectItem value="critical">Critical - Immediate attention needed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Report Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Brief summary of the issue"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Detailed Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Please provide detailed information about the issue, including dates, context, and any relevant details..."
              rows={4}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Evidence URLs (Optional)</Label>
            <div className="space-y-2">
              {formData.evidenceUrls.map((url, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={url}
                    onChange={(e) => updateEvidenceUrl(index, e.target.value)}
                    placeholder="https://example.com/screenshot.png"
                  />
                  {formData.evidenceUrls.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeEvidenceUrl(index)}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addEvidenceUrl}
              >
                Add Evidence URL
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              You can provide links to screenshots, messages, or other evidence
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="anonymous"
              checked={formData.isAnonymous}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isAnonymous: checked as boolean }))}
            />
            <Label htmlFor="anonymous" className="text-sm">
              Submit this report anonymously
            </Label>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-yellow-800">
                <p className="font-medium mb-1">Important Notes:</p>
                <ul className="space-y-1 text-xs">
                  <li>• False reports may result in action against your account</li>
                  <li>• All reports are reviewed by our moderation team</li>
                  <li>• You may be contacted for additional information</li>
                  <li>• Anonymous reports cannot receive follow-up communication</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex gap-3 justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Report'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
