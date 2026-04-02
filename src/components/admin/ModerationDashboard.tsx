// @ts-nocheck
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Report, ReportStatus, ReportSeverity, ModerationActionType, ReportCategory } from '@/types/auth';
import { AlertTriangle, Eye, Clock, CheckCircle, XCircle, Flag, User, Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface ReportWithUser extends Report {
  reporter: { display_name: string; email: string } | null;
  reported_user: { display_name: string; email: string; avatar_url?: string } | null;
}

const SEVERITY_COLORS = {
  low: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-orange-100 text-orange-800',
  critical: 'bg-red-100 text-red-800'
};

const STATUS_COLORS = {
  pending: 'bg-gray-100 text-gray-800',
  under_review: 'bg-blue-100 text-blue-800',
  resolved: 'bg-green-100 text-green-800',
  dismissed: 'bg-red-100 text-red-800'
};

export function ModerationDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [reports, setReports] = useState<ReportWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<ReportWithUser | null>(null);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    severity: 'all',
    category: 'all'
  });

  const [actionForm, setActionForm] = useState({
    type: '' as ModerationActionType | '',
    reason: '',
    details: '',
    expiresAt: ''
  });

  const fetchReports = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('reports')
        .select(`
          *,
          reporter:users!reporter_id (
            display_name,
            email
          ),
          reported_user:users!reported_user_id (
            display_name,
            email,
            avatar_url
          )
        `)
        .order('created_at', { ascending: false });

      // Apply filters with proper type casting
      if (filters.status !== 'all') {
        query = query.eq('status', filters.status as ReportStatus);
      }
      if (filters.severity !== 'all') {
        query = query.eq('severity', filters.severity as ReportSeverity);
      }
      if (filters.category !== 'all') {
        query = query.eq('category', filters.category as ReportCategory);
      }

      const { data, error } = await query;
      if (error) throw error;

      console.log('Raw reports data:', data);

      // Transform and validate the data
      const transformedReports: ReportWithUser[] = (data || []).map(report => ({
        ...report,
        reporter: report.reporter || null,
        reported_user: report.reported_user || null
      }));

      console.log('Transformed reports:', transformedReports);
      setReports(transformedReports);
    } catch (error) {
      console.error('Error fetching reports:', error);
      toast({
        title: "Error",
        description: "Failed to load reports",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchReports();
    }
  }, [user, filters]);

  const updateReportStatus = async (reportId: string, status: ReportStatus, adminNotes?: string) => {
    try {
      const updates: any = {
        status,
        reviewed_by_admin_id: user?.id,
        reviewed_at: new Date().toISOString()
      };
      
      if (adminNotes) {
        updates.admin_notes = adminNotes;
      }

      const { error } = await supabase
        .from('reports')
        .update(updates)
        .eq('id', reportId);

      if (error) throw error;

      toast({
        title: "Report Updated",
        description: `Report status changed to ${status}`,
      });

      fetchReports();
      setSelectedReport(null);
    } catch (error) {
      console.error('Error updating report:', error);
      toast({
        title: "Error",
        description: "Failed to update report",
        variant: "destructive",
      });
    }
  };

  const takeModerationAction = async () => {
    if (!selectedReport || !actionForm.type || !actionForm.reason) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const actionData: any = {
        user_id: selectedReport.reported_user_id,
        admin_id: user?.id,
        report_id: selectedReport.id,
        action_type: actionForm.type as ModerationActionType,
        reason: actionForm.reason,
        details: actionForm.details || null,
        expires_at: actionForm.expiresAt || null
      };

      const { error } = await supabase
        .from('moderation_actions')
        .insert(actionData);

      if (error) throw error;

      // Update user restrictions based on action type
      const userUpdates: any = {};
      switch (actionForm.type) {
        case 'temporary_suspension':
        case 'permanent_suspension':
          userUpdates.is_suspended = true;
          if (actionForm.expiresAt) {
            userUpdates.suspension_expires_at = actionForm.expiresAt;
          }
          break;
        case 'search_visibility_reduction':
          userUpdates.search_visibility_reduced = true;
          break;
        case 'messaging_restriction':
          userUpdates.messaging_restricted = true;
          break;
        case 'gig_posting_restriction':
          userUpdates.gig_posting_restricted = true;
          break;
      }

      if (Object.keys(userUpdates).length > 0) {
        const { error: userError } = await supabase
          .from('users')
          .update(userUpdates)
          .eq('id', selectedReport.reported_user_id);

        if (userError) throw userError;
      }

      await updateReportStatus(selectedReport.id, 'resolved', `Action taken: ${actionForm.type}`);

      setIsActionModalOpen(false);
      setActionForm({
        type: '',
        reason: '',
        details: '',
        expiresAt: ''
      });

      toast({
        title: "Action Taken",
        description: `Moderation action applied successfully`,
      });
    } catch (error) {
      console.error('Error taking moderation action:', error);
      toast({
        title: "Error",
        description: "Failed to take moderation action",
        variant: "destructive",
      });
    }
  };

  const getCategoryLabel = (category: string) => {
    return category.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading reports...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Content Moderation</h2>
          <p className="text-muted-foreground">Review and manage user reports</p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Status</label>
              <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="under_review">Under Review</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="dismissed">Dismissed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Severity</label>
              <Select value={filters.severity} onValueChange={(value) => setFilters(prev => ({ ...prev, severity: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severities</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Category</label>
              <Select value={filters.category} onValueChange={(value) => setFilters(prev => ({ ...prev, category: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="inappropriate_content">Inappropriate Content</SelectItem>
                  <SelectItem value="unprofessional_behavior">Unprofessional Behavior</SelectItem>
                  <SelectItem value="fake_credentials">Fake Credentials</SelectItem>
                  <SelectItem value="spam">Spam</SelectItem>
                  <SelectItem value="harassment">Harassment</SelectItem>
                  <SelectItem value="contract_violations">Contract Violations</SelectItem>
                  <SelectItem value="quality_concerns">Quality Concerns</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reports List */}
      <div className="space-y-4">
        {reports.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <Flag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No reports found matching your filters</p>
            </CardContent>
          </Card>
        ) : (
          reports.map((report) => (
            <Card key={report.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{report.title}</h3>
                      <Badge className={SEVERITY_COLORS[report.severity as ReportSeverity]}>
                        {report.severity}
                      </Badge>
                      <Badge className={STATUS_COLORS[report.status as ReportStatus]}>
                        {report.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Category: {getCategoryLabel(report.category)}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedReport(report)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Review
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-muted-foreground">Reported User</p>
                    <p>{report.reported_user?.display_name || 'Unknown'}</p>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">Reporter</p>
                    <p>{report.is_anonymous ? 'Anonymous' : report.reporter?.display_name || 'Unknown'}</p>
                  </div>
                </div>

                <div className="mt-4 text-sm text-muted-foreground">
                  <p>Reported {format(new Date(report.created_at), 'MMM dd, yyyy at HH:mm')}</p>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Report Detail Modal */}
      {selectedReport && (
        <Dialog open={!!selectedReport} onOpenChange={() => setSelectedReport(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Flag className="h-5 w-5" />
                Report Details
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Report Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Status:</span>
                        <Badge className={STATUS_COLORS[selectedReport.status as ReportStatus]}>
                          {selectedReport.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Severity:</span>
                        <Badge className={SEVERITY_COLORS[selectedReport.severity as ReportSeverity]}>
                          {selectedReport.severity}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Category:</span>
                        <span>{getCategoryLabel(selectedReport.category)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Created:</span>
                        <span>{format(new Date(selectedReport.created_at), 'MMM dd, yyyy HH:mm')}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Parties Involved</h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Reporter:</span>
                        <p>{selectedReport.is_anonymous ? 'Anonymous' : selectedReport.reporter?.display_name || 'Unknown'}</p>
                        {!selectedReport.is_anonymous && selectedReport.reporter?.email && (
                          <p className="text-xs text-muted-foreground">{selectedReport.reporter.email}</p>
                        )}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Reported User:</span>
                        <p>{selectedReport.reported_user?.display_name || 'Unknown'}</p>
                        {selectedReport.reported_user?.email && (
                          <p className="text-xs text-muted-foreground">{selectedReport.reported_user.email}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Report Content</h4>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm font-medium text-muted-foreground">Title:</span>
                        <p className="text-sm">{selectedReport.title}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-muted-foreground">Description:</span>
                        <p className="text-sm bg-gray-50 p-3 rounded">{selectedReport.description}</p>
                      </div>
                    </div>
                  </div>

                  {selectedReport.evidence_urls && selectedReport.evidence_urls.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Evidence URLs</h4>
                      <div className="space-y-1">
                        {selectedReport.evidence_urls.map((url, index) => (
                          <a
                            key={index}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:underline block"
                          >
                            {url}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {selectedReport.admin_notes && (
                <div>
                  <h4 className="font-semibold mb-2">Admin Notes</h4>
                  <p className="text-sm bg-blue-50 p-3 rounded">{selectedReport.admin_notes}</p>
                </div>
              )}

              <div className="flex gap-3 justify-end pt-4 border-t">
                {selectedReport.status === 'pending' && (
                  <Button
                    variant="outline"
                    onClick={() => updateReportStatus(selectedReport.id, 'under_review')}
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    Start Review
                  </Button>
                )}
                
                {(selectedReport.status === 'pending' || selectedReport.status === 'under_review') && (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => updateReportStatus(selectedReport.id, 'dismissed', 'Report dismissed after review')}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Dismiss
                    </Button>
                    <Button
                      onClick={() => setIsActionModalOpen(true)}
                    >
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Take Action
                    </Button>
                  </>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Action Modal */}
      <Dialog open={isActionModalOpen} onOpenChange={setIsActionModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Take Moderation Action</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Action Type</label>
              <Select value={actionForm.type} onValueChange={(value: ModerationActionType) => setActionForm(prev => ({ ...prev, type: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="warning">Warning - Send warning to user</SelectItem>
                  <SelectItem value="temporary_suspension">Temporary Suspension</SelectItem>
                  <SelectItem value="permanent_suspension">Permanent Suspension</SelectItem>
                  <SelectItem value="profile_flag">Flag Profile - Add warning notice</SelectItem>
                  <SelectItem value="search_visibility_reduction">Reduce Search Visibility</SelectItem>
                  <SelectItem value="messaging_restriction">Restrict Messaging</SelectItem>
                  <SelectItem value="gig_posting_restriction">Restrict Gig Posting</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {(actionForm.type === 'temporary_suspension' || actionForm.type.includes('restriction')) && (
              <div>
                <label className="text-sm font-medium mb-2 block">Expires At (Optional)</label>
                <Input
                  type="datetime-local"
                  value={actionForm.expiresAt}
                  onChange={(e) => setActionForm(prev => ({ ...prev, expiresAt: e.target.value }))}
                />
              </div>
            )}

            <div>
              <label className="text-sm font-medium mb-2 block">Reason *</label>
              <Input
                value={actionForm.reason}
                onChange={(e) => setActionForm(prev => ({ ...prev, reason: e.target.value }))}
                placeholder="Brief reason for this action"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Additional Details</label>
              <Textarea
                value={actionForm.details}
                onChange={(e) => setActionForm(prev => ({ ...prev, details: e.target.value }))}
                placeholder="Additional context or instructions..."
                rows={3}
              />
            </div>

            <div className="flex gap-3 justify-end pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => setIsActionModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={takeModerationAction}
                disabled={!actionForm.type || !actionForm.reason}
              >
                Take Action
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
