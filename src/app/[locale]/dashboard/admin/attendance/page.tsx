import { createClient } from "@/lib/supabase/server";
import { getTranslations } from "next-intl/server";

export default async function AdminAttendancePage() {
  const t = await getTranslations();
  const supabase = await createClient();

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    .toISOString()
    .split("T")[0];
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    .toISOString()
    .split("T")[0];

  const { data: records } = await supabase
    .from("attendance_records")
    .select("*, profile:profiles(name, student_id)")
    .gte("date", startOfMonth)
    .lte("date", endOfMonth)
    .order("date", { ascending: false })
    .order("clock_in", { ascending: false });

  function formatTime(iso: string | null) {
    if (!iso) return "-";
    return new Date(iso).toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t("admin.attendanceManagement")}</h1>

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left font-medium">
                {t("members.name")}
              </th>
              <th className="px-4 py-3 text-left font-medium">
                {t("attendance.date")}
              </th>
              <th className="px-4 py-3 text-left font-medium">
                {t("attendance.clockInTime")}
              </th>
              <th className="px-4 py-3 text-left font-medium">
                {t("attendance.clockOutTime")}
              </th>
              <th className="px-4 py-3 text-left font-medium">
                {t("attendance.duration")}
              </th>
            </tr>
          </thead>
          <tbody>
            {(records ?? []).map((r) => (
              <tr
                key={r.id}
                className="border-b border-border last:border-0"
              >
                <td className="px-4 py-3 font-medium">
                  {r.profile?.name ?? "-"}
                </td>
                <td className="px-4 py-3">{r.date}</td>
                <td className="px-4 py-3">{formatTime(r.clock_in)}</td>
                <td className="px-4 py-3">{formatTime(r.clock_out)}</td>
                <td className="px-4 py-3">
                  {r.duration_minutes != null
                    ? `${Math.floor(r.duration_minutes / 60)}h ${r.duration_minutes % 60}m`
                    : "-"}
                </td>
              </tr>
            ))}
            {(records ?? []).length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                  No records
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
