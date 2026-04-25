"use client";

import ErrorBox from "@/components/shared/ErrorBox";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <ErrorBox error={error} onRetry={reset} />;
}
