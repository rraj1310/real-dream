import { useState } from "react";
import { useNavigate } from "react-router";
import { AppHeader } from "../common/AppHeader";
import { BottomNav } from "../common/BottomNav";
import { Card } from "../common/Card";
import { Heart, MessageCircle, Share2, MoreHorizontal, Plus } from "lucide-react";

export function NewsFeed() {
  const navigate = useNavigate();

  const posts = [
    {
      id: 1,
      user: { name: "Sarah Johnson", avatar: "SJ", username: "@sarahj" },
      time: "2 hours ago",
      content: "Just completed my first marathon! 🏃‍♀️ Dreams do come true when you work hard for them. Thank you all for the support! #DreamAchieved #Marathon",
      image: "🏃‍♀️",
      likes: 234,
      comments: 45,
      shares: 12,
      liked: false,
    },
    {
      id: 2,
      user: { name: "Mike Chen", avatar: "MC", username: "@mikechen" },
      time: "5 hours ago",
      content: "Starting a new group dream: Community Garden Project 🌱 Looking for 5 more members to join! Let's make our neighborhood beautiful together.",
      image: "🌱",
      likes: 156,
      comments: 28,
      shares: 8,
      liked: true,
    },
    {
      id: 3,
      user: { name: "Emma Davis", avatar: "ED", username: "@emmad" },
      time: "1 day ago",
      content: "Day 25 of my 30-Day Fitness Challenge! 💪 Feeling stronger every day. Who else is crushing their goals this week?",
      image: "💪",
      likes: 189,
      comments: 34,
      shares: 6,
      liked: false,
    },
    {
      id: 4,
      user: { name: "Alex Turner", avatar: "AT", username: "@alexturner" },
      time: "2 days ago",
      content: "Published my first article today! ✍️ It's been a long journey learning to write, but every dream starts with a single step.",
      image: "✍️",
      likes: 267,
      comments: 52,
      shares: 15,
      liked: true,
    },
  ];

  const [postStates, setPostStates] = useState(posts);

  const toggleLike = (postId: number) => {
    setPostStates((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              liked: !post.liked,
              likes: post.liked ? post.likes - 1 : post.likes + 1,
            }
          : post
      )
    );
  };

  const handleComment = (postId: number) => {
    const comment = prompt("Write a comment:");
    if (comment) {
      alert(`✅ Comment added: "${comment}"`);
      setPostStates((prev) =>
        prev.map((post) =>
          post.id === postId
            ? { ...post, comments: post.comments + 1 }
            : post
        )
      );
    }
  };

  const handleShare = (postId: number, userName: string) => {
    const shareOptions = confirm(
      `Share @${userName}'s post?\n\nOK = Share to feed\nCancel = Copy link`
    );
    if (shareOptions) {
      alert("✅ Post shared to your feed!");
      setPostStates((prev) =>
        prev.map((post) =>
          post.id === postId
            ? { ...post, shares: post.shares + 1 }
            : post
        )
      );
    } else {
      alert("📋 Link copied to clipboard!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      <AppHeader title="News Feed" showNotifications />

      <div className="p-4 space-y-4">
        {/* Create Post Button */}
        <Card onClick={() => alert("Create Post: Upload photo, write caption, add location")}>
          <div className="p-4 flex items-center gap-3 cursor-pointer">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold">JD</span>
            </div>
            <div className="flex-1 text-gray-500 dark:text-gray-400">What's on your mind?</div>
            <Plus className="w-5 h-5 text-gray-400" />
          </div>
        </Card>

        {/* Posts */}
        {postStates.map((post) => (
          <Card key={post.id}>
            <div className="p-4">
              {/* Post Header */}
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">
                    {post.user.avatar}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">{post.user.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{post.time}</p>
                </div>
                <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                  <MoreHorizontal className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {/* Post Content */}
              <p className="text-gray-900 dark:text-gray-100 mb-3">{post.content}</p>

              {/* Post Image */}
              {post.image && (
                <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-xl flex items-center justify-center text-6xl mb-3">
                  {post.image}
                </div>
              )}

              {/* Post Stats */}
              <div className="flex items-center justify-between py-2 border-t border-b border-gray-100 dark:border-gray-700 mb-2">
                <div className="text-sm text-gray-600 dark:text-gray-400">{post.likes} likes</div>
                <div className="flex gap-3 text-sm text-gray-600 dark:text-gray-400">
                  <span>{post.comments} comments</span>
                  <span>{post.shares} shares</span>
                </div>
              </div>

              {/* Post Actions */}
              <div className="flex items-center justify-around">
                <button
                  onClick={() => toggleLike(post.id)}
                  className={`flex items-center gap-2 py-2 px-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                    post.liked ? "text-red-600" : "text-gray-600 dark:text-gray-400"
                  }`}
                >
                  <Heart
                    className={`w-5 h-5 ${post.liked ? "fill-red-600" : ""}`}
                  />
                  <span className="text-sm font-medium">Like</span>
                </button>
                <button 
                  onClick={() => handleComment(post.id)}
                  className="flex items-center gap-2 py-2 px-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">Comment</span>
                </button>
                <button 
                  onClick={() => handleShare(post.id, post.user.username)}
                  className="flex items-center gap-2 py-2 px-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors"
                >
                  <Share2 className="w-5 h-5" />
                  <span className="text-sm font-medium">Share</span>
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <BottomNav />
    </div>
  );
}