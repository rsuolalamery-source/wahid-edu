import React, { useState } from 'react';
import { IraqiGradeId } from '../types';
import { IRAQI_GRADES } from '../data/iraqiCurriculumData';
import { GraduationCap, Sparkles, Check, ArrowLeft, BookOpen } from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  initialName: string;
  initialGrade: IraqiGradeId;
  onSaveProfile: (name: string, gradeId: IraqiGradeId) => void;
  onClose?: () => void;
  isClosable?: boolean;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  initialName,
  initialGrade,
  onSaveProfile,
  onClose,
  isClosable = false,
}) => {
  const [name, setName] = useState<string>(initialName || '');
  const [selectedGrade, setSelectedGrade] = useState<IraqiGradeId>(initialGrade || '1-intermediate');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSaveProfile(name.trim(), selectedGrade);
    if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-10 shadow-2xl relative my-8 space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-black text-2xl shadow-md">
            ١
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            مرحباً بك في منصة واحد تعليم
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            حدد اسمك ومرحلتك الدراسية لنقوم بتهيئة وفلترة المواد والامتحانات الخاصة بصفك تلقائياً دون أي تعقيد.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Name Input */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              اسم الطالب الثلاثي (لإصدار الشهادات وبطاقة الدرجات):
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثال: حيدر أحمد علي"
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
            />
          </div>

          {/* Grade Selection Grid */}
          <div className="space-y-2.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              اختر مرحلتك الدراسية (تتم الفلترة التلقائية للمواد بناءً عليها):
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-64 overflow-y-auto p-1 pr-2">
              {IRAQI_GRADES.map((grade) => {
                const isSelected = selectedGrade === grade.id;

                return (
                  <button
                    key={grade.id}
                    type="button"
                    onClick={() => setSelectedGrade(grade.id)}
                    className={`p-3.5 rounded-xl border text-right transition-all flex items-center justify-between ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-100 font-bold shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <span className="text-xs sm:text-sm block">{grade.title}</span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        {grade.isMinisterial ? 'مرحلة وزارية عامة' : 'امتحانات مدرسية وشهرية'}
                      </span>
                    </div>

                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-xs shrink-0 mr-2 ${
                        isSelected ? 'bg-emerald-600 text-white' : 'border border-slate-300 dark:border-slate-600'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Info pill about auto-filtering */}
          <div className="p-3 bg-emerald-50/70 dark:bg-emerald-950/30 rounded-xl border border-emerald-100 dark:border-emerald-900/40 text-xs text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              ستظهر لك تلقائياً مواد صفك السبعة: (الاجتماعيات، الفيزياء، الكيمياء، الأحياء، الرياضيات، اللغة العربية، واللغة الإنجليزية).
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-2">
            {isClosable && onClose ? (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800"
              >
                إلغاء
              </button>
            ) : <div />}

            <button
              type="submit"
              disabled={!name.trim()}
              className="flex items-center gap-2 px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-md transition-all disabled:opacity-40"
            >
              <span>ابدأ رحلتي الدراسية</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
