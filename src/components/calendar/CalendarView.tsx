"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { localized, cn } from "@/lib/utils";
import type { CalendarEvent } from "@/lib/types";

const CATEGORY_COLORS: Record<string, string> = {
  seminar: "bg-blue-500",
  meeting: "bg-green-500",
  conference: "bg-purple-500",
  deadline: "bg-red-500",
  holiday: "bg-orange-500",
  other: "bg-gray-500",
};

interface CalendarViewProps {
  events: CalendarEvent[];
  locale: string;
}

export default function CalendarView({ events, locale }: CalendarViewProps) {
  const t = useTranslations("calendar");
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  const days: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  function getEventsForDay(day: number) {
    return events.filter((e) => {
      const d = new Date(e.start_datetime);
      return d.getFullYear() === year && d.getMonth() === month && d.getDate() === day;
    });
  }

  function prevMonth() {
    setCurrentDate(new Date(year, month - 1, 1));
  }
  function nextMonth() {
    setCurrentDate(new Date(year, month + 1, 1));
  }

  const monthName = currentDate.toLocaleDateString(locale === "ko" ? "ko-KR" : "en-US", {
    year: "numeric",
    month: "long",
  });

  const dayLabels =
    locale === "ko"
      ? ["일", "월", "화", "수", "목", "금", "토"]
      : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div>
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <button onClick={prevMonth} className="rounded-lg p-2 hover:bg-muted">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h2 className="text-lg font-semibold">{monthName}</h2>
        <button onClick={nextMonth} className="rounded-lg p-2 hover:bg-muted">
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Category legend */}
      <div className="mb-4 flex flex-wrap gap-3 text-xs">
        {Object.entries(CATEGORY_COLORS).map(([cat, color]) => (
          <span key={cat} className="flex items-center gap-1">
            <span className={cn("h-2.5 w-2.5 rounded-full", color)} />
            {t(cat as keyof typeof CATEGORY_COLORS)}
          </span>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7 gap-px overflow-hidden rounded-xl border border-border bg-border">
        {dayLabels.map((label) => (
          <div
            key={label}
            className="bg-muted/50 px-2 py-2 text-center text-xs font-medium text-muted-foreground"
          >
            {label}
          </div>
        ))}
        {days.map((day, i) => {
          const isToday =
            day != null &&
            today.getFullYear() === year &&
            today.getMonth() === month &&
            today.getDate() === day;
          const dayEvents = day ? getEventsForDay(day) : [];

          return (
            <div
              key={i}
              className={cn(
                "min-h-[80px] bg-background p-1.5 sm:min-h-[100px]",
                !day && "bg-muted/30"
              )}
            >
              {day && (
                <>
                  <span
                    className={cn(
                      "inline-flex h-6 w-6 items-center justify-center rounded-full text-xs",
                      isToday && "bg-primary text-primary-foreground font-bold"
                    )}
                  >
                    {day}
                  </span>
                  <div className="mt-0.5 space-y-0.5">
                    {dayEvents.slice(0, 3).map((ev) => (
                      <div
                        key={ev.id}
                        className="flex items-center gap-1 truncate text-[10px]"
                        title={localized(ev, "title", locale)}
                      >
                        <span
                          className={cn(
                            "h-1.5 w-1.5 shrink-0 rounded-full",
                            CATEGORY_COLORS[ev.category] ?? "bg-gray-500"
                          )}
                        />
                        <span className="truncate">
                          {localized(ev, "title", locale)}
                        </span>
                      </div>
                    ))}
                    {dayEvents.length > 3 && (
                      <span className="text-[10px] text-muted-foreground">
                        +{dayEvents.length - 3}
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
