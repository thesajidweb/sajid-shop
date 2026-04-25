"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";

export default function EmptyState() {
  return (
    <Card className="max-w-md mx-auto mt-16 shadow-md border border-border">
      <CardContent className="p-10 text-center">
        {/* Icon */}
        <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
          <ShoppingBag className="h-12 w-12 text-gray-400" />
        </div>

        {/* Heading */}
        <h3 className="text-2xl font-semibold mb-2 ">No Orders Found</h3>

        {/* Subtext */}
        <p className="text-muted-foreground mb-6">
          You haven&apos;t placed any orders yet. Start exploring our products
          and place your first order!
        </p>

        {/* Call to Action */}
        <Button
          asChild
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow-sm transition-colors duration-200"
        >
          <Link href="/products">Start Shopping</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
