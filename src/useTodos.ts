import { useState, useEffect } from "react";

export type TodoCategory = "homeroom" | "class";

export interface Todo {
  id: string;
  category: TodoCategory;
  text: string;
  done: boolean;
  date: string;      // YYYY-MM-DD
  createdAt: string;
}

const STORAGE_KEY = "jindo_todos";

function today(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed: Todo[] = JSON.parse(raw);
      // 구형 todo에 date 없는 경우 오늘 날짜로 보정
      return parsed.map(t => t.date ? t : { ...t, date: today() });
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  function addTodo(text: string, category: TodoCategory, date?: string) {
    if (!text.trim()) return;
    const newTodo: Todo = {
      id: Date.now().toString(),
      category,
      text: text.trim(),
      done: false,
      date: date ?? today(),
      createdAt: new Date().toISOString(),
    };
    setTodos(prev => [newTodo, ...prev]);
  }

  function toggleTodo(id: string) {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  }

  function deleteTodo(id: string) {
    setTodos(prev => prev.filter(t => t.id !== id));
  }

  function getTodosByCategory(category: TodoCategory): Todo[] {
    return todos.filter(t => t.category === category);
  }

  return { todos, addTodo, toggleTodo, deleteTodo, getTodosByCategory };
}
