import React, { useState } from 'react';
import { Clock, Award, Zap, Play, Settings2, CheckCircle } from 'lucide-react';
import { useQuiz } from '../../context/QuizContext';
import { QuestionBankId } from '../../types/quiz';
import { ALL_QUESTIONS, CCP_QUESTIONS, RESTART_QUESTIONS } from '../../data/quizData';

export const ExamSimulationCard: React.FC = () => {
  const { startExamSimulation, startCustomQuiz } = useQuiz();
  const [showCustom, setShowCustom] = useState(false);
  const [customBank, setCustomBank] = useState<QuestionBankId>('ccp400');
  const [customCount, setCustomCount] = useState<number>(65);
  const [customTime, setCustomTime] = useState<number>(90);
  const [instantFeedback, setInstantFeedback] = useState<boolean>(false);

  const presets = [
    { label: '65Q Exam (90m)', count: 65, time: 90, bank: 'ccp400' as const },
    { label: '25Q Quick (30m)', count: 25, time: 30, bank: 'all' as const },
    { label: 'CCP 400 Bank', count: 400, time: 0, bank: 'ccp400' as const },
    { label: 're/Start KCs (103)', count: 103, time: 0, bank: 'restart_kcs' as const },
  ];

  return (
    <div className="rounded-2xl bg-white border border-slate-200/90 p-6 sm:p-8 shadow-sm">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-3 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md text-xs font-mono font-semibold bg-slate-900 text-white">
              Official Simulation
            </span>
            <span className="text-xs font-mono text-slate-500 flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-amber-600" />
              Passing Score: 700 / 1000 (70%)
            </span>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-display font-extrabold text-slate-900 tracking-tight">
              AWS Certification Exam Simulation
            </h2>
            <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
              Standard 90-minute timed assessment with 65 questions sampled from the <span className="font-semibold text-slate-900">CCP 400 Question Bank</span>. Features multi-select scenarios and official scaled 100–1000 scoring.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-1 text-xs text-slate-600">
            <div className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>65 Questions</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-slate-500 shrink-0" />
              <span>90 Minutes</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-600 shrink-0" />
              <span>~83s / Question</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col gap-2.5 min-w-[280px]">
          <button
            onClick={() => startExamSimulation(65, 90, 'ccp400')}
            className="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-display font-bold text-sm shadow-sm transition-all active:scale-[0.99]"
          >
            <Play className="w-4 h-4 fill-current" />
            Start 90-Min CCP Exam (65Q)
          </button>

          <button
            onClick={() => setShowCustom(!showCustom)}
            className="w-full flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-xs font-semibold border border-slate-200 transition-colors"
          >
            <Settings2 className="w-3.5 h-3.5 text-slate-500" />
            {showCustom ? 'Hide Custom Options' : 'Custom Bank, Count & Timer'}
          </button>

          {!showCustom && (
            <div className="grid grid-cols-2 gap-1.5 pt-1">
              {presets.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => startExamSimulation(p.count, p.time, p.bank)}
                  className="py-1 px-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[11px] font-medium text-slate-700 hover:text-slate-900 transition-colors text-center truncate"
                >
                  {p.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Custom options accordion */}
      {showCustom && (
        <div className="mt-6 pt-6 border-t border-slate-100 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Question Bank
              </label>
              <select
                value={customBank}
                onChange={(e) => setCustomBank(e.target.value as QuestionBankId)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-mono focus:outline-none focus:border-slate-400"
              >
                <option value="all">All Sources ({ALL_QUESTIONS.length}Q)</option>
                <option value="ccp400">CCP 400 Exam Bank ({CCP_QUESTIONS.length}Q)</option>
                <option value="restart_kcs">re/Start KCs ({RESTART_QUESTIONS.length}Q)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Question Count
              </label>
              <select
                value={customCount}
                onChange={(e) => setCustomCount(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-mono focus:outline-none focus:border-slate-400"
              >
                <option value={10}>10 Questions</option>
                <option value={25}>25 Questions</option>
                <option value={50}>50 Questions</option>
                <option value={65}>65 Questions (Standard)</option>
                <option value={100}>100 Questions</option>
                <option value={400}>400 Questions (CCP Bank)</option>
                <option value={503}>503 Questions (All)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Time Limit
              </label>
              <select
                value={customTime}
                onChange={(e) => setCustomTime(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-mono focus:outline-none focus:border-slate-400"
              >
                <option value={15}>15 Minutes</option>
                <option value={30}>30 Minutes</option>
                <option value={60}>60 Minutes</option>
                <option value={90}>90 Minutes (Standard)</option>
                <option value={120}>120 Minutes</option>
                <option value={0}>Untimed</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Feedback Mode
              </label>
              <select
                value={instantFeedback ? 'instant' : 'exam'}
                onChange={(e) => setInstantFeedback(e.target.value === 'instant')}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-mono focus:outline-none focus:border-slate-400"
              >
                <option value="exam">Exam Mode (Review at end)</option>
                <option value="instant">Instant Explanations</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <button
              onClick={() =>
                startCustomQuiz(
                  {
                    questionCount: customCount,
                    timeLimitMinutes: customTime === 0 ? null : customTime,
                    instantFeedback,
                    mode: 'custom_practice',
                    selectedBank: customBank,
                  },
                  `Practice Assessment (${customCount}Q)`
                )
              }
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-display font-semibold text-xs shadow-sm transition-all"
            >
              Start Practice ({customCount}Q)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
