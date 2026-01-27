import { useState } from "react";
import { useNavigate } from "react-router";
import { AppHeader } from "../common/AppHeader";
import { BottomNav } from "../common/BottomNav";
import { Card } from "../common/Card";
import { Button } from "../common/Button";
import { Award, Check } from "lucide-react";

export function SubscriptionPackages() {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const packages = [
    {
      id: "bronze",
      name: "BRONZE",
      icon: "🥉",
      color: "bg-gradient-to-br from-orange-400 to-orange-600",
      price: "$4.99",
      period: "/month",
      features: ["Basic dream tracking", "5 active dreams", "Community access"],
    },
    {
      id: "silver",
      name: "SILVER",
      icon: "🥈",
      color: "bg-gradient-to-br from-gray-300 to-gray-500",
      price: "$9.99",
      period: "/month",
      features: ["Everything in Bronze", "15 active dreams", "Priority support", "Advanced analytics"],
    },
    {
      id: "gold",
      name: "GOLD",
      icon: "🥇",
      color: "bg-gradient-to-br from-yellow-400 to-yellow-600",
      price: "$19.99",
      period: "/month",
      features: ["Everything in Silver", "Unlimited dreams", "Premium themes", "Ad-free experience"],
    },
    {
      id: "platinum",
      name: "PLATINUM",
      icon: "💎",
      color: "bg-gradient-to-br from-purple-400 to-purple-600",
      price: "$29.99",
      period: "/month",
      features: ["Everything in Gold", "Personal coach", "Exclusive events", "VIP badge"],
    },
  ];

  const handleSubscribe = (planId: string) => {
    setSelectedPlan(planId);
    alert(`✅ Subscribing to ${planId.toUpperCase()} plan!\n\nYou will be redirected to payment.`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      <AppHeader title="SUBSCRIPTION PACKAGE" showBack />

      <div className="p-4 space-y-4">
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Choose Your Plan</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Unlock premium features and achieve your dreams faster
          </p>
        </div>

        {packages.map((pkg) => (
          <Card key={pkg.id} className={selectedPlan === pkg.id ? "ring-2 ring-blue-500" : ""}>
            <div className="p-6">
              {/* Package Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-16 h-16 ${pkg.color} rounded-full flex items-center justify-center text-3xl`}>
                    {pkg.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">{pkg.name}</h3>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{pkg.price}</span>
                      <span className="text-gray-600 dark:text-gray-400">{pkg.period}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-2 mb-4">
                {pkg.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Subscribe Button */}
              <Button
                onClick={() => handleSubscribe(pkg.id)}
                variant={selectedPlan === pkg.id ? "primary" : "outline"}
                className="w-full"
              >
                {selectedPlan === pkg.id ? "Selected" : "Choose Plan"}
              </Button>
            </div>
          </Card>
        ))}

        {/* Advertisement Placeholder */}
        <div className="bg-blue-400 dark:bg-blue-600 rounded-lg p-6 text-center">
          <p className="text-white font-semibold text-lg">ADVERTISEMENT</p>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}