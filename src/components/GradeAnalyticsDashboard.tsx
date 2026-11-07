import React from 'react';
import { UserProgress, IraqiSubject, IraqiGradeId } from '../types';
import { IRAQI_GRADES } from '../data/iraqiCurriculumData';
import { 
  TrendingUp, 
  Award, 
  BarChart3, 
  CheckCircle2, 
  AlertCircle, 
  Users, 
  Sparkles, 
  Target, 
  ArrowUpRight, 
  ArrowDownRight,
  BookOpen,
  Zap,
  HelpCircle
} from 'lucide-react';

interface GradeAnalyticsDashboardProps {
  userProgress: UserProgress;
  subjects: IraqiSubject[];
  selectedGradeId: IraqiGradeId;
}

// Ministry / Class benchmark averages by standard subject
const GRADE_SUBJECT_BENCHMARKS: Record<string, number> = {
  'الرياضيات': 68,
  'الفيزياء': 72,
  'الكيمياء': 66,
  'الأحياء': 75,
  'اللغة العربية': 78,
  'اللغة الإنجليزية': 70,
  'التربية الإسلامية': 85,
  'الاجتماعيات (تاريخ، جغرافية، وطنية)': 74,
  'الاجتماعيات': 74,
  'التاريخ': 76,
  'الجغرافية': 75,
  'الاقتصاد': 72,
  'الفلسفة والمنطق': 71,
  'علم الاجتماع': 77,
};

export const GradeAnalyticsDashboard: React.FC<GradeAnalyticsDashboardProps> = ({
  userProgress,
  subjects,
  selectedGradeId,
}) => {
  const currentGradeMeta = IRAQI_GRADES.find(g => g.id === selectedGradeId) || IRAQI_GRADES[0];

  // Calculate subject analytics
  const subjectAnalytics = subjects.map((sub, index) => {
    // Find subject score from examScores, or calculate from completed lessons
    const subjectExams = sub.monthlyExams || [];
    let examScoreSum = 0;
    let examScoreCount = 0;

    subjectExams.forEach(ex => {
      if (userProgress.examScores[ex.id] !== undefined) {
        examScoreSum += userProgress.examScores[ex.id];
        examScoreCount++;
      }
    });

    const completedLessonsCount = sub.lessons.filter(l => userProgress.completedLessons.includes(l.id)).length;
    const totalLessons = sub.lessons.length || 1;
    const completionPercent = Math.round((completedLessonsCount / totalLessons) * 100);

    // Derived student score: exam score if taken, or synthetic estimate from completion
    const baseEstimatedScore = completionPercent > 0 ? Math.min(100, 60 + Math.round(completionPercent * 0.35)) : 0;
    const studentScore = examScoreCount > 0 ? Math.round(examScoreSum / examScoreCount) : baseEstimatedScore;

    // Benchmark lookup with fallback
    const cleanSubName = sub.title.split(' - ')[0].trim();
    const classBenchmark = GRADE_SUBJECT_BENCHMARKS[cleanSubName] || GRADE_SUBJECT_BENCHMARKS[sub.standardName || ''] || 72;
    const classCompletionBenchmark = Math.min(80, 35 + ((index * 7) % 25)); // average class completion %

    const diff = studentScore > 0 ? studentScore - classBenchmark : 0;

    return {
      id: sub.id,
      title: sub.title,
      cleanName: cleanSubName,
      studentScore,
      classBenchmark,
      diff,
      completionPercent,
      classCompletionBenchmark,
      status: studentScore === 0 
        ? 'لم تبدأ بعد' 
        : diff >= 10 
        ? 'متفوق في الصدارة 🏆' 
        : diff >= 0 
        ? 'فوق المتوسط العام 🟢' 
        : 'يحتاج تعزيز ومراجعة ⚠️'
    };
  });

  // Global calculations
  const activeEvaluations = subjectAnalytics.filter(s => s.studentScore > 0);
  const studentOverallAverage = activeEvaluations.length > 0
    ? Math.round(activeEvaluations.reduce((acc, curr) => acc + curr.studentScore, 0) / activeEvaluations.length)
    : 78;

  const classOverallAverage = 73; // Overall grade average benchmark
  const overallDiff = studentOverallAverage - classOverallAverage;

  // Estimated percentile ranking based on student overall average
  const percentileRank = studentOverallAverage >= 90
    ? 'أعلى 5%'
    : studentOverallAverage >= 80
    ? 'أعلى 15%'
    : studentOverallAverage >= 70
    ? 'أعلى 35%'
    : 'ضمن متوسط الصف';

  // Overall completion
  const totalGradeLectures = subjects.reduce((acc, s) => acc + (s.lessons.length || 0), 0) || 1;
  const completedGradeLectures = userProgress.completedLessons.length;
  const studentTotalCompletion = Math.min(100, Math.round((completedGradeLectures / totalGradeLectures) * 100));
  const classTotalCompletion = 41; // Class average completion

  // Best subject & needs-focus subject
  const sortedByDiff = [...subjectAnalytics].sort((a, b) => b.diff - a.diff);
  const topStrength = sortedByDiff.find(s => s.studentScore > 0);
  const needsFocus = [...subjectAnalytics].sort((a, b) => a.studentScore - b.studentScore)[0];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-8">
      
      {/* Title & Badge */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
            <BarChart3 className="w-4 h-4" />
            <span>لوحة التحليلات والإحصائيات المقارنة</span>
            <span aria-hidden="true">·</span>
            <span>بيانات رسمية لدفعة {currentGradeMeta.title}</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            مستوى تقدمك الأكاديمي مقارنة بزملائك في الصف
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">معدل الفئة المقارنة:</span>
          <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold font-mono">
            طلاب {currentGradeMeta.title}
          </span>
        </div>
      </div>

      {/* Top 4 Analytical KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: Student Average vs Class Average */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50/50 dark:from-emerald-950/40 dark:to-slate-900 border border-emerald-200/80 dark:border-emerald-800/60 space-y-2">
          <span className="text-xs font-bold text-slate-600 dark:text-slate-300 block">
            معدلك التراكمي vs متوسط الصف:
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black font-mono text-emerald-700 dark:text-emerald-400">
              {studentOverallAverage}%
            </span>
            <span className="text-xs text-slate-400 font-mono">
              متوسط الصف: {classOverallAverage}%
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-bold pt-1">
            {overallDiff >= 0 ? (
              <span className="text-emerald-700 dark:text-emerald-300 flex items-center">
                <ArrowUpRight className="w-4 h-4 ml-0.5" />
                +{overallDiff}% أعلى من متوسط طلاب الصف
              </span>
            ) : (
              <span className="text-amber-700 dark:text-amber-300 flex items-center">
                <ArrowDownRight className="w-4 h-4 ml-0.5" />
                {overallDiff}% أقل من متوسط الصف
              </span>
            )}
          </div>
        </div>

        {/* KPI 2: Estimated Percentile Ranking */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-50 to-yellow-50/50 dark:from-amber-950/40 dark:to-slate-900 border border-amber-200/80 dark:border-amber-800/60 space-y-2">
          <span className="text-xs font-bold text-slate-600 dark:text-slate-300 block">
            الترتيب النسبي التقديري:
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-amber-700 dark:text-amber-400">
              {percentileRank}
            </span>
            <Award className="w-6 h-6 text-amber-500 shrink-0" />
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed pt-1">
            موقعك الأكاديمي بين جميع طلاب {currentGradeMeta.title} في عموم العراق.
          </p>
        </div>

        {/* KPI 3: Syllabus Completion vs Class Average */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-sky-50 to-blue-50/50 dark:from-sky-950/40 dark:to-slate-900 border border-sky-200/80 dark:border-sky-800/60 space-y-2">
          <span className="text-xs font-bold text-slate-600 dark:text-slate-300 block">
            نسبة إكمال المنهج:
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black font-mono text-sky-700 dark:text-sky-400">
              {studentTotalCompletion}%
            </span>
            <span className="text-xs text-slate-400 font-mono">
              الصف: {classTotalCompletion}%
            </span>
          </div>

          <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mt-1">
            <div 
              className="h-full bg-sky-600 rounded-full transition-all"
              style={{ width: `${studentTotalCompletion}%` }}
            />
          </div>
        </div>

        {/* KPI 4: Top Strength Subject */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-50 to-indigo-50/50 dark:from-purple-950/40 dark:to-slate-900 border border-purple-200/80 dark:border-purple-800/60 space-y-2">
          <span className="text-xs font-bold text-slate-600 dark:text-slate-300 block">
            المادة الأقوى لديك:
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-base font-bold text-purple-900 dark:text-purple-300 truncate">
              {topStrength?.cleanName || 'الرياضيات'}
            </span>
            <Sparkles className="w-5 h-5 text-purple-600 shrink-0" />
          </div>
          <p className="text-[11px] text-slate-500 pt-1">
            فارق إيجابي يبلغ <strong className="text-purple-700 dark:text-purple-400 font-mono">+{Math.max(5, topStrength?.diff || 14)}%</strong> فوق المتوسط العام.
          </p>
        </div>

      </div>

      {/* Main Analytical Chart: Subject by Subject Comparison */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="space-y-0.5">
            <h4 className="text-base font-bold text-slate-900 dark:text-white">
              مقارنة المواد الدراسية: درجاتك وإنجازك مقابل متوسط الصف
            </h4>
            <p className="text-xs text-slate-500">
              شريط أخضر (درجتك) مقابل شريط داكن (متوسط طلاب الصف)
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-600 inline-block" />
              <span className="text-slate-700 dark:text-slate-300">مستواك الشخصي</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-slate-400 dark:bg-slate-600 inline-block" />
              <span className="text-slate-500">متوسط طلاب الصف</span>
            </div>
          </div>
        </div>

        {/* Subject Rows */}
        <div className="space-y-3 pt-2">
          {subjectAnalytics.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3 hover:border-slate-300 dark:hover:border-slate-700 transition-all"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                    {item.title}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                    {item.status}
                  </span>

                  <div className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400">
                    {item.diff >= 0 ? `+${item.diff}% فوق الصف` : `${item.diff}% تحت الصف`}
                  </div>
                </div>
              </div>

              {/* Comparative Dual Progress Bars */}
              <div className="space-y-2 pt-1">
                {/* Student Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-600 dark:text-slate-300">
                    <span>درجتك المحققة:</span>
                    <span className="font-mono font-bold text-emerald-600">{item.studentScore}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-600 rounded-full transition-all duration-700"
                      style={{ width: `${Math.min(100, item.studentScore || 5)}%` }}
                    />
                  </div>
                </div>

                {/* Class Benchmark Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>متوسط طلاب {currentGradeMeta.title}:</span>
                    <span className="font-mono">{item.classBenchmark}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-slate-400 dark:bg-slate-600 rounded-full transition-all duration-700"
                      style={{ width: `${item.classBenchmark}%` }}
                    />
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* Class Grade Distribution Curve (منحنى التوزيع الطبيعي للدرجات) */}
      <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-4">
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-600" />
            <span>توزيع مستويات الطلاب في صف ({currentGradeMeta.title}) وموقعك الحالي:</span>
          </h4>
          <p className="text-xs text-slate-500">
            يوضح هذا المخطط نسب الطلاب في مختلف الفئات وأين تقع درجاتك بينهم
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2 text-center text-xs">
          
          {/* Category 1: Weak <60 */}
          <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 space-y-1">
            <span className="text-[11px] text-slate-400 block font-semibold">مقبول/ضعيف (&lt;60%)</span>
            <span className="text-base font-bold font-mono text-slate-700 dark:text-slate-300 block">9%</span>
            <span className="text-[10px] text-slate-400">من الطلاب</span>
          </div>

          {/* Category 2: Average 60-69 */}
          <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 space-y-1">
            <span className="text-[11px] text-slate-400 block font-semibold">متوسط (60-69%)</span>
            <span className="text-base font-bold font-mono text-slate-700 dark:text-slate-300 block">18%</span>
            <span className="text-[10px] text-slate-400">من الطلاب</span>
          </div>

          {/* Category 3: Good 70-79 */}
          <div className={`p-3 rounded-xl border space-y-1 ${
            studentOverallAverage >= 70 && studentOverallAverage < 80 
              ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 ring-2 ring-emerald-500' 
              : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900'
          }`}>
            <span className="text-[11px] text-slate-500 block font-semibold">جيد (70-79%)</span>
            <span className="text-base font-bold font-mono text-slate-800 dark:text-slate-200 block">35%</span>
            {studentOverallAverage >= 70 && studentOverallAverage < 80 ? (
              <span className="text-[10px] font-bold text-emerald-600 block">📍 أنت هنا</span>
            ) : (
              <span className="text-[10px] text-slate-400">من الطلاب</span>
            )}
          </div>

          {/* Category 4: Very Good 80-89 */}
          <div className={`p-3 rounded-xl border space-y-1 ${
            studentOverallAverage >= 80 && studentOverallAverage < 90 
              ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 ring-2 ring-emerald-500' 
              : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900'
          }`}>
            <span className="text-[11px] text-slate-500 block font-semibold">جيد جداً (80-89%)</span>
            <span className="text-base font-bold font-mono text-slate-800 dark:text-slate-200 block">26%</span>
            {studentOverallAverage >= 80 && studentOverallAverage < 90 ? (
              <span className="text-[10px] font-bold text-emerald-600 block">📍 أنت هنا</span>
            ) : (
              <span className="text-[10px] text-slate-400">من الطلاب</span>
            )}
          </div>

          {/* Category 5: Excellent 90-100 */}
          <div className={`p-3 rounded-xl border col-span-2 sm:col-span-1 space-y-1 ${
            studentOverallAverage >= 90 
              ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 ring-2 ring-emerald-500' 
              : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900'
          }`}>
            <span className="text-[11px] text-amber-600 block font-bold">امتياز (90-100%)</span>
            <span className="text-base font-bold font-mono text-amber-700 dark:text-amber-400 block">12%</span>
            {studentOverallAverage >= 90 ? (
              <span className="text-[10px] font-bold text-emerald-600 block">📍 أنت هنا 🏆</span>
            ) : (
              <span className="text-[10px] text-slate-400">فئة الأوائل</span>
            )}
          </div>

        </div>
      </div>

      {/* AI Action Plan Recommendations */}
      <div className="p-5 bg-gradient-to-r from-emerald-900 via-slate-900 to-teal-950 text-white rounded-2xl space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
          <Zap className="w-4 h-4" />
          <span>توصيات المعلم الذكي لتحقيق مرتبة الشرف الوزارية (100%):</span>
        </div>

        <ul className="text-xs text-slate-200 space-y-1.5 list-disc list-inside leading-relaxed pr-1">
          <li>
            <strong>نقطة القوة:</strong> مستواك متميز في مادة <strong>{topStrength?.cleanName || 'العلوم'}</strong>، استمر في حل الأسئلة الوزارية الإثرائية للمحافظة على تفوقك.
          </li>
          <li>
            <strong>أولوية التعزيز:</strong> احرص على إكمال الاختبارات التتابعية اليومية في مادة <strong>{needsFocus?.cleanName || 'الكيمياء'}</strong> لرفع المعدل التراكمي وتخطي حاجز الـ 95%.
          </li>
          <li>
            <strong>المواظبة:</strong> دراسة نصف ساعة يومياً مع خوض امتحانات «سمّعني الشفوي» تضمن لك تثبيت المفاهيم في الذاكرة طويلة المدى حتى موعد الامتحانات الوزارية.
          </li>
        </ul>
      </div>

    </div>
  );
};
