import { createClient } from "@/lib/supabase/server";
import { getTranslations, getLocale } from "next-intl/server";
import { localized } from "@/lib/utils";
import { Link } from "@/i18n/navigation";
import type { ResearchProject } from "@/lib/types";

export async function generateMetadata() {
  const t = await getTranslations("research");
  return { title: t("title") };
}

export default async function ResearchPage() {
  const t = await getTranslations("research");
  const locale = await getLocale();
  const supabase = await createClient();

  const { data: projects } = await supabase
    .from("research_projects")
    .select("*")
    .order("display_order")
    .order("created_at", { ascending: false });

  const ongoing = (projects ?? []).filter((p: ResearchProject) => p.status === "ongoing");
  const completed = (projects ?? []).filter((p: ResearchProject) => p.status === "completed");
  const planned = (projects ?? []).filter((p: ResearchProject) => p.status === "planned");

  function ProjectCard({ project }: { project: ResearchProject }) {
    return (
      <Link
        href={`/research/projects/${project.id}`}
        className="block rounded-xl border border-border p-5 transition-all hover:border-primary/50 hover:shadow-md"
      >
        <h3 className="font-semibold">
          {localized(project, "title", locale)}
        </h3>
        {project.description && (
          <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
            {localized(project, "description", locale)}
          </p>
        )}
        <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
          {project.start_date && (
            <span>
              {project.start_date}
              {project.end_date ? ` ~ ${project.end_date}` : " ~"}
            </span>
          )}
          {project.funding_source && <span>{project.funding_source}</span>}
        </div>
        {/* Progress bar */}
        <div className="mt-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">{t("progress")}</span>
            <span className="font-medium">{project.progress}%</span>
          </div>
          <div className="mt-1 h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${project.progress}%` }}
            />
          </div>
        </div>
      </Link>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">{t("title")}</h1>
        <Link
          href="/research/publications"
          className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted"
        >
          {t("publications")} &rarr;
        </Link>
      </div>

      {/* Ongoing */}
      {ongoing.length > 0 && (
        <div className="mb-10">
          <h2 className="mb-4 text-xl font-semibold text-green-600">
            {t("ongoing")}
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {ongoing.map((p: ResearchProject) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        </div>
      )}

      {/* Planned */}
      {planned.length > 0 && (
        <div className="mb-10">
          <h2 className="mb-4 text-xl font-semibold text-blue-600">
            {t("planned")}
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {planned.map((p: ResearchProject) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        </div>
      )}

      {/* Completed */}
      {completed.length > 0 && (
        <div className="mb-10">
          <h2 className="mb-4 text-xl font-semibold text-muted-foreground">
            {t("completed")}
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {completed.map((p: ResearchProject) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        </div>
      )}

      {(projects ?? []).length === 0 && (
        <p className="py-8 text-center text-muted-foreground">
          {t("title")} - Coming soon
        </p>
      )}
    </div>
  );
}
