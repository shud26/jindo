import { useState, useEffect } from "react";

export interface EconMemo {
  id: string;
  date: string;       // YYYY-MM-DD
  keywords: string;
  content: string;
  createdAt: string;
}

const STORAGE_KEY = "jindo_econ_memos";

export function useEconMemos() {
  const [memos, setMemos] = useState<EconMemo[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(memos));
  }, [memos]);

  function addMemo(keywords: string, content: string) {
    if (!content.trim()) return;
    const today = new Date();
    const date = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    const memo: EconMemo = {
      id: Date.now().toString(),
      date,
      keywords: keywords.trim(),
      content: content.trim(),
      createdAt: today.toISOString(),
    };
    setMemos(prev => [memo, ...prev]);
  }

  function deleteMemo(id: string) {
    setMemos(prev => prev.filter(m => m.id !== id));
  }

  return { memos, addMemo, deleteMemo };
}
