import React, { useState } from 'react';
import { HeroStats } from './HeroStats';
import { ExamSimulationCard } from './ExamSimulationCard';
import { CategoryPracticeGrid } from './CategoryPracticeGrid';
import { KnowledgeCheckList } from './KnowledgeCheckList';
import { Layers, BookOpen, Clock, ArrowRight } from 'lucide-react';
import { useQuiz } from '../../context/QuizContext';

export const Dashboard: React.FC = () => {
  const { startFlashcards, setCurrentView, stats } = useQuiz();
  const [activeTab, setActiveTab] = useState<'categories' | 'kcs'>('categories');

  return (
    <div className="space-y-6">
      {/* 1. Hero & Real-time Metrics */}
      <HeroStats />

      {/* 2. Flagship Exam Simulation */}
      <ExamSimulationCard />

      {/* 3. Study Mode Highlights Banner (Flashcards & Question Bank Explorer) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Flashcards Card */}
        <div className="rounded-2xl bg-white border border-slate-200/90 p-5 flex items-center justify-between gap-4 shadow-sm">
          <div className="space-y-1 max-w-sm">
            <div className="text-xs font-mono font-semibold text-slate-500">
              Active Recall Mode
            </div>
            <h3 className="text-base font-display font-bold text-slate-900">Study Flashcards</h3>
            <p className="text-xs text-slate-600">
              Drill all 103 questions with keyboard-friendly flip cards.
            </p>
          </div>
          <button
            onClick={() => startFlashcards()}
            className="shrink-0 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-900 text-slate-800 hover:text-white text-xs font-semibold border border-slate-200 hover:border-slate-900 transition-all flex items-center gap-1.5"
          >
            Study Deck
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Question Explorer Card */}
        <div className="rounded-2xl bg-white border border-slate-200/90 p-5 flex items-center justify-between gap-4 shadow-sm">
          <div className="space-y-1 max-w-sm">
            <div className="text-xs font-mono font-semibold text-slate-500">
              Curriculum Directory
            </div>
            <h3 className="text-base font-display font-bold text-slate-900">Question Bank & Solutions</h3>
            <p className="text-xs text-slate-600">
              Browse the complete repository of questions and concept explanations.
            </p>
          </div>
          <button
            onClick={() => setCurrentView('explorer')}
            className="shrink-0 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-900 text-slate-800 hover:text-white text-xs font-semibold border border-slate-200 hover:border-slate-900 transition-all flex items-center gap-1.5"
          >
            Open Directory
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 4. Tab Navigation for Categories vs All KCs */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
          <button
            onClick={() => setActiveTab('categories')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'categories'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            18 AWS Categories
          </button>

          <button
            onClick={() => setActiveTab('kcs')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'kcs'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            All 96 Knowledge Checks (A–Z)
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'categories' ? <CategoryPracticeGrid /> : <KnowledgeCheckList />}
      </div>

      {/* 5. Recent History Section (if any tests taken) */}
      {stats.recentHistory.length > 0 && (
        <div className="space-y-3 pt-4 border-t border-slate-200">
          <h3 className="text-sm font-display font-bold text-slate-700 flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-400" />
            Recent Assessment History
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {stats.recentHistory.slice(0, 6).map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between text-xs shadow-subtle"
              >
                <div>
                  <div className="font-semibold text-slate-900 truncate max-w-[180px]">
                    {item.title}
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono mt-0.5">{item.date}</div>
                </div>

                <div className="text-right">
                  <span
                    className={`font-mono font-bold text-xs px-2 py-0.5 rounded ${
                      item.passed
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-rose-50 text-rose-800 border border-rose-200'
                    }`}
                  >
                    {item.scaledScore} / 1000
                  </span>
                  <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                    {item.scorePercentage}% • {Math.round(item.timeElapsedSeconds / 60)}m
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
