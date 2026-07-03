import type { ButtonHTMLAttributes, ReactNode } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "outline" | "danger";
  children: ReactNode;
};

const variants = {
  primary: "bg-primary text-white hover:bg-blue-700",
  secondary: "bg-ink text-white hover:bg-slate-800",
  outline: "border border-line bg-white text-ink hover:bg-slate-50",
  danger: "bg-red-500 text-white hover:bg-red-600"
};

export function Button({ variant = "primary", className = "", children, ...props }: Props) {
  return (
    <button
      className={`inline-flex h-10 items-center justify-center gap-2 rounded-lg px-4 text-sm font-medium transition ${variants[variant]} disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

