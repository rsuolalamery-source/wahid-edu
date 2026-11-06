import React, { useState } from 'react';
import { IraqiLesson, IraqiSubject } from '../types';
import { 
  Play, 
  CheckCircle, 
  FileText, 
  Bookmark, 
  Brain, 
  Award, 
  ExternalLink, 
  Sparkles, 
  Eye,
  EyeOff,
  HelpCircle,
  Clock,
  Lock,
  ArrowLeft,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { extractYouTubeId } from '../utils/youtube';

interface YouTubeLecturePlayerProps {
  lesson: IraqiLesson;
  subject: IraqiSubject;
  isCompleted: boolean;
  userNote: string;
  nextLesson?: IraqiLesson;
  isNextLessonUnlocked?: boolean;
  onSaveNote: (lessonId: string, note: string) => void;
  onCompleteLesson: (lessonId: string) => void;
  onStartDailyQuiz: (lesson: IraqiLesson) => void;
  onNavigateToLesson: (lesson: IraqiLesson) => void;
  onAskAiTutor: (context: string) => void;
  onOpenImportModal: () => void;
}

export const YouTubeLecturePlayer: React.FC<YouTubeLecturePlayerProps> = ({
  lesson,
  subject,
  isCompleted,
  userNote,
  nextLesson,
  isNextLessonUnlocked = false,
  onSaveNote,
  onCompleteLesson,
  onStartDailyQuiz,
  onNavigateToLesson,
  onAskAiTutor,
  onOpenImportModal,
}) => {
  const [activeTab, setActiveTab] = useState<'aiSummary' | 'notes' | 'formulas'>('aiSummary');
  const [noteContent, setNoteContent] = useState<string>(userNote || '');
  const [isSavedNotice, setIsSavedNotice] = useState<boolean>(false);
  const [isFocusMode, setIsFocusMode] = useState<boolean>(false);

  const videoId = extractYouTubeId(lesson.youtubeVideoId || lesson.youtubeUrl);

  const handleSave = () => {
    onSaveNote(lesson.id, noteContent);
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 2000);
  };

  return (
    <div className={`space-y-6 transition-all duration-300 ${isFocusMode ? 'max-w-6xl mx-auto' : ''}`}>
      
      {/* Top Header Actions */}
      <div className={`flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl border transition-colors ${
        isFocusMode 
          ? 'bg-slate-900 border-slate-800 text-white' 
          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm'
      }`}>
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <span>{subject.gradeLabel}</span>
            <span aria-hidden="true">·</span>
            <span>مادة {subject.title}</span>
            <span aria-hidden="true">·</span>
            <span>الأستاذ: {lesson.teacherName}</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mt-1">
            {lesson.title}
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          
          {/* Focus Mode Toggle */}
          <button
            onClick={() => setIsFocusMode(!isFocusMode)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
              isFocusMode
                ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                : 'text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
            }`}
          >
            {isFocusMode ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{isFocusMode ? 'إلغاء وضع التركيز' : 'وضع التركيز (سينما)'}</span>
          </button>

          {/* Daily Quiz Button */}
          <button
            onClick={() => onStartDailyQuiz(lesson)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-sm transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
            <span>الاختبار اليومي للمحاضرة ({lesson.dailyQuiz.length} أسئلة)</span>
          </button>

          {/* AI Tutor Context */}
          <button
            onClick={() => onAskAiTutor(`أنا الآن أشاهد محاضرة "${lesson.title}" لمادة "${subject.title}" للأستاذ ${lesson.teacherName} في المنهج العراقي، وأحتاج توضيحاً وتدريباً وزارياً.`)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <Brain className="w-3.5 h-3.5 text-emerald-500" />
            <span>اسأل المعلم الذكي</span>
          </button>
        </div>
      </div>

      {/* Embedded YouTube Player Container */}
      <div className={`relative rounded-2xl overflow-hidden border bg-black shadow-2xl aspect-video transition-all ${
        isFocusMode ? 'border-amber-500/50 ring-4 ring-amber-500/10' : 'border-slate-200 dark:border-slate-800'
      }`}>
        {videoId ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=0&rel=0&modestbranding=1`}
            title={lesson.title}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-white space-y-2 p-6 text-center">
            <Play className="w-12 h-12 text-slate-500" />
            <p className="text-sm font-semibold">لم يتم العثور على رابط فيديو صالح لهذه المحاضرة</p>
            <button
              onClick={onOpenImportModal}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold"
            >
              الصق رابط يوتيوب الآن
            </button>
          </div>
        )}
      </div>

      {/* Sequential Progression Strip (التتابع الدراسي) */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onCompleteLesson(lesson.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              isCompleted
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                : 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-sm'
            }`}
          >
            <CheckCircle className="w-4 h-4" />
            <span>{isCompleted ? 'أكملت هذه المحاضرة ✓' : 'إتمام المحاضرة'}</span>
          </button>

          <span className="text-xs text-slate-500 font-mono">
            المدة: {lesson.durationMinutes} دقيقة
          </span>
        </div>

        {/* Next Sequential Lesson Button */}
        {nextLesson && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">التالي تتابعياً:</span>
            <button
              onClick={() => onNavigateToLesson(nextLesson)}
              disabled={!isNextLessonUnlocked && !isCompleted}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                isNextLessonUnlocked || isCompleted
                  ? 'bg-slate-900 hover:bg-slate-800 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-200 dark:border-slate-700'
              }`}
            >
              {!(isNextLessonUnlocked || isCompleted) && <Lock className="w-3.5 h-3.5" />}
              <span>{nextLesson.title}</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* AI Smart Notes & Personal Notes */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-5">
        
        {/* Tab Switcher */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg w-fit text-xs font-medium">
          <button
            onClick={() => setActiveTab('aiSummary')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-md transition-colors ${
              activeTab === 'aiSummary'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>ملخص الدرس الذكي (AI Notes)</span>
          </button>

          <button
            onClick={() => setActiveTab('notes')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-md transition-colors ${
              activeTab === 'notes'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>دفتر ملاحظاتي الشخصي</span>
          </button>
        </div>

        {/* TAB 1: AI Smart Notes & Ministerial Summary */}
        {activeTab === 'aiSummary' && (
          <div className="space-y-4">
            
            {/* AI Generated Bullet Points */}
            {lesson.aiSummaryPoints && lesson.aiSummaryPoints.length > 0 && (
              <div className="p-4 bg-emerald-50/70 dark:bg-emerald-950/30 rounded-xl border border-emerald-100 dark:border-emerald-900/40 space-y-2">
                <span className="text-xs font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>أهم النقاط الذهبية المستخلصة من المحاضرة:</span>
                </span>
                <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300 list-disc list-inside">
                  {lesson.aiSummaryPoints.map((point, idx) => (
                    <li key={idx} className="leading-relaxed">{point}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Lecture Detailed Notes */}
            <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
              {lesson.notes}
            </div>
          </div>
        )}

        {/* TAB 2: Student Personal Notes */}
        {activeTab === 'notes' && (
          <div className="space-y-4">
            <p className="text-xs text-slate-500">
              سجل ملاحظاتك وأسئلتك التي ذكرها الأستاذ في الفيديو لتراجعها قبل الامتحان الشهري والوزاري:
            </p>
            <textarea
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              placeholder="اكتب ملاحظاتك أثناء متابعة الشرح على يوتيوب..."
              rows={6}
              className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <div className="flex items-center justify-between">
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition-colors"
              >
                حفظ الملاحظة
              </button>
              {isSavedNotice && (
                <span className="text-xs text-emerald-600 font-semibold">✓ تم الحفظ بنجاح</span>
              )}
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
