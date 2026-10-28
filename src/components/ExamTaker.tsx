import React, { useState, useEffect, useRef } from 'react';
import { 
  Clock, 
  Flag, 
  ChevronRight, 
  ChevronLeft, 
  Send, 
  CheckCircle, 
  AlertCircle,
  HelpCircle,
  Maximize2,
  FileText,
  X,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Exam, ExamSubmission } from '../types/exam';
import { AudioPlayerWidget } from './AudioPlayerWidget';
import { FormulaRenderer } from './FormulaRenderer';
import { gradeSubmission } from '../utils/grading';

interface ExamTakerProps {
  exam: Exam;
  studentInfo: { id: string; name: string; email: string };
  onFinishExam: (submission: ExamSubmission) => void;
  onExit: () => void;
}

export const ExamTaker: React.FC<ExamTakerProps> = ({
  exam,
  studentInfo,
  onFinishExam,
  onExit
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, { answer: any; timeSpentSeconds: number }>>({});
  const [flagged, setFlagged] = useState<Record<string, boolean>>({});
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(exam.timeLimitMinutes * 60);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [scratchpadText, setScratchpadText] = useState('');
  const [isScratchpadOpen, setIsScratchpadOpen] = useState(false);
  const [isZoomImageOpen, setIsZoomImageOpen] = useState(false);

  // Time spent per question tracking
  const currentQuestionStartRef = useRef<number>(Date.now());

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeftSeconds(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinalSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const currentQ = exam.questions[currentIdx];

  const recordTimeSpent = () => {
    const elapsed = Math.round((Date.now() - currentQuestionStartRef.current) / 1000);
    const existing = answers[currentQ.id]?.timeSpentSeconds || 0;
    return existing + Math.max(1, elapsed);
  };

  const handleSelectAnswer = (ans: any) => {
    const timeSpent = recordTimeSpent();
    currentQuestionStartRef.current = Date.now();
    setAnswers(prev => ({
      ...prev,
      [currentQ.id]: { answer: ans, timeSpentSeconds: timeSpent }
    }));
  };

  const handleToggleMultiSelect = (optionText: string) => {
    const current = (answers[currentQ.id]?.answer as string[]) || [];
    let next: string[];
    if (current.includes(optionText)) {
      next = current.filter(x => x !== optionText);
    } else {
      next = [...current, optionText];
    }
    handleSelectAnswer(next);
  };

  const handleToggleFlag = () => {
    setFlagged(prev => ({ ...prev, [currentQ.id]: !prev[currentQ.id] }));
  };

  const goToNext = () => {
    if (currentIdx < exam.questions.length - 1) {
      currentQuestionStartRef.current = Date.now();
      setCurrentIdx(currentIdx + 1);
    }
  };

  const goToPrev = () => {
    if (currentIdx > 0) {
      currentQuestionStartRef.current = Date.now();
      setCurrentIdx(currentIdx - 1);
    }
  };

  const handleFinalSubmit = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }

    const submission = gradeSubmission(exam, answers, studentInfo);
    onFinishExam(submission);
  };

  // Format timer mm:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const answeredCount = Object.keys(answers).filter(k => answers[k]?.answer !== null && answers[k]?.answer !== undefined && answers[k]?.answer !== '').length;
  const progressPercent = Math.round((answeredCount / exam.questions.length) * 100);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Sticky Testing Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onExit}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              خروج من الاختبار
            </button>
            <div className="border-r border-slate-200 pr-3 mr-1">
              <h1 className="text-sm font-bold text-slate-900 truncate max-w-xs md:max-w-md">
                {exam.title}
              </h1>
              <span className="text-[11px] text-slate-500 font-medium">
                {studentInfo.name} · {exam.gradeLevel}
              </span>
            </div>
          </div>

          {/* Center Timer */}
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border font-mono text-sm font-bold tabular-nums transition-colors ${
            timeLeftSeconds < 120 
              ? 'bg-rose-50 text-rose-600 border-rose-300 animate-pulse' 
              : timeLeftSeconds < 300 
              ? 'bg-amber-50 text-amber-700 border-amber-300' 
              : 'bg-slate-50 text-slate-700 border-slate-200'
          }`}>
            <Clock className="w-4 h-4 text-slate-500" />
            <span>{formatTime(timeLeftSeconds)}</span>
          </div>

          {/* Action Right */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsScratchpadOpen(!isScratchpadOpen)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                isScratchpadOpen ? 'bg-indigo-50 border-indigo-300 text-indigo-700' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">مسودة الحسابات</span>
            </button>

            <button
              type="button"
              onClick={() => setIsSubmitModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>تسليم الاختبار</span>
            </button>
          </div>
        </div>

        {/* Linear Progress Bar */}
        <div className="w-full bg-slate-200 h-1">
          <div 
            className="bg-indigo-600 h-1 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </header>

      {/* Main Examination Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Left 3 Cols: Question Details */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm relative">
            {/* Question Top Info */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 text-sm font-bold flex items-center justify-center">
                  {currentIdx + 1}
                </span>
                <div>
                  <span className="text-xs font-semibold text-slate-500">
                    السؤال {currentIdx + 1} من {exam.questions.length}
                  </span>
                  <span className="mx-2 text-slate-300">·</span>
                  <span className="text-xs text-slate-600 font-medium">الموضوع: {currentQ.topic}</span>
                  <span className="mx-2 text-slate-300">·</span>
                  <span className="text-xs font-mono text-indigo-600 font-bold tabular-nums">
                    {currentQ.points} درجات
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleToggleFlag}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                  flagged[currentQ.id]
                    ? 'bg-amber-100 text-amber-800 font-semibold'
                    : 'text-slate-500 hover:bg-slate-100'
                }`}
              >
                <Flag className={`w-3.5 h-3.5 ${flagged[currentQ.id] ? 'fill-amber-600 text-amber-600' : ''}`} />
                <span>{flagged[currentQ.id] ? 'تم التحديد للمراجعة' : 'تحديد للمراجعة'}</span>
              </button>
            </div>

            {/* Question Body */}
            <div className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed mb-6">
              {currentQ.text}
            </div>

            {/* Multimedia Support */}
            {currentQ.media && (
              <div className="mb-6">
                {currentQ.media.type === 'image' && currentQ.media.url && (
                  <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-50 p-2">
                    <div className="relative group max-h-96 flex items-center justify-center bg-white rounded-lg overflow-hidden">
                      <img
                        src={currentQ.media.url}
                        alt={currentQ.media.caption || 'مخطط توضيحي للسؤال'}
                        referrerPolicy="no-referrer"
                        className="max-h-96 w-auto object-contain transition-transform group-hover:scale-102"
                      />
                      <button
                        type="button"
                        onClick={() => setIsZoomImageOpen(true)}
                        className="absolute bottom-3 left-3 bg-slate-900/80 text-white p-2 rounded-lg text-xs flex items-center gap-1 backdrop-blur-xs opacity-90 hover:opacity-100 transition-opacity"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                        <span>تكبير المخطط</span>
                      </button>
                    </div>
                    {currentQ.media.caption && (
                      <p className="text-xs text-slate-500 text-center mt-2 font-medium">
                        {currentQ.media.caption}
                      </p>
                    )}
                  </div>
                )}

                {currentQ.media.type === 'audio' && (
                  <AudioPlayerWidget
                    promptText={currentQ.media.audioPromptText || ''}
                    caption={currentQ.media.caption}
                    lang={exam.subject === 'english' ? 'en-US' : 'ar-SA'}
                  />
                )}

                {currentQ.media.type === 'formula' && (
                  <FormulaRenderer
                    formulaText={currentQ.media.formulaText || ''}
                    caption={currentQ.media.caption}
                  />
                )}
              </div>
            )}

            {/* Interactive Answer Input by Type */}
            <div className="space-y-3 pt-2">
              {/* 1. Multiple Choice */}
              {currentQ.type === 'multiple_choice' && (
                <div className="space-y-2.5">
                  {currentQ.options?.map((option, oIdx) => {
                    const isSelected = answers[currentQ.id]?.answer === option;
                    return (
                      <button
                        key={oIdx}
                        type="button"
                        onClick={() => handleSelectAnswer(option)}
                        className={`w-full text-right p-4 rounded-xl border transition-all flex items-center gap-3.5 ${
                          isSelected
                            ? 'bg-indigo-50/70 border-indigo-500 ring-1 ring-indigo-500 font-semibold text-indigo-950'
                            : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800 hover:bg-slate-50/60'
                        }`}
                      >
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                          isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {String.fromCharCode(65 + oIdx)}
                        </span>
                        <span className="flex-1 text-sm">{option}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* 2. True / False */}
              {currentQ.type === 'true_false' && (
                <div className="grid grid-cols-2 gap-4">
                  {['صح', 'خطأ'].map((option) => {
                    const isSelected = answers[currentQ.id]?.answer === option;
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => handleSelectAnswer(option)}
                        className={`p-5 rounded-xl border text-center transition-all ${
                          isSelected
                            ? 'bg-indigo-50/80 border-indigo-500 ring-2 ring-indigo-500 text-indigo-900 font-bold'
                            : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800 hover:bg-slate-50'
                        }`}
                      >
                        <span className="text-base font-bold">{option}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* 3. Multi Select */}
              {currentQ.type === 'multi_select' && (
                <div className="space-y-2.5">
                  <span className="text-xs text-indigo-700 font-semibold block mb-1">
                    * اختر كل الإجابات الصحيحة التي تنطبق:
                  </span>
                  {currentQ.options?.map((option, oIdx) => {
                    const selectedArr = (answers[currentQ.id]?.answer as string[]) || [];
                    const isSelected = selectedArr.includes(option);
                    return (
                      <button
                        key={oIdx}
                        type="button"
                        onClick={() => handleToggleMultiSelect(option)}
                        className={`w-full text-right p-3.5 rounded-xl border transition-all flex items-center gap-3.5 ${
                          isSelected
                            ? 'bg-indigo-50/70 border-indigo-500 ring-1 ring-indigo-500 font-semibold text-indigo-950'
                            : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800 hover:bg-slate-50/60'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 border ${
                          isSelected ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300 bg-white'
                        }`}>
                          {isSelected && <CheckCircle className="w-3.5 h-3.5" />}
                        </div>
                        <span className="flex-1 text-sm">{option}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* 4. Fill in the Blank */}
              {currentQ.type === 'fill_blank' && (
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <label className="block text-xs font-semibold text-slate-700 mb-2">
                    اكتب إجابتك المباشرة هنا للتصحيح التلقائي:
                  </label>
                  <input
                    type="text"
                    value={answers[currentQ.id]?.answer || ''}
                    onChange={e => handleSelectAnswer(e.target.value)}
                    placeholder="اكتب الإجابة باختصار ودقة..."
                    className="w-full px-4 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    ملاحظة: النظام الذكي يتعرف على صيغ الكلمات المختلفة وتغيرات الهمزات.
                  </span>
                </div>
              )}
            </div>

            {/* Bottom Next/Prev Bar */}
            <div className="flex items-center justify-between pt-6 mt-8 border-t border-slate-100">
              <button
                type="button"
                onClick={goToPrev}
                disabled={currentIdx === 0}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:hover:bg-slate-100 rounded-lg transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
                <span>السؤال السابق</span>
              </button>

              {currentIdx === exam.questions.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setIsSubmitModalOpen(true)}
                  className="flex items-center gap-2 px-6 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>مراجعة وتسليم الاختبار</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={goToNext}
                  className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
                >
                  <span>السؤال التالي</span>
                  <ChevronLeft className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Question Navigation Palette & Scratchpad */}
        <div className="space-y-4">
          {/* Question Grid Palette */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
              <h3 className="text-xs font-bold text-slate-900">خريطة أسئلة الاختبار</h3>
              <span className="text-xs font-mono text-slate-500 tabular-nums">
                {answeredCount}/{exam.questions.length} مُجاب
              </span>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {exam.questions.map((q, idx) => {
                const isCurrent = idx === currentIdx;
                const isAnswered = answers[q.id]?.answer !== undefined && answers[q.id]?.answer !== null && answers[q.id]?.answer !== '';
                const isFlagged = flagged[q.id];

                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => {
                      currentQuestionStartRef.current = Date.now();
                      setCurrentIdx(idx);
                    }}
                    className={`relative h-10 rounded-xl text-xs font-bold transition-all flex items-center justify-center ${
                      isCurrent
                        ? 'ring-2 ring-indigo-600 bg-indigo-600 text-white shadow-sm'
                        : isAnswered
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                        : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span>{idx + 1}</span>
                    {isFlagged && (
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-500 rounded-full border border-white" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500 mt-4 pt-3 border-t border-slate-100">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-emerald-500" />
                <span>تمت الإجابة</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-slate-200" />
                <span>لم يُجب بعد</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-indigo-600" />
                <span>السؤال الحالي</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span>محدد للمراجعة</span>
              </div>
            </div>
          </div>

          {/* Scratchpad Card */}
          {isScratchpadOpen && (
            <div className="bg-white rounded-2xl p-5 border border-indigo-200 shadow-sm animate-in fade-in duration-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-indigo-900 flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-indigo-600" />
                  <span>مسودة الطالب المؤقتة</span>
                </span>
                <button
                  type="button"
                  onClick={() => setIsScratchpadOpen(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <textarea
                rows={5}
                value={scratchpadText}
                onChange={e => setScratchpadText(e.target.value)}
                placeholder="اكتب هنا معادلاتك الرياضية أو ملاحظاتك السريعة (لن يتم تقييمها)..."
                className="w-full text-xs font-mono p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          )}
        </div>
      </main>

      {/* Confirmation Submit Modal */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-center">
            <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold text-slate-900 mb-2">
              هل أنت متأكد من تسليم الاختبار؟
            </h3>

            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              لقد أجبت على <strong className="text-indigo-600 font-mono">{answeredCount}</strong> من أصل <strong className="text-slate-700 font-mono">{exam.questions.length}</strong> أسئلة. 
              {exam.questions.length - answeredCount > 0 && (
                <span className="text-rose-600 block mt-1 font-semibold">
                  تحذير: لديك {exam.questions.length - answeredCount} أسئلة دون إجابة!
                </span>
              )}
            </p>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsSubmitModalOpen(false)}
                className="flex-1 px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              >
                العودة للمراجعة
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsSubmitModalOpen(false);
                  handleFinalSubmit();
                }}
                className="flex-1 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition-all"
              >
                تأكيد وتسليم الآن
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Image Zoom Modal */}
      {isZoomImageOpen && currentQ.media?.url && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="relative max-w-4xl w-full bg-white rounded-2xl overflow-hidden p-2">
            <button
              type="button"
              onClick={() => setIsZoomImageOpen(false)}
              className="absolute top-4 left-4 z-10 bg-slate-900 text-white p-2 rounded-full hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={currentQ.media.url}
              alt={currentQ.media.caption || 'مخطط السؤال'}
              referrerPolicy="no-referrer"
              className="w-full max-h-[85vh] object-contain rounded-xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};
