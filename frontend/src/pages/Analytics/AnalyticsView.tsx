import { useState } from 'react';
import { Button } from '@/components/ui/button';

type AnalyticsTab = 'assessment' | 'quarter' | 'students' | 'sections';

export default function AnalyticsView() {
  const [activeTab, setActiveTab] = useState<AnalyticsTab>('quarter');

  const tabs: { id: AnalyticsTab; label: string }[] = [
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
      <div className="flex gap-2 border-b border-slate-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 font-medium text-sm transition-all duration-200 border-b-2 ${
              activeTab === tab.id
                ? 'border-brand-600 text-brand-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'quarter' && (
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900">Quarter Overview</h2>
          </div>
        )}

        {activeTab === 'assessment' && (
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900">Assessment</h2>
          </div>
        )}

        {activeTab === 'students' && (
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900">Students</h2>
          </div>
        )}

        {activeTab === 'sections' && (
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900">Sections</h2>
          </div>
        )}
      </div>
    </div>
  );
}
