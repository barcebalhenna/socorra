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
  t1: number | null;
  t2: number | null;
  t3: number | null;
}

const MOCK_STUDENTS: StudentGrade[] = [
  { id: "1", name: "Abad, Maria Clarita", lrn: "102345678901", t1: 76, t2: 74, t3: 76 },
  { id: "2", name: "Aquino, Juan Miguel", lrn: "102345678902", t1: 94, t2: 91, t3: 87 },
  { id: "3", name: "Bautista, Lourdes Mae", lrn: "102345678903", t1: 84, t2: 83, t3: 89 },
  { id: "4", name: "Cruz, Reginald Paolo", lrn: "102345678904", t1: 83, t2: 75, t3: 82 },
  { id: "5", name: "De Leon, Angelica Joy", lrn: "102345678905", t1: 95, t2: 94, t3: 97 },
  { id: "6", name: "Enriquez, Francis Andrei", lrn: "102345678906", t1: 78, t2: 75, t3: 81 },
  { id: "7", name: "Flores, Hannah Grace", lrn: "102345678907", t1: 86, t2: 82, t3: 81 },
  { id: "8", name: "Garcia, Kristopher Jay", lrn: "102345678908", t1: 87, t2: 95, t3: 91 },
  { id: "9", name: "Hernandez, Sofia Lyn", lrn: "102345678909", t1: 92, t2: 95, t3: 95 },
  { id: "10", name: "Ignacio, Robert Louis", lrn: "102345678910", t1: 93, t2: 95, t3: 97 },
  { id: "11", name: "Jimenez, Patricia Ann", lrn: "102345678911", t1: 88, t2: 86, t3: 84 },
  { id: "12", name: "Kalaw, Benjamin Jose", lrn: "102345678912", t1: 79, t2: 77, t3: 78 },
  { id: "13", name: "Lopez, Catherine May", lrn: "102345678913", t1: 91, t2: 93, t3: 90 },
  { id: "14", name: "Mendoza, Rafael Luis", lrn: "102345678914", t1: 85, t2: 87, t3: 86 },
  { id: "15", name: "Navarro, Isabel Marie", lrn: "102345678915", t1: 96, t2: 94, t3: 95 },
  { id: "16", name: "Ocampo, Daniel Marco", lrn: "102345678916", t1: 74, t2: 72, t3: 73 },
  { id: "17", name: "Perez, Jasmine Nicole", lrn: "102345678917", t1: 82, t2: 84, t3: 83 },
  { id: "18", name: "Reyes, Emmanuel James", lrn: "102345678918", t1: 90, t2: 92, t3: 91 },
  { id: "19", name: "Santos, Maricel Rose", lrn: "102345678919", t1: 77, t2: 79, t3: 78 },
  { id: "20", name: "Torres, Adrian Paul", lrn: "102345678920", t1: 95, t2: 96, t3: 94 },
  { id: "21", name: "Uy, Michelle Grace", lrn: "102345678921", t1: 89, t2: 88, t3: 90 },
  { id: "22", name: "Villanueva, Ryan Carlo", lrn: "102345678922", t1: 81, t2: 83, t3: 82 },
  { id: "23", name: "Wong, Andrea Faith", lrn: "102345678923", t1: 73, t2: 71, t3: 74 },
  { id: "24", name: "Yap, Christian Dale", lrn: "102345678924", t1: 86, t2: 85, t3: 87 },
  { id: "25", name: "Zamora, Samantha Mae", lrn: "102345678925", t1: 92, t2: 90, t3: 93 },
  { id: "26", name: "Alvarez, Joshua Miguel", lrn: "102345678926", t1: 80, t2: 82, t3: 81 },
  { id: "27", name: "Bernardo, Kristine Joy", lrn: "102345678927", t1: 94, t2: 95, t3: 96 },
];

export function getGrades(_sectionId: string, _subject: string): StudentGrade[] {
  // In a real app, filter by section and subject
  return MOCK_STUDENTS;
}

export function getFinalAverage(grade: StudentGrade): number | null {
  const terms = [grade.t1, grade.t2, grade.t3].filter(
    (t): t is number => t !== null
  );
  if (terms.length === 0) return null;
  return terms.reduce((a, b) => a + b, 0) / terms.length;
}

export function getDescriptor(grade: number): string {
  if (grade >= 90) return "Outstanding";
  if (grade >= 85) return "Very Satisfactory";
  if (grade >= 80) return "Satisfactory";
  if (grade >= 75) return "Fairly Satisfactory";
  return "Did Not Meet Expectations";
}
