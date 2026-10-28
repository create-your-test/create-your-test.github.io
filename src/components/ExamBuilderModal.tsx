import React, { useState, useEffect } from 'react';
import { 
  X, 
  Plus, 
  Trash2, 
  Sparkles, 
  Image as ImageIcon, 
  Volume2, 
  Sigma, 
  HelpCircle,
  Save,
  CheckCircle2,
  Layers,
  BookOpen
} from 'lucide-react';
import { Exam, Question, QuestionType, Subject, Difficulty } from '../types/exam';
import { SUBJECT_METADATA } from '../data/mockData';

interface ExamBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveExam: (newExam: Exam) => void;
  isProUser: boolean;
  initialData?: Partial<Exam> | null;
  onOpenQuestionBank?: () => void;
  onOpenTemplates?: () => void;
}

export const ExamBuilderModal: React.FC<ExamBuilderModalProps> = ({
  isOpen,
  onClose,
  onSaveExam,
  isProUser,
  initialData,
  onOpenQuestionBank,
  onOpenTemplates
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subject, setSubject] = useState<Subject>('biology');
  const [gradeLevel, setGradeLevel] = useState('الصف الأول الثانوي');
  const [timeLimitMinutes, setTimeLimitMinutes] = useState(20);
  const [passingScorePercent, setPassingScorePercent] = useState(60);
  const [shuffleQuestions, setShuffleQuestions] = useState(false);
  const [showImmediateFeedback, setShowImmediateFeedback] = useState(true);

  // Sync if initialData is provided
  useEffect(() => {
    if (initialData) {
      if (initialData.title) setTitle(initialData.title);
      if (initialData.description) setDescription(initialData.description);
      if (initialData.subject) setSubject(initialData.subject);
      if (initialData.gradeLevel) setGradeLevel(initialData.gradeLevel);
      if (initialData.timeLimitMinutes) setTimeLimitMinutes(initialData.timeLimitMinutes);
      if (initialData.passingScorePercent) setPassingScorePercent(initialData.passingScorePercent);
      if (initialData.questions && initialData.questions.length > 0) {
        setQuestions(initialData.questions);
      }
    }
  }, [initialData]);

  // Questions state
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: `q-${Date.now()}-1`,
      text: 'ما هي الوظيفة الحيوية الأساسية للميتوكوندريا في الخلية الحيوانية والنباتية؟',
      type: 'multiple_choice',
      options: [
        'إنتاج جزيئات الطاقة ATP عبر التنفس الخلوي',
        'تخليق الدهون وتخزين الغليكوجين',
        'تفكيك البروتينات التالفة بواسطة الإنزيمات الهاضمة',
        'التحكم في حركة المواد عبر الغشاء البلازمي'
      ],
      correctAnswer: 'إنتاج جزيئات الطاقة ATP عبر التنفس الخلوي',
      explanation: 'الميتوكوندريا هي مصانع الطاقة الخلوية، حيث تتم فيها دورة كريبس والفسفرة التأكسدية لإنتاج معظم جزيئات ATP اللازمة لأنشطة الخلية.',
      points: 5,
      difficulty: 'medium',
      topic: 'عضيات الخلية والتنفس',
      media: {
        type: 'image',
        url: '/src/assets/images/diagram_plant_cell_1793036035691.jpg',
        caption: 'بنية الخلية وعضيات إنتاج الطاقة'
      }
    }
  ]);

  if (!isOpen) return null;

  const handleAddQuestion = () => {
    const newQ: Question = {
      id: `q-${Date.now()}-${questions.length + 1}`,
      text: '',
      type: 'multiple_choice',
      options: ['الخيار أ', 'الخيار ب', 'الخيار ج', 'الخيار د'],
      correctAnswer: 'الخيار أ',
      explanation: '',
      points: 5,
      difficulty: 'medium',
      topic: 'مفاهيم عامة',
    };
    setQuestions([...questions, newQ]);
  };

  const handleRemoveQuestion = (idx: number) => {
    if (questions.length <= 1) {
      alert('يجب أن يحتوي الامتحان على سؤال واحد على الأقل');
      return;
    }
    setQuestions(questions.filter((_, i) => i !== idx));
  };

  const updateQuestion = (idx: number, patch: Partial<Question>) => {
    const updated = [...questions];
    updated[idx] = { ...updated[idx], ...patch };
    setQuestions(updated);
  };

  const handleAIGeneratePreset = () => {
    // Generate AI-recommended questions for the chosen subject
    if (subject === 'math') {
      const generated: Question[] = [
        {
          id: `q-gen-math-1`,
          text: 'في المثلث قائم الزاوية، إذا كان الوتر يساوي 10 سم وأحد الضلعين 6 سم، فما طول الضلع الآخر؟',
          type: 'multiple_choice',
          options: ['8 سم', '6.5 سم', '7.2 سم', '12 سم'],
          correctAnswer: '8 سم',
          explanation: 'وفق مبرهنة فيثاغورس: b² = c² - a² = 100 - 36 = 64، إذن b = 8 سم.',
          points: 5,
          difficulty: 'medium',
          topic: 'حساب المثلثات ونظرية فيثاغورس',
          media: {
            type: 'image',
            url: '/src/assets/images/diagram_geometry_triangle_1793036035504.jpg',
            caption: 'المثلث قائم الزاوية والنسب الهندسية'
          }
        },
        {
          id: `q-gen-math-2`,
          text: 'ما قيمة المميز Δ للمعادلة 2x² - 4x + 2 = 0؟',
          type: 'fill_blank',
          correctAnswer: '0',
          explanation: 'Δ = b² - 4ac = (-4)² - 4(2)(2) = 16 - 16 = 0، وبالتالي يوجد حل حقيقي وحيد مكرر.',
          points: 5,
          difficulty: 'medium',
          topic: 'الجبر والمعادلات',
          media: {
            type: 'formula',
            formulaText: 'Δ = b^2 - 4ac \\implies (-4)^2 - 4(2)(2) = 0',
            caption: 'حساب المميز الرياضي'
          }
        }
      ];
      setQuestions(generated);
      setTitle('اختبار الرياضيات: حساب المثلثات والجبر التحليلي');
      setDescription('اختبار مولد ذكياً يغطي نظريات فيثاغورس وحل المعادلات التربيعية بدقة.');
    } else {
      const generated: Question[] = [
        {
          id: `q-gen-bio-1`,
          text: 'ما هو المسار الصحيح لتدفق الدم غير المؤكسج العائد من أنسجة الجسم إلى الرئتين؟',
          type: 'multiple_choice',
          options: [
            'الوريد الأجوف -> الأذين الأيمن -> البطين الأيمن -> الشريان الرئوي',
            'الأبهر -> الأذين الأيسر -> البطين الأيسر -> الأوردة الرئوية',
            'الشريان الرئوي -> البطين الأيسر -> الأذين الأيمن',
            'الوريد الأجوف -> البطين الأيسر -> الرئتين'
          ],
          correctAnswer: 'الوريد الأجوف -> الأذين الأيمن -> البطين الأيمن -> الشريان الرئوي',
          explanation: 'يعود الدم غير المؤكسج عبر الوريدين الأجوفين العلوي والسفلي إلى الأذين الأيمن، ثم ينقبض إلى البطين الأيمن الذي يضخه عبر الشريان الرئوي إلى الرئتين للأكسجة.',
          points: 5,
          difficulty: 'medium',
          topic: 'الدورة الدموية الصغرى',
          media: {
            type: 'image',
            url: '/src/assets/images/diagram_human_heart_1793036033179.jpg',
            caption: 'مسارات الأوردة والشرايين القلبية'
          }
        },
        {
          id: `q-gen-bio-2`,
          text: 'البلاستيدات الخضراء تحتوي على صبغة الكلوروفيل المسؤولة عن امتصاص الضوء أثناء البناء الضوئي.',
          type: 'true_false',
          options: ['صح', 'خطأ'],
          correctAnswer: 'صح',
          explanation: 'الكلوروفيل يمتص الأطوال الموجية الزرقاء والحمراء ويعكس الضوء الأخضر وهو مركز التفاعلات الضوئية في أغشية الثايلاكويد.',
          points: 5,
          difficulty: 'easy',
          topic: 'التمثيل الضوئي',
          media: {
            type: 'image',
            url: '/src/assets/images/diagram_plant_cell_1793036035691.jpg',
            caption: 'موقع البلاستيدات داخل الخلية النباتية'
          }
        }
      ];
      setQuestions(generated);
      setTitle('اختبار العلوم الحيوية: الجهاز الدوري والخلية');
      setDescription('اختبار قياسي معزز بمخططات تشريحية عالية الدقة وتصحيح تلقائي فوري.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('يرجى كتابة عنوان الامتحان');
      return;
    }

    const totalPts = questions.reduce((sum, q) => sum + (Number(q.points) || 1), 0);

    const newExam: Exam = {
      id: `exam-${Date.now()}`,
      title,
      description: description || 'اختبار تقييمي للمادة مع نظام التصحيح التلقائي.',
      subject,
      gradeLevel,
      timeLimitMinutes,
      totalPoints: totalPts,
      passingScorePercent,
      status: 'published',
      shuffleQuestions,
      showImmediateFeedback,
      authorName: 'د. عبد الله المهيري',
      tags: [SUBJECT_METADATA[subject].nameAr, gradeLevel],
      createdAt: new Date().toISOString().split('T')[0],
      questions,
    };

    onSaveExam(newExam);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
              +
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">إنشاء امتحان دراسي جديد</h2>
              <span className="text-xs text-slate-500">منظومة بناء الاختبارات وتعيين مفاتيح التصحيح التلقائي والوسائط</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleAIGeneratePreset}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg border border-indigo-200 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>توليد أسئلة نموذجية ذكية</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Basic Exam Meta */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                عنوان الامتحان الرسمي *
              </label>
              <input
                type="text"
                required
                placeholder="مثال: الاختبار الفصلي لمادة الأحياء - الجهاز الدوري وعلم الخلية"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                المادة الدراسية
              </label>
              <select
                value={subject}
                onChange={e => setSubject(e.target.value as Subject)}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              >
                {Object.entries(SUBJECT_METADATA).map(([key, val]) => (
                  <option key={key} value={key}>{val.nameAr}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                المرحلة أو الصف الدراسي
              </label>
              <input
                type="text"
                value={gradeLevel}
                onChange={e => setGradeLevel(e.target.value)}
                placeholder="مثال: الصف الثاني الثانوي"
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                وصف الامتحان وإرشادات الطلاب
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="تعليمات الاختبار، متطلبات الإجابة، المراجع المسموحة..."
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  مدة الاختبار (بالدقائق)
                </label>
                <input
                  type="number"
                  min="5"
                  max="180"
                  value={timeLimitMinutes}
                  onChange={e => setTimeLimitMinutes(Number(e.target.value))}
                  className="w-28 px-3 py-1.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 tabular-nums"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  نسبة النجاح المقررة (%)
                </label>
                <input
                  type="number"
                  min="40"
                  max="100"
                  value={passingScorePercent}
                  onChange={e => setPassingScorePercent(Number(e.target.value))}
                  className="w-28 px-3 py-1.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 tabular-nums"
                />
              </div>
            </div>

            <div className="flex items-center gap-6 pt-2">
              <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showImmediateFeedback}
                  onChange={e => setShowImmediateFeedback(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded border-slate-300"
                />
                <span>عرض النتيجة والشرح التوضيحي فور التسليم</span>
              </label>

              <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={shuffleQuestions}
                  onChange={e => setShuffleQuestions(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded border-slate-300"
                />
                <span>خلط ترتيب الأسئلة عشوائياً لكل طالب</span>
              </label>
            </div>
          </div>

          {/* Questions Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  أسئلة الامتحان ومفاتيح التصحيح التلقائي ({questions.length})
                </h3>
                <span className="text-xs text-slate-500">
                  إجمالي درجات الامتحان: {questions.reduce((sum, q) => sum + (Number(q.points) || 1), 0)} درجة
                </span>
              </div>

              <div className="flex items-center gap-2">
                {onOpenQuestionBank && (
                  <button
                    type="button"
                    onClick={onOpenQuestionBank}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 rounded-lg transition-colors border border-slate-300"
                  >
                    <Layers className="w-3.5 h-3.5 text-indigo-600" />
                    <span>استيراد من بنك الأسئلة</span>
                  </button>
                )}

                {onOpenTemplates && (
                  <button
                    type="button"
                    onClick={onOpenTemplates}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 rounded-lg transition-colors border border-slate-300"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                    <span>مكتبة القوالب</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleAddQuestion}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors border border-indigo-200"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>إضافة سؤال</span>
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {questions.map((q, idx) => (
                <div key={q.id} className="p-4 bg-white border border-slate-200 rounded-xl space-y-3 relative hover:border-slate-300 transition-colors">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span className="text-xs font-bold text-slate-800">السؤال رقم {idx + 1}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleRemoveQuestion(idx)}
                        className="text-slate-400 hover:text-rose-600 p-1 rounded-md transition-colors"
                        title="حذف السؤال"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Question Text */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      نص السؤال *
                    </label>
                    <textarea
                      rows={2}
                      required
                      value={q.text}
                      onChange={e => updateQuestion(idx, { text: e.target.value })}
                      placeholder="اكتب صيغة السؤال التعليمي هنا..."
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  {/* Question Meta (Type, Topic, Points) */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        نوع السؤال
                      </label>
                      <select
                        value={q.type}
                        onChange={e => {
                          const newType = e.target.value as QuestionType;
                          let newAns = q.correctAnswer;
                          if (newType === 'true_false') newAns = 'صح';
                          if (newType === 'multiple_choice') newAns = q.options?.[0] || '';
                          if (newType === 'multi_select') newAns = [q.options?.[0] || ''];
                          if (newType === 'fill_blank') newAns = '';
                          updateQuestion(idx, { type: newType, correctAnswer: newAns });
                        }}
                        className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                      >
                        <option value="multiple_choice">اختيار من متعدد (Single Choice)</option>
                        <option value="true_false">صح أو خطأ (True / False)</option>
                        <option value="multi_select">اختيارات متعددة (Multi Select)</option>
                        <option value="fill_blank">إكمال الفراغ (Fill in Blank)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        الموضوع / المهارة المقاسة
                      </label>
                      <input
                        type="text"
                        value={q.topic}
                        onChange={e => updateQuestion(idx, { topic: e.target.value })}
                        placeholder="مثال: الخلية، النحو، مبرهنة فيثاغورس"
                        className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                      />
                    </div>

                    <div className="flex gap-2">
                      <div className="flex-1">
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          الدرجة
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="20"
                          value={q.points}
                          onChange={e => updateQuestion(idx, { points: Number(e.target.value) || 1 })}
                          className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg tabular-nums"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          الصعوبة
                        </label>
                        <select
                          value={q.difficulty}
                          onChange={e => updateQuestion(idx, { difficulty: e.target.value as Difficulty })}
                          className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                        >
                          <option value="easy">سهل</option>
                          <option value="medium">متوسط</option>
                          <option value="hard">متقدم</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Options & Correct Answer Key Setup */}
                  {q.type === 'multiple_choice' && (
                    <div className="space-y-2 bg-slate-50 p-3 rounded-lg border border-slate-200">
                      <label className="block text-xs font-semibold text-slate-700">
                        الخيارات المعروضة وحدد الإجابة الصحيحة للتصحيح التلقائي:
                      </label>
                      {(q.options || ['أ', 'ب', 'ج', 'د']).map((opt, optIdx) => (
                        <div key={optIdx} className="flex items-center gap-2">
                          <input
                            type="radio"
                            name={`correct-${q.id}`}
                            checked={q.correctAnswer === opt}
                            onChange={() => updateQuestion(idx, { correctAnswer: opt })}
                            className="w-4 h-4 text-indigo-600"
                            title="تعيين كإجابة صحيحة"
                          />
                          <input
                            type="text"
                            value={opt}
                            onChange={e => {
                              const newOpts = [...(q.options || [])];
                              const oldVal = newOpts[optIdx];
                              newOpts[optIdx] = e.target.value;
                              const updatedPatch: Partial<Question> = { options: newOpts };
                              if (q.correctAnswer === oldVal) {
                                updatedPatch.correctAnswer = e.target.value;
                              }
                              updateQuestion(idx, updatedPatch);
                            }}
                            className="flex-1 px-2.5 py-1 text-xs bg-white border border-slate-300 rounded-md"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {q.type === 'true_false' && (
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                      <label className="block text-xs font-semibold text-slate-700 mb-2">
                        الإجابة الصحيحة للتصحيح التلقائي:
                      </label>
                      <div className="flex items-center gap-6">
                        <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                          <input
                            type="radio"
                            name={`tf-${q.id}`}
                            checked={q.correctAnswer === 'صح'}
                            onChange={() => updateQuestion(idx, { correctAnswer: 'صح' })}
                            className="w-4 h-4 text-indigo-600"
                          />
                          <span>صح</span>
                        </label>
                        <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                          <input
                            type="radio"
                            name={`tf-${q.id}`}
                            checked={q.correctAnswer === 'خطأ'}
                            onChange={() => updateQuestion(idx, { correctAnswer: 'خطأ' })}
                            className="w-4 h-4 text-indigo-600"
                          />
                          <span>خطأ</span>
                        </label>
                      </div>
                    </div>
                  )}

                  {q.type === 'fill_blank' && (
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        الكلمة / الإجابة الصحيحة (يمكن كتابة أكثر من خيار مقبول مفصولاً بشرطة مائلة /):
                      </label>
                      <input
                        type="text"
                        value={String(q.correctAnswer || '')}
                        onChange={e => updateQuestion(idx, { correctAnswer: e.target.value })}
                        placeholder="مثال: البلاستيدات الخضراء / البلاستيدة الخضراء"
                        className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg"
                      />
                    </div>
                  )}

                  {/* Multimedia Attachments Controls */}
                  <div className="border border-slate-200 rounded-lg p-3 bg-slate-50/50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-700">مرفقات الوسائط المتعددة (ميزة متقدمة):</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            updateQuestion(idx, {
                              media: {
                                type: 'image',
                                url: '/src/assets/images/diagram_human_heart_1793036033179.jpg',
                                caption: 'مخطط توضيحي داعم للسؤال'
                              }
                            });
                          }}
                          className={`flex items-center gap-1 px-2 py-1 text-[11px] rounded-md border ${
                            q.media?.type === 'image'
                              ? 'bg-indigo-600 text-white border-indigo-600'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          <ImageIcon className="w-3 h-3" />
                          <span>رسم / مخطط</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            updateQuestion(idx, {
                              media: {
                                type: 'audio',
                                audioPromptText: 'Listen carefully to the audio excerpt and identify the primary supporting evidence.',
                                caption: 'مقطع استماع صوتي نقي'
                              }
                            });
                          }}
                          className={`flex items-center gap-1 px-2 py-1 text-[11px] rounded-md border ${
                            q.media?.type === 'audio'
                              ? 'bg-indigo-600 text-white border-indigo-600'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          <Volume2 className="w-3 h-3" />
                          <span>صوت / استماع</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            updateQuestion(idx, {
                              media: {
                                type: 'formula',
                                formulaText: 'c^2 = a^2 + b^2',
                                caption: 'معادلة رياضية / كيميائية'
                              }
                            });
                          }}
                          className={`flex items-center gap-1 px-2 py-1 text-[11px] rounded-md border ${
                            q.media?.type === 'formula'
                              ? 'bg-indigo-600 text-white border-indigo-600'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          <Sigma className="w-3 h-3" />
                          <span>معادلة</span>
                        </button>

                        {q.media && (
                          <button
                            type="button"
                            onClick={() => updateQuestion(idx, { media: undefined })}
                            className="text-rose-500 hover:text-rose-700 text-[11px] px-1.5"
                          >
                            إلغاء المرفق
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Media Specific Inputs */}
                    {q.media?.type === 'image' && (
                      <div className="space-y-2 mt-2 pt-2 border-t border-slate-200">
                        <div className="flex gap-2">
                          <select
                            value={q.media.url}
                            onChange={e => updateQuestion(idx, { media: { ...q.media!, url: e.target.value } })}
                            className="flex-1 px-2.5 py-1 text-xs bg-white border border-slate-300 rounded-md"
                          >
                            <option value="/src/assets/images/diagram_human_heart_1793036033179.jpg">مخطط تشريح القلب وتدفق الدم</option>
                            <option value="/src/assets/images/diagram_plant_cell_1793036035691.jpg">مخطط بنية الخلية النباتية وعضياتها</option>
                            <option value="/src/assets/images/diagram_geometry_triangle_1793036035504.jpg">مخطط مبرهنة فيثاغورس الهندسي</option>
                          </select>
                          <input
                            type="text"
                            value={q.media.caption || ''}
                            onChange={e => updateQuestion(idx, { media: { ...q.media!, caption: e.target.value } })}
                            placeholder="وصف أو تعليق على الرسم"
                            className="flex-1 px-2.5 py-1 text-xs bg-white border border-slate-300 rounded-md"
                          />
                        </div>
                      </div>
                    )}

                    {q.media?.type === 'audio' && (
                      <div className="space-y-2 mt-2 pt-2 border-t border-slate-200">
                        <input
                          type="text"
                          value={q.media.audioPromptText || ''}
                          onChange={e => updateQuestion(idx, { media: { ...q.media!, audioPromptText: e.target.value } })}
                          placeholder="اكتب النص الذي سيتم نطقه صوتياً للطلاب في سؤال الاستماع..."
                          className="w-full px-2.5 py-1 text-xs bg-white border border-slate-300 rounded-md"
                        />
                      </div>
                    )}

                    {q.media?.type === 'formula' && (
                      <div className="space-y-2 mt-2 pt-2 border-t border-slate-200">
                        <input
                          type="text"
                          value={q.media.formulaText || ''}
                          onChange={e => updateQuestion(idx, { media: { ...q.media!, formulaText: e.target.value } })}
                          placeholder="اكتب المعادلة الرياضية (مثال: Δ = b^2 - 4ac أو E = mc^2)"
                          className="w-full px-2.5 py-1 text-xs font-mono bg-white border border-slate-300 rounded-md"
                        />
                      </div>
                    )}
                  </div>

                  {/* Pedagogical Explanation for Auto-Grading Feedback */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      الشرح التوضيحي للحل النموذجي (يظهر للطالب عند التصحيح التلقائي)
                    </label>
                    <input
                      type="text"
                      value={q.explanation}
                      onChange={e => updateQuestion(idx, { explanation: e.target.value })}
                      placeholder="اشرح لماذا هذا الجواب هو الصحيح، وما هو الخطأ الشائع..."
                      className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Save Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              إلغاء التراجع
            </button>

            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-all active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>حفظ ونشر الامتحان الآن</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
