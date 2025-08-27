import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "strong";
  style?: React.CSSProperties;
}

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(({
  children,
  className,
  variant = "default",
  style
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "rounded-2xl border backdrop-blur-lg",
        variant === "default"
          ? "glass-card"
          : "glass-strong",
        className
      )}
      style={style}
    >
      {children}
    </div>
  );
});

GlassCard.displayName = "GlassCard";