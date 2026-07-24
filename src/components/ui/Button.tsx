import { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  children,
  ...props
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center font-semibold rounded-full transition-all duration-300 active:scale-95 select-none';

  const variants: Record<string, string> = {
    primary:
      'bg-gradient-to-r from-[#5B4FCF] to-[#7B6FE0] text-white shadow-lg shadow-[#5B4FCF]/25 hover:shadow-xl hover:shadow-[#5B4FCF]/35 hover:scale-[1.02]',
    secondary:
      'bg-white/60 backdrop-blur-md text-[#5B4FCF] border border-[#5B4FCF]/20 hover:bg-white/80 hover:border-[#5B4FCF]/40',
    outline:
      'bg-transparent text-[#5B4FCF] border-2 border-[#5B4FCF]/30 hover:border-[#5B4FCF]/60 hover:bg-[#5B4FCF]/5',
  };

  const sizes: Record<string, string> = {
    sm: 'px-4 py-2 text-sm gap-1.5',
    md: 'px-6 py-3 text-base gap-2',
    lg: 'px-8 py-4 text-lg gap-2.5',
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}