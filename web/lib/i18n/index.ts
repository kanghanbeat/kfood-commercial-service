import { cookies } from "next/headers";

import type { SupportedLanguage } from "@kfood/data";

import { dictionaries, type Dictionary } from "./dictionaries";

export const LOCALE_COOKIE = "kfood_locale";

export const SUPPORTED_LOCALES: SupportedLanguage[] = ["en", "ko", "ja", "zh"];

function isSupportedLocale(value: string): value is SupportedLanguage {
  return (SUPPORTED_LOCALES as string[]).includes(value);
}

// 쿠키 기반 로케일. URL은 바꾸지 않는다(기존 SEO 색인 유지) — 기본값 영어.
export async function getLocale(): Promise<SupportedLanguage> {
  const store = await cookies();
  const value = store.get(LOCALE_COOKIE)?.value ?? "";
  return isSupportedLocale(value) ? value : "en";
}

export async function getDict(): Promise<Dictionary> {
  return dictionaries[await getLocale()];
}

export type { Dictionary };
export { dictionaries };
