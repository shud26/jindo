import { useState } from "react";
import { type ProgressRecord } from "../types";
import "./RecordList.css";

interface Props {
  records: ProgressRecord[];
  onDelete: (id: string) => void;
}

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffMin < 1) return "방금 전";
  if (diffMin < 60) return `${diffMin}분 전`;
  if (diffHr < 24) return `${diffHr}시간 전`;
  if (diffDay < 7) return `${diffDay}일 전`;
  return d.toLocaleDateString("ko-KR", { month: "long", day: "numeric" }) +
    " " + d.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" });
}

export default function RecordList({ records, onDelete }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (records.length === 0) return null;

  function toggle(id: string) {
    setExpandedId(prev => prev === id ? null : id);
  }

  return (
    <section className="record-section">
      <h3 className="record-title">최근 기록</h3>
      <ul className="record-list">
        {records.map((r) => {
          const isOpen = expandedId === r.id;
          return (
            <li key={r.id} className={`record-item ${isOpen ? "open" : ""}`}>
              {/* 탭하면 열리는 헤더 */}
              <button className="record-header" onClick={() => toggle(r.id)}>
                <div className="record-summary">
                  <span className="record-class">{r.grade}-{r.classNum}반</span>
                  <span className="record-jindo">{r.unit}단원 {r.lesson}차시</span>
                  {!isOpen && r.memo && (
                    <span className="record-memo-preview">{r.memo}</span>
                  )}
                </div>
                <div className="record-meta">
                  <span className="record-time">{formatDateTime(r.timestamp)}</span>
                  <span className={`record-chevron ${isOpen ? "up" : ""}`}>›</span>
                </div>
              </button>

              {/* 펼쳐지는 상세 내용 */}
              {isOpen && (
                <div className="record-detail">
                  <div className="detail-row">
                    <span className="detail-label">학년/반</span>
                    <span className="detail-value">{r.grade}학년 {r.classNum}반</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">진도</span>
                    <span className="detail-value">{r.unit}단원 {r.lesson}차시</span>
                  </div>
                  {r.memo ? (
                    <div className="detail-row">
                      <span className="detail-label">메모</span>
                      <span className="detail-value">{r.memo}</span>
                    </div>
                  ) : (
                    <div className="detail-row">
                      <span className="detail-label">메모</span>
                      <span className="detail-value detail-empty">없음</span>
                    </div>
                  )}
                  <div className="detail-row">
                    <span className="detail-label">기록 시간</span>
                    <span className="detail-value">{formatDateTime(r.timestamp)}</span>
                  </div>
                  <button
                    className="record-delete-btn"
                    onClick={() => onDelete(r.id)}
                  >
                    기록 삭제
                  </button>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
