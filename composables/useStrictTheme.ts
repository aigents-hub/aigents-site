import { ThemeMode, type StrictThemeMode } from "@/types/theme";

export function useStrictTheme() {
  const colorMode = useColorMode();

  const setTheme = (mode: StrictThemeMode) => {
    colorMode.preference = mode;
  };

  const toggleTheme = () => {
    setTheme(
      colorMode.value === ThemeMode.DARK ? ThemeMode.LIGHT : ThemeMode.DARK
    );
  };

  return {
    theme: computed(() => colorMode.value as StrictThemeMode),
    setTheme,
    toggleTheme,
  };
}
