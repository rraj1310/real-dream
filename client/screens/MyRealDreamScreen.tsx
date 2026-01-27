import { useState, useEffect, useCallback } from "react";
import { View, StyleSheet, ScrollView, Pressable, ActivityIndicator, RefreshControl } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, { FadeInDown } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/context/AuthContext";
import { Spacing, BorderRadius } from "@/constants/theme";
import { getApiUrl } from "@/lib/query-client";

type Dream = {
  id: string;
  title: string;
  description?: string;
  type: "personal" | "challenge" | "group";
  progress: number;
  isCompleted: boolean;
  targetDate?: string;
  createdAt: string;
};

type DreamType = {
  title: string;
  icon: keyof typeof Feather.glyphMap;
  description: string;
  count: number;
  color: string;
};

const dreamTypeConfig = {
  personal: {
    title: "PERSONAL REALDREAM",
    icon: "user" as const,
    description: "Individual goals and aspirations",
    color: "#3B82F6",
  },
  challenge: {
    title: "REALDREAM CHALLENGE",
    icon: "award" as const,
    description: "Compete with others",
    color: "#EAB308",
  },
  group: {
    title: "GROUP REALDREAM",
    icon: "users" as const,
    description: "Collaborate with teams",
    color: "#8B5CF6",
  },
};

type DreamGoal = {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  bgColor: string;
  iconColor: string;
};

function DreamCard({ dream, index }: { dream: Dream; index: number }) {
  const { theme } = useTheme();
  const config = dreamTypeConfig[dream.type];

  return (
    <Animated.View entering={FadeInDown.delay(index * 100).springify()}>
      <Card style={styles.dreamCard}>
        <View style={styles.dreamHeader}>
          <View style={[styles.dreamIcon, { backgroundColor: config.color }]}>
            <Feather name={config.icon} size={24} color="#FFFFFF" />
          </View>
          <View style={styles.dreamContent}>
            <ThemedText type="bodyMedium" numberOfLines={1}>
              {dream.title}
            </ThemedText>
            {dream.description ? (
              <ThemedText type="small" style={{ color: theme.textSecondary }} numberOfLines={2}>
                {dream.description}
              </ThemedText>
            ) : null}
            <View style={styles.progressContainer}>
              <View style={[styles.progressBar, { backgroundColor: theme.backgroundSecondary }]}>
                <View style={[styles.progressFill, { width: `${dream.progress}%`, backgroundColor: config.color }]} />
              </View>
              <ThemedText type="xs" style={{ color: theme.textSecondary }}>
                {dream.progress}%
              </ThemedText>
            </View>
          </View>
          {dream.isCompleted ? (
            <View style={[styles.completedBadge, { backgroundColor: "#DCFCE7" }]}>
              <Feather name="check" size={16} color="#16A34A" />
            </View>
          ) : null}
        </View>
      </Card>
    </Animated.View>
  );
}

function EmptyDreamsCard({ type, onPress }: { type: "personal" | "challenge" | "group"; onPress: () => void }) {
  const { theme } = useTheme();
  const config = dreamTypeConfig[type];

  return (
    <Card onPress={onPress} style={styles.emptyCard}>
      <View style={[styles.emptyIcon, { backgroundColor: config.color + "20" }]}>
        <Feather name={config.icon} size={32} color={config.color} />
      </View>
      <ThemedText type="small" style={styles.emptyTitle}>{config.title}</ThemedText>
      <ThemedText type="xs" style={{ color: theme.textSecondary, textAlign: "center" }}>
        {config.description}
      </ThemedText>
      <View style={[styles.addButton, { backgroundColor: config.color }]}>
        <Feather name="plus" size={16} color="#FFFFFF" />
      </View>
    </Card>
  );
}

export default function MyRealDreamScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const navigation = useNavigation<any>();
  const { theme } = useTheme();
  const { token } = useAuth();
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDreams = useCallback(async () => {
    if (!token) return;
    try {
      const response = await fetch(new URL('/api/dreams', getApiUrl()).toString(), {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setDreams(data);
      }
    } catch (error) {
      console.error('Error fetching dreams:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, [token]);

  useFocusEffect(
    useCallback(() => {
      fetchDreams();
    }, [fetchDreams])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchDreams();
  };

  const handleCreateDream = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate("CreateDream");
  };

  const personalDreams = dreams.filter(d => d.type === "personal");
  const challengeDreams = dreams.filter(d => d.type === "challenge");
  const groupDreams = dreams.filter(d => d.type === "group");

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
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.link} />
        }
      >
        {isLoading ? (
          <ActivityIndicator size="large" color={theme.link} style={{ marginTop: Spacing["3xl"] }} />
        ) : (
          <>
            <Animated.View entering={FadeInDown.springify()}>
              <ThemedText type="small" style={[styles.sectionLabel, { color: theme.textSecondary }]}>
                PERSONAL ({personalDreams.length})
              </ThemedText>
              {personalDreams.length > 0 ? (
                personalDreams.map((dream, idx) => (
                  <DreamCard key={dream.id} dream={dream} index={idx} />
                ))
              ) : (
                <EmptyDreamsCard type="personal" onPress={handleCreateDream} />
              )}
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(100).springify()}>
              <ThemedText type="small" style={[styles.sectionLabel, { color: theme.textSecondary }]}>
                CHALLENGES ({challengeDreams.length})
              </ThemedText>
              {challengeDreams.length > 0 ? (
                challengeDreams.map((dream, idx) => (
                  <DreamCard key={dream.id} dream={dream} index={idx} />
                ))
              ) : (
                <EmptyDreamsCard type="challenge" onPress={handleCreateDream} />
              )}
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(200).springify()}>
              <ThemedText type="small" style={[styles.sectionLabel, { color: theme.textSecondary }]}>
                GROUP ({groupDreams.length})
              </ThemedText>
              {groupDreams.length > 0 ? (
                groupDreams.map((dream, idx) => (
                  <DreamCard key={dream.id} dream={dream} index={idx} />
                ))
              ) : (
                <EmptyDreamsCard type="group" onPress={handleCreateDream} />
              )}
            </Animated.View>

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
          </>
        )}
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
  sectionLabel: {
    fontWeight: "600",
    letterSpacing: 0.5,
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  dreamCard: {
    padding: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  dreamHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  dreamIcon: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  dreamContent: {
    flex: 1,
    gap: Spacing.xs,
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  progressBar: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
  completedBadge: {
    width: 28,
    height: 28,
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: Spacing.sm,
  },
  emptyCard: {
    padding: Spacing.xl,
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.md,
  },
  emptyTitle: {
    fontWeight: "600",
    marginBottom: Spacing.xs,
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
    marginTop: Spacing.lg,
  },
  createButton: {
    marginTop: Spacing.lg,
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
