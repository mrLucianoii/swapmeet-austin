import type { ReactNode } from "react";

interface FormFieldProps {
  label: string;
  htmlFor: string;
  error?: string;
  children: ReactNode;
}

export function FormField({ label, htmlFor, error, children }: FormFieldProps) {
  return (
    <div className="flex flex-col gap-token-1">
      <label htmlFor={htmlFor} className="text-label uppercase text-fg">
        {label}
      </label>
      {children}
      {error ? (
        <p role="alert" className="text-body-sm text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export const fieldInputClass =
  "rounded-token-md border-[length:var(--hairline)] border-solid border-line bg-surface px-token-3 py-token-2 text-body text-fg " +
  "focus:outline focus:outline-[length:var(--outline)] focus:outline-offset-2 focus:outline-primary";
