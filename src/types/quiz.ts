export type QuestionBankId = 'all' | 'ccp400' | 'restart_kcs';

export interface RawQuestion {
  question_number: number;
  question: string;
  options: string[];
  correct_answer: string;
  explanation: string;
}

export interface RawKnowledgeCheck {
  index: number;
  id: number;
  title: string;
  category: string;
  summary: string;
  questions: RawQuestion[];
}

export interface RawCourseData {
  course_id: number;
  course_name: string;
  total_knowledge_checks: number;
  sorted_order: string;
  knowledge_checks: RawKnowledgeCheck[];
}

export interface FormattedQuestion {
  id: string; // e.g. "kc-1-q-1" or "ccp-q-1"
  bankId?: 'ccp400' | 'restart_kcs';
  kcIndex: number;
  kcId: number;
  kcTitle: string;
  category: string;
  summary: string;
  questionNumber: number;
  question: string;
  options: string[];
  correctAnswer: string;
  correctAnswers?: string[];
  isMultiSelect?: boolean;
  requiredSelections?: number;
  explanation: string;
}

export type QuizMode =
  | 'exam_simulation'   // 65 questions, 90 mins, standard CLF-C02 simulation
  | 'knowledge_check'   // single or selected KC
  | 'category_practice' // questions from a specific category
  | 'custom_practice'   // custom question count and timer
  | 'weak_areas'        // missed questions
  | 'flagged_review'    // flagged questions
  | 'flashcards'        // interactive flip cards
  | 'explorer';         // full catalog search

export interface QuizSettings {
  mode: QuizMode;
  questionCount: number;
  timeLimitMinutes: number | null; // null = untimed
  instantFeedback: boolean; // show explanation right after selection
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  selectedCategory?: string;
  selectedKcId?: number;
  selectedBank?: QuestionBankId;
}

export interface UserAnswerState {
  questionId: string;
  selectedOption: string | null;
  selectedOptions?: string[]; // for multi-select
  isCorrect: boolean | null;
  flagged: boolean;
  timeSpentSeconds: number;
}

export interface QuizSession {
  id: string;
  mode: QuizMode;
  title: string;
  subtitle: string;
  questions: FormattedQuestion[];
  currentIndex: number;
  answers: Record<string, UserAnswerState>;
  startTime: number;
  endTime: number | null;
  timeRemainingSeconds: number | null;
  isFinished: boolean;
  isPaused: boolean;
  settings: QuizSettings;
}

export interface CategoryPerformance {
  category: string;
  total: number;
  correct: number;
  percentage: number;
}

export interface QuizResultReport {
  sessionId: string;
  mode: QuizMode;
  title: string;
  totalQuestions: number;
  answeredCount: number;
  correctCount: number;
  incorrectCount: number;
  unansweredCount: number;
  scorePercentage: number;
  scaledScore: number; // 100 - 1000 scale like AWS standard
  passed: boolean; // >= 700 (70%)
  timeElapsedSeconds: number;
  date: string;
  categories: CategoryPerformance[];
  questionResults: {
    question: FormattedQuestion;
    userAnswer: string | null;
    userAnswers?: string[];
    isCorrect: boolean;
    flagged: boolean;
  }[];
}

export interface SavedQuizHistory {
  id: string;
  date: string;
  mode: QuizMode;
  title: string;
  scorePercentage: number;
  scaledScore: number;
  passed: boolean;
  totalQuestions: number;
  timeElapsedSeconds: number;
}

export interface GlobalUserStats {
  totalQuizzesTaken: number;
  totalQuestionsAnswered: number;
  totalCorrect: number;
  masteredQuestionIds: string[];
  missedQuestionIds: string[];
  flaggedQuestionIds: string[];
  recentHistory: SavedQuizHistory[];
}
