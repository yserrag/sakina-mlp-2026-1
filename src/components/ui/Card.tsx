import React from 'react';

// [FIX]: We extend the interface to include standard HTML div props (like onClick)
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '', ...props }) => {
  return (
    <div 
      className={`bg-slate-900/50 backdrop-blur-md rounded-3xl border border-white/10 ${className}`}
      {...props} // [FIX]: Pass all other props (including onClick) to the div
    >
      {children}
    </div>
  );
};