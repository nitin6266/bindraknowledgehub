import * as React from "react";
import { cn } from "@/lib/utils";

const fieldBase =
  "w-full rounded-md border border-input bg-background px-4 text-body text-foreground placeholder:text-muted-foreground transition-colors duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-danger aria-[invalid=true]:ring-danger/30";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  inputSize?: "sm" | "md" | "lg";
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, inputSize = "md", ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        fieldBase,
        inputSize === "sm" && "h-10 text-body-sm",
        inputSize === "md" && "h-11",
        inputSize === "lg" && "h-12 text-body-lg",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";

export { fieldBase };
