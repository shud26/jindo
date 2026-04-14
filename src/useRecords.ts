import { useState, useEffect } from "react";
import { type ProgressRecord, type Grade } from "./types";
import { supabase } from "./lib/supabase";

export function useRecords() {
  const [records, setRecords] = useState<ProgressRecord[]>([]);

  useEffect(() => {
    supabase
      .from("jindo_records")
      .select("*")
      .order("timestamp", { ascending: false })
      .then(({ data }) => {
        if (data) {
          setRecords(
            data.map((r) => ({
              id: r.id,
              grade: r.grade as Grade,
              classNum: r.class_num,
              memo: r.memo,
              timestamp: r.timestamp,
            }))
          );
        }
      });
  }, []);

  async function addRecord(data: Omit<ProgressRecord, "id" | "timestamp">) {
    const newRecord: ProgressRecord = {
      ...data,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    };
    const { error } = await supabase.from("jindo_records").insert({
      id: newRecord.id,
      grade: newRecord.grade,
      class_num: newRecord.classNum,
      memo: newRecord.memo,
      timestamp: newRecord.timestamp,
    });
    if (!error) setRecords((prev) => [newRecord, ...prev].slice(0, 200));
  }

  function getLastRecord(grade: Grade, classNum: number): ProgressRecord | undefined {
    return records.find((r) => r.grade === grade && r.classNum === classNum);
  }

  function getClassRecords(grade: Grade, classNum: number): ProgressRecord[] {
    return records.filter((r) => r.grade === grade && r.classNum === classNum);
  }

  async function deleteRecord(id: string) {
    await supabase.from("jindo_records").delete().eq("id", id);
    setRecords((prev) => prev.filter((r) => r.id !== id));
  }

  async function updateRecord(id: string, data: Omit<ProgressRecord, "id" | "timestamp">) {
    const { error } = await supabase
      .from("jindo_records")
      .update({ grade: data.grade, class_num: data.classNum, memo: data.memo })
      .eq("id", id);
    if (!error) {
      setRecords((prev) =>
        prev.map((r) => (r.id === id ? { ...r, ...data } : r))
      );
    }
  }

  return { records, addRecord, getLastRecord, getClassRecords, deleteRecord, updateRecord };
}
