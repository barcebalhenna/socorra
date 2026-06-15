import { useState } from 'react';
import { 
  BookOpen, 
  CheckCircle2, 
  ListChecks, 
  FileText, 
  UploadCloud, 
  ArrowRight,
  ChevronLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

import Step1Setup from './components/Step1Setup';
import Step2Competencies from './components/Step2Competencies';
import Step3ReferenceFiles from './components/Step3ReferenceFiles';
import Step4StudentPapers from './components/Step4StudentPapers';
import Step5Review from './components/Step5Review';

// The steps of our Upload & Grading process
const STEPS = [
  { id: 1, title: 'Setup Detail', icon: BookOpen, desc: 'Class & Assessment Name' },
  { id: 2, title: 'Competencies', icon: ListChecks, desc: 'Map TOS & Items' },
  { id: 3, title: 'Reference Files', icon: FileText, desc: 'Question & Answer Key' },
  { id: 4, title: 'Student Papers', icon: UploadCloud, desc: 'Upload Scans' },
  { id: 5, title: 'Review', icon: CheckCircle2, desc: 'Validate & Finalize' }
];

export default function UploadView() {
  const [currentStep, setCurrentStep] = useState(1);

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  return (
    <div className="flex flex-col h-full space-y-4 animate-in fade-in duration-500 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight text-brand-600">Check Papers</h2>
        <p className="text-slate-500 mt-1 text-sm">Set up your assessment, upload papers, and let the system grade them.</p>
      </div>

      {/* Stepper Progress Bar */}
      <div className="bg-surface p-3 md:p-4 rounded-2xl border border-slate-200 shadow-sm overflow-x-auto shrink-0">
        <div className="flex justify-between items-center min-w-[700px]">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;

            return (
              <div key={step.id} className="flex items-center">
                <div className={`flex flex-col items-center gap-2 ${isActive || isCompleted ? 'text-brand-600' : 'text-slate-400'}`}>
                  <div className={`
                    w-12 h-12 rounded-full flex items-center justify-center border-2 transition-colors duration-300
                    ${isActive ? 'bg-brand-50 border-brand-500 shadow-sm' : ''}
                    ${isCompleted ? 'bg-brand-500 border-brand-500 text-white' : ''}
                    ${!isActive && !isCompleted ? 'bg-slate-50 border-slate-200' : ''}
                  `}>
                    {isCompleted ? <CheckCircle2 size={24} /> : <Icon size={24} />}
                  </div>
                  <div className="text-center">
                    <p className={`text-sm font-bold ${isActive ? 'text-slate-900' : ''}`}>{step.title}</p>
                    <p className="text-xs text-slate-500">{step.desc}</p>
                  </div>
                </div>
                {/* Connector Line */}
                {index < STEPS.length - 1 && (
                  <div className={`w-16 md:w-24 h-1 mx-4 rounded-full ${isCompleted ? 'bg-brand-500' : 'bg-slate-200'}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Dynamic Content Area based on Step */}
      <Card className={`flex-1 flex flex-col border-slate-200 shadow-sm bg-surface p-4 md:p-6 ${(currentStep === 2 || currentStep === 5) ? 'overflow-hidden' : 'overflow-auto'}`}>
        {currentStep === 1 && <Step1Setup />}
        {currentStep === 2 && <Step2Competencies />}
        {currentStep === 3 && <Step3ReferenceFiles />}
        {currentStep === 4 && <Step4StudentPapers />}
        {currentStep === 5 && <Step5Review />}
      </Card>

      {/* Navigation Footer */}
      <div className="flex justify-between items-center pt-2 shrink-0">
        <Button 
          variant="outline" 
          onClick={prevStep} 
          disabled={currentStep === 1}
          className="gap-2"
        >
          <ChevronLeft size={16} /> Back
        </Button>
        <Button 
          onClick={nextStep}
          className="gap-2 px-8"
        >
          {currentStep === STEPS.length ? 'Finalize & Save' : 'Continue'} 
          {currentStep !== STEPS.length && <ArrowRight size={16} />}
        </Button>
      </div>
    </div>
  );
}

// ==========================================
// SUB-COMPONENTS EXTRACTED TO SEPARATE FILES
// ==========================================

