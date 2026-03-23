import { createClient } from "@/lib/supabase/server";
import { getTranslations, getLocale } from "next-intl/server";
import { localized } from "@/lib/utils";
import { Mail, Phone, MapPin, Globe } from "lucide-react";
import type { ProfessorInfo } from "@/lib/types";

export async function generateMetadata() {
  const t = await getTranslations("professor");
  return { title: t("title") };
}

export default async function ProfessorPage() {
  const t = await getTranslations("professor");
  const locale = await getLocale();
  const supabase = await createClient();

  const { data } = await supabase
    .from("professor_info")
    .select("*")
    .limit(1)
    .single();

  const prof = data as ProfessorInfo | null;

  if (!prof || !prof.name) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 text-center text-muted-foreground">
        {t("title")} - Coming soon
      </div>
    );
  }

  const researchAreas = (prof.research_areas ?? []) as { ko: string; en: string }[];
  const education = (prof.education ?? []) as { ko: string; en: string }[];

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold">{t("title")}</h1>

      <div className="flex flex-col gap-8 md:flex-row">
        {/* Photo */}
        {prof.photo_url && (
          <div className="shrink-0">
            <img
              src={prof.photo_url}
              alt={localized(prof, "name", locale)}
              className="h-48 w-48 rounded-xl object-cover"
            />
          </div>
        )}

        {/* Info */}
        <div className="flex-1 space-y-4">
          <div>
            <h2 className="text-2xl font-bold">
              {localized(prof, "name", locale)}
            </h2>
            {prof.title && (
              <p className="text-muted-foreground">
                {localized(prof, "title", locale)}
              </p>
            )}
            {prof.department && (
              <p className="text-muted-foreground">
                {localized(prof, "department", locale)}
              </p>
            )}
          </div>

          {/* Contact */}
          <div className="space-y-2">
            {prof.email && (
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <a href={`mailto:${prof.email}`} className="hover:text-primary">
                  {prof.email}
                </a>
              </div>
            )}
            {prof.phone && (
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                {prof.phone}
              </div>
            )}
            {prof.office_location && (
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                {prof.office_location}
              </div>
            )}
            {prof.website && (
              <div className="flex items-center gap-2 text-sm">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <a
                  href={prof.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary"
                >
                  {prof.website}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bio */}
      {prof.bio && (
        <div className="mt-8">
          <p className="whitespace-pre-line text-muted-foreground">
            {localized(prof, "bio", locale)}
          </p>
        </div>
      )}

      {/* Research Areas */}
      {researchAreas.length > 0 && (
        <div className="mt-8">
          <h3 className="mb-3 text-lg font-semibold">{t("researchAreas")}</h3>
          <div className="flex flex-wrap gap-2">
            {researchAreas.map((area, i) => (
              <span
                key={i}
                className="rounded-full bg-primary/10 px-3 py-1 text-sm text-primary"
              >
                {locale === "en" && area.en ? area.en : area.ko}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div className="mt-8">
          <h3 className="mb-3 text-lg font-semibold">{t("education")}</h3>
          <ul className="space-y-2">
            {education.map((edu, i) => (
              <li key={i} className="text-sm text-muted-foreground">
                {locale === "en" && edu.en ? edu.en : edu.ko}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
