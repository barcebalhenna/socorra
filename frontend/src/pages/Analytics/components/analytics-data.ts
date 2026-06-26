// ─── Analytics Data ───────────────────────────────────────────────────────────

export const ACADEMIC_YEARS = [
  "SY 2025-2026",
  "SY 2024-2025",
  "SY 2023-2024",
];

// ─── KPIs ─────────────────────────────────────────────────────────────────────

export const analyticsKPIs = {
  overallMPS: 72.7,
  overallMPSTarget: 75,
  overallMPSDelta: 2.3,
  belowTargetSubjects: 4,
  criticalCompetencies: 8,
  studentsAtRisk: 7,
};

// ─── Subject MPS Data ─────────────────────────────────────────────────────────

export const subjectMPSData = [
  { subject: "Filipino", mps: 72.4, prevMps: 70.2, target: 75 },
  { subject: "English", mps: 68.3, prevMps: 67.0, target: 75 },
  { subject: "Mathematics", mps: 61.2, prevMps: 62.1, target: 75 },
  { subject: "Science", mps: 65.7, prevMps: 64.1, target: 75 },
  { subject: "Araling Panlipunan", mps: 74.6, prevMps: 72.3, target: 75 },
  { subject: "MAPEH", mps: 79.3, prevMps: 78.1, target: 75 },
  { subject: "TLE / EPP", mps: 77.8, prevMps: 75.6, target: 75 },
  { subject: "Values Education", mps: 82.4, prevMps: 81.1, target: 75 },
];

// ─── Section MPS Data ─────────────────────────────────────────────────────────

export const sectionMPSData = [
  {
    subject: "Filipino",
    "Rizal (Gr. 7)": 71.2,
    "Bonifacio (Gr. 8)": 72.8,
    "Mabini (Gr. 9)": 73.1,
  },
  {
    subject: "English",
    "Rizal (Gr. 7)": 67.5,
    "Bonifacio (Gr. 8)": 68.9,
    "Mabini (Gr. 9)": 68.5,
  },
  {
    subject: "Mathematics",
    "Rizal (Gr. 7)": 59.8,
    "Bonifacio (Gr. 8)": 61.5,
    "Mabini (Gr. 9)": 62.3,
  },
  {
    subject: "Science",
    "Rizal (Gr. 7)": 64.2,
    "Bonifacio (Gr. 8)": 66.1,
    "Mabini (Gr. 9)": 66.8,
  },
  {
    subject: "Araling Panlipunan",
    "Rizal (Gr. 7)": 73.9,
    "Bonifacio (Gr. 8)": 74.8,
    "Mabini (Gr. 9)": 75.1,
  },
  {
    subject: "MAPEH",
    "Rizal (Gr. 7)": 78.5,
    "Bonifacio (Gr. 8)": 79.2,
    "Mabini (Gr. 9)": 80.1,
  },
  {
    subject: "TLE / EPP",
    "Rizal (Gr. 7)": 76.8,
    "Bonifacio (Gr. 8)": 77.9,
    "Mabini (Gr. 9)": 78.7,
  },
  {
    subject: "Values Education",
    "Rizal (Gr. 7)": 81.5,
    "Bonifacio (Gr. 8)": 82.4,
    "Mabini (Gr. 9)": 83.2,
  },
];

// ─── Term Trend Data ──────────────────────────────────────────────────────────

export const termTrendData = [
  { term: "Term 1", Mathematics: 59.2, English: 66.1, Science: 63.5, Filipino: 70.8 },
  { term: "Term 2", Mathematics: 60.1, English: 67.3, Science: 64.8, Filipino: 71.5 },
  { term: "Term 3", Mathematics: 61.2, English: 68.3, Science: 65.7, Filipino: 72.4 },
];

// ─── Least Learned Competencies ───────────────────────────────────────────────

export interface LeastLearned {
  id: string;
  rank: number;
  competency: string;
  melcCode: string;
  subject: string;
  gradeLevel: string;
  section: string;
  term: string;
  percentStruggling: number;
  interventionStatus: "Pending" | "In Progress" | "Resolved";
}

export const leastLearnedData: LeastLearned[] = [
  {
    id: "1",
    rank: 1,
    competency: "Solving quadratic equations by completing the square",
    melcCode: "M9AL-Ic-1",
    subject: "Mathematics",
    gradeLevel: "Grade 9",
    section: "Mabini (Gr. 9)",
    term: "Term 1",
    percentStruggling: 71.4,
    interventionStatus: "In Progress",
  },
  {
    id: "2",
    rank: 2,
    competency: "Distinguishing types of chemical bonds (ionic, covalent, metallic)",
    melcCode: "S9MT-IIIa-b-11",
    subject: "Science",
    gradeLevel: "Grade 9",
    section: "Mabini (Gr. 9)",
    term: "Term 2",
    percentStruggling: 68.9,
    interventionStatus: "Pending",
  },
  {
    id: "3",
    rank: 3,
    competency: "Inferring the author's purpose from a given text",
    melcCode: "EN8RC-IIIa-3.2",
    subject: "English",
    gradeLevel: "Grade 8",
    section: "Bonifacio (Gr. 8)",
    term: "Term 3",
    percentStruggling: 65.2,
    interventionStatus: "In Progress",
  },
  {
    id: "4",
    rank: 4,
    competency: "Solving problems involving rational algebraic expressions",
    melcCode: "M8AL-IId-1",
    subject: "Mathematics",
    gradeLevel: "Grade 8",
    section: "Bonifacio (Gr. 8)",
    term: "Term 2",
    percentStruggling: 63.7,
    interventionStatus: "Pending",
  },
  {
    id: "5",
    rank: 5,
    competency: "Describing the process of mitosis and meiosis",
    melcCode: "S8LT-IVd-16",
    subject: "Science",
    gradeLevel: "Grade 8",
    section: "Bonifacio (Gr. 8)",
    term: "Term 2",
    percentStruggling: 61.3,
    interventionStatus: "Resolved",
  },
  {
    id: "6",
    rank: 6,
    competency: "Pagsulat ng sanaysay gamit ang angkop na wika at istilo",
    melcCode: "F7PN-IIIaa-f-1.1.5",
    subject: "Filipino",
    gradeLevel: "Grade 7",
    section: "Rizal (Gr. 7)",
    term: "Term 3",
    percentStruggling: 58.8,
    interventionStatus: "In Progress",
  },
  {
    id: "7",
    rank: 7,
    competency: "Analyzing the development of the Philippine nation during the Spanish period",
    melcCode: "AP-FFAa-11.aa-1",
    subject: "Araling Panlipunan",
    gradeLevel: "Grade 7",
    section: "Rizal (Gr. 7)",
    term: "Term 3",
    percentStruggling: 56.1,
    interventionStatus: "Pending",
  },
  {
    id: "8",
    rank: 8,
    competency: "Evaluating probability of simple and compound events",
    melcCode: "M8SP-IVe-1",
    subject: "Mathematics",
    gradeLevel: "Grade 8",
    section: "Bonifacio (Gr. 8)",
    term: "Term 3",
    percentStruggling: 54.9,
    interventionStatus: "Pending",
  },
  {
    id: "9",
    rank: 9,
    competency: "Reading comprehension: drawing conclusions from informational texts",
    melcCode: "EN7RC-IVd-3.20",
    subject: "English",
    gradeLevel: "Grade 7",
    section: "Rizal (Gr. 7)",
    term: "Term 3",
    percentStruggling: 52.3,
    interventionStatus: "In Progress",
  },
  {
    id: "10",
    rank: 10,
    competency: "Describing motion using distance-time and velocity-time graphs",
    melcCode: "S7LT-IIIa-1",
    subject: "Science",
    gradeLevel: "Grade 7",
    section: "Rizal (Gr. 7)",
    term: "Term 1",
    percentStruggling: 50.4,
    interventionStatus: "Resolved",
  },
  {
    id: "11",
    rank: 11,
    competency: "Performing operations on polynomials",
    melcCode: "M7AL-IIc-1",
    subject: "Mathematics",
    gradeLevel: "Grade 7",
    section: "Rizal (Gr. 7)",
    term: "Term 2",
    percentStruggling: 48.7,
    interventionStatus: "Resolved",
  },
  {
    id: "12",
    rank: 12,
    competency: "Identifying elements of a short story: theme, conflict, and resolution",
    melcCode: "EN8LT-Ia-15.1",
    subject: "English",
    gradeLevel: "Grade 8",
    section: "Bonifacio (Gr. 8)",
    term: "Term 1",
    percentStruggling: 46.2,
    interventionStatus: "Resolved",
  },
];
