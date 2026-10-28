import React, { useState } from 'react';
import { 
  Check, 
  X, 
  Crown, 
  Sparkles, 
  Building2, 
  Zap, 
  ShieldCheck,
  CreditCard
} from 'lucide-react';
import { SubscriptionTier } from '../types/exam';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan: SubscriptionTier;
  onSelectPlan: (plan: SubscriptionTier) => void;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isOpen,
  onClose,
  currentPlan,
  onSelectPlan
}) => {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('annual');
  const [isSuccessToast, setIsSuccessToast] = useState(false);

  if (!isOpen) return null;

  const handleChoose = (plan: SubscriptionTier) => {
    onSelectPlan(plan);
    setIsSuccessToast(true);
    setTimeout(() => {
      setIsSuccessToast(false);
      onClose();
    }, 1200);
  };

  const plans = [
    {
      id: 'free' as SubscriptionTier,
      name: 'الباقة المجانية الأساسية',
      description: 'للمعلمين الجدد والطلاب لتجربة الاختبارات الأساسية والتصحيح التلقائي.',
      priceMonthly: 0,
      priceAnnual: 0,
      badge: 'مجاناً دائماً',
      features: [
        'إنشاء حتى 3 امتحانات شهرياً',
        'أنواع الأسئلة النصية الأساسية (اختيار من متعدد، صح وخطأ)',
        'نظام تصحيح تلقائي فوري',
        'تقرير نتيجة الطالب الأساسي',
        'مشاركة رابط الاختبار مع الطلاب',
      ],
      notIncluded: [
        'إرفاق الرسوم والمخططات العلمية عالية الدقة',
        'مقاطع الاستماع الصوتية التفاعلية',
        'محرر المعادلات الرياضية والكيميائية',
        'توليد الأسئلة الذكي بالذكاء الاصطناعي',
        'مخططات الرادار البيانية لإتقان المهارات',
        'تصدير نماذج الامتحانات PDF رسمية للطباعة',
      ]
    },
    {
      id: 'pro' as SubscriptionTier,
      name: 'باقة المعلم المحترف Pro',
      popular: true,
      description: 'الحل الشامل للمعلم المتميز لإنشاء اختبارات تفاعلية متعددة الوسائط وتقارير احترافية.',
      priceMonthly: 19,
      priceAnnual: 15,
      badge: 'الأكثر طلباً',
      features: [
        'عدد غير محدود من الامتحانات والطلاب',
        'دعم الوسائط الكامل: رسوم ومخططات تشريحية بدقة 4K',
        'نظام الاستماع الصوتي الذكي Waveform Audio',
        'محرر المعادلات الرياضية والكيميائية LaTeX',
        'توليد الأسئلة ونماذج الإجابة بالذكاء الاصطناعي',
        'تقارير أداء تفصيلية متطورة مع مخططات الرادار (Radar Charts)',
        'تصدير وطباعة ورقة الامتحان الرسمية + نموذج الإجابة PDF',
        'تحليل مصفوفة الأسئلة الأكثر صعوبة',
      ],
      notIncluded: [
        'إدارة فرق المعلمين متعددة الأقسام',
        'العلامة المائية المخصصة وشعار المدرسة',
      ]
    },
    {
      id: 'enterprise' as SubscriptionTier,
      name: 'باقة المدارس والمؤسسات',
      description: 'للمدارس والمجمعات التعليمية لإدارة متكاملة للامتحانات وكوادر التدريس.',
      priceMonthly: 79,
      priceAnnual: 65,
      badge: 'للمؤسسات',
      features: [
        'كافة مميزات باقة المعلم المحترف Pro كاملة',
        'إدارة حسابات غير محدودة للمعلمين والصفوف',
        'شعار المدرسة المخصص والشهادات المعتمدة للطباعة',
        'تحليلات تقدم الدفعات والسنوات الدراسية (Cohort Analytics)',
        'نظام رصد ومكافحة الغش وسجلات الاستجابة الزمنية',
        'تصدير واستيراد جماعي للطلاب والنتائج Excel/CSV',
        'دعم فني مخصص ذو أولوية على مدار الساعة',
      ],
      notIncluded: []
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl border border-slate-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/80 rounded-t-3xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
              <Crown className="w-6 h-6 fill-current" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900">
                باقات الاشتراك وترقية الميزات التعليمية
              </h2>
              <p className="text-xs text-slate-500">
                اختر الباقة المناسبة لاحتياجاتك التعليمية وافتح إمكانيات الوسائط المتعددة والتحليلات البيانية الذكية.
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

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Billing Switcher */}
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setBillingPeriod('monthly')}
                className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  billingPeriod === 'monthly' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                الدفع الشهري
              </button>
              <button
                type="button"
                onClick={() => setBillingPeriod('annual')}
                className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                  billingPeriod === 'annual' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>الدفع السنوي</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-md font-bold">
                  خصم 20%
                </span>
              </button>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map(plan => {
              const price = billingPeriod === 'annual' ? plan.priceAnnual : plan.priceMonthly;
              const isCurrent = currentPlan === plan.id;

              return (
                <div
                  key={plan.id}
                  className={`rounded-3xl p-6 border flex flex-col justify-between transition-all relative ${
                    plan.popular
                      ? 'border-indigo-500 bg-indigo-50/20 shadow-md ring-2 ring-indigo-500/20'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 right-6 bg-indigo-600 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-xs">
                      {plan.badge}
                    </div>
                  )}

                  <div>
                    <h3 className="text-base font-bold text-slate-900 mb-1">{plan.name}</h3>
                    <p className="text-xs text-slate-500 min-h-10 mb-4">{plan.description}</p>

                    <div className="mb-6 pb-4 border-b border-slate-100">
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-black text-slate-900 font-mono tabular-nums">
                          ${price}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">/ شهرياً</span>
                      </div>
                      {billingPeriod === 'annual' && plan.priceAnnual > 0 && (
                        <span className="text-[11px] text-emerald-600 font-medium block mt-1">
                          تُدفع ${plan.priceAnnual * 12} سنوياً (وفرت 20%)
                        </span>
                      )}
                    </div>

                    {/* Features list */}
                    <div className="space-y-2.5 text-xs">
                      <span className="text-[11px] font-bold text-slate-400 block mb-2">الميزات المشمولة:</span>
                      {plan.features.map((feat, i) => (
                        <div key={i} className="flex items-start gap-2 text-slate-700">
                          <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}

                      {plan.notIncluded.map((notFeat, i) => (
                        <div key={i} className="flex items-start gap-2 text-slate-400 line-through">
                          <X className="w-4 h-4 text-slate-300 shrink-0 mt-0.5" />
                          <span>{notFeat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 mt-6 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => handleChoose(plan.id)}
                      className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all ${
                        isCurrent
                          ? 'bg-slate-100 text-slate-500 cursor-default border border-slate-200'
                          : plan.popular
                          ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm'
                          : 'bg-slate-900 hover:bg-slate-800 text-white'
                      }`}
                    >
                      {isCurrent ? 'بافتك الحالية المفعلة' : 'ترقية وتفعيل هذه الباقة'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Toast Feedback */}
        {isSuccessToast && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-bold animate-in fade-in slide-in-from-bottom-4">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>تم تحديث باقة اشتراكك وتفعيل كافة الميزات بنجاح!</span>
          </div>
        )}
      </div>
    </div>
  );
};
