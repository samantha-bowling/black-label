
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Users, FileText, Clock, TrendingUp } from "lucide-react";

export function AdminOverview() {
  // Fetch overview statistics
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-overview-stats'],
    queryFn: async () => {
      const [gigsResult, usersResult, pendingGigsResult] = await Promise.all([
        supabase.from('gigs').select('id, status, brief_status').eq('brief_status', 'active'),
        supabase.from('users').select('id, role').eq('role', 'gig_seeker'),
        supabase.from('gigs').select('id').eq('brief_status', 'pending_review')
      ]);

      return {
        activeGigs: gigsResult.data?.length || 0,
        totalTalent: usersResult.data?.length || 0,
        pendingReviews: pendingGigsResult.data?.length || 0,
        totalGigs: gigsResult.data?.length || 0
      };
    }
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="bg-white dark:bg-gray-800">
            <CardHeader className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
          </Card>
        ))}
      </div>
    );
  }

  const overviewCards = [
    {
      title: "Active Gigs",
      value: stats?.activeGigs || 0,
      description: "Currently live gigs",
      icon: FileText,
      color: "text-blue-600"
    },
    {
      title: "Total Talent",
      value: stats?.totalTalent || 0,
      description: "Registered gig seekers",
      icon: Users,
      color: "text-green-600"
    },
    {
      title: "Pending Reviews",
      value: stats?.pendingReviews || 0,
      description: "Gigs awaiting approval",
      icon: Clock,
      color: "text-yellow-600"
    },
    {
      title: "Platform Growth",
      value: "+12%",
      description: "This month",
      icon: TrendingUp,
      color: "text-purple-600"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {overviewCards.map((card, index) => (
          <Card key={index} className="bg-white dark:bg-gray-800 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {card.title}
              </CardTitle>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {card.value}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {card.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">Quick Actions</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Common administrative tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors">
              <div className="text-sm font-medium text-gray-900 dark:text-white">Review Pending Gigs</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {stats?.pendingReviews || 0} waiting for approval
              </div>
            </Card>
            <Card className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors">
              <div className="text-sm font-medium text-gray-900 dark:text-white">Manage Talent</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Browse and curate talent profiles
              </div>
            </Card>
            <Card className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors">
              <div className="text-sm font-medium text-gray-900 dark:text-white">View Analytics</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Platform performance metrics
              </div>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
