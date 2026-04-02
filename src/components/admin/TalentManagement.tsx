// @ts-nocheck

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Search, Eye, UserPlus, Mail, Filter, Star, AlertTriangle, CheckCircle } from "lucide-react";
import { format } from "date-fns";
import { AvailabilityIndicator } from "@/components/profile/AvailabilityIndicator";

interface TalentProfile {
  id: string;
  display_name: string;
  bio: string;
  avatar_url?: string;
  role: string;
  skills: string[];
  availability_status: string;
  past_credits?: string;
  rate_range_min?: number;
  rate_range_max?: number;
  onboarding_completed: boolean;
  public_profile: boolean;
  created_at: string;
  social_links?: Record<string, string>;
  invites_remaining: number;
  company_name?: string;
  location?: string;
}

interface TalentFilters {
  search: string;
  availability: string;
  skills: string[];
  profileStatus: string;
  onboardingStatus: string;
}

export function TalentManagement() {
  const [talents, setTalents] = useState<TalentProfile[]>([]);
  const [filteredTalents, setFilteredTalents] = useState<TalentProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTalent, setSelectedTalent] = useState<TalentProfile | null>(null);
  const [selectedTalents, setSelectedTalents] = useState<Set<string>>(new Set());
  const [availableSkills, setAvailableSkills] = useState<string[]>([]);
  const { toast } = useToast();

  const [filters, setFilters] = useState<TalentFilters>({
    search: '',
    availability: 'all',
    skills: [],
    profileStatus: 'all',
    onboardingStatus: 'all',
  });

  useEffect(() => {
    fetchTalents();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [talents, filters]);

  const fetchTalents = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('role', 'gig_seeker')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const talentProfiles: TalentProfile[] = data?.map(user => ({
        id: user.id,
        display_name: user.display_name || 'Anonymous',
        bio: user.bio || '',
        avatar_url: user.avatar_url,
        role: user.role,
        skills: user.skills || [],
        availability_status: user.availability_status || 'available',
        past_credits: user.past_credits,
        rate_range_min: user.rate_range_min,
        rate_range_max: user.rate_range_max,
        onboarding_completed: user.onboarding_completed,
        public_profile: user.public_profile,
        created_at: user.created_at,
        social_links: user.social_links as Record<string, string>,
        invites_remaining: user.invites_remaining,
        company_name: user.company_name,
        location: user.location,
      })) || [];

      setTalents(talentProfiles);

      // Extract unique skills for filter dropdown
      const skillsSet = new Set<string>();
      talentProfiles.forEach(talent => {
        talent.skills.forEach(skill => skillsSet.add(skill));
      });
      setAvailableSkills(Array.from(skillsSet).sort());

    } catch (error) {
      console.error('Error fetching talents:', error);
      toast({
        title: "Error",
        description: "Failed to load talent profiles",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...talents];

    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(talent =>
        talent.display_name.toLowerCase().includes(searchTerm) ||
        talent.bio.toLowerCase().includes(searchTerm) ||
        talent.skills.some(skill => skill.toLowerCase().includes(searchTerm)) ||
        (talent.location && talent.location.toLowerCase().includes(searchTerm))
      );
    }

    // Availability filter
    if (filters.availability !== 'all') {
      filtered = filtered.filter(talent => talent.availability_status === filters.availability);
    }

    // Skills filter
    if (filters.skills.length > 0) {
      filtered = filtered.filter(talent =>
        filters.skills.some(skill => talent.skills.includes(skill))
      );
    }

    // Profile status filter
    if (filters.profileStatus !== 'all') {
      if (filters.profileStatus === 'public') {
        filtered = filtered.filter(talent => talent.public_profile);
      } else if (filters.profileStatus === 'private') {
        filtered = filtered.filter(talent => !talent.public_profile);
      }
    }

    // Onboarding status filter
    if (filters.onboardingStatus !== 'all') {
      if (filters.onboardingStatus === 'completed') {
        filtered = filtered.filter(talent => talent.onboarding_completed);
      } else if (filters.onboardingStatus === 'incomplete') {
        filtered = filtered.filter(talent => !talent.onboarding_completed);
      }
    }

    setFilteredTalents(filtered);
  };

  const getProfileQuality = (talent: TalentProfile) => {
    let score = 0;
    let maxScore = 6;

    if (talent.display_name && talent.display_name !== 'Anonymous') score++;
    if (talent.bio && talent.bio.length > 50) score++;
    if (talent.skills && talent.skills.length > 0) score++;
    if (talent.past_credits) score++;
    if (talent.rate_range_min && talent.rate_range_max) score++;
    if (talent.avatar_url) score++;

    const percentage = (score / maxScore) * 100;
    
    if (percentage >= 80) return { label: 'High', color: 'bg-green-100 text-green-800', icon: CheckCircle };
    if (percentage >= 50) return { label: 'Medium', color: 'bg-yellow-100 text-yellow-800', icon: Star };
    return { label: 'Low', color: 'bg-red-100 text-red-800', icon: AlertTriangle };
  };

  const handleBulkAction = async (action: string) => {
    if (selectedTalents.size === 0) {
      toast({
        title: "No Selection",
        description: "Please select talents to perform bulk actions",
        variant: "destructive",
      });
      return;
    }

    try {
      const talentIds = Array.from(selectedTalents);
      
      if (action === 'send_invites') {
        // This would integrate with your invite system
        toast({
          title: "Invites Sent",
          description: `Sent invites to ${talentIds.length} talents`,
        });
      } else if (action === 'mark_quality') {
        // This could add quality flags or notes
        toast({
          title: "Quality Marked",
          description: `Marked ${talentIds.length} profiles for quality review`,
        });
      }

      setSelectedTalents(new Set());
    } catch (error) {
      console.error(`Error performing bulk action ${action}:`, error);
      toast({
        title: "Error",
        description: `Failed to perform bulk action`,
        variant: "destructive",
      });
    }
  };

  const formatRateRange = (min?: number, max?: number) => {
    if (!min && !max) return 'Not specified';
    if (min && max) return `$${min} - $${max}/hr`;
    if (min) return `$${min}+/hr`;
    if (max) return `Up to $${max}/hr`;
    return 'Not specified';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Card className="bg-white dark:bg-gray-800">
          <CardContent className="p-8">
            <div className="text-center">
              <p className="text-gray-500 dark:text-gray-400">Loading talent profiles...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white dark:bg-gray-800">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{talents.length}</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Talents</p>
          </CardContent>
        </Card>
        <Card className="bg-white dark:bg-gray-800">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {talents.filter(t => t.onboarding_completed).length}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Onboarded</p>
          </CardContent>
        </Card>
        <Card className="bg-white dark:bg-gray-800">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">
              {talents.filter(t => t.public_profile).length}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Public Profiles</p>
          </CardContent>
        </Card>
        <Card className="bg-white dark:bg-gray-800">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">
              {talents.filter(t => t.availability_status === 'available').length}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Available</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Talent Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search talents..."
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value})}
                className="pl-10"
              />
            </div>

            <Select value={filters.availability} onValueChange={(value) => setFilters({...filters, availability: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Availability" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Availability</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="busy">Busy</SelectItem>
                <SelectItem value="unavailable">Unavailable</SelectItem>
                <SelectItem value="selective">Selective</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.profileStatus} onValueChange={(value) => setFilters({...filters, profileStatus: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Profile Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Profiles</SelectItem>
                <SelectItem value="public">Public Only</SelectItem>
                <SelectItem value="private">Private Only</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.onboardingStatus} onValueChange={(value) => setFilters({...filters, onboardingStatus: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Onboarding" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="incomplete">Incomplete</SelectItem>
              </SelectContent>
            </Select>

            <Button 
              variant="outline" 
              onClick={() => setFilters({
                search: '',
                availability: 'all',
                skills: [],
                profileStatus: 'all',
                onboardingStatus: 'all',
              })}
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedTalents.size > 0 && (
        <Card className="bg-white dark:bg-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {selectedTalents.size} talents selected
              </span>
              <div className="flex space-x-2">
                <Button size="sm" onClick={() => handleBulkAction('send_invites')}>
                  <Mail className="h-4 w-4 mr-2" />
                  Send Invites
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleBulkAction('mark_quality')}>
                  <Star className="h-4 w-4 mr-2" />
                  Mark for Review
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Talents Table */}
      <Card className="bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">
            Talent Directory ({filteredTalents.length} shown)
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Manage and review talent profiles
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredTalents.length === 0 ? (
            <div className="text-center py-8">
              <UserPlus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                No talents found matching your filters
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedTalents.size === filteredTalents.length && filteredTalents.length > 0}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedTalents(new Set(filteredTalents.map(t => t.id)));
                        } else {
                          setSelectedTalents(new Set());
                        }
                      }}
                    />
                  </TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Skills</TableHead>
                  <TableHead>Availability</TableHead>
                  <TableHead>Rate Range</TableHead>
                  <TableHead>Quality</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTalents.map((talent) => {
                  const quality = getProfileQuality(talent);
                  const QualityIcon = quality.icon;
                  
                  return (
                    <TableRow key={talent.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedTalents.has(talent.id)}
                          onCheckedChange={(checked) => {
                            const newSelected = new Set(selectedTalents);
                            if (checked) {
                              newSelected.add(talent.id);
                            } else {
                              newSelected.delete(talent.id);
                            }
                            setSelectedTalents(newSelected);
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          {talent.avatar_url && (
                            <img
                              src={talent.avatar_url}
                              alt={talent.display_name}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                          )}
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {talent.display_name}
                            </p>
                            {talent.location && (
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {talent.location}
                              </p>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {talent.skills.slice(0, 3).map((skill, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {talent.skills.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{talent.skills.length - 3}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <AvailabilityIndicator status={talent.availability_status} />
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {formatRateRange(talent.rate_range_min, talent.rate_range_max)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge className={quality.color}>
                          <QualityIcon className="w-3 h-3 mr-1" />
                          {quality.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <Badge variant={talent.onboarding_completed ? "default" : "destructive"}>
                            {talent.onboarding_completed ? "Onboarded" : "Incomplete"}
                          </Badge>
                          {talent.public_profile && (
                            <Badge variant="outline" className="text-xs">
                              Public
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {format(new Date(talent.created_at), 'MMM d, yyyy')}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedTalent(talent)}
                            >
                              <Eye className="h-4 w-4" />
                              View
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Talent Profile: {selectedTalent?.display_name}</DialogTitle>
                              <DialogDescription>
                                Detailed view of talent profile and capabilities
                              </DialogDescription>
                            </DialogHeader>
                            {selectedTalent && (
                              <div className="space-y-6">
                                {/* Profile Header */}
                                <div className="flex items-start space-x-4">
                                  {selectedTalent.avatar_url && (
                                    <img
                                      src={selectedTalent.avatar_url}
                                      alt={selectedTalent.display_name}
                                      className="w-16 h-16 rounded-full object-cover"
                                    />
                                  )}
                                  <div className="flex-1">
                                    <h3 className="text-lg font-semibold">{selectedTalent.display_name}</h3>
                                    {selectedTalent.location && (
                                      <p className="text-gray-600 dark:text-gray-400">{selectedTalent.location}</p>
                                    )}
                                    <div className="flex items-center space-x-2 mt-2">
                                      <AvailabilityIndicator status={selectedTalent.availability_status} />
                                      <Badge className={getProfileQuality(selectedTalent).color}>
                                        {getProfileQuality(selectedTalent).label} Quality
                                      </Badge>
                                    </div>
                                  </div>
                                </div>

                                {/* Bio */}
                                {selectedTalent.bio && (
                                  <div>
                                    <h4 className="font-semibold mb-2">Bio</h4>
                                    <p className="text-gray-600 dark:text-gray-400">{selectedTalent.bio}</p>
                                  </div>
                                )}

                                {/* Skills */}
                                {selectedTalent.skills.length > 0 && (
                                  <div>
                                    <h4 className="font-semibold mb-2">Skills</h4>
                                    <div className="flex flex-wrap gap-2">
                                      {selectedTalent.skills.map((skill, idx) => (
                                        <Badge key={idx} variant="secondary">{skill}</Badge>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Rate & Availability */}
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <h4 className="font-semibold mb-2">Rate Range</h4>
                                    <p className="text-gray-600 dark:text-gray-400">
                                      {formatRateRange(selectedTalent.rate_range_min, selectedTalent.rate_range_max)}
                                    </p>
                                  </div>
                                  <div>
                                    <h4 className="font-semibold mb-2">Profile Status</h4>
                                    <div className="space-y-1">
                                      <Badge variant={selectedTalent.onboarding_completed ? "default" : "destructive"}>
                                        {selectedTalent.onboarding_completed ? "Onboarded" : "Incomplete"}
                                      </Badge>
                                      <Badge variant={selectedTalent.public_profile ? "default" : "outline"}>
                                        {selectedTalent.public_profile ? "Public Profile" : "Private Profile"}
                                      </Badge>
                                    </div>
                                  </div>
                                </div>

                                {/* Past Credits */}
                                {selectedTalent.past_credits && (
                                  <div>
                                    <h4 className="font-semibold mb-2">Past Credits</h4>
                                    <p className="text-gray-600 dark:text-gray-400">{selectedTalent.past_credits}</p>
                                  </div>
                                )}

                                {/* Social Links */}
                                {selectedTalent.social_links && Object.keys(selectedTalent.social_links).length > 0 && (
                                  <div>
                                    <h4 className="font-semibold mb-2">Social Links</h4>
                                    <div className="space-y-1">
                                      {Object.entries(selectedTalent.social_links).map(([platform, url]) => (
                                        <div key={platform} className="flex items-center space-x-2">
                                          <span className="text-sm font-medium capitalize">{platform}:</span>
                                          <a
                                            href={url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:underline text-sm"
                                          >
                                            {url}
                                          </a>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Account Info */}
                                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                                  <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                      <span className="font-medium">Joined:</span>
                                      <span className="ml-2 text-gray-600 dark:text-gray-400">
                                        {format(new Date(selectedTalent.created_at), 'MMM d, yyyy')}
                                      </span>
                                    </div>
                                    <div>
                                      <span className="font-medium">Invites Remaining:</span>
                                      <span className="ml-2 text-gray-600 dark:text-gray-400">
                                        {selectedTalent.invites_remaining}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
