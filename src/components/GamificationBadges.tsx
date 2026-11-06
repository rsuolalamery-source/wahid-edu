import React from 'react';
import { Badge } from '../types';
import { SYSTEM_BADGES } from '../data/iraqiCurriculumData';
import { Award, Flame, Zap, Crown, ShieldCheck, Rocket, Lock } from 'lucide-react';

interface GamificationBadgesProps {
  unlockedBadgeIds: string[];
  totalPoints: number;
  streakDays: number;
}

export const GamificationBadges: React.FC<GamificationBadgesProps> = ({
  unlockedBadgeIds,
  totalPoints,
  streakDays,
}) => {
  const getBadgeIcon = (iconName: string, isUnlocked: boolean) => {
    const iconClass = isUnlocked ? 'w-6 h-6 text-amber-500' : 'w-6 h-6 text-slate-400';
    switch (iconName) {
      case 'Rocket':
        return <Rocket className={iconClass} />;
      case 'Zap':
        return <Zap className={iconClass} />;
      case 'Crown':
        return <Crown className={iconClass} />;
      case 'Flame':
        return <Flame className={iconClass} />;
      case 'ShieldCheck':
        return <ShieldCheck className={iconClass} />;
      default:
        return <Award className={iconClass} />;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
      
      {/* Header with Points and Streak */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 dark:text-amber-400">
            <Award className="w-4 h-4" />
            <span>نظام الأوسمة والتحفيز الطلابي</span>
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            أوسمتي وإنجازاتي الأكاديمية
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-900 text-xs font-mono font-bold text-amber-700 dark:text-amber-300">
            <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
            <span>المواظبة: {streakDays} أيام</span>
          </div>

          <div className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-900 text-xs font-mono font-bold text-emerald-700 dark:text-emerald-300">
            <span>النقاط: {totalPoints} XP</span>
          </div>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {SYSTEM_BADGES.map((badge) => {
          const isUnlocked = unlockedBadgeIds.includes(badge.id);

          return (
            <div
              key={badge.id}
              className={`p-4 rounded-2xl border transition-all flex items-start gap-3.5 ${
                isUnlocked
                  ? 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/60 shadow-sm'
                  : 'bg-slate-50/60 dark:bg-slate-800/30 border-slate-200 dark:border-slate-800 opacity-60'
              }`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                isUnlocked
                  ? 'bg-amber-100 dark:bg-amber-950 border border-amber-300 dark:border-amber-800'
                  : 'bg-slate-200 dark:bg-slate-800'
              }`}>
                {getBadgeIcon(badge.icon, isUnlocked)}
              </div>

              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {badge.title}
                  </h4>
                  {!isUnlocked && (
                    <Lock className="w-3 h-3 text-slate-400 shrink-0" />
                  )}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  {badge.description}
                </p>
                <span className="text-[10px] font-bold block pt-1 font-mono">
                  {isUnlocked ? '✓ وسام مكتسب' : 'قيد الإنجاز'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
