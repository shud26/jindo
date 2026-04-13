export type Grade = 1 | 3;

export interface ClassInfo {
  grade: Grade;
  classNum: number;
  label: string; // "1-6반"
}

export interface ProgressRecord {
  id: string;
  grade: Grade;
  classNum: number;
  unit: number;
  lesson: number;
  memo: string;
  timestamp: string; // ISO string
}

export const CLASS_MAP: Record<Grade, number[]> = {
  1: [7, 8, 9, 10, 11],
  3: [8, 9, 10],
};
