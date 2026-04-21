import { useState, useRef } from "react";
import type { CalEvent } from "../useEvents";

interface Props {
  events: CalEvent[];
  onAdd: (date: string, title: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const DAY_NAMES = ["일", "월", "화", "수", "목", "금", "토"];

function getToday(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export default function CalendarPage({ events, onAdd, onDelete }: Props) {
  const today = getToday();
  const todayDate = new Date();

  const [year, setYear] = useState(todayDate.getFullYear());
  const [month, setMonth] = useState(todayDate.getMonth() + 1);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function eventsFor(date: string) {
    return events.filter((e) => e.date === date);
  }

  // 달력 그리드 계산
  const firstDay = new Date(year, month - 1, 1).getDay(); // 0=일
  const daysInMonth = new Date(year, month, 0).getDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  function prevMonth() {
    if (month === 1) { setYear((y) => y - 1); setMonth(12); }
    else setMonth((m) => m - 1);
    setSelectedDate(null);
  }
  function nextMonth() {
    if (month === 12) { setYear((y) => y + 1); setMonth(1); }
    else setMonth((m) => m + 1);
    setSelectedDate(null);
  }

  function dateStr(day: number) {
    return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  }

  async function handleAdd() {
    if (!selectedDate || !input.trim()) return;
    await onAdd(selectedDate, input);
    setInput("");
    inputRef.current?.focus();
  }

  const selectedEvents = selectedDate ? eventsFor(selectedDate) : [];

  // 이번 달 이벤트 있는 날 수 (뱃지용)
  const monthPrefix = `${year}-${String(month).padStart(2, "0")}`;
  const monthEventCount = events.filter((e) => e.date.startsWith(monthPrefix)).length;

  return (
    <div className="cal-page">
      {/* 월 네비게이션 */}
      <div className="cal-nav-row">
        <button className="cal-nav-btn" onClick={prevMonth}>‹</button>
        <div className="cal-month-label">
          <span className="cal-month-text">{year}년 {month}월</span>
          {monthEventCount > 0 && (
            <span className="cal-month-badge">{monthEventCount}</span>
          )}
        </div>
        <button className="cal-nav-btn" onClick={nextMonth}>›</button>
      </div>

      {/* 요일 헤더 */}
      <div className="cal-grid">
        {DAY_NAMES.map((d, i) => (
          <div
            key={d}
            className={`cal-dayname ${i === 0 ? "sun" : ""} ${i === 6 ? "sat" : ""}`}
          >
            {d}
          </div>
        ))}

        {/* 날짜 셀 */}
        {cells.map((day, i) => {
          if (day === null) return <div key={`empty-${i}`} className="cal-empty-cell" />;
          const ds = dateStr(day);
          const evs = eventsFor(ds);
          const isToday = ds === today;
          const isSelected = ds === selectedDate;
          const isSun = i % 7 === 0;
          const isSat = i % 7 === 6;

          return (
            <button
              key={ds}
              className={[
                "cal-cell",
                isToday ? "today" : "",
                isSelected ? "selected" : "",
                isSun ? "sun" : "",
                isSat ? "sat" : "",
              ].filter(Boolean).join(" ")}
              onClick={() => setSelectedDate(ds === selectedDate ? null : ds)}
            >
              <span className="cal-day-num">{day}</span>
              {evs.length > 0 && (
                <div className="cal-dots">
                  {evs.slice(0, 3).map((_, j) => (
                    <span key={j} className="cal-dot" />
                  ))}
                  {evs.length > 3 && <span className="cal-dot-more">+</span>}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* 선택된 날짜 패널 */}
      {selectedDate && (
        <div className="cal-panel">
          <div className="cal-panel-header">
            <span className="cal-panel-date">
              {selectedDate.replace(/-/g, ".")}
            </span>
            <span className="cal-panel-count">
              {selectedEvents.length > 0 ? `${selectedEvents.length}개` : "일정 없음"}
            </span>
          </div>

          {selectedEvents.length > 0 && (
            <ul className="cal-event-list">
              {selectedEvents.map((ev) => (
                <li key={ev.id} className="cal-event-item">
                  <span className="cal-event-dot" />
                  <span className="cal-event-title">{ev.title}</span>
                  <button
                    className="cal-event-del"
                    onClick={() => onDelete(ev.id)}
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          )}

          <div className="cal-add-row">
            <input
              ref={inputRef}
              className="cal-input"
              placeholder="일정 입력 후 Enter"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleAdd(); }}
              autoFocus
            />
            <button className="cal-add-btn" onClick={handleAdd}>
              추가
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
