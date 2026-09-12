import React from 'react';
import { CheckCircle2, XCircle, Circle, Square, CheckSquare } from 'lucide-react';

interface OptionButtonProps {
  option: string;
  index: number;
  selectedOption: string | null;
  selectedOptions?: string[];
  correctAnswer: string;
  correctAnswers?: string[];
  isMultiSelect?: boolean;
  instantFeedback: boolean;
  onSelect: (opt: string) => void;
  disabled?: boolean;
}

export const OptionButton: React.FC<OptionButtonProps> = ({
  option,
  index,
  selectedOption,
  selectedOptions = [],
  correctAnswer,
  correctAnswers = [],
  isMultiSelect = false,
  instantFeedback,
  onSelect,
  disabled = false,
}) => {
  const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
  const letter = letters[index] || String(index + 1);
  const keyNumber = index + 1;

  const isSelected = isMultiSelect
    ? selectedOptions.includes(option)
    : selectedOption === option;

  const targetAnswers = correctAnswers.length > 0 ? correctAnswers : [correctAnswer];
  const isCorrect = targetAnswers.includes(option);
  const hasAnswered = isMultiSelect ? selectedOptions.length > 0 : selectedOption !== null;

  let containerStyles =
    'bg-white dark:bg-slate-900/90 hover:bg-slate-50 dark:hover:bg-slate-800/80 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700 shadow-subtle';
  let badgeStyles = 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700';
  let icon = isMultiSelect ? (
    <Square className="w-4 h-4 text-slate-300 dark:text-slate-600 shrink-0" />
  ) : (
    <Circle className="w-4 h-4 text-slate-300 dark:text-slate-600 shrink-0" />
  );

  if (instantFeedback && hasAnswered) {
    if (isCorrect) {
      containerStyles = 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-500 dark:border-emerald-500/70 text-emerald-950 dark:text-emerald-200 shadow-sm';
      badgeStyles = 'bg-emerald-600 dark:bg-emerald-500 text-white font-bold border-emerald-600 dark:border-emerald-500';
      icon = isMultiSelect ? (
        <CheckSquare className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
      ) : (
        <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
      );
    } else if (isSelected && !isCorrect) {
      containerStyles = 'bg-rose-50/80 dark:bg-rose-950/40 border-rose-500 dark:border-rose-500/70 text-rose-950 dark:text-rose-200 shadow-sm';
      badgeStyles = 'bg-rose-600 dark:bg-rose-500 text-white font-bold border-rose-600 dark:border-rose-500';
      icon = <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />;
    } else {
      containerStyles = 'opacity-50 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500';
      badgeStyles = 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-700';
    }
  } else if (isSelected) {
    containerStyles =
      'bg-slate-900 dark:bg-slate-800 border-slate-900 dark:border-amber-500/80 text-white dark:text-white shadow-sm font-medium ring-1 ring-slate-900 dark:ring-amber-500/40';
    badgeStyles = 'bg-slate-800 dark:bg-amber-500 text-white dark:text-slate-950 font-bold border-slate-700 dark:border-amber-400';
    icon = isMultiSelect ? (
      <CheckSquare className="w-5 h-5 text-white dark:text-amber-400 shrink-0" />
    ) : (
      <CheckCircle2 className="w-5 h-5 text-white dark:text-amber-400 shrink-0" />
    );
  }

  return (
    <button
      onClick={() => onSelect(option)}
      disabled={disabled || (instantFeedback && hasAnswered && !isMultiSelect)}
      className={`w-full group relative flex items-center justify-between p-4 rounded-xl border text-left text-sm transition-all duration-150 active:scale-[0.995] ${containerStyles}`}
    >
      <div className="flex items-center gap-3.5 pr-2">
        <span
          className={`w-7 h-7 rounded-lg border flex items-center justify-center text-xs font-mono font-bold shrink-0 transition-colors ${badgeStyles}`}
        >
          {letter}
        </span>
        <span className="text-sm leading-relaxed">{option}</span>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {icon}
        <kbd
          className={`hidden sm:inline-block text-[10px] font-mono px-1.5 py-0.5 rounded border ${
            isSelected && !instantFeedback
              ? 'bg-slate-800 dark:bg-slate-700 text-slate-300 dark:text-slate-200 border-slate-700 dark:border-slate-600'
              : 'bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-700'
          }`}
        >
          {keyNumber}
        </kbd>
      </div>
    </button>
  );
};
