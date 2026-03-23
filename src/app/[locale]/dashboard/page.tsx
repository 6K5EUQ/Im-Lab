import { createClient } from "@/lib/supabase/server";
import { getTranslations } from "next-intl/server";
import ClockInOutButton from "@/components/attendance/ClockInOutButton";
import { Link } from "@/i18n/navigation";
import { Clock, CalendarDays, Megaphone } from "lucide-react";

export default async function DashboardPage() {
  const t = await getTranslations();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const today = new Date().toISOString().split("T")[0];

  const { data: todayRecord } = await supabase
    .from("attendance_records")
    .select("*")
    .eq("user_id", user!.id)
    .eq("date", today)
    .order("clock_in", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { data: profile } = await supabase
    .from("profiles")
    .select("name, name_en")
    .eq("id", user!.id)
    .single();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t("dashboard.title")}</h1>
        <p className="text-muted-foreground">
          {t("dashboard.welcome")}, {profile?.name || ""}
        </p>
      </div>

      {/* Clock In/Out */}
      <div className="rounded-xl border border-border p-6">
        <h2 className="mb-4 text-lg font-semibold">
          {t("dashboard.todayAttendance")}
        </h2>
        <ClockInOutButton
          userId={user!.id}
          todayRecord={todayRecord}
        />
      </div>

      {/* Quick Links */}
      <div>
        <h2 className="mb-3 text-lg font-semibold">
          {t("dashboard.quickLinks")}
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Link
            href="/dashboard/attendance"
            className="flex items-center gap-3 rounded-xl border border-border p-4 transition-colors hover:bg-muted"
          >
            <Clock className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium">{t("attendance.title")}</span>
          </Link>
          <Link
            href="/dashboard/calendar"
            className="flex items-center gap-3 rounded-xl border border-border p-4 transition-colors hover:bg-muted"
          >
            <CalendarDays className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium">{t("calendar.title")}</span>
          </Link>
          <Link
            href="/announcements"
            className="flex items-center gap-3 rounded-xl border border-border p-4 transition-colors hover:bg-muted"
          >
            <Megaphone className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium">{t("posts.title")}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
