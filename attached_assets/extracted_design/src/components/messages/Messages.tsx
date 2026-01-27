import { useNavigate } from "react-router";
import { AppHeader } from "../common/AppHeader";
import { BottomNav } from "../common/BottomNav";
import { Card } from "../common/Card";
import { User } from "lucide-react";

export function Messages() {
  const navigate = useNavigate();

  const messages = [
    {
      from: "ABC",
      date: "dd-mm/yyyy hh:mm",
      message: "xxxxxxxxxxxxxxxxx...",
      unread: true,
    },
    {
      from: "ABC",
      date: "dd-mm/yyyy hh:mm",
      message: "xxxxxxxxxxxxxxxxx...",
      unread: true,
    },
    {
      from: "ABC",
      date: "dd-mm/yyyy hh:mm",
      message: "xxxxxxxxxxxxxxxxx...",
      unread: false,
    },
    {
      from: "ABC",
      date: "dd-mm/yyyy hh:mm",
      message: "xxxxxxxxxxxxxxxxx...",
      unread: true,
    },
    {
      from: "ABC",
      date: "dd-mm/yyyy hh:mm",
      message: "xxxxxxxxxxxxxxxxx...",
      unread: false,
    },
    {
      from: "ABC",
      date: "dd-mm/yyyy hh:mm",
      message: "xxxxxxxxxxxxxxxxx...",
      unread: false,
    },
  ];

  const handleMessageClick = (from: string) => {
    alert(`Opening conversation with ${from}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      <AppHeader title="MESSAGES" showBack />

      <div className="p-4 space-y-4">
        {/* Messages List */}
        <Card>
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {messages.map((msg, index) => (
              <div
                key={index}
                onClick={() => handleMessageClick(msg.from)}
                className={`p-4 flex items-start gap-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                  msg.unread ? "bg-blue-50/50 dark:bg-blue-900/10" : ""
                }`}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                      From: {msg.from}
                    </h3>
                    {msg.unread && (
                      <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></div>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Date: {msg.date}
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300 truncate">
                    Message: {msg.message}
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