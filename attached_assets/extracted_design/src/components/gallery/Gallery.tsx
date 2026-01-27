import { useState } from "react";
import { useNavigate } from "react-router";
import { AppHeader } from "../common/AppHeader";
import { BottomNav } from "../common/BottomNav";
import { Card } from "../common/Card";
import { Grid, List, Plus, Heart, MessageCircle } from "lucide-react";

export function Gallery() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const galleryItems = [
    {
      id: 1,
      title: "Marathon Finish Line",
      date: "Jan 15, 2024",
      category: "Achievement",
      image: "🏃‍♀️",
      likes: 234,
      comments: 45,
    },
    {
      id: 2,
      title: "Vision Board 2024",
      date: "Jan 1, 2024",
      category: "Inspiration",
      image: "🎨",
      likes: 156,
      comments: 28,
    },
    {
      id: 3,
      title: "Book Collection",
      date: "Dec 28, 2023",
      category: "Progress",
      image: "📚",
      likes: 189,
      comments: 34,
    },
    {
      id: 4,
      title: "Morning Routine",
      date: "Dec 20, 2023",
      category: "Lifestyle",
      image: "☀️",
      likes: 267,
      comments: 52,
    },
    {
      id: 5,
      title: "Workout Progress",
      date: "Dec 15, 2023",
      category: "Fitness",
      image: "💪",
      likes: 198,
      comments: 41,
    },
    {
      id: 6,
      title: "Travel Goals",
      date: "Dec 10, 2023",
      category: "Dreams",
      image: "✈️",
      likes: 312,
      comments: 67,
    },
  ];

  const categories = ["All", "Achievement", "Inspiration", "Progress", "Lifestyle", "Fitness", "Dreams"];
  const [activeCategory, setActiveCategory] = useState("All");

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <AppHeader title="Gallery" showBack showNotifications />

      <div className="p-4 space-y-4">
        {/* View Controls */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide flex-1">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  activeCategory === category
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-100"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          <div className="flex gap-2 ml-4">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg ${
                viewMode === "grid" ? "bg-blue-600 text-white" : "bg-white text-gray-600"
              }`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg ${
                viewMode === "list" ? "bg-blue-600 text-white" : "bg-white text-gray-600"
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Upload Button */}
        <button className="w-full py-3 bg-blue-600 text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors">
          <Plus className="w-5 h-5" />
          Upload to Gallery
        </button>

        {/* Gallery Grid View */}
        {viewMode === "grid" && (
          <div className="grid grid-cols-2 gap-3">
            {galleryItems.map((item) => (
              <Card key={item.id}>
                <div className="p-3">
                  <div className="w-full aspect-square bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center text-5xl mb-3">
                    {item.image}
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-600 mb-2">{item.date}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-600">
                    <div className="flex items-center gap-1">
                      <Heart className="w-3 h-3" />
                      <span>{item.likes}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="w-3 h-3" />
                      <span>{item.comments}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Gallery List View */}
        {viewMode === "list" && (
          <div className="space-y-3">
            {galleryItems.map((item) => (
              <Card key={item.id}>
                <div className="p-4 flex items-center gap-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center text-3xl flex-shrink-0">
                    {item.image}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs">
                        {item.category}
                      </span>
                      <span>{item.date}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        <span>{item.likes}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="w-4 h-4" />
                        <span>{item.comments}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
