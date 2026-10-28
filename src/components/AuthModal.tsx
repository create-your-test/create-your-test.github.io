import React, { useState } from 'react';
import { 
  User, 
  GraduationCap, 
  Mail, 
  Lock, 
  Building2, 
  BookOpen, 
  Sparkles, 
  ArrowRight, 
  LogIn, 
  UserPlus,
  ShieldCheck,
  X
} from 'lucide-react';
import { UserProfile } from '../types/exam';

interface AuthModalProps {
  isOpen: boolean;
  onClose?: () => void;
  onLoginSuccess: (user: UserProfile) => void;
  isInitialRequired?: boolean; // if true, cannot dismiss until logged in
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  isInitialRequired = false,
}) => {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [role, setRole] = useState<'teacher' | 'student'>('teacher');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [gradeLevel, setGradeLevel] = useState('الصف الأول الثانوي');
  const [studentIdNumber, setStudentIdNumber] = useState('');
  const [subjectSpecialty, setSubjectSpecialty] = useState('العلوم العامة والأحياء');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  // Retrieve existing local users
  const getStoredUsers = (): UserProfile[] => {
    try {
      const stored = localStorage.getItem('exam_platform_users_db');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  };

  const saveStoredUsers = (users: UserProfile[]) => {
    localStorage.setItem('exam_platform_users_db', JSON.stringify(users));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim() || !password.trim()) {
      setErrorMsg('يرجى كتابة البريد الإلكتروني وكلمة المرور');
      return;
    }

    const users = getStoredUsers();

    if (isRegisterMode) {
      if (!name.trim()) {
        setErrorMsg('يرجى كتابة الاسم الكامل');
        return;
      }

      // Check if email already exists
      const exists = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (exists) {
        setErrorMsg('هذا البريد الإلكتروني مسجل مسبقاً، يرجى تسجيل الدخول');
        return;
      }

      const newUser: UserProfile = {
        id: `usr-${Date.now()}`,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        role,
        schoolName: schoolName.trim() || 'المدرسة الوطنية',
        currentPlan: 'pro',
        gradeLevel: role === 'student' ? gradeLevel : undefined,
        studentIdNumber: role === 'student' ? studentIdNumber.trim() || 'STD-001' : undefined,
        subjectSpecialty: role === 'teacher' ? subjectSpecialty.trim() : undefined,
        createdAt: new Date().toISOString(),
      };

      users.push(newUser);
      saveStoredUsers(users);
      onLoginSuccess(newUser);
    } else {
      // Login mode
      const found = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (found) {
        onLoginSuccess(found);
      } else {
        // If first-time user without previous DB, create profile seamlessly
        const seamlessUser: UserProfile = {
          id: `usr-${Date.now()}`,
          name: email.split('@')[0] || (role === 'teacher' ? 'المعلم' : 'الطالب'),
          email: email.trim().toLowerCase(),
          role,
          schoolName: schoolName.trim() || 'المؤسسة التعليمية',
          currentPlan: 'pro',
          gradeLevel: role === 'student' ? gradeLevel : undefined,
          studentIdNumber: role === 'student' ? (studentIdNumber || 'STD-100') : undefined,
          subjectSpecialty: role === 'teacher' ? subjectSpecialty : undefined,
          createdAt: new Date().toISOString(),
        };
        users.push(seamlessUser);
        saveStoredUsers(users);
        onLoginSuccess(seamlessUser);
      }
    }
  };

  // Quick Demo Access without typing
  const handleQuickDemo = (demoRole: 'teacher' | 'student') => {
    const demoUser: UserProfile = {
      id: demoRole === 'teacher' ? 'teacher-real-01' : 'student-real-01',
      name: demoRole === 'teacher' ? 'أستاذ المادة' : 'طالب جديد',
      email: demoRole === 'teacher' ? 'teacher@school.edu' : 'student@school.edu',
      role: demoRole,
      schoolName: 'مدرستي الذكية',
      currentPlan: 'pro',
      gradeLevel: demoRole === 'student' ? 'الصف الأول الثانوي' : undefined,
      studentIdNumber: demoRole === 'student' ? 'STD-2026' : undefined,
      subjectSpecialty: demoRole === 'teacher' ? 'العلوم والرياضيات' : undefined,
      createdAt: new Date().toISOString(),
    };
    onLoginSuccess(demoUser);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-lg shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden text-slate-900 dark:text-slate-100 transition-colors">
        {/* Modal Header */}
        <div className="relative px-6 pt-6 pb-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 text-center">
          {!isInitialRequired && onClose && (
            <button
              type="button"
              onClick={onClose}
              className="absolute left-4 top-4 p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mx-auto mb-3 shadow-md">
            <GraduationCap className="w-6 h-6" />
          </div>

          <h2 className="text-lg font-black tracking-tight">
            {isRegisterMode ? 'إنشاء حساب جديد في منصة اختباراتي' : 'تسجيل الدخول إلى المنصة'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            نظام الامتحانات والتصحيح التلقائي النظيف · ابدأ من الصفر بدون بيانات وهمية
          </p>

          {/* Role Selector Tabs */}
          <div className="flex items-center gap-2 p-1 bg-slate-200/70 dark:bg-slate-800 rounded-xl mt-4 max-w-xs mx-auto">
            <button
              type="button"
              onClick={() => setRole('teacher')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
                role === 'teacher'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>معلم (Teacher)</span>
            </button>

            <button
              type="button"
              onClick={() => setRole('student')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
                role === 'student'
                  ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>طالب (Student)</span>
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 text-xs font-semibold text-rose-700 bg-rose-50 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50 rounded-xl text-center">
              {errorMsg}
            </div>
          )}

          {isRegisterMode && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                الاسم الكامل *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder={role === 'teacher' ? 'مثال: أ. محمد عبد الله' : 'مثال: خالد إبراهيم'}
                  className="w-full pr-9 pl-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              البريد الإلكتروني *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="example@school.edu"
                className="w-full pr-9 pl-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              كلمة المرور *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pr-9 pl-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {isRegisterMode && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  المدرسة / المؤسسة التعليمية
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
                  <input
                    type="text"
                    value={schoolName}
                    onChange={e => setSchoolName(e.target.value)}
                    placeholder="مثال: مدرسة المستقبل الثانوية"
                    className="w-full pr-9 pl-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {role === 'student' ? (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      الصف الدراسي
                    </label>
                    <input
                      type="text"
                      value={gradeLevel}
                      onChange={e => setGradeLevel(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      رقم القيد / الجلوس
                    </label>
                    <input
                      type="text"
                      value={studentIdNumber}
                      onChange={e => setStudentIdNumber(e.target.value)}
                      placeholder="STD-101"
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    المادة أو التخصص الدراسي
                  </label>
                  <input
                    type="text"
                    value={subjectSpecialty}
                    onChange={e => setSubjectSpecialty(e.target.value)}
                    placeholder="مثال: الرياضيات، الأحياء، الفيزياء"
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
              )}
            </>
          )}

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all active:scale-98 mt-2"
          >
            {isRegisterMode ? <UserPlus className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
            <span>{isRegisterMode ? 'إنشاء الحساب وبدء الاستخدام' : 'تسجيل الدخول الآن'}</span>
          </button>

          {/* Toggle Register / Login */}
          <div className="text-center pt-2 text-xs text-slate-500 dark:text-slate-400">
            {isRegisterMode ? (
              <span>
                لديك حساب بالفعل؟{' '}
                <button
                  type="button"
                  onClick={() => setIsRegisterMode(false)}
                  className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  تسجيل الدخول
                </button>
              </span>
            ) : (
              <span>
                مستخدم جديد في المنصة؟{' '}
                <button
                  type="button"
                  onClick={() => setIsRegisterMode(true)}
                  className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  إنشاء حساب جديد
                </button>
              </span>
            )}
          </div>

          {/* Quick Demo Login Shortcuts */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <span className="block text-[11px] text-slate-400 text-center mb-2 font-medium">
              أو تجربة سريعة وفورية بنقرة واحدة (من الصفر):
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo('teacher')}
                className="py-1.5 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-[11px] font-semibold rounded-lg transition-colors border border-slate-200 dark:border-slate-700 text-center"
              >
                دخول كمعلم (حساب نظيف)
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('student')}
                className="py-1.5 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-[11px] font-semibold rounded-lg transition-colors border border-slate-200 dark:border-slate-700 text-center"
              >
                دخول كطالب (حساب نظيف)
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
