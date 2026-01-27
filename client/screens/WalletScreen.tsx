import { useState } from "react";
import { View, StyleSheet, ScrollView, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, { FadeInDown } from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";

type Transaction = {
  type: "earned" | "spent";
  amount: string;
  description: string;
  date: string;
};

const transactions: Transaction[] = [
  { type: "earned", amount: "+150", description: "Dream Completed", date: "Today" },
  { type: "spent", amount: "-50", description: "Market Purchase", date: "Yesterday" },
  { type: "earned", amount: "+200", description: "Lucky Wheel Win", date: "2 days ago" },
  { type: "spent", amount: "-100", description: "Premium Upgrade", date: "3 days ago" },
];

type Award = {
  name: string;
  icon: keyof typeof Feather.glyphMap;
  earned: string;
  color: string;
};

const awards: Award[] = [
  { name: "Dream Master", icon: "award", earned: "Jan 2024", color: "#EAB308" },
  { name: "Community Hero", icon: "star", earned: "Dec 2023", color: "#8B5CF6" },
  { name: "Goal Achiever", icon: "target", earned: "Nov 2023", color: "#3B82F6" },
];

type TabType = "coins" | "awards";

export default function WalletScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<TabType>("coins");

  const balance = {
    coins: 2450,
    awards: 12,
    totalValue: "$245.00",
  };

  const handleAction = (action: string) => {
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
          <Card style={styles.balanceCard}>
            <View style={styles.balanceHeader}>
              <ThemedText
                type="body"
                style={{ color: theme.textSecondary }}
              >
                Total Balance
              </ThemedText>
              <ThemedText type="h1" style={styles.balanceValue}>
                {balance.coins.toLocaleString()}
              </ThemedText>
              <ThemedText
                type="body"
                style={{ color: theme.textSecondary }}
              >
                Coins = {balance.totalValue}
              </ThemedText>
            </View>

            <View style={styles.actionsRow}>
              <Pressable
                onPress={() => handleAction("add")}
                style={[styles.actionButton, { backgroundColor: theme.link }]}
              >
                <Feather name="plus" size={18} color="#FFFFFF" />
                <ThemedText style={styles.actionText}>Add</ThemedText>
              </Pressable>
              <Pressable
                onPress={() => handleAction("send")}
                style={[styles.actionButton, styles.actionButtonOutline]}
              >
                <Feather name="send" size={18} color={theme.text} />
                <ThemedText style={[styles.actionText, { color: theme.text }]}>
                  Send
                </ThemedText>
              </Pressable>
              <Pressable
                onPress={() => handleAction("withdraw")}
                style={[styles.actionButton, styles.actionButtonOutline]}
              >
                <Feather name="trending-up" size={18} color={theme.text} />
                <ThemedText style={[styles.actionText, { color: theme.text }]}>
                  Withdraw
                </ThemedText>
              </Pressable>
            </View>
          </Card>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(100).springify()}>
          <View
            style={[styles.tabContainer, { backgroundColor: theme.backgroundDefault }]}
          >
            <Pressable
              onPress={() => setActiveTab("coins")}
              style={[
                styles.tab,
                activeTab === "coins" ? styles.tabActive : null,
              ]}
            >
              <Feather
                name="dollar-sign"
                size={16}
                color={activeTab === "coins" ? "#FFFFFF" : theme.textSecondary}
              />
              <ThemedText
                type="small"
                style={[
                  styles.tabText,
                  activeTab === "coins"
                    ? styles.tabTextActive
                    : { color: theme.textSecondary },
                ]}
              >
                Coins
              </ThemedText>
            </Pressable>
            <Pressable
              onPress={() => setActiveTab("awards")}
              style={[
                styles.tab,
                activeTab === "awards" ? styles.tabActive : null,
              ]}
            >
              <Feather
                name="award"
                size={16}
                color={activeTab === "awards" ? "#FFFFFF" : theme.textSecondary}
              />
              <ThemedText
                type="small"
                style={[
                  styles.tabText,
                  activeTab === "awards"
                    ? styles.tabTextActive
                    : { color: theme.textSecondary },
                ]}
              >
                Awards
              </ThemedText>
            </Pressable>
          </View>
        </Animated.View>

        {activeTab === "coins" ? (
          <Animated.View entering={FadeInDown.delay(200).springify()}>
            <ThemedText type="body" style={styles.sectionTitle}>
              Recent Transactions
            </ThemedText>
            <Card style={styles.transactionsCard}>
              {transactions.map((transaction, index) => (
                <View
                  key={index}
                  style={[
                    styles.transactionRow,
                    index < transactions.length - 1
                      ? styles.transactionBorder
                      : null,
                  ]}
                >
                  <View
                    style={[
                      styles.transactionIcon,
                      {
                        backgroundColor:
                          transaction.type === "earned" ? "#DCFCE7" : "#FEE2E2",
                      },
                    ]}
                  >
                    <Feather
                      name={
                        transaction.type === "earned"
                          ? "arrow-down-right"
                          : "arrow-up-right"
                      }
                      size={20}
                      color={
                        transaction.type === "earned" ? "#16A34A" : "#DC2626"
                      }
                    />
                  </View>
                  <View style={styles.transactionInfo}>
                    <ThemedText type="body" style={styles.transactionDescription}>
                      {transaction.description}
                    </ThemedText>
                    <ThemedText
                      type="small"
                      style={{ color: theme.textSecondary }}
                    >
                      {transaction.date}
                    </ThemedText>
                  </View>
                  <ThemedText
                    type="body"
                    style={[
                      styles.transactionAmount,
                      {
                        color:
                          transaction.type === "earned" ? "#16A34A" : "#DC2626",
                      },
                    ]}
                  >
                    {transaction.amount}
                  </ThemedText>
                </View>
              ))}
            </Card>
          </Animated.View>
        ) : (
          <Animated.View entering={FadeInDown.delay(200).springify()}>
            <ThemedText type="body" style={styles.sectionTitle}>
              My Awards ({balance.awards})
            </ThemedText>
            <View style={styles.awardsGrid}>
              {awards.map((award, index) => (
                <Card key={award.name} style={styles.awardCard}>
                  <View
                    style={[
                      styles.awardIcon,
                      { backgroundColor: award.color + "20" },
                    ]}
                  >
                    <Feather name={award.icon} size={32} color={award.color} />
                  </View>
                  <ThemedText type="small" style={styles.awardName}>
                    {award.name}
                  </ThemedText>
                  <ThemedText
                    type="xs"
                    style={{ color: theme.textSecondary }}
                  >
                    {award.earned}
                  </ThemedText>
                </Card>
              ))}
            </View>
          </Animated.View>
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
    gap: Spacing.lg,
  },
  balanceCard: {
    padding: Spacing.xl,
  },
  balanceHeader: {
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  balanceValue: {
    marginVertical: Spacing.xs,
  },
  actionsRow: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.xs,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.xs,
  },
  actionButtonOutline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  actionText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 14,
  },
  tabContainer: {
    flexDirection: "row",
    borderRadius: BorderRadius.sm,
    padding: 4,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.xs,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.xs,
  },
  tabActive: {
    backgroundColor: "#3B82F6",
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
  transactionsCard: {
    padding: 0,
    overflow: "hidden",
  },
  transactionRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
  },
  transactionBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDescription: {
    fontWeight: "500",
    marginBottom: 2,
  },
  transactionAmount: {
    fontWeight: "600",
  },
  awardsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.lg,
  },
  awardCard: {
    width: "47%",
    padding: Spacing.xl,
    alignItems: "center",
  },
  awardIcon: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.md,
  },
  awardName: {
    fontWeight: "500",
    marginBottom: 2,
    textAlign: "center",
  },
});
