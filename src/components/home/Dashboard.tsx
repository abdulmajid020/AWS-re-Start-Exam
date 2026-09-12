import React, { useState } from 'react';
import { HeroStats } from './HeroStats';
import { ExamSimulationCard } from './ExamSimulationCard';
import { CategoryPracticeGrid } from './CategoryPracticeGrid';
import { KnowledgeCheckList } from './KnowledgeCheckList';
import { Layers, BookOpen, Clock, ArrowRight, Sparkles, Database } from 'lucide-react';
import { useQuiz } from '../../context/QuizContext';
import { ALL_QUESTIONS, CCP_QUESTIONS, RESTART_QUESTIONS, ALL_KNOWLEDGE_CHECKS, ALL_CATEGORIES } from '../../data/quizData';

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
            <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-slate-500">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              Active Recall Mode
            </div>
            <h3 className="text-base font-display font-bold text-slate-900">Study Flashcards</h3>
            <p className="text-xs text-slate-600">
              Drill all {ALL_QUESTIONS.length} questions across CCP 400 and re/Start with keyboard-friendly flip cards.
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
            <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-slate-500">
              <Database className="w-3.5 h-3.5 text-indigo-600" />
              Complete Question Bank
            </div>
            <h3 className="text-base font-display font-bold text-slate-900">
              Repository & Solutions ({ALL_QUESTIONS.length}Q)
            </h3>
            <p className="text-xs text-slate-600">
              Search and filter across {CCP_QUESTIONS.length} CCP exam questions and {RESTART_QUESTIONS.length} curriculum KCs.
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

      {/* 4. Tab Navigation for Categories vs Knowledge Checks */}
      <div className="space-y-4 pt-1">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="inline-flex p-1 rounded-xl bg-slate-100 border border-slate-200">
            <button
              onClick={() => setActiveTab('categories')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'categories'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Categories
            </button>

            <button
              onClick={() => setActiveTab('kcs')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'kcs'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              Knowledge Checks
            </button>
          </div>

          <span className="text-xs font-mono text-slate-400 hidden sm:inline">
            {activeTab === 'categories' ? `${ALL_CATEGORIES.length} AWS Domains` : `${ALL_KNOWLEDGE_CHECKS.length} Assessment Sets`}
          </span>
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
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : 'bg-rose-50 text-rose-800 border-rose-200'
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
