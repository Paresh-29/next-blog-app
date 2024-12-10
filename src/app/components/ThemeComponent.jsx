"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

function ThemeComponent({ children }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  console.log("Theme in ThemeComponent:", theme);
  return (
    <div className={theme}>
      <div className="bg-white text-gray-700 dark:text-gray-200 dark:bg-gray-900 min-h-screen">
        {children}
      </div>
    </div>
  );
}

export default ThemeComponent;
