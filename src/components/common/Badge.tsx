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
      variantClasses = 'bg-amber-50 dark:bg-amber-500/10 text-amber-800 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30';
      break;
    case 'success':
      variantClasses = 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30';
      break;
    case 'warning':
      variantClasses = 'bg-yellow-50 dark:bg-yellow-500/10 text-yellow-800 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-500/30';
      break;
    case 'danger':
      variantClasses = 'bg-rose-50 dark:bg-rose-500/10 text-rose-800 dark:text-rose-400 border border-rose-200 dark:border-rose-500/30';
      break;
    case 'purple':
      variantClasses = 'bg-purple-50 dark:bg-purple-500/10 text-purple-800 dark:text-purple-400 border border-purple-200 dark:border-purple-500/30';
      break;
    case 'outline':
      variantClasses = 'bg-transparent text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-700';
      break;
    default:
      variantClasses = 'bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800/80 dark:text-slate-300 dark:border-slate-700/60';
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
