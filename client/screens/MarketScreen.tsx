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
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/context/AuthContext";
import { Spacing, BorderRadius } from "@/constants/theme";
import { getApiUrl } from "@/lib/query-client";

type MarketItem = {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  price: number | null;
  imageUrl: string | null;
  userId: string;
  isActive: boolean;
};

const defaultItems: MarketItem[] = [
  { id: "1", title: "Premium Badge Pack", description: "Unlock exclusive badges", category: "Badges", price: 299, imageUrl: null, userId: "", isActive: true },
  { id: "2", title: "Custom Avatar Frame", description: "Stand out from the crowd", category: "Customization", price: 199, imageUrl: null, userId: "", isActive: true },
  { id: "3", title: "Streak Booster", description: "Boost your streak progress", category: "Boosters", price: 149, imageUrl: null, userId: "", isActive: true },
  { id: "4", title: "Profile Theme Pack", description: "Personalize your profile", category: "Themes", price: 399, imageUrl: null, userId: "", isActive: true },
  { id: "5", title: "Exclusive Stickers", description: "Fun stickers for chat", category: "Stickers", price: 99, imageUrl: null, userId: "", isActive: true },
  { id: "6", title: "XP Multiplier", description: "Double your XP gain", category: "Boosters", price: 249, imageUrl: null, userId: "", isActive: true },
];

const categoryGradients: { [key: string]: [string, string] } = {
  Badges: ["#EAB308", "#F59E0B"],
  Customization: ["#8B5CF6", "#A855F7"],
  Boosters: ["#22C55E", "#10B981"],
  Themes: ["#EC4899", "#F472B6"],
  Stickers: ["#3B82F6", "#60A5FA"],
};

const categoryIcons: { [key: string]: keyof typeof Feather.glyphMap } = {
  Badges: "award",
  Customization: "user",
  Boosters: "zap",
  Themes: "layers",
  Stickers: "star",
};

const categories = ["All", "Badges", "Customization", "Boosters", "Themes", "Stickers"];

export default function MarketScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const { theme } = useTheme();
  const { user, token } = useAuth();
  const [marketItems, setMarketItems] = useState<MarketItem[]>(defaultItems);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchMarketItems = async () => {
    try {
      const categoryParam = selectedCategory !== "All" ? `?category=${selectedCategory}` : "";
      const response = await fetch(new URL(`/api/market${categoryParam}`, getApiUrl()).toString());
      if (response.ok) {
        const data = await response.json();
        if (data.length > 0) {
          setMarketItems(data);
        } else {
          setMarketItems(defaultItems.filter(item => 
            selectedCategory === "All" || item.category === selectedCategory
          ));
        }
      }
    } catch (error) {
      console.error("Failed to fetch market items:", error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMarketItems();
  }, [selectedCategory]);

  const handleCategorySelect = (category: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedCategory(category);
  };

  const handlePurchase = (item: MarketItem) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchMarketItems();
  };

  const filteredItems = selectedCategory === "All" 
    ? marketItems 
    : marketItems.filter(item => item.category === selectedCategory);

  const getGradient = (category: string | null): [string, string] => {
    return categoryGradients[category || "Badges"] || ["#6B7280", "#9CA3AF"];
  };

  const getIcon = (category: string | null): keyof typeof Feather.glyphMap => {
    return categoryIcons[category || "Badges"] || "package";
  };

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
          <View style={styles.balanceCard}>
            <View style={[styles.coinIcon, { backgroundColor: theme.yellow + "20" }]}>
              <Feather name="dollar-sign" size={24} color={theme.yellow} />
            </View>
            <View>
              <ThemedText type="small" style={{ color: theme.textSecondary }}>
                Available Balance
              </ThemedText>
              <ThemedText type="h3">{(user?.coins || 0).toLocaleString()} coins</ThemedText>
            </View>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(100).springify()}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
          >
            {categories.map((category) => (
              <Pressable
                key={category}
                onPress={() => handleCategorySelect(category)}
                style={[
                  styles.categoryPill,
                  selectedCategory === category
                    ? { backgroundColor: theme.accent }
                    : { backgroundColor: theme.backgroundSecondary },
                ]}
              >
                <ThemedText
                  type="small"
                  style={[
                    styles.categoryText,
                    selectedCategory === category ? { color: "#FFFFFF" } : { color: theme.text },
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

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.link} />
          </View>
        ) : (
          <View style={styles.itemsGrid}>
            {filteredItems.map((item, index) => (
              <Animated.View
                key={item.id}
                entering={FadeInDown.delay(200 + index * 50).springify()}
                style={styles.itemWrapper}
              >
                <Card onPress={() => handlePurchase(item)} style={styles.itemCard}>
                  <LinearGradient
                    colors={getGradient(item.category)}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.itemIcon}
                  >
                    <Feather name={getIcon(item.category)} size={28} color="#FFFFFF" />
                  </LinearGradient>
                  <ThemedText type="body" style={styles.itemName} numberOfLines={1}>
                    {item.title}
                  </ThemedText>
                  <ThemedText
                    type="xs"
                    style={{ color: theme.textSecondary, marginBottom: Spacing.sm }}
                  >
                    {item.category || "Item"}
                  </ThemedText>
                  <View style={styles.priceContainer}>
                    <Feather name="dollar-sign" size={14} color={theme.yellow} />
                    <ThemedText type="bodyMedium" style={{ color: theme.yellow }}>
                      {item.price || 0}
                    </ThemedText>
                  </View>
                </Card>
              </Animated.View>
            ))}
          </View>
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
  loadingContainer: {
    padding: Spacing["3xl"],
    alignItems: "center",
    justifyContent: "center",
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
