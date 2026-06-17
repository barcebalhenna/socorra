import { useState } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Step2Competencies() {
  const [rows, setRows] = useState([
    { 
      id: 1, 
      competency: 'Illustrates theorems on triangle inequalities...', 
      meetings: 3, 
      items: 6, 
      remembering: 2,
      understanding: 2,
      applying: 1,
      analyzing: 1,
      evaluating: 0,
      creating: 0,
      placement: '1-4, 11, 12' 
    },
    { 
      id: 2, 
      competency: 'Applies theorems on triangle inequalities.', 
      meetings: 2, 
      items: 4, 
      remembering: 1,
      understanding: 1,
      applying: 1,
      analyzing: 1,
      evaluating: 0,
      creating: 0,
      placement: '5, 7, 9, 10' 
    }
  ]);

  const totalMeetings = rows.reduce((sum, r) => sum + (Number(r.meetings) || 0), 0);
  const totalItems = rows.reduce((sum, r) => sum + (Number(r.items) || 0), 0);
  const totalRemembering = rows.reduce((sum, r) => sum + (Number(r.remembering) || 0), 0);
  const totalUnderstanding = rows.reduce((sum, r) => sum + (Number(r.understanding) || 0), 0);
  const totalApplying = rows.reduce((sum, r) => sum + (Number(r.applying) || 0), 0);
  const totalAnalyzing = rows.reduce((sum, r) => sum + (Number(r.analyzing) || 0), 0);
  const totalEvaluating = rows.reduce((sum, r) => sum + (Number(r.evaluating) || 0), 0);
  const totalCreating = rows.reduce((sum, r) => sum + (Number(r.creating) || 0), 0);

  const handleAdd = () => setRows([...rows, { 
    id: Date.now(), competency: '', meetings: 0, items: 0, remembering: 0, understanding: 0, applying: 0, analyzing: 0, evaluating: 0, creating: 0, placement: '' 
  }]);
  
  const handleRemove = (id: number) => setRows(rows.filter(r => r.id !== id));

  const updateRow = (id: number, field: string, value: string | number) => {
    setRows(rows.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  return (
    <div className="space-y-4 py-2 animate-in slide-in-from-right-4 flex flex-col h-full">
      <div className="flex justify-between items-end shrink-0">
        <div>
          <h3 className="text-xl font-bold text-slate-800">Table of Specifications (TOS)</h3>
          <p className="text-slate-500 text-sm">Map your competencies, meetings, and items.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2 text-brand-600 border-brand-200 hover:bg-brand-50">
            <Search size={16} /> Look up past TOS
          </Button>
        </div>
      </div>

      <div className="border border-slate-200/60 rounded-2xl flex flex-col min-h-0 bg-white shadow-sm flex-1 overflow-hidden">
        <div className="overflow-x-auto overflow-y-auto flex-1">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-50 sticky top-0 z-10 text-xs uppercase tracking-wider font-semibold text-slate-500 shadow-sm">
              <tr className="border-b border-slate-200 text-center">
                <th className="p-2 border-r border-slate-200 align-middle w-[250px]" rowSpan={2}>Competency</th>
                <th className="p-2 border-r border-slate-200 align-middle w-20" rowSpan={2}>No. of<br/>Meetings</th>
                <th className="p-2 border-r border-slate-200 align-middle w-20" rowSpan={2}>Percentage<br/>%</th>
                <th className="p-2 border-r border-slate-200 align-middle w-16" rowSpan={2}>No. of<br/>Items</th>
                <th className="p-2 border-r border-slate-200" colSpan={2}>Easy (70%)</th>
                <th className="p-2 border-r border-slate-200" colSpan={2}>Average (20%)</th>
                <th className="p-2 border-r border-slate-200" colSpan={2}>Difficult (10%)</th>
                <th className="p-2 border-r border-slate-200 align-middle w-24" rowSpan={2}>Placement<br/>of Items</th>
                <th className="p-1 align-middle w-6 border-slate-200" rowSpan={2}></th>
              </tr>
              <tr className="border-b border-slate-200 text-[10px] text-brand-600 bg-white">
                <th className="p-1.5 border-r border-slate-200 font-medium text-center w-14">Remembering</th>
                <th className="p-1.5 border-r border-slate-200 font-medium text-center w-14">Understanding</th>
                <th className="p-1.5 border-r border-slate-200 font-medium text-center w-14">Applying</th>
                <th className="p-1.5 border-r border-slate-200 font-medium text-center w-14">Analyzing</th>
                <th className="p-1.5 border-r border-slate-200 font-medium text-center w-14">Evaluating</th>
                <th className="p-1.5 border-r border-slate-200 font-medium text-center w-14">Creating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((row) => {
                const percentage = totalMeetings > 0 ? Math.round((Number(row.meetings) / totalMeetings) * 100) : 0;
                return (
                  <tr key={row.id} className="hover:bg-slate-50/50 group transition-colors">
                    <td className="p-2 border-r border-slate-100 bg-white align-top">
                      <textarea 
                        value={row.competency}
                        onChange={(e) => updateRow(row.id, 'competency', e.target.value)}
                        className="w-full h-12 p-1 bg-transparent text-slate-800 text-sm outline-none focus:bg-slate-50 transition-colors resize-none rounded-sm"
                        placeholder="Enter competency..."
                      />
                    </td>
                    <td className="p-2 border-r border-slate-100 bg-white">
                      <input type="number" value={row.meetings || ''} onChange={(e) => updateRow(row.id, 'meetings', Number(e.target.value))} className="w-full h-9 text-center bg-transparent text-slate-800 outline-none hover:bg-slate-50 focus:bg-slate-50 transition-colors rounded-sm" min="0" />
                    </td>
                    <td className="p-2 border-r border-slate-100 bg-slate-50/30 text-center font-semibold text-brand-600">
                      {percentage}%
                    </td>
                    <td className="p-2 border-r border-slate-100 bg-white">
                      <input type="number" value={row.items || ''} onChange={(e) => updateRow(row.id, 'items', Number(e.target.value))} className="w-full h-9 text-center font-bold bg-transparent text-slate-800 outline-none hover:bg-slate-50 focus:bg-slate-50 transition-colors rounded-sm" min="0" />
                    </td>
                    
                    <td className="p-2 border-r border-slate-100 bg-white">
                      <input type="number" value={row.remembering || ''} onChange={(e) => updateRow(row.id, 'remembering', Number(e.target.value))} className="w-full h-9 text-center bg-transparent text-slate-600 outline-none hover:bg-slate-50 focus:bg-slate-50 transition-colors rounded-sm" min="0" />
                    </td>
                    <td className="p-2 border-r border-slate-100 bg-white">
                      <input type="number" value={row.understanding || ''} onChange={(e) => updateRow(row.id, 'understanding', Number(e.target.value))} className="w-full h-9 text-center bg-transparent text-slate-600 outline-none hover:bg-slate-50 focus:bg-slate-50 transition-colors rounded-sm" min="0" />
                    </td>
                    
                    <td className="p-2 border-r border-slate-100 bg-white">
                      <input type="number" value={row.applying || ''} onChange={(e) => updateRow(row.id, 'applying', Number(e.target.value))} className="w-full h-9 text-center bg-transparent text-slate-600 outline-none hover:bg-slate-50 focus:bg-slate-50 transition-colors rounded-sm" min="0" />
                    </td>
                    <td className="p-2 border-r border-slate-100 bg-white">
                      <input type="number" value={row.analyzing || ''} onChange={(e) => updateRow(row.id, 'analyzing', Number(e.target.value))} className="w-full h-9 text-center bg-transparent text-slate-600 outline-none hover:bg-slate-50 focus:bg-slate-50 transition-colors rounded-sm" min="0" />
                    </td>
                    
                    <td className="p-2 border-r border-slate-100 bg-white">
                      <input type="number" value={row.evaluating || ''} onChange={(e) => updateRow(row.id, 'evaluating', Number(e.target.value))} className="w-full h-9 text-center bg-transparent text-slate-600 outline-none hover:bg-slate-50 focus:bg-slate-50 transition-colors rounded-sm" min="0" />
                    </td>
                    <td className="p-2 border-r border-slate-100 bg-white">
                      <input type="number" value={row.creating || ''} onChange={(e) => updateRow(row.id, 'creating', Number(e.target.value))} className="w-full h-9 text-center bg-transparent text-slate-600 outline-none hover:bg-slate-50 focus:bg-slate-50 transition-colors rounded-sm" min="0" />
                    </td>

                    <td className="p-2 border-r border-slate-100 bg-white">
                      <input value={row.placement} onChange={(e) => updateRow(row.id, 'placement', e.target.value)} placeholder="e.g. 1-4" className="w-full h-9 text-center bg-transparent text-xs outline-none hover:bg-slate-50 focus:bg-slate-50 transition-colors rounded-sm" />
                    </td>
                    <td className="p-1 text-center align-middle bg-white w-6 flex-shrink-0">
                      <Button variant="ghost" onClick={() => handleRemove(row.id)} className="text-slate-300 hover:bg-red-50 hover:text-red-500 h-6 w-6 p-0 rounded-full transition-colors opacity-0 group-hover:opacity-100">
                        &times;
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="bg-slate-50 sticky bottom-0 z-10 font-bold text-sm shadow-[0_-1px_0_rgba(0,0,0,0.05)] border-t border-slate-200">
              <tr>
                <td className="p-3 border-r border-slate-200 text-center uppercase tracking-widest text-slate-700">Total</td>
                <td className="p-3 border-r border-slate-200 text-center text-brand-700">{totalMeetings}</td>
                <td className="p-3 border-r border-slate-200 text-center text-brand-700">100%</td>
                <td className="p-3 border-r border-slate-200 text-center text-brand-700">{totalItems}</td>
                <td className="p-3 border-r border-slate-200 text-center text-slate-600">{totalRemembering}</td>
                <td className="p-3 border-r border-slate-200 text-center text-slate-600">{totalUnderstanding}</td>
                <td className="p-3 border-r border-slate-200 text-center text-slate-600">{totalApplying}</td>
                <td className="p-3 border-r border-slate-200 text-center text-slate-600">{totalAnalyzing}</td>
                <td className="p-3 border-r border-slate-200 text-center text-slate-600">{totalEvaluating}</td>
                <td className="p-3 border-r border-slate-200 text-center text-slate-600">{totalCreating}</td>
                <td className="p-3 border-r border-slate-200"></td>
                <td className="p-1"></td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="p-2 shrink-0 border-t border-slate-200 bg-white">
          <Button variant="ghost" onClick={handleAdd} className="text-brand-600 font-semibold gap-2 w-full justify-start hover:bg-brand-50 text-sm h-8">
            + Add another competency
          </Button>
        </div>
      </div>
    </div>
  );
}
