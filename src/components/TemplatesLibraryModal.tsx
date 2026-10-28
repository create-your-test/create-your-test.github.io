import React, { useState } from 'react';
import { 
  X, 
  Search, 
  Sparkles, 
  BookOpen, 
  Clock, 
  CheckCircle, 
  Copy, 
  Star, 
  Download, 
  ArrowLeft,
  Eye,
  SlidersHorizontal
} from 'lucide-react';
import { Exam, ExamTemplate, Subject, Difficulty } from '../types/exam';
import { SUBJECT_METADATA } from '../data/mockData';

interface TemplatesLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  templates: ExamTemplate[];
  onUseTemplate: (template: ExamTemplate) => void;
}

export const TemplatesLibraryModal: React.FC<TemplatesLibraryModalProps> = ({
  isOpen,
  onClose,
  templates,
  onUseTemplate
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<Subject | 'all'>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | 'all'>('all');
  const [previewTemplate, setPreviewTemplate] = useState<ExamTemplate | null>(null);

  if (!isOpen) return null;

  const filtered = templates.filter(t => {
    const matchesSubject = selectedSubject === 'all' || t.subject === selectedSubject;
    const matchesDiff = selectedDifficulty === 'all' || t.difficulty === selectedDifficulty;
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.gradeLevel.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSubject && matchesDiff && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/80 rounded-t-3xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900">
                مكتبة قوالب الامتحانات الجاهزة المعتمدة
              </h2>
              <p className="text-xs text-slate-500">
                تصفح نماذج امتحانات وزارية وأكاديمية معدة مسبقاً، وقم بتخصيصها بنقرة واحدة لإنشاء امتحانك الجديد.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filters & Search Toolbar */}
        <div className="p-6 border-b border-slate-100 bg-white flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
            <input
              type="text"
              placeholder="ابحث بالعنوان، المادة، المرحلة الدراسية، أو الوسوم..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pr-10 pl-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedSubject}
              onChange={e => setSelectedSubject(e.target.value as any)}
              className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium"
            >
              <option value="all">جميع المواد الدراسية</option>
              {Object.entries(SUBJECT_METADATA).map(([key, meta]) => (
                <option key={key} value={key}>{meta.nameAr}</option>
              ))}
            </select>

            <select
              value={selectedDifficulty}
              onChange={e => setSelectedDifficulty(e.target.value as any)}
              className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium"
            >
              <option value="all">كافة المستويات</option>
              <option value="easy">سهل / تأسيسي</option>
              <option value="medium">متوسط / قياسي</option>
              <option value="hard">متقدم / إثرائي</option>
            </select>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {previewTemplate ? (
            /* Template Detail Preview */
            <div className="space-y-6">
              <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => setPreviewTemplate(null)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white px-3 py-1.5 rounded-lg border border-slate-200 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>العودة لكافة القوالب</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onUseTemplate(previewTemplate);
                    onClose();
                  }}
                  className="flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-all active:scale-95"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>استخدام وتخصيص هذا القالب الآن</span>
                </button>
              </div>

              {/* Template Meta */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-md">
                    {SUBJECT_METADATA[previewTemplate.subject]?.nameAr}
                  </span>
                  <span className="text-slate-400">·</span>
                  <span className="text-slate-600 font-medium">{previewTemplate.gradeLevel}</span>
                  <span className="text-slate-400">·</span>
                  <span className="text-slate-600">{previewTemplate.curriculumStandard}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900">{previewTemplate.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{previewTemplate.description}</p>
              </div>

              {/* Questions Preview List */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold text-slate-800">
                  الأسئلة المتضمنة في القالب ({previewTemplate.questions.length}):
                </h4>
                {previewTemplate.questions.map((q, idx) => (
                  <div key={q.id} className="p-4 bg-slate-50/70 border border-slate-200 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800">
                        السؤال {idx + 1} ({q.points} درجات) · {q.topic}
                      </span>
                      <span className="font-mono text-slate-500">
                        {q.type === 'multiple_choice' ? 'اختيار من متعدد' : q.type === 'true_false' ? 'صح أو خطأ' : 'إكمال الفراغ'}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-slate-900">{q.text}</p>
                    {q.options && (
                      <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 pt-1">
                        {q.options.map((opt, oIdx) => (
                          <div key={oIdx} className="bg-white p-2 rounded-lg border border-slate-200">
                            {opt}
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="text-[11px] text-emerald-800 bg-emerald-50/70 p-2 rounded-lg border border-emerald-200">
                      <strong>الإجابة النموذجية: </strong>
                      <span>{String(q.correctAnswer)}</span>
                      <p className="text-slate-500 text-[10px] mt-0.5">{q.explanation}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Templates Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filtered.map(t => {
                const meta = SUBJECT_METADATA[t.subject];
                const totalPoints = t.questions.reduce((sum, q) => sum + (q.points || 1), 0);

                return (
                  <div
                    key={t.id}
                    className="p-5 rounded-3xl border border-slate-200 hover:border-indigo-300 hover:shadow-md bg-white transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-md">
                          {meta?.nameAr || t.subject}
                        </span>
                        <div className="flex items-center gap-1 text-amber-500 font-bold font-mono text-[11px]">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span>{t.rating}</span>
                        </div>
                      </div>

                      <h3 className="text-sm font-bold text-slate-900 mb-1 leading-snug">
                        {t.title}
                      </h3>

                      <p className="text-xs text-slate-500 line-clamp-2 mb-4">
                        {t.description}
                      </p>

                      <div className="text-[11px] text-slate-600 bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-1 mb-4">
                        <div className="flex justify-between">
                          <span className="text-slate-400">المرحلة:</span>
                          <strong>{t.gradeLevel}</strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">المدة المقدرة:</span>
                          <strong className="font-mono">{t.estimatedDurationMinutes} دقيقة</strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">الأسئلة والدرجات:</span>
                          <strong className="font-mono">{t.questions.length} أسئلة ({totalPoints} درجة)</strong>
                        </div>
                        <div className="flex justify-between text-[10px] pt-1 border-t border-slate-200/60 text-indigo-600">
                          <span>{t.curriculumStandard}</span>
                          <span className="font-mono">{t.downloadsCount} استخدام</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => setPreviewTemplate(t)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>معاينة الأسئلة</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          onUseTemplate(t);
                          onClose();
                        }}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-all active:scale-95"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>تخصيص القالب</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
