import { useState } from "react";
import { useNavigate } from "react-router";
import { AppHeader } from "../common/AppHeader";
import { BottomNav } from "../common/BottomNav";
import { Button } from "../common/Button";
import { Card } from "../common/Card";
import { Search, Filter, ShoppingCart, Star, TrendingUp } from "lucide-react";

export function RealDreamMarket() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = [
    { id: "all", label: "All" },
    { id: "journals", label: "Journals" },
    { id: "courses", label: "Courses" },
    { id: "tools", label: "Tools" },
    { id: "services", label: "Services" },
  ];

  const featuredProducts = [
    {
      id: 1,
      name: "Dream Journal Pro",
      price: "$12.99",
      rating: 4.8,
      reviews: 234,
      image: "📔",
      vendor: "Dream Shop",
      badge: "Bestseller",
    },
    {
      id: 2,
      name: "Goal Setting Masterclass",
      price: "$49.99",
      rating: 4.9,
      reviews: 189,
      image: "🎓",
      vendor: "Dream Academy",
      badge: "New",
    },
    {
      id: 3,
      name: "Vision Board Kit",
      price: "$29.99",
      rating: 4.7,
      reviews: 156,
      image: "🎨",
      vendor: "Creative Dreams",
      badge: "Popular",
    },
  ];

  const products = [
    {
      id: 4,
      name: "Productivity Planner",
      price: "$19.99",
      rating: 4.6,
      reviews: 98,
      image: "📅",
      vendor: "Dream Tools",
    },
    {
      id: 5,
      name: "Meditation Course",
      price: "$39.99",
      rating: 4.8,
      reviews: 145,
      image: "🧘",
      vendor: "Mindful Dreams",
    },
    {
      id: 6,
      name: "Achievement Tracker",
      price: "$15.99",
      rating: 4.5,
      reviews: 76,
      image: "📊",
      vendor: "Dream Analytics",
    },
    {
      id: 7,
      name: "Dream Coaching (1 Hour)",
      price: "$79.99",
      rating: 5.0,
      reviews: 45,
      image: "💬",
      vendor: "Pro Coaches",
    },
    {
      id: 8,
      name: "Habit Tracker App",
      price: "$9.99",
      rating: 4.7,
      reviews: 312,
      image: "📱",
      vendor: "Digital Dreams",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <AppHeader title="RealDream Market" showBack />

      <div className="p-4 space-y-6">
        {/* Search Bar */}
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="w-12 h-12 bg-white border border-gray-200 rounded-xl flex items-center justify-center">
            <Filter className="w-5 h-5 text-gray-600" />
          </button>
          <button className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center relative">
            <ShoppingCart className="w-5 h-5 text-white" />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
              3
            </span>
          </button>
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeCategory === category.id
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Featured Products */}
        <div>
          <div className="flex items-center justify-between mb-3 px-2">
            <h2 className="font-semibold text-gray-900">Featured</h2>
            <TrendingUp className="w-5 h-5 text-blue-600" />
          </div>
          <div className="space-y-3">
            {featuredProducts.map((product) => (
              <Card key={product.id}>
                <div className="p-4 flex items-center gap-4">
                  <div className="w-20 h-20 bg-gray-100 rounded-xl flex items-center justify-center text-4xl flex-shrink-0">
                    {product.image}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{product.name}</h3>
                      {product.badge && (
                        <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full whitespace-nowrap">
                          {product.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{product.vendor}</p>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-sm font-medium text-gray-900">{product.rating}</span>
                        <span className="text-sm text-gray-600">({product.reviews})</span>
                      </div>
                      <span className="text-lg font-bold text-blue-600">{product.price}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* All Products */}
        <div>
          <h2 className="font-semibold text-gray-900 mb-3 px-2">All Products</h2>
          <div className="grid grid-cols-2 gap-3">
            {products.map((product) => (
              <Card key={product.id}>
                <div className="p-4">
                  <div className="w-full aspect-square bg-gray-100 rounded-xl flex items-center justify-center text-5xl mb-3">
                    {product.image}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1 text-sm line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-xs text-gray-600 mb-2">{product.vendor}</p>
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                    <span className="text-xs font-medium text-gray-900">{product.rating}</span>
                    <span className="text-xs text-gray-600">({product.reviews})</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-blue-600">{product.price}</span>
                    <button className="p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      <ShoppingCart className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
