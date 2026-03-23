import { createClient } from "@/lib/supabase/server";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";

export async function generateMetadata() {
  const t = await getTranslations("nav");
  return { title: t("publications") };
}

export default async function PublicationsPage() {
  const t = await getTranslations();
  const supabase = await createClient();

  const { data: publications } = await supabase
    .from("publications")
    .select("*")
    .order("year", { ascending: false })
    .order("display_order");

  // Group by year
  const grouped: Record<number, typeof publications> = {};
  (publications ?? []).forEach((pub) => {
    if (!grouped[pub.year]) grouped[pub.year] = [];
    grouped[pub.year]!.push(pub);
  });

  const years = Object.keys(grouped)
    .map(Number)
    .sort((a, b) => b - a);

  const typeLabels: Record<string, string> = {
    journal: "Journal",
    conference: "Conference",
    workshop: "Workshop",
    thesis: "Thesis",
    patent: "Patent",
    other: "Other",
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <Link
        href="/research"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        {t("research.title")}
      </Link>

      <h1 className="mb-8 text-3xl font-bold">{t("nav.publications")}</h1>

      {years.map((year) => (
        <div key={year} className="mb-8">
          <h2 className="mb-3 text-lg font-semibold text-primary">{year}</h2>
          <div className="space-y-3">
            {grouped[year]!.map((pub) => (
              <div
                key={pub.id}
                className="rounded-lg border border-border p-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium">{pub.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {pub.authors}
                    </p>
                    <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                      {pub.venue && <span>{pub.venue}</span>}
                      <span className="rounded bg-muted px-1.5 py-0.5">
                        {typeLabels[pub.pub_type] ?? pub.pub_type}
                      </span>
                    </div>
                  </div>
                  {(pub.doi || pub.url) && (
                    <a
                      href={
                        pub.doi
                          ? `https://doi.org/${pub.doi}`
                          : pub.url!
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 text-primary hover:text-primary/80"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {years.length === 0 && (
        <p className="py-8 text-center text-muted-foreground">
          {t("nav.publications")} - Coming soon
        </p>
      )}
    </div>
  );
}
