import { MoonStarsIcon, SunIcon } from "@phosphor-icons/react";

import { useTheme } from "@/providers/theme";

import { Button } from "./ui/button";

export const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      size="icon"
      variant="outline"
    >
      {theme === "dark" ? <SunIcon /> : <MoonStarsIcon />}
    </Button>
  );
};
