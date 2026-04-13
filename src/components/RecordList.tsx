import { type ProgressRecord } from "../types";
import "./RecordList.css";

interface Props {
  records: ProgressRecord[];
  onDelete: (id: string) => void;
}

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("ko-KR", {
    month: "numeric", day: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

export default function RecordList({ records, onDelete }: Props) {
  if (records.length === 0) return null;

  return (
    <section className="record-section">
      <h3 className="record-title">최근 기록</h3>
      <ul className="record-list">
        {records.map((r) => (
          <li key={r.id} className="record-item">
            <div className="record-main">
              <span className="record-class">{r.grade}-{r.classNum}반</span>
              <span className="record-jindo">{r.unit}단원 {r.lesson}차시</span>
              {r.memo && <span className="record-memo">{r.memo}</span>}
            </div>
            <div className="record-right">
              <span className="record-time">{formatDateTime(r.timestamp)}</span>
              <button
                className="record-delete"
                onClick={() => onDelete(r.id)}
                aria-label="삭제"
              >
                ×
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
