import React from 'react';
import { X, Command, Keyboard } from 'lucide-react';
import { useQuiz } from '../../context/QuizContext';

export const KeyboardShortcutsModal: React.FC = () => {
  const { shortcutsModalOpen, setShortcutsModalOpen } = useQuiz();

  if (!shortcutsModalOpen) return null;

  const shortcuts = [
    { key: '1, 2, 3, 4', desc: 'Select Option 1 to 4', tag: 'Quiz' },
    { key: 'A, B, C, D', desc: 'Select Option A to D', tag: 'Quiz' },
    { key: '→ or K or N', desc: 'Next Question / Card', tag: 'Global' },
    { key: '← or J or P', desc: 'Previous Question / Card', tag: 'Global' },
    { key: 'T / D', desc: 'Toggle Dark / Light Theme', tag: 'Global' },
    { key: 'F', desc: 'Flag / Unflag Question', tag: 'Quiz' },
    { key: 'M or G', desc: 'Toggle Question Map Navigator', tag: 'Quiz' },
    { key: 'Space', desc: 'Flip Flashcard (Front/Back)', tag: 'Flashcards' },
    { key: '?', desc: 'Toggle this Shortcuts Menu', tag: 'Global' },
    { key: 'Esc', desc: 'Close dialogs & drawers', tag: 'Global' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden p-6">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              <Keyboard className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-display font-bold text-slate-900 dark:text-white">Keyboard Shortcuts</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Navigate quickly without a mouse</p>
            </div>
          </div>
          <button
            onClick={() => setShortcutsModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-2">
          {shortcuts.map((sc, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between py-1.5 px-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800"
            >
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600">
                  {sc.tag}
                </span>
                <span className="text-xs text-slate-700 dark:text-slate-300">{sc.desc}</span>
              </div>
              <kbd className="inline-flex items-center px-2 py-0.5 text-xs font-mono font-semibold bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded shadow-xs">
                {sc.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1">
            <Command className="w-3.5 h-3.5 text-slate-400" />
            Press <kbd className="px-1 bg-slate-100 dark:bg-slate-800 rounded text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">?</kbd> anytime
          </span>
          <button
            onClick={() => setShortcutsModalOpen(false)}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 dark:bg-amber-500 dark:hover:bg-amber-400 dark:text-slate-950 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
