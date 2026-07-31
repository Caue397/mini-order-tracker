import { ButtonHTMLAttributes } from "react";

type Variant = "secondary" | "danger";

const variantClasses: Record<Variant, string> = {
  secondary:
    "border border-border bg-surface text-foreground hover:bg-primary-50 dark:hover:bg-primary-500/10",
  danger:
    "border border-border bg-surface text-muted hover:border-red-300 hover:bg-red-50 hover:text-red-600 dark:hover:border-red-500/40 dark:hover:bg-red-500/10 dark:hover:text-red-400",
};

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

export function IconButton({
  variant = "secondary",
  className = "",
  ...props
}: IconButtonProps) {
  return (
    <button
      className={`flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${variantClasses[variant]} ${className}`}
      {...props}
    />
  );
}
