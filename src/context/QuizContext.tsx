import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import {
  FormattedQuestion,
  GlobalUserStats,
  QuizMode,
  QuizResultReport,
  QuizSession,
  QuizSettings,
  UserAnswerState,
} from '../types/quiz';
import {
  ALL_QUESTIONS,
  getExamQuestions,
  getQuestionsByCategory,
  getQuestionsByKC,
  getQuestionsByIds,
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

  // Quiz Actions
  startExamSimulation: (count?: number, timeMins?: number) => void;
  startKnowledgeCheck: (kcId: number, instantFeedback?: boolean) => void;
  startCategoryPractice: (category: string, instantFeedback?: boolean) => void;
  startWeakAreas: () => void;
  startFlaggedReview: () => void;
  startCustomQuiz: (settings: Partial<QuizSettings>, title?: string) => void;
  startFlashcards: (questions?: FormattedQuestion[]) => void;
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

const STORAGE_KEY_STATS = 'aws_quiz_stats_v1';
const STORAGE_KEY_THEME = 'aws_quiz_theme_v1';
const STORAGE_KEY_SOUND = 'aws_quiz_sound_v1';

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

    const elapsedSeconds = session.settings.timeLimitMinutes && session.timeRemainingSeconds !== null
      ? session.settings.timeLimitMinutes * 60 - session.timeRemainingSeconds
      : Math.round((Date.now() - session.startTime) / 1000);

    const questionResults = session.questions.map((q) => {
      const ans = session.answers[q.id];
      const selected = ans?.selectedOption || null;
      const isCorrect = selected === q.correctAnswer;
      return {
        question: q,
        userAnswer: selected,
        isCorrect,
        flagged: ans?.flagged || false,
      };
    });

    const totalQuestions = session.questions.length;
    const answeredCount = questionResults.filter((r) => r.userAnswer !== null).length;
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

    const categories = Object.entries(categoryMap).map(([category, data]) => ({
      category,
      total: data.total,
      correct: data.correct,
      percentage: Math.round((data.correct / data.total) * 100),
    })).sort((a, b) => b.total - a.total);

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
      timeElapsedSeconds: elapsedSeconds,
      date: new Date().toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      categories,
      questionResults,
    };

    // Update Global Stats in LocalStorage
    setStats((prev) => {
      const newMissed = new Set(prev.missedQuestionIds);
      const newMastered = new Set(prev.masteredQuestionIds);

      questionResults.forEach((r) => {
        if (r.isCorrect) {
          newMastered.add(r.question.id);
          newMissed.delete(r.question.id);
        } else if (r.userAnswer !== null) {
          newMissed.add(r.question.id);
          newMastered.delete(r.question.id);
        }
      });

      const historyItem = {
        id: session.id,
        date: resultReport.date,
        mode: session.mode,
        title: session.title,
        scorePercentage,
        scaledScore,
        passed,
        totalQuestions,
        timeElapsedSeconds: elapsedSeconds,
      };

      return {
        ...prev,
        totalQuizzesTaken: prev.totalQuizzesTaken + 1,
        totalQuestionsAnswered: prev.totalQuestionsAnswered + answeredCount,
        totalCorrect: prev.totalCorrect + correctCount,
        masteredQuestionIds: Array.from(newMastered),
        missedQuestionIds: Array.from(newMissed),
        recentHistory: [historyItem, ...prev.recentHistory].slice(0, 30),
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

  // Select Option
  const selectOption = useCallback(
    (option: string) => {
      if (!session || session.isFinished) return;

      const currentQ = session.questions[session.currentIndex];
      if (!currentQ) return;

      const isCorrect = option === currentQ.correctAnswer;

      // Audio feedback
      if (session.settings.instantFeedback) {
        if (isCorrect) soundFx.playCorrect();
        else soundFx.playIncorrect();
      } else {
        soundFx.playSelect();
      }

      setSession((prev) => {
        if (!prev) return null;
        const oldAns = prev.answers[currentQ.id];
        return {
          ...prev,
          answers: {
            ...prev.answers,
            [currentQ.id]: {
              ...oldAns,
              selectedOption: option,
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
    (count: number = 65, timeMins: number = 90) => {
      const questions = getExamQuestions(count, true);
      const settings: QuizSettings = {
        mode: 'exam_simulation',
        questionCount: questions.length,
        timeLimitMinutes: timeMins,
        instantFeedback: false,
        shuffleQuestions: true,
        shuffleOptions: true,
      };
      initSession(
        questions,
        'exam_simulation',
        'AWS Certified Cloud Practitioner Simulation',
        `${questions.length} Questions • ${timeMins} Minutes • 700 Passing Score Standard`,
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
        `${questions[0].category} • Knowledge Check Practice`,
        settings
      );
    },
    [initSession]
  );

  const startCategoryPractice = useCallback(
    (category: string, instantFeedback: boolean = true) => {
      const questions = getQuestionsByCategory(category, true);
      if (questions.length === 0) return;
      const settings: QuizSettings = {
        mode: 'category_practice',
        questionCount: questions.length,
        timeLimitMinutes: Math.ceil(questions.length * 1.4), // ~84s per question
        instantFeedback,
        shuffleQuestions: true,
        shuffleOptions: true,
        selectedCategory: category,
      };
      initSession(
        questions,
        'category_practice',
        `${category} Domain Practice`,
        `${questions.length} Focused Questions • Instant Explanations`,
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
      let pool = [...ALL_QUESTIONS];
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
          return ans?.selectedOption !== q.correctAnswer;
        });
      }
      if (questions.length === 0) questions = session.questions;
      initSession(questions, session.mode, session.title, session.subtitle, session.settings);
    },
    [session, initSession]
  );

  // Flashcards launcher
  const startFlashcards = useCallback((questions?: FormattedQuestion[]) => {
    const deck = questions && questions.length > 0 ? questions : shuffleArray([...ALL_QUESTIONS]);
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
