import { useTheme } from "../../contexts/ThemeContext";
import { Card } from "../common/Card";
import { Check, Crown } from "lucide-react";

export function ThemeSelector() {
  const { theme, setTheme, isPremiumTheme } = useTheme();

  const themes = [
    {
      id: "light" as const,
      name: "Light",
      preview: "bg-white",
      borderColor: "border-gray-200",
      free: true,
    },
    {
      id: "dark" as const,
      name: "Dark",
      preview: "bg-gray-900",
      borderColor: "border-gray-700",
      free: true,
    },
    {
      id: "ocean" as const,
      name: "Ocean",
      preview: "bg-gradient-to-br from-blue-400 to-cyan-300",
      borderColor: "border-blue-300",
      free: false,
    },
    {
      id: "sunset" as const,
      name: "Sunset",
      preview: "bg-gradient-to-br from-orange-400 to-pink-300",
      borderColor: "border-orange-300",
      free: false,
    },
    {
      id: "forest" as const,
      name: "Forest",
      preview: "bg-gradient-to-br from-green-400 to-emerald-300",
      borderColor: "border-green-300",
      free: false,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-2">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100">Theme</h3>
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {theme.charAt(0).toUpperCase() + theme.slice(1)}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {themes.map((themeOption) => {
          const isSelected = theme === themeOption.id;
          const isLocked = !themeOption.free;

          return (
            <Card
              key={themeOption.id}
              onClick={() => {
                if (!isLocked) {
                  setTheme(themeOption.id);
                } else {
                  alert("🔒 This theme is available with Premium subscription");
                }
              }}
              className={`relative ${
                isSelected ? `ring-2 ring-blue-500` : ""
              }`}
            >
              <div className="p-4">
                <div
                  className={`w-full h-20 rounded-lg ${themeOption.preview} border-2 ${themeOption.borderColor} mb-3 relative overflow-hidden`}
                >
                  {isSelected && (
                    <div className="absolute top-1 right-1 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                  {isLocked && (
                    <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px] flex items-center justify-center">
                      <Crown className="w-6 h-6 text-yellow-400" />
                    </div>
                  )}
                </div>
                <div className="text-center">
                  <div className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                    {themeOption.name}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    {themeOption.free ? "Free" : "Premium"}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <p className="text-xs text-gray-600 dark:text-gray-400 px-2">
        Premium themes are available with a paid subscription. More themes coming soon!
      </p>
    </div>
  );
}
