import { View, StyleSheet, ScrollView, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { CompositeNavigationProp, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Card } from "@/components/Card";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, Colors } from "@/constants/theme";
import { MainTabParamList } from "@/navigation/MainTabNavigator";
import { HomeStackParamList } from "@/navigation/HomeStackNavigator";

type MenuItemType = {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  route: string;
  color: string;
  bgColor: string;
};

const menuItems: MenuItemType[] = [
  {
    icon: "target",
    label: "My RealDream",
    route: "MyRealDream",
    color: "#FFFFFF",
    bgColor: "#3B82F6",
  },
  {
    icon: "users",
    label: "Social",
    route: "NewsFeed",
    color: "#FFFFFF",
    bgColor: "#8B5CF6",
  },
  {
    icon: "award",
    label: "Champions",
    route: "Champions",
    color: "#FFFFFF",
    bgColor: "#EAB308",
  },
  {
    icon: "shopping-bag",
    label: "Market",
    route: "Market",
    color: "#FFFFFF",
    bgColor: "#22C55E",
  },
  {
    icon: "image",
    label: "Gallery",
    route: "Gallery",
    color: "#FFFFFF",
    bgColor: "#EC4899",
  },
  {
    icon: "rss",
    label: "News Feed",
    route: "NewsFeed",
    color: "#FFFFFF",
    bgColor: "#6366F1",
  },
];

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function MenuItem({ item, index }: { item: MenuItemType; index: number }) {
  const navigation = useNavigation<any>();
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
        <Card style={styles.menuItem}>
          <View style={[styles.iconContainer, { backgroundColor: item.bgColor }]}>
            <Feather name={item.icon} size={28} color={item.color} />
          </View>
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
  const { theme } = useTheme();

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
          <ThemedText type="h2" style={styles.welcomeTitle}>
            Welcome back!
          </ThemedText>
          <ThemedText
            type="body"
            style={[styles.welcomeSubtitle, { color: theme.textSecondary }]}
          >
            What would you like to explore today?
          </ThemedText>
        </Animated.View>

        <View style={styles.menuGrid}>
          {menuItems.map((item, index) => (
            <MenuItem key={item.route + index} item={item} index={index} />
          ))}
        </View>
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
  },
  welcomeTitle: {
    marginBottom: Spacing.xs,
  },
  welcomeSubtitle: {
    marginBottom: Spacing.xl,
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
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.md,
  },
  menuLabel: {
    fontWeight: "500",
    textAlign: "center",
  },
});
