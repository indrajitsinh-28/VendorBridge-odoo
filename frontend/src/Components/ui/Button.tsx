import React from "react";
import { cn } from "../../utils/cn";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", fullWidth, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-xl font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          {
            "bg-primary text-white hover:bg-primary/90": variant === "primary",
            "bg-accent text-primary hover:bg-accent/90": variant === "secondary",
            "border border-primary/20 bg-transparent hover:bg-primary/5 text-primary dark:text-foreground dark:border-white/20 dark:hover:bg-white/5":
              variant === "outline",
            "bg-transparent hover:bg-primary/5 text-primary dark:text-foreground dark:hover:bg-white/5": variant === "ghost",
            "h-9 px-4 text-sm": size === "sm",
            "h-11 px-6 text-base": size === "md",
            "h-12 px-8 text-lg": size === "lg",
            "w-full": fullWidth,
          },
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
