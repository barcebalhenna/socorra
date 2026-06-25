import { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from "recharts";
import {
  subjectMPSData,
  quarterlyTrendData,
  sectionMPSData,
  leastLearnedData,
  analyticsKPIs,
  ACADEMIC_YEARS,
  type LeastLearned,
} from "./analytics-data";
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  Download,
  ChevronDown,
  Search,
  Target,
  BookOpen,
  Activity,
  Users,
  ChevronRight,
  Minus,
} from "lucide-react";

// ─── Colour tokens ────────────────────────────────────────────────────────────
const CHART_COLORS = {
  "Rizal (Gr. 7)": "#2563eb",
  "Bonifacio (Gr. 8)": "#7c3aed",
  "Mabini (Gr. 9)": "#059669",
  Filipino: "#2563eb",
  English: "#7c3aed",
  Mathematics: "#dc2626",
  Science: "#059669",
  "Araling Panlipunan": "#d97706",
  MAPEH: "#0891b2",
  "TLE / EPP": "#65a30d",
  "Values Education": "#db2777",
} as const;

// ─── Helpers ──────────────────────────────────────────────────────────────────
function mpsColor(mps: number) {
  if (mps >= 75) return "#059669";
  if (mps >= 65) return "#d97706";
  return "#dc2626";
}

function mpsBarColor(mps: number) {
  if (mps >= 75) return "#34d399";
  if (mps >= 65) return "#fbbf24";
  return "#f87171";
}

function Select({
  value,
  onChange,
  options,
  className = "",
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  className?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none bg-white border border-[#dde3ec] text-[#0a2540] text-sm rounded-lg px-3 py-2 pr-8 focus:outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20 transition-all w-full"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown
        size={13}
        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#6b7a8d] pointer-events-none"
      />
    </div>
  );
}

// ─── KPI Card ─────────────────────────────────────────────────────────────────
interface KPICardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub: string;
  delta?: number;
  iconBg: string;
  iconColor: string;
  alert?: boolean;
}

function KPICard({ icon, label, value, sub, delta, iconBg, iconColor, alert }: KPICardProps) {
  return (
    <div
      className={`bg-white rounded-xl border p-5 flex items-start gap-4 ${
        alert ? "border-[#fca5a5]" : "border-[#e8edf3]"
      }`}
    >
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
        <span className={iconColor}>{icon}</span>
      </div>
      <div className="min-w-0">
        <p className="text-[13px] text-[#6b7a8d]">{label}</p>
        <div className="flex items-end gap-2 mt-0.5">
          <span
            className="text-[#0a2540]"
            style={{ fontSize: "1.5rem", fontWeight: 700, lineHeight: 1.1 }}
          >
            {value}
          </span>
          {delta !== undefined && (
            <span
              className={`text-[12px] mb-0.5 flex items-center gap-0.5 ${
                delta > 0
                  ? "text-[#059669]"
                  : delta < 0
                  ? "text-[#dc2626]"
                  : "text-[#9aa5b4]"
              }`}
            >
              {delta > 0 ? (
                <TrendingUp size={12} />
              ) : delta < 0 ? (
                <TrendingDown size={12} />
              ) : (
                <Minus size={12} />
              )}
              {delta > 0 ? "+" : ""}
              {delta}%
            </span>
          )}
        </div>
        <p className="text-[12px] text-[#9aa5b4] mt-0.5">{sub}</p>
      </div>
    </div>
  );
}

// ─── Custom tooltip ───────────────────────────────────────────────────────────
function MPSTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const mps: number = payload[0]?.value;
  return (
    <div className="bg-white border border-[#e8edf3] rounded-xl shadow-lg px-4 py-3 text-sm min-w-[160px]">
      <p className="text-[#6b7a8d] text-[11px] mb-1.5 uppercase tracking-wide">{label}</p>
      <p className="text-[#0a2540]" style={{ fontWeight: 700, fontSize: "1.1rem" }}>
        {mps?.toFixed(1)}%
        <span className="ml-2 text-xs" style={{ color: mpsColor(mps), fontWeight: 500 }}>
          {mps >= 75 ? "✓ Above Target" : "✗ Below Target"}
        </span>
      </p>
      {payload[1] && (
        <p className="text-[#9aa5b4] text-[12px] mt-1">Target: {payload[1]?.value}%</p>
      )}
    </div>
  );
}

function TrendTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-[#e8edf3] rounded-xl shadow-lg px-4 py-3 text-sm min-w-[200px]">
      <p className="text-[#0a2540] mb-2" style={{ fontWeight: 600 }}>
        {label}
      </p>
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center justify-between gap-4 py-0.5">
          <span className="flex items-center gap-1.5 text-[12px] text-[#6b7a8d]">
            <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
            {p.name}
          </span>
          <span
            className="text-[#0a2540] tabular-nums"
            style={{ fontWeight: 600, fontSize: "12px" }}
          >
            {p.value?.toFixed(1)}%
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Intervention badge ───────────────────────────────────────────────────────
function InterventionBadge({ status }: { status: LeastLearned["interventionStatus"] }) {
  const map = {
    Pending: {
      cls: "bg-[#fef3c7] text-[#92400e] border-[#fcd34d]",
      icon: <Clock size={11} />,
    },
    "In Progress": {
      cls: "bg-[#dbeafe] text-[#1e40af] border-[#93c5fd]",
      icon: <Activity size={11} />,
    },
    Resolved: {
      cls: "bg-[#dcfce7] text-[#166534] border-[#86efac]",
      icon: <CheckCircle size={11} />,
    },
  };
  const { cls, icon } = map[status];
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[11px] ${cls}`}
      style={{ fontWeight: 500 }}
    >
      {icon}
      {status}
    </span>
  );
}

// ─── Struggle bar ─────────────────────────────────────────────────────────────
function StruggleMeter({ pct }: { pct: number }) {
  const color = pct >= 65 ? "#dc2626" : pct >= 50 ? "#d97706" : "#16a34a";
  return (
    <div className="flex items-center gap-2.5 min-w-[120px]">
      <div className="flex-1 h-1.5 rounded-full bg-[#f0f4f9] overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span
        className="tabular-nums text-sm shrink-0"
        style={{ color, fontWeight: 600, minWidth: 38 }}
      >
        {pct.toFixed(1)}%
      </span>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
const TREND_SUBJECTS = ["Mathematics", "English", "Science", "Filipino"] as const;

export default function QuarterOverview() {
  const [academicYear, setAcademicYear] = useState(ACADEMIC_YEARS[0]);
  const [llcSearch, setLlcSearch] = useState("");
  const [llcSubject, setLlcSubject] = useState("All");
  const [llcSection, setLlcSection] = useState("All");
  const [llcStatus, setLlcStatus] = useState("All");
  const [chartView, setChartView] = useState<"subject" | "section">("subject");

  const filteredLLC = useMemo(() => {
    return leastLearnedData.filter((r) => {
      if (llcSubject !== "All" && r.subject !== llcSubject) return false;
      if (llcSection !== "All" && r.section !== llcSection) return false;
      if (llcStatus !== "All" && r.interventionStatus !== llcStatus) return false;
      if (llcSearch.trim()) {
        const q = llcSearch.toLowerCase();
        if (
          !r.competency.toLowerCase().includes(q) &&
          !r.melcCode.toLowerCase().includes(q)
        )
          return false;
      }
      return true;
    });
  }, [llcSearch, llcSubject, llcSection, llcStatus]);

  const subjectBarData = subjectMPSData.map((d) => ({
    subject: d.subject.length > 14 ? d.subject.slice(0, 13) + "…" : d.subject,
    fullSubject: d.subject,
    MPS: d.mps,
    Target: d.target,
    fill: mpsBarColor(d.mps),
  }));

  const sectionBarData = sectionMPSData.map((d) => ({
    subject: d.subject.length > 14 ? d.subject.slice(0, 13) + "…" : d.subject,
    "Rizal (Gr. 7)": d["Rizal (Gr. 7)"],
    "Bonifacio (Gr. 8)": d["Bonifacio (Gr. 8)"],
    "Mabini (Gr. 9)": d["Mabini (Gr. 9)"],
  }));

  return (
    <div className="flex-1 space-y-7 w-full">
      {/* Page header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 text-[13px] text-[#9aa5b4] mb-1.5">
            <span>Dashboard</span>
            <ChevronRight size={13} />
            <span className="text-[#0a2540]" style={{ fontWeight: 500 }}>
              Analytics & Reports
            </span>
          </div>
          <h1 className="text-[#0a2540]" style={{ fontSize: "1.35rem", fontWeight: 700 }}>
            Analytics & Reports
          </h1>
          <p className="text-sm text-[#6b7a8d] mt-1">
            MPS tracking and Least Learned Competencies — DepEd K–12 academic monitoring.
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <Select
            value={academicYear}
            onChange={setAcademicYear}
            options={ACADEMIC_YEARS.map((y) => ({ value: y, label: y }))}
            className="w-44"
          />
          <button className="flex items-center gap-2 text-sm text-[#2563eb] border border-[#2563eb]/30 bg-[#eff6ff] hover:bg-[#dbeafe] rounded-lg px-4 py-2 transition-colors">
            <Download size={14} />
            Export Report
          </button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          icon={<Target size={20} />}
          label="Overall MPS"
          value={`${analyticsKPIs.overallMPS}%`}
          sub={`Target: ${analyticsKPIs.overallMPSTarget}%`}
          delta={analyticsKPIs.overallMPSDelta}
          iconBg="bg-blue-50"
          iconColor="text-[#2563eb]"
        />
        <KPICard
          icon={<BookOpen size={20} />}
          label="Below-Target Subjects"
          value={analyticsKPIs.belowTargetSubjects}
          sub="Require intervention"
          iconBg="bg-red-50"
          iconColor="text-[#dc2626]"
          alert
        />
        <KPICard
          icon={<AlertTriangle size={20} />}
          label="Critical Competencies"
          value={analyticsKPIs.criticalCompetencies}
          sub="> 50% students struggling"
          iconBg="bg-amber-50"
          iconColor="text-[#d97706]"
          alert
        />
        <KPICard
          icon={<Users size={20} />}
          label="Students at Risk"
          value={analyticsKPIs.studentsAtRisk}
          sub="Average grade < 75"
          iconBg="bg-violet-50"
          iconColor="text-[#7c3aed]"
        />
      </div>

      {/* ── MPS Charts ─────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-[#e8edf3] shadow-sm overflow-hidden">
        <div className="px-6 pt-6 pb-4 border-b border-[#f0f4f9] flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-[#0a2540]" style={{ fontSize: "1rem", fontWeight: 700 }}>
              Mean Percentage Scores (MPS)
            </h2>
            <p className="text-[13px] text-[#6b7a8d] mt-0.5">
              Measures the proportion of items correctly answered across all assessments.
            </p>
          </div>
          <div className="flex items-center gap-1 bg-[#f4f7fb] rounded-lg p-1">
            {(["subject", "section"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setChartView(v)}
                className={`px-3.5 py-1.5 rounded-md text-sm transition-all ${
                  chartView === v
                    ? "bg-white text-[#0a2540] shadow-sm border border-[#e8edf3]"
                    : "text-[#6b7a8d] hover:text-[#0a2540]"
                }`}
                style={{ fontWeight: chartView === v ? 600 : 400 }}
              >
                By {v.charAt(0).toUpperCase() + v.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-5 divide-y xl:divide-y-0 xl:divide-x divide-[#f0f4f9]">
          {/* Bar Chart */}
          <div className="xl:col-span-3 p-6">
            <p
              className="text-[12px] text-[#9aa5b4] uppercase tracking-wider mb-4"
              style={{ fontWeight: 600 }}
            >
              {chartView === "subject"
                ? "MPS per Subject — All Sections"
                : "MPS per Subject — By Section"}
            </p>
            <ResponsiveContainer width="100%" height={280}>
              {chartView === "subject" ? (
                <BarChart
                  data={subjectBarData}
                  margin={{ top: 4, right: 8, left: -10, bottom: 4 }}
                  barSize={22}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f4f9" vertical={false} />
                  <XAxis
                    dataKey="subject"
                    tick={{ fill: "#6b7a8d", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    domain={[50, 100]}
                    tick={{ fill: "#6b7a8d", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip content={<MPSTooltip />} cursor={{ fill: "#f4f7fb" }} />
                  <ReferenceLine
                    y={75}
                    stroke="#dc2626"
                    strokeDasharray="4 3"
                    strokeWidth={1.5}
                    label={{
                      value: "Target 75%",
                      position: "insideTopRight",
                      fill: "#dc2626",
                      fontSize: 11,
                    }}
                  />
                  <Bar
                    dataKey="MPS"
                    radius={[5, 5, 0, 0]}
                    label={{
                      position: "top",
                      formatter: (v: any) => `${Number(v).toFixed(1)}%`,
                      fontSize: 10,
                      fill: "#6b7a8d",
                    }}
                    isAnimationActive
                  >
                    {subjectBarData.map((entry, index) => (
                      <rect key={index} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              ) : (
                <BarChart
                  data={sectionBarData}
                  margin={{ top: 4, right: 8, left: -10, bottom: 4 }}
                  barSize={12}
                  barCategoryGap="25%"
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f4f9" vertical={false} />
                  <XAxis
                    dataKey="subject"
                    tick={{ fill: "#6b7a8d", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    domain={[50, 100]}
                    tick={{ fill: "#6b7a8d", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip content={<TrendTooltip />} cursor={{ fill: "#f4f7fb" }} />
                  <ReferenceLine y={75} stroke="#dc2626" strokeDasharray="4 3" strokeWidth={1.5} />
                  <Legend
                    wrapperStyle={{ fontSize: 12, color: "#6b7a8d", paddingTop: 8 }}
                  />
                  {(["Rizal (Gr. 7)", "Bonifacio (Gr. 8)", "Mabini (Gr. 9)"] as const).map(
                    (s) => (
                      <Bar key={s} dataKey={s} fill={CHART_COLORS[s]} radius={[3, 3, 0, 0]} />
                    )
                  )}
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>

          {/* Subject MPS List */}
          <div className="xl:col-span-2 p-6">
            <p
              className="text-[12px] text-[#9aa5b4] uppercase tracking-wider mb-4"
              style={{ fontWeight: 600 }}
            >
              Subject Breakdown
            </p>
            <div className="space-y-3.5">
              {subjectMPSData.map((d) => {
                const delta = +(d.mps - d.prevMps).toFixed(1);
                return (
                  <div key={d.subject} className="flex items-center gap-3">
                    <div className="w-28 shrink-0">
                      <p
                        className="text-[12px] text-[#0a2540] truncate"
                        style={{ fontWeight: 500 }}
                      >
                        {d.subject}
                      </p>
                    </div>
                    <div className="flex-1 h-2 rounded-full bg-[#f0f4f9] overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${((d.mps - 50) / 50) * 100}%`,
                          background: mpsBarColor(d.mps),
                        }}
                      />
                    </div>
                    <span
                      className="tabular-nums text-sm shrink-0 w-12 text-right"
                      style={{ color: mpsColor(d.mps), fontWeight: 700 }}
                    >
                      {d.mps}%
                    </span>
                    <span
                      className={`text-[11px] shrink-0 flex items-center gap-0.5 ${
                        delta >= 0 ? "text-[#059669]" : "text-[#dc2626]"
                      }`}
                    >
                      {delta >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                      {delta >= 0 ? "+" : ""}
                      {delta}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="mt-5 pt-4 border-t border-[#f0f4f9] flex items-center gap-4 text-[11px] text-[#9aa5b4]">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#34d399] inline-block" /> ≥ 75% (On
                target)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#fbbf24] inline-block" /> 65–74%
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#f87171] inline-block" /> &lt; 65%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Quarterly Trend ─────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-[#e8edf3] shadow-sm p-6">
        <div className="flex items-start justify-between mb-5 flex-wrap gap-3">
          <div>
            <h2 className="text-[#0a2540]" style={{ fontSize: "1rem", fontWeight: 700 }}>
              MPS Quarterly Trend
            </h2>
            <p className="text-[13px] text-[#6b7a8d] mt-0.5">
              Progress of key subjects across Q1–Q4 for {academicYear}.
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-[12px] text-[#9aa5b4]">
            <span className="w-6 border-t-2 border-dashed border-[#dc2626] inline-block" />
            DepEd Target (75%)
          </div>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart
            data={quarterlyTrendData}
            margin={{ top: 4, right: 16, left: -10, bottom: 4 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f4f9" />
            <XAxis
              dataKey="quarter"
              tick={{ fill: "#6b7a8d", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={[55, 90]}
              tick={{ fill: "#6b7a8d", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip content={<TrendTooltip />} />
            <ReferenceLine y={75} stroke="#dc2626" strokeDasharray="5 4" strokeWidth={1.5} />
            <Legend wrapperStyle={{ fontSize: 12, color: "#6b7a8d", paddingTop: 8 }} />
            {TREND_SUBJECTS.map((s) => (
              <Line
                key={s}
                type="monotone"
                dataKey={s}
                stroke={CHART_COLORS[s]}
                strokeWidth={2.5}
                dot={{ r: 4, fill: CHART_COLORS[s], strokeWidth: 0 }}
                activeDot={{ r: 6 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
        <p className="text-[11px] text-[#b0bac8] mt-3 text-right">
          Showing: Mathematics, English, Science, Filipino · {academicYear}
        </p>
      </div>

      {/* ── Least Learned Competencies ──────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-[#e8edf3] shadow-sm overflow-hidden">
        <div className="px-6 pt-6 pb-5 border-b border-[#f0f4f9]">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-6 h-6 rounded-lg bg-[#fee2e2] flex items-center justify-center">
                  <AlertTriangle size={13} className="text-[#dc2626]" />
                </div>
                <h2 className="text-[#0a2540]" style={{ fontSize: "1rem", fontWeight: 700 }}>
                  Least Learned Competencies
                </h2>
              </div>
              <p className="text-[13px] text-[#6b7a8d]">
                Based on DepEd Most Essential Learning Competencies (MELCs). Ranked by student
                difficulty rate.
              </p>
            </div>
            <button className="flex items-center gap-2 text-sm text-[#6b7a8d] border border-[#dde3ec] bg-white hover:bg-[#f4f7fb] rounded-lg px-4 py-2 transition-colors">
              <Download size={14} />
              Export CSV
            </button>
          </div>

          {/* LLC Filters */}
          <div className="flex flex-wrap gap-3">
            <div className="relative">
              <Search
                size={13}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9aa5b4]"
              />
              <input
                type="text"
                placeholder="Search competency or MELC code…"
                value={llcSearch}
                onChange={(e) => setLlcSearch(e.target.value)}
                className="pl-8 pr-3 py-2 text-sm bg-white border border-[#dde3ec] rounded-lg w-60 focus:outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20 transition-all"
              />
            </div>
            <Select
              value={llcSubject}
              onChange={setLlcSubject}
              options={[
                { value: "All", label: "All Subjects" },
                ...[
                  "Filipino",
                  "English",
                  "Mathematics",
                  "Science",
                  "Araling Panlipunan",
                  "MAPEH",
                  "TLE / EPP",
                  "Values Education",
                ].map((s) => ({ value: s, label: s })),
              ]}
              className="w-44"
            />
            <Select
              value={llcSection}
              onChange={setLlcSection}
              options={[
                { value: "All", label: "All Sections" },
                ...["Rizal (Gr. 7)", "Bonifacio (Gr. 8)", "Mabini (Gr. 9)"].map((s) => ({
                  value: s,
                  label: s,
                })),
              ]}
              className="w-48"
            />
            <Select
              value={llcStatus}
              onChange={setLlcStatus}
              options={[
                { value: "All", label: "All Statuses" },
                { value: "Pending", label: "Pending" },
                { value: "In Progress", label: "In Progress" },
                { value: "Resolved", label: "Resolved" },
              ]}
              className="w-40"
            />
            <div className="ml-auto flex items-center gap-2">
              <span className="text-[13px] text-[#9aa5b4]">
                {filteredLLC.length} competenc{filteredLLC.length === 1 ? "y" : "ies"} found
              </span>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-[#f8fafc] border-b border-[#e8edf3]">
                {[
                  "#",
                  "Competency / MELC Code",
                  "Subject",
                  "Grade Level",
                  "Section",
                  "Quarter",
                  "% Struggling",
                  "Intervention",
                ].map((h) => (
                  <th
                    key={h}
                    className={`px-4 py-3 text-[11px] text-[#6b7a8d] uppercase tracking-wider whitespace-nowrap ${
                      h === "Competency / MELC Code"
                        ? "text-left"
                        : h === "#"
                        ? "text-left pl-6"
                        : "text-center"
                    }`}
                    style={{ fontWeight: 600 }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0f4f9]">
              {filteredLLC.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-14 text-[#9aa5b4] text-sm">
                    No competencies match the current filters.
                  </td>
                </tr>
              ) : (
                filteredLLC.map((row) => {
                  const isCritical = row.percentStruggling >= 65;
                  return (
                    <tr
                      key={row.id}
                      className={`hover:bg-[#f8fafc] transition-colors ${
                        isCritical ? "bg-[#fff9f9]" : ""
                      }`}
                    >
                      <td className="pl-6 pr-4 py-4">
                        <span
                          className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] text-white"
                          style={{
                            background: isCritical
                              ? "#dc2626"
                              : row.percentStruggling >= 50
                              ? "#d97706"
                              : "#059669",
                            fontWeight: 700,
                            display: "inline-flex",
                          }}
                        >
                          {row.rank}
                        </span>
                      </td>
                      <td className="px-4 py-4 max-w-xs">
                        <p
                          className="text-[#0a2540] leading-snug"
                          style={{ fontWeight: 500 }}
                        >
                          {row.competency}
                        </p>
                        <p className="text-[11px] text-[#9aa5b4] mt-0.5 font-mono">
                          {row.melcCode}
                        </p>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span
                          className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] border whitespace-nowrap"
                          style={{
                            background: (CHART_COLORS as any)[row.subject]
                              ? `${(CHART_COLORS as any)[row.subject]}15`
                              : "#f0f4f9",
                            color: (CHART_COLORS as any)[row.subject] ?? "#6b7a8d",
                            borderColor: `${
                              (CHART_COLORS as any)[row.subject] ?? "#e8edf3"
                            }40`,
                            fontWeight: 500,
                          }}
                        >
                          {row.subject}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className="text-[13px] text-[#0a2540]">{row.gradeLevel}</span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className="text-[13px] text-[#6b7a8d] whitespace-nowrap">
                          {row.section}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className="text-[13px] text-[#6b7a8d]">{row.quarter}</span>
                      </td>
                      <td className="px-4 py-4">
                        <StruggleMeter pct={row.percentStruggling} />
                      </td>
                      <td className="px-4 py-4 text-center">
                        <InterventionBadge status={row.interventionStatus} />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* LLC Footer */}
        <div className="px-6 py-4 border-t border-[#f0f4f9] bg-[#f8fafc] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-5 text-[11px] text-[#9aa5b4]">
            <span className="flex items-center gap-1.5">
              <span
                className="w-4 h-4 rounded-full bg-[#dc2626] flex items-center justify-center text-white"
                style={{ fontSize: 9, fontWeight: 700 }}
              >
                ●
              </span>
              Critical (&gt;65%)
            </span>
            <span className="flex items-center gap-1.5">
              <span
                className="w-4 h-4 rounded-full bg-[#d97706] flex items-center justify-center text-white"
                style={{ fontSize: 9, fontWeight: 700 }}
              >
                ●
              </span>
              Moderate (50–64%)
            </span>
            <span className="flex items-center gap-1.5">
              <span
                className="w-4 h-4 rounded-full bg-[#059669] flex items-center justify-center text-white"
                style={{ fontSize: 9, fontWeight: 700 }}
              >
                ●
              </span>
              Manageable (&lt;50%)
            </span>
          </div>
          <p className="text-[11px] text-[#b0bac8]">
            Source: DepEd MELC Framework · {academicYear}
          </p>
        </div>
      </div>

      <p className="text-center text-[12px] text-[#b0bac8] pb-4">
        Socorra Educational Platform · Analytics data is for demonstration purposes only
      </p>
    </div>
  );
}
