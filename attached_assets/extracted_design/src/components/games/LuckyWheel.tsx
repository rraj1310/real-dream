import { useState } from "react";
import { useNavigate } from "react-router";
import { AppHeader } from "../common/AppHeader";
import { BottomNav } from "../common/BottomNav";
import { Button } from "../common/Button";
import { Card } from "../common/Card";
import { Trophy, Coins, Gift, Sparkles, Clock } from "lucide-react";

export function LuckyWheel() {
  const navigate = useNavigate();
  const [spinning, setSpinning] = useState(false);
  const [spinsLeft, setSpinsLeft] = useState(3);

  const prizes = [
    { id: 1, name: "100 Coins", icon: "💰", color: "bg-yellow-400" },
    { id: 2, name: "Free Premium", icon: "👑", color: "bg-purple-400" },
    { id: 3, name: "50 Coins", icon: "🪙", color: "bg-blue-400" },
    { id: 4, name: "Trophy Badge", icon: "🏆", color: "bg-orange-400" },
    { id: 5, name: "200 Coins", icon: "💎", color: "bg-green-400" },
    { id: 6, name: "Mystery Gift", icon: "🎁", color: "bg-pink-400" },
    { id: 7, name: "25 Coins", icon: "🌟", color: "bg-cyan-400" },
    { id: 8, name: "Lucky Charm", icon: "🍀", color: "bg-red-400" },
  ];

  const recentWinners = [
    { name: "Sarah J.", prize: "200 Coins", time: "2 min ago" },
    { name: "Mike C.", prize: "Trophy Badge", time: "5 min ago" },
    { name: "Emma D.", prize: "Free Premium", time: "8 min ago" },
    { name: "Alex T.", prize: "100 Coins", time: "12 min ago" },
  ];

  const handleSpin = () => {
    if (spinsLeft > 0 && !spinning) {
      setSpinning(true);
      setTimeout(() => {
        setSpinning(false);
        setSpinsLeft(spinsLeft - 1);
        // Mock prize win
        alert("🎉 You won 100 Coins!");
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 pb-20">
      <AppHeader title="Lucky Wheel" showBack />

      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mx-auto mb-3 flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Spin & Win!</h2>
          <p className="text-gray-600">Try your luck and win amazing prizes</p>
        </div>

        {/* Spins Left */}
        <Card>
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-gray-900">Spins Available</span>
              </div>
              <span className="text-2xl font-bold text-blue-600">{spinsLeft}</span>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Next free spin in 4 hours or purchase more spins
            </p>
          </div>
        </Card>

        {/* Wheel */}
        <Card>
          <div className="p-6">
            <div className="relative w-full aspect-square max-w-sm mx-auto mb-6">
              {/* Wheel Circle */}
              <div
                className={`w-full h-full rounded-full border-8 border-gray-200 relative overflow-hidden ${
                  spinning ? "animate-spin" : ""
                }`}
                style={{ animationDuration: spinning ? "3s" : "0s" }}
              >
                <div className="w-full h-full grid grid-cols-2 grid-rows-4">
                  {prizes.map((prize, index) => (
                    <div
                      key={prize.id}
                      className={`${prize.color} flex flex-col items-center justify-center border border-white`}
                    >
                      <div className="text-3xl mb-1">{prize.icon}</div>
                      <div className="text-xs font-semibold text-white text-center px-1">
                        {prize.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Center Button */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                <button
                  onClick={handleSpin}
                  disabled={spinning || spinsLeft === 0}
                  className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {spinning ? "..." : "SPIN"}
                </button>
              </div>

              {/* Pointer */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-3">
                <div className="w-0 h-0 border-l-8 border-r-8 border-t-12 border-l-transparent border-r-transparent border-t-red-500"></div>
              </div>
            </div>

            {spinsLeft === 0 && (
              <Button variant="primary" fullWidth>
                Get More Spins
              </Button>
            )}
          </div>
        </Card>

        {/* Prizes */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3 px-2">Available Prizes</h3>
          <div className="grid grid-cols-4 gap-2">
            {prizes.slice(0, 4).map((prize) => (
              <Card key={prize.id}>
                <div className="p-3 text-center">
                  <div className="text-3xl mb-2">{prize.icon}</div>
                  <div className="text-xs text-gray-900 font-medium">{prize.name}</div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Winners */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3 px-2">Recent Winners</h3>
          <Card>
            <div className="divide-y divide-gray-100">
              {recentWinners.map((winner, index) => (
                <div key={index} className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <Trophy className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{winner.name}</div>
                      <div className="text-sm text-gray-600">{winner.prize}</div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">{winner.time}</div>
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
