import { useState } from 'react';
import { Search, BookOpen, FileSpreadsheet, Upload, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useClasses } from '@/hooks/useClasses';

export default function ClassesView() {
  const [activeQuarter, setActiveQuarter] = useState('Q1');
  const [selectedSection, setSelectedSection] = useState('TLE 8 - CAPISTRANO');
  const { data: classData, isLoading } = useClasses(selectedSection);

  // Fallback in case there is no data at all
  if (isLoading || !classData) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-800">My Classes</h2>
          <p className="text-slate-500 mt-2 text-lg">Manage class rosters and export Written Work scores.</p>
        </div>
        <Button className="gap-2 shadow-sm h-10 px-5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white transition-colors">
          <Upload size={18} />
          Upload E-Class Record
        </Button>
      </div>

      {/* Toolbar / Filters */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto p-2 bg-white rounded-2xl border border-slate-200 shadow-sm">
          
          {/* Class Selector using Select UI */}
          <div className="flex items-center gap-2 pl-2">
            <BookOpen size={18} className="text-brand-600" />
            <Select 
              value={selectedSection} 
              onValueChange={setSelectedSection}
            >
              <SelectTrigger className="w-[200px] h-10 border-0 bg-transparent hover:bg-slate-50 rounded-xl focus:ring-0 focus:ring-offset-0 transition-colors font-medium">
                <SelectValue placeholder="Select Class" />
              </SelectTrigger>
              <SelectContent className="rounded-xl bg-white z-[100]">
                <SelectItem value="TLE 8 - CAPISTRANO" className="rounded-lg">TLE 8 - CAPISTRANO</SelectItem>
                <SelectItem value="MATH 10 - RIZAL" className="rounded-lg">MATH 10 - RIZAL</SelectItem>
                <SelectItem value="ENG 9 - CHRYSANTHEMUM" className="rounded-lg">ENG 9 - CHRYSANTHEMUM</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="hidden sm:block w-px h-6 bg-slate-200"></div>

          {/* Quarterly Tabs */}
          <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-100">
            {['Q1', 'Q2', 'Q3', 'Q4'].map((q) => (
              <button
                key={q}
                onClick={() => setActiveQuarter(q)}
                className={`px-4 py-1.5 text-sm font-semibold rounded-lg transition-all duration-200 border ${
                  activeQuarter === q 
                  ? 'bg-white text-brand-700 shadow-sm border-slate-200/50' 
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100 border-transparent'
                }`}
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Global Action & Search */}
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              type="text" 
              placeholder="Search student..." 
              className="pl-9 bg-white h-11 border-slate-200 rounded-xl shadow-sm focus-visible:ring-brand-600" 
            />
          </div>
          <Button variant="outline" className="gap-2 text-brand-700 border-brand-200 hover:bg-brand-50 h-11 rounded-xl shadow-sm bg-white">
            <FileSpreadsheet size={16} />
            Export
          </Button>
        </div>
      </div>

      {/* Main Roster Data Grid */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50 border-b border-slate-200">
              <TableRow className="hover:bg-slate-50">
                <TableHead className="w-[60px] text-center font-bold text-slate-500 h-16">No.</TableHead>
                <TableHead className="w-[300px] font-bold text-slate-700">LEARNERS' NAMES</TableHead>
                
                {/* Dynamic Assessment Columns */}
                <TableHead className="text-center min-w-[120px]">
                  <div className="flex flex-col items-center justify-center py-2">
                    <span className="font-bold text-slate-800">WW 1</span>
                    <span className="text-[10px] uppercase font-bold text-orange-600 bg-orange-100 px-2 py-0.5 rounded-md mt-1 border border-orange-200/50">Formative</span>
                  </div>
                </TableHead>
                <TableHead className="text-center min-w-[120px]">
                  <div className="flex flex-col items-center justify-center py-2">
                    <span className="font-bold text-slate-800">WW 2</span>
                    <span className="text-[10px] uppercase font-bold text-orange-600 bg-orange-100 px-2 py-0.5 rounded-md mt-1 border border-orange-200/50">Formative</span>
                  </div>
                </TableHead>
                <TableHead className="text-center min-w-[120px]">
                  <div className="flex flex-col items-center justify-center py-2">
                    <span className="font-bold text-slate-800">WW 3</span>
                    <span className="text-[10px] uppercase font-bold text-brand-600 bg-brand-100 px-2 py-0.5 rounded-md mt-1 border border-brand-100">Summative</span>
                  </div>
                </TableHead>
                <TableHead className="text-center min-w-[100px] border-l border-slate-200 font-extrabold text-slate-800 bg-slate-100/50">Total</TableHead>
                <TableHead className="text-center min-w-[100px] font-extrabold text-slate-800 bg-slate-100/50">PS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>

              {/* HIGHEST POSSIBLE SCORE */}
              <TableRow className="bg-slate-100/80 hover:bg-slate-100/80 border-b border-slate-200 shadow-inner">
                <TableCell colSpan={2} className="font-extrabold text-right text-slate-600 py-4">
                  HIGHEST POSSIBLE SCORE
                </TableCell>
                <TableCell className="text-center font-extrabold text-slate-800">{classData.highestPossibleScores.ww1}</TableCell>
                <TableCell className="text-center font-extrabold text-slate-800">{classData.highestPossibleScores.ww2}</TableCell>
                <TableCell className="text-center font-extrabold text-slate-800">{classData.highestPossibleScores.ww3}</TableCell>
                <TableCell className="text-center font-extrabold text-slate-900 border-l border-slate-200 bg-slate-200/50">
                  {classData.highestPossibleScores.ww1 + classData.highestPossibleScores.ww2 + classData.highestPossibleScores.ww3}
                </TableCell>
                <TableCell className="text-center font-extrabold text-slate-900 bg-slate-200/50">100.00</TableCell>
              </TableRow>
              
              {/* MALE GROUP HEADER */}
              <TableRow className="bg-brand-50/40 hover:bg-brand-50/40 border-y border-slate-100">
                <TableCell colSpan={7} className="font-bold text-brand-600 py-3 px-6 text-xs tracking-wider">
                  MALE
                </TableCell>
              </TableRow>
              
              {/* MALE STUDENTS */}
              {classData.males.map((student, idx) => (
                <TableRow key={`m-${student.id}`} className="hover:bg-slate-50 transition-colors border-b border-slate-100 group">
                  <TableCell className="text-center font-medium text-slate-400">{idx + 1}</TableCell>
                  <TableCell className="font-medium text-slate-700">{student.name}</TableCell>
                  {/* Scores */}
                  <TableCell className="text-center font-semibold text-slate-600 group-hover:text-brand-600 transition-colors">{student.ww1}</TableCell>
                  <TableCell className="text-center font-semibold text-slate-600 group-hover:text-brand-600 transition-colors">{student.ww2}</TableCell>
                  <TableCell className="text-center font-bold text-slate-800">{student.ww3}</TableCell>
                  <TableCell className="text-center font-bold border-l border-slate-100 bg-slate-50 group-hover:bg-brand-50/50 text-slate-800 transition-colors">
                    {student.ww1 + student.ww2 + student.ww3}
                  </TableCell>
                  <TableCell className="text-center font-bold bg-slate-50 group-hover:bg-brand-50/50 text-slate-800 transition-colors">
                    {((student.ww1 + student.ww2 + student.ww3) / (classData.highestPossibleScores.ww1 + classData.highestPossibleScores.ww2 + classData.highestPossibleScores.ww3) * 100).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}

              {/* FEMALE GROUP HEADER */}
              <TableRow className="bg-brand-50/40 hover:bg-brand-50/40 border-y border-slate-100">
                <TableCell colSpan={7} className="font-bold text-brand-600 py-3 px-6 text-xs tracking-wider mt-4">
                  FEMALE
                </TableCell>
              </TableRow>
              
              {/* FEMALE STUDENTS */}
              {classData.females.map((student, idx) => (
                <TableRow key={`f-${student.id}`} className="hover:bg-slate-50 transition-colors border-b border-slate-100 group">
                  <TableCell className="text-center font-medium text-slate-400">{idx + 1}</TableCell>
                  <TableCell className="font-medium text-slate-700">{student.name}</TableCell>
                  {/* Scores */}
                  <TableCell className="text-center font-semibold text-slate-600 group-hover:text-brand-600 transition-colors">{student.ww1}</TableCell>
                  <TableCell className="text-center font-semibold text-slate-600 group-hover:text-brand-600 transition-colors">{student.ww2}</TableCell>
                  <TableCell className="text-center font-bold text-slate-800">{student.ww3}</TableCell>
                  <TableCell className="text-center font-bold border-l border-slate-100 bg-slate-50 group-hover:bg-brand-50/50 text-slate-800 transition-colors">
                    {student.ww1 + student.ww2 + student.ww3}
                  </TableCell>
                  <TableCell className="text-center font-bold bg-slate-50 group-hover:bg-brand-50/50 text-slate-800 transition-colors">
                    {((student.ww1 + student.ww2 + student.ww3) / (classData.highestPossibleScores.ww1 + classData.highestPossibleScores.ww2 + classData.highestPossibleScores.ww3) * 100).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
              
            </TableBody>
          </Table>
        </div>
      </div>
      
      <div className="text-center pt-2">
        <p className="text-sm font-medium text-slate-500 bg-slate-100 inline-block px-4 py-1.5 rounded-full border border-slate-200">
          Showing {classData.males.length + classData.females.length} learners correctly mapped from E-Class Record.
        </p>
      </div>

    </div>
  );
}
