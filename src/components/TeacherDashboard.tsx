import React, { useState } from 'react';
import { IraqiGradeId, StandardSubjectName, IraqiLesson, QuizQuestion } from '../types';
import { IRAQI_GRADES } from '../data/iraqiCurriculumData';
import { extractYouTubeId } from '../utils/youtube';
import { 
  PlusCircle, 
  Sparkles, 
  Youtube, 
  CheckCircle2, 
  Play, 
  Trash2, 
  Loader2, 
  GraduationCap, 
  FileText,
  HelpCircle
} from 'lucide-react';

interface TeacherDashboardProps {
  onPublishLecture: (gradeId: IraqiGradeId, standardSubject: StandardSubjectName, lecture: IraqiLesson) => void;
  onClose: () => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  onPublishLecture,
  onClose,
}) => {
  const [youtubeUrl, setYoutubeUrl] = useState<string>('');
  const [gradeId, setGradeId] = useState<IraqiGradeId>('1-intermediate');
  const [subjectName, setSubjectName] = useState<StandardSubjectName>('الرياضيات');
  const [lectureTitle, setLectureTitle] = useState<string>('');
  const [teacherName, setTeacherName] = useState<string>('أستاذ المادة');
  const [durationMinutes, setDurationMinutes] = useState<number>(30);
  const [aiSummaryInput, setAiSummaryInput] = useState<string>('');
  
  // Daily Questions state
  const [questions, setQuestions] = useState<QuizQuestion[]>([
    {
      id: 'q-teach-1',
      question: 'السؤال اليومي الأول للمحاضرة:',
      options: ['الخيار الصحيح', 'الخيار الخاطئ 1', 'الخيار الخاطئ 2', 'الخيار الخاطئ 3'],
      correctIndex: 0,
      explanation: 'شرح مبسط للإجابة الصحيحة وفق المنهج العراقي.'
    }
  ]);

  const [isGeneratingAi, setIsGeneratingAi] = useState<boolean>(false);
  const [publishedSuccess, setPublishedSuccess] = useState<boolean>(false);

  const videoId = extractYouTubeId(youtubeUrl);
  const isValidVideo = Boolean(videoId && videoId.length === 11);

  const standardSubjects: StandardSubjectName[] = [
    'الرياضيات',
    'اللغة العربية',
    'اللغة الإنجليزية',
    'الفيزياء',
    'الكيمياء',
    'الأحياء',
    'الاجتماعيات'
  ];

  // AI Quiz Generator for Teacher
  const handleGenerateAiQuestions = async () => {
    if (!lectureTitle.trim()) {
      alert('يرجى كتابة عنوان المحاضرة أولاً لتوليد أسئلة مطابقة لها.');
      return;
    }

    setIsGeneratingAi(true);
    try {
      const response = await fetch('/api/tutor/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: `${subjectName} للصف ${IRAQI_GRADES.find(g => g.id === gradeId)?.title}: ${lectureTitle}`,
          difficulty: 'متوسط',
          questionCount: 3
        })
      });

      const data = await response.json();
      if (data.questions && Array.isArray(data.questions) && data.questions.length > 0) {
        setQuestions(data.questions);
      }
    } catch (err) {
      console.error('Failed to generate questions:', err);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handleAddQuestion = () => {
    setQuestions(prev => [
      ...prev,
      {
        id: `q-teach-${Date.now()}`,
        question: `سؤال إضافي ${prev.length + 1}:`,
        options: ['الخيار أ', 'الخيار ب', 'الخيار ج', 'الخيار د'],
        correctIndex: 0,
        explanation: 'توضيح الإجابة الصحيحة.'
      }
    ]);
  };

  const handleRemoveQuestion = (idx: number) => {
    setQuestions(prev => prev.filter((_, i) => i !== idx));
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidVideo || !lectureTitle.trim()) return;

    const summaryPoints = aiSummaryInput.trim()
      ? aiSummaryInput.split('\n').filter(Boolean)
      : [
          'استيعاب المفهوم الأساسي للمحاضرة وتطبيقاته الوزارية.',
          'التركيز على القواعد والمسائل الحسابية المذكورة في الشرح.',
          'حل تمارين الكتاب المقررة بعد إنهاء مشاهدة الفيديو.'
        ];

    const newLesson: IraqiLesson = {
      id: `lec-teach-${Date.now()}`,
      title: lectureTitle.trim(),
      durationMinutes: Number(durationMinutes) || 30,
      youtubeUrl,
      youtubeVideoId: videoId,
      teacherName: teacherName.trim() || 'أستاذ المادة',
      notes: `محاضرة مضافة عبر لوحة تحكم المدرس لمادة ${subjectName}.\nاحرص على إكمال الاختبار اليومي فور انتهاء المحاضرة.`,
      aiSummaryPoints: summaryPoints,
      keyFormulas: ['ملاحظة وزارية مستخرجة من المحاضرة'],
      dailyQuiz: questions
    };

    onPublishLecture(gradeId, subjectName, newLesson);
    setPublishedSuccess(true);
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl relative my-8 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                لوحة تحكم الأستاذ (Teacher Dashboard)
              </h3>
              <p className="text-xs text-slate-500">
                إضافة وسحب محاضرات اليوتيوب وربطها بالصف والمادة والاختبار اليومي بضغطة زر
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="px-3 py-1.5 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-lg text-xs"
          >
            إغلاق
          </button>
        </div>

        {publishedSuccess ? (
          <div className="py-12 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h4 className="text-lg font-bold text-slate-900 dark:text-white">
              تم نشر المحاضرة والاختبار اليومي بنجاح!
            </h4>
            <p className="text-xs text-slate-500">أصبحت المحاضرة متاحة للطلاب الآن في جدول دراستهم التتابعي.</p>
          </div>
        ) : (
          <form onSubmit={handlePublish} className="space-y-6 text-xs">
            
            {/* Step 1: Video URL */}
            <div className="space-y-2">
              <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Youtube className="w-4 h-4 text-rose-600" />
                <span>1. رابط محاضرة اليوتيوب (YouTube URL):</span>
              </label>
              <input
                type="text"
                required
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=... أو https://youtu.be/..."
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-mono text-xs text-slate-900 dark:text-white"
              />
              {isValidVideo && (
                <div className="flex items-center gap-2 text-emerald-600 font-semibold pt-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>تم استخراج معرف الفيديو بنجاح ({videoId})</span>
                </div>
              )}
            </div>

            {/* Step 2: Grade and Subject */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-800 dark:text-slate-200">
                  2. المرحلة الدراسية المستهدفة:
                </label>
                <select
                  value={gradeId}
                  onChange={(e) => setGradeId(e.target.value as IraqiGradeId)}
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium"
                >
                  {IRAQI_GRADES.map(g => (
                    <option key={g.id} value={g.id}>{g.title}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-800 dark:text-slate-200">
                  3. المادة الدراسية:
                </label>
                <select
                  value={subjectName}
                  onChange={(e) => setSubjectName(e.target.value as StandardSubjectName)}
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium"
                >
                  {standardSubjects.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Step 3: Title and Teacher */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2 space-y-1.5">
                <label className="font-bold text-slate-800 dark:text-slate-200">
                  4. عنوان المحاضرة:
                </label>
                <input
                  type="text"
                  required
                  value={lectureTitle}
                  onChange={(e) => setLectureTitle(e.target.value)}
                  placeholder="مثال: الفصل الأول - المحاضرة 1: الأعداد المركبة"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-800 dark:text-slate-200">
                  اسم الأستاذ:
                </label>
                <input
                  type="text"
                  value={teacherName}
                  onChange={(e) => setTeacherName(e.target.value)}
                  placeholder="أ. حيدر وليد..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>
            </div>

            {/* Step 4: Daily Quiz Configuration */}
            <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-emerald-600" />
                  <span>5. إعداد الاختبار اليومي التتابعي ({questions.length} أسئلة):</span>
                </label>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleGenerateAiQuestions}
                    disabled={isGeneratingAi || !lectureTitle.trim()}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 rounded-lg border border-emerald-200 dark:border-emerald-800 font-semibold"
                  >
                    {isGeneratingAi ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                    <span>توليد أسئلة ذكية بالذكاء الاصطناعي</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleAddQuestion}
                    className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg font-semibold"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>إضافة سؤال يدوياً</span>
                  </button>
                </div>
              </div>

              {/* Questions list */}
              <div className="space-y-4 max-h-56 overflow-y-auto p-1">
                {questions.map((q, qIdx) => (
                  <div key={q.id || qIdx} className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-700 dark:text-slate-300">السؤال {qIdx + 1}:</span>
                      {questions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveQuestion(qIdx)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <input
                      type="text"
                      value={q.question}
                      onChange={(e) => {
                        const updated = [...questions];
                        updated[qIdx].question = e.target.value;
                        setQuestions(updated);
                      }}
                      className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs"
                    />

                    {/* Options */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      {q.options.map((opt, optIdx) => (
                        <div key={optIdx} className="flex items-center gap-1.5">
                          <input
                            type="radio"
                            name={`correct-${qIdx}`}
                            checked={q.correctIndex === optIdx}
                            onChange={() => {
                              const updated = [...questions];
                              updated[qIdx].correctIndex = optIdx;
                              setQuestions(updated);
                            }}
                            title="حدد هذا الخيار كإجابة صحيحة"
                          />
                          <input
                            type="text"
                            value={opt}
                            onChange={(e) => {
                              const updated = [...questions];
                              updated[qIdx].options[optIdx] = e.target.value;
                              setQuestions(updated);
                            }}
                            className="flex-1 px-2.5 py-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded text-[11px]"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Publish Button */}
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
                disabled={!isValidVideo || !lectureTitle.trim()}
                className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold shadow-md transition-colors disabled:opacity-40"
              >
                نشر المحاضرة والاختبار فوراً إلى المنصة
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
