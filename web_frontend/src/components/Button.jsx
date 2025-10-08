import clsx from "classnames";

/**
 * PUBLIC_INTERFACE
 * Button: Theme-aware button variants.
 */
export default function Button({ children, className, variant = "primary", ...props }) {
  const base = "inline-flex items-center gap-2 px-4 h-10 rounded-lg text-sm font-medium transition shadow-soft";
  const variants = {
    primary: "bg-ocean-primary text-white hover:opacity-95",
    secondary: "bg-ocean-secondary text-white hover:opacity-95",
    ghost: "bg-transparent text-ocean-text hover:bg-gray-50 border border-gray-200",
    danger: "bg-ocean-error text-white hover:opacity-95",
  };
  return (
    <button className={clsx(base, variants[variant], className)} {...props}>
      {children}
    </button>
  );
}
