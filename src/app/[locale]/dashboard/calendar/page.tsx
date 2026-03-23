import { createClient } from "@/lib/supabase/server";
import { getTranslations, getLocale } from "next-intl/server";
import CalendarView from "@/components/calendar/CalendarView";

export default async function CalendarPage() {
  const t = await getTranslations("calendar");
  const locale = await getLocale();
  const supabase = await createClient();

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

  const { data: events } = await supabase
    .from("calendar_events")
    .select("*")
    .gte("start_datetime", startOfMonth.toISOString())
    .lte("start_datetime", endOfMonth.toISOString())
    .order("start_datetime");

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t("title")}</h1>
      <CalendarView events={events ?? []} locale={locale} />
    </div>
  );
}
