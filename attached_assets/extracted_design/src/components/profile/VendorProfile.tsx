import { useState } from "react";
import { useNavigate } from "react-router";
import { AppHeader } from "../common/AppHeader";
import { BottomNav } from "../common/BottomNav";
import { Card } from "../common/Card";
import { Input } from "../common/Input";
import { Button } from "../common/Button";
import { User, Save } from "lucide-react";

export function VendorProfile() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "vendor_shop",
    fullName: "My Awesome Shop",
    email: "vendor@shop.com",
    phone: "+1 234 567 8900",
    city: "New York",
    country: "United States",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    alert("✅ Vendor profile updated successfully!");
  };

  const handleCreateProfile = () => {
    alert("Creating new vendor profile...");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      <AppHeader title="VENDOR PROFILE" showBack />

      <div className="p-4 space-y-4">
        {/* Profile Header */}
        <Card>
          <div className="p-6 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-10 h-10 text-white" />
            </div>
            <div className="space-y-2">
              <div className="text-sm text-gray-600 dark:text-gray-400">USERNAME</div>
              <div className="flex items-center justify-center gap-2 flex-wrap">
                <button
                  onClick={handleCreateProfile}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Create Profile
                </button>
                <span className="text-gray-400">|</span>
                <button
                  onClick={handleSave}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        </Card>

        {/* Vendor Form */}
        <Card>
          <div className="p-4 space-y-4">
            <Input
              label="FULL NAME"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter business name"
            />

            <Input
              label="EMAIL ADDRESS"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="vendor@email.com"
            />

            <Input
              label="PHONE NUMBER"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1 234 567 8900"
            />

            <div
              onClick={() => navigate("/messages")}
              className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">MESSAGES</div>
              <div className="font-medium text-gray-900 dark:text-gray-100">View Messages</div>
            </div>

            <Input
              label="CITY"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="Enter city"
            />

            <Input
              label="COUNTRY"
              name="country"
              value={formData.country}
              onChange={handleChange}
              placeholder="Enter country"
            />

            <Button onClick={handleSave} variant="primary" className="w-full">
              <Save className="w-4 h-4 mr-2" />
              Save Profile
            </Button>
          </div>
        </Card>
      </div>

      <BottomNav />
    </div>
  );
}