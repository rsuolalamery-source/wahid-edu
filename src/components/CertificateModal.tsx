import React, { useState } from 'react';
import { X, Printer, Award, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface CertificateModalProps {
  title: string;
  studentName: string;
  score: number;
  gradeLabel?: string;
  instructorName?: string;
  onUpdateStudentName: (name: string) => void;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  title,
  studentName,
  score,
  gradeLabel = 'المنهج العراقي',
  instructorName = 'المشرف الأكاديمي لمناهج العراق',
  onUpdateStudentName,
  onClose,
}) => {
  const [nameInput, setNameInput] = useState<string>(studentName || 'طالب متميز');
  const [isEditingName, setIsEditingName] = useState<boolean>(!studentName);
  
  // Format current date in Arabic
  const issueDate = new Intl.DateTimeFormat('ar-IQ', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date());

  const certificateNumber = `WAHED-IQ-${Math.floor(100000 + Math.random() * 900000)}`;

  const handlePrint = () => {
    window.print();
  };

  const handleSaveName = () => {
    if (nameInput.trim()) {
      onUpdateStudentName(nameInput.trim());
      setIsEditingName(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto print:p-0 print:bg-white">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl relative my-8 print:border-none print:shadow-none print:max-w-none print:p-0 print:my-0">
        
        {/* Top Control Bar (Hidden in print) */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-800 print:hidden">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-600" />
            <span className="text-sm font-bold text-slate-900 dark:text-white">
              شهادة تفوق واجتياز معتمدة مع رمز التحقق السريع (QR Code)
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة / حفظ كـ PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Student Name Editor Prompt (Hidden in print) */}
        <div className="py-3 px-4 my-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3 text-xs print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-slate-600 dark:text-slate-300 font-medium">الاسم المطبوع على الشهادة:</span>
            {isEditingName ? (
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="اكتب اسمك الثلاثي الكامل..."
                className="px-2.5 py-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-bold"
              />
            ) : (
              <span className="font-bold text-slate-900 dark:text-white">{nameInput}</span>
            )}
          </div>

          <div>
            {isEditingName ? (
              <button
                onClick={handleSaveName}
                className="px-3 py-1 bg-slate-900 dark:bg-emerald-600 text-white rounded text-xs font-medium hover:bg-slate-800 transition-colors"
              >
                تحديث الاسم
              </button>
            ) : (
              <button
                onClick={() => setIsEditingName(true)}
                className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-medium"
              >
                تعديل الاسم
              </button>
            )}
          </div>
        </div>

        {/* The Printable Certificate Design */}
        <div 
          id="certificate-print-area"
          className="relative bg-gradient-to-br from-amber-50/40 via-white to-emerald-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 p-8 sm:p-12 rounded-2xl border-4 border-double border-amber-600/40 text-center space-y-6 shadow-inner print:border-4 print:border-amber-700 print:text-black print:bg-white"
        >
          {/* Decorative Corner Ornaments */}
          <div className="absolute top-3 right-3 text-amber-600/40 font-mono text-xl select-none">❖</div>
          <div className="absolute top-3 left-3 text-amber-600/40 font-mono text-xl select-none">❖</div>
          <div className="absolute bottom-3 right-3 text-amber-600/40 font-mono text-xl select-none">❖</div>
          <div className="absolute bottom-3 left-3 text-amber-600/40 font-mono text-xl select-none">❖</div>

          {/* Header & Logo */}
          <div className="space-y-1">
            <div className="w-12 h-12 mx-auto rounded-xl bg-emerald-700 text-white flex items-center justify-center font-black text-2xl shadow-md">
              ١
            </div>
            <p className="text-xs tracking-widest text-slate-500 dark:text-slate-400 font-semibold uppercase mt-2">
              منصة واحد تعليم · المنهج العراقي الرسمي المعتمد
            </p>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-wide pt-1">
              شهادة إكمال ومواظبة وتفوق دراسي
            </h2>
          </div>

          {/* Body Text */}
          <div className="space-y-4 max-w-xl mx-auto py-2">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              تشهد إدارة منصة **واحد تعليم** بأن الطالب المتميز:
            </p>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-emerald-800 dark:text-emerald-400 font-serif py-1 border-b-2 border-emerald-600/30 inline-block px-8">
              {nameInput}
            </h3>

            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed pt-2">
              قد أتم بنجاح ومواظبة تامة دراسة واجتياز الامتحانات التتابعية المقررة لـ ({gradeLabel}):
            </p>

            <h4 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              « {title} »
            </h4>

            <div className="flex items-center justify-center gap-4 text-xs text-slate-600 dark:text-slate-400 pt-1">
              <span>درجة الإتقان النهائية: <strong className="font-mono text-emerald-700 dark:text-emerald-400">{score}%</strong></span>
              <span aria-hidden="true">·</span>
              <span>التقدير الأكاديمي: <strong className="font-bold text-slate-900 dark:text-white">{score >= 90 ? 'ممتاز مع مرتبة الشرف' : 'جيد جداً'}</strong></span>
            </div>
          </div>

          {/* Signatures & Seal Strip + QR Code */}
          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 grid grid-cols-3 items-end text-xs">
            
            {/* Instructor Signature */}
            <div className="space-y-1 text-right">
              <p className="font-bold text-slate-800 dark:text-slate-200">{instructorName}</p>
              <p className="text-[11px] text-slate-400">مدرس المادة المعتمد</p>
              <div className="font-serif italic text-slate-400 text-xs pt-1">Certified Teacher</div>
            </div>

            {/* Official Digital Seal + QR Code in Certificate */}
            <div className="flex flex-col items-center space-y-2">
              {/* Scalable SVG QR Code Representation */}
              <div className="p-1.5 bg-white rounded-lg border border-slate-300 shadow-sm inline-block">
                <svg width="64" height="64" viewBox="0 0 100 100" fill="currentColor" className="text-slate-900">
                  {/* Outer corner squares */}
                  <rect x="0" y="0" width="30" height="30" fill="currentColor" />
                  <rect x="5" y="5" width="20" height="20" fill="white" />
                  <rect x="10" y="10" width="10" height="10" fill="currentColor" />
                  
                  <rect x="70" y="0" width="30" height="30" fill="currentColor" />
                  <rect x="75" y="5" width="20" height="20" fill="white" />
                  <rect x="80" y="10" width="10" height="10" fill="currentColor" />

                  <rect x="0" y="70" width="30" height="30" fill="currentColor" />
                  <rect x="5" y="75" width="20" height="20" fill="white" />
                  <rect x="10" y="80" width="10" height="10" fill="currentColor" />

                  {/* Inner QR patterns */}
                  <rect x="40" y="10" width="10" height="10" />
                  <rect x="55" y="10" width="10" height="20" />
                  <rect x="10" y="45" width="15" height="10" />
                  <rect x="40" y="40" width="20" height="20" />
                  <rect x="70" y="45" width="10" height="15" />
                  <rect x="45" y="75" width="15" height="15" />
                  <rect x="75" y="75" width="15" height="15" />
                </svg>
              </div>
              <span className="text-[9px] font-mono text-slate-500 font-semibold tracking-wider">
                رمز التحقق السريع (QR)
              </span>
            </div>

            {/* Dean / Supervision Board */}
            <div className="space-y-1 text-left">
              <p className="font-bold text-slate-800 dark:text-slate-200">هيئة الإشراف التربوي</p>
              <p className="text-[11px] text-slate-400">أكاديمية واحد تعليم</p>
              <div className="font-serif italic text-slate-400 text-xs pt-1">Academic Board</div>
            </div>

          </div>

          {/* Verification Code Footer */}
          <div className="pt-4 flex flex-wrap items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 font-mono border-t border-slate-100 dark:border-slate-800/60">
            <span>الرقم المرجعي: {certificateNumber}</span>
            <span>تاريخ الإصدار: {issueDate}</span>
            <span className="text-emerald-600 font-semibold">مفعلة رسمياً في نظام التحقق</span>
          </div>

        </div>

      </div>
    </div>
  );
};
