import React from 'react';
import { Lightbulb, CheckCircle2, BookOpen } from 'lucide-react';
import { FormattedQuestion } from '../../types/quiz';

interface ExplanationCardProps {
  question: FormattedQuestion;
  isCorrect: boolean | null;
  selectedOption?: string | null;
  selectedOptions?: string[];
}

export const ExplanationCard: React.FC<ExplanationCardProps> = ({
  question,
  isCorrect,
}) => {
  const correctText =
    question.correctAnswers && question.correctAnswers.length > 1
      ? question.correctAnswers.join(' • ')
      : question.correctAnswer;

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850/60 p-5 space-y-3.5 animate-fadeIn transition-colors">
      {/* Explanation Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-amber-400">
            <Lightbulb className="w-3.5 h-3.5" />
          </div>
          <h4 className="text-xs font-mono font-bold tracking-wide uppercase text-slate-700 dark:text-slate-300">
            Concept & Explanation
          </h4>
        </div>

        {isCorrect !== null && (
          <span
            className={`text-xs font-mono font-semibold px-2.5 py-0.5 rounded-md border ${
              isCorrect
                ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/80'
                : 'bg-rose-50 dark:bg-rose-950/50 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800/80'
            }`}
          >
            {isCorrect ? 'Correct' : 'Incorrect'}
          </span>
        )}
      </div>

      {/* Correct answer reminder if wrong */}
      {isCorrect === false && (
        <div className="p-3 rounded-lg bg-emerald-50/90 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 flex items-start gap-2.5 text-xs text-emerald-900 dark:text-emerald-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">
              {question.isMultiSelect ? 'Correct Options: ' : 'Correct Answer: '}
            </span>
            <span>{correctText}</span>
          </div>
        </div>
      )}

      {/* Explanation text */}
      <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed space-y-1.5">
        <p>{question.explanation}</p>
      </div>

      {/* KC Context */}
      <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-start gap-2 text-xs text-slate-500 dark:text-slate-400">
        <BookOpen className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-slate-700 dark:text-slate-200">{question.kcTitle}: </span>
          <span>{question.summary}</span>
        </div>
      </div>
    </div>
  );
};
