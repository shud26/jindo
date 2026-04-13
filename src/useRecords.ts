import { useState, useEffect } from "react";
import { type ProgressRecord, type Grade } from "./types";

const STORAGE_KEY = "jindo_records";

export function useRecords() {
  const [records, setRecords] = useState<ProgressRecord[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  }, [records]);

  function addRecord(data: Omit<ProgressRecord, "id" | "timestamp">) {
    const newRecord: ProgressRecord = {
      ...data,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    };
    setRecords((prev) => [newRecord, ...prev].slice(0, 100)); // 최대 100개
  }

  function getLastRecord(grade: Grade, classNum: number): ProgressRecord | undefined {
    return records.find((r) => r.grade === grade && r.classNum === classNum);
  }

  function getRecentRecords(limit = 10): ProgressRecord[] {
    return records.slice(0, limit);
  }

  function deleteRecord(id: string) {
    setRecords((prev) => prev.filter((r) => r.id !== id));
  }

  return { records, addRecord, getLastRecord, getRecentRecords, deleteRecord };
}
