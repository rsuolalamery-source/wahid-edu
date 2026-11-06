import React, { useState } from 'react';
import { IraqiLesson } from '../types';
import { extractYouTubeId } from '../utils/youtube';
export { extractYouTubeId };
import { X, Play, Youtube, Sparkles, Check } from 'lucide-react';

interface ImportYouTubeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportLecture: (lecture: IraqiLesson, subjectTitle: string) => void;
}

export const ImportYouTubeModal: React.FC<ImportYouTubeModalProps> = ({
  isOpen,
  onClose,
  onImportLecture,
}) => {
  const [youtubeUrl, setYoutubeUrl] = useState<string>('');
  const [lectureTitle, setLectureTitle] = useState<string>('');
  const [teacherName, setTeacherName] = useState<string>('');
  const [subjectTitle, setSubjectTitle] = useState<string>('الرياضيات - السادس العلمي');
  const [notesSummary, setNotesSummary] = useState<string>('');
  const [duration, setDuration] = useState<number>(35);

  if (!isOpen) return null;

  const videoId = extractYouTubeId(youtubeUrl);
  const isValidId = Boolean(videoId && videoId.length === 11);

  const sampleIraqiLectures = [
    {
      label: 'رياضيات سادس علمي - حيدر وليد',
      url: 'https://www.youtube.com/watch?v=Jg7rLg1kP-c',
      teacher: 'أ. حيدر وليد',
      title: 'الأعداد المركبة المحاضرة 1'
    },
    {
      label: 'كيمياء سادس علمي - مهند السوداني',
      url: 'https://www.youtube.com/watch?v=8aN_Uu09a0E',
      teacher: 'أ. مهند السوداني',
      title: 'الثرموداينمك وقانون هيس'
    },
    {
      label: 'عربي سادس - عقيل الزبيدي',
      url: 'https://www.youtube.com/watch?v=UeR_VvH7e-4',
      teacher: 'أ. عقيل الزبيدي',
      title: 'أسلوب الاستفهام قواعد'
    }
  ];

  const handleApplySample = (sample: typeof sampleIraqiLectures[0]) => {
    setYoutubeUrl(sample.url);
    setTeacherName(sample.teacher);
    setLectureTitle(sample.title);
  };

  const handleImport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidId) return;

    const newLesson: IraqiLesson = {
      id: `custom-lec-${Date.now()}`,
      title: lectureTitle.trim() || 'محاضرة يوتيوب مخصصة',
      durationMinutes: Number(duration) || 30,
      youtubeUrl,
      youtubeVideoId: videoId,
      teacherName: teacherName.trim() || 'أستاذ المنهج العراقي',
      notes: notesSummary.trim() || 'محاضرة مستوردة من اليوتيوب للدراسة والتدريب اليومي والشهري.',
      keyFormulas: ['ملاحظة وزارية مستخرجة من المحاضرة'],
      dailyQuiz: [
        {
          id: `dq-cust-1`,
          question: `سؤال التحقق اليومي الأول لمحاضرة: "${lectureTitle || 'المحاضرة'}"؟`,
          options: ['الخيار الصحيح وفق شرح الأستاذ في الفيديو', 'خيار غير صحيح', 'خيار بديل', 'لا شيء مما سبق'],
          correctIndex: 0,
          explanation: 'تم إعداد هذا السؤال للتحقق من متابعتك للمحاضرة وفهمك لمحتواها.'
        }
      ]
    };

    onImportLecture(newLesson, subjectTitle);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative my-8 space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
            <Youtube className="w-5 h-5" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              سحب محاضرة جديدة من اليوتيوب
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Samples for Iraqi Teachers */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-semibold text-slate-400">أو اختر من محاضرات أشهر الأساتذة:</span>
          <div className="flex flex-wrap gap-1.5">
            {sampleIraqiLectures.map((s, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleApplySample(s)}
                className="px-2.5 py-1 text-[11px] rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 transition-colors"
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleImport} className="space-y-4 text-xs">
          
          {/* YouTube URL input */}
          <div className="space-y-1">
            <label className="font-bold text-slate-700 dark:text-slate-300">
              رابط المحاضرة من اليوتيوب:
            </label>
            <input
              type="text"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=... أو https://youtu.be/..."
              required
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-xs"
            />
          </div>

          {/* Video Preview thumbnail if valid */}
          {isValidId && (
            <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-black aspect-video relative flex items-center justify-center">
              <img
                src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
                alt="معاينة الفيديو"
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-lg">
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                </div>
              </div>
              <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-0.5 rounded text-[10px] font-mono">
                معرف الفيديو: {videoId}
              </div>
            </div>
          )}

          {/* Title */}
          <div className="space-y-1">
            <label className="font-bold text-slate-700 dark:text-slate-300">
              عنوان المحاضرة:
            </label>
            <input
              type="text"
              value={lectureTitle}
              onChange={(e) => setLectureTitle(e.target.value)}
              placeholder="مثلاً: الفصل الأول - أسلوب الاستفهام المحاضرة 1"
              required
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Teacher Name */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">
                اسم الأستاذ / المدرس:
              </label>
              <input
                type="text"
                value={teacherName}
                onChange={(e) => setTeacherName(e.target.value)}
                placeholder="أ. حيدر وليد، أ. عقيل..."
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">
                المدة بالدقائق (تقريباً):
              </label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                min={5}
                max={180}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Subject Category */}
          <div className="space-y-1">
            <label className="font-bold text-slate-700 dark:text-slate-300">
              المادة الدراسية:
            </label>
            <select
              value={subjectTitle}
              onChange={(e) => setSubjectTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="الرياضيات - السادس العلمي">الرياضيات - السادس العلمي</option>
              <option value="اللغة العربية - السادس الإعدادي">اللغة العربية - السادس الإعدادي</option>
              <option value="الكيمياء - السادس العلمي">الكيمياء - السادس العلمي</option>
              <option value="الفيزياء - السادس العلمي">الفيزياء - السادس العلمي</option>
              <option value="الأحياء - السادس العلمي">الأحياء - السادس العلمي</option>
              <option value="اللغة الإنجليزية - السادس الإعدادي">اللغة الإنجليزية - السادس الإعدادي</option>
              <option value="الرياضيات - الثالث متوسط">الرياضيات - الثالث متوسط</option>
              <option value="العلوم - الأول متوسط">العلوم - الأول متوسط</option>
              <option value="التاريخ - السادس الأدبي">التاريخ - السادس الأدبي</option>
              <option value="مادة عامة أخرى">مادة عامة أخرى</option>
            </select>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-lg font-medium hover:bg-slate-50 transition-colors"
            >
              إلغاء
            </button>

            <button
              type="submit"
              disabled={!isValidId || !lectureTitle.trim()}
              className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold shadow-md transition-colors disabled:opacity-40 disabled:pointer-events-none flex items-center gap-1.5"
            >
              <Youtube className="w-4 h-4" />
              <span>سحب المحاضرة وتشغيلها فوراً</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
