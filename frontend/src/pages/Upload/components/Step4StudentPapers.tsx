import { UploadCloud } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Step4StudentPapers() {
  return (
    <div className="space-y-6 max-w-2xl mx-auto py-4 animate-in slide-in-from-right-4">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-slate-800">Upload Student Answer Sheets</h3>
        <p className="text-slate-500 text-sm">Upload bulk PDF scans or images of your students' work.</p>
      </div>

      <div className="border-2 border-dashed border-brand-300 rounded-2xl p-8 flex flex-col items-center justify-center text-center bg-brand-50/30 hover:bg-brand-50 hover:shadow-[0_0_15px_0_var(--color-brand-500)] transition-all duration-200 cursor-pointer">
        <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center mb-4 text-brand-600">
          <UploadCloud size={32} />
        </div>
        <h4 className="text-lg font-bold text-brand-900">Drag & Drop Student Papers Here</h4>
        <p className="text-sm text-slate-500 mt-2 mb-6">Supports bulk JPG, PNG, and PDF files.</p>
        <Button className="px-8 shadow-sm">Select Files from Computer</Button>
      </div>
      
      {/* Pretend file list */}
      <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/60 shadow-sm">
        <p className="text-sm font-semibold text-slate-600 mb-2">0 files selected</p>
        <div className="text-center py-4 text-slate-400 text-sm">
          Awaiting files to begin grading process.
        </div>
      </div>
    </div>
  );
}
