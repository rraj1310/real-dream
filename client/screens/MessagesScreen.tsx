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

type Message = {
  id: string;
  sender: string;
  preview: string;
  time: string;
  unread: boolean;
  gradient: [string, string];
};

const messages: Message[] = [
  {
    id: "1",
    sender: "Sarah Johnson",
    preview: "Hey! Great job on completing your goal! Keep it up!",
    time: "2 min",
    unread: true,
    gradient: ["#8B5CF6", "#A855F7"],
  },
  {
    id: "2",
    sender: "Dream Support",
    preview: "Your weekly progress report is ready to view.",
    time: "1 hour",
    unread: true,
    gradient: ["#3B82F6", "#60A5FA"],
  },
  {
    id: "3",
    sender: "Mike Chen",
    preview: "Thanks for the motivation! Let's connect.",
    time: "3 hours",
    unread: false,
    gradient: ["#22C55E", "#10B981"],
  },
  {
    id: "4",
    sender: "Emma Davis",
    preview: "Have you tried the new challenges section?",
    time: "Yesterday",
    unread: false,
    gradient: ["#EAB308", "#F59E0B"],
  },
  {
    id: "5",
    sender: "Real Dream Team",
    preview: "New features are now available! Check them out.",
    time: "2 days",
    unread: false,
    gradient: ["#EC4899", "#F472B6"],
  },
];

export default function MessagesScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const { theme } = useTheme();

  const handleMessagePress = (message: Message) => {
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
            Messages
          </ThemedText>
          <ThemedText type="body" style={[styles.subtitle, { color: theme.textSecondary }]}>
            Stay connected with your dream community
          </ThemedText>
        </Animated.View>

        {messages.map((message, index) => (
          <Animated.View
            key={message.id}
            entering={FadeInDown.delay(index * 60).springify()}
          >
            <Pressable
              onPress={() => handleMessagePress(message)}
              style={[
                styles.messageCard,
                { backgroundColor: theme.backgroundDefault },
                message.unread ? { borderLeftWidth: 3, borderLeftColor: theme.accent } : null,
              ]}
            >
              <LinearGradient
                colors={message.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.avatar}
              >
                <Feather name="user" size={18} color="#FFFFFF" />
              </LinearGradient>
              <View style={styles.messageContent}>
                <View style={styles.messageHeader}>
                  <ThemedText
                    type="body"
                    style={[styles.senderName, message.unread ? { fontWeight: "700" } : null]}
                  >
                    {message.sender}
                  </ThemedText>
                  <ThemedText type="xs" style={{ color: theme.textMuted }}>
                    {message.time}
                  </ThemedText>
                </View>
                <ThemedText
                  type="small"
                  style={{ color: theme.textSecondary }}
                  numberOfLines={1}
                >
                  {message.preview}
                </ThemedText>
              </View>
              {message.unread ? (
                <View style={[styles.unreadDot, { backgroundColor: theme.accent }]} />
              ) : null}
            </Pressable>
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
    gap: Spacing.md,
  },
  title: {
    marginBottom: Spacing.xs,
  },
  subtitle: {
    marginBottom: Spacing.lg,
  },
  messageCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    gap: Spacing.md,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  messageContent: {
    flex: 1,
  },
  messageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 2,
  },
  senderName: {
    fontWeight: "600",
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});
