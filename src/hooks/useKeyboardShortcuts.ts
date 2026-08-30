import { useEffect } from 'react';
import { useQuiz } from '../context/QuizContext';

export function useKeyboardShortcuts() {
  const {
    currentView,
    session,
    currentQuestion,
    selectOption,
    nextQuestion,
    prevQuestion,
    toggleFlag,
    shortcutsModalOpen,
    setShortcutsModalOpen,
    confirmSubmitModalOpen,
    setConfirmSubmitModalOpen,
    navigatorDrawerOpen,
    setNavigatorDrawerOpen,
    isFlipped,
    setIsFlipped,
    nextFlashcard,
    prevFlashcard,
  } = useQuiz();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts if typing inside input, textarea, or contentEditable
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      // Help Modal toggle on '?'
      if (e.key === '?') {
        e.preventDefault();
        setShortcutsModalOpen(!shortcutsModalOpen);
        return;
      }

      // Close open modals on Escape
      if (e.key === 'Escape') {
        if (shortcutsModalOpen) setShortcutsModalOpen(false);
        if (confirmSubmitModalOpen) setConfirmSubmitModalOpen(false);
        if (navigatorDrawerOpen) setNavigatorDrawerOpen(false);
        return;
      }

      // If a modal is open, prevent other shortcuts
      if (shortcutsModalOpen || confirmSubmitModalOpen) {
        return;
      }

      // Flashcards Shortcuts
      if (currentView === 'flashcards') {
        if (e.code === 'Space') {
          e.preventDefault();
          setIsFlipped(!isFlipped);
        } else if (e.key === 'ArrowRight' || e.key === 'k' || e.key === 'n') {
          e.preventDefault();
          nextFlashcard();
        } else if (e.key === 'ArrowLeft' || e.key === 'j' || e.key === 'p') {
          e.preventDefault();
          prevFlashcard();
        }
        return;
      }

      // Active Quiz Shortcuts
      if (currentView === 'quiz' && session && !session.isFinished && currentQuestion) {
        // Option selection: 1-4 or A-D
        const optionKeys: Record<string, number> = {
          '1': 0,
          '2': 1,
          '3': 2,
          '4': 3,
          'a': 0,
          'b': 1,
          'c': 2,
          'd': 3,
          'A': 0,
          'B': 1,
          'C': 2,
          'D': 3,
        };

        if (optionKeys[e.key] !== undefined) {
          const index = optionKeys[e.key];
          if (currentQuestion.options[index]) {
            e.preventDefault();
            selectOption(currentQuestion.options[index]);
          }
          return;
        }

        // Navigation
        if (e.key === 'ArrowRight' || e.key === 'k' || e.key === 'n') {
          e.preventDefault();
          nextQuestion();
          return;
        }
        if (e.key === 'ArrowLeft' || e.key === 'j' || e.key === 'p') {
          e.preventDefault();
          prevQuestion();
          return;
        }

        // Flag / Bookmark toggle
        if (e.key === 'f' || e.key === 'F') {
          e.preventDefault();
          toggleFlag();
          return;
        }

        // Toggle Question Navigator drawer on 'm' or 'g'
        if (e.key === 'm' || e.key === 'g' || e.key === 'M' || e.key === 'G') {
          e.preventDefault();
          setNavigatorDrawerOpen(!navigatorDrawerOpen);
          return;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    currentView,
    session,
    currentQuestion,
    selectOption,
    nextQuestion,
    prevQuestion,
    toggleFlag,
    shortcutsModalOpen,
    setShortcutsModalOpen,
    confirmSubmitModalOpen,
    setConfirmSubmitModalOpen,
    navigatorDrawerOpen,
    setNavigatorDrawerOpen,
    isFlipped,
    setIsFlipped,
    nextFlashcard,
    prevFlashcard,
  ]);
}
