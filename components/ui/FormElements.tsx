"use client";
import React from "react";
import { useFormContext } from "react-hook-form";

interface FormFieldProps {
  label: string;
  name: string;
  required?: boolean;
  children: React.ReactNode;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  required,
  children,
}) => {
  const {
    formState: { errors },
  } = useFormContext();

  // Handle nested errors (e.g., gallery, variants)
  const getNestedError = (obj: any, path: string) => {
    return path.split(".").reduce((acc, part) => acc && acc[part], obj);
  };

  const error = getNestedError(errors, name);

  return (
    <div
      className="flex flex-col gap-2 w-full group"
      id={`field-container-${name.replace(/\./g, "-")}`}
    >
      <label className="text-sm font-semibold text-foreground/80 flex items-center gap-1">
        {label}
        {required && <span className="text-destructive font-bold">*</span>}
      </label>
      {children}
      {error && (
        <p className="text-xs text-destructive font-medium animate-in fade-in slide-in-from-top-1 duration-200">
          {String(error.message)}
        </p>
      )}
    </div>
  );
};
