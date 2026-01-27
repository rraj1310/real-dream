import { useState } from "react";
import { useNavigate } from "react-router";
import { AppHeader } from "../common/AppHeader";
import { BottomNav } from "../common/BottomNav";
import { Button } from "../common/Button";
import { Card } from "../common/Card";
import {
  Coins,
  Award,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Send,
  TrendingUp,
} from "lucide-react";

export function Wallet() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"coins" | "awards">("coins");

  const balance = {
    coins: 2450,
    awards: 12,
    totalValue: "$245.00",
  };

  const transactions = [
    { type: "earned", amount: "+150", description: "Dream Completed", date: "Today", icon: ArrowDownRight, color: "text-green-600" },
    { type: "spent", amount: "-50", description: "Market Purchase", date: "Yesterday", icon: ArrowUpRight, color: "text-red-600" },
    { type: "earned", amount: "+200", description: "Lucky Wheel Win", date: "2 days ago", icon: ArrowDownRight, color: "text-green-600" },
    { type: "spent", amount: "-100", description: "Premium Upgrade", date: "3 days ago", icon: ArrowUpRight, color: "text-red-600" },
  ];

  const awards = [
    { name: "Dream Master", icon: "🏆", earned: "Jan 2024" },
    { name: "Community Hero", icon: "⭐", earned: "Dec 2023" },
    { name: "Goal Achiever", icon: "🎯", earned: "Nov 2023" },
  ];

  const handleAddCoins = () => {
    alert("💰 Add Coins: Purchase coin packages\n\n100 Coins - $0.99\n500 Coins - $4.99\n1000 Coins - $8.99");
  };

  const handleSendCoins = () => {
    const recipient = prompt("Enter recipient username:");
    if (recipient) {
      const amount = prompt("How many coins to send?");
      if (amount) {
        alert(`✅ Sent ${amount} coins to @${recipient}`);
      }
    }
  };

  const handleWithdraw = () => {
    alert("💳 Withdraw Funds:\n\nMinimum: 1000 coins ($100)\nYour balance: 2450 coins ($245)\n\nConnect your payment method to withdraw.");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      <AppHeader title="Wallet" showBack />

      <div className="p-4 space-y-6">
        {/* Balance Card */}
        <Card>
          <div className="p-6">
            <div className="text-center mb-6">
              <p className="text-gray-600 dark:text-gray-400 mb-2">Total Balance</p>
              <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-1">{balance.coins}</h2>
              <p className="text-gray-600 dark:text-gray-400">Coins ≈ {balance.totalValue}</p>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <Button variant="primary" size="sm" onClick={handleAddCoins}>
                <Plus className="w-4 h-4 mr-1" />
                Add
              </Button>
              <Button variant="outline" size="sm" onClick={handleSendCoins}>
                <Send className="w-4 h-4 mr-1" />
                Send
              </Button>
              <Button variant="outline" size="sm" onClick={handleWithdraw}>
                <TrendingUp className="w-4 h-4 mr-1" />
                Withdraw
              </Button>
            </div>
          </div>
        </Card>

        {/* Tabs */}
        <div className="flex gap-2 bg-white dark:bg-gray-800 rounded-lg p-1">
          <button
            onClick={() => setActiveTab("coins")}
            className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
              activeTab === "coins"
                ? "bg-blue-600 text-white"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Coins className="w-4 h-4" />
              Coins
            </div>
          </button>
          <button
            onClick={() => setActiveTab("awards")}
            className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
              activeTab === "awards"
                ? "bg-blue-600 text-white"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Award className="w-4 h-4" />
              Awards
            </div>
          </button>
        </div>

        {/* Content */}
        {activeTab === "coins" ? (
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 px-2">Recent Transactions</h3>
            <Card>
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {transactions.map((transaction, index) => {
                  const Icon = transaction.icon;
                  return (
                    <div key={index} className="p-4 flex items-center gap-3">
                      <div className={`w-10 h-10 ${transaction.type === "earned" ? "bg-green-100" : "bg-red-100"} rounded-full flex items-center justify-center`}>
                        <Icon className={`w-5 h-5 ${transaction.color}`} />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 dark:text-gray-100">{transaction.description}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">{transaction.date}</div>
                      </div>
                      <div className={`font-semibold ${transaction.color}`}>
                        {transaction.amount}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        ) : (
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 px-2">My Awards ({balance.awards})</h3>
            <div className="grid grid-cols-2 gap-4">
              {awards.map((award, index) => (
                <Card key={index}>
                  <div className="p-6 flex flex-col items-center gap-3">
                    <div className="text-4xl">{award.icon}</div>
                    <div className="text-center">
                      <div className="font-medium text-gray-900 dark:text-gray-100">{award.name}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{award.earned}</div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}