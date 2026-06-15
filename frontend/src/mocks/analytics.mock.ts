import type { GlobalAnalyticsContext, AIInsight } from '../types/analytics.types';

export const mockGlobalInsights: AIInsight[] = [
  {
    id: 'gi-1',
    type: 'Descriptive',
    title: 'Strong Reading Comprehension',
    description: 'Across all Grade 9 sections, reading comprehension scores have improved by 12% compared to last quarter.',
  },
  {
    id: 'gi-2',
    type: 'Predictive',
    title: 'Grammar and Syntax Risk',
    description: 'If the current trend continues, 30% of Grade 10 students may struggle with the upcoming summative essay.',
  },
  {
    id: 'gi-3',
    type: 'Prescriptive',
    title: 'Cross-level Intervention needed',
    description: 'Consistent drop in Critical Analysis found. Consider allocating 20 minutes for collaborative case studies next week.',
    suggestedAction: 'View Recommended Lesson Plans'
  }
];

export const mockGlobalTierData: GlobalAnalyticsContext = {
  activeClassesCount: 4,
  totalStudentsAssessed: 156,
  overallAverage: 82.5,
  overallMasteryRate: 68.2,
  classComparisons: [
    { classId: 'c1', className: 'Grade 9 - Rizal', averageScore: 85.2 },
    { classId: 'c2', className: 'Grade 9 - Bonifacio', averageScore: 78.4 },
    { classId: 'c3', className: 'Grade 10 - Mabini', averageScore: 81.0 },
    { classId: 'c4', className: 'Grade 10 - Aguinaldo', averageScore: 85.4 },
  ],
  globalInsights: mockGlobalInsights
};

export const mockAnalyticsReportData = {
  classRecords: [
    {
      id: 'tle8-bonifacio-q2',
      label: 'TLE 8 - Bonifacio, Q2',
      subject: 'TLE',
      gradeLevel: '8',
      section: 'Bonifacio',
      quarter: 'Q2',
      weight: 0.2,
      hasSections: true
    },
    {
      id: 'tle8-rizal-q2',
      label: 'TLE 8 - Rizal, Q2',
      subject: 'TLE',
      gradeLevel: '8',
      section: 'Rizal',
      quarter: 'Q2',
      weight: 0.2,
      hasSections: true
    },
    {
      id: 'tle8-plaridel-q2',
      label: 'TLE 8 - Plaridel, Q2',
      subject: 'TLE',
      gradeLevel: '8',
      section: 'Plaridel',
      quarter: 'Q2',
      weight: 0.2,
      hasSections: false
    }
  ],
  assessments: [
    { id: 'ww1', name: 'WW1 Safety Tools', date: '2026-06-05', items: 20 },
    { id: 'ww2', name: 'WW2 Simple Circuits', date: '2026-06-19', items: 25 },
    { id: 'ww3', name: 'WW3 Kitchen Basics', date: '2026-07-03', items: 30 },
    { id: 'ww4', name: 'WW4 Project Planning', date: '2026-07-17', items: 20 }
  ],
  assessmentOverview: {
    summary: {
      classAverage: 82.4,
      highestPS: 98.0,
      lowestPS: 63.5,
      passingRate: 78,
      atRiskCount: 5
    },
    distribution: [
      { id: 'outstanding', label: 'Outstanding', range: '90-100', count: 6 },
      { id: 'very-sat', label: 'Very Satisfactory', range: '85-89', count: 9 },
      { id: 'satisfactory', label: 'Satisfactory', range: '80-84', count: 8 },
      { id: 'fairly-sat', label: 'Fairly Satisfactory', range: '75-79', count: 7 },
      { id: 'dnme', label: 'Did Not Meet Expectations', range: '< 75', count: 5 }
    ],
    itemDifficulty: [
      { item: 'Q1', correctRate: 92 },
      { item: 'Q2', correctRate: 41 },
      { item: 'Q3', correctRate: 68 },
      { item: 'Q4', correctRate: 54 },
      { item: 'Q5', correctRate: 32 },
      { item: 'Q6', correctRate: 77 },
      { item: 'Q7', correctRate: 18 },
      { item: 'Q8', correctRate: 59 },
      { item: 'Q9', correctRate: 83 },
      { item: 'Q10', correctRate: 47 }
    ],
    distractors: [
      { item: 'Q2', correctAnswer: 'B', mostChosen: 'C', rate: 42 },
      { item: 'Q5', correctAnswer: 'D', mostChosen: 'A', rate: 39 },
      { item: 'Q7', correctAnswer: 'A', mostChosen: 'B', rate: 51 },
      { item: 'Q10', correctAnswer: 'C', mostChosen: 'D', rate: 34 }
    ],
    competencies: [
      { id: 'c1', name: 'Tool identification and safety', average: 78, items: ['Q1', 'Q2', 'Q3'], missedBy: ['Ma. Santos', 'J. Reyes'] },
      { id: 'c2', name: 'Circuit symbols and functions', average: 62, items: ['Q4', 'Q5', 'Q6'], missedBy: ['R. dela Cruz', 'A. Ong'] },
      { id: 'c3', name: 'Kitchen workflow sequencing', average: 55, items: ['Q7', 'Q8'], missedBy: ['C. Ramos', 'P. Aquino', 'J. Reyes'] },
      { id: 'c4', name: 'Project planning checklist', average: 84, items: ['Q9', 'Q10'], missedBy: ['M. Torres'] }
    ],
    cognitiveBreakdown: [
      { level: 'Remembering', value: 74 },
      { level: 'Understanding', value: 68 },
      { level: 'Applying', value: 61 },
      { level: 'Analyzing', value: 54 },
      { level: 'Evaluating', value: 49 },
      { level: 'Creating', value: 58 }
    ],
    atRiskStudents: [
      { id: 's3', name: 'J. Reyes', rawScore: 13, ps: 65, descriptor: 'DNME', missedCompetencies: ['Circuit symbols', 'Kitchen workflow'] },
      { id: 's7', name: 'C. Ramos', rawScore: 12, ps: 60, descriptor: 'DNME', missedCompetencies: ['Kitchen workflow', 'Project checklist'] },
      { id: 's9', name: 'R. dela Cruz', rawScore: 14, ps: 70, descriptor: 'DNME', missedCompetencies: ['Circuit symbols', 'Tool safety'] },
      { id: 's11', name: 'A. Ong', rawScore: 13, ps: 65, descriptor: 'DNME', missedCompetencies: ['Circuit symbols', 'Kitchen workflow'] },
      { id: 's14', name: 'P. Aquino', rawScore: 11, ps: 58, descriptor: 'DNME', missedCompetencies: ['Kitchen workflow', 'Project checklist'] }
    ]
  },
  quarterOverview: {
    progress: [
      { label: 'Assessment 1', value: 78 },
      { label: 'Assessment 2', value: 80 },
      { label: 'Assessment 3', value: 83 },
      { label: 'Assessment 4', value: 85 }
    ],
    currentPS: 84.6,
    currentWS: 16.9,
    assessmentColumns: ['WW1', 'WW2', 'WW3', 'WW4'],
    studentSummary: {
      total: 32,
      onTrack: 28,
      atRisk: 4
    },
    students: [
      { id: 's1', name: 'M. Santos', scores: [85, 88, 90, 86], cumulativeRaw: 349, cumulativePS: 87.3, weightedScore: 17.5, status: 'On Track' },
      { id: 's2', name: 'L. Bautista', scores: [78, 82, 80, 79], cumulativeRaw: 319, cumulativePS: 79.8, weightedScore: 16.0, status: 'On Track' },
      { id: 's3', name: 'J. Reyes', scores: [68, 70, 65, 72], cumulativeRaw: 275, cumulativePS: 68.8, weightedScore: 13.8, status: 'At Risk' },
      { id: 's4', name: 'A. Villanueva', scores: [90, 92, 88, 94], cumulativeRaw: 364, cumulativePS: 91.0, weightedScore: 18.2, status: 'On Track' },
      { id: 's5', name: 'C. Ramos', scores: [70, 72, 68, 74], cumulativeRaw: 284, cumulativePS: 71.0, weightedScore: 14.2, status: 'At Risk' }
    ],
    competencyCoverage: [
      { id: 'cc1', name: 'Tool identification and safety', assessed: true, average: 78 },
      { id: 'cc2', name: 'Circuit symbols and functions', assessed: true, average: 64 },
      { id: 'cc3', name: 'Kitchen workflow sequencing', assessed: true, average: 58 },
      { id: 'cc4', name: 'Project planning checklist', assessed: true, average: 82 },
      { id: 'cc5', name: 'Basic equipment maintenance', assessed: false, average: 0 },
      { id: 'cc6', name: 'Safe storage procedures', assessed: false, average: 0 }
    ]
  },
  students: {
    list: [
      {
        id: 's1',
        name: 'M. Santos',
        section: 'Bonifacio',
        cumulativePS: 87.3,
        descriptor: 'Very Satisfactory',
        timeline: [
          { label: 'WW1', value: 85 },
          { label: 'WW2', value: 88 },
          { label: 'WW3', value: 90 },
          { label: 'WW4', value: 86 }
        ],
        competencyGaps: [
          { id: 'c1', name: 'Tool identification and safety', average: 72 },
          { id: 'c2', name: 'Circuit symbols and functions', average: 65 },
          { id: 'c3', name: 'Kitchen workflow sequencing', average: 70 },
          { id: 'c4', name: 'Project planning checklist', average: 86 }
        ],
        cognitiveProfile: [
          { level: 'Remembering', value: 78 },
          { level: 'Understanding', value: 74 },
          { level: 'Applying', value: 68 },
          { level: 'Analyzing', value: 60 },
          { level: 'Evaluating', value: 58 },
          { level: 'Creating', value: 64 }
        ]
      },
      {
        id: 's3',
        name: 'J. Reyes',
        section: 'Bonifacio',
        cumulativePS: 68.8,
        descriptor: 'Did Not Meet Expectations',
        timeline: [
          { label: 'WW1', value: 68 },
          { label: 'WW2', value: 70 },
          { label: 'WW3', value: 65 },
          { label: 'WW4', value: 72 }
        ],
        competencyGaps: [
          { id: 'c2', name: 'Circuit symbols and functions', average: 48 },
          { id: 'c3', name: 'Kitchen workflow sequencing', average: 52 },
          { id: 'c1', name: 'Tool identification and safety', average: 58 },
          { id: 'c4', name: 'Project planning checklist', average: 62 }
        ],
        cognitiveProfile: [
          { level: 'Remembering', value: 62 },
          { level: 'Understanding', value: 58 },
          { level: 'Applying', value: 52 },
          { level: 'Analyzing', value: 44 },
          { level: 'Evaluating', value: 42 },
          { level: 'Creating', value: 50 }
        ]
      }
    ]
  },
  sections: {
    visible: true,
    sections: [
      { id: 'bonifacio', name: 'Bonifacio', color: 'bg-brand-500' },
      { id: 'rizal', name: 'Rizal', color: 'bg-blue-500' },
      { id: 'plaridel', name: 'Plaridel', color: 'bg-emerald-500' }
    ],
    assessmentComparison: [
      { label: 'WW1', values: { bonifacio: 82, rizal: 79, plaridel: 85 } },
      { label: 'WW2', values: { bonifacio: 84, rizal: 77, plaridel: 87 } },
      { label: 'WW3', values: { bonifacio: 86, rizal: 80, plaridel: 88 } },
      { label: 'WW4', values: { bonifacio: 85, rizal: 81, plaridel: 89 } }
    ],
    descriptorDistribution: [
      {
        sectionId: 'bonifacio',
        counts: { outstanding: 6, verySat: 9, satisfactory: 8, fairlySat: 5, dnme: 4 }
      },
      {
        sectionId: 'rizal',
        counts: { outstanding: 4, verySat: 8, satisfactory: 9, fairlySat: 7, dnme: 4 }
      },
      {
        sectionId: 'plaridel',
        counts: { outstanding: 7, verySat: 10, satisfactory: 7, fairlySat: 5, dnme: 3 }
      }
    ],
    competencyHeatmap: {
      competencies: [
        { id: 'c1', name: 'Tool identification and safety' },
        { id: 'c2', name: 'Circuit symbols and functions' },
        { id: 'c3', name: 'Kitchen workflow sequencing' },
        { id: 'c4', name: 'Project planning checklist' }
      ],
      rows: [
        { competencyId: 'c1', scores: { bonifacio: 78, rizal: 72, plaridel: 81 } },
        { competencyId: 'c2', scores: { bonifacio: 64, rizal: 61, plaridel: 68 } },
        { competencyId: 'c3', scores: { bonifacio: 58, rizal: 55, plaridel: 62 } },
        { competencyId: 'c4', scores: { bonifacio: 82, rizal: 79, plaridel: 85 } }
      ]
    }
  }
};
