// @ts-nocheck
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Eye, Check, X, Clock } from "lucide-react";
import { format } from "date-fns";

interface GigWithPoster {
  id: string;
  title: string;
  description: string;
  timeline: string;
  budget_range: string;
  contract_type: string;
  status: string;
  project_type_tags: string[];
  skills_needed: string[];
  created_at: string;
  poster: {
    display_name: string;
    email?: string;
    company_name?: string;
    poster_type?: string;
  };
}

export function PendingGigApprovals() {
  const [gigs, setGigs] = useState<GigWithPoster[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGig, setSelectedGig] = useState<GigWithPoster | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchPendingGigs();
  }, []);

  const fetchPendingGigs = async () => {
    try {
      const { data, error } = await supabase
        .from('gigs')
        .select(`
          *,
          users!gigs_poster_id_fkey (
            display_name,
            company_name,
            poster_type
          )
        `)
        .eq('status', 'draft')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const gigsWithPoster = data?.map(gig => ({
        ...gig,
        poster: gig.users
      })) || [];

      setGigs(gigsWithPoster);
    } catch (error) {
      console.error('Error fetching pending gigs:', error);
      toast({
        title: "Error",
        description: "Failed to load pending gigs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApproveGig = async (gigId: string) => {
    try {
      const { error } = await supabase
        .from('gigs')
        .update({ status: 'open' })
        .eq('id', gigId);

      if (error) throw error;

      toast({
        title: "Gig Approved",
        description: "The gig has been approved and is now visible to applicants.",
      });

      fetchPendingGigs();
    } catch (error) {
      console.error('Error approving gig:', error);
      toast({
        title: "Error",
        description: "Failed to approve gig",
        variant: "destructive",
      });
    }
  };

  const handleRejectGig = async (gigId: string) => {
    try {
      const { error } = await supabase
        .from('gigs')
        .update({ status: 'cancelled' })
        .eq('id', gigId);

      if (error) throw error;

      toast({
        title: "Gig Rejected",
        description: "The gig has been rejected and the poster will be notified.",
      });

      fetchPendingGigs();
    } catch (error) {
      console.error('Error rejecting gig:', error);
      toast({
        title: "Error",
        description: "Failed to reject gig",
        variant: "destructive",
      });
    }
  };

  const getBudgetRangeDisplay = (range: string) => {
    const ranges: Record<string, string> = {
      'under_5k': 'Under $5K',
      '5k_15k': '$5K - $15K',
      '15k_50k': '$15K - $50K',
      '50k_100k': '$50K - $100K',
      '100k_plus': '$100K+',
      'equity_only': 'Equity Only',
    };
    return ranges[range] || range;
  };

  const getContractTypeDisplay = (type: string) => {
    const types: Record<string, string> = {
      'freelance': 'Freelance',
      'consulting': 'Consulting',
      'part_time': 'Part Time',
      'full_time': 'Full Time',
      'equity': 'Equity',
    };
    return types[type] || type;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Card className="bg-white dark:bg-gray-800">
          <CardContent className="p-8">
            <div className="text-center">
              <p className="text-gray-500 dark:text-gray-400">Loading pending gigs...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">Pending Gig Approvals</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Review and approve gig postings from posters ({gigs.length} pending)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {gigs.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                No pending gigs to review
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Poster</TableHead>
                  <TableHead>Budget</TableHead>
                  <TableHead>Contract</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {gigs.map((gig) => (
                  <TableRow key={gig.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {gig.title}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                          {gig.description}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {gig.poster?.display_name}
                        </p>
                        {gig.poster?.company_name && (
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {gig.poster.company_name}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {getBudgetRangeDisplay(gig.budget_range)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {getContractTypeDisplay(gig.contract_type)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {format(new Date(gig.created_at), 'MMM d, yyyy')}
                      </p>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedGig(gig)}
                            >
                              <Eye className="h-4 w-4" />
                              Review
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Review Gig: {selectedGig?.title}</DialogTitle>
                              <DialogDescription>
                                Review this gig posting for approval or rejection
                              </DialogDescription>
                            </DialogHeader>
                            {selectedGig && (
                              <div className="space-y-6">
                                {/* Gig Details */}
                                <div className="grid grid-cols-2 gap-6">
                                  <div>
                                    <h3 className="text-lg font-semibold mb-4">Gig Details</h3>
                                    <div className="space-y-3">
                                      <div>
                                        <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Title</label>
                                        <p className="text-gray-900 dark:text-white">{selectedGig.title}</p>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Budget Range</label>
                                        <p className="text-gray-900 dark:text-white">{getBudgetRangeDisplay(selectedGig.budget_range)}</p>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Contract Type</label>
                                        <p className="text-gray-900 dark:text-white">{getContractTypeDisplay(selectedGig.contract_type)}</p>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Timeline</label>
                                        <p className="text-gray-900 dark:text-white">{selectedGig.timeline}</p>
                                      </div>
                                    </div>
                                  </div>
                                  <div>
                                    <h3 className="text-lg font-semibold mb-4">Poster Details</h3>
                                    <div className="space-y-3">
                                      <div>
                                        <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Name</label>
                                        <p className="text-gray-900 dark:text-white">{selectedGig.poster?.display_name}</p>
                                      </div>
                                      {selectedGig.poster?.company_name && (
                                        <div>
                                          <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Company</label>
                                          <p className="text-gray-900 dark:text-white">{selectedGig.poster.company_name}</p>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                {/* Description */}
                                <div>
                                  <h3 className="text-lg font-semibold mb-2">Description</h3>
                                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                                    <p className="text-gray-900 dark:text-white whitespace-pre-wrap">
                                      {selectedGig.description}
                                    </p>
                                  </div>
                                </div>

                                {/* Skills and Tags */}
                                <div className="grid grid-cols-2 gap-6">
                                  {selectedGig.project_type_tags && selectedGig.project_type_tags.length > 0 && (
                                    <div>
                                      <h3 className="text-lg font-semibold mb-2">Project Types</h3>
                                      <div className="flex flex-wrap gap-2">
                                        {selectedGig.project_type_tags.map((tag, idx) => (
                                          <Badge key={idx} variant="secondary">{tag}</Badge>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                  {selectedGig.skills_needed && selectedGig.skills_needed.length > 0 && (
                                    <div>
                                      <h3 className="text-lg font-semibold mb-2">Skills Needed</h3>
                                      <div className="flex flex-wrap gap-2">
                                        {selectedGig.skills_needed.map((skill, idx) => (
                                          <Badge key={idx} variant="outline">{skill}</Badge>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>

                                {/* Action Buttons */}
                                <div className="flex justify-between pt-4 border-t">
                                  <Button
                                    variant="outline"
                                    onClick={() => setSelectedGig(null)}
                                  >
                                    Close
                                  </Button>
                                  <div className="flex gap-2">
                                    <Button
                                      variant="destructive"
                                      onClick={() => {
                                        handleRejectGig(selectedGig.id);
                                        setSelectedGig(null);
                                      }}
                                    >
                                      <X className="h-4 w-4 mr-2" />
                                      Reject
                                    </Button>
                                    <Button
                                      onClick={() => {
                                        handleApproveGig(selectedGig.id);
                                        setSelectedGig(null);
                                      }}
                                    >
                                      <Check className="h-4 w-4 mr-2" />
                                      Approve
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}