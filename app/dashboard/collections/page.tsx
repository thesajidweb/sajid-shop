import CollectionHeader from "@/components/collection/CollectionHeader";
import CollectionsList from "@/components/collection/CollectionList";

import { Suspense } from "react";
import CollectionsListSkeleton from "./loading";

const CollectionsPage = () => {
  return (
    <div className="min-w-full py-6  space-y-6 px-2">
      {/* Header */}
      <CollectionHeader />
      {/* Content */}
      <Suspense fallback={<CollectionsListSkeleton />}>
        <CollectionsList />
      </Suspense>
    </div>
  );
};
export default CollectionsPage;
