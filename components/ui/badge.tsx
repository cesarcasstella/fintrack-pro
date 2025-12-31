import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default:
          "bg-gray-100 text-[#1A1A2E]",
        success:
          "bg-emerald-100 text-emerald-700",
        warning:
          "bg-amber-100 text-amber-700",
        error:
          "bg-red-100 text-red-700",
        info:
          "bg-blue-100 text-blue-700",
        primary:
          "bg-gradient-to-r from-[#4F7DF3] to-[#7C5BF5] text-white",
        secondary:
          "bg-secondary-100 text-secondary-700",
        accent:
          "bg-[#D4A84B]/20 text-[#D4A84B]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
