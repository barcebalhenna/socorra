import { useState } from 'react';
import GradingSummaryView from './GradingSummaryView';
import QuarterOverview from './components/QuarterOverview';

type AnalyticsTab = 'grading' | 'assessment' | 'quarter' | 'students' | 'sections';

export default function AnalyticsView() {
  const [activeTab, setActiveTab] = useState<AnalyticsTab>('grading');

  const tabs: { id: AnalyticsTab; label: string }[] = [
    { id: 'grading', label: 'Grading Summary' },
    { id: 'quarter', label: 'Quarter Overview' },
    { id: 'assessment', label: 'Assessment' },
    { id: 'students', label: 'Students' },
    { id: 'sections', label: 'Sections' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Analytics & Reports</h1>
        <p className="text-slate-500 mt-2 text-base">Analyze class and student performance data.</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-200/60 shadow-sm w-fit overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-1.5 font-semibold text-sm rounded-lg transition-all duration-200 border whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-white text-brand-700 shadow-sm border-slate-200/60'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'grading' && <GradingSummaryView />}

        {activeTab === 'quarter' && <QuarterOverview />}

        {activeTab === 'assessment' && (
          <div className="p-6 bg-white rounded-2xl border border-slate-200/60 shadow-sm animate-in fade-in duration-300">
            <h2 className="text-2xl font-bold text-slate-900">Assessment</h2>
          </div>
        )}

        {activeTab === 'students' && (
          <div className="p-6 bg-white rounded-2xl border border-slate-200/60 shadow-sm animate-in fade-in duration-300">
            <h2 className="text-2xl font-bold text-slate-900">Students</h2>
          </div>
        )}

        {activeTab === 'sections' && (
          <div className="p-6 bg-white rounded-2xl border border-slate-200/60 shadow-sm animate-in fade-in duration-300">
            <h2 className="text-2xl font-bold text-slate-900">Sections</h2>
          </div>
        )}
      </div>
    </div>
  );
}
