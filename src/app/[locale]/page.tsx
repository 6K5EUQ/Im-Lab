import { getTranslations, getLocale, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import { localized } from "@/lib/utils";
import {
  Users,
  FlaskConical,
  CalendarDays,
  Megaphone,
  BookOpen,
  Cpu,
  ChevronRight,
} from "lucide-react";
import type { LabInfo, ResearchProject, Post } from "@/lib/types";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [t, tNav, tPosts] = await Promise.all([
    getTranslations("home"),
    getTranslations("nav"),
    getTranslations("posts"),
  ]);

  const supabase = await createClient();
  const [{ data: labData }, { data: projectData }, { data: postsData }] =
    await Promise.all([
      supabase.from("lab_info").select("*").limit(1).single(),
      supabase.from("research_projects").select("id").eq("status", "ongoing"),
      supabase
        .from("posts")
        .select("id, title, category, created_at, is_pinned")
        .eq("is_published", true)
        .order("created_at", { ascending: false })
        .limit(3),
    ]);

  const lab = labData as LabInfo | null;
  const ongoingCount = projectData?.length ?? 0;
  const recentPosts = (postsData ?? []) as Pick<
    Post,
    "id" | "title" | "category" | "created_at" | "is_pinned"
  >[];

  const labDescription = lab
    ? localized(lab, "description", locale)
    : t("labIntroBody");

  const researchKeywords: string[] =
    lab?.research_areas &&
    (lab.research_areas as { ko: string; en: string }[]).length > 0
      ? (lab.research_areas as { ko: string; en: string }[]).map((a) =>
          locale === "en" && a.en ? a.en : a.ko
        )
      : locale === "ko"
      ? ["소프트웨어 도용 탐지", "프로그램 분석", "소프트웨어 버스마킹", "기계학습 기반 소프트웨어 분석", "소프트웨어 보안"]
      : [
          "Software Theft Detection",
          "Program Analysis",
          "Software Birthmarking",
          "ML-based Software Analysis",
          "Software Security",
        ];

  const features = [
    {
      icon: Users,
      title: tNav("members"),
      desc:
        locale === "ko"
          ? "연구실 구성원을 소개합니다"
          : "Meet our lab members",
      href: "/members",
    },
    {
      icon: FlaskConical,
      title: tNav("research"),
      desc:
        locale === "ko"
          ? "현재 진행 중인 연구를 확인하세요"
          : "Explore our current research",
      href: "/research",
    },
    {
      icon: CalendarDays,
      title: tNav("calendar"),
      desc:
        locale === "ko" ? "연구실 일정을 확인하세요" : "Check lab schedule",
      href: "/dashboard/calendar",
    },
    {
      icon: Megaphone,
      title: tNav("announcements"),
      desc:
        locale === "ko"
          ? "최신 공지사항을 확인하세요"
          : "Read latest announcements",
      href: "/announcements",
    },
  ];

  const stats = [
    {
      label: t("statsProjects"),
      value: `${ongoingCount > 0 ? ongoingCount : 5}+`,
      icon: FlaskConical,
    },
    { label: t("statsPublications"), value: "20+", icon: BookOpen },
    { label: t("statsMembers"), value: "10+", icon: Users },
    { label: t("statsYears"), value: "8+", icon: Cpu },
  ];

  const categoryColors: Record<string, string> = {
    notice: "bg-red-50 text-red-700",
    general: "bg-blue-50 text-blue-700",
    resource: "bg-green-50 text-green-700",
  };

  return (
    <div>
      {/* ── 히어로 ── */}
      <section className="relative overflow-hidden border-b border-border bg-background py-20 md:py-28">
        {/* 오른쪽 dot-grid 장식 */}
        <div className="bg-dot-grid absolute inset-y-0 right-0 hidden w-1/2 opacity-40 lg:block" />

        <div className="relative mx-auto max-w-7xl px-4">
          <div className="max-w-2xl">
            {/* 소속 캡션 */}
            <p className="mb-5 text-xs font-semibold uppercase tracking-widest text-primary">
              {locale === "ko"
                ? "컴퓨터공학부 · 경남대학교"
                : "School of Computer Engineering · Kyungnam University"}
            </p>

            {/* 메인 타이틀 */}
            <h1 className="text-6xl font-black tracking-tight text-text-heading sm:text-7xl">
              Im Lab
            </h1>

            {/* 구분선 장식 */}
            <div className="mt-4 flex items-center gap-3">
              <div className="h-1 w-16 rounded-full bg-primary" />
              <div className="h-1 w-4 rounded-full bg-primary/30" />
            </div>

            {/* 부제목 */}
            <p className="mt-5 text-xl font-light leading-relaxed text-muted-foreground sm:text-2xl">
              {locale === "ko"
                ? "소프트웨어 보안과 프로그램 분석을 연구합니다"
                : "Researching Software Security and Program Analysis"}
            </p>

            {/* 연구 분야 태그 */}
            <div className="mt-6 flex flex-wrap gap-2">
              {researchKeywords.map((kw) => (
                <span
                  key={kw}
                  className="rounded-full border border-border bg-surface-muted px-3 py-1 text-xs font-medium text-muted-foreground"
                >
                  {kw}
                </span>
              ))}
            </div>

            {/* CTA 버튼 */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/professor"
                className="rounded-lg bg-primary-dark px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary"
              >
                {tNav("professor")}
              </Link>
              <Link
                href="/research"
                className="rounded-lg border border-border-strong px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-surface-muted"
              >
                {tNav("research")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 통계 스트립 ── */}
      <div className="border-b border-border bg-surface-warm">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-2 divide-x divide-border md:grid-cols-4">
            {stats.map(({ label, value, icon: Icon }) => (
              <div
                key={label}
                className="flex flex-col items-center gap-1 py-7 text-center"
              >
                <Icon className="mb-1 h-4 w-4 text-primary" />
                <p className="text-2xl font-bold text-text-heading">{value}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 연구실 소개 ── */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid gap-12 lg:grid-cols-5">
          {/* 왼쪽: 소개 텍스트 */}
          <div className="space-y-4 lg:col-span-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">
              {t("labIntroHeading")}
            </p>
            <h2 className="text-3xl font-bold leading-snug text-text-heading">
              {locale === "ko"
                ? "소프트웨어 도용 탐지와 정적 분석을 연구합니다"
                : "Software Theft Detection and Static Program Analysis"}
            </h2>
            <p className="text-base leading-relaxed text-muted-foreground">
              {labDescription}
            </p>
            <Link
              href="/research"
              className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              {t("exploreResearch")}
            </Link>
          </div>

          {/* 오른쪽: 연구 분야 목록 */}
          <div className="lg:col-span-2">
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              {t("researchAreasHeading")}
            </p>
            <div className="space-y-2">
              {researchKeywords.map((kw) => (
                <div
                  key={kw}
                  className="flex items-center gap-3 rounded-lg border border-border bg-surface-muted px-4 py-2.5"
                >
                  <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  <span className="text-sm font-medium">{kw}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 최근 공지사항 ── */}
      {recentPosts.length > 0 && (
        <section className="bg-surface-warm py-16">
          <div className="mx-auto max-w-7xl px-4">
            <div className="mb-8 flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                {t("recentNews")}
              </p>
              <Link
                href="/announcements"
                className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
              >
                {t("recentNewsMore")}
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {recentPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/announcements/${post.id}`}
                  className="group rounded-xl border border-border bg-background p-5 transition-all hover:border-primary/40 hover:shadow-md"
                >
                  <div className="mb-3 flex items-center gap-2">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        categoryColors[post.category] ??
                        "bg-muted text-muted-foreground"
                      }`}
                    >
                      {tPosts(post.category)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(post.created_at).toLocaleDateString(
                        locale === "ko" ? "ko-KR" : "en-US",
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        }
                      )}
                    </span>
                  </div>
                  <p className="line-clamp-2 text-sm font-semibold leading-snug text-text-heading group-hover:text-primary">
                    {post.title}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── 바로가기 카드 ── */}
      <section
        className={`py-16 ${recentPosts.length > 0 ? "bg-background" : "bg-surface-warm"}`}
      >
        <div className="mx-auto max-w-7xl px-4">
          <p className="mb-8 text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {t("quickNav")}
          </p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <Link
                key={f.href}
                href={f.href}
                className="group relative overflow-hidden rounded-xl border border-border bg-background p-6 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg"
              >
                {/* 호버 시 상단 컬러 바 */}
                <div className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-primary transition-transform group-hover:scale-x-100" />
                <f.icon className="h-8 w-8 text-primary/60 transition-colors group-hover:text-primary" />
                <h3 className="mt-4 font-semibold text-text-heading transition-colors group-hover:text-primary">
                  {f.title}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
                <p className="mt-4 text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                  {locale === "ko" ? "바로가기 →" : "Go →"}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
