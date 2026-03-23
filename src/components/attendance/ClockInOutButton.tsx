"use client";

import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { Clock } from "lucide-react";
import type { AttendanceRecord } from "@/lib/types";

interface ClockInOutButtonProps {
  userId: string;
  todayRecord: AttendanceRecord | null;
}

export default function ClockInOutButton({
  userId,
  todayRecord,
}: ClockInOutButtonProps) {
  const t = useTranslations("attendance");
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const isClockedIn = todayRecord && !todayRecord.clock_out;

  async function handleClockAction() {
    setLoading(true);
    const supabase = createClient();
    const now = new Date();
    const today = now.toISOString().split("T")[0];

    if (isClockedIn) {
      // Clock out
      const clockIn = new Date(todayRecord!.clock_in);
      const durationMinutes = Math.round(
        (now.getTime() - clockIn.getTime()) / 60000
      );

      await supabase
        .from("attendance_records")
        .update({
          clock_out: now.toISOString(),
          duration_minutes: durationMinutes,
        })
        .eq("id", todayRecord!.id);
    } else {
      // Clock in
      await supabase.from("attendance_records").insert({
        user_id: userId,
        clock_in: now.toISOString(),
        date: today,
      });
    }

    setLoading(false);
    router.refresh();
  }

  function formatTime(iso: string) {
    return new Date(iso).toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:gap-8">
      <button
        onClick={handleClockAction}
        disabled={loading}
        className={`flex h-28 w-28 flex-col items-center justify-center rounded-full text-white transition-all hover:scale-105 disabled:opacity-50 ${
          isClockedIn
            ? "bg-destructive hover:bg-destructive/90"
            : "bg-primary hover:bg-primary/90"
        }`}
      >
        <Clock className="mb-1 h-6 w-6" />
        <span className="text-sm font-semibold">
          {isClockedIn ? t("clockOut") : t("clockIn")}
        </span>
      </button>

      <div className="text-center sm:text-left">
        <p className="text-sm text-muted-foreground">{t("currentStatus")}</p>
        <p
          className={`text-lg font-semibold ${
            isClockedIn ? "text-green-600" : "text-muted-foreground"
          }`}
        >
          {isClockedIn ? t("working") : t("notWorking")}
        </p>

        {todayRecord && (
          <div className="mt-2 space-y-1 text-sm">
            <p>
              {t("clockInTime")}: {formatTime(todayRecord.clock_in)}
            </p>
            {todayRecord.clock_out && (
              <p>
                {t("clockOutTime")}: {formatTime(todayRecord.clock_out)}
              </p>
            )}
            {todayRecord.duration_minutes != null && (
              <p>
                {t("duration")}:{" "}
                {Math.floor(todayRecord.duration_minutes / 60)}
                {t("hours")} {todayRecord.duration_minutes % 60}
                {t("minutes")}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
