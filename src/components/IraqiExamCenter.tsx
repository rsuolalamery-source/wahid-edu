import React, { useState } from 'react';
import { IraqiSubject, ExamRecord, QuizQuestion } from '../types';
import { Award, Clock, CheckCircle2, AlertCircle, FileCheck, RotateCcw, ArrowLeft, Brain, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface IraqiExamCenterProps {
  subjects: IraqiSubject[];
  userExamScores: Record<string, number>;
  onRecordScore: (examId: string, score: number) => void;
  onOpenCertificate: (examTitle: string, score: number, gradeLabel: string) => void;
  onAskTutor: (context: string) => void;
}

export const IraqiExamCenter: React.FC<IraqiExamCenterProps> = ({
  subjects,
  userExamScores,
  onRecordScore,
  onOpenCertificate,
  onAskTutor,
}) => {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(subjects[0]?.id || '');
  const [activeExam, setActiveExam] = useState<ExamRecord | null>(null);
  
  // In-exam state
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [scoreResult, setScoreResult] = useState<number>(0);

  const currentSubject = subjects.find(s => s.id === selectedSubjectId) || subjects[0];

  const handleStartExam = (exam: ExamRecord) => {
    setActiveExam(exam);
    setAnswers({});
    setIsSubmitted(false);
    setScoreResult(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const calculateScore = () => {
    if (!activeExam) return 0;
    let correct = 0;
    activeExam.questions.forEach((q, idx) => {
      if (answers[idx] === q.correctIndex) {
        correct++;
      }
    });
    return Math.round((correct / activeExam.questions.length) * 100);
  };

  const handleSubmitExam = () => {
    if (!activeExam) return;
    const finalScore = calculateScore();
    setScoreResult(finalScore);
    setIsSubmitted(true);
    onRecordScore(activeExam.id, finalScore);

    if (finalScore >= 75) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
          <FileCheck className="w-4 h-4" />
          <span>مركز الامتحانات المدرسية والوزارية المعتمدة للمنهج العراقي</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          بنك الاختبارات اليومية والشهرية والوزارية
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl mx-auto">
          اختبر مستواك في الامتحانات الشهرية المعتمدة رسمياً، مع رصد الدرجات والشروح النموذجية لأسئلة البكالوريا.
        </p>
      </div>

      {/* If taking an exam right now */}
      {activeExam ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-xs font-semibold text-emerald-600">{currentSubject.title}</span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
                {activeExam.title}
              </h3>
            </div>

            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-xs font-mono text-slate-500">
                <Clock className="w-4 h-4 text-amber-500" />
                <span>الزمن المتاح: {activeExam.timeAllowedMinutes} دقيقة</span>
              </span>

              <button
                onClick={() => setActiveExam(null)}
                className="px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50"
              >
                الخروج من الامتحان
              </button>
            </div>
          </div>

          {/* Exam Questions */}
          <div className="space-y-6">
            {activeExam.questions.map((q, qIdx) => {
              const userChoice = answers[qIdx];
              const isCorrect = userChoice === q.correctIndex;

              return (
                <div
                  key={q.id || qIdx}
                  className="p-5 rounded-xl bg-slate-50/50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-700 space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-relaxed">
                      س{qIdx + 1}: {q.question}
                    </h4>
                    {q.isMinisterial && (
                      <span className="text-[10px] font-mono text-amber-700 bg-amber-100 dark:bg-amber-950/60 dark:text-amber-300 px-2 py-0.5 rounded shrink-0">
                        {q.ministerialYear || 'سؤال وزاري'}
                      </span>
                    )}
                  </div>

                  <div className="space-y-2">
                    {q.options.map((opt, optIdx) => {
                      const isSelected = userChoice === optIdx;
                      let optionClasses = 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200';

                      if (isSubmitted) {
                        if (optIdx === q.correctIndex) {
                          optionClasses = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-bold';
                        } else if (isSelected && !isCorrect) {
                          optionClasses = 'border-red-400 bg-red-50 dark:bg-red-950/40 text-red-900 dark:text-red-200';
                        }
                      } else if (isSelected) {
                        optionClasses = 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-semibold';
                      }

                      return (
                        <button
                          key={optIdx}
                          disabled={isSubmitted}
                          onClick={() => setAnswers(prev => ({ ...prev, [qIdx]: optIdx }))}
                          className={`w-full text-right p-3 rounded-lg border text-xs transition-colors flex items-center justify-between ${optionClasses}`}
                        >
                          <span>{opt}</span>
                          <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px] font-mono shrink-0 mr-3">
                            {optIdx + 1}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {isSubmitted && (
                    <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs text-slate-700 dark:text-slate-300 leading-relaxed border-r-2 border-emerald-600">
                      <strong>💡 التوضيح الوزاري النموذجي:</strong> {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Exam Bottom Bar */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
            {!isSubmitted ? (
              <button
                onClick={handleSubmitExam}
                disabled={Object.keys(answers).length < activeExam.questions.length}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-md transition-colors disabled:opacity-40"
              >
                تسليم ورقة الامتحان واعتماد النتيجة
              </button>
            ) : (
              <div className="flex flex-wrap items-center justify-between gap-4 w-full">
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-black font-mono text-emerald-600">
                    {scoreResult}%
                  </span>
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">
                      {scoreResult >= 75 ? 'مبارك! اجتزت الامتحان بنجاح' : 'تحتاج لمراجعة إضافية'}
                    </p>
                    <p className="text-[11px] text-slate-500">تم رصد درجاتك في سجلك الأكاديمي</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setAnswers({});
                    }}
                    className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>إعادة الامتحان</span>
                  </button>

                  {scoreResult >= 75 && (
                    <button
                      onClick={() => onOpenCertificate(activeExam.title, scoreResult, currentSubject.gradeLabel)}
                      className="px-5 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold shadow hover:bg-emerald-700 transition-colors"
                    >
                      عرض شهادة التميز
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

        </div>
      ) : (
        /* Subject selection and Available Exams grid */
        <div className="space-y-6">
          
          {/* Subject Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800">
            {subjects.map((sub) => (
              <button
                key={sub.id}
                onClick={() => setSelectedSubjectId(sub.id)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedSubjectId === sub.id
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                {sub.title}
              </button>
            ))}
          </div>

          {/* List of Monthly Exams for this subject */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentSubject.monthlyExams.map((exam) => {
              const previousScore = userExamScores[exam.id];

              return (
                <div
                  key={exam.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm hover:border-slate-300 transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="font-semibold text-emerald-600">امتحان شهري معتمد</span>
                      <span className="font-mono">{exam.timeAllowedMinutes} دقيقة</span>
                    </div>

                    <h4 className="text-base font-bold text-slate-900 dark:text-white">
                      {exam.title}
                    </h4>

                    <p className="text-xs text-slate-500 leading-relaxed">
                      يغطي أهم الأسئلة والمسائل الوزارية للفصل الدراسي، مع رصد دقيق للأجوبة النموذجية.
                    </p>
                  </div>

                  {previousScore !== undefined && (
                    <div className="pt-2 flex items-center justify-between text-xs border-t border-slate-100 dark:border-slate-800">
                      <span className="text-slate-500">آخر درجة حققتها:</span>
                      <span className="font-mono font-bold text-emerald-600">{previousScore}%</span>
                    </div>
                  )}

                  <button
                    onClick={() => handleStartExam(exam)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-sm transition-colors"
                  >
                    <span>{previousScore !== undefined ? 'إعادة خوض الامتحان' : 'بدء الامتحان الآن'}</span>
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>

        </div>
      )}

    </div>
  );
};
