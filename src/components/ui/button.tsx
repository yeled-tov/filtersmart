import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-semibold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // Primary action — brand navy
        default:
          "bg-primary text-primary-foreground shadow-soft hover:bg-primary-hover hover:shadow-card active:translate-y-px",
        // Secondary action — copper, reserved for one CTA per view
        accent:
          "bg-accent text-accent-foreground shadow-soft hover:brightness-95 hover:shadow-card active:translate-y-px",
        // WhatsApp, always recognisable
        whatsapp:
          "bg-whatsapp text-white shadow-soft hover:brightness-95 hover:shadow-card active:translate-y-px",
        outline:
          "border border-border-strong bg-surface text-ink hover:bg-surface-sunken hover:border-primary/40",
        // For use on dark bands
        "outline-inverse":
          "border border-white/25 bg-white/5 text-white backdrop-blur-sm hover:bg-white/12 hover:border-white/45",
        inverse:
          "bg-white text-primary shadow-soft hover:bg-white/90 active:translate-y-px",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/70",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        ghost: "text-ink-soft hover:bg-surface-sunken hover:text-ink",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-5 text-[0.9375rem]",
        sm: "h-9 rounded-sm px-3.5 text-sm",
        lg: "h-[3.25rem] px-7 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
