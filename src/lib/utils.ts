import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function localized(
  item: any,
  field: string,
  locale: string
): string {
  if (locale === "en") {
    const enValue = item[`${field}_en`];
    if (enValue && typeof enValue === "string") return enValue;
  }
  const value = item[field];
  return typeof value === "string" ? value : "";
}
