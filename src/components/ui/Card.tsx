import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export default function Card({ children, className = '', hover = false, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`rounded-[20px] bg-white/60 backdrop-blur-[10px] border border-white/50 shadow-[0_4px_20px_rgba(91,79,207,0.08)] p-6 transition-all duration-300 ${
        hover ? 'hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(91,79,207,0.15)] cursor-pointer' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}