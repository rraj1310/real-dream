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

type MarketItem = {
  id: string;
  name: string;
  price: number;
  category: string;
  gradient: [string, string];
  icon: keyof typeof Feather.glyphMap;
};

const marketItems: MarketItem[] = [
  {
    id: "1",
    name: "Premium Badge Pack",
    price: 299,
    category: "Badges",
    gradient: ["#EAB308", "#F59E0B"],
    icon: "award",
  },
  {
    id: "2",
    name: "Custom Avatar Frame",
    price: 199,
    category: "Customization",
    gradient: ["#8B5CF6", "#A855F7"],
    icon: "user",
  },
  {
    id: "3",
    name: "Streak Booster",
    price: 149,
    category: "Boosters",
    gradient: ["#22C55E", "#10B981"],
    icon: "zap",
  },
  {
    id: "4",
    name: "Profile Theme Pack",
    price: 399,
    category: "Themes",
    gradient: ["#EC4899", "#F472B6"],
    icon: "layers",
  },
  {
    id: "5",
    name: "Exclusive Stickers",
    price: 99,
    category: "Stickers",
    gradient: ["#3B82F6", "#60A5FA"],
    icon: "star",
  },
  {
    id: "6",
    name: "XP Multiplier",
    price: 249,
    category: "Boosters",
    gradient: ["#F97316", "#FB923C"],
    icon: "trending-up",
  },
];

const categories = ["All", "Badges", "Customization", "Boosters", "Themes", "Stickers"];

export default function MarketScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const { theme, userCoins } = useTheme();

  const handlePurchase = (item: MarketItem) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
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
          <View style={styles.balanceCard}>
            <View style={[styles.coinIcon, { backgroundColor: theme.yellow + "20" }]}>
              <Feather name="dollar-sign" size={24} color={theme.yellow} />
            </View>
            <View>
              <ThemedText type="small" style={{ color: theme.textSecondary }}>
                Available Balance
              </ThemedText>
              <ThemedText type="h3">{userCoins.toLocaleString()} coins</ThemedText>
            </View>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(100).springify()}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
          >
            {categories.map((category, index) => (
              <Pressable
                key={category}
                style={[
                  styles.categoryPill,
                  index === 0
                    ? { backgroundColor: theme.accent }
                    : { backgroundColor: theme.backgroundSecondary },
                ]}
              >
                <ThemedText
                  type="small"
                  style={[
                    styles.categoryText,
                    index === 0 ? { color: "#FFFFFF" } : { color: theme.text },
                  ]}
                >
                  {category}
                </ThemedText>
              </Pressable>
            ))}
          </ScrollView>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).springify()}>
          <ThemedText
            type="xs"
            style={[styles.sectionLabel, { color: theme.textSecondary }]}
          >
            FEATURED ITEMS
          </ThemedText>
        </Animated.View>

        <View style={styles.itemsGrid}>
          {marketItems.map((item, index) => (
            <Animated.View
              key={item.id}
              entering={FadeInDown.delay(200 + index * 50).springify()}
              style={styles.itemWrapper}
            >
              <Card onPress={() => handlePurchase(item)} style={styles.itemCard}>
                <LinearGradient
                  colors={item.gradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.itemIcon}
                >
                  <Feather name={item.icon} size={28} color="#FFFFFF" />
                </LinearGradient>
                <ThemedText type="body" style={styles.itemName} numberOfLines={1}>
                  {item.name}
                </ThemedText>
                <ThemedText
                  type="xs"
                  style={{ color: theme.textSecondary, marginBottom: Spacing.sm }}
                >
                  {item.category}
                </ThemedText>
                <View style={styles.priceContainer}>
                  <Feather name="dollar-sign" size={14} color={theme.yellow} />
                  <ThemedText type="bodyMedium" style={{ color: theme.yellow }}>
                    {item.price}
                  </ThemedText>
                </View>
              </Card>
            </Animated.View>
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
    gap: Spacing.lg,
  },
  balanceCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    padding: Spacing.lg,
  },
  coinIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  categoriesContainer: {
    gap: Spacing.sm,
    paddingVertical: Spacing.sm,
  },
  categoryPill: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  categoryText: {
    fontWeight: "500",
  },
  sectionLabel: {
    fontWeight: "500",
    letterSpacing: 0.5,
    paddingHorizontal: Spacing.xs,
  },
  itemsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.md,
  },
  itemWrapper: {
    width: "47%",
  },
  itemCard: {
    alignItems: "center",
    padding: Spacing.lg,
  },
  itemIcon: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.md,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.md,
  },
  itemName: {
    fontWeight: "600",
    textAlign: "center",
    marginBottom: Spacing.xs,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
});
