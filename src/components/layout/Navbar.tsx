import React from 'react';
import { Keyboard, Compass, Layers, Home, BookOpen, CheckCircle2, Bookmark, Coffee } from 'lucide-react';
import { useQuiz } from '../../context/QuizContext';

export const Navbar: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    setShortcutsModalOpen,
    setSupportModalOpen,
    session,
    stats,
  } = useQuiz();

  const accuracy =
    stats.totalQuestionsAnswered > 0
      ? Math.round((stats.totalCorrect / stats.totalQuestionsAnswered) * 100)
      : 0;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentView('home')}
            className="flex items-center gap-2.5 text-left focus:outline-none group"
          >
            <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white shadow-sm group-hover:bg-slate-800 transition-colors">
              <BookOpen className="w-4 h-4 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-display font-bold text-slate-900 tracking-tight">
                  AWS Quiz Hub
                </span>
                <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-200 font-bold">
                  CCP 400
                </span>
                <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 hidden sm:inline">
                  CLF-C02
                </span>
              </div>
            </div>
          </button>
        </div>

        {/* Navigation Tabs (when not in test) */}
        {!session && (
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/80">
            <button
              onClick={() => setCurrentView('home')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentView === 'home'
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              Practice Hub
            </button>

            <button
              onClick={() => setCurrentView('explorer')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentView === 'explorer'
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              Question Bank (503Q)
            </button>

            <button
              onClick={() => setCurrentView('flashcards')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentView === 'flashcards'
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Flashcards
            </button>
          </nav>
        )}

        {/* Right Stats & Controls */}
        <div className="flex items-center gap-2">
          {stats.totalQuestionsAnswered > 0 && !session && (
            <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-xs">
              <div className="flex items-center gap-1 text-slate-700 font-mono font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>{accuracy}%</span>
              </div>
              <span className="text-slate-300">|</span>
              <div className="flex items-center gap-1 text-slate-600 font-mono">
                <Bookmark className="w-3.5 h-3.5 text-amber-600" />
                <span>{stats.masteredQuestionIds.length} Mastered</span>
              </div>
            </div>
          )}

          {/* Support / Buy Me a Coffee button */}
          <button
            onClick={() => setSupportModalOpen(true)}
            title="Support this project"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-semibold transition-colors"
          >
            <Coffee className="w-3.5 h-3.5 text-amber-700" />
            <span className="hidden sm:inline">Support</span>
          </button>

          <button
            onClick={() => setShortcutsModalOpen(true)}
            title="Keyboard Shortcuts (?)"
            className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <Keyboard className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
