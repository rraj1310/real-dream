import { useNavigate } from "react-router";
import { AppHeader } from "../common/AppHeader";
import { BottomNav } from "../common/BottomNav";
import { Card } from "../common/Card";
import {
  Target,
  Users,
  Trophy,
  ShoppingBag,
  ImageIcon,
  Newspaper,
} from "lucide-react";

export function MainMenu() {
  const navigate = useNavigate();

  const menuItems = [
    {
      icon: Target,
      label: "My RealDream",
      path: "/my-realdream",
      color: "bg-blue-500 text-white",
    },
    {
      icon: Users,
      label: "Social",
      path: "/news-feed",
      color: "bg-purple-500 text-white",
    },
    {
      icon: Trophy,
      label: "Champions",
      path: "/champions",
      color: "bg-yellow-500 text-white",
    },
    {
      icon: ShoppingBag,
      label: "Market",
      path: "/market",
      color: "bg-green-500 text-white",
    },
    {
      icon: ImageIcon,
      label: "Gallery",
      path: "/gallery",
      color: "bg-pink-500 text-white",
    },
    {
      icon: Newspaper,
      label: "News Feed",
      path: "/news-feed",
      color: "bg-indigo-500 text-white",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      <AppHeader title="Real Dream" showNotifications />

      <div className="p-4">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">Welcome back!</h2>
          <p className="text-gray-600 dark:text-gray-400">What would you like to explore today?</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.path} onClick={() => navigate(item.path)}>
                <div className="p-6 flex flex-col items-center gap-3">
                  <div className={`w-14 h-14 ${item.color} rounded-xl flex items-center justify-center`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100 text-center">
                    {item.label}
                  </span>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}