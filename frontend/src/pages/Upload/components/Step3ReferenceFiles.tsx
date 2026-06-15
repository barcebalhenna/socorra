import { FileText, ListChecks } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Step3ReferenceFiles() {
  return (
    <div className="space-y-6 max-w-2xl mx-auto py-4 animate-in slide-in-from-right-4">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-slate-800">Upload Reference Materials</h3>
        <p className="text-slate-500 text-sm">Provide the question paper and the answer key so our system knows how to grade.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Question Paper Dropzone */}
        <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:border-brand-500 hover:bg-brand-50/50 transition-all cursor-pointer">
          <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-500">
            <FileText size={24} />
          </div>
          <h4 className="font-bold text-slate-700">Question Paper</h4>
          <p className="text-xs text-slate-500 mt-1 mb-4">PDF or Word Doc</p>
          <Button variant="secondary" size="sm">Browse Files</Button>
        </div>

        {/* Answer Key Dropzone */}
        <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:border-brand-500 hover:bg-brand-50/50 transition-all cursor-pointer">
          <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-500">
            <ListChecks size={24} />
          </div>
          <h4 className="font-bold text-slate-700">Answer Key</h4>
          <p className="text-xs text-slate-500 mt-1 mb-4">System will read to verify</p>
          <Button variant="secondary" size="sm">Browse Files</Button>
        </div>
      </div>
    </div>
  );
}
