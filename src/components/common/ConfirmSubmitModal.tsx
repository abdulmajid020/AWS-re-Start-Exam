import React from 'react';
import { AlertTriangle, CheckCircle2, Flag, ArrowRight, X } from 'lucide-react';
import { useQuiz } from '../../context/QuizContext';

export const ConfirmSubmitModal: React.FC = () => {
  const {
    session,
    confirmSubmitModalOpen,
    setConfirmSubmitModalOpen,
    finishQuiz,
    setNavigatorDrawerOpen,
  } = useQuiz();

  if (!confirmSubmitModalOpen || !session) return null;

  const total = session.questions.length;
  const answered = Object.values(session.answers).filter((a) => a.selectedOption !== null).length;
  const unanswered = total - answered;
  const flagged = Object.values(session.answers).filter((a) => a.flagged).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden p-6">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-50 text-amber-700 border border-amber-200">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <h3 className="text-base font-display font-bold text-slate-900">Submit Assessment?</h3>
          </div>
          <button
            onClick={() => setConfirmSubmitModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 mb-4 leading-relaxed">
          Are you ready to submit your exam? Once submitted, your scaled score will be calculated and solutions will be displayed.
        </p>

        {/* Status summary tiles */}
        <div className="grid grid-cols-3 gap-2.5 mb-4">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
            <div className="flex items-center justify-center gap-1 text-emerald-700 mb-0.5">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-base font-display font-bold">{answered}</span>
            </div>
            <span className="text-[11px] text-slate-500 font-medium">Answered</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
            <div className="flex items-center justify-center gap-1 text-rose-700 mb-0.5">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-base font-display font-bold">{unanswered}</span>
            </div>
            <span className="text-[11px] text-slate-500 font-medium">Unanswered</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
            <div className="flex items-center justify-center gap-1 text-amber-700 mb-0.5">
              <Flag className="w-4 h-4" />
              <span className="text-base font-display font-bold">{flagged}</span>
            </div>
            <span className="text-[11px] text-slate-500 font-medium">Flagged</span>
          </div>
        </div>

        {unanswered > 0 && (
          <div className="p-3 mb-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
            <span>
              You have <strong className="font-semibold">{unanswered} unanswered</strong> questions. Unanswered questions will be scored as 0.
            </span>
          </div>
        )}

        <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-100">
          <button
            onClick={() => {
              setConfirmSubmitModalOpen(false);
              setNavigatorDrawerOpen(true);
            }}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition-colors"
          >
            Review Questions
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setConfirmSubmitModalOpen(false)}
              className="px-3 py-2 text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors"
            >
              Continue Test
            </button>
            <button
              onClick={finishQuiz}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-display font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all shadow-sm"
            >
              Confirm & Submit
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
