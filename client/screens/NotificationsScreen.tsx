import { View, StyleSheet, ScrollView, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, { FadeInDown } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

import { ThemedText } from "@/components/ThemedText";
import { GalaxyBackground } from "@/components/GalaxyBackground";
import { AdBanner } from "@/components/AdBanner";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";

type Notification = {
  id: string;
  title: string;
  description: string;
  time: string;
  type: "achievement" | "social" | "system" | "reward";
  read: boolean;
};

const notifications: Notification[] = [
  {
    id: "1",
    title: "Achievement Unlocked!",
    description: "You've completed 10 dreams this month. Amazing work!",
    time: "5 min ago",
    type: "achievement",
    read: false,
  },
  {
    id: "2",
    title: "New Follower",
    description: "Sarah Johnson started following you.",
    time: "1 hour ago",
    type: "social",
    read: false,
  },
  {
    id: "3",
    title: "Daily Reward Ready",
    description: "Your daily spin is available! Win up to 500 coins.",
    time: "2 hours ago",
    type: "reward",
    read: false,
  },
  {
    id: "4",
    title: "Goal Reminder",
    description: "Don't forget to update your fitness goal progress.",
    time: "Yesterday",
    type: "system",
    read: true,
  },
  {
    id: "5",
    title: "New Challenge Available",
    description: "Join the January Fitness Challenge and win prizes!",
    time: "2 days ago",
    type: "reward",
    read: true,
  },
];

const getNotificationIcon = (type: string): keyof typeof Feather.glyphMap => {
  switch (type) {
    case "achievement":
      return "award";
    case "social":
      return "users";
    case "reward":
      return "gift";
    default:
      return "bell";
  }
};

const getNotificationGradient = (type: string): [string, string] => {
  switch (type) {
    case "achievement":
      return ["#EAB308", "#F59E0B"];
    case "social":
      return ["#8B5CF6", "#A855F7"];
    case "reward":
      return ["#22C55E", "#10B981"];
    default:
      return ["#3B82F6", "#60A5FA"];
  }
};

export default function NotificationsScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const { theme } = useTheme();

  const handleNotificationPress = (notification: Notification) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

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
      >
        <Animated.View entering={FadeInDown.springify()}>
          <View style={styles.headerRow}>
            <View>
              <ThemedText type="h3">Notifications</ThemedText>
              <ThemedText type="small" style={{ color: theme.textSecondary }}>
                {unreadCount > 0 ? `${unreadCount} new notifications` : "All caught up!"}
              </ThemedText>
            </View>
            <Pressable
              style={[styles.markAllButton, { backgroundColor: "rgba(45, 39, 82, 0.6)" }]}
            >
              <Feather name="check-circle" size={16} color="#A78BFA" />
              <ThemedText type="xs" style={{ color: "#A78BFA", marginLeft: 4 }}>
                Mark all read
              </ThemedText>
            </Pressable>
          </View>
        </Animated.View>

        <AdBanner variant="compact" />

        {notifications.map((notification, index) => (
          <Animated.View
            key={notification.id}
            entering={FadeInDown.delay(index * 60).springify()}
          >
            <Pressable
              onPress={() => handleNotificationPress(notification)}
              style={[
                styles.notificationCard,
                { backgroundColor: "rgba(45, 39, 82, 0.6)" },
                !notification.read
                  ? { borderLeftWidth: 3, borderLeftColor: "#A78BFA" }
                  : null,
              ]}
            >
              <LinearGradient
                colors={getNotificationGradient(notification.type)}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.iconContainer}
              >
                <Feather
                  name={getNotificationIcon(notification.type)}
                  size={18}
                  color="#FFFFFF"
                />
              </LinearGradient>
              <View style={styles.notificationContent}>
                <ThemedText
                  type="body"
                  style={[
                    styles.notificationTitle,
                    !notification.read ? { fontWeight: "700" } : null,
                  ]}
                >
                  {notification.title}
                </ThemedText>
                <ThemedText
                  type="small"
                  style={{ color: theme.textSecondary, marginBottom: 4 }}
                  numberOfLines={2}
                >
                  {notification.description}
                </ThemedText>
                <ThemedText type="xs" style={{ color: theme.textMuted }}>
                  {notification.time}
                </ThemedText>
              </View>
              {!notification.read ? (
                <View style={[styles.unreadDot, { backgroundColor: theme.accent }]} />
              ) : null}
            </Pressable>
          </Animated.View>
        ))}
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
    gap: Spacing.md,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: Spacing.md,
  },
  markAllButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  notificationCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    gap: Spacing.md,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontWeight: "600",
    marginBottom: 2,
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 4,
  },
});
