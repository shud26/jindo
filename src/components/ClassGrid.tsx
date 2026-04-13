import { type Grade, type ProgressRecord } from "../types";
import "./ClassGrid.css";

interface Props {
  grade: Grade;
  classes: number[];
  getLastRecord: (grade: Grade, classNum: number) => ProgressRecord | undefined;
  onSelect: (classNum: number) => void;
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffMin < 1) return "방금";
  if (diffMin < 60) return `${diffMin}분 전`;
  if (diffHr < 24) return `${diffHr}시간 전`;
  if (diffDay < 7) return `${diffDay}일 전`;
  return d.toLocaleDateString("ko-KR", { month: "short", day: "numeric" });
}

export default function ClassGrid({ grade, classes, getLastRecord, onSelect }: Props) {
  return (
    <section className="class-grid-section">
      <div className="class-grid">
        {classes.map((num) => {
          const last = getLastRecord(grade, num);
          return (
            <button
              key={num}
              className={`class-card ${last ? "has-record" : ""}`}
              onClick={() => onSelect(num)}
            >
              <div className="class-label">{grade}-{num}반</div>
              {last ? (
                <div className="class-last">
                  <span className="last-jindo">{last.memo || "메모 없음"}</span>
                  <span className="last-time">{formatTime(last.timestamp)}</span>
                </div>
              ) : (
                <div className="class-empty">기록 없음</div>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
