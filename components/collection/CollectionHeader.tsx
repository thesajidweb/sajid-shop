"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

const CollectionHeader = () => {
  const router = useRouter();

  const handleCreateCollection = () => {
    router.push("/dashboard/collections/create");
  };

  return (
    <div className="w-full flex flex-row items-start sm:items-center justify-between gap-3 sm:gap-4  sm:px-6 lg:px-8 pt-2 ">
      <div className="space-y-1 w-full sm:w-auto">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">
          Collections Manager
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground block ">
          Manage your collections
        </p>
      </div>

      <Button
        onClick={handleCreateCollection}
        className="w-auto cursor-pointer text-sm sm:text-base py-2 md:py-5 sm:py-3"
        size="sm"
      >
        <Plus className="h-4 w-4 sm:mr-2" />
        Create
        <span className="hidden lg:inline">New </span>
        <span className="hidden md:inline">Collection</span>
      </Button>
    </div>
  );
};

export default CollectionHeader;
