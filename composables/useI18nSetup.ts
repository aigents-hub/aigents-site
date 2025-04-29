import { useI18n } from "vue-i18n";

export function useI18nSetup() {
  const { locale } = useI18n();

  const savedLocale = localStorage.getItem("locale");
  if (savedLocale) {
    locale.value = savedLocale;
  } else {
    const osLocale = navigator.language.split("-")[0];
    if (osLocale === "es") {
      locale.value = "es";
    } else {
      locale.value = "en";
    }
    localStorage.setItem("locale", locale.value);
  }
}
