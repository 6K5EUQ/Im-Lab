import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("lab");

  return (
    <footer className="mt-auto border-t border-border bg-muted/50">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div>
            <p className="text-lg font-semibold">Im Lab</p>
            <p className="text-sm text-muted-foreground">
              {t("contact")}: imlab@university.ac.kr
            </p>
          </div>
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Im Lab. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
