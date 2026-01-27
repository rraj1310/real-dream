import { useState } from "react";
import { useNavigate } from "react-router";
import { AppHeader } from "../common/AppHeader";
import { BottomNav } from "../common/BottomNav";
import { Card } from "../common/Card";
import {
  Heart,
  MessageCircle,
  UserPlus,
  Trophy,
  ShoppingBag,
  Bell,
  X,
} from "lucide-react";

interface Notification {
  id: number;
  icon: any;
  color: string;
  title: string;
  description: string;
  time: string;
  unread: boolean;
  fullMessage?: string;
  actionUrl?: string;
}

export function Notifications() {
  const navigate = useNavigate();

  const initialNotifications: Notification[] = [
    {
      id: 1,
      icon: Heart,
      color: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
      title: "Sarah liked your dream",
      description: '"Complete Marathon Training"',
      time: "5 min ago",
      unread: true,
      fullMessage: "Sarah Johnson liked your dream: 'Complete Marathon Training'. Keep up the great work! 💪",
      actionUrl: "/my-realdream",
    },
    {
      id: 2,
      icon: MessageCircle,
      color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
      title: "New comment on your post",
      description: 'Mike: "Great progress! Keep it up!"',
      time: "1 hour ago",
      unread: true,
      fullMessage: "Mike Chen commented on your post:\n\n\"Great progress! Keep it up! Your dedication to your marathon training is inspiring. Let me know if you need any tips on nutrition and recovery.\"\n\nReply to Mike or view the full conversation.",
      actionUrl: "/news-feed",
    },
    {
      id: 3,
      icon: UserPlus,
      color: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
      title: "Emma started following you",
      description: "Check out their profile",
      time: "3 hours ago",
      unread: true,
      fullMessage: "Emma Davis (@emmad) started following you!\n\nEmma is passionate about fitness and personal growth. They have completed 15 dreams and have 234 followers.\n\nCheck out Emma's profile or follow them back.",
      actionUrl: "/connections",
    },
    {
      id: 4,
      icon: Trophy,
      color: "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400",
      title: "Achievement Unlocked!",
      description: "You've completed 10 dreams",
      time: "1 day ago",
      unread: false,
      fullMessage: "🎉 Congratulations! Achievement Unlocked!\n\nDREAM MASTER\nYou've completed 10 dreams\n\nReward: 500 coins + Dream Master badge\n\nYou're in the top 5% of dream achievers. Keep pushing forward!",
      actionUrl: "/wallet",
    },
    {
      id: 5,
      icon: ShoppingBag,
      color: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
      title: "Order delivered",
      description: "Your Dream Journal has been delivered",
      time: "2 days ago",
      unread: false,
      fullMessage: "📦 Your order has been delivered!\n\nDream Journal Pro\nOrder #RD-2024-001\nDelivered on Jan 23, 2024\n\nThank you for shopping with Real Dream Market! We hope you love your new Dream Journal. Don't forget to leave a review!",
      actionUrl: "/market",
    },
    {
      id: 6,
      icon: Bell,
      color: "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
      title: "Dream reminder",
      description: "Time to update your weekly goals",
      time: "3 days ago",
      unread: false,
      fullMessage: "⏰ Weekly Goal Check-In Reminder\n\nIt's time to update your weekly goals and track your progress!\n\nCurrent active dreams:\n• Complete Marathon Training (75%)\n• Learn Spanish (45%)\n\nTake 5 minutes to reflect on your progress and plan your week ahead.",
      actionUrl: "/my-realdream",
    },
  ];

  const [notifications, setNotifications] = useState(initialNotifications);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

  const handleMarkAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, unread: false }))
    );
  };

  const handleNotificationClick = (notification: Notification) => {
    // Mark as read
    setNotifications(prev =>
      prev.map(n =>
        n.id === notification.id ? { ...n, unread: false } : n
      )
    );
    // Show full notification
    setSelectedNotification(notification);
  };

  const handleCloseModal = () => {
    setSelectedNotification(null);
  };

  const handleNotificationAction = (notification: Notification) => {
    handleCloseModal();
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      <AppHeader title="Notifications" showBack />

      <div className="p-4">
        <div className="flex items-center justify-between mb-4 px-2">
          <h2 className="font-semibold text-gray-900 dark:text-gray-100">
            Recent {unreadCount > 0 && `(${unreadCount} unread)`}
          </h2>
          <button 
            onClick={handleMarkAllAsRead}
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={unreadCount === 0}
          >
            Mark all as read
          </button>
        </div>

        <Card>
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {notifications.map((notification) => {
              const Icon = notification.icon;
              return (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`p-4 flex items-start gap-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                    notification.unread ? "bg-blue-50/50 dark:bg-blue-900/10" : ""
                  }`}
                >
                  <div className={`w-10 h-10 ${notification.color} rounded-full flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 dark:text-gray-100 mb-0.5">
                      {notification.title}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      {notification.description}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-500">{notification.time}</div>
                  </div>
                  {notification.unread && (
                    <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-2"></div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Notification Detail Modal */}
      {selectedNotification && (
        <div 
          className="fixed inset-0 bg-black/50 dark:bg-black/70 z-50 flex items-end sm:items-center justify-center p-4"
          onClick={handleCloseModal}
        >
          <div 
            className="bg-white dark:bg-gray-800 rounded-t-2xl sm:rounded-2xl w-full max-w-md max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 ${selectedNotification.color} rounded-full flex items-center justify-center`}>
                  <selectedNotification.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                    {selectedNotification.title}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {selectedNotification.time}
                  </p>
                </div>
              </div>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line mb-6">
                {selectedNotification.fullMessage}
              </p>

              {/* Action Buttons */}
              <div className="flex gap-3">
                {selectedNotification.actionUrl && (
                  <button
                    onClick={() => handleNotificationAction(selectedNotification)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors"
                  >
                    View Details
                  </button>
                )}
                <button
                  onClick={handleCloseModal}
                  className="flex-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 py-3 rounded-lg font-medium transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}