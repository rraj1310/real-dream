import { useNavigate } from "react-router";
import { AppHeader } from "../common/AppHeader";
import { BottomNav } from "../common/BottomNav";
import { Card } from "../common/Card";
import { Button } from "../common/Button";
import {
  User,
  Users,
  Trophy,
  ArrowRight,
  Car,
  Home,
  Plus,
} from "lucide-react";

export function MyRealDream() {
  const navigate = useNavigate();

  const dreamTypes = [
    {
      title: "PERSONAL REALDREAM",
      icon: User,
      description: "Individual goals and aspirations",
      count: 4,
      color: "bg-blue-500",
      route: "/my-realdream/personal",
    },
    {
      title: "REALDREAM CHALLENGE",
      icon: Trophy,
      description: "Compete with others",
      count: 2,
      color: "bg-yellow-500",
      route: "/my-realdream/challenge",
    },
    {
      title: "GROUP REALDREAM",
      icon: Users,
      description: "Collaborate with teams",
      count: 2,
      color: "bg-purple-500",
      route: "/my-realdream/group",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      <AppHeader title="MY REALDREAM" showBack />

      <div className="p-4 space-y-4">
        {/* Dream Type Cards */}
        {dreamTypes.map((type) => {
          const Icon = type.icon;
          return (
            <Card key={type.title}>
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 ${type.color} rounded-lg flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-gray-100">{type.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{type.description}</p>
                    </div>
                  </div>
                  <ArrowRight className="w-6 h-6 text-gray-400" />
                </div>

                {/* Icons Grid */}
                <div className="grid grid-cols-4 gap-3 mb-4">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-14 h-14 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center text-2xl">
                      🚭
                    </div>
                    <span className="text-xs text-gray-600 dark:text-gray-400 text-center">Stop Smoking</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-14 h-14 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center text-2xl">
                      🚫
                    </div>
                    <span className="text-xs text-gray-600 dark:text-gray-400 text-center">Quit Drinking</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-14 h-14 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                      <Car className="w-7 h-7 text-red-600" />
                    </div>
                    <span className="text-xs text-gray-600 dark:text-gray-400 text-center">New Car</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center text-2xl">
                      🇯🇵
                    </div>
                    <span className="text-xs text-gray-600 dark:text-gray-400 text-center">Japan Trip</span>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-3">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-14 h-14 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                      <Home className="w-7 h-7 text-green-600" />
                    </div>
                    <span className="text-xs text-gray-600 dark:text-gray-400 text-center">HOME</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-14 h-14 bg-pink-100 dark:bg-pink-900/30 rounded-lg flex items-center justify-center text-2xl">
                      🔥
                    </div>
                    <span className="text-xs text-gray-600 dark:text-gray-400 text-center">Life Partner</span>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}

        {/* Start New RealDream Button */}
        <Button
          onClick={() => navigate("/create-realdream")}
          variant="primary"
          className="w-full"
        >
          <Plus className="w-5 h-5 mr-2" />
          START NEW REALDREAM
        </Button>
      </div>

      <BottomNav />
    </div>
  );
}