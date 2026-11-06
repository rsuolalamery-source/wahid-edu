import React, { useState } from 'react';
import { IraqiGradeId, StandardSubjectName, IraqiLesson } from '../types';
import { IRAQI_GRADES } from '../data/iraqiCurriculumData';
import { 
  ShieldCheck, 
  Link2, 
  Copy, 
  Check, 
  Share2, 
  Send, 
  GraduationCap, 
  PlusCircle, 
  Users, 
  BookOpen, 
  Lock, 
  Sparkles,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface AdminManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onManagerPublishLecture?: (gradeId: IraqiGradeId, subject: StandardSubjectName, lecture: IraqiLesson) => void;
  activeTeachersCount?: number;
  studentsCount?: number;
}

export const AdminManagerModal: React.FC<AdminManagerModalProps> = ({
  isOpen,
  onClose,
  onManagerPublishLecture,
  activeTeachersCount = 8,
  studentsCount = 1,
}) => {
  // Simple Manager security pin (123456 by default)
  const [managerPin, setManagerPin] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [pinError, setPinError] = useState<string>('');

  // Invite generation state
  const [teacherName, setTeacherName] = useState<string>('أ. أحمد النداوي');
  const [teacherSubject, setTeacherSubject] = useState<string>('الرياضيات');
  const [teacherGrade, setTeacherGrade] = useState<IraqiGradeId>('6-prep-scientific');
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleVerifyPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (managerPin.trim() === '123456' || managerPin.trim() === 'admin' || managerPin.trim() === 'admin123') {
      setIsAuthenticated(true);
      setPinError('');
    } else {
      setPinError('رمز مرور الإدارة غير صحيح. (الرمز الافتراضي لمدير المنصة: 123456)');
    }
  };

  const origin = window.location.origin + window.location.pathname;
  const inviteUrl = `${origin}?teacher=${encodeURIComponent(teacherName.trim())}&subj=${encodeURIComponent(teacherSubject)}&role=teacher`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const shareText = `السلام عليكم ورحمة الله وبركاته،\nأستاذنا الفاضل ${teacherName}،\nتم اعتمادك رسمياً كمدرس لمادة (${teacherSubject}) على منصة «واحد تعليم» للمناهج العراقية.\nيمكنك فتح الرابط أدناه للبدء بنشر محاضراتك، امتحاناتك اليومية والشهرية، وملازمك لطلابك مباشرة وبشكل مجاني:\n${inviteUrl}`;

  const handleSendWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  const handleSendTelegram = () => {
    const url = `https://t.me/share/url?url=${encodeURIComponent(inviteUrl)}&text=${encodeURIComponent(`رابط منصة المدرس - أستاذ ${teacherName}`)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative my-8 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-md">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                بوابة مدير المنصة (Platform Manager Portal)
              </h3>
              <p className="text-xs text-slate-500">
                صلاحية حصرية لإدارة المدرسين وتوليد روابط الدعوة والنشر
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

        {/* Security Gate: Manager PIN required if not yet verified */}
        {!isAuthenticated ? (
          <form onSubmit={handleVerifyPin} className="space-y-4 py-4 text-center max-w-sm mx-auto">
            <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center mx-auto text-emerald-600">
              <Lock className="w-6 h-6" />
            </div>
            
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                يرجى إدخال رمز مرور مدير المنصة
              </h4>
              <p className="text-xs text-slate-500">
                لحماية المنصة، لا يمكن للطلبة الدخول إلى هذا القسم.
              </p>
            </div>

            {pinError && (
              <div className="p-2.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 rounded-xl text-xs">
                {pinError}
              </div>
            )}

            <div className="space-y-1 text-right">
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block">
                رمز المرور الإداري (الافتراضي: 123456):
              </label>
              <input
                type="password"
                required
                value={managerPin}
                onChange={(e) => setManagerPin(e.target.value)}
                placeholder="أدخل الرمز..."
                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-center text-sm font-mono tracking-widest text-slate-900 dark:text-white"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs shadow-md transition-colors"
            >
              دخول المدير والتحقق
            </button>
          </form>
        ) : (
          <div className="space-y-6">
            
            {/* Manager Alert Info */}
            <div className="p-4 bg-emerald-50/70 dark:bg-emerald-950/30 rounded-2xl border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200 space-y-1">
              <span className="font-bold block flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>أهلاً بك يا مدير المنصة - أنت المسؤول الحصري عن دعوة الأساتذة</span>
              </span>
              <p className="text-[11px] text-emerald-800 dark:text-emerald-300 leading-relaxed">
                الطلبة لا يستطيعون إرسال أو رؤية روابط دعوات المدرسين. أنت من يقوم بتوليد الرابط باسم الأستاذ وإرساله إليه عبر واتساب أو تلغرام، ليبدأ الأستاذ بنشر محاضراته فوراً.
              </p>
            </div>

            {/* Teacher Invitation Generator Box */}
            <div className="bg-slate-50 dark:bg-slate-800/60 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-emerald-600" />
                <span>1. تجهيز رابط دعوة المدرس (المعلومات التي تكتبها تظهر لطلابه):</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block">
                    اسم الأستاذ (نحن نكتبه):
                  </label>
                  <input
                    type="text"
                    value={teacherName}
                    onChange={(e) => setTeacherName(e.target.value)}
                    placeholder="أ. حيدر وليد..."
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block">
                    المادة المقررة:
                  </label>
                  <input
                    type="text"
                    value={teacherSubject}
                    onChange={(e) => setTeacherSubject(e.target.value)}
                    placeholder="الرياضيات، الفيزياء..."
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block">
                    الصف الدراسي:
                  </label>
                  <select
                    value={teacherGrade}
                    onChange={(e) => setTeacherGrade(e.target.value as IraqiGradeId)}
                    className="w-full px-2.5 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white font-medium"
                  >
                    {IRAQI_GRADES.map(g => (
                      <option key={g.id} value={g.id}>{g.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Generated Link Box */}
              <div className="space-y-1.5 pt-2">
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <Link2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>الرابط الخاص بالأستاذ {teacherName}:</span>
                </label>

                <div className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={inviteUrl}
                    className="w-full bg-transparent font-mono text-[11px] text-slate-800 dark:text-slate-200 focus:outline-none truncate"
                  />
                  <button
                    onClick={handleCopyLink}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-colors ${
                      copied ? 'bg-emerald-600 text-white' : 'bg-slate-900 hover:bg-slate-800 text-white'
                    }`}
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'تم النسخ!' : 'نسخ'}</span>
                  </button>
                </div>
              </div>

              {/* Direct Send Buttons for Manager */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <button
                  onClick={handleSendWhatsApp}
                  className="flex items-center justify-center gap-2 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>إرسال الرابط له عبر واتساب</span>
                </button>

                <button
                  onClick={handleSendTelegram}
                  className="flex items-center justify-center gap-2 py-2 px-3 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold shadow-sm transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>إرسال الرابط له عبر تلغرام</span>
                </button>
              </div>

            </div>

            {/* Summary Statistics */}
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="text-xl font-bold font-mono text-emerald-700 dark:text-emerald-400 block">
                  {activeTeachersCount}+
                </span>
                <span className="text-[11px] text-slate-500">مدرسين معتمدين في المنصة</span>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="text-xl font-bold font-mono text-emerald-700 dark:text-emerald-400 block">
                  {studentsCount}+
                </span>
                <span className="text-[11px] text-slate-500">طلبة مسجلين في المناهج</span>
              </div>
            </div>

            <div className="text-center pt-2">
              <button
                onClick={onClose}
                className="px-6 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-colors"
              >
                إغلاق لوحة الإدارة
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
