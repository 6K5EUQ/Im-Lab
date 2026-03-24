import { getTranslations, getLocale } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { Link } from "@/i18n/navigation";
import { localized } from "@/lib/utils";
import { Mail, MapPin, ExternalLink, GitBranch } from "lucide-react";
import type { LabInfo } from "@/lib/types";

const navLinks = [
  { href: "/professor", labelKey: "professor" },
  { href: "/members", labelKey: "members" },
  { href: "/research", labelKey: "research" },
  { href: "/announcements", labelKey: "announcements" },
] as const;

export default async function Footer() {
  const [tLab, tNav, locale] = await Promise.all([
    getTranslations("lab"),
    getTranslations("nav"),
    getLocale(),
  ]);

  const supabase = await createClient();
  const { data } = await supabase.from("lab_info").select("*").limit(1).single();
  const lab = data as LabInfo | null;

  const email = lab?.contact_email ?? "imlab@university.ac.kr";
  const address = lab ? localized(lab, "address", locale) : tLab("address");
  const description = lab
    ? localized(lab, "description", locale)
    : tLab("labDescription");

  return (
    <footer className="mt-auto border-t border-border-strong bg-surface-warm">
      {/* 상단 컬러 액센트 바 */}
      <div className="h-1 bg-gradient-to-r from-primary-dark via-primary to-primary/30" />

      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-10 md:grid-cols-3">

          {/* 컬럼 1: 연구실 정체성 */}
          <div className="space-y-3">
            <p className="text-lg font-bold text-text-heading">Im Lab</p>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">
              {tLab("department")}
            </p>
            <p className="text-xs text-muted-foreground">{tLab("university")}</p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {description}
            </p>
          </div>

          {/* 컬럼 2: 연락처 */}
          <div className="space-y-3">
            <p className="text-sm font-semibold text-text-heading">{tLab("contact")}</p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-3.5 w-3.5 shrink-0 text-primary" />
                <a
                  href={`mailto:${email}`}
                  className="transition-colors hover:text-primary"
                >
                  {email}
                </a>
              </div>
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                <span>{address}</span>
              </div>
            </div>
            <div className="flex items-center gap-4 pt-2">
              <a
                href="#"
                className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-primary"
              >
                <GitBranch className="h-3.5 w-3.5" />
                {tLab("github")}
              </a>
              <a
                href="#"
                className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-primary"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                {tLab("scholar")}
              </a>
            </div>
          </div>

          {/* 컬럼 3: 퀵 링크 */}
          <div className="space-y-3">
            <p className="text-sm font-semibold text-text-heading">{tLab("quickLinks")}</p>
            <nav className="flex flex-col gap-2">
              {navLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  {tNav(item.labelKey)}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* 하단 바 */}
        <div className="mt-10 flex flex-col items-center justify-between gap-2 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>&copy; {new Date().getFullYear()} Im Lab. All rights reserved.</p>
          <p>
            {tLab("affiliations")}: {tLab("university")}
          </p>
        </div>
      </div>
    </footer>
  );
}
