# Copilot Prompt: Analytics & Reports Page

## Purpose & Context

This is a reference document for building the **Analytics & Reports** page of a web app designed for **DepEd Junior High School teachers in the Philippines**. The app's core function is to help teachers automatically check MCQ (multiple choice) assessments by uploading photos of answer sheets, then provide relevant analytics aligned with **DepEd Order No. 8, s. 2015** (Policy Guidelines on Classroom Assessment for the K to 12 Basic Education Program).

**Who uses this page:** Public JHS teachers who are often non-technical, time-pressed, and managing multiple subjects and sections. Every design decision should reduce cognitive load, not add to it.

**Scope of data:** This system only handles the **Written Work (WW) component** — specifically MCQ assessments. Teachers are aware that the WW Weighted Score shown is only one component of the full grade computation. The system does **not** perform transmutation.

---

## Design Principles

> **Stay fully consistent with the existing design system** of the app — use the same color tokens, typography scale, spacing units, component library, and interactive patterns already in use. Do not introduce new design languages.

Beyond consistency, follow these principles throughout the page:

- **Scan-first hierarchy.** Teachers will open this page between classes. The most critical information (class average, at-risk count, weak competencies) must be visible at a glance without scrolling.
- **Actionable over decorative.** Every chart and metric must answer a question a teacher would actually ask. Avoid vanity metrics.
- **Warm professionalism.** The tone is helpful and clear — not clinical like a data dashboard, not casual like a consumer app.
- **Mobile-aware.** Teachers may open this on a smartphone or tablet. Layouts should be responsive. Charts must remain legible at smaller sizes.
- **Accessible.** Use sufficient color contrast. Never rely on color alone to convey meaning — pair with labels, icons, or patterns. Use `aria-label` attributes on all chart containers and icon buttons.

---

## Page Architecture

The Analytics & Reports page is **always scoped to a single Class Record** — a unique combination of:

```
Teacher → Subject → Grade Level → Section → Quarter
Example: "TLE 8 – Bonifacio, Q2"
```

The active class record context must be **persistently visible** at the top of the page (e.g., a sticky header label or breadcrumb). Switching class records should be quick — use a compact dropdown or selector rather than navigating away.

### Top-Level Navigation Tabs

The page is divided into four main tabs or segments:

| Tab Label | Description |
|---|---|
| **Assessment** | Analytics for a single selected assessment |
| **Quarter Overview** | Cumulative WW data across all assessments this quarter |
| **Students** | Individual student drill-down view |
| **Sections** | Cross-section comparison (only visible when applicable) |

The default active tab on page load should be **Quarter Overview** since it reflects the most current state.

---

## Tab 1 — Assessment Analytics

### Context Selector

At the top of this tab, provide a **dropdown or segmented selector** to choose which assessment to view. Show the assessment name, date administered, and total items. If no assessments exist yet, show an empty state with a CTA to create one.

---

### Section A: Class Performance Summary

**Layout:** A row of 4–5 KPI stat cards, followed by a distribution chart below.

**KPI Cards to display:**

| Metric | Label | Notes |
|---|---|---|
| Class Average PS | "Class Average" | Display as `XX.XX%` |
| Highest Score | "Highest PS" | Display as percentage |
| Lowest Score | "Lowest PS" | Display as percentage |
| Pass Rate | "Passing Rate" | % of students with PS equivalent to transmuted grade ≥ 75 |
| At-Risk Count | "Need Attention" | Count of students in DNME band; use a warning color |

**Distribution Chart:**

- Type: **Stacked horizontal bar** or **donut chart**
- Break down into the 5 DepEd descriptor bands:
  - Outstanding (90–100) — use a strong positive color
  - Very Satisfactory (85–89)
  - Satisfactory (80–84)
  - Fairly Satisfactory (75–79)
  - Did Not Meet Expectations (below 75) — use a warning/alert color
- Show both count (e.g., "8 students") and percentage per band
- Include a legend; clicking a band should highlight those students in the At-Risk Panel below

---

### Section B: Item Analysis

**Layout:** Two side-by-side panels — difficulty chart on the left, distractor table on the right. Stack vertically on mobile.

**Difficulty Index Chart:**

- Type: **Ranked horizontal bar chart**
- X-axis: Percent of students who answered correctly (0–100%)
- Y-axis: Item numbers (Q1, Q2, Q3…)
- Color-code bars by difficulty band:
  - Very Difficult: < 20%
  - Difficult: 20–40%
  - Average: 40–60%
  - Easy: 60–80%
  - Very Easy: > 80%
- Add a visible **50% reference line** — items below this are candidates for re-teaching
- Sort by difficulty ascending (hardest items at the top) by default; allow toggle to sort by item number

**Distractor Frequency Table:**

- For each item that more than 30% of students got wrong, show a row with:
  - Item number
  - The correct answer
  - The most-chosen wrong answer and its selection rate (e.g., "Option C — 42%")
- This helps identify misconceptions, not just wrong answers
- Add a small tooltip or info icon explaining what distractor analysis means (some teachers may be unfamiliar)
- If all items were answered correctly by >70%, show a positive empty state ("Great job — no significant misconceptions detected.")

---

### Section C: Competency Performance

**Layout:** Full-width ranked bar chart with a threshold line.

- Type: **Horizontal bar chart**, one bar per learning competency from the TOS
- Metric: Average percent correct across all items mapped to that competency
- Sort: Ascending by performance (weakest competencies at top)
- Add a **60% threshold line** labeled "Remediation Zone" — competencies below this line are flagged
- Color bars below the threshold differently from those above (use the existing warning/alert color)
- Clicking a competency bar should expand a small panel or tooltip showing which specific items belong to that competency and which students missed them most

---

### Section D: Cognitive Level Breakdown

**Layout:** Chart on the left, interpretation panel on the right. Stack on mobile.

- Type: **Radar/Spider chart** (preferred) or grouped horizontal bars if radar is not feasible
- Six axes corresponding to Bloom's Cognitive Process Dimensions as defined in DepEd DO 8, s. 2015:
  - Remembering
  - Understanding
  - Applying
  - Analyzing
  - Evaluating
  - Creating
- Metric per axis: Average percent correct for items at that cognitive level
- Add a subtle reference polygon at 60% to show the "expected" performance baseline
- Below the chart, show a brief text interpretation — e.g., "Students performed well at lower-order levels but struggled with Analyzing and Evaluating." Generate this dynamically based on which levels are below 60%.

---

### Section E: At-Risk Students Panel

**Layout:** Compact table below all charts, collapsible to save space.

- Show all students whose PS falls in the DNME band for this assessment
- Columns: Student Name | Raw Score | PS | Missed Competencies (top 2–3, shown as tags)
- Add a small banner above the table with context: *"Students consistently below expectations must be reported to parents by the 5th week of the quarter (DepEd Order No. 8, s. 2015)."*
- Each student row should be tappable/clickable to open their Student Drill-Down (Tab 3)
- If no students are at risk, show a clean positive state — do not show the table at all

---

## Tab 2 — Quarter Overview

This tab shows cumulative WW data across all assessments in the selected quarter for the active class record.

---

### Section A: WW Progress Tracker

**Layout:** A prominent chart at the top.

- Type: **Line chart** with multiple series
- X-axis: Assessment sequence (Assessment 1, Assessment 2, etc.)
- Y-series 1: Class average cumulative PS (primary line)
- Y-series 2: Optional — individual student lines shown as faint strokes behind the class average; toggle-able
- Below the chart, show two prominent KPI cards:
  - **Current WW Percentage Score** (cumulative PS to date)
  - **Current WW Weighted Score** (PS × subject weight, auto-applied based on subject — 40% for Math/Science, 30% for Languages/AP/EsP, 20% for MAPEH/TLE)
- Add a small label under the Weighted Score card: *"WW component only — does not include Performance Tasks or Quarterly Assessment."*

---

### Section B: Student WW Standing Table

**Layout:** Full-width sortable table — the primary export-ready view.

**Columns:**

| # | Student Name | Q1 PS | Q2 PS | … | Cumulative Raw | Cumulative PS | WW Weighted Score | Status |
|---|---|---|---|---|---|---|---|---|

- Each assessment column shows the PS for that assessment
- Cumulative Raw = sum of all raw scores; Cumulative PS = cumulative raw ÷ total highest possible × 100
- WW Weighted Score = Cumulative PS × subject weight
- Status column: show a colored badge — "On Track" (≥75 equivalent), "At Risk" (below threshold)
- The table must be **sortable** by any column
- Include an **Export to Excel** button — exported file should be formatted to match the DepEd e-class record WW columns (student names in column A, assessment scores in subsequent columns, PS and WS in the final columns)
- Show a count summary above the table: e.g., "32 students — 28 on track, 4 at risk"

---

### Section C: Competency Coverage Map

**Layout:** Grid or checklist panel.

- Show all learning competencies for the subject as listed across all TOS entries this quarter
- For each competency, indicate:
  - Whether it has been assessed at least once (checkmark or filled dot)
  - If assessed, average class performance across all assessments that covered it
- Competencies not yet assessed should be visually distinct (e.g., grayed out or outlined)
- Add a coverage summary: e.g., "7 of 12 competencies assessed this quarter"
- This helps teachers identify gaps in their assessment coverage before the Quarterly Assessment

---

## Tab 3 — Student Drill-Down

Accessible by clicking any student name from any table in the app.

---

### Student Header

Show the student's name, section, and current cumulative WW PS prominently. Include their current descriptor badge (Outstanding, VS, S, FS, or DNME). Add a back button to return to the previous view.

---

### Assessment Score Timeline

- Type: **Bar chart** or **dot plot**
- X-axis: Assessments in chronological order
- Y-axis: PS per assessment (0–100%)
- Draw a horizontal reference line at 75% (the passing threshold equivalent)
- Show the trend direction (improving, declining, flat) with a small indicator

---

### Competency Gap Profile

- Show all competencies tested across assessments this quarter
- For each competency, show the student's average percent correct
- Highlight competencies consistently below 60% as gaps
- Sort by performance ascending
- Type: **Horizontal bar chart**, same visual style as Section C in Tab 1

---

### Cognitive Level Profile

- Same radar chart as Section D in Tab 1, but showing this student's performance
- Overlay a faint class average polygon so the teacher can compare the student to the class

---

### Remediation Note Area

- A simple, optional text field where the teacher can add a private note about this student's intervention plan
- Not graded, not exported — just a teacher-side reference

---

## Tab 4 — Cross-Section Comparison

> **Visibility rule:** Only show this tab when the teacher has two or more class records with the **same Subject and Grade Level** (e.g., Math 9 – Helium and Math 9 – Rizal). Hide it entirely otherwise.

---

### Assessment Comparison

- A **grouped bar chart** showing class averages side by side per assessment for each section
- Tooltip on hover shows exact values per section

---

### Descriptor Distribution Comparison

- Stacked bar per section showing the breakdown across the 5 descriptor bands
- Makes it easy to see if one section has more DNME students than another

---

### Competency Gap Comparison

- A **heatmap table** — rows are competencies, columns are sections, cells show average performance
- Color scale from red (low) to green (high)
- Makes cross-section competency gaps immediately scannable

---

## Empty States

Every section and tab must handle the case where no data exists yet. Empty states should:
- Use a friendly, non-alarming illustration or icon (consistent with the app's existing empty state style)
- Explain clearly what's missing and what action to take
- Include a direct CTA button (e.g., "Add Your First Assessment")

---

## Global Behaviors

- **Loading states:** Use skeleton loaders (not spinners) for chart areas while data fetches. Match skeleton shape to the chart type.
- **Tooltips:** All charts must have hover/tap tooltips showing exact values. On mobile, tooltips should appear on tap and dismiss on tap-elsewhere.
- **No data labels on cluttered charts:** For item analysis charts with many items, only label bars on hover. For charts with 10 or fewer data points, always show labels directly.
- **Color accessibility:** Every color used to encode meaning must also be paired with a label, icon, or pattern. Do not use red/green alone for pass/fail — add text labels.
- **Print/export view:** The page should have a "Download Report" option that generates a clean, print-friendly summary of the current tab's data as a PDF. Charts should render cleanly in print mode.