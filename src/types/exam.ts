/**
 * Core types for Smart Exam System
 */

export type Subject = 
  | 'biology'
  | 'math'
  | 'physics'
  | 'chemistry'
  | 'arabic'
  | 'english'
  | 'history'
  | 'computer_science';

export type QuestionType = 
  | 'multiple_choice'
  | 'true_false'
  | 'multi_select'
  | 'fill_blank';

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface MediaAttachment {
  type: 'image' | 'audio' | 'formula';
  url?: string;
  caption?: string;
  formulaText?: string;
  audioPromptText?: string;
}

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  options?: string[]; // for multiple_choice & multi_select
  correctAnswer: string | string[] | boolean;
  explanation: string;
  points: number;
  difficulty: Difficulty;
  topic: string;
  subject?: Subject;
  media?: MediaAttachment;
}

export interface BankQuestion extends Question {
  subject: Subject;
  createdAt: string;
  usageCount: number;
  curriculumTag?: string;
}

export interface Exam {
  id: string;
  title: string;
  description: string;
  subject: Subject;
  gradeLevel: string;
  timeLimitMinutes: number;
  totalPoints: number;
  passingScorePercent: number;
  questions: Question[];
  createdAt: string;
  status: 'published' | 'draft' | 'archived';
  shuffleQuestions: boolean;
  showImmediateFeedback: boolean;
  authorName: string;
  tags: string[];
}

export interface ExamTemplate {
  id: string;
  title: string;
  description: string;
  subject: Subject;
  gradeLevel: string;
  difficulty: Difficulty;
  estimatedDurationMinutes: number;
  curriculumStandard: string;
  questions: Question[];
  downloadsCount: number;
  rating: number;
  tags: string[];
}

export interface StudentAnswer {
  questionId: string;
  answer: string | string[] | boolean | null;
  isCorrect: boolean;
  earnedPoints: number;
  timeSpentSeconds: number;
}

export interface TopicPerformance {
  topic: string;
  correctCount: number;
  totalCount: number;
  earnedPoints: number;
  totalPoints: number;
  percentage: number;
}

export interface ExamSubmission {
  id: string;
  examId: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  startedAt: string;
  submittedAt: string;
  totalTimeSpentSeconds: number;
  answers: StudentAnswer[];
  totalScore: number;
  maxScore: number;
  percentage: number;
  passed: boolean;
  gradeLevelText: string;
  topicBreakdown: TopicPerformance[];
  aiRecommendations: string[];
  teacherFeedback?: string;
}

export type SubscriptionTier = 'free' | 'pro' | 'enterprise';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'teacher' | 'student';
  schoolName: string;
  currentPlan: SubscriptionTier;
  avatarUrl?: string;
  studentIdNumber?: string;
  gradeLevel?: string;
  subjectSpecialty?: string;
  createdAt?: string;
}

export type NotificationType = 
  | 'new_exam'
  | 'deadline_reminder'
  | 'result_ready'
  | 'student_submission'
  | 'low_score_alert'
  | 'system';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  targetRole: 'teacher' | 'student' | 'all';
  timestamp: string;
  read: boolean;
  linkExamId?: string;
  linkSubmissionId?: string;
}

export interface NotificationPreferences {
  newExams: boolean;
  deadlines: boolean;
  results: boolean;
  submissions: boolean;
  emailAlerts: boolean;
}
