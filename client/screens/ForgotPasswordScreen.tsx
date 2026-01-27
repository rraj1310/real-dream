import { useState } from "react";
import { View, StyleSheet, Pressable, ActivityIndicator } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, { FadeInDown } from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/context/AuthContext";
import { Spacing, BorderRadius } from "@/constants/theme";
import { RootStackParamList } from "@/navigation/RootStackNavigator";

type ForgotPasswordScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "ForgotPassword">;
};

export default function ForgotPasswordScreen({ navigation }: ForgotPasswordScreenProps) {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { forgotPassword, resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState<"email" | "reset">("email");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSendReset = async () => {
    if (!email) {
      setError("Please enter your email address");
      return;
    }

    setIsLoading(true);
    setError("");
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const result = await forgotPassword(email.trim().toLowerCase());
    setIsLoading(false);

    if (result.success) {
      setSuccess("Reset instructions sent to your email");
      if (result.resetToken) {
        setResetToken(result.resetToken);
        setStep("reset");
      }
    } else {
      setError(result.error || "Failed to send reset email");
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      setError("Please enter your new password");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);
    setError("");
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const result = await resetPassword(resetToken, newPassword);
    setIsLoading(false);

    if (result.success) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setSuccess("Password reset successfully!");
      setTimeout(() => {
        navigation.goBack();
      }, 2000);
    } else {
      setError(result.error || "Failed to reset password");
    }
  };

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top + Spacing.xl }]}>
      <Pressable
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <Feather name="arrow-left" size={24} color={theme.text} />
      </Pressable>

      <Animated.View entering={FadeInDown.springify()} style={styles.content}>
        <View style={[styles.iconContainer, { backgroundColor: theme.link + "20" }]}>
          <Feather name="lock" size={48} color={theme.link} />
        </View>

        <ThemedText type="h2" style={styles.title}>
          {step === "email" ? "Forgot Password?" : "Reset Password"}
        </ThemedText>
        <ThemedText type="body" style={[styles.subtitle, { color: theme.textSecondary }]}>
          {step === "email"
            ? "Enter your email to receive reset instructions"
            : "Enter your new password"}
        </ThemedText>

        {step === "email" ? (
          <View style={styles.form}>
            <Input
              label="Email Address"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              testID="input-forgot-email"
            />

            {error ? (
              <ThemedText type="small" style={styles.errorText}>
                {error}
              </ThemedText>
            ) : null}

            {success ? (
              <ThemedText type="small" style={[styles.successText, { color: theme.success }]}>
                {success}
              </ThemedText>
            ) : null}

            <Button onPress={handleSendReset} disabled={isLoading} testID="button-send-reset">
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                "Send Reset Link"
              )}
            </Button>
          </View>
        ) : (
          <View style={styles.form}>
            <Input
              label="New Password"
              placeholder="Enter new password"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
              testID="input-new-password"
            />

            <Input
              label="Confirm Password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              testID="input-confirm-password"
            />

            {error ? (
              <ThemedText type="small" style={styles.errorText}>
                {error}
              </ThemedText>
            ) : null}

            {success ? (
              <ThemedText type="small" style={[styles.successText, { color: theme.success }]}>
                {success}
              </ThemedText>
            ) : null}

            <Button onPress={handleResetPassword} disabled={isLoading} testID="button-reset-password">
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                "Reset Password"
              )}
            </Button>
          </View>
        )}

        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.backToLogin}
        >
          <Feather name="arrow-left" size={16} color={theme.link} />
          <ThemedText type="small" style={{ color: theme.link, marginLeft: Spacing.xs }}>
            Back to Sign In
          </ThemedText>
        </Pressable>
      </Animated.View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
  },
  backButton: {
    marginBottom: Spacing.xl,
  },
  content: {
    flex: 1,
    alignItems: "center",
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.xl,
  },
  title: {
    textAlign: "center",
    marginBottom: Spacing.sm,
  },
  subtitle: {
    textAlign: "center",
    marginBottom: Spacing["2xl"],
  },
  form: {
    width: "100%",
    gap: Spacing.lg,
  },
  errorText: {
    color: "#EF4444",
    textAlign: "center",
  },
  successText: {
    textAlign: "center",
  },
  backToLogin: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: Spacing["2xl"],
  },
});
