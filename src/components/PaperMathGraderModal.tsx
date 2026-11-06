import React, { useState, useRef } from 'react';
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
  Image as ImageIcon
} from 'lucide-react';
import { PaperGradingResult } from '../types';

interface PaperMathGraderModalProps {
  isOpen: boolean;
  onClose: () => void;
  gradeTitle: string;
}

export const PaperMathGraderModal: React.FC<PaperMathGraderModalProps> = ({
  isOpen,
  onClose,
  gradeTitle,
}) => {
  const [problemTitle, setProblemTitle] = useState<string>('حل المسألة: إذا كان x + yi = (1 + 2i)(3 - i)، فجد قيمتي x و y الحقيقيتين');
  const [subjectName, setSubjectName] = useState<string>('الرياضيات');
  const [solutionText, setSolutionText] = useState<string>('');
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [isGrading, setIsGrading] = useState<boolean>(false);
  const [gradingResult, setGradingResult] = useState<PaperGradingResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGradeSolution = async () => {
    if (!imageBase64 && !solutionText.trim()) {
      alert('يرجى التقاط صورة لورقة حلك في الدفتر أو كتابة خطوات الحل.');
      return;
    }

    setIsGrading(true);
    try {
      const response = await fetch('/api/tutor/grade-paper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemTitle,
          solutionText: solutionText.trim(),
          imageBase64: imageBase64,
          grade: gradeTitle,
          subject: subjectName
        })
      });

      const data: PaperGradingResult = await response.json();
      setGradingResult(data);
    } catch (err) {
      console.error('Failed to grade paper:', err);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative my-8 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-md">
              <Camera className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                مصحح الورقة والقلم والدفتر الذكي
              </h3>
              <p className="text-xs text-slate-500">
                حِل المسألة بدفترك، وصوّر الحل ليصححه الذكاء الاصطناعي خطوة بخطوة
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

        {/* Problem Title & Subject Input */}
        <div className="space-y-3 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 space-y-1">
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block">
                مسألة الرياضيات أو الفيزياء المطلوب تصحيحها:
              </label>
              <input
                type="text"
                value={problemTitle}
                onChange={(e) => setProblemTitle(e.target.value)}
                placeholder="مثال: حل المعادلة، حساب سعة المتسعة..."
                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block">
                المادة:
              </label>
              <select
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white font-medium"
              >
                <option value="الرياضيات">الرياضيات</option>
                <option value="الفيزياء">الفيزياء</option>
                <option value="الكيمياء">الكيمياء</option>
              </select>
            </div>
          </div>
        </div>

        {/* Solution Input Options: Camera / File Upload OR Type Steps */}
        <div className="space-y-4">
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
            صوّر حلك بالدفتر أو اكتب الخطوات:
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Box 1: Take Photo / Upload Paper Solution */}
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`p-4 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
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

              {imageBase64 ? (
                <div className="space-y-2 w-full">
                  <div className="aspect-video w-full rounded-xl overflow-hidden bg-black/10 max-h-36">
                    <img src={imageBase64} alt="ورقة الحل" className="w-full h-full object-contain" />
                  </div>
                  <span className="text-xs font-bold text-emerald-600 block">
                    ✓ تم التقاط صورة الورقة بنجاح
                  </span>
                  <span className="text-[10px] text-slate-400 block">اضغط لتغيير الصورة</span>
                </div>
              ) : (
                <div className="space-y-2 py-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center mx-auto text-emerald-700 dark:text-emerald-300">
                    <Camera className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                    📸 التقاط صورة الدفتر بالكاميرا
                  </span>
                  <p className="text-[10px] text-slate-400">
                    أو ارفع صورة واضحة لحلك بالورقة والقلم
                  </p>
                </div>
              )}
            </div>

            {/* Box 2: Manual Step-by-Step Writing Option */}
            <div className="space-y-1.5 flex flex-col justify-between">
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-emerald-600" />
                <span>أو كتابة خطوات الحل يدوياً بالمعادلات:</span>
              </label>

              <textarea
                value={solutionText}
                onChange={(e) => setSolutionText(e.target.value)}
                rows={5}
                placeholder="مثال:&#10;x + yi = 3 - i + 6i - 2i^2&#10;x + yi = 3 + 5i + 2&#10;x + yi = 5 + 5i&#10;الحقيقي = الحقيقي => x = 5..."
                className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-mono text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 leading-relaxed flex-1"
              />
            </div>

          </div>

          {/* Action Trigger */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={handleGradeSolution}
              disabled={isGrading || (!imageBase64 && !solutionText.trim())}
              className="flex items-center gap-2 px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs shadow-md transition-all disabled:opacity-40"
            >
              {isGrading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>جاري تصحيح الورقة وكشف الأخطاء خطوة بخطوة...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>تصحيح الحل تلقائياً بالذكاء الاصطناعي</span>
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

        {/* AI Step-by-Step Report */}
        {gradingResult && (
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border-2 border-emerald-500 shadow-md space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-slate-500">درجة الدفتر الامتحاني الوزاري:</span>
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-black font-mono text-emerald-700 dark:text-emerald-400">
                    {gradingResult.score} / 10
                  </span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {gradingResult.score >= 9 ? 'حل نموذجي وممتاز!' : gradingResult.score >= 6 ? 'حل جيد مع وجود أخطاء حسابية يجب الانتباه لها' : 'يحتاج لإعادة كتابة الخطوات لتجنب خسارة الدرجات'}
                  </span>
                </div>
              </div>
            </div>

            {/* Step by Step Breakdown */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                متابعة خطوات الحل خطوة بخطوة:
              </span>

              <div className="space-y-1.5">
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
                      <p className="text-[11px] opacity-90">{step.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Errors Identified */}
            {gradingResult.identifiedErrors && gradingResult.identifiedErrors.length > 0 && (
              <div className="p-3 bg-red-50 dark:bg-red-950/30 rounded-xl border border-red-200 dark:border-red-900 text-xs text-red-800 dark:text-red-200 space-y-1">
                <span className="font-bold block flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-red-600" />
                  <span>الأخطاء التي وقعت فيها في الورقة:</span>
                </span>
                <ul className="list-disc list-inside space-y-0.5 pr-2 text-[11px]">
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

            {/* Model Solution */}
            {gradingResult.modelSolution && (
              <div className="p-3.5 bg-slate-100 dark:bg-slate-900/80 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1">
                <span className="text-[11px] font-bold text-slate-500 block">
                  الحل الكامل النموذجي للدفتر الامتحاني:
                </span>
                <p className="text-xs font-mono font-medium text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">
                  {gradingResult.modelSolution}
                </p>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};
