import { AppError } from "./app-error";
import { ResultType } from "./types/resultType";

const isBuildTime =
  process.env.NEXT_PHASE === "phase-production-build" ||
  (process.env.NODE_ENV === "production" && !process.env.MONGODB_URL); // ← Fixed variable name

export async function safeAction<T>(
  fn: () => Promise<T>,
  options?: {
    logError?: boolean;
    customErrorMessage?: string;
    skipDuringBuild?: boolean;
  },
): Promise<ResultType<T>> {
  // Prevent database operations during build
  if (isBuildTime && options?.skipDuringBuild !== false) {
    console.log("🔨 Skipping action during build time");
    return {
      success: false,
      error: "Operation skipped during build time",
      code: 503,
    };
  }

  // Don't try to execute if no DB URL (added safety check)
  if (!process.env.MONGODB_URL) {
    return {
      success: false,
      error: "Database not configured",
      code: 503,
    };
  }

  try {
    const data = await fn();
    return { success: true, data };
  } catch (error) {
    const shouldLog = options?.logError !== false && !isBuildTime;
    if (shouldLog) {
      console.error("❌ Server Action Error:", {
        name: error instanceof Error ? error.name : "Unknown",
        message: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString(),
      });
    }

    // Rest of your error handling remains the same...
    if (error instanceof AppError) {
      return {
        success: false,
        error: options?.customErrorMessage || error.message,
        code: error.code,
      };
    }

    // Handle mongoose errors safely
    if (error && typeof error === "object" && "name" in error && !isBuildTime) {
      try {
        const { MongooseErrorHandler } =
          await import("./mongoose-error-handler");
        const appError = MongooseErrorHandler.handle(error as any);
        return {
          success: false,
          error: options?.customErrorMessage || appError.message,
          code: appError.code,
        };
      } catch (importError) {
        console.error("Failed to load error handler:", importError);
      }
    }

    return {
      success: false,
      error: options?.customErrorMessage || "An unexpected error occurred",
      code: 500,
    };
  }
}
