
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function CollaborationRequests() {
  return (
    <div className="space-y-6">
      <Card className="bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">Collaboration Requests</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Manage direct collaboration requests between posters and seekers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">
              Collaboration management will be implemented in Phase 4
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
