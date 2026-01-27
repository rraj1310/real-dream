import { View, StyleSheet, ScrollView, Pressable, Dimensions } from "react-native";
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

type GalleryItem = {
  id: string;
  title: string;
  category: string;
  likes: number;
  gradient: [string, string];
};

const galleryItems: GalleryItem[] = [
  { id: "1", title: "Dream Achieved", category: "Fitness", likes: 234, gradient: ["#3B82F6", "#8B5CF6"] },
  { id: "2", title: "First Marathon", category: "Sports", likes: 189, gradient: ["#22C55E", "#10B981"] },
  { id: "3", title: "Career Milestone", category: "Career", likes: 312, gradient: ["#EAB308", "#F59E0B"] },
  { id: "4", title: "New Home", category: "Lifestyle", likes: 156, gradient: ["#EC4899", "#F472B6"] },
  { id: "5", title: "Graduation Day", category: "Education", likes: 278, gradient: ["#6366F1", "#818CF8"] },
  { id: "6", title: "Travel Goals", category: "Travel", likes: 421, gradient: ["#F97316", "#FB923C"] },
];

const { width } = Dimensions.get("window");
const itemWidth = (width - Spacing.lg * 3) / 2;

export default function GalleryScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const { theme } = useTheme();

  const handleItemPress = (item: GalleryItem) => {
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
            Dream Gallery
          </ThemedText>
          <ThemedText type="body" style={[styles.subtitle, { color: theme.textSecondary }]}>
            Explore achievements from our community
          </ThemedText>
        </Animated.View>

        <View style={styles.gallery}>
          {galleryItems.map((item, index) => (
            <Animated.View
              key={item.id}
              entering={FadeInDown.delay(index * 60).springify()}
              style={styles.itemWrapper}
            >
              <Pressable
                onPress={() => handleItemPress(item)}
                style={styles.galleryItem}
              >
                <LinearGradient
                  colors={item.gradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.itemContent}
                >
                  <View style={styles.categoryBadge}>
                    <ThemedText style={styles.categoryText}>{item.category}</ThemedText>
                  </View>
                  <View style={styles.itemFooter}>
                    <ThemedText style={styles.itemTitle} numberOfLines={1}>
                      {item.title}
                    </ThemedText>
                    <View style={styles.likesContainer}>
                      <Feather name="heart" size={14} color="#FFFFFF" />
                      <ThemedText style={styles.likesText}>{item.likes}</ThemedText>
                    </View>
                  </View>
                </LinearGradient>
              </Pressable>
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
  title: {
    marginBottom: Spacing.xs,
  },
  subtitle: {
    marginBottom: Spacing.md,
  },
  gallery: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.md,
  },
  itemWrapper: {
    width: itemWidth,
  },
  galleryItem: {
    borderRadius: BorderRadius.lg,
    overflow: "hidden",
  },
  itemContent: {
    height: 180,
    padding: Spacing.md,
    justifyContent: "space-between",
  },
  categoryBadge: {
    backgroundColor: "rgba(255,255,255,0.25)",
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    alignSelf: "flex-start",
  },
  categoryText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "500",
  },
  itemFooter: {
    gap: Spacing.xs,
  },
  itemTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  likesContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  likesText: {
    color: "#FFFFFF",
    fontSize: 12,
  },
});
