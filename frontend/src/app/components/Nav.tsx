"use client";

import { useState, useEffect } from "react";

export default function Nav() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const applyTheme = (isDark: boolean) => {
      setDarkMode(isDark);
      document.documentElement.classList.toggle("dark", isDark);
    };

    const storedTheme = localStorage.getItem("AlgOracle_theme");
    if (storedTheme === "dark") {
      applyTheme(true);
    } else if (storedTheme === "light") {
      applyTheme(false);
    } else {
      // Default to system theme
      const systemPrefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      applyTheme(systemPrefersDark);
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);

    if (newDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("AlgOracle_theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("AlgOracle_theme", "light");
    }
  };

  return (
    <nav className="w-full flex flex-wrap justify-between items-center px-4 sm:px-8 py-4 border-b border-gray-200 dark:border-gray-700">
      <button
        onClick={() => (window.location.href = "/")}
        className="text-xl font-bold"
        aria-label="Go to home page"
      >
        AlgOracle
      </button>
      <button
        onClick={toggleDarkMode}
        className="p-2 rounded-full border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
        aria-label="Toggle dark mode"
      >
        {darkMode ? "Light Mode" : "Dark Mode"}
      </button>
    </nav>
  );
}
