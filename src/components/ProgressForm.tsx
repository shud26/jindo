import { useState, useEffect, useRef } from "react";
import { type Grade, type ProgressRecord } from "../types";
import "./ProgressForm.css";

interface Props {
  grade: Grade;
  classNum: number;
  lastRecord?: ProgressRecord;
  onSave: (unit: number, lesson: number, memo: string) => void;
  onClose: () => void;
}

export default function ProgressForm({ grade, classNum, lastRecord, onSave, onClose }: Props) {
  const [unit, setUnit] = useState(lastRecord?.unit ?? 1);
  const [lesson, setLesson] = useState(lastRecord ? lastRecord.lesson + 1 : 1);
  const [memo, setMemo] = useState("");
  const unitRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    unitRef.current?.focus();
  }, []);

  // 배경 클릭 시 닫기
  function handleBackdrop(e: React.MouseEvent) {
    if (e.target === e.currentTarget) onClose();
  }

  function handleSave() {
    if (unit < 1 || lesson < 1) return;
    onSave(unit, lesson, memo.trim());
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") handleSave();
    if (e.key === "Escape") onClose();
  }

  return (
    <div className="form-backdrop" onClick={handleBackdrop}>
      <div className="form-sheet" onKeyDown={handleKeyDown}>
        <div className="form-handle" />

        <div className="form-header">
          <h2 className="form-title">{grade}-{classNum}반 진도 입력</h2>
          <button className="form-close" onClick={onClose}>✕</button>
        </div>

        {lastRecord && (
          <div className="form-last">
            이전: {lastRecord.unit}단원 {lastRecord.lesson}차시
          </div>
        )}

        <div className="form-row">
          <div className="form-field">
            <label>단원</label>
            <div className="num-input">
              <button onClick={() => setUnit(u => Math.max(1, u - 1))}>−</button>
              <input
                ref={unitRef}
                type="number"
                min={1}
                value={unit}
                onChange={e => setUnit(Number(e.target.value))}
              />
              <button onClick={() => setUnit(u => u + 1)}>＋</button>
            </div>
          </div>

          <div className="form-field">
            <label>차시</label>
            <div className="num-input">
              <button onClick={() => setLesson(l => Math.max(1, l - 1))}>−</button>
              <input
                type="number"
                min={1}
                value={lesson}
                onChange={e => setLesson(Number(e.target.value))}
              />
              <button onClick={() => setLesson(l => l + 1)}>＋</button>
            </div>
          </div>
        </div>

        <div className="form-field">
          <label>메모 (선택)</label>
          <input
            className="memo-input"
            type="text"
            placeholder="예: 모둠활동, 진도 느림..."
            value={memo}
            onChange={e => setMemo(e.target.value)}
          />
        </div>

        <button className="save-btn" onClick={handleSave}>
          저장 ✓
        </button>
      </div>
    </div>
  );
}
