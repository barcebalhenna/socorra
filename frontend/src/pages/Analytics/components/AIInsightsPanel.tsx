import type { AIInsight } from '@/types/analytics.types';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Lightbulb, TrendingDown, Target, Sparkles } from 'lucide-react';

interface AIInsightsPanelProps {
  insights: AIInsight[];
}

export function AIInsightsPanel({ insights }: AIInsightsPanelProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'Descriptive': return <Target className="w-5 h-5 text-blue-600" />;
      case 'Predictive': return <TrendingDown className="w-5 h-5 text-orange-600" />;
      case 'Prescriptive': return <Lightbulb className="w-5 h-5 text-brand-600" />;
      default: return null;
    }
  };

  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'Descriptive': return 'bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200';
      case 'Predictive': return 'bg-orange-50 text-orange-700 hover:bg-orange-100 border-orange-200';
      case 'Prescriptive': return 'bg-brand-50 text-brand-700 hover:bg-brand-100 border-brand-200';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden h-full flex flex-col">
      <div className="bg-gradient-to-r from-brand-50/50 to-white px-6 py-5 border-b border-slate-100 flex items-center gap-3">
        <div className="p-2 bg-brand-100 text-brand-600 rounded-xl">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-800">AI Teaching Assistant Insights</h3>
          <p className="text-sm text-slate-500">Automated insights based on recent assessments</p>
        </div>
      </div>
      
      <div className="divide-y divide-slate-100 flex-1">
        {insights.map((insight) => (
          <div key={insight.id} className="p-6 flex flex-col md:flex-row gap-5 items-start md:items-center justify-between hover:bg-slate-50/50 transition-all duration-200 hover:-translate-x-0.5">
            <div className="flex gap-4 items-start">
              <div className="mt-1 p-2 rounded-xl bg-white border border-slate-200/60 shadow-sm">
                {getIcon(insight.type)}
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1.5">
                  <h4 className="font-bold text-slate-800">{insight.title}</h4>
                  <Badge variant="outline" className={getBadgeColor(insight.type) + " px-2 py-0.5"}>
                    {insight.type}
                  </Badge>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed max-w-2xl">{insight.description}</p>
              </div>
            </div>
            
            {insight.suggestedAction && (
              <button className="shrink-0 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-brand-700 bg-brand-50 rounded-xl hover:bg-brand-100 transition-all duration-200 hover:-translate-y-px active:translate-y-0 group">
                {insight.suggestedAction}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
