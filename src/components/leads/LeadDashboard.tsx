// @ts-nocheck

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { 
  Eye, 
  Mail, 
  Phone, 
  Calendar, 
  DollarSign, 
  Building2, 
  User, 
  MessageSquare,
  Filter,
  TrendingUp,
  Clock,
  CheckCircle
} from 'lucide-react';
import { format } from 'date-fns';

interface LeadInquiry {
  id: string;
  inquirer_name: string;
  inquirer_email: string;
  inquirer_company?: string;
  project_title: string;
  project_description: string;
  project_type: string;
  budget_range?: string;
  timeline: string;
  additional_details?: string;
  lead_score: number;
  status: string;
  priority: string;
  created_at: string;
  updated_at: string;
  contacted_at?: string;
  follow_up_date?: string;
}

export function LeadDashboard() {
  const [selectedLead, setSelectedLead] = useState<LeadInquiry | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [noteText, setNoteText] = useState('');
  const queryClient = useQueryClient();

  const { data: leads = [], isLoading } = useQuery({
    queryKey: ['lead-inquiries'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lead_inquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as LeadInquiry[];
    },
  });

  const updateLeadStatus = useMutation({
    mutationFn: async ({ leadId, status, contactedAt }: { leadId: string; status: string; contactedAt?: string }) => {
      const updateData: any = { status };
      if (contactedAt) updateData.contacted_at = contactedAt;
      
      const { error } = await supabase
        .from('lead_inquiries')
        .update(updateData)
        .eq('id', leadId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lead-inquiries'] });
      toast.success('Lead status updated');
    },
    onError: () => {
      toast.error('Failed to update lead status');
    },
  });

  const addLeadNote = useMutation({
    mutationFn: async ({ leadId, note, noteType }: { leadId: string; note: string; noteType: string }) => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('lead_notes')
        .insert({
          lead_inquiry_id: leadId,
          note,
          note_type: noteType,
          created_by_user_id: user.user.id,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      setNoteText('');
      toast.success('Note added');
    },
    onError: () => {
      toast.error('Failed to add note');
    },
  });

  const filteredLeads = leads.filter(lead => 
    statusFilter === 'all' || lead.status === statusFilter
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-500';
      case 'contacted': return 'bg-yellow-500';
      case 'qualified': return 'bg-purple-500';
      case 'proposal_sent': return 'bg-orange-500';
      case 'closed_won': return 'bg-green-500';
      case 'closed_lost': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  const formatBudgetRange = (range?: string) => {
    const ranges: Record<string, string> = {
      'under_5k': 'Under $5K',
      '5k_15k': '$5K - $15K',
      '15k_50k': '$15K - $50K',
      '50k_100k': '$50K - $100K',
      '100k_plus': '$100K+',
    };
    return range ? ranges[range] || range : 'Not specified';
  };

  // Lead statistics
  const stats = {
    total: leads.length,
    new: leads.filter(l => l.status === 'new').length,
    contacted: leads.filter(l => l.status === 'contacted').length,
    qualified: leads.filter(l => l.status === 'qualified').length,
    won: leads.filter(l => l.status === 'closed_won').length,
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
        <div className="h-96 bg-muted animate-pulse rounded-lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{stats.total}</div>
            <div className="text-sm text-muted-foreground">Total Leads</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-500">{stats.new}</div>
            <div className="text-sm text-muted-foreground">New</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-500">{stats.contacted}</div>
            <div className="text-sm text-muted-foreground">Contacted</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-500">{stats.qualified}</div>
            <div className="text-sm text-muted-foreground">Qualified</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-500">{stats.won}</div>
            <div className="text-sm text-muted-foreground">Won</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Lead Pipeline
            </CardTitle>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Leads</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="qualified">Qualified</SelectItem>
                  <SelectItem value="proposal_sent">Proposal Sent</SelectItem>
                  <SelectItem value="closed_won">Closed Won</SelectItem>
                  <SelectItem value="closed_lost">Closed Lost</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredLeads.map((lead) => (
              <div
                key={lead.id}
                className="border rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => setSelectedLead(lead)}
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold">{lead.project_title}</h3>
                      <Badge className={`${getStatusColor(lead.status)} text-white text-xs`}>
                        {lead.status.replace('_', ' ')}
                      </Badge>
                      <Badge variant="outline" className={`text-xs ${getPriorityColor(lead.priority)}`}>
                        {lead.priority} priority
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {lead.inquirer_name}
                      </div>
                      {lead.inquirer_company && (
                        <div className="flex items-center gap-1">
                          <Building2 className="w-4 h-4" />
                          {lead.inquirer_company}
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        {formatBudgetRange(lead.budget_range)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {lead.timeline}
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {lead.project_description}
                    </p>
                  </div>
                  
                  <div className="text-right space-y-1">
                    <div className="text-sm font-medium">Score: {lead.lead_score}/100</div>
                    <div className="text-xs text-muted-foreground">
                      {format(new Date(lead.created_at), 'MMM d, yyyy')}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {filteredLeads.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No leads found matching your filters.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Lead Detail Modal */}
      {selectedLead && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{selectedLead.project_title}</CardTitle>
                <Button variant="outline" onClick={() => setSelectedLead(null)}>
                  Close
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Contact Information</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>{selectedLead.inquirer_name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <a href={`mailto:${selectedLead.inquirer_email}`} className="text-primary hover:underline">
                        {selectedLead.inquirer_email}
                      </a>
                    </div>
                    {selectedLead.inquirer_company && (
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4" />
                        <span>{selectedLead.inquirer_company}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-semibold">Project Details</h3>
                  <div className="space-y-2">
                    <div><strong>Type:</strong> {selectedLead.project_type.replace('_', ' ')}</div>
                    <div><strong>Budget:</strong> {formatBudgetRange(selectedLead.budget_range)}</div>
                    <div><strong>Timeline:</strong> {selectedLead.timeline}</div>
                    <div><strong>Score:</strong> {selectedLead.lead_score}/100</div>
                  </div>
                </div>
              </div>

              {/* Project Description */}
              <div>
                <h3 className="font-semibold mb-2">Project Description</h3>
                <p className="text-muted-foreground">{selectedLead.project_description}</p>
                {selectedLead.additional_details && (
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Additional Details</h4>
                    <p className="text-muted-foreground">{selectedLead.additional_details}</p>
                  </div>
                )}
              </div>

              {/* Status Management */}
              <div className="space-y-4">
                <h3 className="font-semibold">Lead Management</h3>
                <div className="flex gap-4">
                  <Select
                    value={selectedLead.status}
                    onValueChange={(status) => {
                      const contactedAt = status === 'contacted' && selectedLead.status === 'new' ? new Date().toISOString() : undefined;
                      updateLeadStatus.mutate({ 
                        leadId: selectedLead.id, 
                        status,
                        contactedAt
                      });
                      setSelectedLead({ ...selectedLead, status });
                    }}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="contacted">Contacted</SelectItem>
                      <SelectItem value="qualified">Qualified</SelectItem>
                      <SelectItem value="proposal_sent">Proposal Sent</SelectItem>
                      <SelectItem value="closed_won">Closed Won</SelectItem>
                      <SelectItem value="closed_lost">Closed Lost</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button
                    onClick={() => window.open(`mailto:${selectedLead.inquirer_email}?subject=Re: ${selectedLead.project_title}`)}
                    className="flex items-center gap-2"
                  >
                    <Mail className="w-4 h-4" />
                    Email Client
                  </Button>
                </div>
              </div>

              {/* Add Note */}
              <div className="space-y-4">
                <h3 className="font-semibold">Add Note</h3>
                <div className="space-y-2">
                  <Textarea
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    placeholder="Add a note about this lead..."
                    rows={3}
                  />
                  <Button
                    onClick={() => addLeadNote.mutate({
                      leadId: selectedLead.id,
                      note: noteText,
                      noteType: 'general'
                    })}
                    disabled={!noteText.trim() || addLeadNote.isPending}
                  >
                    Add Note
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
