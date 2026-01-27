import { View, StyleSheet, ScrollView, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, { FadeInDown } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Card } from "@/components/Card";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";

type FeedPost = {
  id: string;
  user: string;
  content: string;
  time: string;
  likes: number;
  comments: number;
  gradient: [string, string];
  achievement?: string;
};

const feedPosts: FeedPost[] = [
  {
    id: "1",
    user: "Sarah Johnson",
    content: "Just completed my 100th dream goal! So grateful for this community.",
    time: "2 hours ago",
    likes: 156,
    comments: 24,
    gradient: ["#8B5CF6", "#A855F7"],
    achievement: "Century Champion",
  },
  {
    id: "2",
    user: "Mike Chen",
    content: "Started my fitness journey today. Day 1 of 365! Wish me luck!",
    time: "5 hours ago",
    likes: 89,
    comments: 42,
    gradient: ["#22C55E", "#10B981"],
  },
  {
    id: "3",
    user: "Emma Davis",
    content: "Earned my first gold badge! Hard work pays off.",
    time: "1 day ago",
    likes: 234,
    comments: 31,
    gradient: ["#EAB308", "#F59E0B"],
    achievement: "Gold Achiever",
  },
  {
    id: "4",
    user: "Alex Williams",
    content: "Completed my career development goal! Got promoted to Senior Engineer!",
    time: "2 days ago",
    likes: 312,
    comments: 56,
    gradient: ["#3B82F6", "#60A5FA"],
    achievement: "Career Star",
  },
];

export default function NewsFeedScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const { theme } = useTheme();

  const handleLike = (post: FeedPost) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return (
    <ThemedView style={styles.container}>
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
      >
        <Animated.View entering={FadeInDown.springify()}>
          <ThemedText type="h3" style={styles.title}>
            Community Feed
          </ThemedText>
          <ThemedText type="body" style={[styles.subtitle, { color: theme.textSecondary }]}>
            See what others are achieving
          </ThemedText>
        </Animated.View>

        {feedPosts.map((post, index) => (
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

              <View style={styles.postActions}>
                <Pressable
                  onPress={() => handleLike(post)}
                  style={styles.actionButton}
                >
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
        ))}
      </ScrollView>
    </ThemedView>
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
    borderTopColor: "#F3F4F6",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
  },
});
