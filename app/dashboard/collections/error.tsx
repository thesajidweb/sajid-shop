"use client";

import ErrorBox from "@/components/shared/ErrorBox";

interface ErrorProps {
  error: Error;
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  return <ErrorBox error={error} onRetry={reset} />;
}
