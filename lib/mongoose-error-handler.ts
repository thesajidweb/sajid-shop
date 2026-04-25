// mongoose-error-handler.ts

import { AppError } from "./app-error";

export interface MongooseError extends Error {
  name: string;
  code?: number;
  keyPattern?: Record<string, unknown>;
  keyValue?: Record<string, unknown>;
  errors?: Record<
    string,
    { message: string; kind: string; path: string; value: unknown }
  >;
}

export class MongooseErrorHandler {
  static handle(error: MongooseError): AppError {
    // Handle duplicate key error (code 11000)
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern || {})[0];
      const value = error.keyValue?.[field];
      return new AppError(
        `Duplicate value '${value}' for field '${field}'. Please use a unique value.`,
        409,
      );
    }

    // Handle validation errors
    if (error.name === "ValidationError" && error.errors) {
      const messages = Object.values(error.errors).map((err) => err.message);
      return new AppError(`Validation failed: ${messages.join(", ")}`, 400);
    }

    // Handle CastError (invalid ObjectId)
    if (error.name === "CastError") {
      return new AppError(`Invalid ${error.message}`, 400);
    }

    // Handle DocumentNotFoundError
    if (error.name === "DocumentNotFoundError") {
      return new AppError("Resource not found", 404);
    }

    // Handle VersionError (optimistic concurrency)
    if (error.name === "VersionError") {
      return new AppError(
        "Resource was modified concurrently. Please try again.",
        409,
      );
    }

    // Handle DivergentArrayError
    if (error.name === "DivergentArrayError") {
      return new AppError(
        "Array modification conflict. Please retry the operation.",
        409,
      );
    }

    // Handle OverwriteModelError
    if (error.name === "OverwriteModelError") {
      return new AppError("Model registration conflict", 500);
    }

    // Handle MissingSchemaError
    if (error.name === "MissingSchemaError") {
      return new AppError("Schema not found for the model", 500);
    }

    // Handle StrictModeError
    if (error.name === "StrictModeError") {
      return new AppError(
        `Field '${error.message}' is not allowed in strict mode`,
        400,
      );
    }

    // Handle ObjectParameterError
    if (error.name === "ObjectParameterError") {
      return new AppError("Invalid parameter type provided", 400);
    }

    // Default mongoose error
    return new AppError(
      error.message || "Database operation failed",
      error.code && error.code >= 400 && error.code < 600 ? error.code : 500,
    );
  }
}
