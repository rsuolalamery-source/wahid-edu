import React, { useState } from 'react';
import { MalzamaItem, IraqiGradeId } from '../types';
import { IRAQI_GRADES } from '../data/iraqiCurriculumData';
import { BookOpen, CheckCircle2, FileText, UploadCloud, Layers } from 'lucide-react';

interface AddMalzamaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMalzama: (newMalzama: MalzamaItem) => void;
  teacherName: string;
}

export const AddMalzamaModal: React.FC<AddMalzamaModalProps> = ({
  isOpen,
  onClose,
  onAddMalzama,
  teacherName,
}) => {
  const [title, setTitle] = useState<string>('');
  const [gradeId, setGradeId] = useState<IraqiGradeId>('1-intermediate');
  const [subjectTitle, setSubjectTitle] = useState<string>('الرياضيات');
  const [pagesCount, setPagesCount] = useState<number>(120);
  const [editionYear, setEditionYear] = useState<string>('2026 طبعة منقحة');
  const [description, setDescription] = useState<string>('');
  const [fileSizeBytes, setFileSizeBytes] = useState<string>('16.5 MB');
  const [chaptersInput, setChaptersInput] = useState<string>('الفصل الأول\nالفصل الثاني\nحلول الأسئلة الوزارية');
  const [success, setSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const gradeMeta = IRAQI_GRADES.find(g => g.id === gradeId);
    const chapters = chaptersInput.split('\n').map(s => s.trim()).filter(Boolean);

    const newMalzama: MalzamaItem = {
      id: `malzama-${Date.now()}`,
      title: title.trim(),
      teacherName: teacherName || 'أستاذ المادة',
      gradeId: gradeId,
      gradeLabel: gradeMeta?.title || 'المنهج العراقي',
      subjectTitle: subjectTitle.trim(),
      pagesCount: Number(pagesCount) || 100,
      editionYear: editionYear.trim() || '2026',
      description: description.trim() || 'ملزمة وزارية شاملة للشرح وحل أسئلة الفصول والاختبارات الدورية.',
      downloadUrl: '#',
      fileSizeBytes: fileSizeBytes.trim() || '15 MB',
      previewChapters: chapters.length > 0 ? chapters : ['الفصل الأول', 'الفصل الثاني']
    };

    onAddMalzama(newMalzama);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative my-8 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-700 text-white flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                إضافة ملزمة جديدة لطلابي
              </h3>
              <p className="text-xs text-slate-500">
                الأستاذ الناشر: {teacherName || 'أستاذ المادة'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="px-3 py-1.5 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-lg text-xs hover:bg-slate-50"
          >
            إغلاق
          </button>
        </div>

        {success ? (
          <div className="py-12 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h4 className="text-lg font-bold text-slate-900 dark:text-white">
              تمت إضافة الملزمة بنجاح!
            </h4>
            <p className="text-xs text-slate-500">أصبحت الملزمة متاحة لجميع طلاب الصف في مكتبة الملازم.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            
            <div className="space-y-1.5">
              <label className="font-bold text-slate-800 dark:text-slate-200">
                عنوان الملزمة:
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="مثال: ملزمة الرياضيات الذهبية - الجزء الأول"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-800 dark:text-slate-200">
                  الصف الدراسي:
                </label>
                <select
                  value={gradeId}
                  onChange={(e) => setGradeId(e.target.value as IraqiGradeId)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                >
                  {IRAQI_GRADES.map(g => (
                    <option key={g.id} value={g.id}>{g.title}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-800 dark:text-slate-200">
                  المادة:
                </label>
                <input
                  type="text"
                  required
                  value={subjectTitle}
                  onChange={(e) => setSubjectTitle(e.target.value)}
                  placeholder="مثال: الرياضيات، الفيزياء، الكيمياء..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-800 dark:text-slate-200">
                  عدد الصفحات:
                </label>
                <input
                  type="number"
                  value={pagesCount}
                  onChange={(e) => setPagesCount(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-800 dark:text-slate-200">
                  سنة الطبعة:
                </label>
                <input
                  type="text"
                  value={editionYear}
                  onChange={(e) => setEditionYear(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-800 dark:text-slate-200">
                  حجم الملف:
                </label>
                <input
                  type="text"
                  value={fileSizeBytes}
                  onChange={(e) => setFileSizeBytes(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-800 dark:text-slate-200">
                وصف ومميزات الملزمة:
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                placeholder="تتضمن حلول الأسئلة الوزارية، وشرح القوانين بالتفصيل..."
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-800 dark:text-slate-200">
                أبرز الفصول (سطر لكل فصل):
              </label>
              <textarea
                value={chaptersInput}
                onChange={(e) => setChaptersInput(e.target.value)}
                rows={3}
                placeholder="الفصل الأول: ...&#10;الفصل الثاني: ..."
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-xs"
              />
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold shadow-md transition-colors"
              >
                نشر الملزمة الآن
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
