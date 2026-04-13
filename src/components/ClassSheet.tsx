import { useState, useRef, useEffect } from "react";
import { type Grade, type ProgressRecord } from "../types";
import "./ClassSheet.css";

interface Props {
  grade: Grade;
  classNum: number;
  records: ProgressRecord[];
  onSave: (memo: string, editId?: string) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diffMin = Math.floor((now.getTime() - d.getTime()) / 60000);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);
  if (diffMin < 1) return "방금 전";
  if (diffMin < 60) return `${diffMin}분 전`;
  if (diffHr < 24) return `${diffHr}시간 전`;
  if (diffDay < 7) return `${diffDay}일 전`;
  return d.toLocaleDateString("ko-KR", { month: "short", day: "numeric" }) +
    " " + d.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" });
}

export default function ClassSheet({ grade, classNum, records, onSave, onDelete, onClose }: Props) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [memo, setMemo] = useState("");
  const memoRef = useRef<HTMLInputElement>(null);

  function startEdit(r: ProgressRecord) {
    setEditingId(r.id);
    setMemo(r.memo);
    memoRef.current?.focus();
    memoRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function cancelEdit() {
    setEditingId(null);
    setMemo("");
  }

  function handleSave() {
    if (!memo.trim()) return;
    onSave(memo.trim(), editingId ?? undefined);
    setEditingId(null);
    setMemo("");
  }

  function handleBackdrop(e: React.MouseEvent) {
    if (e.target === e.currentTarget) onClose();
  }

  useEffect(() => {
    memoRef.current?.focus();
  }, []);

  return (
    <div className="sheet-backdrop" onClick={handleBackdrop}>
      <div className="sheet">
        <div className="sheet-handle" />

        <div className="sheet-header">
          <h2 className="sheet-title">{grade}-{classNum}반</h2>
          <button className="sheet-close" onClick={onClose}>✕</button>
        </div>

        {/* 입력 폼 */}
        <div className={`sheet-form ${editingId ? "editing" : ""}`}>
          {editingId && (
            <div className="edit-banner">
              ✏️ 기록 수정 중
              <button className="edit-cancel" onClick={cancelEdit}>취소</button>
            </div>
          )}

          <input
            ref={memoRef}
            className="memo-input"
            type="text"
            placeholder="수업 메모 입력..."
            value={memo}
            onChange={e => setMemo(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSave()}
          />

          <button className="save-btn" onClick={handleSave}>
            {editingId ? "수정 완료 ✓" : "저장 ✓"}
          </button>
        </div>

        {/* 기록 목록 */}
        {records.length > 0 && (
          <div className="sheet-records">
            <div className="records-label">기록 ({records.length})</div>
            <ul className="records-list">
              {records.map((r) => (
                <li key={r.id} className={`record-row ${editingId === r.id ? "active" : ""}`}>
                  <div className="record-info">
                    <span className="record-memo">{r.memo || "메모 없음"}</span>
                    <span className="record-time">{formatDateTime(r.timestamp)}</span>
                  </div>
                  <div className="record-actions">
                    <button className="btn-edit" onClick={() => startEdit(r)}>수정</button>
                    <button className="btn-delete" onClick={() => onDelete(r.id)}>삭제</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
