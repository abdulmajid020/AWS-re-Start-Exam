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
import { ALL_CATEGORIES, getQuestionsByCategory, shuffleArray } from '../../data/quizData';

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

  const handleCategoryFilter = (cat: string) => {
    setSelectedCat(cat);
    if (cat === 'ALL') {
      startFlashcards();
    } else {
      const filtered = getQuestionsByCategory(cat, true);
      startFlashcards(filtered);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-16">
      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentView('home')}
            className="p-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 transition-colors"
          >
            <Home className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-lg font-display font-bold text-slate-900">
              Active Recall Flashcards
            </h2>
            <p className="text-xs text-slate-500 font-mono">
              Card {flashcardIndex + 1} of {flashcardDeck.length}
            </p>
          </div>
        </div>

        {/* Filter by Category & Shuffle */}
        <div className="flex items-center gap-2">
          <select
            value={selectedCat}
            onChange={(e) => handleCategoryFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 font-mono focus:outline-none focus:border-slate-400 shadow-sm"
          >
            <option value="ALL">All Categories ({flashcardDeck.length})</option>
            {ALL_CATEGORIES.map((c) => (
              <option key={c.name} value={c.name}>
                {c.name} ({c.count})
              </option>
            ))}
          </select>

          <button
            onClick={() => startFlashcards(shuffleArray([...flashcardDeck]))}
            title="Shuffle Deck"
            className="p-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 transition-colors shadow-sm"
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
          <div className="absolute inset-0 backface-hidden w-full h-full rounded-2xl bg-white border border-slate-200 p-6 sm:p-8 flex flex-col justify-between shadow-sm hover:border-slate-300 transition-colors">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-slate-700 text-xs font-mono font-medium">
                  <CategoryIcon category={currentCard.category} className="w-3.5 h-3.5" />
                  {currentCard.category}
                </span>

                {isMastered && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-mono">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    Mastered
                  </span>
                )}
              </div>

              <div className="text-xs font-mono text-slate-400">
                {currentCard.kcTitle} • Question #{currentCard.questionNumber}
              </div>

              <h3 className="text-lg sm:text-xl font-display font-bold text-slate-900 leading-relaxed pt-2">
                {currentCard.question}
              </h3>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
              <span>Click or press <kbd className="px-1.5 py-0.5 bg-slate-100 rounded font-mono text-slate-700 border border-slate-200">Space</kbd> to reveal answer</span>
              <RotateCw className="w-4 h-4 text-slate-400" />
            </div>
          </div>

          {/* BACK SIDE */}
          <div className="absolute inset-0 backface-hidden rotate-y-180 w-full h-full rounded-2xl bg-white border border-slate-300 p-6 sm:p-8 flex flex-col justify-between shadow-sm overflow-y-auto">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Correct Solution
                </span>

                <span className="text-xs font-mono text-slate-500">
                  {currentCard.category}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-display font-bold text-base sm:text-lg">
                {currentCard.correctAnswer}
              </div>

              <div className="space-y-1.5 text-xs sm:text-sm text-slate-700 leading-relaxed">
                <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-slate-500 uppercase tracking-wide">
                  <Lightbulb className="w-3.5 h-3.5 text-slate-600" />
                  Detailed Breakdown
                </div>
                <p>{currentCard.explanation}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
              <span>Click to flip back</span>
              <span className="font-mono text-slate-500">{currentCard.kcTitle}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex items-center justify-between gap-4 pt-1">
        <button
          onClick={prevFlashcard}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 transition-all shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => markFlashcardMastered(currentCard.id, false)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-all"
          >
            <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
            <span>Need Practice</span>
          </button>

          <button
            onClick={() => markFlashcardMastered(currentCard.id, true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium transition-all shadow-sm"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Mastered</span>
          </button>
        </div>

        <button
          onClick={nextFlashcard}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 transition-all shadow-sm"
        >
          <span>Next</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
