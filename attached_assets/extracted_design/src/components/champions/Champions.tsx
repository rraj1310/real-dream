import { useNavigate } from "react-router";
import { AppHeader } from "../common/AppHeader";
import { BottomNav } from "../common/BottomNav";
import { Card } from "../common/Card";
import { Trophy, Award, Crown, ChevronRight } from "lucide-react";

export function Champions() {
  const navigate = useNavigate();

  const topChampions = [
    { rank: 1, name: "Alex Johnson", dreams: 156, icon: "👑", color: "bg-yellow-500" },
    { rank: 2, name: "Sarah Williams", dreams: 142, icon: "🥈", color: "bg-gray-400" },
    { rank: 3, name: "Mike Chen", dreams: 138, icon: "🥉", color: "bg-orange-600" },
  ];

  const topDreamers = [
    { name: "Emma Davis", category: "Fitness", achievements: 45 },
    { name: "John Smith", category: "Learning", achievements: 38 },
    { name: "Lisa Brown", category: "Career", achievements: 35 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      <AppHeader title="CHAMPIONS" showBack />

      <div className="p-4 space-y-4">
        {/* Hall of Fame Link */}
        <Card onClick={() => navigate("/wall-of-fame")}>
          <div className="p-4 flex items-center gap-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
              <Trophy className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">Hall of Fame</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">View legendary achievers</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
        </Card>

        {/* Wall of Fame Link */}
        <Card onClick={() => navigate("/wall-of-fame")}>
          <div className="p-4 flex items-center gap-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
              <Award className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">Wall of Fame</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Celebrate top performers</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
        </Card>

        {/* Top Champions */}
        <div>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 px-2">
            TOP CHAMPIONS THIS MONTH
          </h3>
          <Card>
            <div className="p-4 space-y-4">
              {topChampions.map((champion) => (
                <div key={champion.rank} className="flex items-center gap-3">
                  <div className={`w-12 h-12 ${champion.color} rounded-full flex items-center justify-center text-2xl`}>
                    {champion.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                      #{champion.rank} {champion.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {champion.dreams} dreams completed
                    </p>
                  </div>
                  <Crown className="w-6 h-6 text-yellow-500" />
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Rising Stars */}
        <div>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 px-2">
            RISING STARS
          </h3>
          <Card>
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {topDreamers.map((dreamer, index) => (
                <div key={index} className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">{dreamer.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {dreamer.category} • {dreamer.achievements} achievements
                    </p>
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