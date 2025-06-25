
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function PendingGigReviews() {
  return (
    <div className="space-y-6">
      <Card className="bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">Pending Gig Reviews</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Review and approve gig postings from posters
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">
              Gig review system will be implemented in Phase 2
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
