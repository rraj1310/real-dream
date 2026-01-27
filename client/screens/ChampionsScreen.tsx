import { View, StyleSheet, ScrollView, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, { FadeInDown } from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Card } from "@/components/Card";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";

type Champion = {
  rank: number;
  name: string;
  dreams: number;
  color: string;
  medal: string;
};

const topChampions: Champion[] = [
  { rank: 1, name: "Alex Johnson", dreams: 156, color: "#EAB308", medal: "gold" },
  { rank: 2, name: "Sarah Williams", dreams: 142, color: "#9CA3AF", medal: "silver" },
  { rank: 3, name: "Mike Chen", dreams: 138, color: "#EA580C", medal: "bronze" },
];

type RisingStar = {
  name: string;
  category: string;
  achievements: number;
};

const risingStars: RisingStar[] = [
  { name: "Emma Davis", category: "Fitness", achievements: 45 },
  { name: "John Smith", category: "Learning", achievements: 38 },
  { name: "Lisa Brown", category: "Career", achievements: 35 },
];

export default function ChampionsScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const navigation = useNavigation<any>();
  const { theme } = useTheme();

  const handleNavigateToWallOfFame = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate("WallOfFame");
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
          <Card
            onPress={handleNavigateToWallOfFame}
            style={styles.linkCard}
          >
            <View style={[styles.linkIcon, { backgroundColor: "#FEF3C7" }]}>
              <Feather name="award" size={24} color="#D97706" />
            </View>
            <View style={styles.linkContent}>
              <ThemedText type="body" style={styles.linkTitle}>
                Hall of Fame
              </ThemedText>
              <ThemedText
                type="small"
                style={[styles.linkDescription, { color: theme.textSecondary }]}
              >
                View legendary achievers
              </ThemedText>
            </View>
            <Feather name="chevron-right" size={20} color={theme.textMuted} />
          </Card>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(100).springify()}>
          <Card
            onPress={handleNavigateToWallOfFame}
            style={styles.linkCard}
          >
            <View style={[styles.linkIcon, { backgroundColor: "#F3E8FF" }]}>
              <Feather name="star" size={24} color="#7C3AED" />
            </View>
            <View style={styles.linkContent}>
              <ThemedText type="body" style={styles.linkTitle}>
                Wall of Fame
              </ThemedText>
              <ThemedText
                type="small"
                style={[styles.linkDescription, { color: theme.textSecondary }]}
              >
                Celebrate top performers
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
            TOP CHAMPIONS THIS MONTH
          </ThemedText>
          <Card style={styles.championsCard}>
            {topChampions.map((champion, index) => (
              <View
                key={champion.rank}
                style={[
                  styles.championRow,
                  index < topChampions.length - 1 ? styles.championBorder : null,
                ]}
              >
                <View
                  style={[styles.rankBadge, { backgroundColor: champion.color }]}
                >
                  <ThemedText style={styles.rankText}>#{champion.rank}</ThemedText>
                </View>
                <View style={styles.championInfo}>
                  <ThemedText type="body" style={styles.championName}>
                    {champion.name}
                  </ThemedText>
                  <ThemedText
                    type="small"
                    style={{ color: theme.textSecondary }}
                  >
                    {champion.dreams} dreams completed
                  </ThemedText>
                </View>
                <Feather name="award" size={24} color="#EAB308" />
              </View>
            ))}
          </Card>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300).springify()}>
          <ThemedText
            type="xs"
            style={[styles.sectionLabel, { color: theme.textSecondary }]}
          >
            RISING STARS
          </ThemedText>
          <Card style={styles.starsCard}>
            {risingStars.map((star, index) => (
              <View
                key={star.name}
                style={[
                  styles.starRow,
                  index < risingStars.length - 1 ? styles.starBorder : null,
                ]}
              >
                <View style={styles.starAvatar}>
                  <Feather name="award" size={20} color="#FFFFFF" />
                </View>
                <View style={styles.starInfo}>
                  <ThemedText type="body" style={styles.starName}>
                    {star.name}
                  </ThemedText>
                  <ThemedText
                    type="small"
                    style={{ color: theme.textSecondary }}
                  >
                    {star.category} - {star.achievements} achievements
                  </ThemedText>
                </View>
              </View>
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
  linkDescription: {},
  sectionLabel: {
    fontWeight: "500",
    marginBottom: Spacing.sm,
    paddingHorizontal: Spacing.xs,
    letterSpacing: 0.5,
  },
  championsCard: {
    padding: Spacing.lg,
  },
  championRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.md,
  },
  championBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  rankBadge: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  rankText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 14,
  },
  championInfo: {
    flex: 1,
  },
  championName: {
    fontWeight: "600",
    marginBottom: 2,
  },
  starsCard: {
    padding: 0,
    overflow: "hidden",
  },
  starRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
  },
  starBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  starAvatar: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
    backgroundColor: "#8B5CF6",
  },
  starInfo: {
    flex: 1,
  },
  starName: {
    fontWeight: "600",
    marginBottom: 2,
  },
});
