"use client";

import { useTranslations } from "next-intl";
import type { AttendanceRecord } from "@/lib/types";

interface AttendanceHistoryProps {
  records: AttendanceRecord[];
}

export default function AttendanceHistory({ records }: AttendanceHistoryProps) {
  const t = useTranslations("attendance");

  function formatTime(iso: string | null) {
    if (!iso) return "-";
    return new Date(iso).toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function formatDuration(minutes: number | null) {
    if (minutes == null) return "-";
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}${t("hours")} ${m}${t("minutes")}`;
  }

  if (records.length === 0) {
    return (
      <p className="py-8 text-center text-muted-foreground">
        {t("title")} - No records
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-sm">
        <thead className="border-b border-border bg-muted/50">
          <tr>
            <th className="px-4 py-3 text-left font-medium">{t("date")}</th>
            <th className="px-4 py-3 text-left font-medium">
              {t("clockInTime")}
            </th>
            <th className="px-4 py-3 text-left font-medium">
              {t("clockOutTime")}
            </th>
            <th className="px-4 py-3 text-left font-medium">
              {t("duration")}
            </th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr
              key={record.id}
              className="border-b border-border last:border-0"
            >
              <td className="px-4 py-3">{record.date}</td>
              <td className="px-4 py-3">{formatTime(record.clock_in)}</td>
              <td className="px-4 py-3">{formatTime(record.clock_out)}</td>
              <td className="px-4 py-3">
                {formatDuration(record.duration_minutes)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
