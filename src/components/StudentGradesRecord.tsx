import React, { useState } from 'react';
import { UserProgress, IraqiSubject } from '../types';
import { IRAQI_GRADES } from '../data/iraqiCurriculumData';
import { GamificationBadges } from './GamificationBadges';
import { GradeAnalyticsDashboard } from './GradeAnalyticsDashboard';
import { 
  Award, 
  Printer, 
  CheckCircle2, 
  TrendingUp, 
  BookOpen, 
  Clock, 
  Edit3, 
  ShieldCheck, 
  Search,
  ExternalLink,
  BarChart3
} from 'lucide-react';

interface StudentGradesRecordProps {
  userProgress: UserProgress;
  subjects: IraqiSubject[];
  onUpdateStudentName: (name: string) => void;
  onOpenCertificate: (title: string, score: number, gradeLabel: string) => void;
  onOpenVerifier: () => void;
  onOpenOnboarding: () => void;
}

export const StudentGradesRecord: React.FC<StudentGradesRecordProps> = ({
  userProgress,
  subjects,
  onUpdateStudentName,
  onOpenCertificate,
  onOpenVerifier,
  onOpenOnboarding,
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [nameInput, setNameInput] = useState<string>(userProgress.studentName);
  const [recordTab, setRecordTab] = useState<'analytics' | 'exams'>('analytics');


  const gradeMeta = IRAQI_GRADES.find(g => g.id === userProgress.gradeId) || IRAQI_GRADES[0];

  const handleSaveName = () => {
    if (nameInput.trim()) {
      onUpdateStudentName(nameInput.trim());
      setIsEditing(false);
    }
  };

  // Calculate student average
  const examScoresList = Object.values(userProgress.examScores);
  const averageScore = examScoresList.length > 0
    ? Math.round(examScoresList.reduce((a, b) => a + b, 0) / examScoresList.length)
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Student Profile Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-700 text-white flex items-center justify-center text-3xl font-black shadow-md">
            {userProgress.studentName ? userProgress.studentName[0] : '١'}
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="px-2.5 py-1 text-sm font-bold bg-slate-50 dark:bg-slate-800 border rounded-lg text-slate-900 dark:text-white"
                  />
                  <button
                    onClick={handleSaveName}
                    className="px-3 py-1 bg-emerald-600 text-white text-xs font-semibold rounded-lg"
                  >
                    حفظ
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                    {userProgress.studentName || 'طالب عراقي متميز'}
                  </h2>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-slate-400 hover:text-slate-600 p-1"
                    title="تعديل اسم الطالب"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span>الصف الدراسي: <strong className="text-emerald-700 dark:text-emerald-400">{gradeMeta.title}</strong></span>
              <span aria-hidden="true">·</span>
              <button
                onClick={onOpenOnboarding}
                className="text-emerald-600 dark:text-emerald-400 underline font-semibold"
              >
                تغيير الصف
              </button>
            </div>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-3 gap-6 text-center border-t md:border-t-0 md:border-r border-slate-100 dark:border-slate-800 pt-4 md:pt-0 md:pr-8 w-full md:w-auto">
          <div>
            <span className="font-mono text-2xl font-black text-emerald-600">
              {averageScore > 0 ? `${averageScore}%` : '—'}
            </span>
            <p className="text-[11px] text-slate-400 mt-0.5">المعدل العام</p>
          </div>

          <div>
            <span className="font-mono text-2xl font-black text-slate-900 dark:text-white">
              {examScoresList.length}
            </span>
            <p className="text-[11px] text-slate-400 mt-0.5">امتحانات مكتملة</p>
          </div>

          <div>
            <span className="font-mono text-2xl font-black text-slate-900 dark:text-white">
              {userProgress.completedLessons.length}
            </span>
            <p className="text-[11px] text-slate-400 mt-0.5">محاضرات منجزة</p>
          </div>
        </div>

      </div>

      {/* Gamification & Badges Showcase */}
      <GamificationBadges
        unlockedBadgeIds={userProgress.badges}
        totalPoints={userProgress.totalPoints}
        streakDays={userProgress.streakDays}
      />

      {/* Subtab Switcher: Analytics vs Detailed Exams Record */}
      <div className="flex items-center gap-2 bg-slate-200/80 dark:bg-slate-800/80 p-1.5 rounded-2xl w-fit">
        <button
          onClick={() => setRecordTab('analytics')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            recordTab === 'analytics'
              ? 'bg-emerald-700 text-white shadow-md'
              : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>لوحة التحليلات والمقارنة بمتوسط طلاب الصف</span>
        </button>

        <button
          onClick={() => setRecordTab('exams')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            recordTab === 'exams'
              ? 'bg-emerald-700 text-white shadow-md'
              : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>سجل الامتحانات والشهادات ونسب الإنجاز</span>
        </button>
      </div>

      {/* Render the Analytical Statistical Comparison Dashboard */}
      {recordTab === 'analytics' && (
        <GradeAnalyticsDashboard
          userProgress={userProgress}
          subjects={subjects}
          selectedGradeId={userProgress.gradeId}
        />
      )}

      {/* Subjects Progress & Completion Rates */}
      {recordTab === 'exams' && (
        <>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              نسبة إنجاز المواد الدراسية لـ ({gradeMeta.title})
            </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjects.map((sub) => {
            const totalLectures = sub.lessons.length || 1;
            const completedCount = sub.lessons.filter(l => userProgress.completedLessons.includes(l.id)).length;
            const percent = Math.round((completedCount / totalLectures) * 100);

            return (
              <div
                key={sub.id}
                className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2"
              >
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-800 dark:text-slate-200">{sub.title}</span>
                  <span className="font-mono font-bold text-emerald-600">{percent}%</span>
                </div>

                <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                    style={{ width: `${percent}%` }}
                  />
                </div>

                <div className="text-[11px] text-slate-400 flex justify-between">
                  <span>{completedCount} من {totalLectures} محاضرة</span>
                  {percent === 100 && (
                    <span className="text-emerald-600 font-bold">✓ مكتملة</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Monthly Exams Record Table & Verification */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
        
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              سجل نتائج الامتحانات والشهادات المكتسبة
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenVerifier}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-lg text-xs font-semibold"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>التحقق من صحة الشهادات (QR/الكود)</span>
            </button>

            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>طباعة بطاقة الدرجات</span>
            </button>
          </div>
        </div>

        {Object.keys(userProgress.examScores).length === 0 ? (
          <div className="py-12 text-center space-y-2">
            <BookOpen className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-xs text-slate-500">لم تقدم أي امتحانات حتى الآن.</p>
            <p className="text-[11px] text-slate-400">تابع المحاضرات واجتز الامتحانات اليومية والشهرية لتحصل على شهاداتك.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {Object.entries(userProgress.examScores).map(([examId, score]) => (
              <div key={examId} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200">
                    امتحان رقم {examId}
                  </h4>
                  <span className="text-[11px] text-slate-400">امتحان شهري معتمد</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-sm text-emerald-600">
                    {score}%
                  </span>
                  {score >= 75 && (
                    <button
                      onClick={() => onOpenCertificate(`امتحان شهري: ${examId}`, score, gradeMeta.title)}
                      className="px-2.5 py-1 text-[11px] bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 rounded border border-emerald-200 dark:border-emerald-800 font-semibold"
                    >
                      عرض الشهادة المعتمدة
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      </>
      )}

    </div>
  );
};
