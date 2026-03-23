import { createClient } from "@/lib/supabase/server";
import { getTranslations } from "next-intl/server";
import AttendanceHistory from "@/components/attendance/AttendanceHistory";

export default async function AttendancePage() {
  const t = await getTranslations("attendance");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const startOfMonth = new Date(year, month, 1).toISOString().split("T")[0];
  const endOfMonth = new Date(year, month + 1, 0).toISOString().split("T")[0];

  const { data: records } = await supabase
    .from("attendance_records")
    .select("*")
    .eq("user_id", user!.id)
    .gte("date", startOfMonth)
    .lte("date", endOfMonth)
    .order("date", { ascending: false });

  const totalDays = records?.filter((r) => r.clock_out).length ?? 0;
  const totalMinutes =
    records?.reduce((sum, r) => sum + (r.duration_minutes ?? 0), 0) ?? 0;
  const avgMinutes = totalDays > 0 ? Math.round(totalMinutes / totalDays) : 0;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t("title")}</h1>

      {/* Monthly Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border p-4">
          <p className="text-sm text-muted-foreground">{t("totalDays")}</p>
          <p className="text-2xl font-bold">
            {totalDays}
            <span className="ml-1 text-sm font-normal text-muted-foreground">
              {t("days")}
            </span>
          </p>
        </div>
        <div className="rounded-xl border border-border p-4">
          <p className="text-sm text-muted-foreground">{t("monthlyTotal")}</p>
          <p className="text-2xl font-bold">
            {Math.floor(totalMinutes / 60)}
            <span className="ml-1 text-sm font-normal text-muted-foreground">
              {t("hours")}
            </span>
          </p>
        </div>
        <div className="rounded-xl border border-border p-4">
          <p className="text-sm text-muted-foreground">{t("averageHours")}</p>
          <p className="text-2xl font-bold">
            {Math.floor(avgMinutes / 60)}h {avgMinutes % 60}m
          </p>
        </div>
      </div>

      {/* Records Table */}
      <AttendanceHistory records={records ?? []} />
    </div>
  );
}
