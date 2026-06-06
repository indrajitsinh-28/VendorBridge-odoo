import React from "react";
import { cn } from "../../utils/cn";

export interface FormCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const FormCard = React.forwardRef<HTMLDivElement, FormCardProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "w-full max-w-md rounded-2xl bg-card p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] border border-muted/10",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

FormCard.displayName = "FormCard";
