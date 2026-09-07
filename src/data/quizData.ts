import rawData from './rawQuizData.json';
import ccp400Data from './ccp400QuizData.json';
import { FormattedQuestion, QuestionBankId, RawCourseData, RawKnowledgeCheck, RawQuestion } from '../types/quiz';

export const COURSE_INFO = {
  courseId: (rawData as RawCourseData).course_id,
  courseName: (rawData as RawCourseData).course_name,
  totalKnowledgeChecks: (rawData as RawCourseData).total_knowledge_checks,
  sortedOrder: (rawData as RawCourseData).sorted_order,
};

/**
 * Robustly matches the correct_answer string from the dataset to the exact option string
 */
export function findMatchingOption(correctAnswer: string, options: string[]): string {
  if (options.includes(correctAnswer)) return correctAnswer;

  // Check startsWith match (e.g. "DHCP (Dynamic Host Configuration Protocol)" -> "DHCP")
  const prefixMatch = options.find(
    (opt) =>
      correctAnswer.startsWith(opt) ||
      opt.startsWith(correctAnswer) ||
      correctAnswer.toLowerCase().includes(opt.toLowerCase()) ||
      opt.toLowerCase().includes(correctAnswer.toLowerCase())
  );

  return prefixMatch || options[0];
}

// Convert re/Start knowledge check questions
export const RESTART_QUESTIONS: FormattedQuestion[] = (
  rawData as RawCourseData
).knowledge_checks.flatMap((kc: RawKnowledgeCheck) => {
  return (kc.questions || []).map((q: RawQuestion) => {
    const matchedCorrect = findMatchingOption(q.correct_answer, q.options);
    const isMulti = /choose two|select two|choose three|select three/i.test(q.question);
    return {
      id: `kc-${kc.id}-q-${q.question_number}`,
      bankId: 'restart_kcs' as const,
      kcIndex: kc.index,
      kcId: kc.id,
      kcTitle: kc.title,
      category: kc.category,
      summary: kc.summary,
      questionNumber: q.question_number,
      question: q.question,
      options: q.options,
      correctAnswer: matchedCorrect,
      correctAnswers: [matchedCorrect],
      isMultiSelect: isMulti,
      requiredSelections: isMulti ? 2 : 1,
      explanation: q.explanation,
    };
  });
});

// CCP 400 Question Bank questions (400 questions)
export const CCP_QUESTIONS: FormattedQuestion[] = (ccp400Data.questions as FormattedQuestion[]).map(
  (q) => ({
    ...q,
    bankId: 'ccp400' as const,
  })
);

// Unified pool of ALL 503 questions
export const ALL_QUESTIONS: FormattedQuestion[] = [...CCP_QUESTIONS, ...RESTART_QUESTIONS];

// Knowledge checks from re/Start course
export const RESTART_KNOWLEDGE_CHECKS = (rawData as RawCourseData).knowledge_checks.map(
  (kc: RawKnowledgeCheck) => ({
    index: kc.index,
    id: kc.id,
    title: kc.title,
    category: kc.category,
    summary: kc.summary,
    bankId: 'restart_kcs' as const,
    questionCount: (kc.questions || []).length,
    questionIds: (kc.questions || []).map((q) => `kc-${kc.id}-q-${q.question_number}`),
  })
);

// Practice sets from CCP 400 bank (16 sets x 25 questions)
export const CCP_PRACTICE_SETS = (ccp400Data.practice_sets || []).map((ps: any) => ({
  index: ps.index,
  id: ps.id,
  title: ps.title,
  category: ps.category,
  summary: ps.summary,
  bankId: 'ccp400' as const,
  questionCount: ps.questionCount,
  questionIds: ps.questionIds,
}));

// All modular assessments combined
export const ALL_KNOWLEDGE_CHECKS = [...CCP_PRACTICE_SETS, ...RESTART_KNOWLEDGE_CHECKS];

export interface QuestionBankMeta {
  id: QuestionBankId;
  name: string;
  shortName: string;
  count: number;
  description: string;
  badge: string;
}

export const QUESTION_BANKS: QuestionBankMeta[] = [
  {
    id: 'all',
    name: 'Unified Master Bank (All Sources)',
    shortName: 'All 503 Questions',
    count: ALL_QUESTIONS.length,
    description: 'Combined repository of CCP 400 official exam bank and AWS re/Start curriculum checks.',
    badge: '503 Questions',
  },
  {
    id: 'ccp400',
    name: 'AWS Certified Cloud Practitioner (CCP 400)',
    shortName: 'CCP 400 Exam Bank',
    count: CCP_QUESTIONS.length,
    description: '400 official exam simulation questions with multi-select and scenario problems.',
    badge: '400 Questions',
  },
  {
    id: 'restart_kcs',
    name: 'AWS re/Start Curriculum Knowledge Checks',
    shortName: 're/Start KCs',
    count: RESTART_QUESTIONS.length,
    description: '96 targeted module knowledge checks covering foundational AWS concepts A–Z.',
    badge: '103 Questions',
  },
];

export interface CategoryMeta {
  name: string;
  count: number;
  kcCount: number;
  icon: string;
  description: string;
}

const CATEGORY_ICONS: Record<string, string> = {
  'Cloud Foundations': 'Cloud',
  'Linux & Scripting': 'Terminal',
  'Networking': 'Network',
  'Databases': 'Database',
  'Security & IAM': 'KeyRound',
  'Security & Monitoring': 'ShieldCheck',
  'Security & Compliance': 'FileCheck',
  'Security & Networking': 'ShieldAlert',
  'Security & Linux': 'Lock',
  'Compute': 'Cpu',
  'Storage': 'HardDrive',
  'DevOps & Automation': 'Workflow',
  'Cloud Architecture': 'Layers',
  'Programming & Python': 'Code2',
  'Billing & Support': 'Receipt',
  'Cost & Optimization': 'Coins',
  'Computing Fundamentals': 'Server',
  'Certification Prep': 'GraduationCap',
};

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  'Cloud Foundations': 'AWS Global Infrastructure, Advantages of Cloud, and Core Models',
  'Linux & Scripting': 'Linux kernel, bash commands, file permissions, users, and daemons',
  'Networking': 'VPC, Subnetting, Route 53, Direct Connect, Gateways, and Protocols',
  'Databases': 'RDS, DynamoDB, Aurora, ElastiCache, SQL syntax, and ACID properties',
  'Security & IAM': 'IAM policies, roles, MFA, Least Privilege, and Key Management',
  'Security & Monitoring': 'CloudTrail, CloudWatch, GuardDuty, AWS Config, and Security Hub',
  'Security & Compliance': 'Shared Responsibility Model, AWS Artifact, and SOC/PCI standards',
  'Security & Networking': 'Network hardening, Session Manager, and security groups',
  'Security & Linux': 'System hardening, SSH security, and CIS baselines',
  'Compute': 'EC2 instance families, purchasing options, Lambda, and Fargate containers',
  'Storage': 'S3 storage tiers, durability, EBS block volumes, and EFS shared files',
  'DevOps & Automation': 'CloudFormation, CI/CD pipelines, State Manager, and Systems Manager',
  'Cloud Architecture': 'Well-Architected Framework, High Availability, and Auto Scaling',
  'Programming & Python': 'Python syntax, control flow, functions, and Boto3 AWS SDK',
  'Billing & Support': 'Cost Explorer, Support Plans, Savings Plans, and Budgets',
  'Cost & Optimization': 'Rightsizing resources, Cost Anomaly Detection, and Trusted Advisor',
  'Computing Fundamentals': 'CPU, RAM, virtualization hypervisors, and server hardware',
  'Certification Prep': 'Scenario analysis, RTO/RPO trade-offs, and exam elimination strategies',
};

// Aggregate unique categories with statistics
export const ALL_CATEGORIES: CategoryMeta[] = Object.entries(
  ALL_QUESTIONS.reduce((acc, q) => {
    acc[q.category] = (acc[q.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>)
)
  .map(([name, count]) => {
    const kcCount = ALL_KNOWLEDGE_CHECKS.filter((kc) => kc.category === name).length;
    return {
      name,
      count,
      kcCount,
      icon: CATEGORY_ICONS[name] || 'Layers',
      description: CATEGORY_DESCRIPTIONS[name] || `${count} questions covering ${name}`,
    };
  })
  .sort((a, b) => b.count - a.count);

/**
 * Fisher-Yates shuffle helper
 */
export function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Get questions by bank
 */
export function getQuestionsByBank(bankId: QuestionBankId = 'all'): FormattedQuestion[] {
  if (bankId === 'ccp400') return CCP_QUESTIONS;
  if (bankId === 'restart_kcs') return RESTART_QUESTIONS;
  return ALL_QUESTIONS;
}

/**
 * Gets a balanced sample of questions for the standard 65-question Exam Simulation
 * or custom count.
 */
export function getExamQuestions(
  count: number = 65,
  shuffle: boolean = true,
  bankId: QuestionBankId = 'all'
): FormattedQuestion[] {
  let pool = [...getQuestionsByBank(bankId)];
  if (shuffle) {
    pool = shuffleArray(pool);
  }
  const selected = pool.slice(0, Math.min(count, pool.length));
  return selected;
}

/**
 * Get questions filtered by Category
 */
export function getQuestionsByCategory(
  category: string,
  shuffle: boolean = false,
  bankId: QuestionBankId = 'all'
): FormattedQuestion[] {
  const bankPool = getQuestionsByBank(bankId);
  const filtered = bankPool.filter((q) => q.category === category);
  return shuffle ? shuffleArray(filtered) : filtered;
}

/**
 * Get questions for a specific Knowledge Check or Practice Set ID
 */
export function getQuestionsByKC(kcId: number): FormattedQuestion[] {
  return ALL_QUESTIONS.filter((q) => q.kcId === kcId);
}

/**
 * Get questions by array of IDs
 */
export function getQuestionsByIds(ids: string[]): FormattedQuestion[] {
  const idSet = new Set(ids);
  return ALL_QUESTIONS.filter((q) => idSet.has(q.id));
}

/**
 * Full-text search across all questions and KCs
 */
export function searchQuestions(
  query: string,
  categoryFilter?: string,
  bankId: QuestionBankId = 'all'
): FormattedQuestion[] {
  const clean = query.trim().toLowerCase();
  const bankPool = getQuestionsByBank(bankId);

  return bankPool.filter((q) => {
    if (categoryFilter && categoryFilter !== 'ALL' && q.category !== categoryFilter) {
      return false;
    }
    if (!clean) return true;
    return (
      q.question.toLowerCase().includes(clean) ||
      q.kcTitle.toLowerCase().includes(clean) ||
      q.category.toLowerCase().includes(clean) ||
      q.explanation.toLowerCase().includes(clean) ||
      q.options.some((opt) => opt.toLowerCase().includes(clean))
    );
  });
}
