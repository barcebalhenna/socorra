# Quarter Overview Analytics Page

## Overview
A pixel-perfect implementation of the Quarter Overview analytics dashboard for the Socorra education system, following the Philippine DepEd K–12 grading framework with MPS (Mean Percentage Score) tracking and Least Learned Competencies analysis.

## Files Created

### 1. `QuarterOverview.tsx`
The main analytics page component that includes:

#### **Top KPI Cards** (4 cards with exact background tints):
- **Overall MPS** (bg-blue-50, blue icon) - Shows 72.7% with +2.3% delta
- **Below-Target Subjects** (bg-red-50, red icon, alert border) - Shows 4 subjects
- **Critical Competencies** (bg-amber-50, amber icon, alert border) - Shows 8 competencies
- **Students at Risk** (bg-violet-50, purple icon) - Shows 7 students

#### **MPS Charts Section**:
- **Segmented Control Toggle**: "By Subject" / "By Section"
- **Bar Chart** (Subject View):
  - Color-coded bars (Green ≥75%, Amber 65-74%, Red <65%)
  - Red dashed reference line at 75% (DepEd Target)
  - Top labels showing percentage values
  - 8 subjects displayed
- **Grouped Bar Chart** (Section View):
  - 3 sections per subject (Rizal Gr.7, Bonifacio Gr.8, Mabini Gr.9)
  - Color-coded by section
  - Legend at bottom
- **Subject Breakdown Panel**:
  - Horizontal progress bars with color coding
  - MPS percentage with trend indicator (+/- delta)
  - Legend explaining color scheme

#### **MPS Quarterly Trend Line Chart**:
- 4 subjects tracked: Mathematics, English, Science, Filipino
- Smooth monotone curves with distinct colors
- Red dashed reference line at 75% (DepEd Target)
- Data points with hover tooltips
- Q1-Q4 x-axis labels
- Legend showing all subjects

#### **Least Learned Competencies Table**:
- **Circular Rank Badges**: Color-coded (Red ≥65%, Amber 50-64%, Green <50%)
- **Columns**: #, Competency/MELC Code, Subject, Grade Level, Section, Quarter, % Struggling, Intervention
- **Struggle Meter**: Horizontal progress bar with percentage
- **Intervention Badges**: 
  - Pending (amber with Clock icon)
  - In Progress (blue with Activity icon)
  - Resolved (green with CheckCircle icon)
- **Filters**: Search, Subject, Section, Status dropdowns
- **Critical Row Highlighting**: Light red background for ≥65%
- **Subject Pills**: Color-coded with subject-specific tints

### 2. `analytics-data.ts`
Mock data and type definitions:
- `ACADEMIC_YEARS` - Available school years
- `analyticsKPIs` - KPI metrics (Overall MPS, targets, etc.)
- `subjectMPSData` - MPS scores per subject with trend
- `sectionMPSData` - MPS scores by section and subject
- `quarterlyTrendData` - Q1-Q4 trend for key subjects
- `leastLearnedData` - 12 competencies with MELC codes
- `LeastLearned` interface - TypeScript type definition

### 3. `AnalyticsView.tsx` (Modified)
Updated to integrate the Quarter Overview component in the "Quarter Overview" tab.

## Styling Highlights

### Color System
- **Primary Text**: `#0a2540`
- **Secondary Text**: `#6b7a8d`
- **Muted Text**: `#9aa5b4`, `#b0bac8`
- **Borders**: `#e8edf3`, `#f0f4f9`, `#dde3ec`
- **Backgrounds**: `#f8fafc`, `#f4f7fb`

### MPS Color Coding
- **Green** (`#059669`, `#34d399`): ≥ 75% (On target)
- **Amber** (`#d97706`, `#fbbf24`): 65-74% (Near target)
- **Red** (`#dc2626`, `#f87171`): < 65% (Below target)

### Chart Colors (Subject-specific)
- Filipino: `#2563eb` (Blue)
- English: `#7c3aed` (Purple)
- Mathematics: `#dc2626` (Red)
- Science: `#059669` (Green)
- Araling Panlipunan: `#d97706` (Amber)
- MAPEH: `#0891b2` (Cyan)
- TLE / EPP: `#65a30d` (Lime)
- Values Education: `#db2777` (Pink)

### Design Tokens
- **Main Cards**: `rounded-2xl` with `border-[#e8edf3]`
- **KPI Cards**: `rounded-xl` with colored icon backgrounds
- **Alert Cards**: Red border `border-[#fca5a5]`
- **Typography**: `tabular-nums` for all numeric values

## Components & Features

### Interactive Elements
1. **Academic Year Selector** - Dropdown to change school year
2. **Export Report Button** - Blue accent button
3. **Chart View Toggle** - Segmented control (Subject/Section)
4. **Search Input** - With magnifying glass icon
5. **Filter Dropdowns** - Subject, Section, Status filters
6. **Export CSV Button** - For LLC data

### Recharts Configuration
- **BarChart**: With CartesianGrid, ReferenceLine, custom tooltips
- **LineChart**: Smooth curves, dots on data points
- **Tooltips**: Custom styled with proper formatting
- **Legends**: Bottom placement with custom styling
- **Responsive**: Uses `ResponsiveContainer` for fluid sizing

### Tooltips
- **MPSTooltip**: Shows value, target comparison, color indicator
- **TrendTooltip**: Lists all subjects with their values and colored dots

## DepEd Compliance

### MELC Framework
- Competencies linked to specific MELC codes (e.g., M9AL-Ic-1)
- Grade level and quarter tracking
- Intervention status monitoring

### Grading Standards
- 75% Target threshold (DepEd standard)
- Quarterly assessment tracking (Q1-Q4)
- Subject-based performance monitoring

## Usage

Navigate to **Analytics & Reports** → **Quarter Overview** tab to view the analytics dashboard.

## Data Flow

1. Data imported from `analytics-data.ts`
2. KPIs calculated from source data
3. Charts rendered with Recharts library
4. Filters applied via `useMemo` hooks
5. Real-time search and filtering

## Future Enhancements

- Connect to real backend API
- Export functionality (PDF, Excel)
- Date range selection
- Custom report builder
- Email report scheduling
- Drill-down to student-level details
- Intervention tracking workflow
- Mobile-responsive optimizations
- Print-friendly layouts
