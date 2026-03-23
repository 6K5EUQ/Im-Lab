"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Clock,
  CalendarDays,
  Users,
  Settings,
  Megaphone,
  FlaskConical,
  LogOut,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "@/i18n/navigation";

interface DashboardSidebarProps {
  isAdmin: boolean;
}

export default function DashboardSidebar({ isAdmin }: DashboardSidebarProps) {
  const t = useTranslations();
  const pathname = usePathname();
  const router = useRouter();

  const memberLinks = [
    { href: "/dashboard", icon: LayoutDashboard, label: t("dashboard.title") },
    {
      href: "/dashboard/attendance",
      icon: Clock,
      label: t("attendance.title"),
    },
    {
      href: "/dashboard/calendar",
      icon: CalendarDays,
      label: t("calendar.title"),
    },
  ];

  const adminLinks = [
    {
      href: "/dashboard/admin/members",
      icon: Users,
      label: t("admin.memberManagement"),
    },
    {
      href: "/dashboard/admin/attendance",
      icon: Clock,
      label: t("admin.attendanceManagement"),
    },
    {
      href: "/dashboard/admin/calendar",
      icon: CalendarDays,
      label: t("admin.calendarManagement"),
    },
    {
      href: "/dashboard/admin/research",
      icon: FlaskConical,
      label: t("admin.researchManagement"),
    },
    {
      href: "/dashboard/admin/announcements",
      icon: Megaphone,
      label: t("admin.announcementManagement"),
    },
  ];

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <aside className="hidden w-56 shrink-0 md:block">
      <nav className="sticky top-20 space-y-1">
        {memberLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              pathname === link.href
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted"
            )}
          >
            <link.icon className="h-4 w-4" />
            {link.label}
          </Link>
        ))}

        {isAdmin && (
          <>
            <div className="my-3 border-t border-border" />
            <p className="px-3 text-xs font-semibold uppercase text-muted-foreground">
              {t("admin.title")}
            </p>
            {adminLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  pathname.startsWith(link.href)
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted"
                )}
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            ))}
          </>
        )}

        <div className="my-3 border-t border-border" />
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted"
        >
          <LogOut className="h-4 w-4" />
          {t("auth.logoutButton")}
        </button>
      </nav>
    </aside>
  );
}
