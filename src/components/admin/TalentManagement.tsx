
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function TalentManagement() {
  return (
    <div className="space-y-6">
      <Card className="bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">Talent Management</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Browse, search, and manage talent profiles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">
              Talent management system will be implemented in Phase 3
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
