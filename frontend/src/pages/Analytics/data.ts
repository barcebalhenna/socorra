// Mock data for Grading Summary
export const ACADEMIC_YEARS = [
  "SY 2025-2026",
  "SY 2024-2025",
  "SY 2023-2024",
];

export const SECTIONS = [
  { id: "g7-rizal", gradeLevel: "Grade 7", name: "Rizal" },
  { id: "g7-luna", gradeLevel: "Grade 7", name: "Luna" },
  { id: "g8-bonifacio", gradeLevel: "Grade 8", name: "Bonifacio" },
];

export const SUBJECTS = [
  "Filipino",
  "English",
  "Mathematics",
  "Science",
  "Araling Panlipunan",
];

export interface StudentGrade {
  id: string;
  name: string;
  lrn: string;
  q1: number | null;
  q2: number | null;
  q3: number | null;
  q4: number | null;
}

const MOCK_STUDENTS: StudentGrade[] = [
  { id: "1", name: "Abad, Maria Clarita", lrn: "102345678901", q1: 76, q2: 74, q3: 76, q4: 76 },
  { id: "2", name: "Aquino, Juan Miguel", lrn: "102345678902", q1: 94, q2: 91, q3: 87, q4: 94 },
  { id: "3", name: "Bautista, Lourdes Mae", lrn: "102345678903", q1: 84, q2: 83, q3: 89, q4: 81 },
  { id: "4", name: "Cruz, Reginald Paolo", lrn: "102345678904", q1: 83, q2: 75, q3: 82, q4: null },
  { id: "5", name: "De Leon, Angelica Joy", lrn: "102345678905", q1: 95, q2: 94, q3: 97, q4: 90 },
  { id: "6", name: "Enriquez, Francis Andrei", lrn: "102345678906", q1: 78, q2: 75, q3: 81, q4: 77 },
  { id: "7", name: "Flores, Hannah Grace", lrn: "102345678907", q1: 86, q2: 82, q3: 81, q4: 78 },
  { id: "8", name: "Garcia, Kristopher Jay", lrn: "102345678908", q1: 87, q2: 95, q3: 91, q4: 94 },
  { id: "9", name: "Hernandez, Sofia Lyn", lrn: "102345678909", q1: 92, q2: 95, q3: 95, q4: 86 },
  { id: "10", name: "Ignacio, Robert Louis", lrn: "102345678910", q1: 93, q2: 95, q3: 97, q4: 92 },
  { id: "11", name: "Jimenez, Patricia Ann", lrn: "102345678911", q1: 88, q2: 86, q3: 84, q4: 87 },
  { id: "12", name: "Kalaw, Benjamin Jose", lrn: "102345678912", q1: 79, q2: 77, q3: 78, q4: 80 },
  { id: "13", name: "Lopez, Catherine May", lrn: "102345678913", q1: 91, q2: 93, q3: 90, q4: 92 },
  { id: "14", name: "Mendoza, Rafael Luis", lrn: "102345678914", q1: 85, q2: 87, q3: 86, q4: 88 },
  { id: "15", name: "Navarro, Isabel Marie", lrn: "102345678915", q1: 96, q2: 94, q3: 95, q4: 97 },
  { id: "16", name: "Ocampo, Daniel Marco", lrn: "102345678916", q1: 74, q2: 72, q3: 73, q4: 75 },
  { id: "17", name: "Perez, Jasmine Nicole", lrn: "102345678917", q1: 82, q2: 84, q3: 83, q4: 85 },
  { id: "18", name: "Reyes, Emmanuel James", lrn: "102345678918", q1: 90, q2: 92, q3: 91, q4: 93 },
  { id: "19", name: "Santos, Maricel Rose", lrn: "102345678919", q1: 77, q2: 79, q3: 78, q4: 76 },
  { id: "20", name: "Torres, Adrian Paul", lrn: "102345678920", q1: 95, q2: 96, q3: 94, q4: 95 },
  { id: "21", name: "Uy, Michelle Grace", lrn: "102345678921", q1: 89, q2: 88, q3: 90, q4: 89 },
  { id: "22", name: "Villanueva, Ryan Carlo", lrn: "102345678922", q1: 81, q2: 83, q3: 82, q4: 84 },
  { id: "23", name: "Wong, Andrea Faith", lrn: "102345678923", q1: 73, q2: 71, q3: 74, q4: 72 },
  { id: "24", name: "Yap, Christian Dale", lrn: "102345678924", q1: 86, q2: 85, q3: 87, q4: 88 },
  { id: "25", name: "Zamora, Samantha Mae", lrn: "102345678925", q1: 92, q2: 90, q3: 93, q4: 91 },
  { id: "26", name: "Alvarez, Joshua Miguel", lrn: "102345678926", q1: 80, q2: 82, q3: 81, q4: 79 },
  { id: "27", name: "Bernardo, Kristine Joy", lrn: "102345678927", q1: 94, q2: 95, q3: 96, q4: 94 },
];

export function getGrades(_sectionId: string, _subject: string): StudentGrade[] {
  // In a real app, filter by section and subject
  return MOCK_STUDENTS;
}

export function getFinalAverage(grade: StudentGrade): number | null {
  const quarters = [grade.q1, grade.q2, grade.q3, grade.q4].filter(
    (q): q is number => q !== null
  );
  if (quarters.length === 0) return null;
  return quarters.reduce((a, b) => a + b, 0) / quarters.length;
}

export function getDescriptor(grade: number): string {
  if (grade >= 90) return "Outstanding";
  if (grade >= 85) return "Very Satisfactory";
  if (grade >= 80) return "Satisfactory";
  if (grade >= 75) return "Fairly Satisfactory";
  return "Did Not Meet Expectations";
}
