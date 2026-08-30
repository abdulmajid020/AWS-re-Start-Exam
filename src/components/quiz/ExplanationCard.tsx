import React from 'react';
import { Lightbulb, CheckCircle2, BookOpen } from 'lucide-react';
import { FormattedQuestion } from '../../types/quiz';

interface ExplanationCardProps {
  question: FormattedQuestion;
  isCorrect: boolean | null;
  selectedOption?: string | null;
}

export const ExplanationCard: React.FC<ExplanationCardProps> = ({
  question,
  isCorrect,
}) => {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 space-y-3.5">
      {/* Explanation Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-md bg-white border border-slate-200 text-slate-700">
            <Lightbulb className="w-3.5 h-3.5" />
          </div>
          <h4 className="text-xs font-mono font-bold tracking-wide uppercase text-slate-700">
            Concept & Explanation
          </h4>
        </div>

        {isCorrect !== null && (
          <span
            className={`text-xs font-mono font-semibold px-2.5 py-0.5 rounded-md border ${
              isCorrect
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-rose-50 text-rose-800 border-rose-200'
            }`}
          >
            {isCorrect ? 'Correct' : 'Incorrect'}
          </span>
        )}
      </div>

      {/* Correct answer reminder if wrong */}
      {isCorrect === false && (
        <div className="p-3 rounded-lg bg-emerald-50/90 border border-emerald-200 flex items-start gap-2.5 text-xs text-emerald-900">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Correct Answer: </span>
            <span>{question.correctAnswer}</span>
          </div>
        </div>
      )}

      {/* Explanation text */}
      <div className="text-xs sm:text-sm text-slate-700 leading-relaxed space-y-1.5">
        <p>{question.explanation}</p>
      </div>

      {/* KC Context */}
      <div className="pt-3 border-t border-slate-200 flex items-start gap-2 text-xs text-slate-500">
        <BookOpen className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-slate-700">{question.kcTitle}: </span>
          <span>{question.summary}</span>
        </div>
      </div>
    </div>
  );
};
