
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Users, FileText, Clock, CheckCircle, XCircle, TrendingUp } from "lucide-react";

interface AdminStats {
  totalUsers: number;
  totalGigs: number;
  pendingGigs: number;
  activeGigs: number;
  rejectedGigs: number;
  gigPosters: number;
  gigSeekers: number;
  adminUsers: number;
}

export function AdminOverview() {
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalGigs: 0,
    pendingGigs: 0,
    activeGigs: 0,
    rejectedGigs: 0,
    gigPosters: 0,
    gigSeekers: 0,
    adminUsers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch user stats
      const { data: users, error: usersError } = await supabase
        .from('users')
        .select('role');

      if (usersError) throw usersError;

      // Fetch gig stats
      const { data: gigs, error: gigsError } = await supabase
        .from('gigs')
        .select('brief_status');

      if (gigsError) throw gigsError;

      // Process user stats
      const userStats = users?.reduce((acc, user) => {
        acc.totalUsers++;
        if (user.role === 'gig_poster') acc.gigPosters++;
        else if (user.role === 'gig_seeker') acc.gigSeekers++;
        else if (user.role === 'admin') acc.adminUsers++;
        return acc;
      }, {
        totalUsers: 0,
        gigPosters: 0,
        gigSeekers: 0,
        adminUsers: 0,
      }) || { totalUsers: 0, gigPosters: 0, gigSeekers: 0, adminUsers: 0 };

      // Process gig stats
      const gigStats = gigs?.reduce((acc, gig) => {
        acc.totalGigs++;
        if (gig.brief_status === 'pending_review') acc.pendingGigs++;
        else if (gig.brief_status === 'active') acc.activeGigs++;
        else if (gig.brief_status === 'rejected') acc.rejectedGigs++;
        return acc;
      }, {
        totalGigs: 0,
        pendingGigs: 0,
        activeGigs: 0,
        rejectedGigs: 0,
      }) || { totalGigs: 0, pendingGigs: 0, activeGigs: 0, rejectedGigs: 0 };

      setStats({
        ...userStats,
        ...gigStats,
      });
    } catch (error) {
      console.error('Error fetching admin stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      description: "Registered platform users",
      color: "text-blue-600",
    },
    {
      title: "Gig Posters",
      value: stats.gigPosters,
      icon: TrendingUp,
      description: "Users who can post gigs",
      color: "text-green-600",
    },
    {
      title: "Gig Seekers",
      value: stats.gigSeekers,
      icon: Users,
      description: "Talent looking for gigs",
      color: "text-purple-600",
    },
    {
      title: "Total Gigs",
      value: stats.totalGigs,
      icon: FileText,
      description: "All gig submissions",
      color: "text-gray-600",
    },
    {
      title: "Pending Review",
      value: stats.pendingGigs,
      icon: Clock,
      description: "Gigs awaiting approval",
      color: "text-yellow-600",
    },
    {
      title: "Active Gigs",
      value: stats.activeGigs,
      icon: CheckCircle,
      description: "Approved and live gigs",
      color: "text-green-600",
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="bg-white dark:bg-gray-800">
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="bg-white dark:bg-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {stat.value}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {stat.description}
                    </p>
                  </div>
                  <Icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Platform Status</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Current platform health overview
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Gig Approval Rate</span>
                <Badge variant="secondary">
                  {stats.totalGigs > 0 
                    ? `${Math.round((stats.activeGigs / stats.totalGigs) * 100)}%`
                    : '0%'
                  }
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Pending Reviews</span>
                <Badge variant={stats.pendingGigs > 0 ? "destructive" : "secondary"}>
                  {stats.pendingGigs}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">User Distribution</span>
                <div className="flex space-x-2">
                  <Badge variant="outline">
                    {stats.gigPosters} Posters
                  </Badge>
                  <Badge variant="outline">
                    {stats.gigSeekers} Seekers
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Recent Activity</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Latest platform activity summary
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Clock className="h-4 w-4 text-yellow-600" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {stats.pendingGigs} gigs awaiting review
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {stats.activeGigs} active gigs on platform
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Users className="h-4 w-4 text-blue-600" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {stats.totalUsers} total registered users
                </span>
              </div>
              {stats.rejectedGigs > 0 && (
                <div className="flex items-center space-x-3">
                  <XCircle className="h-4 w-4 text-red-600" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {stats.rejectedGigs} gigs rejected
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
