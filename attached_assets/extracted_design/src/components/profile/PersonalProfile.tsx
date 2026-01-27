import { useNavigate } from "react-router";
import { AppHeader } from "../common/AppHeader";
import { BottomNav } from "../common/BottomNav";
import { Card } from "../common/Card";
import { Button } from "../common/Button";
import { User, Shield, ShoppingBag, Wallet, Edit, Trash2, ChevronRight, Users } from "lucide-react";

export function PersonalProfile() {
  const navigate = useNavigate();

  const handleEditProfile = () => {
    alert("Edit Profile: Update your username, email, phone, bio, etc.");
  };

  const handleDeleteAccount = () => {
    const confirm = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );
    if (confirm) {
      alert("Account deletion requested. You will receive a confirmation email.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      <AppHeader title="PERSONAL PROFILE" showBack />

      <div className="p-4 space-y-4">
        {/* Profile Header */}
        <Card>
          <div className="p-6 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-10 h-10 text-white" />
            </div>
            <div className="space-y-1">
              <div className="text-sm text-gray-600 dark:text-gray-400">USERNAME</div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">john_doe</h2>
              <div className="text-gray-600 dark:text-gray-400">Full Name</div>
              <p className="font-medium text-gray-900 dark:text-gray-100">John Doe</p>
            </div>
          </div>
        </Card>

        {/* Connections */}
        <Card onClick={() => navigate("/connections")}>
          <div className="p-4 flex items-center gap-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">Connections</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">View followers and following</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
        </Card>

        {/* My Achievements */}
        <Card onClick={() => navigate("/wall-of-fame")}>
          <div className="p-4 flex items-center gap-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
              <Shield className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">My Achievements</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">View your badges and awards</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
        </Card>

        {/* MY ORDERS Section */}
        <div>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 px-2">
            MY ORDERS
          </h3>
          <Card>
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              <div
                onClick={() => navigate("/market")}
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <ShoppingBag className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <span className="font-medium text-gray-900 dark:text-gray-100">My Purchase</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
              <div
                onClick={() => navigate("/wallet")}
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Wallet className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <span className="font-medium text-gray-900 dark:text-gray-100">My Wallet</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </Card>
        </div>

        {/* MY ACCOUNT Section */}
        <div>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 px-2">
            MY ACCOUNT
          </h3>
          <Card>
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              <div
                onClick={handleEditProfile}
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Edit className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span className="font-medium text-gray-900 dark:text-gray-100">Edit Profile</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
              <div
                onClick={handleDeleteAccount}
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
                  <span className="font-medium text-red-600 dark:text-red-400">Delete Account</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </Card>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}