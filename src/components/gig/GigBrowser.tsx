// @ts-nocheck
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GigApplicationModal } from './GigApplicationModal';
import { useToast } from '@/hooks/use-toast';
import { Briefcase, MapPin, Clock, DollarSign, Search, Users, Building2 } from 'lucide-react';

interface Gig {
  id: string;
  title: string;
  description: string;
  timeline: string;
  budget_range: string;
  contract_type: string;
  project_type_tags: string[];
  skills_needed: string[];
  created_at: string;
  poster_id: string;
  poster?: {
    display_name: string;
    company_name?: string;
    location?: string;
  };
}

export function GigBrowser() {
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [contractTypeFilter, setContractTypeFilter] = useState('all');
  const [budgetFilter, setBudgetFilter] = useState('all');
  const [selectedGig, setSelectedGig] = useState<Gig | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchGigs();
  }, []);

  const fetchGigs = async () => {
    try {
      const { data, error } = await supabase
        .from('gigs')
        .select(`
          *,
          poster:users!gigs_poster_id_fkey(
            display_name,
            company_name,
            location
          )
        `)
        .eq('status', 'open')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGigs(data || []);
    } catch (error) {
      console.error('Error fetching gigs:', error);
      toast({
        title: "Error",
        description: "Failed to load opportunities",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredGigs = gigs.filter(gig => {
    const matchesSearch = searchTerm === '' || 
      gig.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gig.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gig.skills_needed?.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesContract = contractTypeFilter === 'all' || gig.contract_type === contractTypeFilter;
    const matchesBudget = budgetFilter === 'all' || gig.budget_range === budgetFilter;
    
    return matchesSearch && matchesContract && matchesBudget;
  });

  const formatBudgetRange = (range: string) => {
    const budgetMap: Record<string, string> = {
      'under_5k': 'Under $5K',
      '5k_15k': '$5K - $15K',
      '15k_50k': '$15K - $50K',
      '50k_100k': '$50K - $100K',
      '100k_plus': '$100K+',
      'equity_only': 'Equity Only'
    };
    return budgetMap[range] || range;
  };

  const formatContractType = (type: string) => {
    return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Browse Opportunities</h1>
          <p className="text-muted-foreground">
            Discover exciting projects and connect with professionals looking for talent.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search opportunities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={contractTypeFilter} onValueChange={setContractTypeFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Contract Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="freelance">Freelance</SelectItem>
                <SelectItem value="consulting">Consulting</SelectItem>
                <SelectItem value="part_time">Part-time</SelectItem>
                <SelectItem value="full_time">Full-time</SelectItem>
                <SelectItem value="equity">Equity</SelectItem>
              </SelectContent>
            </Select>

            <Select value={budgetFilter} onValueChange={setBudgetFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Budget Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Budgets</SelectItem>
                <SelectItem value="under_5k">Under $5K</SelectItem>
                <SelectItem value="5k_15k">$5K - $15K</SelectItem>
                <SelectItem value="15k_50k">$15K - $50K</SelectItem>
                <SelectItem value="50k_100k">$50K - $100K</SelectItem>
                <SelectItem value="100k_plus">$100K+</SelectItem>
                <SelectItem value="equity_only">Equity Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-6">
          {filteredGigs.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No opportunities found</h3>
                <p className="text-muted-foreground">
                  {searchTerm || contractTypeFilter !== 'all' || budgetFilter !== 'all' 
                    ? 'Try adjusting your filters or search terms.'
                    : 'Check back soon for new opportunities.'
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredGigs.map((gig) => (
              <Card key={gig.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{gig.title}</CardTitle>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        {gig.poster?.company_name && (
                          <div className="flex items-center gap-1">
                            <Building2 className="h-4 w-4" />
                            {gig.poster.company_name}
                          </div>
                        )}
                        {gig.poster?.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {gig.poster.location}
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {new Date(gig.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="secondary">
                          {formatContractType(gig.contract_type)}
                        </Badge>
                        {gig.budget_range && (
                          <Badge variant="outline" className="flex items-center gap-1">
                            <DollarSign className="h-3 w-3" />
                            {formatBudgetRange(gig.budget_range)}
                          </Badge>
                        )}
                        {gig.timeline && (
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {gig.timeline}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <p className="text-muted-foreground mb-4 line-clamp-3">
                    {gig.description}
                  </p>

                  {gig.skills_needed && gig.skills_needed.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-medium mb-2">Skills needed:</p>
                      <div className="flex flex-wrap gap-2">
                        {gig.skills_needed.slice(0, 6).map((skill, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {gig.skills_needed.length > 6 && (
                          <Badge variant="outline" className="text-xs">
                            +{gig.skills_needed.length - 6} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>by {gig.poster?.display_name}</span>
                    </div>
                    
                    <Button 
                      onClick={() => setSelectedGig(gig)}
                      disabled={gig.poster_id === user?.id}
                    >
                      {gig.poster_id === user?.id ? 'Your Post' : 'Apply Now'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {selectedGig && (
        <GigApplicationModal
          gig={selectedGig}
          isOpen={!!selectedGig}
          onClose={() => setSelectedGig(null)}
        />
      )}
    </div>
  );
}