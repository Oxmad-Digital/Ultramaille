"use client";

import { useLanguage } from "@/lib/language-context";

export default function T({ fr, en }: { fr: string; en: string }) {
  const { t } = useLanguage();
  return <>{t(fr, en)}</>;
}
