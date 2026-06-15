// frontend/src/types/analytics.types.ts

// ---------------------------------------------------------
// 1. FILTERING & NAVIGATION
// ---------------------------------------------------------

export interface AnalyticsFilterState {
  termId?: string;       // e.g., "Q1_2026", "Fall_2026"
  gradeLevel?: string;   // e.g., "8th Grade"
  classId?: string;      // Specific class/section
  assessmentId?: string; // Specific exam/paper
}

// ---------------------------------------------------------
// 2. CORE METRICS & COMPONENTS
// ---------------------------------------------------------

export type MasteryLevel = 'Exceeding' | 'Proficient' | 'Developing' | 'Beginning';
export type TrendDirection = 'up' | 'down' | 'flat';

export interface CompetencyPerformance {
  id: string;
  name: string;
  description?: string;
  averageScore: number;        // e.g., 78 (out of 100)
  masteryPercentage: number;   // % of students who achieved "Proficient" or higher
  trend: TrendDirection;
}

export interface StudentRiskProfile {
  studentId: string;
  name: string;
  currentAverage: number;
  trend: TrendDirection;
  flaggedCompetencies: string[]; // Names of competencies they are failing
  riskLevel: 'High' | 'Moderate' | 'Low';
}

export interface AIInsight {
  id: string;
  type: 'Descriptive' | 'Predictive' | 'Prescriptive';
  title: string;
  description: string;
  suggestedAction?: string; // The actionable advice for the teacher
  relatedCompetencyIds?: string[];
}

// ---------------------------------------------------------
// 3. THE THREE TIERS OF ANALYTICS VIEWS
// ---------------------------------------------------------

/**
 * TIER 1: The Command Center (All Classes/Global View)
 */
export interface GlobalAnalyticsContext {
  activeClassesCount: number;
  totalStudentsAssessed: number;
  overallAverage: number;
  overallMasteryRate: number;
  classComparisons: {
    classId: string;
    className: string;
    averageScore: number;
  }[];
  globalInsights: AIInsight[]; // High-level trends across all classes
}

/**
 * TIER 2: Class Longitudinal View (Specific Class over time)
 */
export interface ClassAnalyticsContext {
  classId: string;
  className: string;
  averageScore: number;
  assessmentsCompleted: number;
  
  // Time-series data for the line graph
  trendOverTime: {
    assessmentId: string;
    assessmentName: string;
    date: string;
    classAverage: number;
  }[];

  competencyRadar: CompetencyPerformance[];
  atRiskStudents: StudentRiskProfile[];
  classInsights: AIInsight[];
}

/**
 * TIER 3: Assessment Deep Dive (Specific test/paper)
 */
export interface AssessmentAnalyticsContext {
  assessmentId: string;
  assessmentName: string;
  date: string;
  
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  
  // Distribution curve data (e.g., how many got 90-100, 80-89, etc.)
  scoreDistribution: {
    range: string; // e.g., "90-100"
    studentCount: number;
  }[];

  competenciesTested: CompetencyPerformance[];
  
  // The most common mistakes found by the AI OCR/Grading
  commonMistakes: {
    competencyId: string;
    errorDescription: string;
    frequency: number; // How many students made this error
  }[];

  assessmentInsights: AIInsight[]; // Highly specific next-day lesson advice
}

// ---------------------------------------------------------
// 4. MAIN WRAPPER TYPE
// ---------------------------------------------------------

// This shape depends on the active filter state
export type AnalyticsDashboardData = 
  | { tier: 'global'; data: GlobalAnalyticsContext }
  | { tier: 'class'; data: ClassAnalyticsContext }
  | { tier: 'assessment'; data: AssessmentAnalyticsContext };