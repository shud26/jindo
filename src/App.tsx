import { useState } from "react";
import { type Grade, CLASS_MAP } from "./types";
import { useRecords } from "./useRecords";
import { useTodos } from "./useTodos";
import ClassGrid from "./components/ClassGrid";
import ClassSheet from "./components/ClassSheet";
import TodoBanner from "./components/TodoBanner";
import "./App.css";

export default function App() {
  const [grade, setGrade] = useState<Grade>(1);
  const [selectedClass, setSelectedClass] = useState<number | null>(null);
  const { addRecord, getLastRecord, getClassRecords, deleteRecord, updateRecord } = useRecords();
  const { todos, addTodo, toggleTodo, deleteTodo } = useTodos();

  const classes = CLASS_MAP[grade];

  function handleSave(unit: number, lesson: number, memo: string, editId?: string) {
    if (editId) {
      updateRecord(editId, { grade, classNum: selectedClass!, unit, lesson, memo });
    } else {
      addRecord({ grade, classNum: selectedClass!, unit, lesson, memo });
    }
  }

  return (
    <div className="app">
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

      <main className="main">
        <TodoBanner
          todos={todos}
          onAdd={addTodo}
          onToggle={toggleTodo}
          onDelete={deleteTodo}
        />
        <ClassGrid
          grade={grade}
          classes={classes}
          getLastRecord={getLastRecord}
          onSelect={setSelectedClass}
        />
      </main>

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
    </div>
  );
}
