import { useState, useMemo } from "react";
import {
  ACADEMIC_YEARS,
  SECTIONS,
  SUBJECTS,
  getGrades,
  getFinalAverage,
  getDescriptor,
  type StudentGrade,
} from "./data";
import {
  ChevronDown,
  Download,
  Search,
  Info,
  Users,
  TrendingUp,
  AlertTriangle,
  Award,
} from "lucide-react";

const QUARTERS = ["Q1", "Q2", "Q3", "Q4"] as const;
type Quarter = (typeof QUARTERS)[number];

const DESCRIPTOR_COLORS: Record<string, string> = {
  Outstanding: "text-[#166534] bg-[#dcfce7] border border-[#86efac]",
  "Very Satisfactory": "text-[#1e40af] bg-[#dbeafe] border border-[#93c5fd]",
  Satisfactory: "text-[#1a3d63] bg-[#e0f2fe] border border-[#7dd3fc]",
  "Fairly Satisfactory": "text-[#92400e] bg-[#fef3c7] border border-[#fcd34d]",
  "Did Not Meet Expectations":
    "text-[#991b1b] bg-[#fee2e2] border border-[#fca5a5]",
};

function GradeCell({ value }: { value: number | null }) {
  if (value === null)
    return <span className="text-[#9aa5b4] text-sm">—</span>;
  const desc = getDescriptor(value);
  const cls =
    value < 75
      ? "text-[#991b1b]"
      : value >= 90
      ? "text-[#166534]"
      : value >= 85
      ? "text-[#1e40af]"
      : "text-[#0a2540]";
  return (
    <span className={`text-sm tabular-nums ${cls}`} title={desc}>
      {value}
    </span>
  );
}

function AverageCell({ grade }: { grade: StudentGrade }) {
  const avg = getFinalAverage(grade);
  if (avg === null) return <span className="text-[#9aa5b4] text-sm">—</span>;
  const desc = getDescriptor(Math.round(avg));
  const colors = DESCRIPTOR_COLORS[desc] ?? "";
  return (
    <span
      className={`inline-flex items-center justify-center px-2 py-0.5 rounded-md text-xs tabular-nums ${colors}`}
      title={desc}
    >
      {avg.toFixed(1)}
    </span>
  );
}

function Select({
  value,
  onChange,
  options,
  placeholder,
  className = "",
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  className?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none bg-white border border-[#dde3ec] text-[#0a2540] text-sm rounded-lg px-3 py-2 pr-8 focus:outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20 transition-all w-full"
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown
        size={14}
        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#6b7a8d] pointer-events-none"
      />
    </div>
  );
}

function GradingSummary() {
  const [academicYear, setAcademicYear] = useState(ACADEMIC_YEARS[0]);
  const [sectionId, setSectionId] = useState(SECTIONS[0].id);
  const [subject, setSubject] = useState(SUBJECTS[0]);
  const [activeQuarter, setActiveQuarter] = useState<Quarter | "All">("All");
  const [search, setSearch] = useState("");

  const grades = useMemo(
    () => getGrades(sectionId, subject),
    [sectionId, subject]
  );
  const section = SECTIONS.find((s) => s.id === sectionId)!;

  const filtered = useMemo(() => {
    if (!search.trim()) return grades;
    const q = search.toLowerCase();
    return grades.filter(
      (g) => g.name.toLowerCase().includes(q) || g.lrn.includes(q)
    );
  }, [grades, search]);

  const quarterKey: Record<Quarter, keyof StudentGrade> = {
    Q1: "q1",
    Q2: "q2",
    Q3: "q3",
    Q4: "q4",
  };

  const showQ = (q: Quarter) => activeQuarter === "All" || activeQuarter === q;

  const classAvg = useMemo(() => {
    const avgs = filtered
      .map(getFinalAverage)
      .filter((v): v is number => v !== null);
    if (!avgs.length) return null;
    return (avgs.reduce((a, b) => a + b, 0) / avgs.length).toFixed(2);
  }, [filtered]);

  return (
    <div className="bg-white rounded-2xl border border-[#e8edf3] shadow-sm overflow-hidden">
      {/* Card Header */}
      <div className="px-6 pt-6 pb-5 border-b border-[#f0f4f9]">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h2
              className="text-[#0a2540]"
              style={{ fontSize: "1.05rem", fontWeight: 700 }}
            >
              Grading Summary
            </h2>
            <p className="text-[13px] text-[#6b7a8d] mt-0.5">
              Philippine DepEd K–12 Curriculum · Quarterly Grade Report
            </p>
          </div>
          <button className="flex items-center gap-2 text-sm text-[#2563eb] border border-[#2563eb]/30 bg-[#eff6ff] hover:bg-[#dbeafe] rounded-lg px-4 py-2 transition-colors self-start">
            <Download size={14} />
            Export SF9
          </button>
        </div>

        {/* Filters Row */}
        <div className="mt-5 flex flex-wrap gap-3">
          <Select
            value={academicYear}
            onChange={setAcademicYear}
            options={ACADEMIC_YEARS.map((y) => ({ value: y, label: y }))}
            className="w-44"
          />
          <Select
            value={sectionId}
            onChange={setSectionId}
            options={SECTIONS.map((s) => ({
              value: s.id,
              label: `${s.gradeLevel} – ${s.name}`,
            }))}
            className="w-52"
          />
          <Select
            value={subject}
            onChange={setSubject}
            options={SUBJECTS.map((s) => ({ value: s, label: s }))}
            className="w-48"
          />
          <div className="relative ml-auto">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9aa5b4]"
            />
            <input
              type="text"
              placeholder="Search student or LRN…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-3 py-2 text-sm bg-white border border-[#dde3ec] rounded-lg w-52 focus:outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20 transition-all"
            />
          </div>
        </div>

        {/* Context strip */}
        <div className="mt-4 flex items-center gap-4 text-[12px] text-[#6b7a8d] bg-[#f8fafc] rounded-lg px-4 py-2.5 border border-[#e8edf3]">
          <span>
            <strong className="text-[#0a2540]">School Year:</strong>{" "}
            {academicYear}
          </span>
          <span className="text-[#d1d9e0]">|</span>
          <span>
            <strong className="text-[#0a2540]">Section:</strong>{" "}
            {section.gradeLevel} – {section.name}
          </span>
          <span className="text-[#d1d9e0]">|</span>
          <span>
            <strong className="text-[#0a2540]">Subject:</strong> {subject}
          </span>
          <span className="text-[#d1d9e0]">|</span>
          <span>
            <strong className="text-[#0a2540]">Enrolled:</strong>{" "}
            {filtered.length} students
          </span>
          {classAvg && (
            <>
              <span className="text-[#d1d9e0]">|</span>
              <span>
                <strong className="text-[#0a2540]">Class Avg:</strong>{" "}
                {classAvg}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Quarter Tabs */}
      <div className="px-6 pt-4 flex items-center gap-1 border-b border-[#f0f4f9]">
        {(["All", ...QUARTERS] as const).map((q) => (
          <button
            key={q}
            onClick={() => setActiveQuarter(q as Quarter | "All")}
            className={`px-4 py-2.5 text-sm rounded-t-lg transition-all relative ${
              activeQuarter === q
                ? "text-[#2563eb] bg-[#eff6ff]"
                : "text-[#6b7a8d] hover:text-[#0a2540] hover:bg-[#f8fafc]"
            }`}
            style={{ fontWeight: activeQuarter === q ? 600 : 400 }}
          >
            {q === "All" ? "All Quarters" : `Quarter ${q.replace("Q", "")}`}
            {activeQuarter === q && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2563eb] rounded-t" />
            )}
          </button>
        ))}
        <div className="ml-auto pb-2 flex items-center gap-1.5 text-[12px] text-[#9aa5b4]">
          <Info size={12} />
          <span>DepEd Order No. 8 s. 2015</span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-[#f8fafc] border-b border-[#e8edf3]">
              <th
                className="text-left px-6 py-3 text-[11px] text-[#6b7a8d] uppercase tracking-wider whitespace-nowrap"
                style={{ fontWeight: 600 }}
              >
                #
              </th>
              <th
                className="text-left px-4 py-3 text-[11px] text-[#6b7a8d] uppercase tracking-wider whitespace-nowrap"
                style={{ fontWeight: 600 }}
              >
                Student Name
              </th>
              <th
                className="text-left px-4 py-3 text-[11px] text-[#6b7a8d] uppercase tracking-wider whitespace-nowrap"
                style={{ fontWeight: 600 }}
              >
                LRN
              </th>
              {QUARTERS.filter((q) => showQ(q)).map((q) => (
                <th
                  key={q}
                  className="text-center px-4 py-3 text-[11px] uppercase tracking-wider whitespace-nowrap"
                  style={{ fontWeight: 600 }}
                >
                  <span
                    className={`px-2.5 py-1 rounded-md ${
                      q === "Q1"
                        ? "text-[#1d4ed8] bg-[#dbeafe]"
                        : q === "Q2"
                        ? "text-[#065f46] bg-[#d1fae5]"
                        : q === "Q3"
                        ? "text-[#7c2d12] bg-[#ffedd5]"
                        : "text-[#581c87] bg-[#ede9fe]"
                    }`}
                  >
                    {q === "Q1"
                      ? "1st Quarter"
                      : q === "Q2"
                      ? "2nd Quarter"
                      : q === "Q3"
                      ? "3rd Quarter"
                      : "4th Quarter"}
                  </span>
                </th>
              ))}
              <th
                className="text-center px-4 py-3 text-[11px] text-[#6b7a8d] uppercase tracking-wider whitespace-nowrap"
                style={{ fontWeight: 600 }}
              >
                Final Average
              </th>
              <th
                className="text-left px-4 py-3 text-[11px] text-[#6b7a8d] uppercase tracking-wider whitespace-nowrap"
                style={{ fontWeight: 600 }}
              >
                Descriptor
              </th>
              <th
                className="text-center px-4 py-3 text-[11px] text-[#6b7a8d] uppercase tracking-wider whitespace-nowrap"
                style={{ fontWeight: 600 }}
              >
                Remarks
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f0f4f9]">
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={10}
                  className="text-center py-12 text-[#9aa5b4] text-sm"
                >
                  No students found.
                </td>
              </tr>
            ) : (
              filtered.map((grade, i) => {
                const avg = getFinalAverage(grade);
                const desc =
                  avg !== null ? getDescriptor(Math.round(avg)) : null;
                const passed = avg !== null && avg >= 75;
                return (
                  <tr
                    key={grade.id}
                    className="hover:bg-[#f8fafc] transition-colors group"
                  >
                    <td className="px-6 py-3.5 text-[#9aa5b4] text-xs tabular-nums">
                      {i + 1}
                    </td>
                    <td
                      className="px-4 py-3.5 text-[#0a2540] whitespace-nowrap"
                      style={{ fontWeight: 500 }}
                    >
                      {grade.name}
                    </td>
                    <td className="px-4 py-3.5 text-[#6b7a8d] text-xs tabular-nums whitespace-nowrap">
                      {grade.lrn}
                    </td>
                    {QUARTERS.filter((q) => showQ(q)).map((q) => (
                      <td key={q} className="px-4 py-3.5 text-center">
                        <GradeCell
                          value={grade[quarterKey[q]] as number | null}
                        />
                      </td>
                    ))}
                    <td className="px-4 py-3.5 text-center">
                      <AverageCell grade={grade} />
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      {desc ? (
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] ${
                            DESCRIPTOR_COLORS[desc] ?? ""
                          }`}
                        >
                          {desc}
                        </span>
                      ) : (
                        <span className="text-[#9aa5b4] text-xs">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      {avg !== null ? (
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] ${
                            passed
                              ? "bg-[#dcfce7] text-[#166534] border border-[#86efac]"
                              : "bg-[#fee2e2] text-[#991b1b] border border-[#fca5a5]"
                          }`}
                          style={{ fontWeight: 600 }}
                        >
                          {passed ? "PASSED" : "FAILED"}
                        </span>
                      ) : (
                        <span className="text-[#9aa5b4] text-xs">
                          Incomplete
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="px-6 py-4 border-t border-[#f0f4f9] bg-[#f8fafc]">
        <p
          className="text-[11px] text-[#9aa5b4] mb-2 uppercase tracking-wider"
          style={{ fontWeight: 600 }}
        >
          DepEd Grading Scale (DO No. 8, s. 2015)
        </p>
        <div className="flex flex-wrap gap-3">
          {[
            {
              label: "Outstanding",
              range: "90–100",
              colors: DESCRIPTOR_COLORS["Outstanding"],
            },
            {
              label: "Very Satisfactory",
              range: "85–89",
              colors: DESCRIPTOR_COLORS["Very Satisfactory"],
            },
            {
              label: "Satisfactory",
              range: "80–84",
              colors: DESCRIPTOR_COLORS["Satisfactory"],
            },
            {
              label: "Fairly Satisfactory",
              range: "75–79",
              colors: DESCRIPTOR_COLORS["Fairly Satisfactory"],
            },
            {
              label: "Did Not Meet Expectations",
              range: "Below 75",
              colors: DESCRIPTOR_COLORS["Did Not Meet Expectations"],
            },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-1.5">
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] ${item.colors}`}
              >
                {item.label}
              </span>
              <span className="text-[11px] text-[#9aa5b4]">({item.range})</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function GradingSummaryView() {
  const [academicYear] = useState(ACADEMIC_YEARS[0]);
  const [sectionId] = useState(SECTIONS[0].id);
  const [subject] = useState(SUBJECTS[0]);

  const grades = useMemo(
    () => getGrades(sectionId, subject),
    [sectionId, subject]
  );

  // Calculate metrics
  const totalStudents = grades.length;
  
  const classAvg = useMemo(() => {
    const avgs = grades
      .map(getFinalAverage)
      .filter((v): v is number => v !== null);
    if (!avgs.length) return 0;
    return avgs.reduce((a, b) => a + b, 0) / avgs.length;
  }, [grades]);

  const needsAttention = useMemo(() => {
    return grades.filter((g) => {
      const avg = getFinalAverage(g);
      return avg !== null && avg < 75;
    }).length;
  }, [grades]);

  const withHonors = useMemo(() => {
    return grades.filter((g) => {
      const avg = getFinalAverage(g);
      return avg !== null && avg >= 90;
    }).length;
  }, [grades]);

  const classDescriptor = getDescriptor(Math.round(classAvg));

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#0a2540]">
            Grading Summary
          </h1>
          <p className="text-[#6b7a8d] mt-2 text-base">
            Manage and view student grades per quarter following the DepEd K–12 grading framework.
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#eff6ff] border border-[#2563eb]/20 rounded-lg">
          <div className="w-2 h-2 bg-[#2563eb] rounded-full"></div>
          <span className="text-sm font-semibold text-[#2563eb]">
            {academicYear}
          </span>
          <span className="text-xs text-[#6b7a8d] ml-1">Active</span>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Students */}
        <div className="bg-white rounded-2xl border border-[#e8edf3] shadow-sm p-5 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-[13px] text-[#6b7a8d] font-medium mb-2">
                Total Students
              </p>
              <p
                className="text-[#0a2540] mb-1 tabular-nums"
                style={{ fontSize: "2rem", fontWeight: 700, lineHeight: 1 }}
              >
                {totalStudents}
              </p>
              <p className="text-[12px] text-[#9aa5b4]">Across 1 sections</p>
            </div>
            <div className="flex items-center justify-center w-12 h-12 bg-[#eff6ff] rounded-xl">
              <Users size={24} className="text-[#2563eb]" />
            </div>
          </div>
        </div>

        {/* Class Average */}
        <div className="bg-white rounded-2xl border border-[#e8edf3] shadow-sm p-5 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-[13px] text-[#6b7a8d] font-medium mb-2">
                Class Average
              </p>
              <p
                className="text-[#0a2540] mb-1 tabular-nums"
                style={{ fontSize: "2rem", fontWeight: 700, lineHeight: 1 }}
              >
                {classAvg.toFixed(1)}
              </p>
              <p className="text-[12px] text-[#166534] font-medium">
                {classDescriptor}
              </p>
            </div>
            <div className="flex items-center justify-center w-12 h-12 bg-[#dcfce7] rounded-xl">
              <TrendingUp size={24} className="text-[#166534]" />
            </div>
          </div>
        </div>

        {/* Needs Attention */}
        <div className="bg-white rounded-2xl border border-[#e8edf3] shadow-sm p-5 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-[13px] text-[#6b7a8d] font-medium mb-2">
                Needs Attention
              </p>
              <p
                className="text-[#0a2540] mb-1 tabular-nums"
                style={{ fontSize: "2rem", fontWeight: 700, lineHeight: 1 }}
              >
                {needsAttention}
              </p>
              <p className="text-[12px] text-[#92400e]">Grades below 75</p>
            </div>
            <div className="flex items-center justify-center w-12 h-12 bg-[#fef3c7] rounded-xl">
              <AlertTriangle size={24} className="text-[#92400e]" />
            </div>
          </div>
        </div>

        {/* With Honors */}
        <div className="bg-white rounded-2xl border border-[#e8edf3] shadow-sm p-5 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-[13px] text-[#6b7a8d] font-medium mb-2">
                With Honors
              </p>
              <p
                className="text-[#0a2540] mb-1 tabular-nums"
                style={{ fontSize: "2rem", fontWeight: 700, lineHeight: 1 }}
              >
                {withHonors}
              </p>
              <p className="text-[12px] text-[#581c87]">Average ≥ 90</p>
            </div>
            <div className="flex items-center justify-center w-12 h-12 bg-[#ede9fe] rounded-xl">
              <Award size={24} className="text-[#581c87]" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Grading Summary Component */}
      <GradingSummary />
    </div>
  );
}
