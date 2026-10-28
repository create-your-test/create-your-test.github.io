import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  Users, 
  Award, 
  TrendingUp, 
  Plus, 
  Sparkles, 
  Eye, 
  Printer, 
  Trash2, 
  CheckCircle, 
  Clock,
  Search,
  Filter,
  Layers,
  BookOpen,
  Download
} from 'lucide-react';
import { Exam, ExamSubmission, Subject } from '../types/exam';
import { SUBJECT_METADATA } from '../data/mockData';

interface TeacherDashboardProps {
  exams: Exam[];
  submissions: ExamSubmission[];
  onCreateExam: () => void;
  onPreviewExam: (exam: Exam) => void;
  onViewReport: (submission: ExamSubmission, exam: Exam) => void;
  onDeleteExam: (examId: string) => void;
  onPrintBlankExam: (exam: Exam) => void;
  onOpenTemplates: () => void;
  onOpenQuestionBank: () => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  exams,
  submissions,
  onCreateExam,
  onPreviewExam,
  onViewReport,
  onDeleteExam,
  onPrintBlankExam,
  onOpenTemplates,
  onOpenQuestionBank
}) => {
  const [selectedSubject, setSelectedSubject] = useState<Subject | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Calculate high-level KPIs
  const totalSubmissionsCount = submissions.length;
  const averageScore = totalSubmissionsCount > 0
    ? Math.round(submissions.reduce((sum, s) => sum + s.percentage, 0) / totalSubmissionsCount)
    : 0;
  const passedCount = submissions.filter(s => s.passed).length;
  const passRate = totalSubmissionsCount > 0
    ? Math.round((passedCount / totalSubmissionsCount) * 100)
    : 0;

  const filteredExams = exams.filter(exam => {
    const matchesSubject = selectedSubject === 'all' || exam.subject === selectedSubject;
    const matchesSearch = exam.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          exam.gradeLevel.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSubject && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Welcome & Top Stats Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              لوحة تحكم المعلم وإدارة الامتحانات
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              إدارة بنك الاختبارات، إعداد مفاتيح التصحيح الآلي، ومتابعة درجات وتحليلات الطلاب الفورية.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={onOpenTemplates}
              className="flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors"
            >
              <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>مكتبة القوالب الجاهزة</span>
            </button>

            <button
              type="button"
              onClick={onOpenQuestionBank}
              className="flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors"
            >
              <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>بنك الأسئلة المتطور</span>
            </button>

            <button
              type="button"
              onClick={onCreateExam}
              className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>إنشاء امتحان جديد</span>
            </button>
          </div>
        </div>

        {/* 4 KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-700/60">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
              <span className="text-xs font-semibold">إجمالي الامتحانات</span>
              <FileSpreadsheet className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white font-mono tabular-nums">
              {exams.length}
            </div>
            <span className="text-[11px] text-slate-400">مفعلة وجاهزة للتقديم</span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-700/60">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
              <span className="text-xs font-semibold">الاختبارات المصححة</span>
              <Users className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white font-mono tabular-nums">
              {totalSubmissionsCount}
            </div>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">تصحيح تلقائي فوري 100%</span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-700/60">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
              <span className="text-xs font-semibold">متوسط الدرجات</span>
              <Award className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white font-mono tabular-nums">
              {averageScore}%
            </div>
            <span className="text-[11px] text-slate-400">معدل الدفعة العامة</span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-700/60">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
              <span className="text-xs font-semibold">نسبة الاجتياز العامة</span>
              <TrendingUp className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white font-mono tabular-nums">
              {passRate}%
            </div>
            <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">{passedCount} طالب مجتاز</span>
          </div>
        </div>
      </div>

      {/* Exams Management Section */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6 transition-colors">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              قائمة الامتحانات الدراسية المتاحة ({filteredExams.length})
            </h2>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              يمكنك معاينة الاختبار كما يراه الطالب، تحميل ورقة الأسئلة PDF، أو إضافة أسئلة جديدة.
            </span>
          </div>

          {/* Search & Subject filter */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-2.5" />
              <input
                type="text"
                placeholder="بحث في الامتحانات..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pr-8 pl-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <select
              value={selectedSubject}
              onChange={e => setSelectedSubject(e.target.value as any)}
              className="px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-200"
            >
              <option value="all">جميع المواد</option>
              {Object.entries(SUBJECT_METADATA).map(([k, v]) => (
                <option key={k} value={k}>{v.nameAr}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Exams Grid or Empty Zero State */}
        {filteredExams.length === 0 ? (
          <div className="py-12 px-4 text-center rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-3">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">لا توجد امتحانات مضافة حتى الآن (0 امتحان)</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-1 mb-5">
              منصتك جاهزة تماماً للبدء ببيانات نظيفة. يمكنك إنشاء امتحانك الأول أو استيراد أحد قوالب المناهج بضغطة زر واحدة.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={onCreateExam}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-all active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ إنشاء أول امتحان الآن</span>
              </button>
              <button
                type="button"
                onClick={onOpenTemplates}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl transition-colors"
              >
                <BookOpen className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>استعراض مكتبة القوالب</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredExams.map(exam => {
              const subjectInfo = SUBJECT_METADATA[exam.subject];
              const examSubmissions = submissions.filter(s => s.examId === exam.id);
              const avgExamScore = examSubmissions.length > 0
                ? Math.round(examSubmissions.reduce((sum, s) => sum + s.percentage, 0) / examSubmissions.length)
                : null;

              return (
                <div
                  key={exam.id}
                  className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all bg-white dark:bg-slate-900 hover:shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
                      <span className="font-semibold text-indigo-600 dark:text-indigo-400">{subjectInfo?.nameAr || exam.subject}</span>
                      <span className="font-mono">{exam.gradeLevel}</span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug mb-2">
                      {exam.title}
                    </h3>

                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-4">
                      {exam.description}
                    </p>

                    <div className="flex items-center gap-4 text-xs text-slate-600 dark:text-slate-300 mb-4 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                      <div>
                        <span className="text-slate-400 block text-[10px]">الأسئلة:</span>
                        <strong className="font-mono text-slate-800 dark:text-slate-200">{exam.questions.length}</strong>
                      </div>
                      <div className="border-r border-slate-200 dark:border-slate-700 pr-3">
                        <span className="text-slate-400 block text-[10px]">الزمن:</span>
                        <strong className="font-mono text-slate-800 dark:text-slate-200">{exam.timeLimitMinutes} دقيقة</strong>
                      </div>
                      <div className="border-r border-slate-200 dark:border-slate-700 pr-3">
                        <span className="text-slate-400 block text-[10px]">الدرجات:</span>
                        <strong className="font-mono text-slate-800 dark:text-slate-200">{exam.totalPoints}</strong>
                      </div>
                      <div className="border-r border-slate-200 dark:border-slate-700 pr-3">
                        <span className="text-slate-400 block text-[10px]">المتوسط:</span>
                        <strong className="font-mono text-indigo-600 dark:text-indigo-400">
                          {avgExamScore !== null ? `${avgExamScore}%` : 'لا توجد تسليمات'}
                        </strong>
                      </div>
                    </div>
                  </div>

                  {/* Exam Action Bar */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onPreviewExam(exam)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 rounded-xl transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>معاينة وتجربة</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onPrintBlankExam(exam)}
                        title="معاينة / تحميل ورقة الامتحان PDF والطباعة"
                        className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors"
                      >
                        <Download className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span>PDF / طباعة</span>
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => onDeleteExam(exam.id)}
                      title="حذف الامتحان"
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Submissions & Auto-Graded Student Results */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 transition-colors">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              سجل تسليمات الطلاب والتصحيح التلقائي المباشر ({submissions.length})
            </h2>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              نتائج مصححة آلياً لحظة بلحظة مع تحليل المحاور والتقدير العلمي لكل طالب.
            </span>
          </div>
        </div>

        {submissions.length === 0 ? (
          <div className="py-10 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
            <Users className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-xs font-bold text-slate-700 dark:text-slate-300">لا توجد تسليمات مسجلة بعد (0 تسليم)</p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              عندما يخوض الطلاب الاختبارات ويقومون بالتسليم، سيظهر هنا سجل الدرجات الكامل مع إمكانية طباعة تقارير الأداء الفردية كـ PDF.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="py-3 px-4">اسم الطالب</th>
                  <th className="py-3 px-4">الامتحان</th>
                  <th className="py-3 px-4">الدرجة</th>
                  <th className="py-3 px-4">النسبة</th>
                  <th className="py-3 px-4">التقدير</th>
                  <th className="py-3 px-4">الوقت المستغرق</th>
                  <th className="py-3 px-4">التاريخ والوقت</th>
                  <th className="py-3 px-4 text-center">التقرير</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {submissions.map(sub => {
                  const associatedExam = exams.find(e => e.id === sub.examId);
                  return (
                    <tr key={sub.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                        {sub.studentName}
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-300 max-w-xs truncate">
                        {associatedExam?.title || sub.examId}
                      </td>
                      <td className="py-3 px-4 font-mono font-semibold text-slate-800 dark:text-slate-200 tabular-nums">
                        {sub.totalScore} / {sub.maxScore}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold tabular-nums">
                        <span className={sub.percentage >= 60 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}>
                          {sub.percentage}%
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-medium text-slate-700 dark:text-slate-300">{sub.gradeLevelText}</span>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-500 dark:text-slate-400 tabular-nums">
                        {Math.floor(sub.totalTimeSpentSeconds / 60)} دقيقة
                      </td>
                      <td className="py-3 px-4 text-slate-400 dark:text-slate-500 font-mono">
                        {sub.submittedAt}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => associatedExam && onViewReport(sub, associatedExam)}
                          className="px-3 py-1 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 rounded-lg font-semibold transition-colors"
                        >
                          عرض التقرير
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
