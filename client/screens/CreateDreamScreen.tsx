import { useState, useEffect } from "react";
import { View, StyleSheet, Pressable, TextInput, ScrollView, ActivityIndicator } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, { FadeInDown } from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { GalaxyBackground } from "@/components/GalaxyBackground";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/context/AuthContext";
import { Spacing, BorderRadius } from "@/constants/theme";
import { getApiUrl } from "@/lib/query-client";

type DreamTypeOption = "personal" | "challenge" | "group";

const dreamTypes: { type: DreamTypeOption; icon: keyof typeof Feather.glyphMap; title: string; color: string }[] = [
  { type: "personal", icon: "user", title: "Personal", color: "#3B82F6" },
  { type: "challenge", icon: "award", title: "Challenge", color: "#EAB308" },
  { type: "group", icon: "users", title: "Group", color: "#8B5CF6" },
];

export default function CreateDreamScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { theme } = useTheme();
  const { token } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedType, setSelectedType] = useState<DreamTypeOption>(route.params?.type || "personal");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (route.params?.type) {
      setSelectedType(route.params.type);
    }
  }, [route.params?.type]);

  const handleCreate = async () => {
    if (!title.trim()) {
      setError("Please enter a title for your dream");
      return;
    }
    if (!token) return;

    setIsLoading(true);
    setError("");
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      const response = await fetch(new URL('/api/dreams', getApiUrl()).toString(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim() || null,
          type: selectedType,
        }),
      });

      if (response.ok) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        navigation.goBack();
      } else {
        const data = await response.json();
        setError(data.error || "Failed to create dream");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
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
      >
        <Animated.View entering={FadeInDown.springify()}>
          <ThemedText type="h2" style={styles.title}>Create Your Dream</ThemedText>
          <ThemedText type="body" style={styles.subtitle}>
            Set a goal and start your journey
          </ThemedText>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(100).springify()}>
          <ThemedText type="small" style={styles.label}>
            DREAM TYPE
          </ThemedText>
          <View style={styles.typeContainer}>
            {dreamTypes.map((dt) => (
              <Pressable
                key={dt.type}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setSelectedType(dt.type);
                }}
                style={[
                  styles.typeButton,
                  { backgroundColor: selectedType === dt.type ? dt.color : "rgba(45, 39, 82, 0.6)" },
                ]}
              >
                <Feather
                  name={dt.icon}
                  size={20}
                  color={selectedType === dt.type ? "#FFFFFF" : "#C4B5FD"}
                />
                <ThemedText
                  type="small"
                  style={{
                    color: selectedType === dt.type ? "#FFFFFF" : "#C4B5FD",
                    fontWeight: selectedType === dt.type ? "600" : "400",
                  }}
                >
                  {dt.title}
                </ThemedText>
              </Pressable>
            ))}
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).springify()}>
          <ThemedText type="small" style={styles.label}>
            DREAM TITLE
          </ThemedText>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="e.g., Learn to play guitar"
            placeholderTextColor="#8B7FC7"
            testID="input-dream-title"
          />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300).springify()}>
          <ThemedText type="small" style={styles.label}>
            DESCRIPTION (OPTIONAL)
          </ThemedText>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Describe your dream in detail..."
            placeholderTextColor="#8B7FC7"
            multiline
            numberOfLines={4}
            testID="input-dream-description"
          />
        </Animated.View>

        {error ? (
          <ThemedText type="small" style={styles.errorText}>{error}</ThemedText>
        ) : null}

        <Animated.View entering={FadeInDown.delay(400).springify()}>
          <Button
            onPress={handleCreate}
            disabled={isLoading}
            style={styles.createButton}
            testID="button-submit-dream"
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <View style={styles.buttonContent}>
                <Feather name="star" size={20} color="#FFFFFF" />
                <ThemedText style={styles.buttonText}>Start My Dream</ThemedText>
              </View>
            )}
          </Button>
        </Animated.View>
      </ScrollView>
    </GalaxyBackground>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.xl,
    gap: Spacing.xl,
  },
  title: {
    textAlign: "center",
    marginBottom: Spacing.xs,
    color: "#FFFFFF",
  },
  subtitle: {
    textAlign: "center",
    color: "#C4B5FD",
  },
  label: {
    fontWeight: "600",
    letterSpacing: 0.5,
    marginBottom: Spacing.sm,
    color: "#C4B5FD",
  },
  typeContainer: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  typeButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.xs,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.sm,
  },
  input: {
    borderRadius: BorderRadius.sm,
    padding: Spacing.lg,
    fontSize: 16,
    backgroundColor: "rgba(45, 39, 82, 0.6)",
    color: "#FFFFFF",
    borderWidth: 1,
    borderColor: "rgba(139, 127, 199, 0.3)",
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  errorText: {
    color: "#EF4444",
    textAlign: "center",
  },
  createButton: {
    marginTop: Spacing.md,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 16,
  },
});
