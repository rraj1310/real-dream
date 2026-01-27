import { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, Pressable, ActivityIndicator, RefreshControl } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, { FadeInDown } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

import { ThemedText } from "@/components/ThemedText";
import { GalaxyBackground } from "@/components/GalaxyBackground";
import { Card } from "@/components/Card";
import { AdBanner } from "@/components/AdBanner";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/context/AuthContext";
import { Spacing, BorderRadius } from "@/constants/theme";
import { getApiUrl } from "@/lib/query-client";

type NewsFeedPost = {
  id: string;
  userId: string;
  dreamId: string | null;
  content: string;
  imageUrl: string | null;
  likes: number;
  comments: number;
  createdAt: string;
  user: {
    id: string;
    username: string;
    fullName: string | null;
    profileImage: string | null;
  } | null;
  dream: {
    id: string;
    title: string;
    type: string;
  } | null;
};

const defaultFeedPosts = [
  {
    id: "1",
    user: "Sarah Johnson",
    content: "Just completed my 100th dream goal! So grateful for this community.",
    time: "2 hours ago",
    likes: 156,
    comments: 24,
    gradient: ["#8B5CF6", "#A855F7"] as [string, string],
    achievement: "Century Champion",
  },
  {
    id: "2",
    user: "Mike Chen",
    content: "Started my fitness journey today. Day 1 of 365! Wish me luck!",
    time: "5 hours ago",
    likes: 89,
    comments: 42,
    gradient: ["#22C55E", "#10B981"] as [string, string],
  },
  {
    id: "3",
    user: "Emma Davis",
    content: "Earned my first gold badge! Hard work pays off.",
    time: "1 day ago",
    likes: 234,
    comments: 31,
    gradient: ["#EAB308", "#F59E0B"] as [string, string],
    achievement: "Gold Achiever",
  },
  {
    id: "4",
    user: "Alex Williams",
    content: "Completed my career development goal! Got promoted to Senior Engineer!",
    time: "2 days ago",
    likes: 312,
    comments: 56,
    gradient: ["#3B82F6", "#60A5FA"] as [string, string],
    achievement: "Career Star",
  },
];

const typeGradients: { [key: string]: [string, string] } = {
  personal: ["#8B5CF6", "#A855F7"],
  challenge: ["#22C55E", "#10B981"],
  group: ["#EAB308", "#F59E0B"],
};

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) {
    return `${diffMins} minutes ago`;
  } else if (diffHours < 24) {
    return `${diffHours} hours ago`;
  } else {
    return `${diffDays} days ago`;
  }
}

export default function NewsFeedScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const { theme } = useTheme();
  const { token } = useAuth();
  const [feedPosts, setFeedPosts] = useState<NewsFeedPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());

  const fetchNewsFeed = async () => {
    try {
      const response = await fetch(new URL('/api/news-feed', getApiUrl()).toString());
      if (response.ok) {
        const data = await response.json();
        setFeedPosts(data);
      }
    } catch (error) {
      console.error("Failed to fetch news feed:", error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNewsFeed();
  }, []);

  const handleLike = async (postId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    if (likedPosts.has(postId)) return;
    
    try {
      const response = await fetch(new URL(`/api/news-feed/${postId}/like`, getApiUrl()).toString(), {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        setLikedPosts(prev => new Set([...prev, postId]));
        setFeedPosts(prev => 
          prev.map(post => 
            post.id === postId ? { ...post, likes: post.likes + 1 } : post
          )
        );
      }
    } catch (error) {
      console.error("Failed to like post:", error);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchNewsFeed();
  };

  const getGradient = (type: string | undefined): [string, string] => {
    return typeGradients[type || "personal"] || ["#6B7280", "#9CA3AF"];
  };

  const displayPosts = feedPosts.length > 0 ? feedPosts : [];

  return (
    <GalaxyBackground>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: headerHeight + Spacing.xl,
            paddingBottom: insets.bottom + Spacing.xl,
          },
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Animated.View entering={FadeInDown.springify()}>
          <ThemedText type="h3" style={styles.title}>
            Community Feed
          </ThemedText>
          <ThemedText type="body" style={[styles.subtitle, { color: theme.textSecondary }]}>
            See what others are achieving
          </ThemedText>
        </Animated.View>

        <AdBanner />

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.link} />
          </View>
        ) : displayPosts.length > 0 ? (
          displayPosts.map((post, index) => (
            <Animated.View
              key={post.id}
              entering={FadeInDown.delay(index * 80).springify()}
            >
              <Card style={styles.postCard}>
                <View style={styles.postHeader}>
                  <LinearGradient
                    colors={getGradient(post.dream?.type)}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.avatar}
                  >
                    <Feather name="user" size={20} color="#FFFFFF" />
                  </LinearGradient>
                  <View style={styles.userInfo}>
                    <ThemedText type="body" style={styles.userName}>
                      {post.user?.fullName || post.user?.username || "Anonymous"}
                    </ThemedText>
                    <ThemedText type="xs" style={{ color: theme.textMuted }}>
                      {formatTimeAgo(post.createdAt)}
                    </ThemedText>
                  </View>
                </View>

                <ThemedText type="body" style={styles.postContent}>
                  {post.content}
                </ThemedText>

                {post.dream ? (
                  <View style={[styles.achievementBadge, { backgroundColor: theme.backgroundSecondary }]}>
                    <Feather name="award" size={14} color={theme.yellow} />
                    <ThemedText type="small" style={{ color: theme.text, marginLeft: Spacing.xs }}>
                      {post.dream.title}
                    </ThemedText>
                  </View>
                ) : null}

                <View style={[styles.postActions, { borderTopColor: "rgba(139, 127, 199, 0.3)" }]}>
                  <Pressable
                    onPress={() => handleLike(post.id)}
                    style={styles.actionButton}
                  >
                    <Feather 
                      name={likedPosts.has(post.id) ? "heart" : "heart"} 
                      size={18} 
                      color={likedPosts.has(post.id) ? theme.error : theme.textSecondary} 
                    />
                    <ThemedText type="small" style={{ color: theme.textSecondary, marginLeft: Spacing.xs }}>
                      {post.likes}
                    </ThemedText>
                  </Pressable>
                  <Pressable style={styles.actionButton}>
                    <Feather name="message-circle" size={18} color={theme.textSecondary} />
                    <ThemedText type="small" style={{ color: theme.textSecondary, marginLeft: Spacing.xs }}>
                      {post.comments}
                    </ThemedText>
                  </Pressable>
                  <Pressable style={styles.actionButton}>
                    <Feather name="share" size={18} color={theme.textSecondary} />
                  </Pressable>
                </View>
              </Card>
            </Animated.View>
          ))
        ) : (
          defaultFeedPosts.map((post, index) => (
            <Animated.View
              key={post.id}
              entering={FadeInDown.delay(index * 80).springify()}
            >
              <Card style={styles.postCard}>
                <View style={styles.postHeader}>
                  <LinearGradient
                    colors={post.gradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.avatar}
                  >
                    <Feather name="user" size={20} color="#FFFFFF" />
                  </LinearGradient>
                  <View style={styles.userInfo}>
                    <ThemedText type="body" style={styles.userName}>
                      {post.user}
                    </ThemedText>
                    <ThemedText type="xs" style={{ color: theme.textMuted }}>
                      {post.time}
                    </ThemedText>
                  </View>
                </View>

                <ThemedText type="body" style={styles.postContent}>
                  {post.content}
                </ThemedText>

                {post.achievement ? (
                  <View style={[styles.achievementBadge, { backgroundColor: theme.backgroundSecondary }]}>
                    <Feather name="award" size={14} color={theme.yellow} />
                    <ThemedText type="small" style={{ color: theme.text, marginLeft: Spacing.xs }}>
                      {post.achievement}
                    </ThemedText>
                  </View>
                ) : null}

                <View style={[styles.postActions, { borderTopColor: "rgba(139, 127, 199, 0.3)" }]}>
                  <Pressable style={styles.actionButton}>
                    <Feather name="heart" size={18} color={theme.textSecondary} />
                    <ThemedText type="small" style={{ color: theme.textSecondary, marginLeft: Spacing.xs }}>
                      {post.likes}
                    </ThemedText>
                  </Pressable>
                  <Pressable style={styles.actionButton}>
                    <Feather name="message-circle" size={18} color={theme.textSecondary} />
                    <ThemedText type="small" style={{ color: theme.textSecondary, marginLeft: Spacing.xs }}>
                      {post.comments}
                    </ThemedText>
                  </Pressable>
                  <Pressable style={styles.actionButton}>
                    <Feather name="share" size={18} color={theme.textSecondary} />
                  </Pressable>
                </View>
              </Card>
            </Animated.View>
          ))
        )}
      </ScrollView>
    </GalaxyBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.lg,
  },
  title: {
    marginBottom: Spacing.xs,
  },
  subtitle: {
    marginBottom: Spacing.md,
  },
  loadingContainer: {
    padding: Spacing["3xl"],
    alignItems: "center",
    justifyContent: "center",
  },
  postCard: {
    padding: Spacing.lg,
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontWeight: "600",
    marginBottom: 2,
  },
  postContent: {
    marginBottom: Spacing.md,
    lineHeight: 22,
  },
  achievementBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    marginBottom: Spacing.md,
  },
  postActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xl,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
  },
});
