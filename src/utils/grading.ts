import { Exam, ExamSubmission, Question, StudentAnswer, TopicPerformance } from '../types/exam';

/**
 * Normalizes Arabic text for lenient keyword matching in fill-in-the-blank questions
 */
export function normalizeArabic(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/[أإآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/[\u064B-\u065F]/g, ''); // strip Arabic diacritics (tashkeel)
}

/**
 * Auto-grades a single question response
 */
export function evaluateAnswer(
  question: Question,
  studentAnswer: string | string[] | boolean | null
): { isCorrect: boolean; earnedPoints: number } {
  if (studentAnswer === null || studentAnswer === undefined) {
    return { isCorrect: false, earnedPoints: 0 };
  }

  if (question.type === 'true_false') {
    const isCorrect = studentAnswer === question.correctAnswer;
    return { isCorrect, earnedPoints: isCorrect ? question.points : 0 };
  }

  if (question.type === 'multiple_choice') {
    const isCorrect = studentAnswer === question.correctAnswer;
    return { isCorrect, earnedPoints: isCorrect ? question.points : 0 };
  }

  if (question.type === 'multi_select') {
    const correctArr = Array.isArray(question.correctAnswer) ? question.correctAnswer : [question.correctAnswer];
    const studentArr = Array.isArray(studentAnswer) ? studentAnswer : [studentAnswer];

    // Check exact set equality or partial credit
    const correctSelected = studentArr.filter(item => correctArr.includes(item as string)).length;
    const incorrectSelected = studentArr.filter(item => !correctArr.includes(item as string)).length;
    
    const isCompletelyCorrect = correctSelected === correctArr.length && incorrectSelected === 0;
    
    // Partial score calculation with no negative points
    let earnedPoints = 0;
    if (isCompletelyCorrect) {
      earnedPoints = question.points;
    } else if (correctSelected > 0 && incorrectSelected === 0) {
      earnedPoints = Math.round((correctSelected / correctArr.length) * question.points);
    }

    return { isCorrect: isCompletelyCorrect, earnedPoints };
  }

  if (question.type === 'fill_blank') {
    const studentNorm = normalizeArabic(String(studentAnswer));
    const correctNorm = normalizeArabic(String(question.correctAnswer));

    // Support multiple accepted variants separated by '/' or ';'
    const acceptableVariants = String(question.correctAnswer)
      .split(/[/;,]/)
      .map(v => normalizeArabic(v));

    const isCorrect = acceptableVariants.some(v => v === studentNorm || studentNorm.includes(v) || v.includes(studentNorm));
    return { isCorrect, earnedPoints: isCorrect ? question.points : 0 };
  }

  return { isCorrect: false, earnedPoints: 0 };
}

/**
 * Grades an entire exam submission automatically and calculates comprehensive performance metrics
 */
export function gradeSubmission(
  exam: Exam,
  studentAnswersMap: Record<string, { answer: string | string[] | boolean | null; timeSpentSeconds: number }>,
  studentInfo: { id: string; name: string; email: string }
): ExamSubmission {
  const answers: StudentAnswer[] = [];
  let totalScore = 0;
  let totalTimeSpent = 0;

  const topicMap: Record<string, { correct: number; total: number; earned: number; max: number }> = {};

  exam.questions.forEach(q => {
    const response = studentAnswersMap[q.id] || { answer: null, timeSpentSeconds: 0 };
    const { isCorrect, earnedPoints } = evaluateAnswer(q, response.answer);

    answers.push({
      questionId: q.id,
      answer: response.answer,
      isCorrect,
      earnedPoints,
      timeSpentSeconds: response.timeSpentSeconds
    });

    totalScore += earnedPoints;
    totalTimeSpent += response.timeSpentSeconds;

    // Track topic performance
    if (!topicMap[q.topic]) {
      topicMap[q.topic] = { correct: 0, total: 0, earned: 0, max: 0 };
    }
    topicMap[q.topic].total += 1;
    topicMap[q.topic].max += q.points;
    topicMap[q.topic].earned += earnedPoints;
    if (isCorrect) {
      topicMap[q.topic].correct += 1;
    }
  });

  const maxScore = exam.totalPoints;
  const percentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
  const passed = percentage >= exam.passingScorePercent;

  let gradeLevelText = 'راسب (F)';
  if (percentage >= 95) gradeLevelText = 'ممتاز مرتفع (A+)';
  else if (percentage >= 85) gradeLevelText = 'ممتاز (A)';
  else if (percentage >= 75) gradeLevelText = 'جيد جداً (B)';
  else if (percentage >= 65) gradeLevelText = 'جيد (C)';
  else if (percentage >= 50) gradeLevelText = 'مقبول (D)';

  const topicBreakdown: TopicPerformance[] = Object.entries(topicMap).map(([topic, data]) => ({
    topic,
    correctCount: data.correct,
    totalCount: data.total,
    earnedPoints: data.earned,
    totalPoints: data.max,
    percentage: data.max > 0 ? Math.round((data.earned / data.max) * 100) : 0
  }));

  // Generate automated pedagogic AI recommendations based on performance
  const aiRecommendations: string[] = [];
  const weakTopics = topicBreakdown.filter(t => t.percentage < 60);
  const strongTopics = topicBreakdown.filter(t => t.percentage >= 80);

  if (percentage >= 90) {
    aiRecommendations.push('أداء فائق واستيعاب متكامل لكافة المفاهيم الأساسية والتطبيقية في هذا الاختبار.');
    aiRecommendations.push('يوصى بالانتقال للمشروعات المتقدمة وحل مسائل المسابقات الوطنية والتحديات الإثرائية.');
  } else if (weakTopics.length > 0) {
    weakTopics.forEach(wt => {
      aiRecommendations.push(`بحاجة لمراجعة موضوع "${wt.topic}" حيث بلغت نسبة الإتقان (${wt.percentage}%). راجع الشروحات التوضيحية المرفقة لكل سؤال.`);
    });
  }

  if (strongTopics.length > 0 && percentage < 90) {
    aiRecommendations.push(`نقطة قوة ممتازة في موضوع "${strongTopics[0].topic}" بنسبة إتقان (${strongTopics[0].percentage}%).`);
  }

  return {
    id: `sub-${Date.now()}`,
    examId: exam.id,
    studentId: studentInfo.id,
    studentName: studentInfo.name,
    studentEmail: studentInfo.email,
    startedAt: new Date(Date.now() - totalTimeSpent * 1000).toLocaleString('ar-SA'),
    submittedAt: new Date().toLocaleString('ar-SA'),
    totalTimeSpentSeconds: totalTimeSpent,
    answers,
    totalScore,
    maxScore,
    percentage,
    passed,
    gradeLevelText,
    topicBreakdown,
    aiRecommendations,
  };
}
