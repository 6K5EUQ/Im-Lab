"use client";

import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "@/i18n/navigation";
import { useState, useEffect } from "react";
import { Plus, Trash2, X, Save } from "lucide-react";
import type { CalendarEvent, EventCategory } from "@/lib/types";

const CATEGORIES: EventCategory[] = [
  "seminar",
  "meeting",
  "conference",
  "deadline",
  "holiday",
  "other",
];

export default function AdminCalendarPage() {
  const t = useTranslations();
  const router = useRouter();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    title_en: "",
    description: "",
    description_en: "",
    start_datetime: "",
    end_datetime: "",
    is_all_day: false,
    category: "other" as EventCategory,
    location: "",
  });

  useEffect(() => {
    loadEvents();
  }, []);

  async function loadEvents() {
    const supabase = createClient();
    const { data } = await supabase
      .from("calendar_events")
      .select("*")
      .order("start_datetime", { ascending: false })
      .limit(50);
    setEvents(data ?? []);
  }

  function resetForm() {
    setForm({
      title: "",
      title_en: "",
      description: "",
      description_en: "",
      start_datetime: "",
      end_datetime: "",
      is_all_day: false,
      category: "other",
      location: "",
    });
    setShowForm(false);
    setEditingId(null);
  }

  function startEdit(event: CalendarEvent) {
    setForm({
      title: event.title,
      title_en: event.title_en ?? "",
      description: event.description ?? "",
      description_en: event.description_en ?? "",
      start_datetime: event.start_datetime.slice(0, 16),
      end_datetime: event.end_datetime?.slice(0, 16) ?? "",
      is_all_day: event.is_all_day,
      category: event.category,
      location: event.location ?? "",
    });
    setEditingId(event.id);
    setShowForm(true);
  }

  async function handleSave() {
    const supabase = createClient();
    const data = {
      title: form.title,
      title_en: form.title_en || null,
      description: form.description || null,
      description_en: form.description_en || null,
      start_datetime: new Date(form.start_datetime).toISOString(),
      end_datetime: form.end_datetime
        ? new Date(form.end_datetime).toISOString()
        : null,
      is_all_day: form.is_all_day,
      category: form.category,
      location: form.location || null,
    };

    if (editingId) {
      await supabase.from("calendar_events").update(data).eq("id", editingId);
    } else {
      await supabase.from("calendar_events").insert(data);
    }

    resetForm();
    loadEvents();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this event?")) return;
    const supabase = createClient();
    await supabase.from("calendar_events").delete().eq("id", id);
    loadEvents();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t("admin.calendarManagement")}</h1>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="flex items-center gap-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          {t("calendar.addEvent")}
        </button>
      </div>

      {showForm && (
        <div className="rounded-xl border border-border p-4">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold">
              {editingId ? t("calendar.editEvent") : t("calendar.addEvent")}
            </h3>
            <button onClick={resetForm}>
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder={t("calendar.eventTitle") + " (KO)"}
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
            />
            <input
              value={form.title_en}
              onChange={(e) => setForm({ ...form, title_en: e.target.value })}
              placeholder={t("calendar.eventTitle") + " (EN)"}
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
            />
            <input
              type="datetime-local"
              value={form.start_datetime}
              onChange={(e) =>
                setForm({ ...form, start_datetime: e.target.value })
              }
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
            />
            <input
              type="datetime-local"
              value={form.end_datetime}
              onChange={(e) =>
                setForm({ ...form, end_datetime: e.target.value })
              }
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
            />
            <select
              value={form.category}
              onChange={(e) =>
                setForm({ ...form, category: e.target.value as EventCategory })
              }
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {t(`calendar.${c}`)}
                </option>
              ))}
            </select>
            <input
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              placeholder={t("calendar.location")}
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
            />
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="Description (KO)"
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
              rows={2}
            />
            <textarea
              value={form.description_en}
              onChange={(e) =>
                setForm({ ...form, description_en: e.target.value })
              }
              placeholder="Description (EN)"
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
              rows={2}
            />
          </div>
          <div className="mt-3 flex items-center gap-3">
            <label className="flex items-center gap-1.5 text-sm">
              <input
                type="checkbox"
                checked={form.is_all_day}
                onChange={(e) =>
                  setForm({ ...form, is_all_day: e.target.checked })
                }
              />
              {t("calendar.allDay")}
            </label>
            <button
              onClick={handleSave}
              className="ml-auto flex items-center gap-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              <Save className="h-4 w-4" />
              {t("common.save")}
            </button>
          </div>
        </div>
      )}

      {/* Events list */}
      <div className="space-y-2">
        {events.map((event) => (
          <div
            key={event.id}
            className="flex items-center justify-between rounded-lg border border-border p-3"
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded bg-muted px-1.5 py-0.5 text-[10px]">
                  {t(`calendar.${event.category}`)}
                </span>
                <span className="font-medium">{event.title}</span>
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {new Date(event.start_datetime).toLocaleString("ko-KR")}
                {event.location && ` | ${event.location}`}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => startEdit(event)}
                className="text-xs text-primary hover:underline"
              >
                {t("common.edit")}
              </button>
              <button
                onClick={() => handleDelete(event.id)}
                className="text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
        {events.length === 0 && (
          <p className="py-8 text-center text-muted-foreground">No events</p>
        )}
      </div>
    </div>
  );
}
