import { useState, useRef } from "react";
import { type TodoCategory, type Todo } from "../useTodos";
import "./TodoBanner.css";

interface Props {
  todos: Todo[];
  onAdd: (text: string, category: TodoCategory, date: string) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const CATEGORY_LABEL: Record<TodoCategory, string> = {
  homeroom: "담임",
  class: "수업",
};

function toDateStr(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function formatDateLabel(dateStr: string): string {
  const today = toDateStr(new Date());
  const tomorrow = toDateStr(new Date(Date.now() + 86400000));
  const yesterday = toDateStr(new Date(Date.now() - 86400000));
  const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
  const d = new Date(dateStr + "T00:00:00");
  const dow = weekdays[d.getDay()];
  const label = `${d.getMonth() + 1}/${d.getDate()} (${dow})`;

  if (dateStr === today) return `오늘 · ${label}`;
  if (dateStr === tomorrow) return `내일 · ${label}`;
  if (dateStr === yesterday) return `어제 · ${label}`;
  if (dateStr > today) return `${label}`;
  return label;
}

export default function TodoBanner({ todos, onAdd, onToggle, onDelete }: Props) {
  const [tab, setTab] = useState<TodoCategory>("homeroom");
  const [input, setInput] = useState("");
  const [offset, setOffset] = useState(0); // 0=오늘, -1=어제, +1=내일
  const inputRef = useRef<HTMLInputElement>(null);

  const today = toDateStr(new Date());
  const selectedDate = toDateStr(new Date(Date.now() + offset * 86400000));
  const isToday = selectedDate === today;

  const byDate = todos.filter(t => t.category === tab && t.date === selectedDate);
  const doneCnt = byDate.filter(t => t.done).length;

  // 탭별 전체 미완료 개수 (날짜 무관)
  function undoneCount(cat: TodoCategory) {
    return todos.filter(t => t.category === cat && !t.done).length;
  }

  function handleAdd() {
    if (!input.trim()) return;
    onAdd(input, tab, selectedDate);
    setInput("");
    inputRef.current?.focus();
  }

  return (
    <section className="todo-banner">
      {/* 헤더 */}
      <div className="todo-header">
        <div className="todo-title-row">
          <span className="todo-title">✅ 할 일</span>
          {/* 날짜 네비게이션 */}
          <div className="date-nav">
            <button className="date-arrow" onClick={() => setOffset(o => o - 1)}>‹</button>
            <button
              className={`date-label ${isToday ? "today" : ""}`}
              onClick={() => setOffset(0)}
            >
              {formatDateLabel(selectedDate)}
            </button>
            <button className="date-arrow" onClick={() => setOffset(o => o + 1)}>›</button>
          </div>
        </div>

        {/* 담임/수업 탭 */}
        <div className="todo-tabs">
          {(["homeroom", "class"] as TodoCategory[]).map(c => (
            <button
              key={c}
              className={`todo-tab ${tab === c ? "active" : ""}`}
              onClick={() => setTab(c)}
            >
              {CATEGORY_LABEL[c]}
              {undoneCount(c) > 0 && (
                <span className="todo-badge">{undoneCount(c)}</span>
              )}
            </button>
          ))}
          {byDate.length > 0 && (
            <span className="todo-progress">{doneCnt}/{byDate.length}</span>
          )}
        </div>
      </div>

      {/* 할 일 목록 */}
      <ul className="todo-list">
        {byDate.length === 0 && (
          <li className="todo-empty">
            {formatDateLabel(selectedDate).split("·")[0].trim()} {CATEGORY_LABEL[tab]} 할 일이 없어요
          </li>
        )}
        {byDate.map(t => (
          <TodoItem key={t.id} todo={t} onToggle={onToggle} onDelete={onDelete} />
        ))}
      </ul>

      {/* 입력 */}
      <div className="todo-input-row">
        <input
          ref={inputRef}
          className="todo-input"
          type="text"
          placeholder={`${CATEGORY_LABEL[tab]} 할 일 추가...`}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleAdd()}
        />
        <button className="todo-add-btn" onClick={handleAdd}>+</button>
      </div>
    </section>
  );
}

function TodoItem({ todo, onToggle, onDelete }: {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <li className={`todo-item ${todo.done ? "done" : ""}`}>
      <button className="todo-check" onClick={() => onToggle(todo.id)}>
        {todo.done ? "✓" : ""}
      </button>
      <span className="todo-text">{todo.text}</span>
      <button className="todo-delete" onClick={() => onDelete(todo.id)}>×</button>
    </li>
  );
}
