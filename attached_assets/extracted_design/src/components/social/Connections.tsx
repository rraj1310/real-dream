import { useState } from "react";
import { useNavigate } from "react-router";
import { AppHeader } from "../common/AppHeader";
import { BottomNav } from "../common/BottomNav";
import { Card } from "../common/Card";
import { User } from "lucide-react";

export function Connections() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"followers" | "followings">("followers");

  const followers = [
    { username: "Username1", fullName: "Full Name1" },
    { username: "Username2", fullName: "Full Name2" },
    { username: "Username3", fullName: "Full Name3" },
    { username: "Username4", fullName: "Full Name4" },
    { username: "Username5", fullName: "Full Name5" },
  ];

  const followings = [
    { username: "Username1", fullName: "Full Name1" },
    { username: "Username2", fullName: "Full Name2" },
    { username: "Username3", fullName: "Full Name3" },
    { username: "Username4", fullName: "Full Name4" },
    { username: "Username5", fullName: "Full Name5" },
  ];

  const displayList = activeTab === "followers" ? followers : followings;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      <AppHeader title="CONNECTIONS" showBack />

      <div className="p-4 space-y-4">
        {/* Tabs */}
        <div className="flex gap-2 bg-white dark:bg-gray-800 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab("followers")}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
              activeTab === "followers"
                ? "bg-green-500 text-white"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            Followers
          </button>
          <button
            onClick={() => setActiveTab("followings")}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
              activeTab === "followings"
                ? "bg-green-500 text-white"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            Followings
          </button>
        </div>

        {/* Connections List */}
        <Card>
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {displayList.map((person, index) => (
              <div
                key={index}
                className="p-4 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                onClick={() => alert(`View profile: @${person.username}`)}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                    {person.username}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    ({person.fullName})
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Advertisement Placeholder */}
        <div className="bg-blue-400 dark:bg-blue-600 rounded-lg p-6 text-center">
          <p className="text-white font-semibold text-lg">ADVERTISEMENT</p>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}