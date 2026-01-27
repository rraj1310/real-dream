import { View, StyleSheet, ScrollView, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Card } from "@/components/Card";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";

type MenuItemType = {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  route: string;
  gradient: [string, string];
};

const menuItems: MenuItemType[] = [
  {
    icon: "target",
    label: "My RealDream",
    route: "RealDreamTab",
    gradient: ["#3B82F6", "#60A5FA"],
  },
  {
    icon: "users",
    label: "Social",
    route: "NewsFeed",
    gradient: ["#8B5CF6", "#A855F7"],
  },
  {
    icon: "award",
    label: "Champions",
    route: "Champions",
    gradient: ["#EAB308", "#FCD34D"],
  },
  {
    icon: "shopping-bag",
    label: "Market",
    route: "Market",
    gradient: ["#22C55E", "#4ADE80"],
  },
  {
    icon: "image",
    label: "Gallery",
    route: "Gallery",
    gradient: ["#EC4899", "#F472B6"],
  },
  {
    icon: "rss",
    label: "News Feed",
    route: "NewsFeed",
    gradient: ["#6366F1", "#818CF8"],
  },
];

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function MenuItem({ item, index }: { item: MenuItemType; index: number }) {
  const navigation = useNavigation<any>();
  const { theme } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate(item.route);
  };

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 15 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15 });
  };

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 80).springify()}
      style={styles.menuItemWrapper}
    >
      <AnimatedPressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={animatedStyle}
      >
        <Card style={[styles.menuItem, { backgroundColor: theme.backgroundDefault }]}>
          <LinearGradient
            colors={item.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.iconContainer}
          >
            <Feather name={item.icon} size={28} color="#FFFFFF" />
          </LinearGradient>
          <ThemedText type="small" style={styles.menuLabel}>
            {item.label}
          </ThemedText>
        </Card>
      </AnimatedPressable>
    </Animated.View>
  );
}

export default function MainMenuScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const { theme, userCoins } = useTheme();

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
          <View style={styles.welcomeContainer}>
            <View style={styles.welcomeText}>
              <ThemedText type="h2" style={styles.welcomeTitle}>
                Welcome back!
              </ThemedText>
              <ThemedText
                type="body"
                style={{ color: theme.textSecondary }}
              >
                What would you like to explore today?
              </ThemedText>
            </View>
            <View style={[styles.coinBadge, { backgroundColor: theme.backgroundDefault }]}>
              <Feather name="dollar-sign" size={16} color={theme.yellow} />
              <ThemedText type="bodyMedium" style={{ marginLeft: 4 }}>
                {userCoins.toLocaleString()}
              </ThemedText>
            </View>
          </View>
        </Animated.View>

        <View style={styles.menuGrid}>
          {menuItems.map((item, index) => (
            <MenuItem key={item.route + index} item={item} index={index} />
          ))}
        </View>

        <Animated.View entering={FadeInDown.delay(500).springify()}>
          <Card style={styles.tipCard}>
            <LinearGradient
              colors={theme.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.tipIcon}
            >
              <Feather name="zap" size={20} color="#FFFFFF" />
            </LinearGradient>
            <View style={styles.tipContent}>
              <ThemedText type="body" style={styles.tipTitle}>
                Daily Tip
              </ThemedText>
              <ThemedText type="small" style={{ color: theme.textSecondary }}>
                Set small achievable goals to build momentum!
              </ThemedText>
            </View>
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
    gap: Spacing.xl,
  },
  welcomeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  welcomeText: {
    flex: 1,
  },
  welcomeTitle: {
    marginBottom: Spacing.xs,
  },
  coinBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  menuGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.lg,
  },
  menuItemWrapper: {
    width: "47%",
  },
  menuItem: {
    alignItems: "center",
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.lg,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: BorderRadius.lg,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.md,
  },
  menuLabel: {
    fontWeight: "600",
    textAlign: "center",
  },
  tipCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
  },
  tipIcon: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontWeight: "600",
    marginBottom: 2,
  },
});
