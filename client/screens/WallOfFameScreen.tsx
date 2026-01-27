import { useState } from "react";
import { View, StyleSheet, ScrollView, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { Feather } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { GalaxyBackground } from "@/components/GalaxyBackground";
import { Card } from "@/components/Card";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";

type Legend = {
  name: string;
  avatar: string;
  title: string;
  period: string;
  stats: {
    dreams: number;
    achievements: number;
    points: number;
  };
};

const legends: Legend[] = [
  {
    name: "Michael Ross",
    avatar: "MR",
    title: "Dream Legend",
    period: "3x Champion",
    stats: { dreams: 234, achievements: 156, points: 45890 },
  },
  {
    name: "Jessica Parker",
    avatar: "JP",
    title: "Goal Master",
    period: "2x Champion",
    stats: { dreams: 198, achievements: 142, points: 42340 },
  },
  {
    name: "David Lee",
    avatar: "DL",
    title: "Achievement Hunter",
    period: "Champion",
    stats: { dreams: 176, achievements: 128, points: 39560 },
  },
];

type HallOfFamer = {
  name: string;
  year: string;
  category: string;
  count: number;
};

const hallOfFamers: HallOfFamer[] = [
  { name: "Alex Morgan", year: "2024", category: "Most Dreams Completed", count: 156 },
  { name: "Emma Wilson", year: "2024", category: "Top Contributor", count: 243 },
  { name: "James Brown", year: "2023", category: "Community Leader", count: 189 },
  { name: "Sarah Davis", year: "2023", category: "Challenge Master", count: 98 },
];

type TabType = "monthly" | "yearly" | "alltime";

export default function WallOfFameScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<TabType>("monthly");

  const tabs: { key: TabType; label: string }[] = [
    { key: "monthly", label: "Monthly" },
    { key: "yearly", label: "Yearly" },
    { key: "alltime", label: "All Time" },
  ];

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
        <Animated.View
          entering={FadeInDown.springify()}
          style={styles.headerSection}
        >
          <View style={styles.trophyIcon}>
            <Feather name="award" size={32} color="#FFFFFF" />
          </View>
          <ThemedText type="h3" style={styles.headerTitle}>
            Hall of Fame
          </ThemedText>
          <ThemedText
            type="body"
            style={[styles.headerSubtitle, { color: theme.textSecondary }]}
          >
            Celebrating our greatest achievers
          </ThemedText>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(100).springify()}>
          <View
            style={[styles.tabContainer, { backgroundColor: theme.backgroundDefault }]}
          >
            {tabs.map((tab) => (
              <Pressable
                key={tab.key}
                onPress={() => setActiveTab(tab.key)}
                style={[
                  styles.tab,
                  activeTab === tab.key ? styles.tabActive : null,
                ]}
              >
                <ThemedText
                  type="small"
                  style={[
                    styles.tabText,
                    activeTab === tab.key
                      ? styles.tabTextActive
                      : { color: theme.textSecondary },
                  ]}
                >
                  {tab.label}
                </ThemedText>
              </Pressable>
            ))}
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).springify()}>
          <ThemedText type="body" style={styles.sectionTitle}>
            Legends
          </ThemedText>
          {legends.map((legend, index) => (
            <Card key={legend.name} style={styles.legendCard}>
              <View style={styles.legendHeader}>
                <View style={styles.legendAvatar}>
                  <ThemedText style={styles.avatarText}>{legend.avatar}</ThemedText>
                </View>
                <View style={styles.legendInfo}>
                  <ThemedText type="h4" style={styles.legendName}>
                    {legend.name}
                  </ThemedText>
                  <ThemedText style={[styles.legendTitle, { color: "#8B5CF6" }]}>
                    {legend.title}
                  </ThemedText>
                  <ThemedText
                    type="small"
                    style={{ color: theme.textSecondary }}
                  >
                    {legend.period}
                  </ThemedText>
                </View>
                <View style={styles.crownContainer}>
                  <Feather name="award" size={32} color="#EAB308" />
                </View>
              </View>

              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <ThemedText type="h3" style={styles.statValue}>
                    {legend.stats.dreams}
                  </ThemedText>
                  <ThemedText
                    type="xs"
                    style={{ color: theme.textSecondary }}
                  >
                    Dreams
                  </ThemedText>
                </View>
                <View style={styles.statItem}>
                  <ThemedText type="h3" style={styles.statValue}>
                    {legend.stats.achievements}
                  </ThemedText>
                  <ThemedText
                    type="xs"
                    style={{ color: theme.textSecondary }}
                  >
                    Achievements
                  </ThemedText>
                </View>
                <View style={styles.statItem}>
                  <ThemedText type="h3" style={styles.statValue}>
                    {legend.stats.points.toLocaleString()}
                  </ThemedText>
                  <ThemedText
                    type="xs"
                    style={{ color: theme.textSecondary }}
                  >
                    Points
                  </ThemedText>
                </View>
              </View>
            </Card>
          ))}
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300).springify()}>
          <ThemedText type="body" style={styles.sectionTitle}>
            Hall of Famers
          </ThemedText>
          <Card style={styles.famersCard}>
            {hallOfFamers.map((famer, index) => (
              <View
                key={famer.name + famer.year}
                style={[
                  styles.famerRow,
                  index < hallOfFamers.length - 1 ? styles.famerBorder : null,
                ]}
              >
                <View style={styles.famerHeader}>
                  <ThemedText type="body" style={styles.famerName}>
                    {famer.name}
                  </ThemedText>
                  <View style={styles.yearBadge}>
                    <ThemedText type="xs" style={styles.yearText}>
                      {famer.year}
                    </ThemedText>
                  </View>
                </View>
                <ThemedText
                  type="small"
                  style={{ color: theme.textSecondary }}
                >
                  {famer.category}
                </ThemedText>
                <View style={styles.famerStats}>
                  <Feather name="trending-up" size={16} color={theme.textMuted} />
                  <ThemedText
                    type="small"
                    style={{ color: theme.textMuted, marginLeft: 4 }}
                  >
                    {famer.count} total
                  </ThemedText>
                </View>
              </View>
            ))}
          </Card>
        </Animated.View>
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
  headerSection: {
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  trophyIcon: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.md,
    backgroundColor: "#8B5CF6",
  },
  headerTitle: {
    marginBottom: Spacing.xs,
  },
  headerSubtitle: {},
  tabContainer: {
    flexDirection: "row",
    borderRadius: BorderRadius.sm,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.xs,
    alignItems: "center",
  },
  tabActive: {
    backgroundColor: "#8B5CF6",
  },
  tabText: {
    fontWeight: "500",
  },
  tabTextActive: {
    color: "#FFFFFF",
  },
  sectionTitle: {
    fontWeight: "600",
    marginBottom: Spacing.sm,
    paddingHorizontal: Spacing.xs,
  },
  legendCard: {
    padding: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  legendHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: Spacing.lg,
  },
  legendAvatar: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.lg,
    backgroundColor: "#8B5CF6",
    borderWidth: 4,
    borderColor: "rgba(139, 127, 199, 0.3)",
  },
  avatarText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 20,
  },
  legendInfo: {
    flex: 1,
  },
  legendName: {
    marginBottom: 2,
  },
  legendTitle: {
    fontWeight: "500",
    marginBottom: 2,
  },
  crownContainer: {
    marginLeft: Spacing.sm,
  },
  statsRow: {
    flexDirection: "row",
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    marginBottom: 2,
  },
  famersCard: {
    padding: 0,
    overflow: "hidden",
  },
  famerRow: {
    padding: Spacing.lg,
  },
  famerBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(139, 127, 199, 0.3)",
  },
  famerHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.xs,
  },
  famerName: {
    fontWeight: "600",
  },
  yearBadge: {
    backgroundColor: "rgba(124, 58, 237, 0.3)",
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
  yearText: {
    color: "#A78BFA",
    fontWeight: "500",
  },
  famerStats: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: Spacing.xs,
  },
});
