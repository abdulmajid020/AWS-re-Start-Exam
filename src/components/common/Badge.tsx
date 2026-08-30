import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'accent' | 'success' | 'warning' | 'danger' | 'purple' | 'outline';
  className?: string;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  className = '',
  size = 'md',
}) => {
  const sizeClasses = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-xs font-medium px-2.5 py-1';

  let variantClasses = '';
  switch (variant) {
    case 'accent':
      variantClasses = 'bg-amber-500/10 text-amber-400 border border-amber-500/30';
      break;
    case 'success':
      variantClasses = 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30';
      break;
    case 'warning':
      variantClasses = 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30';
      break;
    case 'danger':
      variantClasses = 'bg-rose-500/10 text-rose-400 border border-rose-500/30';
      break;
    case 'purple':
      variantClasses = 'bg-purple-500/10 text-purple-400 border border-purple-500/30';
      break;
    case 'outline':
      variantClasses = 'bg-transparent text-slate-400 border border-slate-700 dark:border-slate-800';
      break;
    default:
      variantClasses = 'bg-slate-800/80 text-slate-300 border border-slate-700/60 dark:bg-slate-800/60 dark:text-slate-300 dark:border-slate-700';
      break;
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md font-mono tracking-tight transition-colors ${sizeClasses} ${variantClasses} ${className}`}
    >
      {children}
    </span>
  );
};
