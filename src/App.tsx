import { useState } from "react";
import { type Grade, CLASS_MAP } from "./types";
import { useRecords } from "./useRecords";
import { useTodos } from "./useTodos";
import { useEconMemos } from "./useEconMemos";
import { useEvents } from "./useEvents";
import ClassGrid from "./components/ClassGrid";
import ClassSheet from "./components/ClassSheet";
import TodoBanner from "./components/TodoBanner";
import EconPage from "./components/EconPage";
import CalendarPage from "./components/CalendarPage";
import "./App.css";

type Tab = "class" | "cal" | "econ" | "todo";

export default function App() {
  const [tab, setTab] = useState<Tab>("class");
  const [grade, setGrade] = useState<Grade>(1);
  const [selectedClass, setSelectedClass] = useState<number | null>(null);

  const { addRecord, getLastRecord, getClassRecords, deleteRecord, updateRecord } = useRecords();
  const { todos, addTodo, toggleTodo, deleteTodo } = useTodos();
  const { memos, addMemo, deleteMemo } = useEconMemos();
  const { events, addEvent, deleteEvent } = useEvents();

  const classes = CLASS_MAP[grade];

  function handleSave(memo: string, editId?: string) {
    if (editId) {
      updateRecord(editId, { grade, classNum: selectedClass!, memo });
    } else {
      addRecord({ grade, classNum: selectedClass!, memo });
    }
  }

  return (
    <div className="app">
      {/* 헤더 */}
      {tab === "class" && (
        <header className="header">
          <h1 className="title">📚 수업 진도</h1>
          <div className="grade-tabs">
            {([1, 3] as Grade[]).map((g) => (
              <button
                key={g}
                className={`grade-tab ${grade === g ? "active" : ""}`}
                onClick={() => { setGrade(g); setSelectedClass(null); }}
              >
                {g}학년
              </button>
            ))}
          </div>
        </header>
      )}
      {tab === "cal" && (
        <header className="header header-simple">
          <h1 className="title">📅 캘린더</h1>
        </header>
      )}
      {tab === "econ" && (
        <header className="header header-simple">
          <h1 className="title">📰 경제 메모</h1>
        </header>
      )}
      {tab === "todo" && (
        <header className="header header-simple">
          <h1 className="title">✅ 할 일</h1>
        </header>
      )}

      {/* 메인 콘텐츠 */}
      <main className="main">
        {tab === "class" && (
          <ClassGrid
            grade={grade}
            classes={classes}
            getLastRecord={getLastRecord}
            onSelect={setSelectedClass}
          />
        )}
        {tab === "cal" && (
          <CalendarPage
            events={events}
            onAdd={addEvent}
            onDelete={deleteEvent}
          />
        )}
        {tab === "econ" && (
          <EconPage
            memos={memos}
            onAdd={addMemo}
            onDelete={deleteMemo}
          />
        )}
        {tab === "todo" && (
          <TodoBanner
            todos={todos}
            onAdd={addTodo}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
          />
        )}
      </main>

      {/* 반 상세 페이지 */}
      {selectedClass !== null && (
        <ClassSheet
          grade={grade}
          classNum={selectedClass}
          records={getClassRecords(grade, selectedClass)}
          onSave={handleSave}
          onDelete={deleteRecord}
          onClose={() => setSelectedClass(null)}
        />
      )}

      {/* 하단 네비게이션 (반 선택 중엔 숨김) */}
      <nav className={`bottom-nav ${selectedClass !== null ? "hidden" : ""}`}>
        <button className={`nav-item ${tab === "class" ? "active" : ""}`} onClick={() => setTab("class")}>
          <span className="nav-icon">📚</span>
          <span className="nav-label">수업</span>
        </button>
        <button className={`nav-item ${tab === "cal" ? "active" : ""}`} onClick={() => setTab("cal")}>
          <span className="nav-icon">📅</span>
          <span className="nav-label">캘린더</span>
        </button>
        <button className={`nav-item ${tab === "econ" ? "active" : ""}`} onClick={() => setTab("econ")}>
          <span className="nav-icon">📰</span>
          <span className="nav-label">경제</span>
        </button>
        <button className={`nav-item ${tab === "todo" ? "active" : ""}`} onClick={() => setTab("todo")}>
          <span className="nav-icon">✅</span>
          <span className="nav-label">할 일</span>
        </button>
      </nav>
    </div>
  );
}
