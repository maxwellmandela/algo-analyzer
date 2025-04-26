import React, { ReactNode } from "react";
import { ButtonHTMLAttributes, forwardRef, Ref } from "react";
import clsx from "clsx"; // Utility for conditional class merging

type ButtonVariant =
  | "default"
  | "destructive"
  | "outline"
  | "secondary"
  | "ghost"
  | "link";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: "default" | "sm" | "lg" | "xl" | "2xl" | "icon";
  className?: string;
  children?: ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { variant = "default", size = "default", className, children, ...props },
    ref: Ref<HTMLButtonElement>
  ) => {
    const baseClasses = clsx(
      "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
      size === "default" && "px-4 py-2",
      size === "sm" && "px-3 py-1.5",
      size === "lg" && "px-6 py-3",
      size === "xl" && "px-6 py-6 text-xl",
      size === "2xl" && "px-6 py-8 text-2xl",
      size === "icon" && "p-2",
      variant === "default" &&
        "bg-primary text-primary-foreground hover:bg-primary/90",
      variant === "destructive" &&
        "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      variant === "outline" &&
        "border border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground",
      variant === "secondary" &&
        "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      variant === "ghost" &&
        "text-foreground hover:bg-accent hover:text-accent-foreground",
      variant === "link" && "text-primary hover:underline",
      className
    );

    return (
      <button ref={ref} className={baseClasses} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
