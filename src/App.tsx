import React from 'react';
import { QuizProvider, useQuiz } from './context/QuizContext';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Dashboard } from './components/home/Dashboard';
import { QuizView } from './components/quiz/QuizView';
import { FlashcardView } from './components/flashcards/FlashcardView';
import { ResultsView } from './components/results/ResultsView';
import { QuestionExplorer } from './components/explorer/QuestionExplorer';
import { KeyboardShortcutsModal } from './components/common/KeyboardShortcutsModal';
import { ConfirmSubmitModal } from './components/common/ConfirmSubmitModal';
import { SupportModal } from './components/common/SupportModal';

const AppContent: React.FC = () => {
  const { currentView, supportModalOpen, setSupportModalOpen } = useQuiz();
  useKeyboardShortcuts();

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-900 antialiased font-sans selection:bg-amber-100 selection:text-amber-900">
      {/* Top Navigation */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 pt-6 pb-12">
        {currentView === 'home' && <Dashboard />}
        {currentView === 'quiz' && <QuizView />}
        {currentView === 'flashcards' && <FlashcardView />}
        {currentView === 'results' && <ResultsView />}
        {currentView === 'explorer' && <QuestionExplorer />}
      </main>

      {/* Footer */}
      <Footer />

      {/* Global Modals */}
      <KeyboardShortcutsModal />
      <ConfirmSubmitModal />
      <SupportModal isOpen={supportModalOpen} onClose={() => setSupportModalOpen(false)} />
    </div>
  );
};

export function App() {
  return (
    <QuizProvider>
      <AppContent />
    </QuizProvider>
  );
}

export default App;
