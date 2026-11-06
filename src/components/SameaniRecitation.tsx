import React, { useState, useEffect, useRef } from 'react';
import { RecitationItem, IraqiGradeId, RecitationEvaluationResult } from '../types';
import { SAMPLE_RECITATIONS, IRAQI_GRADES } from '../data/iraqiCurriculumData';
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
  ChevronRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface SameaniRecitationProps {
  recitations: RecitationItem[];
  selectedGradeId: IraqiGradeId;
  onRecordRecitationScore: (recitationId: string, score: number) => void;
  onAskTutor: (context: string) => void;
}

export const SameaniRecitation: React.FC<SameaniRecitationProps> = ({
  recitations,
  selectedGradeId,
  onRecordRecitationScore,
  onAskTutor,
}) => {
  const currentGradeMeta = IRAQI_GRADES.find(g => g.id === selectedGradeId);

  // 1. Filter recitations strictly by the student's selected grade!
  const gradeRecitations = recitations.filter(r => r.gradeId === selectedGradeId);
  const fallbackRecitations = gradeRecitations.length > 0 
    ? gradeRecitations 
    : SAMPLE_RECITATIONS.filter(r => r.gradeId === selectedGradeId);

  // Available subjects in this grade
  const availableSubjects = Array.from(new Set(fallbackRecitations.map(r => r.subjectTitle)));
  const [selectedSubject, setSelectedSubject] = useState<string>(availableSubjects[0] || 'الكل');

  // Filter by subject
  const subjectRecitations = selectedSubject === 'الكل'
    ? fallbackRecitations
    : fallbackRecitations.filter(r => r.subjectTitle === selectedSubject);

  const [selectedItem, setSelectedItem] = useState<RecitationItem>(subjectRecitations[0] || fallbackRecitations[0] || SAMPLE_RECITATIONS[0]);
  
  // Voice Speech Recognition state
  const [isListening, setIsListening] = useState<boolean>(false);
  const [spokenText, setSpokenText] = useState<string>('');
  const [isSpeechSupported, setIsSpeechSupported] = useState<boolean>(true);
  const recognitionRef = useRef<any>(null);

  // Evaluation state
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [evaluationResult, setEvaluationResult] = useState<RecitationEvaluationResult | null>(null);

  // Sync selected item when grade or subject changes
  useEffect(() => {
    if (availableSubjects.length > 0 && !availableSubjects.includes(selectedSubject)) {
      setSelectedSubject(availableSubjects[0]);
    }
  }, [selectedGradeId]);

  useEffect(() => {
    if (subjectRecitations.length > 0) {
      setSelectedItem(subjectRecitations[0]);
      handleReset();
    }
  }, [selectedSubject, selectedGradeId]);

  // Initialize Speech Recognition API
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'ar-IQ'; // Iraqi Arabic dialect support

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
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } else {
      setIsSpeechSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (_) {}
      }
    };
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('ميزة التعرف على الصوت المباشر غير مدعومة في هذا المتصفح. يمكنك كتابة التسميع في الحقل أدناه.');
      return;
    }

    if (isListening) {
      try {
        recognitionRef.current.stop();
      } catch (_) {}
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error('Error starting recognition:', err);
      }
    }
  };

  const handleReset = () => {
    if (isListening && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (_) {}
      setIsListening(false);
    }
    setSpokenText('');
    setEvaluationResult(null);
    setIsEvaluating(false);
  };

  // Evaluate student's oral answer using Gemini AI
  const handleEvaluateRecitation = async () => {
    if (!spokenText.trim()) return;

    if (isListening && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (_) {}
      setIsListening(false);
    }

    setIsEvaluating(true);
    try {
      const response = await fetch('/api/tutor/evaluate-recitation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionTitle: selectedItem.title,
          targetText: selectedItem.targetText,
          studentSpokenText: spokenText.trim(),
          grade: currentGradeMeta?.title || 'المنهج العراقي',
          subject: selectedItem.subjectTitle
        })
      });

      const data: RecitationEvaluationResult = await response.json();
      setEvaluationResult(data);
      onRecordRecitationScore(selectedItem.id, data.accuracyScore || 80);

      if (data.accuracyScore >= 85) {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 }
        });
      }
    } catch (err) {
      console.error('Failed to evaluate recitation:', err);
    } finally {
      setIsEvaluating(false);
    }
  };

  // Speak model answer aloud using text-to-speech
  const handleSpeakModelAnswer = () => {
    if ('speechSynthesis' in window && selectedItem?.targetText) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(selectedItem.targetText);
      utterance.lang = 'ar-SA';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner - Filtered to Student's Grade */}
      <div className="bg-gradient-to-l from-slate-900 via-emerald-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-3 max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
            <Mic className="w-4 h-4" />
            <span>التسميع الشفوي التفاعلي «سمّعني»</span>
            <span aria-hidden="true">·</span>
            <span>خاص بـ ({currentGradeMeta?.title})</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            سمّع تعاريفك وقوانينك بالصوت والحكي: {currentGradeMeta?.title}
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            اختر المادة والملزمة والصفحة، واسمع السؤال وتكلّم بالمايكروفون ليقوم الذكاء الاصطناعي بفحص كلامك وتحديد أين تكمن نقطة ضعفك وأين أخطأت بدقة تامة.
          </p>
        </div>
      </div>

      {/* Grade Subject Selector */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
        
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
            1. اختر المادة الدراسية لـ ({currentGradeMeta?.title}):
          </span>
          <span className="text-[11px] text-slate-400 font-mono">
            {subjectRecitations.length} أسئلة تسميع شفوية متوفرة
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          {availableSubjects.map((subj) => (
            <button
              key={subj}
              onClick={() => setSelectedSubject(subj)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                selectedSubject === subj
                  ? 'bg-emerald-700 text-white shadow-md'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {subj}
            </button>
          ))}
        </div>

      </div>

      {/* Main Recitation Area: Question Selection & Voice Testing */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column (4 cols): Booklets, Chapters & Questions */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-3">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-900 dark:text-white block">
              2. اختر السؤال أو المفهوم:
            </span>
            <p className="text-[11px] text-slate-400">
              مرتبة بحسب الملازم والفصول الوزارية
            </p>
          </div>

          <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
            {subjectRecitations.map((item) => {
              const isSelected = selectedItem?.id === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setSelectedItem(item);
                    handleReset();
                  }}
                  className={`w-full text-right p-3.5 rounded-2xl border text-xs transition-all space-y-1.5 ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-100 font-bold shadow-sm'
                      : 'border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="text-emerald-700 dark:text-emerald-400 font-semibold">{item.subjectTitle}</span>
                    <span className="text-[10px]">{item.category}</span>
                  </div>

                  <h4 className="font-bold line-clamp-2 leading-snug">{item.title}</h4>

                  {item.chapterOrPage && (
                    <div className="flex items-center gap-1 text-[10px] text-slate-400 pt-1">
                      <FileText className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="truncate">{item.chapterOrPage}</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column (8 cols): The Oral Question & Microphone Sandbox */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          
          {/* Question Prompt Display */}
          <div className="space-y-2 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-lg">
                {selectedItem.subjectTitle} · {selectedItem.category}
              </span>
              <span>{selectedItem.chapterOrPage || selectedItem.bookletOrTopic}</span>
            </div>

            <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
              {selectedItem.questionPrompt || `سمّع نص: ${selectedItem.title}`}
            </h3>

            {selectedItem.clues && selectedItem.clues.length > 0 && (
              <div className="text-[11px] text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/30 p-2.5 rounded-xl border border-amber-200/60">
                <span className="font-bold">تلميح تذكيري:</span> {selectedItem.clues.join(' · ')}
              </div>
            )}
          </div>

          {/* Voice Microphone Reciter Box ("يحكيه حكي") */}
          <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 text-center space-y-4">
            
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                تكلّم واحكي الجواب بصوتك بالمايكروفون:
              </span>
              <p className="text-[11px] text-slate-500">
                اضغط على المايك وابدأ النطق، وسيتم تسجيل وتحليل كلامك الشفوي بالذكاء الاصطناعي
              </p>
            </div>

            {/* Big Mic Button */}
            <div className="flex justify-center py-2">
              <button
                type="button"
                onClick={toggleListening}
                className={`relative w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-all ${
                  isListening
                    ? 'bg-rose-600 text-white animate-pulse ring-8 ring-rose-200 dark:ring-rose-950'
                    : 'bg-emerald-700 hover:bg-emerald-800 text-white ring-4 ring-emerald-100 dark:ring-emerald-950'
                }`}
              >
                {isListening ? (
                  <Mic className="w-8 h-8 animate-bounce" />
                ) : (
                  <Mic className="w-8 h-8" />
                )}
              </button>
            </div>

            <div className="text-xs font-bold">
              {isListening ? (
                <span className="text-rose-600 animate-pulse">
                  جاري الاستماع لصوتك الآن... تكلّم بالجواب وسجله
                </span>
              ) : (
                <span className="text-slate-500">
                  انقر على المايك لبدء التسميع الشفوي
                </span>
              )}
            </div>

            {/* Speech-to-Text Live Transcript Box */}
            <div className="text-right space-y-1.5 pt-2">
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block">
                الكلام المنطوق المستلم من المايك (يمكنك التعديل أو الكتابة أيضاً):
              </label>
              <textarea
                value={spokenText}
                onChange={(e) => setSpokenText(e.target.value)}
                placeholder="سيظهر ما تقوله هنا تلقائياً أثناء التسميع بالمايك..."
                rows={3}
                className="w-full p-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white leading-relaxed focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Actions: Evaluate or Reset */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleEvaluateRecitation}
                  disabled={isEvaluating || !spokenText.trim()}
                  className="flex items-center gap-2 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-md transition-all disabled:opacity-40"
                >
                  {isEvaluating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>جاري فحص نقاط الضعف بالذكاء الاصطناعي...</span>
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
                className="flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-400 font-bold hover:underline"
              >
                <Volume2 className="w-4 h-4" />
                <span>استمع للجواب النموذجي المعتمد</span>
              </button>
            </div>

          </div>

          {/* AI Weakness and Error Report ("يشوف وين نقطة ضعفه وين الخطأ الخاص به") */}
          {evaluationResult && (
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border-2 border-emerald-500 dark:border-emerald-600 shadow-md space-y-4">
              
              {/* Score Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-slate-500">نتيجة التقييم الشفوي للوزاري:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-3xl font-black font-mono text-emerald-700 dark:text-emerald-400">
                      {evaluationResult.accuracyScore}%
                    </span>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {evaluationResult.accuracyScore >= 85 ? 'إتقان ممتاز جداً للتعريف!' : evaluationResult.accuracyScore >= 65 ? 'حفظ جيد مع وجود نقاط ضعف تحتاج مراجعة' : 'تحتاج لمراجعة التعريف وإعادة التسميع بالمايك'}
                    </span>
                  </div>
                </div>

                <div className="text-xs font-mono font-bold px-3 py-1 bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded-lg border border-emerald-200 dark:border-emerald-800">
                  +{evaluationResult.accuracyScore >= 85 ? '50 XP' : '20 XP'}
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
                <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  <span className="font-bold text-emerald-600 block mb-0.5">توجيه الأستاذ لتجنب خسارة الدرجات:</span>
                  {evaluationResult.detailedFeedback}
                </div>
              )}

              {/* Model Answer from Ministry Textbook */}
              <div className="p-3.5 bg-slate-100 dark:bg-slate-900/80 rounded-xl space-y-1.5 border border-slate-200 dark:border-slate-700">
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
                  {evaluationResult.modelAnswer || selectedItem.targetText}
                </p>
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
};
