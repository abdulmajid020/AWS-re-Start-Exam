import React from 'react';
import { QuizHeader } from './QuizHeader';
import { QuizProgressBar } from './QuizProgressBar';
import { OptionButton } from './OptionButton';
import { ExplanationCard } from './ExplanationCard';
import { QuestionNavigatorDrawer } from './QuestionNavigatorDrawer';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import { useQuiz } from '../../context/QuizContext';

export const QuizView: React.FC = () => {
  const {
    session,
    currentQuestion,
    currentAnswer,
    selectOption,
    nextQuestion,
    prevQuestion,
    setConfirmSubmitModalOpen,
  } = useQuiz();

  if (!session || !currentQuestion) {
    return null;
  }

  const isLastQuestion = session.currentIndex === session.questions.length - 1;
  const selectedOpt = currentAnswer?.selectedOption || null;
  const isCorrect = currentAnswer?.isCorrect ?? null;
  const instantFeedback = session.settings.instantFeedback;

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* 1. Header with live timer and controls */}
      <QuizHeader />

      {/* 2. Progress Tracker Bar */}
      <QuizProgressBar />

      {/* 3. Question Card */}
      <div className="rounded-2xl bg-white border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>QUESTION {session.currentIndex + 1}</span>
            <span>Single Selection</span>
          </div>

          <h3 className="text-base sm:text-lg font-display font-bold text-slate-900 leading-snug">
            {currentQuestion.question}
          </h3>
        </div>

        {/* Options List */}
        <div className="space-y-2.5 pt-1">
          {currentQuestion.options.map((option, idx) => (
            <OptionButton
              key={idx}
              option={option}
              index={idx}
              selectedOption={selectedOpt}
              correctAnswer={currentQuestion.correctAnswer}
              instantFeedback={instantFeedback}
              onSelect={selectOption}
            />
          ))}
        </div>

        {/* Instant Explanation (if enabled) */}
        {instantFeedback && selectedOpt !== null && (
          <ExplanationCard
            question={currentQuestion}
            isCorrect={isCorrect}
            selectedOption={selectedOpt}
          />
        )}
      </div>

      {/* 4. Bottom Navigation Bar */}
      <div className="flex items-center justify-between gap-4 pt-1">
        <button
          onClick={prevQuestion}
          disabled={session.currentIndex === 0}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none border border-slate-200 text-xs font-semibold text-slate-700 shadow-sm transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Previous</span>
          <kbd className="hidden sm:inline-block text-[10px] font-mono text-slate-400 ml-1">←</kbd>
        </button>

        <div className="flex items-center gap-3">
          {isLastQuestion ? (
            <button
              onClick={() => setConfirmSubmitModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-display font-bold shadow-sm transition-all active:scale-95"
            >
              <span>Submit Assessment</span>
              <CheckCircle className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={nextQuestion}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-display font-bold shadow-sm transition-all active:scale-95"
            >
              <span>Next</span>
              <ArrowRight className="w-4 h-4" />
              <kbd className="hidden sm:inline-block text-[10px] font-mono opacity-60 ml-1">→</kbd>
            </button>
          )}
        </div>
      </div>

      {/* Drawer */}
      <QuestionNavigatorDrawer />
    </div>
  );
};
