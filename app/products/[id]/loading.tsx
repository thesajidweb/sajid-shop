// components/product/ProductSkeleton.tsx
const Loading = () => (
  <div className="min-h-screen bg-background">
    <div className="container mx-auto px-4 py-2 max-w-7xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-10">
        <div className="animate-pulse">
          <div className="bg-gray-200 dark:bg-gray-700 rounded-lg aspect-square" />
        </div>
        <div className="space-y-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
          <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      </div>
    </div>
  </div>
);

export default Loading;
