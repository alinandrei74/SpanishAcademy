import { cn } from "@/lib/utils";
import { Badge as ShadBadge } from "@/components/ui/badge";

interface BadgeProps {
  variant?: 'default' | 'secondary' | 'success' | 'warning' | 'destructive' | 'outline';
  children: React.ReactNode;
  className?: string;
}

const variantStyles = {
  default: "bg-primary hover:bg-primary/80",
  secondary: "bg-secondary hover:bg-secondary/80",
  success: "bg-green-500 hover:bg-green-500/80 text-white",
  warning: "bg-yellow-500 hover:bg-yellow-500/80 text-white",
  destructive: "bg-destructive hover:bg-destructive/80",
  outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground"
};

export function Badge({ variant = "default", children, className }: BadgeProps) {
  return (
    <ShadBadge
      className={cn(
        variantStyles[variant],
        className
      )}
    >
      {children}
    </ShadBadge>
  );
}