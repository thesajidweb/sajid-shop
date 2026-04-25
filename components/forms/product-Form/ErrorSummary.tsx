"use client";
import React from "react";
import { useFormContext } from "react-hook-form";

export const ErrorSummary: React.FC = () => {
  const {
    formState: { errors, isSubmitted, isValid },
  } = useFormContext();

  if (isValid || !isSubmitted) return null;

  const getErrorMessages = (errors: any, prefix = ""): string[] => {
    let messages: string[] = [];
    for (const key in errors) {
      const error = errors[key];
      if (error?.message) {
        messages.push(`${prefix}${error.message}`);
      } else if (typeof error === "object" && error !== null) {
        if (Array.isArray(error)) {
          messages.push(
            `Validation errors in ${key.charAt(0).toUpperCase() + key.slice(1)}`
          );
        } else {
          messages = messages.concat(getErrorMessages(error, ""));
        }
      }
    }
    return Array.from(new Set(messages));
  };

  const errorMessages = getErrorMessages(errors);

  if (errorMessages.length === 0) return null;

  return (
    <div
      className="mb-10 p-5 bg-destructive/10 border border-destructive/20 rounded-lg animate-in slide-in-from-top-4 duration-500 shadow-sm"
      role="alert"
    >
      <div className="flex items-center gap-3 text-destructive font-black mb-3 uppercase text-xs tracking-widest">
        <div className="bg-destructive text-destructive-foreground p-1 rounded-full">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <span>Critical Validation Issues</span>
      </div>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1">
        {errorMessages.map((msg, i) => (
          <li
            key={i}
            className="text-sm text-destructive font-semibold flex items-center gap-2"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-destructive/40 shrink-0" />
            {msg}
          </li>
        ))}
      </ul>
    </div>
  );
};
