import type { GlobalAnalyticsContext } from '@/types/analytics.types';
import { Progress } from '@/components/ui/progress';
import { AIInsightsPanel } from './AIInsightsPanel';
import { Users, GraduationCap, Percent, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

const StatCard = ({ title, value, icon, trendLabel, trendClass }: any) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
    <div className="flex justify-between items-start">
      <div>
        <h3 className="font-medium text-slate-500 text-sm mb-1">{title}</h3>
        <p className="text-3xl font-bold tracking-tight text-slate-800">{value}</p>
      </div>
      <div className="p-3 bg-brand-50 text-brand-600 rounded-xl">
        {icon}
      </div>
    </div>
    {trendLabel && (
      <div className="mt-4 flex items-center text-sm">
        <span className={cn("font-medium", trendClass || "text-slate-500")}>
          {trendLabel}
        </span>
      </div>
    )}
  </div>
);

interface GlobalTierViewProps {
  data: GlobalAnalyticsContext;
}

export function GlobalTierView({ data }: GlobalTierViewProps) {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 delay-150 fill-mode-both">
      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Active Classes" 
          value={data.activeClassesCount} 
          icon={<BookOpen size={24} />} 
          trendLabel="Currently managed sections" 
        />
        <StatCard 
          title="Students Assessed" 
          value={data.totalStudentsAssessed} 
          icon={<Users size={24} />} 
          trendLabel="Across all active items" 
        />
        <StatCard 
          title="Overall Average" 
          value={`${data.overallAverage.toFixed(1)}%`} 
          icon={<Percent size={24} />} 
          trendLabel="+2.4% from last term"
          trendClass="text-brand-600"
        />
        <StatCard 
          title="Overall Mastery" 
          value={`${data.overallMasteryRate.toFixed(1)}%`} 
          icon={<GraduationCap size={24} />} 
          trendLabel="Students at Proficient or higher" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Class Comparisons */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm lg:col-span-1 flex flex-col">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Class Comparisons</h3>
          <div className="space-y-6 flex-1">
            {data.classComparisons.map((cls) => (
              <div key={cls.classId}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-600">{cls.className}</span>
                  <span className="text-sm font-bold text-slate-900">{cls.averageScore}%</span>
                </div>
                <Progress 
                  value={cls.averageScore} 
                  className="h-2.5" 
                  indicatorColor={
                    cls.averageScore >= 85 ? 'bg-brand-500' : 
                    cls.averageScore >= 75 ? 'bg-blue-500' : 'bg-orange-500'
                  }
                />
              </div>
            ))}
          </div>
        </div>

        {/* AI Prescriptive Actions */}
        <div className="lg:col-span-2">
          <AIInsightsPanel insights={data.globalInsights} />
        </div>
      </div>
    </div>
  );
}
