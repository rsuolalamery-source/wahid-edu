import React, { useState } from 'react';
import { IraqiSubject, IraqiLesson, IraqiGradeId, StandardSubjectName } from '../types';
import { IRAQI_GRADES } from '../data/iraqiCurriculumData';
import { 
  Play, 
  BookOpen, 
  Award, 
  Clock, 
  HelpCircle, 
  Youtube, 
  CheckCircle2, 
  ExternalLink,
  Sparkles,
  ArrowLeft,
  Lock,
  LockOpen,
  PlusCircle,
  GraduationCap
} from 'lucide-react';

interface IraqiSubjectCatalogProps {
  subjects: IraqiSubject[];
  selectedGradeId: IraqiGradeId;
  completedLessons: string[];
  unlockedLessonIds: string[];
  customLectures: IraqiLesson[];
  onSelectLesson: (lesson: IraqiLesson, subject: IraqiSubject) => void;
  onOpenImportModal: () => void;
  onOpenTeacherDashboard: () => void;
  onOpenOnboarding: () => void;
  onOpenExamsTab: () => void;
  isTeacher?: boolean;
  teacherName?: string;
  onOpenInviteModal?: () => void;
}

export const IraqiSubjectCatalog: React.FC<IraqiSubjectCatalogProps> = ({
  subjects,
  selectedGradeId,
  completedLessons,
  unlockedLessonIds,
  customLectures,
  onSelectLesson,
  onOpenImportModal,
  onOpenTeacherDashboard,
  onOpenOnboarding,
  onOpenExamsTab,
  isTeacher = false,
  teacherName,
  onOpenInviteModal,
}) => {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const currentGradeMeta = IRAQI_GRADES.find(g => g.id === selectedGradeId);

  // Standard 7 subject tabs for fast filter
  const standardSubjectsList: StandardSubjectName[] = [
    'الرياضيات',
    'اللغة العربية',
    'اللغة الإنجليزية',
    'الفيزياء',
    'الكيمياء',
    'الأحياء',
    'الاجتماعيات'
  ];

  const filteredSubjects = activeFilter === 'all'
    ? subjects
    : subjects.filter(s => s.standardName === activeFilter || s.title.includes(activeFilter));

  return (
    <div className="space-y-10">
      
      {/* Grade Hero Banner with Onboarding trigger */}
      <div className="bg-gradient-to-l from-emerald-800 via-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-emerald-300">
            <span>المنهج الدراسي الرسمي لجمهورية العراق</span>
            <span aria-hidden="true">·</span>
            <span>نظام الفلترة التلقائية للمواد</span>
            <span aria-hidden="true">·</span>
            <button
              onClick={onOpenOnboarding}
              className="text-amber-300 underline font-bold hover:text-amber-200"
            >
              تغيير المرحلة الدراسية
            </button>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            المواد المقررة: {currentGradeMeta?.title}
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
            تمت فلترة المواد والامتحانات تلقائياً لتناسب مرحلتك ({currentGradeMeta?.title}). تتضمن المواد السبعة الأساسية: 
            الاجتماعيات، الفيزياء، الكيمياء، الأحياء، الرياضيات، اللغة العربية، واللغة الإنجليزية مع التتابع الدراسي الذكي.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            {isTeacher ? (
              <>
                <button
                  onClick={onOpenTeacherDashboard}
                  className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition-colors"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>+ نشر محاضرة واختبار لصف ({currentGradeMeta?.title})</span>
                </button>

                {onOpenInviteModal && (
                  <button
                    onClick={onOpenInviteModal}
                    className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition-colors"
                  >
                    <span>مشاركة رابط صفحتي لطلابي</span>
                  </button>
                )}
              </>
            ) : (
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={onOpenExamsTab}
                  className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow transition-colors"
                >
                  <Award className="w-4 h-4" />
                  <span>جدول الامتحانات الشهرية المعتمدة</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Filter Tabs for the 7 standard subjects */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
            تصفية المواد السبعة الخاصة بـ ({currentGradeMeta?.title}):
          </span>
          <span className="text-xs font-mono text-slate-400">
            {filteredSubjects.length} مادة معتمدة
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
              activeFilter === 'all'
                ? 'bg-slate-900 text-white dark:bg-emerald-700 dark:text-white shadow-sm'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
            }`}
          >
            جميع المواد
          </button>

          {standardSubjectsList.map((subj) => (
            <button
              key={subj}
              onClick={() => setActiveFilter(subj)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap ${
                activeFilter === subj
                  ? 'bg-slate-900 text-white dark:bg-emerald-700 dark:text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
              }`}
            >
              {subj}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Pulled Lectures Section if any */}
      {customLectures.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
              <Youtube className="w-5 h-5" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                محاضراتي المسحوبة من اليوتيوب ({customLectures.length})
              </h3>
            </div>
            <span className="text-xs text-slate-400">المحاضرات الشخصية والمحفوظة</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {customLectures.map((lec) => {
              const dummySubject: IraqiSubject = {
                id: 'custom-sub',
                title: 'محاضرة يوتيوب مسحوبة',
                standardName: 'الرياضيات',
                gradeId: selectedGradeId,
                gradeLabel: currentGradeMeta?.title || 'المنهج العراقي',
                branch: 'عام',
                semester: 'المنهج الكامل',
                teacherName: lec.teacherName,
                teacherTitle: 'أستاذ على يوتيوب',
                iconName: 'Youtube',
                description: '',
                lessons: [lec],
                monthlyExams: []
              };

              return (
                <div
                  key={lec.id}
                  onClick={() => onSelectLesson(lec, dummySubject)}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm hover:border-rose-400 cursor-pointer transition-all space-y-3"
                >
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-black">
                    <img
                      src={`https://img.youtube.com/vi/${lec.youtubeVideoId}/hqdefault.jpg`}
                      alt={lec.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <div className="w-8 h-8 rounded-full bg-rose-600 text-white flex items-center justify-center">
                        <Play className="w-4 h-4 fill-current ml-0.5" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                      {lec.title}
                    </h4>
                    <p className="text-[11px] text-slate-400">الأستاذ: {lec.teacherName}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Official Iraqi Subjects Grid */}
      <section className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredSubjects.map((subject) => (
            <div
              key={subject.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-5 flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-all"
            >
              <div className="space-y-3">
                
                {/* Subject Header Info */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                      {subject.standardName || subject.title.split(' - ')[0]} · {subject.semester}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                      {subject.title}
                    </h3>
                  </div>

                  <div className="text-left text-xs text-slate-400 shrink-0">
                    <span className="block font-bold text-slate-700 dark:text-slate-300">
                      {subject.teacherName}
                    </span>
                    <span className="text-[10px]">{subject.teacherTitle}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2">
                  {subject.description}
                </p>

                {/* Sequential Lectures Outline */}
                <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      المحاضرات التتابعية ({subject.lessons.length}):
                    </span>
                    <span className="text-[11px]">يفتح كل درس بعد اجتياز اختبار ما قبله</span>
                  </div>

                  <div className="space-y-1.5">
                    {subject.lessons.map((lesson, idx) => {
                      const isDone = completedLessons.includes(lesson.id);
                      // Lesson is unlocked if it's the first lesson, or already completed, or in unlocked list
                      const isUnlocked = idx === 0 || isDone || unlockedLessonIds.includes(lesson.id);

                      return (
                        <div
                          key={lesson.id}
                          onClick={() => {
                            if (isUnlocked) onSelectLesson(lesson, subject);
                          }}
                          className={`p-2.5 rounded-xl border flex items-center justify-between text-xs transition-all ${
                            isUnlocked
                              ? 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 hover:border-emerald-500 cursor-pointer'
                              : 'border-slate-100 dark:border-slate-800/50 bg-slate-100/50 dark:bg-slate-900/50 opacity-60 cursor-not-allowed'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 text-white ${
                              isUnlocked ? 'bg-rose-600' : 'bg-slate-400'
                            }`}>
                              {isUnlocked ? <Play className="w-3 h-3 fill-current ml-0.5" /> : <Lock className="w-3 h-3" />}
                            </div>
                            <span className="font-medium text-slate-800 dark:text-slate-200 truncate">
                              {lesson.title}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 shrink-0 mr-2 text-[11px] text-slate-400 font-mono">
                            <span>{lesson.durationMinutes} د</span>
                            {isDone ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            ) : isUnlocked ? (
                              <span title="اختبار يومي متاح">
                                <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                              </span>
                            ) : (
                              <Lock className="w-3.5 h-3.5 text-slate-400" />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Subject Footer Actions */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                <button
                  onClick={() => {
                    if (subject.lessons.length > 0) {
                      onSelectLesson(subject.lessons[0], subject);
                    }
                  }}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-900 hover:bg-slate-800 dark:bg-emerald-700 dark:hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>بدء متابعة المحاضرات</span>
                </button>

                <button
                  onClick={onOpenExamsTab}
                  className="py-2 px-3 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-medium transition-colors"
                >
                  الامتحان الشهري ({subject.monthlyExams.length})
                </button>
              </div>

            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
