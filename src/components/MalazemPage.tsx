import React, { useState } from 'react';
import { MalzamaItem, IraqiGradeId } from '../types';
import { IRAQI_GRADES } from '../data/iraqiCurriculumData';
import { BookOpen, Download, Search, FileText, CheckCircle2, User, Layers, PlusCircle } from 'lucide-react';

interface MalazemPageProps {
  malazem: MalzamaItem[];
  selectedGradeId: IraqiGradeId;
  onSelectGrade: (gradeId: IraqiGradeId) => void;
  onOpenTeacherPortal: () => void;
  isTeacher?: boolean;
  isManager?: boolean;
  teacherName?: string;
  onOpenAddMalzama?: () => void;
}

export const MalazemPage: React.FC<MalazemPageProps> = ({
  malazem,
  selectedGradeId,
  onSelectGrade,
  onOpenTeacherPortal,
  isTeacher = false,
  isManager = false,
  teacherName,
  onOpenAddMalzama,
}) => {

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [subjectFilter, setSubjectFilter] = useState<string>('all');
  const [previewMalzama, setPreviewMalzama] = useState<MalzamaItem | null>(null);

  const currentGradeMeta = IRAQI_GRADES.find(g => g.id === selectedGradeId);

  // Filter malazem
  const filteredMalazem = malazem.filter((item) => {
    const matchesGrade = item.gradeId === selectedGradeId;
    const matchesSubject = subjectFilter === 'all' || item.subjectTitle.includes(subjectFilter);
    const matchesSearch =
      searchQuery === '' ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.teacherName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesGrade && matchesSubject && matchesSearch;
  });

  const handleDownload = (item: MalzamaItem) => {
    alert(`جاري تجهيز وتحميل ملزمة: «${item.title}» للأستاذ ${item.teacherName} (طبعة ${item.editionYear}).\nحجم الملف: ${item.fileSizeBytes}`);
  };

  const canAddBooklet = isTeacher || isManager;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-l from-slate-900 via-emerald-950 to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-3 max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
            <BookOpen className="w-4 h-4" />
            <span>المكتبة الوزارية للملازم الدراسية</span>
            <span aria-hidden="true">·</span>
            <span>ملازم طبعة 2026 المعتمدة</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            ملازم ومذكرات: {currentGradeMeta?.title}
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            قسم خاص وحصري لتحميل وقراءة ملازم كبار مدرسي العراق بصيغة PDF بدقة عالية، متضمنة حلول الأسئلة الوزارية، والشروحات النموذجية، والواجبات المنزلية.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            {canAddBooklet ? (
              <button
                onClick={onOpenAddMalzama || onOpenTeacherPortal}
                className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition-colors"
              >
                <PlusCircle className="w-4 h-4" />
                <span>+ رفع ملزمة جديدة لطلابي ({isManager ? 'مدير المنصة' : `أ. ${teacherName || 'المدرس'}`})</span>
              </button>
            ) : (
              <div className="flex items-center gap-2 text-xs font-medium text-emerald-300 bg-emerald-950/60 px-3.5 py-1.5 rounded-xl border border-emerald-800/80">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>ملازم رسمية معتمدة تم رفعها ومراجعتها من قبل مدرسي المادة</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Grade Selector & Search Filter Strip */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
        
        {/* Grade Pills Switcher */}
        <div className="space-y-1.5">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
            اختر الصف لتصفح الملازم الخاصة به:
          </span>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            {IRAQI_GRADES.map((g) => (
              <button
                key={g.id}
                onClick={() => onSelectGrade(g.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedGradeId === g.id
                    ? 'bg-emerald-700 text-white shadow-sm font-bold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {g.title}
              </button>
            ))}
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث باسم الملزمة أو اسم المدرس (مثلاً: حيدر وليد، عقيل الزبيدي، مهند السوداني)..."
            className="w-full pr-10 pl-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

      </div>

      {/* Malazem Grid */}
      {filteredMalazem.length === 0 ? (
        <div className="py-16 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 space-y-3">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">
            لا توجد ملازم متطابقة حالياً لهذا الصف أو البحث
          </h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            {canAddBooklet 
              ? 'يمكنك كأستاذ أو كمدير للمنصة رفع وإضافة ملازمك الخاصة مباشرة لتظهر فوراً لجميع الطلبة.'
              : 'جرب البحث باسم أستاذ آخر أو اختر مادة أخرى من القائمة.'}
          </p>
          {canAddBooklet && (
            <button
              onClick={onOpenAddMalzama || onOpenTeacherPortal}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition-colors"
            >
              + إضافة ملزمة جديدة الآن
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMalazem.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                
                {/* Book Badge */}
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-lg">
                    {item.subjectTitle}
                  </span>
                  <span className="font-mono">{item.editionYear}</span>
                </div>

                {/* Title */}
                <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-2">
                  {item.title}
                </h3>

                {/* Teacher info */}
                <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                  <User className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-semibold">الأستاذ: {item.teacherName}</span>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                  {item.description}
                </p>

                {/* Chapters Preview */}
                {item.previewChapters && item.previewChapters.length > 0 && (
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1">
                    <span className="text-[11px] font-bold text-slate-400">أبرز فصول الملزمة:</span>
                    <ul className="text-[11px] text-slate-600 dark:text-slate-400 space-y-0.5 list-disc list-inside">
                      {item.previewChapters.slice(0, 2).map((ch, idx) => (
                        <li key={idx} className="truncate">{ch}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Bottom Specs & Action */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                <span className="text-[11px] text-slate-400 font-mono">
                  {item.pagesCount} صفحة · {item.fileSizeBytes}
                </span>

                <button
                  onClick={() => handleDownload(item)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-sm transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>تحميل PDF</span>
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};
