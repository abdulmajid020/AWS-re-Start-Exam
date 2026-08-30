import React from 'react';
import { CheckCircle2, XCircle, Circle } from 'lucide-react';

interface OptionButtonProps {
  option: string;
  index: number;
  selectedOption: string | null;
  correctAnswer: string;
  instantFeedback: boolean;
  onSelect: (opt: string) => void;
  disabled?: boolean;
}

export const OptionButton: React.FC<OptionButtonProps> = ({
  option,
  index,
  selectedOption,
  correctAnswer,
  instantFeedback,
  onSelect,
  disabled = false,
}) => {
  const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
  const letter = letters[index] || String(index + 1);
  const keyNumber = index + 1;

  const isSelected = selectedOption === option;
  const isCorrect = option === correctAnswer;
  const hasAnswered = selectedOption !== null;

  let containerStyles =
    'bg-white hover:bg-slate-50 border-slate-200 text-slate-800 hover:border-slate-300 shadow-subtle';
  let badgeStyles = 'bg-slate-100 text-slate-700 border-slate-200';
  let icon = <Circle className="w-4 h-4 text-slate-300 shrink-0" />;

  if (instantFeedback && hasAnswered) {
    if (isCorrect) {
      containerStyles = 'bg-emerald-50/80 border-emerald-500 text-emerald-950 shadow-sm';
      badgeStyles = 'bg-emerald-600 text-white font-bold border-emerald-600';
      icon = <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />;
    } else if (isSelected && !isCorrect) {
      containerStyles = 'bg-rose-50/80 border-rose-500 text-rose-950 shadow-sm';
      badgeStyles = 'bg-rose-600 text-white font-bold border-rose-600';
      icon = <XCircle className="w-5 h-5 text-rose-600 shrink-0" />;
    } else {
      containerStyles = 'opacity-50 bg-white border-slate-200 text-slate-400';
      badgeStyles = 'bg-slate-100 text-slate-400 border-slate-200';
    }
  } else if (isSelected) {
    containerStyles =
      'bg-slate-900 border-slate-900 text-white shadow-sm font-medium';
    badgeStyles = 'bg-slate-800 text-white font-bold border-slate-700';
    icon = <CheckCircle2 className="w-5 h-5 text-white shrink-0" />;
  }

  return (
    <button
      onClick={() => onSelect(option)}
      disabled={disabled || (instantFeedback && hasAnswered)}
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
        <kbd className={`hidden sm:inline-block text-[10px] font-mono px-1.5 py-0.5 rounded border ${
          isSelected && !instantFeedback
            ? 'bg-slate-800 text-slate-300 border-slate-700'
            : 'bg-slate-50 text-slate-400 border-slate-200'
        }`}>
          {keyNumber}
        </kbd>
      </div>
    </button>
  );
};
