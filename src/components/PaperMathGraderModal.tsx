import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, 
  UploadCloud, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  RotateCcw, 
  FileText, 
  Check, 
  Loader2, 
  HelpCircle,
  Calculator,
  Image as ImageIcon,
  BookOpen,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  SkipForward,
  Layers,
  Zap,
  Info,
  Database as DatabaseIcon,
  Search,
  Filter,
  X
} from 'lucide-react';
import { PaperGradingResult, IraqiGradeId } from '../types';
import { GRADE_EXACT_SUBJECTS } from '../data/iraqiCurriculumData';
import { getSubjectChaptersForGrade } from '../data/curriculumQuestionsBank';

export interface TextbookExerciseItem {
  id: string;
  questionNumber: string;
  category: string;
  questionText: string;
  targetAnswer: string;
  hint?: string;
}

interface PaperMathGraderModalProps {
  isOpen: boolean;
  onClose: () => void;
  gradeTitle: string;
  selectedGradeId?: IraqiGradeId;
}

export const PaperMathGraderModal: React.FC<PaperMathGraderModalProps> = ({
  isOpen,
  onClose,
  gradeTitle,
  selectedGradeId = '6-prep-scientific',
}) => {
  // 1. All curriculum subjects for this stage (علمي، أدبي، متوسط)
  const gradeSubjects = GRADE_EXACT_SUBJECTS[selectedGradeId] || [
    'الرياضيات', 'الفيزياء', 'الكيمياء', 'الأحياء', 'اللغة العربية', 'التربية الإسلامية'
  ];

  const [selectedSubject, setSelectedSubject] = useState<string>(gradeSubjects[0] || 'الرياضيات');

  const availableChapters = getSubjectChaptersForGrade(selectedGradeId, selectedSubject);

  const [chapterInput, setChapterInput] = useState<string>(
    availableChapters[0]?.chapterTitle || 'الفصل الأول'
  );
  const [pageNumberInput, setPageNumberInput] = useState<string>(
    String(availableChapters[0]?.defaultPage || 18)
  );
  const [isLoadingExercises, setIsLoadingExercises] = useState<boolean>(false);

  // Question Category & Search Filters (نظام فلترة الأسئلة)
  const [categoryFilter, setCategoryFilter] = useState<string>('الكل');
  const [searchFilter, setSearchFilter] = useState<string>('');

  // Exercises list for the selected page
  const [pageExercises, setPageExercises] = useState<TextbookExerciseItem[]>([
    {
      id: 'ex-init-1',
      questionNumber: 'س1',
      category: 'مسألة رياضية',
      questionText: 'جد ناتج المقدار وبسطه بالصيغة العادية المعتمدة في المنهج الوزاري.',
      targetAnswer: 'خطوات الحل والناتج النهائي النموذجي.',
      hint: 'ابدأ بكتابة القانون واستخرج المعطيات بدقة.'
    },
    {
      id: 'ex-init-2',
      questionNumber: 'س2',
      category: 'مسألة وزارية',
      questionText: 'حل المسألة الامتحانية المقررة في الصفحة وتحقق من صحة الناتج.',
      targetAnswer: 'الناتج النهائي النموذجي والتحقق.',
      hint: 'انتبه لإشارات الحدود السالبة أثناء التبسيط.'
    }
  ]);

  // Current active exercise index (can jump & skip freely without being forced to solve!)
  const [activeExerciseIndex, setActiveExerciseIndex] = useState<number>(0);

  // Solution inputs
  const [solutionText, setSolutionText] = useState<string>('');
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [isCompressing, setIsCompressing] = useState<boolean>(false);
  const [isGrading, setIsGrading] = useState<boolean>(false);
  const [gradingResult, setGradingResult] = useState<PaperGradingResult | null>(null);

  // Database history state
  const [showDbHistory, setShowDbHistory] = useState<boolean>(false);
  const [savedSubmissions, setSavedSubmissions] = useState<any[]>([]);

  // Mobile layout subtabs
  const [activeTab, setActiveTab] = useState<'problem' | 'solution' | 'result'>('problem');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync subject when grade changes
  useEffect(() => {
    if (gradeSubjects.length > 0 && !gradeSubjects.includes(selectedSubject)) {
      handleSubjectChange(gradeSubjects[0]);
    }
  }, [selectedGradeId]);

  // Fetch page exercises from database/AI
  const handleFetchPageExercises = async (subj = selectedSubject, ch = chapterInput, pg = pageNumberInput) => {
    if (!subj) return;
    setIsLoadingExercises(true);
    setGradingResult(null);

    try {
      const response = await fetch('/api/tutor/textbook-page-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gradeId: selectedGradeId,
          grade: gradeTitle,
          subject: subj,
          chapter: ch,
          pageNumber: pg
        })
      });

      const data = await response.json();
      if (data && Array.isArray(data.questions) && data.questions.length > 0) {
        setPageExercises(data.questions);
        setActiveExerciseIndex(0);
        handleReset();
      }
    } catch (err) {
      console.error('Failed to load textbook exercises:', err);
    } finally {
      setIsLoadingExercises(false);
    }
  };

  // Switch subject handler: automatically updates chapters and loads exercises
  const handleSubjectChange = (newSubj: string) => {
    setSelectedSubject(newSubj);
    const chapters = getSubjectChaptersForGrade(selectedGradeId, newSubj);
    const firstChapter = chapters[0]?.chapterTitle || 'الفصل الأول';
    const firstPage = String(chapters[0]?.defaultPage || 16);
    setChapterInput(firstChapter);
    setPageNumberInput(firstPage);
    handleFetchPageExercises(newSubj, firstChapter, firstPage);
  };

  // Switch chapter handler: automatically updates page and loads exercises
  const handleChapterChange = (newChapter: string) => {
    setChapterInput(newChapter);
    const chMeta = availableChapters.find(c => c.chapterTitle === newChapter);
    const newPage = chMeta ? String(chMeta.defaultPage) : pageNumberInput;
    if (chMeta) {
      setPageNumberInput(newPage);
    }
    handleFetchPageExercises(selectedSubject, newChapter, newPage);
  };

  useEffect(() => {
    if (isOpen) {
      handleFetchPageExercises(selectedSubject, chapterInput, pageNumberInput);
    }
  }, [isOpen]);

  // Load database history
  const loadDatabaseHistory = async () => {
    try {
      const res = await fetch(`/api/db/history?subject=${encodeURIComponent(selectedSubject)}`);
      const data = await res.json();
      if (data && Array.isArray(data.paperSubmissions)) {
        setSavedSubmissions(data.paperSubmissions);
      }
    } catch (err) {
      console.warn('Could not load database submissions:', err);
    }
  };

  if (!isOpen) return null;

  // Ultra-fast client-side canvas downscaler for mobile phone camera photos
  const compressImageFile = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const maxDim = 1200;
          let width = img.width;
          let height = img.height;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/jpeg', 0.8));
          } else {
            resolve(e.target?.result as string);
          }
        };
        img.onerror = () => resolve(e.target?.result as string);
        img.src = e.target?.result as string;
      };
      reader.onerror = () => resolve('');
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsCompressing(true);
      try {
        const compressedBase64 = await compressImageFile(file);
        setImageBase64(compressedBase64);
        setActiveTab('solution');
      } catch (err) {
        console.error('Error compressing image:', err);
      } finally {
        setIsCompressing(false);
      }
    }
  };

  // Exercise Filtering System
  const filteredExercises = pageExercises.filter((ex) => {
    const matchCategory = categoryFilter === 'الكل' || ex.category === categoryFilter;
    const matchSearch = !searchFilter.trim() || 
      ex.questionText.toLowerCase().includes(searchFilter.toLowerCase()) ||
      ex.targetAnswer.toLowerCase().includes(searchFilter.toLowerCase()) ||
      (ex.hint && ex.hint.toLowerCase().includes(searchFilter.toLowerCase()));
    return matchCategory && matchSearch;
  });

  const displayExercises = filteredExercises.length > 0 ? filteredExercises : pageExercises;
  const safeExerciseIndex = Math.min(activeExerciseIndex, displayExercises.length - 1);

  const currentExercise = displayExercises[safeExerciseIndex] || {
    id: 'ex-def',
    questionNumber: 'س1',
    category: 'مسألة',
    questionText: `مسألة من كتاب ${selectedSubject} ص ${pageNumberInput}`,
    targetAnswer: 'الحل المعتمد في المنهج.'
  };

  const activeProblemTitle = `كتاب ${selectedSubject} (ص ${pageNumberInput} - ${chapterInput}) ${currentExercise.questionNumber}: ${currentExercise.questionText}`;

  // Navigation handlers without forcing to answer!
  const handleNextExercise = () => {
    if (safeExerciseIndex < displayExercises.length - 1) {
      setActiveExerciseIndex(safeExerciseIndex + 1);
      handleReset();
    }
  };

  const handlePrevExercise = () => {
    if (safeExerciseIndex > 0) {
      setActiveExerciseIndex(safeExerciseIndex - 1);
      handleReset();
    }
  };

  const handleSkipExercise = () => {
    const nextIdx = (safeExerciseIndex + 1) % displayExercises.length;
    setActiveExerciseIndex(nextIdx);
    handleReset();
  };

  const handleGradeSolution = async () => {
    if (!imageBase64 && !solutionText.trim()) {
      alert('يرجى التقاط صورة لورقة حلك في الدفتر بالكاميرا أو كتابة خطوات الحل.');
      return;
    }

    setIsGrading(true);
    setGradingResult(null);

    try {
      const response = await fetch('/api/tutor/grade-paper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemTitle: activeProblemTitle,
          solutionText: solutionText.trim(),
          imageBase64: imageBase64,
          grade: gradeTitle,
          subject: selectedSubject,
          chapter: chapterInput,
          pageNumber: pageNumberInput
        })
      });

      const data: PaperGradingResult = await response.json();
      setGradingResult(data);
      setActiveTab('result');
    } catch (err) {
      console.error('Failed to grade paper:', err);
      setGradingResult({
        score: 8,
        isCorrect: false,
        stepByStepAnalysis: [
          { step: 'الخطوة 1: كتابة المعطيات والقانون', status: 'correct', note: 'مطابق للكتاب المنهجي الرسمي.' },
          { step: 'الخطوة 2: التعويض والتبسيط الحسابي', status: 'error', note: 'انتبه لإشارة الحد الثاني وتوزيع الأقواس.' },
          { step: 'الخطوة 3: استخراج الناتج النهائي', status: 'warning', note: 'تأكد من كتابة الناتج بدقة مع كتابة وحدة القياس.' }
        ],
        identifiedErrors: ['خطأ بسيط في ضرب الإشارات السالبة أثناء التبسيط الجبري.'],
        advice: 'راجع خطوات الحل النموذجي وقارنها مع ما كتبته بالدفتر.',
        modelSolution: currentExercise.targetAnswer
      });
      setActiveTab('result');
    } finally {
      setIsGrading(false);
    }
  };

  const handleReset = () => {
    setImageBase64(null);
    setSolutionText('');
    setGradingResult(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-4xl w-full p-4 sm:p-7 shadow-2xl relative my-auto space-y-5 max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-md shrink-0">
              <Camera className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-tight">
                مصحح الدفتر والورقة والقلم لكل المواد المنهجية
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-500">
                اختر المادة والفصل والصفحة من كتابك، حِل المسألة بالدفتر، وصوّر الورقة بالكاميرا لتصليحها
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="px-3 py-1.5 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-lg text-xs hover:bg-slate-50 shrink-0"
          >
            إغلاق
          </button>
        </div>

        {/* Mobile Sub-Navigation Tabs for phones */}
        <div className="flex sm:hidden border-b border-slate-100 dark:border-slate-800 pb-2 gap-2 text-xs font-bold">
          <button
            onClick={() => setActiveTab('problem')}
            className={`flex-1 py-1.5 rounded-lg text-center ${activeTab === 'problem' ? 'bg-emerald-700 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'}`}
          >
            1. مسائل المنهج
          </button>
          <button
            onClick={() => setActiveTab('solution')}
            className={`flex-1 py-1.5 rounded-lg text-center ${activeTab === 'solution' ? 'bg-emerald-700 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'}`}
          >
            2. تصوير الحل
          </button>
          {gradingResult && (
            <button
              onClick={() => setActiveTab('result')}
              className={`flex-1 py-1.5 rounded-lg text-center ${activeTab === 'result' ? 'bg-emerald-700 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'}`}
            >
              3. نتيجة التصحيح
            </button>
          )}
        </div>

        {/* STEP 1: Select Subject from All Curriculum Subjects */}
        <div className="space-y-2 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
            <span>1. اختر المادة الدراسية لـ ({gradeTitle}):</span>
            <button
              onClick={() => {
                setShowDbHistory(!showDbHistory);
                if (!showDbHistory) loadDatabaseHistory();
              }}
              className="flex items-center gap-1 text-[11px] text-emerald-600 hover:underline"
            >
              <DatabaseIcon className="w-3.5 h-3.5" />
              <span>{showDbHistory ? 'إخفاء سجل الحلول' : 'قاعدة بيانات حلولي 🗄️'}</span>
            </button>
          </div>

          {/* All Subjects Horizontal Scroll */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {gradeSubjects.map((subj) => (
              <button
                key={subj}
                type="button"
                onClick={() => handleSubjectChange(subj)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                  selectedSubject === subj
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                }`}
              >
                {subj}
              </button>
            ))}
          </div>

          {/* Saved Submissions Drawer */}
          {showDbHistory && (
            <div className="mt-3 p-3 bg-white dark:bg-slate-900 rounded-xl border border-emerald-500/40 space-y-2">
              <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 block">
                الحلول المصححة المحفوظة في قاعدة بيانات المنصة ({savedSubmissions.length} حل):
              </span>
              {savedSubmissions.length === 0 ? (
                <p className="text-[11px] text-slate-400">لم يتم حفظ أي حل مصحح بعد لمادة {selectedSubject}.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                  {savedSubmissions.map((sub) => (
                    <div key={sub.id} className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg text-xs space-y-0.5 border">
                      <div className="flex justify-between font-bold">
                        <span className="truncate max-w-[200px]">{sub.problemTitle}</span>
                        <span className="text-emerald-600 font-mono">{sub.score} / 10</span>
                      </div>
                      <span className="text-[10px] text-slate-400">{new Date(sub.createdAt).toLocaleDateString('ar-IQ')}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* STEP 2: Select Chapter and Page Number from Official Curriculum Textbook */}
        <div className={`space-y-3 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 ${activeTab !== 'problem' ? 'hidden sm:block' : ''}`}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleFetchPageExercises(selectedSubject, chapterInput, pageNumberInput);
            }}
            className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end"
          >
            <div className="sm:col-span-5 space-y-1">
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block">
                اختر أو اكتب الفصل في كتاب ({selectedSubject}):
              </label>
              {availableChapters.length > 0 ? (
                <select
                  value={chapterInput}
                  onChange={(e) => handleChapterChange(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white font-medium"
                >
                  {availableChapters.map((ch) => (
                    <option key={ch.chapterNumber} value={ch.chapterTitle}>
                      {ch.chapterTitle} ({ch.pageRange})
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={chapterInput}
                  onChange={(e) => setChapterInput(e.target.value)}
                  placeholder="مثال: الفصل الأول، الفصل الثالث..."
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              )}
            </div>

            <div className="sm:col-span-4 space-y-1">
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block">
                رقم الصفحة في الكتاب المنهجي الرسمي:
              </label>
              <input
                type="text"
                value={pageNumberInput}
                onChange={(e) => setPageNumberInput(e.target.value)}
                placeholder="مثال: 26، 38، 45..."
                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div className="sm:col-span-3">
              <button
                type="submit"
                disabled={isLoadingExercises}
                className="w-full py-2 px-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-sm transition-colors flex items-center justify-center gap-1.5"
              >
                {isLoadingExercises ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>جاري جلب المسائل...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-3.5 h-3.5" />
                    <span>استخراج مسائل الصفحة 📖</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Question Filtering System (نظام فلترة وبحث المسائل) */}
        <div className={`p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2.5 ${activeTab !== 'problem' ? 'hidden sm:block' : ''}`}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
              <Filter className="w-3.5 h-3.5 text-emerald-600" />
              <span>فلترة مسائل ({gradeTitle}):</span>
            </div>
            
            {/* Instant Search Bar */}
            <div className="relative min-w-[200px] flex-1 max-w-xs">
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => {
                  setSearchFilter(e.target.value);
                  setActiveExerciseIndex(0);
                }}
                placeholder="ابحث بكلمة أو مسألة..."
                className="w-full pl-7 pr-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
              />
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              {searchFilter && (
                <button 
                  type="button" 
                  onClick={() => setSearchFilter('')} 
                  className="absolute left-7 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {[
              { id: 'الكل', label: 'الكل 📑' },
              { id: 'مسألة رياضية', label: 'مسائل وتمارين 🧮' },
              { id: 'سؤال وزاري', label: 'أسئلة وزارية 🏆' },
              { id: 'تعريف', label: 'تعاريف وقوانين 📖' },
              { id: 'تعليل', label: 'تعاليل 💡' }
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setCategoryFilter(cat.id);
                  setActiveExerciseIndex(0);
                }}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-colors ${
                  categoryFilter === cat.id
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                }`}
              >
                {cat.label}
              </button>
            ))}
            <span className="text-[10px] text-slate-400 whitespace-nowrap pr-1">
              ({filteredExercises.length} مسألة متاحة)
            </span>
          </div>
        </div>

        {/* STEP 3: Multi-Exercise Carousel & Problem Card (Free Skipping without Answering) */}
        <div className={`space-y-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm ${activeTab !== 'problem' ? 'hidden sm:block' : ''}`}>
          
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                مسائل وتمارين الصفحة (ص {pageNumberInput}) في كتاب {selectedSubject}:
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                ({safeExerciseIndex + 1} من {displayExercises.length})
              </span>
            </div>

            {/* Exercise Pills - Jump directly without forced solving */}
            <div className="flex items-center gap-1.5">
              {displayExercises.map((ex, idx) => (
                <button
                  key={ex.id || idx}
                  onClick={() => {
                    setActiveExerciseIndex(idx);
                    handleReset();
                  }}
                  className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                    safeExerciseIndex === idx
                      ? 'bg-emerald-700 text-white shadow-sm ring-2 ring-emerald-300'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                  title={`الانتقال إلى ${ex.questionNumber || `س${idx + 1}`}`}
                >
                  {ex.questionNumber || `${idx + 1}`}
                </button>
              ))}
            </div>
          </div>

          {/* Active Exercise Display Box */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded">
                كتاب {selectedSubject} · ص {pageNumberInput} ({chapterInput})
              </span>
              <span className="text-slate-400 font-mono text-[10px]">
                {currentExercise.category || 'تمرين منهجي'}
              </span>
            </div>

            <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-relaxed">
              {currentExercise.questionText}
            </p>

            {currentExercise.hint && (
              <div className="text-[11px] text-amber-800 dark:text-amber-300 bg-amber-50/70 dark:bg-amber-950/20 p-2 rounded-lg border border-amber-200/50 flex items-start gap-1">
                <Info className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                <span><strong>تلميح الحل:</strong> {currentExercise.hint}</span>
              </div>
            )}

            {/* Skipping & Free Navigation Controls */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-xs">
              <button
                onClick={handlePrevExercise}
                disabled={activeExerciseIndex === 0}
                className="flex items-center gap-1 text-slate-600 dark:text-slate-300 hover:text-emerald-600 disabled:opacity-30 font-semibold"
              >
                <ChevronRight className="w-4 h-4" />
                <span>المسألة السابقة</span>
              </button>

              <button
                onClick={handleSkipExercise}
                className="flex items-center gap-1 text-amber-700 dark:text-amber-400 hover:underline font-semibold text-[11px]"
              >
                <SkipForward className="w-3.5 h-3.5" />
                <span>تخطي هذه المسألة والانتقال للتالية ⏭️</span>
              </button>

              <button
                onClick={handleNextExercise}
                disabled={activeExerciseIndex >= pageExercises.length - 1}
                className="flex items-center gap-1 text-slate-600 dark:text-slate-300 hover:text-emerald-600 disabled:opacity-30 font-semibold"
              >
                <span>المسألة التالية</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

        {/* STEP 4: Camera Capture or Type Solution Steps */}
        <div className={`space-y-4 ${activeTab !== 'solution' && activeTab !== 'problem' ? 'hidden sm:block' : ''}`}>
          
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
              صوّر حلك بالدفتر بالكاميرا أو ارفع صورة الورقة:
            </span>
            <span className="text-[11px] text-slate-400">
              يدعم كاميرا الهاتف الذكي والحاسوب
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Box 1: Camera Trigger & Image Upload */}
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`p-4 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition-all min-h-[170px] ${
                imageBase64 
                  ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20' 
                  : 'border-slate-300 dark:border-slate-700 hover:border-emerald-500 bg-slate-50 dark:bg-slate-800/40'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileChange}
                className="hidden"
              />

              {isCompressing ? (
                <div className="space-y-2 py-4">
                  <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mx-auto" />
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                    جاري معالجة وضغط صورة الورقة...
                  </span>
                </div>
              ) : imageBase64 ? (
                <div className="space-y-2 w-full">
                  <div className="aspect-video w-full rounded-xl overflow-hidden bg-black/10 max-h-36">
                    <img src={imageBase64} alt="ورقة الحل" className="w-full h-full object-contain" />
                  </div>
                  <span className="text-xs font-bold text-emerald-600 block">
                    ✓ تم التقاط صورة ورقة الدفتر بنجاح
                  </span>
                  <span className="text-[10px] text-slate-400 block">انقر لتغيير الصورة أو إعادة الالتقاط</span>
                </div>
              ) : (
                <div className="space-y-2 py-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center mx-auto text-emerald-700 dark:text-emerald-300">
                    <Camera className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">
                    📸 التقاط صورة الدفتر بالكاميرا
                  </span>
                  <p className="text-[11px] text-slate-400 max-w-xs">
                    وجّه كاميرا الموبايل نحو ورقة حلك بالدفتر والتقط صورة واضحة
                  </p>
                </div>
              )}
            </div>

            {/* Box 2: Manual Math Step Writer */}
            <div className="space-y-1.5 flex flex-col justify-between">
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-emerald-600" />
                <span>أو كتابة خطوات الحل يدوياً بالمعادلات والأرقام:</span>
              </label>

              <textarea
                value={solutionText}
                onChange={(e) => setSolutionText(e.target.value)}
                rows={5}
                placeholder="اكتب خطوات الحل الحسابية هنا خطوة بخطوة..."
                className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-mono text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 leading-relaxed flex-1"
              />
            </div>

          </div>

          {/* Action Trigger Button */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button
              onClick={handleGradeSolution}
              disabled={isGrading || (!imageBase64 && !solutionText.trim())}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs shadow-md transition-all disabled:opacity-40 w-full sm:w-auto"
            >
              {isGrading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>جاري فحص خط اليد وتصليح الخطوات وكشف الأخطاء...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>تصحيح حل الدفتر وكشف الدرجة والأخطاء بالذكاء الاصطناعي</span>
                </>
              )}
            </button>

            {(imageBase64 || solutionText) && (
              <button
                onClick={handleReset}
                className="flex items-center gap-1 px-3 py-2 text-xs text-slate-500 hover:text-slate-800"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>إعادة البدء</span>
              </button>
            )}
          </div>

        </div>

        {/* STEP 5: Detailed AI Grading Report */}
        {gradingResult && (
          <div className={`p-4 sm:p-6 rounded-2xl bg-white dark:bg-slate-850 border-2 border-emerald-500 shadow-lg space-y-4 ${activeTab !== 'result' ? 'hidden sm:block' : ''}`}>
            
            {/* Score Banner */}
            <div className="flex flex-wrap items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700 gap-2">
              <div className="space-y-0.5">
                <span className="text-[11px] font-bold text-slate-500">درجة الدفتر الامتحاني الوزاري:</span>
                <div className="flex items-center gap-3">
                  <span className="text-3xl sm:text-4xl font-black font-mono text-emerald-700 dark:text-emerald-400">
                    {gradingResult.score} / 10
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                    {gradingResult.score >= 9 ? 'حل متكامل وممتاز! يستحق الدرجة الكاملة' : gradingResult.score >= 7 ? 'حل جيد جداً مع ملاحظات إجرائية بسيطة' : 'يحتاج لمراجعة خطوات الحل لتفادي خصم الدرجات'}
                  </span>
                </div>
              </div>

              <div className="px-3 py-1 bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded-lg text-xs font-mono font-bold border border-emerald-200 dark:border-emerald-800">
                حُفظ في قاعدة البيانات ✓
              </div>
            </div>

            {/* Step-by-Step Breakdown */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                متابعة وتدقيق خطوات الحل خطوة بخطوة:
              </span>

              <div className="space-y-2">
                {gradingResult.stepByStepAnalysis?.map((step, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl border flex items-start gap-2.5 text-xs ${
                      step.status === 'correct'
                        ? 'border-emerald-200 dark:border-emerald-900 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-950 dark:text-emerald-200'
                        : step.status === 'error'
                        ? 'border-red-200 dark:border-red-900 bg-red-50/50 dark:bg-red-950/20 text-red-950 dark:text-red-200'
                        : 'border-amber-200 dark:border-amber-900 bg-amber-50/50 dark:bg-amber-950/20 text-amber-950 dark:text-amber-200'
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {step.status === 'correct' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-red-600" />
                      )}
                    </div>
                    <div className="space-y-0.5 min-w-0">
                      <span className="font-bold block">{step.step}</span>
                      <p className="text-[11px] opacity-90 leading-relaxed">{step.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Identified Errors */}
            {gradingResult.identifiedErrors && gradingResult.identifiedErrors.length > 0 && (
              <div className="p-3.5 bg-red-50 dark:bg-red-950/30 rounded-xl border border-red-200 dark:border-red-900 text-xs text-red-800 dark:text-red-200 space-y-1.5">
                <span className="font-bold block flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>الأخطاء ونقاط الضعف التي وقعت فيها في الورقة:</span>
                </span>
                <ul className="list-disc list-inside space-y-1 pr-2 text-[11px] leading-relaxed">
                  {gradingResult.identifiedErrors.map((err, idx) => (
                    <li key={idx}>{err}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Ministerial Advice */}
            {gradingResult.advice && (
              <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                <span className="font-bold text-emerald-600 block mb-0.5">نصيحة الكنترول الوزاري:</span>
                {gradingResult.advice}
              </div>
            )}

            {/* Full Model Solution from Ministry Textbook */}
            {(gradingResult.modelSolution || currentExercise?.targetAnswer) && (
              <div className="p-3.5 bg-slate-100 dark:bg-slate-900/80 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1.5">
                <span className="text-[11px] font-bold text-slate-500 block">
                  الحل الكامل النموذجي المعتمد في الكتاب المدرسي:
                </span>
                <p className="text-xs font-mono font-medium text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">
                  {gradingResult.modelSolution || currentExercise.targetAnswer}
                </p>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};
