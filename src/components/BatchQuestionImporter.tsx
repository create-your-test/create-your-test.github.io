import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  FileText, 
  FileCode, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Trash2, 
  Edit3, 
  Download, 
  HelpCircle,
  Layers,
  ArrowRight,
  BookOpen,
  Check,
  ChevronDown,
  Loader2
} from 'lucide-react';
import { BankQuestion, Difficulty, QuestionType, Subject } from '../types/exam';
import { SUBJECT_METADATA } from '../data/mockData';
import { 
  extractTextFromFile, 
  parseAndClassifyQuestions, 
  getSampleQuestionTextTemplate 
} from '../utils/questionBatchParser';

interface BatchQuestionImporterProps {
  onImportSuccess: (importedQuestions: BankQuestion[]) => void;
  onCancel: () => void;
}

export const BatchQuestionImporter: React.FC<BatchQuestionImporterProps> = ({
  onImportSuccess,
  onCancel
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'paste'>('upload');
  const [isProcessing, setIsProcessing] = useState(false);
  const [pastedText, setPastedText] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [defaultSubject, setDefaultSubject] = useState<Subject | 'auto'>('auto');
  const [defaultGradeLevel, setDefaultGradeLevel] = useState('المرحلة الثانوية');
  const [parsedQuestions, setParsedQuestions] = useState<BankQuestion[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const processTextContent = (rawText: string, fileName?: string) => {
    setIsProcessing(true);
    setErrorMessage(null);

    try {
      if (!rawText.trim()) {
        setErrorMessage('الملف أو النص المدخل فارغ. يرجى التأكد من احتواء الملف على نصوص.');
        setIsProcessing(false);
        return;
      }

      const fallbackSub = defaultSubject === 'auto' ? 'biology' : defaultSubject;
      const questions = parseAndClassifyQuestions(rawText, fallbackSub, defaultGradeLevel);

      if (questions.length === 0) {
        setErrorMessage('لم يتم العثور على صيغ أسئلة متعرف عليها. تأكد من ترقيم الأسئلة (س1: أو 1.) أو راجع النموذج الإرشادي.');
      } else {
        setParsedQuestions(questions);
        if (fileName) setUploadedFileName(fileName);
      }
    } catch (err: any) {
      console.error('Batch parse error:', err);
      setErrorMessage(`حدث خطأ أثناء معالجة الملف: ${err.message || 'تأكد من سلامة ملف Word/Text'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    setIsProcessing(true);
    setErrorMessage(null);

    const validExtensions = ['.docx', '.txt', '.md', '.csv'];
    const hasValidExt = validExtensions.some(ext => file.name.toLowerCase().endsWith(ext));

    if (!hasValidExt) {
      setErrorMessage('صيغة الملف غير مدعومة. يرجى رفع ملفات Word بصيغة (.docx) أو ملفات نصية (.txt / .md / .csv).');
      setIsProcessing(false);
      return;
    }

    try {
      const extractedText = await extractTextFromFile(file);
      processTextContent(extractedText, file.name);
    } catch (err: any) {
      console.error('File extraction failed:', err);
      setErrorMessage('تعذر قراءة ملف Word. يرجى التأكد من أن الملف ليس تالفاً أو محمي بكلمة مرور.');
      setIsProcessing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handlePasteSubmit = () => {
    if (!pastedText.trim()) {
      setErrorMessage('يرجى لصق نصوص الأسئلة أولاً.');
      return;
    }
    processTextContent(pastedText, 'نص ملصوق يدوياً');
  };

  const handleLoadSample = () => {
    const sample = getSampleQuestionTextTemplate();
    setPastedText(sample);
    setActiveTab('paste');
    processTextContent(sample, 'نموذج أسئلة تجريبي');
  };

  const handleDownloadSampleFile = () => {
    const sample = getSampleQuestionTextTemplate();
    const blob = new Blob([sample], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'نموذج_استيراد_الأسئلة_لبنك_الأسئلة.txt';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleUpdateQuestion = (index: number, updated: Partial<BankQuestion>) => {
    setParsedQuestions(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], ...updated };
      return copy;
    });
  };

  const handleDeleteQuestion = (index: number) => {
    setParsedQuestions(prev => prev.filter((_, i) => i !== index));
  };

  const handleConfirmImport = () => {
    if (parsedQuestions.length === 0) return;
    onImportSuccess(parsedQuestions);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Instructions */}
      <div className="bg-indigo-50/80 dark:bg-indigo-950/40 p-4 sm:p-5 rounded-2xl border border-indigo-200 dark:border-indigo-800/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              الاستيراد الذكي للأسئلة من ملفات Word & Text
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
              يقوم المحرك الذكي بقراءة مستنداتك واستخراج الأسئلة وتصنيف المادة، نوع السؤال، والخيارات ومفتاح الإجابة تلقائياً.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
          <button
            type="button"
            onClick={handleDownloadSampleFile}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-white dark:bg-slate-800 hover:bg-indigo-100 dark:hover:bg-slate-700 rounded-xl border border-indigo-200 dark:border-indigo-800 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>تحميل ملف نموذجي (.txt)</span>
          </button>

          <button
            type="button"
            onClick={handleLoadSample}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors"
          >
            <FileText className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>تجربة نموذج جاهز</span>
          </button>
        </div>
      </div>

      {/* Upload & Paste Tabs */}
      {parsedQuestions.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-6">
          <div className="flex border-b border-slate-200 dark:border-slate-800 pb-3 gap-6 text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveTab('upload')}
              className={`flex items-center gap-2 pb-2 transition-colors ${
                activeTab === 'upload'
                  ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <UploadCloud className="w-4 h-4" />
              <span>رفع ملف Word (.docx) أو نص (.txt / .md)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('paste')}
              className={`flex items-center gap-2 pb-2 transition-colors ${
                activeTab === 'paste'
                  ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <FileCode className="w-4 h-4" />
              <span>لصق نصوص الأسئلة مباشرة</span>
            </button>
          </div>

          {/* Configuration options for auto-classification */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-100 dark:border-slate-700/60 text-xs">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                التصنيف الآلي للمادة الدراسية:
              </label>
              <select
                value={defaultSubject}
                onChange={e => setDefaultSubject(e.target.value as any)}
                className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200"
              >
                <option value="auto">✨ تعرّف ذكي تلقائي على المادة حسب محتوى السؤال</option>
                {Object.entries(SUBJECT_METADATA).map(([k, v]) => (
                  <option key={k} value={k}>تثبيت المادة: {v.nameAr}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                المرحلة الدراسية الافتراضية للأسئلة:
              </label>
              <input
                type="text"
                value={defaultGradeLevel}
                onChange={e => setDefaultGradeLevel(e.target.value)}
                placeholder="مثال: الصف الأول الثانوي"
                className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200"
              />
            </div>
          </div>

          {/* Tab Content: Upload */}
          {activeTab === 'upload' && (
            <div
              onDragOver={e => { e.preventDefault(); setIsDragOver(true); }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                isDragOver
                  ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30'
                  : 'border-slate-300 dark:border-slate-700 hover:border-indigo-400 bg-slate-50/50 dark:bg-slate-800/30'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".docx,.txt,.md,.csv"
                className="hidden"
                onChange={e => {
                  if (e.target.files && e.target.files.length > 0) {
                    handleFileUpload(e.target.files[0]);
                  }
                }}
              />

              <div className="w-14 h-14 rounded-2xl bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-3">
                {isProcessing ? (
                  <Loader2 className="w-7 h-7 animate-spin" />
                ) : (
                  <UploadCloud className="w-7 h-7" />
                )}
              </div>

              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                {isProcessing ? 'جارٍ قراءة واستخراج الأسئلة من الملف...' : 'اسحب وأفلت ملف الأسئلة هنا، أو اضغط للتصفح'}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                يدعم مستندات Microsoft Word (.docx) والملفات النصية (.txt, .md, .csv) المكتوبة باللغة العربية والإنجليزية.
              </p>
            </div>
          )}

          {/* Tab Content: Paste */}
          {activeTab === 'paste' && (
            <div className="space-y-4">
              <textarea
                rows={9}
                value={pastedText}
                onChange={e => setPastedText(e.target.value)}
                placeholder="الصق نصوص الأسئلة هنا... مثال:&#10;س1: ما هي العضية المسؤولة عن إنتاج الطاقة في الخلية؟&#10;أ) النواة&#10;ب) الميتوكوندريا *&#10;ج) الريبوسومات&#10;د) جهاز جولجي&#10;الإجابة: ب&#10;الموضوع: علم الخلية"
                className="w-full p-4 text-xs font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handlePasteSubmit}
                  disabled={isProcessing}
                  className="flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-xl shadow-xs transition-all active:scale-95"
                >
                  {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  <span>معالجة وتصنيف الأسئلة آلياً</span>
                </button>
              </div>
            </div>
          )}

          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3.5 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 rounded-xl text-rose-800 dark:text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>
      ) : (
        /* Parsed Questions Review & Confirmation Screen */
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  تم استخراج وتصنيف {parsedQuestions.length} سؤال بنجاح
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {uploadedFileName ? `من الملف: ${uploadedFileName}` : 'من النص المدخل'} · يمكنك مراجعة الأسئلة وتعديل أي خيار قبل حفظها في بنك الأسئلة.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setParsedQuestions([]);
                  setUploadedFileName(null);
                }}
                className="px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors"
              >
                رفع ملف آخر
              </button>

              <button
                type="button"
                onClick={handleConfirmImport}
                className="flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-all active:scale-95"
              >
                <Check className="w-4 h-4" />
                <span>اعتماد واستيراد كافة الأسئلة ({parsedQuestions.length})</span>
              </button>
            </div>
          </div>

          {/* Cards for each parsed question */}
          <div className="space-y-4 max-h-[55vh] overflow-y-auto pr-1">
            {parsedQuestions.map((q, idx) => {
              const subjectInfo = SUBJECT_METADATA[q.subject];

              return (
                <div
                  key={q.id}
                  className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-2.5 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md text-slate-700 dark:text-slate-300">
                        سؤال #{idx + 1}
                      </span>

                      {/* Subject selector */}
                      <select
                        value={q.subject}
                        onChange={e => handleUpdateQuestion(idx, { subject: e.target.value as Subject })}
                        className="px-2 py-1 text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 rounded-lg border border-indigo-200 dark:border-indigo-800"
                      >
                        {Object.entries(SUBJECT_METADATA).map(([k, v]) => (
                          <option key={k} value={k}>{v.nameAr}</option>
                        ))}
                      </select>

                      {/* Type selector */}
                      <select
                        value={q.type}
                        onChange={e => handleUpdateQuestion(idx, { type: e.target.value as QuestionType })}
                        className="px-2 py-1 text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg border border-slate-200 dark:border-slate-700"
                      >
                        <option value="multiple_choice">اختيار من متعدد</option>
                        <option value="true_false">صح أو خطأ</option>
                        <option value="fill_blank">إكمال الفراغ / مقالي</option>
                      </select>

                      {/* Difficulty selector */}
                      <select
                        value={q.difficulty}
                        onChange={e => handleUpdateQuestion(idx, { difficulty: e.target.value as Difficulty })}
                        className="px-2 py-1 text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg border border-slate-200 dark:border-slate-700"
                      >
                        <option value="easy">سهل</option>
                        <option value="medium">متوسط</option>
                        <option value="hard">صعب</option>
                      </select>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteQuestion(idx)}
                      title="حذف هذا السؤال من قائمة الاستيراد"
                      className="p-1 text-slate-400 hover:text-rose-600 transition-colors rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Question Text input */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">نص السؤال:</label>
                    <textarea
                      rows={2}
                      value={q.text}
                      onChange={e => handleUpdateQuestion(idx, { text: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                    />
                  </div>

                  {/* Multiple choice options */}
                  {q.type === 'multiple_choice' && q.options && (
                    <div className="space-y-2 pt-1">
                      <label className="block text-[11px] font-semibold text-slate-500">
                        الخيارات (حدد الخيار الصحيح بالنقر على الدائرة):
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {q.options.map((opt, oIdx) => {
                          const isCorrect = q.correctAnswer === opt;
                          return (
                            <div
                              key={oIdx}
                              onClick={() => handleUpdateQuestion(idx, { correctAnswer: opt })}
                              className={`flex items-center gap-2 p-2 rounded-xl border text-xs cursor-pointer transition-all ${
                                isCorrect
                                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400 dark:border-emerald-700 text-emerald-950 dark:text-emerald-200 font-semibold'
                                  : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                              }`}
                            >
                              <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                                isCorrect ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-slate-400'
                              }`}>
                                {isCorrect && <Check className="w-3 h-3 stroke-[3]" />}
                              </div>
                              <input
                                type="text"
                                value={opt}
                                onChange={e => {
                                  const updatedOpts = [...q.options!];
                                  updatedOpts[oIdx] = e.target.value;
                                  handleUpdateQuestion(idx, {
                                    options: updatedOpts,
                                    correctAnswer: isCorrect ? e.target.value : q.correctAnswer
                                  });
                                }}
                                onClick={e => e.stopPropagation()}
                                className="w-full bg-transparent border-none text-xs focus:outline-hidden"
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* True / False selection */}
                  {q.type === 'true_false' && (
                    <div className="flex items-center gap-4 text-xs font-bold pt-1">
                      <span className="text-slate-500 font-normal">الإجابة المحددة:</span>
                      <button
                        type="button"
                        onClick={() => handleUpdateQuestion(idx, { correctAnswer: 'صح' })}
                        className={`px-4 py-1.5 rounded-xl border transition-all ${
                          q.correctAnswer === 'صح'
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                            : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        صح
                      </button>
                      <button
                        type="button"
                        onClick={() => handleUpdateQuestion(idx, { correctAnswer: 'خطأ' })}
                        className={`px-4 py-1.5 rounded-xl border transition-all ${
                          q.correctAnswer === 'خطأ'
                            ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                            : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        خطأ
                      </button>
                    </div>
                  )}

                  {/* Topic and Explanation row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 mb-0.5">الموضوع / المحور:</label>
                      <input
                        type="text"
                        value={q.topic}
                        onChange={e => handleUpdateQuestion(idx, { topic: e.target.value })}
                        className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 mb-0.5">الشرح والتفسير النموذجي:</label>
                      <input
                        type="text"
                        value={q.explanation}
                        onChange={e => handleUpdateQuestion(idx, { explanation: e.target.value })}
                        className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 text-xs"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
