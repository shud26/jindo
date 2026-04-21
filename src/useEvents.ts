import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";

export interface CalEvent {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  createdAt: string;
}

export function useEvents() {
  const [events, setEvents] = useState<CalEvent[]>([]);

  useEffect(() => {
    supabase
      .from("jindo_events")
      .select("*")
      .order("date", { ascending: true })
      .then(({ data }) => {
        if (data) {
          setEvents(
            data.map((e) => ({
              id: e.id,
              date: e.date,
              title: e.title,
              createdAt: e.created_at,
            }))
          );
        }
      });
  }, []);

  async function addEvent(date: string, title: string) {
    if (!title.trim()) return;
    const newEvent: CalEvent = {
      id: Date.now().toString(),
      date,
      title: title.trim(),
      createdAt: new Date().toISOString(),
    };
    const { error } = await supabase.from("jindo_events").insert({
      id: newEvent.id,
      date: newEvent.date,
      title: newEvent.title,
      created_at: newEvent.createdAt,
    });
    if (!error) {
      setEvents((prev) =>
        [...prev, newEvent].sort((a, b) => a.date.localeCompare(b.date))
      );
    }
  }

  async function deleteEvent(id: string) {
    await supabase.from("jindo_events").delete().eq("id", id);
    setEvents((prev) => prev.filter((e) => e.id !== id));
  }

  function getEventsByDate(date: string): CalEvent[] {
    return events.filter((e) => e.date === date);
  }

  return { events, addEvent, deleteEvent, getEventsByDate };
}
