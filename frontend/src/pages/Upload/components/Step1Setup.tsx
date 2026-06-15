import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function Step1Setup() {
  return (
    <div className="space-y-6 max-w-xl mx-auto py-4 animate-in slide-in-from-right-4">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-slate-800">Assessment Details</h3>
        <p className="text-slate-500 text-sm">Let's start by identifying what class and assessment this is for.</p>
      </div>

      <div className="space-y-4 text-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-slate-700">Select Class target</Label>
            <select className="w-full h-10 px-3 rounded-md border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all">
              <option value="">-- Choose a class --</option>
              <option value="TLE">TLE 8 - CAPISTRANO</option>
              <option value="MATH">MATH 10 - RIZAL</option>
              <option value="ENG">ENG 9 - CHRYSANTHEMUM</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label className="text-slate-700">Quarter</Label>
            <select className="w-full h-10 px-3 rounded-md border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all">
              <option value="">-- Select quarter --</option>
              <option value="Q1">Quarter 1</option>
              <option value="Q2">Quarter 2</option>
              <option value="Q3">Quarter 3</option>
              <option value="Q4">Quarter 4</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-slate-700">Assessment Title</Label>
          <Input placeholder="e.g., First Quarter Long Quiz 1" className="bg-slate-50 h-10" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-slate-700">Assessment Type</Label>
            <select className="w-full h-10 px-3 rounded-md border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all">
              <option value="formative">Formative Assessment</option>
              <option value="summative">Summative Assessment</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label className="text-slate-700">Total Items / Highest Possible Score</Label>
            <Input type="number" placeholder="5 - 50 only" className="bg-slate-50 h-10" min="5" max="50" />
          </div>
        </div>
      </div>
    </div>
  );
}
