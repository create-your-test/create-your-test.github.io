import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { TeacherDashboard } from './components/TeacherDashboard';
import { StudentPortal } from './components/StudentPortal';
import { ExamTaker } from './components/ExamTaker';
import { PerformanceReport } from './components/PerformanceReport';
import { AnalyticsHub } from './components/AnalyticsHub';
import { ExamBuilderModal } from './components/ExamBuilderModal';
import { SubscriptionModal } from './components/SubscriptionModal';
import { PrintExamModal } from './components/PrintExamModal';
import { TemplatesLibraryModal } from './components/TemplatesLibraryModal';
import { QuestionBankModal } from './components/QuestionBankModal';
import { AuthModal } from './components/AuthModal';
import { 
  INITIAL_EXAMS, 
  INITIAL_SUBMISSIONS, 
  DEFAULT_GUEST_USER, 
  INITIAL_TEMPLATES, 
  INITIAL_BANK_QUESTIONS, 
  INITIAL_NOTIFICATIONS 
} from './data/mockData';
import { 
  Exam, 
  ExamSubmission, 
  ExamTemplate, 
  BankQuestion, 
  AppNotification, 
  NotificationPreferences, 
  Question, 
  SubscriptionTier, 
  UserProfile 
} from './types/exam';

export default function App() {
  // Theme state with localStorage persistence & HTML class toggle
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const savedTheme = localStorage.getItem('exam_platform_theme');
      if (savedTheme === 'dark' || savedTheme === 'light') return savedTheme;
    } catch (e) {}
    return 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    try {
      localStorage.setItem('exam_platform_theme', theme);
    } catch (e) {}
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Auth User State with real local persistence
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    try {
      const savedUser = localStorage.getItem('exam_platform_active_user');
      if (savedUser) return JSON.parse(savedUser);
    } catch (e) {}
    return DEFAULT_GUEST_USER;
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleLoginSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('exam_platform_active_user', JSON.stringify(user));
    } catch (e) {}

    // Add welcoming notification
    const welcomeAlert: AppNotification = {
      id: `notif-auth-${Date.now()}`,
      title: `مرحباً بك ${user.name} 👋`,
      message: `تم تسجيل الدخول بنجاح بحساب ${user.role === 'teacher' ? 'معلم' : 'طالب'}. نتمنى لك تجربة متميزة.`,
      type: 'system',
      targetRole: user.role,
      timestamp: 'الآن',
      read: false
    };
    setNotifications(prev => [welcomeAlert, ...prev]);
  };

  const handleLogout = () => {
    const guest: UserProfile = {
      id: `guest-${Date.now()}`,
      name: 'مستخدم جديد',
      email: 'user@school.edu',
      role: 'teacher',
      schoolName: 'المؤسسة التعليمية',
      currentPlan: 'free',
    };
    setCurrentUser(guest);
    try {
      localStorage.removeItem('exam_platform_active_user');
    } catch (e) {}
    setIsAuthModalOpen(true);
  };

  const [currentTab, setCurrentTab] = useState<'dashboard' | 'exams' | 'analytics' | 'subscription' | 'templates' | 'question_bank'>('dashboard');

  // Zero-State Data Store: Starts completely clean (0 exams, 0 submissions, 0 fake counters)
  const [exams, setExams] = useState<Exam[]>(() => {
    try {
      const saved = localStorage.getItem('exam_platform_exams');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_EXAMS;
  });

  const [submissions, setSubmissions] = useState<ExamSubmission[]>(() => {
    try {
      const saved = localStorage.getItem('exam_platform_submissions');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_SUBMISSIONS;
  });

  const [templates, setTemplates] = useState<ExamTemplate[]>(INITIAL_TEMPLATES);

  const [bankQuestions, setBankQuestions] = useState<BankQuestion[]>(() => {
    try {
      const saved = localStorage.getItem('exam_platform_bank_questions');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_BANK_QUESTIONS;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    try {
      const saved = localStorage.getItem('exam_platform_notifications');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_NOTIFICATIONS;
  });

  // Sync state changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('exam_platform_exams', JSON.stringify(exams));
    } catch (e) {}
  }, [exams]);

  useEffect(() => {
    try {
      localStorage.setItem('exam_platform_submissions', JSON.stringify(submissions));
    } catch (e) {}
  }, [submissions]);

  useEffect(() => {
    try {
      localStorage.setItem('exam_platform_bank_questions', JSON.stringify(bankQuestions));
    } catch (e) {}
  }, [bankQuestions]);

  useEffect(() => {
    try {
      localStorage.setItem('exam_platform_notifications', JSON.stringify(notifications));
    } catch (e) {}
  }, [notifications]);

  const [notificationPreferences, setNotificationPreferences] = useState<NotificationPreferences>({
    newExams: true,
    deadlines: true,
    results: true,
    submissions: true,
    emailAlerts: true
  });

  // Modal & Screen states
  const [activeExamForTaker, setActiveExamForTaker] = useState<Exam | null>(null);
  const [activeReport, setActiveReport] = useState<{ submission: ExamSubmission; exam: Exam } | null>(null);
  const [isExamBuilderOpen, setIsExamBuilderOpen] = useState(false);
  const [isSubscriptionOpen, setIsSubscriptionOpen] = useState(false);
  const [isTemplatesModalOpen, setIsTemplatesModalOpen] = useState(false);
  const [isQuestionBankModalOpen, setIsQuestionBankModalOpen] = useState(false);
  const [printExamTarget, setPrintExamTarget] = useState<Exam | null>(null);
  const [builderInitialData, setBuilderInitialData] = useState<Partial<Exam> | null>(null);

  // Switch between Teacher and Student roles for quick testing
  const handleToggleRole = () => {
    const newRole = currentUser.role === 'teacher' ? 'student' : 'teacher';
    const updatedUser: UserProfile = {
      ...currentUser,
      role: newRole,
      name: newRole === 'student' ? (currentUser.studentIdNumber ? currentUser.name : 'طالب مجتهد') : currentUser.name,
    };
    setCurrentUser(updatedUser);
    try {
      localStorage.setItem('exam_platform_active_user', JSON.stringify(updatedUser));
    } catch (e) {}
  };

  const handleCreateExam = (newExam: Exam) => {
    setExams(prev => [newExam, ...prev]);

    // Send alert to students if preference enabled
    if (notificationPreferences.newExams) {
      const alertNotif: AppNotification = {
        id: `notif-new-${Date.now()}`,
        title: 'إعلان اختبار جديد 📢',
        message: `تم نشر اختبار "${newExam.title}" لطلاب ${newExam.gradeLevel}. المدة: ${newExam.timeLimitMinutes} دقيقة.`,
        type: 'new_exam',
        targetRole: 'student',
        timestamp: 'الآن',
        read: false,
        linkExamId: newExam.id
      };
      setNotifications(prev => [alertNotif, ...prev]);
    }

    setBuilderInitialData(null);
  };

  const handleDeleteExam = (examId: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الامتحان؟')) {
      setExams(prev => prev.filter(e => e.id !== examId));
    }
  };

  const handleStartExam = (exam: Exam) => {
    setActiveExamForTaker(exam);
    setActiveReport(null);
  };

  const handleFinishExam = (newSubmission: ExamSubmission) => {
    setSubmissions(prev => [newSubmission, ...prev]);
    const examObj = activeExamForTaker!;
    setActiveReport({ submission: newSubmission, exam: examObj });
    setActiveExamForTaker(null);

    // Add alert for teacher
    if (notificationPreferences.submissions) {
      const teacherAlert: AppNotification = {
        id: `notif-sub-${Date.now()}`,
        title: 'تسليم جديد مصحح آلياً 📝',
        message: `قام الطالب ${newSubmission.studentName} بتسليم اختبار "${examObj.title}" محققاً ${newSubmission.totalScore}/${newSubmission.maxScore} (${newSubmission.percentage}%).`,
        type: 'student_submission',
        targetRole: 'teacher',
        timestamp: 'الآن',
        read: false,
        linkExamId: examObj.id
      };
      setNotifications(prev => [teacherAlert, ...prev]);
    }

    // Add alert for student result
    if (notificationPreferences.results) {
      const studentAlert: AppNotification = {
        id: `notif-res-${Date.now()}`,
        title: 'صدور تقرير الأداء المعتمد 🏆',
        message: `تم اعتماد تصحيح اختبارك "${examObj.title}". النتيجة: ${newSubmission.percentage}% (${newSubmission.gradeLevelText}).`,
        type: 'result_ready',
        targetRole: 'student',
        timestamp: 'الآن',
        read: false,
        linkExamId: examObj.id
      };
      setNotifications(prev => [studentAlert, ...prev]);
    }
  };

  const handleViewReport = (submission: ExamSubmission, exam: Exam) => {
    setActiveReport({ submission, exam });
  };

  const handleSelectPlan = (plan: SubscriptionTier) => {
    setCurrentUser(prev => {
      const updated = { ...prev, currentPlan: plan };
      try {
        localStorage.setItem('exam_platform_active_user', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  // Pre-built Templates Integration
  const handleUseTemplate = (template: ExamTemplate) => {
    setBuilderInitialData({
      title: template.title,
      description: template.description,
      subject: template.subject,
      gradeLevel: template.gradeLevel,
      timeLimitMinutes: template.estimatedDurationMinutes,
      passingScorePercent: 60,
      questions: template.questions.map((q, i) => ({
        ...q,
        id: `cloned-q-${Date.now()}-${i + 1}`
      }))
    });
    setIsTemplatesModalOpen(false);
    setIsExamBuilderOpen(true);
  };

  // Question Bank Integration
  const handleAddQuestionToBank = (newQ: BankQuestion) => {
    setBankQuestions(prev => [newQ, ...prev]);
    const notif: AppNotification = {
      id: `notif-q-${Date.now()}`,
      title: 'إضافة سؤال لبنك الأسئلة 📚',
      message: `تم بنجاح حفظ السؤال "${newQ.text.substring(0, 40)}..." في بنك الأسئلة لمادة ${newQ.subject}.`,
      type: 'system',
      targetRole: 'teacher',
      timestamp: 'الآن',
      read: false
    };
    setNotifications(prev => [notif, ...prev]);
  };

  const handleBatchAddQuestionsToBank = (newQuestions: BankQuestion[]) => {
    setBankQuestions(prev => [...newQuestions, ...prev]);
    const notif: AppNotification = {
      id: `notif-batch-${Date.now()}`,
      title: `استيراد دفعة أسئلة (${newQuestions.length} أسئلة) 📄`,
      message: `تم بنجاح استيراد وتصنيف ${newQuestions.length} سؤال آلياً من ملف وحفظها في بنك الأسئلة.`,
      type: 'system',
      targetRole: 'teacher',
      timestamp: 'الآن',
      read: false
    };
    setNotifications(prev => [notif, ...prev]);
  };

  const handleAssembleExamFromBank = (selectedQuestions: Question[]) => {
    const dominantSubject = selectedQuestions[0]?.subject || 'biology';

    setBuilderInitialData({
      title: `اختبار مجمّع من بنك الأسئلة (${selectedQuestions.length} أسئلة)`,
      description: `اختبار تم تكوينه آلياً من الأسئلة المختارة من بنك الأسئلة المعتمد.`,
      subject: dominantSubject,
      gradeLevel: 'المرحلة الثانوية',
      timeLimitMinutes: Math.max(15, selectedQuestions.length * 4),
      passingScorePercent: 60,
      questions: selectedQuestions.map((q, i) => ({
        ...q,
        id: `bank-assembled-q-${Date.now()}-${i + 1}`
      }))
    });
    setIsQuestionBankModalOpen(false);
    setIsExamBuilderOpen(true);
  };

  // Notification actions
  const handleMarkNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleClearAllNotifications = () => {
    setNotifications([]);
  };

  const handleSelectNotification = (notif: AppNotification) => {
    if (notif.linkExamId) {
      const exam = exams.find(e => e.id === notif.linkExamId);
      if (exam) {
        if (currentUser.role === 'student') {
          const existingSub = submissions.find(s => s.examId === exam.id && (s.studentId === currentUser.id || s.studentEmail === currentUser.email));
          if (existingSub) {
            setActiveReport({ submission: existingSub, exam });
          } else {
            setActiveExamForTaker(exam);
          }
        } else {
          setCurrentTab('exams');
        }
      }
    }
  };

  // Full-screen interactive exam taker
  if (activeExamForTaker) {
    return (
      <ExamTaker
        exam={activeExamForTaker}
        studentInfo={{
          id: currentUser.id,
          name: currentUser.name,
          email: currentUser.email,
        }}
        onFinishExam={handleFinishExam}
        onExit={() => setActiveExamForTaker(null)}
      />
    );
  }

  // Viewing detailed performance report card
  if (activeReport) {
    return (
      <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors pb-16">
        <Navbar
          currentTab={currentTab}
          setCurrentTab={tab => {
            setActiveReport(null);
            setCurrentTab(tab);
          }}
          currentUser={currentUser}
          theme={theme}
          onToggleTheme={toggleTheme}
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
          onLogout={handleLogout}
          toggleRole={handleToggleRole}
          onOpenSubscription={() => setIsSubscriptionOpen(true)}
          onCreateExamClick={() => {
            setBuilderInitialData(null);
            setIsExamBuilderOpen(true);
          }}
          notifications={notifications}
          onMarkNotificationRead={handleMarkNotificationRead}
          onMarkAllNotificationsRead={handleMarkAllNotificationsRead}
          onClearAllNotifications={handleClearAllNotifications}
          onSelectNotification={handleSelectNotification}
          notificationPreferences={notificationPreferences}
          onUpdateNotificationPreferences={setNotificationPreferences}
          onOpenTemplates={() => setIsTemplatesModalOpen(true)}
          onOpenQuestionBank={() => setIsQuestionBankModalOpen(true)}
        />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <PerformanceReport
            submission={activeReport.submission}
            exam={activeReport.exam}
            onBack={() => setActiveReport(null)}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors flex flex-col">
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        currentUser={currentUser}
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
        toggleRole={handleToggleRole}
        onOpenSubscription={() => setIsSubscriptionOpen(true)}
        onCreateExamClick={() => {
          setBuilderInitialData(null);
          setIsExamBuilderOpen(true);
        }}
        notifications={notifications}
        onMarkNotificationRead={handleMarkNotificationRead}
        onMarkAllNotificationsRead={handleMarkAllNotificationsRead}
        onClearAllNotifications={handleClearAllNotifications}
        onSelectNotification={handleSelectNotification}
        notificationPreferences={notificationPreferences}
        onUpdateNotificationPreferences={setNotificationPreferences}
        onOpenTemplates={() => setIsTemplatesModalOpen(true)}
        onOpenQuestionBank={() => setIsQuestionBankModalOpen(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Role Notice Switcher Banner */}
        <div className="mb-6 p-3.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs transition-colors">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              الدور النشط حالياً:
            </span>
            <span className={`px-2.5 py-0.5 rounded-md font-bold ${
              currentUser.role === 'teacher'
                ? 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300'
                : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
            }`}>
              {currentUser.role === 'teacher' ? 'لوحة تحكم المعلم وإدارة الامتحانات' : 'بوابة الطالب للاختبارات الفورية'}
            </span>
            <span className="text-slate-500 dark:text-slate-400 hidden md:inline">
              ({currentUser.name} {currentUser.schoolName ? `· ${currentUser.schoolName}` : ''})
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsAuthModalOpen(true)}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              تبديل الحساب أو إنشاء مستخدم جديد
            </button>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <button
              type="button"
              onClick={handleToggleRole}
              className="text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 underline underline-offset-4"
            >
              معاينة دور {currentUser.role === 'teacher' ? 'الطالب' : 'المعلم'}
            </button>
          </div>
        </div>

        {/* Tab 1: Dashboard */}
        {currentTab === 'dashboard' && (
          currentUser.role === 'teacher' ? (
            <TeacherDashboard
              exams={exams}
              submissions={submissions}
              onCreateExam={() => {
                setBuilderInitialData(null);
                setIsExamBuilderOpen(true);
              }}
              onPreviewExam={handleStartExam}
              onViewReport={handleViewReport}
              onDeleteExam={handleDeleteExam}
              onPrintBlankExam={exam => setPrintExamTarget(exam)}
              onOpenTemplates={() => setIsTemplatesModalOpen(true)}
              onOpenQuestionBank={() => setIsQuestionBankModalOpen(true)}
            />
          ) : (
            <StudentPortal
              currentUser={currentUser}
              exams={exams}
              submissions={submissions}
              onStartExam={handleStartExam}
              onViewReport={handleViewReport}
              notifications={notifications}
            />
          )
        )}

        {/* Tab 2: Exams Catalog */}
        {currentTab === 'exams' && (
          currentUser.role === 'teacher' ? (
            <TeacherDashboard
              exams={exams}
              submissions={submissions}
              onCreateExam={() => {
                setBuilderInitialData(null);
                setIsExamBuilderOpen(true);
              }}
              onPreviewExam={handleStartExam}
              onViewReport={handleViewReport}
              onDeleteExam={handleDeleteExam}
              onPrintBlankExam={exam => setPrintExamTarget(exam)}
              onOpenTemplates={() => setIsTemplatesModalOpen(true)}
              onOpenQuestionBank={() => setIsQuestionBankModalOpen(true)}
            />
          ) : (
            <StudentPortal
              currentUser={currentUser}
              exams={exams}
              submissions={submissions}
              onStartExam={handleStartExam}
              onViewReport={handleViewReport}
              notifications={notifications}
            />
          )
        )}

        {/* Tab 3: Analytics & Reports */}
        {currentTab === 'analytics' && (
          <AnalyticsHub
            exams={exams}
            submissions={submissions}
            onViewReport={handleViewReport}
          />
        )}

        {/* Tab 4: Subscriptions */}
        {currentTab === 'subscription' && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6 transition-colors">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                باقات وميزات منصة اختباراتي الذكية
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                منظومة متقدمة مصممة لرفع كفاءة القياس والتقويم المدرسي والأكاديمي بالتصحيح التلقائي الفوري ودعم الوسائط المتعددة.
              </p>
              <button
                type="button"
                onClick={() => setIsSubscriptionOpen(true)}
                className="mt-3 px-6 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-all"
              >
                فتح نافذة ترقية الباقات
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Real Login and Registration Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Pre-built Exam Templates Library Modal */}
      <TemplatesLibraryModal
        isOpen={isTemplatesModalOpen}
        onClose={() => setIsTemplatesModalOpen(false)}
        templates={templates}
        onUseTemplate={handleUseTemplate}
      />

      {/* Advanced Question Bank Modal */}
      <QuestionBankModal
        isOpen={isQuestionBankModalOpen}
        onClose={() => setIsQuestionBankModalOpen(false)}
        bankQuestions={bankQuestions}
        onAddQuestionToBank={handleAddQuestionToBank}
        onBatchAddQuestions={handleBatchAddQuestionsToBank}
        onAssembleExamFromQuestions={handleAssembleExamFromBank}
      />

      {/* Exam Builder Modal */}
      <ExamBuilderModal
        isOpen={isExamBuilderOpen}
        onClose={() => {
          setIsExamBuilderOpen(false);
          setBuilderInitialData(null);
        }}
        onSaveExam={handleCreateExam}
        isProUser={currentUser.currentPlan !== 'free'}
        initialData={builderInitialData}
        onOpenQuestionBank={() => setIsQuestionBankModalOpen(true)}
        onOpenTemplates={() => setIsTemplatesModalOpen(true)}
      />

      {/* Subscription Plans Modal */}
      <SubscriptionModal
        isOpen={isSubscriptionOpen}
        onClose={() => setIsSubscriptionOpen(false)}
        currentPlan={currentUser.currentPlan}
        onSelectPlan={handleSelectPlan}
      />

      {/* Print Paper Exam Modal with Direct PDF Export */}
      <PrintExamModal
        exam={printExamTarget}
        onClose={() => setPrintExamTarget(null)}
      />

      {/* Footer */}
      <footer className="no-print mt-auto border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div>
            © 2026 منصة اختباراتي الذكية · نظام الامتحانات والتصحيح التلقائي المتطور
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setIsTemplatesModalOpen(true)}
              className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
            >
              قوالب الامتحانات
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => setIsQuestionBankModalOpen(true)}
              className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
            >
              بنك الأسئلة
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => setIsSubscriptionOpen(true)}
              className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
            >
              ترقية الباقة
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
