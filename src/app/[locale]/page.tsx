import { useTranslations, useLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import {
  Users,
  FlaskConical,
  CalendarDays,
  Megaphone,
} from "lucide-react";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <HomeContent />;
}

function HomeContent() {
  const t = useTranslations();
  const locale = useLocale();

  const features = [
    {
      icon: Users,
      title: t("nav.members"),
      desc:
        locale === "ko"
          ? "연구실 구성원을 소개합니다"
          : "Meet our lab members",
      href: "/members",
    },
    {
      icon: FlaskConical,
      title: t("nav.research"),
      desc:
        locale === "ko"
          ? "현재 진행 중인 연구를 확인하세요"
          : "Explore our current research",
      href: "/research",
    },
    {
      icon: CalendarDays,
      title: t("nav.calendar"),
      desc:
        locale === "ko"
          ? "연구실 일정을 확인하세요"
          : "Check lab schedule",
      href: "/dashboard/calendar",
    },
    {
      icon: Megaphone,
      title: t("nav.announcements"),
      desc:
        locale === "ko"
          ? "최신 공지사항을 확인하세요"
          : "Read latest announcements",
      href: "/announcements",
    },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-accent py-20">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            {t("home.hero")}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            {locale === "ko"
              ? "함께 연구하고, 함께 성장하는 공간"
              : "A space to research and grow together"}
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <Link
              href="/professor"
              className="rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              {t("nav.professor")}
            </Link>
            <Link
              href="/research"
              className="rounded-lg border border-border px-6 py-3 text-sm font-medium hover:bg-muted"
            >
              {t("nav.research")}
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <Link
              key={f.href}
              href={f.href}
              className="group rounded-xl border border-border p-6 transition-all hover:border-primary/50 hover:shadow-md"
            >
              <f.icon className="h-8 w-8 text-primary" />
              <h3 className="mt-4 font-semibold group-hover:text-primary">
                {f.title}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
