import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const avatarVariants = cva(
  "relative inline-flex items-center justify-center overflow-hidden rounded-full font-medium",
  {
    variants: {
      size: {
        sm: "h-8 w-8 text-xs",
        md: "h-10 w-10 text-sm",
        lg: "h-12 w-12 text-base",
        xl: "h-16 w-16 text-lg",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

export interface AvatarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avatarVariants> {
  src?: string;
  name: string;
  alt?: string;
}

function Avatar({ className, size, src, name, alt, ...props }: AvatarProps) {
  const [imageError, setImageError] = React.useState(false);

  const getInitials = (fullName: string) => {
    const names = fullName.trim().split(" ");
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return fullName.slice(0, 2).toUpperCase();
  };

  const initials = getInitials(name);

  if (src && !imageError) {
    return (
      <div className={cn(avatarVariants({ size }), className)} {...props}>
        <img
          src={src}
          alt={alt || name}
          className="h-full w-full object-cover"
          onError={() => setImageError(true)}
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        avatarVariants({ size }),
        "bg-gradient-to-r from-[#4F7DF3] to-[#7C5BF5] text-white",
        className
      )}
      {...props}
    >
      {initials}
    </div>
  );
}

export { Avatar, avatarVariants };
