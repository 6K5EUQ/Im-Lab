import { createClient } from "@/lib/supabase/server";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Pin } from "lucide-react";

export async function generateMetadata() {
  const t = await getTranslations("posts");
  return { title: t("title") };
}

export default async function AnnouncementsPage() {
  const t = await getTranslations("posts");
  const supabase = await createClient();

  const { data: posts } = await supabase
    .from("posts")
    .select("*, author:profiles(name, name_en)")
    .eq("is_published", true)
    .order("is_pinned", { ascending: false })
    .order("created_at", { ascending: false });

  const categoryColors: Record<string, string> = {
    notice: "bg-red-100 text-red-700",
    general: "bg-blue-100 text-blue-700",
    resource: "bg-green-100 text-green-700",
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold">{t("title")}</h1>

      <div className="space-y-3">
        {(posts ?? []).map((post) => (
          <Link
            key={post.id}
            href={`/announcements/${post.id}`}
            className="block rounded-xl border border-border p-4 transition-all hover:border-primary/50 hover:shadow-sm"
          >
            <div className="flex items-start gap-2">
              {post.is_pinned && (
                <Pin className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${categoryColors[post.category] ?? ""}`}
                  >
                    {t(post.category)}
                  </span>
                  <h2 className="truncate font-semibold">{post.title}</h2>
                </div>
                <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                  <span>
                    {post.author?.name ?? ""}
                  </span>
                  <span>
                    {new Date(post.created_at).toLocaleDateString("ko-KR")}
                  </span>
                  <span>
                    {t("views")} {post.view_count}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}

        {(posts ?? []).length === 0 && (
          <p className="py-8 text-center text-muted-foreground">
            {t("title")} - Coming soon
          </p>
        )}
      </div>
    </div>
  );
}
