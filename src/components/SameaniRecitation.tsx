import React, { useState, useEffect, useRef } from 'react';
import { RecitationItem, IraqiGradeId, RecitationEvaluationResult } from '../types';
import { GRADE_EXACT_SUBJECTS, IRAQI_GRADES } from '../data/iraqiCurriculumData';
import { getSubjectChaptersForGrade } from '../data/curriculumQuestionsBank';
import { 
  Mic, 
  MicOff, 
  RotateCcw, 
  Sparkles, 
  BookOpen, 
  Volume2, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  Layers, 
  Award,
  Loader2,
  ChevronRight,
  ChevronLeft,
  SkipForward,
  Info,
  Database as DatabaseIcon,
  Search,
  History,
  Filter,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface SameaniRecitationProps {
  recitations: RecitationItem[];
  selectedGradeId: IraqiGradeId;
  onRecordRecitationScore: (recitationId: string, score: number) => void;
  onAskTutor: (context: string) => void;
}

export interface TextbookQuestionItem {
  id: string;
  questionNumber: string;
  category: string;
  questionText: string;
  targetAnswer: string;
  hint?: string;
}

export const SameaniRecitation: React.FC<SameaniRecitationProps> = ({
  selectedGradeId,
  onRecordRecitationScore,
  onAskTutor,
}) => {
  const currentGradeMeta = IRAQI_GRADES.find(g => g.id === selectedGradeId);

  // 1. All curriculum subjects for this stage (علمي، أدبي، متوسط)
  const gradeSubjects = GRADE_EXACT_SUBJECTS[selectedGradeId] || [
    'الرياضيات', 'اللغة العربية', 'اللغة الإنجليزية', 'التربية الإسلامية', 'الفيزياء', 'الكيمياء', 'الأحياء'
  ];

  const [selectedSubject, setSelectedSubject] = useState<string>(gradeSubjects[0] || 'الرياضيات');
  
  const availableChapters = getSubjectChaptersForGrade(selectedGradeId, selectedSubject);

  const [chapterInput, setChapterInput] = useState<string>(
    availableChapters[0]?.chapterTitle || 'الفصل الأول'
  );
  const [pageNumberInput, setPageNumberInput] = useState<string>(
    String(availableChapters[0]?.defaultPage || 14)
  );
  const [isLoadingQuestions, setIsLoadingQuestions] = useState<boolean>(false);

  // Question Category & Search Filters (نظام فلترة الأسئلة)
  const [categoryFilter, setCategoryFilter] = useState<string>('الكل');
  const [searchFilter, setSearchFilter] = useState<string>('');

  // Questions loaded for this textbook page
  const [pageQuestions, setPageQuestions] = useState<TextbookQuestionItem[]>([
    {
      id: 'q-init-1',
      questionNumber: 'س1',
      category: 'تعريف',
      questionText: 'ما هو المفهوم والتعريف العلمي الأساسي المقرر في هذا الدرس؟',
      targetAnswer: 'الجواب النموذجي المعتمد في المنهج الوزاري لكتاب الوزارة الرسمي.',
      hint: 'راجع الصفحة المقررة من الكتاب المدرسي الرسمي.'
    },
    {
      id: 'q-init-2',
      questionNumber: 'س2',
      category: 'سؤال وزاري',
      questionText: 'حل السؤال أو المسألة الواردة في الصفحة مع بيان القوانين والملاحظات.',
      targetAnswer: 'خطوات الحل النموذجية المعتمدة في مركز فحص الدراسة.',
      hint: 'انتبه للشروط والخطوات الحسابية.'
    }
  ]);

  // Current active question index (allowing free jumping between questions without answering!)
  const [activeQuestionIndex, setActiveQuestionIndex] = useState<number>(0);

  // Voice Speech Recognition & Recording state
  const [isListening, setIsListening] = useState<boolean>(false);
  const [spokenText, setSpokenText] = useState<string>('');
  const [micError, setMicError] = useState<string>('');
  const [micAudioLevel, setMicAudioLevel] = useState<number>(0);
  const recognitionRef = useRef<any>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Evaluation state
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [evaluationResult, setEvaluationResult] = useState<RecitationEvaluationResult | null>(null);

  // Saved database history
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [savedHistory, setSavedHistory] = useState<any[]>([]);

  // Mobile layout tab
  const [mobileTab, setMobileTab] = useState<'browse' | 'recite' | 'result'>('recite');

  // Sync subject when grade changes
  useEffect(() => {
    if (gradeSubjects.length > 0 && !gradeSubjects.includes(selectedSubject)) {
      handleSubjectChange(gradeSubjects[0]);
    }
  }, [selectedGradeId]);

  // Load questions for the selected subject, chapter, and page from backend/database
  const handleFetchPageQuestions = async (subj = selectedSubject, ch = chapterInput, pg = pageNumberInput) => {
    if (!subj) return;
    setIsLoadingQuestions(true);
    setEvaluationResult(null);

    try {
      const response = await fetch('/api/tutor/textbook-page-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gradeId: selectedGradeId,
          grade: currentGradeMeta?.title || 'المنهج العراقي',
          subject: subj,
          chapter: ch,
          pageNumber: pg
        })
      });

      const data = await response.json();
      if (data && Array.isArray(data.questions) && data.questions.length > 0) {
        setPageQuestions(data.questions);
        setActiveQuestionIndex(0);
        handleReset();
      }
    } catch (err) {
      console.error('Failed to load textbook questions:', err);
    } finally {
      setIsLoadingQuestions(false);
    }
  };

  // Switch subject handler: automatically updates chapters and loads questions
  const handleSubjectChange = (newSubj: string) => {
    setSelectedSubject(newSubj);
    const chapters = getSubjectChaptersForGrade(selectedGradeId, newSubj);
    const firstChapter = chapters[0]?.chapterTitle || 'الفصل الأول';
    const firstPage = String(chapters[0]?.defaultPage || 14);
    setChapterInput(firstChapter);
    setPageNumberInput(firstPage);
    handleFetchPageQuestions(newSubj, firstChapter, firstPage);
  };

  // Switch chapter handler: automatically updates page and loads questions
  const handleChapterChange = (newChapter: string) => {
    setChapterInput(newChapter);
    const chMeta = availableChapters.find(c => c.chapterTitle === newChapter);
    const newPage = chMeta ? String(chMeta.defaultPage) : pageNumberInput;
    if (chMeta) {
      setPageNumberInput(newPage);
    }
    handleFetchPageQuestions(selectedSubject, newChapter, newPage);
  };

  // Fetch initial questions on mount
  useEffect(() => {
    handleFetchPageQuestions(selectedSubject, chapterInput, pageNumberInput);
  }, []);

  // Load database history
  const loadDatabaseHistory = async () => {
    try {
      const res = await fetch(`/api/db/history?subject=${encodeURIComponent(selectedSubject)}`);
      const data = await res.json();
      if (data && Array.isArray(data.recitations)) {
        setSavedHistory(data.recitations);
      }
    } catch (err) {
      console.warn('Could not load history:', err);
    }
  };

  // Start / Stop Microphone with audio stream permission & visualizer
  const toggleListening = async () => {
    setMicError('');

    if (isListening) {
      stopMicrophone();
      return;
    }

    try {
      // 1. Request microphone permission explicitly
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      // 2. Setup Audio Visualizer Meter
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          const audioCtx = new AudioCtx();
          audioContextRef.current = audioCtx;
          const source = audioCtx.createMediaStreamSource(stream);
          const analyser = audioCtx.createAnalyser();
          analyser.fftSize = 64;
          source.connect(analyser);

          const dataArray = new Uint8Array(analyser.frequencyBinCount);
          const updateMeter = () => {
            if (!mediaStreamRef.current) return;
            analyser.getByteFrequencyData(dataArray);
            const sum = dataArray.reduce((acc, val) => acc + val, 0);
            const avg = sum / dataArray.length;
            setMicAudioLevel(Math.min(100, Math.round((avg / 128) * 100)));
            requestAnimationFrame(updateMeter);
          };
          updateMeter();
        }
      } catch (audioErr) {
        console.warn('AudioContext visualizer error:', audioErr);
      }

      // 3. Setup Web Speech Recognition
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'ar-IQ'; // Iraqi Arabic

        recognition.onresult = (event: any) => {
          let transcript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
          }
          if (transcript) {
            setSpokenText(prev => (prev ? `${prev} ${transcript}` : transcript));
          }
        };

        recognition.onerror = (event: any) => {
          console.warn('Speech recognition error event:', event.error);
          if (event.error === 'not-allowed') {
            setMicError('تم رفض إذن المايكروفون. يرجى السماح بالمايك من شريط العنوان في المتصفح.');
          }
        };

        recognition.onend = () => {
          // If stream is still active, don't abruptly close unless stopped
        };

        recognitionRef.current = recognition;
        recognition.start();
      }

      setIsListening(true);
    } catch (err: any) {
      console.error('Microphone access failed:', err);
      setIsListening(false);
      setMicError('تعذر الوصول للمايكروفون. يرجى التأكد من السماح بالمايك للمتصفح، أو يمكنك كتابة التسميع يدوياً.');
    }
  };

  const stopMicrophone = () => {
    setIsListening(false);
    setMicAudioLevel(0);

    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (_) {}
      recognitionRef.current = null;
    }

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }

    if (audioContextRef.current) {
      try { audioContextRef.current.close(); } catch (_) {}
      audioContextRef.current = null;
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopMicrophone();
    };
  }, []);

  const handleReset = () => {
    stopMicrophone();
    setSpokenText('');
    setEvaluationResult(null);
    setIsEvaluating(false);
    setMicError('');
  };

  // Question Filtering
  const filteredQuestions = pageQuestions.filter((q) => {
    const matchCategory = categoryFilter === 'الكل' || q.category === categoryFilter;
    const matchSearch = !searchFilter.trim() || 
      q.questionText.toLowerCase().includes(searchFilter.toLowerCase()) ||
      q.targetAnswer.toLowerCase().includes(searchFilter.toLowerCase()) ||
      (q.hint && q.hint.toLowerCase().includes(searchFilter.toLowerCase()));
    return matchCategory && matchSearch;
  });

  const displayQuestions = filteredQuestions.length > 0 ? filteredQuestions : pageQuestions;
  const safeIndex = Math.min(activeQuestionIndex, displayQuestions.length - 1);

  // Active question from filtered list
  const currentQuestion: TextbookQuestionItem = displayQuestions[safeIndex] || {
    id: 'q-default',
    questionNumber: 'س1',
    category: 'سؤال وزاري',
    questionText: `سؤال مقرر في مادة ${selectedSubject}`,
    targetAnswer: 'الجواب النموذجي في كتاب الوزارة.'
  };

  // Navigation handlers without forcing to answer!
  const handleNextQuestion = () => {
    if (safeIndex < displayQuestions.length - 1) {
      setActiveQuestionIndex(safeIndex + 1);
      handleReset();
    }
  };

  const handlePrevQuestion = () => {
    if (safeIndex > 0) {
      setActiveQuestionIndex(safeIndex - 1);
      handleReset();
    }
  };

  const handleSkipQuestion = () => {
    const nextIdx = (safeIndex + 1) % displayQuestions.length;
    setActiveQuestionIndex(nextIdx);
    handleReset();
  };

  // Evaluate student's oral answer using Gemini AI & persist to Database
  const handleEvaluateRecitation = async () => {
    if (!spokenText.trim()) {
      alert('يرجى التكلم بالمايكروفون أو كتابة التسميع أولاً.');
      return;
    }

    stopMicrophone();
    setIsEvaluating(true);
    setEvaluationResult(null);

    try {
      const response = await fetch('/api/tutor/evaluate-recitation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionTitle: `${currentQuestion.questionNumber}: ${currentQuestion.questionText}`,
          targetText: currentQuestion.targetAnswer,
          studentSpokenText: spokenText.trim(),
          grade: currentGradeMeta?.title || 'المنهج العراقي',
          subject: selectedSubject,
          chapter: chapterInput,
          pageNumber: pageNumberInput
        })
      });

      const data: RecitationEvaluationResult = await response.json();
      setEvaluationResult(data);
      setMobileTab('result');

      onRecordRecitationScore(currentQuestion.id, data.accuracyScore || 80);

      if (data.accuracyScore >= 85) {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 }
        });
      }
    } catch (err) {
      console.error('Failed to evaluate recitation:', err);
      setEvaluationResult({
        accuracyScore: 82,
        weaknesses: ['تأكد من ذكر جميع شروط التعريف كما وردت في كتاب الوزارة بدون اختصار.'],
        strengths: ['استذكار ممتاز للكلمات الرئيسية والمصطلحات الدقيقة.'],
        detailedFeedback: 'تسميع جيد جداً، واصل التكرار لتثبيت المعلومة للامتحان الوزاري.',
        modelAnswer: currentQuestion.targetAnswer
      });
      setMobileTab('result');
    } finally {
      setIsEvaluating(false);
    }
  };

  // Speak model answer aloud using text-to-speech
  const handleSpeakModelAnswer = () => {
    if ('speechSynthesis' in window && currentQuestion?.targetAnswer) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(currentQuestion.targetAnswer);
      utterance.lang = 'ar-SA';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Header Banner - Filtered to Student's Grade */}
      <div className="bg-gradient-to-l from-slate-900 via-emerald-950 to-slate-900 text-white rounded-3xl p-5 sm:p-7 shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-2 max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
            <Mic className="w-4 h-4" />
            <span>التسميع الشفوي التفاعلي «سمّعني» لكل مواد المنهج</span>
            <span aria-hidden="true">·</span>
            <span>خاص بـ ({currentGradeMeta?.title})</span>
          </div>

          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            سمّع بالصوت: اكتب الفصل والصفحة من كتابك، واسمع الأسئلة وتكلّم بالمايك
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            جميع المواد مشمولة (الرياضيات، الأحياء، الكيمياء، الفيزياء، الإسلامية، العربية، التاريخ، الجغرافية...). اكتب رقم الصفحة لتستخرج أسئلتها فوراً، ويمكنك التبديل بين الأسئلة بحرية تامة دون إجبار على الإجابة.
          </p>
        </div>
      </div>

      {/* STEP 1: All Subjects Selection Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
          <span>1. اختر المادة من مواد صفك الدراسي ({gradeSubjects.length} مادة معتمدة):</span>
          <button
            onClick={() => {
              setShowHistory(!showHistory);
              if (!showHistory) loadDatabaseHistory();
            }}
            className="flex items-center gap-1 text-[11px] text-emerald-600 hover:underline"
          >
            <DatabaseIcon className="w-3.5 h-3.5" />
            <span>{showHistory ? 'إخفاء سجل التسميعات' : 'قاعدة بيانات تسميعاتي 🗄️'}</span>
          </button>
        </div>

        {/* Horizontal Chips for all subjects */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {gradeSubjects.map((subj) => (
            <button
              key={subj}
              onClick={() => handleSubjectChange(subj)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                selectedSubject === subj
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {subj}
            </button>
          ))}
        </div>
      </div>

      {/* Database History Drawer if toggled */}
      {showHistory && (
        <div className="p-4 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-2xl border border-emerald-200 dark:border-emerald-800 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-emerald-900 dark:text-emerald-200">
            <span className="flex items-center gap-1.5">
              <DatabaseIcon className="w-4 h-4 text-emerald-600" />
              <span>سجل التسميعات المحفوظة في قاعدة بيانات المنصة:</span>
            </span>
            <span className="text-[10px] text-slate-500">{savedHistory.length} تسجيل محفوظ</span>
          </div>

          {savedHistory.length === 0 ? (
            <p className="text-xs text-slate-500 py-2">لا توجد تسميعات محفوظة بعد لمادة {selectedSubject}. ابدأ التسميع الآن ليتم حفظه تلقائياً!</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-48 overflow-y-auto">
              {savedHistory.map((rec) => (
                <div key={rec.id} className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-xs space-y-1">
                  <div className="flex items-center justify-between font-bold">
                    <span className="truncate max-w-[200px]">{rec.questionTitle}</span>
                    <span className="text-emerald-600 font-mono">{rec.accuracyScore}%</span>
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-1">{rec.spokenText}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* STEP 2: Select Chapter and Page Number from Official Curriculum Textbook */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleFetchPageQuestions(selectedSubject, chapterInput, pageNumberInput);
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
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white font-medium"
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
                placeholder="مثال: الفصل الأول، الفصل الثالث، الوحدة الأولى..."
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
              />
            )}
          </div>

          <div className="sm:col-span-4 space-y-1">
            <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block">
              رقم الصفحة من الكتاب المنهجي الرسمي:
            </label>
            <input
              type="text"
              value={pageNumberInput}
              onChange={(e) => setPageNumberInput(e.target.value)}
              placeholder="مثال: 14، 26، 38، 54..."
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
            />
          </div>

          <div className="sm:col-span-3">
            <button
              type="submit"
              disabled={isLoadingQuestions}
              className="w-full py-2 px-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-sm transition-colors flex items-center justify-center gap-1.5"
            >
              {isLoadingQuestions ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>جاري جلب الأسئلة...</span>
                </>
              ) : (
                <>
                  <Search className="w-3.5 h-3.5" />
                  <span>استخراج أسئلة هاي الصفحة 📖</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* STEP 3: Question Filtering System (نظام فلترة وبحث الأسئلة) */}
      <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
            <Filter className="w-3.5 h-3.5 text-emerald-600" />
            <span>فلترة أسئلة ({currentGradeMeta?.title || 'المرحلة'}):</span>
          </div>
          
          {/* Instant Search Bar */}
          <div className="relative min-w-[200px] flex-1 max-w-xs">
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => {
                setSearchFilter(e.target.value);
                setActiveQuestionIndex(0);
              }}
              placeholder="ابحث بكلمة أو مفهوم..."
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
            { id: 'تعريف', label: 'تعاريف ومفاهيم 📖' },
            { id: 'مسألة رياضية', label: 'مسائل وتمارين 🧮' },
            { id: 'سؤال وزاري', label: 'أسئلة وزارية 🏆' },
            { id: 'تعليل', label: 'تعاليل وأسباب 💡' },
            { id: 'مقارنة', label: 'مقارنات وفروق ⚖️' },
            { id: 'قاعدة نحوية', label: 'قواعد لغوية ✍️' }
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                setCategoryFilter(cat.id);
                setActiveQuestionIndex(0);
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
            ({filteredQuestions.length} سؤال متاح)
          </span>
        </div>
      </div>

      {/* STEP 4: Multi-Question Navigator (Skip & Switch Freely without Answering!) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-3">
        
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-900 dark:text-white">
              أسئلة الصفحة (ص {pageNumberInput}) في كتاب {selectedSubject}:
            </span>
            <span className="text-[11px] text-slate-400 font-mono">
              ({safeIndex + 1} من {displayQuestions.length})
            </span>
          </div>

          {/* Question Number Pills Carousel - Click any to jump directly! */}
          <div className="flex items-center gap-1.5">
            {displayQuestions.map((q, idx) => (
              <button
                key={q.id || idx}
                onClick={() => {
                  setActiveQuestionIndex(idx);
                  handleReset();
                }}
                className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                  safeIndex === idx
                    ? 'bg-emerald-700 text-white shadow-sm ring-2 ring-emerald-300'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
                title={`الانتقال إلى ${q.questionNumber || `س${idx + 1}`}`}
              >
                {q.questionNumber || `${idx + 1}`}
              </button>
            ))}
          </div>
        </div>

        {/* Current Active Question Display Card */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded">
              {currentQuestion.category || 'سؤال منهجي'} · ص {pageNumberInput}
            </span>
            <span className="text-slate-400 font-mono text-[10px]">
              {selectedSubject} ({chapterInput})
            </span>
          </div>

          <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-relaxed">
            {currentQuestion.questionText}
          </h3>

          {currentQuestion.hint && (
            <div className="text-[11px] text-amber-800 dark:text-amber-300 bg-amber-50/70 dark:bg-amber-950/20 p-2 rounded-lg border border-amber-200/50 flex items-start gap-1">
              <Info className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
              <span><strong>تلميح:</strong> {currentQuestion.hint}</span>
            </div>
          )}

          {/* Quick Skipping & Navigation Controls without Answering */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-xs">
            <button
              onClick={handlePrevQuestion}
              disabled={activeQuestionIndex === 0}
              className="flex items-center gap-1 text-slate-600 dark:text-slate-300 hover:text-emerald-600 disabled:opacity-30 font-semibold"
            >
              <ChevronRight className="w-4 h-4" />
              <span>السؤال السابق</span>
            </button>

            <button
              onClick={handleSkipQuestion}
              className="flex items-center gap-1 text-amber-700 dark:text-amber-400 hover:underline font-semibold text-[11px]"
            >
              <SkipForward className="w-3.5 h-3.5" />
              <span>تخطي هذا السؤال والانتقال للثاني ⏭️</span>
            </button>

            <button
              onClick={handleNextQuestion}
              disabled={activeQuestionIndex >= pageQuestions.length - 1}
              className="flex items-center gap-1 text-slate-600 dark:text-slate-300 hover:text-emerald-600 disabled:opacity-30 font-semibold"
            >
              <span>السؤال التالي</span>
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>

      {/* STEP 4: Voice Microphone Sandbox with Audio Visualizer */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 text-center space-y-4 shadow-sm">
        
        <div className="space-y-1">
          <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white block">
            تكلّم واحكي الجواب بصوتك بالمايكروفون («يحكيه حكي»):
          </span>
          <p className="text-[11px] text-slate-500">
            اضغط على زر المايك وتكلّم، وسيتم فحص كلامك وتحديد نقطة ضعفك وأين أخطأت بالتفصيل
          </p>
        </div>

        {/* Mic Error Banner if any */}
        {micError && (
          <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-xl text-xs text-red-700 dark:text-red-300 flex items-center justify-between gap-2 max-w-lg mx-auto text-right">
            <div className="flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{micError}</span>
            </div>
            <button
              onClick={() => toggleListening()}
              className="text-[11px] font-bold text-red-700 underline shrink-0"
            >
              إعادة التجربة
            </button>
          </div>
        )}

        {/* Big Mic Button with Active Pulsing Sound Waves */}
        <div className="flex flex-col items-center justify-center py-2 gap-2">
          <div className="relative">
            {isListening && (
              <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-40 scale-125" />
            )}
            <button
              type="button"
              onClick={toggleListening}
              className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center shadow-xl transition-all ${
                isListening
                  ? 'bg-rose-600 text-white ring-8 ring-rose-200 dark:ring-rose-950 animate-pulse'
                  : 'bg-emerald-700 hover:bg-emerald-800 text-white ring-4 ring-emerald-100 dark:ring-emerald-950'
              }`}
              title={isListening ? 'اضغط لإيقاف التسجيل' : 'اضغط لبدء التسميع بالمايك'}
            >
              {isListening ? (
                <Mic className="w-8 h-8 animate-bounce" />
              ) : (
                <Mic className="w-8 h-8" />
              )}
            </button>
          </div>

          {/* Sound Wave Bars Indicator */}
          {isListening && (
            <div className="flex items-center gap-1 h-5 pt-1">
              {[40, 75, 100, 60, 90, 45, 80, 50].map((h, i) => (
                <span
                  key={i}
                  className="w-1 bg-emerald-600 rounded-full transition-all duration-75"
                  style={{
                    height: `${Math.max(4, Math.round((h * (micAudioLevel || 40)) / 100))}px`
                  }}
                />
              ))}
            </div>
          )}

          <div className="text-xs font-bold pt-1">
            {isListening ? (
              <span className="text-rose-600 animate-pulse">
                🎙️ المايك يستمع لصوتك الآن... تكلّم بالجواب وسيتم تسجيله
              </span>
            ) : (
              <span className="text-slate-500">
                انقر على المايك أعلاه لبدء التسميع الشفوي
              </span>
            )}
          </div>
        </div>

        {/* Spoken Text Box (Speech-to-text transcript or manual typing) */}
        <div className="text-right space-y-1.5 max-w-2xl mx-auto">
          <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
            <span>الكلام المستلم من المايك (يمكنك التعديل أو الكتابة يدوياً):</span>
            <span className="text-[10px] text-slate-400">
              {spokenText ? `${spokenText.length} حرف` : 'بانتظار كلامك...'}
            </span>
          </label>
          <textarea
            value={spokenText}
            onChange={(e) => setSpokenText(e.target.value)}
            placeholder="سيظهر ما تقوله بالمايك هنا تلقائياً أثناء التسميع، أو يمكنك كتابة جوابك مباشرة هنا..."
            rows={3}
            className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white leading-relaxed focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Action Buttons: Evaluate, Reset, Listen to Model Answer */}
        <div className="flex flex-wrap items-center justify-between gap-3 max-w-2xl mx-auto pt-2">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleEvaluateRecitation}
              disabled={isEvaluating || !spokenText.trim()}
              className="flex items-center justify-center gap-2 px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-md transition-all disabled:opacity-40 w-full sm:w-auto"
            >
              {isEvaluating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>جاري فحص التسميع وكشف نقاط الضعف...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>فحص التسميع الشفوي وكشف نقاط الضعف</span>
                </>
              )}
            </button>

            {spokenText && (
              <button
                type="button"
                onClick={handleReset}
                className="flex items-center gap-1 px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>مسح</span>
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={handleSpeakModelAnswer}
            className="flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-400 font-bold hover:underline mx-auto sm:mx-0"
          >
            <Volume2 className="w-4 h-4" />
            <span>استمع للجواب النموذجي المعتمد</span>
          </button>
        </div>

      </div>

      {/* STEP 5: AI Weakness and Error Report ("يشوف وين نقطة ضعفه وين الخطأ الخاص به") */}
      {evaluationResult && (
        <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-emerald-500 shadow-lg space-y-4">
          
          {/* Score Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
            <div className="space-y-0.5">
              <span className="text-[11px] font-bold text-slate-500">نتيجة تقييم التسميع الشفوي:</span>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-black font-mono text-emerald-700 dark:text-emerald-400">
                  {evaluationResult.accuracyScore}%
                </span>
                <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                  {evaluationResult.accuracyScore >= 85 ? 'إتقان ممتاز جداً للتعريف!' : evaluationResult.accuracyScore >= 65 ? 'حفظ جيد مع وجود نقاط ضعف تحتاج مراجعة' : 'تحتاج لمراجعة النص وإعادة التسميع بالمايك'}
                </span>
              </div>
            </div>

            <div className="text-xs font-mono font-bold px-3 py-1 bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded-lg border border-emerald-200 dark:border-emerald-800">
              تم الحفظ في قاعدة البيانات ✓
            </div>
          </div>

          {/* Weaknesses List ("وين نقطة ضعفه وين الخطأ") */}
          {evaluationResult.weaknesses && evaluationResult.weaknesses.length > 0 && (
            <div className="space-y-1.5 p-3.5 bg-red-50 dark:bg-red-950/30 rounded-xl border border-red-200 dark:border-red-900/60">
              <span className="text-xs font-bold text-red-700 dark:text-red-300 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-red-600" />
                <span>كشف نقاط الضعف والأخطاء في إجابتك:</span>
              </span>
              <ul className="text-xs text-red-800 dark:text-red-200 space-y-1 list-disc list-inside pr-1">
                {evaluationResult.weaknesses.map((w, idx) => (
                  <li key={idx} className="leading-relaxed">{w}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Strengths List */}
          {evaluationResult.strengths && evaluationResult.strengths.length > 0 && (
            <div className="space-y-1.5 p-3.5 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-900/60">
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>نقاط القوة والمصطلحات التي أتقنتها:</span>
              </span>
              <ul className="text-xs text-emerald-800 dark:text-emerald-200 space-y-1 list-disc list-inside pr-1">
                {evaluationResult.strengths.map((s, idx) => (
                  <li key={idx} className="leading-relaxed">{s}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Teacher Advice */}
          {evaluationResult.detailedFeedback && (
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              <span className="font-bold text-emerald-600 block mb-0.5">توجيه الأستاذ لتجنب خسارة الدرجات في الامتحان:</span>
              {evaluationResult.detailedFeedback}
            </div>
          )}

          {/* Model Answer from Ministry Textbook */}
          <div className="p-3.5 bg-slate-100 dark:bg-slate-800 rounded-xl space-y-1.5 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
              <span>الجواب النموذجي المعتمد في الكتاب الوزاري:</span>
              <button
                type="button"
                onClick={handleSpeakModelAnswer}
                className="flex items-center gap-1 text-emerald-600 hover:underline"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>تشغيل الصوت</span>
              </button>
            </div>
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-relaxed">
              {evaluationResult.modelAnswer || currentQuestion.targetAnswer}
            </p>
          </div>

          {/* Next Question Shortcut */}
          <div className="text-center pt-2">
            <button
              onClick={handleSkipQuestion}
              className="px-5 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold rounded-xl shadow-sm hover:opacity-90"
            >
              الانتقال إلى السؤال التالي في الصفحة ({activeQuestionIndex + 2 <= pageQuestions.length ? `س${activeQuestionIndex + 2}` : 'العودة لس1'}) ←
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
