import { useState } from "react";
import { type Grade, CLASS_MAP } from "./types";
import { useRecords } from "./useRecords";
import ClassGrid from "./components/ClassGrid";
import ProgressForm from "./components/ProgressForm";
import RecordList from "./components/RecordList";
import "./App.css";

export default function App() {
  const [grade, setGrade] = useState<Grade>(1);
  const [selectedClass, setSelectedClass] = useState<number | null>(null);
  const { addRecord, getLastRecord, getRecentRecords, deleteRecord } = useRecords();

  const classes = CLASS_MAP[grade];

  function handleSave(unit: number, lesson: number, memo: string) {
    if (selectedClass === null) return;
    addRecord({ grade, classNum: selectedClass, unit, lesson, memo });
    setSelectedClass(null);
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
        <ClassGrid
          grade={grade}
          classes={classes}
          getLastRecord={getLastRecord}
          onSelect={setSelectedClass}
        />
        <RecordList
          records={getRecentRecords(8)}
          onDelete={deleteRecord}
        />
      </main>

      {selectedClass !== null && (
        <ProgressForm
          grade={grade}
          classNum={selectedClass}
          lastRecord={getLastRecord(grade, selectedClass)}
          onSave={handleSave}
          onClose={() => setSelectedClass(null)}
        />
      )}
    </div>
  );
}
