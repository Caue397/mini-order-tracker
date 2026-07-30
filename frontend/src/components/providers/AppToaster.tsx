"use client";

import { Toaster } from "sonner";
import { useTheme } from "@/components/providers/ThemeProvider";

export function AppToaster() {
  const { theme } = useTheme();

  return <Toaster theme={theme} richColors position="top-right" />;
}
