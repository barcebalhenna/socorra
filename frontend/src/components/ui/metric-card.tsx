import React from 'react';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: number;
  trendLabel?: string;
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon,
  trend,
  trendLabel,
  className
}) => {
  return (
    <div className={cn("gani-metric-card", className)}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium text-slate-500 text-sm mb-1">{title}</h3>
          <p className="text-3xl font-bold tracking-tight text-slate-800">{value}</p>
        </div>
        <div className="gani-metric-icon">
          {icon}
        </div>
      </div>
      {(trend !== undefined || trendLabel) && (
        <div className="mt-4 flex items-center text-sm">
          {trend !== undefined && (
            <span className={cn(
              "font-medium", 
              trend > 0 ? "text-insight-enrich" : "text-slate-500"
            )}>
              {trend > 0 ? `+${trend}%` : `${trend}%`}
            </span>
          )}
          {trendLabel && (
            <span className="text-slate-400 ml-2">{trendLabel}</span>
          )}
        </div>
      )}
    </div>
  );
};