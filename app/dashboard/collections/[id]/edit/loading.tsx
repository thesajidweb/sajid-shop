import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function CollectionFormSkeleton() {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        {/* Title */}
        <Skeleton className="h-8 w-56" />
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Title field */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>

        {/* Description field */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-24 w-full" />
        </div>

        {/* Image Upload */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-48 w-full rounded-lg" />
        </div>

        {/* Submit button */}
        <Skeleton className="h-11 w-full rounded-md" />
      </CardContent>
    </Card>
  );
}
