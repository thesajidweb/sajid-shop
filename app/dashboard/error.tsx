"use client";

import { useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    // Send to your error monitoring service
    console.error("Global Error:", error);
  }, [error]);

  /**
   * Soft retry (React boundary reset)
   */
  const handleRetry = () => {
    startTransition(() => {
      reset();
    });
  };

  /**
   * Hard refresh (Next.js router refresh)
   */
  const handleRefresh = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  /**
   * Full reload (last fallback)
   */
  const handleFullReload = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md px-6 py-10 text-center space-y-6 rounded-2xl shadow-lg border">
        {/* Heading */}
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-red-500">
            Something went wrong
          </h1>
          <p className="text-sm text-muted-foreground">
            An unexpected error occurred. You can try again or refresh the page.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button
            onClick={handleRetry}
            disabled={isPending}
            className="w-full px-4 py-2 rounded-md bg-primary text-white hover:opacity-90 transition disabled:opacity-50"
          >
            {isPending ? "Retrying..." : "Try Again"}
          </button>

          <button
            onClick={handleRefresh}
            disabled={isPending}
            className="w-full px-4 py-2 rounded-md border hover:bg-muted transition"
          >
            Refresh Page
          </button>

          <button
            onClick={handleFullReload}
            className="w-full px-4 py-2 rounded-md text-sm text-muted-foreground hover:underline"
          >
            Force Reload
          </button>
        </div>

        {/* Debug Info (optional for dev/prod logs) */}
        {error?.digest && (
          <p className="text-xs text-gray-400">Error ID: {error.digest}</p>
        )}
      </div>
    </div>
  );
}
