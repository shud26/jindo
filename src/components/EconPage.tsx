import { useState, useRef } from "react";
import { type EconMemo } from "../useEconMemos";
import "./EconPage.css";

interface Props {
  memos: EconMemo[];
  onAdd: (keywords: string, content: string) => void;
  onDelete: (id: string) => void;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
  return `${d.getMonth() + 1}월 ${d.getDate()}일 (${weekdays[d.getDay()]})`;
}

function groupByDate(memos: EconMemo[]): Record<string, EconMemo[]> {
  return memos.reduce((acc, m) => {
    if (!acc[m.date]) acc[m.date] = [];
    acc[m.date].push(m);
    return acc;
  }, {} as Record<string, EconMemo[]>);
}

export default function EconPage({ memos, onAdd, onDelete }: Props) {
  const [keywords, setKeywords] = useState("");
  const [content, setContent] = useState("");
  const contentRef = useRef<HTMLTextAreaElement>(null);

  function handleAdd() {
    if (!content.trim()) return;
    onAdd(keywords, content);
    setKeywords("");
    setContent("");
  }

  const grouped = groupByDate(memos);
  const dates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  return (
    <div className="econ-page">
      {/* 입력 카드 */}
      <div className="econ-input-card">
        <div className="econ-input-header">
          <span className="econ-input-title">📰 오늘의 경제 메모</span>
          <span className="econ-input-date">{formatDate(new Date().toISOString().slice(0, 10))}</span>
        </div>
        <input
          className="econ-keywords"
          type="text"
          placeholder="키워드 (예: 금리, 환율, 반도체)"
          value={keywords}
          onChange={e => setKeywords(e.target.value)}
        />
        <textarea
          ref={contentRef}
          className="econ-content"
          placeholder="핵심 내용을 메모하세요..."
          value={content}
          onChange={e => setContent(e.target.value)}
          rows={4}
        />
        <button className="econ-save-btn" onClick={handleAdd}>저장 ✓</button>
      </div>

      {/* 기록 목록 */}
      {dates.length === 0 && (
        <div className="econ-empty">아직 메모가 없어요. 오늘 읽은 경제 기사를 기록해보세요!</div>
      )}
      {dates.map(date => (
        <div key={date} className="econ-date-group">
          <div className="econ-date-label">{formatDate(date)}</div>
          {grouped[date].map(m => (
            <div key={m.id} className="econ-memo-card">
              {m.keywords && (
                <div className="econ-memo-keywords">
                  {m.keywords.split(/[,，\s]+/).filter(Boolean).map(k => (
                    <span key={k} className="econ-tag">#{k}</span>
                  ))}
                </div>
              )}
              <p className="econ-memo-content">{m.content}</p>
              <button className="econ-delete" onClick={() => onDelete(m.id)}>×</button>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
