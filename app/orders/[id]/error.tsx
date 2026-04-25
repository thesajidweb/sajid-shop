"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export default function ErrorState({ error }: { error: string }) {
  return (
    <Card className="border-border">
      <CardContent className="p-12 text-center">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="h-8 w-8 text-rose-500" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Unable to Load Orders</h3>
        <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">{error}</p>
        <Button onClick={() => window.location.reload()} variant="outline">
          Try Again
        </Button>
      </CardContent>
    </Card>
  );
}
