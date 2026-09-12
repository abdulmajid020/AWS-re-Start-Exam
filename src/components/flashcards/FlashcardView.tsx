import React, { useState } from 'react';
import {
  RotateCw,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Shuffle,
  Home,
  Lightbulb,
} from 'lucide-react';
import { useQuiz } from '../../context/QuizContext';
import { CategoryIcon } from '../common/CategoryIcon';
import {
  ALL_CATEGORIES,
  ALL_QUESTIONS,
  CCP_QUESTIONS,
  RESTART_QUESTIONS,
  getQuestionsByCategory,
  getQuestionsByBank,
  shuffleArray,
} from '../../data/quizData';
import { QuestionBankId } from '../../types/quiz';

export const FlashcardView: React.FC = () => {
  const {
    flashcardDeck,
    flashcardIndex,
    isFlipped,
    setIsFlipped,
    nextFlashcard,
    prevFlashcard,
    markFlashcardMastered,
    stats,
    startFlashcards,
    setCurrentView,
  } = useQuiz();

  const [selectedBank, setSelectedBank] = useState<QuestionBankId>('all');
  const [selectedCat, setSelectedCat] = useState<string>('ALL');

  const currentCard = flashcardDeck[flashcardIndex];
  if (!currentCard) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-500">No flashcards in deck</p>
        <button
          onClick={() => startFlashcards()}
          className="mt-4 px-4 py-2 bg-slate-900 text-white font-bold rounded-xl text-xs"
        >
          Load All Cards
        </button>
      </div>
    );
  }

  const isMastered = stats.masteredQuestionIds.includes(currentCard.id);
  const isCCP = currentCard.bankId === 'ccp400';
  const targetAnswers = currentCard.correctAnswers && currentCard.correctAnswers.length > 1
    ? currentCard.correctAnswers
    : [currentCard.correctAnswer];

  const handleBankChange = (bank: QuestionBankId) => {
    setSelectedBank(bank);
    setSelectedCat('ALL');
    const pool = getQuestionsByBank(bank);
    startFlashcards(pool);
  };

  const handleCategoryFilter = (cat: string) => {
    setSelectedCat(cat);
    if (cat === 'ALL') {
      startFlashcards(getQuestionsByBank(selectedBank));
    } else {
      const filtered = getQuestionsByCategory(cat, true, selectedBank);
      startFlashcards(filtered);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-16">
      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentView('home')}
            className="p-2 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
          >
            <Home className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-lg font-display font-bold text-slate-900 dark:text-white">
              Active Recall Flashcards
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              Card {flashcardIndex + 1} of {flashcardDeck.length}
            </p>
          </div>
        </div>

        {/* Filter by Bank, Category & Shuffle */}
        <div className="flex items-center gap-2">
          <select
            value={selectedBank}
            onChange={(e) => handleBankChange(e.target.value as QuestionBankId)}
            className="px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 font-mono focus:outline-none focus:border-slate-400 shadow-sm"
          >
            <option value="all">All Banks ({ALL_QUESTIONS.length})</option>
            <option value="ccp400">CCP 400 ({CCP_QUESTIONS.length})</option>
            <option value="restart_kcs">re/Start ({RESTART_QUESTIONS.length})</option>
          </select>

          <select
            value={selectedCat}
            onChange={(e) => handleCategoryFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 font-mono focus:outline-none focus:border-slate-400 shadow-sm max-w-[140px] truncate"
          >
            <option value="ALL">All Domains</option>
            {ALL_CATEGORIES.map((c) => (
              <option key={c.name} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>

          <button
            onClick={() => startFlashcards(shuffleArray([...flashcardDeck]))}
            title="Shuffle Deck"
            className="p-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors shadow-sm"
          >
            <Shuffle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3D Flip Card Container */}
      <div
        onClick={() => setIsFlipped(!isFlipped)}
        className="w-full cursor-pointer perspective-1000 min-h-[380px] sm:min-h-[420px]"
      >
        <div
          className={`relative w-full h-full min-h-[380px] sm:min-h-[420px] transition-transform duration-500 transform-style-preserve-3d ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
        >
          {/* FRONT SIDE */}
          <div className="absolute inset-0 backface-hidden w-full h-full rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 flex flex-col justify-between shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-mono font-medium">
                    <CategoryIcon category={currentCard.category} className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
                    {currentCard.category}
                  </span>
                  <span
                    className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border ${
                      isCCP
                        ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                        : 'bg-sky-50 dark:bg-sky-950/60 text-sky-900 dark:text-sky-300 border-sky-200 dark:border-sky-800'
                    }`}
                  >
                    {isCCP ? `CCP Q${currentCard.questionNumber}` : `KC #${currentCard.kcIndex}`}
                  </span>
                </div>

                {isMastered && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-[11px] font-mono">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                    Mastered
                  </span>
                )}
              </div>

              <div className="text-xs font-mono text-slate-400 dark:text-slate-500">
                {currentCard.kcTitle}
              </div>

              <h3 className="text-lg sm:text-xl font-display font-bold text-slate-900 dark:text-white leading-relaxed pt-2">
                {currentCard.question}
              </h3>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400 dark:text-slate-500">
              <span>Click or press <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded font-mono text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">Space</kbd> to reveal answer</span>
              <RotateCw className="w-4 h-4 text-slate-400 dark:text-slate-500" />
            </div>
          </div>

          {/* BACK SIDE */}
          <div className="absolute inset-0 backface-hidden rotate-y-180 w-full h-full rounded-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 p-6 sm:p-8 flex flex-col justify-between shadow-sm overflow-y-auto">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-mono font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  {currentCard.isMultiSelect ? 'Correct Solutions (Multi-Select)' : 'Correct Solution'}
                </span>

                <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                  {currentCard.category}
                </span>
              </div>

              <div className="space-y-2">
                {targetAnswers.map((ans, aIdx) => (
                  <div
                    key={aIdx}
                    className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-display font-bold text-sm sm:text-base flex items-start gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span>{ans}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-1.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed pt-1">
                <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  <Lightbulb className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
                  Detailed Breakdown
                </div>
                <p>{currentCard.explanation}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400 dark:text-slate-500">
              <span>Click to flip back</span>
              <span className="font-mono text-slate-500 dark:text-slate-400">{currentCard.kcTitle}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex items-center justify-between gap-4 pt-1">
        <button
          onClick={prevFlashcard}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-all shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => markFlashcardMastered(currentCard.id, false)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium transition-all"
          >
            <AlertCircle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>Need Practice</span>
          </button>

          <button
            onClick={() => markFlashcardMastered(currentCard.id, true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-amber-500 dark:hover:bg-amber-400 text-white dark:text-slate-950 text-xs font-medium transition-all shadow-sm"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 dark:text-slate-950" />
            <span>Mastered</span>
          </button>
        </div>

        <button
          onClick={nextFlashcard}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-all shadow-sm"
        >
          <span>Next</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
