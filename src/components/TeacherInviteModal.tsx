import React, { useState } from 'react';
import { Link2, Copy, Check, Share2, Send, GraduationCap, Sparkles, UserCheck, CheckCircle2 } from 'lucide-react';

interface TeacherInviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onActivateTeacher: (teacherName: string) => void;
  currentTeacherName?: string;
}

export const TeacherInviteModal: React.FC<TeacherInviteModalProps> = ({
  isOpen,
  onClose,
  onActivateTeacher,
  currentTeacherName,
}) => {
  const [teacherName, setTeacherName] = useState<string>(currentTeacherName || 'أ. أحمد النداوي');
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  // Build the invite URL
  const baseUrl = window.location.origin + window.location.pathname;
  const inviteUrl = `${baseUrl}?teacher=${encodeURIComponent(teacherName.trim() || 'أستاذ')}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const shareText = `السلام عليكم أستاذنا الفاضل ${teacherName}،\nتم إعداد صفحتك كمدرس على منصة «واحد تعليم» للمناهج العراقية.\nيمكنك من خلال هذا الرابط نشر محاضراتك، امتحاناتك اليومية والشهرية، وملازمك لطلابك مباشرة وبشكل مجاني:\n${inviteUrl}`;

  const handleWhatsAppShare = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  const handleTelegramShare = () => {
    const url = `https://t.me/share/url?url=${encodeURIComponent(inviteUrl)}&text=${encodeURIComponent(`رابط منصة المدرس - أستاذ ${teacherName}`)}`;
    window.open(url, '_blank');
  };

  const handleLoginDirectly = () => {
    if (!teacherName.trim()) return;
    onActivateTeacher(teacherName.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative my-8 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-700 text-white flex items-center justify-center shadow-md">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                توليد وإرسال رابط المدرس
              </h3>
              <p className="text-xs text-slate-500">
                أدخل اسم المدرس لتوليد رابط دعوة وصلاحيات نشر فورية
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

        {/* Input Teacher Name */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
            اسم الأستاذ / المعلم (الذي سيظهر في الرابط وللطلبة):
          </label>
          <input
            type="text"
            value={teacherName}
            onChange={(e) => setTeacherName(e.target.value)}
            placeholder="مثال: أ. حيدر وليد، أ. عقيل الزبيدي، أ. أحمد النداوي..."
            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <p className="text-[11px] text-slate-500">
            بمجرد فتح المدرس للرابط، سيتعرف النظام عليه فوراً ويفعل له لوحة النشر بدون الحاجة لكلمة سر.
          </p>
        </div>

        {/* Generated Link Display Box */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <Link2 className="w-4 h-4 text-emerald-600" />
            <span>رابط صفحة المدرس المخصص:</span>
          </label>
          
          <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={inviteUrl}
              className="w-full bg-transparent font-mono text-xs text-slate-800 dark:text-slate-200 focus:outline-none truncate"
            />
            <button
              onClick={handleCopy}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-sm'
              }`}
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'تم النسخ!' : 'نسخ'}</span>
            </button>
          </div>
        </div>

        {/* Quick Share Buttons (WhatsApp & Telegram) */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
            إرسال الرابط مباشرة للأستاذ:
          </span>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleWhatsAppShare}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span>إرسال عبر واتساب</span>
            </button>

            <button
              onClick={handleTelegramShare}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold shadow-sm transition-colors"
            >
              <Send className="w-4 h-4" />
              <span>إرسال عبر تلغرام</span>
            </button>
          </div>
        </div>

        {/* Action: Activate Now as Teacher */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-[11px] text-slate-500">
            يمكنك أيضاً الدخول بهذا الاسم الآن وتجربة النشر بنفسك
          </div>

          <button
            onClick={handleLoginDirectly}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white dark:text-slate-900 text-white rounded-xl text-xs font-bold shadow-md transition-colors"
          >
            <UserCheck className="w-4 h-4" />
            <span>تفعيل وضع المدرس الآن</span>
          </button>
        </div>

      </div>
    </div>
  );
};
