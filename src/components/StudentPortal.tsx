import React, { useState } from 'react';
import { 
  GraduationCap, 
  Clock, 
  Award, 
  CheckCircle2, 
  ArrowLeft, 
  Play, 
  Calendar, 
  BookOpen,
  Filter,
  FileSpreadsheet
} from 'lucide-react';
import { Exam, ExamSubmission, Subject, UserProfile, AppNotification } from '../types/exam';
import { SUBJECT_METADATA } from '../data/mockData';

interface StudentPortalProps {
  currentUser: UserProfile;
  exams: Exam[];
  submissions: ExamSubmission[];
  onStartExam: (exam: Exam) => void;
  onViewReport: (submission: ExamSubmission, exam: Exam) => void;
  notifications?: AppNotification[];
}

export const StudentPortal: React.FC<StudentPortalProps> = ({
  currentUser,
  exams,
  submissions,
  onStartExam,
  onViewReport,
  notifications
}) => {
  const [selectedSubject, setSelectedSubject] = useState<Subject | 'all'>('all');

  const mySubmissions = submissions.filter(s => s.studentId === currentUser.id || s.studentEmail === currentUser.email);
  const avgScore = mySubmissions.length > 0
    ? Math.round(mySubmissions.reduce((sum, s) => sum + s.percentage, 0) / mySubmissions.length)
    : 0;

  const filteredExams = exams.filter(e => {
    if (selectedSubject === 'all') return true;
    return e.subject === selectedSubject;
  });

  return (
    <div className="space-y-8">
      {/* Student Welcome Banner */}
      <div className="bg-radial from-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-600/40 border border-indigo-400/30 flex items-center justify-center text-indigo-200 shrink-0">
              <GraduationCap className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black">
                أهلاً بك يا {currentUser.name}
              </h1>
              <p className="text-xs sm:text-sm text-indigo-200/80 mt-1">
                بوابة الطالب الذكية · استعد للاختبارات التفاعلية واستلم تقارير أدائك الفورية مع التحليلات البيانية وتصدير النتائج PDF.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 bg-white/10 px-6 py-3 rounded-2xl backdrop-blur-xs border border-white/10 shrink-0">
            <div className="text-center">
              <span className="text-[11px] text-indigo-200 block">الاختبارات المنجزة</span>
              <strong className="text-xl font-bold font-mono tabular-nums">{mySubmissions.length}</strong>
            </div>
            <div className="border-r border-white/20 pr-6 text-center">
              <span className="text-[11px] text-indigo-200 block">المعدل العام</span>
              <strong className="text-xl font-bold font-mono text-emerald-400 tabular-nums">
                {mySubmissions.length > 0 ? `${avgScore}%` : '0%'}
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* Active Notifications & Deadlines Alert Callout */}
      {notifications && notifications.some(n => !n.read && (n.type === 'new_exam' || n.type === 'deadline_reminder')) && (
        <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-2xl p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <strong className="text-xs font-bold text-amber-950 dark:text-amber-200 block">
                {notifications.find(n => !n.read && (n.type === 'new_exam' || n.type === 'deadline_reminder'))?.title}
              </strong>
              <p className="text-[11px] text-amber-800 dark:text-amber-300 mt-0.5">
                {notifications.find(n => !n.read && (n.type === 'new_exam' || n.type === 'deadline_reminder'))?.message}
              </p>
            </div>
          </div>
          <span className="text-[10px] bg-amber-200/60 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 px-2.5 py-1 rounded-lg font-bold shrink-0">
            تنبيه عاجل
          </span>
        </div>
      )}

      {/* Available Exams Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              الاختبارات الدراسية المتاحة للتقديم ({filteredExams.length})
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              اختر المادة وابدأ الاختبار التفاعلي، وسيتم تصحيح إجاباتك تلقائياً فور التسليم.
            </p>
          </div>

          {/* Filter Bar */}
          <div className="flex items-center gap-1.5 p-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-x-auto max-w-full">
            <button
              type="button"
              onClick={() => setSelectedSubject('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                selectedSubject === 'all'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              الكل
            </button>
            {Object.entries(SUBJECT_METADATA).map(([key, meta]) => (
              <button
                key={key}
                type="button"
                onClick={() => setSelectedSubject(key as Subject)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                  selectedSubject === key
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {meta.nameAr}
              </button>
            ))}
          </div>
        </div>

        {/* Exams Grid or Clean Empty State */}
        {filteredExams.length === 0 ? (
          <div className="py-12 px-4 text-center rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-3">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">لا توجد اختبارات منشورة حالياً (0 اختبار)</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-1">
              سيقوم المعلم بنشر الاختبارات وتحديد مواعيدها قريباً. ستصلك إشعارات فورية عند توفر أي اختبار جديد.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExams.map(exam => {
              const subjectInfo = SUBJECT_METADATA[exam.subject];
              const alreadySubmitted = mySubmissions.find(s => s.examId === exam.id);

              return (
                <div
                  key={exam.id}
                  className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs mb-3">
                      <span className="font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-1 rounded-lg">
                        {subjectInfo?.nameAr || exam.subject}
                      </span>
                      <span className="text-slate-400 font-mono">{exam.gradeLevel}</span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug mb-2">
                      {exam.title}
                    </h3>

                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-6">
                      {exam.description}
                    </p>

                    <div className="grid grid-cols-3 gap-2 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 text-center text-xs mb-6">
                      <div>
                        <span className="text-[10px] text-slate-400 block">المدة</span>
                        <strong className="font-mono text-slate-800 dark:text-slate-200">{exam.timeLimitMinutes} د</strong>
                      </div>
                      <div className="border-r border-slate-200 dark:border-slate-700">
                        <span className="text-[10px] text-slate-400 block">الأسئلة</span>
                        <strong className="font-mono text-slate-800 dark:text-slate-200">{exam.questions.length}</strong>
                      </div>
                      <div className="border-r border-slate-200 dark:border-slate-700">
                        <span className="text-[10px] text-slate-400 block">الدرجة</span>
                        <strong className="font-mono text-slate-800 dark:text-slate-200">{exam.totalPoints}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => onStartExam(exam)}
                      className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all active:scale-98"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>{alreadySubmitted ? 'إعادة خوض الاختبار' : 'بدء الاختبار الآن'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Student Past Results & History */}
      {mySubmissions.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 transition-colors">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              سجل اختباراتي السابقة وتقارير الأداء ({mySubmissions.length})
            </h2>
            <span className="text-xs text-slate-500 dark:text-slate-400">انقر على أي اختبار لعرض تقرير الرادار والتحميل بصيغة PDF</span>
          </div>

          <div className="space-y-3">
            {mySubmissions.map(sub => {
              const associatedExam = exams.find(e => e.id === sub.examId);
              return (
                <div
                  key={sub.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold ${
                      sub.passed ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300' : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                    }`}>
                      {sub.percentage}%
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                        {associatedExam?.title || 'اختبار سابق'}
                      </h4>
                      <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        <span>{sub.gradeLevelText}</span>
                        <span>·</span>
                        <span>{sub.totalScore}/{sub.maxScore} درجة</span>
                        <span>·</span>
                        <span>{sub.submittedAt}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => associatedExam && onViewReport(sub, associatedExam)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 rounded-lg transition-colors"
                  >
                    <span>عرض التقرير وتحميل PDF</span>
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
