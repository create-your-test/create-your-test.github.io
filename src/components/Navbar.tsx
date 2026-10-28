import React from 'react';
import { 
  GraduationCap, 
  UserCheck, 
  Sparkles, 
  Crown,
  LayoutDashboard,
  FileSpreadsheet,
  BarChart3,
  CreditCard,
  Layers,
  BookOpen,
  Sun,
  Moon,
  LogIn,
  LogOut,
  User
} from 'lucide-react';
import { AppNotification, NotificationPreferences, UserProfile } from '../types/exam';
import { NotificationCenter } from './NotificationCenter';

interface NavbarProps {
  currentTab: 'dashboard' | 'exams' | 'analytics' | 'subscription' | 'templates' | 'question_bank';
  setCurrentTab: (tab: 'dashboard' | 'exams' | 'analytics' | 'subscription' | 'templates' | 'question_bank') => void;
  currentUser: UserProfile | null;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onOpenAuthModal: () => void;
  onLogout: () => void;
  toggleRole: () => void;
  onOpenSubscription: () => void;
  onCreateExamClick: () => void;
  notifications: AppNotification[];
  onMarkNotificationRead: (id: string) => void;
  onMarkAllNotificationsRead: () => void;
  onClearAllNotifications: () => void;
  onSelectNotification: (notif: AppNotification) => void;
  notificationPreferences: NotificationPreferences;
  onUpdateNotificationPreferences: (prefs: NotificationPreferences) => void;
  onOpenTemplates: () => void;
  onOpenQuestionBank: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  currentUser,
  theme,
  onToggleTheme,
  onOpenAuthModal,
  onLogout,
  toggleRole,
  onOpenSubscription,
  onCreateExamClick,
  notifications,
  onMarkNotificationRead,
  onMarkAllNotificationsRead,
  onClearAllNotifications,
  onSelectNotification,
  notificationPreferences,
  onUpdateNotificationPreferences,
  onOpenTemplates,
  onOpenQuestionBank
}) => {
  const isTeacher = currentUser?.role === 'teacher';

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Brand wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
            <GraduationCap className="w-5 h-5" />
          </div>
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); setCurrentTab('dashboard'); }}
            className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap"
          >
            منصة اختباراتي الذكية
          </a>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-5 text-sm font-medium text-slate-600 dark:text-slate-300">
          <button
            onClick={() => setCurrentTab('dashboard')}
            className={`flex items-center gap-1.5 pb-1 transition-colors whitespace-nowrap ${
              currentTab === 'dashboard'
                ? 'text-indigo-600 dark:text-indigo-400 font-semibold border-b-2 border-indigo-600 dark:border-indigo-400'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>لوحة التحكم</span>
          </button>

          <button
            onClick={() => setCurrentTab('exams')}
            className={`flex items-center gap-1.5 pb-1 transition-colors whitespace-nowrap ${
              currentTab === 'exams'
                ? 'text-indigo-600 dark:text-indigo-400 font-semibold border-b-2 border-indigo-600 dark:border-indigo-400'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>الامتحانات</span>
          </button>

          {isTeacher && (
            <>
              <button
                onClick={onOpenTemplates}
                className="flex items-center gap-1.5 pb-1 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap"
              >
                <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>مكتبة القوالب</span>
              </button>

              <button
                onClick={onOpenQuestionBank}
                className="flex items-center gap-1.5 pb-1 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap"
              >
                <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>بنك الأسئلة</span>
              </button>
            </>
          )}

          <button
            onClick={() => setCurrentTab('analytics')}
            className={`flex items-center gap-1.5 pb-1 transition-colors whitespace-nowrap ${
              currentTab === 'analytics'
                ? 'text-indigo-600 dark:text-indigo-400 font-semibold border-b-2 border-indigo-600 dark:border-indigo-400'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>التحليلات والتقارير</span>
          </button>

          <button
            onClick={() => setCurrentTab('subscription')}
            className={`flex items-center gap-1.5 pb-1 transition-colors whitespace-nowrap ${
              currentTab === 'subscription'
                ? 'text-indigo-600 dark:text-indigo-400 font-semibold border-b-2 border-indigo-600 dark:border-indigo-400'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>الباقات</span>
          </button>
        </nav>

        {/* Zone 3: Actions, Dark Mode Toggle & Auth */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Theme Toggle (Light / Dark) */}
          <button
            type="button"
            onClick={onToggleTheme}
            title={theme === 'dark' ? 'التبديل إلى الوضع الفاتح (Light)' : 'التبديل إلى الوضع الليلي (Dark)'}
            aria-label="تبديل المظهر"
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-700"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400 hover:rotate-45 transition-transform" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700 hover:-rotate-12 transition-transform" />
            )}
          </button>

          {/* Notification Center */}
          <NotificationCenter
            notifications={notifications}
            currentUser={currentUser || { id: 'guest', name: 'زائر', email: '', role: 'teacher', schoolName: '', currentPlan: 'free' }}
            onMarkAsRead={onMarkNotificationRead}
            onMarkAllAsRead={onMarkAllNotificationsRead}
            onClearAll={onClearAllNotifications}
            onSelectNotification={onSelectNotification}
            preferences={notificationPreferences}
            onUpdatePreferences={onUpdateNotificationPreferences}
          />

          {/* Role switcher preview for logged-in or demo */}
          {currentUser && (
            <button
              type="button"
              onClick={toggleRole}
              title="التبديل السريع بين دور المعلم والطالب"
              className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors whitespace-nowrap border border-slate-200 dark:border-slate-700"
            >
              <UserCheck className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>{isTeacher ? 'معلم' : 'طالب'}</span>
            </button>
          )}

          {/* User Account State */}
          {currentUser ? (
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/80 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                {currentUser.name.slice(0, 1)}
              </div>
              <div className="hidden sm:block text-right leading-tight max-w-[110px] truncate">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{currentUser.name}</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                  {currentUser.role === 'teacher' ? 'معلم' : 'طالب'}
                </p>
              </div>
              <button
                type="button"
                onClick={onLogout}
                title="تسجيل الخروج"
                className="p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors rounded-lg"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={onOpenAuthModal}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 rounded-xl border border-indigo-200 dark:border-indigo-800 transition-colors whitespace-nowrap"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>تسجيل الدخول</span>
            </button>
          )}

          {/* Primary Action Button */}
          {isTeacher ? (
            <button
              type="button"
              onClick={onCreateExamClick}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-all whitespace-nowrap active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">+ إنشاء امتحان</span>
              <span className="sm:hidden">+ امتحان</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setCurrentTab('exams')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-all whitespace-nowrap active:scale-95"
            >
              <span>خوض اختبار</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
