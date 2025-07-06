
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminLayout } from './AdminLayout';
import { AdminOverview } from './AdminOverview';
import { PendingGigApprovals } from './PendingGigApprovals';
import { TalentManagement } from './TalentManagement';
import { CollaborationRequests } from './CollaborationRequests';
import { PlatformAnalytics } from './PlatformAnalytics';
import { ModerationDashboard } from './ModerationDashboard';

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Manage gigs, talent, moderation, and platform operations
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-6 mb-8">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="gig-approvals">Gig Approvals</TabsTrigger>
              <TabsTrigger value="talent">Talent</TabsTrigger>
              <TabsTrigger value="moderation">Moderation</TabsTrigger>
              <TabsTrigger value="collaborations">Collaborations</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <AdminOverview />
            </TabsContent>

            <TabsContent value="gig-approvals" className="space-y-6">
              <PendingGigApprovals />
            </TabsContent>

            <TabsContent value="talent" className="space-y-6">
              <TalentManagement />
            </TabsContent>

            <TabsContent value="moderation" className="space-y-6">
              <ModerationDashboard />
            </TabsContent>

            <TabsContent value="collaborations" className="space-y-6">
              <CollaborationRequests />
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <PlatformAnalytics />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AdminLayout>
  );
}
