"use client";

import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  variant?: "full" | "icon";
  className?: string;
}

export function Logo({ size = "md", variant = "full", className }: LogoProps) {
  const iconSize = {
    sm: 20,
    md: 24,
    lg: 28,
  };

  const textSizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  };

  return (
    <div className={cn("flex items-center gap-3", className)}>
      {/* Coffee cup SVG icon */}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-fika-espresso"
        width={iconSize[size]}
        height={iconSize[size]}
      >
        {/* Coffee cup body */}
        <path
          d="M6 8C6 6.89543 6.89543 6 8 6H14C15.1046 6 16 6.89543 16 8V13C16 15.2091 14.2091 17 12 17C9.79086 17 8 15.2091 8 13V8H6Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {/* Cup handle */}
        <path
          d="M16 10H18C19.1046 10 20 10.8954 20 12V13C20 14.1046 19.1046 15 18 15H16"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {/* Steam lines */}
        <path
          d="M9 3C9 3 9.5 4 9 5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.6"
        />
        <path
          d="M12 3C12 3 12.5 4 12 5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.8"
        />
        <path
          d="M15 3C15 3 15.5 4 15 5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.6"
        />
        {/* Coffee liquid surface */}
        <ellipse
          cx="12"
          cy="9.5"
          rx="3"
          ry="0.8"
          fill="currentColor"
          opacity="0.5"
        />
      </svg>

      {/* Text Logo */}
      {variant === "full" && (
        <span className={cn(
          "font-display font-bold text-fika-espresso tracking-tight",
          textSizeClasses[size]
        )}>
          Fika
        </span>
      )}
    </div>
  );
}
