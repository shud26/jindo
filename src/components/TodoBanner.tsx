import { useState, useRef } from "react";
import { type TodoCategory, type Todo } from "../useTodos";
import "./TodoBanner.css";

interface Props {
  todos: Todo[];
  onAdd: (text: string, category: TodoCategory) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const CATEGORY_LABEL: Record<TodoCategory, string> = {
  homeroom: "담임",
  class: "수업",
};

function formatDate(dateStr: string): string {
  // dateStr: YYYY-MM-DD
  const [y, m, d] = dateStr.split("-");
  const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
  const day = weekdays[new Date(`${y}-${m}-${d}`).getDay()];
  return `${Number(m)}/${Number(d)} (${day})`;
}

function todayStr(): string {
  return new Date().toLocaleDateString("ko-KR", {
    year: "numeric", month: "2-digit", day: "2-digit",
  }).replace(/\. /g, "-").replace(".", "").trim();
}

export default function TodoBanner({ todos, onAdd, onToggle, onDelete }: Props) {
  const [tab, setTab] = useState<TodoCategory>("homeroom");
  const [input, setInput] = useState("");
  const [showAll, setShowAll] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const today = todayStr();
  const filtered = todos.filter(t => t.category === tab);
  const todayTodos = filtered.filter(t => t.date === today);
  const olderTodos = filtered.filter(t => t.date !== today);

  const doneCnt = filtered.filter(t => t.done).length;
  const totalCnt = filtered.length;

  function handleAdd() {
    if (!input.trim()) return;
    onAdd(input, tab);
    setInput("");
    inputRef.current?.focus();
  }

  // 날짜별 그룹핑 (오래된 항목용)
  const olderGrouped = olderTodos.reduce<Record<string, Todo[]>>((acc, t) => {
    if (!acc[t.date]) acc[t.date] = [];
    acc[t.date].push(t);
    return acc;
  }, {});
  const olderDates = Object.keys(olderGrouped).sort().reverse();

  return (
    <section className="todo-banner">
      {/* 헤더 */}
      <div className="todo-header">
        <div className="todo-title-row">
          <span className="todo-title">✅ 할 일</span>
          <span className="todo-date">
            {new Date().toLocaleDateString("ko-KR", {
              month: "long", day: "numeric", weekday: "short"
            })}
          </span>
        </div>
        <div className="todo-tabs">
          {(["homeroom", "class"] as TodoCategory[]).map(c => (
            <button
              key={c}
              className={`todo-tab ${tab === c ? "active" : ""}`}
              onClick={() => setTab(c)}
            >
              {CATEGORY_LABEL[c]}
              {todos.filter(t => t.category === c && !t.done).length > 0 && (
                <span className="todo-badge">
                  {todos.filter(t => t.category === c && !t.done).length}
                </span>
              )}
            </button>
          ))}
          {totalCnt > 0 && (
            <span className="todo-progress">{doneCnt}/{totalCnt}</span>
          )}
        </div>
      </div>

      {/* 오늘 할 일 */}
      <ul className="todo-list">
        {todayTodos.length === 0 && (
          <li className="todo-empty">오늘 {CATEGORY_LABEL[tab]} 할 일이 없어요</li>
        )}
        {todayTodos.map(t => (
          <TodoItem key={t.id} todo={t} onToggle={onToggle} onDelete={onDelete} />
        ))}
      </ul>

      {/* 이전 날짜 항목 (펼치기) */}
      {olderTodos.length > 0 && (
        <button className="show-older" onClick={() => setShowAll(v => !v)}>
          {showAll ? "▲ 이전 항목 접기" : `▼ 이전 항목 ${olderTodos.length}개 보기`}
        </button>
      )}
      {showAll && olderDates.map(date => (
        <div key={date} className="older-group">
          <div className="older-date">{formatDate(date)}</div>
          <ul className="todo-list">
            {olderGrouped[date].map(t => (
              <TodoItem key={t.id} todo={t} onToggle={onToggle} onDelete={onDelete} />
            ))}
          </ul>
        </div>
      ))}

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
