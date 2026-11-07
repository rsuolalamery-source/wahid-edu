import React from 'react';
import { IraqiGradeId } from '../types';
import { IRAQI_GRADES } from '../data/iraqiCurriculumData';
import { 
  BookOpen, 
  Award, 
  Moon, 
  Sun, 
  Brain, 
  GraduationCap, 
  PlusCircle,
  FileText,
  Mic,
  Camera,
  User,
  LogOut,
  ShieldCheck,
  UserCheck
} from 'lucide-react';

export type NavTab = 'subjects' | 'malazem' | 'sameani' | 'player' | 'exams' | 'dashboard';

interface NavbarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  selectedGradeId: IraqiGradeId;
  studentName: string;
  isLoggedIn: boolean;
  isTeacher: boolean;
  teacherName?: string;
  isManager: boolean;
  onOpenTutor: () => void;
  onOpenPaperGrader: () => void;
  onOpenTeacherDashboard: () => void;
  onOpenAdminPortal: () => void;
  onOpenAddMalzama: () => void;
  onLogout: () => void;
  onOpenAuthModal: () => void;
  onOpenVerifier: () => void;
  onOpenGradeSwitcher: () => void;
  streakDays: number;
  totalPoints: number;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  selectedGradeId,
  studentName,
  isLoggedIn,
  isTeacher,
  teacherName,
  isManager,
  onOpenTutor,
  onOpenPaperGrader,
  onOpenTeacherDashboard,
  onOpenAdminPortal,
  onOpenAddMalzama,
  onLogout,
  onOpenAuthModal,
  onOpenVerifier,
  onOpenGradeSwitcher,
  streakDays,
  totalPoints,
  isDarkMode,
  onToggleTheme,
}) => {
  const currentGradeMeta = IRAQI_GRADES.find(g => g.id === selectedGradeId);

  // Secret Manager Access: Triple click counter on Logo or Ctrl+Shift+M
  const clickCountRef = React.useRef<number>(0);
  const clickTimerRef = React.useRef<any>(null);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'M' || e.key === 'm')) {
        e.preventDefault();
        onOpenAdminPortal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onOpenAdminPortal]);

  const handleSecretLogoClick = () => {
    clickCountRef.current += 1;
    if (clickTimerRef.current) clearTimeout(clickTimerRef.current);

    if (clickCountRef.current >= 3) {
      clickCountRef.current = 0;
      onOpenAdminPortal();
    } else {
      clickTimerRef.current = setTimeout(() => {
        clickCountRef.current = 0;
      }, 1500);
      onSelectTab('subjects');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      
      {/* Top Banner if Manager Mode is Active */}
      {isManager && (
        <div className="bg-slate-900 text-white px-4 py-1.5 text-xs font-semibold flex items-center justify-between border-b border-emerald-600">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>
              <strong>وضع مدير المنصة مفعّل 🛡️</strong> - أنت المسؤول الوحيد عن إرسال روابط دعوة المدرسين
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenAdminPortal}
              className="px-2.5 py-0.5 bg-emerald-600 text-white rounded font-bold hover:bg-emerald-700 transition-colors"
            >
              بوابة دعوة المدرسين
            </button>
            <button
              onClick={onOpenTeacherDashboard}
              className="px-2.5 py-0.5 bg-slate-800 text-slate-200 rounded hover:bg-slate-700 transition-colors"
            >
              نشر مادة جديدة
            </button>
            <button
              onClick={onLogout}
              className="text-[11px] text-slate-400 hover:text-white underline mr-2"
            >
              خروج المدير
            </button>
          </div>
        </div>
      )}

      {/* Top Banner if Teacher Mode is Active */}
      {isTeacher && !isManager && (
        <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white px-4 py-1.5 text-xs font-semibold flex items-center justify-between shadow-inner">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
            <span>
              أهلاً وسهلاً بالأستاذ <strong>{teacherName || 'المحترم'}</strong> (وضع المدرس مفعّل 🎓 - نشر المحاضرات والملازم متاح لك)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenTeacherDashboard}
              className="px-2.5 py-0.5 bg-white text-emerald-900 rounded font-bold hover:bg-emerald-50 transition-colors"
            >
              + نشر محاضرة واختبار
            </button>
            <button
              onClick={onOpenAddMalzama}
              className="px-2.5 py-0.5 bg-emerald-900/80 text-emerald-100 rounded font-medium hover:bg-emerald-950 transition-colors"
            >
              + رفع ملزمة
            </button>
            <button
              onClick={onLogout}
              className="flex items-center gap-1 text-[11px] text-emerald-200 hover:text-white underline mr-2"
            >
              <LogOut className="w-3 h-3" />
              <span>خروج المدرس</span>
            </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        
        {/* Zone 1: Brand & Current Grade Indicator */}
        <div className="flex items-center gap-3 shrink-0">
          <div 
            onClick={handleSecretLogoClick}
            className="flex items-center gap-2 cursor-pointer shrink-0 select-none"
            title="واحد تعليم - المنهج العراقي"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-700 flex items-center justify-center text-white font-black text-xl shadow-sm">
              ١
            </div>
            <div className="flex flex-col">
              <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap leading-none">
                واحد تعليم
              </span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5 whitespace-nowrap">
                المنهج العراقي مجاناً
              </span>
            </div>
          </div>

          {/* Current Grade Switcher */}
          <button
            onClick={onOpenGradeSwitcher}
            title="انقر لتغيير الصف الدراسي"
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 rounded-lg border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 transition-colors"
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span className="truncate max-w-[120px]">{currentGradeMeta?.title || 'المنهج العراقي'}</span>
            <span className="text-[10px] opacity-70 underline">تغيير</span>
          </button>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-5 text-xs sm:text-sm font-medium">
          <button
            onClick={() => onSelectTab('subjects')}
            className={`whitespace-nowrap transition-colors pb-1 flex items-center gap-1.5 ${
              currentTab === 'subjects' || currentTab === 'player'
                ? 'text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-600 font-bold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>المواد والمحاضرات</span>
          </button>
          
          <button
            onClick={() => onSelectTab('malazem')}
            className={`whitespace-nowrap transition-colors pb-1 flex items-center gap-1.5 ${
              currentTab === 'malazem'
                ? 'text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-600 font-bold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>الملازم الدراسية</span>
          </button>

          <button
            onClick={() => onSelectTab('sameani')}
            className={`whitespace-nowrap transition-colors pb-1 flex items-center gap-1.5 ${
              currentTab === 'sameani'
                ? 'text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-600 font-bold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            <span>سمّعني (الشفوي)</span>
          </button>

          <button
            onClick={() => onSelectTab('exams')}
            className={`whitespace-nowrap transition-colors pb-1 flex items-center gap-1.5 ${
              currentTab === 'exams'
                ? 'text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-600 font-bold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>الامتحانات والشهادات</span>
          </button>

          <button
            onClick={() => onSelectTab('dashboard')}
            className={`whitespace-nowrap transition-colors pb-1 ${
              currentTab === 'dashboard'
                ? 'text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-600 font-bold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span>سجل درجاتي</span>
          </button>
        </nav>

        {/* Zone 3: Actions & Student Account / Paper Grader */}
        <div className="flex items-center gap-2 shrink-0">

          {/* Manager Access Button - ONLY visible when manager mode is active */}
          {isManager && (
            <button
              onClick={onOpenAdminPortal}
              title="لوحة مدير المنصة - إرسال روابط دعوة المدرسين"
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-900 text-emerald-300 border border-emerald-500 rounded-lg text-xs font-bold hover:bg-slate-800 transition-colors shadow-sm animate-pulse"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">لوحة المدير 🛡️</span>
              <span className="sm:hidden">المدير</span>
            </button>
          )}

          {/* Paper and Pen Notebook Solution Camera Grader */}
          <button
            onClick={onOpenPaperGrader}
            title="مصحح الورقة والقلم والدفتر بالذكاء الاصطناعي"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-900 rounded-lg text-xs font-semibold hover:bg-amber-100 transition-colors"
          >
            <Camera className="w-3.5 h-3.5 text-amber-600" />
            <span className="hidden sm:inline">مصحح الدفتر والورقة</span>
            <span className="sm:hidden">دفتر</span>
          </button>

          {/* Student Account Status / Login */}
          {isLoggedIn ? (
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs">
              <User className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="font-bold text-slate-800 dark:text-slate-200 truncate max-w-[80px]">
                {studentName}
              </span>
              <button
                onClick={onLogout}
                title="تسجيل الخروج أو تبديل الحساب"
                className="text-[10px] text-slate-400 hover:text-red-600 mr-1"
              >
                خروج
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-lg text-xs font-semibold"
            >
              <User className="w-3.5 h-3.5 text-emerald-600" />
              <span>تسجيل الدخول</span>
            </button>
          )}

          {/* Dark Mode Toggle */}
          <button
            onClick={onToggleTheme}
            aria-label="تبديل المظهر"
            className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Primary Action Button: Smart Iraqi Tutor */}
          <button
            onClick={onOpenTutor}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-sm transition-all whitespace-nowrap"
          >
            <Brain className="w-4 h-4" />
            <span className="hidden sm:inline">المعلم الذكي</span>
          </button>
        </div>

      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="md:hidden border-t border-slate-100 dark:border-slate-800 px-4 py-2 flex items-center justify-around text-[11px] overflow-x-auto no-scrollbar font-medium">
        <button
          onClick={() => onSelectTab('subjects')}
          className={`px-2 py-1 rounded-md whitespace-nowrap ${currentTab === 'subjects' ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 font-bold' : 'text-slate-600 dark:text-slate-400'}`}
        >
          المواد
        </button>
        <button
          onClick={() => onSelectTab('malazem')}
          className={`px-2 py-1 rounded-md whitespace-nowrap ${currentTab === 'malazem' ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 font-bold' : 'text-slate-600 dark:text-slate-400'}`}
        >
          الملازم
        </button>
        <button
          onClick={() => onSelectTab('sameani')}
          className={`px-2 py-1 rounded-md whitespace-nowrap ${currentTab === 'sameani' ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 font-bold' : 'text-slate-600 dark:text-slate-400'}`}
        >
          سمّعني الشفوي
        </button>
        <button
          onClick={onOpenPaperGrader}
          className="px-2 py-1 rounded-md whitespace-nowrap text-amber-700 font-bold"
        >
          مصحح الورقة
        </button>
        <button
          onClick={() => onSelectTab('exams')}
          className={`px-2 py-1 rounded-md whitespace-nowrap ${currentTab === 'exams' ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 font-bold' : 'text-slate-600 dark:text-slate-400'}`}
        >
          الامتحانات
        </button>
        <button
          onClick={() => onSelectTab('dashboard')}
          className={`px-2 py-1 rounded-md whitespace-nowrap ${currentTab === 'dashboard' ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 font-bold' : 'text-slate-600 dark:text-slate-400'}`}
        >
          درجاتي
        </button>
        {isManager && (
          <button
            onClick={onOpenAdminPortal}
            className="px-2 py-1 rounded-md whitespace-nowrap text-slate-800 dark:text-emerald-400 font-bold flex items-center gap-1 bg-slate-100 dark:bg-slate-800"
          >
            <ShieldCheck className="w-3 h-3 text-emerald-500" />
            <span>لوحة المدير</span>
          </button>
        )}
      </div>

    </header>
  );
};
