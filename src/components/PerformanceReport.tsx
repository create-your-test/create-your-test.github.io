import React, { useState } from 'react';
import { 
  Printer, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  Award, 
  Clock, 
  Lightbulb, 
  BarChart2, 
  FileCheck,
  Share2,
  Download,
  Loader2
} from 'lucide-react';
import { Exam, ExamSubmission } from '../types/exam';
import { RadarChart } from './RadarChart';
import { SUBJECT_METADATA } from '../data/mockData';
import { exportElementToPdf } from '../utils/pdfExport';

interface PerformanceReportProps {
  submission: ExamSubmission;
  exam: Exam;
  onBack: () => void;
}

export const PerformanceReport: React.FC<PerformanceReportProps> = ({
  submission,
  exam,
  onBack
}) => {
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const isPassed = submission.passed;
  const subjectInfo = SUBJECT_METADATA[exam.subject];

  const handlePrint = () => {
    window.print();
  };

  const handleExportPdf = async () => {
    try {
      setIsExportingPdf(true);
      const filename = `تقرير_أداء-${submission.studentName.replace(/\s+/g, '_')}-${exam.title.replace(/\s+/g, '_')}.pdf`;
      await exportElementToPdf('printable-performance-report', filename);
    } catch (err) {
      console.error('PDF export failed:', err);
    } finally {
      setIsExportingPdf(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* Top Action Bar (no print) */}
      <div className="no-print flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-slate-900 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 px-3.5 py-2 rounded-xl transition-colors"
        >
          <ArrowRight className="w-4 h-4" />
          <span>العودة إلى لوحة التحكم</span>
        </button>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleExportPdf}
            disabled={isExportingPdf}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 rounded-xl shadow-xs transition-all active:scale-95"
          >
            {isExportingPdf ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>جارٍ إنشاء الـ PDF...</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>تحميل التقرير كملف PDF</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xs transition-all active:scale-95"
          >
            <Printer className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>طباعة ورقية</span>
          </button>
        </div>
      </div>

      {/* Main Printable Report Paper Card (always white background for PDF capturing and clean printing) */}
      <div id="printable-performance-report" className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm print:p-0 print:border-none print:shadow-none space-y-8 text-slate-900">
        {/* Formal Institutional Header */}
        <div className="border-b-2 border-slate-900 pb-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-right">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-2xl shadow-sm">
              ق
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900">
                أكاديمية النخبة العلمية الدولية
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                نظام الاختبارات الذكي والتصحيح التلقائي المعتمد · السجل الأكاديمي
              </p>
            </div>
          </div>

          <div className="text-left font-mono text-xs text-slate-600 space-y-1">
            <p><span className="text-slate-400">رقم السجل:</span> {submission.id}</p>
            <p><span className="text-slate-400">تاريخ الانعقاد:</span> {submission.submittedAt}</p>
          </div>
        </div>

        {/* Student & Exam Details Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
          <div>
            <span className="text-slate-400 block mb-0.5">اسم الطالب:</span>
            <strong className="text-slate-900 text-sm">{submission.studentName}</strong>
          </div>
          <div>
            <span className="text-slate-400 block mb-0.5">المادة الدراسية:</span>
            <strong className="text-slate-900 text-sm">{subjectInfo?.nameAr || exam.subject}</strong>
          </div>
          <div>
            <span className="text-slate-400 block mb-0.5">الصف / المرحلة:</span>
            <strong className="text-slate-900 text-sm">{exam.gradeLevel}</strong>
          </div>
          <div>
            <span className="text-slate-400 block mb-0.5">المعلم المشرف:</span>
            <strong className="text-slate-900 text-sm">{exam.authorName}</strong>
          </div>
        </div>

        {/* Big Score Summary Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center bg-radial from-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-8">
          {/* Main Percentage Gauge */}
          <div className="flex flex-col items-center justify-center border-b md:border-b-0 md:border-l border-slate-800 pb-6 md:pb-0 md:pl-6 text-center">
            <span className="text-xs font-semibold text-slate-400 mb-1">النتيجة النهائية المئوية</span>
            <div className="text-5xl font-black tracking-tight text-white font-mono tabular-nums">
              {submission.percentage}%
            </div>
            <div className={`mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
              isPassed ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
            }`}>
              {isPassed ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
              <span>{isPassed ? 'مُجتاز بنجاح (ناجح)' : 'دون درجة النجاح (راسب)'}</span>
            </div>
          </div>

          {/* Points Breakdown */}
          <div className="space-y-3 px-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">الدرجة المحتسبة:</span>
              <span className="font-mono text-base font-bold text-white tabular-nums">
                {submission.totalScore} / {submission.maxScore} درجة
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">التقدير الأكاديمي:</span>
              <span className="font-bold text-indigo-300">{submission.gradeLevelText}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">درجة النجاح المقررة:</span>
              <span className="font-mono text-slate-300 tabular-nums">{exam.passingScorePercent}%</span>
            </div>
          </div>

          {/* Time & Speed efficiency */}
          <div className="border-t md:border-t-0 md:border-r border-slate-800 pt-6 md:pt-0 md:pr-6 space-y-3">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Clock className="w-4 h-4 text-indigo-400" />
              <span>كفاءة الوقت المستغرق</span>
            </div>
            <div className="text-2xl font-bold font-mono text-white tabular-nums">
              {Math.floor(submission.totalTimeSpentSeconds / 60)} دقيقة و {submission.totalTimeSpentSeconds % 60} ثانية
            </div>
            <p className="text-[11px] text-slate-400">
              الوقت المتاح للامتحان: {exam.timeLimitMinutes} دقيقة.
            </p>
          </div>
        </div>

        {/* Analytics Section: Radar Chart & Topic Bars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-slate-50/70 rounded-3xl p-6 border border-slate-200">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <BarChart2 className="w-4 h-4 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900">مخطط الرادار لإتقان المحاور والمهارات</h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              رسم بياني متعدد المحاور يوضح تميز الطالب في كل موضوع تعليمي بناءً على التصحيح التلقائي.
            </p>
            <RadarChart data={submission.topicBreakdown} size={300} />
          </div>

          {/* Topic Progress Bars */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-800 border-b border-slate-200 pb-2">
              تفاصيل إتقان الموضوعات الدراسية
            </h3>

            {submission.topicBreakdown.map((t, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">{t.topic}</span>
                  <span className="font-mono text-indigo-600 font-bold tabular-nums">
                    {t.earnedPoints}/{t.totalPoints} ({t.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      t.percentage >= 80 ? 'bg-emerald-500' : t.percentage >= 60 ? 'bg-indigo-600' : 'bg-rose-500'
                    }`}
                    style={{ width: `${t.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Recommendations & Pedagogical Action Plan */}
        <div className="bg-amber-50/60 border border-amber-200 rounded-3xl p-6">
          <div className="flex items-center gap-2 mb-3 text-amber-900">
            <Lightbulb className="w-5 h-5 text-amber-600" />
            <h3 className="text-sm font-bold">التحليل التربوي والتوصيات الذكية لتحسين الأداء</h3>
          </div>

          <ul className="space-y-2 text-xs text-amber-950 font-medium list-disc list-inside">
            {submission.aiRecommendations.map((rec, i) => (
              <li key={i} className="leading-relaxed">{rec}</li>
            ))}
          </ul>

          {submission.teacherFeedback && (
            <div className="mt-4 pt-3 border-t border-amber-200/60 text-xs">
              <span className="font-bold text-amber-900">ملاحظة المعلم المشرف المباشرة:</span>
              <p className="text-slate-800 mt-1 italic">"{submission.teacherFeedback}"</p>
            </div>
          )}
        </div>

        {/* Detailed Question-by-Question Audit */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h3 className="text-base font-bold text-slate-900">
              المراجعة التفصيلية لإجابات الطالب والشروح النموذجية
            </h3>
            <span className="text-xs text-slate-500">
              {submission.answers.filter(a => a.isCorrect).length} صحيحة من {submission.answers.length}
            </span>
          </div>

          <div className="space-y-4">
            {exam.questions.map((q, idx) => {
              const studentAnswerObj = submission.answers.find(a => a.questionId === q.id);
              const isCorrect = studentAnswerObj?.isCorrect;
              const earnedPts = studentAnswerObj?.earnedPoints || 0;

              return (
                <div
                  key={q.id}
                  className={`p-5 rounded-2xl border transition-colors ${
                    isCorrect ? 'bg-white border-emerald-200' : 'bg-rose-50/20 border-rose-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex items-center gap-2.5">
                      <span className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 ${
                        isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {idx + 1}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900">{q.text}</h4>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`font-mono text-xs font-bold px-2 py-0.5 rounded-md ${
                        isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {earnedPts}/{q.points} درجة
                      </span>
                    </div>
                  </div>

                  {/* Answers Comparison */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs my-3 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                    <div>
                      <span className="text-slate-400 block mb-1">إجابة الطالب:</span>
                      <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                        {isCorrect ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : (
                          <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                        )}
                        <span>
                          {Array.isArray(studentAnswerObj?.answer)
                            ? studentAnswerObj.answer.join('، ')
                            : String(studentAnswerObj?.answer || 'لم يجب')}
                        </span>
                      </div>
                    </div>

                    <div>
                      <span className="text-slate-400 block mb-1">الإجابة النموذجية الصحيحة:</span>
                      <div className="font-semibold text-emerald-800">
                        {Array.isArray(q.correctAnswer) ? q.correctAnswer.join('، ') : String(q.correctAnswer)}
                      </div>
                    </div>
                  </div>

                  {/* Pedagogical Explanation */}
                  {q.explanation && (
                    <div className="text-xs text-slate-600 bg-indigo-50/50 p-3 rounded-xl border border-indigo-100 flex items-start gap-2">
                      <FileCheck className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-indigo-900 block mb-0.5">الشرح والتوضيح العلمي:</strong>
                        <span>{q.explanation}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Official Signature Footer for Printed Certificate */}
        <div className="pt-8 border-t-2 border-slate-200 grid grid-cols-3 gap-6 text-center text-xs">
          <div>
            <span className="text-slate-400 block mb-8">اعتماد المشرف الأكاديمي</span>
            <div className="font-bold text-slate-800 border-t border-slate-300 pt-1">د. عبد الله المهيري</div>
          </div>
          <div>
            <span className="text-slate-400 block mb-8">ختم المؤسسة التعليمية</span>
            <div className="font-bold text-slate-800 border-t border-slate-300 pt-1">أكاديمية النخبة العلمية</div>
          </div>
          <div>
            <span className="text-slate-400 block mb-8">توقيع الطالب / ولي الأمر</span>
            <div className="font-bold text-slate-800 border-t border-slate-300 pt-1">{submission.studentName}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
