import { cn } from "@/lib/utils";

const variants = {
  primary: "bg-accent text-accent-ink hover:bg-[#ff8142]",
  secondary: "border border-line bg-transparent text-ink hover:border-accent hover:text-accent",
  ghost: "bg-transparent text-ink hover:bg-card",
  danger: "border border-danger/50 bg-transparent text-danger hover:bg-danger hover:text-studio",
} as const;

const sizes = {
  md: "min-h-11 px-5 text-sm",
  sm: "min-h-10 px-3 text-xs",
} as const;

export function buttonClass(variant: keyof typeof variants = "primary", size: keyof typeof sizes = "md", className?: string) {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-[2px] font-medium tracking-wide transition-colors disabled:pointer-events-none disabled:opacity-50",
    variants[variant],
    sizes[size],
    className,
  );
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
}) {
  return <button className={buttonClass(variant, size, className)} {...props} />;
}
