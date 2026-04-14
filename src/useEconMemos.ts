import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";

export interface EconMemo {
  id: string;
  date: string;
  keywords: string;
  content: string;
  createdAt: string;
}

export function useEconMemos() {
  const [memos, setMemos] = useState<EconMemo[]>([]);

  useEffect(() => {
    supabase
      .from("jindo_econ_memos")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data) {
          setMemos(
            data.map((m) => ({
              id: m.id,
              date: m.date,
              keywords: m.keywords,
              content: m.content,
              createdAt: m.created_at,
            }))
          );
        }
      });
  }, []);

  async function addMemo(keywords: string, content: string) {
    if (!content.trim()) return;
    const d = new Date();
    const date = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    const memo: EconMemo = {
      id: Date.now().toString(),
      date,
      keywords: keywords.trim(),
      content: content.trim(),
      createdAt: d.toISOString(),
    };
    const { error } = await supabase.from("jindo_econ_memos").insert({
      id: memo.id,
      date: memo.date,
      keywords: memo.keywords,
      content: memo.content,
      created_at: memo.createdAt,
    });
    if (!error) setMemos((prev) => [memo, ...prev]);
  }

  async function deleteMemo(id: string) {
    await supabase.from("jindo_econ_memos").delete().eq("id", id);
    setMemos((prev) => prev.filter((m) => m.id !== id));
  }

  return { memos, addMemo, deleteMemo };
}
