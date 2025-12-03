import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'danger';
}

export function Button({ className, variant = 'primary', ...props }: ButtonProps) {
  const baseStyles = "relative px-6 py-2 font-sans font-medium transition-all duration-300 border backdrop-blur-sm group overflow-hidden tracking-widest uppercase text-xs";

  const variants = {
    // The "Hanko Stamp" look
    primary: "bg-hanko-500/10 border-hanko-500 text-hanko-500 hover:bg-hanko-500 hover:text-white hover:shadow-[0_0_15px_rgba(205,56,56,0.5)] active:scale-95",
    // The "Ink" look
    ghost: "border-ink-700 text-parchment-200 hover:border-parchment-500 hover:text-parchment-100",
    // The "Destroy" look
    danger: "border-red-900 text-red-700 hover:bg-red-950",
  } as const;

  return (
    <button className={twMerge(clsx(baseStyles, variants[variant]), className)} {...props}>
      {/* This span makes the text appear above the hover effects */}
      <span className="relative z-10 flex items-center gap-2 justify-center">
        {props.children}
      </span>
    </button>
  );
}

export default Button;
