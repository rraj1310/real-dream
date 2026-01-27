import { useNavigate } from "react-router";
import { AppHeader } from "../common/AppHeader";
import { BottomNav } from "../common/BottomNav";
import { Card } from "../common/Card";
import {
  User,
  Store,
  CreditCard,
  Bell,
  ChevronRight,
} from "lucide-react";

export function Settings() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      <AppHeader title="SETTINGS" showBack />

      <div className="p-4 space-y-4">
        {/* User Info Section */}
        <Card>
          <div className="p-4 space-y-3">
            <div className="flex items-center gap-3">
              <User className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">User Name</div>
                <div className="font-medium text-gray-900 dark:text-gray-100">john_doe</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <User className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Full Name</div>
                <div className="font-medium text-gray-900 dark:text-gray-100">John Doe</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Menu Items */}
        <Card>
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            <div
              onClick={() => navigate("/profile")}
              className="flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </div>
              <span className="flex-1 font-medium text-gray-900 dark:text-gray-100">
                PERSONAL PROFILE
              </span>
              <ChevronRight className="w-5 h-5 text-blue-600" />
            </div>

            <div
              onClick={() => navigate("/vendor-profile")}
              className="flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                <Store className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </div>
              <span className="flex-1 font-medium text-gray-900 dark:text-gray-100">
                VENDOR PROFILE
              </span>
              <ChevronRight className="w-5 h-5 text-blue-600" />
            </div>

            <div
              onClick={() => navigate("/subscription")}
              className="flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </div>
              <span className="flex-1 font-medium text-gray-900 dark:text-gray-100">
                SUBSCRIPTION
              </span>
              <ChevronRight className="w-5 h-5 text-blue-600" />
            </div>

            <div
              onClick={() => navigate("/notifications")}
              className="flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </div>
              <span className="flex-1 font-medium text-gray-900 dark:text-gray-100">
                NOTIFICATIONS
              </span>
              <ChevronRight className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </Card>
      </div>

      <BottomNav />
    </div>
  );
}