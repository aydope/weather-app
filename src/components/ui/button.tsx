import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "border border-gold-soft/60 bg-gradient-to-b from-gold-soft to-gold-deep text-ink font-semibold shadow-[inset_0_1px_0_rgba(255,255,255,0.55),0_12px_30px_-12px_rgba(217,185,121,0.7)] hover:brightness-110 active:brightness-95",
        outline:
          "border border-gold/25 bg-white/[0.05] text-paper backdrop-blur-md hover:bg-white/10 hover:border-gold/45",
        ghost: "text-paper hover:bg-white/10",
        destructive:
          "border border-coral/60 bg-coral/20 text-paper backdrop-blur-md hover:bg-coral/30",
      },
      size: {
        default: "h-12 px-6",
        sm: "h-10 px-4 text-xs",
        icon: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
