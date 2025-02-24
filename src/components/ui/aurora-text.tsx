import React from "react";
import { cn } from "@/lib/utils";

interface AuroraTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
}

export function AuroraText({ children, className, ...props }: AuroraTextProps) {
  return (
    <span
      className={cn(
        "animate-aurora-text bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 bg-clip-text text-transparent",
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
} 