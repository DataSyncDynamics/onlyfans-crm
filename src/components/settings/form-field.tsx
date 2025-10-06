import * as React from "react";
import { cn } from "@/lib/utils";

interface FormFieldProps {
  label: string;
  description?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function FormField({
  label,
  description,
  error,
  required,
  children,
  className,
}: FormFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <label className="block">
        <span className="text-sm font-medium text-slate-200">
          {label}
          {required && <span className="ml-1 text-red-400">*</span>}
        </span>
      </label>
      {description && (
        <p className="text-xs text-slate-400">{description}</p>
      )}
      {children}
      {error && (
        <p className="text-xs text-red-400">{error}</p>
      )}
    </div>
  );
}
