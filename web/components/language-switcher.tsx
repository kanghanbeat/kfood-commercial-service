"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import type { SupportedLanguage } from "@kfood/data";

// byFood식 지구본 언어 선택기. 선택은 쿠키(kfood_locale)에 저장되고
// router.refresh()로 서버 컴포넌트가 즉시 새 사전을 읽는다.
const LANGUAGE_OPTIONS: Array<{ code: SupportedLanguage; label: string }> = [
  { code: "en", label: "English" },
  { code: "ko", label: "한국어" },
  { code: "ja", label: "日本語" },
  { code: "zh", label: "中文" }
];

// 컴포넌트 밖 헬퍼 — 이벤트 핸들러에서 직접 document.cookie를 대입하면
// react-hooks/immutability 린트에 걸린다.
function setLocaleCookie(code: SupportedLanguage) {
  document.cookie = `kfood_locale=${code}; path=/; max-age=31536000; samesite=lax`;
}

function GlobeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M3 12h18M12 3c2.5 2.6 3.8 5.7 3.8 9S14.5 18.4 12 21c-2.5-2.6-3.8-5.7-3.8-9S9.5 5.6 12 3z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );
}

export function LanguageSwitcher({
  locale,
  ariaLabel
}: {
  locale: SupportedLanguage;
  ariaLabel: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  const select = (code: SupportedLanguage) => {
    setLocaleCookie(code);
    setOpen(false);
    router.refresh();
  };

  return (
    <div className="lang-switcher" ref={rootRef}>
      <button
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={ariaLabel}
        className="lang-switcher-button"
        onClick={() => setOpen((prev) => !prev)}
        type="button"
      >
        <GlobeIcon />
        <span className="lang-switcher-code">{locale.toUpperCase()}</span>
      </button>
      {open ? (
        <ul className="lang-switcher-menu" role="listbox" aria-label={ariaLabel}>
          {LANGUAGE_OPTIONS.map((option) => (
            <li key={option.code}>
              <button
                aria-selected={option.code === locale}
                className={
                  option.code === locale
                    ? "lang-switcher-option active"
                    : "lang-switcher-option"
                }
                onClick={() => select(option.code)}
                role="option"
                type="button"
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
