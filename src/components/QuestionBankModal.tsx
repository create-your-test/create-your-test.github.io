import React, { useState } from 'react';
import { 
  X, 
  Search, 
  Plus, 
  Layers, 
  CheckSquare, 
  Square, 
  Image as ImageIcon, 
  Volume2, 
  Sigma, 
  BookOpen, 
  Sparkles,
  Filter,
  CheckCircle2,
  Trash2,
  Save,
  Tag,
  UploadCloud,
  FileText
} from 'lucide-react';
import { BankQuestion, Difficulty, QuestionType, Subject, Question } from '../types/exam';
import { SUBJECT_METADATA } from '../data/mockData';
import { BatchQuestionImporter } from './BatchQuestionImporter';

interface QuestionBankModalProps {
  isOpen: boolean;
  onClose: () => void;
  bankQuestions: BankQuestion[];
  onAddQuestionToBank: (newQ: BankQuestion) => void;
  onBatchAddQuestions?: (newQuestions: BankQuestion[]) => void;
  onAssembleExamFromQuestions: (selectedQuestions: Question[]) => void;
}

export const QuestionBankModal: React.FC<QuestionBankModalProps> = ({
  isOpen,
  onClose,
  bankQuestions,
  onAddQuestionToBank,
  onBatchAddQuestions,
  onAssembleExamFromQuestions
}) => {
  const [activeMode, setActiveMode] = useState<'browse' | 'add_manual' | 'import_file'>('browse');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<Subject | 'all'>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | 'all'>('all');
  const [selectedType, setSelectedType] = useState<QuestionType | 'all'>('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  // New Question Form state
  const [newText, setNewText] = useState('');
  const [newSubject, setNewSubject] = useState<Subject>('biology');
  const [newTopic, setNewTopic] = useState('');
  const [newType, setNewType] = useState<QuestionType>('multiple_choice');
  const [newDifficulty, setNewDifficulty] = useState<Difficulty>('medium');
  const [newPoints, setNewPoints] = useState(5);
  const [newCurriculumTag, setNewCurriculumTag] = useState('المرحلة الثانوية');
  const [newExplanation, setNewExplanation] = useState('');
  const [newOptions, setNewOptions] = useState<string[]>(['الخيار أ', 'الخيار ب', 'الخيار ج', 'الخيار د']);
  const [newCorrectAnswer, setNewCorrectAnswer] = useState<string>('الخيار أ');
  const [newMediaAttachment, setNewMediaAttachment] = useState<'none' | 'image' | 'formula' | 'audio'>('none');
  const [newImageUrl, setNewImageUrl] = useState('/src/assets/images/diagram_human_heart_1793036033179.jpg');
  const [newFormulaText, setNewFormulaText] = useState('E = mc^2');
  const [newAudioPrompt, setNewAudioPrompt] = useState('Listen carefully to the audio statement.');

  if (!isOpen) return null;

  const filtered = bankQuestions.filter(q => {
    const matchesSub = selectedSubject === 'all' || q.subject === selectedSubject;
    const matchesDiff = selectedDifficulty === 'all' || q.difficulty === selectedDifficulty;
    const matchesType = selectedType === 'all' || q.type === selectedType;
    const matchesSearch = q.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          q.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (q.curriculumTag && q.curriculumTag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSub && matchesDiff && matchesType && matchesSearch;
  });

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(x => x !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const selectAllFiltered = () => {
    const ids = filtered.map(q => q.id);
    setSelectedIds(Array.from(new Set([...selectedIds, ...ids])));
  };

  const clearSelection = () => {
    setSelectedIds([]);
  };

  const handleAssembleExam = () => {
    const selectedList = bankQuestions.filter(q => selectedIds.includes(q.id));
    if (selectedList.length === 0) {
      alert('يرجى تحديد سؤال واحد على الأقل من البنك لتجميع الامتحان');
      return;
    }
    onAssembleExamFromQuestions(selectedList);
    onClose();
  };

  const handleBatchImportSuccess = (importedQuestions: BankQuestion[]) => {
    if (onBatchAddQuestions) {
      onBatchAddQuestions(importedQuestions);
    } else {
      importedQuestions.forEach(q => onAddQuestionToBank(q));
    }

    // Auto-select the newly imported questions so teacher can assemble an exam easily
    setSelectedIds(importedQuestions.map(q => q.id));
    setSuccessBanner(`تم بنجاح استيراد وتصنيف ${importedQuestions.length} سؤال وإضافتها إلى بنك الأسئلة! تم تحديدها تلقائياً.`);
    setActiveMode('browse');

    setTimeout(() => {
      setSuccessBanner(null);
    }, 6000);
  };

  const handleSaveNewQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim() || !newTopic.trim()) {
      alert('يرجى كتابة نص السؤال والموضوع');
      return;
    }

    const created: BankQuestion = {
      id: `bank-q-${Date.now()}`,
      subject: newSubject,
      topic: newTopic,
      text: newText,
      type: newType,
      options: newType === 'multiple_choice' ? newOptions : undefined,
      correctAnswer: newType === 'true_false' ? (newCorrectAnswer === 'خطأ' ? 'خطأ' : 'صح') : newCorrectAnswer,
      explanation: newExplanation || 'تم التحقق من الإجابة الصحيحة وفق المنهج المقرر.',
      points: Number(newPoints) || 5,
      difficulty: newDifficulty,
      usageCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
      curriculumTag: newCurriculumTag,
      media: newMediaAttachment === 'image' ? {
        type: 'image',
        url: newImageUrl,
        caption: 'مخطط داعم للسؤال من بنك الوسائط'
      } : newMediaAttachment === 'formula' ? {
        type: 'formula',
        formulaText: newFormulaText,
        caption: 'صيغة رياضية'
      } : newMediaAttachment === 'audio' ? {
        type: 'audio',
        audioPromptText: newAudioPrompt,
        caption: 'مقطع استماع صوتي'
      } : undefined
    };

    onAddQuestionToBank(created);
    setActiveMode('browse');
    setSuccessBanner(`تم حفظ السؤال "${created.topic}" في بنك الأسئلة بنجاح.`);

    // Reset form
    setNewText('');
    setNewTopic('');
    setNewExplanation('');

    setTimeout(() => {
      setSuccessBanner(null);
    }, 5000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 dark:bg-black/80 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-6xl max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 transition-colors">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-6 py-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/80 rounded-t-3xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-xs shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                بنك الأسئلة الأكاديمي المتطور (Question Bank)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                مستودع مصنف للأسئلة الشاملة مع وسائط متعددة ومفاتيح تصحيح وتجميع امتحانات فورية.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Mode switch tabs */}
            <div className="flex items-center p-1 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
              <button
                type="button"
                onClick={() => setActiveMode('browse')}
                className={`px-3 py-1.5 font-semibold rounded-lg transition-colors ${
                  activeMode === 'browse'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                تصفح الأسئلة ({bankQuestions.length})
              </button>

              <button
                type="button"
                onClick={() => setActiveMode('import_file')}
                className={`flex items-center gap-1.5 px-3 py-1.5 font-bold rounded-lg transition-colors ${
                  activeMode === 'import_file'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-700'
                }`}
              >
                <UploadCloud className="w-3.5 h-3.5" />
                <span>استيراد ملف Word / Text</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveMode('add_manual')}
                className={`flex items-center gap-1 px-3 py-1.5 font-semibold rounded-lg transition-colors ${
                  activeMode === 'add_manual'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>إضافة يدوي</span>
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Success Alert Banner if present */}
        {successBanner && (
          <div className="mx-6 mt-4 p-3.5 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-900 dark:text-emerald-200 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>{successBanner}</span>
            </div>
            <button
              type="button"
              onClick={() => setSuccessBanner(null)}
              className="text-emerald-700 dark:text-emerald-400 hover:text-emerald-900"
            >
              ✕
            </button>
          </div>
        )}

        {/* Toolbar & Filters (when in browse mode) */}
        {activeMode === 'browse' && (
          <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 transition-colors">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
              <input
                type="text"
                placeholder="ابحث في نص السؤال، الموضوع، المعيار المنهجي..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pr-10 pl-4 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={selectedSubject}
                onChange={e => setSelectedSubject(e.target.value as any)}
                className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-200 font-medium"
              >
                <option value="all">كافة المواد</option>
                {Object.entries(SUBJECT_METADATA).map(([k, v]) => (
                  <option key={k} value={k}>{v.nameAr}</option>
                ))}
              </select>

              <select
                value={selectedType}
                onChange={e => setSelectedType(e.target.value as any)}
                className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-200 font-medium"
              >
                <option value="all">كافة أنواع الأسئلة</option>
                <option value="multiple_choice">اختيار من متعدد (MCQ)</option>
                <option value="true_false">صح أو خطأ (True/False)</option>
                <option value="fill_blank">إكمال الفراغ (Short Answer)</option>
              </select>

              <select
                value={selectedDifficulty}
                onChange={e => setSelectedDifficulty(e.target.value as any)}
                className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-200 font-medium"
              >
                <option value="all">كافة الصعوبات</option>
                <option value="easy">سهل</option>
                <option value="medium">متوسط</option>
                <option value="hard">متقدم</option>
              </select>
            </div>
          </div>
        )}

        {/* Selected Questions Action Strip */}
        {activeMode === 'browse' && (
          <div className="px-6 py-3 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-xs transition-colors">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={selectedIds.length === filtered.length && filtered.length > 0 ? clearSelection : selectAllFiltered}
                className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-medium"
              >
                {selectedIds.length > 0 && selectedIds.length === filtered.length ? (
                  <CheckSquare className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                ) : (
                  <Square className="w-4 h-4 text-slate-400" />
                )}
                <span>تحديد الكل في هذه النتائج ({filtered.length})</span>
              </button>

              {selectedIds.length > 0 && (
                <span className="text-slate-400">·</span>
              )}

              {selectedIds.length > 0 && (
                <span className="font-semibold text-indigo-700 dark:text-indigo-300">
                  تم تحديد <strong className="font-mono text-indigo-900 dark:text-indigo-200">{selectedIds.length}</strong> أسئلة
                </span>
              )}
            </div>

            {selectedIds.length > 0 && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={clearSelection}
                  className="px-3 py-1 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                >
                  إلغاء التحديد
                </button>
                <button
                  type="button"
                  onClick={handleAssembleExam}
                  className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-all active:scale-95"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>تجميع امتحان جديد من الأسئلة المحددة ({selectedIds.length})</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Main Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Mode 1: Batch Import from Word/Text File */}
          {activeMode === 'import_file' && (
            <BatchQuestionImporter
              onImportSuccess={handleBatchImportSuccess}
              onCancel={() => setActiveMode('browse')}
            />
          )}

          {/* Mode 2: Manual Single Question Form */}
          {activeMode === 'add_manual' && (
            <form onSubmit={handleSaveNewQuestion} className="max-w-3xl mx-auto space-y-5 bg-slate-50 dark:bg-slate-800/40 p-6 rounded-3xl border border-slate-200 dark:border-slate-800">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">بيانات السؤال الجديد لبنك الأسئلة</h3>
                <span className="text-xs text-slate-500 dark:text-slate-400">سيتم حفظ السؤال في المستودع لاستخدامه وتضمينه في أي امتحانات مستقبلية.</span>
              </div>

              {/* Meta selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">المادة الدراسية *</label>
                  <select
                    value={newSubject}
                    onChange={e => setNewSubject(e.target.value as Subject)}
                    className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  >
                    {Object.entries(SUBJECT_METADATA).map(([k, v]) => (
                      <option key={k} value={k}>{v.nameAr}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">الموضوع العلمي / المحور *</label>
                  <input
                    type="text"
                    required
                    value={newTopic}
                    onChange={e => setNewTopic(e.target.value)}
                    placeholder="مثال: قوانين الحركة والسرعة"
                    className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">المرحلة الدراسية / المعيار</label>
                  <input
                    type="text"
                    value={newCurriculumTag}
                    onChange={e => setNewCurriculumTag(e.target.value)}
                    placeholder="مثال: الصف الأول الثانوي"
                    className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">نوع السؤال *</label>
                  <select
                    value={newType}
                    onChange={e => setNewType(e.target.value as QuestionType)}
                    className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  >
                    <option value="multiple_choice">اختيار من متعدد (MCQ)</option>
                    <option value="true_false">صح أو خطأ (True/False)</option>
                    <option value="fill_blank">إكمال الفراغ (Short Answer)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">درجة الصعوبة</label>
                  <select
                    value={newDifficulty}
                    onChange={e => setNewDifficulty(e.target.value as Difficulty)}
                    className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  >
                    <option value="easy">سهل (تأسيسي)</option>
                    <option value="medium">متوسط (تطبيقي)</option>
                    <option value="hard">متقدم (تحليلي)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">الدرجة المخصصة</label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={newPoints}
                    onChange={e => setNewPoints(Number(e.target.value) || 1)}
                    className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-mono tabular-nums text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Question Text */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">صيغة السؤال الكاملة *</label>
                <textarea
                  rows={2}
                  required
                  value={newText}
                  onChange={e => setNewText(e.target.value)}
                  placeholder="اكتب نص السؤال بوضوح..."
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              {/* Options & Answers by type */}
              {newType === 'multiple_choice' && (
                <div className="space-y-2 bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">خيارات الإجابة وحدد الإجابة النموذجية:</label>
                  {newOptions.map((opt, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="new-ans-choice"
                        checked={newCorrectAnswer === opt}
                        onChange={() => setNewCorrectAnswer(opt)}
                        className="w-4 h-4 text-indigo-600"
                        title="تعيين كإجابة نموذجية"
                      />
                      <input
                        type="text"
                        value={opt}
                        onChange={e => {
                          const updated = [...newOptions];
                          updated[i] = e.target.value;
                          setNewOptions(updated);
                        }}
                        className="flex-1 px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                      />
                    </div>
                  ))}
                </div>
              )}

              {newType === 'true_false' && (
                <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center gap-8">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">الإجابة الصحيحة:</span>
                  <label className="flex items-center gap-2 text-xs cursor-pointer font-bold text-slate-900 dark:text-white">
                    <input
                      type="radio"
                      name="new-tf-ans"
                      checked={newCorrectAnswer === 'صح'}
                      onChange={() => setNewCorrectAnswer('صح')}
                      className="w-4 h-4 text-indigo-600"
                    />
                    <span>صح</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs cursor-pointer font-bold text-slate-900 dark:text-white">
                    <input
                      type="radio"
                      name="new-tf-ans"
                      checked={newCorrectAnswer === 'خطأ'}
                      onChange={() => setNewCorrectAnswer('خطأ')}
                      className="w-4 h-4 text-indigo-600"
                    />
                    <span>خطأ</span>
                  </label>
                </div>
              )}

              {newType === 'fill_blank' && (
                <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">الإجابة النموذجية القصيرة (كلمة أو عبارة):</label>
                  <input
                    type="text"
                    value={newCorrectAnswer}
                    onChange={e => setNewCorrectAnswer(e.target.value)}
                    placeholder="مثال: البلاستيدات الخضراء أو 10 سم"
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
              )}

              {/* Multimedia Attachment */}
              <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">إرفاق وسائط تعليمية داعمة للسؤال:</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setNewMediaAttachment(newMediaAttachment === 'image' ? 'none' : 'image')}
                      className={`flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg border ${
                        newMediaAttachment === 'image' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span>مخطط / صورة</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setNewMediaAttachment(newMediaAttachment === 'formula' ? 'none' : 'formula')}
                      className={`flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg border ${
                        newMediaAttachment === 'formula' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      <Sigma className="w-3.5 h-3.5" />
                      <span>معادلة</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setNewMediaAttachment(newMediaAttachment === 'audio' ? 'none' : 'audio')}
                      className={`flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg border ${
                        newMediaAttachment === 'audio' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>استماع صوتي</span>
                    </button>
                  </div>
                </div>

                {newMediaAttachment === 'image' && (
                  <select
                    value={newImageUrl}
                    onChange={e => setNewImageUrl(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  >
                    <option value="/src/assets/images/diagram_human_heart_1793036033179.jpg">مخطط تشريح القلب وتدفق الدم</option>
                    <option value="/src/assets/images/diagram_plant_cell_1793036035691.jpg">مخطط بنية الخلية النباتية وعضياتها</option>
                    <option value="/src/assets/images/diagram_geometry_triangle_1793036035504.jpg">مخطط مبرهنة فيثاغورس الهندسي</option>
                  </select>
                )}

                {newMediaAttachment === 'formula' && (
                  <input
                    type="text"
                    value={newFormulaText}
                    onChange={e => setNewFormulaText(e.target.value)}
                    placeholder="مثال: E = mc^2 أو a^2 + b^2 = c^2"
                    className="w-full px-3 py-2 text-xs font-mono bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                )}

                {newMediaAttachment === 'audio' && (
                  <input
                    type="text"
                    value={newAudioPrompt}
                    onChange={e => setNewAudioPrompt(e.target.value)}
                    placeholder="اكتب النص الذي سيتم قراءته ونطقه صوتياً للطلاب..."
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                )}
              </div>

              {/* Pedagogical Explanation */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  الشرح التوضيحي للحل النموذجي (للتصحيح الآلي الفوري)
                </label>
                <textarea
                  rows={2}
                  value={newExplanation}
                  onChange={e => setNewExplanation(e.target.value)}
                  placeholder="اشرح خطوة بخطوة سبب صحة الإجابة لتظهر للطالب في تقرير أدائه..."
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setActiveMode('browse')}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  إلغاء التراجع
                </button>

                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-6 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-all active:scale-95"
                >
                  <Save className="w-4 h-4" />
                  <span>حفظ السؤال في بنك الأسئلة</span>
                </button>
              </div>
            </form>
          )}

          {/* Mode 3: Browse Questions Grid / List */}
          {activeMode === 'browse' && (
            filtered.length === 0 ? (
              <div className="py-16 text-center rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-3">
                  <Layers className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">بنك الأسئلة فارغ حالياً (0 سؤال)</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-1 mb-5">
                  يمكنك استيراد عشرات الأسئلة دفعة واحدة برفع ملف Word أو ملف نصي، أو إدخال أسئلتك يدوياً.
                </p>
                <div className="flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveMode('import_file')}
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-all active:scale-95"
                  >
                    <UploadCloud className="w-4 h-4" />
                    <span>استيراد أسئلة من ملف Word / Text</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveMode('add_manual')}
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl transition-colors"
                  >
                    <Plus className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span>إضافة سؤال يدوي</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {filtered.map(q => {
                  const isSelected = selectedIds.includes(q.id);
                  const subMeta = SUBJECT_METADATA[q.subject];

                  return (
                    <div
                      key={q.id}
                      onClick={() => toggleSelect(q.id)}
                      className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-indigo-500 bg-indigo-50/30 dark:bg-indigo-950/30 ring-1 ring-indigo-500 shadow-xs'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 flex-1">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleSelect(q.id);
                            }}
                            className="mt-0.5 text-indigo-600 dark:text-indigo-400"
                          >
                            {isSelected ? (
                              <CheckSquare className="w-5 h-5 fill-indigo-600 text-white" />
                            ) : (
                              <Square className="w-5 h-5 text-slate-300 dark:text-slate-600" />
                            )}
                          </button>

                          <div className="space-y-1.5 flex-1">
                            <div className="flex flex-wrap items-center gap-2 text-xs">
                              <span className="font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-md">
                                {subMeta?.nameAr || q.subject}
                              </span>
                              <span className="text-slate-400">·</span>
                              <span className="text-slate-600 dark:text-slate-300 font-semibold">{q.topic}</span>
                              <span className="text-slate-400">·</span>
                              <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                                q.difficulty === 'easy' ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300' : q.difficulty === 'medium' ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300' : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300'
                              }`}>
                                {q.difficulty === 'easy' ? 'سهل' : q.difficulty === 'medium' ? 'متوسط' : 'متقدم'}
                              </span>
                              {q.curriculumTag && (
                                <span className="text-slate-400 text-[11px]">[{q.curriculumTag}]</span>
                              )}
                            </div>

                            <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-relaxed">
                              {q.text}
                            </h4>

                            {/* Options if MCQ */}
                            {q.options && (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs text-slate-600 dark:text-slate-300">
                                {q.options.map((opt, oIdx) => (
                                  <div
                                    key={oIdx}
                                    className={`p-2 rounded-lg border text-[11px] ${
                                      opt === q.correctAnswer ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700 font-bold text-emerald-900 dark:text-emerald-200' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                                    }`}
                                  >
                                    {opt}
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Explanation snippet */}
                            <div className="text-[11px] text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/70 p-2 rounded-lg mt-2 flex items-center justify-between">
                              <span>
                                <strong>الإجابة المعتمدة: </strong>
                                <span className="text-emerald-700 dark:text-emerald-400 font-semibold">{String(q.correctAnswer)}</span>
                                {q.explanation && ` — ${q.explanation}`}
                              </span>
                              <span className="text-slate-400 font-mono text-[10px] shrink-0 mr-2">
                                استُخدم {q.usageCount} مرة
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="text-left shrink-0">
                          <span className="font-mono text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-lg">
                            {q.points} درجات
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};
