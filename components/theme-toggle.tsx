"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

export const ThemeToggle = ({ className = "" }: { className?: string }) => {
  // Set up state to track if we're mounted (client-side)
  const [mounted, setMounted] = useState(false);

  // Theme only available after mounting to ensure resolvedTheme is correct
  const { setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Avoid rendering button until after hydration to prevent mismatches
  if (!mounted) {
    // Optionally, you could return a static placeholder button here.
    return (
      <button
        className={cn(
          "relative flex items-center justify-center rounded-full border border-border bg-card text-card-foreground transition-all duration-300 active:scale-95",
          className,
        )}
        // not interactable or visually rich before hydration
        tabIndex={-1}
        aria-hidden="true"
        style={{ opacity: 0, pointerEvents: "none" }}
      >
        <span />
      </button>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "relative flex items-center justify-center rounded-full border border-border bg-card text-card-foreground transition-all duration-300 active:scale-95",
        className,
      )}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.div
            key="moon"
            initial={{ rotate: -90, scale: 0.5, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: 90, scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Moon className="size-5" />
          </motion.div>
        ) : (
          <motion.div
            key="sun"
            initial={{ rotate: 90, scale: 0.5, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: -90, scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Sun className="size-5" />
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
};
