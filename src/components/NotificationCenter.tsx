import React, { useState } from 'react';
import { 
  Bell, 
  CheckCheck, 
  Clock, 
  Award, 
  FileText, 
  AlertTriangle, 
  Settings2, 
  X, 
  Trash2,
  Check,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { AppNotification, NotificationPreferences, UserProfile } from '../types/exam';

interface NotificationCenterProps {
  notifications: AppNotification[];
  currentUser: UserProfile;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
  onSelectNotification: (notif: AppNotification) => void;
  preferences: NotificationPreferences;
  onUpdatePreferences: (prefs: NotificationPreferences) => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications,
  currentUser,
  onMarkAsRead,
  onMarkAllAsRead,
  onClearAll,
  onSelectNotification,
  preferences,
  onUpdatePreferences
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [filterMode, setFilterMode] = useState<'all' | 'unread'>('all');

  // Filter notifications relevant to currentUser role or targetRole === 'all'
  const relevantNotifications = notifications.filter(n => 
    n.targetRole === 'all' || n.targetRole === currentUser.role
  );

  const displayedNotifications = filterMode === 'unread'
    ? relevantNotifications.filter(n => !n.read)
    : relevantNotifications;

  const unreadCount = relevantNotifications.filter(n => !n.read).length;

  const getIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'new_exam':
        return <FileText className="w-4 h-4 text-indigo-600" />;
      case 'deadline_reminder':
        return <Clock className="w-4 h-4 text-amber-600" />;
      case 'result_ready':
        return <Award className="w-4 h-4 text-emerald-600" />;
      case 'student_submission':
        return <FileText className="w-4 h-4 text-cyan-600" />;
      case 'low_score_alert':
        return <AlertTriangle className="w-4 h-4 text-rose-600" />;
      default:
        return <Bell className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <div className="relative">
      {/* Bell Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
        title="مركز الإشعارات والتنبيهات المدرسية"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-rose-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center font-mono animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu / Drawer */}
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40 bg-black/10" 
            onClick={() => setIsOpen(false)} 
          />

          <div className="absolute left-0 sm:left-auto right-0 sm:right-auto sm:left-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden flex flex-col max-h-[82vh] animate-in fade-in slide-in-from-top-2">
            {/* Header */}
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Bell className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-bold text-slate-900">
                  التنبيهات المدرسية ({unreadCount} جديد)
                </h3>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setShowSettings(!showSettings)}
                  title="تخصيص إعدادات التنبيهات"
                  className={`p-1.5 rounded-lg transition-colors ${
                    showSettings ? 'bg-indigo-100 text-indigo-700' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Settings2 className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* If in Settings Mode */}
            {showSettings ? (
              <div className="p-4 space-y-4 overflow-y-auto text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h4 className="font-bold text-slate-900">تخصيص إشعارات حساب ({currentUser.role === 'teacher' ? 'المعلم' : 'الطالب'})</h4>
                  <button
                    type="button"
                    onClick={() => setShowSettings(false)}
                    className="text-indigo-600 font-semibold"
                  >
                    تم
                  </button>
                </div>

                <div className="space-y-3">
                  <label className="flex items-center justify-between cursor-pointer p-2 rounded-xl hover:bg-slate-50">
                    <span className="text-slate-700 font-medium">إعلانات الامتحانات الجديدة</span>
                    <input
                      type="checkbox"
                      checked={preferences.newExams}
                      onChange={e => onUpdatePreferences({ ...preferences, newExams: e.target.checked })}
                      className="w-4 h-4 text-indigo-600 rounded"
                    />
                  </label>

                  <label className="flex items-center justify-between cursor-pointer p-2 rounded-xl hover:bg-slate-50">
                    <span className="text-slate-700 font-medium">تنبيهات اقتراب موعد التسليم</span>
                    <input
                      type="checkbox"
                      checked={preferences.deadlines}
                      onChange={e => onUpdatePreferences({ ...preferences, deadlines: e.target.checked })}
                      className="w-4 h-4 text-indigo-600 rounded"
                    />
                  </label>

                  <label className="flex items-center justify-between cursor-pointer p-2 rounded-xl hover:bg-slate-50">
                    <span className="text-slate-700 font-medium">إشعارات اعتماد النتيجة والتصحيح التلقائي</span>
                    <input
                      type="checkbox"
                      checked={preferences.results}
                      onChange={e => onUpdatePreferences({ ...preferences, results: e.target.checked })}
                      className="w-4 h-4 text-indigo-600 rounded"
                    />
                  </label>

                  {currentUser.role === 'teacher' && (
                    <label className="flex items-center justify-between cursor-pointer p-2 rounded-xl hover:bg-slate-50">
                      <span className="text-slate-700 font-medium">تنبيهات تسليم الطلاب الفورية</span>
                      <input
                        type="checkbox"
                        checked={preferences.submissions}
                        onChange={e => onUpdatePreferences({ ...preferences, submissions: e.target.checked })}
                        className="w-4 h-4 text-indigo-600 rounded"
                      />
                    </label>
                  )}

                  <label className="flex items-center justify-between cursor-pointer p-2 rounded-xl hover:bg-slate-50 border-t border-slate-100 pt-3">
                    <span className="text-slate-700 font-medium">إرسال التنبيهات عبر البريد الإلكتروني</span>
                    <input
                      type="checkbox"
                      checked={preferences.emailAlerts}
                      onChange={e => onUpdatePreferences({ ...preferences, emailAlerts: e.target.checked })}
                      className="w-4 h-4 text-indigo-600 rounded"
                    />
                  </label>
                </div>
              </div>
            ) : (
              /* Notifications List Mode */
              <>
                {/* Secondary Actions Strip */}
                <div className="px-4 py-2 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setFilterMode('all')}
                      className={`px-2 py-0.5 rounded-md font-semibold transition-colors ${
                        filterMode === 'all' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      الكل
                    </button>
                    <button
                      type="button"
                      onClick={() => setFilterMode('unread')}
                      className={`px-2 py-0.5 rounded-md font-semibold transition-colors ${
                        filterMode === 'unread' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      غير المقروء ({unreadCount})
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                      <button
                        type="button"
                        onClick={onMarkAllAsRead}
                        className="text-indigo-600 hover:text-indigo-800 font-semibold"
                      >
                        قراءة الكل
                      </button>
                    )}
                    {relevantNotifications.length > 0 && (
                      <button
                        type="button"
                        onClick={onClearAll}
                        className="text-slate-400 hover:text-rose-600"
                        title="مسح كافة الإشعارات"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Notifications scroll list */}
                <div className="overflow-y-auto divide-y divide-slate-100 flex-1 max-h-96">
                  {displayedNotifications.length === 0 ? (
                    <div className="py-12 text-center text-slate-400 text-xs">
                      لا توجد تنبيهات جديدة في الوقت الحالي
                    </div>
                  ) : (
                    displayedNotifications.map(n => (
                      <div
                        key={n.id}
                        onClick={() => {
                          onMarkAsRead(n.id);
                          onSelectNotification(n);
                          setIsOpen(false);
                        }}
                        className={`p-3.5 hover:bg-slate-50 transition-colors cursor-pointer flex items-start gap-3 relative ${
                          !n.read ? 'bg-indigo-50/20' : ''
                        }`}
                      >
                        <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                          {getIcon(n.type)}
                        </div>

                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <h4 className={`text-xs ${!n.read ? 'font-bold text-slate-900' : 'font-semibold text-slate-700'}`}>
                              {n.title}
                            </h4>
                            <span className="text-[10px] text-slate-400 font-mono tabular-nums">
                              {n.timestamp}
                            </span>
                          </div>

                          <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2">
                            {n.message}
                          </p>

                          {n.linkExamId && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-600 pt-0.5">
                              <span>انتقل للاختبار</span>
                              <ChevronRight className="w-3 h-3" />
                            </span>
                          )}
                        </div>

                        {!n.read && (
                          <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0 self-center" />
                        )}
                      </div>
                    ))
                  )}
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};
