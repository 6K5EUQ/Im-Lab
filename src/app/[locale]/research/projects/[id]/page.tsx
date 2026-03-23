import { createClient } from "@/lib/supabase/server";
import { getTranslations, getLocale } from "next-intl/server";
import { localized } from "@/lib/utils";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { ArrowLeft } from "lucide-react";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id } = await params;
  const t = await getTranslations("research");
  const locale = await getLocale();
  const supabase = await createClient();

  const { data: project } = await supabase
    .from("research_projects")
    .select("*")
    .eq("id", id)
    .single();

  if (!project) notFound();

  const { data: members } = await supabase
    .from("project_members")
    .select("*, profile:profiles(*)")
    .eq("project_id", id);

  const { data: publications } = await supabase
    .from("publications")
    .select("*")
    .eq("project_id", id)
    .order("year", { ascending: false });

  const statusColors = {
    ongoing: "bg-green-100 text-green-700",
    completed: "bg-gray-100 text-gray-700",
    planned: "bg-blue-100 text-blue-700",
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <Link
        href="/research"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        {t("title")}
      </Link>

      <div className="mb-4 flex items-start gap-3">
        <h1 className="text-2xl font-bold">
          {localized(project, "title", locale)}
        </h1>
        <span
          className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[project.status as keyof typeof statusColors]}`}
        >
          {t(project.status)}
        </span>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">{t("progress")}</span>
          <span className="font-medium">{project.progress}%</span>
        </div>
        <div className="mt-1 h-3 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary"
            style={{ width: `${project.progress}%` }}
          />
        </div>
      </div>

      {/* Meta */}
      <div className="mb-6 flex flex-wrap gap-4 text-sm text-muted-foreground">
        {project.start_date && (
          <span>
            {t("period")}: {project.start_date}
            {project.end_date ? ` ~ ${project.end_date}` : " ~"}
          </span>
        )}
        {project.funding_source && (
          <span>
            {t("fundingSource")}: {project.funding_source}
          </span>
        )}
      </div>

      {/* Description */}
      {project.description && (
        <div className="mb-8 whitespace-pre-line text-muted-foreground">
          {localized(project, "description", locale)}
        </div>
      )}

      {/* Team Members */}
      {members && members.length > 0 && (
        <div className="mb-8">
          <h2 className="mb-3 text-lg font-semibold">{t("teamMembers")}</h2>
          <div className="flex flex-wrap gap-3">
            {members.map((m: { user_id: string; profile: { name: string; name_en: string | null } }) => (
              <span
                key={m.user_id}
                className="rounded-full bg-muted px-3 py-1 text-sm"
              >
                {locale === "en" && m.profile?.name_en
                  ? m.profile.name_en
                  : m.profile?.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Related Publications */}
      {publications && publications.length > 0 && (
        <div>
          <h2 className="mb-3 text-lg font-semibold">{t("publications")}</h2>
          <div className="space-y-3">
            {publications.map((pub: { id: string; title: string; authors: string; venue: string | null; year: number; doi: string | null }) => (
              <div key={pub.id} className="rounded-lg border border-border p-3">
                <p className="font-medium">{pub.title}</p>
                <p className="text-sm text-muted-foreground">
                  {pub.authors} &middot; {pub.venue} &middot; {pub.year}
                </p>
                {pub.doi && (
                  <a
                    href={`https://doi.org/${pub.doi}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline"
                  >
                    DOI: {pub.doi}
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
