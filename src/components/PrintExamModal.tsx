import React, { useState } from 'react';
import { X, Printer, CheckCircle, FileText, Download, Loader2 } from 'lucide-react';
import { Exam } from '../types/exam';
import { SUBJECT_METADATA } from '../data/mockData';
import { exportElementToPdf } from '../utils/pdfExport';

interface PrintExamModalProps {
  exam: Exam | null;
  onClose: () => void;
}

export const PrintExamModal: React.FC<PrintExamModalProps> = ({ exam, onClose }) => {
  const [includeAnswerKey, setIncludeAnswerKey] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  if (!exam) return null;

  const subjectInfo = SUBJECT_METADATA[exam.subject];

  const handlePrint = () => {
    window.print();
  };

  const handleExportPdf = async () => {
    try {
      setIsExportingPdf(true);
      const filename = `امتحان-${exam.title.replace(/\s+/g, '_')}${includeAnswerKey ? '-مع_نموذج_الإجابة' : ''}.pdf`;
      await exportElementToPdf('printable-exam-paper', filename);
    } catch (err) {
      console.error('PDF export failed:', err);
    } finally {
      setIsExportingPdf(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800">
        {/* Modal Controls (no-print) */}
        <div className="no-print flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-t-3xl">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">معاينة وطباعة ورقة الامتحان الرسمي</h2>
              <span className="text-xs text-slate-500 dark:text-slate-400">جاهزة للتحميل الفوري كملف PDF أو الطباعة الورقية</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer bg-white dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
              <input
                type="checkbox"
                checked={includeAnswerKey}
                onChange={e => setIncludeAnswerKey(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded"
              />
              <span>إرفاق نموذج الإجابة الرسمي</span>
            </label>

            {/* Direct PDF Download Button */}
            <button
              type="button"
              onClick={handleExportPdf}
              disabled={isExportingPdf}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 rounded-xl shadow-xs transition-all active:scale-95"
            >
              {isExportingPdf ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>جارٍ تجهيز الـ PDF...</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>تحميل بصيغة PDF</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs transition-all"
            >
              <Printer className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>طباعة ورقية</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl"
              title="إغلاق"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Paper Document (always white background for realistic document print & pdf capture) */}
        <div id="printable-exam-paper" className="p-8 overflow-y-auto space-y-6 print:p-0 bg-white text-slate-900 rounded-b-3xl">
          {/* Formal Exam Header */}
          <div className="border-b-2 border-slate-900 pb-4 text-center">
            <div className="flex justify-between items-center text-xs text-slate-700 mb-2">
              <div className="text-right">
                <p className="font-bold">وزارة التربية والتعليم</p>
                <p>أكاديمية النخبة العلمية الدولية</p>
              </div>
              <div className="text-center font-bold text-sm">
                اختبار نهاية الفصل الدراسي
              </div>
              <div className="text-left font-mono">
                <p>المادة: {subjectInfo?.nameAr || exam.subject}</p>
                <p>الزمن: {exam.timeLimitMinutes} دقيقة</p>
              </div>
            </div>

            <h1 className="text-lg font-black text-slate-900 mt-2">{exam.title}</h1>
            <p className="text-xs text-slate-600">{exam.gradeLevel} · الدرجة الكلية: {exam.totalPoints} درجة</p>

            {/* Student Fill-in Box */}
            <div className="grid grid-cols-2 gap-4 border border-slate-300 p-2 mt-4 text-xs text-right">
              <div>اسم الطالب الرباعي: ...........................................................</div>
              <div>رقم الجلوس / الشعبة: .......................................................</div>
            </div>
          </div>

          {/* Exam Questions */}
          <div className="space-y-6">
            {exam.questions.map((q, idx) => (
              <div key={q.id} className="text-xs space-y-2 border-b border-slate-100 pb-4">
                <div className="flex justify-between items-start">
                  <span className="font-bold text-slate-900 text-sm">
                    السؤال {idx + 1}: {q.text}
                  </span>
                  <span className="font-mono text-slate-600 font-bold shrink-0 mr-2">
                    ({q.points} درجات)
                  </span>
                </div>

                {/* Media diagram if any */}
                {q.media?.type === 'image' && q.media.url && (
                  <div className="my-2 max-w-sm mx-auto text-center">
                    <img
                      src={q.media.url}
                      alt={q.media.caption || 'رسم توضيحي'}
                      className="max-h-48 mx-auto border border-slate-200 rounded-md"
                    />
                    {q.media.caption && (
                      <span className="text-[10px] text-slate-500 block mt-1">{q.media.caption}</span>
                    )}
                  </div>
                )}

                {/* Options */}
                {q.type === 'multiple_choice' && (
                  <div className="grid grid-cols-2 gap-2 pr-4 pt-1">
                    {q.options?.map((opt, oIdx) => (
                      <div key={oIdx} className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full border border-slate-400 inline-block text-center text-[10px] font-mono leading-3.5">
                          {String.fromCharCode(65 + oIdx)}
                        </span>
                        <span>{opt}</span>
                      </div>
                    ))}
                  </div>
                )}

                {q.type === 'true_false' && (
                  <div className="flex gap-8 pr-4 pt-1 font-bold">
                    <span>( &nbsp; &nbsp; ) صـح</span>
                    <span>( &nbsp; &nbsp; ) خـطـأ</span>
                  </div>
                )}

                {q.type === 'fill_blank' && (
                  <div className="pr-4 pt-2 text-slate-400">
                    الإجابة: ............................................................................................................
                  </div>
                )}

                {/* Answer Key if selected */}
                {includeAnswerKey && (
                  <div className="mt-2 p-2 bg-emerald-50 border border-emerald-200 rounded-md text-emerald-900">
                    <strong>الإجابة النموذجية: </strong>
                    <span>{Array.isArray(q.correctAnswer) ? q.correctAnswer.join(', ') : String(q.correctAnswer)}</span>
                    <p className="text-[11px] text-emerald-800 mt-0.5">الشرح: {q.explanation}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="text-center text-xs text-slate-500 pt-6 border-t border-slate-200">
            « انتهت الأسئلة بحمد الله وتوفيقه · مع تمنياتنا لجميع الطلبة بالتفوق والنجاح »
          </div>
        </div>
      </div>
    </div>
  );
};
