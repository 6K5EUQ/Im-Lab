import { createClient } from "@/lib/supabase/server";
import { getTranslations, getLocale } from "next-intl/server";
import { localized } from "@/lib/utils";
import type { Profile, Position } from "@/lib/types";

export async function generateMetadata() {
  const t = await getTranslations("members");
  return { title: t("title") };
}

const POSITION_ORDER: Position[] = [
  "professor",
  "phd",
  "master",
  "undergraduate",
  "researcher",
  "alumni",
];

export default async function MembersPage() {
  const t = await getTranslations("members");
  const locale = await getLocale();
  const supabase = await createClient();

  const { data: members } = await supabase
    .from("profiles")
    .select("*")
    .eq("is_active", true)
    .order("position")
    .order("name");

  const grouped = POSITION_ORDER.reduce(
    (acc, pos) => {
      const filtered = (members ?? []).filter(
        (m: Profile) => m.position === pos
      );
      if (filtered.length > 0) acc[pos] = filtered;
      return acc;
    },
    {} as Record<string, Profile[]>
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold">{t("title")}</h1>

      {Object.entries(grouped).map(([position, members]) => (
        <div key={position} className="mb-10">
          <h2 className="mb-4 text-xl font-semibold text-primary">
            {t(position as Position)}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {members.map((member: Profile) => (
              <div
                key={member.id}
                className="flex items-start gap-4 rounded-xl border border-border p-4"
              >
                {member.profile_photo_url ? (
                  <img
                    src={member.profile_photo_url}
                    alt={member.name}
                    className="h-14 w-14 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
                    {member.name.charAt(0)}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="font-semibold">
                    {localized(member, "name", locale)}
                  </p>
                  {member.student_id && (
                    <p className="text-xs text-muted-foreground">
                      {member.student_id}
                    </p>
                  )}
                  {member.email && (
                    <p className="truncate text-xs text-muted-foreground">
                      {member.email}
                    </p>
                  )}
                  {member.bio && (
                    <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                      {localized(member, "bio", locale)}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {Object.keys(grouped).length === 0 && (
        <p className="text-center text-muted-foreground">
          {t("title")} - Coming soon
        </p>
      )}
    </div>
  );
}
