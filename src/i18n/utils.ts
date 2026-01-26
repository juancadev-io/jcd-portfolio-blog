import { ui } from "./ui";

export const LANGUAGES = {
  es: "Español",
  en: "English",
};

export const LANGUAGES_KEYS = Object.keys(LANGUAGES) as UiType[];

export const DEFAULT_LANG = "es";
export type UiType = keyof typeof ui;

export function getLangFromUrl(url: URL) {
  const [, lang] = url.pathname.split("/");
  if (lang in ui) return lang as UiType;
  return DEFAULT_LANG;
}

export function useTranslations(lang?: UiType) {
  return function t(
    key: keyof (typeof ui)[typeof DEFAULT_LANG],
    ...args: any[]
  ) {
    let translation: string =
      ui[lang ?? DEFAULT_LANG][key] || ui[DEFAULT_LANG][key];
    if (args.length > 0) {
      for (let i = 0; i < args.length; i++) {
        translation = translation.replace(`{${i}}`, args[i]);
      }
    }
    return translation;
  };
}

export function pathNameIsInLanguage(pathname: string, lang: UiType) {
  return (
    pathname.startsWith(`/${lang}`) ||
    (lang === DEFAULT_LANG && !pathNameStartsWithLanguage(pathname))
  );
}

function pathNameStartsWithLanguage(pathname: string) {
  return Object.keys(LANGUAGES).some((lang) =>
    pathname.startsWith(`/${lang}`)
  );
}

export function getLocalizedPathname(pathname: string, lang: UiType) {
  if (pathNameStartsWithLanguage(pathname)) {
    const availableLanguages = Object.keys(LANGUAGES).join("|");
    const regex = new RegExp(`^\/(${availableLanguages})`);
    return pathname.replace(regex, `/${lang}`);
  }
  return `/${lang}${pathname}`;
}
