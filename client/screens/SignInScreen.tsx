import { useState } from "react";
import { View, StyleSheet, Pressable, Image, ActivityIndicator } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/context/AuthContext";
import { Spacing, BorderRadius, Colors } from "@/constants/theme";
import { RootStackParamList } from "@/navigation/RootStackNavigator";

type SignInScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "SignIn">;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function SignInScreen({ navigation }: SignInScreenProps) {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const logoScale = useSharedValue(1);

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
  }));

  const handleSignIn = async () => {
    if (!email || !password) {
      setError("Please enter your email and password");
      return;
    }
    
    setIsLoading(true);
    setError("");
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    const result = await login(email.trim().toLowerCase(), password);
    setIsLoading(false);
    
    if (result.success) {
      navigation.replace("MainTabs");
    } else {
      setError(result.error || "Login failed");
    }
  };

  const handleLogoPress = () => {
    logoScale.value = withSpring(0.95, { damping: 15 });
    setTimeout(() => {
      logoScale.value = withSpring(1, { damping: 15 });
    }, 100);
  };

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top + Spacing["3xl"],
          paddingBottom: insets.bottom + Spacing.xl,
          backgroundColor: Colors.light.blue,
        },
      ]}
    >
      <View style={styles.gradientOverlay} />

      <View style={styles.content}>
        <AnimatedPressable
          onPress={handleLogoPress}
          style={[styles.logoContainer, logoAnimatedStyle]}
        >
          <Image
            source={require("../../assets/images/icon.png")}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </AnimatedPressable>

        <ThemedText
          type="h1"
          style={[styles.title, { color: "#FFFFFF" }]}
        >
          Real Dream
        </ThemedText>
        <ThemedText
          type="body"
          style={[styles.subtitle, { color: "rgba(255,255,255,0.8)" }]}
        >
          Sign in to your account
        </ThemedText>

        <View
          style={[
            styles.formContainer,
            { backgroundColor: theme.backgroundDefault },
          ]}
        >
          <Input
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            testID="input-email"
          />

          <View style={styles.passwordContainer}>
            <Input
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              testID="input-password"
            />
            <Pressable
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeButton}
              testID="button-toggle-password"
            >
              <Feather
                name={showPassword ? "eye-off" : "eye"}
                size={20}
                color={theme.textMuted}
              />
            </Pressable>
          </View>

          <Pressable style={styles.forgotButton}>
            <ThemedText type="small" style={{ color: theme.link }}>
              Forgot Password?
            </ThemedText>
          </Pressable>

          {error ? (
            <ThemedText type="small" style={styles.errorText}>
              {error}
            </ThemedText>
          ) : null}

          <Button onPress={handleSignIn} disabled={isLoading} testID="button-signin">
            {isLoading ? <ActivityIndicator color="#FFFFFF" size="small" /> : "Sign In"}
          </Button>

          <View style={styles.signUpContainer}>
            <ThemedText type="small" style={{ color: theme.textSecondary }}>
              Don't have an account?{" "}
            </ThemedText>
            <Pressable onPress={() => navigation.navigate("SignUp")}>
              <ThemedText
                type="small"
                style={{ color: theme.link, fontWeight: "600" }}
              >
                Sign Up
              </ThemedText>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "transparent",
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    alignItems: "center",
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: BorderRadius.xl,
    overflow: "hidden",
    marginBottom: Spacing.lg,
  },
  logoImage: {
    width: "100%",
    height: "100%",
  },
  title: {
    marginBottom: Spacing.xs,
  },
  subtitle: {
    marginBottom: Spacing["3xl"],
  },
  formContainer: {
    width: "100%",
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    gap: Spacing.lg,
  },
  passwordContainer: {
    position: "relative",
  },
  eyeButton: {
    position: "absolute",
    right: Spacing.lg,
    top: 38,
    padding: Spacing.xs,
  },
  forgotButton: {
    alignSelf: "flex-start",
  },
  signUpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: Spacing.sm,
  },
  errorText: {
    color: "#EF4444",
    textAlign: "center",
  },
});
