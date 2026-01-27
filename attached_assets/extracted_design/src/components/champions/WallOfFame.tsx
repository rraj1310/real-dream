import { useState } from "react";
import { useNavigate } from "react-router";
import { AppHeader } from "../common/AppHeader";
import { BottomNav } from "../common/BottomNav";
import { Card } from "../common/Card";
import { Trophy, Calendar, TrendingUp } from "lucide-react";

export function WallOfFame() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"monthly" | "yearly" | "alltime">("monthly");

  const legends = [
    {
      name: "Michael Ross",
      avatar: "MR",
      title: "Dream Legend",
      period: "3x Champion",
      stats: { dreams: 234, achievements: 156, points: 45890 },
    },
    {
      name: "Jessica Parker",
      avatar: "JP",
      title: "Goal Master",
      period: "2x Champion",
      stats: { dreams: 198, achievements: 142, points: 42340 },
    },
    {
      name: "David Lee",
      avatar: "DL",
      title: "Achievement Hunter",
      period: "Champion",
      stats: { dreams: 176, achievements: 128, points: 39560 },
    },
  ];

  const hallOfFamers = [
    { name: "Alex Morgan", year: "2024", category: "Most Dreams Completed", count: 156 },
    { name: "Emma Wilson", year: "2024", category: "Top Contributor", count: 243 },
    { name: "James Brown", year: "2023", category: "Community Leader", count: 189 },
    { name: "Sarah Davis", year: "2023", category: "Challenge Master", count: 98 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <AppHeader title="Wall of Fame" showBack />

      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mx-auto mb-3 flex items-center justify-center">
            <Trophy className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-1">Hall of Fame</h2>
          <p className="text-gray-600">Celebrating our greatest achievers</p>
        </div>

        {/* Period Tabs */}
        <div className="flex gap-2 bg-white rounded-lg p-1">
          <button
            onClick={() => setActiveTab("monthly")}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === "monthly"
                ? "bg-purple-600 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setActiveTab("yearly")}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === "yearly"
                ? "bg-purple-600 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Yearly
          </button>
          <button
            onClick={() => setActiveTab("alltime")}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === "alltime"
                ? "bg-purple-600 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            All Time
          </button>
        </div>

        {/* Legends Section */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3 px-2">Legends</h3>
          <div className="space-y-4">
            {legends.map((legend, index) => (
              <Card key={index}>
                <div className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center ring-4 ring-purple-100">
                      <span className="text-xl font-bold text-white">{legend.avatar}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900">{legend.name}</h3>
                      <div className="text-purple-600 font-medium">{legend.title}</div>
                      <div className="text-sm text-gray-600">{legend.period}</div>
                    </div>
                    <div className="text-3xl">👑</div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{legend.stats.dreams}</div>
                      <div className="text-xs text-gray-600">Dreams</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{legend.stats.achievements}</div>
                      <div className="text-xs text-gray-600">Achievements</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{legend.stats.points.toLocaleString()}</div>
                      <div className="text-xs text-gray-600">Points</div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Hall of Famers */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3 px-2">Hall of Famers</h3>
          <Card>
            <div className="divide-y divide-gray-100">
              {hallOfFamers.map((famer, index) => (
                <div key={index} className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{famer.name}</h4>
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                      {famer.year}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 mb-1">{famer.category}</div>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <TrendingUp className="w-4 h-4" />
                    <span>{famer.count} total</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
