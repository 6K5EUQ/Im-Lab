import { createClient } from "@/lib/supabase/server";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { ArrowLeft, Download, Pin } from "lucide-react";

export default async function AnnouncementDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const t = await getTranslations("posts");
  const supabase = await createClient();

  const { data: post } = await supabase
    .from("posts")
    .select("*, author:profiles(name, name_en)")
    .eq("id", id)
    .eq("is_published", true)
    .single();

  if (!post) notFound();

  // Increment view count
  await supabase
    .from("posts")
    .update({ view_count: (post.view_count ?? 0) + 1 })
    .eq("id", id);

  const { data: attachments } = await supabase
    .from("post_attachments")
    .select("*")
    .eq("post_id", id);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <Link
        href="/announcements"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        {t("title")}
      </Link>

      <article>
        <div className="mb-2 flex items-center gap-2">
          {post.is_pinned && <Pin className="h-4 w-4 text-red-500" />}
          <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
            {t(post.category)}
          </span>
        </div>

        <h1 className="mb-4 text-2xl font-bold">{post.title}</h1>

        <div className="mb-6 flex items-center gap-3 text-sm text-muted-foreground">
          <span>{post.author?.name ?? ""}</span>
          <span>{new Date(post.created_at).toLocaleDateString("ko-KR")}</span>
          <span>
            {t("views")} {post.view_count}
          </span>
        </div>

        <div className="prose prose-sm max-w-none whitespace-pre-line">
          {post.content}
        </div>

        {/* Attachments */}
        {attachments && attachments.length > 0 && (
          <div className="mt-8 rounded-lg border border-border p-4">
            <h3 className="mb-2 text-sm font-semibold">{t("attachments")}</h3>
            <div className="space-y-2">
              {attachments.map((att) => (
                <a
                  key={att.id}
                  href={att.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-primary hover:underline"
                >
                  <Download className="h-3.5 w-3.5" />
                  {att.file_name}
                  {att.file_size && (
                    <span className="text-xs text-muted-foreground">
                      ({Math.round(att.file_size / 1024)}KB)
                    </span>
                  )}
                </a>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
}
