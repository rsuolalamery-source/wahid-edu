import React, { useState } from 'react';
import { IraqiLesson, QuizQuestion } from '../types';
import { X, CheckCircle2, AlertCircle, Award, RotateCcw, ArrowLeft, ArrowRight, HelpCircle, LockOpen } from 'lucide-react';
import confetti from 'canvas-confetti';

interface DailyQuizModalProps {
  lesson: IraqiLesson;
  nextLesson?: IraqiLesson;
  onClose: () => void;
  onPassDailyQuiz: (lessonId: string, score: number) => void;
  onAdvanceToNextLesson?: (nextLesson: IraqiLesson) => void;
}

export const DailyQuizModal: React.FC<DailyQuizModalProps> = ({
  lesson,
  nextLesson,
  onClose,
  onPassDailyQuiz,
  onAdvanceToNextLesson,
}) => {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const questions = lesson.dailyQuiz;

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((q, idx) => {
      if (answers[idx] === q.correctIndex) correct++;
    });
    return Math.round((correct / questions.length) * 100);
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    const score = calculateScore();
    if (score >= 60) {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      });
      onPassDailyQuiz(lesson.id, score);
    }
  };

  const score = isSubmitted ? calculateScore() : 0;
  const isPassed = score >= 60;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative my-8 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600">
              <HelpCircle className="w-4 h-4" />
              <span>الاختبار اليومي التتابعي بعد المحاضرة</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
              {lesson.title}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Questions */}
        <div className="space-y-5 max-h-[60vh] overflow-y-auto pr-1">
          {questions.map((q, idx) => {
            const userChoice = answers[idx];
            const isQCorrect = userChoice === q.correctIndex;

            return (
              <div
                key={q.id || idx}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                    {idx + 1}. {q.question}
                  </h4>
                  {q.isMinisterial && (
                    <span className="text-[10px] bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded font-mono">
                      وزاري
                    </span>
                  )}
                </div>

                <div className="space-y-1.5">
                  {q.options.map((opt, optIdx) => {
                    const isSelected = userChoice === optIdx;
                    let btnClass = 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200';

                    if (isSubmitted) {
                      if (optIdx === q.correctIndex) {
                        btnClass = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-bold';
                      } else if (isSelected && !isQCorrect) {
                        btnClass = 'border-red-400 bg-red-50 dark:bg-red-950/40 text-red-900 dark:text-red-200';
                      }
                    } else if (isSelected) {
                      btnClass = 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-semibold';
                    }

                    return (
                      <button
                        key={optIdx}
                        disabled={isSubmitted}
                        onClick={() => setAnswers(prev => ({ ...prev, [idx]: optIdx }))}
                        className={`w-full text-right p-3 rounded-xl border text-xs transition-colors flex items-center justify-between ${btnClass}`}
                      >
                        <span>{opt}</span>
                        <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px] font-mono shrink-0 mr-2">
                          {optIdx + 1}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {isSubmitted && (
                  <div className="p-3 bg-slate-100 dark:bg-slate-900 rounded-xl text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed border-r-2 border-emerald-600">
                    💡 <strong>التوضيح الوزاري:</strong> {q.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer actions */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          {!isSubmitted ? (
            <button
              onClick={handleSubmit}
              disabled={Object.keys(answers).length < questions.length}
              className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-md transition-colors disabled:opacity-40"
            >
              تسليم ورقة الامتحان اليومي وتفعيل المحاضرة القادمة
            </button>
          ) : (
            <div className="space-y-3 w-full">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold font-mono text-emerald-600">{score}%</span>
                  <span className="text-xs text-slate-500 font-semibold">
                    {isPassed ? 'تم الاجتياز وإلغاء قفل الدرس القادم! (+30 نقطة)' : 'راجِع المحاضرة وأعد المحاولة'}
                  </span>
                </div>

                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setAnswers({});
                  }}
                  className="px-3 py-1.5 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-medium"
                >
                  إعادة
                </button>
              </div>

              {isPassed && nextLesson && onAdvanceToNextLesson && (
                <button
                  onClick={() => {
                    onClose();
                    onAdvanceToNextLesson(nextLesson);
                  }}
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-colors"
                >
                  <LockOpen className="w-4 h-4 text-emerald-400" />
                  <span>تم تفعيل المحاضرة القادمة: «{nextLesson.title}» (انتقل لها الآن)</span>
                  <ArrowLeft className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
