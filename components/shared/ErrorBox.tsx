"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";

interface ErrorBoxProps {
  error?: Error | null;
  message?: string;
  title?: string;
  onRetry?: () => void | Promise<void>;
  retryText?: string;
  className?: string;
  autoRefresh?: boolean;
  refreshDelay?: number;
  showErrorDetails?: boolean;
}

export default function ErrorBox({
  error,
  message,
  title = "Something went wrong",
  onRetry,
  retryText = "Try again",
  className = "",
  autoRefresh = false,
  refreshDelay = 3000,
  showErrorDetails = false,
}: ErrorBoxProps) {
  const router = useRouter();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Determine if it's a group-related error
  const isGroupError = useCallback(() => {
    const errorMessage = error?.message || message || "";
    return errorMessage.toLowerCase().includes("group");
  }, [error?.message, message]);

  // Get display message
  const getDisplayMessage = useCallback(() => {
    if (isGroupError()) {
      return "Unable to fetch data from group. Please refresh the page.";
    }
    return message || "Something went wrong. Please try again.";
  }, [isGroupError, message]);

  // Refresh page using router
  const refreshPage = useCallback(() => {
    router.refresh();
  }, [router]);

  // Hard reload as fallback
  const hardReload = useCallback(() => {
    window.location.reload();
  }, []);

  // Handle retry action
  const handleRetry = useCallback(async () => {
    if (onRetry) {
      try {
        await onRetry();
      } catch (err) {
        console.error("Retry failed:", err);
      }
    } else if (autoRefresh) {
      // Use router refresh first, fallback to hard reload
      timeoutRef.current = setTimeout(() => {
        refreshPage();
        // If page doesn't refresh after a short delay, force hard reload
        setTimeout(() => {
          hardReload();
        }, 100);
      }, refreshDelay);
    } else {
      refreshPage();
    }
  }, [onRetry, autoRefresh, refreshDelay, refreshPage, hardReload]);

  // Auto-refresh effect
  useEffect(() => {
    if (autoRefresh && !onRetry) {
      timeoutRef.current = setTimeout(() => {
        refreshPage();
      }, refreshDelay);

      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }
  }, [autoRefresh, onRetry, refreshDelay, refreshPage]);

  return (
    <div
      className={`flex items-center justify-center h-full px-4 ${className}`}
    >
      <div className="border border-destructive/20 bg-destructive/5 dark:bg-destructive/10 rounded-xl p-8 max-w-md w-full text-center space-y-4 shadow-lg">
        {/* Icon */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10">
          <AlertTriangle
            className="w-8 h-8 text-destructive"
            aria-hidden="true"
          />
        </div>

        {/* Content */}
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground">{title}</h2>
          <p className="text-muted-foreground">{getDisplayMessage()}</p>

          {/* Error details (shown conditionally) */}
          {showErrorDetails && error?.message && (
            <div className="mt-2 p-2 bg-destructive/5 rounded-md">
              <p className="text-destructive text-xs font-mono break-all">
                {error.message}
              </p>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="space-y-3">
          <Button
            onClick={handleRetry}
            variant="outline"
            className="mt-2 w-full sm:w-auto"
            aria-label={retryText}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            {retryText}
          </Button>

          {/* Alternative actions */}
          <div className="flex gap-2 justify-center text-xs text-muted-foreground">
            <button
              onClick={() => router.back()}
              className="hover:text-foreground transition-colors"
              aria-label="Go back"
            >
              Go back
            </button>
            <span>•</span>
            <button
              onClick={hardReload}
              className="hover:text-foreground transition-colors"
              aria-label="Hard refresh"
            >
              Hard refresh
            </button>
          </div>
        </div>

        {/* Auto-refresh indicator */}
        {autoRefresh && !onRetry && (
          <p className="text-xs text-muted-foreground mt-2 animate-pulse">
            Will auto-refresh in {Math.ceil(refreshDelay / 1000)} seconds...
          </p>
        )}
      </div>
    </div>
  );
}
