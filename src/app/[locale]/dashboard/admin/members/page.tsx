import { createClient } from "@/lib/supabase/server";
import { getTranslations } from "next-intl/server";
import AdminMemberList from "@/components/admin/AdminMemberList";

export default async function AdminMembersPage() {
  const t = await getTranslations();
  const supabase = await createClient();

  const { data: members } = await supabase
    .from("profiles")
    .select("*")
    .order("is_active", { ascending: false })
    .order("position")
    .order("name");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t("admin.memberManagement")}</h1>
      </div>
      <AdminMemberList members={members ?? []} />
    </div>
  );
}
