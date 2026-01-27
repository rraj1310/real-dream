import { ReactNode } from "react";
import { ThemeProvider } from "../contexts/ThemeContext";

export function Root({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {children}
      </div>
    </ThemeProvider>
  );
}