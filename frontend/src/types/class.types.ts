export interface Student {
  id: number;
  name: string;
  ww1: number;
  ww2: number;
  ww3: number;
}

export interface HighestPossibleScores {
  ww1: number;
  ww2: number;
  ww3: number;
}

export interface ClassData {
  gradeSection: string;
  subject: string;
  highestPossibleScores: HighestPossibleScores;
  males: Student[];
  females: Student[];
}
