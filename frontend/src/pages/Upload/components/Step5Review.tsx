import { useMemo, useRef, useState } from 'react';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

type ReviewStatus = 'needs_review' | 'ok';

type ReviewStudent = {
  id: string;
  name: string;
  confidence: number;
  score: string;
  status: ReviewStatus;
};

const REVIEW_STUDENTS: ReviewStudent[] = [
  { id: '2023001', name: 'Amarillo, Marion Reed C.', confidence: 75, score: '11/15', status: 'needs_review' },
  { id: '2023002', name: 'Alvarez, Ronan L.', confidence: 98, score: '12/15', status: 'ok' },
  { id: '2023003', name: 'Apolinario, Czech Yuki R.', confidence: 82, score: '10/15', status: 'needs_review' },
  { id: '2023004', name: 'Burgos, Yuna Angelica D.', confidence: 96, score: '14/15', status: 'ok' },
  { id: '2023005', name: 'Calisto, Reign Solaria V.', confidence: 91, score: '13/15', status: 'ok' },
];

const STATUS_STYLES: Record<ReviewStatus, { label: string; className: string; Icon: typeof AlertTriangle }> = {
  needs_review: {
    label: 'Needs Review',
    className: 'text-insight-review bg-amber-100 border-amber-200',
    Icon: AlertTriangle,
  },
  ok: {
    label: 'OK',
    className: 'text-green-700 bg-green-100 border-green-200',
    Icon: CheckCircle2,
  },
};

const getConfidenceStyles = (confidence: number) => {
  if (confidence < 85) {
    return 'text-amber-700 bg-amber-50';
  }

  return 'text-green-700 bg-green-50';
};

export default function Step5Review() {
  const [reviewingStudent, setReviewingStudent] = useState<string | null>(null);
  const [reviewFilter, setReviewFilter] = useState<'all' | 'flagged'>('all');
  const [splitPercent, setSplitPercent] = useState(55);
  const splitContainerRef = useRef<HTMLDivElement | null>(null);

  const flaggedCount = useMemo(
    () => REVIEW_STUDENTS.filter((student) => student.status === 'needs_review').length,
    []
  );

  const filteredStudents = useMemo(() => {
    if (reviewFilter === 'flagged') {
      return REVIEW_STUDENTS.filter((student) => student.status === 'needs_review');
    }

    return REVIEW_STUDENTS;
  }, [reviewFilter]);

  if (reviewingStudent) {
    const statusConfig = STATUS_STYLES.needs_review;
    const StatusIcon = statusConfig.Icon;

    const handleResizeStart = (event: React.PointerEvent<HTMLDivElement>) => {
      if (!splitContainerRef.current) {
        return;
      }

      event.preventDefault();

      const container = splitContainerRef.current;
      const rect = container.getBoundingClientRect();

      const handlePointerMove = (moveEvent: PointerEvent) => {
        const nextPercent = ((moveEvent.clientX - rect.left) / rect.width) * 100;
        const clamped = Math.min(70, Math.max(30, nextPercent));
        setSplitPercent(clamped);
      };

      const handlePointerUp = () => {
        window.removeEventListener('pointermove', handlePointerMove);
        window.removeEventListener('pointerup', handlePointerUp);
      };

      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
    };

    return (
      <div className="fixed inset-0 z-50 flex flex-col h-screen animate-in fade-in bg-slate-50">
        {/* Header toolbar for individual review */}
        <div className="h-14 border-b border-slate-200 bg-white px-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => setReviewingStudent(null)} className="text-slate-500 hover:text-slate-800">
              &larr; Back to List
            </Button>
            <div className="h-4 w-px bg-slate-200" />
            <span className="font-semibold text-slate-800">{reviewingStudent}</span>
            <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded font-medium border ${statusConfig.className}`}>
              <StatusIcon size={14} /> {statusConfig.label}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">Previous Paper</Button>
            <Button size="sm">Next Paper</Button>
          </div>
        </div>

        {/* Dual pane layout */}
        <div ref={splitContainerRef} className="flex flex-1 min-h-0 overflow-hidden">
          {/* Left panel: Document Viewer (Image) */}
          <div
            className="bg-slate-200/50 flex flex-col items-center justify-center p-4 overflow-y-auto relative min-w-0"
            style={{ width: `${splitPercent}%` }}
          >
            <div className="absolute top-4 right-4 flex gap-2">
              <Button size="sm" variant="secondary" className="bg-white/90 shadow-sm">&oplus; Zoom In</Button>
              <Button size="sm" variant="secondary" className="bg-white/90 shadow-sm">&ominus; Zoom Out</Button>
            </div>
            {/* Placeholder for the scanned paper */}
            <div className="bg-white shadow-md border border-slate-200 w-full max-w-[500px] aspect-[1/1.4] rounded items-center justify-center flex text-slate-400">
              [ Scanned Exam Image Appears Here ]
            </div>
          </div>

          <div
            role="separator"
            aria-label="Resize panels"
            className="w-2 bg-slate-200 hover:bg-slate-300 cursor-col-resize transition-colors"
            onPointerDown={handleResizeStart}
          />

          {/* Right panel: Editor / Review Form */}
          <div
            className="bg-white flex flex-col min-h-0 min-w-0"
            style={{ width: `${100 - splitPercent}%` }}
          >
            <div className="p-4 border-b border-slate-100 shrink-0">
              <h4 className="font-bold text-slate-800">AI Extraction Review</h4>
              <p className="text-sm text-slate-500">Correct the fields below if the AI misread handwriting.</p>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div className="space-y-4">
                 {/* Dummy inputs to show editing state */}
                 <div className="border border-slate-200 rounded-lg p-3 bg-slate-50">
                    <label className="text-xs font-semibold text-slate-500 uppercase">Recognized Name</label>
                    <input type="text" defaultValue={reviewingStudent} className="w-full mt-1 border border-amber-300 bg-amber-50 focus:bg-white p-2 rounded text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500" />
                    <p className="text-xs text-amber-600 mt-1 font-medium">Confidence: 75% - Check spelling</p>
                 </div>

                 <div className="border border-slate-200 rounded-lg p-3">
                    <label className="text-xs font-semibold text-slate-500 uppercase">Item 1 Answer</label>
                    <input type="text" defaultValue="A" className="w-full mt-1 border border-slate-200 p-2 rounded text-sm outline-none focus:border-brand-500" />
                    <p className="text-xs text-green-600 mt-1 font-medium">Confidence: 99%</p>
                 </div>

                 <div className="border border-slate-200 rounded-lg p-3 bg-slate-50">
                    <label className="text-xs font-semibold text-slate-500 uppercase">Item 2 Answer</label>
                    <input type="text" defaultValue="C" className="w-full mt-1 border border-amber-300 bg-amber-50 focus:bg-white p-2 rounded text-sm outline-none focus:border-brand-500" />
                    <p className="text-xs text-amber-600 mt-1 font-medium">Confidence: 62% - Low confidence</p>
                 </div>
              </div>
            </div>
            
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3 shrink-0">
               <Button variant="outline">Reject Scan</Button>
               <Button>Approve & Save</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 py-2 animate-in slide-in-from-right-4">
      <div className="mb-2 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h3 className="text-xl font-bold text-slate-800">Review & Validate</h3>
          <p className="text-slate-500 text-sm">Double check papers that need manual review before finalizing.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-amber-100 text-amber-800 px-3 py-1.5 rounded-lg text-sm font-semibold border border-amber-200">
            {flaggedCount} Papers require manual review
          </div>
          <div className="inline-flex items-center gap-2 rounded-lg bg-slate-100 p-1 text-sm">
            <button
              type="button"
              onClick={() => setReviewFilter('all')}
              className={`px-3 py-1 rounded-md font-semibold transition-colors ${
                reviewFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              All Students ({REVIEW_STUDENTS.length})
            </button>
            <button
              type="button"
              onClick={() => setReviewFilter('flagged')}
              className={`px-3 py-1 rounded-md font-semibold transition-colors ${
                reviewFilter === 'flagged'
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Flagged ({flaggedCount})
            </button>
          </div>
        </div>
      </div>

      <div className="border border-slate-200 rounded-lg overflow-hidden bg-white max-h-[300px] overflow-y-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 sticky top-0">
            <tr>
              <th className="p-3">Student Name (Detected)</th>
              <th className="p-3 text-left pr-10">Confidence</th>
              <th className="p-3 text-left pr-10">Score</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredStudents.map((student) => {
              const statusConfig = STATUS_STYLES[student.status];
              const StatusIcon = statusConfig.Icon;

              return (
                <tr key={student.id} className="hover:bg-slate-50/50">
                  <td className="p-3 font-medium text-slate-900">{student.name}</td>
                  <td className="p-3 text-left pr-10">
                    <span className={`font-bold px-2 py-1 rounded ${getConfidenceStyles(student.confidence)}`}>
                      {student.confidence}%
                    </span>
                  </td>
                  <td className="p-3 text-left pr-10 font-bold text-lg">{student.score}</td>
                  <td className="p-3 text-left">
                    <span className={`inline-flex items-center gap-1 font-semibold px-3 py-1 rounded-full text-xs uppercase border ${statusConfig.className}`}>
                      <StatusIcon size={14} /> {statusConfig.label}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setReviewingStudent(student.name)}
                      className="border-slate-300"
                    >
                      Review
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
