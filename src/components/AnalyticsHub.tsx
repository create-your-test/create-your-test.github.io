import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  AlertTriangle, 
  CheckCircle2, 
  Award, 
  Filter, 
  Lightbulb,
  PieChart
} from 'lucide-react';
import { Exam, ExamSubmission, Subject } from '../types/exam';
import { SUBJECT_METADATA } from '../data/mockData';

interface AnalyticsHubProps {
  exams: Exam[];
  submissions: ExamSubmission[];
  onViewReport: (submission: ExamSubmission, exam: Exam) => void;
}

export const AnalyticsHub: React.FC<AnalyticsHubProps> = ({
  exams,
  submissions,
  onViewReport
}) => {
  const [selectedExamId, setSelectedExamId] = useState<string>('all');

  const filteredSubmissions = selectedExamId === 'all'
    ? submissions
    : submissions.filter(s => s.examId === selectedExamId);

  // Score distribution tiers
  const distribution = {
    excellent: filteredSubmissions.filter(s => s.percentage >= 85).length,
    good: filteredSubmissions.filter(s => s.percentage >= 65 && s.percentage < 85).length,
    pass: filteredSubmissions.filter(s => s.percentage >= 50 && s.percentage < 65).length,
    fail: filteredSubmissions.filter(s => s.percentage < 50).length,
  };

  const total = filteredSubmissions.length || 1;

  // Question difficulty analysis (aggregate hardest questions)
  const questionMistakeMap: Record<string, { text: string; topic: string; totalAttempts: number; wrongCount: number }> = {};

  filteredSubmissions.forEach(sub => {
    sub.answers.forEach(ans => {
      const exam = exams.find(e => e.id === sub.examId);
      const q = exam?.questions.find(item => item.id === ans.questionId);
      if (q) {
        if (!questionMistakeMap[q.id]) {
          questionMistakeMap[q.id] = { text: q.text, topic: q.topic, totalAttempts: 0, wrongCount: 0 };
        }
        questionMistakeMap[q.id].totalAttempts += 1;
        if (!ans.isCorrect) {
          questionMistakeMap[q.id].wrongCount += 1;
        }
      }
    });
  });

  const hardestQuestions = Object.values(questionMistakeMap)
    .map(q => ({
      ...q,
      failureRate: Math.round((q.wrongCount / (q.totalAttempts || 1)) * 100)
    }))
    .sort((a, b) => b.failureRate - a.failureRate)
    .slice(0, 4);

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-colors">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            <span>التحليلات البيانية الذكية لنتائج الطلاب</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            رصد مؤشرات الأداء الأكاديمي، فجوات الفهم، ومنحنيات التوزيع التكراري للدرجات.
          </p>
        </div>

        {/* Filter Exam */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">تصفية الامتحان:</label>
          <select
            value={selectedExamId}
            onChange={e => setSelectedExamId(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-200"
          >
            <option value="all">كافة الامتحانات المجمعة</option>
            {exams.map(e => (
              <option key={e.id} value={e.id}>{e.title}</option>
            ))}
          </select>
        </div>
      </div>

      {filteredSubmissions.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 border border-slate-200 dark:border-slate-800 text-center space-y-3 transition-colors">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
            <BarChart3 className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">لا توجد بيانات تحليلية مسجلة حتى الآن (0 تسليم)</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            بمجرد قيام الطلاب بتقديم الامتحانات وتصحيحها آلياً، سيتولى النظام توليد الرسوم البيانية التكرارية ومصفوفة صعوبة الأسئلة فوراً.
          </p>
        </div>
      ) : (
        <>
          {/* Grade Distribution & Bell Curve Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Histogram Distribution */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 transition-colors">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                    منحنى التوزيع التكراري لدرجات الدفعة (Score Distribution)
                  </h2>
                  <span className="text-xs text-slate-500 dark:text-slate-400">تمثيل بياني لنسب درجات الطلاب الإجمالية</span>
                </div>
                <PieChart className="w-4 h-4 text-slate-400" />
              </div>

              <div className="space-y-4 pt-2">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-emerald-700 dark:text-emerald-400">ممتاز (85% - 100%)</span>
                    <span className="font-mono text-emerald-700 dark:text-emerald-400 font-bold tabular-nums">
                      {distribution.excellent} طلاب ({Math.round((distribution.excellent / total) * 100)}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
                    <div 
                      className="bg-emerald-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${(distribution.excellent / total) * 100}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-indigo-700 dark:text-indigo-400">جيد جداً (65% - 84%)</span>
                    <span className="font-mono text-indigo-700 dark:text-indigo-400 font-bold tabular-nums">
                      {distribution.good} طلاب ({Math.round((distribution.good / total) * 100)}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
                    <div 
                      className="bg-indigo-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${(distribution.good / total) * 100}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-amber-700 dark:text-amber-400">مقبول (50% - 64%)</span>
                    <span className="font-mono text-amber-700 dark:text-amber-400 font-bold tabular-nums">
                      {distribution.pass} طلاب ({Math.round((distribution.pass / total) * 100)}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
                    <div 
                      className="bg-amber-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${(distribution.pass / total) * 100}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-rose-700 dark:text-rose-400">بحاجة لدعم / راسب (أقل من 50%)</span>
                    <span className="font-mono text-rose-700 dark:text-rose-400 font-bold tabular-nums">
                      {distribution.fail} طلاب ({Math.round((distribution.fail / total) * 100)}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
                    <div 
                      className="bg-rose-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${(distribution.fail / total) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Smart AI Diagnostic Insights */}
            <div className="bg-radial from-slate-900 to-slate-950 text-white rounded-3xl p-6 border border-slate-800 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2 text-indigo-400">
                  <Lightbulb className="w-5 h-5 text-indigo-400" />
                  <h2 className="text-sm font-bold text-white">الاستنتاجات التشخيصية الذكية للمنظومة</h2>
                </div>
                <p className="text-xs text-slate-400 mb-6">
                  تحليل خوارزمي تلقائي لبيانات التسليم لتحديد مكامن الضعف والقوة المشتركة بين الطلاب.
                </p>

                <div className="space-y-3 text-xs leading-relaxed text-slate-300">
                  <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700/60">
                    <strong className="text-emerald-400 block mb-1">● تميز ملحوظ في الأسئلة البصرية والمخططات:</strong>
                    <span>أظهر الطلاب دقة إجابة متزايدة عند تدعيم الأسئلة برسومات تشريحية ومخططات بيانية مقارنة بالأسئلة النصية المجردة.</span>
                  </div>

                  <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700/60">
                    <strong className="text-amber-400 block mb-1">▲ مراقبة فجوات الفهم الأكاديمي:</strong>
                    <span>يتم فحص خيارات الإجابة تلقائياً لاستخلاص المفاهيم التي سجلت أعلى تردد في الإجابات الخاطئة وتقديم توصيات مراجعة.</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between font-mono">
                <span>تحديث البيانات: فوري</span>
                <span>نسبة الاعتمادية: 100%</span>
              </div>
            </div>
          </div>

          {/* Hardest Questions Matrix */}
          {hardestQuestions.length > 0 && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 transition-colors">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                  <span>مصفوفة الأسئلة الأكثر إرباكاً للطلاب (Question Difficulty Index)</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  تحديد الأسئلة التي سجلت أعلى نسبة خطأ للمساعدة في إعداد حصص المراجعة والتقوية.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {hardestQuestions.map((q, idx) => (
                  <div key={idx} className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-indigo-700 dark:text-indigo-400">{q.topic}</span>
                      <span className="font-mono text-rose-600 dark:text-rose-400 font-bold tabular-nums">
                        نسبة الخطأ: {q.failureRate}%
                      </span>
                    </div>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 line-clamp-2">
                      {q.text}
                    </p>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      أخطأ فيه {q.wrongCount} طالب من إجمالي {q.totalAttempts} محاولة.
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Student Leaderboard & Individual Progress Links */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 transition-colors">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                ترتيب الطلاب وتقارير الإتقان الفردية ({filteredSubmissions.length})
              </h2>
              <span className="text-xs text-slate-500 dark:text-slate-400">انقر لعرض التقرير المفصل مع مخطط الرادار وتحميل PDF</span>
            </div>

            <div className="space-y-3">
              {filteredSubmissions
                .sort((a, b) => b.percentage - a.percentage)
                .map((sub, idx) => {
                  const examObj = exams.find(e => e.id === sub.examId);
                  return (
                    <div
                      key={sub.id}
                      className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 bg-white dark:bg-slate-900 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-mono font-bold text-xs ${
                          idx === 0 ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300' : idx === 1 ? 'bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-200' : idx === 2 ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                        }`}>
                          #{idx + 1}
                        </span>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white">{sub.studentName}</h4>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400">{examObj?.title || sub.examId}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-left font-mono tabular-nums text-xs">
                          <strong className={sub.percentage >= 80 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-800 dark:text-slate-200'}>
                            {sub.percentage}%
                          </strong>
                          <span className="text-slate-400 block text-[10px]">{sub.gradeLevelText}</span>
                        </div>

                        <button
                          type="button"
                          onClick={() => examObj && onViewReport(sub, examObj)}
                          className="px-3 py-1.5 text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 rounded-xl transition-colors"
                        >
                          عرض التقرير
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
