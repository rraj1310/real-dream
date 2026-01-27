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
import { Button } from "@/components/Button";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";

type DreamType = {
  title: string;
  icon: keyof typeof Feather.glyphMap;
  description: string;
  count: number;
  color: string;
};

const dreamTypes: DreamType[] = [
  {
    title: "PERSONAL REALDREAM",
    icon: "user",
    description: "Individual goals and aspirations",
    count: 4,
    color: "#3B82F6",
  },
  {
    title: "REALDREAM CHALLENGE",
    icon: "award",
    description: "Compete with others",
    count: 2,
    color: "#EAB308",
  },
  {
    title: "GROUP REALDREAM",
    icon: "users",
    description: "Collaborate with teams",
    count: 2,
    color: "#8B5CF6",
  },
];

type DreamGoal = {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  bgColor: string;
  iconColor: string;
};

const dreamGoals: DreamGoal[] = [
  { icon: "x-circle", label: "Stop Smoking", bgColor: "#FEE2E2", iconColor: "#DC2626" },
  { icon: "slash", label: "Quit Drinking", bgColor: "#FFEDD5", iconColor: "#EA580C" },
  { icon: "truck", label: "New Car", bgColor: "#FEE2E2", iconColor: "#DC2626" },
  { icon: "map-pin", label: "Japan Trip", bgColor: "#DBEAFE", iconColor: "#2563EB" },
  { icon: "home", label: "HOME", bgColor: "#DCFCE7", iconColor: "#16A34A" },
  { icon: "heart", label: "Life Partner", bgColor: "#FCE7F3", iconColor: "#DB2777" },
];

function DreamTypeCard({ type, index }: { type: DreamType; index: number }) {
  const { theme } = useTheme();

  return (
    <Animated.View entering={FadeInDown.delay(index * 100).springify()}>
      <Card style={styles.dreamCard}>
        <View style={styles.dreamHeader}>
          <View style={styles.dreamTitleRow}>
            <View style={[styles.dreamIcon, { backgroundColor: type.color }]}>
              <Feather name={type.icon} size={24} color="#FFFFFF" />
            </View>
            <View style={styles.dreamTitleContainer}>
              <ThemedText type="small" style={styles.dreamTitle}>
                {type.title}
              </ThemedText>
              <ThemedText
                type="small"
                style={[styles.dreamDescription, { color: theme.textSecondary }]}
              >
                {type.description}
              </ThemedText>
            </View>
          </View>
          <Feather name="chevron-right" size={24} color={theme.textMuted} />
        </View>

        <View style={styles.goalsGrid}>
          {dreamGoals.slice(0, 4).map((goal, i) => (
            <View key={i} style={styles.goalItem}>
              <View style={[styles.goalIcon, { backgroundColor: goal.bgColor }]}>
                <Feather name={goal.icon} size={24} color={goal.iconColor} />
              </View>
              <ThemedText
                type="xs"
                style={[styles.goalLabel, { color: theme.textSecondary }]}
                numberOfLines={1}
              >
                {goal.label}
              </ThemedText>
            </View>
          ))}
        </View>

        {index === 0 ? (
          <View style={styles.goalsGrid}>
            {dreamGoals.slice(4).map((goal, i) => (
              <View key={i} style={styles.goalItem}>
                <View style={[styles.goalIcon, { backgroundColor: goal.bgColor }]}>
                  <Feather name={goal.icon} size={24} color={goal.iconColor} />
                </View>
                <ThemedText
                  type="xs"
                  style={[styles.goalLabel, { color: theme.textSecondary }]}
                  numberOfLines={1}
                >
                  {goal.label}
                </ThemedText>
              </View>
            ))}
          </View>
        ) : null}
      </Card>
    </Animated.View>
  );
}

export default function MyRealDreamScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const navigation = useNavigation<any>();

  const handleCreateDream = () => {
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
            paddingBottom: tabBarHeight + Spacing.xl,
          },
        ]}
        scrollIndicatorInsets={{ bottom: insets.bottom }}
        showsVerticalScrollIndicator={false}
      >
        {dreamTypes.map((type, index) => (
          <DreamTypeCard key={type.title} type={type} index={index} />
        ))}

        <Animated.View entering={FadeInDown.delay(300).springify()}>
          <Button
            onPress={handleCreateDream}
            style={styles.createButton}
            testID="button-create-dream"
          >
            <View style={styles.createButtonContent}>
              <Feather name="plus" size={20} color="#FFFFFF" />
              <ThemedText style={styles.createButtonText}>
                START NEW REALDREAM
              </ThemedText>
            </View>
          </Button>
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
  dreamCard: {
    padding: Spacing.xl,
  },
  dreamHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.lg,
  },
  dreamTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  dreamIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  dreamTitleContainer: {
    flex: 1,
  },
  dreamTitle: {
    fontWeight: "700",
    marginBottom: 2,
  },
  dreamDescription: {
    fontSize: 13,
  },
  goalsGrid: {
    flexDirection: "row",
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  goalItem: {
    alignItems: "center",
    width: 60,
  },
  goalIcon: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.xs,
  },
  goalLabel: {
    textAlign: "center",
    fontSize: 11,
  },
  createButton: {
    marginTop: Spacing.sm,
  },
  createButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  createButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 14,
  },
});
