# Grading Summary Feature

## Overview
A pixel-perfect implementation of the Grading Summary dashboard for the Socorra education system, following the Philippine DepEd K–12 grading framework.

## Files Created

### 1. `GradingSummaryView.tsx`
The main page component that includes:
- **Top Metric Cards** (4 cards):
  - Total Students (with Users icon)
  - Class Average (with TrendingUp icon, shows descriptor)
  - Needs Attention (with AlertTriangle icon, students below 75)
  - With Honors (with Award icon, students ≥ 90)
  
- **Grading Summary Table Component**:
  - Filters: Academic Year, Section, Subject, Search
  - Context strip showing selected filters and class statistics
  - Quarter tabs (All, Q1, Q2, Q3, Q4)
  - Responsive table with student grades
  - Color-coded descriptors and remarks
  - DepEd grading scale legend

### 2. `data.ts`
Mock data and utility functions:
- Academic years, sections, subjects
- 27 mock student records with grades
- `getGrades()` - Fetches student grades
- `getFinalAverage()` - Calculates final average
- `getDescriptor()` - Maps grade to DepEd descriptor

### 3. `AnalyticsView.tsx` (Modified)
Updated to include the new "Grading Summary" tab as the first tab in the Analytics section.

## Styling
- Uses Tailwind CSS with exact hex colors from reference image
- Consistent with existing Socorra design system
- `rounded-2xl` borders, clean spacing
- Hover effects and transitions
- Responsive grid layouts

## Icons
All icons from `lucide-react`:
- Users, TrendingUp, AlertTriangle, Award (metric cards)
- ChevronDown, Download, Search, Info (table controls)

## DepEd Grading Scale
- **Outstanding**: 90–100 (Green)
- **Very Satisfactory**: 85–89 (Blue)
- **Satisfactory**: 80–84 (Light Blue)
- **Fairly Satisfactory**: 75–79 (Yellow/Amber)
- **Did Not Meet Expectations**: Below 75 (Red)

## Usage
Navigate to "Analytics & Reports" → "Grading Summary" tab to view the page.

## Future Enhancements
- Connect to real backend API
- Export to SF9 (School Form 9) functionality
- Advanced filtering and sorting
- Print/PDF generation
- Student detail drill-down
