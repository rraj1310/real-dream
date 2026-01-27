import { useNavigate } from "react-router";
import { ArrowLeft, Bell, Settings, MessageSquare, Gem } from "lucide-react";

interface AppHeaderProps {
  title: string;
  showBack?: boolean;
  showNotifications?: boolean;
  showSettings?: boolean;
  showMessages?: boolean;
  showSpin?: boolean;
}

export function AppHeader({
  title,
  showBack = false,
  showNotifications = false,
  showSettings = false,
  showMessages = true,
  showSpin = true,
}: AppHeaderProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-4 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-3 flex-1">
        {showBack && (
          <button onClick={handleBack} className="p-2 -ml-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
            <ArrowLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </button>
        )}
        <h1 className="font-semibold text-gray-900 dark:text-gray-100">{title}</h1>
      </div>
      
      <div className="flex items-center gap-2">
        {showSpin && (
          <button 
            onClick={() => navigate('/lucky-wheel')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg relative"
            title="Lucky Wheel"
          >
            <Gem className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </button>
        )}
        {showMessages && (
          <button 
            onClick={() => navigate('/messages')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg relative"
            title="Messages"
          >
            <MessageSquare className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </button>
        )}
        {showNotifications && (
          <button 
            onClick={() => navigate('/notifications')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg relative"
          >
            <Bell className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
        )}
        {showSettings && (
          <button 
            onClick={() => navigate('/settings')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <Settings className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </button>
        )}
      </div>
    </header>
  );
}