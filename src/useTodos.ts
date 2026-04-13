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
  return new Date().toLocaleDateString("ko-KR", {
    year: "numeric", month: "2-digit", day: "2-digit",
  }).replace(/\. /g, "-").replace(".", "").trim();
}

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  function addTodo(text: string, category: TodoCategory) {
    if (!text.trim()) return;
    const newTodo: Todo = {
      id: Date.now().toString(),
      category,
      text: text.trim(),
      done: false,
      date: today(),
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
