import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import {
  FormattedQuestion,
  GlobalUserStats,
  QuestionBankId,
  QuizMode,
  QuizResultReport,
  QuizSession,
  QuizSettings,
  UserAnswerState,
} from '../types/quiz';
import {
  getExamQuestions,
  getQuestionsByCategory,
  getQuestionsByKC,
  getQuestionsByIds,
  getQuestionsByBank,
  shuffleArray,
} from '../data/quizData';
import { soundFx } from '../utils/soundEffects';

interface QuizContextType {
  // Navigation & View
  currentView: 'home' | 'quiz' | 'flashcards' | 'results' | 'explorer';
  setCurrentView: (view: 'home' | 'quiz' | 'flashcards' | 'results' | 'explorer') => void;

  // Active Quiz State
  session: QuizSession | null;
  currentQuestion: FormattedQuestion | null;
  currentAnswer: UserAnswerState | null;
  lastResult: QuizResultReport | null;

  // Selected Bank Preference
  activeBank: QuestionBankId;
  setActiveBank: (bank: QuestionBankId) => void;

  // Quiz Actions
  startExamSimulation: (count?: number, timeMins?: number, bankId?: QuestionBankId) => void;
  startKnowledgeCheck: (kcId: number, instantFeedback?: boolean) => void;
  startCategoryPractice: (category: string, instantFeedback?: boolean, bankId?: QuestionBankId) => void;
  startWeakAreas: () => void;
  startFlaggedReview: () => void;
  startCustomQuiz: (settings: Partial<QuizSettings>, title?: string) => void;
  startFlashcards: (questions?: FormattedQuestion[], bankId?: QuestionBankId) => void;
  retakeCurrentQuiz: (onlyIncorrect?: boolean) => void;

  // Question Actions
  selectOption: (option: string) => void;
  toggleFlag: (questionId?: string) => void;
  goToQuestion: (index: number) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  finishQuiz: () => void;
  cancelQuiz: () => void;

  // Flashcards
  flashcardDeck: FormattedQuestion[];
  flashcardIndex: number;
  isFlipped: boolean;
  setIsFlipped: (flipped: boolean) => void;
  nextFlashcard: () => void;
  prevFlashcard: () => void;
  markFlashcardMastered: (id: string, mastered: boolean) => void;

  // Modals & UI
  shortcutsModalOpen: boolean;
  setShortcutsModalOpen: (open: boolean) => void;
  confirmSubmitModalOpen: boolean;
  setConfirmSubmitModalOpen: (open: boolean) => void;
  navigatorDrawerOpen: boolean;
  setNavigatorDrawerOpen: (open: boolean) => void;
  supportModalOpen: boolean;
  setSupportModalOpen: (open: boolean) => void;

  // Theme & Preferences
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  soundEnabled: boolean;
  toggleSound: () => void;

  // Global Statistics
  stats: GlobalUserStats;
  clearStats: () => void;
}

const STORAGE_KEY_STATS = 'aws_quiz_stats_v2';
const STORAGE_KEY_THEME = 'aws_quiz_theme_v1';
const STORAGE_KEY_SOUND = 'aws_quiz_sound_v1';
const STORAGE_KEY_BANK = 'aws_quiz_bank_v1';

const DEFAULT_STATS: GlobalUserStats = {
  totalQuizzesTaken: 0,
  totalQuestionsAnswered: 0,
  totalCorrect: 0,
  masteredQuestionIds: [],
  missedQuestionIds: [],
  flaggedQuestionIds: [],
  recentHistory: [],
};

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export const QuizProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // View State
  const [currentView, setCurrentView] = useState<'home' | 'quiz' | 'flashcards' | 'results' | 'explorer'>('home');

  // Bank Filter
  const [activeBank, setActiveBank] = useState<QuestionBankId>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY_BANK);
      if (saved === 'all' || saved === 'ccp400' || saved === 'restart_kcs') return saved;
    }
    return 'all';
  });

  // Quiz Session State
  const [session, setSession] = useState<QuizSession | null>(null);
  const [lastResult, setLastResult] = useState<QuizResultReport | null>(null);

  // Flashcards State
  const [flashcardDeck, setFlashcardDeck] = useState<FormattedQuestion[]>([]);
  const [flashcardIndex, setFlashcardIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  // UI Modals
  const [shortcutsModalOpen, setShortcutsModalOpen] = useState(false);
  const [confirmSubmitModalOpen, setConfirmSubmitModalOpen] = useState(false);
  const [navigatorDrawerOpen, setNavigatorDrawerOpen] = useState(false);
  const [supportModalOpen, setSupportModalOpen] = useState(false);

  // Theme & Sound
  const [theme, setTheme] = useState<'dark' | 'light'>('light');

  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY_SOUND);
      return saved !== null ? saved === 'true' : false;
    }
    return false;
  });

  // User Stats from LocalStorage
  const [stats, setStats] = useState<GlobalUserStats>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY_STATS);
        if (saved) return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved stats:', e);
      }
    }
    return DEFAULT_STATS;
  });

  // Keep bank preference in sync
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_BANK, activeBank);
  }, [activeBank]);

  // Keep soundFx preference in sync
  useEffect(() => {
    soundFx.setEnabled(soundEnabled);
    localStorage.setItem(STORAGE_KEY_SOUND, String(soundEnabled));
  }, [soundEnabled]);

  // Keep theme class on <html> in sync
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.add('light');
      root.classList.remove('dark');
    } else {
      root.classList.add('dark');
      root.classList.remove('light');
    }
    localStorage.setItem(STORAGE_KEY_THEME, theme);
  }, [theme]);

  // Save stats to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_STATS, JSON.stringify(stats));
    } catch (e) {
      console.error('Failed to save stats:', e);
    }
  }, [stats]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const toggleSound = useCallback(() => {
    setSoundEnabled((prev) => !prev);
  }, []);

  const clearStats = useCallback(() => {
    setStats(DEFAULT_STATS);
    localStorage.removeItem(STORAGE_KEY_STATS);
  }, []);

  // Timer Ref & countdown logic
  const timerIntervalRef = useRef<number | null>(null);

  // Initialize a new session helper
  const initSession = useCallback(
    (
      questions: FormattedQuestion[],
      mode: QuizMode,
      title: string,
      subtitle: string,
      settings: QuizSettings
    ) => {
      const initialAnswers: Record<string, UserAnswerState> = {};
      questions.forEach((q) => {
        initialAnswers[q.id] = {
          questionId: q.id,
          selectedOption: null,
          selectedOptions: [],
          isCorrect: null,
          flagged: stats.flaggedQuestionIds.includes(q.id),
          timeSpentSeconds: 0,
        };
      });

      const totalSeconds = settings.timeLimitMinutes ? settings.timeLimitMinutes * 60 : null;

      const newSession: QuizSession = {
        id: `session_${Date.now()}`,
        mode,
        title,
        subtitle,
        questions,
        currentIndex: 0,
        answers: initialAnswers,
        startTime: Date.now(),
        endTime: null,
        timeRemainingSeconds: totalSeconds,
        isFinished: false,
        isPaused: false,
        settings,
      };

      setSession(newSession);
      setCurrentView('quiz');
      setNavigatorDrawerOpen(false);
      setConfirmSubmitModalOpen(false);
    },
    [stats.flaggedQuestionIds]
  );

  // Finish quiz helper and generate comprehensive result
  const finishQuiz = useCallback(() => {
    if (!session || session.isFinished) return;

    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }

    const elapsedSeconds =
      session.settings.timeLimitMinutes && session.timeRemainingSeconds !== null
        ? session.settings.timeLimitMinutes * 60 - session.timeRemainingSeconds
        : Math.round((Date.now() - session.startTime) / 1000);

    const questionResults = session.questions.map((q) => {
      const ans = session.answers[q.id];
      const selected = ans?.selectedOption || null;
      const selectedOpts = ans?.selectedOptions || (selected ? [selected] : []);

      let isCorrect = false;
      if (q.isMultiSelect && q.correctAnswers && q.correctAnswers.length > 0) {
        const req = q.correctAnswers;
        isCorrect =
          selectedOpts.length === req.length &&
          selectedOpts.every((opt) => req.includes(opt));
      } else {
        isCorrect =
          selected === q.correctAnswer ||
          (q.correctAnswers ? q.correctAnswers.includes(selected || '') : false);
      }

      return {
        question: q,
        userAnswer: selected,
        userAnswers: selectedOpts,
        isCorrect,
        flagged: ans?.flagged || false,
      };
    });

    const totalQuestions = session.questions.length;
    const answeredCount = questionResults.filter(
      (r) => r.userAnswer !== null || (r.userAnswers && r.userAnswers.length > 0)
    ).length;
    const correctCount = questionResults.filter((r) => r.isCorrect).length;
    const incorrectCount = answeredCount - correctCount;
    const unansweredCount = totalQuestions - answeredCount;
    const scorePercentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

    // AWS Scaled score formula (100 - 1000, 700 passing)
    const scaledScore = Math.round(100 + (scorePercentage / 100) * 900);
    const passed = scaledScore >= 700; // Standard 700/1000 (70%)

    // Play victory or review sound
    if (passed) {
      soundFx.playPass();
    } else {
      soundFx.playIncorrect();
    }

    // Category breakdown
    const categoryMap: Record<string, { total: number; correct: number }> = {};
    questionResults.forEach((res) => {
      const cat = res.question.category;
      if (!categoryMap[cat]) {
        categoryMap[cat] = { total: 0, correct: 0 };
      }
      categoryMap[cat].total += 1;
      if (res.isCorrect) categoryMap[cat].correct += 1;
    });

    const categories = Object.entries(categoryMap)
      .map(([category, data]) => ({
        category,
        total: data.total,
        correct: data.correct,
        percentage: Math.round((data.correct / data.total) * 100),
      }))
      .sort((a, b) => b.total - a.total);

    const resultReport: QuizResultReport = {
      sessionId: session.id,
      mode: session.mode,
      title: session.title,
      totalQuestions,
      answeredCount,
      correctCount,
      incorrectCount,
      unansweredCount,
      scorePercentage,
      scaledScore,
      passed,
      timeElapsedSeconds: Math.max(1, elapsedSeconds),
      date: new Date().toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      categories,
      questionResults,
    };

    // Update global user stats
    setStats((prev) => {
      const masteredSet = new Set(prev.masteredQuestionIds);
      const missedSet = new Set(prev.missedQuestionIds);

      questionResults.forEach((r) => {
        if (r.isCorrect) {
          masteredSet.add(r.question.id);
          missedSet.delete(r.question.id);
        } else if (r.userAnswer !== null || (r.userAnswers && r.userAnswers.length > 0)) {
          missedSet.add(r.question.id);
        }
      });

      const historyEntry = {
        id: session.id,
        date: new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        mode: session.mode,
        title: session.title,
        scorePercentage,
        scaledScore,
        passed,
        totalQuestions,
        timeElapsedSeconds: Math.max(1, elapsedSeconds),
      };

      return {
        totalQuizzesTaken: prev.totalQuizzesTaken + 1,
        totalQuestionsAnswered: prev.totalQuestionsAnswered + answeredCount,
        totalCorrect: prev.totalCorrect + correctCount,
        masteredQuestionIds: Array.from(masteredSet),
        missedQuestionIds: Array.from(missedSet),
        flaggedQuestionIds: prev.flaggedQuestionIds,
        recentHistory: [historyEntry, ...prev.recentHistory.slice(0, 19)],
      };
    });

    setLastResult(resultReport);
    setSession((prev) => (prev ? { ...prev, isFinished: true } : null));
    setCurrentView('results');
    setConfirmSubmitModalOpen(false);
  }, [session]);

  // Timer Tick effect
  useEffect(() => {
    if (!session || session.isFinished || session.isPaused) {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      return;
    }

    if (session.timeRemainingSeconds !== null) {
      timerIntervalRef.current = window.setInterval(() => {
        setSession((prev) => {
          if (!prev || prev.isFinished || prev.timeRemainingSeconds === null) return prev;
          if (prev.timeRemainingSeconds <= 1) {
            // Auto submit when time runs out
            setTimeout(() => finishQuiz(), 0);
            return { ...prev, timeRemainingSeconds: 0 };
          }
          return { ...prev, timeRemainingSeconds: prev.timeRemainingSeconds - 1 };
        });
      }, 1000);

      return () => {
        if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      };
    }
  }, [session?.isFinished, session?.isPaused, session?.timeRemainingSeconds, finishQuiz]);

  // Select Option (Handles single select and multi-select)
  const selectOption = useCallback(
    (option: string) => {
      if (!session || session.isFinished) return;

      const currentQ = session.questions[session.currentIndex];
      if (!currentQ) return;

      setSession((prev) => {
        if (!prev) return null;
        const oldAns = prev.answers[currentQ.id];
        const isMulti = !!currentQ.isMultiSelect;
        const reqCount = currentQ.requiredSelections || (currentQ.correctAnswers ? currentQ.correctAnswers.length : 1);

        let newSelectedOptions: string[] = [];
        let newSelectedOption: string | null = null;
        let isCorrect: boolean | null = null;

        if (isMulti) {
          const currentList = oldAns?.selectedOptions || (oldAns?.selectedOption ? [oldAns.selectedOption] : []);
          if (currentList.includes(option)) {
            newSelectedOptions = currentList.filter((o) => o !== option);
          } else {
            if (currentList.length < reqCount) {
              newSelectedOptions = [...currentList, option];
            } else {
              // Replace last or shift
              newSelectedOptions = [...currentList.slice(1), option];
            }
          }
          newSelectedOption = newSelectedOptions.length > 0 ? newSelectedOptions.join(', ') : null;

          if (currentQ.correctAnswers && newSelectedOptions.length === reqCount) {
            isCorrect =
              newSelectedOptions.length === currentQ.correctAnswers.length &&
              newSelectedOptions.every((o) => currentQ.correctAnswers!.includes(o));
          }
        } else {
          newSelectedOptions = [option];
          newSelectedOption = option;
          isCorrect =
            option === currentQ.correctAnswer ||
            (currentQ.correctAnswers ? currentQ.correctAnswers.includes(option) : false);
        }

        // Sound feedback
        if (session.settings.instantFeedback) {
          if (isCorrect === true) soundFx.playCorrect();
          else if (isCorrect === false && (!isMulti || newSelectedOptions.length === reqCount))
            soundFx.playIncorrect();
          else soundFx.playSelect();
        } else {
          soundFx.playSelect();
        }

        return {
          ...prev,
          answers: {
            ...prev.answers,
            [currentQ.id]: {
              ...oldAns,
              selectedOption: newSelectedOption,
              selectedOptions: newSelectedOptions,
              isCorrect,
            },
          },
        };
      });
    },
    [session]
  );

  // Toggle Flag
  const toggleFlag = useCallback(
    (questionId?: string) => {
      if (!session) return;
      const targetId = questionId || session.questions[session.currentIndex]?.id;
      if (!targetId) return;

      setSession((prev) => {
        if (!prev) return null;
        const currentAns = prev.answers[targetId];
        const newFlagged = !currentAns?.flagged;
        return {
          ...prev,
          answers: {
            ...prev.answers,
            [targetId]: {
              ...currentAns,
              flagged: newFlagged,
            },
          },
        };
      });

      setStats((prev) => {
        const set = new Set(prev.flaggedQuestionIds);
        if (set.has(targetId)) set.delete(targetId);
        else set.add(targetId);
        return { ...prev, flaggedQuestionIds: Array.from(set) };
      });
    },
    [session]
  );

  // Question navigation
  const goToQuestion = useCallback(
    (index: number) => {
      if (!session) return;
      if (index >= 0 && index < session.questions.length) {
        setSession((prev) => (prev ? { ...prev, currentIndex: index } : null));
        setNavigatorDrawerOpen(false);
      }
    },
    [session]
  );

  const nextQuestion = useCallback(() => {
    if (!session) return;
    if (session.currentIndex < session.questions.length - 1) {
      goToQuestion(session.currentIndex + 1);
    } else {
      // Prompt confirm submission
      setConfirmSubmitModalOpen(true);
    }
  }, [session, goToQuestion]);

  const prevQuestion = useCallback(() => {
    if (!session) return;
    if (session.currentIndex > 0) {
      goToQuestion(session.currentIndex - 1);
    }
  }, [session, goToQuestion]);

  const cancelQuiz = useCallback(() => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    setSession(null);
    setCurrentView('home');
  }, []);

  // Mode Launchers
  const startExamSimulation = useCallback(
    (count: number = 65, timeMins: number = 90, bankId: QuestionBankId = 'all') => {
      const questions = getExamQuestions(count, true, bankId);
      const bankLabel =
        bankId === 'ccp400'
          ? 'CCP 400 Question Bank'
          : bankId === 'restart_kcs'
          ? 're/Start Curriculum'
          : 'Unified Exam Pool (503 Questions)';

      const settings: QuizSettings = {
        mode: 'exam_simulation',
        questionCount: questions.length,
        timeLimitMinutes: timeMins,
        instantFeedback: false,
        shuffleQuestions: true,
        shuffleOptions: true,
        selectedBank: bankId,
      };

      initSession(
        questions,
        'exam_simulation',
        'AWS Certified Cloud Practitioner Simulation',
        `${questions.length} Questions • ${timeMins} Minutes • ${bankLabel}`,
        settings
      );
    },
    [initSession]
  );

  const startKnowledgeCheck = useCallback(
    (kcId: number, instantFeedback: boolean = true) => {
      const questions = getQuestionsByKC(kcId);
      if (questions.length === 0) return;
      const title = questions[0].kcTitle;
      const settings: QuizSettings = {
        mode: 'knowledge_check',
        questionCount: questions.length,
        timeLimitMinutes: null,
        instantFeedback,
        shuffleQuestions: false,
        shuffleOptions: false,
        selectedKcId: kcId,
      };
      initSession(
        questions,
        'knowledge_check',
        title,
        `${questions[0].category} • Assessment Practice (${questions.length} Questions)`,
        settings
      );
    },
    [initSession]
  );

  const startCategoryPractice = useCallback(
    (category: string, instantFeedback: boolean = true, bankId: QuestionBankId = 'all') => {
      const questions = getQuestionsByCategory(category, true, bankId);
      if (questions.length === 0) return;
      const settings: QuizSettings = {
        mode: 'category_practice',
        questionCount: questions.length,
        timeLimitMinutes: Math.ceil(questions.length * 1.4), // ~84s per question
        instantFeedback,
        shuffleQuestions: true,
        shuffleOptions: true,
        selectedCategory: category,
        selectedBank: bankId,
      };
      initSession(
        questions,
        'category_practice',
        `${category} Domain Practice`,
        `${questions.length} Questions • Instant Feedback & Explanations`,
        settings
      );
    },
    [initSession]
  );

  const startWeakAreas = useCallback(() => {
    if (stats.missedQuestionIds.length === 0) return;
    const questions = getQuestionsByIds(stats.missedQuestionIds);
    const settings: QuizSettings = {
      mode: 'weak_areas',
      questionCount: questions.length,
      timeLimitMinutes: null,
      instantFeedback: true,
      shuffleQuestions: true,
      shuffleOptions: false,
    };
    initSession(
      questions,
      'weak_areas',
      'Weak Areas & Missed Questions Drill',
      `${questions.length} Questions needing reinforcement`,
      settings
    );
  }, [stats.missedQuestionIds, initSession]);

  const startFlaggedReview = useCallback(() => {
    if (stats.flaggedQuestionIds.length === 0) return;
    const questions = getQuestionsByIds(stats.flaggedQuestionIds);
    const settings: QuizSettings = {
      mode: 'flagged_review',
      questionCount: questions.length,
      timeLimitMinutes: null,
      instantFeedback: true,
      shuffleQuestions: false,
      shuffleOptions: false,
    };
    initSession(
      questions,
      'flagged_review',
      'Bookmarked & Flagged Questions',
      `${questions.length} Questions flagged for review`,
      settings
    );
  }, [stats.flaggedQuestionIds, initSession]);

  const startCustomQuiz = useCallback(
    (customSettings: Partial<QuizSettings>, title: string = 'Custom Practice Quiz') => {
      const bankId = customSettings.selectedBank || 'all';
      let pool = [...getQuestionsByBank(bankId)];

      if (customSettings.selectedCategory && customSettings.selectedCategory !== 'ALL') {
        pool = pool.filter((q) => q.category === customSettings.selectedCategory);
      }
      if (customSettings.shuffleQuestions !== false) {
        pool = shuffleArray(pool);
      }
      const count = customSettings.questionCount || pool.length;
      const questions = pool.slice(0, Math.min(count, pool.length));

      const settings: QuizSettings = {
        mode: customSettings.mode || 'custom_practice',
        questionCount: questions.length,
        timeLimitMinutes: customSettings.timeLimitMinutes ?? null,
        instantFeedback: customSettings.instantFeedback ?? true,
        shuffleQuestions: customSettings.shuffleQuestions ?? true,
        shuffleOptions: customSettings.shuffleOptions ?? true,
        selectedCategory: customSettings.selectedCategory,
        selectedBank: bankId,
      };

      initSession(questions, settings.mode, title, `${questions.length} Questions`, settings);
    },
    [initSession]
  );

  const retakeCurrentQuiz = useCallback(
    (onlyIncorrect: boolean = false) => {
      if (!session) return;
      let questions = session.questions;
      if (onlyIncorrect) {
        questions = session.questions.filter((q) => {
          const ans = session.answers[q.id];
          return ans?.isCorrect !== true;
        });
      }
      if (questions.length === 0) questions = session.questions;
      initSession(questions, session.mode, session.title, session.subtitle, session.settings);
    },
    [session, initSession]
  );

  // Flashcards launcher
  const startFlashcards = useCallback((questions?: FormattedQuestion[], bankId?: QuestionBankId) => {
    let pool = questions && questions.length > 0 ? questions : getQuestionsByBank(bankId || 'all');
    const deck = shuffleArray([...pool]);
    setFlashcardDeck(deck);
    setFlashcardIndex(0);
    setIsFlipped(false);
    setCurrentView('flashcards');
  }, []);

  const nextFlashcard = useCallback(() => {
    soundFx.playFlip();
    setIsFlipped(false);
    setFlashcardIndex((prev) => (prev < flashcardDeck.length - 1 ? prev + 1 : 0));
  }, [flashcardDeck.length]);

  const prevFlashcard = useCallback(() => {
    soundFx.playFlip();
    setIsFlipped(false);
    setFlashcardIndex((prev) => (prev > 0 ? prev - 1 : flashcardDeck.length - 1));
  }, [flashcardDeck.length]);

  const markFlashcardMastered = useCallback((id: string, mastered: boolean) => {
    setStats((prev) => {
      const set = new Set(prev.masteredQuestionIds);
      if (mastered) set.add(id);
      else set.delete(id);
      return { ...prev, masteredQuestionIds: Array.from(set) };
    });
  }, []);

  // Computed state
  const currentQuestion = session ? session.questions[session.currentIndex] : null;
  const currentAnswer = session && currentQuestion ? session.answers[currentQuestion.id] : null;

  return (
    <QuizContext.Provider
      value={{
        currentView,
        setCurrentView,
        session,
        currentQuestion,
        currentAnswer,
        lastResult,
        activeBank,
        setActiveBank,
        startExamSimulation,
        startKnowledgeCheck,
        startCategoryPractice,
        startWeakAreas,
        startFlaggedReview,
        startCustomQuiz,
        startFlashcards,
        retakeCurrentQuiz,
        selectOption,
        toggleFlag,
        goToQuestion,
        nextQuestion,
        prevQuestion,
        finishQuiz,
        cancelQuiz,
        flashcardDeck,
        flashcardIndex,
        isFlipped,
        setIsFlipped,
        nextFlashcard,
        prevFlashcard,
        markFlashcardMastered,
        shortcutsModalOpen,
        setShortcutsModalOpen,
        confirmSubmitModalOpen,
        setConfirmSubmitModalOpen,
        navigatorDrawerOpen,
        setNavigatorDrawerOpen,
        supportModalOpen,
        setSupportModalOpen,
        theme,
        toggleTheme,
        soundEnabled,
        toggleSound,
        stats,
        clearStats,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
};

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
};
