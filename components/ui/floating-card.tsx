import * as React from "react";
import { cn } from "@/lib/utils";

export interface FloatingCardProps extends React.HTMLAttributes<HTMLDivElement> {
  delay?: number;
  children: React.ReactNode;
}

function FloatingCard({
  delay = 0,
  children,
  className,
  style,
  ...props
}: FloatingCardProps) {
  return (
    <div
      className={cn(
        "rounded-3xl bg-white border border-gray-100 shadow-lg p-6",
        delay === 0 ? "animate-float" : "animate-float-delayed",
        className
      )}
      style={{
        animationDelay: delay > 0 ? `${delay}s` : undefined,
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}

export { FloatingCard };
