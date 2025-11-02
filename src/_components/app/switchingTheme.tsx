"use client";

import {
  MoonIcon as DarkModeIcon,
  SunIcon as RootModeIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { Button } from "@/_components/ui/button";

export default function Component() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const next = resolvedTheme === "dark" ? "light" : "dark";

  return (
    <Button onClick={() => setTheme(next)} variant="ghost" size="icon">
      {mounted ? (
        resolvedTheme === "dark" ? (
          <RootModeIcon />
        ) : (
          <DarkModeIcon />
        )
      ) : null}
    </Button>
  );
}
