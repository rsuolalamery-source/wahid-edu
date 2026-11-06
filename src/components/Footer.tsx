import React from 'react';

interface FooterProps {
  onSelectTab: (tab: 'courses' | 'flashcards' | 'ai-quiz' | 'dashboard') => void;
  onOpenTutor: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab, onOpenTutor }) => {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-700 flex items-center justify-center text-white font-black text-lg">
                ١
              </div>
              <span className="text-lg font-bold text-slate-900 dark:text-white">
                واحد تعليم · المنهج العراقي
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
              منصة تعليمية مجانية مخصصة لطلبة المدارس في العراق: الأول والثاني والثالث متوسط، والرابع والخامس والسادس إعدادي (علمي وأدبي). تجمع شروحات كبار الأساتذة على يوتيوب مع اختبارات يومية وشهرية معتمدة.
            </p>
          </div>

          {/* Quick links */}
          <div className="space-y-3">
            <p className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              المراحل والامتحانات
            </p>
            <ul className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
              <li>السادس إعدادي (علمي وأدبي - وزاري)</li>
              <li>الثالث متوسط (امتحانات البكالوريا)</li>
              <li>الرابع والخامس إعدادي (علمي وأدبي)</li>
              <li>الأول والثاني متوسط</li>
            </ul>
          </div>

          {/* Community & Learning */}
          <div className="space-y-3">
            <p className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              أدوات المنصة
            </p>
            <ul className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
              <li>
                <button onClick={onOpenTutor} className="hover:text-slate-900 dark:hover:text-white transition-colors">
                  المعلم الذكي لحل المسائل الوزارية
                </button>
              </li>
              <li>مشغل محاضرات يوتيوب المدمج مع الملاحظات</li>
              <li>اختبارات يومية وشهرية مع رصد الدرجات</li>
              <li>
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                  منصة مجانية 100% لخدمة طلبة العراق
                </span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright line */}
        <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between text-xs text-slate-400">
          <p>© 2026 واحد تعليم (Wahed Taleem) - المنهج العراقي. مهد العلم والمعرفة.</p>
          <p>كل التوفيق والنجاح الباهر لجميع طلبة العراق في الامتحانات الوزارية.</p>
        </div>
      </div>
    </footer>
  );
};
