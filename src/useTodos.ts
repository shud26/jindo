import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";

export type TodoCategory = "homeroom" | "class";

export interface Todo {
  id: string;
  category: TodoCategory;
  text: string;
  done: boolean;
  date: string;
  createdAt: string;
}

function today(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    supabase
      .from("jindo_todos")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data) {
          setTodos(
            data.map((t) => ({
              id: t.id,
              category: t.category as TodoCategory,
              text: t.text,
              done: t.done,
              date: t.date,
              createdAt: t.created_at,
            }))
          );
        }
      });
  }, []);

  async function addTodo(text: string, category: TodoCategory, date?: string) {
    if (!text.trim()) return;
    const newTodo: Todo = {
      id: Date.now().toString(),
      category,
      text: text.trim(),
      done: false,
      date: date ?? today(),
      createdAt: new Date().toISOString(),
    };
    const { error } = await supabase.from("jindo_todos").insert({
      id: newTodo.id,
      category: newTodo.category,
      text: newTodo.text,
      done: newTodo.done,
      date: newTodo.date,
      created_at: newTodo.createdAt,
    });
    if (!error) setTodos((prev) => [newTodo, ...prev]);
  }

  async function toggleTodo(id: string) {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;
    const { error } = await supabase
      .from("jindo_todos")
      .update({ done: !todo.done })
      .eq("id", id);
    if (!error) {
      setTodos((prev) =>
        prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
      );
    }
  }

  async function deleteTodo(id: string) {
    await supabase.from("jindo_todos").delete().eq("id", id);
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }

  function getTodosByCategory(category: TodoCategory): Todo[] {
    return todos.filter((t) => t.category === category);
  }

  return { todos, addTodo, toggleTodo, deleteTodo, getTodosByCategory };
}
