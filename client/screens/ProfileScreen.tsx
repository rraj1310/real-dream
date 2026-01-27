import { View, StyleSheet, ScrollView, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, { FadeInDown } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Card } from "@/components/Card";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";

type MenuItem = {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  route?: string;
  iconBg: string;
  iconColor: string;
  danger?: boolean;
};

const connectionItem: MenuItem = {
  icon: "users",
  label: "Connections",
  route: "Connections",
  iconBg: "#DCFCE7",
  iconColor: "#16A34A",
};

const achievementsItem: MenuItem = {
  icon: "award",
  label: "My Achievements",
  route: "WallOfFame",
  iconBg: "#FEF3C7",
  iconColor: "#D97706",
};

const themeItem: MenuItem = {
  icon: "sun",
  label: "Theme & Appearance",
  route: "Themes",
  iconBg: "#EDE9FE",
  iconColor: "#7C3AED",
};

const ordersItems: MenuItem[] = [
  {
    icon: "shopping-bag",
    label: "My Purchase",
    route: "Market",
    iconBg: "#F3F4F6",
    iconColor: "#4B5563",
  },
  {
    icon: "credit-card",
    label: "My Wallet",
    route: "Wallet",
    iconBg: "#F3F4F6",
    iconColor: "#4B5563",
  },
];

const accountItems: MenuItem[] = [
  {
    icon: "edit-2",
    label: "Edit Profile",
    iconBg: "#DBEAFE",
    iconColor: "#2563EB",
  },
  {
    icon: "trash-2",
    label: "Delete Account",
    iconBg: "#FEE2E2",
    iconColor: "#DC2626",
    danger: true,
  },
];

function MenuRow({
  item,
  isLast,
  onPress,
}: {
  item: MenuItem;
  isLast: boolean;
  onPress: () => void;
}) {
  const { theme } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={[styles.menuRow, !isLast ? { borderBottomWidth: 1, borderBottomColor: theme.border } : null]}
    >
      <View style={[styles.menuIcon, { backgroundColor: item.iconBg }]}>
        <Feather name={item.icon} size={20} color={item.iconColor} />
      </View>
      <ThemedText
        type="body"
        style={[
          styles.menuLabel,
          item.danger ? { color: "#DC2626" } : null,
        ]}
      >
        {item.label}
      </ThemedText>
      <Feather name="chevron-right" size={20} color={theme.textMuted} />
    </Pressable>
  );
}

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const navigation = useNavigation<any>();
  const { theme, currentTheme } = useTheme();

  const handleNavigate = (route?: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (route) {
      navigation.navigate(route);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: headerHeight + Spacing.xl,
            paddingBottom: tabBarHeight + Spacing.xl,
          },
        ]}
        scrollIndicatorInsets={{ bottom: insets.bottom }}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInDown.springify()}>
          <Card style={styles.profileCard}>
            <LinearGradient
              colors={theme.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.avatar}
            >
              <Feather name="user" size={40} color="#FFFFFF" />
            </LinearGradient>
            <View style={styles.profileInfo}>
              <ThemedText
                type="xs"
                style={[styles.profileLabel, { color: theme.textSecondary }]}
              >
                USERNAME
              </ThemedText>
              <ThemedText type="h3" style={styles.username}>
                john_doe
              </ThemedText>
              <ThemedText
                type="small"
                style={{ color: theme.textSecondary }}
              >
                Full Name
              </ThemedText>
              <ThemedText type="body" style={styles.fullName}>
                John Doe
              </ThemedText>
            </View>
          </Card>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(100).springify()}>
          <Card
            onPress={() => handleNavigate(connectionItem.route)}
            style={styles.linkCard}
          >
            <View style={[styles.linkIcon, { backgroundColor: connectionItem.iconBg }]}>
              <Feather name={connectionItem.icon} size={24} color={connectionItem.iconColor} />
            </View>
            <View style={styles.linkContent}>
              <ThemedText type="body" style={styles.linkTitle}>
                {connectionItem.label}
              </ThemedText>
              <ThemedText
                type="small"
                style={{ color: theme.textSecondary }}
              >
                View followers and following
              </ThemedText>
            </View>
            <Feather name="chevron-right" size={20} color={theme.textMuted} />
          </Card>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(150).springify()}>
          <Card
            onPress={() => handleNavigate(achievementsItem.route)}
            style={styles.linkCard}
          >
            <View style={[styles.linkIcon, { backgroundColor: achievementsItem.iconBg }]}>
              <Feather name={achievementsItem.icon} size={24} color={achievementsItem.iconColor} />
            </View>
            <View style={styles.linkContent}>
              <ThemedText type="body" style={styles.linkTitle}>
                {achievementsItem.label}
              </ThemedText>
              <ThemedText
                type="small"
                style={{ color: theme.textSecondary }}
              >
                View your badges and awards
              </ThemedText>
            </View>
            <Feather name="chevron-right" size={20} color={theme.textMuted} />
          </Card>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(175).springify()}>
          <Card
            onPress={() => handleNavigate(themeItem.route)}
            style={styles.linkCard}
          >
            <LinearGradient
              colors={currentTheme.colors.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.linkIcon}
            >
              <Feather name="sun" size={24} color="#FFFFFF" />
            </LinearGradient>
            <View style={styles.linkContent}>
              <ThemedText type="body" style={styles.linkTitle}>
                {themeItem.label}
              </ThemedText>
              <ThemedText
                type="small"
                style={{ color: theme.textSecondary }}
              >
                Current: {currentTheme.name}
              </ThemedText>
            </View>
            <Feather name="chevron-right" size={20} color={theme.textMuted} />
          </Card>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).springify()}>
          <ThemedText
            type="xs"
            style={[styles.sectionLabel, { color: theme.textSecondary }]}
          >
            MY ORDERS
          </ThemedText>
          <Card style={styles.menuCard}>
            {ordersItems.map((item, index) => (
              <MenuRow
                key={item.label}
                item={item}
                isLast={index === ordersItems.length - 1}
                onPress={() => handleNavigate(item.route)}
              />
            ))}
          </Card>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(250).springify()}>
          <ThemedText
            type="xs"
            style={[styles.sectionLabel, { color: theme.textSecondary }]}
          >
            MY ACCOUNT
          </ThemedText>
          <Card style={styles.menuCard}>
            {accountItems.map((item, index) => (
              <MenuRow
                key={item.label}
                item={item}
                isLast={index === accountItems.length - 1}
                onPress={() => handleNavigate(item.route)}
              />
            ))}
          </Card>
        </Animated.View>
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
  profileCard: {
    padding: Spacing.xl,
    alignItems: "center",
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.lg,
  },
  profileInfo: {
    alignItems: "center",
  },
  profileLabel: {
    marginBottom: Spacing.xs,
    letterSpacing: 0.5,
  },
  username: {
    marginBottom: Spacing.sm,
  },
  fullName: {
    fontWeight: "500",
  },
  linkCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
  },
  linkIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  linkContent: {
    flex: 1,
  },
  linkTitle: {
    fontWeight: "600",
    marginBottom: 2,
  },
  sectionLabel: {
    fontWeight: "500",
    marginBottom: Spacing.sm,
    paddingHorizontal: Spacing.xs,
    letterSpacing: 0.5,
  },
  menuCard: {
    padding: 0,
    overflow: "hidden",
  },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.xs,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  menuLabel: {
    flex: 1,
    fontWeight: "500",
  },
});
