
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Shield, Activity, Clock, Users, Ban } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

interface SecurityEvent {
  id: string;
  user_id: string | null;
  action_type: string;
  resource_type: string;
  resource_id: string | null;
  details: any;
  created_at: string;
}

interface RateLimit {
  id: string;
  identifier: string;
  action_type: string;
  attempt_count: number;
  window_start: string;
}

export function SecurityDashboard() {
  const { data: recentEvents, refetch: refetchEvents } = useQuery({
    queryKey: ['security-events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('security_audit_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      return data as SecurityEvent[];
    },
  });

  const { data: rateLimits } = useQuery({
    queryKey: ['rate-limits'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rate_limits')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(20);
      
      if (error) throw error;
      return data as RateLimit[];
    },
  });

  const { data: suspendedUsers } = useQuery({
    queryKey: ['suspended-users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('users')
        .select('id, display_name, email, is_suspended, suspension_expires_at, moderation_notes')
        .eq('is_suspended', true);
      
      if (error) throw error;
      return data;
    },
  });

  const cleanupExpiredRateLimits = async () => {
    const { data, error } = await supabase.rpc('cleanup_expired_rate_limits');
    if (!error) {
      console.log(`Cleaned up ${data} expired rate limit records`);
      refetchEvents();
    }
  };

  const getEventBadgeVariant = (actionType: string) => {
    if (actionType.includes('suspicious') || actionType.includes('rate_limit')) {
      return 'destructive';
    }
    if (actionType.includes('signin') || actionType.includes('signup')) {
      return 'default';
    }
    return 'secondary';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Security Dashboard</h2>
          <p className="text-muted-foreground">Monitor security events and user activity</p>
        </div>
        <Button onClick={cleanupExpiredRateLimits} variant="outline">
          <Clock className="w-4 h-4 mr-2" />
          Cleanup Rate Limits
        </Button>
      </div>

      {/* Security Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Events</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recentEvents?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Last 50 events</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Rate Limits</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rateLimits?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Current rate limits</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Suspended Users</CardTitle>
            <Ban className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{suspendedUsers?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Currently suspended</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Suspicious Activity</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {recentEvents?.filter(e => e.action_type.includes('suspicious')).length || 0}
            </div>
            <p className="text-xs text-muted-foreground">Recent suspicious events</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Security Events */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Security Events</CardTitle>
          <CardDescription>Latest security-related activities on the platform</CardDescription>
        </CardHeader>
        <CardContent>
          {recentEvents && recentEvents.length > 0 ? (
            <div className="space-y-3">
              {recentEvents.slice(0, 20).map((event) => (
                <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Badge variant={getEventBadgeVariant(event.action_type)}>
                      {event.action_type.replace('_', ' ')}
                    </Badge>
                    <div>
                      <div className="font-medium">{event.resource_type}</div>
                      <div className="text-sm text-muted-foreground">
                        User: {event.user_id || 'Anonymous'} | {new Date(event.created_at).toLocaleString()}
                      </div>
                      {event.details?.metadata && (
                        <div className="text-xs text-muted-foreground mt-1">
                          {JSON.stringify(event.details.metadata, null, 2)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No recent security events</p>
          )}
        </CardContent>
      </Card>

      {/* Suspended Users */}
      {suspendedUsers && suspendedUsers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Suspended Users</CardTitle>
            <CardDescription>Users currently under suspension</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {suspendedUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{user.display_name || 'Unknown'}</div>
                    <div className="text-sm text-muted-foreground">{user.email}</div>
                    {user.suspension_expires_at && (
                      <div className="text-xs text-muted-foreground">
                        Expires: {new Date(user.suspension_expires_at).toLocaleString()}
                      </div>
                    )}
                    {user.moderation_notes && (
                      <div className="text-xs text-muted-foreground mt-1">
                        Notes: {user.moderation_notes}
                      </div>
                    )}
                  </div>
                  <Badge variant="destructive">Suspended</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
